import type { DayRow, Employee, Filter } from './monthly.types';
export const statuses: Record<
  string,
  { label: string; bg: string; text: string; border: string; abnormal: boolean }
> = {
  NORMAL: {
    label: 'Đủ ca',
    bg: '#ECFDF5',
    text: '#065F46',
    border: '#A7F3D0',
    abnormal: false,
  },
  LEAVE_VACATION: {
    label: 'Nghỉ lễ',
    bg: '#EFF6FF',
    text: '#1E40AF',
    border: '#BFDBFE',
    abnormal: false,
  },
  LEAVE_NORMAL: {
    label: 'Nghỉ phép',
    bg: '#F5F3FF',
    text: '#5B21B6',
    border: '#DDD6FE',
    abnormal: false,
  },
  WORK_IN_VACATION: {
    label: 'Làm việc trong lễ',
    bg: '#ECFEFF',
    text: '#155E75',
    border: '#A5F3FC',
    abnormal: false,
  },
  HALF_WORK: {
    label: 'Nửa công',
    bg: '#FFFBEB',
    text: '#92400E',
    border: '#FDE68A',
    abnormal: false,
  },
  LEAVE_ABNORMAL: {
    label: 'Nghỉ bất thường',
    bg: '#FFF1F2',
    text: '#9F1239',
    border: '#FECDD3',
    abnormal: true,
  },
  ATTENDANCE_ABNORMAL: {
    label: 'Công bất thường',
    bg: '#FEF2F2',
    text: '#991B1B',
    border: '#FECACA',
    abnormal: true,
  },
  CHECK_YOUR_LOG_WORK: {
    label: 'Cần kiểm tra log công',
    bg: '#FFF7ED',
    text: '#9A3412',
    border: '#FED7AA',
    abnormal: true,
  },
};
export const noData = {
  label: 'Chưa có dữ liệu',
  bg: '#F8FAFC',
  text: '#475569',
  border: '#E2E8F0',
  abnormal: false,
};
export const statusOf = (row?: DayRow) =>
  row ? statuses[row.trangThaiCong || ''] || statuses.ATTENDANCE_ABNORMAL : noData;
export const fullName = (row?: Employee) =>
  row
    ? [row.ho, row.tenDem, row.ten].filter(Boolean).join(' ').trim() || row.hoTen || row.maNhanVien
    : '';
export function dateKey(value: string) {
  const key = value.slice(0, 10);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(key) ||
    !Number.isFinite(Date.parse(key + 'T12:00:00Z')) ||
    new Date(key + 'T12:00:00Z').toISOString().slice(0, 10) !== key
  )
    throw new Error('Ngày chấm công không hợp lệ: ' + value);
  return key;
}
export const displayDate = (value?: string | null) =>
  value ? dateKey(value).split('-').reverse().join('/') : '—';
export function calendarCells(year: number, month: number) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  first.setUTCFullYear(year);
  const offset = (first.getUTCDay() + 6) % 7;
  const last = new Date(first);
  last.setUTCMonth(last.getUTCMonth() + 1);
  last.setUTCDate(0);
  return Array.from({ length: Math.ceil((offset + last.getUTCDate()) / 7) * 7 }, (_, index) => {
    const day = index - offset + 1;
    return day < 1 || day > last.getUTCDate()
      ? null
      : String(year).padStart(4, '0') +
          '-' +
          String(month).padStart(2, '0') +
          '-' +
          String(day).padStart(2, '0');
  });
}
export function indexDays(rows: DayRow[], employeeId?: string) {
  const result = new Map<string, DayRow>();
  for (const row of rows) {
    if (employeeId && row.maNhanVien !== employeeId)
      throw new Error('API trả dữ liệu của nhân viên khác.');
    const key = dateKey(row.ngayChamCong);
    if (result.has(key))
      throw new Error('Có nhiều bản ghi công cùng ngày ' + displayDate(key) + '.');
    result.set(key, row);
  }
  return result;
}
export const numberText = (value: unknown, hours = false) =>
  typeof value === 'number' && Number.isFinite(value)
    ? new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(
        hours ? value / 60 : value,
      )
    : '—';
