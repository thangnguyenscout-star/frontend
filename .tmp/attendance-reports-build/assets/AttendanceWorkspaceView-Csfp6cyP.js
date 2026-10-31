import{d as fn,o,x as vn,c as s,b as n,F as B,v as O,t as r,n as Q,G as an,f as V,w as Un,g as K,e as A,i as z,r as _,am as On,an as Fn,ao as Fe,P as Me,p as se,N as te,y as bn,C as Ke,I as ze,h as G,_ as ln,z as on,E as Dn,A as le,R as me,ap as pe,aq as Ie,s as dn,K as ae,L as cn,O as Re,q as qe,k as Ue}from"./index-BFd7YyoW.js";import{a as He}from"./attendance-CYkncW1q.js";import{M as Ge}from"./ModuleListView-DsASG5bJ.js";import{s as je}from"./index-gxqtc5Fv.js";import{s as Xe}from"./index-C5lattmR.js";import{e as Qe}from"./employee.service-CpxENftw.js";import{l as re,e as We,p as Je}from"./period.types-BL58ft-Y.js";import{p as Ze}from"./record.service-BNFY4pZZ.js";import{_ as Ye}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./index-DMr5FxA-.js";import"./index-wMOtFt1f.js";import"./index-B4_IdRKf.js";import"./index-CEp1jRXK.js";import"./AppDrawer.vue_vue_type_script_setup_true_lang-S-0ofFOp.js";import"./ContractInspector.vue_vue_type_script_setup_true_lang-BZdw-V-v.js";import"./ContractCreateView-BMkoVytr.js";import"./AppLoading.vue_vue_type_script_setup_true_lang-BU-xPsEg.js";import"./AppErrorState.vue_vue_type_script_setup_true_lang-CpPoju7Y.js";import"./AppStatusBadge.vue_vue_type_script_setup_true_lang-BVSLJP6E.js";import"./ContractForm-DSUO7Xqd.js";import"./recruitment.service-CvytLoHy.js";import"./employee.documents-Be0Xb_P6.js";import"./useContractPermission-BRqGrvVG.js";import"./index-C7YcxaAg.js";import"./useToast-BIvLDxtQ.js";import"./useConfirm-CApkgxTA.js";import"./currency-Bi9uwIDW.js";import"./AppDataTable.vue_vue_type_script_setup_true_lang-CU77_Dtx.js";import"./AppEmptyState.vue_vue_type_script_setup_true_lang-BnovZhLJ.js";import"./AppForm.vue_vue_type_script_setup_true_lang-BsHC2C8n.js";import"./AppKpiCard-JAKjxxfI.js";import"./modules-CJV0O-xn.js";import"./useRecords-CptkNrYr.js";import"./export-BblXOGSb.js";import"./employee.type-r6lgm8XD.js";const nt=fn({__name:"AttendanceListView",setup(e){return(u,t)=>(o(),vn(Ge,{module:"attendance"}))}}),Hn={NORMAL:{label:"Đủ ca",bg:"#ECFDF5",text:"#065F46",border:"#A7F3D0",abnormal:!1},LEAVE_VACATION:{label:"Nghỉ lễ",bg:"#EFF6FF",text:"#1E40AF",border:"#BFDBFE",abnormal:!1},LEAVE_NORMAL:{label:"Nghỉ phép",bg:"#F5F3FF",text:"#5B21B6",border:"#DDD6FE",abnormal:!1},WORK_IN_VACATION:{label:"Làm việc trong lễ",bg:"#ECFEFF",text:"#155E75",border:"#A5F3FC",abnormal:!1},HALF_WORK:{label:"Nửa công",bg:"#FFFBEB",text:"#92400E",border:"#FDE68A",abnormal:!1},LEAVE_ABNORMAL:{label:"Nghỉ bất thường",bg:"#FFF1F2",text:"#9F1239",border:"#FECDD3",abnormal:!0},ATTENDANCE_ABNORMAL:{label:"Công bất thường",bg:"#FEF2F2",text:"#991B1B",border:"#FECACA",abnormal:!0},CHECK_YOUR_LOG_WORK:{label:"Cần kiểm tra log công",bg:"#FFF7ED",text:"#9A3412",border:"#FED7AA",abnormal:!0}},et={label:"Chưa có dữ liệu",bg:"#F8FAFC",text:"#475569",border:"#E2E8F0",abnormal:!1},W=e=>e?Hn[e.trangThaiCong||""]||Hn.ATTENDANCE_ABNORMAL:et,hn=e=>e?[e.ho,e.tenDem,e.ten].filter(Boolean).join(" ").trim()||e.hoTen||e.maNhanVien:"";function sn(e){const u=e.slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(u)||!Number.isFinite(Date.parse(u+"T12:00:00Z"))||new Date(u+"T12:00:00Z").toISOString().slice(0,10)!==u)throw new Error("Ngày chấm công không hợp lệ: "+e);return u}const Y=e=>e?sn(e).split("-").reverse().join("/"):"—";function be(e,u){const t=new Date(Date.UTC(e,u-1,1));t.setUTCFullYear(e);const c=(t.getUTCDay()+6)%7,l=new Date(t);return l.setUTCMonth(l.getUTCMonth()+1),l.setUTCDate(0),Array.from({length:Math.ceil((c+l.getUTCDate())/7)*7},(h,i)=>{const k=i-c+1;return k<1||k>l.getUTCDate()?null:String(e).padStart(4,"0")+"-"+String(u).padStart(2,"0")+"-"+String(k).padStart(2,"0")})}function tt(e,u){const t=new Map;for(const c of e){const l=sn(c.ngayChamCong);if(t.has(l))throw new Error("Có nhiều bản ghi công cùng ngày "+Y(l)+".");t.set(l,c)}return t}const fe=(e,u=!1)=>typeof e=="number"&&Number.isFinite(e)?new Intl.NumberFormat("vi-VN",{maximumFractionDigits:2}).format(u?e/60:e):"—",lt=[{key:"soNgayCoCong",label:"Ngày có công",visible:!0},{key:"tongSoPhutLamViecThucTe",label:"Giờ làm thực tế",visible:!0,hours:!0},{key:"tongCongHopLe",label:"Công hợp lệ",visible:!0},{key:"tongNgayNghiCoLuong",label:"Nghỉ có lương",visible:!0},{key:"tongNgayNghiKhongLuong",label:"Nghỉ không lương",visible:!0},{key:"tongCongHuongLuong",label:"Công hưởng lương",visible:!0},{key:"soNgayCoDuLieuCong",label:"Ngày có dữ liệu",visible:!1},{key:"soNgayDuLog",label:"Ngày đủ log",visible:!1},{key:"soNgayKhongLog",label:"Ngày không log",visible:!1},{key:"soNgayDiTre",label:"Ngày đi trễ",visible:!1},{key:"tongSoPhutDiTre",label:"Phút đi trễ",visible:!1},{key:"soNgayVeSom",label:"Ngày về sớm",visible:!1},{key:"tongSoPhutVeSom",label:"Phút về sớm",visible:!1},{key:"tongSoPhutTangCa",label:"Giờ tăng ca",visible:!1,hours:!0},{key:"soNgayQuaDem",label:"Ngày qua đêm",visible:!1},{key:"tongNgayNghi",label:"Tổng ngày nghỉ",visible:!1}],at={tongDongTinh:"Tổng dòng tính",soDongThemMoi:"Thêm mới",soDongCapNhat:"Cập nhật",soDongThieuLog:"Thiếu log",soDongNgayLe:"Ngày lễ",soDongNghiPhep:"Nghỉ phép",soDongBoQuaKhongCapNhat:"Bỏ qua / không cập nhật",soNhanVienThemMoi:"Nhân viên thêm mới",soNhanVienCapNhat:"Nhân viên cập nhật",soNhanVienBoQuaDaKhoa:"Bỏ qua do khóa",thang:"Tháng",nam:"Năm",kyChamCongId:"Kỳ công"},Bn=(e,u)=>JSON.stringify([e,sn(u)]);function xe(e,u){const t=new Map;for(const c of e){if(u&&c.maNhanVien!==u)throw new Error("API trả dữ liệu của nhân viên khác.");const l=Bn(c.maNhanVien,c.ngayChamCong);if(t.has(l))throw new Error("Có nhiều bản ghi công của nhân viên "+c.maNhanVien+" trong ngày "+Y(c.ngayChamCong)+".");t.set(l,c)}return t}function ot(e,u,t){const c=new Map;for(const l of[...e,...u]){if(t.maBoPhan&&l.maBoPhan!==t.maBoPhan||t.maNhanVien&&l.maNhanVien!==t.maNhanVien)continue;const h=c.get(l.maNhanVien);c.set(l.maNhanVien,{...h,...l,ho:l.ho??(h==null?void 0:h.ho),tenDem:l.tenDem??(h==null?void 0:h.tenDem),ten:l.ten??(h==null?void 0:h.ten),hoTen:l.hoTen??(h==null?void 0:h.hoTen),tenBoPhan:l.tenBoPhan??(h==null?void 0:h.tenBoPhan)})}return[...c.values()].sort((l,h)=>hn(l).localeCompare(hn(h),"vi")||l.maNhanVien.localeCompare(h.maNhanVien))}function ke(e,u){return e&&W(e).abnormal&&u?["recalculate"]:[]}const we=(e,u)=>be(e,u).filter(t=>!!t),$n=[{key:"ngayNghiPhep",label:"Nghỉ phép"},{key:"ngayNghiHuongLuong",label:"Nghỉ hưởng lương"},{key:"nghiLe",label:"Nghỉ lễ"},{key:"ngayNghiKhongHuongLuong",label:"Nghỉ không hưởng lương"},{key:"otNgayLe",label:"OT ngày lễ"},{key:"otNgayThuong",label:"OT ngày thường"}];function it(e,u){const t=new Set(we(u.nam,u.thang)),c=new Map;for(const l of e){if(!t.has(sn(l.ngayChamCong)))continue;let h=c.get(l.maNhanVien);h||(h={ngayNghiPhep:0,ngayNghiHuongLuong:0,nghiLe:0,ngayNghiKhongHuongLuong:0,otNgayLe:0,otNgayThuong:0},c.set(l.maNhanVien,h));for(const{key:i}of $n){const k=l[i];typeof k=="number"&&Number.isFinite(k)&&(h[i]+=k)}}return c}const st={class:"attendance-calendar"},rt={class:"monthly-table-scroll"},ut={class:"month-grid","aria-label":"Lịch chấm công tháng"},ct=["onContextmenu"],ht={class:"day-top"},dt=["datetime"],mt=["aria-label","onClick"],pt=["aria-label","onClick"],gt={key:1,class:"day-body"},yt={key:0,class:"outside-days"},vt={class:"outside-grid"},bt=["onContextmenu"],ft={class:"day-top"},xt=["datetime"],kt=["aria-label","onClick"],wt=["onClick"],Ct={key:1,class:"day-body"},Nt={class:"monthly-legend","aria-label":"Chú giải trạng thái"},Tt=fn({__name:"AttendanceCalendar",props:{rows:{},year:{},month:{},readonly:{type:Boolean,default:!1}},emits:["menu","detail"],setup(e,{emit:u}){const t=e,c=u,l=z(()=>tt(t.rows)),h=z(()=>be(t.year,t.month)),i=z(()=>Array.from({length:h.value.length/7},(x,v)=>h.value.slice(v*7,v*7+7))),k=z(()=>String(t.year).padStart(4,"0")+"-"+String(t.month).padStart(2,"0")),C=z(()=>t.rows.filter(x=>!sn(x.ngayChamCong).startsWith(k.value)).sort((x,v)=>x.ngayChamCong.localeCompare(v.ngayChamCong)));function y(x,v){t.readonly||!x||!W(x).abnormal||(v.preventDefault(),c("menu",x,v))}function T(x){!t.readonly&&x&&!W(x).abnormal&&c("detail",x)}function P(x){const v=W(x);return{background:v.bg,color:v.text,borderColor:v.border}}return(x,v)=>(o(),s("div",st,[n("div",rt,[n("table",ut,[n("thead",null,[n("tr",null,[(o(),s(B,null,O(["Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy","Chủ nhật"],$=>n("th",{key:$,scope:"col"},r($),1)),64))])]),n("tbody",null,[(o(!0),s(B,null,O(i.value,($,I)=>(o(),s("tr",{key:I},[(o(!0),s(B,null,O($,(g,b)=>{var w,S;return o(),s("td",{key:g||b,class:Q({"empty-calendar-cell":!g})},[g?(o(),s("div",{key:0,class:"calendar-day",style:an(P(l.value.get(g))),onContextmenu:E=>y(l.value.get(g),E)},[n("div",ht,[n("time",{datetime:g,class:Q({weekend:b>4})},r(Number(g.slice(-2))),11,dt),!e.readonly&&l.value.has(g)&&V(W)(l.value.get(g)).abnormal?(o(),s("button",{key:0,type:"button",class:"day-more","aria-label":"Xử lý công ngày "+V(Y)(g),onClick:Un(E=>c("menu",l.value.get(g),E),["stop"])}," ••• ",8,mt)):K("",!0)]),!e.readonly&&l.value.has(g)&&!V(W)(l.value.get(g)).abnormal?(o(),s("button",{key:0,type:"button",class:"day-body","aria-label":"Xem công ngày "+V(Y)(g),onClick:E=>T(l.value.get(g))},[n("strong",null,r(((w=l.value.get(g))==null?void 0:w.hienThiCa)||"—"),1),n("span",null,r(V(W)(l.value.get(g)).label),1)],8,pt)):(o(),s("div",gt,[n("strong",null,r(((S=l.value.get(g))==null?void 0:S.hienThiCa)||"—"),1),n("span",null,r(V(W)(l.value.get(g)).label),1)]))],44,ct)):K("",!0)],2)}),128))]))),128))])])]),C.value.length?(o(),s("section",yt,[v[0]||(v[0]=n("h3",null,"Ngày ngoài tháng thuộc kỳ công",-1)),n("div",vt,[(o(!0),s(B,null,O(C.value,$=>(o(),s("div",{key:$.ngayChamCong,class:"calendar-day",style:an(P($)),onContextmenu:I=>y($,I)},[n("div",ft,[n("time",{datetime:V(sn)($.ngayChamCong)},r(V(Y)($.ngayChamCong)),9,xt),!e.readonly&&V(W)($).abnormal?(o(),s("button",{key:0,type:"button",class:"day-more","aria-label":"Xử lý công ngày "+V(Y)($.ngayChamCong),onClick:I=>c("menu",$,I)}," ••• ",8,kt)):K("",!0)]),!e.readonly&&!V(W)($).abnormal?(o(),s("button",{key:0,class:"day-body",type:"button",onClick:I=>T($)},[n("strong",null,r($.hienThiCa||"—"),1),n("span",null,r(V(W)($).label),1)],8,wt)):(o(),s("div",Ct,[n("strong",null,r($.hienThiCa||"—"),1),n("span",null,r(V(W)($).label),1)]))],44,bt))),128))])])):K("",!0),n("div",Nt,[(o(!0),s(B,null,O(V(Hn),($,I)=>(o(),s("span",{key:I},[n("i",{style:an({background:$.bg,borderColor:$.border}),"aria-hidden":"true"},null,4),A(r($.label),1)]))),128)),v[1]||(v[1]=n("span",null,[n("i",{"aria-hidden":"true"}),A("Chưa có dữ liệu")],-1))])]))}}),Vt={class:"attendance-month-grid"},$t={class:"excel-scroll",role:"region","aria-label":"Bảng chi tiết chấm công tháng, cuộn ngang để xem các ngày",tabindex:"0"},_t={class:"excel-attendance","aria-label":"Nhân viên và ký hiệu công từng ngày"},Lt=["colspan"],Pt=["colspan"],St=["datetime"],Et={class:"excel-sticky excel-stt"},Bt={class:"excel-sticky excel-code"},Dt={class:"excel-sticky excel-name",scope:"row"},At={class:"excel-dept"},Ot=["title","onContextmenu"],Ft=["aria-label","onClick"],Mt={key:0},Kt=["colspan"],zt={class:"monthly-subtitle excel-help"},It={class:"monthly-legend","aria-label":"Chú giải trạng thái"},Rt=fn({__name:"AttendanceMonthGrid",props:{rows:{},employees:{},filter:{},allowActions:{type:Boolean,default:!1}},emits:["menu","detail"],setup(e,{emit:u}){const t=e,c=u,l=_(""),h=z(()=>xe(t.rows)),i=z(()=>ot(t.employees,t.rows,t.filter)),k=z(()=>we(t.filter.nam,t.filter.thang)),C=z(()=>it(t.rows,t.filter)),y=["CN","T2","T3","T4","T5","T6","T7"],T=g=>y[new Date(g+"T12:00:00Z").getUTCDay()],P=(g,b)=>h.value.get(Bn(g,b)),x=(g,b)=>{const w=P(g.maNhanVien,b);return hn(g)+" · "+Y(b)+" · "+((w==null?void 0:w.hienThiCa)||"—")+" · "+W(w).label},v=g=>({background:W(g).bg,color:W(g).text});function $(g,b){l.value=Bn(g.maNhanVien,b);const w=P(g.maNhanVien,b);w&&!W(w).abnormal&&c("detail",w)}function I(g,b,w){const S=P(g.maNhanVien,b);!ke(S,t.allowActions).length||!S||(w.preventDefault(),l.value=Bn(g.maNhanVien,b),c("menu",S,w))}return(g,b)=>(o(),s("div",Vt,[n("div",$t,[n("table",_t,[n("colgroup",null,[b[0]||(b[0]=n("col",{class:"excel-number-col"},null,-1)),b[1]||(b[1]=n("col",{class:"excel-code-col"},null,-1)),b[2]||(b[2]=n("col",{class:"excel-name-col"},null,-1)),b[3]||(b[3]=n("col",{class:"excel-dept-col"},null,-1)),(o(!0),s(B,null,O(k.value,w=>(o(),s("col",{key:w,class:"excel-day-col"}))),128)),(o(!0),s(B,null,O(V($n),w=>(o(),s("col",{key:w.key,class:"excel-total-col"}))),128))]),n("thead",null,[n("tr",null,[b[4]||(b[4]=n("th",{rowspan:"2",class:"excel-sticky excel-stt",scope:"col"},"STT",-1)),b[5]||(b[5]=n("th",{rowspan:"2",class:"excel-sticky excel-code",scope:"col"},"Mã nhân viên",-1)),b[6]||(b[6]=n("th",{rowspan:"2",class:"excel-sticky excel-name",scope:"col"},"Họ và tên",-1)),b[7]||(b[7]=n("th",{rowspan:"2",class:"excel-dept",scope:"col"},"Bộ phận",-1)),n("th",{colspan:k.value.length,scope:"colgroup"}," Ngày công tháng "+r(String(e.filter.thang).padStart(2,"0"))+"/"+r(e.filter.nam),9,Lt),n("th",{colspan:V($n).length,scope:"colgroup"},"Tổng trong tháng",8,Pt)]),n("tr",null,[(o(!0),s(B,null,O(k.value,w=>(o(),s("th",{key:w,scope:"col",class:Q({"excel-weekend":T(w)==="CN"||T(w)==="T7"})},[n("time",{datetime:w},r(Number(w.slice(-2))),9,St),n("small",null,r(T(w)),1)],2))),128)),(o(!0),s(B,null,O(V($n),w=>(o(),s("th",{key:w.key,scope:"col"},r(w.label),1))),128))])]),n("tbody",null,[(o(!0),s(B,null,O(i.value,(w,S)=>(o(),s("tr",{key:w.maNhanVien},[n("td",Et,r(S+1),1),n("td",Bt,r(w.maNhanVien),1),n("th",Dt,r(V(hn)(w)),1),n("td",At,r(w.tenBoPhan||w.maBoPhan||"—"),1),(o(!0),s(B,null,O(k.value,E=>{var j;return o(),s("td",{key:E,class:Q(["excel-attendance-cell",{"excel-selected":l.value===V(Bn)(w.maNhanVien,E)}]),style:an(v(P(w.maNhanVien,E))),title:x(w,E),onContextmenu:J=>I(w,E,J)},[n("button",{type:"button",class:"excel-cell-symbol","aria-label":x(w,E),onClick:J=>$(w,E)},r(((j=P(w.maNhanVien,E))==null?void 0:j.hienThiCa)||"—"),9,Ft)],46,Ot)}),128)),(o(!0),s(B,null,O(V($n),E=>{var j;return o(),s("td",{key:E.key,class:"excel-total"},r(V(fe)(((j=C.value.get(w.maNhanVien))==null?void 0:j[E.key])??0)),1)}),128))]))),128)),i.value.length?K("",!0):(o(),s("tr",Mt,[n("td",{colspan:k.value.length+4+V($n).length,class:"excel-empty"}," Không có nhân viên theo bộ lọc. ",8,Kt)]))])])]),n("p",zt,r(i.value.length)+" nhân viên · Ô hiển thị ký hiệu công/nghỉ phép. Nhấn chuột phải vào ô công bất thường để xem chức năng có thể sử dụng. ",1),n("div",It,[(o(!0),s(B,null,O(V(Hn),(w,S)=>(o(),s("span",{key:S},[n("i",{style:an({background:w.bg,borderColor:w.border}),"aria-hidden":"true"},null,4),A(r(w.label),1)]))),128)),b[8]||(b[8]=n("span",null,[n("i",{"aria-hidden":"true"}),A("Chưa có dữ liệu")],-1))])]))}});function ue(e){if((e==null?void 0:e.isResults)!==!0||e.data==null)throw new Error((e==null?void 0:e.message)||"Không nhận được dữ liệu chấm công hợp lệ.");return e.data}const Ce="maNhanVien ho tenDem ten maBoPhan tenBoPhan",Ne="thang nam tuNgay denNgay trangThai ngayChot",qt=Ce+" "+Ne+" ngaySinh gioiTinh soNgayCoDuLieuCong soNgayDuLog soNgayKhongLog soNgayCoCong tongSoPhutLamViecThucTe tongSoPhutDiTre tongSoPhutVeSom soNgayDiTre soNgayVeSom tongSoPhutTangCa soNgayQuaDem tongCongHopLe tongNgayNghi tongNgayNghiCoLuong tongNgayNghiKhongLuong tongCongHuongLuong",Ut=Ce+" "+Ne+" maCa kyHieuCa ngayChamCong gioVao gioRa soPhutLamViec soGioLamViec maLoaiNghiPhep laNgayLe hienThiCa trangThaiCong ngayNghiPhep ngayNghiHuongLuong nghiLe ngayNghiKhongHuongLuong otNgayLe otNgayThuong";function jn(e){if(!Number.isInteger(e.thang)||e.thang<1||e.thang>12||!Number.isInteger(e.nam)||e.nam<100||e.nam>9998)throw new Error("Tháng hoặc năm không hợp lệ.")}async function Ht(e){jn(e);const u=new URL("/api/bang-cham-cong/export-excel",new URL("https://hrmsapi-crc3crfdegesbper.westus3-01.azurewebsites.net/graphql",window.location.origin));u.searchParams.set("thang",String(e.thang)),u.searchParams.set("nam",String(e.nam)),e.maNhanVien&&u.searchParams.set("manhanvien",e.maNhanVien),e.maBoPhan&&u.searchParams.set("mabophan",e.maBoPhan);const t=`BangChamCong_${e.nam}_${String(e.thang).padStart(2,"0")}.xlsx`;return Ze(async()=>{var T,P;const c=await fetch(u,{method:"GET",credentials:"include",headers:{Authorization:`Bearer ${Fe.get()}`,Accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}});if(c.status===401)throw new Me(401);const l=c.headers.get("content-type")||"";if(!c.ok||l.toLowerCase().includes("json")){const x=await c.json().catch(()=>null);throw new Error((x==null?void 0:x.message)||(x==null?void 0:x.detail)||(x==null?void 0:x.title)||`Không thể xuất Excel (HTTP ${c.status}).`)}const h=await c.blob();if(!h.size)throw new Error("Máy chủ trả về tệp Excel trống.");const i=c.headers.get("content-disposition")||"",k=(T=/filename\*\s*=\s*UTF-8''([^;]+)/i.exec(i))==null?void 0:T[1],C=/filename\s*=\s*(?:"([^"]+)"|([^;]+))/i.exec(i);let y=(C==null?void 0:C[1])||((P=C==null?void 0:C[2])==null?void 0:P.trim())||t;if(k)try{y=decodeURIComponent(k.trim())}catch{}return y=y.replace(/[/\\]/g,"_"),{blob:h,filename:y}})}function Te(e){return jn(e),"thang:"+e.thang+",nam:"+e.nam+",maBoPhan:"+JSON.stringify(e.maBoPhan||null)}async function ge(e){const{data:u}=await On.query({query:Fn("query BangCongThang { bangCongThang("+Te(e)+"){isResults message data{"+qt+"}}}"),fetchPolicy:"no-cache",errorPolicy:"none"}),t=ue(u==null?void 0:u.bangCongThang);if(!Array.isArray(t))throw new Error("Báo cáo tháng không đúng định dạng.");return t.filter(Boolean)}async function ne(e){const{data:u}=await On.query({query:Fn("query BangTongHopNgay { bangTongHopNgay("+Te(e)+",maNhanVien:"+JSON.stringify(e.maNhanVien)+"){isResults message data{"+Ut+"}}}"),fetchPolicy:"no-cache",errorPolicy:"none"}),t=ue(u==null?void 0:u.bangTongHopNgay);if(!Array.isArray(t))throw new Error("Công ngày không đúng định dạng.");const c=t.filter(Boolean);return xe(c,e.maNhanVien),c}const Ve={batch:"tinhChamCongHangLoat",month:"chamCongThang",person:"tinhChamCongNgayTheoNhanVien"};function oe(e){if(e.kind==="NON_NULL")return oe(e.ofType)+"!";if(e.kind==="LIST")return"["+oe(e.ofType)+"]";if(!e.name)throw new Error("Schema input không hợp lệ.");return e.name}function Gn(e){return e.ofType?Gn(e.ofType):e.name||""}const ye="kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name}}}}",ee=new Map;async function Gt(e){const u=Ve[e];let t=ee.get(u);return t||(t=(async()=>{var y,T,P,x;const{data:c}=await On.query({query:Fn("query AttendanceMutationContract {__schema{mutationType{fields{name args{name defaultValue type{"+ye+"}}}}}}"),fetchPolicy:"no-cache",errorPolicy:"none"}),l=(T=(y=c==null?void 0:c.__schema)==null?void 0:y.mutationType)==null?void 0:T.fields.find(v=>v.name===u),h=l==null?void 0:l.args.find(v=>v.name==="input");if(!h)throw new Error("Máy chủ chưa cung cấp hợp đồng input cho "+u+".");if(l.args.some(v=>v.name!=="input"&&v.type.kind==="NON_NULL"&&v.defaultValue==null))throw new Error("Mutation có tham số bắt buộc ngoài input chưa được ánh xạ.");const i=Gn(h.type),C=(x=(P=(await On.query({query:Fn("query AttendanceInputFields($name:String!){__type(name:$name){inputFields{name defaultValue type{"+ye+"}}}}"),variables:{name:i},fetchPolicy:"no-cache",errorPolicy:"none"})).data)==null?void 0:P.__type)==null?void 0:x.inputFields;if(!C)throw new Error("Input chưa phải kiểu đối tượng được hỗ trợ.");return{inputType:oe(h.type),fields:C}})().catch(c=>{throw ee.delete(u),c}),ee.set(u,t)),t}function jt(e,u,t){var C;jn(u.filter);const c=new Set(t.map(y=>y.name)),{filter:l}=u,h=["ngayChamCong","ngayLamViec","ngay"].find(y=>c.has(y));if(e==="person"&&(!u.day||!u.employee||u.day.maNhanVien!==u.employee.maNhanVien||!c.has("maNhanVien")||!h))throw new Error("Input chưa hỗ trợ đúng phạm vi nhân viên và ngày được chọn.");if(e!=="person"&&l.maNhanVien&&!c.has("maNhanVien"))throw new Error("API này không hỗ trợ lọc nhân viên. Hãy chọn Tất cả nhân viên trước khi tính.");if(e!=="person"&&l.maBoPhan&&!c.has("maBoPhan"))throw new Error("API này không hỗ trợ bộ phận đang chọn. Hãy chọn Tất cả bộ phận trước khi tính.");if(!c.has("kyChamCongId")&&!(c.has("thang")&&c.has("nam")))throw new Error("Input chưa có kỳ hoặc tháng/năm được hỗ trợ.");if(e!=="person"&&h&&((C=t.find(y=>y.name===h))==null?void 0:C.type.kind)==="NON_NULL")throw new Error("API yêu cầu chọn ngày cho thao tác hàng loạt; cần bổ sung hợp đồng trước khi sử dụng.");const i={thang:l.thang,nam:l.nam,maBoPhan:l.maBoPhan,maNhanVien:e==="person"?u.employee.maNhanVien:l.maNhanVien,previewOnly:!1,debug:!1};if(c.has("kyChamCongId")){if(u.kyChamCongId==null)throw new Error("Chưa xác định được kỳ công.");const y=We(u.kyChamCongId),T=Gn(t.find(P=>P.name==="kyChamCongId").type);if(T==="ID"||T==="String")i.kyChamCongId=y;else{const P=Number(y);if(!Number.isSafeInteger(P))throw new Error("ID kỳ vượt giới hạn số an toàn của input.");i.kyChamCongId=P}}if(e==="person"&&h){const y=sn(u.day.ngayChamCong),T=u.day;if(T.tuNgay&&y<sn(T.tuNgay)||T.denNgay&&y>sn(T.denNgay))throw new Error("Ngày nằm ngoài kỳ công.");const P=Gn(t.find(x=>x.name===h).type);i[h]=P==="DateTime"?y+"T00:00:00+07:00":y}const k={};for(const y of t)if(Object.hasOwn(i,y.name)&&(i[y.name]!=null||y.type.kind!=="NON_NULL"))k[y.name]=i[y.name];else if(y.type.kind==="NON_NULL"&&y.defaultValue==null)throw new Error("Cần ánh xạ trường input bắt buộc: "+y.name);return k}async function Xt(e,u){if(!se().can("attendance","update"))throw new Error("Bạn không có quyền tính công.");const t=JSON.parse(JSON.stringify(u)),c=await Gt(e),l=await re({nam:t.filter.nam,thang:t.filter.thang,trangThai:null});if(l.length!==1)throw new Error("Cần xác định chính xác một kỳ chấm công cho tháng đã chọn.");const h=l[0];if(h.trangThai!=="O")throw new Error("Chỉ tính công khi kỳ đang mở.");if(t.day){const C=sn(t.day.ngayChamCong);if(C<sn(h.tuNgay)||C>sn(h.denNgay))throw new Error("Ngày được chọn nằm ngoài kỳ công.")}t.kyChamCongId=h.id;const i=jt(e,t,c.fields),k=["Kỳ: "+t.filter.thang+"/"+t.filter.nam,e==="person"?"Nhân viên: "+hn(t.employee)+" ("+t.employee.maNhanVien+")":"Nhân viên: "+(t.filter.maNhanVien||"Tất cả"),e==="person"?"Ngày: "+Y(t.day.ngayChamCong):"Phạm vi: toàn kỳ đã chọn"];return e!=="person"&&k.push("Bộ phận: "+(t.filter.maBoPhan||"Tất cả")),{kind:e,context:t,input:i,inputType:c.inputType,scope:k}}async function Qt(e){if(!se().can("attendance","update"))throw new Error("Bạn không có quyền tính công.");const u=await re({nam:e.context.filter.nam,thang:e.context.filter.thang,trangThai:null});if(u.length!==1||String(u[0].id)!==String(e.context.kyChamCongId)||u[0].trangThai!=="O")throw new Error("Kỳ công đã thay đổi hoặc không còn mở.");const t=Ve[e.kind],c=e.kind==="month"?"thang nam kyChamCongId soNhanVienThemMoi soNhanVienCapNhat soNhanVienBoQuaDaKhoa":(e.kind==="person"?"soDongBoQuaKhongCapNhat ":"")+"tongDongTinh soDongThemMoi soDongCapNhat soDongThieuLog soDongNgayLe soDongNghiPhep",{data:l}=await On.mutate({mutation:Fn("mutation AttendanceCalculate($input:"+e.inputType+"){"+t+"(input:$input){isResults message data{returnCode thongKe{"+c+"} resultSets{columns rows}}}}"),variables:{input:e.input},errorPolicy:"none"}),h=l==null?void 0:l[t],i=ue(h);return{message:(h==null?void 0:h.message)||"Máy chủ đã trả kết quả xử lý.",data:i}}const Wt=`.monthly-page {
  color: #1e293b;
}
.monthly-page *,
.monthly-report * {
  box-sizing: border-box;
}
.monthly-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 22px;
}
.monthly-heading h1 {
  font-size: 24px;
  letter-spacing: -0.4px;
  margin: 0 0 6px;
  font-weight: 650;
}
.monthly-heading p,
.monthly-subtitle {
  color: #64748b;
  font-size: 13px;
  margin: 5px 0;
}
.monthly-actions {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  align-items: center;
}
.monthly-filters {
  display: grid;
  grid-template-columns:
    110px 130px minmax(150px, 1fr) minmax(230px, 1.6fr)
    auto;
  gap: 14px;
  align-items: end;
  padding: 18px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  margin-bottom: 20px;
}
.monthly-filters label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}
.monthly-filters input,
.monthly-filters select {
  width: 100%;
  min-width: 0;
  padding: 9px 11px;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  background: #fff;
  color: #1e293b;
  font: inherit;
  font-size: 14px;
}
.monthly-sheet {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}
.monthly-tabs {
  display: flex;
  gap: 24px;
  padding: 0 20px;
  border-bottom: 1px solid #e2e8f0;
}
.monthly-tabs button {
  border: 0;
  background: transparent;
  border-bottom: 3px solid transparent;
  padding: 17px 0 14px;
  font: inherit;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
}
.monthly-tabs button[aria-selected='true'] {
  color: #0f766e;
  border-bottom-color: #0f766e;
}
.monthly-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 18px 20px;
}
.monthly-toolbar h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}
.monthly-table-scroll {
  overflow-x: auto;
}
.monthly-summary {
  width: 100%;
  border-spacing: 0;
  white-space: nowrap;
  font-size: 13px;
}
.monthly-summary th {
  background: #f8fafc;
  color: #64748b;
  text-align: right;
  font-size: 12px;
  font-weight: 600;
  padding: 13px 16px;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}
