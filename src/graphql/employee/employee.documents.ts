import { gql } from '@apollo/client/core';
export const EMPLOYEE_LIST = gql`
  query DanhSachNhanVien($keyword: String) {
    danhSachNhanVien(keyword: $keyword) {
      isResults
      message
      data {
        maNhanVien
        hoTen
        ho
        tenDem
        ten
        gioiTinh
        ngaySinh
        danToc
        tonGiao
        noiSinh
        diaChiThuongTru
        diaChiLienHe
        email
        soDienThoai
        cccd
        ngayCap
        ngayTuyenDung
        trangThaiNhanVien
        tenNoiSinh
        tenNoiCap
        tenBoPhan
        tenChucVu
      }
    }
  }
`;
export const EMPLOYEE_DETAIL = gql`
  query ThongTinNhanVien($maNhanVien: String!) {
    thongTinNhanVien(maNhanVien: $maNhanVien) {
      isResults
      message
      data {
        maNhanVien
        hoTen
        ho
        tenDem
        ten
        gioiTinh
        ngaySinh
        danToc
        tonGiao
        noiSinh
        diaChiThuongTru
        diaChiLienHe
        email
        soDienThoai
        trinhDoHocVan
        trinhDoChuyenMon
        cccd
        ngayCap
        noiCap
        ngayTuyenDung
        soTaiKhoanNganHang
        nganHang
        soBaoHiemXaHoi
        maSoThueCaNhan
        ngayCapMaSo
        soNguoiPhuThuoc
        trangThaiNhanVien
        ngayNghiViec
      }
    }
  }
`;
export const MASTER_CODES = gql`
  query DanhSachMasterCode($phanLoai: String!) {
    danhSachMasterCode(phanLoai: $phanLoai) {
      isResults
      message
      data {
        maKey
        tenGiaTri
      }
    }
  }
`;
export const EMPLOYEE_CODE = gql`
  query PhatSinhMaNhanVien {
    phatSinhMaNhanVien {
      isResults
      message
      data
    }
  }
`;
export const CREATE_EMPLOYEE = gql`
  mutation ThemNhanVien($input: NhanVienCreateInput!) {
    themNhanVien(input: $input) {
      isResults
      message
    }
  }
`;
export const UPDATE_EMPLOYEE = gql`
  mutation SuaNhanVien($input: NhanVienUpdateInput!) {
    suaNhanVien(input: $input) {
      isResults
      message
    }
  }
`;
