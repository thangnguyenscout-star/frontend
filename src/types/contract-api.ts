export interface AllowanceCatalogItem {
  maPhuCap: string;
  tenPhuCap: string;
  loaiTinh: number;
  donViThoiGian: number;
}
export interface ContractAllowanceInput {
  maPhuCap: string;
  soTien: number;
  tyLe?: number;
  mucTinh?: number;
  ghiChu?: string;
}
export interface ContractAllowanceDto extends ContractAllowanceInput {
  maHopDong?: string;
  tenPhuCap?: string;
  isActive?: boolean;
}
export interface CreateContractInput {
  maNhanVien: string;
  soHopDongLaoDong: string;
  maLoaiHopDong: string;
  maChucVu?: string;
  ngayKyHopDong: string;
  ngayBatDau: string;
  ngayKetThuc?: string;
  luongCoBan: number;
  mucDongBHXH?: number;
  luongPhuCap?: number;
  tongThuNhap: number;
  luongThuViec: number;
  trangThaiHopDong: string;
  ghiChu?: string;
  phuCaps?: ContractAllowanceInput[];
}
export interface ContractDto extends CreateContractInput {
  id: string;
  tenNhanVien?: string;
  tenLoaiHopDong?: string;
  tenChucVu?: string;
  tenTrangThaiHopDong?: string;
  ngayDuyetHopDong?: string;
  nguoiKyDuyet?: string;
  phuCaps?: ContractAllowanceDto[];
}
export interface ContractListInput {
  keyword?: string;
  maNhanVien?: string;
  maLoaiHopDong?: string;
  maChucVu?: string;
  trangThaiHopDong?: string;
  tuNgay?: string;
  denNgay?: string;
  pageIndex: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: string;
}
export interface PageResult<T> {
  pageIndex: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  items: T[];
}
export interface ExpiringContract {
  id: string;
  maNhanVien: string;
  tenNhanVien?: string;
  soHopDongLaoDong: string;
  maLoaiHopDong: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  soNgayConLai: number;
  trangThaiHopDong: string;
}
export interface ContractMutationResult<T> {
  success: boolean;
  message: string;
  data?: T | null;
}
