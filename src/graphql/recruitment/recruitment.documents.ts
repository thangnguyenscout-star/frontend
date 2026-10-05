import { gql } from '@apollo/client/core';
const fields = `
  id maNhanVien ngayTiepNhanHoSo ho tenDem ten hoTen gioiTinh ngaySinh
  soCCCD ngayCap noiCap
  soDienThoai email tongThuNhapThoaThuan luongCoBan luongThuViec tiepNhan
  maBoPhanDuKien tenBoPhan maChucVuDuKien tenChucVu ngayBatDauLamViec
  trangThai ghiChu hodApprovedDate hodApprovedBy hrApprovedDate hrApprovedBy ownerSignedDate
`;
export const RECRUITMENT_LIST = gql`
  query DanhSachTuyenDung($keyword: String) {
    danhSachTuyenDung(keyword: $keyword) { isResults message data { ${fields} } }
  }
`;
// Verified against local GraphQL introspection.
export const RECRUITMENT_DETAIL = gql`
  query ThongTinTuyenDung($id: Long!) {
    thongTinTuyenDung(id: $id) { isResults message data { ${fields} } }
  }
`;
export const RECRUITMENT_DEPARTMENTS = gql`
  query DanhSachBoPhan {
    danhSachBoPhan {
      isResults
      message
      data {
        maBoPhan
        tenBoPhan
      }
    }
  }
`;
export const RECRUITMENT_POSITIONS = gql`
  query DanhSachChucVu {
    danhSachChucVu {
      isResults
      message
      data {
        maChucVu
        tenChucVu
      }
    }
  }
`;
export const CREATE_RECRUITMENT = gql`
  mutation CreateTuyenDung($input: TuyenDungCreateInput!) {
    createTuyenDung(input: $input) {
      isResults
      message
      data
    }
  }
`;
export const UPDATE_RECRUITMENT = gql`
  mutation UpdateTuyenDung($input: TuyenDungUpdateInput!) {
    updateTuyenDung(input: $input) {
      isResults
      message
      data
    }
  }
`;
export const CONFIRM_NHAN_VIEC = gql`
  mutation ConfirmNhanViec($input: ConfirmNhanViecInput!) {
    confirmNhanViec(input: $input) {
      isResults
      message
      data
    }
  }
`;
export const UPDATE_RECRUITMENT_STATUS = gql`
  mutation UpdateTuyenDungStatus($input: UpdateTuyenDungStatusInput!) {
    updateTuyenDungStatus(input: $input) {
      isResults
      message
      data
    }
  }
`;

export const RECRUITMENT_FOR_EMPLOYEE = gql`
  query TuyenDungForNhanVien($id: Long!) {
    tuyenDungForNhanVien(id: $id) {
      isResults
      message
      data {
        tuyenDungId maNhanVien ho tenDem ten hoTen gioiTinh soDienThoai email ngaySinh
        soCCCD ngayCap noiCap maBoPhan tenBoPhan maChucVu tenChucVu
        ngayTiepNhan ngayBatDauLamViec trangThai
      }
    }
  }
`;
export const CREATE_EMPLOYEE_FROM_RECRUITMENT = gql`
  mutation TaoNhanVienTuTuyenDung($input: NhanVienTuTuyenDungInput!) {
    taoNhanVienTuTuyenDung(input: $input) {
      isResults
      message
    }
  }
`;
