import { gql } from '@apollo/client/core';

export const ALLOWANCE_CATALOG = gql`
  query DanhSachDanhMucPhuCap {
    danhSachDanhMucPhuCap {
      isResults
      message
      data {
        maPhuCap
        tenPhuCap
        loaiTinh
        donViThoiGian
      }
    }
  }
`;

export const CONTRACT_LIST = gql`
  query DanhSachHopDong($input: DanhSachHopDongInput!) {
    danhSachHopDong(input: $input) {
      pageIndex
      pageSize
      totalRecords
      totalPages
      items {
        id
        maNhanVien
        tenNhanVien
        soHopDongLaoDong
        maLoaiHopDong
        tenLoaiHopDong
        maChucVu
        tenChucVu
        ngayKyHopDong
        ngayBatDau
        ngayKetThuc
        luongCoBan
        mucDongBHXH
        luongPhuCap
        tongThuNhap
        luongThuViec
        trangThaiHopDong
        tenTrangThaiHopDong
      }
    }
  }
`;
export const CONTRACT_DETAIL = gql`
  query ThongTinHopDong($id: String!) {
    thongTinHopDong(id: $id) {
      id
      maNhanVien
      tenNhanVien
      soHopDongLaoDong
      maLoaiHopDong
      tenLoaiHopDong
      maChucVu
      tenChucVu
      ngayKyHopDong
      ngayBatDau
      ngayKetThuc
      luongCoBan
      mucDongBHXH
      luongPhuCap
      tongThuNhap
      luongThuViec
      ngayDuyetHopDong
      nguoiKyDuyet
      trangThaiHopDong
      ghiChu
      phuCaps {
        maHopDong
        maPhuCap
        tenPhuCap
        soTien
        tyLe
        mucTinh
        ghiChu
        isActive
      }
    }
  }
`;
export const CONTRACT_EXPIRY = gql`
  query KiemTraThoiHanHopDong {
    kiemTraThoiHanHopDong {
      totalRecords
      items {
        id
        maNhanVien
        tenNhanVien
        soHopDongLaoDong
        maLoaiHopDong
        ngayBatDau
        ngayKetThuc
        soNgayConLai
        trangThaiHopDong
      }
    }
  }
`;
export const CREATE_CONTRACT = gql`
  mutation CreateHopDong($input: CreateHopDongInput!) {
    createHopDong(input: $input) {
      success
      message
      data {
        id
        maNhanVien
        soHopDongLaoDong
        trangThaiHopDong
      }
    }
  }
`;
export const CHANGE_CONTRACT_STATUS = gql`
  mutation ChuyenTrangThaiHopDong($input: ChuyenTrangThaiHopDongInput!) {
    chuyenTrangThaiHopDong(input: $input) {
      success
      message
      data {
        id
        trangThaiHopDong
      }
    }
  }
`;

export const GENERATE_CONTRACT_NUMBER = gql`
  query TaoSoHopDongLaoDong($maLoaiHopDong: String!, $ngayKyHopDong: Date!) {
    taoSoHopDongLaoDong(maLoaiHopDong: $maLoaiHopDong, ngayKyHopDong: $ngayKyHopDong)
  }
`;
