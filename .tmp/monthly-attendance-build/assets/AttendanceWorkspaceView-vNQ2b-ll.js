import{d as Tn,o as l,x as dn,c as s,b as n,F as T,v as B,t as h,n as wn,G as mn,f as y,w as Rn,g as V,e as M,i as F,r as v,am as Nn,an as Cn,p as jn,N as Yn,y as In,C as Ce,I as Te,h as O,_ as J,z as nn,E as ne,A as _e,R as ee,ao as te,ap as Ve,s as en,K as ae,L as X,O as Ee,q as Be,k as De}from"./index-DX1hp8QT.js";import{a as Pe}from"./attendance-CYkncW1q.js";import{M as Le}from"./ModuleListView-CruaQtoq.js";import{s as Se}from"./index-W0yPZLm2.js";import{s as Ae}from"./index-BCHhRYRc.js";import{e as Fe}from"./employee.service-B9bY6bgj.js";import{l as Gn,e as $e,p as ze}from"./period.types-DbSe23GS.js";import{_ as Me}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./index-XMkMs9cU.js";import"./index-CPdVknhi.js";import"./index-DwNmtqIn.js";import"./index-CE78KwOo.js";import"./AppDrawer.vue_vue_type_script_setup_true_lang-DGlomwLV.js";import"./ContractInspector.vue_vue_type_script_setup_true_lang-HlMx1mqj.js";import"./ContractCreateView-DM6uxQk_.js";import"./AppLoading.vue_vue_type_script_setup_true_lang-B19MvpeA.js";import"./AppErrorState.vue_vue_type_script_setup_true_lang-YncIxpfc.js";import"./AppStatusBadge.vue_vue_type_script_setup_true_lang-Cad-GJW6.js";import"./ContractForm-Dkgru3-m.js";import"./recruitment.service-QJ97lxeU.js";import"./employee.documents-CjSvDzSN.js";import"./useContractPermission-ChD8Mwy3.js";import"./index-DH-ShLV2.js";import"./useToast-DJvabmDp.js";import"./useConfirm-e4pB9y-5.js";import"./record.service-Cye428qt.js";import"./modules-CJV0O-xn.js";import"./currency-Bi9uwIDW.js";import"./AppDataTable.vue_vue_type_script_setup_true_lang-CAZnUDlX.js";import"./AppEmptyState.vue_vue_type_script_setup_true_lang-BJUUKqjV.js";import"./AppForm.vue_vue_type_script_setup_true_lang-DROd3Dk7.js";import"./AppKpiCard-Qnj_unjW.js";import"./useRecords-BRygb3Ww.js";import"./export-BblXOGSb.js";import"./employee.type-Davme-ST.js";const Ke=Tn({__name:"AttendanceListView",setup(t){return(u,a)=>(l(),dn(Le,{module:"attendance"}))}}),Pn={NORMAL:{label:"Đủ ca",bg:"#ECFDF5",text:"#065F46",border:"#A7F3D0",abnormal:!1},LEAVE_VACATION:{label:"Nghỉ lễ",bg:"#EFF6FF",text:"#1E40AF",border:"#BFDBFE",abnormal:!1},LEAVE_NORMAL:{label:"Nghỉ phép",bg:"#F5F3FF",text:"#5B21B6",border:"#DDD6FE",abnormal:!1},WORK_IN_VACATION:{label:"Làm việc trong lễ",bg:"#ECFEFF",text:"#155E75",border:"#A5F3FC",abnormal:!1},HALF_WORK:{label:"Nửa công",bg:"#FFFBEB",text:"#92400E",border:"#FDE68A",abnormal:!1},LEAVE_ABNORMAL:{label:"Nghỉ bất thường",bg:"#FFF1F2",text:"#9F1239",border:"#FECDD3",abnormal:!0},ATTENDANCE_ABNORMAL:{label:"Công bất thường",bg:"#FEF2F2",text:"#991B1B",border:"#FECACA",abnormal:!0},CHECK_YOUR_LOG_WORK:{label:"Cần kiểm tra log công",bg:"#FFF7ED",text:"#9A3412",border:"#FED7AA",abnormal:!0}},qe={label:"Chưa có dữ liệu",bg:"#F8FAFC",text:"#475569",border:"#E2E8F0",abnormal:!1},q=t=>t?Pn[t.trangThaiCong||""]||Pn.ATTENDANCE_ABNORMAL:qe,G=t=>t?[t.ho,t.tenDem,t.ten].filter(Boolean).join(" ").trim()||t.hoTen||t.maNhanVien:"";function R(t){const u=t.slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(u)||!Number.isFinite(Date.parse(u+"T12:00:00Z"))||new Date(u+"T12:00:00Z").toISOString().slice(0,10)!==u)throw new Error("Ngày chấm công không hợp lệ: "+t);return u}const I=t=>t?R(t).split("-").reverse().join("/"):"—";function ie(t,u){const a=new Date(Date.UTC(t,u-1,1));a.setUTCFullYear(t);const c=(a.getUTCDay()+6)%7,i=new Date(a);return i.setUTCMonth(i.getUTCMonth()+1),i.setUTCDate(0),Array.from({length:Math.ceil((c+i.getUTCDate())/7)*7},(d,x)=>{const k=x-c+1;return k<1||k>i.getUTCDate()?null:String(t).padStart(4,"0")+"-"+String(u).padStart(2,"0")+"-"+String(k).padStart(2,"0")})}function Oe(t,u){const a=new Map;for(const c of t){const i=R(c.ngayChamCong);if(a.has(i))throw new Error("Có nhiều bản ghi công cùng ngày "+I(i)+".");a.set(i,c)}return a}const re=(t,u=!1)=>typeof t=="number"&&Number.isFinite(t)?new Intl.NumberFormat("vi-VN",{maximumFractionDigits:2}).format(u?t/60:t):"—",Ie=[{key:"soNgayCoCong",label:"Ngày có công",visible:!0},{key:"tongSoPhutLamViecThucTe",label:"Giờ làm thực tế",visible:!0,hours:!0},{key:"tongCongHopLe",label:"Công hợp lệ",visible:!0},{key:"tongNgayNghiCoLuong",label:"Nghỉ có lương",visible:!0},{key:"tongNgayNghiKhongLuong",label:"Nghỉ không lương",visible:!0},{key:"tongCongHuongLuong",label:"Công hưởng lương",visible:!0},{key:"soNgayCoDuLieuCong",label:"Ngày có dữ liệu",visible:!1},{key:"soNgayDuLog",label:"Ngày đủ log",visible:!1},{key:"soNgayKhongLog",label:"Ngày không log",visible:!1},{key:"soNgayDiTre",label:"Ngày đi trễ",visible:!1},{key:"tongSoPhutDiTre",label:"Phút đi trễ",visible:!1},{key:"soNgayVeSom",label:"Ngày về sớm",visible:!1},{key:"tongSoPhutVeSom",label:"Phút về sớm",visible:!1},{key:"tongSoPhutTangCa",label:"Giờ tăng ca",visible:!1,hours:!0},{key:"soNgayQuaDem",label:"Ngày qua đêm",visible:!1},{key:"tongNgayNghi",label:"Tổng ngày nghỉ",visible:!1}],He={tongDongTinh:"Tổng dòng tính",soDongThemMoi:"Thêm mới",soDongCapNhat:"Cập nhật",soDongThieuLog:"Thiếu log",soDongNgayLe:"Ngày lễ",soDongNghiPhep:"Nghỉ phép",soDongBoQuaKhongCapNhat:"Bỏ qua / không cập nhật",soNhanVienThemMoi:"Nhân viên thêm mới",soNhanVienCapNhat:"Nhân viên cập nhật",soNhanVienBoQuaDaKhoa:"Bỏ qua do khóa",thang:"Tháng",nam:"Năm",kyChamCongId:"Kỳ công"},kn=(t,u)=>JSON.stringify([t,R(u)]);function se(t,u){const a=new Map;for(const c of t){if(u&&c.maNhanVien!==u)throw new Error("API trả dữ liệu của nhân viên khác.");const i=kn(c.maNhanVien,c.ngayChamCong);if(a.has(i))throw new Error("Có nhiều bản ghi công của nhân viên "+c.maNhanVien+" trong ngày "+I(c.ngayChamCong)+".");a.set(i,c)}return a}function Ue(t,u,a){const c=new Map;for(const i of[...t,...u]){if(a.maBoPhan&&i.maBoPhan!==a.maBoPhan||a.maNhanVien&&i.maNhanVien!==a.maNhanVien)continue;const d=c.get(i.maNhanVien);c.set(i.maNhanVien,{...d,...i,ho:i.ho??(d==null?void 0:d.ho),tenDem:i.tenDem??(d==null?void 0:d.tenDem),ten:i.ten??(d==null?void 0:d.ten),hoTen:i.hoTen??(d==null?void 0:d.hoTen),tenBoPhan:i.tenBoPhan??(d==null?void 0:d.tenBoPhan)})}return[...c.values()].sort((i,d)=>G(i).localeCompare(G(d),"vi")||i.maNhanVien.localeCompare(d.maNhanVien))}function ce(t,u){return t&&q(t).abnormal&&u?["recalculate"]:[]}const ue=(t,u)=>ie(t,u).filter(a=>!!a),hn=[{key:"ngayNghiPhep",label:"Nghỉ phép"},{key:"ngayNghiHuongLuong",label:"Nghỉ hưởng lương"},{key:"nghiLe",label:"Nghỉ lễ"},{key:"ngayNghiKhongHuongLuong",label:"Nghỉ không hưởng lương"},{key:"otNgayLe",label:"OT ngày lễ"},{key:"otNgayThuong",label:"OT ngày thường"}];function Re(t,u){const a=new Set(ue(u.nam,u.thang)),c=new Map;for(const i of t){if(!a.has(R(i.ngayChamCong)))continue;let d=c.get(i.maNhanVien);d||(d={ngayNghiPhep:0,ngayNghiHuongLuong:0,nghiLe:0,ngayNghiKhongHuongLuong:0,otNgayLe:0,otNgayThuong:0},c.set(i.maNhanVien,d));for(const{key:x}of hn){const k=i[x];typeof k=="number"&&Number.isFinite(k)&&(d[x]+=k)}}return c}const We={class:"attendance-calendar"},je={class:"monthly-table-scroll"},Ge={class:"month-grid","aria-label":"Lịch chấm công tháng"},Qe=["onContextmenu"],Je={class:"day-top"},Xe=["datetime"],Ze=["aria-label","onClick"],Ye=["aria-label","onClick"],nt={key:1,class:"day-body"},et={key:0,class:"outside-days"},tt={class:"outside-grid"},at=["onContextmenu"],ot={class:"day-top"},lt=["datetime"],it=["aria-label","onClick"],rt=["onClick"],st={key:1,class:"day-body"},ct={class:"monthly-legend","aria-label":"Chú giải trạng thái"},ut=Tn({__name:"AttendanceCalendar",props:{rows:{},year:{},month:{},readonly:{type:Boolean,default:!1}},emits:["menu","detail"],setup(t,{emit:u}){const a=t,c=u,i=F(()=>Oe(a.rows)),d=F(()=>ie(a.year,a.month)),x=F(()=>Array.from({length:d.value.length/7},(_,w)=>d.value.slice(w*7,w*7+7))),k=F(()=>String(a.year).padStart(4,"0")+"-"+String(a.month).padStart(2,"0")),L=F(()=>a.rows.filter(_=>!R(_.ngayChamCong).startsWith(k.value)).sort((_,w)=>_.ngayChamCong.localeCompare(w.ngayChamCong)));function b(_,w){a.readonly||!_||!q(_).abnormal||(w.preventDefault(),c("menu",_,w))}function A(_){!a.readonly&&_&&!q(_).abnormal&&c("detail",_)}function D(_){const w=q(_);return{background:w.bg,color:w.text,borderColor:w.border}}return(_,w)=>(l(),s("div",We,[n("div",je,[n("table",Ge,[n("thead",null,[n("tr",null,[(l(),s(T,null,B(["Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy","Chủ nhật"],N=>n("th",{key:N,scope:"col"},h(N),1)),64))])]),n("tbody",null,[(l(!0),s(T,null,B(x.value,(N,$)=>(l(),s("tr",{key:$},[(l(!0),s(T,null,B(N,(g,p)=>{var m,K;return l(),s("td",{key:g||p,class:wn({"empty-calendar-cell":!g})},[g?(l(),s("div",{key:0,class:"calendar-day",style:mn(D(i.value.get(g))),onContextmenu:P=>b(i.value.get(g),P)},[n("div",Je,[n("time",{datetime:g,class:wn({weekend:p>4})},h(Number(g.slice(-2))),11,Xe),!t.readonly&&i.value.has(g)&&y(q)(i.value.get(g)).abnormal?(l(),s("button",{key:0,type:"button",class:"day-more","aria-label":"Xử lý công ngày "+y(I)(g),onClick:Rn(P=>c("menu",i.value.get(g),P),["stop"])}," ••• ",8,Ze)):V("",!0)]),!t.readonly&&i.value.has(g)&&!y(q)(i.value.get(g)).abnormal?(l(),s("button",{key:0,type:"button",class:"day-body","aria-label":"Xem công ngày "+y(I)(g),onClick:P=>A(i.value.get(g))},[n("strong",null,h(((m=i.value.get(g))==null?void 0:m.hienThiCa)||"—"),1),n("span",null,h(y(q)(i.value.get(g)).label),1)],8,Ye)):(l(),s("div",nt,[n("strong",null,h(((K=i.value.get(g))==null?void 0:K.hienThiCa)||"—"),1),n("span",null,h(y(q)(i.value.get(g)).label),1)]))],44,Qe)):V("",!0)],2)}),128))]))),128))])])]),L.value.length?(l(),s("section",et,[w[0]||(w[0]=n("h3",null,"Ngày ngoài tháng thuộc kỳ công",-1)),n("div",tt,[(l(!0),s(T,null,B(L.value,N=>(l(),s("div",{key:N.ngayChamCong,class:"calendar-day",style:mn(D(N)),onContextmenu:$=>b(N,$)},[n("div",ot,[n("time",{datetime:y(R)(N.ngayChamCong)},h(y(I)(N.ngayChamCong)),9,lt),!t.readonly&&y(q)(N).abnormal?(l(),s("button",{key:0,type:"button",class:"day-more","aria-label":"Xử lý công ngày "+y(I)(N.ngayChamCong),onClick:$=>c("menu",N,$)}," ••• ",8,it)):V("",!0)]),!t.readonly&&!y(q)(N).abnormal?(l(),s("button",{key:0,class:"day-body",type:"button",onClick:$=>A(N)},[n("strong",null,h(N.hienThiCa||"—"),1),n("span",null,h(y(q)(N).label),1)],8,rt)):(l(),s("div",st,[n("strong",null,h(N.hienThiCa||"—"),1),n("span",null,h(y(q)(N).label),1)]))],44,at))),128))])])):V("",!0),n("div",ct,[(l(!0),s(T,null,B(y(Pn),(N,$)=>(l(),s("span",{key:$},[n("i",{style:mn({background:N.bg,borderColor:N.border}),"aria-hidden":"true"},null,4),M(h(N.label),1)]))),128)),w[1]||(w[1]=n("span",null,[n("i",{"aria-hidden":"true"}),M("Chưa có dữ liệu")],-1))])]))}}),ht={class:"attendance-month-grid"},dt={class:"excel-scroll",role:"region","aria-label":"Bảng chi tiết chấm công tháng, cuộn ngang để xem các ngày",tabindex:"0"},mt={class:"excel-attendance","aria-label":"Nhân viên và ký hiệu công từng ngày"},gt=["colspan"],pt=["colspan"],yt=["datetime"],ft={class:"excel-sticky excel-stt"},bt={class:"excel-sticky excel-code"},vt={class:"excel-sticky excel-name",scope:"row"},xt={class:"excel-dept"},kt=["title","onContextmenu"],wt=["aria-label","onClick"],Nt={key:0},Ct=["colspan"],Tt={class:"monthly-subtitle excel-help"},_t={class:"monthly-legend","aria-label":"Chú giải trạng thái"},Vt=Tn({__name:"AttendanceMonthGrid",props:{rows:{},employees:{},filter:{},allowActions:{type:Boolean,default:!1}},emits:["menu","detail"],setup(t,{emit:u}){const a=t,c=u,i=v(""),d=F(()=>se(a.rows)),x=F(()=>Ue(a.employees,a.rows,a.filter)),k=F(()=>ue(a.filter.nam,a.filter.thang)),L=F(()=>Re(a.rows,a.filter)),b=["CN","T2","T3","T4","T5","T6","T7"],A=g=>b[new Date(g+"T12:00:00Z").getUTCDay()],D=(g,p)=>d.value.get(kn(g,p)),_=(g,p)=>{const m=D(g.maNhanVien,p);return G(g)+" · "+I(p)+" · "+((m==null?void 0:m.hienThiCa)||"—")+" · "+q(m).label},w=g=>({background:q(g).bg,color:q(g).text});function N(g,p){i.value=kn(g.maNhanVien,p);const m=D(g.maNhanVien,p);m&&!q(m).abnormal&&c("detail",m)}function $(g,p,m){const K=D(g.maNhanVien,p);!ce(K,a.allowActions).length||!K||(m.preventDefault(),i.value=kn(g.maNhanVien,p),c("menu",K,m))}return(g,p)=>(l(),s("div",ht,[n("div",dt,[n("table",mt,[n("colgroup",null,[p[0]||(p[0]=n("col",{class:"excel-number-col"},null,-1)),p[1]||(p[1]=n("col",{class:"excel-code-col"},null,-1)),p[2]||(p[2]=n("col",{class:"excel-name-col"},null,-1)),p[3]||(p[3]=n("col",{class:"excel-dept-col"},null,-1)),(l(!0),s(T,null,B(k.value,m=>(l(),s("col",{key:m,class:"excel-day-col"}))),128)),(l(!0),s(T,null,B(y(hn),m=>(l(),s("col",{key:m.key,class:"excel-total-col"}))),128))]),n("thead",null,[n("tr",null,[p[4]||(p[4]=n("th",{rowspan:"2",class:"excel-sticky excel-stt",scope:"col"},"STT",-1)),p[5]||(p[5]=n("th",{rowspan:"2",class:"excel-sticky excel-code",scope:"col"},"Mã nhân viên",-1)),p[6]||(p[6]=n("th",{rowspan:"2",class:"excel-sticky excel-name",scope:"col"},"Họ và tên",-1)),p[7]||(p[7]=n("th",{rowspan:"2",class:"excel-dept",scope:"col"},"Bộ phận",-1)),n("th",{colspan:k.value.length,scope:"colgroup"}," Ngày công tháng "+h(String(t.filter.thang).padStart(2,"0"))+"/"+h(t.filter.nam),9,gt),n("th",{colspan:y(hn).length,scope:"colgroup"},"Tổng trong tháng",8,pt)]),n("tr",null,[(l(!0),s(T,null,B(k.value,m=>(l(),s("th",{key:m,scope:"col",class:wn({"excel-weekend":A(m)==="CN"||A(m)==="T7"})},[n("time",{datetime:m},h(Number(m.slice(-2))),9,yt),n("small",null,h(A(m)),1)],2))),128)),(l(!0),s(T,null,B(y(hn),m=>(l(),s("th",{key:m.key,scope:"col"},h(m.label),1))),128))])]),n("tbody",null,[(l(!0),s(T,null,B(x.value,(m,K)=>(l(),s("tr",{key:m.maNhanVien},[n("td",ft,h(K+1),1),n("td",bt,h(m.maNhanVien),1),n("th",vt,h(y(G)(m)),1),n("td",xt,h(m.tenBoPhan||m.maBoPhan||"—"),1),(l(!0),s(T,null,B(k.value,P=>{var Q;return l(),s("td",{key:P,class:wn(["excel-attendance-cell",{"excel-selected":i.value===y(kn)(m.maNhanVien,P)}]),style:mn(w(D(m.maNhanVien,P))),title:_(m,P),onContextmenu:gn=>$(m,P,gn)},[n("button",{type:"button",class:"excel-cell-symbol","aria-label":_(m,P),onClick:gn=>N(m,P)},h(((Q=D(m.maNhanVien,P))==null?void 0:Q.hienThiCa)||"—"),9,wt)],46,kt)}),128)),(l(!0),s(T,null,B(y(hn),P=>{var Q;return l(),s("td",{key:P.key,class:"excel-total"},h(y(re)(((Q=L.value.get(m.maNhanVien))==null?void 0:Q[P.key])??0)),1)}),128))]))),128)),x.value.length?V("",!0):(l(),s("tr",Nt,[n("td",{colspan:k.value.length+4+y(hn).length,class:"excel-empty"}," Không có nhân viên theo bộ lọc. ",8,Ct)]))])])]),n("p",Tt,h(x.value.length)+" nhân viên · Ô hiển thị ký hiệu công/nghỉ phép. Nhấn chuột phải vào ô công bất thường để xem chức năng có thể sử dụng. ",1),n("div",_t,[(l(!0),s(T,null,B(y(Pn),(m,K)=>(l(),s("span",{key:K},[n("i",{style:mn({background:m.bg,borderColor:m.border}),"aria-hidden":"true"},null,4),M(h(m.label),1)]))),128)),p[8]||(p[8]=n("span",null,[n("i",{"aria-hidden":"true"}),M("Chưa có dữ liệu")],-1))])]))}});function Qn(t){if((t==null?void 0:t.isResults)!==!0||t.data==null)throw new Error((t==null?void 0:t.message)||"Không nhận được dữ liệu chấm công hợp lệ.");return t.data}const he="maNhanVien ho tenDem ten maBoPhan tenBoPhan",de="thang nam tuNgay denNgay trangThai ngayChot",Et=he+" "+de+" ngaySinh gioiTinh soNgayCoDuLieuCong soNgayDuLog soNgayKhongLog soNgayCoCong tongSoPhutLamViecThucTe tongSoPhutDiTre tongSoPhutVeSom soNgayDiTre soNgayVeSom tongSoPhutTangCa soNgayQuaDem tongCongHopLe tongNgayNghi tongNgayNghiCoLuong tongNgayNghiKhongLuong tongCongHuongLuong",Bt=he+" "+de+" maCa kyHieuCa ngayChamCong gioVao gioRa soPhutLamViec soGioLamViec maLoaiNghiPhep laNgayLe hienThiCa trangThaiCong ngayNghiPhep ngayNghiHuongLuong nghiLe ngayNghiKhongHuongLuong otNgayLe otNgayThuong";function Jn(t){if(!Number.isInteger(t.thang)||t.thang<1||t.thang>12||!Number.isInteger(t.nam)||t.nam<100||t.nam>9998)throw new Error("Tháng hoặc năm không hợp lệ.")}function me(t){return Jn(t),"thang:"+t.thang+",nam:"+t.nam+",maBoPhan:"+JSON.stringify(t.maBoPhan||null)}async function oe(t){const{data:u}=await Nn.query({query:Cn("query BangCongThang { bangCongThang("+me(t)+"){isResults message data{"+Et+"}}}"),fetchPolicy:"no-cache",errorPolicy:"none"}),a=Qn(u==null?void 0:u.bangCongThang);if(!Array.isArray(a))throw new Error("Báo cáo tháng không đúng định dạng.");return a.filter(Boolean)}async function Hn(t){const{data:u}=await Nn.query({query:Cn("query BangTongHopNgay { bangTongHopNgay("+me(t)+",maNhanVien:"+JSON.stringify(t.maNhanVien)+"){isResults message data{"+Bt+"}}}"),fetchPolicy:"no-cache",errorPolicy:"none"}),a=Qn(u==null?void 0:u.bangTongHopNgay);if(!Array.isArray(a))throw new Error("Công ngày không đúng định dạng.");const c=a.filter(Boolean);return se(c,t.maNhanVien),c}const ge={batch:"tinhChamCongHangLoat",month:"chamCongThang",person:"tinhChamCongNgayTheoNhanVien"};function Wn(t){if(t.kind==="NON_NULL")return Wn(t.ofType)+"!";if(t.kind==="LIST")return"["+Wn(t.ofType)+"]";if(!t.name)throw new Error("Schema input không hợp lệ.");return t.name}function Ln(t){return t.ofType?Ln(t.ofType):t.name||""}const le="kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name}}}}",Un=new Map;async function Dt(t){const u=ge[t];let a=Un.get(u);return a||(a=(async()=>{var b,A,D,_;const{data:c}=await Nn.query({query:Cn("query AttendanceMutationContract {__schema{mutationType{fields{name args{name defaultValue type{"+le+"}}}}}}"),fetchPolicy:"no-cache",errorPolicy:"none"}),i=(A=(b=c==null?void 0:c.__schema)==null?void 0:b.mutationType)==null?void 0:A.fields.find(w=>w.name===u),d=i==null?void 0:i.args.find(w=>w.name==="input");if(!d)throw new Error("Máy chủ chưa cung cấp hợp đồng input cho "+u+".");if(i.args.some(w=>w.name!=="input"&&w.type.kind==="NON_NULL"&&w.defaultValue==null))throw new Error("Mutation có tham số bắt buộc ngoài input chưa được ánh xạ.");const x=Ln(d.type),L=(_=(D=(await Nn.query({query:Cn("query AttendanceInputFields($name:String!){__type(name:$name){inputFields{name defaultValue type{"+le+"}}}}"),variables:{name:x},fetchPolicy:"no-cache",errorPolicy:"none"})).data)==null?void 0:D.__type)==null?void 0:_.inputFields;if(!L)throw new Error("Input chưa phải kiểu đối tượng được hỗ trợ.");return{inputType:Wn(d.type),fields:L}})().catch(c=>{throw Un.delete(u),c}),Un.set(u,a)),a}function Pt(t,u,a){var L;Jn(u.filter);const c=new Set(a.map(b=>b.name)),{filter:i}=u,d=["ngayChamCong","ngayLamViec","ngay"].find(b=>c.has(b));if(t==="person"&&(!u.day||!u.employee||u.day.maNhanVien!==u.employee.maNhanVien||!c.has("maNhanVien")||!d))throw new Error("Input chưa hỗ trợ đúng phạm vi nhân viên và ngày được chọn.");if(t!=="person"&&i.maNhanVien&&!c.has("maNhanVien"))throw new Error("API này không hỗ trợ lọc nhân viên. Hãy chọn Tất cả nhân viên trước khi tính.");if(t!=="person"&&i.maBoPhan&&!c.has("maBoPhan"))throw new Error("API này không hỗ trợ bộ phận đang chọn. Hãy chọn Tất cả bộ phận trước khi tính.");if(!c.has("kyChamCongId")&&!(c.has("thang")&&c.has("nam")))throw new Error("Input chưa có kỳ hoặc tháng/năm được hỗ trợ.");if(t!=="person"&&d&&((L=a.find(b=>b.name===d))==null?void 0:L.type.kind)==="NON_NULL")throw new Error("API yêu cầu chọn ngày cho thao tác hàng loạt; cần bổ sung hợp đồng trước khi sử dụng.");const x={thang:i.thang,nam:i.nam,maBoPhan:i.maBoPhan,maNhanVien:t==="person"?u.employee.maNhanVien:i.maNhanVien,previewOnly:!1,debug:!1};if(c.has("kyChamCongId")){if(u.kyChamCongId==null)throw new Error("Chưa xác định được kỳ công.");const b=$e(u.kyChamCongId),A=Ln(a.find(D=>D.name==="kyChamCongId").type);if(A==="ID"||A==="String")x.kyChamCongId=b;else{const D=Number(b);if(!Number.isSafeInteger(D))throw new Error("ID kỳ vượt giới hạn số an toàn của input.");x.kyChamCongId=D}}if(t==="person"&&d){const b=R(u.day.ngayChamCong),A=u.day;if(A.tuNgay&&b<R(A.tuNgay)||A.denNgay&&b>R(A.denNgay))throw new Error("Ngày nằm ngoài kỳ công.");const D=Ln(a.find(_=>_.name===d).type);x[d]=D==="DateTime"?b+"T00:00:00+07:00":b}const k={};for(const b of a)if(Object.hasOwn(x,b.name)&&(x[b.name]!=null||b.type.kind!=="NON_NULL"))k[b.name]=x[b.name];else if(b.type.kind==="NON_NULL"&&b.defaultValue==null)throw new Error("Cần ánh xạ trường input bắt buộc: "+b.name);return k}async function Lt(t,u){if(!jn().can("attendance","update"))throw new Error("Bạn không có quyền tính công.");const a=JSON.parse(JSON.stringify(u)),c=await Dt(t),i=await Gn({nam:a.filter.nam,thang:a.filter.thang,trangThai:null});if(i.length!==1)throw new Error("Cần xác định chính xác một kỳ chấm công cho tháng đã chọn.");const d=i[0];if(d.trangThai!=="O")throw new Error("Chỉ tính công khi kỳ đang mở.");if(a.day){const L=R(a.day.ngayChamCong);if(L<R(d.tuNgay)||L>R(d.denNgay))throw new Error("Ngày được chọn nằm ngoài kỳ công.")}a.kyChamCongId=d.id;const x=Pt(t,a,c.fields),k=["Kỳ: "+a.filter.thang+"/"+a.filter.nam,t==="person"?"Nhân viên: "+G(a.employee)+" ("+a.employee.maNhanVien+")":"Nhân viên: "+(a.filter.maNhanVien||"Tất cả"),t==="person"?"Ngày: "+I(a.day.ngayChamCong):"Phạm vi: toàn kỳ đã chọn"];return t!=="person"&&k.push("Bộ phận: "+(a.filter.maBoPhan||"Tất cả")),{kind:t,context:a,input:x,inputType:c.inputType,scope:k}}async function St(t){if(!jn().can("attendance","update"))throw new Error("Bạn không có quyền tính công.");const u=await Gn({nam:t.context.filter.nam,thang:t.context.filter.thang,trangThai:null});if(u.length!==1||String(u[0].id)!==String(t.context.kyChamCongId)||u[0].trangThai!=="O")throw new Error("Kỳ công đã thay đổi hoặc không còn mở.");const a=ge[t.kind],c=t.kind==="month"?"thang nam kyChamCongId soNhanVienThemMoi soNhanVienCapNhat soNhanVienBoQuaDaKhoa":(t.kind==="person"?"soDongBoQuaKhongCapNhat ":"")+"tongDongTinh soDongThemMoi soDongCapNhat soDongThieuLog soDongNgayLe soDongNghiPhep",{data:i}=await Nn.mutate({mutation:Cn("mutation AttendanceCalculate($input:"+t.inputType+"){"+a+"(input:$input){isResults message data{returnCode thongKe{"+c+"} resultSets{columns rows}}}}"),variables:{input:t.input},errorPolicy:"none"}),d=i==null?void 0:i[a],x=Qn(d);return{message:(d==null?void 0:d.message)||"Máy chủ đã trả kết quả xử lý.",data:x}}const At=`.monthly-page {
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
`,Ft=["aria-busy"],$t={class:"monthly-heading"},zt={class:"monthly-actions"},Mt=["disabled"],Kt=["value"],qt=["disabled"],Ot=["disabled"],It=["value"],Ht={class:"employee-filter"},Ut={key:0,class:"monthly-error",role:"alert"},Rt={key:1,class:"monthly-notice"},Wt={key:2,class:"monthly-notice",role:"status"},jt={key:3,class:"monthly-notice"},Gt={class:"monthly-sheet"},Qt={class:"monthly-tabs",role:"tablist","aria-label":"Bảng chấm công tháng"},Jt=["aria-selected"],Xt=["aria-selected"],Zt={key:0,class:"monthly-loading",role:"status"},Yt={key:1,class:"monthly-empty"},na={class:"monthly-error",role:"alert"},ea={id:"monthly-summary-panel",role:"tabpanel","aria-labelledby":"monthly-summary-tab"},ta={class:"monthly-toolbar"},aa={class:"monthly-subtitle"},oa={class:"monthly-columns"},la={class:"monthly-column-options"},ia=["onUpdate:modelValue"],ra={class:"monthly-table-scroll monthly-summary-scroll",role:"region","aria-label":"Bảng tổng hợp công tháng, cuộn ngang và dọc để xem đầy đủ",tabindex:"0"},sa={class:"monthly-summary"},ca=["onClick"],ua={key:0},ha=["colspan"],da={id:"monthly-daily-panel",role:"tabpanel","aria-labelledby":"monthly-daily-tab"},ma={class:"monthly-toolbar"},ga={class:"monthly-subtitle"},pa={key:0,class:"monthly-empty",role:"status"},ya={key:1,class:"monthly-error",role:"alert"},fa={key:0},ba={key:0,role:"status"},va={key:1,class:"monthly-error",role:"alert"},xa={key:0,class:"monthly-subtitle"},ka={key:1},wa=["disabled"],Na={key:3,"aria-live":"polite"},Ca={class:"monthly-stats"},Ta={key:0},_a={style:{overflow:"auto","max-height":"240px"}},Va={key:0},Ea=Tn({__name:"MonthlyAttendancePage",setup(t){const u=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit"}).formatToParts(new Date),a=Yn({thang:Number(u.find(o=>o.type==="month").value),nam:Number(u.find(o=>o.type==="year").value),maBoPhan:null,maNhanVien:null}),c=v({...a}),i=v("summary"),d=jn(),x=F(()=>d.can("attendance","update")),k=v([]),L=v(""),b=v(!1),A=F(()=>[...new Map(k.value.filter(o=>o.maBoPhan).map(o=>[o.maBoPhan,{code:o.maBoPhan,label:o.tenBoPhan||o.maBoPhan}])).values()].sort((o,e)=>o.label.localeCompare(e.label,"vi"))),D=F(()=>k.value.filter(o=>!a.maBoPhan||o.maBoPhan===a.maBoPhan).map(o=>({...o,label:o.maNhanVien+" · "+G(o)}))),_=F(()=>k.value.find(o=>o.maNhanVien===c.value.maNhanVien)),w=v([]),N=v([]),$=v(!1),g=v(""),p=v(null),m=v(""),K=v(""),P=v(""),Q=F(()=>w.value.filter(o=>!c.value.maNhanVien||o.maNhanVien===c.value.maNhanVien)),gn=Yn(Ie.map(o=>({...o}))),_n=F(()=>gn.filter(o=>o.visible)),Sn=F(()=>String(c.value.thang).padStart(2,"0")+"/"+c.value.nam),E=v(!1),z=v(!1),pn=v(""),An=v(new Set),Fn=o=>o.nam+"-"+o.thang,pe=F(()=>An.value.has(Fn(c.value))),tn=v(!1),$n=F(()=>{var o;return x.value&&!E.value&&!z.value&&((o=p.value)==null?void 0:o.trangThai)==="O"}),an=v(!1),yn=v(!1),on=v(""),Z=v([]),fn=v(),ln=v({...c.value}),zn=v(),H=v(null),Mn=v(),bn=v(!1),Vn=v(),En=v(!1),j=v(),Y=v(""),W=v(),Kn=v(""),vn=v(!1);let rn=0,Bn=0,sn=0,S=!1;const Dn=new Set,ye=o=>JSON.stringify(o);async function Xn(){b.value=!0,L.value="";try{const o=await Fe.list(null);S||(k.value=o.map(e=>({maNhanVien:e.maNhanVien,ho:e.ho,tenDem:e.tenDem,ten:e.ten,hoTen:e.hoTen,maBoPhan:e.maBoPhan,tenBoPhan:e.tenBoPhan})))}catch(o){S||(L.value=X(o))}finally{S||(b.value=!1)}}async function qn(){const o=++Bn;p.value=null,m.value="";try{const e=await Gn({nam:c.value.nam,thang:c.value.thang,trangThai:null});if(o!==Bn||S)return;e.length===1?p.value=e[0]:m.value=e.length?"Có nhiều kỳ cho tháng này.":"Chưa có kỳ chấm công cho tháng này."}catch(e){o===Bn&&!S&&(m.value=X(e))}}async function cn(o=!1){const e=++rn,r={...c.value},f=i.value,C=ye(r);if(g.value="",!o&&(f==="summary"?K.value:P.value)===C){$.value=!1;return}$.value=!0;try{if(f==="summary"){const U=await oe(r);e===rn&&!S&&(w.value=U,K.value=C)}else{const U=await Hn(r);e===rn&&!S&&(N.value=U,P.value=C)}}catch(U){e===rn&&!S&&(g.value=X(U),f==="summary"?(w.value=[],K.value=""):(N.value=[],P.value=""))}finally{e===rn&&!S&&($.value=!1)}}function fe(){if(!(E.value||z.value))try{if(Jn(a),a.maNhanVien&&!D.value.some(o=>o.maNhanVien===a.maNhanVien))throw new Error("Nhân viên không thuộc bộ phận đã chọn.");c.value={...a},K.value="",P.value="",H.value=null,an.value=!1,bn.value=!1,pn.value="",qn(),cn(!0)}catch(o){g.value=X(o)}}In(()=>a.maBoPhan,()=>{a.maNhanVien&&!D.value.some(o=>o.maNhanVien===a.maNhanVien)&&(a.maNhanVien=null)}),In(i,()=>{H.value=null,bn.value=!1,cn()});async function be(o){const e=++sn;fn.value=o,ln.value={...c.value,maNhanVien:o.maNhanVien},an.value=!0,yn.value=!0,on.value="",Z.value=[];try{const r=await Hn({...ln.value});e===sn&&!S&&(Z.value=r)}catch(r){e===sn&&!S&&(on.value=X(r))}finally{e===sn&&!S&&(yn.value=!1)}}In(an,o=>{o||++sn});async function ve(){if(!zn.value||yn.value||on.value||!Z.value.length)return;const o=document.createElement("iframe");o.title="Bản in phiếu chấm công",o.style.cssText="position:fixed;width:1px;height:1px;left:-10000px;top:0;border:0;",document.body.append(o),Dn.add(o);const e=o.contentDocument,r=o.contentWindow;if(!e||!r){o.remove(),Dn.delete(o);return}e.open(),e.write('<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Phiếu chấm công tháng</title></head><body></body></html>'),e.close();const f=e.createElement("style");f.textContent=At,e.head.append(f),e.body.append(e.importNode(zn.value,!0));const C=()=>{o.remove(),Dn.delete(o)};r.addEventListener("afterprint",C,{once:!0});try{if(await e.fonts.ready,S){C();return}r.focus(),r.print()}catch(U){pn.value="Không mở được hộp thoại in: "+X(U),C()}setTimeout(C,6e4)}async function xe(o,e){var U,xn;if(!ce(o,$n.value).length)return;const r=e.currentTarget instanceof HTMLElement?e.currentTarget.getBoundingClientRect():null,f=e.type==="click"&&e.detail===0&&r?r.left:e.clientX,C=e.type==="click"&&e.detail===0&&r?r.bottom:e.clientY;H.value={row:o,x:Math.max(10,Math.min(f,window.innerWidth-270)),y:Math.max(10,Math.min(C,window.innerHeight-270))},await Ee(),(xn=(U=Mn.value)==null?void 0:U.querySelector("button:not(:disabled)"))==null||xn.focus()}function ke(o){Vn.value=o,bn.value=!0,H.value=null}function Zn(o){var e,r;if(o.key==="Escape"&&(H.value=null),H.value&&["ArrowDown","ArrowUp","Home","End"].includes(o.key)){o.preventDefault();const f=Array.from(((e=Mn.value)==null?void 0:e.querySelectorAll("button:not(:disabled)"))||[]);if(!f.length)return;const C=f.indexOf(document.activeElement);(r=f[o.key==="Home"?0:o.key==="End"?f.length-1:(C+(o.key==="ArrowDown"?1:f.length-1))%f.length])==null||r.focus()}}function un(){H.value=null}async function On(o,e){if(E.value||z.value||!x.value)return;const r=e?k.value.find(C=>C.maNhanVien===e.maNhanVien)||e:_.value,f={filter:{...c.value},employee:r,day:e};H.value=null,j.value=void 0,W.value=void 0,tn.value=!1,Kn.value="",vn.value=!1,Y.value="",En.value=!0,z.value=!0;try{const C=await Lt(o,f);S||(j.value=C)}catch(C){S||(Y.value=X(C))}finally{S||(z.value=!1)}}async function we(){var e,r;if(!j.value||tn.value||E.value||!vn.value||W.value||!x.value)return;const o=j.value;E.value=!0,Y.value="";try{const f=await St(o);if(S)return;W.value=f.data,Kn.value=f.message,K.value="",P.value="",o.kind!=="month"?An.value.add(Fn(o.context.filter)):!o.context.filter.maNhanVien&&!o.context.filter.maBoPhan&&An.value.delete(Fn(o.context.filter));const C=Number(((e=f.data.thongKe)==null?void 0:e.soDongBoQuaKhongCapNhat)??((r=f.data.thongKe)==null?void 0:r.soNhanVienBoQuaDaKhoa)??0);pn.value=C>0?"Máy chủ trả kết quả có "+C+" dòng/nhân viên bị bỏ qua. Xem thống kê chi tiết.":f.message,await Promise.allSettled([cn(!0),qn()])}catch(f){S||(tn.value=!0,Y.value=X(f)+" Kết quả ghi có thể chưa xác định; hãy kiểm tra lại dữ liệu trước khi tính lại.")}finally{S||(E.value=!1)}}async function Ne(){if(!(!j.value||E.value)){E.value=!0;try{const o=j.value.context;j.value.kind==="person"?await Hn({...o.filter,maNhanVien:o.employee.maNhanVien}):await oe(o.filter),await cn(!0),tn.value=!1,Y.value="Đã tải lại dữ liệu. Kiểm tra kết quả trước khi quyết định gửi lại yêu cầu."}catch(o){Y.value=X(o)}finally{E.value=!1}}}return Ce(()=>{Promise.allSettled([Xn(),qn(),cn()]),document.addEventListener("click",un),document.addEventListener("keydown",Zn),window.addEventListener("resize",un),window.addEventListener("scroll",un,!0)}),Te(()=>{S=!0,++rn,++sn,++Bn,document.removeEventListener("click",un),document.removeEventListener("keydown",Zn),window.removeEventListener("resize",un),window.removeEventListener("scroll",un,!0),Dn.forEach(o=>o.remove())}),(o,e)=>(l(),s("section",{class:"monthly-page","aria-busy":E.value},[n("header",$t,[n("div",null,[e[17]||(e[17]=n("h1",null,"Bảng chấm công tháng",-1)),n("p",null,[M(" Tháng "+h(Sn.value),1),p.value?(l(),s(T,{key:0},[M(" · "+h(y(ze)[p.value.trangThai]||p.value.trangThai)+" · "+h(y(I)(p.value.tuNgay))+" – "+h(y(I)(p.value.denNgay)),1),p.value.ngayChot?(l(),s(T,{key:0},[M(" · Chốt: "+h(y(I)(p.value.ngayChot)),1)],64)):V("",!0)],64)):V("",!0)])]),n("div",zt,[O(J,{label:"Chấm công ngày hàng loạt",icon:"pi pi-calendar",severity:"secondary",outlined:"",disabled:!x.value||E.value||z.value,onClick:e[0]||(e[0]=r=>On("batch"))},null,8,["disabled"]),O(J,{label:"Chấm công tháng",icon:"pi pi-calculator",disabled:!x.value||E.value||z.value,onClick:e[1]||(e[1]=r=>On("month"))},null,8,["disabled"])])]),n("form",{class:"monthly-filters",onSubmit:Rn(fe,["prevent"])},[n("label",null,[e[18]||(e[18]=M("Tháng",-1)),nn(n("select",{"onUpdate:modelValue":e[2]||(e[2]=r=>a.thang=r),disabled:E.value||z.value},[(l(),s(T,null,B(12,r=>n("option",{key:r,value:r},"Tháng "+h(r),9,Kt)),64))],8,Mt),[[ne,a.thang,void 0,{number:!0}]])]),n("label",null,[e[19]||(e[19]=M("Năm",-1)),nn(n("input",{"onUpdate:modelValue":e[3]||(e[3]=r=>a.nam=r),type:"number",min:"100",max:"9998",required:"",disabled:E.value||z.value},null,8,qt),[[_e,a.nam,void 0,{number:!0}]])]),n("label",null,[e[21]||(e[21]=M("Bộ phận",-1)),nn(n("select",{"onUpdate:modelValue":e[4]||(e[4]=r=>a.maBoPhan=r),disabled:E.value||z.value||b.value},[e[20]||(e[20]=n("option",{value:null},"Tất cả bộ phận",-1)),(l(!0),s(T,null,B(A.value,r=>(l(),s("option",{key:r.code,value:r.code},h(r.label),9,It))),128))],8,Ot),[[ne,a.maBoPhan]])]),n("label",Ht,[e[22]||(e[22]=M("Nhân viên",-1)),O(y(Ae),{modelValue:a.maNhanVien,"onUpdate:modelValue":e[5]||(e[5]=r=>a.maNhanVien=r),options:D.value,"option-label":"label","option-value":"maNhanVien",filter:"","show-clear":"",placeholder:"Tất cả / tìm mã hoặc họ tên",disabled:E.value||z.value||b.value,loading:b.value,"aria-label":"Chọn nhân viên"},null,8,["modelValue","options","disabled","loading"])]),O(J,{type:"submit",label:"Áp dụng",icon:"pi pi-filter",disabled:E.value||z.value},null,8,["disabled"])],32),L.value?(l(),s("p",Ut,[M(" Không tải được danh mục: "+h(L.value)+" ",1),n("button",{type:"button",onClick:Xn},"Thử lại")])):V("",!0),m.value?(l(),s("p",Rt,h(m.value),1)):V("",!0),pn.value?(l(),s("p",Wt,h(pn.value),1)):V("",!0),pe.value?(l(),s("p",jt," Dữ liệu công ngày đã được xử lý. Cần chấm công tháng để cập nhật tổng hợp nếu backend không tổng hợp tự động. ")):V("",!0),n("div",Gt,[n("div",Qt,[n("button",{id:"monthly-summary-tab",type:"button",role:"tab","aria-selected":i.value==="summary","aria-controls":"monthly-summary-panel",onClick:e[6]||(e[6]=r=>i.value="summary")}," Tổng hợp công tháng",8,Jt),n("button",{id:"monthly-daily-tab",type:"button",role:"tab","aria-selected":i.value==="daily","aria-controls":"monthly-daily-panel",onClick:e[7]||(e[7]=r=>i.value="daily")}," Chi tiết công tháng ",8,Xt)]),$.value?(l(),s("div",Zt,[(l(),s(T,null,B(4,r=>n("span",{key:r})),64)),e[23]||(e[23]=n("p",null,"Đang tải dữ liệu công tháng…",-1))])):g.value?(l(),s("div",Yt,[n("p",na,h(g.value),1),O(J,{label:"Thử lại",onClick:e[8]||(e[8]=r=>cn(!0))})])):V("",!0),nn(n("section",ea,[n("div",ta,[n("div",null,[n("h2",null,"Tổng hợp tháng "+h(Sn.value),1),n("p",aa,h(Q.value.length)+" nhân viên · Nhấn họ tên để xem và in phiếu ",1)]),n("details",oa,[e[24]||(e[24]=n("summary",null,"Chọn cột hiển thị",-1)),n("div",la,[(l(!0),s(T,null,B(gn,r=>(l(),s("label",{key:r.key},[nn(n("input",{"onUpdate:modelValue":f=>r.visible=f,type:"checkbox"},null,8,ia),[[te,r.visible]]),M(h(r.label),1)]))),128))])])]),n("div",ra,[n("table",sa,[n("colgroup",null,[e[25]||(e[25]=n("col",{class:"summary-code-col"},null,-1)),e[26]||(e[26]=n("col",{class:"summary-name-col"},null,-1)),e[27]||(e[27]=n("col",{class:"summary-dept-col"},null,-1)),(l(!0),s(T,null,B(_n.value,r=>(l(),s("col",{key:r.key,class:"summary-data-col"}))),128))]),n("thead",null,[n("tr",null,[e[28]||(e[28]=n("th",{scope:"col"},"Mã nhân viên",-1)),e[29]||(e[29]=n("th",{scope:"col"},"Họ và tên",-1)),e[30]||(e[30]=n("th",{scope:"col"},"Bộ phận",-1)),(l(!0),s(T,null,B(_n.value,r=>(l(),s("th",{key:r.key,scope:"col"},h(r.label),1))),128))])]),n("tbody",null,[(l(!0),s(T,null,B(Q.value,r=>(l(),s("tr",{key:r.maNhanVien},[n("td",null,h(r.maNhanVien),1),n("td",null,[n("button",{type:"button",class:"monthly-name",onClick:f=>be(r)},h(y(G)(r)),9,ca)]),n("td",null,h(r.tenBoPhan||r.maBoPhan||"—"),1),(l(!0),s(T,null,B(_n.value,f=>(l(),s("td",{key:f.key},h(y(re)(r[f.key],f.hours)),1))),128))]))),128)),Q.value.length?V("",!0):(l(),s("tr",ua,[n("td",{colspan:_n.value.length+3},[...e[31]||(e[31]=[n("div",{class:"monthly-empty"},"Không có dữ liệu công tháng theo bộ lọc.",-1)])],8,ha)]))])])])],512),[[ee,i.value==="summary"&&!$.value&&!g.value]]),nn(n("section",da,[n("div",ma,[n("div",null,[n("h2",null,"Chi tiết công tháng "+h(Sn.value),1),n("p",ga," Danh sách nhân viên · Các cột ngày 1–"+h(new Date(c.value.nam,c.value.thang,0).getDate())+" · Ký hiệu công và nghỉ phép ",1)])]),O(Vt,{rows:N.value,employees:k.value,filter:c.value,"allow-actions":$n.value,onMenu:xe,onDetail:ke},null,8,["rows","employees","filter","allow-actions"])],512),[[ee,i.value==="daily"&&!$.value&&!g.value]])]),(l(),dn(Ve,{to:"body"},[H.value&&$n.value?(l(),s("div",{key:0,ref_key:"menuElement",ref:Mn,class:"monthly-context-menu",role:"menu","aria-label":"Xử lý công ngày",style:mn({left:H.value.x+"px",top:H.value.y+"px"}),onClick:e[10]||(e[10]=Rn(()=>{},["stop"]))},[n("p",null,h(y(I)(H.value.row.ngayChamCong))+" · "+h(y(G)(H.value.row)),1),n("button",{role:"menuitem",type:"button",onClick:e[9]||(e[9]=r=>On("person",H.value.row))}," Tính lại công ")],4)):V("",!0)])),O(y(ae),{visible:an.value,"onUpdate:visible":e[12]||(e[12]=r=>an.value=r),modal:"",header:"Phiếu chấm công tháng",style:{width:"1080px",maxWidth:"96vw"}},{footer:en(()=>[O(J,{label:"Đóng",severity:"secondary",outlined:"",onClick:e[11]||(e[11]=r=>an.value=!1)}),O(J,{label:"In phiếu",icon:"pi pi-print",disabled:yn.value||!!on.value||!Z.value.length,onClick:ve},null,8,["disabled"])]),default:en(()=>{var r,f,C,U,xn;return[yn.value?(l(),s("div",pa,"Đang tải phiếu chấm công…")):on.value?(l(),s("p",ya,h(on.value),1)):(l(),s("div",{key:2,ref_key:"reportElement",ref:zn,class:"monthly-report"},[n("h2",null," PHIẾU CHẤM CÔNG THÁNG "+h(String(ln.value.thang).padStart(2,"0"))+"/"+h(ln.value.nam),1),n("p",null,[n("strong",null,h(y(G)(fn.value)),1),M(" · "+h((r=fn.value)==null?void 0:r.maNhanVien)+" · "+h(((f=fn.value)==null?void 0:f.tenBoPhan)||((C=fn.value)==null?void 0:C.maBoPhan)||"—"),1)]),n("p",null," Kỳ công: "+h(y(I)((U=Z.value[0])==null?void 0:U.tuNgay))+" – "+h(y(I)((xn=Z.value[0])==null?void 0:xn.denNgay)),1),Z.value.length?V("",!0):(l(),s("p",fa,"Chưa có dữ liệu chấm công.")),O(ut,{rows:Z.value,year:ln.value.nam,month:ln.value.thang,readonly:""},null,8,["rows","year","month"])],512))]}),_:1},8,["visible"]),O(y(ae),{visible:En.value,"onUpdate:visible":e[15]||(e[15]=r=>En.value=r),modal:"",header:"Xác nhận tính công",closable:!E.value&&!z.value,"close-on-escape":!E.value&&!z.value,style:{width:"640px",maxWidth:"96vw"}},{footer:en(()=>[O(J,{label:"Đóng",severity:"secondary",outlined:"",disabled:E.value||z.value,onClick:e[14]||(e[14]=r=>En.value=!1)},null,8,["disabled"]),tn.value?(l(),dn(J,{key:0,label:"Kiểm tra lại dữ liệu",loading:E.value,onClick:Ne},null,8,["loading"])):V("",!0),W.value?V("",!0):(l(),dn(J,{key:1,label:"Thực hiện tính công",icon:"pi pi-calculator",loading:E.value,disabled:tn.value||!j.value||!vn.value||z.value||E.value||!x.value,onClick:we},null,8,["loading","disabled"]))]),default:en(()=>{var r;return[z.value?(l(),s("p",ba,"Đang kiểm tra kỳ và phạm vi tính công…")):V("",!0),Y.value?(l(),s("p",va,h(Y.value),1)):V("",!0),j.value?(l(),s(T,{key:2},[n("ul",null,[(l(!0),s(T,null,B(j.value.scope,f=>(l(),s("li",{key:f},h(f),1))),128))]),W.value?V("",!0):(l(),s("p",xa," Chỉ cập nhật phạm vi trên. Các dòng bị khóa có thể bị bỏ qua theo kết quả máy chủ. ")),W.value?V("",!0):(l(),s("label",ka,[nn(n("input",{"onUpdate:modelValue":e[13]||(e[13]=f=>vn.value=f),type:"checkbox",disabled:E.value},null,8,wa),[[te,vn.value]]),e[32]||(e[32]=M(" Tôi xác nhận phạm vi tính công.",-1))]))],64)):V("",!0),W.value?(l(),s("section",Na,[e[34]||(e[34]=n("h3",null,"Kết quả máy chủ",-1)),n("p",null,h(Kn.value),1),n("p",null,"Mã trả về: "+h(W.value.returnCode??"—"),1),n("dl",Ca,[(l(!0),s(T,null,B(W.value.thongKe||{},(f,C)=>(l(),s("div",{key:C},[n("dt",null,h(y(He)[String(C)]||C),1),n("dd",null,h(f??"—"),1)]))),128))]),(r=W.value.resultSets)!=null&&r.length?(l(),s("details",Ta,[e[33]||(e[33]=n("summary",null,"Kết quả chi tiết",-1)),n("pre",_a,h(JSON.stringify(W.value.resultSets,null,2)),1)])):V("",!0)])):V("",!0)]}),_:1},8,["visible","closable","close-on-escape"]),O(y(Se),{visible:bn.value,"onUpdate:visible":e[16]||(e[16]=r=>bn.value=r),position:"right",header:"Chi tiết công ngày",style:{width:"400px",maxWidth:"95vw"}},{default:en(()=>[Vn.value?(l(),s("p",Va,h(y(G)(Vn.value))+" · "+h(y(I)(Vn.value.ngayChamCong)),1)):V("",!0),e[35]||(e[35]=n("p",{class:"monthly-notice"},"Nội dung chi tiết công ngày sẽ được phát triển sau.",-1))]),_:1},8,["visible"])],8,Ft))}}),Ba={class:"attendance-workspace"},Da={"aria-label":"Đường dẫn"},Pa={class:"workspace-empty"},La=Tn({__name:"AttendanceWorkspaceView",setup(t){const u=De(),a=F(()=>Pe.find(c=>c.path===u.path));return(c,i)=>{var x,k,L,b;const d=Be("RouterLink");return l(),s("section",Ba,[n("nav",Da,[O(d,{to:"/attendance/overview"},{default:en(()=>[...i[0]||(i[0]=[M("Chấm công",-1)])]),_:1}),n("span",null," / "+h((x=a.value)==null?void 0:x.label),1)]),y(u).meta.attendancePage==="daily"?(l(),dn(Ke,{key:0})):y(u).meta.attendancePage==="monthly"?(l(),dn(Ea,{key:1})):(l(),s(T,{key:2},[n("h1",null,h((k=a.value)==null?void 0:k.label),1),n("div",Pa,[n("i",{class:wn(["pi",(L=a.value)==null?void 0:L.icon])},null,2),n("h2",null,"Chưa có dữ liệu "+h((b=a.value)==null?void 0:b.label.toLocaleLowerCase()),1),i[2]||(i[2]=n("p",null," Chức năng đã được tách riêng trong module Chấm công. Chưa kết nối nguồn dữ liệu cho màn hình này. ",-1)),O(d,{to:"/attendance/overview"},{default:en(()=>[...i[1]||(i[1]=[M("← Về tổng quan chấm công",-1)])]),_:1})])],64))])}}}),po=Me(La,[["__scopeId","data-v-02a34380"]]);export{po as default};
