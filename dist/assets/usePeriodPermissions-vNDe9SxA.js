import{d as m,c as y,n as l,t as u,f as C,o as f,an as i,ao as o,a as P,p as w,i as r}from"./index-C0unn91V.js";import{_ as p}from"./_plugin-vue_export-helper-DlAUqK2U.js";const N={O:"Đang mở",R:"Đang đối soát",C:"Đã chốt",L:"Đã khóa"},T=m({__name:"PeriodStatusTag",props:{status:{}},setup(n){return(e,a)=>(f(),y("span",{class:l(["period-status",n.status])},u(C(N)[n.status]||n.status)+" ("+u(n.status)+")",3))}}),A=p(T,[["__scopeId","data-v-85c297ef"]]),s=o`
  fragment PeriodFields on KyChamCongDto {
    id
    maKy
    nam
    thang
    tuNgay
    denNgay
    trangThai
    ghiChu
    ngayChot
    nguoiChot
    ngayKhoa
    nguoiKhoa
    createdAt
    createdBy
    updatedAt
    updatedBy
  }
`,k=o`
  query PeriodList($nam: Short, $thang: UnsignedByte, $trangThai: String) {
    danhSachKyChamCong(nam: $nam, thang: $thang, trangThai: $trangThai) {
      isResults
      message
      data {
        ...PeriodFields
      }
    }
  }
  ${s}
`,S=o`
  mutation PeriodCreate($input: KyChamCongInput!) {
    createKyChamCong(input: $input) {
      isResults
      message
      data {
        ...PeriodFields
      }
    }
  }
  ${s}
`;function c(n){if(!(n!=null&&n.isResults)||n.data==null)throw new Error((n==null?void 0:n.message)||"Không thể tải dữ liệu kỳ chấm công.");return n.data}function d(n){if(typeof n=="number"&&!Number.isSafeInteger(n))throw new Error("ID kỳ vượt giới hạn an toàn. Backend cần trả ID dưới dạng chuỗi.");const e=String(n);if(!/^[1-9][0-9]*$/.test(e)||BigInt(e)>9223372036854775807n)throw new Error("ID kỳ chấm công không hợp lệ.");return e}function $(n){var e;if(!Number.isInteger(n.nam)||n.nam<1||n.nam>9998||!Number.isInteger(n.thang)||n.thang<1||n.thang>12)throw new Error("Tháng hoặc năm không hợp lệ.");for(const a of[n.tuNgay,n.denNgay])if(!/^\d{4}-\d{2}-\d{2}$/.test(a)||!Number.isFinite(Date.parse(a+"T12:00:00Z"))||new Date(a+"T12:00:00Z").toISOString().slice(0,10)!==a)throw new Error("Ngày của kỳ chấm công không hợp lệ.");if(n.denNgay<n.tuNgay)throw new Error("Ngày kết thúc phải từ ngày bắt đầu trở đi.");if((((e=n.ghiChu)==null?void 0:e.trim().length)||0)>500)throw new Error("Ghi chú không được vượt quá 500 ký tự.")}function I(n){var e;return $(n),{...n,tuNgay:n.tuNgay+"T00:00:00+07:00",denNgay:n.denNgay+"T00:00:00+07:00",ghiChu:((e=n.ghiChu)==null?void 0:e.trim())||null}}const D=n=>o`query PeriodDetail { thongTinKyChamCong(id: ${d(n)}) {isResults message data{...PeriodFields}} } ${s}`,E=(n,e)=>o`mutation PeriodAction { ${n==="close"?"chotCong":"khoaCong"}(id: ${d(e)}) {isResults message data{...PeriodFields}} } ${s}`;function g(n){return{...n,id:d(n.id)}}async function v(n){const{data:e}=await i.query({query:k,variables:n,fetchPolicy:"no-cache",errorPolicy:"none"});return c(e==null?void 0:e.danhSachKyChamCong).filter(a=>!!a).map(g).sort((a,h)=>h.nam-a.nam||h.thang-a.thang)}async function K(n){const{data:e}=await i.query({query:D(n),fetchPolicy:"no-cache",errorPolicy:"none"});return g(c(e==null?void 0:e.thongTinKyChamCong))}async function q(n){const{data:e}=await i.mutate({mutation:S,variables:{input:I(n)},errorPolicy:"none"});return g(c(e==null?void 0:e.createKyChamCong))}async function O(n,e,a){if((await K(n)).trangThai!==a)throw new Error("KY_CHAM_CONG_UPDATE_CONFLICT");const{data:t}=await i.mutate({mutation:E(e,n),errorPolicy:"none"});return g(c(e==="close"?t==null?void 0:t.chotCong:t==null?void 0:t.khoaCong))}function b(){const n=P(),e=w(),a=r(()=>["Admin","Owner","HR Manager"].includes(n.role||""));return{canCreate:r(()=>["Admin","Owner","HR Manager","HR Staff"].includes(n.role||"")&&e.can("attendance","create")),canClose:r(()=>a.value&&e.can("attendance","approve")),canLock:r(()=>a.value&&e.can("attendance","approve"))}}export{A as P,O as a,q as c,K as g,v as l,b as u};
