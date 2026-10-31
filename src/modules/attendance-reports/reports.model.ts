export type ReportKey = 'monthly' | 'late' | 'overtime' | 'anomaly' | 'payroll';
export interface ReportColumn {
  key: string;
  label: string;
  group: string;
  width: number;
  numeric?: boolean;
  total?: boolean;
  weekend?: boolean;
}
export interface ReportRow {
  id: string;
  code: string;
  name: string;
  department: string;
  [key: string]: string | number;
}
export const reportTabs: { key: ReportKey; title: string; subtitle: string; icon: string }[] = [
  { key: 'monthly', title: 'Chi tiết tháng', subtitle: 'Monthly timesheet', icon: 'pi-table' },
  { key: 'late', title: 'Đi muộn / Về sớm', subtitle: 'Late in · Early out', icon: 'pi-clock' },
  { key: 'overtime', title: 'Tăng ca / Làm thêm', subtitle: 'Overtime · OT', icon: 'pi-moon' },
  {
    key: 'anomaly',
    title: 'Bất thường quẹt thẻ',
    subtitle: 'Attendance anomaly',
    icon: 'pi-exclamation-triangle',
  },
  {
    key: 'payroll',
    title: 'Tổng hợp công & Phép',
    subtitle: 'Payroll attendance',
    icon: 'pi-calculator',
  },
];
export const reportDepartments = [
  'Khoa Khám bệnh',
  'Khoa Cấp cứu',
  'Khoa Nội',
  'Khoa Ngoại',
  'Phòng Điều dưỡng',
  'Phòng Hành chính',
];
const names = [
  'Nguyễn Minh Anh',
  'Trần Hoàng Nam',
  'Lê Thu Hà',
  'Phạm Quang Huy',
  'Võ Ngọc Linh',
  'Đặng Đức Anh',
  'Bùi Thanh Mai',
  'Đỗ Hải Đăng',
  'Hồ Phương Thảo',
  'Ngô Tuấn Kiệt',
  'Dương Bảo Ngọc',
  'Lý Minh Quân',
  'Nguyễn Thảo Vy',
  'Trần Quốc Bảo',
  'Lê Khánh Chi',
  'Phạm Anh Dũng',
  'Vũ Hoài An',
  'Đinh Nhật Minh',
  'Hoàng Kim Ngân',
  'Đào Gia Hưng',
  'Mai Ngọc Ánh',
  'Phan Trung Hiếu',
  'Tạ Hồng Nhung',
  'Cao Bảo Long',
];
export const reportEmployees = names.map((name, seed) => ({
  code: 'NV' + String(seed + 1).padStart(4, '0'),
  name,
  department: reportDepartments[Math.floor(seed / 4)],
  seed,
}));
export interface AttendanceRecord {
  code: string;
  day: number;
  date: string;
  weekend: boolean;
  symbol: string;
  shift: string;
  scheduledIn: string;
  scheduledOut: string;
  checkIn: string;
  checkOut: string;
  late: number;
  early: number;
  ot: number;
  nightOt: number;
  approved: boolean;
  anomaly: string;
}
export function monthDays(period: string) {
  const [year, month] = period.split('-').map(Number);
  if (!Number.isInteger(year) || year < 2000 || year > 2100 || !month || month > 12) return [];
  return Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => {
    const day = i + 1;
    const weekday = new Date(year, month - 1, day).getDay();
    return {
      day,
      weekend: weekday === 0 || weekday === 6,
      weekday: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][weekday],
    };
  });
}
const time = (minutes: number) =>
  String(Math.floor(minutes / 60) % 24).padStart(2, '0') +
  ':' +
  String(minutes % 60).padStart(2, '0');
