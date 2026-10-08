import{M as N}from"./employee.documents-CreQUffB.js";import{al as u,am as y}from"./index-BM5aPeaC.js";const E={1:"Chờ ký",2:"Đã ký",3:"Đã phát hành"};function M(n,a){return(n?E[n]:void 0)||(a==null?void 0:a.trim())||n||"—"}function V(n){if(!/^\d{4}-\d{2}-\d{2}$/.test(n))return!1;const a=new Date(n+"T00:00:00.000Z");return!Number.isNaN(a.getTime())&&a.toISOString().slice(0,10)===n}function K(n){return n?n.slice(0,10).split("-").reverse().join("/"):"—"}function O(n){return n==null?"—":new Intl.NumberFormat("vi-VN",{minimumFractionDigits:2,maximumFractionDigits:2}).format(n)}const p=`
  id maNhanVien ngayTiepNhanHoSo ho tenDem ten hoTen gioiTinh ngaySinh
  soCCCD ngayCap noiCap
  soDienThoai email tongThuNhapThoaThuan luongCoBan luongThuViec tiepNhan
  maBoPhanDuKien tenBoPhan maChucVuDuKien tenChucVu ngayBatDauLamViec
  trangThai ghiChu hodApprovedDate hodApprovedBy hrApprovedDate hrApprovedBy ownerSignedDate
`,d=u`
  query DanhSachTuyenDung($keyword: String) {
    danhSachTuyenDung(keyword: $keyword) { isResults message data { ${p} } }
  }
`,S=u`
  query ThongTinTuyenDung($id: Long!) {
    thongTinTuyenDung(id: $id) { isResults message data { ${p} } }
  }
`,R=u`
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
`,f=u`
  query DanhSachChucVu($maBoPhan: String) {
    danhSachChucVu(maBoPhan: $maBoPhan) {
      isResults
      message
      data {
        maChucVu
        maBoPhan
        tenChucVu
      }
    }
  }
`,I=u`
  mutation CreateTuyenDung($input: TuyenDungCreateInput!) {
    createTuyenDung(input: $input) {
      isResults
      message
      data
    }
  }
`,P=u`
  mutation UpdateTuyenDung($input: TuyenDungUpdateInput!) {
    updateTuyenDung(input: $input) {
      isResults
      message
      data
    }
  }
`,w=u`
  mutation ConfirmNhanViec($input: ConfirmNhanViecInput!) {
    confirmNhanViec(input: $input) {
      isResults
      message
      data
    }
  }
`,B=u`
  mutation UpdateTuyenDungStatus($input: UpdateTuyenDungStatusInput!) {
    updateTuyenDungStatus(input: $input) {
      isResults
      message
      data
    }
  }
`,_=u`
  query TuyenDungForNhanVien($id: Long!) {
    tuyenDungForNhanVien(id: $id) {
      isResults
      message
      data {
        tuyenDungId
        maNhanVien
        ho
        tenDem
        ten
        hoTen
        gioiTinh
        soDienThoai
        email
        ngaySinh
        soCCCD
        ngayCap
        noiCap
        maBoPhan
        tenBoPhan
        maChucVu
        tenChucVu
        ngayTiepNhan
        ngayBatDauLamViec
        trangThai
      }
    }
  }
`,U=u`
  mutation TaoNhanVienTuTuyenDung($input: NhanVienTuTuyenDungInput!) {
    taoNhanVienTuTuyenDung(input: $input) {
      isResults
      message
    }
  }
`,C={1:"TUYEN_DUNG",2:"TIEP_NHAN",3:"KHONG_TUYEN",4:"KHONG_NHAN_VIEC",5:"DA_NHAN_VIEC",6:"DA_TAO_HO_SO_NHAN_VIEN"},g=n=>n?n.slice(0,10):null;function c(n){var t;h(n.id);const a=(t=Object.entries(C).find(([o,e])=>o===String(n.trangThai)||e===n.trangThai))==null?void 0:t[0];if(!a)throw new Error("Trạng thái tuyển dụng không hợp lệ: "+n.trangThai);return{...n,id:String(n.id),hoTen:n.hoTen||[n.ho,n.tenDem,n.ten].filter(Boolean).join(" "),gioiTinh:n.gioiTinh||"",tiepNhan:n.tiepNhan===!0,maBoPhanDuKien:n.maBoPhanDuKien||"",maChucVuDuKien:n.maChucVuDuKien||"",ngaySinh:g(n.ngaySinh),trangThai:a,ngayTiepNhan:g(n.ngayTiepNhanHoSo),ngayBatDauLamViec:g(n.ngayBatDauLamViec),tenBoPhanDuKien:n.tenBoPhan||n.maBoPhanDuKien||"—",tenChucVuDuKien:n.tenChucVu||n.maChucVuDuKien||"—",soCCCD:n.soCCCD||"",ngayCap:g(n.ngayCap),noiCap:n.noiCap||"",soDienThoai:n.soDienThoai||"",email:n.email||"",ho:n.ho||"",tenDem:n.tenDem||"",ten:n.ten||""}}function h(n){if(typeof n=="string"&&!/^\d+$/.test(n))throw new Error("ID hồ sơ không hợp lệ.");const a=Number(n);if(!Number.isSafeInteger(a)||a<=0)throw new Error("ID hồ sơ vượt phạm vi số nguyên an toàn hoặc không hợp lệ.");return a}function T(n){if(n==null||!Number.isFinite(n)||n<0)throw new Error("Thu nhập phải là số hợp lệ, lớn hơn hoặc bằng 0.");return n}function D(n){return{ngayTiepNhan:n.ngayTiepNhan?n.ngayTiepNhan+"T00:00:00+07:00":null,ho:n.ho.trim(),tenDem:n.tenDem.trim(),ten:n.ten.trim(),gioiTinh:n.gioiTinh,soCCCD:n.soCCCD.trim()||null,ngayCap:n.ngayCap?n.ngayCap+"T00:00:00+07:00":null,noiCap:n.noiCap.trim()||null,soDienThoai:n.soDienThoai.trim()||null,email:n.email.trim()||null,tongThuNhapThoaThuan:T(n.tongThuNhapThoaThuan),luongCoBan:T(n.luongCoBan),luongThuViec:T(n.luongThuViec),maBoPhanDuKien:n.maBoPhanDuKien,maChucVuDuKien:n.maChucVuDuKien}}async function s(n,a,t={},o=!0){var m;const i=(m=(await y.query({query:n,variables:t,fetchPolicy:"no-cache",errorPolicy:"none"})).data)==null?void 0:m[a];if(!i||o&&i.isResults!==!0||i.data==null)throw new Error((i==null?void 0:i.message)||"Không thể tải dữ liệu tuyển dụng.");return i.data}async function r(n,a,t){var i;const e=(i=(await y.mutate({mutation:n,variables:{input:t},errorPolicy:"none"})).data)==null?void 0:i[a];if((e==null?void 0:e.isResults)!==!0)throw new Error((e==null?void 0:e.message)||"Không thể lưu hồ sơ tuyển dụng.");return e}const l={async getIssuePlaces(){return(await s(N,"danhSachMasterCode",{phanLoai:"03"})).filter(a=>a!==null).map(a=>({value:a.maKey,label:a.tenGiaTri}))},async getPositions(n=null){return(await s(f,"danhSachChucVu",{maBoPhan:n||null})).filter(t=>t!==null).map(t=>({value:t.maChucVu,label:t.tenChucVu}))},async getCatalogs(n=null){const[a,t]=await Promise.all([s(R,"danhSachBoPhan"),l.getPositions(n)]);return{departments:a.filter(o=>o!==null).map(o=>({value:o.maBoPhan,label:o.tenBoPhan})),positions:t}},async list(n=""){return(await s(d,"danhSachTuyenDung",{keyword:n.trim()||null})).filter(a=>a!==null).map(c)},async getDetail(n){return c(await s(S,"thongTinTuyenDung",{id:h(n)}))},getEmployeeSource:n=>s(_,"tuyenDungForNhanVien",{id:h(n)}),async createEmployeeFromRecruitment(n){var t;const a=await l.getEmployeeSource(n);if(h(a.tuyenDungId)!==h(n))throw new Error("TUYENDUNG_INVALID_INPUT");if(!((t=a.maNhanVien)!=null&&t.trim()))throw new Error("TIEPNHAN_EMPLOYEE_CODE_REQUIRED");return r(U,"taoNhanVienTuTuyenDung",{tuyenDungId:h(n),thongTinNhanVien:{maNhanVien:a.maNhanVien,ho:a.ho,tenDem:a.tenDem,ten:a.ten,gioiTinh:a.gioiTinh,ngaySinh:a.ngaySinh,noiSinh:"03001",email:a.email,soDienThoai:a.soDienThoai,danToc:"01001",tonGiao:"02000",diaChiThuongTru:"-",diaChiLienHe:"-",trinhDoHocVan:"04004",trinhDoChuyenMon:"05001",cccd:a.soCCCD,ngayCap:a.ngayCap,noiCap:a.noiCap,ngayTuyenDung:a.ngayBatDauLamViec}})},create:n=>r(I,"createTuyenDung",D(n)),update:(n,a)=>r(P,"updateTuyenDung",{id:h(n),...D(a)}),async confirmStart(n,a){if(!V(a))throw new Error("Vui lòng chọn ngày nhận việc hợp lệ.");if(!["1","2"].includes(n.trangThai))throw new Error("Hồ sơ không còn ở trạng thái có thể nhận việc.");return r(w,"confirmNhanViec",{id:h(n.id),ngayBatDauLamViec:a+"T00:00:00+07:00"})},transition:(n,a)=>r(B,"updateTuyenDungStatus",{id:h(n),trangThai:C[a]})};export{K as a,O as b,M as c,l as r,V as v};