.monthly-summary td {
  padding: 16px;
  border-bottom: 1px solid #edf2f7;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.monthly-summary th:first-child,
.monthly-summary td:first-child {
  text-align: left;
  position: sticky;
  left: 0;
  background: #fff;
  min-width: 220px;
  z-index: 1;
}
.monthly-summary th:first-child {
  background: #f8fafc;
}
.monthly-summary td:nth-child(2),
.monthly-summary th:nth-child(2) {
  text-align: left;
}
.monthly-summary small {
  display: block;
  color: #64748b;
  margin-top: 4px;
}
.monthly-name {
  border: 0;
  background: none;
  color: #0f766e;
  padding: 0;
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}
.monthly-empty {
  text-align: center;
  padding: 56px 20px;
  color: #64748b;
}
.monthly-error {
  background: #fff1f2;
  color: #9f1239;
  padding: 13px 16px;
  border-radius: 7px;
}
.monthly-notice {
  background: #fffbeb;
  color: #92400e;
  padding: 12px 16px;
  border-radius: 7px;
  font-size: 13px;
}
.monthly-columns summary {
  cursor: pointer;
  color: #475569;
  font-size: 13px;
}
.monthly-column-options {
  display: flex;
  gap: 10px 18px;
  flex-wrap: wrap;
  padding: 14px 0;
  max-width: 780px;
}
.monthly-column-options label {
  display: flex;
  gap: 6px;
  font-size: 12px;
  align-items: center;
}
.monthly-calendar-content {
  padding: 0 18px 18px;
}
.month-grid {
  table-layout: fixed;
  width: 100%;
  min-width: 620px;
  border-collapse: separate;
  border-spacing: 6px;
}
.month-grid th {
  text-align: left;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  padding: 7px;
}
.month-grid td {
  padding: 0;
  vertical-align: top;
  width: 14.285%;
}
.calendar-day {
  border: 1px solid;
  border-radius: 8px;
  min-height: 112px;
  padding: 9px;
  break-inside: avoid;
}
.empty-calendar-cell {
  background: #f8fafc;
  border-radius: 8px;
}
.day-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  font-size: 12px;
  min-height: 24px;
}
.day-top .weekend {
  text-decoration: underline;
  text-underline-offset: 4px;
}
.day-more {
  border: 0;
  color: inherit;
  background: transparent;
  cursor: pointer;
  padding: 5px;
  font-size: 12px;
  border-radius: 4px;
}
.day-body {
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 7px;
  width: 100%;
  padding: 7px 0 0;
  font: inherit;
}
button.day-body {
  cursor: pointer;
}
.day-body strong {
  font-size: 18px;
  font-weight: 650;
  overflow-wrap: anywhere;
}
.day-body span {
  font-size: 11px;
  line-height: 1.4;
}
.monthly-legend {
  display: flex;
  gap: 10px 18px;
  flex-wrap: wrap;
  padding: 17px 6px 7px;
  color: #475569;
  font-size: 12px;
}
.monthly-legend span {
  display: flex;
  align-items: center;
  gap: 7px;
}
.monthly-legend i {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 3px;
  background: #f8fafc;
}
.outside-days h3 {
  font-size: 14px;
  margin: 18px 6px 10px;
}
.outside-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));
  gap: 6px;
}
.monthly-context-menu {
  position: fixed;
  z-index: 2000;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  box-shadow: 0 12px 40px #0f172a26;
  padding: 7px;
  max-width: calc(100vw - 20px);
  width: 255px;
  color: #1e293b;
}
.monthly-context-menu p {
  font-size: 12px;
  color: #64748b;
  padding: 7px;
  margin: 0;
}
.monthly-context-menu button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 9px;
  background: none;
  border: 0;
  border-radius: 5px;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}
