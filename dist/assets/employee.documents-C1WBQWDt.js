import{an as n}from"./index-BidP3q7B.js";const i=n`
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
`,e=n`
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
`,h=n`
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
`,o=n`
  query PhatSinhMaNhanVien {
    phatSinhMaNhanVien {
      isResults
      message
      data
    }
  }
`,t=n`
  mutation ThemNhanVien($input: NhanVienCreateInput!) {
    themNhanVien(input: $input) {
      isResults
      message
    }
  }
`,s=n`
  mutation SuaNhanVien($input: NhanVienUpdateInput!) {
    suaNhanVien(input: $input) {
      isResults
      message
    }
  }
`;export{t as C,i as E,h as M,s as U,o as a,e as b};
