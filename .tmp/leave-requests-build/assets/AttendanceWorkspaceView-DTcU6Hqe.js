import{d as Tn,o as l,x as mn,c as i,b as n,F as S,v as z,t as a,n as rn,G as Cn,f as x,w as Kn,g as F,e as B,i as O,r as b,am as Sn,an as Dn,ao as Le,P as Pe,p as ae,N as Yn,y as Nn,C as Be,I as Se,h as R,_ as Y,z as en,E as Bn,A as ne,R as se,ap as ue,aq as De,s as cn,K as ee,L as on,O as Ae,q as Fe,k as Oe}from"./index-CQZem8rw.js";import{a as ze}from"./attendance-CYkncW1q.js";import{M as Me}from"./ModuleListView-96EcdUqn.js";import{s as Ke}from"./index-D1zgErzh.js";import{s as Ue}from"./index-BWkJ2B6v.js";import{e as qe}from"./employee.service-CV_X0lwL.js";import{l as le,e as Ie,p as Re}from"./period.types-HWjQ9l0p.js";import{p as He}from"./record.service-Bkynfq_A.js";import{r as kn,a as je,_ as Ge,n as Qn,b as We,m as Xe}from"./reports-CjlbWe6L.js";import{_ as Qe}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./index-_dqbX9P5.js";import"./index-CAoCROFS.js";import"./index-CUlThVU3.js";import"./index-BKt-H6jS.js";import"./AppDrawer.vue_vue_type_script_setup_true_lang-CfRpKbfm.js";import"./ContractInspector.vue_vue_type_script_setup_true_lang-CHDRQ4pY.js";import"./ContractCreateView-CFxmAd-U.js";import"./AppLoading.vue_vue_type_script_setup_true_lang-D7PUvRT0.js";import"./AppErrorState.vue_vue_type_script_setup_true_lang-DN3KCIyF.js";import"./AppStatusBadge.vue_vue_type_script_setup_true_lang-BN8vupms.js";import"./ContractForm-CedYibkc.js";import"./recruitment.service-CxPlQtS9.js";import"./employee.documents-C6IhgHYQ.js";import"./useContractPermission-rpVbgo8p.js";import"./index-Cn-TycK3.js";import"./useToast-Dzpzh6_h.js";import"./useConfirm-zcqDUpz9.js";import"./currency-Bi9uwIDW.js";import"./AppDataTable.vue_vue_type_script_setup_true_lang-DkMGPLD9.js";import"./AppEmptyState.vue_vue_type_script_setup_true_lang-h_eH6xKc.js";import"./AppForm.vue_vue_type_script_setup_true_lang-DWPilihZ.js";import"./AppKpiCard-DhNN77FC.js";import"./modules-CJV0O-xn.js";import"./useRecords-C2yM-xnp.js";import"./export-BblXOGSb.js";import"./employee.type-CHSeIpHQ.js";const Je=Tn({__name:"AttendanceListView",setup(t){return(p,o)=>(l(),mn(Me,{module:"attendance"}))}}),Un={NORMAL:{label:"Đủ ca",bg:"#ECFDF5",text:"#065F46",border:"#A7F3D0",abnormal:!1},LEAVE_VACATION:{label:"Nghỉ lễ",bg:"#EFF6FF",text:"#1E40AF",border:"#BFDBFE",abnormal:!1},LEAVE_NORMAL:{label:"Nghỉ phép",bg:"#F5F3FF",text:"#5B21B6",border:"#DDD6FE",abnormal:!1},WORK_IN_VACATION:{label:"Làm việc trong lễ",bg:"#ECFEFF",text:"#155E75",border:"#A5F3FC",abnormal:!1},HALF_WORK:{label:"Nửa công",bg:"#FFFBEB",text:"#92400E",border:"#FDE68A",abnormal:!1},LEAVE_ABNORMAL:{label:"Nghỉ bất thường",bg:"#FFF1F2",text:"#9F1239",border:"#FECDD3",abnormal:!0},ATTENDANCE_ABNORMAL:{label:"Công bất thường",bg:"#FEF2F2",text:"#991B1B",border:"#FECACA",abnormal:!0},CHECK_YOUR_LOG_WORK:{label:"Cần kiểm tra log công",bg:"#FFF7ED",text:"#9A3412",border:"#FED7AA",abnormal:!0}},Ze={label:"Chưa có dữ liệu",bg:"#F8FAFC",text:"#475569",border:"#E2E8F0",abnormal:!1},W=t=>t?Un[t.trangThaiCong||""]||Un.ATTENDANCE_ABNORMAL:Ze,sn=t=>t?[t.ho,t.tenDem,t.ten].filter(Boolean).join(" ").trim()||t.hoTen||t.maNhanVien:"";function tn(t){const p=t.slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(p)||!Number.isFinite(Date.parse(p+"T12:00:00Z"))||new Date(p+"T12:00:00Z").toISOString().slice(0,10)!==p)throw new Error("Ngày chấm công không hợp lệ: "+t);return p}const Q=t=>t?tn(t).split("-").reverse().join("/"):"—";function he(t,p){const o=new Date(Date.UTC(t,p-1,1));o.setUTCFullYear(t);const c=(o.getUTCDay()+6)%7,u=new Date(o);return u.setUTCMonth(u.getUTCMonth()+1),u.setUTCDate(0),Array.from({length:Math.ceil((c+u.getUTCDate())/7)*7},(h,k)=>{const N=k-c+1;return N<1||N>u.getUTCDate()?null:String(t).padStart(4,"0")+"-"+String(p).padStart(2,"0")+"-"+String(N).padStart(2,"0")})}function Ye(t,p){const o=new Map;for(const c of t){const u=tn(c.ngayChamCong);if(o.has(u))throw new Error("Có nhiều bản ghi công cùng ngày "+Q(u)+".");o.set(u,c)}return o}const pe=(t,p=!1)=>typeof t=="number"&&Number.isFinite(t)?new Intl.NumberFormat("vi-VN",{maximumFractionDigits:2}).format(p?t/60:t):"—",nt=[{key:"soNgayCoCong",label:"Ngày có công",visible:!0},{key:"tongSoPhutLamViecThucTe",label:"Giờ làm thực tế",visible:!0,hours:!0},{key:"tongCongHopLe",label:"Công hợp lệ",visible:!0},{key:"tongNgayNghiCoLuong",label:"Nghỉ có lương",visible:!0},{key:"tongNgayNghiKhongLuong",label:"Nghỉ không lương",visible:!0},{key:"tongCongHuongLuong",label:"Công hưởng lương",visible:!0},{key:"soNgayCoDuLieuCong",label:"Ngày có dữ liệu",visible:!1},{key:"soNgayDuLog",label:"Ngày đủ log",visible:!1},{key:"soNgayKhongLog",label:"Ngày không log",visible:!1},{key:"soNgayDiTre",label:"Ngày đi trễ",visible:!1},{key:"tongSoPhutDiTre",label:"Phút đi trễ",visible:!1},{key:"soNgayVeSom",label:"Ngày về sớm",visible:!1},{key:"tongSoPhutVeSom",label:"Phút về sớm",visible:!1},{key:"tongSoPhutTangCa",label:"Giờ tăng ca",visible:!1,hours:!0},{key:"soNgayQuaDem",label:"Ngày qua đêm",visible:!1},{key:"tongNgayNghi",label:"Tổng ngày nghỉ",visible:!1}],et={tongDongTinh:"Tổng dòng tính",soDongThemMoi:"Thêm mới",soDongCapNhat:"Cập nhật",soDongThieuLog:"Thiếu log",soDongNgayLe:"Ngày lễ",soDongNghiPhep:"Nghỉ phép",soDongBoQuaKhongCapNhat:"Bỏ qua / không cập nhật",soNhanVienThemMoi:"Nhân viên thêm mới",soNhanVienCapNhat:"Nhân viên cập nhật",soNhanVienBoQuaDaKhoa:"Bỏ qua do khóa",thang:"Tháng",nam:"Năm",kyChamCongId:"Kỳ công"},Pn=(t,p)=>JSON.stringify([t,tn(p)]);function me(t,p){const o=new Map;for(const c of t){if(p&&c.maNhanVien!==p)throw new Error("API trả dữ liệu của nhân viên khác.");const u=Pn(c.maNhanVien,c.ngayChamCong);if(o.has(u))throw new Error("Có nhiều bản ghi công của nhân viên "+c.maNhanVien+" trong ngày "+Q(c.ngayChamCong)+".");o.set(u,c)}return o}function tt(t,p,o){const c=new Map;for(const u of[...t,...p]){if(o.maBoPhan&&u.maBoPhan!==o.maBoPhan||o.maNhanVien&&u.maNhanVien!==o.maNhanVien)continue;const h=c.get(u.maNhanVien);c.set(u.maNhanVien,{...h,...u,ho:u.ho??(h==null?void 0:h.ho),tenDem:u.tenDem??(h==null?void 0:h.tenDem),ten:u.ten??(h==null?void 0:h.ten),hoTen:u.hoTen??(h==null?void 0:h.hoTen),tenBoPhan:u.tenBoPhan??(h==null?void 0:h.tenBoPhan)})}return[...c.values()].sort((u,h)=>sn(u).localeCompare(sn(h),"vi")||u.maNhanVien.localeCompare(h.maNhanVien))}function ge(t,p){return t&&W(t).abnormal&&p?["recalculate"]:[]}const ye=(t,p)=>he(t,p).filter(o=>!!o),wn=[{key:"ngayNghiPhep",label:"Nghỉ phép"},{key:"ngayNghiHuongLuong",label:"Nghỉ hưởng lương"},{key:"nghiLe",label:"Nghỉ lễ"},{key:"ngayNghiKhongHuongLuong",label:"Nghỉ không hưởng lương"},{key:"otNgayLe",label:"OT ngày lễ"},{key:"otNgayThuong",label:"OT ngày thường"}];function at(t,p){const o=new Set(ye(p.nam,p.thang)),c=new Map;for(const u of t){if(!o.has(tn(u.ngayChamCong)))continue;let h=c.get(u.maNhanVien);h||(h={ngayNghiPhep:0,ngayNghiHuongLuong:0,nghiLe:0,ngayNghiKhongHuongLuong:0,otNgayLe:0,otNgayThuong:0},c.set(u.maNhanVien,h));for(const{key:k}of wn){const N=u[k];typeof N=="number"&&Number.isFinite(N)&&(h[k]+=N)}}return c}const lt={class:"attendance-calendar"},ot={class:"monthly-table-scroll"},it={class:"month-grid","aria-label":"Lịch chấm công tháng"},rt=["onContextmenu"],st={class:"day-top"},ut=["datetime"],ct=["aria-label","onClick"],dt=["aria-label","onClick"],ht={key:1,class:"day-body"},pt={key:0,class:"outside-days"},mt={class:"outside-grid"},gt=["onContextmenu"],yt={class:"day-top"},vt=["datetime"],bt=["aria-label","onClick"],ft=["onClick"],xt={key:1,class:"day-body"},kt={class:"monthly-legend","aria-label":"Chú giải trạng thái"},wt=Tn({__name:"AttendanceCalendar",props:{rows:{},year:{},month:{},readonly:{type:Boolean,default:!1}},emits:["menu","detail"],setup(t,{emit:p}){const o=t,c=p,u=O(()=>Ye(o.rows)),h=O(()=>he(o.year,o.month)),k=O(()=>Array.from({length:h.value.length/7},(T,P)=>h.value.slice(P*7,P*7+7))),N=O(()=>String(o.year).padStart(4,"0")+"-"+String(o.month).padStart(2,"0")),_=O(()=>o.rows.filter(T=>!tn(T.ngayChamCong).startsWith(N.value)).sort((T,P)=>T.ngayChamCong.localeCompare(P.ngayChamCong)));function v(T,P){o.readonly||!T||!W(T).abnormal||(P.preventDefault(),c("menu",T,P))}function $(T){!o.readonly&&T&&!W(T).abnormal&&c("detail",T)}function V(T){const P=W(T);return{background:P.bg,color:P.text,borderColor:P.border}}return(T,P)=>(l(),i("div",lt,[n("div",ot,[n("table",it,[n("thead",null,[n("tr",null,[(l(),i(S,null,z(["Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy","Chủ nhật"],D=>n("th",{key:D,scope:"col"},a(D),1)),64))])]),n("tbody",null,[(l(!0),i(S,null,z(k.value,(D,H)=>(l(),i("tr",{key:H},[(l(!0),i(S,null,z(D,(w,C)=>{var y,U;return l(),i("td",{key:w||C,class:rn({"empty-calendar-cell":!w})},[w?(l(),i("div",{key:0,class:"calendar-day",style:Cn(V(u.value.get(w))),onContextmenu:A=>v(u.value.get(w),A)},[n("div",st,[n("time",{datetime:w,class:rn({weekend:C>4})},a(Number(w.slice(-2))),11,ut),!t.readonly&&u.value.has(w)&&x(W)(u.value.get(w)).abnormal?(l(),i("button",{key:0,type:"button",class:"day-more","aria-label":"Xử lý công ngày "+x(Q)(w),onClick:Kn(A=>c("menu",u.value.get(w),A),["stop"])}," ••• ",8,ct)):F("",!0)]),!t.readonly&&u.value.has(w)&&!x(W)(u.value.get(w)).abnormal?(l(),i("button",{key:0,type:"button",class:"day-body","aria-label":"Xem công ngày "+x(Q)(w),onClick:A=>$(u.value.get(w))},[n("strong",null,a(((y=u.value.get(w))==null?void 0:y.hienThiCa)||"—"),1),n("span",null,a(x(W)(u.value.get(w)).label),1)],8,dt)):(l(),i("div",ht,[n("strong",null,a(((U=u.value.get(w))==null?void 0:U.hienThiCa)||"—"),1),n("span",null,a(x(W)(u.value.get(w)).label),1)]))],44,rt)):F("",!0)],2)}),128))]))),128))])])]),_.value.length?(l(),i("section",pt,[P[0]||(P[0]=n("h3",null,"Ngày ngoài tháng thuộc kỳ công",-1)),n("div",mt,[(l(!0),i(S,null,z(_.value,D=>(l(),i("div",{key:D.ngayChamCong,class:"calendar-day",style:Cn(V(D)),onContextmenu:H=>v(D,H)},[n("div",yt,[n("time",{datetime:x(tn)(D.ngayChamCong)},a(x(Q)(D.ngayChamCong)),9,vt),!t.readonly&&x(W)(D).abnormal?(l(),i("button",{key:0,type:"button",class:"day-more","aria-label":"Xử lý công ngày "+x(Q)(D.ngayChamCong),onClick:H=>c("menu",D,H)}," ••• ",8,bt)):F("",!0)]),!t.readonly&&!x(W)(D).abnormal?(l(),i("button",{key:0,class:"day-body",type:"button",onClick:H=>$(D)},[n("strong",null,a(D.hienThiCa||"—"),1),n("span",null,a(x(W)(D).label),1)],8,ft)):(l(),i("div",xt,[n("strong",null,a(D.hienThiCa||"—"),1),n("span",null,a(x(W)(D).label),1)]))],44,gt))),128))])])):F("",!0),n("div",kt,[(l(!0),i(S,null,z(x(Un),(D,H)=>(l(),i("span",{key:H},[n("i",{style:Cn({background:D.bg,borderColor:D.border}),"aria-hidden":"true"},null,4),B(a(D.label),1)]))),128)),P[1]||(P[1]=n("span",null,[n("i",{"aria-hidden":"true"}),B("Chưa có dữ liệu")],-1))])]))}}),Ct={class:"attendance-month-grid"},Nt={class:"excel-scroll",role:"region","aria-label":"Bảng chi tiết chấm công tháng, cuộn ngang để xem các ngày",tabindex:"0"},Tt={class:"excel-attendance","aria-label":"Nhân viên và ký hiệu công từng ngày"},_t=["colspan"],Vt=["colspan"],$t=["datetime"],Et={class:"excel-sticky excel-stt"},Lt={class:"excel-sticky excel-code"},Pt={class:"excel-sticky excel-name",scope:"row"},Bt={class:"excel-dept"},St=["title","onContextmenu"],Dt=["aria-label","onClick"],At={key:0},Ft=["colspan"],Ot={class:"monthly-subtitle excel-help"},zt={class:"monthly-legend","aria-label":"Chú giải trạng thái"},Mt=Tn({__name:"AttendanceMonthGrid",props:{rows:{},employees:{},filter:{},allowActions:{type:Boolean,default:!1}},emits:["menu","detail"],setup(t,{emit:p}){const o=t,c=p,u=b(""),h=O(()=>me(o.rows)),k=O(()=>tt(o.employees,o.rows,o.filter)),N=O(()=>ye(o.filter.nam,o.filter.thang)),_=O(()=>at(o.rows,o.filter)),v=["CN","T2","T3","T4","T5","T6","T7"],$=w=>v[new Date(w+"T12:00:00Z").getUTCDay()],V=(w,C)=>h.value.get(Pn(w,C)),T=(w,C)=>{const y=V(w.maNhanVien,C);return sn(w)+" · "+Q(C)+" · "+((y==null?void 0:y.hienThiCa)||"—")+" · "+W(y).label},P=w=>({background:W(w).bg,color:W(w).text});function D(w,C){u.value=Pn(w.maNhanVien,C);const y=V(w.maNhanVien,C);y&&!W(y).abnormal&&c("detail",y)}function H(w,C,y){const U=V(w.maNhanVien,C);!ge(U,o.allowActions).length||!U||(y.preventDefault(),u.value=Pn(w.maNhanVien,C),c("menu",U,y))}return(w,C)=>(l(),i("div",Ct,[n("div",Nt,[n("table",Tt,[n("colgroup",null,[C[0]||(C[0]=n("col",{class:"excel-number-col"},null,-1)),C[1]||(C[1]=n("col",{class:"excel-code-col"},null,-1)),C[2]||(C[2]=n("col",{class:"excel-name-col"},null,-1)),C[3]||(C[3]=n("col",{class:"excel-dept-col"},null,-1)),(l(!0),i(S,null,z(N.value,y=>(l(),i("col",{key:y,class:"excel-day-col"}))),128)),(l(!0),i(S,null,z(x(wn),y=>(l(),i("col",{key:y.key,class:"excel-total-col"}))),128))]),n("thead",null,[n("tr",null,[C[4]||(C[4]=n("th",{rowspan:"2",class:"excel-sticky excel-stt",scope:"col"},"STT",-1)),C[5]||(C[5]=n("th",{rowspan:"2",class:"excel-sticky excel-code",scope:"col"},"Mã nhân viên",-1)),C[6]||(C[6]=n("th",{rowspan:"2",class:"excel-sticky excel-name",scope:"col"},"Họ và tên",-1)),C[7]||(C[7]=n("th",{rowspan:"2",class:"excel-dept",scope:"col"},"Bộ phận",-1)),n("th",{colspan:N.value.length,scope:"colgroup"}," Ngày công tháng "+a(String(t.filter.thang).padStart(2,"0"))+"/"+a(t.filter.nam),9,_t),n("th",{colspan:x(wn).length,scope:"colgroup"},"Tổng trong tháng",8,Vt)]),n("tr",null,[(l(!0),i(S,null,z(N.value,y=>(l(),i("th",{key:y,scope:"col",class:rn({"excel-weekend":$(y)==="CN"||$(y)==="T7"})},[n("time",{datetime:y},a(Number(y.slice(-2))),9,$t),n("small",null,a($(y)),1)],2))),128)),(l(!0),i(S,null,z(x(wn),y=>(l(),i("th",{key:y.key,scope:"col"},a(y.label),1))),128))])]),n("tbody",null,[(l(!0),i(S,null,z(k.value,(y,U)=>(l(),i("tr",{key:y.maNhanVien},[n("td",Et,a(U+1),1),n("td",Lt,a(y.maNhanVien),1),n("th",Pt,a(x(sn)(y)),1),n("td",Bt,a(y.tenBoPhan||y.maBoPhan||"—"),1),(l(!0),i(S,null,z(N.value,A=>{var G;return l(),i("td",{key:A,class:rn(["excel-attendance-cell",{"excel-selected":u.value===x(Pn)(y.maNhanVien,A)}]),style:Cn(P(V(y.maNhanVien,A))),title:T(y,A),onContextmenu:nn=>H(y,A,nn)},[n("button",{type:"button",class:"excel-cell-symbol","aria-label":T(y,A),onClick:nn=>D(y,A)},a(((G=V(y.maNhanVien,A))==null?void 0:G.hienThiCa)||"—"),9,Dt)],46,St)}),128)),(l(!0),i(S,null,z(x(wn),A=>{var G;return l(),i("td",{key:A.key,class:"excel-total"},a(x(pe)(((G=_.value.get(y.maNhanVien))==null?void 0:G[A.key])??0)),1)}),128))]))),128)),k.value.length?F("",!0):(l(),i("tr",At,[n("td",{colspan:N.value.length+4+x(wn).length,class:"excel-empty"}," Không có nhân viên theo bộ lọc. ",8,Ft)]))])])]),n("p",Ot,a(k.value.length)+" nhân viên · Ô hiển thị ký hiệu công/nghỉ phép. Nhấn chuột phải vào ô công bất thường để xem chức năng có thể sử dụng. ",1),n("div",zt,[(l(!0),i(S,null,z(x(Un),(y,U)=>(l(),i("span",{key:U},[n("i",{style:Cn({background:y.bg,borderColor:y.border}),"aria-hidden":"true"},null,4),B(a(y.label),1)]))),128)),C[8]||(C[8]=n("span",null,[n("i",{"aria-hidden":"true"}),B("Chưa có dữ liệu")],-1))])]))}});function oe(t){if((t==null?void 0:t.isResults)!==!0||t.data==null)throw new Error((t==null?void 0:t.message)||"Không nhận được dữ liệu chấm công hợp lệ.");return t.data}const ve="maNhanVien ho tenDem ten maBoPhan tenBoPhan",be="thang nam tuNgay denNgay trangThai ngayChot",Kt=ve+" "+be+" ngaySinh gioiTinh soNgayCoDuLieuCong soNgayDuLog soNgayKhongLog soNgayCoCong tongSoPhutLamViecThucTe tongSoPhutDiTre tongSoPhutVeSom soNgayDiTre soNgayVeSom tongSoPhutTangCa soNgayQuaDem tongCongHopLe tongNgayNghi tongNgayNghiCoLuong tongNgayNghiKhongLuong tongCongHuongLuong",Ut=ve+" "+be+" maCa kyHieuCa ngayChamCong gioVao gioRa soPhutLamViec soGioLamViec maLoaiNghiPhep laNgayLe hienThiCa trangThaiCong ngayNghiPhep ngayNghiHuongLuong nghiLe ngayNghiKhongHuongLuong otNgayLe otNgayThuong";function In(t){if(!Number.isInteger(t.thang)||t.thang<1||t.thang>12||!Number.isInteger(t.nam)||t.nam<100||t.nam>9998)throw new Error("Tháng hoặc năm không hợp lệ.")}async function qt(t){In(t);const p=new URL("/api/bang-cham-cong/export-excel",new URL("https://hrmsapi-crc3crfdegesbper.westus3-01.azurewebsites.net/graphql",window.location.origin));p.searchParams.set("thang",String(t.thang)),p.searchParams.set("nam",String(t.nam)),t.maNhanVien&&p.searchParams.set("manhanvien",t.maNhanVien),t.maBoPhan&&p.searchParams.set("mabophan",t.maBoPhan);const o=`BangChamCong_${t.nam}_${String(t.thang).padStart(2,"0")}.xlsx`;return He(async()=>{var $,V;const c=await fetch(p,{method:"GET",credentials:"include",headers:{Authorization:`Bearer ${Le.get()}`,Accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}});if(c.status===401)throw new Pe(401);const u=c.headers.get("content-type")||"";if(!c.ok||u.toLowerCase().includes("json")){const T=await c.json().catch(()=>null);throw new Error((T==null?void 0:T.message)||(T==null?void 0:T.detail)||(T==null?void 0:T.title)||`Không thể xuất Excel (HTTP ${c.status}).`)}const h=await c.blob();if(!h.size)throw new Error("Máy chủ trả về tệp Excel trống.");const k=c.headers.get("content-disposition")||"",N=($=/filename\*\s*=\s*UTF-8''([^;]+)/i.exec(k))==null?void 0:$[1],_=/filename\s*=\s*(?:"([^"]+)"|([^;]+))/i.exec(k);let v=(_==null?void 0:_[1])||((V=_==null?void 0:_[2])==null?void 0:V.trim())||o;if(N)try{v=decodeURIComponent(N.trim())}catch{}return v=v.replace(/[/\\]/g,"_"),{blob:h,filename:v}})}function fe(t){return In(t),"thang:"+t.thang+",nam:"+t.nam+",maBoPhan:"+JSON.stringify(t.maBoPhan||null)}async function ce(t){const{data:p}=await Sn.query({query:Dn("query BangCongThang { bangCongThang("+fe(t)+"){isResults message data{"+Kt+"}}}"),fetchPolicy:"no-cache",errorPolicy:"none"}),o=oe(p==null?void 0:p.bangCongThang);if(!Array.isArray(o))throw new Error("Báo cáo tháng không đúng định dạng.");return o.filter(Boolean)}async function Jn(t){const{data:p}=await Sn.query({query:Dn("query BangTongHopNgay { bangTongHopNgay("+fe(t)+",maNhanVien:"+JSON.stringify(t.maNhanVien)+"){isResults message data{"+Ut+"}}}"),fetchPolicy:"no-cache",errorPolicy:"none"}),o=oe(p==null?void 0:p.bangTongHopNgay);if(!Array.isArray(o))throw new Error("Công ngày không đúng định dạng.");const c=o.filter(Boolean);return me(c,t.maNhanVien),c}const xe={batch:"tinhChamCongHangLoat",month:"chamCongThang",person:"tinhChamCongNgayTheoNhanVien"};function te(t){if(t.kind==="NON_NULL")return te(t.ofType)+"!";if(t.kind==="LIST")return"["+te(t.ofType)+"]";if(!t.name)throw new Error("Schema input không hợp lệ.");return t.name}function qn(t){return t.ofType?qn(t.ofType):t.name||""}const de="kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name}}}}",Zn=new Map;async function It(t){const p=xe[t];let o=Zn.get(p);return o||(o=(async()=>{var v,$,V,T;const{data:c}=await Sn.query({query:Dn("query AttendanceMutationContract {__schema{mutationType{fields{name args{name defaultValue type{"+de+"}}}}}}"),fetchPolicy:"no-cache",errorPolicy:"none"}),u=($=(v=c==null?void 0:c.__schema)==null?void 0:v.mutationType)==null?void 0:$.fields.find(P=>P.name===p),h=u==null?void 0:u.args.find(P=>P.name==="input");if(!h)throw new Error("Máy chủ chưa cung cấp hợp đồng input cho "+p+".");if(u.args.some(P=>P.name!=="input"&&P.type.kind==="NON_NULL"&&P.defaultValue==null))throw new Error("Mutation có tham số bắt buộc ngoài input chưa được ánh xạ.");const k=qn(h.type),_=(T=(V=(await Sn.query({query:Dn("query AttendanceInputFields($name:String!){__type(name:$name){inputFields{name defaultValue type{"+de+"}}}}"),variables:{name:k},fetchPolicy:"no-cache",errorPolicy:"none"})).data)==null?void 0:V.__type)==null?void 0:T.inputFields;if(!_)throw new Error("Input chưa phải kiểu đối tượng được hỗ trợ.");return{inputType:te(h.type),fields:_}})().catch(c=>{throw Zn.delete(p),c}),Zn.set(p,o)),o}function Rt(t,p,o){var _;In(p.filter);const c=new Set(o.map(v=>v.name)),{filter:u}=p,h=["ngayChamCong","ngayLamViec","ngay"].find(v=>c.has(v));if(t==="person"&&(!p.day||!p.employee||p.day.maNhanVien!==p.employee.maNhanVien||!c.has("maNhanVien")||!h))throw new Error("Input chưa hỗ trợ đúng phạm vi nhân viên và ngày được chọn.");if(t!=="person"&&u.maNhanVien&&!c.has("maNhanVien"))throw new Error("API này không hỗ trợ lọc nhân viên. Hãy chọn Tất cả nhân viên trước khi tính.");if(t!=="person"&&u.maBoPhan&&!c.has("maBoPhan"))throw new Error("API này không hỗ trợ bộ phận đang chọn. Hãy chọn Tất cả bộ phận trước khi tính.");if(!c.has("kyChamCongId")&&!(c.has("thang")&&c.has("nam")))throw new Error("Input chưa có kỳ hoặc tháng/năm được hỗ trợ.");if(t!=="person"&&h&&((_=o.find(v=>v.name===h))==null?void 0:_.type.kind)==="NON_NULL")throw new Error("API yêu cầu chọn ngày cho thao tác hàng loạt; cần bổ sung hợp đồng trước khi sử dụng.");const k={thang:u.thang,nam:u.nam,maBoPhan:u.maBoPhan,maNhanVien:t==="person"?p.employee.maNhanVien:u.maNhanVien,previewOnly:!1,debug:!1};if(c.has("kyChamCongId")){if(p.kyChamCongId==null)throw new Error("Chưa xác định được kỳ công.");const v=Ie(p.kyChamCongId),$=qn(o.find(V=>V.name==="kyChamCongId").type);if($==="ID"||$==="String")k.kyChamCongId=v;else{const V=Number(v);if(!Number.isSafeInteger(V))throw new Error("ID kỳ vượt giới hạn số an toàn của input.");k.kyChamCongId=V}}if(t==="person"&&h){const v=tn(p.day.ngayChamCong),$=p.day;if($.tuNgay&&v<tn($.tuNgay)||$.denNgay&&v>tn($.denNgay))throw new Error("Ngày nằm ngoài kỳ công.");const V=qn(o.find(T=>T.name===h).type);k[h]=V==="DateTime"?v+"T00:00:00+07:00":v}const N={};for(const v of o)if(Object.hasOwn(k,v.name)&&(k[v.name]!=null||v.type.kind!=="NON_NULL"))N[v.name]=k[v.name];else if(v.type.kind==="NON_NULL"&&v.defaultValue==null)throw new Error("Cần ánh xạ trường input bắt buộc: "+v.name);return N}async function Ht(t,p){if(!ae().can("attendance","update"))throw new Error("Bạn không có quyền tính công.");const o=JSON.parse(JSON.stringify(p)),c=await It(t),u=await le({nam:o.filter.nam,thang:o.filter.thang,trangThai:null});if(u.length!==1)throw new Error("Cần xác định chính xác một kỳ chấm công cho tháng đã chọn.");const h=u[0];if(h.trangThai!=="O")throw new Error("Chỉ tính công khi kỳ đang mở.");if(o.day){const _=tn(o.day.ngayChamCong);if(_<tn(h.tuNgay)||_>tn(h.denNgay))throw new Error("Ngày được chọn nằm ngoài kỳ công.")}o.kyChamCongId=h.id;const k=Rt(t,o,c.fields),N=["Kỳ: "+o.filter.thang+"/"+o.filter.nam,t==="person"?"Nhân viên: "+sn(o.employee)+" ("+o.employee.maNhanVien+")":"Nhân viên: "+(o.filter.maNhanVien||"Tất cả"),t==="person"?"Ngày: "+Q(o.day.ngayChamCong):"Phạm vi: toàn kỳ đã chọn"];return t!=="person"&&N.push("Bộ phận: "+(o.filter.maBoPhan||"Tất cả")),{kind:t,context:o,input:k,inputType:c.inputType,scope:N}}async function jt(t){if(!ae().can("attendance","update"))throw new Error("Bạn không có quyền tính công.");const p=await le({nam:t.context.filter.nam,thang:t.context.filter.thang,trangThai:null});if(p.length!==1||String(p[0].id)!==String(t.context.kyChamCongId)||p[0].trangThai!=="O")throw new Error("Kỳ công đã thay đổi hoặc không còn mở.");const o=xe[t.kind],c=t.kind==="month"?"thang nam kyChamCongId soNhanVienThemMoi soNhanVienCapNhat soNhanVienBoQuaDaKhoa":(t.kind==="person"?"soDongBoQuaKhongCapNhat ":"")+"tongDongTinh soDongThemMoi soDongCapNhat soDongThieuLog soDongNgayLe soDongNghiPhep",{data:u}=await Sn.mutate({mutation:Dn("mutation AttendanceCalculate($input:"+t.inputType+"){"+o+"(input:$input){isResults message data{returnCode thongKe{"+c+"} resultSets{columns rows}}}}"),variables:{input:t.input},errorPolicy:"none"}),h=u==null?void 0:u[o],k=oe(h);return{message:(h==null?void 0:h.message)||"Máy chủ đã trả kết quả xử lý.",data:k}}const Gt=`.monthly-page {
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
`,Wt=["aria-busy"],Xt={class:"monthly-heading"},Qt={class:"monthly-actions"},Jt=["disabled"],Zt=["value"],Yt=["disabled"],na=["disabled"],ea=["value"],ta={class:"employee-filter"},aa={key:0,class:"monthly-error",role:"alert"},la={key:1,class:"monthly-error",role:"alert"},oa={key:2,class:"monthly-notice"},ia={key:3,class:"monthly-notice",role:"status"},ra={key:4,class:"monthly-notice"},sa={class:"monthly-sheet"},ua={class:"monthly-tabs",role:"tablist","aria-label":"Bảng chấm công tháng"},ca=["aria-selected"],da=["aria-selected"],ha={key:0,class:"monthly-loading",role:"status"},pa={key:1,class:"monthly-empty"},ma={class:"monthly-error",role:"alert"},ga={id:"monthly-summary-panel",role:"tabpanel","aria-labelledby":"monthly-summary-tab"},ya={class:"monthly-toolbar"},va={class:"monthly-subtitle"},ba={class:"monthly-columns"},fa={class:"monthly-column-options"},xa=["onUpdate:modelValue"],ka={class:"monthly-table-scroll monthly-summary-scroll",role:"region","aria-label":"Bảng tổng hợp công tháng, cuộn ngang và dọc để xem đầy đủ",tabindex:"0"},wa={class:"monthly-summary"},Ca=["onClick"],Na={key:0},Ta=["colspan"],_a={id:"monthly-daily-panel",role:"tabpanel","aria-labelledby":"monthly-daily-tab"},Va={class:"monthly-toolbar"},$a={class:"monthly-subtitle"},Ea={key:0,class:"monthly-empty",role:"status"},La={key:1,class:"monthly-error",role:"alert"},Pa={key:0},Ba={key:0,role:"status"},Sa={key:1,class:"monthly-error",role:"alert"},Da={key:0,class:"monthly-subtitle"},Aa={key:1},Fa=["disabled"],Oa={key:3,"aria-live":"polite"},za={class:"monthly-stats"},Ma={key:0},Ka={style:{overflow:"auto","max-height":"240px"}},Ua={key:0},qa=Tn({__name:"MonthlyAttendancePage",setup(t){const p=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit"}).formatToParts(new Date),o=Yn({thang:Number(p.find(s=>s.type==="month").value),nam:Number(p.find(s=>s.type==="year").value),maBoPhan:null,maNhanVien:null}),c=b({...o}),u=b(!1),h=b(""),k=b("summary"),N=ae(),_=O(()=>N.can("attendance","update")),v=b([]),$=b(""),V=b(!1),T=O(()=>[...new Map(v.value.filter(s=>s.maBoPhan).map(s=>[s.maBoPhan,{code:s.maBoPhan,label:s.tenBoPhan||s.maBoPhan}])).values()].sort((s,e)=>s.label.localeCompare(e.label,"vi"))),P=O(()=>v.value.filter(s=>!o.maBoPhan||s.maBoPhan===o.maBoPhan).map(s=>({...s,label:s.maNhanVien+" · "+sn(s)}))),D=O(()=>v.value.find(s=>s.maNhanVien===c.value.maNhanVien)),H=b([]),w=b([]),C=b(!1),y=b(""),U=b(null),A=b(""),G=b(""),nn=b(""),un=O(()=>H.value.filter(s=>!c.value.maNhanVien||s.maNhanVien===c.value.maNhanVien)),An=Yn(nt.map(s=>({...s}))),gn=O(()=>An.filter(s=>s.visible)),yn=O(()=>String(c.value.thang).padStart(2,"0")+"/"+c.value.nam),M=b(!1),I=b(!1),pn=b(""),_n=b(new Set),Vn=s=>s.nam+"-"+s.thang,Rn=O(()=>_n.value.has(Vn(c.value))),dn=b(!1),g=O(()=>{var s;return _.value&&!M.value&&!I.value&&((s=U.value)==null?void 0:s.trangThai)==="O"}),r=b(!1),m=b(!1),E=b(""),L=b([]),j=b(),X=b({...c.value}),Hn=b(),J=b(null),jn=b(),$n=b(!1),Fn=b(),On=b(!1),ln=b(),hn=b(""),an=b(),Gn=b(""),En=b(!1);let vn=0,zn=0,bn=0,q=!1;const Mn=new Set,ke=s=>JSON.stringify(s);async function ie(){V.value=!0,$.value="";try{const s=await qe.list(null);q||(v.value=s.map(e=>({maNhanVien:e.maNhanVien,ho:e.ho,tenDem:e.tenDem,ten:e.ten,hoTen:e.hoTen,maBoPhan:e.maBoPhan,tenBoPhan:e.tenBoPhan})))}catch(s){q||($.value=on(s))}finally{q||(V.value=!1)}}async function Wn(){const s=++zn;U.value=null,A.value="";try{const e=await le({nam:c.value.nam,thang:c.value.thang,trangThai:null});if(s!==zn||q)return;e.length===1?U.value=e[0]:A.value=e.length?"Có nhiều kỳ cho tháng này.":"Chưa có kỳ chấm công cho tháng này."}catch(e){s===zn&&!q&&(A.value=on(e))}}async function fn(s=!1){const e=++vn,d={...c.value},f=k.value,K=ke(d);if(y.value="",!s&&(f==="summary"?G.value:nn.value)===K){C.value=!1;return}C.value=!0;try{if(f==="summary"){const Z=await ce(d);e===vn&&!q&&(H.value=Z,G.value=K)}else{const Z=await Jn(d);e===vn&&!q&&(w.value=Z,nn.value=K)}}catch(Z){e===vn&&!q&&(y.value=on(Z),f==="summary"?(H.value=[],G.value=""):(w.value=[],nn.value=""))}finally{e===vn&&!q&&(C.value=!1)}}function we(){if(!(M.value||I.value))try{if(In(o),o.maNhanVien&&!P.value.some(s=>s.maNhanVien===o.maNhanVien))throw new Error("Nhân viên không thuộc bộ phận đã chọn.");c.value={...o},h.value="",G.value="",nn.value="",J.value=null,r.value=!1,$n.value=!1,pn.value="",Wn(),fn(!0)}catch(s){y.value=on(s)}}async function Ce(){if(!(u.value||M.value||I.value)){u.value=!0,h.value="";try{const{blob:s,filename:e}=await qt({...c.value});if(q)return;const d=URL.createObjectURL(s),f=document.createElement("a");f.href=d,f.download=e,document.body.append(f);try{f.click()}finally{f.remove(),setTimeout(()=>URL.revokeObjectURL(d),1e3)}}catch(s){q||(h.value=on(s))}finally{q||(u.value=!1)}}}Nn(()=>o.maBoPhan,()=>{o.maNhanVien&&!P.value.some(s=>s.maNhanVien===o.maNhanVien)&&(o.maNhanVien=null)}),Nn(k,()=>{J.value=null,$n.value=!1,fn()});async function Ne(s){const e=++bn;j.value=s,X.value={...c.value,maNhanVien:s.maNhanVien},r.value=!0,m.value=!0,E.value="",L.value=[];try{const d=await Jn({...X.value});e===bn&&!q&&(L.value=d)}catch(d){e===bn&&!q&&(E.value=on(d))}finally{e===bn&&!q&&(m.value=!1)}}Nn(r,s=>{s||++bn});async function Te(){if(!Hn.value||m.value||E.value||!L.value.length)return;const s=document.createElement("iframe");s.title="Bản in phiếu chấm công",s.style.cssText="position:fixed;width:1px;height:1px;left:-10000px;top:0;border:0;",document.body.append(s),Mn.add(s);const e=s.contentDocument,d=s.contentWindow;if(!e||!d){s.remove(),Mn.delete(s);return}e.open(),e.write('<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Phiếu chấm công tháng</title></head><body></body></html>'),e.close();const f=e.createElement("style");f.textContent=Gt,e.head.append(f),e.body.append(e.importNode(Hn.value,!0));const K=()=>{s.remove(),Mn.delete(s)};d.addEventListener("afterprint",K,{once:!0});try{if(await e.fonts.ready,q){K();return}d.focus(),d.print()}catch(Z){pn.value="Không mở được hộp thoại in: "+on(Z),K()}setTimeout(K,6e4)}async function _e(s,e){var Z,Ln;if(!ge(s,g.value).length)return;const d=e.currentTarget instanceof HTMLElement?e.currentTarget.getBoundingClientRect():null,f=e.type==="click"&&e.detail===0&&d?d.left:e.clientX,K=e.type==="click"&&e.detail===0&&d?d.bottom:e.clientY;J.value={row:s,x:Math.max(10,Math.min(f,window.innerWidth-270)),y:Math.max(10,Math.min(K,window.innerHeight-270))},await Ae(),(Ln=(Z=jn.value)==null?void 0:Z.querySelector("button:not(:disabled)"))==null||Ln.focus()}function Ve(s){Fn.value=s,$n.value=!0,J.value=null}function re(s){var e,d;if(s.key==="Escape"&&(J.value=null),J.value&&["ArrowDown","ArrowUp","Home","End"].includes(s.key)){s.preventDefault();const f=Array.from(((e=jn.value)==null?void 0:e.querySelectorAll("button:not(:disabled)"))||[]);if(!f.length)return;const K=f.indexOf(document.activeElement);(d=f[s.key==="Home"?0:s.key==="End"?f.length-1:(K+(s.key==="ArrowDown"?1:f.length-1))%f.length])==null||d.focus()}}function xn(){J.value=null}async function Xn(s,e){if(M.value||I.value||!_.value)return;const d=e?v.value.find(K=>K.maNhanVien===e.maNhanVien)||e:D.value,f={filter:{...c.value},employee:d,day:e};J.value=null,ln.value=void 0,an.value=void 0,dn.value=!1,Gn.value="",En.value=!1,hn.value="",On.value=!0,I.value=!0;try{const K=await Ht(s,f);q||(ln.value=K)}catch(K){q||(hn.value=on(K))}finally{q||(I.value=!1)}}async function $e(){var e,d;if(!ln.value||dn.value||M.value||!En.value||an.value||!_.value)return;const s=ln.value;M.value=!0,hn.value="";try{const f=await jt(s);if(q)return;an.value=f.data,Gn.value=f.message,G.value="",nn.value="",s.kind!=="month"?_n.value.add(Vn(s.context.filter)):!s.context.filter.maNhanVien&&!s.context.filter.maBoPhan&&_n.value.delete(Vn(s.context.filter));const K=Number(((e=f.data.thongKe)==null?void 0:e.soDongBoQuaKhongCapNhat)??((d=f.data.thongKe)==null?void 0:d.soNhanVienBoQuaDaKhoa)??0);pn.value=K>0?"Máy chủ trả kết quả có "+K+" dòng/nhân viên bị bỏ qua. Xem thống kê chi tiết.":f.message,await Promise.allSettled([fn(!0),Wn()])}catch(f){q||(dn.value=!0,hn.value=on(f)+" Kết quả ghi có thể chưa xác định; hãy kiểm tra lại dữ liệu trước khi tính lại.")}finally{q||(M.value=!1)}}async function Ee(){if(!(!ln.value||M.value)){M.value=!0;try{const s=ln.value.context;ln.value.kind==="person"?await Jn({...s.filter,maNhanVien:s.employee.maNhanVien}):await ce(s.filter),await fn(!0),dn.value=!1,hn.value="Đã tải lại dữ liệu. Kiểm tra kết quả trước khi quyết định gửi lại yêu cầu."}catch(s){hn.value=on(s)}finally{M.value=!1}}}return Be(()=>{Promise.allSettled([ie(),Wn(),fn()]),document.addEventListener("click",xn),document.addEventListener("keydown",re),window.addEventListener("resize",xn),window.addEventListener("scroll",xn,!0)}),Se(()=>{q=!0,++vn,++bn,++zn,document.removeEventListener("click",xn),document.removeEventListener("keydown",re),window.removeEventListener("resize",xn),window.removeEventListener("scroll",xn,!0),Mn.forEach(s=>s.remove())}),(s,e)=>(l(),i("section",{class:"monthly-page","aria-busy":M.value},[n("header",Xt,[n("div",null,[e[17]||(e[17]=n("h1",null,"Bảng chấm công tháng",-1)),n("p",null,[B(" Tháng "+a(yn.value),1),U.value?(l(),i(S,{key:0},[B(" · "+a(x(Re)[U.value.trangThai]||U.value.trangThai)+" · "+a(x(Q)(U.value.tuNgay))+" – "+a(x(Q)(U.value.denNgay)),1),U.value.ngayChot?(l(),i(S,{key:0},[B(" · Chốt: "+a(x(Q)(U.value.ngayChot)),1)],64)):F("",!0)],64)):F("",!0)])]),n("div",Qt,[R(Y,{label:"Xuất Excel",icon:"pi pi-file-excel",severity:"success",outlined:"",loading:u.value,disabled:u.value||M.value||I.value,onClick:Ce},null,8,["loading","disabled"]),R(Y,{label:"Chấm công ngày hàng loạt",icon:"pi pi-calendar",severity:"secondary",outlined:"",disabled:!_.value||M.value||I.value,onClick:e[0]||(e[0]=d=>Xn("batch"))},null,8,["disabled"]),R(Y,{label:"Chấm công tháng",icon:"pi pi-calculator",disabled:!_.value||M.value||I.value,onClick:e[1]||(e[1]=d=>Xn("month"))},null,8,["disabled"])])]),n("form",{class:"monthly-filters",onSubmit:Kn(we,["prevent"])},[n("label",null,[e[18]||(e[18]=B("Tháng",-1)),en(n("select",{"onUpdate:modelValue":e[2]||(e[2]=d=>o.thang=d),disabled:M.value||I.value},[(l(),i(S,null,z(12,d=>n("option",{key:d,value:d},"Tháng "+a(d),9,Zt)),64))],8,Jt),[[Bn,o.thang,void 0,{number:!0}]])]),n("label",null,[e[19]||(e[19]=B("Năm",-1)),en(n("input",{"onUpdate:modelValue":e[3]||(e[3]=d=>o.nam=d),type:"number",min:"100",max:"9998",required:"",disabled:M.value||I.value},null,8,Yt),[[ne,o.nam,void 0,{number:!0}]])]),n("label",null,[e[21]||(e[21]=B("Bộ phận",-1)),en(n("select",{"onUpdate:modelValue":e[4]||(e[4]=d=>o.maBoPhan=d),disabled:M.value||I.value||V.value},[e[20]||(e[20]=n("option",{value:null},"Tất cả bộ phận",-1)),(l(!0),i(S,null,z(T.value,d=>(l(),i("option",{key:d.code,value:d.code},a(d.label),9,ea))),128))],8,na),[[Bn,o.maBoPhan]])]),n("label",ta,[e[22]||(e[22]=B("Nhân viên",-1)),R(x(Ue),{modelValue:o.maNhanVien,"onUpdate:modelValue":e[5]||(e[5]=d=>o.maNhanVien=d),options:P.value,"option-label":"label","option-value":"maNhanVien",filter:"","show-clear":"",placeholder:"Tất cả / tìm mã hoặc họ tên",disabled:M.value||I.value||V.value,loading:V.value,"aria-label":"Chọn nhân viên"},null,8,["modelValue","options","disabled","loading"])]),R(Y,{type:"submit",label:"Áp dụng",icon:"pi pi-filter",disabled:M.value||I.value},null,8,["disabled"])],32),h.value?(l(),i("p",aa,a(h.value),1)):F("",!0),$.value?(l(),i("p",la,[B(" Không tải được danh mục: "+a($.value)+" ",1),n("button",{type:"button",onClick:ie},"Thử lại")])):F("",!0),A.value?(l(),i("p",oa,a(A.value),1)):F("",!0),pn.value?(l(),i("p",ia,a(pn.value),1)):F("",!0),Rn.value?(l(),i("p",ra," Dữ liệu công ngày đã được xử lý. Cần chấm công tháng để cập nhật tổng hợp nếu backend không tổng hợp tự động. ")):F("",!0),n("div",sa,[n("div",ua,[n("button",{id:"monthly-summary-tab",type:"button",role:"tab","aria-selected":k.value==="summary","aria-controls":"monthly-summary-panel",onClick:e[6]||(e[6]=d=>k.value="summary")}," Tổng hợp công tháng",8,ca),n("button",{id:"monthly-daily-tab",type:"button",role:"tab","aria-selected":k.value==="daily","aria-controls":"monthly-daily-panel",onClick:e[7]||(e[7]=d=>k.value="daily")}," Chi tiết công tháng ",8,da)]),C.value?(l(),i("div",ha,[(l(),i(S,null,z(4,d=>n("span",{key:d})),64)),e[23]||(e[23]=n("p",null,"Đang tải dữ liệu công tháng…",-1))])):y.value?(l(),i("div",pa,[n("p",ma,a(y.value),1),R(Y,{label:"Thử lại",onClick:e[8]||(e[8]=d=>fn(!0))})])):F("",!0),en(n("section",ga,[n("div",ya,[n("div",null,[n("h2",null,"Tổng hợp tháng "+a(yn.value),1),n("p",va,a(un.value.length)+" nhân viên · Nhấn họ tên để xem và in phiếu ",1)]),n("details",ba,[e[24]||(e[24]=n("summary",null,"Chọn cột hiển thị",-1)),n("div",fa,[(l(!0),i(S,null,z(An,d=>(l(),i("label",{key:d.key},[en(n("input",{"onUpdate:modelValue":f=>d.visible=f,type:"checkbox"},null,8,xa),[[ue,d.visible]]),B(a(d.label),1)]))),128))])])]),n("div",ka,[n("table",wa,[n("colgroup",null,[e[25]||(e[25]=n("col",{class:"summary-code-col"},null,-1)),e[26]||(e[26]=n("col",{class:"summary-name-col"},null,-1)),e[27]||(e[27]=n("col",{class:"summary-dept-col"},null,-1)),(l(!0),i(S,null,z(gn.value,d=>(l(),i("col",{key:d.key,class:"summary-data-col"}))),128))]),n("thead",null,[n("tr",null,[e[28]||(e[28]=n("th",{scope:"col"},"Mã nhân viên",-1)),e[29]||(e[29]=n("th",{scope:"col"},"Họ và tên",-1)),e[30]||(e[30]=n("th",{scope:"col"},"Bộ phận",-1)),(l(!0),i(S,null,z(gn.value,d=>(l(),i("th",{key:d.key,scope:"col"},a(d.label),1))),128))])]),n("tbody",null,[(l(!0),i(S,null,z(un.value,d=>(l(),i("tr",{key:d.maNhanVien},[n("td",null,a(d.maNhanVien),1),n("td",null,[n("button",{type:"button",class:"monthly-name",onClick:f=>Ne(d)},a(x(sn)(d)),9,Ca)]),n("td",null,a(d.tenBoPhan||d.maBoPhan||"—"),1),(l(!0),i(S,null,z(gn.value,f=>(l(),i("td",{key:f.key},a(x(pe)(d[f.key],f.hours)),1))),128))]))),128)),un.value.length?F("",!0):(l(),i("tr",Na,[n("td",{colspan:gn.value.length+3},[...e[31]||(e[31]=[n("div",{class:"monthly-empty"},"Không có dữ liệu công tháng theo bộ lọc.",-1)])],8,Ta)]))])])])],512),[[se,k.value==="summary"&&!C.value&&!y.value]]),en(n("section",_a,[n("div",Va,[n("div",null,[n("h2",null,"Chi tiết công tháng "+a(yn.value),1),n("p",$a," Danh sách nhân viên · Các cột ngày 1–"+a(new Date(c.value.nam,c.value.thang,0).getDate())+" · Ký hiệu công và nghỉ phép ",1)])]),R(Mt,{rows:w.value,employees:v.value,filter:c.value,"allow-actions":g.value,onMenu:_e,onDetail:Ve},null,8,["rows","employees","filter","allow-actions"])],512),[[se,k.value==="daily"&&!C.value&&!y.value]])]),(l(),mn(De,{to:"body"},[J.value&&g.value?(l(),i("div",{key:0,ref_key:"menuElement",ref:jn,class:"monthly-context-menu",role:"menu","aria-label":"Xử lý công ngày",style:Cn({left:J.value.x+"px",top:J.value.y+"px"}),onClick:e[10]||(e[10]=Kn(()=>{},["stop"]))},[n("p",null,a(x(Q)(J.value.row.ngayChamCong))+" · "+a(x(sn)(J.value.row)),1),n("button",{role:"menuitem",type:"button",onClick:e[9]||(e[9]=d=>Xn("person",J.value.row))}," Tính lại công ")],4)):F("",!0)])),R(x(ee),{visible:r.value,"onUpdate:visible":e[12]||(e[12]=d=>r.value=d),modal:"",header:"Phiếu chấm công tháng",style:{width:"1080px",maxWidth:"96vw"}},{footer:cn(()=>[R(Y,{label:"Đóng",severity:"secondary",outlined:"",onClick:e[11]||(e[11]=d=>r.value=!1)}),R(Y,{label:"In phiếu",icon:"pi pi-print",disabled:m.value||!!E.value||!L.value.length,onClick:Te},null,8,["disabled"])]),default:cn(()=>{var d,f,K,Z,Ln;return[m.value?(l(),i("div",Ea,"Đang tải phiếu chấm công…")):E.value?(l(),i("p",La,a(E.value),1)):(l(),i("div",{key:2,ref_key:"reportElement",ref:Hn,class:"monthly-report"},[n("h2",null," PHIẾU CHẤM CÔNG THÁNG "+a(String(X.value.thang).padStart(2,"0"))+"/"+a(X.value.nam),1),n("p",null,[n("strong",null,a(x(sn)(j.value)),1),B(" · "+a((d=j.value)==null?void 0:d.maNhanVien)+" · "+a(((f=j.value)==null?void 0:f.tenBoPhan)||((K=j.value)==null?void 0:K.maBoPhan)||"—"),1)]),n("p",null," Kỳ công: "+a(x(Q)((Z=L.value[0])==null?void 0:Z.tuNgay))+" – "+a(x(Q)((Ln=L.value[0])==null?void 0:Ln.denNgay)),1),L.value.length?F("",!0):(l(),i("p",Pa,"Chưa có dữ liệu chấm công.")),R(wt,{rows:L.value,year:X.value.nam,month:X.value.thang,readonly:""},null,8,["rows","year","month"])],512))]}),_:1},8,["visible"]),R(x(ee),{visible:On.value,"onUpdate:visible":e[15]||(e[15]=d=>On.value=d),modal:"",header:"Xác nhận tính công",closable:!M.value&&!I.value,"close-on-escape":!M.value&&!I.value,style:{width:"640px",maxWidth:"96vw"}},{footer:cn(()=>[R(Y,{label:"Đóng",severity:"secondary",outlined:"",disabled:M.value||I.value,onClick:e[14]||(e[14]=d=>On.value=!1)},null,8,["disabled"]),dn.value?(l(),mn(Y,{key:0,label:"Kiểm tra lại dữ liệu",loading:M.value,onClick:Ee},null,8,["loading"])):F("",!0),an.value?F("",!0):(l(),mn(Y,{key:1,label:"Thực hiện tính công",icon:"pi pi-calculator",loading:M.value,disabled:dn.value||!ln.value||!En.value||I.value||M.value||!_.value,onClick:$e},null,8,["loading","disabled"]))]),default:cn(()=>{var d;return[I.value?(l(),i("p",Ba,"Đang kiểm tra kỳ và phạm vi tính công…")):F("",!0),hn.value?(l(),i("p",Sa,a(hn.value),1)):F("",!0),ln.value?(l(),i(S,{key:2},[n("ul",null,[(l(!0),i(S,null,z(ln.value.scope,f=>(l(),i("li",{key:f},a(f),1))),128))]),an.value?F("",!0):(l(),i("p",Da," Chỉ cập nhật phạm vi trên. Các dòng bị khóa có thể bị bỏ qua theo kết quả máy chủ. ")),an.value?F("",!0):(l(),i("label",Aa,[en(n("input",{"onUpdate:modelValue":e[13]||(e[13]=f=>En.value=f),type:"checkbox",disabled:M.value},null,8,Fa),[[ue,En.value]]),e[32]||(e[32]=B(" Tôi xác nhận phạm vi tính công.",-1))]))],64)):F("",!0),an.value?(l(),i("section",Oa,[e[34]||(e[34]=n("h3",null,"Kết quả máy chủ",-1)),n("p",null,a(Gn.value),1),n("p",null,"Mã trả về: "+a(an.value.returnCode??"—"),1),n("dl",za,[(l(!0),i(S,null,z(an.value.thongKe||{},(f,K)=>(l(),i("div",{key:K},[n("dt",null,a(x(et)[String(K)]||K),1),n("dd",null,a(f??"—"),1)]))),128))]),(d=an.value.resultSets)!=null&&d.length?(l(),i("details",Ma,[e[33]||(e[33]=n("summary",null,"Kết quả chi tiết",-1)),n("pre",Ka,a(JSON.stringify(an.value.resultSets,null,2)),1)])):F("",!0)])):F("",!0)]}),_:1},8,["visible","closable","close-on-escape"]),R(x(Ke),{visible:$n.value,"onUpdate:visible":e[16]||(e[16]=d=>$n.value=d),position:"right",header:"Chi tiết công ngày",style:{width:"400px",maxWidth:"95vw"}},{default:cn(()=>[Fn.value?(l(),i("p",Ua,a(x(sn)(Fn.value))+" · "+a(x(Q)(Fn.value.ngayChamCong)),1)):F("",!0),e[35]||(e[35]=n("p",{class:"monthly-notice"},"Nội dung chi tiết công ngày sẽ được phát triển sau.",-1))]),_:1},8,["visible"])],8,Wt))}}),Ia={class:"attendance-reports"},Ra={class:"report-tabs",role:"tablist","aria-label":"Loại báo cáo chấm công"},Ha=["id","tabindex","aria-selected","onClick","onKeydown"],ja={class:"report-tab-icon"},Ga={class:"report-tab-number"},Wa={class:"report-filter-actions"},Xa={class:"report-period-note"},Qa={key:0,class:"report-error",role:"alert"},Ja={class:"report-metrics"},Za=["aria-labelledby"],Ya={class:"report-panel-heading"},nl={class:"report-table-tools"},el={class:"report-search"},tl=["value"],al={key:0,class:"report-feedback",role:"status"},ll={class:"report-pagination"},ol=["disabled"],il={class:"report-page-current"},rl=["disabled"],sl={class:"report-sheet-footer"},ul={key:1,class:"report-legend"},cl={key:2,class:"report-explanation"},dl={key:3,class:"report-explanation"},hl={key:0,class:"report-detail"},pl={class:"report-detail-person"},ml={class:"report-detail-values"},gl={class:"report-detail-caption"},yl={class:"report-detail-scroll"},vl={class:"report-detail-table"},bl=Tn({__name:"AttendanceReportsPage",setup(t){const p=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit"}).formatToParts(new Date),o=p.find(g=>g.type==="year").value+"-"+p.find(g=>g.type==="month").value,c=Yn({period:o,department:""}),u=b({...c}),h=b("monthly"),k=b(""),N=b(""),_=b(1),v=b(20),$=b({key:"",direction:1}),V=b(null),T=b(!1),P=b(""),D=b(""),H=O(()=>We(h.value,u.value.period)),w=O(()=>kn.find(g=>g.key===h.value)),C=O(()=>u.value.period.split("-").reverse().join("/")),y=O(()=>({monthly:[{value:"issues",label:"Có bất thường"}],late:[{value:"late",label:"Đi muộn"},{value:"early",label:"Về sớm"}],overtime:[{value:"pendingOt",label:"Có giờ chờ duyệt"},{value:"approved",label:"Đã duyệt toàn bộ"}],anomaly:[{value:"Chờ xử lý",label:"Chờ xử lý"},{value:"Đã giải trình",label:"Đã giải trình"}],payroll:[{value:"Cần đối soát",label:"Cần đối soát"},{value:"Đã đối soát",label:"Đã đối soát"}]})[h.value]),U=g=>g.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/gi,"d").toLocaleLowerCase("vi"),A=O(()=>H.value.rows.filter(g=>u.value.department&&g.department!==u.value.department||k.value&&!U(g.name+" "+g.code).includes(U(k.value.trim()))?!1:N.value?["issues","late","early","pendingOt"].includes(N.value)?Number(g[N.value])>0:N.value==="approved"?g.pendingOt===0:g.status===N.value:!0)),G=O(()=>[...A.value].sort((g,r)=>{if(!$.value.key)return 0;const m=g[$.value.key],E=r[$.value.key];return(typeof m=="number"&&typeof E=="number"?m-E:String(m).localeCompare(String(E),"vi"))*$.value.direction})),nn=O(()=>Math.max(1,Math.ceil(G.value.length/v.value))),un=O(()=>(_.value-1)*v.value),An=O(()=>G.value.slice(un.value,un.value+v.value)),gn=O(()=>{const g=A.value,r=L=>Qn(g.reduce((j,X)=>j+Number(X[L]||0),0)),m=new Set(g.map(L=>L.code)).size;return{monthly:[["Nhân viên",String(m),"pi-users","Theo phạm vi báo cáo"],["Công thực tế",r("work"),"pi-calendar-plus","Ngày công đã xác minh"],["Giờ tăng ca",r("ot"),"pi-moon","Tổng OT trong tháng"],["Bất thường",r("issues"),"pi-exclamation-triangle","Dòng cần kiểm tra"]],late:[["Lượt vi phạm",String(g.length),"pi-clock",`${m} nhân viên có phát sinh`],["Đi muộn",r("late"),"pi-sign-in","Tổng số phút"],["Về sớm",r("early"),"pi-sign-out","Tổng số phút"],["Bình quân / lượt",g.length?Qn(g.reduce((L,j)=>L+Number(j.late)+Number(j.early),0)/g.length):"0","pi-chart-bar","Phút chênh lệch"]],overtime:[["Nhân viên có OT",String(m),"pi-users","Có phát sinh trong tháng"],["Tổng giờ tăng ca",r("ot"),"pi-moon","Ngày thường + ngày nghỉ"],["Đã phê duyệt",r("approvedOt"),"pi-check-circle","Giờ OT đã duyệt"],["Chờ phê duyệt",r("pendingOt"),"pi-hourglass","Giờ OT cần xác nhận"]],anomaly:[["Bản ghi bất thường",String(g.length),"pi-exclamation-triangle",`${m} nhân viên liên quan`],["Thiếu giờ vào",String(g.filter(L=>L.anomaly==="Thiếu giờ vào").length),"pi-sign-in","Chưa có log vào"],["Thiếu giờ ra",String(g.filter(L=>L.anomaly==="Thiếu giờ ra").length),"pi-sign-out","Chưa có log ra"],["Chờ xử lý",String(g.filter(L=>L.status==="Chờ xử lý").length),"pi-hourglass","Cần bổ sung / giải trình"]],payroll:[["Công hưởng lương",r("paid"),"pi-wallet","Công thực tế + phép có lương"],["Phép đã sử dụng",r("usedLeave"),"pi-calendar-minus","Ngày phép trong kỳ"],["Quỹ phép còn lại",r("closingLeave"),"pi-calendar","Tổng ngày phép cuối kỳ"],["Cần đối soát",String(g.filter(L=>L.status==="Cần đối soát").length),"pi-exclamation-circle","Nhân viên còn log bất thường"]]}[h.value]}),yn=O(()=>H.value.records.filter(g=>{var r,m;return g.code===((r=V.value)==null?void 0:r.code)&&(!((m=V.value)!=null&&m.date)||g.date.split("-").reverse().join("/")===V.value.date)})),M=O(()=>H.value.columns.filter(g=>!["code","name","department"].includes(g.key)&&!/^d\d+$/.test(g.key)));function I(){if(!Xe(c.period).length){P.value="Vui lòng chọn tháng từ năm 2000 đến 2100.";return}u.value={...c},P.value="",D.value=""}function pn(){Object.assign(c,{period:o,department:""}),k.value="",N.value="",$.value={key:"",direction:1},I()}function _n(g){$.value={key:g,direction:$.value.key===g?-$.value.direction:1}}function Vn(g){V.value=g,T.value=!0}function Rn(g,r){var L;const m=g.key==="ArrowRight"?1:g.key==="ArrowLeft"?-1:0;if(!m&&g.key!=="Home"&&g.key!=="End")return;g.preventDefault();const E=g.key==="Home"?0:g.key==="End"?kn.length-1:(r+m+kn.length)%kn.length;h.value=kn[E].key,(L=document.getElementById(`report-tab-${h.value}`))==null||L.focus()}function dn(){const g=j=>{let X=String(j??"");return/^[=+@\-\t\r]/.test(X)&&(X="'"+X),'"'+X.replaceAll('"','""')+'"'},r=H.value.columns,m="\uFEFF"+[r.map(j=>j.label),...G.value.map(j=>r.map(X=>j[X.key]))].map(j=>j.map(g).join(",")).join(`\r
`),E=URL.createObjectURL(new Blob([m],{type:"text/csv;charset=utf-8;"})),L=document.createElement("a");L.href=E,L.download=`BaoCao_${h.value}_${u.value.period}_mau.csv`,document.body.append(L),L.click(),L.remove(),setTimeout(()=>URL.revokeObjectURL(E),1e3),D.value=`Đã xuất ${G.value.length} bản ghi minh họa ra CSV.`}return Nn([h,u,k,N,v],()=>{_.value=1,T.value=!1}),Nn(h,()=>{N.value="",$.value={key:"",direction:1},D.value=""}),Nn(nn,g=>{_.value>g&&(_.value=g)}),(g,r)=>(l(),i("section",Ia,[r[33]||(r[33]=n("header",{class:"reports-heading"},[n("div",null,[n("div",{class:"reports-eyebrow"},[n("span"),B(" ATTENDANCE REPORTS")]),n("h1",null,"Báo cáo chấm công"),n("p",null,"Theo dõi ngày công, kiểm soát biến động và đối soát dữ liệu tính lương.")]),n("span",{class:"reports-prototype"},[n("i",{class:"pi pi-sparkles"}),B(" Prototype · Dữ liệu minh họa")])],-1)),n("div",Ra,[(l(!0),i(S,null,z(x(kn),(m,E)=>(l(),i("button",{id:`report-tab-${m.key}`,key:m.key,type:"button",role:"tab",tabindex:h.value===m.key?0:-1,"aria-selected":h.value===m.key,"aria-controls":"report-panel",class:rn({active:h.value===m.key}),onClick:L=>h.value=m.key,onKeydown:L=>Rn(L,E)},[n("span",ja,[n("i",{class:rn(["pi",m.icon])},null,2)]),n("span",null,[n("strong",null,a(m.title),1),n("small",null,a(m.subtitle),1)]),n("span",Ga,"0"+a(E+1),1)],42,Ha))),128))]),n("form",{class:"report-filters",onSubmit:Kn(I,["prevent"])},[n("label",null,[r[9]||(r[9]=n("span",null,[B("Kỳ báo cáo "),n("b",null,"*")],-1)),en(n("input",{"onUpdate:modelValue":r[0]||(r[0]=m=>c.period=m),type:"month",min:"2000-01",max:"2100-12",required:""},null,512),[[ne,c.period]])]),n("label",null,[r[11]||(r[11]=n("span",null,"Bộ phận",-1)),en(n("select",{"onUpdate:modelValue":r[1]||(r[1]=m=>c.department=m)},[r[10]||(r[10]=n("option",{value:""},"Tất cả bộ phận",-1)),(l(!0),i(S,null,z(x(je),m=>(l(),i("option",{key:m},a(m),1))),128))],512),[[Bn,c.department]])]),n("div",Wa,[R(Y,{type:"submit",label:"Xem báo cáo",icon:"pi pi-filter"}),n("button",{class:"report-reset",type:"button",title:"Đặt lại bộ lọc",onClick:pn},[...r[12]||(r[12]=[n("i",{class:"pi pi-refresh"},null,-1),n("span",null,"Đặt lại",-1)])])]),n("div",Xa,[r[14]||(r[14]=n("i",{class:"pi pi-calendar"},null,-1)),n("span",null,[r[13]||(r[13]=B("Kỳ đang xem",-1)),n("strong",null,"Tháng "+a(C.value),1)])])],32),P.value?(l(),i("p",Qa,a(P.value),1)):F("",!0),n("div",Ja,[(l(!0),i(S,null,z(gn.value,(m,E)=>(l(),i("article",{key:m[0],class:rn("report-metric-"+E)},[n("div",null,[n("span",null,a(m[0]),1),n("strong",null,a(m[1]),1),n("small",null,a(m[3]),1)]),n("i",{class:rn(["pi",m[2]])},null,2)],2))),128))]),n("section",{id:"report-panel",class:"report-panel",role:"tabpanel","aria-labelledby":`report-tab-${h.value}`},[n("div",Ya,[n("div",null,[r[17]||(r[17]=n("span",{class:"report-sheet-label"},[n("i",{class:"pi pi-file-excel"}),B(" BẢNG DỮ LIỆU")],-1)),n("h2",null,[B(a(w.value.title)+" ",1),n("span",null,"/ "+a(C.value),1)]),n("p",null,[B(a(u.value.department||"Tất cả bộ phận"),1),r[15]||(r[15]=n("span",null,"·",-1)),B(a(new Set(A.value.map(m=>m.code)).size)+" nhân viên",1),r[16]||(r[16]=n("span",null,"·",-1)),B(a(A.value.length)+" bản ghi ",1)])]),R(Y,{label:"Xuất CSV mẫu",icon:"pi pi-download",severity:"secondary",outlined:"",disabled:!A.value.length,onClick:dn},null,8,["disabled"])]),n("div",nl,[n("label",el,[r[18]||(r[18]=n("i",{class:"pi pi-search"},null,-1)),en(n("input",{"onUpdate:modelValue":r[2]||(r[2]=m=>k.value=m),type:"search",placeholder:"Tìm mã hoặc tên nhân viên…","aria-label":"Tìm nhân viên"},null,512),[[ne,k.value]])]),en(n("select",{"onUpdate:modelValue":r[3]||(r[3]=m=>N.value=m),"aria-label":"Lọc trạng thái báo cáo"},[r[19]||(r[19]=n("option",{value:""},"Tất cả trạng thái",-1)),(l(!0),i(S,null,z(y.value,m=>(l(),i("option",{key:m.value,value:m.value},a(m.label),9,tl))),128))],512),[[Bn,N.value]]),r[20]||(r[20]=n("span",{class:"report-freeze-note"},[n("i",{class:"pi pi-lock"}),B(" Cố định 2 cột nhân viên")],-1))]),D.value?(l(),i("p",al,[r[21]||(r[21]=n("i",{class:"pi pi-check-circle"},null,-1)),B(" "+a(D.value),1)])):F("",!0),R(Ge,{columns:H.value.columns,rows:An.value,"all-rows":A.value,offset:un.value,"sort-key":$.value.key,"sort-direction":$.value.direction,onSort:_n,onOpen:Vn},null,8,["columns","rows","all-rows","offset","sort-key","sort-direction"]),n("div",ll,[n("span",null,[r[22]||(r[22]=B("Hiển thị ",-1)),n("strong",null,a(A.value.length?un.value+1:0)+"–"+a(Math.min(un.value+v.value,A.value.length)),1),B(" / "+a(A.value.length)+" bản ghi",1)]),n("div",null,[n("label",null,[r[24]||(r[24]=B("Số dòng ",-1)),en(n("select",{"onUpdate:modelValue":r[4]||(r[4]=m=>v.value=m)},[...r[23]||(r[23]=[n("option",{value:10},"10",-1),n("option",{value:20},"20",-1),n("option",{value:50},"50",-1),n("option",{value:100},"100",-1)])],512),[[Bn,v.value,void 0,{number:!0}]])]),n("button",{type:"button","aria-label":"Trang trước",disabled:_.value===1,onClick:r[5]||(r[5]=m=>_.value--)},[...r[25]||(r[25]=[n("i",{class:"pi pi-chevron-left"},null,-1)])],8,ol),n("span",il,a(_.value),1),n("span",null,"/ "+a(nn.value),1),n("button",{type:"button","aria-label":"Trang sau",disabled:_.value>=nn.value,onClick:r[6]||(r[6]=m=>_.value++)},[...r[26]||(r[26]=[n("i",{class:"pi pi-chevron-right"},null,-1)])],8,rl)])]),n("div",sl,[n("span",null,[r[27]||(r[27]=n("i",{class:"pi pi-check-circle"},null,-1)),B(" "+a(w.value.subtitle),1)]),r[28]||(r[28]=n("span",null,"Σ Tổng cộng tính trên toàn bộ kết quả đã lọc",-1))])],8,Za),h.value==="monthly"?(l(),i("div",ul,[r[29]||(r[29]=n("strong",null,"Ký hiệu công",-1)),(l(),i(S,null,z([["X","Đủ công","work"],["M","Đi muộn","warn"],["S","Về sớm","warn"],["P","Phép năm","leave"],["OFF","Ngày nghỉ","off"],["V","Vắng không lương","danger"],["?","Thiếu / lỗi log","danger"]],([m,E,L])=>n("span",{key:m},[n("b",{class:rn("cell-"+L)},a(m),3),B(a(E),1)])),64))])):F("",!0),h.value==="overtime"?(l(),i("p",cl,[...r[30]||(r[30]=[n("i",{class:"pi pi-info-circle"},null,-1),B(" OT đêm là phần nằm trong tổng OT; không cộng thêm lần nữa. ",-1)])])):F("",!0),h.value==="payroll"?(l(),i("p",dl,[...r[31]||(r[31]=[n("i",{class:"pi pi-info-circle"},null,-1),B(" Mô phỏng: công hưởng lương = công thực tế + phép có lương. Phép còn lại = đầu kỳ + phát sinh − đã dùng. Công chưa xác minh được tách riêng để đối soát. ",-1)])])):F("",!0),r[34]||(r[34]=n("p",{class:"report-demo-note"},"Dữ liệu mẫu phục vụ duyệt giao diện · Chưa kết nối API báo cáo.",-1)),R(x(ee),{visible:T.value,"onUpdate:visible":r[8]||(r[8]=m=>T.value=m),modal:"",header:"Chi tiết chấm công",style:{width:"780px",maxWidth:"95vw"}},{footer:cn(()=>[R(Y,{label:"Đóng",severity:"secondary",outlined:"",onClick:r[7]||(r[7]=m=>T.value=!1)})]),default:cn(()=>{var m;return[V.value?(l(),i("div",hl,[n("div",pl,[n("span",null,a((m=V.value.name.split(" ").at(-1))==null?void 0:m.slice(0,1)),1),n("div",null,[n("h3",null,a(V.value.name),1),n("p",null,a(V.value.code)+" · "+a(V.value.department),1)]),n("b",null,a(C.value),1)]),n("dl",ml,[(l(!0),i(S,null,z(M.value,E=>(l(),i("div",{key:E.key},[n("dt",null,a(E.label),1),n("dd",null,a(V.value[E.key]),1)]))),128))]),n("p",gl," Dữ liệu quẹt thẻ minh họa · "+a(yn.value.length)+" ngày ",1),n("div",yl,[n("table",vl,[r[32]||(r[32]=n("thead",null,[n("tr",null,[n("th",null,"Ngày"),n("th",null,"Ca"),n("th",null,"Giờ vào"),n("th",null,"Giờ ra"),n("th",null,"Ký hiệu"),n("th",null,"OT (giờ)"),n("th",null,"Ghi chú")])],-1)),n("tbody",null,[(l(!0),i(S,null,z(yn.value,E=>(l(),i("tr",{key:E.date},[n("td",null,a(E.date.split("-").reverse().join("/")),1),n("td",null,a(E.shift),1),n("td",null,a(E.checkIn),1),n("td",null,a(E.checkOut),1),n("td",null,a(E.symbol),1),n("td",null,a(x(Qn)(E.ot)),1),n("td",null,a(E.anomaly||"—"),1)]))),128))])])])])):F("",!0)]}),_:1},8,["visible"])]))}}),fl={class:"attendance-workspace"},xl={"aria-label":"Đường dẫn"},kl={class:"workspace-empty"},wl=Tn({__name:"AttendanceWorkspaceView",setup(t){const p=Oe(),o=O(()=>ze.find(c=>c.path===p.path));return(c,u)=>{var k,N,_,v;const h=Fe("RouterLink");return l(),i("section",fl,[n("nav",xl,[R(h,{to:"/attendance/overview"},{default:cn(()=>[...u[0]||(u[0]=[B("Chấm công",-1)])]),_:1}),n("span",null," / "+a((k=o.value)==null?void 0:k.label),1)]),x(p).meta.attendancePage==="daily"?(l(),mn(Je,{key:0})):x(p).meta.attendancePage==="monthly"?(l(),mn(qa,{key:1})):x(p).meta.attendancePage==="reports"?(l(),mn(bl,{key:2})):(l(),i(S,{key:3},[n("h1",null,a((N=o.value)==null?void 0:N.label),1),n("div",kl,[n("i",{class:rn(["pi",(_=o.value)==null?void 0:_.icon])},null,2),n("h2",null,"Chưa có dữ liệu "+a((v=o.value)==null?void 0:v.label.toLocaleLowerCase()),1),u[2]||(u[2]=n("p",null," Chức năng đã được tách riêng trong module Chấm công. Chưa kết nối nguồn dữ liệu cho màn hình này. ",-1)),R(h,{to:"/attendance/overview"},{default:cn(()=>[...u[1]||(u[1]=[B("← Về tổng quan chấm công",-1)])]),_:1})])],64))])}}}),oo=Qe(wl,[["__scopeId","data-v-75378769"]]);export{oo as default};