.monthly-context-menu button:hover:not(:disabled) {
  background: #f0fdfa;
}
.monthly-context-menu button:disabled {
  color: #94a3b8;
  cursor: not-allowed;
}
.monthly-report {
  color: #1e293b;
  background: #fff;
}
.monthly-report h2 {
  font-size: 21px;
  margin: 0 0 9px;
}
.monthly-report p {
  font-size: 13px;
  margin: 5px 0;
  color: #475569;
}
.monthly-report .attendance-calendar {
  margin-top: 16px;
}
.monthly-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin: 16px 0;
}
.monthly-stats div {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
}
.monthly-stats dt {
  color: #64748b;
  font-size: 12px;
}
.monthly-stats dd {
  margin: 5px 0 0;
  font-weight: 600;
}
.monthly-loading {
  display: grid;
  gap: 12px;
  padding: 28px 20px;
}
.monthly-loading span {
  display: block;
  min-height: 40px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9);
  background-size: 200%;
  animation: monthly-pulse 1.4s infinite;
}
@keyframes monthly-pulse {
  to {
    background-position: 200% 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .monthly-loading span {
    animation: none;
  }
}
@media (max-width: 900px) {
  .monthly-filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .monthly-filters .employee-filter {
    grid-column: 1/-1;
  }
}
@media (max-width: 480px) {
  .monthly-heading h1 {
    font-size: 21px;
  }
  .monthly-tabs {
    gap: 16px;
    padding: 0 14px;
  }
  .monthly-tabs button {
    font-size: 13px;
  }
  .monthly-calendar-content {
    padding: 0 5px 12px;
  }
  .monthly-toolbar {
    padding: 14px;
  }
  .monthly-actions {
    width: 100%;
  }
}
@media (pointer: coarse) {
  .day-more {
    min-height: 44px;
    min-width: 44px;
  }
  .day-body {
    min-height: 44px;
  }
}
@media print {
  @page {
    size: A4 landscape;
    margin: 10mm;
  }
  body {
    margin: 0;
    font-family: Arial, sans-serif;
  }
  .monthly-report {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  .monthly-table-scroll {
    overflow: visible;
  }
  .month-grid {
    min-width: 0;
    border-spacing: 4px;
  }
  .calendar-day {
    min-height: 90px;
    padding: 7px;
  }
  .day-body strong {
    font-size: 16px;
  }
  .day-body span {
    font-size: 10px;
  }
  .monthly-legend {
    font-size: 10px;
  }
  .month-grid tr {
    break-inside: avoid;
  }
  .day-more {
    display: none;
  }
}

/* Spreadsheet view: one employee per row, one date per column. */
.excel-scroll {
  overflow: auto;
  max-height: 640px;
  max-height: min(68vh, 640px);
  border-top: 1px solid #b8c4ce;
  border-bottom: 1px solid #b8c4ce;
}
.excel-attendance {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  width: max-content;
  min-width: 100%;
  border-left: 1px solid #b8c4ce;
  font-size: 12px;
}
.excel-attendance th,
.excel-attendance td {
  border-right: 1px solid #b8c4ce;
  border-bottom: 1px solid #b8c4ce;
  padding: 0 9px;
  height: 38px;
  background-clip: padding-box;
  vertical-align: middle;
}
.excel-attendance thead th {
  position: sticky;
  background: #e9eff3;
  color: #334155;
  text-align: center;
  font-weight: 600;
  z-index: 3;
}
.excel-attendance thead tr:first-child th {
  top: 0;
  height: 40px;
}
.excel-attendance thead tr:nth-child(2) th {
  top: 40px;
  height: 44px;
}
.excel-attendance th small {
  display: block;
  font-size: 10px;
  font-weight: 400;
  color: #64748b;
  margin-top: 2px;
}
.excel-number-col {
  width: 42px;
}
.excel-code-col {
  width: 100px;
}
.excel-name-col {
  width: 190px;
}
.excel-dept-col {
  width: 140px;
}
.excel-day-col {
  width: 46px;
}
.excel-total-col {
  width: 120px;
}
.excel-attendance .excel-total {
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  background: #f0fdfa;
}
.excel-attendance .excel-sticky {
  position: sticky;
  z-index: 2;
  background: #fff;
}
.excel-attendance .excel-stt {
  left: 0;
  width: 42px;
  text-align: center;
}
.excel-attendance .excel-code {
  left: 42px;
  width: 100px;
  white-space: nowrap;
}
.excel-attendance .excel-name {
  left: 142px;
  width: 190px;
  text-align: left;
  font-weight: 500;
}
.excel-attendance .excel-dept {
  width: 140px;
  text-align: left;
}
.excel-attendance thead .excel-sticky {
  z-index: 5;
  background: #e9eff3;
}
.excel-attendance th.excel-weekend {
  background: #e5e7eb;
  color: #475569;
}

.excel-attendance-cell {
  text-align: center;
  padding: 0 !important;
  min-width: 46px;
}
.excel-cell-symbol {
  display: block;
  width: 100%;
  min-height: 37px;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-weight: 600;
  padding: 6px 3px;
  cursor: default;
  overflow-wrap: anywhere;
}
.excel-selected {
  box-shadow: inset 0 0 0 2px #15803d;
}
.excel-cell-symbol:focus-visible {
  outline: 2px solid #15803d;
  outline-offset: -3px;
}
.excel-help {
  padding: 12px 18px 0;
}
.attendance-month-grid > .monthly-legend {
  padding: 14px 18px 18px;
}
.excel-attendance .excel-empty {
  padding: 32px;
  text-align: center;
  color: #64748b;
}
@media (max-width: 700px) {
  .excel-attendance .excel-stt,
  .excel-attendance .excel-code {
    position: static;
  }
  .excel-attendance .excel-name {
    left: 0;
  }
  .excel-attendance thead .excel-name {
    z-index: 5;
  }
}

/* Both reports share spreadsheet scrollbars and gridlines. */
.monthly-summary-scroll,
.excel-scroll {
  overflow: scroll;
  max-height: 640px;
  max-height: min(68vh, 640px);
  scrollbar-gutter: stable;
  scrollbar-width: auto;
  scrollbar-color: #a5b2bd #edf1f4;
  overscroll-behavior: contain;
}
.monthly-summary-scroll::-webkit-scrollbar,
.excel-scroll::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}
.monthly-summary-scroll::-webkit-scrollbar-track,
.excel-scroll::-webkit-scrollbar-track {
  background: #edf1f4;
  border: 1px solid #d1d9df;
}
.monthly-summary-scroll::-webkit-scrollbar-thumb,
.excel-scroll::-webkit-scrollbar-thumb {
  background: #a5b2bd;
  border: 3px solid #edf1f4;
  border-radius: 0;
}
.monthly-summary-scroll::-webkit-scrollbar-thumb:hover,
.excel-scroll::-webkit-scrollbar-thumb:hover {
  background: #7c8f9f;
}
.monthly-summary-scroll::-webkit-scrollbar-corner,
.excel-scroll::-webkit-scrollbar-corner {
  background: #dfe6eb;
}
.monthly-summary-scroll {
  border-top: 1px solid #b8c4ce;
  border-bottom: 1px solid #b8c4ce;
}
.monthly-summary {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  width: max-content;
  min-width: 100%;
  border-left: 1px solid #b8c4ce;
  font-size: 12px;
}
.monthly-summary th,
.monthly-summary td {
  border-top: 0;
  border-right: 1px solid #b8c4ce;
  border-bottom: 1px solid #b8c4ce;
  height: 40px;
  padding: 9px 12px;
  background-clip: padding-box;
  vertical-align: middle;
}
.monthly-summary thead th {
  position: sticky;
  top: 0;
  z-index: 3;
  background: #e9eff3;
  color: #334155;
  text-align: center;
  font-weight: 600;
  height: 44px;
}
.summary-code-col {
  width: 110px;
}
.summary-name-col {
  width: 220px;
}
.summary-dept-col {
  width: 150px;
}
.summary-data-col {
  width: 145px;
}
.monthly-summary th:first-child,
.monthly-summary td:first-child {
  position: sticky;
  left: 0;
  min-width: 110px;
  width: 110px;
  max-width: 110px;
  background: #fff;
  text-align: left;
  z-index: 2;
}
.monthly-summary th:nth-child(2),
.monthly-summary td:nth-child(2) {
  position: sticky;
  left: 110px;
  min-width: 220px;
  width: 220px;
  max-width: 220px;
  background: #fff;
  text-align: left;
  z-index: 2;
}
.monthly-summary td:nth-child(3),
.monthly-summary th:nth-child(3) {
  text-align: left;
}
.monthly-summary thead th:first-child,
.monthly-summary thead th:nth-child(2) {
  top: 0;
  background: #e9eff3;
  z-index: 5;
}
.monthly-summary tbody tr:hover td {
  background: #f0f7f3;
}
.monthly-summary .monthly-empty {
  white-space: normal;
}
@media (max-width: 700px) {
  .monthly-summary th:first-child,
  .monthly-summary td:first-child {
    position: static;
  }
  .monthly-summary th:nth-child(2),
  .monthly-summary td:nth-child(2) {
    left: 0;
    min-width: 190px;
    width: 190px;
    max-width: 190px;
  }
  .summary-name-col {
    width: 190px;
  }
}
`,Jt=["aria-busy"],Zt={class:"monthly-heading"},Yt={class:"monthly-actions"},nl=["disabled"],el=["value"],tl=["disabled"],ll=["disabled"],al=["value"],ol={class:"employee-filter"},il={key:0,class:"monthly-error",role:"alert"},sl={key:1,class:"monthly-error",role:"alert"},rl={key:2,class:"monthly-notice"},ul={key:3,class:"monthly-notice",role:"status"},cl={key:4,class:"monthly-notice"},hl={class:"monthly-sheet"},dl={class:"monthly-tabs",role:"tablist","aria-label":"Bảng chấm công tháng"},ml=["aria-selected"],pl=["aria-selected"],gl={key:0,class:"monthly-loading",role:"status"},yl={key:1,class:"monthly-empty"},vl={class:"monthly-error",role:"alert"},bl={id:"monthly-summary-panel",role:"tabpanel","aria-labelledby":"monthly-summary-tab"},fl={class:"monthly-toolbar"},xl={class:"monthly-subtitle"},kl={class:"monthly-columns"},wl={class:"monthly-column-options"},Cl=["onUpdate:modelValue"],Nl={class:"monthly-table-scroll monthly-summary-scroll",role:"region","aria-label":"Bảng tổng hợp công tháng, cuộn ngang và dọc để xem đầy đủ",tabindex:"0"},Tl={class:"monthly-summary"},Vl=["onClick"],$l={key:0},_l=["colspan"],Ll={id:"monthly-daily-panel",role:"tabpanel","aria-labelledby":"monthly-daily-tab"},Pl={class:"monthly-toolbar"},Sl={class:"monthly-subtitle"},El={key:0,class:"monthly-empty",role:"status"},Bl={key:1,class:"monthly-error",role:"alert"},Dl={key:0},Al={key:0,role:"status"},Ol={key:1,class:"monthly-error",role:"alert"},Fl={key:0,class:"monthly-subtitle"},Ml={key:1},Kl=["disabled"],zl={key:3,"aria-live":"polite"},Il={class:"monthly-stats"},Rl={key:0},ql={style:{overflow:"auto","max-height":"240px"}},Ul={key:0},Hl=fn({__name:"MonthlyAttendancePage",setup(e){const u=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit"}).formatToParts(new Date),t=te({thang:Number(u.find(m=>m.type==="month").value),nam:Number(u.find(m=>m.type==="year").value),maBoPhan:null,maNhanVien:null}),c=_({...t}),l=_(!1),h=_(""),i=_("summary"),k=se(),C=z(()=>k.can("attendance","update")),y=_([]),T=_(""),P=_(!1),x=z(()=>[...new Map(y.value.filter(m=>m.maBoPhan).map(m=>[m.maBoPhan,{code:m.maBoPhan,label:m.tenBoPhan||m.maBoPhan}])).values()].sort((m,a)=>m.label.localeCompare(a.label,"vi"))),v=z(()=>y.value.filter(m=>!t.maBoPhan||m.maBoPhan===t.maBoPhan).map(m=>({...m,label:m.maNhanVien+" · "+hn(m)}))),$=z(()=>y.value.find(m=>m.maNhanVien===c.value.maNhanVien)),I=_([]),g=_([]),b=_(!1),w=_(""),S=_(null),E=_(""),j=_(""),J=_(""),nn=z(()=>I.value.filter(m=>!c.value.maNhanVien||m.maNhanVien===c.value.maNhanVien)),Mn=te(lt.map(m=>({...m}))),xn=z(()=>Mn.filter(m=>m.visible)),kn=z(()=>String(c.value.thang).padStart(2,"0")+"/"+c.value.nam),R=_(!1),H=_(!1),yn=_(""),_n=_(new Set),Ln=m=>m.nam+"-"+m.thang,Xn=z(()=>_n.value.has(Ln(c.value))),mn=_(!1),N=z(()=>{var m;return C.value&&!R.value&&!H.value&&((m=S.value)==null?void 0:m.trangThai)==="O"}),d=_(!1),f=_(!1),F=_(""),M=_([]),X=_(),Z=_({...c.value}),Qn=_(),en=_(null),Wn=_(),Pn=_(!1),Kn=_(),zn=_(!1),un=_(),pn=_(""),rn=_(),Jn=_(""),Sn=_(!1);let wn=0,In=0,Cn=0,U=!1;const Rn=new Set,_e=m=>JSON.stringify(m);async function he(){P.value=!0,T.value="";try{const m=await Qe.list(null);U||(y.value=m.map(a=>({maNhanVien:a.maNhanVien,ho:a.ho,tenDem:a.tenDem,ten:a.ten,hoTen:a.hoTen,maBoPhan:a.maBoPhan,tenBoPhan:a.tenBoPhan})))}catch(m){U||(T.value=cn(m))}finally{U||(P.value=!1)}}async function Zn(){const m=++In;S.value=null,E.value="";try{const a=await re({nam:c.value.nam,thang:c.value.thang,trangThai:null});if(m!==In||U)return;a.length===1?S.value=a[0]:E.value=a.length?"Có nhiều kỳ cho tháng này.":"Chưa có kỳ chấm công cho tháng này."}catch(a){m===In&&!U&&(E.value=cn(a))}}async function Nn(m=!1){const a=++wn,p={...c.value},L=i.value,q=_e(p);if(w.value="",!m&&(L==="summary"?j.value:J.value)===q){b.value=!1;return}b.value=!0;try{if(L==="summary"){const tn=await ge(p);a===wn&&!U&&(I.value=tn,j.value=q)}else{const tn=await ne(p);a===wn&&!U&&(g.value=tn,J.value=q)}}catch(tn){a===wn&&!U&&(w.value=cn(tn),L==="summary"?(I.value=[],j.value=""):(g.value=[],J.value=""))}finally{a===wn&&!U&&(b.value=!1)}}function Le(){if(!(R.value||H.value))try{if(jn(t),t.maNhanVien&&!v.value.some(m=>m.maNhanVien===t.maNhanVien))throw new Error("Nhân viên không thuộc bộ phận đã chọn.");c.value={...t},h.value="",j.value="",J.value="",en.value=null,d.value=!1,Pn.value=!1,yn.value="",Zn(),Nn(!0)}catch(m){w.value=cn(m)}}async function Pe(){if(!(l.value||R.value||H.value)){l.value=!0,h.value="";try{const{blob:m,filename:a}=await Ht({...c.value});if(U)return;const p=URL.createObjectURL(m),L=document.createElement("a");L.href=p,L.download=a,document.body.append(L);try{L.click()}finally{L.remove(),setTimeout(()=>URL.revokeObjectURL(p),1e3)}}catch(m){U||(h.value=cn(m))}finally{U||(l.value=!1)}}}bn(()=>t.maBoPhan,()=>{t.maNhanVien&&!v.value.some(m=>m.maNhanVien===t.maNhanVien)&&(t.maNhanVien=null)}),bn(i,()=>{en.value=null,Pn.value=!1,Nn()});async function Se(m){const a=++Cn;X.value=m,Z.value={...c.value,maNhanVien:m.maNhanVien},d.value=!0,f.value=!0,F.value="",M.value=[];try{const p=await ne({...Z.value});a===Cn&&!U&&(M.value=p)}catch(p){a===Cn&&!U&&(F.value=cn(p))}finally{a===Cn&&!U&&(f.value=!1)}}bn(d,m=>{m||++Cn});async function Ee(){if(!Qn.value||f.value||F.value||!M.value.length)return;const m=document.createElement("iframe");m.title="Bản in phiếu chấm công",m.style.cssText="position:fixed;width:1px;height:1px;left:-10000px;top:0;border:0;",document.body.append(m),Rn.add(m);const a=m.contentDocument,p=m.contentWindow;if(!a||!p){m.remove(),Rn.delete(m);return}a.open(),a.write('<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Phiếu chấm công tháng</title></head><body></body></html>'),a.close();const L=a.createElement("style");L.textContent=Wt,a.head.append(L),a.body.append(a.importNode(Qn.value,!0));const q=()=>{m.remove(),Rn.delete(m)};p.addEventListener("afterprint",q,{once:!0});try{if(await a.fonts.ready,U){q();return}p.focus(),p.print()}catch(tn){yn.value="Không mở được hộp thoại in: "+cn(tn),q()}setTimeout(q,6e4)}async function Be(m,a){var tn,En;if(!ke(m,N.value).length)return;const p=a.currentTarget instanceof HTMLElement?a.currentTarget.getBoundingClientRect():null,L=a.type==="click"&&a.detail===0&&p?p.left:a.clientX,q=a.type==="click"&&a.detail===0&&p?p.bottom:a.clientY;en.value={row:m,x:Math.max(10,Math.min(L,window.innerWidth-270)),y:Math.max(10,Math.min(q,window.innerHeight-270))},await Re(),(En=(tn=Wn.value)==null?void 0:tn.querySelector("button:not(:disabled)"))==null||En.focus()}function De(m){Kn.value=m,Pn.value=!0,en.value=null}function de(m){var a,p;if(m.key==="Escape"&&(en.value=null),en.value&&["ArrowDown","ArrowUp","Home","End"].includes(m.key)){m.preventDefault();const L=Array.from(((a=Wn.value)==null?void 0:a.querySelectorAll("button:not(:disabled)"))||[]);if(!L.length)return;const q=L.indexOf(document.activeElement);(p=L[m.key==="Home"?0:m.key==="End"?L.length-1:(q+(m.key==="ArrowDown"?1:L.length-1))%L.length])==null||p.focus()}}function Tn(){en.value=null}async function Yn(m,a){if(R.value||H.value||!C.value)return;const p=a?y.value.find(q=>q.maNhanVien===a.maNhanVien)||a:$.value,L={filter:{...c.value},employee:p,day:a};en.value=null,un.value=void 0,rn.value=void 0,mn.value=!1,Jn.value="",Sn.value=!1,pn.value="",zn.value=!0,H.value=!0;try{const q=await Xt(m,L);U||(un.value=q)}catch(q){U||(pn.value=cn(q))}finally{U||(H.value=!1)}}async function Ae(){var a,p;if(!un.value||mn.value||R.value||!Sn.value||rn.value||!C.value)return;const m=un.value;R.value=!0,pn.value="";try{const L=await Qt(m);if(U)return;rn.value=L.data,Jn.value=L.message,j.value="",J.value="",m.kind!=="month"?_n.value.add(Ln(m.context.filter)):!m.context.filter.maNhanVien&&!m.context.filter.maBoPhan&&_n.value.delete(Ln(m.context.filter));const q=Number(((a=L.data.thongKe)==null?void 0:a.soDongBoQuaKhongCapNhat)??((p=L.data.thongKe)==null?void 0:p.soNhanVienBoQuaDaKhoa)??0);yn.value=q>0?"Máy chủ trả kết quả có "+q+" dòng/nhân viên bị bỏ qua. Xem thống kê chi tiết.":L.message,await Promise.allSettled([Nn(!0),Zn()])}catch(L){U||(mn.value=!0,pn.value=cn(L)+" Kết quả ghi có thể chưa xác định; hãy kiểm tra lại dữ liệu trước khi tính lại.")}finally{U||(R.value=!1)}}async function Oe(){if(!(!un.value||R.value)){R.value=!0;try{const m=un.value.context;un.value.kind==="person"?await ne({...m.filter,maNhanVien:m.employee.maNhanVien}):await ge(m.filter),await Nn(!0),mn.value=!1,pn.value="Đã tải lại dữ liệu. Kiểm tra kết quả trước khi quyết định gửi lại yêu cầu."}catch(m){pn.value=cn(m)}finally{R.value=!1}}}return Ke(()=>{Promise.allSettled([he(),Zn(),Nn()]),document.addEventListener("click",Tn),document.addEventListener("keydown",de),window.addEventListener("resize",Tn),window.addEventListener("scroll",Tn,!0)}),ze(()=>{U=!0,++wn,++Cn,++In,document.removeEventListener("click",Tn),document.removeEventListener("keydown",de),window.removeEventListener("resize",Tn),window.removeEventListener("scroll",Tn,!0),Rn.forEach(m=>m.remove())}),(m,a)=>(o(),s("section",{class:"monthly-page","aria-busy":R.value},[n("header",Zt,[n("div",null,[a[17]||(a[17]=n("h1",null,"Bảng chấm công tháng",-1)),n("p",null,[A(" Tháng "+r(kn.value),1),S.value?(o(),s(B,{key:0},[A(" · "+r(V(Je)[S.value.trangThai]||S.value.trangThai)+" · "+r(V(Y)(S.value.tuNgay))+" – "+r(V(Y)(S.value.denNgay)),1),S.value.ngayChot?(o(),s(B,{key:0},[A(" · Chốt: "+r(V(Y)(S.value.ngayChot)),1)],64)):K("",!0)],64)):K("",!0)])]),n("div",Yt,[G(ln,{label:"Xuất Excel",icon:"pi pi-file-excel",severity:"success",outlined:"",loading:l.value,disabled:l.value||R.value||H.value,onClick:Pe},null,8,["loading","disabled"]),G(ln,{label:"Chấm công ngày hàng loạt",icon:"pi pi-calendar",severity:"secondary",outlined:"",disabled:!C.value||R.value||H.value,onClick:a[0]||(a[0]=p=>Yn("batch"))},null,8,["disabled"]),G(ln,{label:"Chấm công tháng",icon:"pi pi-calculator",disabled:!C.value||R.value||H.value,onClick:a[1]||(a[1]=p=>Yn("month"))},null,8,["disabled"])])]),n("form",{class:"monthly-filters",onSubmit:Un(Le,["prevent"])},[n("label",null,[a[18]||(a[18]=A("Tháng",-1)),on(n("select",{"onUpdate:modelValue":a[2]||(a[2]=p=>t.thang=p),disabled:R.value||H.value},[(o(),s(B,null,O(12,p=>n("option",{key:p,value:p},"Tháng "+r(p),9,el)),64))],8,nl),[[Dn,t.thang,void 0,{number:!0}]])]),n("label",null,[a[19]||(a[19]=A("Năm",-1)),on(n("input",{"onUpdate:modelValue":a[3]||(a[3]=p=>t.nam=p),type:"number",min:"100",max:"9998",required:"",disabled:R.value||H.value},null,8,tl),[[le,t.nam,void 0,{number:!0}]])]),n("label",null,[a[21]||(a[21]=A("Bộ phận",-1)),on(n("select",{"onUpdate:modelValue":a[4]||(a[4]=p=>t.maBoPhan=p),disabled:R.value||H.value||P.value},[a[20]||(a[20]=n("option",{value:null},"Tất cả bộ phận",-1)),(o(!0),s(B,null,O(x.value,p=>(o(),s("option",{key:p.code,value:p.code},r(p.label),9,al))),128))],8,ll),[[Dn,t.maBoPhan]])]),n("label",ol,[a[22]||(a[22]=A("Nhân viên",-1)),G(V(Xe),{modelValue:t.maNhanVien,"onUpdate:modelValue":a[5]||(a[5]=p=>t.maNhanVien=p),options:v.value,"option-label":"label","option-value":"maNhanVien",filter:"","show-clear":"",placeholder:"Tất cả / tìm mã hoặc họ tên",disabled:R.value||H.value||P.value,loading:P.value,"aria-label":"Chọn nhân viên"},null,8,["modelValue","options","disabled","loading"])]),G(ln,{type:"submit",label:"Áp dụng",icon:"pi pi-filter",disabled:R.value||H.value},null,8,["disabled"])],32),h.value?(o(),s("p",il,r(h.value),1)):K("",!0),T.value?(o(),s("p",sl,[A(" Không tải được danh mục: "+r(T.value)+" ",1),n("button",{type:"button",onClick:he},"Thử lại")])):K("",!0),E.value?(o(),s("p",rl,r(E.value),1)):K("",!0),yn.value?(o(),s("p",ul,r(yn.value),1)):K("",!0),Xn.value?(o(),s("p",cl," Dữ liệu công ngày đã được xử lý. Cần chấm công tháng để cập nhật tổng hợp nếu backend không tổng hợp tự động. ")):K("",!0),n("div",hl,[n("div",dl,[n("button",{id:"monthly-summary-tab",type:"button",role:"tab","aria-selected":i.value==="summary","aria-controls":"monthly-summary-panel",onClick:a[6]||(a[6]=p=>i.value="summary")}," Tổng hợp công tháng",8,ml),n("button",{id:"monthly-daily-tab",type:"button",role:"tab","aria-selected":i.value==="daily","aria-controls":"monthly-daily-panel",onClick:a[7]||(a[7]=p=>i.value="daily")}," Chi tiết công tháng ",8,pl)]),b.value?(o(),s("div",gl,[(o(),s(B,null,O(4,p=>n("span",{key:p})),64)),a[23]||(a[23]=n("p",null,"Đang tải dữ liệu công tháng…",-1))])):w.value?(o(),s("div",yl,[n("p",vl,r(w.value),1),G(ln,{label:"Thử lại",onClick:a[8]||(a[8]=p=>Nn(!0))})])):K("",!0),on(n("section",bl,[n("div",fl,[n("div",null,[n("h2",null,"Tổng hợp tháng "+r(kn.value),1),n("p",xl,r(nn.value.length)+" nhân viên · Nhấn họ tên để xem và in phiếu ",1)]),n("details",kl,[a[24]||(a[24]=n("summary",null,"Chọn cột hiển thị",-1)),n("div",wl,[(o(!0),s(B,null,O(Mn,p=>(o(),s("label",{key:p.key},[on(n("input",{"onUpdate:modelValue":L=>p.visible=L,type:"checkbox"},null,8,Cl),[[pe,p.visible]]),A(r(p.label),1)]))),128))])])]),n("div",Nl,[n("table",Tl,[n("colgroup",null,[a[25]||(a[25]=n("col",{class:"summary-code-col"},null,-1)),a[26]||(a[26]=n("col",{class:"summary-name-col"},null,-1)),a[27]||(a[27]=n("col",{class:"summary-dept-col"},null,-1)),(o(!0),s(B,null,O(xn.value,p=>(o(),s("col",{key:p.key,class:"summary-data-col"}))),128))]),n("thead",null,[n("tr",null,[a[28]||(a[28]=n("th",{scope:"col"},"Mã nhân viên",-1)),a[29]||(a[29]=n("th",{scope:"col"},"Họ và tên",-1)),a[30]||(a[30]=n("th",{scope:"col"},"Bộ phận",-1)),(o(!0),s(B,null,O(xn.value,p=>(o(),s("th",{key:p.key,scope:"col"},r(p.label),1))),128))])]),n("tbody",null,[(o(!0),s(B,null,O(nn.value,p=>(o(),s("tr",{key:p.maNhanVien},[n("td",null,r(p.maNhanVien),1),n("td",null,[n("button",{type:"button",class:"monthly-name",onClick:L=>Se(p)},r(V(hn)(p)),9,Vl)]),n("td",null,r(p.tenBoPhan||p.maBoPhan||"—"),1),(o(!0),s(B,null,O(xn.value,L=>(o(),s("td",{key:L.key},r(V(fe)(p[L.key],L.hours)),1))),128))]))),128)),nn.value.length?K("",!0):(o(),s("tr",$l,[n("td",{colspan:xn.value.length+3},[...a[31]||(a[31]=[n("div",{class:"monthly-empty"},"Không có dữ liệu công tháng theo bộ lọc.",-1)])],8,_l)]))])])])],512),[[me,i.value==="summary"&&!b.value&&!w.value]]),on(n("section",Ll,[n("div",Pl,[n("div",null,[n("h2",null,"Chi tiết công tháng "+r(kn.value),1),n("p",Sl," Danh sách nhân viên · Các cột ngày 1–"+r(new Date(c.value.nam,c.value.thang,0).getDate())+" · Ký hiệu công và nghỉ phép ",1)])]),G(Rt,{rows:g.value,employees:y.value,filter:c.value,"allow-actions":N.value,onMenu:Be,onDetail:De},null,8,["rows","employees","filter","allow-actions"])],512),[[me,i.value==="daily"&&!b.value&&!w.value]])]),(o(),vn(Ie,{to:"body"},[en.value&&N.value?(o(),s("div",{key:0,ref_key:"menuElement",ref:Wn,class:"monthly-context-menu",role:"menu","aria-label":"Xử lý công ngày",style:an({left:en.value.x+"px",top:en.value.y+"px"}),onClick:a[10]||(a[10]=Un(()=>{},["stop"]))},[n("p",null,r(V(Y)(en.value.row.ngayChamCong))+" · "+r(V(hn)(en.value.row)),1),n("button",{role:"menuitem",type:"button",onClick:a[9]||(a[9]=p=>Yn("person",en.value.row))}," Tính lại công ")],4)):K("",!0)])),G(V(ae),{visible:d.value,"onUpdate:visible":a[12]||(a[12]=p=>d.value=p),modal:"",header:"Phiếu chấm công tháng",style:{width:"1080px",maxWidth:"96vw"}},{footer:dn(()=>[G(ln,{label:"Đóng",severity:"secondary",outlined:"",onClick:a[11]||(a[11]=p=>d.value=!1)}),G(ln,{label:"In phiếu",icon:"pi pi-print",disabled:f.value||!!F.value||!M.value.length,onClick:Ee},null,8,["disabled"])]),default:dn(()=>{var p,L,q,tn,En;return[f.value?(o(),s("div",El,"Đang tải phiếu chấm công…")):F.value?(o(),s("p",Bl,r(F.value),1)):(o(),s("div",{key:2,ref_key:"reportElement",ref:Qn,class:"monthly-report"},[n("h2",null," PHIẾU CHẤM CÔNG THÁNG "+r(String(Z.value.thang).padStart(2,"0"))+"/"+r(Z.value.nam),1),n("p",null,[n("strong",null,r(V(hn)(X.value)),1),A(" · "+r((p=X.value)==null?void 0:p.maNhanVien)+" · "+r(((L=X.value)==null?void 0:L.tenBoPhan)||((q=X.value)==null?void 0:q.maBoPhan)||"—"),1)]),n("p",null," Kỳ công: "+r(V(Y)((tn=M.value[0])==null?void 0:tn.tuNgay))+" – "+r(V(Y)((En=M.value[0])==null?void 0:En.denNgay)),1),M.value.length?K("",!0):(o(),s("p",Dl,"Chưa có dữ liệu chấm công.")),G(Tt,{rows:M.value,year:Z.value.nam,month:Z.value.thang,readonly:""},null,8,["rows","year","month"])],512))]}),_:1},8,["visible"]),G(V(ae),{visible:zn.value,"onUpdate:visible":a[15]||(a[15]=p=>zn.value=p),modal:"",header:"Xác nhận tính công",closable:!R.value&&!H.value,"close-on-escape":!R.value&&!H.value,style:{width:"640px",maxWidth:"96vw"}},{footer:dn(()=>[G(ln,{label:"Đóng",severity:"secondary",outlined:"",disabled:R.value||H.value,onClick:a[14]||(a[14]=p=>zn.value=!1)},null,8,["disabled"]),mn.value?(o(),vn(ln,{key:0,label:"Kiểm tra lại dữ liệu",loading:R.value,onClick:Oe},null,8,["loading"])):K("",!0),rn.value?K("",!0):(o(),vn(ln,{key:1,label:"Thực hiện tính công",icon:"pi pi-calculator",loading:R.value,disabled:mn.value||!un.value||!Sn.value||H.value||R.value||!C.value,onClick:Ae},null,8,["loading","disabled"]))]),default:dn(()=>{var p;return[H.value?(o(),s("p",Al,"Đang kiểm tra kỳ và phạm vi tính công…")):K("",!0),pn.value?(o(),s("p",Ol,r(pn.value),1)):K("",!0),un.value?(o(),s(B,{key:2},[n("ul",null,[(o(!0),s(B,null,O(un.value.scope,L=>(o(),s("li",{key:L},r(L),1))),128))]),rn.value?K("",!0):(o(),s("p",Fl," Chỉ cập nhật phạm vi trên. Các dòng bị khóa có thể bị bỏ qua theo kết quả máy chủ. ")),rn.value?K("",!0):(o(),s("label",Ml,[on(n("input",{"onUpdate:modelValue":a[13]||(a[13]=L=>Sn.value=L),type:"checkbox",disabled:R.value},null,8,Kl),[[pe,Sn.value]]),a[32]||(a[32]=A(" Tôi xác nhận phạm vi tính công.",-1))]))],64)):K("",!0),rn.value?(o(),s("section",zl,[a[34]||(a[34]=n("h3",null,"Kết quả máy chủ",-1)),n("p",null,r(Jn.value),1),n("p",null,"Mã trả về: "+r(rn.value.returnCode??"—"),1),n("dl",Il,[(o(!0),s(B,null,O(rn.value.thongKe||{},(L,q)=>(o(),s("div",{key:q},[n("dt",null,r(V(at)[String(q)]||q),1),n("dd",null,r(L??"—"),1)]))),128))]),(p=rn.value.resultSets)!=null&&p.length?(o(),s("details",Rl,[a[33]||(a[33]=n("summary",null,"Kết quả chi tiết",-1)),n("pre",ql,r(JSON.stringify(rn.value.resultSets,null,2)),1)])):K("",!0)])):K("",!0)]}),_:1},8,["visible","closable","close-on-escape"]),G(V(je),{visible:Pn.value,"onUpdate:visible":a[16]||(a[16]=p=>Pn.value=p),position:"right",header:"Chi tiết công ngày",style:{width:"400px",maxWidth:"95vw"}},{default:dn(()=>[Kn.value?(o(),s("p",Ul,r(V(hn)(Kn.value))+" · "+r(V(Y)(Kn.value.ngayChamCong)),1)):K("",!0),a[35]||(a[35]=n("p",{class:"monthly-notice"},"Nội dung chi tiết công ngày sẽ được phát triển sau.",-1))]),_:1},8,["visible"])],8,Jt))}}),Vn=[{key:"monthly",title:"Chi tiết tháng",subtitle:"Monthly timesheet",icon:"pi-table"},{key:"late",title:"Đi muộn / Về sớm",subtitle:"Late in · Early out",icon:"pi-clock"},{key:"overtime",title:"Tăng ca / Làm thêm",subtitle:"Overtime · OT",icon:"pi-moon"},{key:"anomaly",title:"Bất thường quẹt thẻ",subtitle:"Attendance anomaly",icon:"pi-exclamation-triangle"},{key:"payroll",title:"Tổng hợp công & Phép",subtitle:"Payroll attendance",icon:"pi-calculator"}],$e=["Khoa Khám bệnh","Khoa Cấp cứu","Khoa Nội","Khoa Ngoại","Phòng Điều dưỡng","Phòng Hành chính"],Gl=["Nguyễn Minh Anh","Trần Hoàng Nam","Lê Thu Hà","Phạm Quang Huy","Võ Ngọc Linh","Đặng Đức Anh","Bùi Thanh Mai","Đỗ Hải Đăng","Hồ Phương Thảo","Ngô Tuấn Kiệt","Dương Bảo Ngọc","Lý Minh Quân","Nguyễn Thảo Vy","Trần Quốc Bảo","Lê Khánh Chi","Phạm Anh Dũng","Vũ Hoài An","Đinh Nhật Minh","Hoàng Kim Ngân","Đào Gia Hưng","Mai Ngọc Ánh","Phan Trung Hiếu","Tạ Hồng Nhung","Cao Bảo Long"],ie=Gl.map((e,u)=>({code:"NV"+String(u+1).padStart(4,"0"),name:e,department:$e[Math.floor(u/4)],seed:u}));function ce(e){const[u,t]=e.split("-").map(Number);return!Number.isInteger(u)||u<2e3||u>2100||!t||t>12?[]:Array.from({length:new Date(u,t,0).getDate()},(c,l)=>{const h=l+1,i=new Date(u,t-1,h).getDay();return{day:h,weekend:i===0||i===6,weekday:["CN","T2","T3","T4","T5","T6","T7"][i]}})}const qn=e=>String(Math.floor(e/60)%24).padStart(2,"0")+":"+String(e%60).padStart(2,"0");function jl(e){return ie.flatMap(u=>ce(e).map(({day:t,weekend:c})=>{const l=(u.seed*13+t*7)%97,h=c&&(u.seed+t)%4!==0,i=!h&&l%23===0,k=!h&&!i&&l===51,C=h||i||k?"":l%19===0?"Thiếu giờ vào":l%17===0?"Thiếu giờ ra":l===43?"Quẹt thẻ trùng":"",y=!h&&!i&&!k,T=y&&!C&&l%9===0?5+l%26:0,P=y&&!C&&l%11===0?10+l%21:0,x=y&&!C&&!P&&l%4===0?1+l%5*.5:0,v=u.seed%5===0,$=v?1140:450,I=v?420:990;return{code:u.code,day:t,date:`${e}-${String(t).padStart(2,"0")}`,weekend:c,symbol:h?"OFF":i?"P":k?"V":C?"?":T?"M":P?"S":"X",shift:v?"Đêm":"Hành chính",scheduledIn:qn($),scheduledOut:qn(I),checkIn:!y||C==="Thiếu giờ vào"?"—":qn($+T),checkOut:!y||C==="Thiếu giờ ra"?"—":qn(I-P+x*60),late:T,early:P,ot:x,nightOt:v?x:0,approved:l%3!==0,anomaly:C}}))}const D=(e,u,t,c=110,l=!1)=>({key:e,label:u,group:t,width:c,numeric:l,total:l}),Xl=()=>[D("code","Mã nhân viên","Nhân sự",108),D("name","Họ và tên","Nhân sự",190),D("department","Bộ phận","Đơn vị",175)],gn=(e,u)=>e.reduce((t,c)=>t+c[u],0);function Ql(e,u){const t=jl(u),c=ie.map(i=>{const k=t.filter(T=>T.code===i.code),C=k.filter(T=>["X","M","S"].includes(T.symbol)).length,y=k.filter(T=>T.symbol==="P").length;return{...i,days:k,work:C,leave:y}});let l=Xl(),h=[];return e==="monthly"?(l=[...l,...ce(u).map(i=>({...D("d"+i.day,String(i.day).padStart(2,"0")+" · "+i.weekday,"Ngày trong tháng",62),weekend:i.weekend})),D("work","Công thực tế","Tổng hợp",110,!0),D("leave","Phép năm","Tổng hợp",100,!0),D("ot","OT (giờ)","Tổng hợp",100,!0),D("issues","Bất thường","Tổng hợp",110,!0)],h=c.map(i=>({id:i.code,code:i.code,name:i.name,department:i.department,...Object.fromEntries(i.days.map(k=>["d"+k.day,k.symbol])),work:i.work,leave:i.leave,ot:gn(i.days,"ot"),issues:i.days.filter(k=>k.anomaly).length}))):e==="late"||e==="anomaly"?(l=[...l,D("date","Ngày","Lịch làm việc",112),D("shift","Ca làm việc","Lịch làm việc",120),D("scheduledIn","Vào theo ca","Theo ca",100),D("scheduledOut","Ra theo ca","Theo ca",100),D("checkIn","Giờ vào","Thực tế",100),D("checkOut","Giờ ra","Thực tế",100)],l.push(...e==="late"?[D("late","Muộn (phút)","Chênh lệch",115,!0),D("early","Sớm (phút)","Chênh lệch",115,!0),D("status","Loại vi phạm","Đánh giá",155)]:[D("anomaly","Bất thường","Đánh giá",170),D("level","Mức độ","Đánh giá",120),D("status","Xử lý","Đánh giá",150)]),h=t.filter(i=>e==="late"?i.late>0||i.early>0:!!i.anomaly).map(i=>{const k=ie.find(C=>C.code===i.code);return{id:i.code+i.date,code:i.code,name:k.name,department:k.department,date:i.date.split("-").reverse().join("/"),shift:i.shift,scheduledIn:i.scheduledIn,scheduledOut:i.scheduledOut,checkIn:i.checkIn,checkOut:i.checkOut,late:i.late,early:i.early,anomaly:i.anomaly,status:e==="late"?i.late&&i.early?"Muộn & về sớm":i.late?"Đi muộn":"Về sớm":i.day%3===0?"Đã giải trình":"Chờ xử lý",level:i.anomaly==="Quẹt thẻ trùng"?"Cần kiểm tra":"Ưu tiên cao"}})):e==="overtime"?(l=[...l,D("weekdayOt","Ngày thường","Giờ tăng ca",120,!0),D("weekendOt","Ngày nghỉ","Giờ tăng ca",120,!0),D("nightOt","Trong đó: đêm","Giờ tăng ca",130,!0),D("ot","Tổng OT","Giờ tăng ca",110,!0),D("approvedOt","Đã duyệt","Phê duyệt (giờ)",120,!0),D("pendingOt","Chờ duyệt","Phê duyệt (giờ)",120,!0),D("status","Trạng thái","Phê duyệt (giờ)",145)],h=c.filter(i=>gn(i.days,"ot")>0).map(i=>{const k=gn(i.days.filter(y=>y.approved),"ot"),C=gn(i.days,"ot");return{id:i.code,code:i.code,name:i.name,department:i.department,weekdayOt:gn(i.days.filter(y=>!y.weekend),"ot"),weekendOt:gn(i.days.filter(y=>y.weekend),"ot"),nightOt:gn(i.days,"nightOt"),ot:C,approvedOt:k,pendingOt:C-k,status:C===k?"Đã duyệt":"Chờ duyệt"}})):(l=[...l,D("scheduled","Ngày theo lịch","Công trong tháng",125,!0),D("work","Công thực tế","Công trong tháng",120,!0),D("leave","Nghỉ phép","Công trong tháng",105,!0),D("unpaid","Vắng không lương","Công trong tháng",145,!0),D("unverified","Chưa xác minh","Công trong tháng",130,!0),D("paid","Công hưởng lương","Công trong tháng",150,!0),D("openingLeave","Đầu kỳ","Phép năm (ngày)",95,!0),D("accruedLeave","Phát sinh","Phép năm (ngày)",100,!0),D("usedLeave","Đã dùng","Phép năm (ngày)",95,!0),D("closingLeave","Còn lại","Phép năm (ngày)",95,!0),D("ot","OT (giờ)","Làm thêm",100,!0),D("status","Đối soát","Đối soát",155)],h=c.map(i=>{const k=i.days.filter(y=>y.anomaly).length,C=4+i.seed%5;return{id:i.code,code:i.code,name:i.name,department:i.department,scheduled:i.days.filter(y=>y.symbol!=="OFF").length,work:i.work,leave:i.leave,unpaid:i.days.filter(y=>y.symbol==="V").length,unverified:k,paid:i.work+i.leave,openingLeave:C,accruedLeave:1,usedLeave:i.leave,closingLeave:C+1-i.leave,ot:gn(i.days,"ot"),status:k?"Cần đối soát":"Đã đối soát"}})),{columns:l,rows:h,records:t}}function ve(e){let u="";for(let t=e+1;t>0;t=Math.floor((t-1)/26))u=String.fromCharCode(65+(t-1)%26)+u;return u}const An=e=>new Intl.NumberFormat("vi-VN",{maximumFractionDigits:2}).format(e);function Wl(e,u){return u.startsWith("d")&&/^d\d+$/.test(u)?{X:"work",P:"leave",OFF:"off",M:"warn",S:"warn",V:"danger","?":"danger"}[String(e)]||"":["late","early","pendingOt","unverified","issues"].includes(u)&&Number(e)>0?"warn":["ot","paid","closingLeave"].includes(u)?"emphasis":""}const Jl={class:"excel-sheet"},Zl={class:"excel-formula-bar"},Yl={class:"excel-address"},na={class:"excel-formula-value"},ea={class:"report-sr-only"},ta={class:"excel-letters"},la={class:"excel-groups"},aa=["colspan"],oa={class:"excel-labels"},ia=["aria-sort"],sa=["aria-label","onClick"],ra={scope:"row",class:"excel-row-number"},ua=["data-cell","tabindex","onFocus","onClick","onKeydown"],ca=["onClick"],ha={key:0},da=["colspan"],ma={key:0},pa=fn({__name:"ExcelReportSheet",props:{columns:{},rows:{},allRows:{},offset:{},sortKey:{},sortDirection:{}},emits:["sort","open"],setup(e,{emit:u}){const t=e,c=u,l=_(null),h=_(),i=z(()=>{const x=[];for(const v of t.columns){const $=x.at(-1);($==null?void 0:$.label)===v.group?$.span++:x.push({label:v.group,span:1})}return x}),k=z(()=>44+t.columns.reduce((x,v)=>x+v.width,0)),C=z(()=>Object.fromEntries(t.columns.filter(x=>x.total).map(x=>[x.key,t.allRows.reduce((v,$)=>v+Number($[x.key]||0),0)]))),y=z(()=>{if(!l.value)return null;const x=t.columns[l.value.col],v=t.rows[l.value.row];return x&&v?{address:ve(l.value.col)+(t.offset+l.value.row+1),value:v[x.key],row:v}:null});bn(()=>[t.columns,t.rows],()=>{l.value=null});const T=x=>x<2?{left:(x===0?44:44+t.columns[0].width)+"px"}:void 0;function P(x,v,$){var w,S;const I={ArrowDown:[1,0],ArrowUp:[-1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]};if(!I[x.key])return;x.preventDefault();const[g,b]=I[x.key];v=Math.max(0,Math.min(t.rows.length-1,v+g)),$=Math.max(0,Math.min(t.columns.length-1,$+b)),l.value={row:v,col:$},(S=(w=h.value)==null?void 0:w.querySelector(`[data-cell="${v}-${$}"]`))==null||S.focus()}return(x,v)=>{var $,I;return o(),s("div",Jl,[n("div",Zl,[n("span",Yl,r((($=y.value)==null?void 0:$.address)||"A1"),1),v[2]||(v[2]=n("span",{class:"excel-fx","aria-hidden":"true"},"ƒx",-1)),n("span",na,r(((I=y.value)==null?void 0:I.value)??"Chọn một ô để xem giá trị · Dùng phím mũi tên để di chuyển"),1),y.value?(o(),s("button",{key:0,type:"button",class:"report-text-button",onClick:v[0]||(v[0]=g=>c("open",y.value.row))},[...v[1]||(v[1]=[A(" Xem chi tiết ",-1),n("i",{class:"pi pi-arrow-up-right"},null,-1)])])):K("",!0)]),n("div",{ref_key:"viewport",ref:h,class:"excel-viewport",tabindex:"0",role:"region","aria-label":"Bảng báo cáo kiểu Excel, cuộn ngang và dọc để xem các cột"},[n("table",{class:"excel-table",style:an({width:k.value+"px"})},[n("caption",ea," Báo cáo chấm công · "+r(e.allRows.length)+" bản ghi. Nhấn họ tên để xem chi tiết. ",1),n("colgroup",null,[v[3]||(v[3]=n("col",{style:{width:"44px"}},null,-1)),(o(!0),s(B,null,O(e.columns,g=>(o(),s("col",{key:g.key,style:an({width:g.width+"px"})},null,4))),128))]),n("thead",null,[n("tr",ta,[v[4]||(v[4]=n("th",{class:"excel-row-number","aria-label":"Số dòng"},[n("i",{class:"pi pi-table"})],-1)),(o(!0),s(B,null,O(e.columns,(g,b)=>(o(),s("th",{key:g.key,class:Q({"excel-frozen":b<2}),style:an(T(b))},r(V(ve)(b)),7))),128))]),n("tr",la,[v[5]||(v[5]=n("th",{class:"excel-row-number"},null,-1)),(o(!0),s(B,null,O(i.value,(g,b)=>(o(),s("th",{key:g.label,colspan:g.span,scope:"colgroup",class:Q({"excel-frozen":b===0}),style:an(b===0?{left:"44px"}:void 0)},r(g.label),15,aa))),128))]),n("tr",oa,[v[6]||(v[6]=n("th",{class:"excel-row-number"},"#",-1)),(o(!0),s(B,null,O(e.columns,(g,b)=>(o(),s("th",{key:g.key,scope:"col","aria-sort":e.sortKey===g.key?e.sortDirection===1?"ascending":"descending":void 0,class:Q({"excel-frozen":b<2,"excel-weekend":g.weekend}),style:an(T(b))},[n("button",{type:"button","aria-label":"Sắp xếp theo "+g.label,onClick:w=>c("sort",g.key)},[A(r(g.label),1),n("i",{class:Q(["pi",e.sortKey===g.key?e.sortDirection===1?"pi-sort-amount-up-alt":"pi-sort-amount-down":"pi-sort-alt"])},null,2)],8,sa)],14,ia))),128))])]),n("tbody",null,[(o(!0),s(B,null,O(e.rows,(g,b)=>{var w;return o(),s("tr",{key:g.id,class:Q({"excel-selected-row":((w=l.value)==null?void 0:w.row)===b})},[n("th",ra,r(e.offset+b+1),1),(o(!0),s(B,null,O(e.columns,(S,E)=>{var j,J;return o(),s("td",{key:S.key,"data-cell":`${b}-${E}`,tabindex:l.value?l.value.row===b&&l.value.col===E?0:-1:b===0&&E===0?0:-1,class:Q(["excel-cell","cell-"+V(Wl)(g[S.key],S.key),{"excel-frozen":E<2,"excel-numeric":S.numeric,"excel-weekend":S.weekend,"excel-selected-cell":((j=l.value)==null?void 0:j.row)===b&&((J=l.value)==null?void 0:J.col)===E}]),style:an(T(E)),onFocus:nn=>l.value={row:b,col:E},onClick:nn=>l.value={row:b,col:E},onKeydown:nn=>P(nn,b,E)},[S.key==="name"?(o(),s("button",{key:0,class:"excel-employee",type:"button",onClick:nn=>c("open",g)},r(g.name),9,ca)):S.key==="status"||S.key==="level"?(o(),s("span",{key:1,class:Q(["report-cell-status",["Đã duyệt","Đã đối soát","Đã giải trình"].includes(String(g[S.key]))?"is-success":g[S.key]==="Ưu tiên cao"?"is-danger":"is-warning"])},r(g[S.key]),3)):(o(),s(B,{key:2},[A(r(typeof g[S.key]=="number"?V(An)(Number(g[S.key])):g[S.key]),1)],64))],46,ua)}),128))],2)}),128)),e.rows.length?K("",!0):(o(),s("tr",ha,[n("td",{colspan:e.columns.length+1,class:"excel-empty"},[...v[7]||(v[7]=[n("i",{class:"pi pi-search"},null,-1),n("strong",null,"Không tìm thấy dữ liệu",-1),n("span",null,"Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.",-1)])],8,da)]))]),e.allRows.length?(o(),s("tfoot",ma,[n("tr",null,[v[8]||(v[8]=n("th",{class:"excel-row-number"},"Σ",-1)),(o(!0),s(B,null,O(e.columns,(g,b)=>(o(),s("td",{key:g.key,class:Q({"excel-frozen":b<2,"excel-numeric":g.numeric}),style:an(T(b))},r(b===0?"TỔNG CỘNG":b===1?e.allRows.length+" bản ghi":g.total?V(An)(C.value[g.key]):"—"),7))),128))])])):K("",!0)],4)],512)])}}}),ga={class:"attendance-reports"},ya={class:"report-tabs",role:"tablist","aria-label":"Loại báo cáo chấm công"},va=["id","tabindex","aria-selected","onClick","onKeydown"],ba={class:"report-tab-icon"},fa={class:"report-tab-number"},xa={class:"report-filter-actions"},ka={class:"report-period-note"},wa={key:0,class:"report-error",role:"alert"},Ca={class:"report-metrics"},Na=["aria-labelledby"],Ta={class:"report-panel-heading"},Va={class:"report-table-tools"},$a={class:"report-search"},_a=["value"],La={key:0,class:"report-feedback",role:"status"},Pa={class:"report-pagination"},Sa=["disabled"],Ea={class:"report-page-current"},Ba=["disabled"],Da={class:"report-sheet-footer"},Aa={key:1,class:"report-legend"},Oa={key:2,class:"report-explanation"},Fa={key:3,class:"report-explanation"},Ma={key:0,class:"report-detail"},Ka={class:"report-detail-person"},za={class:"report-detail-values"},Ia={class:"report-detail-caption"},Ra={class:"report-detail-scroll"},qa={class:"report-detail-table"},Ua=fn({__name:"AttendanceReportsPage",setup(e){const u=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit"}).formatToParts(new Date),t=u.find(N=>N.type==="year").value+"-"+u.find(N=>N.type==="month").value,c=te({period:t,department:""}),l=_({...c}),h=_("monthly"),i=_(""),k=_(""),C=_(1),y=_(20),T=_({key:"",direction:1}),P=_(null),x=_(!1),v=_(""),$=_(""),I=z(()=>Ql(h.value,l.value.period)),g=z(()=>Vn.find(N=>N.key===h.value)),b=z(()=>l.value.period.split("-").reverse().join("/")),w=z(()=>({monthly:[{value:"issues",label:"Có bất thường"}],late:[{value:"late",label:"Đi muộn"},{value:"early",label:"Về sớm"}],overtime:[{value:"pendingOt",label:"Có giờ chờ duyệt"},{value:"approved",label:"Đã duyệt toàn bộ"}],anomaly:[{value:"Chờ xử lý",label:"Chờ xử lý"},{value:"Đã giải trình",label:"Đã giải trình"}],payroll:[{value:"Cần đối soát",label:"Cần đối soát"},{value:"Đã đối soát",label:"Đã đối soát"}]})[h.value]),S=N=>N.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/gi,"d").toLocaleLowerCase("vi"),E=z(()=>I.value.rows.filter(N=>l.value.department&&N.department!==l.value.department||i.value&&!S(N.name+" "+N.code).includes(S(i.value.trim()))?!1:k.value?["issues","late","early","pendingOt"].includes(k.value)?Number(N[k.value])>0:k.value==="approved"?N.pendingOt===0:N.status===k.value:!0)),j=z(()=>[...E.value].sort((N,d)=>{if(!T.value.key)return 0;const f=N[T.value.key],F=d[T.value.key];return(typeof f=="number"&&typeof F=="number"?f-F:String(f).localeCompare(String(F),"vi"))*T.value.direction})),J=z(()=>Math.max(1,Math.ceil(j.value.length/y.value))),nn=z(()=>(C.value-1)*y.value),Mn=z(()=>j.value.slice(nn.value,nn.value+y.value)),xn=z(()=>{const N=E.value,d=M=>An(N.reduce((X,Z)=>X+Number(Z[M]||0),0)),f=new Set(N.map(M=>M.code)).size;return{monthly:[["Nhân viên",String(f),"pi-users","Theo phạm vi báo cáo"],["Công thực tế",d("work"),"pi-calendar-plus","Ngày công đã xác minh"],["Giờ tăng ca",d("ot"),"pi-moon","Tổng OT trong tháng"],["Bất thường",d("issues"),"pi-exclamation-triangle","Dòng cần kiểm tra"]],late:[["Lượt vi phạm",String(N.length),"pi-clock",`${f} nhân viên có phát sinh`],["Đi muộn",d("late"),"pi-sign-in","Tổng số phút"],["Về sớm",d("early"),"pi-sign-out","Tổng số phút"],["Bình quân / lượt",N.length?An(N.reduce((M,X)=>M+Number(X.late)+Number(X.early),0)/N.length):"0","pi-chart-bar","Phút chênh lệch"]],overtime:[["Nhân viên có OT",String(f),"pi-users","Có phát sinh trong tháng"],["Tổng giờ tăng ca",d("ot"),"pi-moon","Ngày thường + ngày nghỉ"],["Đã phê duyệt",d("approvedOt"),"pi-check-circle","Giờ OT đã duyệt"],["Chờ phê duyệt",d("pendingOt"),"pi-hourglass","Giờ OT cần xác nhận"]],anomaly:[["Bản ghi bất thường",String(N.length),"pi-exclamation-triangle",`${f} nhân viên liên quan`],["Thiếu giờ vào",String(N.filter(M=>M.anomaly==="Thiếu giờ vào").length),"pi-sign-in","Chưa có log vào"],["Thiếu giờ ra",String(N.filter(M=>M.anomaly==="Thiếu giờ ra").length),"pi-sign-out","Chưa có log ra"],["Chờ xử lý",String(N.filter(M=>M.status==="Chờ xử lý").length),"pi-hourglass","Cần bổ sung / giải trình"]],payroll:[["Công hưởng lương",d("paid"),"pi-wallet","Công thực tế + phép có lương"],["Phép đã sử dụng",d("usedLeave"),"pi-calendar-minus","Ngày phép trong kỳ"],["Quỹ phép còn lại",d("closingLeave"),"pi-calendar","Tổng ngày phép cuối kỳ"],["Cần đối soát",String(N.filter(M=>M.status==="Cần đối soát").length),"pi-exclamation-circle","Nhân viên còn log bất thường"]]}[h.value]}),kn=z(()=>I.value.records.filter(N=>{var d,f;return N.code===((d=P.value)==null?void 0:d.code)&&(!((f=P.value)!=null&&f.date)||N.date.split("-").reverse().join("/")===P.value.date)})),R=z(()=>I.value.columns.filter(N=>!["code","name","department"].includes(N.key)&&!/^d\d+$/.test(N.key)));function H(){if(!ce(c.period).length){v.value="Vui lòng chọn tháng từ năm 2000 đến 2100.";return}l.value={...c},v.value="",$.value=""}function yn(){Object.assign(c,{period:t,department:""}),i.value="",k.value="",T.value={key:"",direction:1},H()}function _n(N){T.value={key:N,direction:T.value.key===N?-T.value.direction:1}}function Ln(N){P.value=N,x.value=!0}function Xn(N,d){var M;const f=N.key==="ArrowRight"?1:N.key==="ArrowLeft"?-1:0;if(!f&&N.key!=="Home"&&N.key!=="End")return;N.preventDefault();const F=N.key==="Home"?0:N.key==="End"?Vn.length-1:(d+f+Vn.length)%Vn.length;h.value=Vn[F].key,(M=document.getElementById(`report-tab-${h.value}`))==null||M.focus()}function mn(){const N=X=>{let Z=String(X??"");return/^[=+@\-\t\r]/.test(Z)&&(Z="'"+Z),'"'+Z.replaceAll('"','""')+'"'},d=I.value.columns,f="\uFEFF"+[d.map(X=>X.label),...j.value.map(X=>d.map(Z=>X[Z.key]))].map(X=>X.map(N).join(",")).join(`\r
`),F=URL.createObjectURL(new Blob([f],{type:"text/csv;charset=utf-8;"})),M=document.createElement("a");M.href=F,M.download=`BaoCao_${h.value}_${l.value.period}_mau.csv`,document.body.append(M),M.click(),M.remove(),setTimeout(()=>URL.revokeObjectURL(F),1e3),$.value=`Đã xuất ${j.value.length} bản ghi minh họa ra CSV.`}return bn([h,l,i,k,y],()=>{C.value=1,x.value=!1}),bn(h,()=>{k.value="",T.value={key:"",direction:1},$.value=""}),bn(J,N=>{C.value>N&&(C.value=N)}),(N,d)=>(o(),s("section",ga,[d[33]||(d[33]=n("header",{class:"reports-heading"},[n("div",null,[n("div",{class:"reports-eyebrow"},[n("span"),A(" ATTENDANCE REPORTS")]),n("h1",null,"Báo cáo chấm công"),n("p",null,"Theo dõi ngày công, kiểm soát biến động và đối soát dữ liệu tính lương.")]),n("span",{class:"reports-prototype"},[n("i",{class:"pi pi-sparkles"}),A(" Prototype · Dữ liệu minh họa")])],-1)),n("div",ya,[(o(!0),s(B,null,O(V(Vn),(f,F)=>(o(),s("button",{id:`report-tab-${f.key}`,key:f.key,type:"button",role:"tab",tabindex:h.value===f.key?0:-1,"aria-selected":h.value===f.key,"aria-controls":"report-panel",class:Q({active:h.value===f.key}),onClick:M=>h.value=f.key,onKeydown:M=>Xn(M,F)},[n("span",ba,[n("i",{class:Q(["pi",f.icon])},null,2)]),n("span",null,[n("strong",null,r(f.title),1),n("small",null,r(f.subtitle),1)]),n("span",fa,"0"+r(F+1),1)],42,va))),128))]),n("form",{class:"report-filters",onSubmit:Un(H,["prevent"])},[n("label",null,[d[9]||(d[9]=n("span",null,[A("Kỳ báo cáo "),n("b",null,"*")],-1)),on(n("input",{"onUpdate:modelValue":d[0]||(d[0]=f=>c.period=f),type:"month",min:"2000-01",max:"2100-12",required:""},null,512),[[le,c.period]])]),n("label",null,[d[11]||(d[11]=n("span",null,"Bộ phận",-1)),on(n("select",{"onUpdate:modelValue":d[1]||(d[1]=f=>c.department=f)},[d[10]||(d[10]=n("option",{value:""},"Tất cả bộ phận",-1)),(o(!0),s(B,null,O(V($e),f=>(o(),s("option",{key:f},r(f),1))),128))],512),[[Dn,c.department]])]),n("div",xa,[G(ln,{type:"submit",label:"Xem báo cáo",icon:"pi pi-filter"}),n("button",{class:"report-reset",type:"button",title:"Đặt lại bộ lọc",onClick:yn},[...d[12]||(d[12]=[n("i",{class:"pi pi-refresh"},null,-1),n("span",null,"Đặt lại",-1)])])]),n("div",ka,[d[14]||(d[14]=n("i",{class:"pi pi-calendar"},null,-1)),n("span",null,[d[13]||(d[13]=A("Kỳ đang xem",-1)),n("strong",null,"Tháng "+r(b.value),1)])])],32),v.value?(o(),s("p",wa,r(v.value),1)):K("",!0),n("div",Ca,[(o(!0),s(B,null,O(xn.value,(f,F)=>(o(),s("article",{key:f[0],class:Q("report-metric-"+F)},[n("div",null,[n("span",null,r(f[0]),1),n("strong",null,r(f[1]),1),n("small",null,r(f[3]),1)]),n("i",{class:Q(["pi",f[2]])},null,2)],2))),128))]),n("section",{id:"report-panel",class:"report-panel",role:"tabpanel","aria-labelledby":`report-tab-${h.value}`},[n("div",Ta,[n("div",null,[d[17]||(d[17]=n("span",{class:"report-sheet-label"},[n("i",{class:"pi pi-file-excel"}),A(" BẢNG DỮ LIỆU")],-1)),n("h2",null,[A(r(g.value.title)+" ",1),n("span",null,"/ "+r(b.value),1)]),n("p",null,[A(r(l.value.department||"Tất cả bộ phận"),1),d[15]||(d[15]=n("span",null,"·",-1)),A(r(new Set(E.value.map(f=>f.code)).size)+" nhân viên",1),d[16]||(d[16]=n("span",null,"·",-1)),A(r(E.value.length)+" bản ghi ",1)])]),G(ln,{label:"Xuất CSV mẫu",icon:"pi pi-download",severity:"secondary",outlined:"",disabled:!E.value.length,onClick:mn},null,8,["disabled"])]),n("div",Va,[n("label",$a,[d[18]||(d[18]=n("i",{class:"pi pi-search"},null,-1)),on(n("input",{"onUpdate:modelValue":d[2]||(d[2]=f=>i.value=f),type:"search",placeholder:"Tìm mã hoặc tên nhân viên…","aria-label":"Tìm nhân viên"},null,512),[[le,i.value]])]),on(n("select",{"onUpdate:modelValue":d[3]||(d[3]=f=>k.value=f),"aria-label":"Lọc trạng thái báo cáo"},[d[19]||(d[19]=n("option",{value:""},"Tất cả trạng thái",-1)),(o(!0),s(B,null,O(w.value,f=>(o(),s("option",{key:f.value,value:f.value},r(f.label),9,_a))),128))],512),[[Dn,k.value]]),d[20]||(d[20]=n("span",{class:"report-freeze-note"},[n("i",{class:"pi pi-lock"}),A(" Cố định 2 cột nhân viên")],-1))]),$.value?(o(),s("p",La,[d[21]||(d[21]=n("i",{class:"pi pi-check-circle"},null,-1)),A(" "+r($.value),1)])):K("",!0),G(pa,{columns:I.value.columns,rows:Mn.value,"all-rows":E.value,offset:nn.value,"sort-key":T.value.key,"sort-direction":T.value.direction,onSort:_n,onOpen:Ln},null,8,["columns","rows","all-rows","offset","sort-key","sort-direction"]),n("div",Pa,[n("span",null,[d[22]||(d[22]=A("Hiển thị ",-1)),n("strong",null,r(E.value.length?nn.value+1:0)+"–"+r(Math.min(nn.value+y.value,E.value.length)),1),A(" / "+r(E.value.length)+" bản ghi",1)]),n("div",null,[n("label",null,[d[24]||(d[24]=A("Số dòng ",-1)),on(n("select",{"onUpdate:modelValue":d[4]||(d[4]=f=>y.value=f)},[...d[23]||(d[23]=[n("option",{value:10},"10",-1),n("option",{value:20},"20",-1),n("option",{value:50},"50",-1),n("option",{value:100},"100",-1)])],512),[[Dn,y.value,void 0,{number:!0}]])]),n("button",{type:"button","aria-label":"Trang trước",disabled:C.value===1,onClick:d[5]||(d[5]=f=>C.value--)},[...d[25]||(d[25]=[n("i",{class:"pi pi-chevron-left"},null,-1)])],8,Sa),n("span",Ea,r(C.value),1),n("span",null,"/ "+r(J.value),1),n("button",{type:"button","aria-label":"Trang sau",disabled:C.value>=J.value,onClick:d[6]||(d[6]=f=>C.value++)},[...d[26]||(d[26]=[n("i",{class:"pi pi-chevron-right"},null,-1)])],8,Ba)])]),n("div",Da,[n("span",null,[d[27]||(d[27]=n("i",{class:"pi pi-check-circle"},null,-1)),A(" "+r(g.value.subtitle),1)]),d[28]||(d[28]=n("span",null,"Σ Tổng cộng tính trên toàn bộ kết quả đã lọc",-1))])],8,Na),h.value==="monthly"?(o(),s("div",Aa,[d[29]||(d[29]=n("strong",null,"Ký hiệu công",-1)),(o(),s(B,null,O([["X","Đủ công","work"],["M","Đi muộn","warn"],["S","Về sớm","warn"],["P","Phép năm","leave"],["OFF","Ngày nghỉ","off"],["V","Vắng không lương","danger"],["?","Thiếu / lỗi log","danger"]],([f,F,M])=>n("span",{key:f},[n("b",{class:Q("cell-"+M)},r(f),3),A(r(F),1)])),64))])):K("",!0),h.value==="overtime"?(o(),s("p",Oa,[...d[30]||(d[30]=[n("i",{class:"pi pi-info-circle"},null,-1),A(" OT đêm là phần nằm trong tổng OT; không cộng thêm lần nữa. ",-1)])])):K("",!0),h.value==="payroll"?(o(),s("p",Fa,[...d[31]||(d[31]=[n("i",{class:"pi pi-info-circle"},null,-1),A(" Mô phỏng: công hưởng lương = công thực tế + phép có lương. Phép còn lại = đầu kỳ + phát sinh − đã dùng. Công chưa xác minh được tách riêng để đối soát. ",-1)])])):K("",!0),d[34]||(d[34]=n("p",{class:"report-demo-note"},"Dữ liệu mẫu phục vụ duyệt giao diện · Chưa kết nối API báo cáo.",-1)),G(V(ae),{visible:x.value,"onUpdate:visible":d[8]||(d[8]=f=>x.value=f),modal:"",header:"Chi tiết chấm công",style:{width:"780px",maxWidth:"95vw"}},{footer:dn(()=>[G(ln,{label:"Đóng",severity:"secondary",outlined:"",onClick:d[7]||(d[7]=f=>x.value=!1)})]),default:dn(()=>{var f;return[P.value?(o(),s("div",Ma,[n("div",Ka,[n("span",null,r((f=P.value.name.split(" ").at(-1))==null?void 0:f.slice(0,1)),1),n("div",null,[n("h3",null,r(P.value.name),1),n("p",null,r(P.value.code)+" · "+r(P.value.department),1)]),n("b",null,r(b.value),1)]),n("dl",za,[(o(!0),s(B,null,O(R.value,F=>(o(),s("div",{key:F.key},[n("dt",null,r(F.label),1),n("dd",null,r(P.value[F.key]),1)]))),128))]),n("p",Ia," Dữ liệu quẹt thẻ minh họa · "+r(kn.value.length)+" ngày ",1),n("div",Ra,[n("table",qa,[d[32]||(d[32]=n("thead",null,[n("tr",null,[n("th",null,"Ngày"),n("th",null,"Ca"),n("th",null,"Giờ vào"),n("th",null,"Giờ ra"),n("th",null,"Ký hiệu"),n("th",null,"OT (giờ)"),n("th",null,"Ghi chú")])],-1)),n("tbody",null,[(o(!0),s(B,null,O(kn.value,F=>(o(),s("tr",{key:F.date},[n("td",null,r(F.date.split("-").reverse().join("/")),1),n("td",null,r(F.shift),1),n("td",null,r(F.checkIn),1),n("td",null,r(F.checkOut),1),n("td",null,r(F.symbol),1),n("td",null,r(V(An)(F.ot)),1),n("td",null,r(F.anomaly||"—"),1)]))),128))])])])])):K("",!0)]}),_:1},8,["visible"])]))}}),Ha={class:"attendance-workspace"},Ga={"aria-label":"Đường dẫn"},ja={class:"workspace-empty"},Xa=fn({__name:"AttendanceWorkspaceView",setup(e){const u=Ue(),t=z(()=>He.find(c=>c.path===u.path));return(c,l)=>{var i,k,C,y;const h=qe("RouterLink");return o(),s("section",Ha,[n("nav",Ga,[G(h,{to:"/attendance/overview"},{default:dn(()=>[...l[0]||(l[0]=[A("Chấm công",-1)])]),_:1}),n("span",null," / "+r((i=t.value)==null?void 0:i.label),1)]),V(u).meta.attendancePage==="daily"?(o(),vn(nt,{key:0})):V(u).meta.attendancePage==="monthly"?(o(),vn(Hl,{key:1})):V(u).meta.attendancePage==="reports"?(o(),vn(Ua,{key:2})):(o(),s(B,{key:3},[n("h1",null,r((k=t.value)==null?void 0:k.label),1),n("div",ja,[n("i",{class:Q(["pi",(C=t.value)==null?void 0:C.icon])},null,2),n("h2",null,"Chưa có dữ liệu "+r((y=t.value)==null?void 0:y.label.toLocaleLowerCase()),1),l[2]||(l[2]=n("p",null," Chức năng đã được tách riêng trong module Chấm công. Chưa kết nối nguồn dữ liệu cho màn hình này. ",-1)),G(h,{to:"/attendance/overview"},{default:dn(()=>[...l[1]||(l[1]=[A("← Về tổng quan chấm công",-1)])]),_:1})])],64))])}}}),So=Ye(Xa,[["__scopeId","data-v-75378769"]]);export{So as default};