export function makeRecords(period: string): AttendanceRecord[] {
  return reportEmployees.flatMap((employee) =>
    monthDays(period).map(({ day, weekend }) => {
      const n = (employee.seed * 13 + day * 7) % 97;
      const off = weekend && (employee.seed + day) % 4 !== 0;
      const leave = !off && n % 23 === 0;
      const absent = !off && !leave && n === 51;
      const anomaly =
        off || leave || absent
          ? ''
          : n % 19 === 0
            ? 'Thiếu giờ vào'
            : n % 17 === 0
              ? 'Thiếu giờ ra'
              : n === 43
                ? 'Quẹt thẻ trùng'
                : '';
      const worked = !off && !leave && !absent;
      const late = worked && !anomaly && n % 9 === 0 ? 5 + (n % 26) : 0;
      const early = worked && !anomaly && n % 11 === 0 ? 10 + (n % 21) : 0;
      const ot = worked && !anomaly && !early && n % 4 === 0 ? 1 + (n % 5) * 0.5 : 0;
      const night = employee.seed % 5 === 0;
      const start = night ? 19 * 60 : 7 * 60 + 30;
      const end = night ? 7 * 60 : 16 * 60 + 30;
      return {
        code: employee.code,
        day,
        date: `${period}-${String(day).padStart(2, '0')}`,
        weekend,
        symbol: off
          ? 'OFF'
          : leave
            ? 'P'
            : absent
              ? 'V'
              : anomaly
                ? '?'
                : late
                  ? 'M'
                  : early
                    ? 'S'
                    : 'X',
        shift: night ? 'Đêm' : 'Hành chính',
        scheduledIn: time(start),
        scheduledOut: time(end),
        checkIn: !worked || anomaly === 'Thiếu giờ vào' ? '—' : time(start + late),
        checkOut: !worked || anomaly === 'Thiếu giờ ra' ? '—' : time(end - early + ot * 60),
        late,
        early,
        ot,
        nightOt: night ? ot : 0,
        approved: n % 3 !== 0,
        anomaly,
      };
    }),
  );
}
const col = (
  key: string,
  label: string,
  group: string,
  width = 110,
  total = false,
): ReportColumn => ({ key, label, group, width, numeric: total, total });
const baseColumns = () => [
  col('code', 'Mã nhân viên', 'Nhân sự', 108),
  col('name', 'Họ và tên', 'Nhân sự', 190),
  col('department', 'Bộ phận', 'Đơn vị', 175),
];
const sum = (rows: AttendanceRecord[], key: 'late' | 'early' | 'ot' | 'nightOt') =>
  rows.reduce((value, row) => value + row[key], 0);
