import{am as r,an as o}from"./index-GtMBMh2b.js";const i=o`
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
`,d=o`
  query PeriodList($nam: Short, $thang: UnsignedByte, $trangThai: String) {
    danhSachKyChamCong(nam: $nam, thang: $thang, trangThai: $trangThai) {
      isResults
      message
      data {
        ...PeriodFields
      }
    }
  }
  ${i}
`,m=o`
  mutation PeriodCreate($input: KyChamCongInput!) {
    createKyChamCong(input: $input) {
      isResults
      message
      data {
        ...PeriodFields
      }
    }
  }
  ${i}
`;function g(n){if(!(n!=null&&n.isResults)||n.data==null)throw new Error((n==null?void 0:n.message)||"Không thể tải dữ liệu kỳ chấm công.");return n.data}function s(n){if(typeof n=="number"&&!Number.isSafeInteger(n))throw new Error("ID kỳ vượt giới hạn an toàn. Backend cần trả ID dưới dạng chuỗi.");const t=String(n);if(!/^[1-9][0-9]*$/.test(t)||BigInt(t)>9223372036854775807n)throw new Error("ID kỳ chấm công không hợp lệ.");return t}function u(n){var t;if(!Number.isInteger(n.nam)||n.nam<1||n.nam>9998||!Number.isInteger(n.thang)||n.thang<1||n.thang>12)throw new Error("Tháng hoặc năm không hợp lệ.");for(const e of[n.tuNgay,n.denNgay])if(!/^\d{4}-\d{2}-\d{2}$/.test(e)||!Number.isFinite(Date.parse(e+"T12:00:00Z"))||new Date(e+"T12:00:00Z").toISOString().slice(0,10)!==e)throw new Error("Ngày của kỳ chấm công không hợp lệ.");if(n.denNgay<n.tuNgay)throw new Error("Ngày kết thúc phải từ ngày bắt đầu trở đi.");if((((t=n.ghiChu)==null?void 0:t.trim().length)||0)>500)throw new Error("Ghi chú không được vượt quá 500 ký tự.")}function y(n){var t;return u(n),{...n,tuNgay:n.tuNgay+"T00:00:00+07:00",denNgay:n.denNgay+"T00:00:00+07:00",ghiChu:((t=n.ghiChu)==null?void 0:t.trim())||null}}const C=n=>o`query PeriodDetail { thongTinKyChamCong(id: ${s(n)}) {isResults message data{...PeriodFields}} } ${i}`,l=(n,t)=>o`mutation PeriodAction { ${n==="close"?"chotCong":"khoaCong"}(id: ${s(t)}) {isResults message data{...PeriodFields}} } ${i}`;function h(n){return{...n,id:s(n.id)}}async function w(n){const{data:t}=await r.query({query:d,variables:n,fetchPolicy:"no-cache",errorPolicy:"none"});return g(t==null?void 0:t.danhSachKyChamCong).filter(e=>!!e).map(h).sort((e,c)=>c.nam-e.nam||c.thang-e.thang)}async function f(n){const{data:t}=await r.query({query:C(n),fetchPolicy:"no-cache",errorPolicy:"none"});return h(g(t==null?void 0:t.thongTinKyChamCong))}async function N(n){const{data:t}=await r.mutate({mutation:m,variables:{input:y(n)},errorPolicy:"none"});return h(g(t==null?void 0:t.createKyChamCong))}async function $(n,t,e){if((await f(n)).trangThai!==e)throw new Error("KY_CHAM_CONG_UPDATE_CONFLICT");const{data:a}=await r.mutate({mutation:l(t,n),errorPolicy:"none"});return h(g(t==="close"?a==null?void 0:a.chotCong:a==null?void 0:a.khoaCong))}const T={O:"Đang mở",R:"Đang đối soát",C:"Đã chốt",L:"Đã khóa"};export{$ as a,N as c,s as e,f as g,w as l,T as p};
