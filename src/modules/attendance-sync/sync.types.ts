export interface RawAttendanceLog {
  id: number;
  thoiGianQuet: string;
  maThietBi: number | null;
  maNguoiDungMay: string | null;
  maNhanVien: string | null;
  nguon: string;
  loaiSuKien: string;
  maSuKienNguon: string | null;
  maYeuCauBoSung: string | null;
  lyDo: string | null;
  createdBy: string | null;
  createdAt: string;
  dotDongBoId: number | null;
}
export interface MockBatch {
  id: number;
  maThietBi: number | null;
  phuongThuc: 'DEVICE' | 'EXCEL' | 'DAT' | 'CSV';
  batDau: string;
  ketThuc: string | null;
  tongBanGhi: number;
  soMoi: number;
  soTrung: number;
  soLoi: number;
  trangThai: 'RUNNING' | 'SUCCESS' | 'PARTIAL' | 'FAILED';
  nguoiThucHien: string;
  tenFile?: string;
}
export type SyncErrorCode =
  'INVALID_DATE' | 'MISSING_USER' | 'UNMAPPED_USER' | 'DUPLICATE' | 'INVALID_FORMAT' | 'OTHER';
export interface MockSyncError {
  id: number;
  dotDongBoId: number;
  soDong: number | null;
  maNguoiDungMay: string | null;
  duLieuGoc: string;
  maLoi: SyncErrorCode;
  noiDung: string;
  trangThai: 'NEW' | 'RESOLVED' | 'IGNORED';
}
export type PreviewStatus = 'valid' | 'duplicate' | 'error' | 'unmapped';
export interface PreviewRow {
  line: number;
  machineNo: string;
  user: string;
  time: string;
  rawStatus: string;
  raw: string;
  status: PreviewStatus;
  message: string;
  errorCode?: SyncErrorCode;
  eventType: string;
}
export interface SyncFilters {
  from: string;
  to: string;
  device: number | null;
  search: string;
  source: string;
  event: string;
  mapping: string;
  batch: number | null;
}


export interface AttendanceFrontendRow {
  line: number;
  machineNo: number;
  user: string | null;
  time: string | null;
  eventType: unknown;
  rawStatus: unknown;
  raw: unknown;
  status: 'VALID' | 'DUPLICATE' | 'INVALID' | null;
  message: string | null;
}

export interface AttendanceRowsRequest {
  rows: AttendanceFrontendRow[];
}

