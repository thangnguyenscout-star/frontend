export type PeriodStatus = 'O' | 'R' | 'C' | 'L';
export interface AttendancePeriod {
  id: string | number;
  maKy: string;
  nam: number;
  thang: number;
  tuNgay: string;
  denNgay: string;
  trangThai: PeriodStatus;
  ghiChu: string | null;
  ngayChot: string | null;
  nguoiChot: string | null;
  ngayKhoa: string | null;
  nguoiKhoa: string | null;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
}
export interface PeriodInput {
  nam: number;
  thang: number;
  tuNgay: string;
  denNgay: string;
  ghiChu: string | null;
}
export interface PeriodFilter {
  nam: number | null;
  thang: number | null;
  trangThai: string | null;
}
export const periodStatuses = { O: 'Đang mở', R: 'Đang đối soát', C: 'Đã chốt', L: 'Đã khóa' };
