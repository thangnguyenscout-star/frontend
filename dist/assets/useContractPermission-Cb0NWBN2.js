import{al as h,L as T,aQ as N,g as s,am as H,p as d}from"./index-BM5aPeaC.js";import{e as P}from"./employee.service-nBVn0FCe.js";import{r as y}from"./recruitment.service-y50C9eFB.js";const E=h`
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
`,L=h`
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
`,V=h`
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
`,B=h`
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
`,A=h`
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
`,O=h`
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
`,S=h`
  query TaoSoHopDongLaoDong($maLoaiHopDong: String!, $ngayKyHopDong: Date!) {
    taoSoHopDongLaoDong(maLoaiHopDong: $maLoaiHopDong, ngayKyHopDong: $ngayKyHopDong)
  }
`;class u extends Error{}function f(n){if(n instanceof u)return T(n);if(n instanceof Error&&!("graphQLErrors"in n)&&!("networkError"in n)){const a=N(n.message);return s(a==="COMMON_UNKNOWN_ERROR"?"COMMON_NETWORK_ERROR":a)}return T(n)}function I(){return{maNhanVien:"",soHopDongLaoDong:"",maLoaiHopDong:"",maBoPhan:"",maChucVu:"",ngayKyHopDong:"",ngayBatDau:"",ngayKetThuc:"",luongCoBan:0,mucDongBHXH:0,luongPhuCap:0,tongThuNhap:0,luongThuViec:0,trangThaiHopDong:"1",ghiChu:"",phuCaps:[]}}function l(n){var a,o,i;return{maNhanVien:n.maNhanVien.trim(),soHopDongLaoDong:n.soHopDongLaoDong.trim(),maLoaiHopDong:n.maLoaiHopDong.trim(),maBoPhan:((a=n.maBoPhan)==null?void 0:a.trim())||void 0,maChucVu:((o=n.maChucVu)==null?void 0:o.trim())||void 0,ngayKyHopDong:n.ngayKyHopDong,ngayBatDau:n.ngayBatDau,ngayKetThuc:n.ngayKetThuc||void 0,luongCoBan:n.luongCoBan,mucDongBHXH:n.mucDongBHXH??void 0,luongPhuCap:n.luongPhuCap??void 0,tongThuNhap:n.tongThuNhap,luongThuViec:n.luongThuViec,trangThaiHopDong:n.trangThaiHopDong.trim(),ghiChu:((i=n.ghiChu)==null?void 0:i.trim())||void 0,phuCaps:(n.phuCaps||[]).map(e=>{var t;return{maPhuCap:e.maPhuCap.trim(),soTien:e.soTien,tyLe:e.tyLe??void 0,mucTinh:e.mucTinh??void 0,ghiChu:((t=e.ghiChu)==null?void 0:t.trim())||void 0}})}}function K(n,a){var o;if(a.trangThai!=="5")throw new u(s("TIEPNHAN_INVALID_STATUS"));if(!((o=a.maNhanVien)!=null&&o.trim()))throw new u(s("TIEPNHAN_EMPLOYEE_CODE_REQUIRED"));return l({...n,maLoaiHopDong:"07001",maNhanVien:a.maNhanVien,maBoPhan:a.maBoPhanDuKien,maChucVu:a.maChucVuDuKien,ngayBatDau:a.ngayBatDauLamViec||"",luongCoBan:a.luongCoBan??0,tongThuNhap:a.tongThuNhapThoaThuan??0,luongThuViec:a.luongThuViec??0,ghiChu:a.ghiChu||""})}function R(n){if(!/^\d{4}-\d{2}-\d{2}$/.test(n))return!1;const a=new Date(n+"T00:00:00Z");return Number.isFinite(a.getTime())&&a.toISOString().slice(0,10)===n}function w(n,a=!1){const o={},i=["soHopDongLaoDong","maLoaiHopDong","ngayKyHopDong","ngayBatDau","maNhanVien","trangThaiHopDong",...a?["maChucVu","ngayKetThuc"]:[]];for(const t of i)String(n[t]??"").trim()||(o[t]="Vui lòng nhập trường này.");for(const t of["ngayKyHopDong","ngayBatDau","ngayKetThuc"])n[t]&&!R(n[t])&&(o[t]="Ngày không hợp lệ.");n.ngayBatDau&&n.ngayKyHopDong&&n.ngayBatDau<n.ngayKyHopDong&&(o.ngayBatDau="Ngày bắt đầu phải lớn hơn hoặc bằng ngày ký."),n.ngayKetThuc&&n.ngayKetThuc<n.ngayBatDau&&(o.ngayKetThuc="Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.");for(const t of["luongCoBan","mucDongBHXH","luongPhuCap","tongThuNhap","luongThuViec"]){const g=n[t];["mucDongBHXH","luongPhuCap"].includes(t)&&g==null||(typeof g!="number"||!Number.isFinite(g)||g<0)&&(o[t]="Số tiền phải lớn hơn hoặc bằng 0.")}const e=new Set;return(n.phuCaps||[]).forEach((t,g)=>{const c=t.maPhuCap.trim();c&&e.has(c)&&(o["phuCaps."+g+".maPhuCap"]="Phụ cấp đã được chọn."),e.add(c),t.maPhuCap.trim()||(o["phuCaps."+g+".maPhuCap"]="Vui lòng nhập mã phụ cấp.");for(const D of["soTien","tyLe","mucTinh"]){const r=t[D];D!=="soTien"&&r==null||(typeof r!="number"||!Number.isFinite(r)||r<0)&&(o["phuCaps."+g+"."+D]="Giá trị phải lớn hơn hoặc bằng 0.")}}),o}async function p(n,a,o={}){var t;const e=(t=(await H.query({query:n,variables:o,fetchPolicy:"no-cache",errorPolicy:"none"})).data)==null?void 0:t[a];if(e==null)throw new u(a==="thongTinHopDong"?s("HOPDONG_NOT_FOUND"):"Máy chủ không trả về dữ liệu hợp đồng.");return e}async function m(n,a,o){var t;const e=(t=(await H.mutate({mutation:n,variables:{input:o},errorPolicy:"none"})).data)==null?void 0:t[a];if(!e)throw new u("Máy chủ không trả về kết quả hợp đồng.");return{...e,message:e.success?e.message||"Thao tác thành công.":T(e.message)}}const C={async generateContractNumber(n,a){const o=await p(S,"taoSoHopDongLaoDong",{maLoaiHopDong:n,ngayKyHopDong:a});if(typeof o!="string"||!o.trim())throw new u(s("HOPDONG_CREATE_FAILED"));return o.trim()},generateProbationContractNumber(){const a=new Date().toISOString().split("T")[0];return C.generateContractNumber("07001",a)},async getAllowanceCatalog(){const n=await p(E,"danhSachDanhMucPhuCap");if(!n.isResults)throw new u(n.message||"Không thể tải danh mục phụ cấp.");return n.data||[]},async getCatalogs(n=null){const[a,o]=await Promise.all([P.masterCodes("07"),y.getCatalogs(n)]);return{types:a.map(i=>({value:i.maKey,label:i.tenGiaTri})),...o}},getList:n=>p(L,"danhSachHopDong",{input:n}),getById:n=>p(V,"thongTinHopDong",{id:n}),getExpiringContracts:()=>p(B,"kiemTraThoiHanHopDong"),create:n=>m(A,"createHopDong",l(n)),changeStatus:(n,a,o)=>m(O,"chuyenTrangThaiHopDong",{id:n,trangThaiMoi:a.trim(),ghiChu:(o==null?void 0:o.trim())||void 0}),async createProbationFromRecruitment(n,a){const o=await y.getDetail(a);return C.create(K(n,o))}};function M(){const n=d(),a={HOPDONG_VIEW:["contracts","view"],HOPDONG_CREATE:["contracts","create"],HOPDONG_STATUS_UPDATE:["contracts","approve"],NHANVIEN_CREATE:["employees","create"]};return o=>n.can(...a[o])}export{u as C,f as a,K as b,C as c,I as e,M as u,w as v};