export function buildReport(key: ReportKey, period: string) {
  const records = makeRecords(period);
  const employees = reportEmployees.map((employee) => {
    const days = records.filter((row) => row.code === employee.code);
    const work = days.filter((row) => ['X', 'M', 'S'].includes(row.symbol)).length;
    const leave = days.filter((row) => row.symbol === 'P').length;
    return { ...employee, days, work, leave };
  });
  let columns = baseColumns();
  let rows: ReportRow[] = [];
  if (key === 'monthly') {
    columns = [
      ...columns,
      ...monthDays(period).map((day) => ({
        ...col(
          'd' + day.day,
          String(day.day).padStart(2, '0') + ' · ' + day.weekday,
          'Ngày trong tháng',
          62,
        ),
        weekend: day.weekend,
      })),
      col('work', 'Công thực tế', 'Tổng hợp', 110, true),
      col('leave', 'Phép năm', 'Tổng hợp', 100, true),
      col('ot', 'OT (giờ)', 'Tổng hợp', 100, true),
      col('issues', 'Bất thường', 'Tổng hợp', 110, true),
    ];
    rows = employees.map((e) => ({
      id: e.code,
      code: e.code,
      name: e.name,
      department: e.department,
      ...Object.fromEntries(e.days.map((d) => ['d' + d.day, d.symbol])),
      work: e.work,
      leave: e.leave,
      ot: sum(e.days, 'ot'),
      issues: e.days.filter((d) => d.anomaly).length,
    }));
  } else if (key === 'late' || key === 'anomaly') {
    columns = [
      ...columns,
      col('date', 'Ngày', 'Lịch làm việc', 112),
      col('shift', 'Ca làm việc', 'Lịch làm việc', 120),
      col('scheduledIn', 'Vào theo ca', 'Theo ca', 100),
      col('scheduledOut', 'Ra theo ca', 'Theo ca', 100),
      col('checkIn', 'Giờ vào', 'Thực tế', 100),
      col('checkOut', 'Giờ ra', 'Thực tế', 100),
    ];
    columns.push(
      ...(key === 'late'
        ? [
            col('late', 'Muộn (phút)', 'Chênh lệch', 115, true),
            col('early', 'Sớm (phút)', 'Chênh lệch', 115, true),
            col('status', 'Loại vi phạm', 'Đánh giá', 155),
          ]
        : [
            col('anomaly', 'Bất thường', 'Đánh giá', 170),
            col('level', 'Mức độ', 'Đánh giá', 120),
            col('status', 'Xử lý', 'Đánh giá', 150),
          ]),
    );
    rows = records
      .filter((d) => (key === 'late' ? d.late > 0 || d.early > 0 : !!d.anomaly))
      .map((d) => {
        const employee = reportEmployees.find((e) => e.code === d.code)!;
        return {
          id: d.code + d.date,
          code: d.code,
          name: employee.name,
          department: employee.department,
          date: d.date.split('-').reverse().join('/'),
          shift: d.shift,
          scheduledIn: d.scheduledIn,
          scheduledOut: d.scheduledOut,
          checkIn: d.checkIn,
          checkOut: d.checkOut,
          late: d.late,
          early: d.early,
          anomaly: d.anomaly,
          status:
            key === 'late'
              ? d.late && d.early
                ? 'Muộn & về sớm'
                : d.late
                  ? 'Đi muộn'
                  : 'Về sớm'
              : d.day % 3 === 0
                ? 'Đã giải trình'
                : 'Chờ xử lý',
          level: d.anomaly === 'Quẹt thẻ trùng' ? 'Cần kiểm tra' : 'Ưu tiên cao',
        };
      });
  } else if (key === 'overtime') {
    columns = [
      ...columns,
      col('weekdayOt', 'Ngày thường', 'Giờ tăng ca', 120, true),
      col('weekendOt', 'Ngày nghỉ', 'Giờ tăng ca', 120, true),
      col('nightOt', 'Trong đó: đêm', 'Giờ tăng ca', 130, true),
      col('ot', 'Tổng OT', 'Giờ tăng ca', 110, true),
      col('approvedOt', 'Đã duyệt', 'Phê duyệt (giờ)', 120, true),
      col('pendingOt', 'Chờ duyệt', 'Phê duyệt (giờ)', 120, true),
      col('status', 'Trạng thái', 'Phê duyệt (giờ)', 145),
    ];
    rows = employees
      .filter((e) => sum(e.days, 'ot') > 0)
      .map((e) => {
        const approvedOt = sum(
          e.days.filter((d) => d.approved),
          'ot',
        );
        const ot = sum(e.days, 'ot');
        return {
          id: e.code,
          code: e.code,
          name: e.name,
          department: e.department,
          weekdayOt: sum(
            e.days.filter((d) => !d.weekend),
            'ot',
          ),
          weekendOt: sum(
            e.days.filter((d) => d.weekend),
            'ot',
          ),
          nightOt: sum(e.days, 'nightOt'),
          ot,
          approvedOt,
          pendingOt: ot - approvedOt,
          status: ot === approvedOt ? 'Đã duyệt' : 'Chờ duyệt',
        };
      });
  } else {
    columns = [
      ...columns,
      col('scheduled', 'Ngày theo lịch', 'Công trong tháng', 125, true),
      col('work', 'Công thực tế', 'Công trong tháng', 120, true),
      col('leave', 'Nghỉ phép', 'Công trong tháng', 105, true),
      col('unpaid', 'Vắng không lương', 'Công trong tháng', 145, true),
      col('unverified', 'Chưa xác minh', 'Công trong tháng', 130, true),
      col('paid', 'Công hưởng lương', 'Công trong tháng', 150, true),
      col('openingLeave', 'Đầu kỳ', 'Phép năm (ngày)', 95, true),
      col('accruedLeave', 'Phát sinh', 'Phép năm (ngày)', 100, true),
      col('usedLeave', 'Đã dùng', 'Phép năm (ngày)', 95, true),
      col('closingLeave', 'Còn lại', 'Phép năm (ngày)', 95, true),
      col('ot', 'OT (giờ)', 'Làm thêm', 100, true),
      col('status', 'Đối soát', 'Đối soát', 155),
    ];
    rows = employees.map((e) => {
      const unverified = e.days.filter((d) => d.anomaly).length;
      const openingLeave = 4 + (e.seed % 5);
      return {
        id: e.code,
        code: e.code,
        name: e.name,
        department: e.department,
        scheduled: e.days.filter((d) => d.symbol !== 'OFF').length,
        work: e.work,
        leave: e.leave,
        unpaid: e.days.filter((d) => d.symbol === 'V').length,
        unverified,
        paid: e.work + e.leave,
        openingLeave,
        accruedLeave: 1,
        usedLeave: e.leave,
        closingLeave: openingLeave + 1 - e.leave,
        ot: sum(e.days, 'ot'),
        status: unverified ? 'Cần đối soát' : 'Đã đối soát',
      };
    });
  }
  return { columns, rows, records };
}
export function excelColumn(index: number): string {
  let result = '';
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26))
    result = String.fromCharCode(65 + ((n - 1) % 26)) + result;
  return result;
}
export const numberLabel = (value: number) =>
  new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(value);
export function cellTone(value: string | number, key: string) {
  if (key.startsWith('d') && /^d\d+$/.test(key))
    return (
      (
        {
          X: 'work',
          P: 'leave',
          OFF: 'off',
          M: 'warn',
          S: 'warn',
          V: 'danger',
          '?': 'danger',
        } as Record<string, string>
      )[String(value)] || ''
    );
  if (['late', 'early', 'pendingOt', 'unverified', 'issues'].includes(key) && Number(value) > 0)
    return 'warn';
  if (['ot', 'paid', 'closingLeave'].includes(key)) return 'emphasis';
  return '';
}
