import{am as m,an as u}from"./index-BFd7YyoW.js";function h(n){if(!n)return"";const e=n.trim(),a=/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/i.exec(e),t=/^(\d{1,2}):(\d{2})(?::\d{2}(?:\.\d+)?)?$/.exec(e);if(!t&&(!a||!a.slice(1).some(s=>s!==void 0)))return"";const i=Number(t?t[1]:(a==null?void 0:a[1])||0),o=Number(t?t[2]:(a==null?void 0:a[2])||0),r=Number((a==null?void 0:a[3])||0);return i>23||o>59||r>=60?"":`${String(i).padStart(2,"0")}:${String(o).padStart(2,"0")}`}const d=u`
  query CaLamViec($maBoPhan: String) {
    caLamViec(maBoPhan: $maBoPhan, isActive: true) {
      isResults
      message
      data {
        maCa
        tenCa
        kyHieuCa
        loaiCa
        gioBatDau
        gioKetThuc
        maBoPhan
        quaNgay
        isActive
        loaiHinhLamViec
      }
    }
  }
`;async function l(n){const{data:e}=await m.query({query:d,variables:{maBoPhan:n},fetchPolicy:"no-cache"}),a=e==null?void 0:e.caLamViec;if(!(a!=null&&a.isResults)||!Array.isArray(a.data))throw new Error((a==null?void 0:a.message)||"Không thể tải danh sách ca làm việc.");return a.data.filter(t=>!!t&&!!t.maCa)}async function y(n,e){return(await l(n)).map(a=>{const t=h(a.gioBatDau),i=h(a.gioKetThuc);return{id:a.maCa,workType:String(a.loaiHinhLamViec),code:a.kyHieuCa||a.maCa,name:a.tenCa,scheduleType:a.loaiHinhLamViec==null?e:String(a.loaiHinhLamViec)==="1"?"ADMINISTRATIVE":"ROTATING",startTime:t,endTime:i,crossDay:a.quaNgay===!0||String(a.quaNgay)==="1",displayColor:"#2563eb",active:!0}})}const g=u`
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
`;async function f(){const{data:n}=await m.query({query:g,fetchPolicy:"no-cache"}),e=n==null?void 0:n.danhSachBoPhan;if(!(e!=null&&e.isResults)||!Array.isArray(e.data))throw new Error((e==null?void 0:e.message)||"Không thể tải danh sách bộ phận.");return e.data.filter(a=>a!==null).map(a=>({code:a.maBoPhan,name:a.tenBoPhan}))}async function S(n){const e=await l(null),a=[{type:"ADMINISTRATIVE",label:"1 · Hành chính",departments:[]},{type:"ROTATING",label:"2 · Xoay ca",departments:[]}],t=[];for(const i of n){const o=e.filter(c=>c.maBoPhan===i.code),r=o.some(c=>String(c.loaiHinhLamViec)==="1"),s=o.some(c=>["C","2"].includes(String(c.loaiHinhLamViec).trim().toUpperCase()));r&&a[0].departments.push(i),s&&a[1].departments.push(i),!r&&!s&&t.push(i)}return{groups:a,unavailable:t}}export{y as a,S as b,f as g,h as s};
