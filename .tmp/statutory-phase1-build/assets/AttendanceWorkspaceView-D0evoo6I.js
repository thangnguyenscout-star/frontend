import{d as Cn,o as i,x as vn,c as r,b as n,F as A,v as U,t as l,n as un,H as Ln,f as V,w as Mn,g as I,e as E,i as R,r as b,an as Dn,ao as An,ap as ve,Q as be,p as ie,O as Un,z as wn,D as fe,J as xe,h as K,_ as Y,A as en,G as Tn,B as qn,S as he,aq as pe,ar as qe,s as pn,L as Qn,M as ln,P as Ke,as as Wn,q as He,k as je}from"./index-91B50aoj.js";import{a as Ge}from"./attendance-CYkncW1q.js";import{M as Xe}from"./ModuleListView-DIdZZU_o.js";import{s as We}from"./index-CjSZG0uk.js";import{s as Qe}from"./index-CQ6FewKr.js";import{e as Je}from"./employee.service-BdBKH56M.js";import{l as se,e as Ze,p as Ye}from"./period.types-C1K47GvJ.js";import{p as ke}from"./record.service-BxNRkNGS.js";import{_ as we,n as Bn,r as Pn,a as nt,b as et,m as tt}from"./reports-CojQX-VD.js";import{_ as Ce}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{s as at,g as lt}from"./schedule-shift.service-DC4DlWxq.js";import"./index-Cu8QtanC.js";import"./index-_IR3SqOw.js";import"./index-D9dpCOX3.js";import"./index-CxMbus5e.js";import"./AppDrawer.vue_vue_type_script_setup_true_lang-BKcB2xyj.js";import"./ContractInspector.vue_vue_type_script_setup_true_lang-DtTO_0IU.js";import"./ContractCreateView-CvQPugKU.js";import"./AppLoading.vue_vue_type_script_setup_true_lang-B3xNbtBj.js";import"./AppErrorState.vue_vue_type_script_setup_true_lang-Btuz__Wh.js";import"./AppStatusBadge.vue_vue_type_script_setup_true_lang-5ih6f3p-.js";import"./ContractForm-CznWDpjt.js";import"./recruitment.service-D7h_5ocH.js";import"./employee.documents-BNQ-CcZe.js";import"./useContractPermission-Cccx1IC0.js";import"./index-jpXp-PmF.js";import"./useToast-C2YwFA64.js";import"./useConfirm-TkfMWq7m.js";import"./currency-Bi9uwIDW.js";import"./AppDataTable.vue_vue_type_script_setup_true_lang-DWuSkZdh.js";import"./AppEmptyState.vue_vue_type_script_setup_true_lang-C_omg__A.js";import"./AppForm.vue_vue_type_script_setup_true_lang-hh2UpCKa.js";import"./AppKpiCard-C3zmQIOa.js";import"./modules-CJV0O-xn.js";import"./useRecords-DbaWz_fY.js";import"./export-BblXOGSb.js";import"./employee.type-QMdLYoXr.js";const ot=Cn({__name:"AttendanceListView",setup(e){return(c,a)=>(i(),vn(Xe,{module:"attendance"}))}}),Jn={NORMAL:{label:"Đủ ca",bg:"#ECFDF5",text:"#065F46",border:"#A7F3D0",abnormal:!1},LEAVE_VACATION:{label:"Nghỉ lễ",bg:"#EFF6FF",text:"#1E40AF",border:"#BFDBFE",abnormal:!1},LEAVE_NORMAL:{label:"Nghỉ phép",bg:"#F5F3FF",text:"#5B21B6",border:"#DDD6FE",abnormal:!1},WORK_IN_VACATION:{label:"Làm việc trong lễ",bg:"#ECFEFF",text:"#155E75",border:"#A5F3FC",abnormal:!1},HALF_WORK:{label:"Nửa công",bg:"#FFFBEB",text:"#92400E",border:"#FDE68A",abnormal:!1},LEAVE_ABNORMAL:{label:"Nghỉ bất thường",bg:"#FFF1F2",text:"#9F1239",border:"#FECDD3",abnormal:!0},ATTENDANCE_ABNORMAL:{label:"Công bất thường",bg:"#FEF2F2",text:"#991B1B",border:"#FECACA",abnormal:!0},CHECK_YOUR_LOG_WORK:{label:"Cần kiểm tra log công",bg:"#FFF7ED",text:"#9A3412",border:"#FED7AA",abnormal:!0}},it={label:"Chưa có dữ liệu",bg:"#F8FAFC",text:"#475569",border:"#E2E8F0",abnormal:!1},nn=e=>e?Jn[e.trangThaiCong||""]||Jn.ATTENDANCE_ABNORMAL:it,gn=e=>e?[e.ho,e.tenDem,e.ten].filter(Boolean).join(" ").trim()||e.hoTen||e.maNhanVien:"";function cn(e){const c=e.slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(c)||!Number.isFinite(Date.parse(c+"T12:00:00Z"))||new Date(c+"T12:00:00Z").toISOString().slice(0,10)!==c)throw new Error("Ngày chấm công không hợp lệ: "+e);return c}const an=e=>e?cn(e).split("-").reverse().join("/"):"—";function Ne(e,c){const a=new Date(Date.UTC(e,c-1,1));a.setUTCFullYear(e);const t=(a.getUTCDay()+6)%7,u=new Date(a);return u.setUTCMonth(u.getUTCMonth()+1),u.setUTCDate(0),Array.from({length:Math.ceil((t+u.getUTCDate())/7)*7},(s,g)=>{const f=g-t+1;return f<1||f>u.getUTCDate()?null:String(e).padStart(4,"0")+"-"+String(c).padStart(2,"0")+"-"+String(f).padStart(2,"0")})}function st(e,c){const a=new Map;for(const t of e){const u=cn(t.ngayChamCong);if(a.has(u))throw new Error("Có nhiều bản ghi công cùng ngày "+an(u)+".");a.set(u,t)}return a}const Te=(e,c=!1)=>typeof e=="number"&&Number.isFinite(e)?new Intl.NumberFormat("vi-VN",{maximumFractionDigits:2}).format(c?e/60:e):"—",rt=[{key:"soNgayCoCong",label:"Ngày có công",visible:!0},{key:"tongSoPhutLamViecThucTe",label:"Giờ làm thực tế",visible:!0,hours:!0},{key:"tongCongHopLe",label:"Công hợp lệ",visible:!0},{key:"tongNgayNghiCoLuong",label:"Nghỉ có lương",visible:!0},{key:"tongNgayNghiKhongLuong",label:"Nghỉ không lương",visible:!0},{key:"tongCongHuongLuong",label:"Công hưởng lương",visible:!0},{key:"soNgayCoDuLieuCong",label:"Ngày có dữ liệu",visible:!1},{key:"soNgayDuLog",label:"Ngày đủ log",visible:!1},{key:"soNgayKhongLog",label:"Ngày không log",visible:!1},{key:"soNgayDiTre",label:"Ngày đi trễ",visible:!1},{key:"tongSoPhutDiTre",label:"Phút đi trễ",visible:!1},{key:"soNgayVeSom",label:"Ngày về sớm",visible:!1},{key:"tongSoPhutVeSom",label:"Phút về sớm",visible:!1},{key:"tongSoPhutTangCa",label:"Giờ tăng ca",visible:!1,hours:!0},{key:"soNgayQuaDem",label:"Ngày qua đêm",visible:!1},{key:"tongNgayNghi",label:"Tổng ngày nghỉ",visible:!1}],ut={tongDongTinh:"Tổng dòng tính",soDongThemMoi:"Thêm mới",soDongCapNhat:"Cập nhật",soDongThieuLog:"Thiếu log",soDongNgayLe:"Ngày lễ",soDongNghiPhep:"Nghỉ phép",soDongBoQuaKhongCapNhat:"Bỏ qua / không cập nhật",soNhanVienThemMoi:"Nhân viên thêm mới",soNhanVienCapNhat:"Nhân viên cập nhật",soNhanVienBoQuaDaKhoa:"Bỏ qua do khóa",thang:"Tháng",nam:"Năm",kyChamCongId:"Kỳ công"},In=(e,c)=>JSON.stringify([e,cn(c)]);function $e(e,c){const a=new Map;for(const t of e){if(c&&t.maNhanVien!==c)throw new Error("API trả dữ liệu của nhân viên khác.");const u=In(t.maNhanVien,t.ngayChamCong);if(a.has(u))throw new Error("Có nhiều bản ghi công của nhân viên "+t.maNhanVien+" trong ngày "+an(t.ngayChamCong)+".");a.set(u,t)}return a}function ct(e,c,a){const t=new Map;for(const u of[...e,...c]){if(a.maBoPhan&&u.maBoPhan!==a.maBoPhan||a.maNhanVien&&u.maNhanVien!==a.maNhanVien)continue;const s=t.get(u.maNhanVien);t.set(u.maNhanVien,{...s,...u,ho:u.ho??(s==null?void 0:s.ho),tenDem:u.tenDem??(s==null?void 0:s.tenDem),ten:u.ten??(s==null?void 0:s.ten),hoTen:u.hoTen??(s==null?void 0:s.hoTen),tenBoPhan:u.tenBoPhan??(s==null?void 0:s.tenBoPhan)})}return[...t.values()].sort((u,s)=>gn(u).localeCompare(gn(s),"vi")||u.maNhanVien.localeCompare(s.maNhanVien))}function _e(e,c){return e&&nn(e).abnormal&&c?["recalculate"]:[]}const Ve=(e,c)=>Ne(e,c).filter(a=>!!a),Sn=[{key:"ngayNghiPhep",label:"Nghỉ phép"},{key:"ngayNghiHuongLuong",label:"Nghỉ hưởng lương"},{key:"nghiLe",label:"Nghỉ lễ"},{key:"ngayNghiKhongHuongLuong",label:"Nghỉ không hưởng lương"},{key:"otNgayLe",label:"OT ngày lễ"},{key:"otNgayThuong",label:"OT ngày thường"}];function dt(e,c){const a=new Set(Ve(c.nam,c.thang)),t=new Map;for(const u of e){if(!a.has(cn(u.ngayChamCong)))continue;let s=t.get(u.maNhanVien);s||(s={ngayNghiPhep:0,ngayNghiHuongLuong:0,nghiLe:0,ngayNghiKhongHuongLuong:0,otNgayLe:0,otNgayThuong:0},t.set(u.maNhanVien,s));for(const{key:g}of Sn){const f=u[g];typeof f=="number"&&Number.isFinite(f)&&(s[g]+=f)}}return t}const ht={class:"attendance-calendar"},pt={class:"monthly-table-scroll"},mt={class:"month-grid","aria-label":"Lịch chấm công tháng"},gt=["onContextmenu"],yt={class:"day-top"},vt=["datetime"],bt=["aria-label","onClick"],ft=["aria-label","onClick"],xt={key:1,class:"day-body"},kt={key:0,class:"outside-days"},wt={class:"outside-grid"},Ct=["onContextmenu"],Nt={class:"day-top"},Tt=["datetime"],$t=["aria-label","onClick"],_t=["onClick"],Vt={key:1,class:"day-body"},Et={class:"monthly-legend","aria-label":"Chú giải trạng thái"},Pt=Cn({__name:"AttendanceCalendar",props:{rows:{},year:{},month:{},readonly:{type:Boolean,default:!1}},emits:["menu","detail"],setup(e,{emit:c}){const a=e,t=c,u=R(()=>st(a.rows)),s=R(()=>Ne(a.year,a.month)),g=R(()=>Array.from({length:s.value.length/7},(S,D)=>s.value.slice(D*7,D*7+7))),f=R(()=>String(a.year).padStart(4,"0")+"-"+String(a.month).padStart(2,"0")),T=R(()=>a.rows.filter(S=>!cn(S.ngayChamCong).startsWith(f.value)).sort((S,D)=>S.ngayChamCong.localeCompare(D.ngayChamCong)));function y(S,D){a.readonly||!S||!nn(S).abnormal||(D.preventDefault(),t("menu",S,D))}function N(S){!a.readonly&&S&&!nn(S).abnormal&&t("detail",S)}function P(S){const D=nn(S);return{background:D.bg,color:D.text,borderColor:D.border}}return(S,D)=>(i(),r("div",ht,[n("div",pt,[n("table",mt,[n("thead",null,[n("tr",null,[(i(),r(A,null,U(["Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy","Chủ nhật"],C=>n("th",{key:C,scope:"col"},l(C),1)),64))])]),n("tbody",null,[(i(!0),r(A,null,U(g.value,(C,j)=>(i(),r("tr",{key:j},[(i(!0),r(A,null,U(C,($,_)=>{var k,q;return i(),r("td",{key:$||_,class:un({"empty-calendar-cell":!$})},[$?(i(),r("div",{key:0,class:"calendar-day",style:Ln(P(u.value.get($))),onContextmenu:F=>y(u.value.get($),F)},[n("div",yt,[n("time",{datetime:$,class:un({weekend:_>4})},l(Number($.slice(-2))),11,vt),!e.readonly&&u.value.has($)&&V(nn)(u.value.get($)).abnormal?(i(),r("button",{key:0,type:"button",class:"day-more","aria-label":"Xử lý công ngày "+V(an)($),onClick:Mn(F=>t("menu",u.value.get($),F),["stop"])}," ••• ",8,bt)):I("",!0)]),!e.readonly&&u.value.has($)&&!V(nn)(u.value.get($)).abnormal?(i(),r("button",{key:0,type:"button",class:"day-body","aria-label":"Xem công ngày "+V(an)($),onClick:F=>N(u.value.get($))},[n("strong",null,l(((k=u.value.get($))==null?void 0:k.hienThiCa)||"—"),1),n("span",null,l(V(nn)(u.value.get($)).label),1)],8,ft)):(i(),r("div",xt,[n("strong",null,l(((q=u.value.get($))==null?void 0:q.hienThiCa)||"—"),1),n("span",null,l(V(nn)(u.value.get($)).label),1)]))],44,gt)):I("",!0)],2)}),128))]))),128))])])]),T.value.length?(i(),r("section",kt,[D[0]||(D[0]=n("h3",null,"Ngày ngoài tháng thuộc kỳ công",-1)),n("div",wt,[(i(!0),r(A,null,U(T.value,C=>(i(),r("div",{key:C.ngayChamCong,class:"calendar-day",style:Ln(P(C)),onContextmenu:j=>y(C,j)},[n("div",Nt,[n("time",{datetime:V(cn)(C.ngayChamCong)},l(V(an)(C.ngayChamCong)),9,Tt),!e.readonly&&V(nn)(C).abnormal?(i(),r("button",{key:0,type:"button",class:"day-more","aria-label":"Xử lý công ngày "+V(an)(C.ngayChamCong),onClick:j=>t("menu",C,j)}," ••• ",8,$t)):I("",!0)]),!e.readonly&&!V(nn)(C).abnormal?(i(),r("button",{key:0,class:"day-body",type:"button",onClick:j=>N(C)},[n("strong",null,l(C.hienThiCa||"—"),1),n("span",null,l(V(nn)(C).label),1)],8,_t)):(i(),r("div",Vt,[n("strong",null,l(C.hienThiCa||"—"),1),n("span",null,l(V(nn)(C).label),1)]))],44,Ct))),128))])])):I("",!0),n("div",Et,[(i(!0),r(A,null,U(V(Jn),(C,j)=>(i(),r("span",{key:j},[n("i",{style:Ln({background:C.bg,borderColor:C.border}),"aria-hidden":"true"},null,4),E(l(C.label),1)]))),128)),D[1]||(D[1]=n("span",null,[n("i",{"aria-hidden":"true"}),E("Chưa có dữ liệu")],-1))])]))}}),St={class:"attendance-month-grid"},Lt={class:"excel-scroll",role:"region","aria-label":"Bảng chi tiết chấm công tháng, cuộn ngang để xem các ngày",tabindex:"0"},Bt={class:"excel-attendance","aria-label":"Nhân viên và ký hiệu công từng ngày"},Dt=["colspan"],At=["colspan"],Rt=["datetime"],Ft={class:"excel-sticky excel-stt"},Ot={class:"excel-sticky excel-code"},zt={class:"excel-sticky excel-name",scope:"row"},It={class:"excel-dept"},Mt=["title","onContextmenu"],Ut=["aria-label","onClick"],qt={key:0},Kt=["colspan"],Ht={class:"monthly-subtitle excel-help"},jt={class:"monthly-legend","aria-label":"Chú giải trạng thái"},Gt=Cn({__name:"AttendanceMonthGrid",props:{rows:{},employees:{},filter:{},allowActions:{type:Boolean,default:!1}},emits:["menu","detail"],setup(e,{emit:c}){const a=e,t=c,u=b(""),s=R(()=>$e(a.rows)),g=R(()=>ct(a.employees,a.rows,a.filter)),f=R(()=>Ve(a.filter.nam,a.filter.thang)),T=R(()=>dt(a.rows,a.filter)),y=["CN","T2","T3","T4","T5","T6","T7"],N=$=>y[new Date($+"T12:00:00Z").getUTCDay()],P=($,_)=>s.value.get(In($,_)),S=($,_)=>{const k=P($.maNhanVien,_);return gn($)+" · "+an(_)+" · "+((k==null?void 0:k.hienThiCa)||"—")+" · "+nn(k).label},D=$=>({background:nn($).bg,color:nn($).text});function C($,_){u.value=In($.maNhanVien,_);const k=P($.maNhanVien,_);k&&!nn(k).abnormal&&t("detail",k)}function j($,_,k){const q=P($.maNhanVien,_);!_e(q,a.allowActions).length||!q||(k.preventDefault(),u.value=In($.maNhanVien,_),t("menu",q,k))}return($,_)=>(i(),r("div",St,[n("div",Lt,[n("table",Bt,[n("colgroup",null,[_[0]||(_[0]=n("col",{class:"excel-number-col"},null,-1)),_[1]||(_[1]=n("col",{class:"excel-code-col"},null,-1)),_[2]||(_[2]=n("col",{class:"excel-name-col"},null,-1)),_[3]||(_[3]=n("col",{class:"excel-dept-col"},null,-1)),(i(!0),r(A,null,U(f.value,k=>(i(),r("col",{key:k,class:"excel-day-col"}))),128)),(i(!0),r(A,null,U(V(Sn),k=>(i(),r("col",{key:k.key,class:"excel-total-col"}))),128))]),n("thead",null,[n("tr",null,[_[4]||(_[4]=n("th",{rowspan:"2",class:"excel-sticky excel-stt",scope:"col"},"STT",-1)),_[5]||(_[5]=n("th",{rowspan:"2",class:"excel-sticky excel-code",scope:"col"},"Mã nhân viên",-1)),_[6]||(_[6]=n("th",{rowspan:"2",class:"excel-sticky excel-name",scope:"col"},"Họ và tên",-1)),_[7]||(_[7]=n("th",{rowspan:"2",class:"excel-dept",scope:"col"},"Bộ phận",-1)),n("th",{colspan:f.value.length,scope:"colgroup"}," Ngày công tháng "+l(String(e.filter.thang).padStart(2,"0"))+"/"+l(e.filter.nam),9,Dt),n("th",{colspan:V(Sn).length,scope:"colgroup"},"Tổng trong tháng",8,At)]),n("tr",null,[(i(!0),r(A,null,U(f.value,k=>(i(),r("th",{key:k,scope:"col",class:un({"excel-weekend":N(k)==="CN"||N(k)==="T7"})},[n("time",{datetime:k},l(Number(k.slice(-2))),9,Rt),n("small",null,l(N(k)),1)],2))),128)),(i(!0),r(A,null,U(V(Sn),k=>(i(),r("th",{key:k.key,scope:"col"},l(k.label),1))),128))])]),n("tbody",null,[(i(!0),r(A,null,U(g.value,(k,q)=>(i(),r("tr",{key:k.maNhanVien},[n("td",Ft,l(q+1),1),n("td",Ot,l(k.maNhanVien),1),n("th",zt,l(V(gn)(k)),1),n("td",It,l(k.tenBoPhan||k.maBoPhan||"—"),1),(i(!0),r(A,null,U(f.value,F=>{var Q;return i(),r("td",{key:F,class:un(["excel-attendance-cell",{"excel-selected":u.value===V(In)(k.maNhanVien,F)}]),style:Ln(D(P(k.maNhanVien,F))),title:S(k,F),onContextmenu:X=>j(k,F,X)},[n("button",{type:"button",class:"excel-cell-symbol","aria-label":S(k,F),onClick:X=>C(k,F)},l(((Q=P(k.maNhanVien,F))==null?void 0:Q.hienThiCa)||"—"),9,Ut)],46,Mt)}),128)),(i(!0),r(A,null,U(V(Sn),F=>{var Q;return i(),r("td",{key:F.key,class:"excel-total"},l(V(Te)(((Q=T.value.get(k.maNhanVien))==null?void 0:Q[F.key])??0)),1)}),128))]))),128)),g.value.length?I("",!0):(i(),r("tr",qt,[n("td",{colspan:f.value.length+4+V(Sn).length,class:"excel-empty"}," Không có nhân viên theo bộ lọc. ",8,Kt)]))])])]),n("p",Ht,l(g.value.length)+" nhân viên · Ô hiển thị ký hiệu công/nghỉ phép. Nhấn chuột phải vào ô công bất thường để xem chức năng có thể sử dụng. ",1),n("div",jt,[(i(!0),r(A,null,U(V(Jn),(k,q)=>(i(),r("span",{key:q},[n("i",{style:Ln({background:k.bg,borderColor:k.border}),"aria-hidden":"true"},null,4),E(l(k.label),1)]))),128)),_[8]||(_[8]=n("span",null,[n("i",{"aria-hidden":"true"}),E("Chưa có dữ liệu")],-1))])]))}});function re(e){if((e==null?void 0:e.isResults)!==!0||e.data==null)throw new Error((e==null?void 0:e.message)||"Không nhận được dữ liệu chấm công hợp lệ.");return e.data}const Ee="maNhanVien ho tenDem ten maBoPhan tenBoPhan",Pe="thang nam tuNgay denNgay trangThai ngayChot",Xt=Ee+" "+Pe+" ngaySinh gioiTinh soNgayCoDuLieuCong soNgayDuLog soNgayKhongLog soNgayCoCong tongSoPhutLamViecThucTe tongSoPhutDiTre tongSoPhutVeSom soNgayDiTre soNgayVeSom tongSoPhutTangCa soNgayQuaDem tongCongHopLe tongNgayNghi tongNgayNghiCoLuong tongNgayNghiKhongLuong tongCongHuongLuong",Wt=Ee+" "+Pe+" maCa kyHieuCa ngayChamCong gioVao gioRa soPhutLamViec soGioLamViec maLoaiNghiPhep laNgayLe hienThiCa trangThaiCong ngayNghiPhep ngayNghiHuongLuong nghiLe ngayNghiKhongHuongLuong otNgayLe otNgayThuong";function Yn(e){if(!Number.isInteger(e.thang)||e.thang<1||e.thang>12||!Number.isInteger(e.nam)||e.nam<100||e.nam>9998)throw new Error("Tháng hoặc năm không hợp lệ.")}async function Qt(e){Yn(e);const c=new URL("/api/bang-cham-cong/export-excel",new URL("https://hrmsapi-crc3crfdegesbper.westus3-01.azurewebsites.net/graphql",window.location.origin));c.searchParams.set("thang",String(e.thang)),c.searchParams.set("nam",String(e.nam)),e.maNhanVien&&c.searchParams.set("manhanvien",e.maNhanVien),e.maBoPhan&&c.searchParams.set("mabophan",e.maBoPhan);const a=`BangChamCong_${e.nam}_${String(e.thang).padStart(2,"0")}.xlsx`;return ke(async()=>{var N,P;const t=await fetch(c,{method:"GET",credentials:"include",headers:{Authorization:`Bearer ${ve.get()}`,Accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}});if(t.status===401)throw new be(401);const u=t.headers.get("content-type")||"";if(!t.ok||u.toLowerCase().includes("json")){const S=await t.json().catch(()=>null);throw new Error((S==null?void 0:S.message)||(S==null?void 0:S.detail)||(S==null?void 0:S.title)||`Không thể xuất Excel (HTTP ${t.status}).`)}const s=await t.blob();if(!s.size)throw new Error("Máy chủ trả về tệp Excel trống.");const g=t.headers.get("content-disposition")||"",f=(N=/filename\*\s*=\s*UTF-8''([^;]+)/i.exec(g))==null?void 0:N[1],T=/filename\s*=\s*(?:"([^"]+)"|([^;]+))/i.exec(g);let y=(T==null?void 0:T[1])||((P=T==null?void 0:T[2])==null?void 0:P.trim())||a;if(f)try{y=decodeURIComponent(f.trim())}catch{}return y=y.replace(/[/\\]/g,"_"),{blob:s,filename:y}})}function Se(e){return Yn(e),"thang:"+e.thang+",nam:"+e.nam+",maBoPhan:"+JSON.stringify(e.maBoPhan||null)}async function me(e){const{data:c}=await Dn.query({query:An("query BangCongThang { bangCongThang("+Se(e)+"){isResults message data{"+Xt+"}}}"),fetchPolicy:"no-cache",errorPolicy:"none"}),a=re(c==null?void 0:c.bangCongThang);if(!Array.isArray(a))throw new Error("Báo cáo tháng không đúng định dạng.");return a.filter(Boolean)}async function ae(e){const{data:c}=await Dn.query({query:An("query BangTongHopNgay { bangTongHopNgay("+Se(e)+",maNhanVien:"+JSON.stringify(e.maNhanVien)+"){isResults message data{"+Wt+"}}}"),fetchPolicy:"no-cache",errorPolicy:"none"}),a=re(c==null?void 0:c.bangTongHopNgay);if(!Array.isArray(a))throw new Error("Công ngày không đúng định dạng.");const t=a.filter(Boolean);return $e(t,e.maNhanVien),t}const Le={batch:"tinhChamCongHangLoat",month:"chamCongThang",person:"tinhChamCongNgayTheoNhanVien"};function oe(e){if(e.kind==="NON_NULL")return oe(e.ofType)+"!";if(e.kind==="LIST")return"["+oe(e.ofType)+"]";if(!e.name)throw new Error("Schema input không hợp lệ.");return e.name}function Zn(e){return e.ofType?Zn(e.ofType):e.name||""}const ge="kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name}}}}",le=new Map;async function Jt(e){const c=Le[e];let a=le.get(c);return a||(a=(async()=>{var y,N,P,S;const{data:t}=await Dn.query({query:An("query AttendanceMutationContract {__schema{mutationType{fields{name args{name defaultValue type{"+ge+"}}}}}}"),fetchPolicy:"no-cache",errorPolicy:"none"}),u=(N=(y=t==null?void 0:t.__schema)==null?void 0:y.mutationType)==null?void 0:N.fields.find(D=>D.name===c),s=u==null?void 0:u.args.find(D=>D.name==="input");if(!s)throw new Error("Máy chủ chưa cung cấp hợp đồng input cho "+c+".");if(u.args.some(D=>D.name!=="input"&&D.type.kind==="NON_NULL"&&D.defaultValue==null))throw new Error("Mutation có tham số bắt buộc ngoài input chưa được ánh xạ.");const g=Zn(s.type),T=(S=(P=(await Dn.query({query:An("query AttendanceInputFields($name:String!){__type(name:$name){inputFields{name defaultValue type{"+ge+"}}}}"),variables:{name:g},fetchPolicy:"no-cache",errorPolicy:"none"})).data)==null?void 0:P.__type)==null?void 0:S.inputFields;if(!T)throw new Error("Input chưa phải kiểu đối tượng được hỗ trợ.");return{inputType:oe(s.type),fields:T}})().catch(t=>{throw le.delete(c),t}),le.set(c,a)),a}function Zt(e,c,a){var T;Yn(c.filter);const t=new Set(a.map(y=>y.name)),{filter:u}=c,s=["ngayChamCong","ngayLamViec","ngay"].find(y=>t.has(y));if(e==="person"&&(!c.day||!c.employee||c.day.maNhanVien!==c.employee.maNhanVien||!t.has("maNhanVien")||!s))throw new Error("Input chưa hỗ trợ đúng phạm vi nhân viên và ngày được chọn.");if(e!=="person"&&u.maNhanVien&&!t.has("maNhanVien"))throw new Error("API này không hỗ trợ lọc nhân viên. Hãy chọn Tất cả nhân viên trước khi tính.");if(e!=="person"&&u.maBoPhan&&!t.has("maBoPhan"))throw new Error("API này không hỗ trợ bộ phận đang chọn. Hãy chọn Tất cả bộ phận trước khi tính.");if(!t.has("kyChamCongId")&&!(t.has("thang")&&t.has("nam")))throw new Error("Input chưa có kỳ hoặc tháng/năm được hỗ trợ.");if(e!=="person"&&s&&((T=a.find(y=>y.name===s))==null?void 0:T.type.kind)==="NON_NULL")throw new Error("API yêu cầu chọn ngày cho thao tác hàng loạt; cần bổ sung hợp đồng trước khi sử dụng.");const g={thang:u.thang,nam:u.nam,maBoPhan:u.maBoPhan,maNhanVien:e==="person"?c.employee.maNhanVien:u.maNhanVien,previewOnly:!1,debug:!1};if(t.has("kyChamCongId")){if(c.kyChamCongId==null)throw new Error("Chưa xác định được kỳ công.");const y=Ze(c.kyChamCongId),N=Zn(a.find(P=>P.name==="kyChamCongId").type);if(N==="ID"||N==="String")g.kyChamCongId=y;else{const P=Number(y);if(!Number.isSafeInteger(P))throw new Error("ID kỳ vượt giới hạn số an toàn của input.");g.kyChamCongId=P}}if(e==="person"&&s){const y=cn(c.day.ngayChamCong),N=c.day;if(N.tuNgay&&y<cn(N.tuNgay)||N.denNgay&&y>cn(N.denNgay))throw new Error("Ngày nằm ngoài kỳ công.");const P=Zn(a.find(S=>S.name===s).type);g[s]=P==="DateTime"?y+"T00:00:00+07:00":y}const f={};for(const y of a)if(Object.hasOwn(g,y.name)&&(g[y.name]!=null||y.type.kind!=="NON_NULL"))f[y.name]=g[y.name];else if(y.type.kind==="NON_NULL"&&y.defaultValue==null)throw new Error("Cần ánh xạ trường input bắt buộc: "+y.name);return f}async function Yt(e,c){if(!ie().can("attendance","update"))throw new Error("Bạn không có quyền tính công.");const a=JSON.parse(JSON.stringify(c)),t=await Jt(e),u=await se({nam:a.filter.nam,thang:a.filter.thang,trangThai:null});if(u.length!==1)throw new Error("Cần xác định chính xác một kỳ chấm công cho tháng đã chọn.");const s=u[0];if(s.trangThai!=="O")throw new Error("Chỉ tính công khi kỳ đang mở.");if(a.day){const T=cn(a.day.ngayChamCong);if(T<cn(s.tuNgay)||T>cn(s.denNgay))throw new Error("Ngày được chọn nằm ngoài kỳ công.")}a.kyChamCongId=s.id;const g=Zt(e,a,t.fields),f=["Kỳ: "+a.filter.thang+"/"+a.filter.nam,e==="person"?"Nhân viên: "+gn(a.employee)+" ("+a.employee.maNhanVien+")":"Nhân viên: "+(a.filter.maNhanVien||"Tất cả"),e==="person"?"Ngày: "+an(a.day.ngayChamCong):"Phạm vi: toàn kỳ đã chọn"];return e!=="person"&&f.push("Bộ phận: "+(a.filter.maBoPhan||"Tất cả")),{kind:e,context:a,input:g,inputType:t.inputType,scope:f}}async function na(e){if(!ie().can("attendance","update"))throw new Error("Bạn không có quyền tính công.");const c=await se({nam:e.context.filter.nam,thang:e.context.filter.thang,trangThai:null});if(c.length!==1||String(c[0].id)!==String(e.context.kyChamCongId)||c[0].trangThai!=="O")throw new Error("Kỳ công đã thay đổi hoặc không còn mở.");const a=Le[e.kind],t=e.kind==="month"?"thang nam kyChamCongId soNhanVienThemMoi soNhanVienCapNhat soNhanVienBoQuaDaKhoa":(e.kind==="person"?"soDongBoQuaKhongCapNhat ":"")+"tongDongTinh soDongThemMoi soDongCapNhat soDongThieuLog soDongNgayLe soDongNghiPhep",{data:u}=await Dn.mutate({mutation:An("mutation AttendanceCalculate($input:"+e.inputType+"){"+a+"(input:$input){isResults message data{returnCode thongKe{"+t+"} resultSets{columns rows}}}}"),variables:{input:e.input},errorPolicy:"none"}),s=u==null?void 0:u[a],g=re(s);return{message:(s==null?void 0:s.message)||"Máy chủ đã trả kết quả xử lý.",data:g}}const ea=`.monthly-page {
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
`,ta=["aria-busy"],aa={class:"monthly-heading"},la={class:"monthly-actions"},oa=["disabled"],ia=["value"],sa=["disabled"],ra=["disabled"],ua=["value"],ca={class:"employee-filter"},da={key:0,class:"monthly-error",role:"alert"},ha={key:1,class:"monthly-error",role:"alert"},pa={key:2,class:"monthly-notice"},ma={key:3,class:"monthly-notice",role:"status"},ga={key:4,class:"monthly-notice"},ya={class:"monthly-sheet"},va={class:"monthly-tabs",role:"tablist","aria-label":"Bảng chấm công tháng"},ba=["aria-selected"],fa=["aria-selected"],xa={key:0,class:"monthly-loading",role:"status"},ka={key:1,class:"monthly-empty"},wa={class:"monthly-error",role:"alert"},Ca={id:"monthly-summary-panel",role:"tabpanel","aria-labelledby":"monthly-summary-tab"},Na={class:"monthly-toolbar"},Ta={class:"monthly-subtitle"},$a={class:"monthly-columns"},_a={class:"monthly-column-options"},Va=["onUpdate:modelValue"],Ea={class:"monthly-table-scroll monthly-summary-scroll",role:"region","aria-label":"Bảng tổng hợp công tháng, cuộn ngang và dọc để xem đầy đủ",tabindex:"0"},Pa={class:"monthly-summary"},Sa=["onClick"],La={key:0},Ba=["colspan"],Da={id:"monthly-daily-panel",role:"tabpanel","aria-labelledby":"monthly-daily-tab"},Aa={class:"monthly-toolbar"},Ra={class:"monthly-subtitle"},Fa={key:0,class:"monthly-empty",role:"status"},Oa={key:1,class:"monthly-error",role:"alert"},za={key:0},Ia={key:0,role:"status"},Ma={key:1,class:"monthly-error",role:"alert"},Ua={key:0,class:"monthly-subtitle"},qa={key:1},Ka=["disabled"],Ha={key:3,"aria-live":"polite"},ja={class:"monthly-stats"},Ga={key:0},Xa={style:{overflow:"auto","max-height":"240px"}},Wa={key:0},Qa=Cn({__name:"MonthlyAttendancePage",setup(e){const c=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit"}).formatToParts(new Date),a=Un({thang:Number(c.find(h=>h.type==="month").value),nam:Number(c.find(h=>h.type==="year").value),maBoPhan:null,maNhanVien:null}),t=b({...a}),u=b(!1),s=b(""),g=b("summary"),f=ie(),T=R(()=>f.can("attendance","update")),y=b([]),N=b(""),P=b(!1),S=R(()=>[...new Map(y.value.filter(h=>h.maBoPhan).map(h=>[h.maBoPhan,{code:h.maBoPhan,label:h.tenBoPhan||h.maBoPhan}])).values()].sort((h,o)=>h.label.localeCompare(o.label,"vi"))),D=R(()=>y.value.filter(h=>!a.maBoPhan||h.maBoPhan===a.maBoPhan).map(h=>({...h,label:h.maNhanVien+" · "+gn(h)}))),C=R(()=>y.value.find(h=>h.maNhanVien===t.value.maNhanVien)),j=b([]),$=b([]),_=b(!1),k=b(""),q=b(null),F=b(""),Q=b(""),X=b(""),sn=R(()=>j.value.filter(h=>!t.value.maNhanVien||h.maNhanVien===t.value.maNhanVien)),Nn=Un(rt.map(h=>({...h}))),bn=R(()=>Nn.filter(h=>h.visible)),fn=R(()=>String(t.value.thang).padStart(2,"0")+"/"+t.value.nam),M=b(!1),G=b(!1),rn=b(""),xn=b(new Set),yn=h=>h.nam+"-"+h.thang,Rn=R(()=>xn.value.has(yn(t.value))),dn=b(!1),x=R(()=>{var h;return T.value&&!M.value&&!G.value&&((h=q.value)==null?void 0:h.trangThai)==="O"}),d=b(!1),v=b(!1),O=b(""),z=b([]),w=b(),p=b({...t.value}),B=b(),J=b(null),tn=b(),Fn=b(!1),Kn=b(),Hn=b(!1),mn=b(),kn=b(""),hn=b(),ne=b(""),On=b(!1);let $n=0,jn=0,_n=0,W=!1;const Gn=new Set,De=h=>JSON.stringify(h);async function ce(){P.value=!0,N.value="";try{const h=await Je.list(null);W||(y.value=h.map(o=>({maNhanVien:o.maNhanVien,ho:o.ho,tenDem:o.tenDem,ten:o.ten,hoTen:o.hoTen,maBoPhan:o.maBoPhan,tenBoPhan:o.tenBoPhan})))}catch(h){W||(N.value=ln(h))}finally{W||(P.value=!1)}}async function ee(){const h=++jn;q.value=null,F.value="";try{const o=await se({nam:t.value.nam,thang:t.value.thang,trangThai:null});if(h!==jn||W)return;o.length===1?q.value=o[0]:F.value=o.length?"Có nhiều kỳ cho tháng này.":"Chưa có kỳ chấm công cho tháng này."}catch(o){h===jn&&!W&&(F.value=ln(o))}}async function Vn(h=!1){const o=++$n,m={...t.value},L=g.value,H=De(m);if(k.value="",!h&&(L==="summary"?Q.value:X.value)===H){_.value=!1;return}_.value=!0;try{if(L==="summary"){const on=await me(m);o===$n&&!W&&(j.value=on,Q.value=H)}else{const on=await ae(m);o===$n&&!W&&($.value=on,X.value=H)}}catch(on){o===$n&&!W&&(k.value=ln(on),L==="summary"?(j.value=[],Q.value=""):($.value=[],X.value=""))}finally{o===$n&&!W&&(_.value=!1)}}function Ae(){if(!(M.value||G.value))try{if(Yn(a),a.maNhanVien&&!D.value.some(h=>h.maNhanVien===a.maNhanVien))throw new Error("Nhân viên không thuộc bộ phận đã chọn.");t.value={...a},s.value="",Q.value="",X.value="",J.value=null,d.value=!1,Fn.value=!1,rn.value="",ee(),Vn(!0)}catch(h){k.value=ln(h)}}async function Re(){if(!(u.value||M.value||G.value)){u.value=!0,s.value="";try{const{blob:h,filename:o}=await Qt({...t.value});if(W)return;const m=URL.createObjectURL(h),L=document.createElement("a");L.href=m,L.download=o,document.body.append(L);try{L.click()}finally{L.remove(),setTimeout(()=>URL.revokeObjectURL(m),1e3)}}catch(h){W||(s.value=ln(h))}finally{W||(u.value=!1)}}}wn(()=>a.maBoPhan,()=>{a.maNhanVien&&!D.value.some(h=>h.maNhanVien===a.maNhanVien)&&(a.maNhanVien=null)}),wn(g,()=>{J.value=null,Fn.value=!1,Vn()});async function Fe(h){const o=++_n;w.value=h,p.value={...t.value,maNhanVien:h.maNhanVien},d.value=!0,v.value=!0,O.value="",z.value=[];try{const m=await ae({...p.value});o===_n&&!W&&(z.value=m)}catch(m){o===_n&&!W&&(O.value=ln(m))}finally{o===_n&&!W&&(v.value=!1)}}wn(d,h=>{h||++_n});async function Oe(){if(!B.value||v.value||O.value||!z.value.length)return;const h=document.createElement("iframe");h.title="Bản in phiếu chấm công",h.style.cssText="position:fixed;width:1px;height:1px;left:-10000px;top:0;border:0;",document.body.append(h),Gn.add(h);const o=h.contentDocument,m=h.contentWindow;if(!o||!m){h.remove(),Gn.delete(h);return}o.open(),o.write('<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Phiếu chấm công tháng</title></head><body></body></html>'),o.close();const L=o.createElement("style");L.textContent=ea,o.head.append(L),o.body.append(o.importNode(B.value,!0));const H=()=>{h.remove(),Gn.delete(h)};m.addEventListener("afterprint",H,{once:!0});try{if(await o.fonts.ready,W){H();return}m.focus(),m.print()}catch(on){rn.value="Không mở được hộp thoại in: "+ln(on),H()}setTimeout(H,6e4)}async function ze(h,o){var on,zn;if(!_e(h,x.value).length)return;const m=o.currentTarget instanceof HTMLElement?o.currentTarget.getBoundingClientRect():null,L=o.type==="click"&&o.detail===0&&m?m.left:o.clientX,H=o.type==="click"&&o.detail===0&&m?m.bottom:o.clientY;J.value={row:h,x:Math.max(10,Math.min(L,window.innerWidth-270)),y:Math.max(10,Math.min(H,window.innerHeight-270))},await Ke(),(zn=(on=tn.value)==null?void 0:on.querySelector("button:not(:disabled)"))==null||zn.focus()}function Ie(h){Kn.value=h,Fn.value=!0,J.value=null}function de(h){var o,m;if(h.key==="Escape"&&(J.value=null),J.value&&["ArrowDown","ArrowUp","Home","End"].includes(h.key)){h.preventDefault();const L=Array.from(((o=tn.value)==null?void 0:o.querySelectorAll("button:not(:disabled)"))||[]);if(!L.length)return;const H=L.indexOf(document.activeElement);(m=L[h.key==="Home"?0:h.key==="End"?L.length-1:(H+(h.key==="ArrowDown"?1:L.length-1))%L.length])==null||m.focus()}}function En(){J.value=null}async function te(h,o){if(M.value||G.value||!T.value)return;const m=o?y.value.find(H=>H.maNhanVien===o.maNhanVien)||o:C.value,L={filter:{...t.value},employee:m,day:o};J.value=null,mn.value=void 0,hn.value=void 0,dn.value=!1,ne.value="",On.value=!1,kn.value="",Hn.value=!0,G.value=!0;try{const H=await Yt(h,L);W||(mn.value=H)}catch(H){W||(kn.value=ln(H))}finally{W||(G.value=!1)}}async function Me(){var o,m;if(!mn.value||dn.value||M.value||!On.value||hn.value||!T.value)return;const h=mn.value;M.value=!0,kn.value="";try{const L=await na(h);if(W)return;hn.value=L.data,ne.value=L.message,Q.value="",X.value="",h.kind!=="month"?xn.value.add(yn(h.context.filter)):!h.context.filter.maNhanVien&&!h.context.filter.maBoPhan&&xn.value.delete(yn(h.context.filter));const H=Number(((o=L.data.thongKe)==null?void 0:o.soDongBoQuaKhongCapNhat)??((m=L.data.thongKe)==null?void 0:m.soNhanVienBoQuaDaKhoa)??0);rn.value=H>0?"Máy chủ trả kết quả có "+H+" dòng/nhân viên bị bỏ qua. Xem thống kê chi tiết.":L.message,await Promise.allSettled([Vn(!0),ee()])}catch(L){W||(dn.value=!0,kn.value=ln(L)+" Kết quả ghi có thể chưa xác định; hãy kiểm tra lại dữ liệu trước khi tính lại.")}finally{W||(M.value=!1)}}async function Ue(){if(!(!mn.value||M.value)){M.value=!0;try{const h=mn.value.context;mn.value.kind==="person"?await ae({...h.filter,maNhanVien:h.employee.maNhanVien}):await me(h.filter),await Vn(!0),dn.value=!1,kn.value="Đã tải lại dữ liệu. Kiểm tra kết quả trước khi quyết định gửi lại yêu cầu."}catch(h){kn.value=ln(h)}finally{M.value=!1}}}return fe(()=>{Promise.allSettled([ce(),ee(),Vn()]),document.addEventListener("click",En),document.addEventListener("keydown",de),window.addEventListener("resize",En),window.addEventListener("scroll",En,!0)}),xe(()=>{W=!0,++$n,++_n,++jn,document.removeEventListener("click",En),document.removeEventListener("keydown",de),window.removeEventListener("resize",En),window.removeEventListener("scroll",En,!0),Gn.forEach(h=>h.remove())}),(h,o)=>(i(),r("section",{class:"monthly-page","aria-busy":M.value},[n("header",aa,[n("div",null,[o[17]||(o[17]=n("h1",null,"Bảng chấm công tháng",-1)),n("p",null,[E(" Tháng "+l(fn.value),1),q.value?(i(),r(A,{key:0},[E(" · "+l(V(Ye)[q.value.trangThai]||q.value.trangThai)+" · "+l(V(an)(q.value.tuNgay))+" – "+l(V(an)(q.value.denNgay)),1),q.value.ngayChot?(i(),r(A,{key:0},[E(" · Chốt: "+l(V(an)(q.value.ngayChot)),1)],64)):I("",!0)],64)):I("",!0)])]),n("div",la,[K(Y,{label:"Xuất Excel",icon:"pi pi-file-excel",severity:"success",outlined:"",loading:u.value,disabled:u.value||M.value||G.value,onClick:Re},null,8,["loading","disabled"]),K(Y,{label:"Chấm công ngày hàng loạt",icon:"pi pi-calendar",severity:"secondary",outlined:"",disabled:!T.value||M.value||G.value,onClick:o[0]||(o[0]=m=>te("batch"))},null,8,["disabled"]),K(Y,{label:"Chấm công tháng",icon:"pi pi-calculator",disabled:!T.value||M.value||G.value,onClick:o[1]||(o[1]=m=>te("month"))},null,8,["disabled"])])]),n("form",{class:"monthly-filters",onSubmit:Mn(Ae,["prevent"])},[n("label",null,[o[18]||(o[18]=E("Tháng",-1)),en(n("select",{"onUpdate:modelValue":o[2]||(o[2]=m=>a.thang=m),disabled:M.value||G.value},[(i(),r(A,null,U(12,m=>n("option",{key:m,value:m},"Tháng "+l(m),9,ia)),64))],8,oa),[[Tn,a.thang,void 0,{number:!0}]])]),n("label",null,[o[19]||(o[19]=E("Năm",-1)),en(n("input",{"onUpdate:modelValue":o[3]||(o[3]=m=>a.nam=m),type:"number",min:"100",max:"9998",required:"",disabled:M.value||G.value},null,8,sa),[[qn,a.nam,void 0,{number:!0}]])]),n("label",null,[o[21]||(o[21]=E("Bộ phận",-1)),en(n("select",{"onUpdate:modelValue":o[4]||(o[4]=m=>a.maBoPhan=m),disabled:M.value||G.value||P.value},[o[20]||(o[20]=n("option",{value:null},"Tất cả bộ phận",-1)),(i(!0),r(A,null,U(S.value,m=>(i(),r("option",{key:m.code,value:m.code},l(m.label),9,ua))),128))],8,ra),[[Tn,a.maBoPhan]])]),n("label",ca,[o[22]||(o[22]=E("Nhân viên",-1)),K(V(Qe),{modelValue:a.maNhanVien,"onUpdate:modelValue":o[5]||(o[5]=m=>a.maNhanVien=m),options:D.value,"option-label":"label","option-value":"maNhanVien",filter:"","show-clear":"",placeholder:"Tất cả / tìm mã hoặc họ tên",disabled:M.value||G.value||P.value,loading:P.value,"aria-label":"Chọn nhân viên"},null,8,["modelValue","options","disabled","loading"])]),K(Y,{type:"submit",label:"Áp dụng",icon:"pi pi-filter",disabled:M.value||G.value},null,8,["disabled"])],32),s.value?(i(),r("p",da,l(s.value),1)):I("",!0),N.value?(i(),r("p",ha,[E(" Không tải được danh mục: "+l(N.value)+" ",1),n("button",{type:"button",onClick:ce},"Thử lại")])):I("",!0),F.value?(i(),r("p",pa,l(F.value),1)):I("",!0),rn.value?(i(),r("p",ma,l(rn.value),1)):I("",!0),Rn.value?(i(),r("p",ga," Dữ liệu công ngày đã được xử lý. Cần chấm công tháng để cập nhật tổng hợp nếu backend không tổng hợp tự động. ")):I("",!0),n("div",ya,[n("div",va,[n("button",{id:"monthly-summary-tab",type:"button",role:"tab","aria-selected":g.value==="summary","aria-controls":"monthly-summary-panel",onClick:o[6]||(o[6]=m=>g.value="summary")}," Tổng hợp công tháng",8,ba),n("button",{id:"monthly-daily-tab",type:"button",role:"tab","aria-selected":g.value==="daily","aria-controls":"monthly-daily-panel",onClick:o[7]||(o[7]=m=>g.value="daily")}," Chi tiết công tháng ",8,fa)]),_.value?(i(),r("div",xa,[(i(),r(A,null,U(4,m=>n("span",{key:m})),64)),o[23]||(o[23]=n("p",null,"Đang tải dữ liệu công tháng…",-1))])):k.value?(i(),r("div",ka,[n("p",wa,l(k.value),1),K(Y,{label:"Thử lại",onClick:o[8]||(o[8]=m=>Vn(!0))})])):I("",!0),en(n("section",Ca,[n("div",Na,[n("div",null,[n("h2",null,"Tổng hợp tháng "+l(fn.value),1),n("p",Ta,l(sn.value.length)+" nhân viên · Nhấn họ tên để xem và in phiếu ",1)]),n("details",$a,[o[24]||(o[24]=n("summary",null,"Chọn cột hiển thị",-1)),n("div",_a,[(i(!0),r(A,null,U(Nn,m=>(i(),r("label",{key:m.key},[en(n("input",{"onUpdate:modelValue":L=>m.visible=L,type:"checkbox"},null,8,Va),[[pe,m.visible]]),E(l(m.label),1)]))),128))])])]),n("div",Ea,[n("table",Pa,[n("colgroup",null,[o[25]||(o[25]=n("col",{class:"summary-code-col"},null,-1)),o[26]||(o[26]=n("col",{class:"summary-name-col"},null,-1)),o[27]||(o[27]=n("col",{class:"summary-dept-col"},null,-1)),(i(!0),r(A,null,U(bn.value,m=>(i(),r("col",{key:m.key,class:"summary-data-col"}))),128))]),n("thead",null,[n("tr",null,[o[28]||(o[28]=n("th",{scope:"col"},"Mã nhân viên",-1)),o[29]||(o[29]=n("th",{scope:"col"},"Họ và tên",-1)),o[30]||(o[30]=n("th",{scope:"col"},"Bộ phận",-1)),(i(!0),r(A,null,U(bn.value,m=>(i(),r("th",{key:m.key,scope:"col"},l(m.label),1))),128))])]),n("tbody",null,[(i(!0),r(A,null,U(sn.value,m=>(i(),r("tr",{key:m.maNhanVien},[n("td",null,l(m.maNhanVien),1),n("td",null,[n("button",{type:"button",class:"monthly-name",onClick:L=>Fe(m)},l(V(gn)(m)),9,Sa)]),n("td",null,l(m.tenBoPhan||m.maBoPhan||"—"),1),(i(!0),r(A,null,U(bn.value,L=>(i(),r("td",{key:L.key},l(V(Te)(m[L.key],L.hours)),1))),128))]))),128)),sn.value.length?I("",!0):(i(),r("tr",La,[n("td",{colspan:bn.value.length+3},[...o[31]||(o[31]=[n("div",{class:"monthly-empty"},"Không có dữ liệu công tháng theo bộ lọc.",-1)])],8,Ba)]))])])])],512),[[he,g.value==="summary"&&!_.value&&!k.value]]),en(n("section",Da,[n("div",Aa,[n("div",null,[n("h2",null,"Chi tiết công tháng "+l(fn.value),1),n("p",Ra," Danh sách nhân viên · Các cột ngày 1–"+l(new Date(t.value.nam,t.value.thang,0).getDate())+" · Ký hiệu công và nghỉ phép ",1)])]),K(Gt,{rows:$.value,employees:y.value,filter:t.value,"allow-actions":x.value,onMenu:ze,onDetail:Ie},null,8,["rows","employees","filter","allow-actions"])],512),[[he,g.value==="daily"&&!_.value&&!k.value]])]),(i(),vn(qe,{to:"body"},[J.value&&x.value?(i(),r("div",{key:0,ref_key:"menuElement",ref:tn,class:"monthly-context-menu",role:"menu","aria-label":"Xử lý công ngày",style:Ln({left:J.value.x+"px",top:J.value.y+"px"}),onClick:o[10]||(o[10]=Mn(()=>{},["stop"]))},[n("p",null,l(V(an)(J.value.row.ngayChamCong))+" · "+l(V(gn)(J.value.row)),1),n("button",{role:"menuitem",type:"button",onClick:o[9]||(o[9]=m=>te("person",J.value.row))}," Tính lại công ")],4)):I("",!0)])),K(V(Qn),{visible:d.value,"onUpdate:visible":o[12]||(o[12]=m=>d.value=m),modal:"",header:"Phiếu chấm công tháng",style:{width:"1080px",maxWidth:"96vw"}},{footer:pn(()=>[K(Y,{label:"Đóng",severity:"secondary",outlined:"",onClick:o[11]||(o[11]=m=>d.value=!1)}),K(Y,{label:"In phiếu",icon:"pi pi-print",disabled:v.value||!!O.value||!z.value.length,onClick:Oe},null,8,["disabled"])]),default:pn(()=>{var m,L,H,on,zn;return[v.value?(i(),r("div",Fa,"Đang tải phiếu chấm công…")):O.value?(i(),r("p",Oa,l(O.value),1)):(i(),r("div",{key:2,ref_key:"reportElement",ref:B,class:"monthly-report"},[n("h2",null," PHIẾU CHẤM CÔNG THÁNG "+l(String(p.value.thang).padStart(2,"0"))+"/"+l(p.value.nam),1),n("p",null,[n("strong",null,l(V(gn)(w.value)),1),E(" · "+l((m=w.value)==null?void 0:m.maNhanVien)+" · "+l(((L=w.value)==null?void 0:L.tenBoPhan)||((H=w.value)==null?void 0:H.maBoPhan)||"—"),1)]),n("p",null," Kỳ công: "+l(V(an)((on=z.value[0])==null?void 0:on.tuNgay))+" – "+l(V(an)((zn=z.value[0])==null?void 0:zn.denNgay)),1),z.value.length?I("",!0):(i(),r("p",za,"Chưa có dữ liệu chấm công.")),K(Pt,{rows:z.value,year:p.value.nam,month:p.value.thang,readonly:""},null,8,["rows","year","month"])],512))]}),_:1},8,["visible"]),K(V(Qn),{visible:Hn.value,"onUpdate:visible":o[15]||(o[15]=m=>Hn.value=m),modal:"",header:"Xác nhận tính công",closable:!M.value&&!G.value,"close-on-escape":!M.value&&!G.value,style:{width:"640px",maxWidth:"96vw"}},{footer:pn(()=>[K(Y,{label:"Đóng",severity:"secondary",outlined:"",disabled:M.value||G.value,onClick:o[14]||(o[14]=m=>Hn.value=!1)},null,8,["disabled"]),dn.value?(i(),vn(Y,{key:0,label:"Kiểm tra lại dữ liệu",loading:M.value,onClick:Ue},null,8,["loading"])):I("",!0),hn.value?I("",!0):(i(),vn(Y,{key:1,label:"Thực hiện tính công",icon:"pi pi-calculator",loading:M.value,disabled:dn.value||!mn.value||!On.value||G.value||M.value||!T.value,onClick:Me},null,8,["loading","disabled"]))]),default:pn(()=>{var m;return[G.value?(i(),r("p",Ia,"Đang kiểm tra kỳ và phạm vi tính công…")):I("",!0),kn.value?(i(),r("p",Ma,l(kn.value),1)):I("",!0),mn.value?(i(),r(A,{key:2},[n("ul",null,[(i(!0),r(A,null,U(mn.value.scope,L=>(i(),r("li",{key:L},l(L),1))),128))]),hn.value?I("",!0):(i(),r("p",Ua," Chỉ cập nhật phạm vi trên. Các dòng bị khóa có thể bị bỏ qua theo kết quả máy chủ. ")),hn.value?I("",!0):(i(),r("label",qa,[en(n("input",{"onUpdate:modelValue":o[13]||(o[13]=L=>On.value=L),type:"checkbox",disabled:M.value},null,8,Ka),[[pe,On.value]]),o[32]||(o[32]=E(" Tôi xác nhận phạm vi tính công.",-1))]))],64)):I("",!0),hn.value?(i(),r("section",Ha,[o[34]||(o[34]=n("h3",null,"Kết quả máy chủ",-1)),n("p",null,l(ne.value),1),n("p",null,"Mã trả về: "+l(hn.value.returnCode??"—"),1),n("dl",ja,[(i(!0),r(A,null,U(hn.value.thongKe||{},(L,H)=>(i(),r("div",{key:H},[n("dt",null,l(V(ut)[String(H)]||H),1),n("dd",null,l(L??"—"),1)]))),128))]),(m=hn.value.resultSets)!=null&&m.length?(i(),r("details",Ga,[o[33]||(o[33]=n("summary",null,"Kết quả chi tiết",-1)),n("pre",Xa,l(JSON.stringify(hn.value.resultSets,null,2)),1)])):I("",!0)])):I("",!0)]}),_:1},8,["visible","closable","close-on-escape"]),K(V(We),{visible:Fn.value,"onUpdate:visible":o[16]||(o[16]=m=>Fn.value=m),position:"right",header:"Chi tiết công ngày",style:{width:"400px",maxWidth:"95vw"}},{default:pn(()=>[Kn.value?(i(),r("p",Wa,l(V(gn)(Kn.value))+" · "+l(V(an)(Kn.value.ngayChamCong)),1)):I("",!0),o[35]||(o[35]=n("p",{class:"monthly-notice"},"Nội dung chi tiết công ngày sẽ được phát triển sau.",-1))]),_:1},8,["visible"])],8,ta))}}),Ja={class:"report-export-buttons",role:"group","aria-label":"Xuất báo cáo đang chọn"},Za=Cn({__name:"ReportExportButtons",props:{formats:{default:()=>[]},busy:{default:null},disabled:{type:Boolean,default:!1}},emits:["export"],setup(e,{emit:c}){const a=c;return(t,u)=>(i(),r("div",Ja,[(i(),r(A,null,U(["excel","pdf"],s=>K(Y,{key:s,type:"button",label:s==="excel"?"Xuất Excel":"Xuất PDF",icon:s==="excel"?"pi pi-file-excel":"pi pi-file-pdf",severity:"secondary",outlined:"",loading:e.busy===s,disabled:e.disabled||!!e.busy||!e.formats.includes(s),title:e.formats.includes(s)?"Xuất toàn bộ kết quả theo bộ lọc đã áp dụng":"Chức năng xuất chưa khả dụng cho báo cáo này",onClick:g=>a("export",s)},null,8,["label","icon","loading","disabled","title","onClick"])),64))]))}}),Be=Ce(Za,[["__scopeId","data-v-c24745f8"]]);async function Ya(e,c,a,t){const u=new URL(e,new URL("https://hrmsapi-crc3crfdegesbper.westus3-01.azurewebsites.net/graphql",window.location.origin));for(const[s,g]of Object.entries(c))g!==null&&g!==""&&u.searchParams.set(s,String(g));return ke(async()=>{var S,D;const s=await fetch(u,{method:"GET",credentials:"include",headers:{Authorization:`Bearer ${ve.get()}`,Accept:a==="pdf"?"application/pdf":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}});if(s.status===401)throw new be(401);const g=(s.headers.get("content-type")||"").toLowerCase();if(!s.ok||g.includes("json")||g.includes("text/html")){const C=await s.json().catch(()=>null);throw new Error((C==null?void 0:C.message)||(C==null?void 0:C.detail)||(C==null?void 0:C.title)||(C==null?void 0:C.code)||(C==null?void 0:C.Code)||`Không thể xuất báo cáo (HTTP ${s.status}).`)}const f=await s.blob();if(!f.size)throw new Error("Máy chủ trả về tệp báo cáo trống.");const T=s.headers.get("content-disposition")||"",y=(S=/filename\*\s*=\s*UTF-8''([^;]+)/i.exec(T))==null?void 0:S[1],N=/filename\s*=\s*(?:"([^"]+)"|([^;]+))/i.exec(T);let P=(N==null?void 0:N[1])||((D=N==null?void 0:N[2])==null?void 0:D.trim())||t;if(y)try{P=decodeURIComponent(y.trim())}catch{}return P=P.replace(/[/\\\r\n]/g,"_"),{blob:f,filename:P||t}})}function nl(e){const c=URL.createObjectURL(e.blob),a=document.createElement("a");try{a.href=c,a.download=e.filename,document.body.append(a),a.click()}finally{a.remove(),setTimeout(()=>URL.revokeObjectURL(c),1e3)}}const el=An`
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
`;function ue(e){var t,u;if(!Number.isInteger(e.thang)||e.thang<1||e.thang>12||!Number.isInteger(e.nam)||e.nam<1753||e.nam>9998)throw new Error("Tháng hoặc năm báo cáo không hợp lệ.");const c=((t=e.ten)==null?void 0:t.trim())||null,a=((u=e.maBoPhan)==null?void 0:u.trim())||null;if(c&&(c.length>100||[...c].some(s=>s.charCodeAt(0)<32||s.charCodeAt(0)===127)))throw new Error("Tên tìm kiếm không hợp lệ hoặc vượt quá 100 ký tự.");return{thang:e.thang,nam:e.nam,ten:c,maBoPhan:a}}async function tl(e,c=1,a=20){const t={...ue(e),pageIndex:c,pageSize:a};if(!Number.isInteger(c)||c<1||!Number.isInteger(a)||a<1||a>200)throw new Error("Thông tin phân trang báo cáo không hợp lệ.");const{data:u}=await Dn.query({query:el,variables:{input:t},fetchPolicy:"no-cache",errorPolicy:"none"}),s=u==null?void 0:u.diMuonVeSom;if((s==null?void 0:s.isResults)!==!0||!s.data)throw new Error((s==null?void 0:s.message)||"Không thể tải báo cáo đi muộn / về sớm.");const g=s.data;if(!Array.isArray(g.items)||!Number.isInteger(g.pageIndex)||g.pageIndex<1||!Number.isInteger(g.pageSize)||g.pageSize<1||!Number.isSafeInteger(g.totalRecords)||g.totalRecords<0||!Number.isSafeInteger(g.totalPages)||g.totalPages<0)throw new Error("Dữ liệu phân trang báo cáo không hợp lệ.");return{...g,items:g.items.filter(f=>f!==null)}}function al(e,c){const a=ue(e);if(c!=="excel"&&c!=="pdf")throw new Error("Định dạng xuất báo cáo không hợp lệ.");return Ya("/api/di-muon-ve-som/export-"+c,{...a},c,`DiMuonVeSom_${a.nam}_${String(a.thang).padStart(2,"0")}.${c==="pdf"?"pdf":"xlsx"}`)}function ll(e){const c=e==null?void 0:e.trim().toUpperCase();if(!c)return Wn.global.t("common.attendanceStatus.EMPTY");const a=`common.attendanceStatus.${c}`;return Wn.global.t(Wn.global.te(a)?a:"common.attendanceStatus.UNKNOWN")}function ol(){return Wn.global.t("common.attendanceStatus.label")}const Z=(e,c,a,t=120,u=!1)=>({key:e,label:c,group:a,width:t,numeric:u,total:u}),il=[Z("code","Mã nhân viên","Nhân sự",108),Z("name","Họ và tên","Nhân sự",190),Z("departmentCode","Mã bộ phận","Đơn vị"),Z("department","Bộ phận","Đơn vị",175),Z("birthDate","Ngày sinh","Thông tin cá nhân"),Z("gender","Giới tính","Thông tin cá nhân",90),Z("period","Tháng / Năm","Chấm công"),Z("date","Ngày chấm công","Chấm công",140),Z("shiftCode","Mã ca","Ca làm việc",90),Z("shift","Tên ca","Ca làm việc",150),Z("scheduledIn","Giờ bắt đầu","Ca làm việc"),Z("scheduledOut","Giờ kết thúc","Ca làm việc"),Z("night","Ca đêm","Ca làm việc",90),Z("checkIn","Giờ vào","Thực tế"),Z("checkOut","Giờ ra","Thực tế"),Z("late","Đi trễ (phút)","Chênh lệch",120,!0),Z("early","Về sớm (phút)","Chênh lệch",120,!0),Z("status","Tình trạng","Đánh giá",150)];function sl(){return il.map(e=>e.key==="status"?{...e,label:ol()}:e)}function ye(e){return e?/^\d{4}-\d{2}-\d{2}/.test(e)?e.slice(0,10).split("-").reverse().join("/"):e:"—"}const Xn=e=>at(e)||e||"—";function rl(e,c,a){return e.map((t,u)=>({id:`${c}:${a}:${u}:${t.maNhanVien}:${t.ngayChamCong}:${t.maCa}`,code:t.maNhanVien,name:t.hoVaTen||t.maNhanVien,departmentCode:t.maBoPhan||"—",department:t.tenBoPhan||"—",birthDate:ye(t.ngaySinh),gender:t.gioiTinh||"—",period:t.thang!==null&&t.nam!==null?`${t.thang}/${t.nam}`:"—",date:ye(t.ngayChamCong),shiftCode:t.maCa||"—",shift:t.tenCa||"—",scheduledIn:Xn(t.gioBatDau),scheduledOut:Xn(t.gioKetThuc),night:t.tinhCaDem===null?"—":t.tinhCaDem?"Có":"Không",checkIn:Xn(t.gioVao),checkOut:Xn(t.gioRa),late:t.diTre,early:t.veSom,status:ll(t.tinhTrang),statusCode:t.tinhTrang||""}))}const ul={class:"late-early-report"},cl=["disabled"],dl=["value"],hl={class:"report-filter-actions"},pl={key:0,class:"report-error",role:"alert"},ml={key:1,class:"report-error",role:"alert"},gl={class:"report-metrics"},yl=["aria-busy"],vl={class:"report-panel-heading"},bl={key:0,class:"report-feedback",role:"status"},fl={key:1,class:"report-error",role:"alert"},xl={key:2,class:"report-loading",role:"status"},kl={key:3,class:"report-error",role:"alert"},wl={class:"report-pagination"},Cl=["disabled"],Nl=["value"],Tl=["disabled"],$l={class:"report-page-current"},_l=["disabled"],Vl={key:0,class:"report-detail"},El={class:"report-detail-values"},Pl=Cn({__name:"LateEarlyReport",setup(e){function c(){const w=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit"}).formatToParts(new Date);return w.find(p=>p.type==="year").value+"-"+w.find(p=>p.type==="month").value}const a=c(),t=Un({period:a,department:"",name:""}),u=b({...t}),s=b(1),g=b(20),f=Un({pageIndex:1,pageSize:20,totalRecords:0,totalPages:0}),T=b([]),y=b(!1),N=b(""),P=b(""),S=b([]),D=b(!1),C=b(""),j=b(null),$=b(""),_=b(""),k=b(null),q=b(!1);let F=0,Q=0,X=!1;function sn(w){if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(w.period))throw new Error("Vui lòng chọn tháng báo cáo hợp lệ.");const[p,B]=w.period.split("-").map(Number);return ue({thang:B,nam:p,ten:w.name,maBoPhan:w.department})}const Nn=R(()=>sn(u.value)),bn=R(()=>u.value.period.split("-").reverse().join("/")),fn=R(()=>{var w;return((w=S.value.find(p=>p.code===u.value.department))==null?void 0:w.name)||u.value.department||"Tất cả bộ phận"}),M=R(()=>rl(T.value,f.pageIndex,f.pageSize)),G=R(()=>sl()),rn=R(()=>M.value.find(w=>w.id===k.value)||null),xn=R(()=>Math.max(1,f.totalPages)),yn=R(()=>(f.pageIndex-1)*f.pageSize),Rn=R(()=>[["Tổng bản ghi",y.value?"—":Bn(f.totalRecords),"pi-list","Toàn bộ kết quả theo bộ lọc"],["Nhân viên / trang",y.value?"—":String(new Set(T.value.map(w=>w.maNhanVien)).size),"pi-users","Trong trang đang xem"],["Đi trễ (phút)",y.value?"—":Bn(T.value.reduce((w,p)=>w+p.diTre,0)),"pi-sign-in","Tổng trên trang đang xem"],["Về sớm (phút)",y.value?"—":Bn(T.value.reduce((w,p)=>w+p.veSom,0)),"pi-sign-out","Tổng trên trang đang xem"]]);async function dn(){const w=++F,p=s.value,B=g.value,J={...Nn.value};y.value=!0,N.value="",T.value=[],Object.assign(f,{pageIndex:p,pageSize:B,totalRecords:0,totalPages:0}),q.value=!1;try{const tn=await tl(J,p,B);if(w!==F||X)return;if(tn.totalRecords>0&&tn.totalPages>0&&p>tn.totalPages){s.value=tn.totalPages;return}T.value=tn.items,Object.assign(f,{pageIndex:tn.pageIndex,pageSize:tn.pageSize,totalRecords:tn.totalRecords,totalPages:tn.totalPages})}catch(tn){w===F&&!X&&(N.value=ln(tn))}finally{w===F&&!X&&(y.value=!1)}}async function x(){const w=++Q;D.value=!0,C.value="";try{const p=await lt();w===Q&&!X&&(S.value=p)}catch(p){w===Q&&!X&&(C.value=ln(p))}finally{w===Q&&!X&&(D.value=!1)}}function d(){try{const w=sn(t);u.value={period:t.period,department:w.maBoPhan||"",name:w.ten||""},s.value=1,P.value="",$.value="",_.value=""}catch(w){P.value=ln(w)}}function v(){Object.assign(t,{period:a,department:"",name:""}),d()}async function O(w){if(j.value||y.value||N.value||!f.totalRecords)return;const p={...Nn.value};j.value=w,$.value="",_.value="";try{const B=await al(p,w);if(X)return;nl(B),_.value=`Đã xuất ${w==="pdf"?"PDF":"Excel"} theo bộ lọc tháng ${String(p.thang).padStart(2,"0")}/${p.nam}.`}catch(B){X||($.value=ln(B))}finally{X||(j.value=null)}}function z(w){k.value=w.id,q.value=!0}return wn(g,()=>{s.value=1},{flush:"sync"}),wn([u,s,g],dn,{immediate:!0}),fe(x),xe(()=>{X=!0,++F,++Q}),(w,p)=>(i(),r("div",ul,[n("form",{class:"report-filters report-live-filters",onSubmit:Mn(d,["prevent"])},[n("label",null,[p[8]||(p[8]=n("span",null,[E("Kỳ báo cáo "),n("b",null,"*")],-1)),en(n("input",{"onUpdate:modelValue":p[0]||(p[0]=B=>t.period=B),type:"month",min:"1753-01",max:"9998-12",required:""},null,512),[[qn,t.period]])]),n("label",null,[p[10]||(p[10]=n("span",null,"Bộ phận",-1)),en(n("select",{"onUpdate:modelValue":p[1]||(p[1]=B=>t.department=B),disabled:D.value},[p[9]||(p[9]=n("option",{value:""},"Tất cả bộ phận",-1)),(i(!0),r(A,null,U(S.value,B=>(i(),r("option",{key:B.code,value:B.code},l(B.name)+" · "+l(B.code),9,dl))),128))],8,cl),[[Tn,t.department]])]),n("label",null,[p[11]||(p[11]=n("span",null,"Tên nhân viên",-1)),en(n("input",{"onUpdate:modelValue":p[2]||(p[2]=B=>t.name=B),type:"search",maxlength:"100",placeholder:"Nhập tên nhân viên…","aria-label":"Tên nhân viên báo cáo đi muộn về sớm"},null,512),[[qn,t.name]])]),n("div",hl,[K(Y,{type:"submit",label:"Xem báo cáo",icon:"pi pi-filter"}),n("button",{class:"report-reset",type:"button",onClick:v},[...p[12]||(p[12]=[n("i",{class:"pi pi-refresh"},null,-1),E("Đặt lại ",-1)])])])],32),P.value?(i(),r("p",pl,l(P.value),1)):I("",!0),C.value?(i(),r("p",ml,[E(" Không tải được danh mục bộ phận: "+l(C.value),1),K(Y,{type:"button",label:"Tải lại danh mục",text:"",loading:D.value,onClick:x},null,8,["loading"])])):I("",!0),n("div",gl,[(i(!0),r(A,null,U(Rn.value,(B,J)=>(i(),r("article",{key:B[0],class:un("report-metric-"+J)},[n("div",null,[n("span",null,l(B[0]),1),n("strong",null,l(B[1]),1),n("small",null,l(B[3]),1)]),n("i",{class:un(["pi",B[2]])},null,2)],2))),128))]),n("section",{id:"report-panel",class:"report-panel",role:"tabpanel","aria-labelledby":"report-tab-late","aria-busy":y.value},[n("div",vl,[n("div",null,[p[16]||(p[16]=n("span",{class:"report-sheet-label"},[n("i",{class:"pi pi-file-excel"}),E(" BẢNG DỮ LIỆU")],-1)),n("h2",null,[p[13]||(p[13]=E(" Đi muộn / Về sớm ",-1)),n("span",null,"/ "+l(bn.value),1)]),n("p",null,[E(l(fn.value),1),p[14]||(p[14]=n("span",null,"·",-1)),E(l(u.value.name||"Tất cả tên nhân viên"),1),p[15]||(p[15]=n("span",null,"·",-1)),E(l(f.totalRecords)+" bản ghi ",1)])]),K(Be,{formats:["excel","pdf"],busy:j.value,disabled:y.value||!!N.value||!f.totalRecords,onExport:O},null,8,["busy","disabled"])]),_.value?(i(),r("p",bl,[p[17]||(p[17]=n("i",{class:"pi pi-check-circle"},null,-1)),E(" "+l(_.value),1)])):I("",!0),$.value?(i(),r("p",fl,l($.value),1)):I("",!0),y.value?(i(),r("p",xl,[...p[18]||(p[18]=[n("i",{class:"pi pi-spin pi-spinner"},null,-1),E(" Đang tải báo cáo đi muộn / về sớm... ",-1)])])):N.value?(i(),r("p",kl,[E(l(N.value),1),K(Y,{type:"button",label:"Tải lại báo cáo",text:"",onClick:dn})])):(i(),vn(we,{key:4,columns:G.value,rows:M.value,"all-rows":M.value,offset:yn.value,"sort-key":"","sort-direction":1,sortable:!1,"total-label":"TỔNG TRANG","record-count":f.totalRecords,onOpen:z},null,8,["columns","rows","all-rows","offset","record-count"])),n("div",wl,[n("span",null,[p[19]||(p[19]=E("Hiển thị ",-1)),n("strong",null,l(M.value.length?yn.value+1:0)+"–"+l(M.value.length?yn.value+M.value.length:0),1),E(" / "+l(f.totalRecords)+" bản ghi",1)]),n("div",null,[n("label",null,[p[20]||(p[20]=E("Số dòng",-1)),en(n("select",{"onUpdate:modelValue":p[3]||(p[3]=B=>g.value=B),disabled:y.value},[(i(),r(A,null,U([10,20,50,100],B=>n("option",{key:B,value:B},l(B),9,Nl)),64))],8,Cl),[[Tn,g.value,void 0,{number:!0}]])]),n("button",{type:"button","aria-label":"Trang trước",disabled:y.value||s.value<=1,onClick:p[4]||(p[4]=B=>s.value--)},[...p[21]||(p[21]=[n("i",{class:"pi pi-chevron-left"},null,-1)])],8,Tl),n("span",$l,l(f.pageIndex),1),n("span",null,"/ "+l(xn.value),1),n("button",{type:"button","aria-label":"Trang sau",disabled:y.value||s.value>=xn.value,onClick:p[5]||(p[5]=B=>s.value++)},[...p[22]||(p[22]=[n("i",{class:"pi pi-chevron-right"},null,-1)])],8,_l)])]),p[23]||(p[23]=n("div",{class:"report-sheet-footer"},[n("span",null,"Tổng phút tính trên trang đang xem."),n("span",null,"Excel/PDF xuất toàn bộ kết quả theo bộ lọc đã áp dụng.")],-1))],8,yl),K(V(Qn),{visible:q.value,"onUpdate:visible":p[7]||(p[7]=B=>q.value=B),modal:"",header:"Chi tiết đi muộn / về sớm",style:{width:"780px",maxWidth:"95vw"}},{footer:pn(()=>[K(Y,{label:"Đóng",severity:"secondary",outlined:"",onClick:p[6]||(p[6]=B=>q.value=!1)})]),default:pn(()=>[rn.value?(i(),r("div",Vl,[n("h3",null,l(rn.value.code)+" · "+l(rn.value.name),1),n("dl",El,[(i(!0),r(A,null,U(G.value,B=>(i(),r("div",{key:B.key},[n("dt",null,l(B.label),1),n("dd",null,l(rn.value[B.key]),1)]))),128))])])):I("",!0)]),_:1},8,["visible"])]))}}),Sl={class:"attendance-reports"},Ll={class:"reports-heading"},Bl={key:0,class:"reports-prototype"},Dl={class:"report-tabs",role:"tablist","aria-label":"Loại báo cáo chấm công"},Al=["id","tabindex","aria-selected","onClick","onKeydown"],Rl={class:"report-tab-icon"},Fl={class:"report-tab-number"},Ol={class:"report-filter-actions"},zl={class:"report-period-note"},Il={key:0,class:"report-error",role:"alert"},Ml={class:"report-metrics"},Ul=["aria-labelledby"],ql={class:"report-panel-heading"},Kl={class:"report-heading-exports"},Hl={class:"report-table-tools"},jl={class:"report-search"},Gl=["value"],Xl={key:0,class:"report-feedback",role:"status"},Wl={class:"report-pagination"},Ql=["disabled"],Jl={class:"report-page-current"},Zl=["disabled"],Yl={class:"report-sheet-footer"},no={key:1,class:"report-legend"},eo={key:2,class:"report-explanation"},to={key:3,class:"report-explanation"},ao={key:0,class:"report-detail"},lo={class:"report-detail-person"},oo={class:"report-detail-values"},io={class:"report-detail-caption"},so={class:"report-detail-scroll"},ro={class:"report-detail-table"},uo=Cn({__name:"AttendanceReportsPage",setup(e){const c=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit"}).formatToParts(new Date),a=c.find(x=>x.type==="year").value+"-"+c.find(x=>x.type==="month").value,t=Un({period:a,department:""}),u=b({...t}),s=b("monthly"),g=b(""),f=b(""),T=b(1),y=b(20),N=b({key:"",direction:1}),P=b(null),S=b(!1),D=b(""),C=b(""),j=R(()=>et(s.value,u.value.period)),$=R(()=>Pn.find(x=>x.key===s.value)),_=R(()=>u.value.period.split("-").reverse().join("/")),k=R(()=>({monthly:[{value:"issues",label:"Có bất thường"}],late:[{value:"late",label:"Đi muộn"},{value:"early",label:"Về sớm"}],overtime:[{value:"pendingOt",label:"Có giờ chờ duyệt"},{value:"approved",label:"Đã duyệt toàn bộ"}],anomaly:[{value:"Chờ xử lý",label:"Chờ xử lý"},{value:"Đã giải trình",label:"Đã giải trình"}],payroll:[{value:"Cần đối soát",label:"Cần đối soát"},{value:"Đã đối soát",label:"Đã đối soát"}]})[s.value]),q=x=>x.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/gi,"d").toLocaleLowerCase("vi"),F=R(()=>j.value.rows.filter(x=>u.value.department&&x.department!==u.value.department||g.value&&!q(x.name+" "+x.code).includes(q(g.value.trim()))?!1:f.value?["issues","late","early","pendingOt"].includes(f.value)?Number(x[f.value])>0:f.value==="approved"?x.pendingOt===0:x.status===f.value:!0)),Q=R(()=>[...F.value].sort((x,d)=>{if(!N.value.key)return 0;const v=x[N.value.key],O=d[N.value.key];return(typeof v=="number"&&typeof O=="number"?v-O:String(v).localeCompare(String(O),"vi"))*N.value.direction})),X=R(()=>Math.max(1,Math.ceil(Q.value.length/y.value))),sn=R(()=>(T.value-1)*y.value),Nn=R(()=>Q.value.slice(sn.value,sn.value+y.value)),bn=R(()=>{const x=F.value,d=z=>Bn(x.reduce((w,p)=>w+Number(p[z]||0),0)),v=new Set(x.map(z=>z.code)).size;return{monthly:[["Nhân viên",String(v),"pi-users","Theo phạm vi báo cáo"],["Công thực tế",d("work"),"pi-calendar-plus","Ngày công đã xác minh"],["Giờ tăng ca",d("ot"),"pi-moon","Tổng OT trong tháng"],["Bất thường",d("issues"),"pi-exclamation-triangle","Dòng cần kiểm tra"]],late:[["Lượt vi phạm",String(x.length),"pi-clock",`${v} nhân viên có phát sinh`],["Đi muộn",d("late"),"pi-sign-in","Tổng số phút"],["Về sớm",d("early"),"pi-sign-out","Tổng số phút"],["Bình quân / lượt",x.length?Bn(x.reduce((z,w)=>z+Number(w.late)+Number(w.early),0)/x.length):"0","pi-chart-bar","Phút chênh lệch"]],overtime:[["Nhân viên có OT",String(v),"pi-users","Có phát sinh trong tháng"],["Tổng giờ tăng ca",d("ot"),"pi-moon","Ngày thường + ngày nghỉ"],["Đã phê duyệt",d("approvedOt"),"pi-check-circle","Giờ OT đã duyệt"],["Chờ phê duyệt",d("pendingOt"),"pi-hourglass","Giờ OT cần xác nhận"]],anomaly:[["Bản ghi bất thường",String(x.length),"pi-exclamation-triangle",`${v} nhân viên liên quan`],["Thiếu giờ vào",String(x.filter(z=>z.anomaly==="Thiếu giờ vào").length),"pi-sign-in","Chưa có log vào"],["Thiếu giờ ra",String(x.filter(z=>z.anomaly==="Thiếu giờ ra").length),"pi-sign-out","Chưa có log ra"],["Chờ xử lý",String(x.filter(z=>z.status==="Chờ xử lý").length),"pi-hourglass","Cần bổ sung / giải trình"]],payroll:[["Công hưởng lương",d("paid"),"pi-wallet","Công thực tế + phép có lương"],["Phép đã sử dụng",d("usedLeave"),"pi-calendar-minus","Ngày phép trong kỳ"],["Quỹ phép còn lại",d("closingLeave"),"pi-calendar","Tổng ngày phép cuối kỳ"],["Cần đối soát",String(x.filter(z=>z.status==="Cần đối soát").length),"pi-exclamation-circle","Nhân viên còn log bất thường"]]}[s.value]}),fn=R(()=>j.value.records.filter(x=>{var d,v;return x.code===((d=P.value)==null?void 0:d.code)&&(!((v=P.value)!=null&&v.date)||x.date.split("-").reverse().join("/")===P.value.date)})),M=R(()=>j.value.columns.filter(x=>!["code","name","department"].includes(x.key)&&!/^d\d+$/.test(x.key)));function G(){if(!tt(t.period).length){D.value="Vui lòng chọn tháng từ năm 2000 đến 2100.";return}u.value={...t},D.value="",C.value=""}function rn(){Object.assign(t,{period:a,department:""}),g.value="",f.value="",N.value={key:"",direction:1},G()}function xn(x){N.value={key:x,direction:N.value.key===x?-N.value.direction:1}}function yn(x){P.value=x,S.value=!0}function Rn(x,d){var z;const v=x.key==="ArrowRight"?1:x.key==="ArrowLeft"?-1:0;if(!v&&x.key!=="Home"&&x.key!=="End")return;x.preventDefault();const O=x.key==="Home"?0:x.key==="End"?Pn.length-1:(d+v+Pn.length)%Pn.length;s.value=Pn[O].key,(z=document.getElementById(`report-tab-${s.value}`))==null||z.focus()}function dn(){const x=w=>{let p=String(w??"");return/^[=+@\-\t\r]/.test(p)&&(p="'"+p),'"'+p.replaceAll('"','""')+'"'},d=j.value.columns,v="\uFEFF"+[d.map(w=>w.label),...Q.value.map(w=>d.map(p=>w[p.key]))].map(w=>w.map(x).join(",")).join(`\r
`),O=URL.createObjectURL(new Blob([v],{type:"text/csv;charset=utf-8;"})),z=document.createElement("a");z.href=O,z.download=`BaoCao_${s.value}_${u.value.period}_mau.csv`,document.body.append(z),z.click(),z.remove(),setTimeout(()=>URL.revokeObjectURL(O),1e3),C.value=`Đã xuất ${Q.value.length} bản ghi minh họa ra CSV.`}return wn([s,u,g,f,y],()=>{T.value=1,S.value=!1}),wn(s,()=>{f.value="",N.value={key:"",direction:1},C.value=""}),wn(X,x=>{T.value>x&&(T.value=x)}),(x,d)=>(i(),r("section",Sl,[n("header",Ll,[d[10]||(d[10]=n("div",null,[n("div",{class:"reports-eyebrow"},[n("span"),E(" ATTENDANCE REPORTS")]),n("h1",null,"Báo cáo chấm công"),n("p",null,"Theo dõi ngày công, kiểm soát biến động và đối soát dữ liệu tính lương.")],-1)),s.value!=="late"?(i(),r("span",Bl,[...d[9]||(d[9]=[n("i",{class:"pi pi-sparkles"},null,-1),E(" Prototype · Dữ liệu minh họa",-1)])])):I("",!0)]),n("div",Dl,[(i(!0),r(A,null,U(V(Pn),(v,O)=>(i(),r("button",{id:`report-tab-${v.key}`,key:v.key,type:"button",role:"tab",tabindex:s.value===v.key?0:-1,"aria-selected":s.value===v.key,"aria-controls":"report-panel",class:un({active:s.value===v.key}),onClick:z=>s.value=v.key,onKeydown:z=>Rn(z,O)},[n("span",Rl,[n("i",{class:un(["pi",v.icon])},null,2)]),n("span",null,[n("strong",null,l(v.title),1),n("small",null,l(v.subtitle),1)]),n("span",Fl,"0"+l(O+1),1)],42,Al))),128))]),s.value==="late"?(i(),vn(Pl,{key:0})):(i(),r(A,{key:1},[n("form",{class:"report-filters",onSubmit:Mn(G,["prevent"])},[n("label",null,[d[11]||(d[11]=n("span",null,[E("Kỳ báo cáo "),n("b",null,"*")],-1)),en(n("input",{"onUpdate:modelValue":d[0]||(d[0]=v=>t.period=v),type:"month",min:"2000-01",max:"2100-12",required:""},null,512),[[qn,t.period]])]),n("label",null,[d[13]||(d[13]=n("span",null,"Bộ phận",-1)),en(n("select",{"onUpdate:modelValue":d[1]||(d[1]=v=>t.department=v)},[d[12]||(d[12]=n("option",{value:""},"Tất cả bộ phận",-1)),(i(!0),r(A,null,U(V(nt),v=>(i(),r("option",{key:v},l(v),1))),128))],512),[[Tn,t.department]])]),n("div",Ol,[K(Y,{type:"submit",label:"Xem báo cáo",icon:"pi pi-filter"}),n("button",{class:"report-reset",type:"button",title:"Đặt lại bộ lọc",onClick:rn},[...d[14]||(d[14]=[n("i",{class:"pi pi-refresh"},null,-1),n("span",null,"Đặt lại",-1)])])]),n("div",zl,[d[16]||(d[16]=n("i",{class:"pi pi-calendar"},null,-1)),n("span",null,[d[15]||(d[15]=E("Kỳ đang xem",-1)),n("strong",null,"Tháng "+l(_.value),1)])])],32),D.value?(i(),r("p",Il,l(D.value),1)):I("",!0),n("div",Ml,[(i(!0),r(A,null,U(bn.value,(v,O)=>(i(),r("article",{key:v[0],class:un("report-metric-"+O)},[n("div",null,[n("span",null,l(v[0]),1),n("strong",null,l(v[1]),1),n("small",null,l(v[3]),1)]),n("i",{class:un(["pi",v[2]])},null,2)],2))),128))]),n("section",{id:"report-panel",class:"report-panel",role:"tabpanel","aria-labelledby":`report-tab-${s.value}`},[n("div",ql,[n("div",null,[d[19]||(d[19]=n("span",{class:"report-sheet-label"},[n("i",{class:"pi pi-file-excel"}),E(" BẢNG DỮ LIỆU")],-1)),n("h2",null,[E(l($.value.title)+" ",1),n("span",null,"/ "+l(_.value),1)]),n("p",null,[E(l(u.value.department||"Tất cả bộ phận"),1),d[17]||(d[17]=n("span",null,"·",-1)),E(l(new Set(F.value.map(v=>v.code)).size)+" nhân viên",1),d[18]||(d[18]=n("span",null,"·",-1)),E(l(F.value.length)+" bản ghi ",1)])]),n("div",Kl,[K(Be),K(Y,{label:"Xuất CSV mẫu",icon:"pi pi-download",severity:"secondary",outlined:"",disabled:!F.value.length,onClick:dn},null,8,["disabled"])])]),n("div",Hl,[n("label",jl,[d[20]||(d[20]=n("i",{class:"pi pi-search"},null,-1)),en(n("input",{"onUpdate:modelValue":d[2]||(d[2]=v=>g.value=v),type:"search",placeholder:"Tìm mã hoặc tên nhân viên…","aria-label":"Tìm nhân viên"},null,512),[[qn,g.value]])]),en(n("select",{"onUpdate:modelValue":d[3]||(d[3]=v=>f.value=v),"aria-label":"Lọc trạng thái báo cáo"},[d[21]||(d[21]=n("option",{value:""},"Tất cả trạng thái",-1)),(i(!0),r(A,null,U(k.value,v=>(i(),r("option",{key:v.value,value:v.value},l(v.label),9,Gl))),128))],512),[[Tn,f.value]]),d[22]||(d[22]=n("span",{class:"report-freeze-note"},[n("i",{class:"pi pi-lock"}),E(" Cố định 2 cột nhân viên")],-1))]),C.value?(i(),r("p",Xl,[d[23]||(d[23]=n("i",{class:"pi pi-check-circle"},null,-1)),E(" "+l(C.value),1)])):I("",!0),K(we,{columns:j.value.columns,rows:Nn.value,"all-rows":F.value,offset:sn.value,"sort-key":N.value.key,"sort-direction":N.value.direction,onSort:xn,onOpen:yn},null,8,["columns","rows","all-rows","offset","sort-key","sort-direction"]),n("div",Wl,[n("span",null,[d[24]||(d[24]=E("Hiển thị ",-1)),n("strong",null,l(F.value.length?sn.value+1:0)+"–"+l(Math.min(sn.value+y.value,F.value.length)),1),E(" / "+l(F.value.length)+" bản ghi",1)]),n("div",null,[n("label",null,[d[26]||(d[26]=E("Số dòng ",-1)),en(n("select",{"onUpdate:modelValue":d[4]||(d[4]=v=>y.value=v)},[...d[25]||(d[25]=[n("option",{value:10},"10",-1),n("option",{value:20},"20",-1),n("option",{value:50},"50",-1),n("option",{value:100},"100",-1)])],512),[[Tn,y.value,void 0,{number:!0}]])]),n("button",{type:"button","aria-label":"Trang trước",disabled:T.value===1,onClick:d[5]||(d[5]=v=>T.value--)},[...d[27]||(d[27]=[n("i",{class:"pi pi-chevron-left"},null,-1)])],8,Ql),n("span",Jl,l(T.value),1),n("span",null,"/ "+l(X.value),1),n("button",{type:"button","aria-label":"Trang sau",disabled:T.value>=X.value,onClick:d[6]||(d[6]=v=>T.value++)},[...d[28]||(d[28]=[n("i",{class:"pi pi-chevron-right"},null,-1)])],8,Zl)])]),n("div",Yl,[n("span",null,[d[29]||(d[29]=n("i",{class:"pi pi-check-circle"},null,-1)),E(" "+l($.value.subtitle),1)]),d[30]||(d[30]=n("span",null,"Σ Tổng cộng tính trên toàn bộ kết quả đã lọc",-1))])],8,Ul),s.value==="monthly"?(i(),r("div",no,[d[31]||(d[31]=n("strong",null,"Ký hiệu công",-1)),(i(),r(A,null,U([["X","Đủ công","work"],["M","Đi muộn","warn"],["S","Về sớm","warn"],["P","Phép năm","leave"],["OFF","Ngày nghỉ","off"],["V","Vắng không lương","danger"],["?","Thiếu / lỗi log","danger"]],([v,O,z])=>n("span",{key:v},[n("b",{class:un("cell-"+z)},l(v),3),E(l(O),1)])),64))])):I("",!0),s.value==="overtime"?(i(),r("p",eo,[...d[32]||(d[32]=[n("i",{class:"pi pi-info-circle"},null,-1),E(" OT đêm là phần nằm trong tổng OT; không cộng thêm lần nữa. ",-1)])])):I("",!0),s.value==="payroll"?(i(),r("p",to,[...d[33]||(d[33]=[n("i",{class:"pi pi-info-circle"},null,-1),E(" Mô phỏng: công hưởng lương = công thực tế + phép có lương. Phép còn lại = đầu kỳ + phát sinh − đã dùng. Công chưa xác minh được tách riêng để đối soát. ",-1)])])):I("",!0),d[35]||(d[35]=n("p",{class:"report-demo-note"}," Dữ liệu mẫu phục vụ duyệt giao diện · Chưa kết nối API báo cáo. ",-1)),K(V(Qn),{visible:S.value,"onUpdate:visible":d[8]||(d[8]=v=>S.value=v),modal:"",header:"Chi tiết chấm công",style:{width:"780px",maxWidth:"95vw"}},{footer:pn(()=>[K(Y,{label:"Đóng",severity:"secondary",outlined:"",onClick:d[7]||(d[7]=v=>S.value=!1)})]),default:pn(()=>{var v;return[P.value?(i(),r("div",ao,[n("div",lo,[n("span",null,l((v=P.value.name.split(" ").at(-1))==null?void 0:v.slice(0,1)),1),n("div",null,[n("h3",null,l(P.value.name),1),n("p",null,l(P.value.code)+" · "+l(P.value.department),1)]),n("b",null,l(_.value),1)]),n("dl",oo,[(i(!0),r(A,null,U(M.value,O=>(i(),r("div",{key:O.key},[n("dt",null,l(O.label),1),n("dd",null,l(P.value[O.key]),1)]))),128))]),n("p",io," Dữ liệu quẹt thẻ minh họa · "+l(fn.value.length)+" ngày ",1),n("div",so,[n("table",ro,[d[34]||(d[34]=n("thead",null,[n("tr",null,[n("th",null,"Ngày"),n("th",null,"Ca"),n("th",null,"Giờ vào"),n("th",null,"Giờ ra"),n("th",null,"Ký hiệu"),n("th",null,"OT (giờ)"),n("th",null,"Ghi chú")])],-1)),n("tbody",null,[(i(!0),r(A,null,U(fn.value,O=>(i(),r("tr",{key:O.date},[n("td",null,l(O.date.split("-").reverse().join("/")),1),n("td",null,l(O.shift),1),n("td",null,l(O.checkIn),1),n("td",null,l(O.checkOut),1),n("td",null,l(O.symbol),1),n("td",null,l(V(Bn)(O.ot)),1),n("td",null,l(O.anomaly||"—"),1)]))),128))])])])])):I("",!0)]}),_:1},8,["visible"])],64))]))}}),co={class:"attendance-workspace"},ho={"aria-label":"Đường dẫn"},po={class:"workspace-empty"},mo=Cn({__name:"AttendanceWorkspaceView",setup(e){const c=je(),a=R(()=>Ge.find(t=>t.path===c.path));return(t,u)=>{var g,f,T,y;const s=He("RouterLink");return i(),r("section",co,[n("nav",ho,[K(s,{to:"/attendance/overview"},{default:pn(()=>[...u[0]||(u[0]=[E("Chấm công",-1)])]),_:1}),n("span",null," / "+l((g=a.value)==null?void 0:g.label),1)]),V(c).meta.attendancePage==="daily"?(i(),vn(ot,{key:0})):V(c).meta.attendancePage==="monthly"?(i(),vn(Qa,{key:1})):V(c).meta.attendancePage==="reports"?(i(),vn(uo,{key:2})):(i(),r(A,{key:3},[n("h1",null,l((f=a.value)==null?void 0:f.label),1),n("div",po,[n("i",{class:un(["pi",(T=a.value)==null?void 0:T.icon])},null,2),n("h2",null,"Chưa có dữ liệu "+l((y=a.value)==null?void 0:y.label.toLocaleLowerCase()),1),u[2]||(u[2]=n("p",null," Chức năng đã được tách riêng trong module Chấm công. Chưa kết nối nguồn dữ liệu cho màn hình này. ",-1)),K(s,{to:"/attendance/overview"},{default:pn(()=>[...u[1]||(u[1]=[E("← Về tổng quan chấm công",-1)])]),_:1})])],64))])}}}),Zo=Ce(mo,[["__scopeId","data-v-75378769"]]);export{Zo as default};
