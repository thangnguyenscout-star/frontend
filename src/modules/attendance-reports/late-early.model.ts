import type { LateEarlyItem } from './late-early.service';
import type { ReportColumn, ReportRow } from './reports.model';
import { scheduleTime } from '@/utils/schedule-time';
import { attendanceStatusHeading, attendanceStatusLabel } from '@/utils/attendance-status';
const column = (
  key: string,
  label: string,
  group: string,
  width = 120,
  total = false,
): ReportColumn => ({ key, label, group, width, numeric: total, total });
export const lateEarlyColumns: ReportColumn[] = [
  column('code', 'Mã nhân viên', 'Nhân sự', 108),
  column('name', 'Họ và tên', 'Nhân sự', 190),
  column('departmentCode', 'Mã bộ phận', 'Đơn vị'),
  column('department', 'Bộ phận', 'Đơn vị', 175),
  column('birthDate', 'Ngày sinh', 'Thông tin cá nhân'),
  column('gender', 'Giới tính', 'Thông tin cá nhân', 90),
  column('period', 'Tháng / Năm', 'Chấm công'),
  column('date', 'Ngày chấm công', 'Chấm công', 140),
  column('shiftCode', 'Mã ca', 'Ca làm việc', 90),
  column('shift', 'Tên ca', 'Ca làm việc', 150),
  column('scheduledIn', 'Giờ bắt đầu', 'Ca làm việc'),
  column('scheduledOut', 'Giờ kết thúc', 'Ca làm việc'),
  column('night', 'Ca đêm', 'Ca làm việc', 90),
  column('checkIn', 'Giờ vào', 'Thực tế'),
  column('checkOut', 'Giờ ra', 'Thực tế'),
  column('late', 'Đi trễ (phút)', 'Chênh lệch', 120, true),
  column('early', 'Về sớm (phút)', 'Chênh lệch', 120, true),
  column('status', 'Tình trạng', 'Đánh giá', 150),
];
export function getLateEarlyColumns(): ReportColumn[] {
  return lateEarlyColumns.map((column) =>
    column.key === 'status' ? { ...column, label: attendanceStatusHeading() } : column,
  );
}
function date(value: string | null) {
  return value
    ? /^\d{4}-\d{2}-\d{2}/.test(value)
      ? value.slice(0, 10).split('-').reverse().join('/')
      : value
    : '—';
}
const clock = (value: string | null) => scheduleTime(value) || value || '—';
export function lateEarlyRows(
  items: LateEarlyItem[],
  pageIndex: number,
  pageSize: number,
): ReportRow[] {
  return items.map((item, index) => ({
    id: `${pageIndex}:${pageSize}:${index}:${item.maNhanVien}:${item.ngayChamCong}:${item.maCa}`,
    code: item.maNhanVien,
    name: item.hoVaTen || item.maNhanVien,
    departmentCode: item.maBoPhan || '—',
    department: item.tenBoPhan || '—',
    birthDate: date(item.ngaySinh),
    gender: item.gioiTinh || '—',
    period: item.thang !== null && item.nam !== null ? `${item.thang}/${item.nam}` : '—',
    date: date(item.ngayChamCong),
    shiftCode: item.maCa || '—',
    shift: item.tenCa || '—',
    scheduledIn: clock(item.gioBatDau),
    scheduledOut: clock(item.gioKetThuc),
    night: item.tinhCaDem === null ? '—' : item.tinhCaDem ? 'Có' : 'Không',
    checkIn: clock(item.gioVao),
    checkOut: clock(item.gioRa),
    late: item.diTre,
    early: item.veSom,
    status: attendanceStatusLabel(item.tinhTrang),
    statusCode: item.tinhTrang || '',
  }));
}
