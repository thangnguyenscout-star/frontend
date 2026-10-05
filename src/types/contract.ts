export type ContractMode = 'INSERT' | 'READ';
export type ContractStatus = '1' | '2' | '3' | '4' | '5';
export type ContractAction = 'review' | 'confirmReview' | 'approve' | 'sign';
export interface ContractOption {
  value: string;
  label: string;
}
export interface ContractCatalogs {
  employees: ContractOption[];
  types: ContractOption[];
  departments: ContractOption[];
  positions: ContractOption[];
  allowances: ContractOption[];
}
export interface ContractAllowance {
  maPhuCap: string;
  soTienPhuCap: number | null;
  donViTinhThoiGian: string | null;
  soTienPhuCapThang: number | null;
  tenPhuCap?: string;
}
export interface ContractInput {
  maNhanVien: string;
  soHopDongLaoDong: string;
  maLoaiHopDong: string;
  maChucVu: string;
  maBoPhan: string;
  ngayKyHopDong: string | null;
  ngayBatDau: string | null;
  ngayKetThuc: string | null;
  luongCoBan: number | null;
  tongThuNhap: number | null;
  tongPhuCap: number | null;
  luongThuViec: number | null;
  mucDongBHXH: number | null;
  ghiChu: string;
  phuCaps: ContractAllowance[];
}
export interface Contract extends ContractInput {
  id: string;
  trangThaiHopDong: ContractStatus;
  hoTen: string;
  tenLoaiHopDong: string;
  tenBoPhan: string;
  tenChucVu: string;
}
export interface ContractValidation {
  master: Record<string, string>;
  details: Record<string, string>[];
}
