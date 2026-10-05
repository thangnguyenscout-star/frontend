export type RecruitmentStatus = '1' | '2' | '3' | '4' | '5' | '6';
export interface RecruitmentInput {
  ngayTiepNhan: string | null;
  ho: string;
  tenDem: string;
  ten: string;
  gioiTinh: string;
  soCCCD: string;
  ngayCap: string | null;
  noiCap: string;
  soDienThoai: string;
  email: string;
  tongThuNhapThoaThuan: number | null;
  luongCoBan: number | null;
  luongThuViec: number | null;
  maBoPhanDuKien: string;
  maChucVuDuKien: string;
  ngayBatDauLamViec: string | null;
}
export interface RecruitmentRecord extends RecruitmentInput {
  id: string;
  maNhanVien?: string | null;
  ngaySinh?: string | null;
  ghiChu?: string | null;
  hoTen: string;
  tenBoPhanDuKien: string;
  tenChucVuDuKien: string;
  tiepNhan: boolean;
  trangThai: RecruitmentStatus;
  hodApprovedDate?: string | null;
  hodApprovedBy?: string | null;
  hrApprovedDate?: string | null;
  hrApprovedBy?: string | null;
  ownerSignedDate?: string | null;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string | null;
  updatedBy?: string | null;
}
export interface RecruitmentCatalogs {
  departments: { value: string; label: string }[];
  positions: { value: string; label: string }[];
}
export interface RecruitmentValidation {
  [key: string]: string;
}

// Verified from https://localhost:7070/graphql introspection.
// Long maps to JSON number; service rejects IDs outside the JS safe integer range.
export type RecruitmentApiStatus =
  | 'TUYEN_DUNG'
  | 'TIEP_NHAN'
  | 'KHONG_TUYEN'
  | 'KHONG_NHAN_VIEC'
  | 'DA_NHAN_VIEC'
  | 'DA_TAO_HO_SO_NHAN_VIEN';
export interface RecruitmentDto {
  id: number;
  maNhanVien: string | null;
  ngayTiepNhanHoSo: string | null;
  ho: string;
  tenDem: string;
  ten: string;
  hoTen: string;
  gioiTinh: string;
  ngaySinh: string;
  soCCCD: string | null;
  ngayCap: string | null;
  noiCap: string | null;
  soDienThoai: string | null;
  email: string | null;
  tongThuNhapThoaThuan: number;
  luongCoBan: number;
  luongThuViec: number;
  tiepNhan: boolean;
  maBoPhanDuKien: string;
  tenBoPhan: string | null;
  maChucVuDuKien: string;
  tenChucVu: string | null;
  ngayBatDauLamViec: string | null;
  trangThai: string;
  ghiChu: string | null;
  hodApprovedDate: string | null;
  hodApprovedBy: string | null;
  hrApprovedDate: string | null;
  hrApprovedBy: string | null;
  ownerSignedDate: string | null;
}
export interface RecruitmentCreateInput {
  ngayTiepNhan?: string | null;
  ho: string;
  tenDem: string;
  ten: string;
  gioiTinh: string;
  soCCCD?: string | null;
  ngayCap?: string | null;
  noiCap?: string | null;
  soDienThoai?: string | null;
  email?: string | null;
  tongThuNhapThoaThuan: number;
  luongCoBan: number;
  luongThuViec: number;
  maBoPhanDuKien: string;
  maChucVuDuKien: string;
  ngayBatDauLamViec?: string | null;
}
export interface RecruitmentUpdateInput {
  id: number;
  ngayTiepNhan?: string | null;
  ho: string;
  tenDem: string;
  ten: string;
  gioiTinh: string;
  soCCCD?: string | null;
  ngayCap?: string | null;
  noiCap?: string | null;
  soDienThoai?: string | null;
  email?: string | null;
  tongThuNhapThoaThuan: number;
  luongCoBan: number;
  luongThuViec: number;
  maBoPhanDuKien: string;
  maChucVuDuKien: string;
  ngayBatDauLamViec?: string | null;
}
export interface RecruitmentStatusInput {
  id: number;
  trangThai: RecruitmentApiStatus;
}

export interface RecruitmentEmployeeSource {
  tuyenDungId: number;
  maNhanVien: string | null;
  ho: string;
  tenDem: string;
  ten: string;
  hoTen: string;
  gioiTinh: string;
  soDienThoai: string | null;
  email: string | null;
  soCCCD: string | null;
  ngaySinh: string | null;
  ngayCap: string | null;
  noiCap: string | null;
  maBoPhan: string;
  tenBoPhan: string | null;
  maChucVu: string;
  tenChucVu: string | null;
  ngayTiepNhan: string | null;
  ngayBatDauLamViec: string | null;
  trangThai: string;
}
