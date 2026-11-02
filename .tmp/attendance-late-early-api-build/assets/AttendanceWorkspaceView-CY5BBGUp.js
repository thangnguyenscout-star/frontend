import{d as kn,o as i,x as gn,c as s,b as n,F as A,v as z,t as l,n as rn,G as Ln,f as $,w as In,g as F,e as P,i as O,r as f,am as Dn,an as An,ao as ve,P as be,p as oe,N as Mn,y as xn,C as fe,I as xe,h as U,_ as J,z as Y,E as Nn,A as Un,R as de,ap as he,aq as qe,s as hn,K as Xn,L as an,O as Ke,q as He,k as je}from"./index-BzIAAQP5.js";import{a as Ge}from"./attendance-CYkncW1q.js";import{M as Xe}from"./ModuleListView-Bftw4tmX.js";import{s as We}from"./index-D6tN96lx.js";import{s as Qe}from"./index-DDKnlZHq.js";import{e as Je}from"./employee.service-DTC3-obs.js";import{l as ie,e as Ze,p as Ye}from"./period.types-2n5hQmGk.js";import{p as ke}from"./record.service-Cu6FC6c1.js";import{_ as we,n as Bn,r as Pn,a as nt,b as et,m as tt}from"./reports-g1ySVhyZ.js";import{_ as Ce}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{s as at,g as lt}from"./schedule-shift.service-BlWDPOz4.js";import"./index-3n8EUdui.js";import"./index-CEJ-rEEi.js";import"./index-1DRee7Tq.js";import"./index-BdE455bB.js";import"./AppDrawer.vue_vue_type_script_setup_true_lang-De8LxCVR.js";import"./ContractInspector.vue_vue_type_script_setup_true_lang-RDKx0elZ.js";import"./ContractCreateView-D41kD0MR.js";import"./AppLoading.vue_vue_type_script_setup_true_lang-Baey4G_f.js";import"./AppErrorState.vue_vue_type_script_setup_true_lang-X6cuuJoz.js";import"./AppStatusBadge.vue_vue_type_script_setup_true_lang-D7rVV89o.js";import"./ContractForm-DNvg3IY2.js";import"./recruitment.service-CBqFMXMj.js";import"./employee.documents-akHJOMh8.js";import"./useContractPermission-DRaV6v2B.js";import"./index-D6BUl2nK.js";import"./useToast-DZMFAUFM.js";import"./useConfirm-4on2fb37.js";import"./currency-Bi9uwIDW.js";import"./AppDataTable.vue_vue_type_script_setup_true_lang-g2ZdcfPw.js";import"./AppEmptyState.vue_vue_type_script_setup_true_lang-_6xcPoch.js";import"./AppForm.vue_vue_type_script_setup_true_lang-BT5YK8Kh.js";import"./AppKpiCard-Cjvz3dgT.js";import"./modules-CJV0O-xn.js";import"./useRecords-BqY-PPD3.js";import"./export-BblXOGSb.js";import"./employee.type-VgkJBrYD.js";const ot=kn({__name:"AttendanceListView",setup(e){return(d,a)=>(i(),gn(Xe,{module:"attendance"}))}}),Wn={NORMAL:{label:"Đủ ca",bg:"#ECFDF5",text:"#065F46",border:"#A7F3D0",abnormal:!1},LEAVE_VACATION:{label:"Nghỉ lễ",bg:"#EFF6FF",text:"#1E40AF",border:"#BFDBFE",abnormal:!1},LEAVE_NORMAL:{label:"Nghỉ phép",bg:"#F5F3FF",text:"#5B21B6",border:"#DDD6FE",abnormal:!1},WORK_IN_VACATION:{label:"Làm việc trong lễ",bg:"#ECFEFF",text:"#155E75",border:"#A5F3FC",abnormal:!1},HALF_WORK:{label:"Nửa công",bg:"#FFFBEB",text:"#92400E",border:"#FDE68A",abnormal:!1},LEAVE_ABNORMAL:{label:"Nghỉ bất thường",bg:"#FFF1F2",text:"#9F1239",border:"#FECDD3",abnormal:!0},ATTENDANCE_ABNORMAL:{label:"Công bất thường",bg:"#FEF2F2",text:"#991B1B",border:"#FECACA",abnormal:!0},CHECK_YOUR_LOG_WORK:{label:"Cần kiểm tra log công",bg:"#FFF7ED",text:"#9A3412",border:"#FED7AA",abnormal:!0}},it={label:"Chưa có dữ liệu",bg:"#F8FAFC",text:"#475569",border:"#E2E8F0",abnormal:!1},Z=e=>e?Wn[e.trangThaiCong||""]||Wn.ATTENDANCE_ABNORMAL:it,mn=e=>e?[e.ho,e.tenDem,e.ten].filter(Boolean).join(" ").trim()||e.hoTen||e.maNhanVien:"";function sn(e){const d=e.slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(d)||!Number.isFinite(Date.parse(d+"T12:00:00Z"))||new Date(d+"T12:00:00Z").toISOString().slice(0,10)!==d)throw new Error("Ngày chấm công không hợp lệ: "+e);return d}const en=e=>e?sn(e).split("-").reverse().join("/"):"—";function Ne(e,d){const a=new Date(Date.UTC(e,d-1,1));a.setUTCFullYear(e);const t=(a.getUTCDay()+6)%7,u=new Date(a);return u.setUTCMonth(u.getUTCMonth()+1),u.setUTCDate(0),Array.from({length:Math.ceil((t+u.getUTCDate())/7)*7},(r,y)=>{const k=y-t+1;return k<1||k>u.getUTCDate()?null:String(e).padStart(4,"0")+"-"+String(d).padStart(2,"0")+"-"+String(k).padStart(2,"0")})}function rt(e,d){const a=new Map;for(const t of e){const u=sn(t.ngayChamCong);if(a.has(u))throw new Error("Có nhiều bản ghi công cùng ngày "+en(u)+".");a.set(u,t)}return a}const Te=(e,d=!1)=>typeof e=="number"&&Number.isFinite(e)?new Intl.NumberFormat("vi-VN",{maximumFractionDigits:2}).format(d?e/60:e):"—",st=[{key:"soNgayCoCong",label:"Ngày có công",visible:!0},{key:"tongSoPhutLamViecThucTe",label:"Giờ làm thực tế",visible:!0,hours:!0},{key:"tongCongHopLe",label:"Công hợp lệ",visible:!0},{key:"tongNgayNghiCoLuong",label:"Nghỉ có lương",visible:!0},{key:"tongNgayNghiKhongLuong",label:"Nghỉ không lương",visible:!0},{key:"tongCongHuongLuong",label:"Công hưởng lương",visible:!0},{key:"soNgayCoDuLieuCong",label:"Ngày có dữ liệu",visible:!1},{key:"soNgayDuLog",label:"Ngày đủ log",visible:!1},{key:"soNgayKhongLog",label:"Ngày không log",visible:!1},{key:"soNgayDiTre",label:"Ngày đi trễ",visible:!1},{key:"tongSoPhutDiTre",label:"Phút đi trễ",visible:!1},{key:"soNgayVeSom",label:"Ngày về sớm",visible:!1},{key:"tongSoPhutVeSom",label:"Phút về sớm",visible:!1},{key:"tongSoPhutTangCa",label:"Giờ tăng ca",visible:!1,hours:!0},{key:"soNgayQuaDem",label:"Ngày qua đêm",visible:!1},{key:"tongNgayNghi",label:"Tổng ngày nghỉ",visible:!1}],ut={tongDongTinh:"Tổng dòng tính",soDongThemMoi:"Thêm mới",soDongCapNhat:"Cập nhật",soDongThieuLog:"Thiếu log",soDongNgayLe:"Ngày lễ",soDongNghiPhep:"Nghỉ phép",soDongBoQuaKhongCapNhat:"Bỏ qua / không cập nhật",soNhanVienThemMoi:"Nhân viên thêm mới",soNhanVienCapNhat:"Nhân viên cập nhật",soNhanVienBoQuaDaKhoa:"Bỏ qua do khóa",thang:"Tháng",nam:"Năm",kyChamCongId:"Kỳ công"},zn=(e,d)=>JSON.stringify([e,sn(d)]);function $e(e,d){const a=new Map;for(const t of e){if(d&&t.maNhanVien!==d)throw new Error("API trả dữ liệu của nhân viên khác.");const u=zn(t.maNhanVien,t.ngayChamCong);if(a.has(u))throw new Error("Có nhiều bản ghi công của nhân viên "+t.maNhanVien+" trong ngày "+en(t.ngayChamCong)+".");a.set(u,t)}return a}function ct(e,d,a){const t=new Map;for(const u of[...e,...d]){if(a.maBoPhan&&u.maBoPhan!==a.maBoPhan||a.maNhanVien&&u.maNhanVien!==a.maNhanVien)continue;const r=t.get(u.maNhanVien);t.set(u.maNhanVien,{...r,...u,ho:u.ho??(r==null?void 0:r.ho),tenDem:u.tenDem??(r==null?void 0:r.tenDem),ten:u.ten??(r==null?void 0:r.ten),hoTen:u.hoTen??(r==null?void 0:r.hoTen),tenBoPhan:u.tenBoPhan??(r==null?void 0:r.tenBoPhan)})}return[...t.values()].sort((u,r)=>mn(u).localeCompare(mn(r),"vi")||u.maNhanVien.localeCompare(r.maNhanVien))}function _e(e,d){return e&&Z(e).abnormal&&d?["recalculate"]:[]}const Ve=(e,d)=>Ne(e,d).filter(a=>!!a),Sn=[{key:"ngayNghiPhep",label:"Nghỉ phép"},{key:"ngayNghiHuongLuong",label:"Nghỉ hưởng lương"},{key:"nghiLe",label:"Nghỉ lễ"},{key:"ngayNghiKhongHuongLuong",label:"Nghỉ không hưởng lương"},{key:"otNgayLe",label:"OT ngày lễ"},{key:"otNgayThuong",label:"OT ngày thường"}];function dt(e,d){const a=new Set(Ve(d.nam,d.thang)),t=new Map;for(const u of e){if(!a.has(sn(u.ngayChamCong)))continue;let r=t.get(u.maNhanVien);r||(r={ngayNghiPhep:0,ngayNghiHuongLuong:0,nghiLe:0,ngayNghiKhongHuongLuong:0,otNgayLe:0,otNgayThuong:0},t.set(u.maNhanVien,r));for(const{key:y}of Sn){const k=u[y];typeof k=="number"&&Number.isFinite(k)&&(r[y]+=k)}}return t}const ht={class:"attendance-calendar"},pt={class:"monthly-table-scroll"},mt={class:"month-grid","aria-label":"Lịch chấm công tháng"},gt=["onContextmenu"],yt={class:"day-top"},vt=["datetime"],bt=["aria-label","onClick"],ft=["aria-label","onClick"],xt={key:1,class:"day-body"},kt={key:0,class:"outside-days"},wt={class:"outside-grid"},Ct=["onContextmenu"],Nt={class:"day-top"},Tt=["datetime"],$t=["aria-label","onClick"],_t=["onClick"],Vt={key:1,class:"day-body"},Et={class:"monthly-legend","aria-label":"Chú giải trạng thái"},Pt=kn({__name:"AttendanceCalendar",props:{rows:{},year:{},month:{},readonly:{type:Boolean,default:!1}},emits:["menu","detail"],setup(e,{emit:d}){const a=e,t=d,u=O(()=>rt(a.rows)),r=O(()=>Ne(a.year,a.month)),y=O(()=>Array.from({length:r.value.length/7},(L,D)=>r.value.slice(D*7,D*7+7))),k=O(()=>String(a.year).padStart(4,"0")+"-"+String(a.month).padStart(2,"0")),_=O(()=>a.rows.filter(L=>!sn(L.ngayChamCong).startsWith(k.value)).sort((L,D)=>L.ngayChamCong.localeCompare(D.ngayChamCong)));function v(L,D){a.readonly||!L||!Z(L).abnormal||(D.preventDefault(),t("menu",L,D))}function T(L){!a.readonly&&L&&!Z(L).abnormal&&t("detail",L)}function S(L){const D=Z(L);return{background:D.bg,color:D.text,borderColor:D.border}}return(L,D)=>(i(),s("div",ht,[n("div",pt,[n("table",mt,[n("thead",null,[n("tr",null,[(i(),s(A,null,z(["Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy","Chủ nhật"],N=>n("th",{key:N,scope:"col"},l(N),1)),64))])]),n("tbody",null,[(i(!0),s(A,null,z(y.value,(N,K)=>(i(),s("tr",{key:K},[(i(!0),s(A,null,z(N,(V,E)=>{var x,M;return i(),s("td",{key:V||E,class:rn({"empty-calendar-cell":!V})},[V?(i(),s("div",{key:0,class:"calendar-day",style:Ln(S(u.value.get(V))),onContextmenu:R=>v(u.value.get(V),R)},[n("div",yt,[n("time",{datetime:V,class:rn({weekend:E>4})},l(Number(V.slice(-2))),11,vt),!e.readonly&&u.value.has(V)&&$(Z)(u.value.get(V)).abnormal?(i(),s("button",{key:0,type:"button",class:"day-more","aria-label":"Xử lý công ngày "+$(en)(V),onClick:In(R=>t("menu",u.value.get(V),R),["stop"])}," ••• ",8,bt)):F("",!0)]),!e.readonly&&u.value.has(V)&&!$(Z)(u.value.get(V)).abnormal?(i(),s("button",{key:0,type:"button",class:"day-body","aria-label":"Xem công ngày "+$(en)(V),onClick:R=>T(u.value.get(V))},[n("strong",null,l(((x=u.value.get(V))==null?void 0:x.hienThiCa)||"—"),1),n("span",null,l($(Z)(u.value.get(V)).label),1)],8,ft)):(i(),s("div",xt,[n("strong",null,l(((M=u.value.get(V))==null?void 0:M.hienThiCa)||"—"),1),n("span",null,l($(Z)(u.value.get(V)).label),1)]))],44,gt)):F("",!0)],2)}),128))]))),128))])])]),_.value.length?(i(),s("section",kt,[D[0]||(D[0]=n("h3",null,"Ngày ngoài tháng thuộc kỳ công",-1)),n("div",wt,[(i(!0),s(A,null,z(_.value,N=>(i(),s("div",{key:N.ngayChamCong,class:"calendar-day",style:Ln(S(N)),onContextmenu:K=>v(N,K)},[n("div",Nt,[n("time",{datetime:$(sn)(N.ngayChamCong)},l($(en)(N.ngayChamCong)),9,Tt),!e.readonly&&$(Z)(N).abnormal?(i(),s("button",{key:0,type:"button",class:"day-more","aria-label":"Xử lý công ngày "+$(en)(N.ngayChamCong),onClick:K=>t("menu",N,K)}," ••• ",8,$t)):F("",!0)]),!e.readonly&&!$(Z)(N).abnormal?(i(),s("button",{key:0,class:"day-body",type:"button",onClick:K=>T(N)},[n("strong",null,l(N.hienThiCa||"—"),1),n("span",null,l($(Z)(N).label),1)],8,_t)):(i(),s("div",Vt,[n("strong",null,l(N.hienThiCa||"—"),1),n("span",null,l($(Z)(N).label),1)]))],44,Ct))),128))])])):F("",!0),n("div",Et,[(i(!0),s(A,null,z($(Wn),(N,K)=>(i(),s("span",{key:K},[n("i",{style:Ln({background:N.bg,borderColor:N.border}),"aria-hidden":"true"},null,4),P(l(N.label),1)]))),128)),D[1]||(D[1]=n("span",null,[n("i",{"aria-hidden":"true"}),P("Chưa có dữ liệu")],-1))])]))}}),St={class:"attendance-month-grid"},Lt={class:"excel-scroll",role:"region","aria-label":"Bảng chi tiết chấm công tháng, cuộn ngang để xem các ngày",tabindex:"0"},Bt={class:"excel-attendance","aria-label":"Nhân viên và ký hiệu công từng ngày"},Dt=["colspan"],At=["colspan"],Rt=["datetime"],Ft={class:"excel-sticky excel-stt"},Ot={class:"excel-sticky excel-code"},zt={class:"excel-sticky excel-name",scope:"row"},It={class:"excel-dept"},Mt=["title","onContextmenu"],Ut=["aria-label","onClick"],qt={key:0},Kt=["colspan"],Ht={class:"monthly-subtitle excel-help"},jt={class:"monthly-legend","aria-label":"Chú giải trạng thái"},Gt=kn({__name:"AttendanceMonthGrid",props:{rows:{},employees:{},filter:{},allowActions:{type:Boolean,default:!1}},emits:["menu","detail"],setup(e,{emit:d}){const a=e,t=d,u=f(""),r=O(()=>$e(a.rows)),y=O(()=>ct(a.employees,a.rows,a.filter)),k=O(()=>Ve(a.filter.nam,a.filter.thang)),_=O(()=>dt(a.rows,a.filter)),v=["CN","T2","T3","T4","T5","T6","T7"],T=V=>v[new Date(V+"T12:00:00Z").getUTCDay()],S=(V,E)=>r.value.get(zn(V,E)),L=(V,E)=>{const x=S(V.maNhanVien,E);return mn(V)+" · "+en(E)+" · "+((x==null?void 0:x.hienThiCa)||"—")+" · "+Z(x).label},D=V=>({background:Z(V).bg,color:Z(V).text});function N(V,E){u.value=zn(V.maNhanVien,E);const x=S(V.maNhanVien,E);x&&!Z(x).abnormal&&t("detail",x)}function K(V,E,x){const M=S(V.maNhanVien,E);!_e(M,a.allowActions).length||!M||(x.preventDefault(),u.value=zn(V.maNhanVien,E),t("menu",M,x))}return(V,E)=>(i(),s("div",St,[n("div",Lt,[n("table",Bt,[n("colgroup",null,[E[0]||(E[0]=n("col",{class:"excel-number-col"},null,-1)),E[1]||(E[1]=n("col",{class:"excel-code-col"},null,-1)),E[2]||(E[2]=n("col",{class:"excel-name-col"},null,-1)),E[3]||(E[3]=n("col",{class:"excel-dept-col"},null,-1)),(i(!0),s(A,null,z(k.value,x=>(i(),s("col",{key:x,class:"excel-day-col"}))),128)),(i(!0),s(A,null,z($(Sn),x=>(i(),s("col",{key:x.key,class:"excel-total-col"}))),128))]),n("thead",null,[n("tr",null,[E[4]||(E[4]=n("th",{rowspan:"2",class:"excel-sticky excel-stt",scope:"col"},"STT",-1)),E[5]||(E[5]=n("th",{rowspan:"2",class:"excel-sticky excel-code",scope:"col"},"Mã nhân viên",-1)),E[6]||(E[6]=n("th",{rowspan:"2",class:"excel-sticky excel-name",scope:"col"},"Họ và tên",-1)),E[7]||(E[7]=n("th",{rowspan:"2",class:"excel-dept",scope:"col"},"Bộ phận",-1)),n("th",{colspan:k.value.length,scope:"colgroup"}," Ngày công tháng "+l(String(e.filter.thang).padStart(2,"0"))+"/"+l(e.filter.nam),9,Dt),n("th",{colspan:$(Sn).length,scope:"colgroup"},"Tổng trong tháng",8,At)]),n("tr",null,[(i(!0),s(A,null,z(k.value,x=>(i(),s("th",{key:x,scope:"col",class:rn({"excel-weekend":T(x)==="CN"||T(x)==="T7"})},[n("time",{datetime:x},l(Number(x.slice(-2))),9,Rt),n("small",null,l(T(x)),1)],2))),128)),(i(!0),s(A,null,z($(Sn),x=>(i(),s("th",{key:x.key,scope:"col"},l(x.label),1))),128))])]),n("tbody",null,[(i(!0),s(A,null,z(y.value,(x,M)=>(i(),s("tr",{key:x.maNhanVien},[n("td",Ft,l(M+1),1),n("td",Ot,l(x.maNhanVien),1),n("th",zt,l($(mn)(x)),1),n("td",It,l(x.tenBoPhan||x.maBoPhan||"—"),1),(i(!0),s(A,null,z(k.value,R=>{var X;return i(),s("td",{key:R,class:rn(["excel-attendance-cell",{"excel-selected":u.value===$(zn)(x.maNhanVien,R)}]),style:Ln(D(S(x.maNhanVien,R))),title:L(x,R),onContextmenu:j=>K(x,R,j)},[n("button",{type:"button",class:"excel-cell-symbol","aria-label":L(x,R),onClick:j=>N(x,R)},l(((X=S(x.maNhanVien,R))==null?void 0:X.hienThiCa)||"—"),9,Ut)],46,Mt)}),128)),(i(!0),s(A,null,z($(Sn),R=>{var X;return i(),s("td",{key:R.key,class:"excel-total"},l($(Te)(((X=_.value.get(x.maNhanVien))==null?void 0:X[R.key])??0)),1)}),128))]))),128)),y.value.length?F("",!0):(i(),s("tr",qt,[n("td",{colspan:k.value.length+4+$(Sn).length,class:"excel-empty"}," Không có nhân viên theo bộ lọc. ",8,Kt)]))])])]),n("p",Ht,l(y.value.length)+" nhân viên · Ô hiển thị ký hiệu công/nghỉ phép. Nhấn chuột phải vào ô công bất thường để xem chức năng có thể sử dụng. ",1),n("div",jt,[(i(!0),s(A,null,z($(Wn),(x,M)=>(i(),s("span",{key:M},[n("i",{style:Ln({background:x.bg,borderColor:x.border}),"aria-hidden":"true"},null,4),P(l(x.label),1)]))),128)),E[8]||(E[8]=n("span",null,[n("i",{"aria-hidden":"true"}),P("Chưa có dữ liệu")],-1))])]))}});function re(e){if((e==null?void 0:e.isResults)!==!0||e.data==null)throw new Error((e==null?void 0:e.message)||"Không nhận được dữ liệu chấm công hợp lệ.");return e.data}const Ee="maNhanVien ho tenDem ten maBoPhan tenBoPhan",Pe="thang nam tuNgay denNgay trangThai ngayChot",Xt=Ee+" "+Pe+" ngaySinh gioiTinh soNgayCoDuLieuCong soNgayDuLog soNgayKhongLog soNgayCoCong tongSoPhutLamViecThucTe tongSoPhutDiTre tongSoPhutVeSom soNgayDiTre soNgayVeSom tongSoPhutTangCa soNgayQuaDem tongCongHopLe tongNgayNghi tongNgayNghiCoLuong tongNgayNghiKhongLuong tongCongHuongLuong",Wt=Ee+" "+Pe+" maCa kyHieuCa ngayChamCong gioVao gioRa soPhutLamViec soGioLamViec maLoaiNghiPhep laNgayLe hienThiCa trangThaiCong ngayNghiPhep ngayNghiHuongLuong nghiLe ngayNghiKhongHuongLuong otNgayLe otNgayThuong";function Jn(e){if(!Number.isInteger(e.thang)||e.thang<1||e.thang>12||!Number.isInteger(e.nam)||e.nam<100||e.nam>9998)throw new Error("Tháng hoặc năm không hợp lệ.")}async function Qt(e){Jn(e);const d=new URL("/api/bang-cham-cong/export-excel",new URL("https://hrmsapi-crc3crfdegesbper.westus3-01.azurewebsites.net/graphql",window.location.origin));d.searchParams.set("thang",String(e.thang)),d.searchParams.set("nam",String(e.nam)),e.maNhanVien&&d.searchParams.set("manhanvien",e.maNhanVien),e.maBoPhan&&d.searchParams.set("mabophan",e.maBoPhan);const a=`BangChamCong_${e.nam}_${String(e.thang).padStart(2,"0")}.xlsx`;return ke(async()=>{var T,S;const t=await fetch(d,{method:"GET",credentials:"include",headers:{Authorization:`Bearer ${ve.get()}`,Accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}});if(t.status===401)throw new be(401);const u=t.headers.get("content-type")||"";if(!t.ok||u.toLowerCase().includes("json")){const L=await t.json().catch(()=>null);throw new Error((L==null?void 0:L.message)||(L==null?void 0:L.detail)||(L==null?void 0:L.title)||`Không thể xuất Excel (HTTP ${t.status}).`)}const r=await t.blob();if(!r.size)throw new Error("Máy chủ trả về tệp Excel trống.");const y=t.headers.get("content-disposition")||"",k=(T=/filename\*\s*=\s*UTF-8''([^;]+)/i.exec(y))==null?void 0:T[1],_=/filename\s*=\s*(?:"([^"]+)"|([^;]+))/i.exec(y);let v=(_==null?void 0:_[1])||((S=_==null?void 0:_[2])==null?void 0:S.trim())||a;if(k)try{v=decodeURIComponent(k.trim())}catch{}return v=v.replace(/[/\\]/g,"_"),{blob:r,filename:v}})}function Se(e){return Jn(e),"thang:"+e.thang+",nam:"+e.nam+",maBoPhan:"+JSON.stringify(e.maBoPhan||null)}async function pe(e){const{data:d}=await Dn.query({query:An("query BangCongThang { bangCongThang("+Se(e)+"){isResults message data{"+Xt+"}}}"),fetchPolicy:"no-cache",errorPolicy:"none"}),a=re(d==null?void 0:d.bangCongThang);if(!Array.isArray(a))throw new Error("Báo cáo tháng không đúng định dạng.");return a.filter(Boolean)}async function te(e){const{data:d}=await Dn.query({query:An("query BangTongHopNgay { bangTongHopNgay("+Se(e)+",maNhanVien:"+JSON.stringify(e.maNhanVien)+"){isResults message data{"+Wt+"}}}"),fetchPolicy:"no-cache",errorPolicy:"none"}),a=re(d==null?void 0:d.bangTongHopNgay);if(!Array.isArray(a))throw new Error("Công ngày không đúng định dạng.");const t=a.filter(Boolean);return $e(t,e.maNhanVien),t}const Le={batch:"tinhChamCongHangLoat",month:"chamCongThang",person:"tinhChamCongNgayTheoNhanVien"};function le(e){if(e.kind==="NON_NULL")return le(e.ofType)+"!";if(e.kind==="LIST")return"["+le(e.ofType)+"]";if(!e.name)throw new Error("Schema input không hợp lệ.");return e.name}function Qn(e){return e.ofType?Qn(e.ofType):e.name||""}const me="kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name}}}}",ae=new Map;async function Jt(e){const d=Le[e];let a=ae.get(d);return a||(a=(async()=>{var v,T,S,L;const{data:t}=await Dn.query({query:An("query AttendanceMutationContract {__schema{mutationType{fields{name args{name defaultValue type{"+me+"}}}}}}"),fetchPolicy:"no-cache",errorPolicy:"none"}),u=(T=(v=t==null?void 0:t.__schema)==null?void 0:v.mutationType)==null?void 0:T.fields.find(D=>D.name===d),r=u==null?void 0:u.args.find(D=>D.name==="input");if(!r)throw new Error("Máy chủ chưa cung cấp hợp đồng input cho "+d+".");if(u.args.some(D=>D.name!=="input"&&D.type.kind==="NON_NULL"&&D.defaultValue==null))throw new Error("Mutation có tham số bắt buộc ngoài input chưa được ánh xạ.");const y=Qn(r.type),_=(L=(S=(await Dn.query({query:An("query AttendanceInputFields($name:String!){__type(name:$name){inputFields{name defaultValue type{"+me+"}}}}"),variables:{name:y},fetchPolicy:"no-cache",errorPolicy:"none"})).data)==null?void 0:S.__type)==null?void 0:L.inputFields;if(!_)throw new Error("Input chưa phải kiểu đối tượng được hỗ trợ.");return{inputType:le(r.type),fields:_}})().catch(t=>{throw ae.delete(d),t}),ae.set(d,a)),a}function Zt(e,d,a){var _;Jn(d.filter);const t=new Set(a.map(v=>v.name)),{filter:u}=d,r=["ngayChamCong","ngayLamViec","ngay"].find(v=>t.has(v));if(e==="person"&&(!d.day||!d.employee||d.day.maNhanVien!==d.employee.maNhanVien||!t.has("maNhanVien")||!r))throw new Error("Input chưa hỗ trợ đúng phạm vi nhân viên và ngày được chọn.");if(e!=="person"&&u.maNhanVien&&!t.has("maNhanVien"))throw new Error("API này không hỗ trợ lọc nhân viên. Hãy chọn Tất cả nhân viên trước khi tính.");if(e!=="person"&&u.maBoPhan&&!t.has("maBoPhan"))throw new Error("API này không hỗ trợ bộ phận đang chọn. Hãy chọn Tất cả bộ phận trước khi tính.");if(!t.has("kyChamCongId")&&!(t.has("thang")&&t.has("nam")))throw new Error("Input chưa có kỳ hoặc tháng/năm được hỗ trợ.");if(e!=="person"&&r&&((_=a.find(v=>v.name===r))==null?void 0:_.type.kind)==="NON_NULL")throw new Error("API yêu cầu chọn ngày cho thao tác hàng loạt; cần bổ sung hợp đồng trước khi sử dụng.");const y={thang:u.thang,nam:u.nam,maBoPhan:u.maBoPhan,maNhanVien:e==="person"?d.employee.maNhanVien:u.maNhanVien,previewOnly:!1,debug:!1};if(t.has("kyChamCongId")){if(d.kyChamCongId==null)throw new Error("Chưa xác định được kỳ công.");const v=Ze(d.kyChamCongId),T=Qn(a.find(S=>S.name==="kyChamCongId").type);if(T==="ID"||T==="String")y.kyChamCongId=v;else{const S=Number(v);if(!Number.isSafeInteger(S))throw new Error("ID kỳ vượt giới hạn số an toàn của input.");y.kyChamCongId=S}}if(e==="person"&&r){const v=sn(d.day.ngayChamCong),T=d.day;if(T.tuNgay&&v<sn(T.tuNgay)||T.denNgay&&v>sn(T.denNgay))throw new Error("Ngày nằm ngoài kỳ công.");const S=Qn(a.find(L=>L.name===r).type);y[r]=S==="DateTime"?v+"T00:00:00+07:00":v}const k={};for(const v of a)if(Object.hasOwn(y,v.name)&&(y[v.name]!=null||v.type.kind!=="NON_NULL"))k[v.name]=y[v.name];else if(v.type.kind==="NON_NULL"&&v.defaultValue==null)throw new Error("Cần ánh xạ trường input bắt buộc: "+v.name);return k}async function Yt(e,d){if(!oe().can("attendance","update"))throw new Error("Bạn không có quyền tính công.");const a=JSON.parse(JSON.stringify(d)),t=await Jt(e),u=await ie({nam:a.filter.nam,thang:a.filter.thang,trangThai:null});if(u.length!==1)throw new Error("Cần xác định chính xác một kỳ chấm công cho tháng đã chọn.");const r=u[0];if(r.trangThai!=="O")throw new Error("Chỉ tính công khi kỳ đang mở.");if(a.day){const _=sn(a.day.ngayChamCong);if(_<sn(r.tuNgay)||_>sn(r.denNgay))throw new Error("Ngày được chọn nằm ngoài kỳ công.")}a.kyChamCongId=r.id;const y=Zt(e,a,t.fields),k=["Kỳ: "+a.filter.thang+"/"+a.filter.nam,e==="person"?"Nhân viên: "+mn(a.employee)+" ("+a.employee.maNhanVien+")":"Nhân viên: "+(a.filter.maNhanVien||"Tất cả"),e==="person"?"Ngày: "+en(a.day.ngayChamCong):"Phạm vi: toàn kỳ đã chọn"];return e!=="person"&&k.push("Bộ phận: "+(a.filter.maBoPhan||"Tất cả")),{kind:e,context:a,input:y,inputType:t.inputType,scope:k}}async function na(e){if(!oe().can("attendance","update"))throw new Error("Bạn không có quyền tính công.");const d=await ie({nam:e.context.filter.nam,thang:e.context.filter.thang,trangThai:null});if(d.length!==1||String(d[0].id)!==String(e.context.kyChamCongId)||d[0].trangThai!=="O")throw new Error("Kỳ công đã thay đổi hoặc không còn mở.");const a=Le[e.kind],t=e.kind==="month"?"thang nam kyChamCongId soNhanVienThemMoi soNhanVienCapNhat soNhanVienBoQuaDaKhoa":(e.kind==="person"?"soDongBoQuaKhongCapNhat ":"")+"tongDongTinh soDongThemMoi soDongCapNhat soDongThieuLog soDongNgayLe soDongNghiPhep",{data:u}=await Dn.mutate({mutation:An("mutation AttendanceCalculate($input:"+e.inputType+"){"+a+"(input:$input){isResults message data{returnCode thongKe{"+t+"} resultSets{columns rows}}}}"),variables:{input:e.input},errorPolicy:"none"}),r=u==null?void 0:u[a],y=re(r);return{message:(r==null?void 0:r.message)||"Máy chủ đã trả kết quả xử lý.",data:y}}const ea=`.monthly-page {
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
`,ta=["aria-busy"],aa={class:"monthly-heading"},la={class:"monthly-actions"},oa=["disabled"],ia=["value"],ra=["disabled"],sa=["disabled"],ua=["value"],ca={class:"employee-filter"},da={key:0,class:"monthly-error",role:"alert"},ha={key:1,class:"monthly-error",role:"alert"},pa={key:2,class:"monthly-notice"},ma={key:3,class:"monthly-notice",role:"status"},ga={key:4,class:"monthly-notice"},ya={class:"monthly-sheet"},va={class:"monthly-tabs",role:"tablist","aria-label":"Bảng chấm công tháng"},ba=["aria-selected"],fa=["aria-selected"],xa={key:0,class:"monthly-loading",role:"status"},ka={key:1,class:"monthly-empty"},wa={class:"monthly-error",role:"alert"},Ca={id:"monthly-summary-panel",role:"tabpanel","aria-labelledby":"monthly-summary-tab"},Na={class:"monthly-toolbar"},Ta={class:"monthly-subtitle"},$a={class:"monthly-columns"},_a={class:"monthly-column-options"},Va=["onUpdate:modelValue"],Ea={class:"monthly-table-scroll monthly-summary-scroll",role:"region","aria-label":"Bảng tổng hợp công tháng, cuộn ngang và dọc để xem đầy đủ",tabindex:"0"},Pa={class:"monthly-summary"},Sa=["onClick"],La={key:0},Ba=["colspan"],Da={id:"monthly-daily-panel",role:"tabpanel","aria-labelledby":"monthly-daily-tab"},Aa={class:"monthly-toolbar"},Ra={class:"monthly-subtitle"},Fa={key:0,class:"monthly-empty",role:"status"},Oa={key:1,class:"monthly-error",role:"alert"},za={key:0},Ia={key:0,role:"status"},Ma={key:1,class:"monthly-error",role:"alert"},Ua={key:0,class:"monthly-subtitle"},qa={key:1},Ka=["disabled"],Ha={key:3,"aria-live":"polite"},ja={class:"monthly-stats"},Ga={key:0},Xa={style:{overflow:"auto","max-height":"240px"}},Wa={key:0},Qa=kn({__name:"MonthlyAttendancePage",setup(e){const d=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit"}).formatToParts(new Date),a=Mn({thang:Number(d.find(p=>p.type==="month").value),nam:Number(d.find(p=>p.type==="year").value),maBoPhan:null,maNhanVien:null}),t=f({...a}),u=f(!1),r=f(""),y=f("summary"),k=oe(),_=O(()=>k.can("attendance","update")),v=f([]),T=f(""),S=f(!1),L=O(()=>[...new Map(v.value.filter(p=>p.maBoPhan).map(p=>[p.maBoPhan,{code:p.maBoPhan,label:p.tenBoPhan||p.maBoPhan}])).values()].sort((p,o)=>p.label.localeCompare(o.label,"vi"))),D=O(()=>v.value.filter(p=>!a.maBoPhan||p.maBoPhan===a.maBoPhan).map(p=>({...p,label:p.maNhanVien+" · "+mn(p)}))),N=O(()=>v.value.find(p=>p.maNhanVien===t.value.maNhanVien)),K=f([]),V=f([]),E=f(!1),x=f(""),M=f(null),R=f(""),X=f(""),j=f(""),on=O(()=>K.value.filter(p=>!t.value.maNhanVien||p.maNhanVien===t.value.maNhanVien)),wn=Mn(st.map(p=>({...p}))),yn=O(()=>wn.filter(p=>p.visible)),vn=O(()=>String(t.value.thang).padStart(2,"0")+"/"+t.value.nam),I=f(!1),H=f(!1),un=f(""),Cn=f(new Set),bn=p=>p.nam+"-"+p.thang,Tn=O(()=>Cn.value.has(bn(t.value))),cn=f(!1),w=O(()=>{var p;return _.value&&!I.value&&!H.value&&((p=M.value)==null?void 0:p.trangThai)==="O"}),h=f(!1),b=f(!1),g=f(""),c=f([]),C=f(),W=f({...t.value}),nn=f(),tn=f(null),Zn=f(),Rn=f(!1),qn=f(),Kn=f(!1),pn=f(),fn=f(""),dn=f(),Yn=f(""),Fn=f(!1);let $n=0,Hn=0,_n=0,G=!1;const jn=new Set,De=p=>JSON.stringify(p);async function ue(){S.value=!0,T.value="";try{const p=await Je.list(null);G||(v.value=p.map(o=>({maNhanVien:o.maNhanVien,ho:o.ho,tenDem:o.tenDem,ten:o.ten,hoTen:o.hoTen,maBoPhan:o.maBoPhan,tenBoPhan:o.tenBoPhan})))}catch(p){G||(T.value=an(p))}finally{G||(S.value=!1)}}async function ne(){const p=++Hn;M.value=null,R.value="";try{const o=await ie({nam:t.value.nam,thang:t.value.thang,trangThai:null});if(p!==Hn||G)return;o.length===1?M.value=o[0]:R.value=o.length?"Có nhiều kỳ cho tháng này.":"Chưa có kỳ chấm công cho tháng này."}catch(o){p===Hn&&!G&&(R.value=an(o))}}async function Vn(p=!1){const o=++$n,m={...t.value},B=y.value,q=De(m);if(x.value="",!p&&(B==="summary"?X.value:j.value)===q){E.value=!1;return}E.value=!0;try{if(B==="summary"){const ln=await pe(m);o===$n&&!G&&(K.value=ln,X.value=q)}else{const ln=await te(m);o===$n&&!G&&(V.value=ln,j.value=q)}}catch(ln){o===$n&&!G&&(x.value=an(ln),B==="summary"?(K.value=[],X.value=""):(V.value=[],j.value=""))}finally{o===$n&&!G&&(E.value=!1)}}function Ae(){if(!(I.value||H.value))try{if(Jn(a),a.maNhanVien&&!D.value.some(p=>p.maNhanVien===a.maNhanVien))throw new Error("Nhân viên không thuộc bộ phận đã chọn.");t.value={...a},r.value="",X.value="",j.value="",tn.value=null,h.value=!1,Rn.value=!1,un.value="",ne(),Vn(!0)}catch(p){x.value=an(p)}}async function Re(){if(!(u.value||I.value||H.value)){u.value=!0,r.value="";try{const{blob:p,filename:o}=await Qt({...t.value});if(G)return;const m=URL.createObjectURL(p),B=document.createElement("a");B.href=m,B.download=o,document.body.append(B);try{B.click()}finally{B.remove(),setTimeout(()=>URL.revokeObjectURL(m),1e3)}}catch(p){G||(r.value=an(p))}finally{G||(u.value=!1)}}}xn(()=>a.maBoPhan,()=>{a.maNhanVien&&!D.value.some(p=>p.maNhanVien===a.maNhanVien)&&(a.maNhanVien=null)}),xn(y,()=>{tn.value=null,Rn.value=!1,Vn()});async function Fe(p){const o=++_n;C.value=p,W.value={...t.value,maNhanVien:p.maNhanVien},h.value=!0,b.value=!0,g.value="",c.value=[];try{const m=await te({...W.value});o===_n&&!G&&(c.value=m)}catch(m){o===_n&&!G&&(g.value=an(m))}finally{o===_n&&!G&&(b.value=!1)}}xn(h,p=>{p||++_n});async function Oe(){if(!nn.value||b.value||g.value||!c.value.length)return;const p=document.createElement("iframe");p.title="Bản in phiếu chấm công",p.style.cssText="position:fixed;width:1px;height:1px;left:-10000px;top:0;border:0;",document.body.append(p),jn.add(p);const o=p.contentDocument,m=p.contentWindow;if(!o||!m){p.remove(),jn.delete(p);return}o.open(),o.write('<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Phiếu chấm công tháng</title></head><body></body></html>'),o.close();const B=o.createElement("style");B.textContent=ea,o.head.append(B),o.body.append(o.importNode(nn.value,!0));const q=()=>{p.remove(),jn.delete(p)};m.addEventListener("afterprint",q,{once:!0});try{if(await o.fonts.ready,G){q();return}m.focus(),m.print()}catch(ln){un.value="Không mở được hộp thoại in: "+an(ln),q()}setTimeout(q,6e4)}async function ze(p,o){var ln,On;if(!_e(p,w.value).length)return;const m=o.currentTarget instanceof HTMLElement?o.currentTarget.getBoundingClientRect():null,B=o.type==="click"&&o.detail===0&&m?m.left:o.clientX,q=o.type==="click"&&o.detail===0&&m?m.bottom:o.clientY;tn.value={row:p,x:Math.max(10,Math.min(B,window.innerWidth-270)),y:Math.max(10,Math.min(q,window.innerHeight-270))},await Ke(),(On=(ln=Zn.value)==null?void 0:ln.querySelector("button:not(:disabled)"))==null||On.focus()}function Ie(p){qn.value=p,Rn.value=!0,tn.value=null}function ce(p){var o,m;if(p.key==="Escape"&&(tn.value=null),tn.value&&["ArrowDown","ArrowUp","Home","End"].includes(p.key)){p.preventDefault();const B=Array.from(((o=Zn.value)==null?void 0:o.querySelectorAll("button:not(:disabled)"))||[]);if(!B.length)return;const q=B.indexOf(document.activeElement);(m=B[p.key==="Home"?0:p.key==="End"?B.length-1:(q+(p.key==="ArrowDown"?1:B.length-1))%B.length])==null||m.focus()}}function En(){tn.value=null}async function ee(p,o){if(I.value||H.value||!_.value)return;const m=o?v.value.find(q=>q.maNhanVien===o.maNhanVien)||o:N.value,B={filter:{...t.value},employee:m,day:o};tn.value=null,pn.value=void 0,dn.value=void 0,cn.value=!1,Yn.value="",Fn.value=!1,fn.value="",Kn.value=!0,H.value=!0;try{const q=await Yt(p,B);G||(pn.value=q)}catch(q){G||(fn.value=an(q))}finally{G||(H.value=!1)}}async function Me(){var o,m;if(!pn.value||cn.value||I.value||!Fn.value||dn.value||!_.value)return;const p=pn.value;I.value=!0,fn.value="";try{const B=await na(p);if(G)return;dn.value=B.data,Yn.value=B.message,X.value="",j.value="",p.kind!=="month"?Cn.value.add(bn(p.context.filter)):!p.context.filter.maNhanVien&&!p.context.filter.maBoPhan&&Cn.value.delete(bn(p.context.filter));const q=Number(((o=B.data.thongKe)==null?void 0:o.soDongBoQuaKhongCapNhat)??((m=B.data.thongKe)==null?void 0:m.soNhanVienBoQuaDaKhoa)??0);un.value=q>0?"Máy chủ trả kết quả có "+q+" dòng/nhân viên bị bỏ qua. Xem thống kê chi tiết.":B.message,await Promise.allSettled([Vn(!0),ne()])}catch(B){G||(cn.value=!0,fn.value=an(B)+" Kết quả ghi có thể chưa xác định; hãy kiểm tra lại dữ liệu trước khi tính lại.")}finally{G||(I.value=!1)}}async function Ue(){if(!(!pn.value||I.value)){I.value=!0;try{const p=pn.value.context;pn.value.kind==="person"?await te({...p.filter,maNhanVien:p.employee.maNhanVien}):await pe(p.filter),await Vn(!0),cn.value=!1,fn.value="Đã tải lại dữ liệu. Kiểm tra kết quả trước khi quyết định gửi lại yêu cầu."}catch(p){fn.value=an(p)}finally{I.value=!1}}}return fe(()=>{Promise.allSettled([ue(),ne(),Vn()]),document.addEventListener("click",En),document.addEventListener("keydown",ce),window.addEventListener("resize",En),window.addEventListener("scroll",En,!0)}),xe(()=>{G=!0,++$n,++_n,++Hn,document.removeEventListener("click",En),document.removeEventListener("keydown",ce),window.removeEventListener("resize",En),window.removeEventListener("scroll",En,!0),jn.forEach(p=>p.remove())}),(p,o)=>(i(),s("section",{class:"monthly-page","aria-busy":I.value},[n("header",aa,[n("div",null,[o[17]||(o[17]=n("h1",null,"Bảng chấm công tháng",-1)),n("p",null,[P(" Tháng "+l(vn.value),1),M.value?(i(),s(A,{key:0},[P(" · "+l($(Ye)[M.value.trangThai]||M.value.trangThai)+" · "+l($(en)(M.value.tuNgay))+" – "+l($(en)(M.value.denNgay)),1),M.value.ngayChot?(i(),s(A,{key:0},[P(" · Chốt: "+l($(en)(M.value.ngayChot)),1)],64)):F("",!0)],64)):F("",!0)])]),n("div",la,[U(J,{label:"Xuất Excel",icon:"pi pi-file-excel",severity:"success",outlined:"",loading:u.value,disabled:u.value||I.value||H.value,onClick:Re},null,8,["loading","disabled"]),U(J,{label:"Chấm công ngày hàng loạt",icon:"pi pi-calendar",severity:"secondary",outlined:"",disabled:!_.value||I.value||H.value,onClick:o[0]||(o[0]=m=>ee("batch"))},null,8,["disabled"]),U(J,{label:"Chấm công tháng",icon:"pi pi-calculator",disabled:!_.value||I.value||H.value,onClick:o[1]||(o[1]=m=>ee("month"))},null,8,["disabled"])])]),n("form",{class:"monthly-filters",onSubmit:In(Ae,["prevent"])},[n("label",null,[o[18]||(o[18]=P("Tháng",-1)),Y(n("select",{"onUpdate:modelValue":o[2]||(o[2]=m=>a.thang=m),disabled:I.value||H.value},[(i(),s(A,null,z(12,m=>n("option",{key:m,value:m},"Tháng "+l(m),9,ia)),64))],8,oa),[[Nn,a.thang,void 0,{number:!0}]])]),n("label",null,[o[19]||(o[19]=P("Năm",-1)),Y(n("input",{"onUpdate:modelValue":o[3]||(o[3]=m=>a.nam=m),type:"number",min:"100",max:"9998",required:"",disabled:I.value||H.value},null,8,ra),[[Un,a.nam,void 0,{number:!0}]])]),n("label",null,[o[21]||(o[21]=P("Bộ phận",-1)),Y(n("select",{"onUpdate:modelValue":o[4]||(o[4]=m=>a.maBoPhan=m),disabled:I.value||H.value||S.value},[o[20]||(o[20]=n("option",{value:null},"Tất cả bộ phận",-1)),(i(!0),s(A,null,z(L.value,m=>(i(),s("option",{key:m.code,value:m.code},l(m.label),9,ua))),128))],8,sa),[[Nn,a.maBoPhan]])]),n("label",ca,[o[22]||(o[22]=P("Nhân viên",-1)),U($(Qe),{modelValue:a.maNhanVien,"onUpdate:modelValue":o[5]||(o[5]=m=>a.maNhanVien=m),options:D.value,"option-label":"label","option-value":"maNhanVien",filter:"","show-clear":"",placeholder:"Tất cả / tìm mã hoặc họ tên",disabled:I.value||H.value||S.value,loading:S.value,"aria-label":"Chọn nhân viên"},null,8,["modelValue","options","disabled","loading"])]),U(J,{type:"submit",label:"Áp dụng",icon:"pi pi-filter",disabled:I.value||H.value},null,8,["disabled"])],32),r.value?(i(),s("p",da,l(r.value),1)):F("",!0),T.value?(i(),s("p",ha,[P(" Không tải được danh mục: "+l(T.value)+" ",1),n("button",{type:"button",onClick:ue},"Thử lại")])):F("",!0),R.value?(i(),s("p",pa,l(R.value),1)):F("",!0),un.value?(i(),s("p",ma,l(un.value),1)):F("",!0),Tn.value?(i(),s("p",ga," Dữ liệu công ngày đã được xử lý. Cần chấm công tháng để cập nhật tổng hợp nếu backend không tổng hợp tự động. ")):F("",!0),n("div",ya,[n("div",va,[n("button",{id:"monthly-summary-tab",type:"button",role:"tab","aria-selected":y.value==="summary","aria-controls":"monthly-summary-panel",onClick:o[6]||(o[6]=m=>y.value="summary")}," Tổng hợp công tháng",8,ba),n("button",{id:"monthly-daily-tab",type:"button",role:"tab","aria-selected":y.value==="daily","aria-controls":"monthly-daily-panel",onClick:o[7]||(o[7]=m=>y.value="daily")}," Chi tiết công tháng ",8,fa)]),E.value?(i(),s("div",xa,[(i(),s(A,null,z(4,m=>n("span",{key:m})),64)),o[23]||(o[23]=n("p",null,"Đang tải dữ liệu công tháng…",-1))])):x.value?(i(),s("div",ka,[n("p",wa,l(x.value),1),U(J,{label:"Thử lại",onClick:o[8]||(o[8]=m=>Vn(!0))})])):F("",!0),Y(n("section",Ca,[n("div",Na,[n("div",null,[n("h2",null,"Tổng hợp tháng "+l(vn.value),1),n("p",Ta,l(on.value.length)+" nhân viên · Nhấn họ tên để xem và in phiếu ",1)]),n("details",$a,[o[24]||(o[24]=n("summary",null,"Chọn cột hiển thị",-1)),n("div",_a,[(i(!0),s(A,null,z(wn,m=>(i(),s("label",{key:m.key},[Y(n("input",{"onUpdate:modelValue":B=>m.visible=B,type:"checkbox"},null,8,Va),[[he,m.visible]]),P(l(m.label),1)]))),128))])])]),n("div",Ea,[n("table",Pa,[n("colgroup",null,[o[25]||(o[25]=n("col",{class:"summary-code-col"},null,-1)),o[26]||(o[26]=n("col",{class:"summary-name-col"},null,-1)),o[27]||(o[27]=n("col",{class:"summary-dept-col"},null,-1)),(i(!0),s(A,null,z(yn.value,m=>(i(),s("col",{key:m.key,class:"summary-data-col"}))),128))]),n("thead",null,[n("tr",null,[o[28]||(o[28]=n("th",{scope:"col"},"Mã nhân viên",-1)),o[29]||(o[29]=n("th",{scope:"col"},"Họ và tên",-1)),o[30]||(o[30]=n("th",{scope:"col"},"Bộ phận",-1)),(i(!0),s(A,null,z(yn.value,m=>(i(),s("th",{key:m.key,scope:"col"},l(m.label),1))),128))])]),n("tbody",null,[(i(!0),s(A,null,z(on.value,m=>(i(),s("tr",{key:m.maNhanVien},[n("td",null,l(m.maNhanVien),1),n("td",null,[n("button",{type:"button",class:"monthly-name",onClick:B=>Fe(m)},l($(mn)(m)),9,Sa)]),n("td",null,l(m.tenBoPhan||m.maBoPhan||"—"),1),(i(!0),s(A,null,z(yn.value,B=>(i(),s("td",{key:B.key},l($(Te)(m[B.key],B.hours)),1))),128))]))),128)),on.value.length?F("",!0):(i(),s("tr",La,[n("td",{colspan:yn.value.length+3},[...o[31]||(o[31]=[n("div",{class:"monthly-empty"},"Không có dữ liệu công tháng theo bộ lọc.",-1)])],8,Ba)]))])])])],512),[[de,y.value==="summary"&&!E.value&&!x.value]]),Y(n("section",Da,[n("div",Aa,[n("div",null,[n("h2",null,"Chi tiết công tháng "+l(vn.value),1),n("p",Ra," Danh sách nhân viên · Các cột ngày 1–"+l(new Date(t.value.nam,t.value.thang,0).getDate())+" · Ký hiệu công và nghỉ phép ",1)])]),U(Gt,{rows:V.value,employees:v.value,filter:t.value,"allow-actions":w.value,onMenu:ze,onDetail:Ie},null,8,["rows","employees","filter","allow-actions"])],512),[[de,y.value==="daily"&&!E.value&&!x.value]])]),(i(),gn(qe,{to:"body"},[tn.value&&w.value?(i(),s("div",{key:0,ref_key:"menuElement",ref:Zn,class:"monthly-context-menu",role:"menu","aria-label":"Xử lý công ngày",style:Ln({left:tn.value.x+"px",top:tn.value.y+"px"}),onClick:o[10]||(o[10]=In(()=>{},["stop"]))},[n("p",null,l($(en)(tn.value.row.ngayChamCong))+" · "+l($(mn)(tn.value.row)),1),n("button",{role:"menuitem",type:"button",onClick:o[9]||(o[9]=m=>ee("person",tn.value.row))}," Tính lại công ")],4)):F("",!0)])),U($(Xn),{visible:h.value,"onUpdate:visible":o[12]||(o[12]=m=>h.value=m),modal:"",header:"Phiếu chấm công tháng",style:{width:"1080px",maxWidth:"96vw"}},{footer:hn(()=>[U(J,{label:"Đóng",severity:"secondary",outlined:"",onClick:o[11]||(o[11]=m=>h.value=!1)}),U(J,{label:"In phiếu",icon:"pi pi-print",disabled:b.value||!!g.value||!c.value.length,onClick:Oe},null,8,["disabled"])]),default:hn(()=>{var m,B,q,ln,On;return[b.value?(i(),s("div",Fa,"Đang tải phiếu chấm công…")):g.value?(i(),s("p",Oa,l(g.value),1)):(i(),s("div",{key:2,ref_key:"reportElement",ref:nn,class:"monthly-report"},[n("h2",null," PHIẾU CHẤM CÔNG THÁNG "+l(String(W.value.thang).padStart(2,"0"))+"/"+l(W.value.nam),1),n("p",null,[n("strong",null,l($(mn)(C.value)),1),P(" · "+l((m=C.value)==null?void 0:m.maNhanVien)+" · "+l(((B=C.value)==null?void 0:B.tenBoPhan)||((q=C.value)==null?void 0:q.maBoPhan)||"—"),1)]),n("p",null," Kỳ công: "+l($(en)((ln=c.value[0])==null?void 0:ln.tuNgay))+" – "+l($(en)((On=c.value[0])==null?void 0:On.denNgay)),1),c.value.length?F("",!0):(i(),s("p",za,"Chưa có dữ liệu chấm công.")),U(Pt,{rows:c.value,year:W.value.nam,month:W.value.thang,readonly:""},null,8,["rows","year","month"])],512))]}),_:1},8,["visible"]),U($(Xn),{visible:Kn.value,"onUpdate:visible":o[15]||(o[15]=m=>Kn.value=m),modal:"",header:"Xác nhận tính công",closable:!I.value&&!H.value,"close-on-escape":!I.value&&!H.value,style:{width:"640px",maxWidth:"96vw"}},{footer:hn(()=>[U(J,{label:"Đóng",severity:"secondary",outlined:"",disabled:I.value||H.value,onClick:o[14]||(o[14]=m=>Kn.value=!1)},null,8,["disabled"]),cn.value?(i(),gn(J,{key:0,label:"Kiểm tra lại dữ liệu",loading:I.value,onClick:Ue},null,8,["loading"])):F("",!0),dn.value?F("",!0):(i(),gn(J,{key:1,label:"Thực hiện tính công",icon:"pi pi-calculator",loading:I.value,disabled:cn.value||!pn.value||!Fn.value||H.value||I.value||!_.value,onClick:Me},null,8,["loading","disabled"]))]),default:hn(()=>{var m;return[H.value?(i(),s("p",Ia,"Đang kiểm tra kỳ và phạm vi tính công…")):F("",!0),fn.value?(i(),s("p",Ma,l(fn.value),1)):F("",!0),pn.value?(i(),s(A,{key:2},[n("ul",null,[(i(!0),s(A,null,z(pn.value.scope,B=>(i(),s("li",{key:B},l(B),1))),128))]),dn.value?F("",!0):(i(),s("p",Ua," Chỉ cập nhật phạm vi trên. Các dòng bị khóa có thể bị bỏ qua theo kết quả máy chủ. ")),dn.value?F("",!0):(i(),s("label",qa,[Y(n("input",{"onUpdate:modelValue":o[13]||(o[13]=B=>Fn.value=B),type:"checkbox",disabled:I.value},null,8,Ka),[[he,Fn.value]]),o[32]||(o[32]=P(" Tôi xác nhận phạm vi tính công.",-1))]))],64)):F("",!0),dn.value?(i(),s("section",Ha,[o[34]||(o[34]=n("h3",null,"Kết quả máy chủ",-1)),n("p",null,l(Yn.value),1),n("p",null,"Mã trả về: "+l(dn.value.returnCode??"—"),1),n("dl",ja,[(i(!0),s(A,null,z(dn.value.thongKe||{},(B,q)=>(i(),s("div",{key:q},[n("dt",null,l($(ut)[String(q)]||q),1),n("dd",null,l(B??"—"),1)]))),128))]),(m=dn.value.resultSets)!=null&&m.length?(i(),s("details",Ga,[o[33]||(o[33]=n("summary",null,"Kết quả chi tiết",-1)),n("pre",Xa,l(JSON.stringify(dn.value.resultSets,null,2)),1)])):F("",!0)])):F("",!0)]}),_:1},8,["visible","closable","close-on-escape"]),U($(We),{visible:Rn.value,"onUpdate:visible":o[16]||(o[16]=m=>Rn.value=m),position:"right",header:"Chi tiết công ngày",style:{width:"400px",maxWidth:"95vw"}},{default:hn(()=>[qn.value?(i(),s("p",Wa,l($(mn)(qn.value))+" · "+l($(en)(qn.value.ngayChamCong)),1)):F("",!0),o[35]||(o[35]=n("p",{class:"monthly-notice"},"Nội dung chi tiết công ngày sẽ được phát triển sau.",-1))]),_:1},8,["visible"])],8,ta))}}),Ja={class:"report-export-buttons",role:"group","aria-label":"Xuất báo cáo đang chọn"},Za=kn({__name:"ReportExportButtons",props:{formats:{default:()=>[]},busy:{default:null},disabled:{type:Boolean,default:!1}},emits:["export"],setup(e,{emit:d}){const a=d;return(t,u)=>(i(),s("div",Ja,[(i(),s(A,null,z(["excel","pdf"],r=>U(J,{key:r,type:"button",label:r==="excel"?"Xuất Excel":"Xuất PDF",icon:r==="excel"?"pi pi-file-excel":"pi pi-file-pdf",severity:"secondary",outlined:"",loading:e.busy===r,disabled:e.disabled||!!e.busy||!e.formats.includes(r),title:e.formats.includes(r)?"Xuất toàn bộ kết quả theo bộ lọc đã áp dụng":"Chức năng xuất chưa khả dụng cho báo cáo này",onClick:y=>a("export",r)},null,8,["label","icon","loading","disabled","title","onClick"])),64))]))}}),Be=Ce(Za,[["__scopeId","data-v-c24745f8"]]);async function Ya(e,d,a,t){const u=new URL(e,new URL("https://hrmsapi-crc3crfdegesbper.westus3-01.azurewebsites.net/graphql",window.location.origin));for(const[r,y]of Object.entries(d))y!==null&&y!==""&&u.searchParams.set(r,String(y));return ke(async()=>{var L,D;const r=await fetch(u,{method:"GET",credentials:"include",headers:{Authorization:`Bearer ${ve.get()}`,Accept:a==="pdf"?"application/pdf":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}});if(r.status===401)throw new be(401);const y=(r.headers.get("content-type")||"").toLowerCase();if(!r.ok||y.includes("json")||y.includes("text/html")){const N=await r.json().catch(()=>null);throw new Error((N==null?void 0:N.message)||(N==null?void 0:N.detail)||(N==null?void 0:N.title)||(N==null?void 0:N.code)||(N==null?void 0:N.Code)||`Không thể xuất báo cáo (HTTP ${r.status}).`)}const k=await r.blob();if(!k.size)throw new Error("Máy chủ trả về tệp báo cáo trống.");const _=r.headers.get("content-disposition")||"",v=(L=/filename\*\s*=\s*UTF-8''([^;]+)/i.exec(_))==null?void 0:L[1],T=/filename\s*=\s*(?:"([^"]+)"|([^;]+))/i.exec(_);let S=(T==null?void 0:T[1])||((D=T==null?void 0:T[2])==null?void 0:D.trim())||t;if(v)try{S=decodeURIComponent(v.trim())}catch{}return S=S.replace(/[/\\\r\n]/g,"_"),{blob:k,filename:S||t}})}function nl(e){const d=URL.createObjectURL(e.blob),a=document.createElement("a");try{a.href=d,a.download=e.filename,document.body.append(a),a.click()}finally{a.remove(),setTimeout(()=>URL.revokeObjectURL(d),1e3)}}const el=An`
  query DiMuonVeSom($input: DiMuonVeSomInput!) {
    diMuonVeSom(input: $input) {
      isResults
      message
      data {
        pageIndex
        pageSize
        totalRecords
        totalPages
        items {
          thang
          nam
          maNhanVien
          hoVaTen
          ngaySinh
          gioiTinh
          maBoPhan
          tenBoPhan
          maCa
          tenCa
          gioBatDau
          gioKetThuc
          tinhCaDem
          ngayChamCong
          gioVao
          gioRa
          diTre
          veSom
          tinhTrang
        }
      }
    }
  }