export interface Column {
  key: string;
  label: string;
  visible: boolean;
  hours?: boolean;
}
export const columns: Column[] = [
  { key: 'soNgayCoCong', label: 'Ngày có công', visible: true },
  {
    key: 'tongSoPhutLamViecThucTe',
    label: 'Giờ làm thực tế',
    visible: true,
    hours: true,
  },
  { key: 'tongCongHopLe', label: 'Công hợp lệ', visible: true },
  { key: 'tongNgayNghiCoLuong', label: 'Nghỉ có lương', visible: true },
  { key: 'tongNgayNghiKhongLuong', label: 'Nghỉ không lương', visible: true },
  { key: 'tongCongHuongLuong', label: 'Công hưởng lương', visible: true },
  { key: 'soNgayCoDuLieuCong', label: 'Ngày có dữ liệu', visible: false },
  { key: 'soNgayDuLog', label: 'Ngày đủ log', visible: false },
  { key: 'soNgayKhongLog', label: 'Ngày không log', visible: false },
  { key: 'soNgayDiTre', label: 'Ngày đi trễ', visible: false },
  { key: 'tongSoPhutDiTre', label: 'Phút đi trễ', visible: false },
  { key: 'soNgayVeSom', label: 'Ngày về sớm', visible: false },
  { key: 'tongSoPhutVeSom', label: 'Phút về sớm', visible: false },
  {
    key: 'tongSoPhutTangCa',
    label: 'Giờ tăng ca',
    visible: false,
    hours: true,
  },
  { key: 'soNgayQuaDem', label: 'Ngày qua đêm', visible: false },
  { key: 'tongNgayNghi', label: 'Tổng ngày nghỉ', visible: false },
];
export const statisticLabels: Record<string, string> = {
  tongDongTinh: 'Tổng dòng tính',
  soDongThemMoi: 'Thêm mới',
  soDongCapNhat: 'Cập nhật',
  soDongThieuLog: 'Thiếu log',
  soDongNgayLe: 'Ngày lễ',
  soDongNghiPhep: 'Nghỉ phép',
  soDongBoQuaKhongCapNhat: 'Bỏ qua / không cập nhật',
  soNhanVienThemMoi: 'Nhân viên thêm mới',
  soNhanVienCapNhat: 'Nhân viên cập nhật',
  soNhanVienBoQuaDaKhoa: 'Bỏ qua do khóa',
  thang: 'Tháng',
  nam: 'Năm',
  kyChamCongId: 'Kỳ công',
};

/** A day is unique per employee, not globally across the whole table. */
export const attendanceCellKey = (employeeId: string, date: string) =>
  JSON.stringify([employeeId, dateKey(date)]);
export function indexAttendance(rows: DayRow[], employeeId?: string | null) {
  const result = new Map<string, DayRow>();
  for (const row of rows) {
    if (employeeId && row.maNhanVien !== employeeId)
      throw new Error('API trả dữ liệu của nhân viên khác.');
    const key = attendanceCellKey(row.maNhanVien, row.ngayChamCong);
    if (result.has(key))
      throw new Error(
        'Có nhiều bản ghi công của nhân viên ' +
          row.maNhanVien +
          ' trong ngày ' +
          displayDate(row.ngayChamCong) +
          '.',
      );
    result.set(key, row);
  }
  return result;
}
export function matrixEmployees(catalog: Employee[], rows: DayRow[], filter: Filter) {
  const result = new Map<string, Employee>();
  for (const row of [...catalog, ...rows]) {
    if (filter.maBoPhan && row.maBoPhan !== filter.maBoPhan) continue;
    if (filter.maNhanVien && row.maNhanVien !== filter.maNhanVien) continue;
    const previous = result.get(row.maNhanVien);
    result.set(row.maNhanVien, {
      ...previous,
      ...row,
      ho: row.ho ?? previous?.ho,
      tenDem: row.tenDem ?? previous?.tenDem,
      ten: row.ten ?? previous?.ten,
      hoTen: row.hoTen ?? previous?.hoTen,
      tenBoPhan: row.tenBoPhan ?? previous?.tenBoPhan,
    });
  }
  return [...result.values()].sort(
    (a, b) =>
      fullName(a).localeCompare(fullName(b), 'vi') || a.maNhanVien.localeCompare(b.maNhanVien),
  );
}
export function cellMenuActions(row: DayRow | undefined, canCalculate: boolean) {
  return row && statusOf(row).abnormal && canCalculate ? (['recalculate'] as const) : [];
}

export const monthDates = (year: number, month: number) =>
  calendarCells(year, month).filter((value): value is string => !!value);

export const dailyTotalColumns = [
  { key: 'ngayNghiPhep', label: 'Nghỉ phép' },
  { key: 'ngayNghiHuongLuong', label: 'Nghỉ hưởng lương' },
  { key: 'nghiLe', label: 'Nghỉ lễ' },
  { key: 'ngayNghiKhongHuongLuong', label: 'Nghỉ không hưởng lương' },
  { key: 'otNgayLe', label: 'OT ngày lễ' },
  { key: 'otNgayThuong', label: 'OT ngày thường' },
] as const satisfies readonly { key: keyof DayRow; label: string }[];
type DailyTotalKey = (typeof dailyTotalColumns)[number]['key'];
export function sumDailyAttendance(rows: DayRow[], filter: Filter) {
  const dates = new Set(monthDates(filter.nam, filter.thang));
  const totals = new Map<string, Record<DailyTotalKey, number>>();
  for (const row of rows) {
    if (!dates.has(dateKey(row.ngayChamCong))) continue;
    let total = totals.get(row.maNhanVien);
    if (!total) {
      total = {
        ngayNghiPhep: 0,
        ngayNghiHuongLuong: 0,
        nghiLe: 0,
        ngayNghiKhongHuongLuong: 0,
        otNgayLe: 0,
        otNgayThuong: 0,
      };
      totals.set(row.maNhanVien, total);
    }
    for (const { key } of dailyTotalColumns) {
      const value = row[key];
      if (typeof value === 'number' && Number.isFinite(value)) total[key] += value;
    }
  }
  return totals;
}