`;function se(e){var t,u;if(!Number.isInteger(e.thang)||e.thang<1||e.thang>12||!Number.isInteger(e.nam)||e.nam<1753||e.nam>9998)throw new Error("Tháng hoặc năm báo cáo không hợp lệ.");const d=((t=e.ten)==null?void 0:t.trim())||null,a=((u=e.maBoPhan)==null?void 0:u.trim())||null;if(d&&(d.length>100||[...d].some(r=>r.charCodeAt(0)<32||r.charCodeAt(0)===127)))throw new Error("Tên tìm kiếm không hợp lệ hoặc vượt quá 100 ký tự.");return{thang:e.thang,nam:e.nam,ten:d,maBoPhan:a}}async function tl(e,d=1,a=20){const t={...se(e),pageIndex:d,pageSize:a};if(!Number.isInteger(d)||d<1||!Number.isInteger(a)||a<1||a>200)throw new Error("Thông tin phân trang báo cáo không hợp lệ.");const{data:u}=await Dn.query({query:el,variables:{input:t},fetchPolicy:"no-cache",errorPolicy:"none"}),r=u==null?void 0:u.diMuonVeSom;if((r==null?void 0:r.isResults)!==!0||!r.data)throw new Error((r==null?void 0:r.message)||"Không thể tải báo cáo đi muộn / về sớm.");const y=r.data;if(!Array.isArray(y.items)||!Number.isInteger(y.pageIndex)||y.pageIndex<1||!Number.isInteger(y.pageSize)||y.pageSize<1||!Number.isSafeInteger(y.totalRecords)||y.totalRecords<0||!Number.isSafeInteger(y.totalPages)||y.totalPages<0)throw new Error("Dữ liệu phân trang báo cáo không hợp lệ.");return{...y,items:y.items.filter(k=>k!==null)}}function al(e,d){const a=se(e);if(d!=="excel"&&d!=="pdf")throw new Error("Định dạng xuất báo cáo không hợp lệ.");return Ya("/api/di-muon-ve-som/export-"+d,{...a},d,`DiMuonVeSom_${a.nam}_${String(a.thang).padStart(2,"0")}.${d==="pdf"?"pdf":"xlsx"}`)}const Q=(e,d,a,t=120,u=!1)=>({key:e,label:d,group:a,width:t,numeric:u,total:u}),ge=[Q("code","Mã nhân viên","Nhân sự",108),Q("name","Họ và tên","Nhân sự",190),Q("departmentCode","Mã bộ phận","Đơn vị"),Q("department","Bộ phận","Đơn vị",175),Q("birthDate","Ngày sinh","Thông tin cá nhân"),Q("gender","Giới tính","Thông tin cá nhân",90),Q("period","Tháng / Năm","Chấm công"),Q("date","Ngày chấm công","Chấm công",140),Q("shiftCode","Mã ca","Ca làm việc",90),Q("shift","Tên ca","Ca làm việc",150),Q("scheduledIn","Giờ bắt đầu","Ca làm việc"),Q("scheduledOut","Giờ kết thúc","Ca làm việc"),Q("night","Ca đêm","Ca làm việc",90),Q("checkIn","Giờ vào","Thực tế"),Q("checkOut","Giờ ra","Thực tế"),Q("late","Đi trễ (phút)","Chênh lệch",120,!0),Q("early","Về sớm (phút)","Chênh lệch",120,!0),Q("status","Tình trạng","Đánh giá",150)];function ye(e){return e?/^\d{4}-\d{2}-\d{2}/.test(e)?e.slice(0,10).split("-").reverse().join("/"):e:"—"}const Gn=e=>at(e)||e||"—";function ll(e,d,a){return e.map((t,u)=>({id:`${d}:${a}:${u}:${t.maNhanVien}:${t.ngayChamCong}:${t.maCa}`,code:t.maNhanVien,name:t.hoVaTen||t.maNhanVien,departmentCode:t.maBoPhan||"—",department:t.tenBoPhan||"—",birthDate:ye(t.ngaySinh),gender:t.gioiTinh||"—",period:t.thang!==null&&t.nam!==null?`${t.thang}/${t.nam}`:"—",date:ye(t.ngayChamCong),shiftCode:t.maCa||"—",shift:t.tenCa||"—",scheduledIn:Gn(t.gioBatDau),scheduledOut:Gn(t.gioKetThuc),night:t.tinhCaDem===null?"—":t.tinhCaDem?"Có":"Không",checkIn:Gn(t.gioVao),checkOut:Gn(t.gioRa),late:t.diTre,early:t.veSom,status:t.tinhTrang||"—"}))}const ol={class:"late-early-report"},il=["disabled"],rl=["value"],sl={class:"report-filter-actions"},ul={key:0,class:"report-error",role:"alert"},cl={key:1,class:"report-error",role:"alert"},dl={class:"report-metrics"},hl=["aria-busy"],pl={class:"report-panel-heading"},ml={key:0,class:"report-feedback",role:"status"},gl={key:1,class:"report-error",role:"alert"},yl={key:2,class:"report-loading",role:"status"},vl={key:3,class:"report-error",role:"alert"},bl={class:"report-pagination"},fl=["disabled"],xl=["value"],kl=["disabled"],wl={class:"report-page-current"},Cl=["disabled"],Nl={key:0,class:"report-detail"},Tl={class:"report-detail-values"},$l=kn({__name:"LateEarlyReport",setup(e){function d(){const g=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit"}).formatToParts(new Date);return g.find(c=>c.type==="year").value+"-"+g.find(c=>c.type==="month").value}const a=d(),t=Mn({period:a,department:"",name:""}),u=f({...t}),r=f(1),y=f(20),k=Mn({pageIndex:1,pageSize:20,totalRecords:0,totalPages:0}),_=f([]),v=f(!1),T=f(""),S=f(""),L=f([]),D=f(!1),N=f(""),K=f(null),V=f(""),E=f(""),x=f(null),M=f(!1);let R=0,X=0,j=!1;function on(g){if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(g.period))throw new Error("Vui lòng chọn tháng báo cáo hợp lệ.");const[c,C]=g.period.split("-").map(Number);return se({thang:C,nam:c,ten:g.name,maBoPhan:g.department})}const wn=O(()=>on(u.value)),yn=O(()=>u.value.period.split("-").reverse().join("/")),vn=O(()=>{var g;return((g=L.value.find(c=>c.code===u.value.department))==null?void 0:g.name)||u.value.department||"Tất cả bộ phận"}),I=O(()=>ll(_.value,k.pageIndex,k.pageSize)),H=O(()=>Math.max(1,k.totalPages)),un=O(()=>(k.pageIndex-1)*k.pageSize),Cn=O(()=>[["Tổng bản ghi",v.value?"—":Bn(k.totalRecords),"pi-list","Toàn bộ kết quả theo bộ lọc"],["Nhân viên / trang",v.value?"—":String(new Set(_.value.map(g=>g.maNhanVien)).size),"pi-users","Trong trang đang xem"],["Đi trễ (phút)",v.value?"—":Bn(_.value.reduce((g,c)=>g+c.diTre,0)),"pi-sign-in","Tổng trên trang đang xem"],["Về sớm (phút)",v.value?"—":Bn(_.value.reduce((g,c)=>g+c.veSom,0)),"pi-sign-out","Tổng trên trang đang xem"]]);async function bn(){const g=++R,c=r.value,C=y.value,W={...wn.value};v.value=!0,T.value="",_.value=[],Object.assign(k,{pageIndex:c,pageSize:C,totalRecords:0,totalPages:0}),M.value=!1;try{const nn=await tl(W,c,C);if(g!==R||j)return;if(nn.totalRecords>0&&nn.totalPages>0&&c>nn.totalPages){r.value=nn.totalPages;return}_.value=nn.items,Object.assign(k,{pageIndex:nn.pageIndex,pageSize:nn.pageSize,totalRecords:nn.totalRecords,totalPages:nn.totalPages})}catch(nn){g===R&&!j&&(T.value=an(nn))}finally{g===R&&!j&&(v.value=!1)}}async function Tn(){const g=++X;D.value=!0,N.value="";try{const c=await lt();g===X&&!j&&(L.value=c)}catch(c){g===X&&!j&&(N.value=an(c))}finally{g===X&&!j&&(D.value=!1)}}function cn(){try{const g=on(t);u.value={period:t.period,department:g.maBoPhan||"",name:g.ten||""},r.value=1,S.value="",V.value="",E.value=""}catch(g){S.value=an(g)}}function w(){Object.assign(t,{period:a,department:"",name:""}),cn()}async function h(g){if(K.value||v.value||T.value||!k.totalRecords)return;const c={...wn.value};K.value=g,V.value="",E.value="";try{const C=await al(c,g);if(j)return;nl(C),E.value=`Đã xuất ${g==="pdf"?"PDF":"Excel"} theo bộ lọc tháng ${String(c.thang).padStart(2,"0")}/${c.nam}.`}catch(C){j||(V.value=an(C))}finally{j||(K.value=null)}}function b(g){x.value=g,M.value=!0}return xn(y,()=>{r.value=1},{flush:"sync"}),xn([u,r,y],bn,{immediate:!0}),fe(Tn),xe(()=>{j=!0,++R,++X}),(g,c)=>(i(),s("div",ol,[n("form",{class:"report-filters report-live-filters",onSubmit:In(cn,["prevent"])},[n("label",null,[c[8]||(c[8]=n("span",null,[P("Kỳ báo cáo "),n("b",null,"*")],-1)),Y(n("input",{"onUpdate:modelValue":c[0]||(c[0]=C=>t.period=C),type:"month",min:"1753-01",max:"9998-12",required:""},null,512),[[Un,t.period]])]),n("label",null,[c[10]||(c[10]=n("span",null,"Bộ phận",-1)),Y(n("select",{"onUpdate:modelValue":c[1]||(c[1]=C=>t.department=C),disabled:D.value},[c[9]||(c[9]=n("option",{value:""},"Tất cả bộ phận",-1)),(i(!0),s(A,null,z(L.value,C=>(i(),s("option",{key:C.code,value:C.code},l(C.name)+" · "+l(C.code),9,rl))),128))],8,il),[[Nn,t.department]])]),n("label",null,[c[11]||(c[11]=n("span",null,"Tên nhân viên",-1)),Y(n("input",{"onUpdate:modelValue":c[2]||(c[2]=C=>t.name=C),type:"search",maxlength:"100",placeholder:"Nhập tên nhân viên…","aria-label":"Tên nhân viên báo cáo đi muộn về sớm"},null,512),[[Un,t.name]])]),n("div",sl,[U(J,{type:"submit",label:"Xem báo cáo",icon:"pi pi-filter"}),n("button",{class:"report-reset",type:"button",onClick:w},[...c[12]||(c[12]=[n("i",{class:"pi pi-refresh"},null,-1),P("Đặt lại ",-1)])])])],32),S.value?(i(),s("p",ul,l(S.value),1)):F("",!0),N.value?(i(),s("p",cl,[P(" Không tải được danh mục bộ phận: "+l(N.value),1),U(J,{type:"button",label:"Tải lại danh mục",text:"",loading:D.value,onClick:Tn},null,8,["loading"])])):F("",!0),n("div",dl,[(i(!0),s(A,null,z(Cn.value,(C,W)=>(i(),s("article",{key:C[0],class:rn("report-metric-"+W)},[n("div",null,[n("span",null,l(C[0]),1),n("strong",null,l(C[1]),1),n("small",null,l(C[3]),1)]),n("i",{class:rn(["pi",C[2]])},null,2)],2))),128))]),n("section",{id:"report-panel",class:"report-panel",role:"tabpanel","aria-labelledby":"report-tab-late","aria-busy":v.value},[n("div",pl,[n("div",null,[c[16]||(c[16]=n("span",{class:"report-sheet-label"},[n("i",{class:"pi pi-file-excel"}),P(" BẢNG DỮ LIỆU")],-1)),n("h2",null,[c[13]||(c[13]=P(" Đi muộn / Về sớm ",-1)),n("span",null,"/ "+l(yn.value),1)]),n("p",null,[P(l(vn.value),1),c[14]||(c[14]=n("span",null,"·",-1)),P(l(u.value.name||"Tất cả tên nhân viên"),1),c[15]||(c[15]=n("span",null,"·",-1)),P(l(k.totalRecords)+" bản ghi ",1)])]),U(Be,{formats:["excel","pdf"],busy:K.value,disabled:v.value||!!T.value||!k.totalRecords,onExport:h},null,8,["busy","disabled"])]),E.value?(i(),s("p",ml,[c[17]||(c[17]=n("i",{class:"pi pi-check-circle"},null,-1)),P(" "+l(E.value),1)])):F("",!0),V.value?(i(),s("p",gl,l(V.value),1)):F("",!0),v.value?(i(),s("p",yl,[...c[18]||(c[18]=[n("i",{class:"pi pi-spin pi-spinner"},null,-1),P(" Đang tải báo cáo đi muộn / về sớm... ",-1)])])):T.value?(i(),s("p",vl,[P(l(T.value),1),U(J,{type:"button",label:"Tải lại báo cáo",text:"",onClick:bn})])):(i(),gn(we,{key:4,columns:$(ge),rows:I.value,"all-rows":I.value,offset:un.value,"sort-key":"","sort-direction":1,sortable:!1,"total-label":"TỔNG TRANG","record-count":k.totalRecords,onOpen:b},null,8,["columns","rows","all-rows","offset","record-count"])),n("div",bl,[n("span",null,[c[19]||(c[19]=P("Hiển thị ",-1)),n("strong",null,l(I.value.length?un.value+1:0)+"–"+l(I.value.length?un.value+I.value.length:0),1),P(" / "+l(k.totalRecords)+" bản ghi",1)]),n("div",null,[n("label",null,[c[20]||(c[20]=P("Số dòng",-1)),Y(n("select",{"onUpdate:modelValue":c[3]||(c[3]=C=>y.value=C),disabled:v.value},[(i(),s(A,null,z([10,20,50,100],C=>n("option",{key:C,value:C},l(C),9,xl)),64))],8,fl),[[Nn,y.value,void 0,{number:!0}]])]),n("button",{type:"button","aria-label":"Trang trước",disabled:v.value||r.value<=1,onClick:c[4]||(c[4]=C=>r.value--)},[...c[21]||(c[21]=[n("i",{class:"pi pi-chevron-left"},null,-1)])],8,kl),n("span",wl,l(k.pageIndex),1),n("span",null,"/ "+l(H.value),1),n("button",{type:"button","aria-label":"Trang sau",disabled:v.value||r.value>=H.value,onClick:c[5]||(c[5]=C=>r.value++)},[...c[22]||(c[22]=[n("i",{class:"pi pi-chevron-right"},null,-1)])],8,Cl)])]),c[23]||(c[23]=n("div",{class:"report-sheet-footer"},[n("span",null,"Tổng phút tính trên trang đang xem."),n("span",null,"Excel/PDF xuất toàn bộ kết quả theo bộ lọc đã áp dụng.")],-1))],8,hl),U($(Xn),{visible:M.value,"onUpdate:visible":c[7]||(c[7]=C=>M.value=C),modal:"",header:"Chi tiết đi muộn / về sớm",style:{width:"780px",maxWidth:"95vw"}},{footer:hn(()=>[U(J,{label:"Đóng",severity:"secondary",outlined:"",onClick:c[6]||(c[6]=C=>M.value=!1)})]),default:hn(()=>[x.value?(i(),s("div",Nl,[n("h3",null,l(x.value.code)+" · "+l(x.value.name),1),n("dl",Tl,[(i(!0),s(A,null,z($(ge),C=>(i(),s("div",{key:C.key},[n("dt",null,l(C.label),1),n("dd",null,l(x.value[C.key]),1)]))),128))])])):F("",!0)]),_:1},8,["visible"])]))}}),_l={class:"attendance-reports"},Vl={class:"reports-heading"},El={key:0,class:"reports-prototype"},Pl={class:"report-tabs",role:"tablist","aria-label":"Loại báo cáo chấm công"},Sl=["id","tabindex","aria-selected","onClick","onKeydown"],Ll={class:"report-tab-icon"},Bl={class:"report-tab-number"},Dl={class:"report-filter-actions"},Al={class:"report-period-note"},Rl={key:0,class:"report-error",role:"alert"},Fl={class:"report-metrics"},Ol=["aria-labelledby"],zl={class:"report-panel-heading"},Il={class:"report-heading-exports"},Ml={class:"report-table-tools"},Ul={class:"report-search"},ql=["value"],Kl={key:0,class:"report-feedback",role:"status"},Hl={class:"report-pagination"},jl=["disabled"],Gl={class:"report-page-current"},Xl=["disabled"],Wl={class:"report-sheet-footer"},Ql={key:1,class:"report-legend"},Jl={key:2,class:"report-explanation"},Zl={key:3,class:"report-explanation"},Yl={key:0,class:"report-detail"},no={class:"report-detail-person"},eo={class:"report-detail-values"},to={class:"report-detail-caption"},ao={class:"report-detail-scroll"},lo={class:"report-detail-table"},oo=kn({__name:"AttendanceReportsPage",setup(e){const d=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit"}).formatToParts(new Date),a=d.find(w=>w.type==="year").value+"-"+d.find(w=>w.type==="month").value,t=Mn({period:a,department:""}),u=f({...t}),r=f("monthly"),y=f(""),k=f(""),_=f(1),v=f(20),T=f({key:"",direction:1}),S=f(null),L=f(!1),D=f(""),N=f(""),K=O(()=>et(r.value,u.value.period)),V=O(()=>Pn.find(w=>w.key===r.value)),E=O(()=>u.value.period.split("-").reverse().join("/")),x=O(()=>({monthly:[{value:"issues",label:"Có bất thường"}],late:[{value:"late",label:"Đi muộn"},{value:"early",label:"Về sớm"}],overtime:[{value:"pendingOt",label:"Có giờ chờ duyệt"},{value:"approved",label:"Đã duyệt toàn bộ"}],anomaly:[{value:"Chờ xử lý",label:"Chờ xử lý"},{value:"Đã giải trình",label:"Đã giải trình"}],payroll:[{value:"Cần đối soát",label:"Cần đối soát"},{value:"Đã đối soát",label:"Đã đối soát"}]})[r.value]),M=w=>w.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/gi,"d").toLocaleLowerCase("vi"),R=O(()=>K.value.rows.filter(w=>u.value.department&&w.department!==u.value.department||y.value&&!M(w.name+" "+w.code).includes(M(y.value.trim()))?!1:k.value?["issues","late","early","pendingOt"].includes(k.value)?Number(w[k.value])>0:k.value==="approved"?w.pendingOt===0:w.status===k.value:!0)),X=O(()=>[...R.value].sort((w,h)=>{if(!T.value.key)return 0;const b=w[T.value.key],g=h[T.value.key];return(typeof b=="number"&&typeof g=="number"?b-g:String(b).localeCompare(String(g),"vi"))*T.value.direction})),j=O(()=>Math.max(1,Math.ceil(X.value.length/v.value))),on=O(()=>(_.value-1)*v.value),wn=O(()=>X.value.slice(on.value,on.value+v.value)),yn=O(()=>{const w=R.value,h=c=>Bn(w.reduce((C,W)=>C+Number(W[c]||0),0)),b=new Set(w.map(c=>c.code)).size;return{monthly:[["Nhân viên",String(b),"pi-users","Theo phạm vi báo cáo"],["Công thực tế",h("work"),"pi-calendar-plus","Ngày công đã xác minh"],["Giờ tăng ca",h("ot"),"pi-moon","Tổng OT trong tháng"],["Bất thường",h("issues"),"pi-exclamation-triangle","Dòng cần kiểm tra"]],late:[["Lượt vi phạm",String(w.length),"pi-clock",`${b} nhân viên có phát sinh`],["Đi muộn",h("late"),"pi-sign-in","Tổng số phút"],["Về sớm",h("early"),"pi-sign-out","Tổng số phút"],["Bình quân / lượt",w.length?Bn(w.reduce((c,C)=>c+Number(C.late)+Number(C.early),0)/w.length):"0","pi-chart-bar","Phút chênh lệch"]],overtime:[["Nhân viên có OT",String(b),"pi-users","Có phát sinh trong tháng"],["Tổng giờ tăng ca",h("ot"),"pi-moon","Ngày thường + ngày nghỉ"],["Đã phê duyệt",h("approvedOt"),"pi-check-circle","Giờ OT đã duyệt"],["Chờ phê duyệt",h("pendingOt"),"pi-hourglass","Giờ OT cần xác nhận"]],anomaly:[["Bản ghi bất thường",String(w.length),"pi-exclamation-triangle",`${b} nhân viên liên quan`],["Thiếu giờ vào",String(w.filter(c=>c.anomaly==="Thiếu giờ vào").length),"pi-sign-in","Chưa có log vào"],["Thiếu giờ ra",String(w.filter(c=>c.anomaly==="Thiếu giờ ra").length),"pi-sign-out","Chưa có log ra"],["Chờ xử lý",String(w.filter(c=>c.status==="Chờ xử lý").length),"pi-hourglass","Cần bổ sung / giải trình"]],payroll:[["Công hưởng lương",h("paid"),"pi-wallet","Công thực tế + phép có lương"],["Phép đã sử dụng",h("usedLeave"),"pi-calendar-minus","Ngày phép trong kỳ"],["Quỹ phép còn lại",h("closingLeave"),"pi-calendar","Tổng ngày phép cuối kỳ"],["Cần đối soát",String(w.filter(c=>c.status==="Cần đối soát").length),"pi-exclamation-circle","Nhân viên còn log bất thường"]]}[r.value]}),vn=O(()=>K.value.records.filter(w=>{var h,b;return w.code===((h=S.value)==null?void 0:h.code)&&(!((b=S.value)!=null&&b.date)||w.date.split("-").reverse().join("/")===S.value.date)})),I=O(()=>K.value.columns.filter(w=>!["code","name","department"].includes(w.key)&&!/^d\d+$/.test(w.key)));function H(){if(!tt(t.period).length){D.value="Vui lòng chọn tháng từ năm 2000 đến 2100.";return}u.value={...t},D.value="",N.value=""}function un(){Object.assign(t,{period:a,department:""}),y.value="",k.value="",T.value={key:"",direction:1},H()}function Cn(w){T.value={key:w,direction:T.value.key===w?-T.value.direction:1}}function bn(w){S.value=w,L.value=!0}function Tn(w,h){var c;const b=w.key==="ArrowRight"?1:w.key==="ArrowLeft"?-1:0;if(!b&&w.key!=="Home"&&w.key!=="End")return;w.preventDefault();const g=w.key==="Home"?0:w.key==="End"?Pn.length-1:(h+b+Pn.length)%Pn.length;r.value=Pn[g].key,(c=document.getElementById(`report-tab-${r.value}`))==null||c.focus()}function cn(){const w=C=>{let W=String(C??"");return/^[=+@\-\t\r]/.test(W)&&(W="'"+W),'"'+W.replaceAll('"','""')+'"'},h=K.value.columns,b="\uFEFF"+[h.map(C=>C.label),...X.value.map(C=>h.map(W=>C[W.key]))].map(C=>C.map(w).join(",")).join(`\r
`),g=URL.createObjectURL(new Blob([b],{type:"text/csv;charset=utf-8;"})),c=document.createElement("a");c.href=g,c.download=`BaoCao_${r.value}_${u.value.period}_mau.csv`,document.body.append(c),c.click(),c.remove(),setTimeout(()=>URL.revokeObjectURL(g),1e3),N.value=`Đã xuất ${X.value.length} bản ghi minh họa ra CSV.`}return xn([r,u,y,k,v],()=>{_.value=1,L.value=!1}),xn(r,()=>{k.value="",T.value={key:"",direction:1},N.value=""}),xn(j,w=>{_.value>w&&(_.value=w)}),(w,h)=>(i(),s("section",_l,[n("header",Vl,[h[10]||(h[10]=n("div",null,[n("div",{class:"reports-eyebrow"},[n("span"),P(" ATTENDANCE REPORTS")]),n("h1",null,"Báo cáo chấm công"),n("p",null,"Theo dõi ngày công, kiểm soát biến động và đối soát dữ liệu tính lương.")],-1)),r.value!=="late"?(i(),s("span",El,[...h[9]||(h[9]=[n("i",{class:"pi pi-sparkles"},null,-1),P(" Prototype · Dữ liệu minh họa",-1)])])):F("",!0)]),n("div",Pl,[(i(!0),s(A,null,z($(Pn),(b,g)=>(i(),s("button",{id:`report-tab-${b.key}`,key:b.key,type:"button",role:"tab",tabindex:r.value===b.key?0:-1,"aria-selected":r.value===b.key,"aria-controls":"report-panel",class:rn({active:r.value===b.key}),onClick:c=>r.value=b.key,onKeydown:c=>Tn(c,g)},[n("span",Ll,[n("i",{class:rn(["pi",b.icon])},null,2)]),n("span",null,[n("strong",null,l(b.title),1),n("small",null,l(b.subtitle),1)]),n("span",Bl,"0"+l(g+1),1)],42,Sl))),128))]),r.value==="late"?(i(),gn($l,{key:0})):(i(),s(A,{key:1},[n("form",{class:"report-filters",onSubmit:In(H,["prevent"])},[n("label",null,[h[11]||(h[11]=n("span",null,[P("Kỳ báo cáo "),n("b",null,"*")],-1)),Y(n("input",{"onUpdate:modelValue":h[0]||(h[0]=b=>t.period=b),type:"month",min:"2000-01",max:"2100-12",required:""},null,512),[[Un,t.period]])]),n("label",null,[h[13]||(h[13]=n("span",null,"Bộ phận",-1)),Y(n("select",{"onUpdate:modelValue":h[1]||(h[1]=b=>t.department=b)},[h[12]||(h[12]=n("option",{value:""},"Tất cả bộ phận",-1)),(i(!0),s(A,null,z($(nt),b=>(i(),s("option",{key:b},l(b),1))),128))],512),[[Nn,t.department]])]),n("div",Dl,[U(J,{type:"submit",label:"Xem báo cáo",icon:"pi pi-filter"}),n("button",{class:"report-reset",type:"button",title:"Đặt lại bộ lọc",onClick:un},[...h[14]||(h[14]=[n("i",{class:"pi pi-refresh"},null,-1),n("span",null,"Đặt lại",-1)])])]),n("div",Al,[h[16]||(h[16]=n("i",{class:"pi pi-calendar"},null,-1)),n("span",null,[h[15]||(h[15]=P("Kỳ đang xem",-1)),n("strong",null,"Tháng "+l(E.value),1)])])],32),D.value?(i(),s("p",Rl,l(D.value),1)):F("",!0),n("div",Fl,[(i(!0),s(A,null,z(yn.value,(b,g)=>(i(),s("article",{key:b[0],class:rn("report-metric-"+g)},[n("div",null,[n("span",null,l(b[0]),1),n("strong",null,l(b[1]),1),n("small",null,l(b[3]),1)]),n("i",{class:rn(["pi",b[2]])},null,2)],2))),128))]),n("section",{id:"report-panel",class:"report-panel",role:"tabpanel","aria-labelledby":`report-tab-${r.value}`},[n("div",zl,[n("div",null,[h[19]||(h[19]=n("span",{class:"report-sheet-label"},[n("i",{class:"pi pi-file-excel"}),P(" BẢNG DỮ LIỆU")],-1)),n("h2",null,[P(l(V.value.title)+" ",1),n("span",null,"/ "+l(E.value),1)]),n("p",null,[P(l(u.value.department||"Tất cả bộ phận"),1),h[17]||(h[17]=n("span",null,"·",-1)),P(l(new Set(R.value.map(b=>b.code)).size)+" nhân viên",1),h[18]||(h[18]=n("span",null,"·",-1)),P(l(R.value.length)+" bản ghi ",1)])]),n("div",Il,[U(Be),U(J,{label:"Xuất CSV mẫu",icon:"pi pi-download",severity:"secondary",outlined:"",disabled:!R.value.length,onClick:cn},null,8,["disabled"])])]),n("div",Ml,[n("label",Ul,[h[20]||(h[20]=n("i",{class:"pi pi-search"},null,-1)),Y(n("input",{"onUpdate:modelValue":h[2]||(h[2]=b=>y.value=b),type:"search",placeholder:"Tìm mã hoặc tên nhân viên…","aria-label":"Tìm nhân viên"},null,512),[[Un,y.value]])]),Y(n("select",{"onUpdate:modelValue":h[3]||(h[3]=b=>k.value=b),"aria-label":"Lọc trạng thái báo cáo"},[h[21]||(h[21]=n("option",{value:""},"Tất cả trạng thái",-1)),(i(!0),s(A,null,z(x.value,b=>(i(),s("option",{key:b.value,value:b.value},l(b.label),9,ql))),128))],512),[[Nn,k.value]]),h[22]||(h[22]=n("span",{class:"report-freeze-note"},[n("i",{class:"pi pi-lock"}),P(" Cố định 2 cột nhân viên")],-1))]),N.value?(i(),s("p",Kl,[h[23]||(h[23]=n("i",{class:"pi pi-check-circle"},null,-1)),P(" "+l(N.value),1)])):F("",!0),U(we,{columns:K.value.columns,rows:wn.value,"all-rows":R.value,offset:on.value,"sort-key":T.value.key,"sort-direction":T.value.direction,onSort:Cn,onOpen:bn},null,8,["columns","rows","all-rows","offset","sort-key","sort-direction"]),n("div",Hl,[n("span",null,[h[24]||(h[24]=P("Hiển thị ",-1)),n("strong",null,l(R.value.length?on.value+1:0)+"–"+l(Math.min(on.value+v.value,R.value.length)),1),P(" / "+l(R.value.length)+" bản ghi",1)]),n("div",null,[n("label",null,[h[26]||(h[26]=P("Số dòng ",-1)),Y(n("select",{"onUpdate:modelValue":h[4]||(h[4]=b=>v.value=b)},[...h[25]||(h[25]=[n("option",{value:10},"10",-1),n("option",{value:20},"20",-1),n("option",{value:50},"50",-1),n("option",{value:100},"100",-1)])],512),[[Nn,v.value,void 0,{number:!0}]])]),n("button",{type:"button","aria-label":"Trang trước",disabled:_.value===1,onClick:h[5]||(h[5]=b=>_.value--)},[...h[27]||(h[27]=[n("i",{class:"pi pi-chevron-left"},null,-1)])],8,jl),n("span",Gl,l(_.value),1),n("span",null,"/ "+l(j.value),1),n("button",{type:"button","aria-label":"Trang sau",disabled:_.value>=j.value,onClick:h[6]||(h[6]=b=>_.value++)},[...h[28]||(h[28]=[n("i",{class:"pi pi-chevron-right"},null,-1)])],8,Xl)])]),n("div",Wl,[n("span",null,[h[29]||(h[29]=n("i",{class:"pi pi-check-circle"},null,-1)),P(" "+l(V.value.subtitle),1)]),h[30]||(h[30]=n("span",null,"Σ Tổng cộng tính trên toàn bộ kết quả đã lọc",-1))])],8,Ol),r.value==="monthly"?(i(),s("div",Ql,[h[31]||(h[31]=n("strong",null,"Ký hiệu công",-1)),(i(),s(A,null,z([["X","Đủ công","work"],["M","Đi muộn","warn"],["S","Về sớm","warn"],["P","Phép năm","leave"],["OFF","Ngày nghỉ","off"],["V","Vắng không lương","danger"],["?","Thiếu / lỗi log","danger"]],([b,g,c])=>n("span",{key:b},[n("b",{class:rn("cell-"+c)},l(b),3),P(l(g),1)])),64))])):F("",!0),r.value==="overtime"?(i(),s("p",Jl,[...h[32]||(h[32]=[n("i",{class:"pi pi-info-circle"},null,-1),P(" OT đêm là phần nằm trong tổng OT; không cộng thêm lần nữa. ",-1)])])):F("",!0),r.value==="payroll"?(i(),s("p",Zl,[...h[33]||(h[33]=[n("i",{class:"pi pi-info-circle"},null,-1),P(" Mô phỏng: công hưởng lương = công thực tế + phép có lương. Phép còn lại = đầu kỳ + phát sinh − đã dùng. Công chưa xác minh được tách riêng để đối soát. ",-1)])])):F("",!0),h[35]||(h[35]=n("p",{class:"report-demo-note"}," Dữ liệu mẫu phục vụ duyệt giao diện · Chưa kết nối API báo cáo. ",-1)),U($(Xn),{visible:L.value,"onUpdate:visible":h[8]||(h[8]=b=>L.value=b),modal:"",header:"Chi tiết chấm công",style:{width:"780px",maxWidth:"95vw"}},{footer:hn(()=>[U(J,{label:"Đóng",severity:"secondary",outlined:"",onClick:h[7]||(h[7]=b=>L.value=!1)})]),default:hn(()=>{var b;return[S.value?(i(),s("div",Yl,[n("div",no,[n("span",null,l((b=S.value.name.split(" ").at(-1))==null?void 0:b.slice(0,1)),1),n("div",null,[n("h3",null,l(S.value.name),1),n("p",null,l(S.value.code)+" · "+l(S.value.department),1)]),n("b",null,l(E.value),1)]),n("dl",eo,[(i(!0),s(A,null,z(I.value,g=>(i(),s("div",{key:g.key},[n("dt",null,l(g.label),1),n("dd",null,l(S.value[g.key]),1)]))),128))]),n("p",to," Dữ liệu quẹt thẻ minh họa · "+l(vn.value.length)+" ngày ",1),n("div",ao,[n("table",lo,[h[34]||(h[34]=n("thead",null,[n("tr",null,[n("th",null,"Ngày"),n("th",null,"Ca"),n("th",null,"Giờ vào"),n("th",null,"Giờ ra"),n("th",null,"Ký hiệu"),n("th",null,"OT (giờ)"),n("th",null,"Ghi chú")])],-1)),n("tbody",null,[(i(!0),s(A,null,z(vn.value,g=>(i(),s("tr",{key:g.date},[n("td",null,l(g.date.split("-").reverse().join("/")),1),n("td",null,l(g.shift),1),n("td",null,l(g.checkIn),1),n("td",null,l(g.checkOut),1),n("td",null,l(g.symbol),1),n("td",null,l($(Bn)(g.ot)),1),n("td",null,l(g.anomaly||"—"),1)]))),128))])])])])):F("",!0)]}),_:1},8,["visible"])],64))]))}}),io={class:"attendance-workspace"},ro={"aria-label":"Đường dẫn"},so={class:"workspace-empty"},uo=kn({__name:"AttendanceWorkspaceView",setup(e){const d=je(),a=O(()=>Ge.find(t=>t.path===d.path));return(t,u)=>{var y,k,_,v;const r=He("RouterLink");return i(),s("section",io,[n("nav",ro,[U(r,{to:"/attendance/overview"},{default:hn(()=>[...u[0]||(u[0]=[P("Chấm công",-1)])]),_:1}),n("span",null," / "+l((y=a.value)==null?void 0:y.label),1)]),$(d).meta.attendancePage==="daily"?(i(),gn(ot,{key:0})):$(d).meta.attendancePage==="monthly"?(i(),gn(Qa,{key:1})):$(d).meta.attendancePage==="reports"?(i(),gn(oo,{key:2})):(i(),s(A,{key:3},[n("h1",null,l((k=a.value)==null?void 0:k.label),1),n("div",so,[n("i",{class:rn(["pi",(_=a.value)==null?void 0:_.icon])},null,2),n("h2",null,"Chưa có dữ liệu "+l((v=a.value)==null?void 0:v.label.toLocaleLowerCase()),1),u[2]||(u[2]=n("p",null," Chức năng đã được tách riêng trong module Chấm công. Chưa kết nối nguồn dữ liệu cho màn hình này. ",-1)),U(r,{to:"/attendance/overview"},{default:hn(()=>[...u[1]||(u[1]=[P("← Về tổng quan chấm công",-1)])]),_:1})])],64))])}}}),Xo=Ce(uo,[["__scopeId","data-v-75378769"]]);export{Xo as default};
