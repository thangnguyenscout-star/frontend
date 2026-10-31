import{ao as Ve,aq as xe,T as rl,at as ul,au as dl,o as a,c as s,b as n,Q as St,H as oe,aj as Et,ak as Vt,d as Se,y as re,I as hn,F as H,h as j,f as W,s as ce,r as C,e as O,t as u,g as D,_ as ke,v as z,K as Re,x as Te,L as we,G as dn,n as te,z as ae,av as Ct,w as xt,N as At,i as Z,J as Lt,ar as Pt,A as Xe,E as Ie,q as Jn,aw as de,ax as Be,C as un,as as it,al as cl,af as hl,R as vl,p as Bt,k as ml,j as pl}from"./index--EMoAfFF.js";import{b as gl,s as Qe}from"./index-DslmWrAe.js";import{s as We,i as Ae,a as Vn}from"./schedule-date-C26Sytjz.js";import{u as vn}from"./useToast-DCV1WJNd.js";import{_ as tn}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{s as Ze}from"./index-CYK_-qkU.js";import{s as Ot}from"./index-D_5kEgvn.js";import{s as Mt}from"./index-BNwLjox7.js";import{e as fl}from"./employee.service-UD3bW6Us.js";import{p as Nn}from"./privateApi-DpRvWZBv.js";import{r as yl}from"./record.service-C4qWurMs.js";import"./employee.documents-CewwyWru.js";import"./employee.type-B91pyIgX.js";import"./modules-CJV0O-xn.js";function Le(e){if(!e)return"";const r=e.trim(),i=/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/i.exec(r),t=/^(\d{1,2}):(\d{2})(?::\d{2}(?:\.\d+)?)?$/.exec(r);if(!t&&(!i||!i.slice(1).some(v=>v!==void 0)))return"";const l=Number(t?t[1]:(i==null?void 0:i[1])||0),c=Number(t?t[2]:(i==null?void 0:i[2])||0),d=Number((i==null?void 0:i[3])||0);return l>23||c>59||d>=60?"":`${String(l).padStart(2,"0")}:${String(c).padStart(2,"0")}`}function zn(e){if(!e||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(e))return{date:"",time:""};const r=e.slice(0,10),i=Le(e.slice(11,19)),t=new Date(`${r}T12:00:00Z`);return!i||!Number.isFinite(t.getTime())||t.toISOString().slice(0,10)!==r?{date:"",time:""}:{date:r,time:i}}function jn(e){const r=Le(e);if(!r)throw new Error("Invalid schedule clock time.");return`PT${Number(r.slice(0,2))}H${Number(r.slice(3))}M`}function bl(e,r,i,t=!1){const l=Le(r),c=Le(i);if(!/^\d{4}-\d{2}-\d{2}$/.test(e)||!l||!c||l===c)throw new Error("Ngày hoặc giờ của ca không hợp lệ.");const d=new Date(`${e}T12:00:00Z`);if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==e)throw new Error("Ngày của ca không hợp lệ.");return(t||c<l)&&d.setUTCDate(d.getUTCDate()+1),{thoiGianBatDau:`${e}T${l}:00+07:00`,thoiGianKetThuc:`${d.toISOString().slice(0,10)}T${c}:00+07:00`}}function ql(e,r,i,t){if(console.log("Mapping bulk assignments:",{rows:e,shifts:r,departmentCode:i,employees:t}),!i||!e.length)throw new Error("Chọn bộ phận và ít nhất một phân công.");return[...e].sort((l,c)=>l.date.localeCompare(c.date)||l.employeeId.localeCompare(c.employeeId)).map(l=>{const c=r.find(f=>f.id===l.shiftId);if(l.status!=="SCHEDULED"||!c)throw new Error("Chỉ có thể tạo phân công với mã ca hợp lệ.");const d=t.find(f=>f.code===l.employeeId);if(!d)throw new Error("Không tìm thấy nhân viên trong bộ phận đã chọn.");const v=Le(l.startTime||c.startTime),p=Le(l.endTime||c.endTime);if(!/^\d{4}-\d{2}-\d{2}$/.test(l.date)||!/^\d{2}:\d{2}$/.test(v)||!/^\d{2}:\d{2}$/.test(p))throw new Error("Ngày hoặc giờ của ca không hợp lệ.");return{...l.fullTime===!1?{toanCa:!1,maLoaiNghiPhep:l.leaveTypeId||null}:{},ngayLamViec:`${l.date}T00:00:00+07:00`,maNhanVien:l.employeeId,maCa:c.id,maBoPhan:i,maChucVu:d.positionCode||null,...bl(l.date,v,p,l.crossDay??c.crossDay),trangThai:"2",nguonPhanCong:"1",ghiChu:l.note||null}})}async function kl(e){const r=e.map(c=>"{"+Object.entries(c).map(([d,v])=>`${d}: ${JSON.stringify(v)}`).join(",")+"}",3).join(","),i=Ve`mutation CreatePhanCongHangLoat {
    createPhanCongHangLoat(input: { danhSachPhanCong: [${r}] }) {
      isResults message data { tongSo thanhCong thatBai loi { maNhanVien ngayLamViec message } }
    }
  }`,{data:t}=await xe.mutate({mutation:i,errorPolicy:"none"}),l=t==null?void 0:t.createPhanCongHangLoat;if(!(l!=null&&l.data))throw new Error((l==null?void 0:l.message)||"Không thể lưu phân công ca.");if(!l.isResults&&!l.data.thatBai)throw new Error(l.message||"Không thể lưu phân công ca.");return{...l.data,loi:l.data.loi||[]}}var wl=`
    /*!
* Quill Editor v1.3.3
* https://quilljs.com/
* Copyright (c) 2014, Jason Chen
* Copyright (c) 2013, salesforce.com
*/
    .ql-container {
        box-sizing: border-box;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 13px;
        height: 100%;
        margin: 0;
        position: relative;
    }
    .ql-container.ql-disabled .ql-tooltip {
        visibility: hidden;
    }
    .ql-container.ql-disabled .ql-editor ul[data-checked] > li::before {
        pointer-events: none;
    }
    .ql-clipboard {
        inset-inline-start: -100000px;
        height: 1px;
        overflow-y: hidden;
        position: absolute;
        top: 50%;
    }
    .ql-clipboard p {
        margin: 0;
        padding: 0;
    }
    .ql-editor {
        box-sizing: border-box;
        line-height: 1.42;
        height: 100%;
        outline: none;
        overflow-y: auto;
        padding: 12px 15px;
        tab-size: 4;
        -moz-tab-size: 4;
        text-align: left;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
    .ql-editor > * {
        cursor: text;
    }
    .ql-editor p,
    .ql-editor ol,
    .ql-editor ul,
    .ql-editor pre,
    .ql-editor blockquote,
    .ql-editor h1,
    .ql-editor h2,
    .ql-editor h3,
    .ql-editor h4,
    .ql-editor h5,
    .ql-editor h6 {
        margin: 0;
        padding: 0;
        counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
    }
    .ql-editor ol,
    .ql-editor ul {
        padding-inline-start: 1.5rem;
    }
    .ql-editor ol > li,
    .ql-editor ul > li {
        list-style-type: none;
    }
    .ql-editor ul > li::before {
        content: '\\2022';
    }
    .ql-editor ul[data-checked='true'],
    .ql-editor ul[data-checked='false'] {
        pointer-events: none;
    }
    .ql-editor ul[data-checked='true'] > li *,
    .ql-editor ul[data-checked='false'] > li * {
        pointer-events: all;
    }
    .ql-editor ul[data-checked='true'] > li::before,
    .ql-editor ul[data-checked='false'] > li::before {
        color: #777;
        cursor: pointer;
        pointer-events: all;
    }
    .ql-editor ul[data-checked='true'] > li::before {
        content: '\\2611';
    }
    .ql-editor ul[data-checked='false'] > li::before {
        content: '\\2610';
    }
    .ql-editor li::before {
        display: inline-block;
        white-space: nowrap;
        width: 1.2rem;
    }
    .ql-editor li:not(.ql-direction-rtl)::before {
        margin-inline-start: -1.5rem;
        margin-inline-end: 0.3rem;
        text-align: right;
    }
    .ql-editor li.ql-direction-rtl::before {
        margin-inline-start: 0.3rem;
        margin-inline-end: -1.5rem;
    }
    .ql-editor ol li:not(.ql-direction-rtl),
    .ql-editor ul li:not(.ql-direction-rtl) {
        padding-inline-start: 1.5rem;
    }
    .ql-editor ol li.ql-direction-rtl,
    .ql-editor ul li.ql-direction-rtl {
        padding-inline-end: 1.5rem;
    }
    .ql-editor ol li {
        counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
        counter-increment: list-0;
    }
    .ql-editor ol li:before {
        content: counter(list-0, decimal) '. ';
    }
    .ql-editor ol li.ql-indent-1 {
        counter-increment: list-1;
    }
    .ql-editor ol li.ql-indent-1:before {
        content: counter(list-1, lower-alpha) '. ';
    }
    .ql-editor ol li.ql-indent-1 {
        counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
    }
    .ql-editor ol li.ql-indent-2 {
        counter-increment: list-2;
    }
    .ql-editor ol li.ql-indent-2:before {
        content: counter(list-2, lower-roman) '. ';
    }
    .ql-editor ol li.ql-indent-2 {
        counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
    }
    .ql-editor ol li.ql-indent-3 {
        counter-increment: list-3;
    }
    .ql-editor ol li.ql-indent-3:before {
        content: counter(list-3, decimal) '. ';
    }
    .ql-editor ol li.ql-indent-3 {
        counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;
    }
    .ql-editor ol li.ql-indent-4 {
        counter-increment: list-4;
    }
    .ql-editor ol li.ql-indent-4:before {
        content: counter(list-4, lower-alpha) '. ';
    }
    .ql-editor ol li.ql-indent-4 {
        counter-reset: list-5 list-6 list-7 list-8 list-9;
    }
    .ql-editor ol li.ql-indent-5 {
        counter-increment: list-5;
    }
    .ql-editor ol li.ql-indent-5:before {
        content: counter(list-5, lower-roman) '. ';
    }
    .ql-editor ol li.ql-indent-5 {
        counter-reset: list-6 list-7 list-8 list-9;
    }
    .ql-editor ol li.ql-indent-6 {
        counter-increment: list-6;
    }
    .ql-editor ol li.ql-indent-6:before {
        content: counter(list-6, decimal) '. ';
    }
    .ql-editor ol li.ql-indent-6 {
        counter-reset: list-7 list-8 list-9;
    }
    .ql-editor ol li.ql-indent-7 {
        counter-increment: list-7;
    }
    .ql-editor ol li.ql-indent-7:before {
        content: counter(list-7, lower-alpha) '. ';
    }
    .ql-editor ol li.ql-indent-7 {
        counter-reset: list-8 list-9;
    }
    .ql-editor ol li.ql-indent-8 {
        counter-increment: list-8;
    }
    .ql-editor ol li.ql-indent-8:before {
        content: counter(list-8, lower-roman) '. ';
    }
    .ql-editor ol li.ql-indent-8 {
        counter-reset: list-9;
    }
    .ql-editor ol li.ql-indent-9 {
        counter-increment: list-9;
    }
    .ql-editor ol li.ql-indent-9:before {
        content: counter(list-9, decimal) '. ';
    }
    .ql-editor .ql-video {
        display: block;
        max-width: 100%;
    }
    .ql-editor .ql-video.ql-align-center {
        margin: 0 auto;
    }
    .ql-editor .ql-video.ql-align-right {
        margin: 0 0 0 auto;
    }
    .ql-editor .ql-bg-black {
        background: #000;
    }
    .ql-editor .ql-bg-red {
        background: #e60000;
    }
    .ql-editor .ql-bg-orange {
        background: #f90;
    }
    .ql-editor .ql-bg-yellow {
        background: #ff0;
    }
    .ql-editor .ql-bg-green {
        background: #008a00;
    }
    .ql-editor .ql-bg-blue {
        background: #06c;
    }
    .ql-editor .ql-bg-purple {
        background: #93f;
    }
    .ql-editor .ql-color-white {
        color: #fff;
    }
    .ql-editor .ql-color-red {
        color: #e60000;
    }
    .ql-editor .ql-color-orange {
        color: #f90;
    }
    .ql-editor .ql-color-yellow {
        color: #ff0;
    }
    .ql-editor .ql-color-green {
        color: #008a00;
    }
    .ql-editor .ql-color-blue {
        color: #06c;
    }
    .ql-editor .ql-color-purple {
        color: #93f;
    }
    .ql-editor .ql-font-serif {
        font-family:
            Georgia,
            Times New Roman,
            serif;
    }
    .ql-editor .ql-font-monospace {
        font-family:
            Monaco,
            Courier New,
            monospace;
    }
    .ql-editor .ql-size-small {
        font-size: 0.75rem;
    }
    .ql-editor .ql-size-large {
        font-size: 1.5rem;
    }
    .ql-editor .ql-size-huge {
        font-size: 2.5rem;
    }
    .ql-editor .ql-direction-rtl {
        direction: rtl;
        text-align: inherit;
    }
    .ql-editor .ql-align-center {
        text-align: center;
    }
    .ql-editor .ql-align-justify {
        text-align: justify;
    }
    .ql-editor .ql-align-right {
        text-align: right;
    }
    .ql-editor.ql-blank::before {
        color: dt('form.field.placeholder.color');
        content: attr(data-placeholder);
        font-style: italic;
        inset-inline-start: 15px;
        pointer-events: none;
        position: absolute;
        inset-inline-end: 15px;
    }
    .ql-snow.ql-toolbar:after,
    .ql-snow .ql-toolbar:after {
        clear: both;
        content: '';
        display: table;
    }
    .ql-snow.ql-toolbar button,
    .ql-snow .ql-toolbar button {
        background: none;
        border: none;
        cursor: pointer;
        display: inline-block;
        float: left;
        height: 24px;
        padding-block: 3px;
        padding-inline: 5px;
        width: 28px;
    }
    .ql-snow.ql-toolbar button svg,
    .ql-snow .ql-toolbar button svg {
        float: left;
        height: 100%;
    }
    .ql-snow.ql-toolbar button:active:hover,
    .ql-snow .ql-toolbar button:active:hover {
        outline: none;
    }
    .ql-snow.ql-toolbar input.ql-image[type='file'],
    .ql-snow .ql-toolbar input.ql-image[type='file'] {
        display: none;
    }
    .ql-snow.ql-toolbar button:hover,
    .ql-snow .ql-toolbar button:hover,
    .ql-snow.ql-toolbar button:focus,
    .ql-snow .ql-toolbar button:focus,
    .ql-snow.ql-toolbar button.ql-active,
    .ql-snow .ql-toolbar button.ql-active,
    .ql-snow.ql-toolbar .ql-picker-label:hover,
    .ql-snow .ql-toolbar .ql-picker-label:hover,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active,
    .ql-snow.ql-toolbar .ql-picker-item:hover,
    .ql-snow .ql-toolbar .ql-picker-item:hover,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
        color: #06c;
    }
    .ql-snow.ql-toolbar button:hover .ql-fill,
    .ql-snow .ql-toolbar button:hover .ql-fill,
    .ql-snow.ql-toolbar button:focus .ql-fill,
    .ql-snow .ql-toolbar button:focus .ql-fill,
    .ql-snow.ql-toolbar button.ql-active .ql-fill,
    .ql-snow .ql-toolbar button.ql-active .ql-fill,
    .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
    .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,
    .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,
    .ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill,
    .ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar button:focus .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar button:focus .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
        fill: #06c;
    }
    .ql-snow.ql-toolbar button:hover .ql-stroke,
    .ql-snow .ql-toolbar button:hover .ql-stroke,
    .ql-snow.ql-toolbar button:focus .ql-stroke,
    .ql-snow .ql-toolbar button:focus .ql-stroke,
    .ql-snow.ql-toolbar button.ql-active .ql-stroke,
    .ql-snow .ql-toolbar button.ql-active .ql-stroke,
    .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
    .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
    .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,
    .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
    .ql-snow.ql-toolbar button:hover .ql-stroke-miter,
    .ql-snow .ql-toolbar button:hover .ql-stroke-miter,
    .ql-snow.ql-toolbar button:focus .ql-stroke-miter,
    .ql-snow .ql-toolbar button:focus .ql-stroke-miter,
    .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,
    .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,
    .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
    .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
    .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
    .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
        stroke: #06c;
    }
    @media (pointer: coarse) {
        .ql-snow.ql-toolbar button:hover:not(.ql-active),
        .ql-snow .ql-toolbar button:hover:not(.ql-active) {
            color: #444;
        }
        .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-fill,
        .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-fill,
        .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill,
        .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill {
            fill: #444;
        }
        .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke,
        .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke,
        .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter,
        .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter {
            stroke: #444;
        }
    }
    .ql-snow {
        box-sizing: border-box;
    }
    .ql-snow * {
        box-sizing: border-box;
    }
    .ql-snow .ql-hidden {
        display: none;
    }
    .ql-snow .ql-out-bottom,
    .ql-snow .ql-out-top {
        visibility: hidden;
    }
    .ql-snow .ql-tooltip {
        position: absolute;
        transform: translateY(10px);
    }
    .ql-snow .ql-tooltip a {
        cursor: pointer;
        text-decoration: none;
    }
    .ql-snow .ql-tooltip.ql-flip {
        transform: translateY(-10px);
    }
    .ql-snow .ql-formats {
        display: inline-block;
        vertical-align: middle;
    }
    .ql-snow .ql-formats:after {
        clear: both;
        content: '';
        display: table;
    }
    .ql-snow .ql-stroke {
        fill: none;
        stroke: #444;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
    }
    .ql-snow .ql-stroke-miter {
        fill: none;
        stroke: #444;
        stroke-miterlimit: 10;
        stroke-width: 2;
    }
    .ql-snow .ql-fill,
    .ql-snow .ql-stroke.ql-fill {
        fill: #444;
    }
    .ql-snow .ql-empty {
        fill: none;
    }
    .ql-snow .ql-even {
        fill-rule: evenodd;
    }
    .ql-snow .ql-thin,
    .ql-snow .ql-stroke.ql-thin {
        stroke-width: 1;
    }
    .ql-snow .ql-transparent {
        opacity: 0.4;
    }
    .ql-snow .ql-direction svg:last-child {
        display: none;
    }
    .ql-snow .ql-direction.ql-active svg:last-child {
        display: inline;
    }
    .ql-snow .ql-direction.ql-active svg:first-child {
        display: none;
    }
    .ql-snow .ql-editor h1 {
        font-size: 2rem;
    }
    .ql-snow .ql-editor h2 {
        font-size: 1.5rem;
    }
    .ql-snow .ql-editor h3 {
        font-size: 1.17rem;
    }
    .ql-snow .ql-editor h4 {
        font-size: 1rem;
    }
    .ql-snow .ql-editor h5 {
        font-size: 0.83rem;
    }
    .ql-snow .ql-editor h6 {
        font-size: 0.67rem;
    }
    .ql-snow .ql-editor a {
        text-decoration: underline;
    }
    .ql-snow .ql-editor blockquote {
        border-inline-start: 4px solid #ccc;
        margin-block-end: 5px;
        margin-block-start: 5px;
        padding-inline-start: 16px;
    }
    .ql-snow .ql-editor code,
    .ql-snow .ql-editor pre {
        background: #f0f0f0;
        border-radius: 3px;
    }
    .ql-snow .ql-editor pre {
        white-space: pre-wrap;
        margin-block-end: 5px;
        margin-block-start: 5px;
        padding: 5px 10px;
    }
    .ql-snow .ql-editor code {
        font-size: 85%;
        padding: 2px 4px;
    }
    .ql-snow .ql-editor pre.ql-syntax {
        background: #23241f;
        color: #f8f8f2;
        overflow: visible;
    }
    .ql-snow .ql-editor img {
        max-width: 100%;
    }
    .ql-snow .ql-picker {
        color: #444;
        display: inline-block;
        float: left;
        inset-inline-start: 0;
        font-size: 14px;
        font-weight: 500;
        height: 24px;
        position: relative;
        vertical-align: middle;
    }
    .ql-snow .ql-picker-label {
        cursor: pointer;
        display: inline-block;
        height: 100%;
        padding-inline-start: 8px;
        padding-inline-end: 2px;
        position: relative;
        width: 100%;
    }
    .ql-snow .ql-picker-label::before {
        display: inline-block;
        line-height: 22px;
    }
    .ql-snow .ql-picker-options {
        background: #fff;
        display: none;
        min-width: 100%;
        padding: 4px 8px;
        position: absolute;
        white-space: nowrap;
    }
    .ql-snow .ql-picker-options .ql-picker-item {
        cursor: pointer;
        display: block;
        padding-block-end: 5px;
        padding-block-start: 5px;
    }
    .ql-snow .ql-picker.ql-expanded .ql-picker-label {
        color: #ccc;
        z-index: 2;
    }
    .ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-fill {
        fill: #ccc;
    }
    .ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-stroke {
        stroke: #ccc;
    }
    .ql-snow .ql-picker.ql-expanded .ql-picker-options {
        display: block;
        margin-block-start: -1px;
        top: 100%;
        z-index: 1;
    }
    .ql-snow .ql-color-picker,
    .ql-snow .ql-icon-picker {
        width: 28px;
    }
    .ql-snow .ql-color-picker .ql-picker-label,
    .ql-snow .ql-icon-picker .ql-picker-label {
        padding: 2px 4px;
    }
    .ql-snow .ql-color-picker .ql-picker-label svg,
    .ql-snow .ql-icon-picker .ql-picker-label svg {
        inset-inline-end: 4px;
    }
    .ql-snow .ql-icon-picker .ql-picker-options {
        padding: 4px 0;
    }
    .ql-snow .ql-icon-picker .ql-picker-item {
        height: 24px;
        width: 24px;
        padding: 2px 4px;
    }
    .ql-snow .ql-color-picker .ql-picker-options {
        padding: 3px 5px;
        width: 152px;
    }
    .ql-snow .ql-color-picker .ql-picker-item {
        border: 1px solid transparent;
        float: left;
        height: 16px;
        margin: 2px;
        padding: 0;
        width: 16px;
    }
    .ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {
        position: absolute;
        margin-block-start: -9px;
        inset-inline-end: 0;
        top: 50%;
        width: 18px;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-label]:not([data-label=''])::before,
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-label]:not([data-label=''])::before,
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-label]:not([data-label=''])::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-label]:not([data-label=''])::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-label]:not([data-label=''])::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-label]:not([data-label=''])::before {
        content: attr(data-label);
    }
    .ql-snow .ql-picker.ql-header {
        width: 98px;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item::before {
        content: 'Normal';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
        content: 'Heading 1';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
        content: 'Heading 2';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
        content: 'Heading 3';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
        content: 'Heading 4';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
        content: 'Heading 5';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
        content: 'Heading 6';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
        font-size: 2rem;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
        font-size: 1.5rem;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
        font-size: 1.17rem;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
        font-size: 1rem;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
        font-size: 0.83rem;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
        font-size: 0.67rem;
    }
    .ql-snow .ql-picker.ql-font {
        width: 108px;
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item::before {
        content: 'Sans Serif';
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='serif']::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
        content: 'Serif';
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='monospace']::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
        content: 'Monospace';
    }
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
        font-family:
            Georgia,
            Times New Roman,
            serif;
    }
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
        font-family:
            Monaco,
            Courier New,
            monospace;
    }
    .ql-snow .ql-picker.ql-size {
        width: 98px;
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item::before {
        content: 'Normal';
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
        content: 'Small';
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
        content: 'Large';
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
        content: 'Huge';
    }
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
        font-size: 10px;
    }
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
        font-size: 18px;
    }
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
        font-size: 32px;
    }
    .ql-snow .ql-color-picker.ql-background .ql-picker-item {
        background: #fff;
    }
    .ql-snow .ql-color-picker.ql-color .ql-picker-item {
        background: #000;
    }
    .ql-toolbar.ql-snow {
        border: 1px solid #ccc;
        box-sizing: border-box;
        font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
        padding: 8px;
    }
    .ql-toolbar.ql-snow .ql-formats {
        margin-inline-end: 15px;
    }
    .ql-toolbar.ql-snow .ql-picker-label {
        border: 1px solid transparent;
    }
    .ql-toolbar.ql-snow .ql-picker-options {
        border: 1px solid transparent;
        box-shadow: rgba(0, 0, 0, 0.2) 0 2px 8px;
    }
    .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label {
        border-color: #ccc;
    }
    .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
        border-color: #ccc;
    }
    .ql-toolbar.ql-snow .ql-color-picker .ql-picker-item.ql-selected,
    .ql-toolbar.ql-snow .ql-color-picker .ql-picker-item:hover {
        border-color: #000;
    }
    .ql-toolbar.ql-snow + .ql-container.ql-snow {
        border-block-start: 0;
    }
    .ql-snow .ql-tooltip {
        background: #fff;
        border: 1px solid #ccc;
        box-shadow: 0 0 5px #ddd;
        color: #444;
        padding: 5px 12px;
        white-space: nowrap;
    }
    .ql-snow .ql-tooltip::before {
        content: 'Visit URL:';
        line-height: 26px;
        margin-inline-end: 8px;
    }
    .ql-snow .ql-tooltip input[type='text'] {
        display: none;
        border: 1px solid #ccc;
        font-size: 13px;
        height: 26px;
        margin: 0;
        padding: 3px 5px;
        width: 170px;
    }
    .ql-snow .ql-tooltip a.ql-preview {
        display: inline-block;
        max-width: 200px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        vertical-align: top;
    }
    .ql-snow .ql-tooltip a.ql-action::after {
        border-inline-end: 1px solid #ccc;
        content: 'Edit';
        margin-inline-start: 16px;
        padding-inline-end: 8px;
    }
    .ql-snow .ql-tooltip a.ql-remove::before {
        content: 'Remove';
        margin-inline-start: 8px;
    }
    .ql-snow .ql-tooltip a {
        line-height: 26px;
    }
    .ql-snow .ql-tooltip.ql-editing a.ql-preview,
    .ql-snow .ql-tooltip.ql-editing a.ql-remove {
        display: none;
    }
    .ql-snow .ql-tooltip.ql-editing input[type='text'] {
        display: inline-block;
    }
    .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
        border-inline-end: 0;
        content: 'Save';
        padding-inline-end: 0;
    }
    .ql-snow .ql-tooltip[data-mode='link']::before {
        content: 'Enter link:';
    }
    .ql-snow .ql-tooltip[data-mode='formula']::before {
        content: 'Enter formula:';
    }
    .ql-snow .ql-tooltip[data-mode='video']::before {
        content: 'Enter video:';
    }
    .ql-snow a {
        color: #06c;
    }
    .ql-container.ql-snow {
        border: 1px solid #ccc;
    }

    .p-editor {
        display: block;
    }

    .p-editor .p-editor-toolbar {
        background: dt('editor.toolbar.background');
        border-start-end-radius: dt('editor.toolbar.border.radius');
        border-start-start-radius: dt('editor.toolbar.border.radius');
    }

    .p-editor .p-editor-toolbar.ql-snow {
        border: 1px solid dt('editor.toolbar.border.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-stroke {
        stroke: dt('editor.toolbar.item.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-fill {
        fill: dt('editor.toolbar.item.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker .ql-picker-label {
        border: 0 none;
        color: dt('editor.toolbar.item.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker .ql-picker-label:hover {
        color: dt('editor.toolbar.item.hover.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker .ql-picker-label:hover .ql-stroke {
        stroke: dt('editor.toolbar.item.hover.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker .ql-picker-label:hover .ql-fill {
        fill: dt('editor.toolbar.item.hover.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label {
        color: dt('editor.toolbar.item.active.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-stroke {
        stroke: dt('editor.toolbar.item.active.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-fill {
        fill: dt('editor.toolbar.item.active.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
        background: dt('editor.overlay.background');
        border: 1px solid dt('editor.overlay.border.color');
        box-shadow: dt('editor.overlay.shadow');
        border-radius: dt('editor.overlay.border.radius');
        padding: dt('editor.overlay.padding');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options .ql-picker-item {
        color: dt('editor.overlay.option.color');
        border-radius: dt('editor.overlay.option.border.radius');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options .ql-picker-item:hover {
        background: dt('editor.overlay.option.focus.background');
        color: dt('editor.overlay.option.focus.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker.ql-expanded:not(.ql-color-picker, .ql-icon-picker) .ql-picker-item {
        padding: dt('editor.overlay.option.padding');
    }

    .p-editor .p-editor-content {
        border-end-end-radius: dt('editor.content.border.radius');
        border-end-start-radius: dt('editor.content.border.radius');
    }

    .p-editor .p-editor-content.ql-snow {
        border: 1px solid dt('editor.content.border.color');
    }

    .p-editor .p-editor-content .ql-editor {
        background: dt('editor.content.background');
        color: dt('editor.content.color');
        border-end-end-radius: dt('editor.content.border.radius');
        border-end-start-radius: dt('editor.content.border.radius');
    }

    .p-editor .ql-snow.ql-toolbar button:hover,
    .p-editor .ql-snow.ql-toolbar button:focus {
        color: dt('editor.toolbar.item.hover.color');
    }

    .p-editor .ql-snow.ql-toolbar button:hover .ql-stroke,
    .p-editor .ql-snow.ql-toolbar button:focus .ql-stroke {
        stroke: dt('editor.toolbar.item.hover.color');
    }

    .p-editor .ql-snow.ql-toolbar button:hover .ql-fill,
    .p-editor .ql-snow.ql-toolbar button:focus .ql-fill {
        fill: dt('editor.toolbar.item.hover.color');
    }

    .p-editor .ql-snow.ql-toolbar button.ql-active,
    .p-editor .ql-snow.ql-toolbar .ql-picker-label.ql-active,
    .p-editor .ql-snow.ql-toolbar .ql-picker-item.ql-selected {
        color: dt('editor.toolbar.item.active.color');
    }

    .p-editor .ql-snow.ql-toolbar button.ql-active .ql-stroke,
    .p-editor .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
    .p-editor .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke {
        stroke: dt('editor.toolbar.item.active.color');
    }

    .p-editor .ql-snow.ql-toolbar button.ql-active .ql-fill,
    .p-editor .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,
    .p-editor .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill {
        fill: dt('editor.toolbar.item.active.color');
    }

    .p-editor .ql-snow.ql-toolbar button.ql-active .ql-picker-label,
    .p-editor .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-picker-label,
    .p-editor .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-picker-label {
        color: dt('editor.toolbar.item.active.color');
    }
`,Tl={root:function(r){var i=r.instance;return["p-editor",{"p-invalid":i.$invalid}]},toolbar:"p-editor-toolbar",content:"p-editor-content"},Cl=rl.extend({name:"editor",style:wl,classes:Tl}),$l={name:"BaseEditor",extends:gl,props:{placeholder:String,readonly:Boolean,formats:Array,editorStyle:null,modules:null},style:Cl,provide:function(){return{$pcEditor:this,$parentInstance:this}}};function xn(e){"@babel/helpers - typeof";return xn=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(r){return typeof r}:function(r){return r&&typeof Symbol=="function"&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},xn(e)}function $t(e,r){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter(function(l){return Object.getOwnPropertyDescriptor(e,l).enumerable})),i.push.apply(i,t)}return i}function Dl(e){for(var r=1;r<arguments.length;r++){var i=arguments[r]!=null?arguments[r]:{};r%2?$t(Object(i),!0).forEach(function(t){Nl(e,t,i[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):$t(Object(i)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}function Nl(e,r,i){return(r=Il(r))in e?Object.defineProperty(e,r,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[r]=i,e}function Il(e){var r=Sl(e,"string");return xn(r)=="symbol"?r:r+""}function Sl(e,r){if(xn(e)!="object"||!e)return e;var i=e[Symbol.toPrimitive];if(i!==void 0){var t=i.call(e,r);if(xn(t)!="object")return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return(r==="string"?String:Number)(e)}var Dt=(function(){try{return window.Quill}catch{return null}})(),st={name:"Editor",extends:$l,inheritAttrs:!1,emits:["text-change","selection-change","load"],quill:null,watch:{modelValue:function(r,i){r!==i&&this.quill&&!this.quill.hasFocus()&&this.renderValue(r)},d_value:function(r,i){r!==i&&this.quill&&!this.quill.hasFocus()&&this.renderValue(r)},readonly:function(){this.handleReadOnlyChange()}},mounted:function(){var r=this,i={modules:Dl({toolbar:this.$refs.toolbarElement},this.modules),readOnly:this.readonly,theme:"snow",formats:this.formats,placeholder:this.placeholder};Dt?(this.quill=new Dt(this.$refs.editorElement,i),this.initQuill(),this.handleLoad()):ul(()=>import("./quill-BKoT5U3A.js"),[]).then(function(t){t&&dl(r.$refs.editorElement)&&(t.default?r.quill=new t.default(r.$refs.editorElement,i):r.quill=new t(r.$refs.editorElement,i),r.initQuill())}).then(function(){r.handleLoad()})},beforeUnmount:function(){this.quill=null},methods:{renderValue:function(r){if(this.quill)if(r){var i=this.quill.clipboard.convert({html:r});this.quill.setContents(i)}else this.quill.setText("")},initQuill:function(){var r=this;this.renderValue(this.d_value),this.quill.on("text-change",function(i,t,l){if(l==="user"){var c=r.quill.getSemanticHTML(),d=r.quill.getText().trim();c==="<p><br></p>"&&(c=""),r.writeValue(c),r.$emit("text-change",{htmlValue:c,textValue:d,delta:i,source:l,instance:r.quill})}}),this.quill.on("selection-change",function(i,t,l){var c=r.quill.getSemanticHTML(),d=r.quill.getText().trim();r.$emit("selection-change",{htmlValue:c,textValue:d,range:i,oldRange:t,source:l,instance:r.quill})})},handleLoad:function(){this.quill&&this.quill.getModule("toolbar")&&this.$emit("load",{instance:this.quill})},handleReadOnlyChange:function(){this.quill&&this.quill.enable(!this.readonly)}}};function El(e,r,i,t,l,c){return a(),s("div",oe({class:e.cx("root")},e.ptmi("root")),[n("div",oe({ref:"toolbarElement",class:e.cx("toolbar")},e.ptm("toolbar")),[St(e.$slots,"toolbar",{},function(){return[n("span",oe({class:"ql-formats"},e.ptm("formats")),[n("select",oe({class:"ql-header",defaultValue:"0"},e.ptm("header")),[n("option",oe({value:"1"},e.ptm("option")),"Heading",16),n("option",oe({value:"2"},e.ptm("option")),"Subheading",16),n("option",oe({value:"0"},e.ptm("option")),"Normal",16)],16),n("select",oe({class:"ql-font"},e.ptm("font")),[n("option",Et(Vt(e.ptm("option"))),null,16),n("option",oe({value:"serif"},e.ptm("option")),null,16),n("option",oe({value:"monospace"},e.ptm("option")),null,16)],16)],16),n("span",oe({class:"ql-formats"},e.ptm("formats")),[n("button",oe({class:"ql-bold",type:"button"},e.ptm("bold")),null,16),n("button",oe({class:"ql-italic",type:"button"},e.ptm("italic")),null,16),n("button",oe({class:"ql-underline",type:"button"},e.ptm("underline")),null,16)],16),n("span",oe({class:"ql-formats"},e.ptm("formats")),[n("select",oe({class:"ql-color"},e.ptm("color")),null,16),n("select",oe({class:"ql-background"},e.ptm("background")),null,16)],16),n("span",oe({class:"ql-formats"},e.ptm("formats")),[n("button",oe({class:"ql-list",value:"ordered",type:"button"},e.ptm("list")),null,16),n("button",oe({class:"ql-list",value:"bullet",type:"button"},e.ptm("list")),null,16),n("select",oe({class:"ql-align"},e.ptm("select")),[n("option",oe({defaultValue:""},e.ptm("option")),null,16),n("option",oe({value:"center"},e.ptm("option")),null,16),n("option",oe({value:"right"},e.ptm("option")),null,16),n("option",oe({value:"justify"},e.ptm("option")),null,16)],16)],16),n("span",oe({class:"ql-formats"},e.ptm("formats")),[n("button",oe({class:"ql-link",type:"button"},e.ptm("link")),null,16),n("button",oe({class:"ql-image",type:"button"},e.ptm("image")),null,16),n("button",oe({class:"ql-code-block",type:"button"},e.ptm("codeBlock")),null,16)],16),n("span",oe({class:"ql-formats"},e.ptm("formats")),[n("button",oe({class:"ql-clean",type:"button"},e.ptm("clean")),null,16)],16)]})],16),n("div",oe({ref:"editorElement",class:e.cx("content"),style:e.editorStyle},e.ptm("content")),null,16)],16)}st.render=El;const Vl=Ve`
  query PhanCongCa($tuNgay: DateTime!, $denNgay: DateTime!, $maBoPhan: String) {
    phanCongCa(
      tuNgay: $tuNgay
      denNgay: $denNgay
      maBoPhan: $maBoPhan
      maNhanVien: null
      trangThai: null
    ) {
      isResults
      message
      data {
        id
        ngayLamViec
        maNhanVienThaThe
        gioCongChuan
        heSoCa
        isLocked
        maNhanVien
        hoTen
        maBoPhan
        tenBoPhan
        maChucVu
        tenChucVu
        maCa
        tenCa
        kyHieuCa
        thoiGianBatDau
        thoiGianKetThuc
        quaNgay
        trangThai
        nguonPhanCong
        toanCa
        maLoaiNghiPhep
        ghiChu
      }
    }
  }
`,xl=Ve`
  query NhanVienChuaXepCa($tuNgay: DateTime!, $denNgay: DateTime!) {
    nhanVienChuaXepCa(tuNgay: $tuNgay, denNgay: $denNgay, keyword: null, maBoPhan: null) {
      isResults
      message
      data {
        maNhanVien
        hoTen
        maBoPhan
        tenBoPhan
        maChucVu
        tenChucVu
        danhSachNgayXepCa
      }
    }
  }
`;async function Al(e,r){const{data:i}=await xe.query({query:xl,variables:{tuNgay:`${e}T00:00:00+07:00`,denNgay:`${r}T23:59:59.999+07:00`},fetchPolicy:"no-cache",errorPolicy:"none"}),t=i==null?void 0:i.nhanVienChuaXepCa;if(!(t!=null&&t.isResults)||!Array.isArray(t.data))throw new Error((t==null?void 0:t.message)||"Không thể tải danh sách nhân viên chưa xếp ca.");return t.data.filter(l=>!!l).map(l=>({...l,danhSachNgayXepCa:(l.danhSachNgayXepCa||[]).filter(c=>typeof c=="string").map(We).filter(c=>/^\d{4}-\d{2}-\d{2}$/.test(c))}))}async function Gn(e,r,i=null){const{data:t}=await xe.query({query:Vl,variables:{tuNgay:`${e}T00:00:00+07:00`,denNgay:`${r}T23:59:59.999+07:00`,maBoPhan:i},fetchPolicy:"no-cache",errorPolicy:"none"}),l=t==null?void 0:t.phanCongCa;if(!(l!=null&&l.isResults)||!Array.isArray(l.data))throw new Error((l==null?void 0:l.message)||"Không thể tải lịch phân công ca.");const c=l.data.filter(d=>!!d);return Ut(c)}function Ut(e){const r=new Map;return{assignments:e.map(t=>{var p;const{date:l,time:c}=zn(t.thoiGianBatDau),{date:d,time:v}=zn(t.thoiGianKetThuc);return r.set(t.maCa,{id:t.maCa,code:t.kyHieuCa||t.maCa,name:t.tenCa,scheduleType:"ROTATING",startTime:c,endTime:v,crossDay:l&&d?d>l:!!t.quaNgay,displayColor:"#2563eb",active:!0}),{id:String(t.id),employeeId:t.maNhanVien,employeeName:t.hoTen,departmentCode:t.maBoPhan,locked:t.isLocked===!0,date:We(t.ngayLamViec),shiftId:t.maCa,shiftSymbol:t.kyHieuCa||t.maCa,shiftName:t.tenCa,scheduleType:"ROTATING",status:"SCHEDULED",note:t.ghiChu||"",revision:1,fullTime:t.toanCa!==!1,leaveTypeId:((p=t.maLoaiNghiPhep)==null?void 0:p.trim())||null,startTime:c,endTime:v,crossDay:l&&d?d>l:!!t.quaNgay,apiStatus:t.trangThai,assignmentSource:t.nguonPhanCong,startDate:l||We(t.ngayLamViec),endDate:d||void 0}}),shifts:[...r.values()]}}async function Ll(e){const r=Object.entries(e).map(([c,d])=>c+": "+JSON.stringify(d)).join(","),i=Ve`mutation CreatePhanCongCa {
    createPhanCongCa(input: { ${r} }) {
      isResults
      message
      data {
        id ngayLamViec maNhanVien maNhanVienThaThe gioCongChuan heSoCa isLocked
        hoTen maBoPhan tenBoPhan maChucVu tenChucVu maCa tenCa kyHieuCa
        thoiGianBatDau thoiGianKetThuc quaNgay trangThai nguonPhanCong
        toanCa maLoaiNghiPhep ghiChu
      }
    }
  }`,{data:t}=await xe.mutate({mutation:i,errorPolicy:"none"}),l=t==null?void 0:t.createPhanCongCa;if(!(l!=null&&l.isResults))throw new Error((l==null?void 0:l.message)||"Không thể tạo phân công ca.");return l}const Pl=Ve`
  query LoadDanhSachNgay($selectedNgay: String!, $maBoPhan: String) {
    loadDanhSachNgay(selectedNgay: $selectedNgay, maBoPhan: $maBoPhan) {
      isResults
      message
      data {
        id
        ngayLamViec
        maNhanVien
        maNhanVienThaThe
        gioCongChuan
        heSoCa
        isLocked
        hoTen
        maBoPhan
        tenBoPhan
        maChucVu
        tenChucVu
        maCa
        tenCa
        kyHieuCa
        thoiGianBatDau
        thoiGianKetThuc
        quaNgay
        trangThai
        nguonPhanCong
        toanCa
        maLoaiNghiPhep
        ghiChu
      }
    }
  }
`;async function Bl(e,r=null){const{data:i}=await xe.query({query:Pl,variables:{selectedNgay:e,maBoPhan:r},fetchPolicy:"no-cache",errorPolicy:"none"}),t=i==null?void 0:i.loadDanhSachNgay;if(!(t!=null&&t.isResults)||!Array.isArray(t.data))throw new Error((t==null?void 0:t.message)||"Không thể tải danh sách đổi ca.");return Ut(t.data.filter(l=>!!l))}async function Ol(e,r,i=""){var v,p;const t=f=>!!f.id.trim()&&f.leaveTypeId==null&&f.status!=="OFF"&&![f.shiftId,f.shiftSymbol].some(w=>/^(DO(?:0+)?|OFF)$/i.test((w==null?void 0:w.trim())||""));if(!t(e)||!t(r)||e.id===r.id||e.employeeId===r.employeeId||e.date===r.date&&e.shiftId.trim()===r.shiftId.trim())throw new Error("Chọn hai ca làm việc hợp lệ của hai nhân viên khác nhau.");const l=f=>/^\d+$/.test(f.trim())?f.trim().replace(/^0+(?=\d)/,""):JSON.stringify(f.trim()),c=Ve`mutation DoiCa($lyDoDoiCa: String!) {
    doiCa(idCaYeuCauDoi: ${l(e.id)}, idCaDuocDoi: ${l(r.id)}, lyDoDoiCa: $lyDoDoiCa) {
      isResults
      message
      data {
        id
        ngayLamViec
        ngayLamViecCu
        maNhanVienYeuCau
        maNhanVienDoi
        maCaCu
        maCaMoi
        lyDo
        trangThai
        nguoiDuyet
        ngayDuyet
      }
    }
  }`,{data:d}=await xe.mutate({mutation:c,variables:{lyDoDoiCa:i||null},errorPolicy:"none"});if(!((v=d==null?void 0:d.doiCa)!=null&&v.isResults))throw new Error(((p=d==null?void 0:d.doiCa)==null?void 0:p.message)||"Không thể đổi ca. Vui lòng thử lại.");return d.doiCa}const Ml={key:0,class:"exchange-form"},Ul={class:"employee-summary","aria-label":"Ca làm việc hiện tại"},Rl={class:"employee-code"},Fl={class:"shift-details"},Hl={class:"shift-name"},Kl={key:0,class:"error",role:"alert"},Gl={class:"date-actions"},zl={class:"date-field",for:"exchange-date"},jl={class:"reason-field","aria-labelledby":"exchange-reason-label"},Xl={key:1,class:"error",role:"alert"},Wl={class:"candidate-list","aria-label":"Nhân viên có thể đổi ca"},Yl={class:"list-heading"},Jl={class:"hint"},Ql={key:0,class:"empty-state",role:"status"},Zl={key:1,class:"empty-state"},_l={key:2,class:"candidate-scroll"},ea={class:"candidate-table","aria-label":"Danh sách ca làm việc có thể đổi"},na={class:"selection-column"},ta=["id","value","aria-label","onChange"],la=["for"],aa={class:"date-column"},oa={class:"time-column"},ia={class:"dialog-footer"},sa={key:0,class:"exchange-form"},ra={class:"confirmation-pair"},ua={class:"employee-summary"},da={class:"employee-code"},ca={class:"hint"},ha={class:"employee-summary"},va={class:"employee-code"},ma={class:"hint"},pa={class:"reason-field reason-preview","aria-label":"Lý do đổi ca"},ga={key:1,class:"hint"},fa={key:0,class:"error",role:"alert"},ya={class:"dialog-footer"},ba=Se({__name:"ScheduleExchangeDialog",props:{assignment:{},departmentCode:{},employeeName:{}},emits:["close","confirmed","busy"],setup(e,{emit:r}){const i=e,t=r,l=C(!1),c=vn();re(l,S=>t("busy",S),{flush:"sync"});const d=C(""),v=C([]),p=C(!1),f=C(""),w=C(),g=C("");let P=0;const m=S=>S.status==="OFF"||[S.shiftId,S.shiftSymbol].some(T=>/^(DO(?:0+)?|OFF)$/i.test((T==null?void 0:T.trim())||"")),b=S=>S.leaveTypeId===null&&!m(S);function K(){++P,v.value=[],w.value=void 0,f.value="",p.value=!1}re(()=>i.assignment,S=>{K(),d.value=(S==null?void 0:S.date)||"",g.value=""}),re(d,K),hn(()=>{++P});async function G(){const S=i.assignment;if(!S||!d.value||!b(S))return;const T=++P,L=d.value;v.value=[],w.value=void 0,f.value="",p.value=!0;try{const _=await Bl(L,i.departmentCode);T===P&&(v.value=_.assignments.filter(N=>N.employeeId!==S.employeeId&&b(N)&&!(L===S.date&&N.shiftId.trim()===S.shiftId.trim())).map(N=>({...N,date:L})))}catch(_){T===P&&(f.value=we(_))}finally{T===P&&(p.value=!1)}}async function k(){if(!(l.value||!i.assignment||!w.value||!b(i.assignment)||!b(w.value)||w.value.date===i.assignment.date&&w.value.shiftId.trim()===i.assignment.shiftId.trim())){l.value=!0,f.value="";try{const S=await Ol(i.assignment,w.value,g.value);c.success(S.message||"Đổi ca thành công."),w.value=void 0,t("close"),t("confirmed")}catch(S){c.error(S),f.value=we(S)}finally{l.value=!1}}}return(S,T)=>(a(),s(H,null,[j(W(Re),{visible:!!e.assignment&&!w.value,modal:"",header:"Chọn nhân viên đổi ca",style:{width:"900px",maxWidth:"95vw"},"onUpdate:visible":T[3]||(T[3]=L=>!L&&t("close"))},{default:ce(()=>[e.assignment?(a(),s("div",Ml,[n("section",Ul,[T[8]||(T[8]=n("span",{class:"section-label"},"Ca làm việc hiện tại",-1)),n("strong",null,[O(u(e.employeeName)+" ",1),n("span",Rl,u(e.assignment.employeeId),1)]),n("div",Fl,[n("span",null,[T[6]||(T[6]=n("i",{class:"pi pi-calendar","aria-hidden":"true"},null,-1)),O(u(e.assignment.date),1)]),n("span",Hl,u(e.assignment.shiftName||e.assignment.shiftSymbol||e.assignment.shiftId),1),n("span",null,[T[7]||(T[7]=n("i",{class:"pi pi-clock","aria-hidden":"true"},null,-1)),O(u(e.assignment.startTime)+"–"+u(e.assignment.endTime)+u(e.assignment.crossDay?" (+1 ngày)":""),1)])])]),b(e.assignment)?D("",!0):(a(),s("p",Kl," Chỉ ca làm việc không có mã nghỉ phép mới được đổi ca. Ca nghỉ DO không thể đổi ca. ")),n("div",Gl,[n("label",zl,[T[9]||(T[9]=O("Chọn ngày ",-1)),j(W(Qe),{id:"exchange-date",modelValue:d.value,"onUpdate:modelValue":T[0]||(T[0]=L=>d.value=L),type:"date"},null,8,["modelValue"])]),j(ke,{type:"button",label:"Tải lại danh sách",icon:"pi pi-refresh",outlined:"",loading:p.value,disabled:p.value||!d.value||!b(e.assignment),onClick:G},null,8,["loading","disabled"])]),n("section",jl,[T[11]||(T[11]=n("label",{id:"exchange-reason-label"},"Lý do đổi ca",-1)),j(W(st),{modelValue:g.value,"onUpdate:modelValue":T[1]||(T[1]=L=>g.value=L),"editor-style":"height: 140px",placeholder:"Nhập lý do đổi ca…"},{toolbar:ce(()=>[...T[10]||(T[10]=[n("span",{class:"ql-formats"},[n("button",{class:"ql-bold",type:"button","aria-label":"In đậm",title:"In đậm"}),n("button",{class:"ql-italic",type:"button","aria-label":"In nghiêng",title:"In nghiêng"}),n("button",{class:"ql-underline",type:"button","aria-label":"Gạch chân",title:"Gạch chân"})],-1),n("span",{class:"ql-formats"},[n("button",{class:"ql-list",value:"ordered",type:"button","aria-label":"Danh sách đánh số",title:"Danh sách đánh số"}),n("button",{class:"ql-list",value:"bullet",type:"button","aria-label":"Danh sách dấu chấm",title:"Danh sách dấu chấm"}),n("button",{class:"ql-clean",type:"button","aria-label":"Xóa định dạng",title:"Xóa định dạng"})],-1)])]),_:1},8,["modelValue"])]),f.value?(a(),s("p",Xl,u(f.value),1)):D("",!0),n("section",Wl,[n("div",Yl,[T[12]||(T[12]=n("strong",null,"Nhân viên có thể đổi ca",-1)),n("span",Jl,u(v.value.length)+" nhân viên",1)]),p.value?(a(),s("div",Ql,[...T[13]||(T[13]=[n("i",{class:"pi pi-spin pi-spinner","aria-hidden":"true"},null,-1),O("Đang tải danh sách nhân viên… ",-1)])])):v.value.length?(a(),s("div",_l,[n("table",ea,[T[15]||(T[15]=n("thead",null,[n("tr",null,[n("th",{scope:"col",class:"selection-column"},"Chọn"),n("th",{scope:"col"},"Mã nhân viên"),n("th",{scope:"col"},"Họ tên"),n("th",{scope:"col"},"Ngày làm việc"),n("th",{scope:"col"},"Ca làm việc"),n("th",{scope:"col"},"Giờ làm việc")])],-1)),n("tbody",null,[(a(!0),s(H,null,z(v.value,L=>(a(),s("tr",{key:L.id,class:"candidate"},[n("td",na,[n("input",{id:"exchange-candidate-"+L.id,type:"radio",name:"exchange-employee",value:L.id,"aria-label":"Chọn "+(L.employeeName||L.employeeId)+" · "+L.date,onChange:_=>w.value=L},null,40,ta)]),n("td",null,u(L.employeeId),1),n("td",null,[n("label",{for:"exchange-candidate-"+L.id},u(L.employeeName||L.employeeId),9,la)]),n("td",aa,u(L.date.split("-").reverse().join("/")),1),n("td",null,u(L.shiftName||L.shiftSymbol||L.shiftId),1),n("td",oa,u(L.startTime||"—")+"–"+u(L.endTime||"—")+u(L.crossDay?" (+1 ngày)":""),1)]))),128))])])])):(a(),s("div",Zl,[...T[14]||(T[14]=[n("i",{class:"pi pi-users","aria-hidden":"true"},null,-1),n("p",null,"Chưa có nhân viên phù hợp.",-1),n("span",{class:"hint"},"Chọn ngày rồi nhấn Tải lại danh sách.",-1)])]))]),T[16]||(T[16]=n("p",{class:"hint"},"Chọn nhân viên để xem thông tin xác nhận chuyển ca.",-1)),n("footer",ia,[j(ke,{type:"button",label:"Hủy",severity:"secondary",outlined:"",onClick:T[2]||(T[2]=L=>t("close"))})])])):D("",!0)]),_:1},8,["visible"]),j(W(Re),{visible:!!w.value,modal:"",header:"Xác nhận chuyển ca",closable:!l.value,"close-on-escape":!l.value,style:{width:"560px",maxWidth:"95vw"},"onUpdate:visible":T[5]||(T[5]=L=>!l.value&&!L&&(w.value=void 0))},{default:ce(()=>[e.assignment&&w.value?(a(),s("div",sa,[T[22]||(T[22]=n("p",null,"Bạn có xác nhận chuyển ca giữa hai nhân viên sau không?",-1)),n("div",ra,[n("section",ua,[T[17]||(T[17]=n("span",{class:"section-label"},"Ca hiện tại",-1)),n("strong",null,[O(u(e.employeeName)+" ",1),n("span",da,u(e.assignment.employeeId),1)]),n("span",null,u(e.assignment.date)+" · "+u(e.assignment.shiftName||e.assignment.shiftId),1),n("span",ca,u(e.assignment.startTime)+"–"+u(e.assignment.endTime)+u(e.assignment.crossDay?" (+1 ngày)":""),1)]),T[19]||(T[19]=n("i",{class:"pi pi-arrow-right-arrow-left exchange-icon","aria-hidden":"true"},null,-1)),n("section",ha,[T[18]||(T[18]=n("span",{class:"section-label"},"Ca được chọn",-1)),n("strong",null,[O(u(w.value.employeeName||w.value.employeeId)+" ",1),n("span",va,u(w.value.employeeId),1)]),n("span",null,u(w.value.date)+" · "+u(w.value.shiftName||w.value.shiftId),1),n("span",ma,u(w.value.startTime)+"–"+u(w.value.endTime)+u(w.value.crossDay?" (+1 ngày)":""),1)])]),n("section",pa,[T[21]||(T[21]=n("strong",null,"Lý do đổi ca",-1)),g.value?(a(),Te(W(st),{key:0,"model-value":g.value,readonly:"","editor-style":"min-height: 80px"},{toolbar:ce(()=>[...T[20]||(T[20]=[n("span",{class:"hint"},"Nội dung lý do đã nhập",-1)])]),_:1},8,["model-value"])):(a(),s("p",ga,"Chưa nhập lý do đổi ca."))]),f.value?(a(),s("p",fa,u(f.value),1)):D("",!0),n("footer",ya,[j(ke,{type:"button",label:"Quay lại",severity:"secondary",outlined:"",disabled:l.value,onClick:T[4]||(T[4]=L=>w.value=void 0)},null,8,["disabled"]),j(ke,{type:"button",label:"OK",icon:"pi pi-check",loading:l.value,disabled:l.value,onClick:k},null,8,["loading","disabled"])])])):D("",!0)]),_:1},8,["visible","closable","close-on-escape"])],64))}}),Rt=tn(ba,[["__scopeId","data-v-6f0ce4b9"]]),qa=Ve`
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
`;async function Ft(e){const{data:r}=await xe.query({query:qa,variables:{maBoPhan:e},fetchPolicy:"no-cache"}),i=r==null?void 0:r.caLamViec;if(!(i!=null&&i.isResults)||!Array.isArray(i.data))throw new Error((i==null?void 0:i.message)||"Không thể tải danh sách ca làm việc.");return i.data.filter(t=>!!t&&!!t.maCa)}async function Xn(e,r){return(await Ft(e)).map(i=>{const t=Le(i.gioBatDau),l=Le(i.gioKetThuc);return{id:i.maCa,workType:String(i.loaiHinhLamViec),code:i.kyHieuCa||i.maCa,name:i.tenCa,scheduleType:i.loaiHinhLamViec==null?r:String(i.loaiHinhLamViec)==="1"?"ADMINISTRATIVE":"ROTATING",startTime:t,endTime:l,crossDay:i.quaNgay===!0||String(i.quaNgay)==="1",displayColor:"#2563eb",active:!0}})}const ka=Ve`
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
`;async function wa(){const{data:e}=await xe.query({query:ka,fetchPolicy:"no-cache"}),r=e==null?void 0:e.danhSachBoPhan;if(!(r!=null&&r.isResults)||!Array.isArray(r.data))throw new Error((r==null?void 0:r.message)||"Không thể tải danh sách bộ phận.");return r.data.filter(i=>i!==null).map(i=>({code:i.maBoPhan,name:i.tenBoPhan}))}async function Ta(e){const r=await Ft(null),i=[{type:"ADMINISTRATIVE",label:"1 · Hành chính",departments:[]},{type:"ROTATING",label:"2 · Xoay ca",departments:[]}],t=[];for(const l of e){const c=r.filter(p=>p.maBoPhan===l.code),d=c.some(p=>String(p.loaiHinhLamViec)==="1"),v=c.some(p=>["C","2"].includes(String(p.loaiHinhLamViec).trim().toUpperCase()));d&&i[0].departments.push(l),v&&i[1].departments.push(l),!d&&!v&&t.push(l)}return{groups:i,unavailable:t}}async function Ca(e){var l,c;const r=Object.entries(e).map(([d,v])=>d+": "+(d==="id"&&/^\d+$/.test(String(v))?String(v):JSON.stringify(v))).join(","),i=Ve`mutation UpdatePhanCongCa {
    updatePhanCongCa(input: { ${r} }) { isResults message }
  }`,{data:t}=await xe.mutate({mutation:i,errorPolicy:"none"});if(!((l=t==null?void 0:t.updatePhanCongCa)!=null&&l.isResults))throw new Error(((c=t==null?void 0:t.updatePhanCongCa)==null?void 0:c.message)||"Không thể cập nhật phân công.");return t.updatePhanCongCa}function $a(e,r,i){if(!e.id||Ae(e.date))throw new Error("Không thể sửa phân công ngày quá khứ.");const t=i.find(d=>d.id===r&&d.active&&d.workType!=="0"&&d.scheduleType===e.scheduleType);if(!t||r===e.shiftId)throw new Error("Vui lòng chọn ca làm việc khác ca hiện tại.");const l=Le(t.startTime),c=Le(t.endTime);if(!l||!c||l===c)throw new Error("Ca được chọn chưa có giờ làm việc hợp lệ. Vui lòng cấu hình giờ của ca.");return{id:e.id,maNhanVien:e.employeeId,ngayLamViec:`${e.date}T00:00:00+07:00`,maCa:r,toanCa:!0,gioBatDau:jn(l),gioKetThuc:jn(c),maLoaiNghiPhep:null,ghiChu:(e.note||"").trim()||null}}const ct=6e4,rt=1440*ct,Da=420*ct;function cn(e){return new Date(e+Da).toISOString().slice(0,19)+"+07:00"}function Wn(e,r){if(!/^\d{4}-\d{2}-\d{2}$/.test(e)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(r))throw new Error("Vui lòng nhập ngày và giờ hợp lệ.");const i=Date.parse(`${e}T${r}:00+07:00`);if(!Number.isFinite(i)||cn(i).slice(0,10)!==e)throw new Error("Ngày nghỉ phép không hợp lệ.");return i}function ht(e){const r=Wn(e.fromDate,e.fromTime),i=Wn(e.toDate,e.toTime);if(Ae(e.fromDate))throw new Error("Không thể đăng ký nghỉ phép ngày quá khứ.");if(i<=r)throw new Error("Thời điểm kết thúc nghỉ phép phải sau thời điểm bắt đầu.");if(i-r>366*rt)throw new Error("Khoảng nghỉ phép không được vượt quá 366 ngày.");return{start:r,end:i}}function Ht(e,r,i){const{start:t,end:l}=ht(r);if(!e)throw new Error("Chưa xác định nhân viên nghỉ phép.");const c=[],d=new Set;for(const v of i){if(v.employeeId!==e||v.status!=="SCHEDULED")continue;if(!v.id||d.has(v.id))throw new Error("ID phân công bị thiếu hoặc trùng lặp.");d.add(v.id);const p=Wn(v.startDate||v.date,Le(v.startTime));let f=Wn(v.endDate||v.startDate||v.date,Le(v.endTime));if(!v.endDate&&(v.crossDay||f<=p)&&(f+=rt),f<=p||f-p>rt)throw new Error(`Thời gian ca ngày ${v.date} không hợp lệ; vui lòng tải lại phân công.`);const w=Math.max(t,p),g=Math.min(l,f);w>=g||c.push({assignmentId:v.id,date:v.date,shiftLabel:v.shiftSymbol||v.shiftName||v.shiftId,fullTime:w===p&&g===f,start:cn(w),end:cn(g),minutes:(g-w)/ct})}return c}function Nt(e,r,i,t,l=new Date){if(!t.some(p=>p.id===r.leaveTypeId&&p.workType==="0"&&p.active))throw new Error("Vui lòng chọn loại nghỉ phép hợp lệ.");if(!r.reason.trim())throw new Error("Vui lòng nhập lý do nghỉ phép.");const{start:c,end:d}=ht(r),v=Ht(e,r,i);return{maNhanVien:e,ngayDangKyLichNghi:cn(l.getTime()).slice(0,10)+"T00:00:00+07:00",tuNgay:cn(c),denNgay:cn(d),loaiNghiPhep:r.leaveTypeId,lyDoNghi:r.reason.trim(),tinhTrang:"1",danhSachPhanCong:v.map(p=>({id:p.assignmentId,ngayLamViec:`${p.date}T00:00:00+07:00`,toanCa:p.fullTime,batDauLamViec:p.start,ketThucLamViec:p.end}))}}const Na=Ve`
  mutation TaoNhanVienNghiPhep($input: TaoNhanVienNghiPhepInput!) {
    taoNhanVienNghiPhep(input: $input) {
      isResults
      message
      data {
        id
        maNhanVien
        ngayDangKyLichNghi
        tuNgay
        denNgay
        lyDoNghi
        loaiNghiPhep
        soNgayNghi
        tinhTrang
        soPhanCongCapNhat
      }
    }
  }
`;async function Ia(e){var v,p;const{maNhanVien:r,tuNgay:i,denNgay:t,lyDoNghi:l,loaiNghiPhep:c}=e,{data:d}=await xe.mutate({mutation:Na,variables:{input:{maNhanVien:r,tuNgay:i,denNgay:t,lyDoNghi:l,loaiNghiPhep:c}},errorPolicy:"none"});if(!((v=d==null?void 0:d.taoNhanVienNghiPhep)!=null&&v.isResults))throw new Error(((p=d==null?void 0:d.taoNhanVienNghiPhep)==null?void 0:p.message)||"Không thể đăng ký nghỉ phép.");return d.taoNhanVienNghiPhep}const Sa=Ve`
  query PhanCongCaNghiPhep($tuNgay: DateTime!, $denNgay: DateTime!, $maNhanVien: String!) {
    phanCongCa(tuNgay: $tuNgay, denNgay: $denNgay, maNhanVien: $maNhanVien) {
      isResults
      message
      data {
        id
        ngayLamViec
        maNhanVien
        hoTen
        maCa
        kyHieuCa
        thoiGianBatDau
        thoiGianKetThuc
      }
    }
  }
`;async function Ea(e,r){if(ht(r),!e)throw new Error("Chưa xác định nhân viên nghỉ phép.");const{data:i}=await xe.query({query:Sa,variables:{tuNgay:`${r.fromDate}T00:00:00+07:00`,denNgay:`${r.toDate}T23:59:59.999+07:00`,maNhanVien:e},fetchPolicy:"no-cache",errorPolicy:"none"}),t=i==null?void 0:i.phanCongCa;if(!(t!=null&&t.isResults)||!Array.isArray(t.data))throw new Error((t==null?void 0:t.message)||"Không thể tải phân công ca cho khoảng nghỉ phép.");return t.data.filter(l=>!!l&&l.maNhanVien===e).map(l=>{const c=We(l.ngayLamViec),{date:d,time:v}=zn(l.thoiGianBatDau),{date:p,time:f}=zn(l.thoiGianKetThuc);return{id:String(l.id),employeeId:l.maNhanVien,date:c,shiftId:l.maCa,shiftSymbol:l.kyHieuCa||l.maCa,scheduleType:"ROTATING",status:"SCHEDULED",note:"",revision:1,startDate:d||c,endDate:p||void 0,startTime:v,endTime:f,crossDay:p?p>(d||c):!!v&&!!f&&f<=v}})}const Va={class:"employee-summary"},xa=["disabled"],Aa={key:1,role:"status"},La={key:0,class:"hint"},Pa={class:"time-grid"},Ba={class:"load-schedule-actions"},Oa={key:0,class:"hint",role:"status"},Ma={key:1,class:"hint"},Ua={key:0,class:"leave-preview","aria-label":"Ca làm việc đã phân công"},Ra={class:"preview-scroll"},Fa={key:1,role:"status"},Ha={key:2,class:"error",role:"alert"},Ka={key:3,class:"error",role:"alert"},Ga={key:4,class:"error",role:"alert"},za=Se({__name:"ScheduleEditDialog",props:{assignment:{},departmentCode:{},employeeName:{},initialAction:{},leaveRange:{}},emits:["close","saved","busy"],setup(e,{emit:r}){const i=vn(),t=e,l=r,c=C("shift"),d=C(""),v=At({fromDate:"",fromTime:"",toDate:"",toTime:"",leaveTypeId:"",reason:""}),p=C([]),f=C([]),w=C(""),g=Z(()=>{var B,M;return JSON.stringify([(B=t.assignment)==null?void 0:B.employeeId,(M=t.assignment)==null?void 0:M.id,c.value,v.fromDate,v.fromTime,v.toDate,v.toTime])}),P=Z(()=>!!w.value&&w.value===g.value),m=C(!1),b=C(!1),K=C(!1),G=C(""),k=C("");let S=0,T=0;re(K,B=>l("busy",B),{flush:"sync"});const L=Vn(),_=Z(()=>p.value.filter(B=>{var M,ee;return B.active&&B.workType!=="0"&&B.scheduleType===((M=t.assignment)==null?void 0:M.scheduleType)&&B.id!==((ee=t.assignment)==null?void 0:ee.shiftId)}).map(B=>({...B,label:`${B.code} · ${B.name}${B.startTime&&B.endTime?` (${B.startTime}–${B.endTime})`:""}`}))),N=Z(()=>p.value.filter(B=>B.active&&B.workType==="0").map(B=>({...B,label:`${B.id} · ${B.name}`}))),E=Z(()=>{if(c.value!=="leave"||!P.value||b.value||k.value||!t.assignment)return{periods:[],error:""};try{return{periods:Ht(t.assignment.employeeId,v,f.value),error:""}}catch(B){return{periods:[],error:we(B)}}}),X=Z(()=>new Map(E.value.periods.map(B=>[B.assignmentId,B])));function ie(B,M){const ee=new Date(`${B}T12:00:00Z`);return ee.setUTCDate(ee.getUTCDate()+M),ee.toISOString().slice(0,10)}function ue(B){return`${B.slice(8,10)}/${B.slice(5,7)}/${B.slice(0,4)} ${B.slice(11,16)}`}async function me(){const B=++S;if(p.value=[],G.value="",!t.assignment){m.value=!1;return}m.value=!0;try{if(!t.departmentCode)throw new Error("Chưa xác định bộ phận của phân công.");const[M,ee]=await Promise.all([Xn(t.departmentCode,t.assignment.scheduleType),Xn(null,t.assignment.scheduleType)]);B===S&&(p.value=[...new Map([...M,...ee.filter(se=>se.workType==="0")].map(se=>[se.id,se])).values()])}catch(M){B===S&&(G.value=we(M))}finally{B===S&&(m.value=!1)}}async function he(){return Ea(t.assignment.employeeId,{...v})}function De(){++T,f.value=[],w.value="",b.value=!1,k.value="",G.value=""}async function $e(){if(K.value||b.value)return;const B=++T,M=g.value;if(w.value="",f.value=[],k.value="",!t.assignment||c.value!=="leave"){b.value=!1;return}b.value=!0;try{const ee=await he();B===T&&M===g.value&&(f.value=ee,w.value=M)}catch(ee){B===T&&(k.value=we(ee))}finally{B===T&&(b.value=!1)}}re(()=>t.assignment,B=>{c.value=t.initialAction||"shift",d.value="",De(),Object.assign(v,{fromDate:(B==null?void 0:B.startDate)||(B==null?void 0:B.date)||"",fromTime:(B==null?void 0:B.startTime)||"",toDate:(B==null?void 0:B.endDate)||(B!=null&&B.date?ie(B.date,B.crossDay||B.endTime&&B.startTime&&B.endTime<=B.startTime?1:0):""),toTime:(B==null?void 0:B.endTime)||"",leaveTypeId:"",reason:""}),t.leaveRange&&Object.assign(v,t.leaveRange,{fromTime:"",toTime:""}),me()},{immediate:!0}),re(g,De,{flush:"sync"});async function ve(){if(!(!t.assignment||K.value||m.value||b.value)){G.value="",K.value=!0;try{if(c.value==="shift")await Ca($a(t.assignment,d.value,p.value));else{if(!P.value)throw new Error("Vui lòng tải phân công ca trước khi xác nhận nghỉ phép.");const B=Nt(t.assignment.employeeId,v,f.value,N.value),M=await he(),ee=Nt(t.assignment.employeeId,v,M,N.value);if(f.value=M,JSON.stringify(B.danhSachPhanCong)!==JSON.stringify(ee.danhSachPhanCong))throw new Error("Lịch phân công vừa thay đổi. Vui lòng kiểm tra lại danh sách nghỉ và xác nhận lần nữa.");const se=await Ia(ee);i.success(se.message||"Đăng ký nghỉ phép thành công.")}l("saved")}catch(B){i.error(B),G.value=we(B)}finally{K.value=!1}}}return hn(()=>{++S,++T}),(B,M)=>(a(),Te(W(Re),{class:"schedule-dialog",visible:!!e.assignment,modal:"",header:e.initialAction==="leave"?"Đăng ký nghỉ phép":"Điều chỉnh phân công ca",closable:!K.value,"close-on-escape":!K.value,style:dn({width:c.value==="leave"?"720px":"520px",maxWidth:"95vw"}),"onUpdate:visible":M[10]||(M[10]=ee=>!K.value&&l("close"))},{default:ce(()=>{var ee,se,pe;return[n("form",{class:"edit-form",onSubmit:xt(ve,["prevent"])},[n("p",Va,[n("strong",null,u(e.employeeName),1),e.initialAction?D("",!0):(a(),s(H,{key:0},[M[11]||(M[11]=n("br",null,null,-1)),O(u((ee=e.assignment)==null?void 0:ee.date)+" · Ca hiện tại: "+u(((se=e.assignment)==null?void 0:se.shiftSymbol)||((pe=e.assignment)==null?void 0:pe.shiftId)),1)],64))]),e.initialAction?D("",!0):(a(),s("fieldset",{key:0,class:"action-options",disabled:K.value||m.value},[M[14]||(M[14]=n("legend",null,"Thao tác",-1)),n("label",{class:te({selected:c.value==="shift"})},[ae(n("input",{"onUpdate:modelValue":M[0]||(M[0]=J=>c.value=J),type:"radio",value:"shift",name:"schedule-edit-action"},null,512),[[Ct,c.value]]),M[12]||(M[12]=O("Đổi ca",-1))],2),n("label",{class:te({selected:c.value==="leave"})},[ae(n("input",{"onUpdate:modelValue":M[1]||(M[1]=J=>c.value=J),type:"radio",value:"leave",name:"schedule-edit-action"},null,512),[[Ct,c.value]]),M[13]||(M[13]=O("Nghỉ phép",-1))],2)],8,xa)),m.value?(a(),s("p",Aa,"Đang tải danh mục ca...")):D("",!0),c.value==="shift"?(a(),s(H,{key:2},[n("label",null,[M[15]||(M[15]=O("Ca làm việc mới *",-1)),j(W(Ze),{modelValue:d.value,"onUpdate:modelValue":M[2]||(M[2]=J=>d.value=J),options:_.value,"option-label":"label","option-value":"id",placeholder:"Chọn ca làm việc",disabled:m.value||K.value},null,8,["modelValue","options","disabled"])]),!m.value&&!G.value&&!_.value.length?(a(),s("p",La," Chưa có ca làm việc khác trong bộ phận để đổi. ")):D("",!0)],64)):(a(),s(H,{key:3},[n("div",Pa,[n("label",null,[M[16]||(M[16]=O("Từ ngày *",-1)),j(W(Qe),{modelValue:v.fromDate,"onUpdate:modelValue":M[3]||(M[3]=J=>v.fromDate=J),type:"date",min:W(L),required:"",disabled:K.value||m.value},null,8,["modelValue","min","disabled"])]),n("label",null,[M[17]||(M[17]=O("Giờ bắt đầu nghỉ *",-1)),j(W(Qe),{modelValue:v.fromTime,"onUpdate:modelValue":M[4]||(M[4]=J=>v.fromTime=J),type:"time",required:"",disabled:K.value||m.value},null,8,["modelValue","disabled"])]),n("label",null,[M[18]||(M[18]=O("Đến ngày *",-1)),j(W(Qe),{modelValue:v.toDate,"onUpdate:modelValue":M[5]||(M[5]=J=>v.toDate=J),type:"date",min:v.fromDate||W(L),required:"",disabled:K.value||m.value},null,8,["modelValue","min","disabled"])]),n("label",null,[M[19]||(M[19]=O("Giờ kết thúc nghỉ *",-1)),j(W(Qe),{modelValue:v.toTime,"onUpdate:modelValue":M[6]||(M[6]=J=>v.toTime=J),type:"time",required:"",disabled:K.value||m.value},null,8,["modelValue","disabled"])])]),n("label",null,[M[20]||(M[20]=O("Lý do *",-1)),j(W(Ot),{modelValue:v.reason,"onUpdate:modelValue":M[7]||(M[7]=J=>v.reason=J),rows:"3",required:"",placeholder:"Nhập lý do nghỉ phép",disabled:K.value||m.value},null,8,["modelValue","disabled"])]),n("label",null,[M[21]||(M[21]=O("Loại nghỉ phép *",-1)),j(W(Ze),{modelValue:v.leaveTypeId,"onUpdate:modelValue":M[8]||(M[8]=J=>v.leaveTypeId=J),options:N.value,"option-label":"label","option-value":"id",placeholder:"Chọn loại nghỉ phép",disabled:K.value||m.value},null,8,["modelValue","options","disabled"])]),M[25]||(M[25]=n("p",{class:"hint"}," Nhập giờ bắt đầu và kết thúc nghỉ phép, sau đó tải phân công để kiểm tra các ca trong khoảng đã chọn. ",-1)),n("div",Ba,[j(ke,{type:"button",label:P.value?"Tải lại phân công ca":"Tải phân công ca",icon:"pi pi-refresh",outlined:"",loading:b.value,disabled:K.value||m.value||!v.fromDate||!v.toDate||!v.fromTime||!v.toTime,onClick:$e},null,8,["label","loading","disabled"]),P.value?(a(),s("span",Oa,"Đã tải "+u(f.value.length)+" phân công ca từ hệ thống.",1)):!b.value&&!k.value?(a(),s("span",Ma,"Tải phân công ca để kiểm tra danh sách trước khi xác nhận.")):D("",!0)]),P.value&&f.value.length?(a(),s("section",Ua,[M[23]||(M[23]=n("div",{class:"preview-heading"},[n("strong",null,"Ca làm việc đã phân công")],-1)),n("div",Ra,[n("table",null,[M[22]||(M[22]=n("thead",null,[n("tr",null,[n("th",null,"ID"),n("th",null,"Ngày làm việc"),n("th",null,"Ca"),n("th",null,"Bắt đầu ca"),n("th",null,"Kết thúc ca"),n("th",null,"Bắt đầu nghỉ"),n("th",null,"Kết thúc nghỉ"),n("th",null,"Cập nhật")])],-1)),n("tbody",null,[(a(!0),s(H,null,z(f.value,J=>(a(),s("tr",{key:J.id},[n("td",null,u(J.id),1),n("td",null,u(J.date),1),n("td",null,u(J.shiftSymbol),1),n("td",null,u(J.startDate||J.date)+" "+u(J.startTime),1),n("td",null,u(J.endDate||ie(J.startDate||J.date,J.crossDay?1:0))+" "+u(J.endTime),1),n("td",null,u(X.value.has(J.id)?ue(X.value.get(J.id).start):"—"),1),n("td",null,u(X.value.has(J.id)?ue(X.value.get(J.id).end):"—"),1),n("td",null,u(X.value.has(J.id)?X.value.get(J.id).fullTime?"Toàn ca":"Một phần ca":"Không cập nhật"),1)]))),128))])])])])):D("",!0),b.value?(a(),s("p",Fa,[...M[24]||(M[24]=[n("i",{class:"pi pi-spin pi-spinner","aria-hidden":"true"},null,-1),O(" Đang tải lịch trong khoảng nghỉ... ",-1)])])):k.value?(a(),s("p",Ha,[O(u(k.value)+" ",1),j(ke,{type:"button",label:"Tải lại lịch",text:"",disabled:K.value,onClick:$e},null,8,["disabled"])])):E.value.error?(a(),s("p",Ka,u(E.value.error),1)):D("",!0)],64)),G.value?(a(),s("p",Ga,[O(u(G.value),1),p.value.length?D("",!0):(a(),Te(ke,{key:0,type:"button",label:"Tải lại danh mục",text:"",disabled:K.value||m.value,onClick:me},null,8,["disabled"]))])):D("",!0),n("footer",null,[j(ke,{type:"button",label:"Hủy",severity:"secondary",outlined:"",disabled:K.value,onClick:M[9]||(M[9]=J=>l("close"))},null,8,["disabled"]),j(ke,{type:"submit",label:"Xác nhận",loading:K.value,disabled:m.value||!p.value.length||(c.value==="shift"?!d.value:!P.value||b.value||!!k.value||!!E.value.error||!v.leaveTypeId||!v.reason.trim())},null,8,["loading","disabled"])])],32)]}),_:1},8,["visible","header","closable","close-on-escape","style"]))}}),Kt=tn(za,[["__scopeId","data-v-96f9caa6"]]),ja=Ve`
  query LeaveHistory(
    $tuNgay: DateTime!
    $denNgay: DateTime!
    $maBoPhan: String
    $maNhanVien: String
  ) {
    leaveHistory(tuNgay: $tuNgay, denNgay: $denNgay, maBoPhan: $maBoPhan, maNhanVien: $maNhanVien) {
      isResults
      message
      data {
        id
        maNhanVien
        hoTen
        maBoPhan
        tenBoPhan
        ngayDangKyLichNghi
        tuNgay
        denNgay
        lyDoNghi
        loaiNghiPhep
        tenLoaiNghi
        soNgayNghi
        tinhTrang
        createdBy
        createdAt
      }
    }
  }
`;async function Xa(e,r,i=null,t=null){const{data:l}=await xe.query({query:ja,variables:{tuNgay:e+"T00:00:00+07:00",denNgay:r+"T23:59:59.999+07:00",maBoPhan:i,maNhanVien:t},fetchPolicy:"no-cache",errorPolicy:"none"}),c=l==null?void 0:l.leaveHistory;if(!(c!=null&&c.isResults)||!Array.isArray(c.data))throw new Error((c==null?void 0:c.message)||"Không thể tải lịch sử nghỉ phép.");return c.data.filter(d=>!!d)}function Wa(e,r=null){const i=(r||e).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").toLowerCase();let t;if(/khong luong|unpaid|sans solde/.test(i))t=215;else if(/thai san|maternity|paternity|maternite/.test(i))t=275;else if(/om|benh|sick|maladie/.test(i))t=35;else if(/phep nam|hang nam|annual|annuel/.test(i))t=150;else if(/viec rieng|gia dinh|personal|family|familial/.test(i))t=205;else{let l=0;for(const c of e)l=l*31+c.charCodeAt(0)>>>0;t=l%360}return{background:"hsl("+t+", 75%, 94%)",border:"hsl("+t+", 55%, 65%)",text:"hsl("+t+", 65%, 25%)"}}function ot(e){return Date.parse(/(?:Z|[+-]\d{2}:?\d{2})$/i.test(e)?e:e+(e.includes("T")?"":"T00:00:00")+"+07:00")}function Ya(e,r){const i=new Map;for(const t of e){const l=ot(t.tuNgay),c=ot(t.denNgay);if(!(!Number.isFinite(l)||!Number.isFinite(c)||c<=l))for(const d of r){const v=ot(d);if(l<v+864e5&&c>v){const p=t.maNhanVien+":"+d,f=i.get(p)||[];f.push(t),i.set(p,f)}}}return i}const Ja=Ve`
  query DanhSachNgayLe {
    danhSachNgayLe(nam: null) {
      isResults
      message
      data {
        id
        tenNgayLe
        tuNgay
        denNgay
        nam
        loaiNgayLe
        ghiChu
        trangThai
        createdAt
        createdBy
        updatedAt
        updatedBy
      }
    }
  }
`;async function Qa(){const{data:e}=await xe.query({query:Ja,fetchPolicy:"no-cache",errorPolicy:"none"}),r=e==null?void 0:e.danhSachNgayLe;if(!(r!=null&&r.isResults)||!Array.isArray(r.data))throw new Error((r==null?void 0:r.message)||"Không thể tải danh sách ngày lễ.");return r.data.filter(i=>!!i&&i.trangThai===!0)}function Qn(e,r){const i=new Date(`${e}T12:00:00`);r==="week"&&i.setDate(i.getDate()-(i.getDay()+6)%7),r==="month"&&i.setDate(1);const t=new Date(i);r==="week"&&t.setDate(t.getDate()+6),r==="month"&&t.setMonth(t.getMonth()+1,0);const l=c=>`${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,"0")}-${String(c.getDate()).padStart(2,"0")}`;return{from:l(i),to:l(t)}}const Za={class:"calendar-header"},_a={class:"calendar-heading"},eo={class:"calendar-heading-icon","aria-hidden":"true"},no={class:"calendar-subtitle"},to={class:"calendar-controls"},lo={class:"control-field"},ao={class:"date-navigation"},oo=["disabled"],io=["disabled"],so=["disabled"],ro={class:"control-field"},uo=["disabled"],co={class:"control-field department-control"},ho=["disabled"],vo=["value"],mo={class:"control-field search-control"},po={class:"search-input-wrap"},go=["disabled"],fo=["disabled"],yo={class:"calendar-hint"},bo={key:0,class:"leave-legend","aria-label":"Chú giải loại nghỉ phép"},qo={key:1,role:"status"},ko={key:2},wo={key:3,role:"status"},To={key:4,role:"alert",class:"error"},Co={ref:"scrollArea",class:"calendar-scroll"},$o={key:0,class:"holiday-name"},Do={class:"number"},No={class:"person"},Io=["data-employee-id","data-date","aria-disabled","title","onPointerdown","onPointerenter"],So=["data-assignment-id","disabled","onClick"],Eo={key:0,class:"holiday-name"},Vo=["title","aria-label"],xo={key:0},Ao=Se({__name:"ScheduleActionCalendar",props:{mode:{},employees:{},departments:{},canEdit:{type:Boolean}},setup(e){const r=e,i=C(Vn()),t=C("month"),l=C(""),c=C(""),d=C([]),v=C(!1),p=C([]),f=C([]),w=C(!1),g=C(!1),P=C(""),m=Z(()=>Qn(i.value||Vn(),t.value)),b=Z(()=>{const U=[],I=new Date(m.value.from+"T12:00:00Z");for(;I.toISOString().slice(0,10)<=m.value.to;)U.push(I.toISOString().slice(0,10)),I.setUTCDate(I.getUTCDate()+1);return U}),K=Z(()=>d.value.filter(U=>U.trangThai).map(U=>({...U,from:We(U.tuNgay),to:We(U.denNgay)}))),G=U=>K.value.filter(I=>I.from<=U&&I.to>=U),k=U=>G(U).map(I=>I.tenNgayLe).join(" · ");function S(U,I){const[q,$]=[U,I].sort();return K.value.some(V=>V.from<=$&&V.to>=q)}const T=Z(()=>{const U=new Map(r.employees.map(I=>[I.code,I]));if(r.mode==="leave")for(const I of p.value){const q=U.get(I.maNhanVien);U.set(I.maNhanVien,{...q,code:I.maNhanVien,name:I.hoTen||(q==null?void 0:q.name)||I.maNhanVien,department:I.tenBoPhan||(q==null?void 0:q.department)||""})}return[...U.values()]}),L=Z(()=>T.value.filter(U=>(!l.value||U.department===l.value)&&(U.code+" "+U.name).toLocaleLowerCase().includes(c.value.toLocaleLowerCase()))),_=Z(()=>Ya(p.value,b.value)),N=(U,I)=>_.value.get(U+":"+I)||[],E=Z(()=>[...new Map(p.value.map(U=>[U.loaiNghiPhep,{code:U.loaiNghiPhep,name:U.tenLoaiNghi||U.loaiNghiPhep,...Wa(U.loaiNghiPhep,U.tenLoaiNghi)}])).values()].sort((U,I)=>U.name.localeCompare(I.name,"vi"))),X=U=>{const I=E.value.find(q=>q.code===U.loaiNghiPhep);return{backgroundColor:I.background,borderColor:I.border,color:I.text}};function ie(U,I){const q=N(U,I);return r.mode!=="leave"||!q.length?{}:q.length===1?{backgroundColor:X(q[0]).backgroundColor}:{background:"linear-gradient(135deg, "+q.map((V,x)=>X(V).backgroundColor+" "+x*100/q.length+"% "+(x+1)*100/q.length+"%").join(", ")+")"}}function ue(U){return[U.tenLoaiNghi||U.loaiNghiPhep,U.hoTen||U.maNhanVien,U.tuNgay+" → "+U.denNgay,U.soNgayNghi+" ngày",U.lyDoNghi,"Trạng thái: "+U.tinhTrang].filter(Boolean).join(`
`)}Lt(()=>!g.value),Pt(()=>!g.value);let me=0;async function he(){var I;const U=++me;w.value=!0,P.value="",f.value=[],p.value=[],d.value=[],v.value=!1;try{if(r.mode==="leave"){const q=((I=r.departments.find(x=>x.name===l.value))==null?void 0:I.code)||null,[$,V]=await Promise.all([Xa(m.value.from,m.value.to,q),Qa()]);U===me&&(p.value=$,d.value=V,v.value=!0)}else{const q=await Gn(m.value.from,m.value.to);U===me&&(f.value=q.assignments)}}catch(q){U===me&&(P.value=we(q))}finally{U===me&&(w.value=!1)}}re([m,()=>r.mode,l],he,{immediate:!0});function De(U){const I=new Date(i.value+"T12:00:00Z");t.value==="month"?(I.setUTCDate(1),I.setUTCMonth(I.getUTCMonth()+U)):I.setUTCDate(I.getUTCDate()+U*7),i.value=I.toISOString().slice(0,10)}const $e=(U,I)=>f.value.filter(q=>q.employeeId===U&&q.date===I),ve=U=>{var I;return((I=T.value.find(q=>q.code===U))==null?void 0:I.name)||U},B=C(),M=C(),ee=C(),se=C(),pe=U=>new Date(U+"T12:00:00Z").getUTCDay()===0;function J(U,I){const[q,$]=[U,I].sort(),V=new Date(q+"T12:00:00Z"),x=(Date.parse($+"T12:00:00Z")-V.getTime())/864e5;return(7-V.getUTCDay())%7<=x}function ge(U,I,q){U.button!==0||r.mode!=="leave"||!r.canEdit||g.value||w.value||Ae(q)||pe(q)||!v.value||G(q).length>0||(U.preventDefault(),M.value={employeeId:I,fromDate:q,toDate:q})}function Ye(U,I){var q;((q=M.value)==null?void 0:q.employeeId)===U&&!Ae(I)&&v.value&&!S(M.value.fromDate,I)&&!J(M.value.fromDate,I)&&(M.value.toDate=I)}function mn(U,I){const q=M.value;return(q==null?void 0:q.employeeId)===U&&!pe(I)&&!G(I).length&&I>=[q.fromDate,q.toDate].sort()[0]&&I<=[q.fromDate,q.toDate].sort()[1]}function ln(){const U=M.value;if(!U)return;if(!v.value||S(U.fromDate,U.toDate)||J(U.fromDate,U.toDate)){M.value=void 0;return}const[I,q]=[U.fromDate,U.toDate].sort();se.value={fromDate:I,toDate:q},ee.value={id:"",employeeId:U.employeeId,date:I,shiftId:"",scheduleType:"ROTATING",status:"SCHEDULED",note:"",revision:1},M.value=void 0}function je(){M.value=void 0}return window.addEventListener("pointerup",ln),window.addEventListener("pointercancel",je),window.addEventListener("blur",je),hn(()=>{++me,window.removeEventListener("pointerup",ln),window.removeEventListener("pointercancel",je),window.removeEventListener("blur",je)}),re([m,()=>r.mode,l,c],()=>{je(),B.value=void 0,ee.value=void 0}),(U,I)=>{var $,V,x;const q=Jn("RouterLink");return a(),s("section",{class:te(["action-calendar",{"month-view":t.value==="month"}])},[n("header",Za,[n("div",_a,[n("span",eo,[n("i",{class:te(e.mode==="exchange"?"pi pi-arrow-right-arrow-left":"pi pi-calendar-minus")},null,2)]),n("div",null,[n("h2",null,u(e.mode==="exchange"?"Đổi ca":"Lịch nghỉ phép"),1),n("span",no,u(L.value.length)+" nhân viên · "+u(t.value==="month"?"Lịch tháng":"Lịch tuần"),1)])]),j(q,{class:"calendar-back",to:"/schedules/assign"},{default:ce(()=>[...I[11]||(I[11]=[n("i",{class:"pi pi-arrow-left","aria-hidden":"true"},null,-1),O("Quay về lịch phân công",-1)])]),_:1})]),n("div",to,[n("div",lo,[I[14]||(I[14]=n("span",{class:"control-label"},"Thời gian",-1)),n("div",ao,[n("button",{type:"button",class:"calendar-nav-button",disabled:g.value,"aria-label":"Xem kỳ trước",onClick:I[0]||(I[0]=A=>De(-1))},[...I[12]||(I[12]=[n("i",{class:"pi pi-chevron-left","aria-hidden":"true"},null,-1)])],8,oo),ae(n("input",{"onUpdate:modelValue":I[1]||(I[1]=A=>i.value=A),class:"control-input calendar-date",type:"date","aria-label":"Ngày xem lịch",disabled:g.value},null,8,io),[[Xe,i.value]]),n("button",{type:"button",class:"calendar-nav-button",disabled:g.value,"aria-label":"Xem kỳ sau",onClick:I[2]||(I[2]=A=>De(1))},[...I[13]||(I[13]=[n("i",{class:"pi pi-chevron-right","aria-hidden":"true"},null,-1)])],8,so)])]),n("label",ro,[I[16]||(I[16]=n("span",{class:"control-label"},"Chế độ xem",-1)),ae(n("select",{"onUpdate:modelValue":I[3]||(I[3]=A=>t.value=A),class:"control-input",disabled:g.value},[...I[15]||(I[15]=[n("option",{value:"month"},"Lịch tháng",-1),n("option",{value:"week"},"Lịch tuần",-1)])],8,uo),[[Ie,t.value]])]),n("label",co,[I[18]||(I[18]=n("span",{class:"control-label"},"Bộ phận",-1)),ae(n("select",{"onUpdate:modelValue":I[4]||(I[4]=A=>l.value=A),class:"control-input",disabled:g.value},[I[17]||(I[17]=n("option",{value:""},"Tất cả bộ phận",-1)),(a(!0),s(H,null,z(e.departments,A=>(a(),s("option",{key:A.code,value:A.name},u(A.name),9,vo))),128))],8,ho),[[Ie,l.value]])]),n("label",mo,[I[20]||(I[20]=n("span",{class:"control-label"},"Nhân viên",-1)),n("span",po,[I[19]||(I[19]=n("i",{class:"pi pi-search","aria-hidden":"true"},null,-1)),ae(n("input",{"onUpdate:modelValue":I[5]||(I[5]=A=>c.value=A),class:"control-input",placeholder:"Tìm mã hoặc họ tên",disabled:g.value},null,8,go),[[Xe,c.value]])])]),n("button",{type:"button",class:"calendar-reload",disabled:w.value||g.value,onClick:he},[n("i",{class:te(w.value?"pi pi-spin pi-spinner":"pi pi-refresh"),"aria-hidden":"true"},null,2),I[21]||(I[21]=O("Tải lại ",-1))],8,fo)]),n("p",yo,u(e.mode==="exchange"?"Bấm vào ca làm việc để chọn nhân viên đổi ca.":"Kéo chọn các ngày trên cùng hàng nhân viên, sau đó nhập giờ và loại nghỉ phép."),1),e.mode==="leave"&&E.value.length?(a(),s("div",bo,[(a(!0),s(H,null,z(E.value,A=>(a(),s("span",{key:A.code,style:dn({backgroundColor:A.background,color:A.text,borderColor:A.border})},u(A.name)+" ("+u(A.code)+")",5))),128))])):D("",!0),e.mode==="leave"&&!w.value&&!P.value&&!p.value.length?(a(),s("p",qo," Không có lịch nghỉ phép trong khoảng thời gian đã chọn. ")):D("",!0),e.canEdit?D("",!0):(a(),s("p",ko,"Bạn không có quyền điều chỉnh lịch.")),w.value?(a(),s("p",wo,"Đang tải lịch…")):D("",!0),P.value?(a(),s("p",To,u(P.value),1)):D("",!0),n("div",Co,[n("table",null,[n("thead",null,[n("tr",null,[I[22]||(I[22]=n("th",{class:"number"},"STT",-1)),I[23]||(I[23]=n("th",{class:"person"},"Họ và tên / Bộ phận / Chức vụ",-1)),(a(!0),s(H,null,z(b.value,A=>(a(),s("th",{key:A,class:te(["date-column",{"holiday-heading":e.mode==="leave"&&G(A).length}])},[O(u(A.slice(8))+"/"+u(A.slice(5,7)),1),n("small",null,u(new Date(A+"T12:00:00").toLocaleDateString("vi-VN",{weekday:"short"})),1),e.mode==="leave"&&G(A).length?(a(),s("small",$o,u(k(A)),1)):D("",!0)],2))),128))])]),n("tbody",null,[(a(!0),s(H,null,z(L.value,(A,Q)=>(a(),s("tr",{key:A.code},[n("td",Do,u(Q+1),1),n("th",No,[O(u(A.name),1),n("small",null,u(A.code),1),n("small",null,u(A.department)+" / "+u(A.position||"—"),1)]),(a(!0),s(H,null,z(b.value,ne=>(a(),s("td",{key:ne,class:te(["date-column",{selected:mn(A.code,ne),"sunday-locked":e.mode==="leave"&&pe(ne),"holiday-locked":e.mode==="leave"&&G(ne).length>0,past:W(Ae)(ne),"has-leave":e.mode==="leave"&&N(A.code,ne).length>0}]),"data-employee-id":A.code,"data-date":ne,style:dn(ie(A.code,ne)),"aria-disabled":e.mode==="leave"&&(!v.value||pe(ne)||G(ne).length>0)?!0:void 0,title:e.mode==="leave"&&G(ne).length?"Ngày nghỉ lễ: "+k(ne):e.mode==="leave"&&pe(ne)?"Không thể chọn nghỉ phép vào Chủ nhật.":void 0,onPointerdown:le=>ge(le,A.code,ne),onPointerenter:le=>Ye(A.code,ne)},[e.mode==="exchange"?(a(!0),s(H,{key:0},z($e(A.code,ne),le=>(a(),s("button",{key:le.id,class:"sticker",type:"button","data-assignment-id":le.id,disabled:!e.canEdit||g.value||w.value,title:"Bấm để chọn nhân viên đổi ca",onClick:Ke=>B.value=le},[n("strong",null,u(le.shiftSymbol||le.shiftId),1),n("small",null,u(le.startTime)+"–"+u(le.endTime)+u(le.crossDay?" (+1)":""),1)],8,So))),128)):(a(),s(H,{key:1},[G(ne).length?(a(),s("span",Eo,u(k(ne)),1)):D("",!0),(a(!0),s(H,null,z(N(A.code,ne),le=>(a(),s("span",{key:le.id,class:"leave-badge",style:dn(X(le)),title:ue(le),"aria-label":ue(le),tabindex:"0"},u(le.tenLoaiNghi||le.loaiNghiPhep),13,Vo))),128))],64))],46,Io))),128))]))),128))])]),L.value.length?D("",!0):(a(),s("p",xo,"Không tìm thấy nhân viên."))],512),j(Rt,{onBusy:I[6]||(I[6]=A=>g.value=A),assignment:B.value,"department-code":(($=e.departments.find(A=>A.name===l.value))==null?void 0:$.code)||((V=B.value)==null?void 0:V.departmentCode)||null,"employee-name":B.value?ve(B.value.employeeId):"",onClose:I[7]||(I[7]=A=>B.value=void 0),onConfirmed:he},null,8,["assignment","department-code","employee-name"]),j(Kt,{assignment:ee.value,"initial-action":"leave","leave-range":se.value,"department-code":((x=e.departments.find(A=>{var Q;return A.name===((Q=T.value.find(ne=>{var le;return ne.code===((le=ee.value)==null?void 0:le.employeeId)}))==null?void 0:Q.department)}))==null?void 0:x.code)||"","employee-name":ee.value?ve(ee.value.employeeId):"",onBusy:I[8]||(I[8]=A=>g.value=A),onClose:I[9]||(I[9]=A=>ee.value=void 0),onSaved:I[10]||(I[10]=A=>{ee.value=void 0,he()})},null,8,["assignment","leave-range","department-code","employee-name"])],2)}}}),Lo=tn(Ao,[["__scopeId","data-v-764d868a"]]),Po={key:0},Bo={class:"actions"},Oo={key:1},Mo={key:0},Uo={class:"schedule-dialog"},Ro={key:0,class:"error"},Fo={class:"preview-calendar-toolbar"},Ho=["aria-label"],Ko={key:0},Go=["aria-label"],zo={class:"preview-calendar-mode"},jo={class:"preview-calendar-table"},Xo={class:"preview-calendar-employee"},Wo={key:0},Yo={key:0},Jo={key:0},Qo=["colspan"],Zo={key:1,class:"error",role:"alert",style:{"white-space":"pre-line"}},_o={class:"actions"},ei=["disabled"],ni=["disabled"],ti=Se({__name:"ScheduleAssignmentDialogs",props:Be({history:{},issues:{},error:{},busy:{type:Boolean},today:{},canEdit:{type:Boolean},name:{type:Function},employeeName:{type:Function},fmt:{type:Function},label:{type:Function},symbol:{type:Function},pending:{type:Function},saveAssignments:{type:Function},editAssignment:{type:Function}},{detail:{},detailModifiers:{},detailOpen:{type:Boolean,required:!0},detailOpenModifiers:{},historyOpen:{type:Boolean,required:!0},historyOpenModifiers:{},preview:{required:!0},previewModifiers:{},previewOpen:{type:Boolean,required:!0},previewOpenModifiers:{}}),emits:Be(["closePreview"],["update:detail","update:detailOpen","update:historyOpen","update:preview","update:previewOpen"]),setup(e,{emit:r}){const i=de(e,"detail"),t=de(e,"detailOpen"),l=de(e,"historyOpen"),c=de(e,"preview"),d=de(e,"previewOpen"),v=e,p=r,f=C("week"),w=C(v.today),g=["T2","T3","T4","T5","T6","T7","CN"];re(d,k=>{if(!k)return;const S=c.value.map(_=>_.date).sort(),T=S[0]||v.today,L=S[S.length-1]||T;w.value=T,f.value=P(T,L)>6?"month":"week"});function P(k,S){return Math.round((new Date(`${S}T12:00:00`).getTime()-new Date(`${k}T12:00:00`).getTime())/864e5)}const m=Z(()=>{const k=new Date(w.value+"T12:00:00");f.value==="week"?k.setDate(k.getDate()-(k.getDay()+6)%7):k.setDate(1);const S=f.value==="week"?7:new Date(k.getFullYear(),k.getMonth()+1,0).getDate();return Array.from({length:S},(T,L)=>{const _=new Date(k);return _.setDate(_.getDate()+L),`${_.getFullYear()}-${String(_.getMonth()+1).padStart(2,"0")}-${String(_.getDate()).padStart(2,"0")}`})}),b=Z(()=>[...new Set(c.value.map(S=>S.employeeId))].map(S=>({code:S,name:v.employeeName(S)})).sort((S,T)=>S.name.localeCompare(T.name,"vi")));function K(k,S){return c.value.filter(T=>T.employeeId===k&&T.date===S)}function G(k){const S=new Date(w.value+"T12:00:00");f.value==="month"?(S.setDate(1),S.setMonth(S.getMonth()+k)):S.setDate(S.getDate()+k*7),w.value=`${S.getFullYear()}-${String(S.getMonth()+1).padStart(2,"0")}-${String(S.getDate()).padStart(2,"0")}`}return(k,S)=>(a(),s(H,null,[j(W(Mt),{visible:t.value,"onUpdate:visible":S[2]||(S[2]=T=>t.value=T),header:"Chi tiết phân công",position:"right",class:"schedule-drawer"},{default:ce(()=>[i.value?(a(),s(H,{key:0},[n("h3",null,u(e.name(i.value.employeeId)),1),n("p",null,u(e.fmt(i.value.date))+" · "+u(i.value.scheduleType==="ADMINISTRATIVE"?"Hành chính":"Xoay ca"),1),n("p",null,u(e.label(i.value)),1),n("p",null,u(i.value.note||"Chưa có ghi chú"),1),e.pending(i.value)?(a(),s("p",Po,"↔ Có yêu cầu đổi ca chờ duyệt")):D("",!0),n("div",Bo,[n("button",{onClick:S[0]||(S[0]=T=>l.value=!l.value)},"Lịch sử"),e.canEdit?(a(),s("button",{key:0,onClick:S[1]||(S[1]=(...T)=>e.editAssignment&&e.editAssignment(...T))},"Sửa phân công")):D("",!0)]),l.value?(a(),s("ul",Oo,[(a(!0),s(H,null,z(e.history.filter(T=>{var L;return T.assignmentId===((L=i.value)==null?void 0:L.id)}),(T,L)=>(a(),s("li",{key:L},u(T.action)+" · "+u(new Date(T.date).toLocaleString("vi-VN")),1))),128)),e.history.some(T=>{var L;return T.assignmentId===((L=i.value)==null?void 0:L.id)})?D("",!0):(a(),s("li",Mo," Chưa có lịch sử thay đổi. "))])):D("",!0)],64)):D("",!0)]),_:1},8,["visible"]),j(W(Re),{visible:d.value,"onUpdate:visible":S[9]||(S[9]=T=>d.value=T),modal:"",header:"Xem trước phân công",style:{width:"1000px",maxWidth:"95vw"}},{default:ce(()=>[n("div",Uo,[n("p",null,u(c.value.length)+" phân công · "+u(b.value.length)+" nhân viên",1),e.issues.length?(a(),s("div",Ro,[n("strong",null,"⚠ "+u(e.issues.length)+" xung đột — không thể lưu",1),(a(!0),s(H,null,z(e.issues,(T,L)=>(a(),s("p",{key:L},[O(u(e.name(T.row.employeeId))+" · "+u(e.fmt(T.row.date)),1),S[10]||(S[10]=n("br",null,null,-1)),O(" Ca mới: "+u(e.label(T.row)),1),S[11]||(S[11]=n("br",null,null,-1)),O(" Đã có: "+u(e.label(T.existing))+" · "+u(e.fmt(T.existing.date)),1),S[12]||(S[12]=n("br",null,null,-1)),O(" "+u(T.reason),1)]))),128))])):D("",!0),n("div",Fo,[n("button",{type:"button","aria-label":f.value==="week"?"Tuần trước":"Tháng trước",onClick:S[3]||(S[3]=T=>G(-1))}," ‹ ",8,Ho),m.value.length?(a(),s("strong",Ko,u(e.fmt(m.value[0]))+" – "+u(e.fmt(m.value[m.value.length-1])),1)):D("",!0),n("button",{type:"button","aria-label":f.value==="week"?"Tuần sau":"Tháng sau",onClick:S[4]||(S[4]=T=>G(1))}," › ",8,Go),n("div",zo,[n("button",{class:te({active:f.value==="week"}),onClick:S[5]||(S[5]=T=>f.value="week")}," Tuần ",2),n("button",{class:te({active:f.value==="month"}),onClick:S[6]||(S[6]=T=>f.value="month")}," Tháng ",2)])]),n("div",{class:te(["preview-calendar-scroll","mode-"+f.value])},[n("table",jo,[n("thead",null,[n("tr",null,[S[13]||(S[13]=n("th",{class:"preview-calendar-employee"},"Nhân viên",-1)),(a(!0),s(H,null,z(m.value,T=>(a(),s("th",{key:T,class:te({weekend:[0,6].includes(new Date(T+"T12:00:00").getDay()),today:T===e.today})},[O(u(g[(new Date(T+"T12:00:00").getDay()+6)%7])+" ",1),n("small",null,u(Number(T.slice(-2)))+"/"+u(Number(T.slice(5,7))),1)],2))),128))])]),n("tbody",null,[(a(!0),s(H,null,z(b.value,T=>(a(),s("tr",{key:T.code},[n("th",Xo,[n("strong",null,u(T.name),1),n("small",null,u(T.code),1)]),(a(!0),s(H,null,z(m.value,L=>(a(),s("td",{key:L,class:te({weekend:[0,6].includes(new Date(L+"T12:00:00").getDay())})},[(a(!0),s(H,null,z(K(T.code,L),_=>(a(),s(H,{key:_.id+_.shiftId},[n("strong",null,u(_.status==="OFF"?"Nghỉ":e.symbol(_)),1),_.startTime&&_.endTime?(a(),s("small",Wo,u(W(Le)(_.startTime))+"–"+u(W(Le)(_.endTime))+u(_.crossDay?" (+1 ngày)":""),1)):D("",!0)],64))),128)),K(T.code,L).length?D("",!0):(a(),s("span",Yo,"—"))],2))),128))]))),128)),b.value.length?D("",!0):(a(),s("tr",Jo,[n("td",{colspan:m.value.length+1,class:"empty-state"}," Không có phân công trong khoảng này. ",8,Qo)]))])])],2),e.error?(a(),s("p",Zo,u(e.error),1)):D("",!0),n("div",_o,[n("button",{disabled:e.busy,onClick:S[7]||(S[7]=T=>p("closePreview"))},"Quay lại",8,ei),n("button",{class:"primary",disabled:e.busy||!!e.issues.length||!c.value.length,onClick:S[8]||(S[8]=(...T)=>e.saveAssignments&&e.saveAssignments(...T))},u(e.busy?"Đang lưu…":"Lưu phân công"),9,ni)])])]),_:1},8,["visible"])],64))}}),li={class:"table-scroll schedule-dialog"},ai={class:"report"},oi={key:0},ii=Se({__name:"ScheduleDrillDialog",props:Be({assignments:{},name:{type:Function},fmt:{type:Function},label:{type:Function}},{open:{type:Boolean,required:!0},openModifiers:{}}),emits:["update:open"],setup(e){const r=de(e,"open");return(i,t)=>(a(),Te(W(Re),{visible:r.value,"onUpdate:visible":t[0]||(t[0]=l=>r.value=l),modal:"",header:"Lịch chi tiết",style:{width:"800px",maxWidth:"95vw"}},{default:ce(()=>[n("div",li,[n("table",ai,[t[2]||(t[2]=n("thead",null,[n("tr",null,[n("th",null,"Nhân viên"),n("th",null,"Ngày"),n("th",null,"Phân công")])],-1)),n("tbody",null,[(a(!0),s(H,null,z(e.assignments,l=>(a(),s("tr",{key:l.id},[n("td",null,u(e.name(l.employeeId)),1),n("td",null,u(e.fmt(l.date)),1),n("td",null,u(e.label(l)),1)]))),128)),e.assignments.length?D("",!0):(a(),s("tr",oi,[...t[1]||(t[1]=[n("td",{colspan:"3"},"Chưa có lịch phù hợp.",-1)])]))])])])]),_:1},8,["visible"]))}}),si={class:"schedule-dialog"},ri=["value"],ui={key:0},di=["value"],ci={key:1},hi=["value"],vi={key:2,class:"error"},mi=["disabled"],pi={key:0},gi={key:1},fi={key:2},yi={key:0,class:"error"},bi={class:"actions"},qi=["disabled"],ki=["disabled"],wi=Se({__name:"ScheduleSwapDialogs",props:Be({scheduled:{},assignments:{},shifts:{},busy:{type:Boolean},error:{},canApprove:{type:Boolean},assignmentLabel:{type:Function},shiftName:{type:Function},swapBefore:{type:Function},swapAfter:{type:Function}},{open:{type:Boolean,required:!0},openModifiers:{},detailOpen:{type:Boolean,required:!0},detailOpenModifiers:{},swap:{required:!0},swapModifiers:{},mode:{required:!0},modeModifiers:{},detail:{},detailModifiers:{},decision:{required:!0},decisionModifiers:{}}),emits:Be(["send","decide"],["update:open","update:detailOpen","update:swap","update:mode","update:detail","update:decision"]),setup(e,{emit:r}){const i=de(e,"open"),t=de(e,"detailOpen"),l=de(e,"swap"),c=de(e,"mode"),d=de(e,"detail"),v=de(e,"decision"),p=e,f=r,w={PENDING:"Chờ duyệt",APPROVED:"Đã duyệt",REJECTED:"Từ chối",CANCELLED:"Đã hủy"},g=Z(()=>p.assignments.find(P=>P.id===l.value.assignmentId));return(P,m)=>(a(),s(H,null,[j(W(Re),{visible:i.value,"onUpdate:visible":m[7]||(m[7]=b=>i.value=b),modal:"",header:"Tạo yêu cầu đổi ca",style:{width:"650px",maxWidth:"95vw"}},{default:ce(()=>[n("div",si,[n("label",null,[m[13]||(m[13]=O(" Ca muốn đổi * ",-1)),ae(n("select",{"onUpdate:modelValue":m[0]||(m[0]=b=>l.value.assignmentId=b)},[m[12]||(m[12]=n("option",{value:""},"Chọn ca đã phân công",-1)),(a(!0),s(H,null,z(e.scheduled,b=>(a(),s("option",{key:b.id,value:b.id},u(e.assignmentLabel(b.id)),9,ri))),128))],512),[[Ie,l.value.assignmentId]])]),n("label",null,[m[15]||(m[15]=O(" Hình thức ",-1)),ae(n("select",{"onUpdate:modelValue":m[1]||(m[1]=b=>c.value=b),onChange:m[2]||(m[2]=b=>{l.value.targetAssignmentId="",l.value.shiftId=""})},[...m[14]||(m[14]=[n("option",{value:"employee"},"Đổi với nhân viên khác",-1),n("option",{value:"shift"},"Xin đổi sang ca khác",-1)])],544),[[Ie,c.value]])]),c.value==="employee"?(a(),s("label",ui,[m[17]||(m[17]=O(" Ca của nhân viên đổi cùng ",-1)),ae(n("select",{"onUpdate:modelValue":m[3]||(m[3]=b=>l.value.targetAssignmentId=b)},[m[16]||(m[16]=n("option",{value:""},"Chọn nhân viên / ca",-1)),(a(!0),s(H,null,z(e.scheduled.filter(b=>{var K;return b.employeeId!==((K=g.value)==null?void 0:K.employeeId)}),b=>(a(),s("option",{key:b.id,value:b.id},u(e.assignmentLabel(b.id)),9,di))),128))],512),[[Ie,l.value.targetAssignmentId]])])):(a(),s("label",ci,[m[19]||(m[19]=O(" Ca muốn đổi sang ",-1)),ae(n("select",{"onUpdate:modelValue":m[4]||(m[4]=b=>l.value.shiftId=b)},[m[18]||(m[18]=n("option",{value:""},"Chọn ca",-1)),(a(!0),s(H,null,z(e.shifts.filter(b=>b.active),b=>(a(),s("option",{key:b.id,value:b.id},u(e.shiftName(b.id)),9,hi))),128))],512),[[Ie,l.value.shiftId]])])),n("label",null,[m[20]||(m[20]=O("Lý do *",-1)),ae(n("textarea",{"onUpdate:modelValue":m[5]||(m[5]=b=>l.value.reason=b)},null,512),[[Xe,l.value.reason]])]),e.error?(a(),s("p",vi,u(e.error),1)):D("",!0),n("button",{class:"primary",disabled:e.busy,onClick:m[6]||(m[6]=b=>f("send"))},u(e.busy?"Đang gửi…":"Gửi yêu cầu"),9,mi)])]),_:1},8,["visible"]),j(W(Mt),{visible:t.value,"onUpdate:visible":m[11]||(m[11]=b=>t.value=b),header:"Chi tiết yêu cầu đổi ca",position:"right",class:"schedule-drawer"},{default:ce(()=>[d.value?(a(),s(H,{key:0},[n("h3",null,u(d.value.code)+" · "+u(w[d.value.status]),1),m[22]||(m[22]=n("h4",null,"Trước khi đổi",-1)),n("p",null,u(e.swapBefore(d.value)),1),d.value.targetAssignmentId?(a(),s("p",pi,u(e.swapBefore(d.value,!0)),1)):D("",!0),m[23]||(m[23]=n("h4",null,"Sau khi đổi (dự kiến)",-1)),n("p",null,u(e.swapAfter(d.value)),1),d.value.targetAssignmentId?(a(),s("p",gi,u(e.swapAfter(d.value,!0)),1)):D("",!0),n("p",null,"Lý do: "+u(d.value.reason),1),d.value.decision?(a(),s("p",fi,"Phản hồi: "+u(d.value.decision),1)):D("",!0),d.value.status==="PENDING"&&e.canApprove?(a(),s(H,{key:3},[n("label",null,[m[21]||(m[21]=O("Phản hồi / lý do từ chối",-1)),ae(n("textarea",{"onUpdate:modelValue":m[8]||(m[8]=b=>v.value=b)},null,512),[[Xe,v.value]])]),e.error?(a(),s("p",yi,u(e.error),1)):D("",!0),n("div",bi,[n("button",{disabled:e.busy,onClick:m[9]||(m[9]=b=>f("decide",!1))},"Từ chối",8,qi),n("button",{class:"primary",disabled:e.busy,onClick:m[10]||(m[10]=b=>f("decide",!0))}," Duyệt đổi ca ",8,ki)])],64)):D("",!0)],64)):D("",!0)]),_:1},8,["visible"])],64))}}),Ti={class:"schedule-dialog"},Ci=["disabled"],$i={class:"form-grid"},Di={class:"pattern"},Ni=["onUpdate:modelValue"],Ii=["value"],Si={key:0,class:"error"},Ei=["disabled"],Vi=Se({__name:"ScheduleTemplateDialog",props:Be({departments:{},shifts:{},busy:{type:Boolean},error:{}},{open:{type:Boolean,required:!0},openModifiers:{},read:{type:Boolean,required:!0},readModifiers:{},template:{required:!0},templateModifiers:{}}),emits:Be(["save"],["update:open","update:read","update:template"]),setup(e,{emit:r}){const i=de(e,"open"),t=de(e,"read"),l=de(e,"template"),c=r,d=["T2","T3","T4","T5","T6","T7","CN"];return(v,p)=>(a(),Te(W(Re),{visible:i.value,"onUpdate:visible":p[10]||(p[10]=f=>i.value=f),modal:"",header:t.value?"Chi tiết mẫu lịch":"Cấu hình mẫu lịch",style:{width:"800px",maxWidth:"95vw"}},{default:ce(()=>[n("div",Ti,[n("fieldset",{disabled:t.value||e.busy},[n("div",$i,[n("label",null,[p[11]||(p[11]=O("Tên mẫu *",-1)),ae(n("input",{"onUpdate:modelValue":p[0]||(p[0]=f=>l.value.name=f)},null,512),[[Xe,l.value.name]])]),n("label",null,[p[13]||(p[13]=O(" Loại lịch ",-1)),ae(n("select",{"onUpdate:modelValue":p[1]||(p[1]=f=>l.value.scheduleType=f),onChange:p[2]||(p[2]=f=>l.value.days=Array(l.value.days.length).fill("OFF"))},[...p[12]||(p[12]=[n("option",{value:"ADMINISTRATIVE"},"Hành chính",-1),n("option",{value:"ROTATING"},"Xoay ca",-1)])],544),[[Ie,l.value.scheduleType]])]),n("label",null,[p[15]||(p[15]=O(" Bộ phận ",-1)),ae(n("select",{"onUpdate:modelValue":p[3]||(p[3]=f=>l.value.department=f)},[p[14]||(p[14]=n("option",{value:""},"Tất cả",-1)),(a(!0),s(H,null,z(e.departments,f=>(a(),s("option",{key:f},u(f),1))),128))],512),[[Ie,l.value.department]])]),n("label",null,[p[17]||(p[17]=O(" Loại mẫu ",-1)),ae(n("select",{"onUpdate:modelValue":p[4]||(p[4]=f=>l.value.kind=f),onChange:p[5]||(p[5]=f=>l.value.days=Array(7).fill("OFF"))},[...p[16]||(p[16]=[n("option",{value:"WEEK"},"Mẫu tuần",-1),n("option",{value:"CYCLE"},"Chu kỳ xoay",-1)])],544),[[Ie,l.value.kind]])])]),n("div",Di,[(a(!0),s(H,null,z(l.value.days,(f,w)=>(a(),s("label",{key:w},[O(u(l.value.kind==="WEEK"?d[w]:"Ngày "+(w+1))+" ",1),ae(n("select",{"onUpdate:modelValue":g=>l.value.days[w]=g},[p[18]||(p[18]=n("option",{value:"OFF"},"Nghỉ",-1)),(a(!0),s(H,null,z(e.shifts.filter(g=>g.active&&g.scheduleType===l.value.scheduleType),g=>(a(),s("option",{key:g.id,value:g.id},u(g.name),9,Ii))),128))],8,Ni),[[Ie,l.value.days[w]]])]))),128)),l.value.kind==="CYCLE"?(a(),s("button",{key:0,onClick:p[6]||(p[6]=f=>l.value.days.push("OFF"))}," + Thêm ngày ")):D("",!0),l.value.kind==="CYCLE"&&l.value.days.length>1?(a(),s("button",{key:1,onClick:p[7]||(p[7]=f=>l.value.days.pop())}," Bỏ ngày cuối ")):D("",!0)]),n("label",null,[p[19]||(p[19]=O("Ghi chú",-1)),ae(n("textarea",{"onUpdate:modelValue":p[8]||(p[8]=f=>l.value.note=f)},null,512),[[Xe,l.value.note]])])],8,Ci),e.error?(a(),s("p",Si,u(e.error),1)):D("",!0),t.value?D("",!0):(a(),s("button",{key:1,class:"primary",disabled:e.busy,onClick:p[9]||(p[9]=f=>c("save"))},u(e.busy?"Đang lưu…":"Lưu mẫu"),9,Ei))])]),_:1},8,["visible","header"]))}});function ut(e,r=We(new Date().toISOString())){if(!/^\d{4}-\d{2}-\d{2}$/.test(e))return!1;const{from:i}=Qn(e,"week");return i>=r}const xi=Ve`
  mutation CreateLichXoayCa($maBoPhan: String!, $tuNgay: LocalDate!, $denNgay: LocalDate!) {
    createLichXoayCa(input: { maBoPhan: $maBoPhan, tuNgay: $tuNgay, denNgay: $denNgay }) {
      isResults
      message
      data {
        maBoPhan
        tuNgay
        denNgay
        soPhanCong
        soCaLamViec
        soNgayDO000
        duDinhBien
        tatCaNhanVienDuSauNgay
        canhBao
      }
    }
  }
`;async function Ai(e,r){if(!e||!ut(r))throw new Error("Chỉ được tạo lịch tuần tương lai hoặc tuần hiện tại vào thứ Hai.");const{from:i,to:t}=Qn(r,"week"),{data:l}=await xe.mutate({mutation:xi,variables:{maBoPhan:e,tuNgay:i,denNgay:t},errorPolicy:"none"});if(!(l!=null&&l.createLichXoayCa))throw new Error("Không nhận được kết quả xếp ca.");return l.createLichXoayCa}const Li={key:0,class:"auto-schedule"},Pi=["disabled"],Bi={key:0},Oi={key:1},Mi={key:0,class:"schedule-dialog-body"},Ui={key:0,class:"schedule-dialog-details"},Ri={key:1,class:"schedule-dialog-message warning"},Fi=Se({__name:"ScheduleRotatingDialog",props:{eligible:{type:Boolean},departmentCode:{},anchor:{},week:{type:Boolean},disabled:{type:Boolean}},emits:["saved","busy"],setup(e,{emit:r}){const i=vn(),t=e,l=r,c=C(!1),d=C(!1),v=C(),p=Z(()=>t.week&&ut(t.anchor));async function f(){if(!(!t.eligible||t.disabled||c.value||!t.departmentCode||!t.week||!ut(t.anchor))){c.value=!0,l("busy",!0);try{v.value=await Ai(t.departmentCode,t.anchor),v.value.isResults?l("saved"):(v.value.message=we(v.value),i.error(v.value.message))}catch(w){i.error(w),v.value={isResults:!1,message:we(w)}}finally{d.value=!0,c.value=!1,l("busy",!1)}}}return(w,g)=>(a(),s(H,null,[e.eligible?(a(),s("div",Li,[n("button",{type:"button",class:"auto-schedule-button",disabled:e.disabled||c.value||!p.value||!e.departmentCode,onClick:f},u(c.value?"Đang tạo lịch…":"Tự động tạo lịch"),9,Pi),e.week?p.value?D("",!0):(a(),s("p",Oi,"Chỉ được tạo lịch tuần tương lai hoặc tuần hiện tại vào thứ Hai.")):(a(),s("p",Bi,"Chọn chế độ tuần để tự động tạo lịch."))])):D("",!0),j(W(Re),{class:"schedule-dialog",visible:d.value,"onUpdate:visible":g[1]||(g[1]=P=>d.value=P),modal:"",header:"Kết quả xếp ca",style:{width:"520px",maxWidth:"95vw"}},{footer:ce(()=>[j(ke,{type:"button",label:"Đóng",severity:"secondary",outlined:"",onClick:g[0]||(g[0]=P=>d.value=!1)})]),default:ce(()=>{var P;return[v.value?(a(),s("div",Mi,[n("p",{class:te(["schedule-dialog-message",v.value.isResults?"success":"error"]),role:"status"},u(v.value.message||(v.value.isResults?"Tạo lịch thành công.":"Tạo lịch không thành công.")),3),v.value.data?(a(),s("dl",Ui,[g[2]||(g[2]=n("dt",null,"Bộ phận",-1)),n("dd",null,u(v.value.data.maBoPhan),1),g[3]||(g[3]=n("dt",null,"Từ ngày",-1)),n("dd",null,u(v.value.data.tuNgay),1),g[4]||(g[4]=n("dt",null,"Đến ngày",-1)),n("dd",null,u(v.value.data.denNgay),1),g[5]||(g[5]=n("dt",null,"Số phân công",-1)),n("dd",null,u(v.value.data.soPhanCong),1),g[6]||(g[6]=n("dt",null,"Số ca làm việc",-1)),n("dd",null,u(v.value.data.soCaLamViec),1),g[7]||(g[7]=n("dt",null,"Số ngày DO000",-1)),n("dd",null,u(v.value.data.soNgayDO000),1),g[8]||(g[8]=n("dt",null,"Đủ định biên",-1)),n("dd",null,u(v.value.data.duDinhBien?"Có":"Không"),1),g[9]||(g[9]=n("dt",null,"Tất cả nhân viên đủ sáu ngày",-1)),n("dd",null,u(v.value.data.tatCaNhanVienDuSauNgay?"Có":"Không"),1)])):D("",!0),(P=v.value.data)!=null&&P.canhBao?(a(),s("p",Ri,u(Array.isArray(v.value.data.canhBao)?v.value.data.canhBao.join(`
`):v.value.data.canhBao),1)):D("",!0)])):D("",!0)]}),_:1},8,["visible"])],64))}});function Yn(e=new Date){const r=new Date(e.getTime()+252e5);return{month:r.getUTCMonth()+1,year:r.getUTCFullYear()}}function Hi(e,r,i=new Date){const t=Yn(i);if(!Number.isInteger(e)||!Number.isInteger(r)||e<1||e>12||r<1)throw new Error("Vui lòng chọn tháng và năm hợp lệ.");if(r<t.year||r===t.year&&e<t.month)throw new Error("Không thể phân ca cho tháng/năm quá khứ.")}const Ki=Ve`
  mutation CreateLichHanhChinh($thang: Int!, $nam: Int!) {
    createLichHanhChinh(thang: $thang, nam: $nam) {
      isResults
      message
    }
  }
`;async function Gi(e,r){var t,l;Hi(e,r);const{data:i}=await xe.mutate({mutation:Ki,variables:{thang:e,nam:r},errorPolicy:"none"});if(!((t=i==null?void 0:i.createLichHanhChinh)!=null&&t.isResults))throw new Error(((l=i==null?void 0:i.createLichHanhChinh)==null?void 0:l.message)||"Phân ca hành chính thất bại.");return i.createLichHanhChinh.message||"Phân ca hành chính thành công."}const zi={class:"period-fields"},ji=Se({__name:"ScheduleAdministrativeDialog",props:{disabled:{type:Boolean}},emits:["saved","busy"],setup(e,{emit:r}){const i=e,t=r,l=vn(),c=C(!1),d=C(!1),v=C(Yn()),p=C(v.value.month),f=C(v.value.year),w=Z(()=>Array.from({length:12},(b,K)=>({value:K+1,label:"Tháng "+(K+1)})).filter(b=>f.value!==v.value.year||b.value>=v.value.month)),g=Z(()=>Array.from({length:Math.max(0,2100-v.value.year+1)},(b,K)=>({value:v.value.year+K,label:String(v.value.year+K)})));re(f,b=>{b===v.value.year&&(p.value==null||p.value<v.value.month)&&(p.value=v.value.month)});function P(){i.disabled||d.value||(v.value=Yn(),p.value=v.value.month,f.value=v.value.year,c.value=!0)}async function m(){if(!(d.value||i.disabled)){d.value=!0,t("busy",!0);try{const b=await Gi(p.value,f.value);l.success(b),c.value=!1,t("saved")}catch(b){l.error(b)}finally{d.value=!1,t("busy",!1)}}}return(b,K)=>(a(),s(H,null,[j(ke,{label:"Phân ca hành chính",icon:"pi pi-calendar-plus",disabled:e.disabled||d.value,onClick:P},null,8,["disabled"]),j(W(Re),{class:"schedule-dialog",visible:c.value,modal:"",header:"Phân ca hành chính",closable:!d.value,"close-on-escape":!d.value,style:{width:"440px",maxWidth:"95vw"},"onUpdate:visible":K[3]||(K[3]=G=>!d.value&&(c.value=G))},{default:ce(()=>[n("form",{class:"period-form",onSubmit:xt(m,["prevent"])},[n("div",zi,[n("label",null,[K[4]||(K[4]=O("Tháng",-1)),j(W(Ze),{modelValue:p.value,"onUpdate:modelValue":K[0]||(K[0]=G=>p.value=G),options:w.value,"option-label":"label","option-value":"value",disabled:d.value,placeholder:"Chọn tháng"},null,8,["modelValue","options","disabled"])]),n("label",null,[K[5]||(K[5]=O("Năm",-1)),j(W(Ze),{modelValue:f.value,"onUpdate:modelValue":K[1]||(K[1]=G=>f.value=G),options:g.value,"option-label":"label","option-value":"value",filter:"",disabled:d.value,placeholder:"Chọn năm"},null,8,["modelValue","options","disabled"])])]),n("footer",null,[j(ke,{type:"button",label:"Hủy",severity:"secondary",outlined:"",disabled:d.value,onClick:K[2]||(K[2]=G=>c.value=!1)},null,8,["disabled"]),j(ke,{type:"submit",label:"Xác nhận",icon:"pi pi-check",loading:d.value,disabled:p.value==null||f.value==null||f.value<v.value.year},null,8,["loading","disabled"])])],32)]),_:1},8,["visible","closable","close-on-escape"])],64))}}),Xi=tn(ji,[["__scopeId","data-v-1f0b35a9"]]),Wi={class:"assignment-calendar"},Yi={class:"calendar-toolbar"},Ji={class:"calendar-navigation"},Qi=["aria-label","disabled"],Zi=["value","disabled"],_i=["value","disabled"],es=["aria-label","disabled"],ns={key:2},ts={class:"view-toggle",role:"group","aria-label":"Phạm vi lịch phân công"},ls=["aria-pressed"],as=["aria-pressed"],os={class:"employee-calendar-wrap"},is={class:"employee-calendar"},ss={class:"employee-column"},rs={class:"department-column"},us=["title"],ds=["disabled","aria-label","onClick"],cs={key:0},hs={key:0},vs=["colspan"],ms=["disabled"],ps={class:"schedule-dialog-summary"},gs={class:"full-time"},fs={key:0},ys={key:1,role:"alert"},bs={key:0,class:"full-time"},qs={key:1},ks={key:2},ws={key:3,role:"alert"},Ts={key:0},Cs={key:2,class:"schedule-dialog-message error",role:"alert"},$s={class:"schedule-dialog-actions"},Ds={class:"schedule-dialog-body"},Ns={class:"schedule-dialog-summary"},Is={class:"schedule-dialog-details"},Ss=Se({__name:"AssignmentCalendar",props:{employees:{},shifts:{},existingAssignments:{},canEdit:{type:Boolean},scheduledDates:{},shiftsLoading:{type:Boolean},shiftsError:{},modelValue:{},createAssignment:{type:Function},initialDate:{},viewMode:{},anchorDate:{},fixedDate:{},disabled:{type:Boolean},administrative:{type:Boolean},administrativeShiftId:{}},emits:["edit","request-shifts","update:modelValue","update:viewMode","update:anchorDate"],setup(e,{emit:r}){const i=vn(),t=e,l=r,c=C(!1),d=C(!1),v=C(),p=C(!1),f=C(""),w=C(""),g=C(!0),P=C(""),m=C(""),b=C(""),K=C("12:00"),G=C(""),k=C([]),S=C(!1),T=C("");async function L(){if(!S.value){S.value=!0,T.value="";try{k.value=(await Xn(null,"ADMINISTRATIVE")).filter(q=>q.workType==="0")}catch(q){T.value=we(q)}finally{S.value=!1}}}re(g,q=>{t.administrative&&!q&&!k.value.length&&L()}),re(()=>t.disabled,q=>{q&&!c.value&&(p.value=!1,d.value=!1)});const _=Z(()=>t.shifts.find(q=>q.id===w.value)),N=Z(()=>{var q;return!t.administrative&&!!((q=_.value)!=null&&q.code.endsWith("XX"))}),E=Z(()=>{if(t.administrative&&!g.value)return K.value;if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(b.value))return"";const[q,$]=b.value.split(":").map(Number);return`${String((q+(g.value?8:4))%24).padStart(2,"0")}:${String($).padStart(2,"0")}`}),X=Z(()=>!!E.value&&E.value<=b.value);re([w,_],()=>{var q,$,V,x;if(t.administrative){b.value="08:00";return}b.value=((q=se(f.value))==null?void 0:q.shiftId)===w.value?(($=se(f.value))==null?void 0:$.startTime)||((V=_.value)==null?void 0:V.startTime)||"":((x=_.value)==null?void 0:x.startTime)||""});const ie=C(Vn());let ue;un(()=>{ue=setInterval(()=>{ie.value=Vn()},3e4)}),hn(()=>clearInterval(ue));const me=["T2","T3","T4","T5","T6","T7","CN"],he=C(""),De=Z(()=>t.employees.find(q=>q.code===he.value)),$e=Z(()=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(t.anchorDate))return[];const q=new Date(t.anchorDate+"T12:00:00");if(Number.isNaN(q.getTime()))return[];t.viewMode==="week"?q.setDate(q.getDate()-(q.getDay()+6)%7):q.setDate(1);const $=t.viewMode==="week"?7:new Date(q.getFullYear(),q.getMonth()+1,0).getDate();return Array.from({length:$},(V,x)=>{const A=new Date(q);return A.setDate(A.getDate()+x),`${A.getFullYear()}-${String(A.getMonth()+1).padStart(2,"0")}-${String(A.getDate()).padStart(2,"0")}`})});function ve(q){const $=new Date(t.anchorDate+"T12:00:00");t.viewMode==="month"?($.setDate(1),$.setMonth($.getMonth()+q)):$.setDate($.getDate()+q*7),B($)}function B(q){l("update:anchorDate",`${q.getFullYear()}-${String(q.getMonth()+1).padStart(2,"0")}-${String(q.getDate()).padStart(2,"0")}`)}function M(q){/^\d{4}-\d{2}$/.test(q)&&B(new Date(`${q}-01T12:00:00`))}function ee(q){return new Date(`${q}T12:00:00`).toLocaleDateString("vi-VN")}function se(q,$=he.value){return t.modelValue.find(V=>V.date===q&&V.employeeId===$)}function pe(q,$){var V,x;return t.fixedDate===q?!1:((V=t.scheduledDates)==null?void 0:V.some(A=>A.employeeId===$&&A.dates.includes(q)))||((x=t.existingAssignments)==null?void 0:x.some(A=>A.employeeId===$&&A.date===q))}function J(q,$){var V,x;return((x=(V=t.existingAssignments)==null?void 0:V.find(A=>A.employeeId===$&&A.date===q))==null?void 0:x.assignmentSource)==="S"}function ge(q){return t.administrative&&new Date(`${q}T12:00:00`).getDay()===0}function Ye(q,$){var A,Q;if(c.value||d.value)return;const V=(A=t.existingAssignments)==null?void 0:A.find(ne=>ne.employeeId===$&&ne.date===q);if(V&&t.canEdit&&!t.disabled&&!Ae(q)){l("edit",V);return}if(t.administrative||t.disabled||ge(q)||Ae(q)||pe(q,$))return;he.value=$;const x=se(q);f.value=q,w.value=t.administrative?t.administrativeShiftId||"":(x==null?void 0:x.shiftId)||"",G.value=(x==null?void 0:x.leaveTypeId)||"",g.value=t.createAssignment?!0:(x==null?void 0:x.fullTime)??!0,t.administrative&&!g.value&&!k.value.length&&L(),P.value=(x==null?void 0:x.note)||"",m.value="",b.value=t.administrative?"08:00":(x==null?void 0:x.startTime)||((Q=_.value)==null?void 0:Q.startTime)||"",K.value=(x==null?void 0:x.fullTime)===!1&&x.endTime||"12:00",p.value=!0,t.administrative||l("request-shifts")}function mn(){var q,$,V;if(!(t.disabled||c.value)){if(t.administrative&&!g.value&&(!/^([01]\d|2[0-3]):[0-5]\d$/.test(K.value)||K.value<="08:00"||K.value>"16:00")){m.value="Giờ kết thúc phải sau 08:00 và không quá 16:00.";return}if(t.administrative&&!g.value&&(S.value||!k.value.some(x=>x.id===G.value))){m.value="Chọn mã nghỉ phép cho nửa ca còn lại.";return}if(Ae(f.value)){m.value="Không được phân công ngày trong quá khứ.";return}if(!(!t.administrative&&(t.shiftsLoading||t.shiftsError))){if(N.value&&!E.value){m.value="Vui lòng nhập giờ bắt đầu hợp lệ.";return}if(!t.administrative&&(!w.value||w.value!=="OFF"&&!t.shifts.some(x=>x.id===w.value))||t.administrative&&!t.administrativeShiftId){m.value="Vui lòng chọn ca đang hoạt động.";return}if(t.createAssignment){const x=_.value;if(!x||!x.active||x.workType==="0"){m.value="Vui lòng chọn ca làm việc đang hoạt động.";return}if(!g.value){m.value="Vui lòng chọn toàn thời gian để tạo phân công ca.";return}v.value={employeeId:he.value,date:f.value,shiftId:x.id,fullTime:!0,note:P.value,startTime:N.value?b.value:x.startTime,endTime:N.value?E.value:x.endTime,crossDay:N.value?X.value:x.crossDay},d.value=!0;return}l("update:modelValue",[...t.modelValue.filter(x=>x.date!==f.value||x.employeeId!==he.value),{employeeId:he.value,date:f.value,shiftId:t.administrative?t.administrativeShiftId:w.value,leaveTypeId:t.administrative&&!g.value?G.value:null,fullTime:w.value==="OFF"?!0:g.value,note:t.administrative?"":P.value,...t.administrative&&!g.value?{startTime:b.value,endTime:E.value,crossDay:X.value}:{},...!t.administrative&&w.value!=="OFF"?{startTime:N.value?b.value:(q=_.value)==null?void 0:q.startTime,endTime:N.value?E.value:($=_.value)==null?void 0:$.endTime,crossDay:N.value?X.value:(V=_.value)==null?void 0:V.crossDay}:{}}].sort((x,A)=>x.date.localeCompare(A.date))),p.value=!1}}}async function ln(){if(d.value&&!(!d.value||!v.value||!t.createAssignment||c.value||t.disabled)){if(Ae(v.value.date)||pe(v.value.date,v.value.employeeId)){d.value=!1,m.value="Ngày phân công không còn hợp lệ hoặc nhân viên đã được phân ca. Vui lòng tải lại lịch.";return}c.value=!0,m.value="";try{await t.createAssignment({...v.value}),d.value=!1,p.value=!1,v.value=void 0}catch(q){i.error(q),d.value=!1,m.value=we(q)}finally{c.value=!1}}}function je(){l("update:modelValue",t.modelValue.filter(q=>q.date!==f.value||q.employeeId!==he.value)),p.value=!1}function U(q,$=he.value){var A,Q,ne,le,Ke;const V=(A=t.existingAssignments)==null?void 0:A.find(Ee=>Ee.employeeId===$&&Ee.date===q);if(V)return((Q=V.shiftSymbol)==null?void 0:Q.trim())||((ne=t.shifts.find(Ee=>Ee.id===V.shiftId))==null?void 0:ne.code)||V.shiftId;const x=se(q,$);return x?x.shiftId==="OFF"?"Nghỉ":((le=t.shifts.find(Ee=>Ee.id===x.shiftId))==null?void 0:le.code)||x.shiftId:pe(q,$)?t.administrative&&(((Ke=t.shifts.find(Ee=>Ee.id===t.administrativeShiftId))==null?void 0:Ke.code)||t.administrativeShiftId)||"Đã xếp":ge(q)?"Không xếp":""}function I(q,$){var Oe,Fe;const V=(Oe=t.existingAssignments)==null?void 0:Oe.find(Ge=>Ge.employeeId===$&&Ge.date===q),x=se(q,$);if(!V&&!x)return;const A=t.shifts.find(Ge=>Ge.id===((V==null?void 0:V.shiftId)||(x==null?void 0:x.shiftId))),Q=((Fe=t.employees.find(Ge=>Ge.code===$))==null?void 0:Fe.name)||(V==null?void 0:V.employeeName)||$,ne=(V==null?void 0:V.shiftName)||(A==null?void 0:A.name)||U(q,$),le=(V==null?void 0:V.startTime)||(x==null?void 0:x.startTime)||(A==null?void 0:A.startTime),Ke=(V==null?void 0:V.endTime)||(x==null?void 0:x.endTime)||(A==null?void 0:A.endTime),Ee=(V==null?void 0:V.crossDay)??(x==null?void 0:x.crossDay)??(A==null?void 0:A.crossDay);return[`Họ tên: ${Q} (${$})`,`Ngày làm việc: ${ee(q)}`,`Ca làm việc: ${ne}`,`Thời gian làm việc: ${le||"—"}–${Ke||"—"}${Ee?" (+1 ngày)":""}`].join(`
`)}return(q,$)=>(a(),s("section",Wi,[n("div",Yi,[n("div",null,[$[18]||($[18]=n("h3",null,"Lịch phân công theo nhân viên",-1)),n("p",null,u(e.administrative?"Lịch hành chính được sắp xếp sẵn.":"Bấm ô ngày của nhân viên để chọn ca.")+" "+u(e.employees.length)+" nhân viên · "+u(e.modelValue.length)+" phân công đã chọn. ",1)]),n("div",Ji,[n("button",{type:"button","aria-label":e.viewMode==="week"?"Tuần trước":"Tháng trước",disabled:!!e.fixedDate,onClick:$[0]||($[0]=V=>ve(-1))}," ‹",8,Qi),e.viewMode==="week"?(a(),s("input",{key:0,value:e.anchorDate,type:"date","aria-label":"Ngày trong tuần phân công",disabled:!!e.fixedDate,onInput:$[1]||($[1]=V=>B(new Date(V.target.value+"T12:00:00")))},null,40,Zi)):(a(),s("input",{key:1,value:e.anchorDate.slice(0,7),type:"month","aria-label":"Tháng phân công",disabled:!!e.fixedDate,onInput:$[2]||($[2]=V=>M(V.target.value))},null,40,_i)),n("button",{type:"button","aria-label":e.viewMode==="week"?"Tuần sau":"Tháng sau",disabled:!!e.fixedDate,onClick:$[3]||($[3]=V=>ve(1))}," › ",8,es),$e.value.length?(a(),s("strong",ns,u(ee($e.value[0]))+" – "+u(ee($e.value[$e.value.length-1])),1)):D("",!0),n("div",ts,[n("button",{type:"button",class:te({active:e.viewMode==="week"}),"aria-pressed":e.viewMode==="week",onClick:$[4]||($[4]=V=>l("update:viewMode","week"))}," Tuần ",10,ls),n("button",{type:"button",class:te({active:e.viewMode==="month"}),"aria-pressed":e.viewMode==="month",onClick:$[5]||($[5]=V=>l("update:viewMode","month"))}," Tháng ",10,as)])])]),n("div",os,[n("table",is,[n("thead",null,[n("tr",null,[$[19]||($[19]=n("th",{class:"employee-column"},"Nhân viên",-1)),$[20]||($[20]=n("th",{class:"department-column"},"Bộ phận",-1)),(a(!0),s(H,null,z($e.value,V=>(a(),s("th",{key:V,class:te({weekend:[0,6].includes(new Date(V+"T12:00:00").getDay())})},[O(u(me[(new Date(V+"T12:00:00").getDay()+6)%7]),1),n("small",null,u(Number(V.slice(-2)))+"/"+u(Number(V.slice(5,7))),1)],2))),128))])]),n("tbody",null,[(a(!0),s(H,null,z(e.employees,V=>(a(),s("tr",{key:V.code},[n("th",ss,[n("strong",null,u(V.name),1),n("small",null,u(V.code),1)]),n("td",rs,u(V.department||"Chưa có bộ phận"),1),(a(!0),s(H,null,z($e.value,x=>{var A,Q;return a(),s("td",{key:x,title:I(x,V.code),class:te({weekend:[0,6].includes(new Date(x+"T12:00:00").getDay())})},[n("button",{type:"button",class:te({picked:!!se(x,V.code),assigned:pe(x,V.code),"source-s":J(x,V.code)}),disabled:e.administrative&&!(e.canEdit&&pe(x,V.code))||e.disabled||x<ie.value||!!e.fixedDate&&x!==e.fixedDate||ge(x)||pe(x,V.code)&&!e.canEdit,"aria-label":V.name+" · "+x+" · "+U(x,V.code),onClick:ne=>Ye(x,V.code)},[n("strong",null,u(U(x,V.code)||"+ Chọn ca"),1),se(x,V.code)&&((A=se(x,V.code))==null?void 0:A.shiftId)!=="OFF"?(a(),s("small",cs,u((Q=se(x,V.code))!=null&&Q.fullTime?"Cả ca":"1/2 ca"),1)):D("",!0)],10,ds)],10,us)}),128))]))),128)),e.employees.length?D("",!0):(a(),s("tr",hs,[n("td",{colspan:$e.value.length+2,class:"empty-state"}," Không tìm thấy nhân viên thuộc bộ phận hoặc từ khóa đã chọn. ",8,vs)]))])])]),j(W(Re),{class:"schedule-dialog",visible:p.value,"onUpdate:visible":$[15]||($[15]=V=>p.value=V),modal:"",closable:!c.value,"close-on-escape":!c.value,header:e.createAssignment?"Tạo phân công ca":"Chọn ca",style:{width:"520px",maxWidth:"95vw"}},{default:ce(()=>{var V,x,A;return[n("fieldset",{class:"day-shift-dialog",disabled:c.value||d.value},[n("p",ps,[n("strong",null,u((V=De.value)==null?void 0:V.name),1),O(" · "+u((x=De.value)==null?void 0:x.code),1),$[21]||($[21]=n("br",null,null,-1)),O(u(ee(f.value))+" · "+u((A=De.value)==null?void 0:A.department),1)]),e.administrative?(a(),s(H,{key:0},[n("label",gs,[ae(n("input",{"onUpdate:modelValue":$[6]||($[6]=Q=>g.value=Q),type:"checkbox"},null,512),[[it,g.value]]),$[22]||($[22]=O("Toàn ca",-1))]),g.value?D("",!0):(a(),s(H,{key:0},[n("label",null,[$[23]||($[23]=O("Giờ kết thúc",-1)),j(W(Qe),{modelValue:K.value,"onUpdate:modelValue":$[7]||($[7]=Q=>K.value=Q),type:"time",min:"08:01",max:"16:00",required:""},null,8,["modelValue"])]),n("label",null,[$[24]||($[24]=O("Loại nghỉ phép *",-1)),j(W(Ze),{modelValue:G.value,"onUpdate:modelValue":$[8]||($[8]=Q=>G.value=Q),options:k.value,"option-label":"name","option-value":"id",placeholder:"Chọn mã nghỉ phép",disabled:c.value||d.value||S.value},null,8,["modelValue","options","disabled"])]),S.value?(a(),s("p",fs,"Đang tải loại nghỉ phép...")):D("",!0),T.value?(a(),s("p",ys,[O(u(T.value)+" ",1),j(ke,{type:"button",label:"Thử lại",text:"",size:"small",onClick:L})])):D("",!0)],64))],64)):(a(),s(H,{key:1},[n("label",null,[$[25]||($[25]=O("Ca làm việc *",-1)),j(W(Ze),{modelValue:w.value,"onUpdate:modelValue":$[9]||($[9]=Q=>w.value=Q),options:[...e.shifts.map(Q=>({value:Q.id,label:Q.code+" · "+Q.name+(Q.startTime&&Q.endTime?" · "+Q.startTime+"–"+Q.endTime:"")+(Q.crossDay?" (+1 ngày)":"")})),...e.createAssignment?[]:[{value:"OFF",label:"Nghỉ"}]],"option-label":"label","option-value":"value",placeholder:"Chọn ca làm việc",disabled:c.value||d.value||e.shiftsLoading||!!e.shiftsError},null,8,["modelValue","options","disabled"])]),!e.createAssignment&&w.value&&w.value!=="OFF"?(a(),s("label",bs,[ae(n("input",{"onUpdate:modelValue":$[10]||($[10]=Q=>g.value=Q),type:"checkbox"},null,512),[[it,g.value]]),$[26]||($[26]=O("Toàn thời gian",-1))])):D("",!0),w.value&&w.value!=="OFF"?(a(),s("p",qs,[O(u(g.value?"Làm cả ca đã chọn.":"Làm 1/2 ca đã chọn.")+" ",1),g.value?D("",!0):(a(),s(H,{key:0},[O("Khung giờ cụ thể của nửa ca chưa được xác định.")],64))])):D("",!0),e.shiftsLoading?(a(),s("p",ks,"Đang tải danh sách ca...")):D("",!0),e.shiftsError?(a(),s("p",ws,[O(u(e.shiftsError)+" ",1),j(ke,{type:"button",label:"Thử lại",text:"",size:"small",onClick:$[11]||($[11]=Q=>l("request-shifts"))})])):D("",!0),N.value?(a(),s(H,{key:4},[n("label",null,[$[27]||($[27]=O("Giờ bắt đầu *",-1)),j(W(Qe),{modelValue:b.value,"onUpdate:modelValue":$[12]||($[12]=Q=>b.value=Q),type:"time",required:""},null,8,["modelValue"])]),n("label",null,[$[28]||($[28]=O("Giờ kết thúc",-1)),j(W(Qe),{"model-value":E.value,type:"time",readonly:""},null,8,["model-value"])]),X.value?(a(),s("p",Ts,"Giờ kết thúc thuộc ngày hôm sau.")):D("",!0)],64)):D("",!0),n("label",null,[$[29]||($[29]=O("Ghi chú",-1)),j(W(Ot),{modelValue:P.value,"onUpdate:modelValue":$[13]||($[13]=Q=>P.value=Q),rows:"3","auto-resize":"",placeholder:"Nhập ghi chú (nếu có)"},null,8,["modelValue"])])],64)),m.value?(a(),s("p",Cs,u(m.value),1)):D("",!0),n("div",$s,[se(f.value)?(a(),Te(ke,{key:0,type:"button",label:"Bỏ ngày này",severity:"danger",text:"",onClick:je})):D("",!0),j(ke,{type:"button",label:"Hủy",severity:"secondary",outlined:"",onClick:$[14]||($[14]=Q=>p.value=!1)}),j(ke,{type:"button",label:e.createAssignment?"Tạo ca":"Chọn ca",icon:"pi pi-check",disabled:!e.administrative&&(e.shiftsLoading||!!e.shiftsError),onClick:mn},null,8,["label","disabled"])])],8,ms)]}),_:1},8,["visible","closable","close-on-escape","header"]),j(W(Re),{class:"schedule-dialog",visible:d.value,modal:"",header:"Xác nhận tạo phân công ca",closable:!c.value,"close-on-escape":!c.value,style:{width:"520px",maxWidth:"95vw"},"onUpdate:visible":$[17]||($[17]=V=>!c.value&&(d.value=V))},{footer:ce(()=>[j(ke,{type:"button",label:"Quay lại",severity:"secondary",outlined:"",disabled:c.value,onClick:$[16]||($[16]=V=>d.value=!1)},null,8,["disabled"]),j(ke,{type:"button",label:"Xác nhận tạo ca",icon:"pi pi-check",loading:c.value,disabled:c.value,onClick:ln},null,8,["loading","disabled"])]),default:ce(()=>{var V,x,A,Q,ne,le,Ke,Ee,Oe,Fe;return[n("div",Ds,[n("p",Ns,[$[30]||($[30]=O(" Xác nhận tạo ca cho ",-1)),n("strong",null,u((V=De.value)==null?void 0:V.name)+" ("+u((x=v.value)==null?void 0:x.employeeId)+")",1),$[31]||($[31]=O(". ",-1))]),n("dl",Is,[$[33]||($[33]=n("dt",null,"Ngày làm việc",-1)),n("dd",null,u((A=v.value)!=null&&A.date?ee(v.value.date):""),1),$[34]||($[34]=n("dt",null,"Bộ phận",-1)),n("dd",null,u(((Q=De.value)==null?void 0:Q.department)||"—"),1),$[35]||($[35]=n("dt",null,"Ca làm việc",-1)),n("dd",null,u((ne=_.value)==null?void 0:ne.code)+" · "+u((le=_.value)==null?void 0:le.name),1),$[36]||($[36]=n("dt",null,"Giờ làm",-1)),n("dd",null,u(((Ke=v.value)==null?void 0:Ke.startTime)||"Theo cấu hình ca")+" – "+u(((Ee=v.value)==null?void 0:Ee.endTime)||"Theo cấu hình ca")+u((Oe=v.value)!=null&&Oe.crossDay?" (+1 ngày)":""),1),(Fe=v.value)!=null&&Fe.note?(a(),s(H,{key:0},[$[32]||($[32]=n("dt",null,"Ghi chú",-1)),n("dd",null,u(v.value.note),1)],64)):D("",!0)])])]}),_:1},8,["visible","closable","close-on-escape"])]))}}),Es=tn(Ss,[["__scopeId","data-v-a8611e83"]]),Vs={class:"panel form"},xs={class:"toolbar"},As={key:0,class:"actions"},Ls={key:0},Ps={key:1,class:"assignment-workspace"},Bs={class:"department-tree-panel"},Os={key:0,role:"status"},Ms={key:1,role:"alert"},Us={key:2,"aria-label":"Cây bộ phận theo loại lịch"},Rs=["aria-pressed","disabled","onClick"],Fs={key:0,class:"tree-hint"},Hs={key:3,class:"tree-unavailable"},Ks={class:"assignment-schedule-panel"},Gs={key:0,class:"assignment-lock"},zs={key:1,role:"status"},js={key:2,role:"alert",class:"error"},Xs={key:3,class:"department-schedule-type"},Ws={key:4,class:"employee-picker"},Ys={key:0},Js=["checked"],Qs=["value"],Zs=["checked","disabled","onChange"],_s={key:1},er={class:"actions schedule-actions"},nr=["disabled"],tr=Se({__name:"ScheduleAssignmentTab",props:Be({editing:{},busy:{type:Boolean},canCreate:{type:Boolean},canEdit:{type:Boolean},canUpdate:{type:Boolean},canBulk:{type:Boolean},treeLoading:{type:Boolean},treeError:{},departmentGroups:{},unclassifiedDepartments:{},loadDepartmentTree:{type:Function},shiftsLoading:{type:Boolean},shiftsError:{},loadManualShifts:{type:Function},eligible:{},name:{type:Function},manualShifts:{},data:{},scheduledDates:{},start:{},administrativeShiftId:{},makePreview:{type:Function},createAssignment:{type:Function}},{bulk:{type:Boolean,required:!0},bulkModifiers:{},selected:{required:!0},selectedModifiers:{},formDepartment:{required:!0},formDepartmentModifiers:{},formSearch:{required:!0},formSearchModifiers:{},scheduleType:{required:!0},scheduleTypeModifiers:{},method:{required:!0},methodModifiers:{},dayPlans:{required:!0},dayPlansModifiers:{},calendarMode:{required:!0},calendarModeModifiers:{},calendarAnchor:{required:!0},calendarAnchorModifiers:{}}),emits:Be(["edit","reload","administrative-created","administrative-busy"],["update:bulk","update:selected","update:formDepartment","update:formSearch","update:scheduleType","update:method","update:dayPlans","update:calendarMode","update:calendarAnchor"]),setup(e,{emit:r}){const i=C(),t=de(e,"bulk"),l=de(e,"selected"),c=de(e,"formDepartment"),d=de(e,"formSearch"),v=de(e,"scheduleType"),p=de(e,"method"),f=de(e,"dayPlans"),w=de(e,"calendarMode"),g=de(e,"calendarAnchor"),P=r,m=e,b=Z(()=>{var G;return((G=m.departmentGroups.flatMap(k=>k.departments).find(k=>k.name===c.value))==null?void 0:G.code)||""}),K=Z(()=>m.manualShifts.some(G=>{var k;return G.active&&((k=G.workType)==null?void 0:k.trim().toUpperCase())==="C"}));return(G,k)=>{var T,L,_;const S=Jn("RouterLink");return a(),s("section",Vs,[n("div",xs,[n("h2",null,u(e.editing?"Sửa phân công":"Tạo phân công"),1),e.editing?D("",!0):(a(),s("div",As,[e.canUpdate?(a(),Te(S,{key:0,class:"schedule-action-link",to:"/schedules/exchange"},{default:ce(()=>[...k[19]||(k[19]=[O("Đổi ca",-1)])]),_:1})):D("",!0),e.canUpdate?(a(),Te(S,{key:1,class:"schedule-action-link",to:"/schedules/leave-calendar"},{default:ce(()=>[...k[20]||(k[20]=[O("Nghỉ phép",-1)])]),_:1})):D("",!0),e.canCreate?(a(),Te(Xi,{key:2,disabled:e.busy,onSaved:k[0]||(k[0]=N=>P("administrative-created")),onBusy:k[1]||(k[1]=N=>P("administrative-busy",N))},null,8,["disabled"])):D("",!0),n("button",{class:te({chosen:!t.value}),onClick:k[2]||(k[2]=N=>{t.value=!1,l.value=[],p.value="calendar"})}," Cá nhân ",2),e.canBulk?(a(),s("button",{key:3,class:te({chosen:t.value}),onClick:k[3]||(k[3]=N=>{t.value=!0,l.value=[]})}," Hàng loạt ",2)):D("",!0)]))]),e.canEdit?(a(),s("div",Ps,[n("aside",Bs,[k[23]||(k[23]=n("h3",null,"Bộ phận",-1)),k[24]||(k[24]=n("p",{class:"tree-hint"},"Chọn bộ phận để phân công ca",-1)),e.treeLoading?(a(),s("p",Os,"Đang phân loại bộ phận…")):D("",!0),e.treeError?(a(),s("p",Ms,u(e.treeError),1)):D("",!0),e.treeLoading?D("",!0):(a(),s("nav",Us,[(a(!0),s(H,null,z(e.departmentGroups,N=>(a(),s("details",{key:N.type,open:"",class:"department-tree-group"},[n("summary",null,[O(u(N.label)+" ",1),n("span",null,u(N.departments.length),1)]),(a(!0),s(H,null,z(N.departments,E=>(a(),s("button",{key:E.code,type:"button",class:te({selected:c.value===E.name}),"aria-pressed":c.value===E.name,disabled:e.busy||!!e.editing,onClick:X=>c.value=E.name},[k[21]||(k[21]=n("i",{class:"pi pi-building","aria-hidden":"true"},null,-1)),n("span",null,[O(u(E.name),1),n("small",null,u(E.code),1)])],10,Rs))),128)),N.departments.length?D("",!0):(a(),s("p",Fs,"Chưa có bộ phận"))]))),128))])),!e.treeLoading&&e.unclassifiedDepartments.length?(a(),s("div",Hs,[k[22]||(k[22]=n("p",null,"Chưa xác định loại lịch hoặc chưa có ca hoạt động:",-1)),(a(!0),s(H,null,z(e.unclassifiedDepartments,N=>(a(),s("small",{key:N.code},u(N.name),1))),128)),n("button",{type:"button",onClick:k[4]||(k[4]=(...N)=>e.loadDepartmentTree&&e.loadDepartmentTree(...N))},"Tải lại")])):D("",!0)]),n("div",Ks,[c.value?D("",!0):(a(),s("p",Gs,[...k[25]||(k[25]=[n("i",{class:"pi pi-lock","aria-hidden":"true"},null,-1),O(" Chọn bộ phận ở bên trái để mở chức năng chọn ca. ",-1)])])),e.shiftsLoading?(a(),s("p",zs,"Đang tải ca và xác định loại lịch…")):D("",!0),e.shiftsError?(a(),s("p",js,[O(u(e.shiftsError)+" ",1),n("button",{onClick:k[5]||(k[5]=(...N)=>e.loadManualShifts&&e.loadManualShifts(...N))},"Thử lại")])):D("",!0),c.value&&!e.shiftsLoading&&!e.shiftsError&&e.manualShifts.length?(a(),s("p",Xs," Loại lịch của bộ phận: "+u(v.value==="ADMINISTRATIVE"?"Hành chính":"Làm theo ca"),1)):D("",!0),n("h3",null,u(p.value==="calendar"?"Tìm nhân viên trong lịch":"1. Chọn nhân viên · "+l.value.length+" đã chọn"),1),ae(n("input",{"onUpdate:modelValue":k[6]||(k[6]=N=>d.value=N),placeholder:"Tìm mã NV hoặc họ tên","aria-label":"Tìm nhân viên"},null,512),[[Xe,d.value]]),p.value!=="calendar"?(a(),s("div",Ws,[t.value?(a(),s("label",Ys,[n("input",{type:"checkbox",checked:!!e.eligible.length&&e.eligible.every(N=>l.value.includes(N.code)),onChange:k[7]||(k[7]=N=>l.value=e.eligible.every(E=>l.value.includes(E.code))?[]:e.eligible.map(E=>E.code))},null,40,Js),k[26]||(k[26]=O("Chọn tất cả kết quả ",-1))])):D("",!0),(a(!0),s(H,null,z(e.eligible,N=>(a(),s("label",{key:N.code},[t.value?ae((a(),s("input",{key:0,"onUpdate:modelValue":k[8]||(k[8]=E=>l.value=E),type:"checkbox",value:N.code},null,8,Qs)),[[it,l.value]]):(a(),s("input",{key:1,type:"radio",name:"employee",checked:l.value.includes(N.code),disabled:!!e.editing,onChange:E=>l.value=[N.code]},null,40,Zs)),O(u(e.name(N.code)),1)]))),128)),e.eligible.length?D("",!0):(a(),s("p",_s,"Không tìm thấy nhân viên."))])):D("",!0),p.value==="calendar"?(a(),Te(Es,{key:((T=e.editing)==null?void 0:T.id)||e.start,modelValue:f.value,"onUpdate:modelValue":k[9]||(k[9]=N=>f.value=N),employees:(e.editing?e.eligible.filter(N=>{var E;return N.code===((E=e.editing)==null?void 0:E.employeeId)}):e.eligible).map(N=>({code:N.code,name:N.name,department:String(N.department||"")})),shifts:e.manualShifts,"existing-assignments":e.data.assignments,"create-assignment":e.createAssignment,"can-edit":e.canUpdate&&!e.editing,onEdit:k[10]||(k[10]=N=>i.value=N),"scheduled-dates":e.scheduledDates,"shifts-loading":e.shiftsLoading,"shifts-error":e.shiftsError,onRequestShifts:e.loadManualShifts,"view-mode":w.value,"anchor-date":g.value,"onUpdate:viewMode":k[11]||(k[11]=N=>w.value=N),"onUpdate:anchorDate":k[12]||(k[12]=N=>g.value=N),administrative:v.value==="ADMINISTRATIVE","administrative-shift-id":e.administrativeShiftId,"initial-date":e.start,"fixed-date":(L=e.editing)==null?void 0:L.date,disabled:e.busy||!c.value||v.value==="ADMINISTRATIVE"&&(e.shiftsLoading||!!e.shiftsError||!e.administrativeShiftId)},null,8,["modelValue","employees","shifts","existing-assignments","create-assignment","can-edit","scheduled-dates","shifts-loading","shifts-error","onRequestShifts","view-mode","anchor-date","administrative","administrative-shift-id","initial-date","fixed-date","disabled"])):D("",!0),!e.editing&&e.canCreate?(a(),Te(Fi,{key:6,eligible:K.value,"department-code":b.value,anchor:g.value,week:w.value==="week",disabled:e.busy||e.shiftsLoading||!!e.shiftsError,onBusy:k[13]||(k[13]=N=>P("administrative-busy",N)),onSaved:k[14]||(k[14]=N=>{f.value=[],P("reload")})},null,8,["eligible","department-code","anchor","week","disabled"])):D("",!0),n("div",er,[n("button",{class:"primary",disabled:e.busy||!c.value||e.shiftsLoading||!!e.shiftsError||!e.manualShifts.length||(p.value==="calendar"?!f.value.length:!l.value.length),onClick:k[15]||(k[15]=(...N)=>e.makePreview&&e.makePreview(...N))}," Xem trước phân công ",8,nr),k[27]||(k[27]=n("span",null,"Không ghi đè lịch âm thầm.",-1))])])])):(a(),s("p",Ls,"Bạn không có quyền phân công ca.")),j(Rt,{onBusy:k[16]||(k[16]=N=>P("administrative-busy",N)),assignment:i.value,"department-code":((_=[...e.departmentGroups.flatMap(N=>N.departments),...e.unclassifiedDepartments].find(N=>N.name===c.value))==null?void 0:_.code)||null,"employee-name":i.value?e.name(i.value.employeeId):"",onClose:k[17]||(k[17]=N=>i.value=void 0),onConfirmed:k[18]||(k[18]=N=>P("reload"))},null,8,["assignment","department-code","employee-name"])])}}}),lr=tn(tr,[["__scopeId","data-v-c10c225c"]]),ar={class:"toolbar"},or={class:"actions"},ir={class:"actions"},sr=["onClick"],rr={key:0,class:"panel empty-state"},ur={key:0,class:"demo"},dr={key:0},cr={key:1,class:"panel month-calendar"},hr={class:"month-heading"},vr={class:"calendar-employee"},mr={class:"month-shifts"},pr=["title","onClick"],gr={class:"assignment-date"},fr={key:0,class:"unassigned-note"},yr={key:2,class:"day-calendar"},br={class:"calendar-employee"},qr={class:"day-shifts"},kr=["title","onClick"],wr={class:"shift-symbol"},Tr={key:0,class:"day-unassigned"},Cr=["onClick"],$r={key:3,class:"panel grid-wrap"},Dr=["title","disabled","onClick"],Nr={key:1},Ir={key:4,class:"agenda"},Sr=["onClick"],Er=Se({__name:"ScheduleCalendarTab",props:Be({employees:{},visibleEmployees:{},groupByDepartment:{type:Boolean},dates:{},today:{},shifts:{},canCreate:{type:Boolean},employeeAssignments:{type:Function},cell:{type:Function},matches:{type:Function},fmt:{type:Function},name:{type:Function},shiftName:{type:Function},symbol:{type:Function},label:{type:Function},pending:{type:Function}},{view:{required:!0},viewModifiers:{},anchor:{required:!0},anchorModifiers:{}}),emits:Be(["move","open"],["update:view","update:anchor"]),setup(e,{emit:r}){const i=de(e,"view"),t=de(e,"anchor"),l=e,c=r,d=["T2","T3","T4","T5","T6","T7","CN"];function v(w){return w?w.status==="OFF"?"OFF":w.status==="LEAVE"?w.shiftSymbol||w.shiftId||"NP":l.symbol(w)||"—":"—"}const p=Z(()=>{if(!l.groupByDepartment)return[{department:"",employees:l.visibleEmployees}];const w=new Map;for(const g of l.visibleEmployees){const P=g.department||"Chưa có bộ phận",m=w.get(P)||[];m.push(g),w.set(P,m)}return[...w.entries()].sort(([g],[P])=>g.localeCompare(P,"vi")).map(([g,P])=>({department:g,employees:P.sort((m,b)=>m.name.localeCompare(b.name,"vi"))}))});function f(w){if(!w)return"unassigned";const g="employeeId"in w?w:void 0;if((g==null?void 0:g.status)==="OFF"||(g==null?void 0:g.shiftId)==="OFF"||w.id==="OFF")return"off";if((g==null?void 0:g.status)==="LEAVE")return"leave";const P="employeeId"in w?l.shifts.find(k=>k.id===w.shiftId):w,m=String((P==null?void 0:P.code)||(g==null?void 0:g.shiftSymbol)||(g==null?void 0:g.shiftId)||"").toUpperCase(),b=String((P==null?void 0:P.name)||(g==null?void 0:g.shiftName)||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();if((g==null?void 0:g.scheduleType)==="ADMINISTRATIVE"||(P==null?void 0:P.scheduleType)==="ADMINISTRATIVE"||["D","HC","ADMINISTRATIVE"].includes(m)||b.includes("hanh chinh"))return"administrative";if(m.endsWith("XX")||b.includes("tuy chon")||b.includes("linh hoat")||b.includes("flex"))return"flexible";if(m==="M"||b.includes("sang")||b.includes("morning"))return"morning";if(m==="E"||b.includes("chieu")||b.includes("afternoon"))return"afternoon";if(m==="N"||b.includes("toi")||b.includes("dem")||b.includes("night"))return"night";const K=(g==null?void 0:g.startTime)||(P==null?void 0:P.startTime)||"",G=Number(K.slice(0,2));return K&&Number.isFinite(G)?G<5||G>=18?"night":G<11?"morning":"afternoon":"unassigned"}return(w,g)=>(a(),s(H,null,[n("div",ar,[n("div",or,[n("button",{"aria-label":"Kỳ trước",onClick:g[0]||(g[0]=P=>c("move",-1))}," ‹ "),n("button",{onClick:g[1]||(g[1]=P=>t.value=e.today)}," Hôm nay "),n("button",{"aria-label":"Kỳ sau",onClick:g[2]||(g[2]=P=>c("move",1))}," › "),n("strong",null,u(e.fmt(e.dates[0]))+" – "+u(e.fmt(e.dates[e.dates.length-1])),1)]),n("div",ir,[(a(),s(H,null,z([{id:"day",name:"Ngày"},{id:"week",name:"Tuần"},{id:"month",name:"Tháng"}],P=>n("button",{key:P.id,class:te({chosen:i.value===P.id}),onClick:m=>i.value=P.id},u(P.name),11,sr)),64))])]),g[7]||(g[7]=cl('<div class="legend"><span class="shift-legend-item shift-tone--morning"><i></i>Ca sáng</span><span class="shift-legend-item shift-tone--afternoon"><i></i>Ca chiều</span><span class="shift-legend-item shift-tone--flexible"><i></i>Ca tùy chọn</span><span class="shift-legend-item shift-tone--night"><i></i>Ca tối</span><span class="shift-legend-item shift-tone--off"><i></i>OFF</span><span class="shift-legend-item shift-tone--administrative"><i></i>Hành chính</span><span class="shift-legend-item shift-tone--leave"><i></i>Nghỉ phép</span><span>↔ Chờ đổi ca</span></div>',1)),e.visibleEmployees.length?(a(),s(H,{key:1},[e.visibleEmployees.some(P=>e.dates.some(m=>e.cell(P.code,m)))?D("",!0):(a(),s("p",ur," Chưa có lịch làm việc trong khoảng thời gian này. Chọn Phân công ca để lập lịch. ")),(a(!0),s(H,null,z(p.value,P=>(a(),Te(hl(e.groupByDepartment?"details":"div"),{key:P.department||"selected-department",class:"department-calendar-group",open:e.groupByDepartment?!0:void 0},{default:ce(()=>[e.groupByDepartment?(a(),s("summary",dr,[n("strong",null,u(P.department),1),n("small",null,u(P.employees.length)+" nhân viên",1)])):D("",!0),i.value==="month"?(a(),s("section",cr,[n("div",hr,[g[3]||(g[3]=n("strong",null,"Nhân viên / Bộ phận",-1)),n("strong",null,"Ca được phân công trong tháng · "+u(t.value.slice(0,7)),1)]),(a(!0),s(H,null,z(P.employees,m=>(a(),s("article",{key:m.code,class:"month-row"},[n("div",vr,[n("strong",null,u(m.name),1),n("small",null,u(m.code),1),n("small",null,u(m.department||"Chưa có bộ phận"),1)]),n("div",mr,[(a(!0),s(H,null,z(e.employeeAssignments(m.code),b=>(a(),s("button",{key:b.id,class:te(["assignment-chip",`shift-tone--${f(b)}`]),title:e.label(b),onClick:K=>c("open",m.code,b.date)},[n("span",gr,u(e.fmt(b.date)),1),n("strong",null,u(e.symbol(b)),1)],10,pr))),128)),e.employeeAssignments(m.code).length?D("",!0):(a(),s("p",fr," Chưa phân công ca trong tháng "))])]))),128))])):i.value==="day"?(a(),s("section",yr,[(a(!0),s(H,null,z(P.employees,m=>(a(),s("article",{key:m.code,class:"panel day-employee"},[n("div",br,[n("strong",null,u(m.name),1),n("small",null,u(m.code)+" · "+u(m.department||"Chưa có bộ phận"),1)]),n("div",qr,[(a(!0),s(H,null,z(e.employeeAssignments(m.code),b=>(a(),s("button",{key:b.id,title:e.label(b),class:te(["day-assignment",`shift-tone--${f(b)}`]),onClick:K=>c("open",m.code,b.date)},[n("strong",wr,u(e.symbol(b)),1)],10,kr))),128)),e.employeeAssignments(m.code).length?D("",!0):(a(),s("div",Tr,[g[4]||(g[4]=n("span",null,"Chưa phân công",-1)),e.canCreate?(a(),s("button",{key:0,onClick:b=>c("open",m.code,e.dates[0])}," + Phân công ca ",8,Cr)):D("",!0)]))])]))),128))])):(a(),s("section",$r,[n("table",{class:"schedule-grid",style:dn({minWidth:240+e.dates.length*88+"px"})},[n("colgroup",null,[g[5]||(g[5]=n("col",{class:"employee-col"},null,-1)),(a(!0),s(H,null,z(e.dates,m=>(a(),s("col",{key:m}))),128))]),n("thead",null,[n("tr",null,[n("th",null,[g[6]||(g[6]=O(" NHÂN VIÊN",-1)),n("small",null,u(P.employees.length)+" nhân viên",1)]),(a(!0),s(H,null,z(e.dates,m=>(a(),s("th",{key:m,class:te({today:m===e.today,weekend:[0,6].includes(new Date(m+"T12:00:00").getDay())})},[O(u(d[(new Date(m+"T12:00:00").getDay()+6)%7])+" ",1),n("small",null,u(e.fmt(m)),1)],2))),128))])]),n("tbody",null,[(a(!0),s(H,null,z(P.employees,m=>(a(),s("tr",{key:m.code},[n("th",null,[n("strong",null,u(m.name),1),n("small",null,u(m.code)+" · "+u(m.department),1)]),(a(!0),s(H,null,z(e.dates,b=>(a(),s("td",{key:b,class:te({today:b===e.today,weekend:[0,6].includes(new Date(b+"T12:00:00").getDay())})},[e.matches(e.cell(m.code,b))?(a(),s("button",{key:0,class:te(["shift-cell",`shift-tone--${f(e.cell(m.code,b))}`]),title:e.label(e.cell(m.code,b)),disabled:!e.cell(m.code,b)&&!e.canCreate,onClick:K=>c("open",m.code,b)},[n("strong",null,u(v(e.cell(m.code,b))),1)],10,Dr)):(a(),s("span",Nr,"—"))],2))),128))]))),128))])],4)])),i.value==="week"?(a(),s("section",Ir,[(a(!0),s(H,null,z(e.dates,m=>(a(),s("article",{key:m,class:"panel"},[n("h3",null,u(e.fmt(m))+" "+u(m===e.today?"· Hôm nay":""),1),(a(!0),s(H,null,z(P.employees.filter(b=>e.matches(e.cell(b.code,m))),b=>(a(),s("button",{key:b.code,class:te(["agenda-assignment",`shift-tone--${f(e.cell(b.code,m))}`]),onClick:K=>c("open",b.code,m)},[n("strong",null,u(e.name(b.code)),1),n("small",null,u(e.label(e.cell(b.code,m)))+" "+u(e.pending(e.cell(b.code,m))?"↔ Chờ đổi ca":""),1)],10,Sr))),128))]))),128))])):D("",!0)]),_:2},1032,["open"]))),128))],64)):(a(),s("div",rr," Không tìm thấy nhân viên theo bộ lọc. "))],64))}}),Vr={class:"tabs","aria-label":"Xếp ca"},xr=Se({__name:"ScheduleModuleNavigation",props:{items:{},activeKey:{}},setup(e){return(r,i)=>{const t=Jn("RouterLink");return a(),s("nav",Vr,[(a(!0),s(H,null,z(e.items,l=>(a(),Te(t,{key:l.key,to:l.key==="calendar"?"/schedules":"/schedules/"+l.key,class:te({active:e.activeKey===l.key})},{default:ce(()=>[O(u(l.label),1)]),_:2},1032,["to","class"]))),128))])}}}),Ar=Ve`
  query BaoCaoCaLamViecThang($nam: Int!, $thang: Int!) {
    baoCaoCaLamViecThang(nam: $nam, thang: $thang) {
      isResults
      message
      data {
        nam
        thang
        soNgayTrongThang
        cotNgay {
          ngayTrongThang
          ngay
        }
        nhanVien {
          tt
          maNhanVien
          hoVaTen
          maBoPhan
          boPhan
          maChucVu
          chucVu
          al
          do
          ph
          cl
          ul
          soNgayCongThucTe
          soNgayCongTieuChuan
          soNgayPhep
          soNgayCongHuongLuong
          cacNgay {
            ngayTrongThang
            giaTri
          }
        }
      }
    }
  }
`;async function Lr(e,r){if(!Number.isInteger(e)||e<2e3||e>2100||!Number.isInteger(r)||r<1||r>12)throw new Error("Tháng/năm báo cáo không hợp lệ.");const{data:i}=await xe.query({query:Ar,variables:{nam:e,thang:r},fetchPolicy:"no-cache",errorPolicy:"none"}),t=i==null?void 0:i.baoCaoCaLamViecThang;if(!(t!=null&&t.isResults)||!t.data)throw new Error((t==null?void 0:t.message)||"Không thể tải báo cáo ca làm việc.");return{...t.data,cotNgay:[...t.data.cotNgay||[]].sort((l,c)=>l.ngayTrongThang-c.ngayTrongThang),nhanVien:t.data.nhanVien||[]}}const Pr={class:"monthly-report"},Br={class:"report-toolbar"},Or={class:"report-controls"},Mr={key:0,class:"report-status",role:"status"},Ur={key:1,class:"report-status error",role:"alert"},Rr={class:"report-summary"},Fr={key:0,class:"outline-controls","aria-label":"Hiển thị nhóm bộ phận"},Hr=["disabled"],Kr=["disabled"],Gr={class:"print-heading"},zr={class:"schedule-sheet"},jr=["title"],Xr={class:"department-heading"},Wr={colspan:"3",scope:"rowgroup",class:"frozen department-label"},Yr=["aria-expanded","aria-label","onClick"],Jr={class:"outline-icon","aria-hidden":"true"},Qr={class:"department-title"},Zr={class:"department-count"},_r=["colspan"],eu={class:"frozen ordinal"},nu={class:"frozen employee-code"},tu={class:"frozen employee-name name"},lu={class:"department"},au={class:"position"},ou=["title","onMouseenter"],iu={key:0},su=["colspan"],ru=Se({__name:"ScheduleReportsTab",setup(e){const r=Yn(),i=C(r.month),t=C(r.year),l=Array.from({length:12},(N,E)=>({value:E+1,label:"Tháng "+(E+1)})),c=Array.from({length:101},(N,E)=>({value:2e3+E,label:String(2e3+E)})),d=C(),v=C(!1),p=C(""),f=C(null),w=C(),g=C(new Set);let P=0;async function m(){const N=++P;v.value=!0,p.value="",d.value=void 0,g.value=new Set;try{const E=await Lr(t.value,i.value);N===P&&(d.value=E)}catch(E){N===P&&(p.value=we(E))}finally{N===P&&(v.value=!1)}}re([i,t],m,{immediate:!0}),hn(()=>++P);const b=Z(()=>{var N;return(((N=d.value)==null?void 0:N.nhanVien)||[]).map(E=>({...E,days:new Map((E.cacNgay||[]).map(X=>[X.ngayTrongThang,X.giaTri]))}))}),K=Z(()=>{var E,X;const N=new Map;for(const ie of b.value){const ue=(E=ie.maBoPhan)==null?void 0:E.trim(),me=(X=ie.boPhan)==null?void 0:X.trim(),he=ue?`code:${ue}`:me?`name:${me}`:"unassigned";let De=N.get(he);De||(De={key:he,label:me||ue||"Chưa có bộ phận",employees:[]},N.set(he,De)),De.employees.push(ie)}return[...N.values()]});function G(N){const E=new Set(g.value);E.has(N)?E.delete(N):E.add(N),g.value=E,f.value=null}function k(){g.value=new Set}function S(){g.value=new Set(K.value.map(N=>N.key)),f.value=null}const T=[{key:"al",label:"AL"},{key:"do",label:"DO"},{key:"ph",label:"PH"},{key:"cl",label:"CL"},{key:"ul",label:"UL"},{key:"soNgayCongThucTe",label:"Số ngày công thực tế"},{key:"soNgayCongTieuChuan",label:"Số ngày công tiêu chuẩn"},{key:"soNgayPhep",label:"Số ngày phép"},{key:"soNgayCongHuongLuong",label:"Số ngày công hưởng lương"}];function L(N){return[0,6].includes(new Date(d.value.nam,d.value.thang-1,N).getDay())}function _(){if(!w.value||!d.value||v.value)return;const N=document.createElement("iframe");N.title="In báo cáo ca làm việc",N.style.cssText="position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;",N.onload=()=>{const E=N.contentWindow;if(!E){N.remove();return}E.addEventListener("afterprint",()=>N.remove(),{once:!0}),E.focus(),E.print(),setTimeout(()=>N.remove(),6e4)},N.srcdoc='<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Báo cáo ca làm việc</title><style>@page{size:A3 landscape;margin:10mm}body{font-family:Arial,sans-serif;color:#111}h2{font-size:16px}p{font-size:10px}col{width:auto!important}table{width:100%;border-collapse:collapse;table-layout:auto;font-size:7px}th,td{border:1px solid #777;padding:4px 2px;text-align:center}th{background:#eee}thead{display:table-header-group}tr{break-inside:avoid}.name,.department,.position{text-align:left}small{display:block}.employee-name{min-width:90px}.department-heading th{background:#e2efda;text-align:left}.department-toggle{border:0;background:transparent;font:inherit;color:inherit;text-align:left}.outline-icon{display:none}.department-count{margin-left:8px;font-weight:normal}.employee-row{display:table-row!important}</style></head><body>'+w.value.innerHTML+"</body></html>",document.body.appendChild(N)}return(N,E)=>(a(),s("section",Pr,[n("div",Br,[E[5]||(E[5]=n("div",null,[n("h2",null,"Báo cáo ca làm việc tháng"),n("p",null,"Chọn tháng và năm để xem lịch và tổng công.")],-1)),n("div",Or,[n("label",null,[E[3]||(E[3]=O("Tháng",-1)),j(W(Ze),{modelValue:i.value,"onUpdate:modelValue":E[0]||(E[0]=X=>i.value=X),options:W(l),"option-label":"label","option-value":"value"},null,8,["modelValue","options"])]),n("label",null,[E[4]||(E[4]=O("Năm",-1)),j(W(Ze),{modelValue:t.value,"onUpdate:modelValue":E[1]||(E[1]=X=>t.value=X),options:W(c),"option-label":"label","option-value":"value",filter:""},null,8,["modelValue","options"])]),j(ke,{label:"In báo cáo",icon:"pi pi-print",outlined:"",disabled:v.value||!d.value||!b.value.length,onClick:_},null,8,["disabled"])])]),v.value?(a(),s("div",Mr,[E[6]||(E[6]=n("i",{class:"pi pi-spin pi-spinner"},null,-1)),O(" Đang tải báo cáo tháng "+u(i.value)+"/"+u(t.value)+"... ",1)])):p.value?(a(),s("div",Ur,[O(u(p.value)+" ",1),j(ke,{label:"Thử lại",text:"",onClick:m})])):d.value?(a(),s(H,{key:2},[n("div",Rr,[n("span",null," Tháng "+u(d.value.thang)+"/"+u(d.value.nam)+" · "+u(d.value.soNgayTrongThang)+" ngày · "+u(b.value.length)+" nhân viên · "+u(K.value.length)+" bộ phận ",1),b.value.length?(a(),s("div",Fr,[n("button",{type:"button",disabled:!g.value.size,onClick:k},[...E[7]||(E[7]=[n("i",{class:"pi pi-plus","aria-hidden":"true"},null,-1),O(" Mở tất cả ",-1)])],8,Hr),n("button",{type:"button",disabled:g.value.size===K.value.length,onClick:S},[...E[8]||(E[8]=[n("i",{class:"pi pi-minus","aria-hidden":"true"},null,-1),O(" Thu gọn tất cả ",-1)])],8,Kr)])):D("",!0)]),n("div",{class:"sheet-scroll",onMouseleave:E[2]||(E[2]=X=>f.value=null)},[n("div",{ref_key:"printable",ref:w},[n("div",Gr,[n("h2",null,"Báo cáo ca làm việc tháng "+u(d.value.thang)+"/"+u(d.value.nam),1),n("p",null,u(b.value.length)+" nhân viên",1)]),n("table",zr,[n("colgroup",null,[E[9]||(E[9]=n("col",{style:{width:"44px"}},null,-1)),E[10]||(E[10]=n("col",{style:{width:"90px"}},null,-1)),E[11]||(E[11]=n("col",{style:{width:"180px"}},null,-1)),E[12]||(E[12]=n("col",{style:{width:"140px"}},null,-1)),E[13]||(E[13]=n("col",{style:{width:"140px"}},null,-1)),(a(!0),s(H,null,z(d.value.cotNgay,X=>(a(),s("col",{key:X.ngayTrongThang,style:{width:"44px"}}))),128)),(a(),s(H,null,z(T,X=>n("col",{key:X.key,style:dn({width:X.key.startsWith("soNgay")?"110px":"56px"})},null,4)),64))]),n("thead",null,[n("tr",null,[E[14]||(E[14]=n("th",{class:"frozen ordinal"},"TT",-1)),E[15]||(E[15]=n("th",{class:"frozen employee-code"},"Mã NV",-1)),E[16]||(E[16]=n("th",{class:"frozen employee-name"},"Họ và tên",-1)),E[17]||(E[17]=n("th",null,"Bộ phận",-1)),E[18]||(E[18]=n("th",null,"Chức vụ",-1)),(a(!0),s(H,null,z(d.value.cotNgay,X=>(a(),s("th",{key:X.ngayTrongThang,title:X.ngay,class:te({weekend:L(X.ngayTrongThang),highlight:f.value===X.ngayTrongThang})},u(String(X.ngayTrongThang).padStart(2,"0")),11,jr))),128)),(a(),s(H,null,z(T,X=>n("th",{key:X.key,class:"total"},u(X.label),1)),64))])]),(a(!0),s(H,null,z(K.value,X=>(a(),s("tbody",{key:X.key},[n("tr",Xr,[n("th",Wr,[n("button",{type:"button",class:"department-toggle","aria-expanded":!g.value.has(X.key),"aria-label":`${g.value.has(X.key)?"Mở":"Thu gọn"} bộ phận ${X.label}`,onClick:ie=>G(X.key)},[n("span",Jr,u(g.value.has(X.key)?"+":"−"),1),n("span",Qr,u(X.label),1),n("span",Zr,u(X.employees.length)+" NV",1)],8,Yr)]),n("th",{colspan:2+d.value.cotNgay.length+T.length,class:"department-fill"},null,8,_r)]),(a(!0),s(H,null,z(X.employees,ie=>ae((a(),s("tr",{key:ie.maNhanVien,class:"employee-row"},[n("td",eu,u(ie.tt),1),n("td",nu,u(ie.maNhanVien),1),n("td",tu,u(ie.hoVaTen),1),n("td",lu,u(ie.boPhan||ie.maBoPhan||"—"),1),n("td",au,u(ie.chucVu||ie.maChucVu||"—"),1),(a(!0),s(H,null,z(d.value.cotNgay,ue=>(a(),s("td",{key:ue.ngayTrongThang,class:te({weekend:L(ue.ngayTrongThang),highlight:f.value===ue.ngayTrongThang}),title:ie.hoVaTen+" · "+ue.ngay+" · "+(ie.days.get(ue.ngayTrongThang)||"Chưa phân công"),onMouseenter:me=>f.value=ue.ngayTrongThang},u(ie.days.get(ue.ngayTrongThang)||""),43,ou))),128)),(a(),s(H,null,z(T,ue=>n("td",{key:ue.key,class:"total"},u(ie[ue.key]??0),1)),64))])),[[vl,!g.value.has(X.key)]])),128))]))),128)),b.value.length?D("",!0):(a(),s("tbody",iu,[n("tr",null,[n("td",{colspan:5+d.value.cotNgay.length+T.length,class:"empty"}," Chưa có dữ liệu báo cáo trong tháng này. ",8,su)])]))])],512)],32)],64)):D("",!0)]))}}),uu=tn(ru,[["__scopeId","data-v-4fb17054"]]),du={class:"panel form"},cu={class:"toolbar"},hu={class:"actions"},vu={class:"table-scroll"},mu={class:"report"},pu=["onClick"],gu={key:0},fu=Se({__name:"ScheduleSwapsTab",props:Be({rows:{},canApprove:{type:Boolean},canCreate:{type:Boolean},assignmentLabel:{type:Function},shiftName:{type:Function}},{tab:{required:!0},tabModifiers:{}}),emits:Be(["create","detail"],["update:tab"]),setup(e,{emit:r}){const i=de(e,"tab"),t=r,l={PENDING:"Chờ duyệt",APPROVED:"Đã duyệt",REJECTED:"Từ chối",CANCELLED:"Đã hủy"};return(c,d)=>(a(),s("section",du,[n("div",cu,[n("div",hu,[n("button",{class:te({chosen:i.value==="ALL"}),onClick:d[0]||(d[0]=v=>i.value="ALL")},"Yêu cầu",2),e.canApprove?(a(),s("button",{key:0,class:te({chosen:i.value==="PENDING"}),onClick:d[1]||(d[1]=v=>i.value="PENDING")}," Chờ tôi duyệt ",2)):D("",!0),n("button",{class:te({chosen:i.value==="DONE"}),onClick:d[2]||(d[2]=v=>i.value="DONE")},"Đã xử lý",2)]),e.canCreate?(a(),s("button",{key:0,class:"primary",onClick:d[3]||(d[3]=v=>t("create"))},"+ Tạo yêu cầu")):D("",!0)]),n("div",vu,[n("table",mu,[d[5]||(d[5]=n("thead",null,[n("tr",null,[n("th",null,"Mã yêu cầu"),n("th",null,"Ca hiện tại"),n("th",null,"Đổi với / ca sau đổi"),n("th",null,"Lý do"),n("th",null,"Ngày gửi"),n("th",null,"Trạng thái"),n("th",null,"Thao tác")])],-1)),n("tbody",null,[(a(!0),s(H,null,z(e.rows,v=>(a(),s("tr",{key:v.id},[n("td",null,u(v.code),1),n("td",null,u(e.assignmentLabel(v.assignmentId)),1),n("td",null,u(v.targetAssignmentId?e.assignmentLabel(v.targetAssignmentId):e.shiftName(v.shiftId)),1),n("td",null,u(v.reason),1),n("td",null,u(new Date(v.createdAt).toLocaleString("vi-VN")),1),n("td",null,u(l[v.status]),1),n("td",null,[n("button",{onClick:p=>t("detail",v)},"Xem",8,pu)])]))),128)),e.rows.length?D("",!0):(a(),s("tr",gu,[...d[4]||(d[4]=[n("td",{colspan:"7",class:"empty-state"},"Không có yêu cầu trong trạng thái này.",-1)])]))])])])]))}}),yu={class:"panel form"},bu={class:"toolbar"},qu={key:0,class:"empty-state"},ku={class:"toolbar"},wu={class:"pattern"},Tu={class:"actions"},Cu=["onClick"],$u=["onClick"],Du=["onClick"],Nu=["disabled","onClick"],Iu=["onClick"],Su=Se({__name:"ScheduleTemplatesTab",props:{templates:{},shifts:{},departments:{},busy:{type:Boolean},canCreate:{type:Boolean},canEdit:{type:Boolean},canBulk:{type:Boolean}},emits:["create","open","toggle","apply"],setup(e,{emit:r}){const i=r;return(t,l)=>(a(),s("section",yu,[n("div",bu,[l[1]||(l[1]=n("div",null,[n("h2",null,"Mẫu lịch tái sử dụng"),n("p",null,"Mẫu chỉ trở thành lịch thực tế khi được áp dụng.")],-1)),e.canCreate?(a(),s("button",{key:0,class:"primary",onClick:l[0]||(l[0]=c=>i("create"))},"+ Tạo mẫu")):D("",!0)]),e.templates.length?D("",!0):(a(),s("p",qu," Chưa có mẫu lịch. Tạo mẫu để tái sử dụng khi phân công. ")),(a(!0),s(H,null,z(e.templates,c=>(a(),s("article",{key:c.id,class:"template-card"},[n("div",ku,[n("h3",null,u(c.name),1),n("span",null,u(c.active?"Hoạt động":"Ngừng sử dụng"),1)]),n("p",null,u(c.scheduleType==="ADMINISTRATIVE"?"Hành chính":"Xoay ca")+" · "+u(c.department||"Tất cả bộ phận")+" · "+u(c.kind==="WEEK"?"Tuần":"Chu kỳ "+c.days.length+" ngày"),1),n("div",wu,[(a(!0),s(H,null,z(c.days,(d,v)=>{var p;return a(),s("span",{key:v},[n("small",null,u(c.kind==="WEEK"?["T2","T3","T4","T5","T6","T7","CN"][v]:v+1),1),O(" "+u(d==="OFF"?"Nghỉ":(p=e.shifts.find(f=>f.id===d))==null?void 0:p.name),1)])}),128))]),n("div",Tu,[n("button",{onClick:d=>i("open",c,!1,!0)},"Xem",8,Cu),e.canEdit?(a(),s("button",{key:0,onClick:d=>i("open",c,!1,!1)},"Sửa",8,$u)):D("",!0),e.canCreate?(a(),s("button",{key:1,onClick:d=>i("open",c,!0,!1)},"Nhân bản",8,Du)):D("",!0),e.canEdit?(a(),s("button",{key:2,disabled:e.busy,onClick:d=>i("toggle",c)},u(c.active?"Ngừng sử dụng":"Kích hoạt"),9,Nu)):D("",!0),c.active&&e.canBulk?(a(),s("button",{key:3,onClick:d=>i("apply",c)}," Áp dụng mẫu ",8,Iu)):D("",!0)])]))),128))]))}}),Eu=Se({__name:"AppDialog",setup(e){return(r,i)=>(a(),Te(W(Re),Et(Vt(r.$attrs)),{default:ce(()=>[St(r.$slots,"default")]),_:3},16))}}),It=[{id:"HC",code:"D",name:"Ca D · Hành chính",scheduleType:"ADMINISTRATIVE",startTime:"08:00",endTime:"17:00",crossDay:!1,displayColor:"#2563eb",active:!0},{id:"M",code:"M",name:"Ca sáng",scheduleType:"ROTATING",startTime:"06:00",endTime:"14:00",crossDay:!1,displayColor:"#059669",active:!0},{id:"E",code:"E",name:"Ca chiều",scheduleType:"ROTATING",startTime:"14:00",endTime:"22:00",crossDay:!1,displayColor:"#d97706",active:!0},{id:"N",code:"N",name:"Ca đêm",scheduleType:"ROTATING",startTime:"22:00",endTime:"06:00",crossDay:!0,displayColor:"#7c3aed",active:!0}],Gt="hotel-shift-scheduling-v2";let Je;function In(e){if(!Bt().can("schedules",e))throw new Error("Bạn không có quyền thực hiện thao tác này.")}async function Sn(){if(Je)return Je;const e=localStorage.getItem(Gt);if(e){Je=JSON.parse(e);const i=Je.shifts.find(t=>t.id==="HC"||t.code==="HC");return i&&(i.code="D",i.name="Ca D · Hành chính"),Je}const r=await yl.list("schedules",{page:1,pageSize:1e3,search:"",filters:{},sortField:"date",sortOrder:1});return Je={shifts:structuredClone(It),templates:[],swaps:[],history:[],assignments:r.all.map(i=>{const t=It.find(l=>`${l.startTime}–${l.endTime}`===i.shift||l.code===i.shift);return{id:i.id,employeeId:String(i.employeeId),date:String(i.date),shiftId:(t==null?void 0:t.id)||"",scheduleType:(t==null?void 0:t.scheduleType)||"ROTATING",status:i.shift==="OFF"?"OFF":["AL","SL"].includes(String(i.shift))?"LEAVE":"SCHEDULED",note:String(i.note||""),revision:1}})},Je}function Kn(e){return localStorage.setItem(Gt,JSON.stringify(e)),Je=e,structuredClone(e)}function dt(e,r){const i=[],t=l=>{const c=e.shifts.find(d=>d.id===l.shiftId);if(!(!c||l.status!=="SCHEDULED"))return[Date.parse(`${l.date}T${l.startTime||c.startTime}:00`),Date.parse(`${l.date}T${l.endTime||c.endTime}:00`)+(l.crossDay??c.crossDay?864e5:0)]};return r.forEach((l,c)=>{for(const d of[...e.assignments.filter(v=>v.id!==l.id),...r.slice(0,c)]){if(l.employeeId!==d.employeeId)continue;const v=t(l),p=t(d);(l.date===d.date||v&&p&&v[0]<p[1]&&p[0]<v[1])&&i.push({row:l,existing:d,reason:d.status==="LEAVE"?"Nhân viên đang nghỉ phép":l.date===d.date?"Đã có phân công trong ngày":"Ca chồng lấn thời gian, có thể qua đêm"})}}),i}const En={load:()=>Nn(async()=>(In("view"),structuredClone(await Sn()))),assign:(e,r=[])=>Nn(async()=>{var c;if(In(e.length>1?"bulk":(c=e[0])!=null&&c.id?"edit":"create"),e.some(d=>Ae(d.date)))throw new Error("Không được phân công ngày trong quá khứ.");const i=await Sn(),t={...i,shifts:[...i.shifts.filter(d=>!r.some(v=>v.id===d.id)),...r]};if(!e.length)throw new Error("Chưa có phân công để lưu.");if(dt(t,e).length)throw new Error("Lịch có xung đột. Hãy kiểm tra nhân viên, ngày và ca hiện có.");const l=structuredClone(t);for(const d of e){const v=t.assignments.find(f=>f.id===d.id);if(d.id&&(!v||v.revision!==d.revision))throw new Error("Lịch gốc đã thay đổi. Vui lòng tải lại.");if(d.status==="SCHEDULED"&&!t.shifts.some(f=>f.id===d.shiftId&&f.active&&f.scheduleType===d.scheduleType))throw new Error("Ca không hoạt động hoặc không phù hợp loại lịch.");const p={...d,id:d.id||crypto.randomUUID(),revision:((v==null?void 0:v.revision)||0)+1};l.assignments=[...l.assignments.filter(f=>f.id!==p.id),p],l.history.push({assignmentId:p.id,date:new Date().toISOString(),action:v?"Sửa phân công":"Tạo phân công"})}return Kn(l)}),template:e=>Nn(async()=>{In(e.id?"edit":"create");const r=structuredClone(await Sn());if(!e.name.trim()||!e.days.length||e.kind==="WEEK"&&e.days.length!==7)throw new Error("Nhập tên mẫu và cấu hình đầy đủ các ngày.");if(e.days.some(t=>t!=="OFF"&&!r.shifts.some(l=>l.id===t&&l.active&&l.scheduleType===e.scheduleType)))throw new Error("Mẫu có ca không hợp lệ.");const i={...e,id:e.id||crypto.randomUUID()};return r.templates=[...r.templates.filter(t=>t.id!==i.id),i],Kn(r)}),request:e=>Nn(async()=>{In("create");const r=structuredClone(await Sn()),i=r.assignments.find(l=>l.id===e.assignmentId),t=r.assignments.find(l=>l.id===e.targetAssignmentId);if(!i||i.status!=="SCHEDULED"||!e.reason.trim())throw new Error("Chọn ca đã phân công và nhập lý do.");if(e.targetAssignmentId&&(!t||t.employeeId===i.employeeId||t.status!=="SCHEDULED"))throw new Error("Chọn ca của nhân viên khác.");if(!t&&!r.shifts.some(l=>l.id===e.shiftId&&l.active))throw new Error("Chọn ca muốn đổi.");if(r.swaps.some(l=>l.status==="PENDING"&&[l.assignmentId,l.targetAssignmentId].some(c=>c&&[i.id,t==null?void 0:t.id].includes(c))))throw new Error("Ca đã có yêu cầu chờ duyệt.");return r.swaps.push({...e,id:crypto.randomUUID(),code:"DC"+String(r.swaps.length+1).padStart(5,"0"),status:"PENDING",createdAt:new Date().toISOString(),sourceSnapshot:{...i},targetSnapshot:t?{...t}:void 0,sourceRevision:i.revision,targetRevision:(t==null?void 0:t.revision)||0,decision:""}),Kn(r)}),decide:(e,r,i)=>Nn(async()=>{In(r?"approve":"reject");const t=structuredClone(await Sn()),l=t.swaps.find(c=>c.id===e);if(!l||l.status!=="PENDING")throw new Error("Yêu cầu đã xử lý hoặc không tồn tại.");if(!r&&!i.trim())throw new Error("Nhập lý do từ chối.");if(r){const c=t.assignments.find(w=>w.id===l.assignmentId),d=t.assignments.find(w=>w.id===l.targetAssignmentId);if(!c||c.revision!==l.sourceRevision||l.targetAssignmentId&&(!d||d.revision!==l.targetRevision))throw new Error("Lịch gốc đã thay đổi; yêu cầu không còn hợp lệ.");const v=[{...c,shiftId:(d==null?void 0:d.shiftId)||l.shiftId,revision:c.revision+1}];d&&v.push({...d,shiftId:c.shiftId,revision:d.revision+1}),v.forEach(w=>{const g=t.shifts.find(P=>P.id===w.shiftId&&P.active);if(!g)throw new Error("Ca không còn hoạt động.");w.scheduleType=g.scheduleType});const p={...t,assignments:t.assignments.filter(w=>!v.some(g=>g.id===w.id))},f=dt(p,v);if(f.length)throw new Error(f.map(w=>`${w.row.employeeId} · ${w.row.date}: ${w.row.shiftId} xung đột ${w.existing.shiftId} (${w.reason})`).join(`
`));t.assignments=[...p.assignments,...v],v.forEach(w=>t.history.push({assignmentId:w.id,date:new Date().toISOString(),action:"Duyệt đổi ca "+l.code}))}return l.status=r?"APPROVED":"REJECTED",l.decision=i,Kn(t)})};function Vu(e,r,i,t,l){const c=p=>i.scheduleType==="ADMINISTRATIVE"&&new Date(`${p}T12:00:00`).getDay()===0,d=l.filter(p=>!c(p.date)),v=new Set([...t,...d].map(p=>`${p.employeeId}:${p.date}`));for(const p of e)for(const f of r)c(f)||Ae(f)||v.has(`${p.code}:${f}`)||(d.push({employeeId:p.code,date:f,shiftId:i.id,fullTime:!0,note:""}),v.add(`${p.code}:${f}`));return d.sort((p,f)=>p.date.localeCompare(f.date))}const xu={class:"shift-module"},Au={class:"page-heading"},Lu={key:0,class:"demo"},Pu={key:1,class:"error",role:"alert"},Bu={key:2,role:"status"},Ou={key:0,class:"panel filters"},Mu=["value"],Uu=["value"],Ru={class:"schedule-filter-fields"},Fu=["value"],Hu=["value"],Ku={class:"schedule-filter-search"},Gu={class:"schedule-filter-actions"},zu={key:2,class:"schedule-calendar-layout"},ju={class:"department-filter-tree","aria-labelledby":"department-filter-title"},Xu={key:0,role:"status"},Wu={key:1,role:"alert",class:"error"},Yu=["aria-pressed"],Ju={"aria-label":"Cây bộ phận theo loại lịch"},Qu=["aria-pressed","onClick"],Zu={key:0,open:""},_u=["aria-pressed","onClick"],ed={class:"schedule-calendar-pane"},nd={class:"schedule-filter-toolbar"},td=["aria-label"],ld={key:0,class:"schedule-filter-count"},yd=Se({__name:"ScheduleListView",setup(e){const r=ml(),i=pl(),t=Bt(),l=vn(),c={all:C([]),loading:C(!1),error:C(""),async load(){c.loading.value=!0,c.error.value="";try{c.all.value=(await fl.list(null)).map(h=>({id:h.maNhanVien,code:h.maNhanVien,name:String(h.hoTen||[h.ho,h.tenDem,h.ten].filter(Boolean).join(" ")),department:String(h.tenBoPhan||""),position:String(h.tenChucVu||""),positionCode:h.maChucVu==null?"":String(h.maChucVu),status:String(h.trangThaiNhanVien??"")}))}catch(h){c.error.value=we(h)}finally{c.loading.value=!1}}};un(()=>c.load());const d={all:C([]),loading:C(!1),error:C(""),async load(){d.loading.value=!0,d.error.value="";try{d.all.value=await wa()}catch(h){d.error.value=we(h)}finally{d.loading.value=!1}}};un(()=>d.load());const v=C([]),p=C([]),f=C(!1),w=C("");let g=0;async function P(){const h=++g;f.value=!0,w.value="";try{const o=await Ta(d.all.value);if(h!==g)return;v.value=o.groups,p.value=o.unavailable}catch(o){h===g&&(w.value=we(o))}finally{h===g&&(f.value=!1)}}re(()=>d.all.value,()=>{P()});const m=C({shifts:[],assignments:[],templates:[],swaps:[],history:[]}),b=C([]),K=C(!1),G=C(!1),k=C(""),S=C(!1),T=[{key:"assign",label:"Phân công ca"},{key:"reports",label:"Báo cáo lịch làm việc"}],L=Z(()=>String(r.meta.schedulePage||"assign")),_=Z(()=>{var h;return L.value==="exchange"?"Đổi ca":L.value==="leave-calendar"?"Lịch nghỉ phép":(h=T.find(o=>o.key===L.value))==null?void 0:h.label});function N(h){return`${h.getFullYear()}-${String(h.getMonth()+1).padStart(2,"0")}-${String(h.getDate()).padStart(2,"0")}`}const E=N(new Date),X=C(E),ie=C("week");function ue(h,o){const R=[],F=new Date(h+"T12:00:00");for(;N(F)<=o&&R.length<367;)R.push(N(F)),F.setDate(F.getDate()+1);return R}const me=Z(()=>Qn(X.value,ie.value)),he=Z(()=>ue(me.value.from,me.value.to));function De(h){const o=new Date(X.value+"T12:00:00");ie.value==="month"?(o.setDate(1),o.setMonth(o.getMonth()+h)):o.setDate(o.getDate()+h*(ie.value==="week"?7:1)),X.value=N(o)}function $e(h){return new Date(h+"T12:00:00").toLocaleDateString("vi-VN")}const ve=C(""),B=C(""),M=C(""),ee=C(""),se=C(""),pe=C(""),J=C(!1),ge=At({employee:"",type:"",shiftFilter:"",status:"",search:""}),Ye=Z(()=>[ve.value,B.value,M.value,ee.value,se.value,pe.value].filter(h=>h.trim()).length);function mn(){Object.assign(ge,{employee:B.value,type:M.value,shiftFilter:ee.value,status:se.value,search:pe.value}),J.value=!0}function ln(){B.value=ge.employee,M.value=ge.type,ee.value=ge.shiftFilter,se.value=ge.status,pe.value=ge.search.trim(),J.value=!1}function je(){ve.value="",B.value="",M.value="",ee.value="",se.value="",pe.value="",Object.assign(ge,{employee:"",type:"",shiftFilter:"",status:"",search:""}),J.value=!1}const U=Z(()=>d.all.value.map(h=>h.name)),I=Z(()=>c.all.value.filter(h=>(!ve.value||h.department===ve.value)&&(!B.value||h.code===B.value)&&`${h.code} ${h.name}`.toLocaleLowerCase().includes(pe.value.toLocaleLowerCase())));function q(h){const o=c.all.value.find(R=>R.code===h);return o?`${o.code} · ${o.name}`:h}function $(h){var o;return((o=c.all.value.find(R=>R.code===h))==null?void 0:o.name)||h}function V(h){if(h==="OFF")return"Nghỉ";const o=m.value.shifts.find(R=>R.id===h);return o?`${o.name} · ${o.startTime}–${o.endTime}${o.crossDay?" (+1 ngày)":""}`:"⚠ Ca chưa có trong danh mục"}function x(h){return m.value.assignments.filter(o=>o.employeeId===h&&he.value.includes(o.date)&&le(o)).sort((o,R)=>o.date.localeCompare(R.date)||(o.startTime||"").localeCompare(R.startTime||""))}function A(h){var o;return h.shiftSymbol||((o=m.value.shifts.find(R=>R.id===h.shiftId))==null?void 0:o.code)||h.shiftId}function Q(h,o){return m.value.assignments.find(R=>R.employeeId===h&&R.date===o)}function ne(h){var o;return h?h.status==="OFF"?"Nghỉ":h.status==="LEAVE"?"Nghỉ phép":(h.startTime&&h.endTime?`${h.shiftName||((o=m.value.shifts.find(R=>R.id===h.shiftId))==null?void 0:o.name)||h.shiftId} · ${h.startTime}–${h.endTime}${h.crossDay?" (+1 ngày)":""}`:V(h.shiftId))+(h.fullTime===!1?" · 1/2 ca":" · Cả ca"):"Chưa phân công"}function le(h){return(!M.value||(h==null?void 0:h.scheduleType)===M.value)&&(!ee.value||(h==null?void 0:h.shiftId)===ee.value)&&(!se.value||((h==null?void 0:h.status)||"UNASSIGNED")===se.value)}const Ke=Z(()=>I.value.filter(h=>he.value.some(o=>le(Q(h.code,o))))),Ee=h=>!!h&&m.value.swaps.some(o=>o.status==="PENDING"&&[o.assignmentId,o.targetAssignmentId].includes(h.id));let Oe=0;async function Fe(){const h=++Oe;if(L.value==="exchange"||L.value==="leave-calendar"){K.value=!1,k.value="";return}K.value=!0,k.value="";try{if(L.value==="calendar"){const o=await Gn(me.value.from,me.value.to);if(h!==Oe)return;m.value={...m.value,...o}}else if(L.value==="assign"){const o=await Gn(nn.value.start,nn.value.end);if(h!==Oe)return;m.value={...m.value,...o}}else{const o=await En.load();if(h!==Oe)return;m.value=o}}catch(o){h===Oe&&(k.value=we(o))}finally{h===Oe&&(K.value=!1)}}un(Fe);let Ge=0;async function Zn(){if(L.value!=="assign")return;const h=++Ge,{start:o,end:R}=lt.value;try{const F=await Al(o,R);h===Ge&&L.value==="assign"&&(b.value=F)}catch(F){h===Ge&&(k.value=we(F))}}un(Zn),re([L,()=>me.value.from,()=>me.value.to],([h])=>{h==="calendar"&&Fe()}),re(L,()=>{L.value!=="calendar"&&Fe()});async function An(h){if(G.value)return!1;G.value=!0,k.value="";try{return m.value=await h(),S.value=!1,l.success("success"),!0}catch(o){return k.value=we(o),!1}finally{G.value=!1}}Lt(()=>!S.value||window.confirm("Có thay đổi chưa lưu. Bạn muốn rời màn hình?")),Pt(()=>!S.value||window.confirm("Có thay đổi chưa lưu. Bạn muốn rời màn hình?"));const vt=h=>{S.value&&h.preventDefault()};window.addEventListener("beforeunload",vt),hn(()=>window.removeEventListener("beforeunload",vt));const an=C();function mt(h){G.value||!t.can("schedules","edit")||(an.value={...h,scheduleType:ye.value})}async function zt(){an.value=void 0,await on()}const Ln=C(),_n=C(!1),pt=C(!1);function jt(h,o){Q(h,o)||t.can("schedules","create")&&i.push({path:"/schedules/assign",query:{employee:h,date:o}})}const _e=C(!1),fe=C(""),Me=C([]),et=C(""),ye=C("ROTATING"),He=C(E),en=C(E),pn=C(""),Pe=C("calendar"),gn=C(Array(7).fill("OFF")),fn=C(""),nt=C(""),be=C(),Ue=C([]),yn=C(!1),Ce=C([]),ze=C([]),bn=C(!1),Pn=C("");let qn=0;async function tt(){var R,F;const h=++qn;bn.value=!0,Pn.value="",ze.value=[];const o=((R=d.all.value.find(Y=>Y.name===fe.value))==null?void 0:R.code)||null;if(!o){bn.value=!1;return}try{const[Y,y]=await Promise.all([Xn(o,ye.value),Gn(nn.value.start,nn.value.end)]);if(h!==qn)return;m.value.assignments=y.assignments,ze.value=Y.filter(Ne=>Ne.workType!=="0"),be.value||(ye.value=((F=Y[0])==null?void 0:F.scheduleType)||"ROTATING"),m.value.shifts=[...m.value.shifts.filter(Ne=>!Y.some(qe=>qe.id===Ne.id)),...Y],!be.value&&ye.value==="ADMINISTRATIVE"&&wn()}catch(Y){h===qn&&(Pn.value=we(Y))}finally{h===qn&&(bn.value=!1)}}async function Xt(h){var Ne;if(G.value||!t.can("schedules","create"))throw new Error("Bạn không có quyền tạo phân công ca hoặc hệ thống đang bận.");if(Ae(h.date))throw new Error("Không được phân công ngày trong quá khứ.");const o=(Ne=d.all.value.find(qe=>qe.name===fe.value))==null?void 0:Ne.code,R=b.value.find(qe=>qe.maNhanVien===h.employeeId),F=c.all.value.find(qe=>qe.code===h.employeeId),Y=ze.value.find(qe=>qe.id===h.shiftId&&qe.active&&qe.workType!=="0");if(!o||!Bn.value.some(qe=>qe.code===h.employeeId)||!Y)throw new Error("Nhân viên, bộ phận hoặc ca làm việc không hợp lệ.");if(m.value.assignments.some(qe=>qe.employeeId===h.employeeId&&qe.date===h.date))throw new Error("Nhân viên đã có phân công trong ngày này. Vui lòng tải lại lịch.");const y={maBoPhan:o,maChucVu:(R==null?void 0:R.maChucVu)||(F!=null&&F.positionCode?String(F.positionCode):null),maNhanVien:h.employeeId,ngayLamViec:h.date+"T00:00:00+07:00",maCa:h.shiftId,gioBatDau:h.startTime?jn(h.startTime):null,gioKetThuc:h.endTime?jn(h.endTime):null,ghiChu:h.note.trim()||null};G.value=!0;try{const qe=await Ll(y);Ce.value=Ce.value.filter(Dn=>Dn.employeeId!==h.employeeId||Dn.date!==h.date),l.success(qe.message||"Tạo phân công ca thành công."),await on()}finally{G.value=!1}}async function on(){await tt(),await Zn()}re(fe,()=>{++qn,ze.value=[],bn.value=!1,Pn.value="",be.value||(Ce.value=[])}),re(Ce,()=>{S.value=!0,Ue.value=[]},{deep:!0});const Bn=Z(()=>{var R;const h=((R=d.all.value.find(F=>F.name===fe.value))==null?void 0:R.code)||"",o=b.value.filter(F=>!fe.value||F.maBoPhan===h||F.tenBoPhan===fe.value).map(F=>({code:F.maNhanVien,name:F.hoTen,department:F.tenBoPhan||""}));for(const F of c.all.value.filter(Y=>Y.department===fe.value))o.some(Y=>Y.code===F.code)||o.push({code:F.code,name:F.name,department:String(F.department||"")});return o}),Wt=Z(()=>(be.value?c.all.value.filter(o=>{var R;return o.code===((R=be.value)==null?void 0:R.employeeId)}).map(o=>({code:o.code,name:o.name,department:String(o.department||"")})):Bn.value).filter(o=>`${o.code} ${o.name}`.toLowerCase().includes(et.value.toLowerCase())));function gt(){var h;return((h=ze.value[0])==null?void 0:h.scheduleType)||"ROTATING"}const ft=Z(()=>ze.value.filter(h=>h.active&&h.scheduleType===ye.value)),sn=C("week"),kn=C(E),nn=Z(()=>{const h=new Date(kn.value+"T12:00:00");sn.value==="week"?h.setDate(h.getDate()-(h.getDay()+6)%7):h.setDate(1);const o=new Date(h);return sn.value==="week"?o.setDate(o.getDate()+6):o.setMonth(o.getMonth()+1,0),{start:N(h),end:N(o)}}),lt=Z(()=>nn.value);re([L,()=>lt.value.start,()=>lt.value.end],([h])=>{h==="assign"&&Zn()});function wn(h=!1){const o=ze.value.find(F=>F.active&&F.scheduleType==="ADMINISTRATIVE");if(!fe.value||!o){h&&(Ce.value=[]);return}const R=Bn.value;Ce.value=Vu(R,ue(nn.value.start,nn.value.end),o,m.value.assignments,h?[]:Ce.value).filter(F=>!b.value.some(Y=>Y.maNhanVien===F.employeeId&&Y.danhSachNgayXepCa.includes(F.date)))}re([Me,ye,He,en,pn,Pe,gn,fn,nt,_e],()=>{S.value=!0,Ue.value=[]},{deep:!0}),re(ye,()=>{pn.value="",fn.value="",gn.value=Array(7).fill("OFF"),be.value||(ye.value==="ADMINISTRATIVE"?wn(!0):Ce.value=[])}),re(fe,()=>{be.value||(Me.value=[]),fn.value="",be.value||(ye.value=gt()),!be.value&&ye.value==="ADMINISTRATIVE"&&wn(!0)}),re([fe,sn,kn,()=>d.all.value],()=>{L.value==="assign"&&fe.value&&tt()}),re(()=>b.value,()=>{!be.value&&ye.value==="ADMINISTRATIVE"&&wn()});const Yt=Z(()=>b.value.map(h=>({employeeId:h.maNhanVien,dates:h.danhSachNgayXepCa})));function at(){var o,R;be.value=void 0,Ce.value=[],Pe.value="calendar",_e.value=!1,fe.value="",ye.value="ROTATING",Me.value=r.query.employee?[String(r.query.employee)]:[],He.value=String(r.query.date||E),en.value=He.value,sn.value="week",kn.value=He.value;const h=m.value.assignments.find(F=>F.id===r.query.edit);if(h)be.value=h,Me.value=[h.employeeId],fe.value=String(((o=c.all.value.find(F=>F.code===h.employeeId))==null?void 0:o.department)||""),ye.value=h.scheduleType,He.value=en.value=h.date,nt.value=h.note,setTimeout(()=>{pn.value=h.status==="OFF"?"OFF":h.shiftId,Ce.value=[{employeeId:h.employeeId,date:h.date,shiftId:pn.value,fullTime:h.fullTime!==!1,note:h.note,startTime:h.startTime,endTime:h.endTime,crossDay:h.crossDay}],S.value=!1},0);else if(Me.value.length){const F=Me.value[0];fe.value=String(((R=c.all.value.find(Y=>Y.code===F))==null?void 0:R.department)||""),ye.value=gt(),setTimeout(()=>{Me.value=[F],S.value=!1},0)}!h&&ye.value==="ADMINISTRATIVE"&&fe.value&&wn(),setTimeout(()=>{S.value=!1},0)}re(()=>r.fullPath,at),re(()=>m.value.assignments.length,()=>{r.query.edit&&!be.value&&at()}),un(at);function Jt(){if(be.value){mt(be.value);return}if(k.value="",Pe.value==="calendar"?Ce.value.some(R=>Ae(R.date)):Ae(He.value)){k.value="Không được phân công ngày trong quá khứ.";return}if(Pe.value==="calendar"&&ye.value==="ADMINISTRATIVE"&&Ce.value.some(R=>new Date(`${R.date}T12:00:00`).getDay()===0)){k.value="Không phân công ca hành chính vào Chủ nhật.";return}if(!fe.value){k.value="Chọn bộ phận để xác định loại lịch phân công.";return}if(Pe.value!=="calendar"&&(!Me.value.length||!_e.value&&Me.value.length!==1)){k.value="Chọn nhân viên cần phân công.";return}if(!He.value||!en.value||He.value>en.value||ue(He.value,en.value).length>366){k.value="Khoảng ngày không hợp lệ (tối đa 366 ngày mỗi lần).";return}if(Pe.value==="calendar"){if(!Ce.value.length){k.value="Chọn ít nhất một ngày trên lịch và ca cho ngày đó.";return}if(Ce.value.some(F=>!Bn.value.some(Y=>Y.code===F.employeeId))){k.value="Nhân viên trong phân công không còn tồn tại.";return}const R=Ce.value.map(F=>{var Y,y;return{id:((Y=be.value)==null?void 0:Y.id)||"",employeeId:F.employeeId,date:F.date,shiftId:F.shiftId==="OFF"?"":F.shiftId,scheduleType:ye.value,status:F.shiftId==="OFF"?"OFF":"SCHEDULED",note:F.note,fullTime:F.fullTime,leaveTypeId:F.leaveTypeId,startTime:F.startTime,endTime:F.endTime,crossDay:F.crossDay,revision:((y=be.value)==null?void 0:y.revision)||0}});if(R.some(F=>F.status==="SCHEDULED"&&!ft.value.some(Y=>Y.id===F.shiftId))){k.value="Ca đã chọn không còn hoạt động hoặc không phù hợp loại lịch. Chọn lại ca.";return}bt(R);return}const h=m.value.templates.find(R=>R.id===fn.value&&R.active);if(Pe.value==="template"&&!h){k.value="Chọn mẫu đang hoạt động.";return}const o=[];for(const R of Me.value)ue(He.value,en.value).forEach((F,Y)=>{var qe,Dn;const y=(new Date(F+"T12:00:00").getDay()+6)%7;if(ye.value==="ADMINISTRATIVE"&&y===6)return;const Ne=Pe.value==="template"&&h?h.days[h.kind==="WEEK"?y:Y%h.days.length]:Pe.value==="weekly"?gn.value[y]:Pe.value==="cycle"?gn.value[Y%gn.value.length]:pn.value;o.push({id:((qe=be.value)==null?void 0:qe.id)||"",employeeId:R,date:F,shiftId:Ne==="OFF"?"":Ne,scheduleType:ye.value,status:Ne==="OFF"?"OFF":"SCHEDULED",note:nt.value,revision:((Dn=be.value)==null?void 0:Dn.revision)||0})});if(!o.length||o.some(R=>R.status==="SCHEDULED"&&!ft.value.some(F=>F.id===R.shiftId))){k.value="Chọn ca hợp lệ và ít nhất một ngày áp dụng.";return}bt(o)}const yt=Z(()=>dt(m.value,Ue.value));function bt(h){Ue.value=h.map(o=>{const R=ze.value.find(Y=>Y.id===o.shiftId);if(!R)return o;const F=new Date(`${o.date}T12:00:00Z`);return R.crossDay&&F.setUTCDate(F.getUTCDate()+1),{...o,startTime:o.startTime||R.startTime,endTime:o.endTime||R.endTime,startDate:o.date,endDate:F.toISOString().slice(0,10),crossDay:R.crossDay}}),yn.value=!0}async function Qt(){if(!(G.value||yt.value.length||!Ue.value.length)){if(!t.can("schedules",Ue.value.length>1?"bulk":"create")){k.value="Bạn không có quyền tạo phân công này.";return}if(Ue.value.some(h=>Ae(h.date))){k.value="Không được phân công ngày trong quá khứ.";return}G.value=!0,k.value="";try{const h=d.all.value.find(F=>F.name===fe.value),o=ql(Ue.value,ze.value,(h==null?void 0:h.code)||"",b.value.filter(F=>F.maBoPhan===(h==null?void 0:h.code)||F.tenBoPhan===fe.value).map(F=>({code:F.maNhanVien,positionCode:F.maChucVu})));console.log("Saving assignments:",o);const R=await kl(o);if(R.thatBai>0){k.value=`Đã lưu ${R.thanhCong}/${R.tongSo}. ${R.thatBai} phân công thất bại. `+R.loi.map(Y=>`${Y.maNhanVien} · ${We(Y.ngayLamViec)}: ${we(Y)}`).join(`
`),l.error(k.value);const F=new Set(R.loi.map(Y=>`${Y.maNhanVien}:${We(Y.ngayLamViec)}`));Ue.value=Ue.value.filter(Y=>F.has(`${Y.employeeId}:${Y.date}`)),Ce.value=Ce.value.filter(Y=>F.has(`${Y.employeeId}:${Y.date}`)),await on();return}Ce.value=[],S.value=!1,yn.value=!1,l.success(`Đã lưu ${R.thanhCong} phân công ca.`),await on(),await i.push("/schedules"),await Fe()}catch(h){l.error(h),k.value=we(h)}finally{G.value=!1}}}function Zt(){Ln.value&&(_n.value=!1,i.push({path:"/schedules/assign",query:{edit:Ln.value.id}}))}const Tn=C(!1),On=C(!1),rn=C({id:"",name:"",scheduleType:"ROTATING",department:"",active:!0,kind:"WEEK",days:Array(7).fill("OFF"),note:""});function qt(h,o=!1,R=!1){rn.value=h?{...h,id:o?"":h.id,name:h.name+(o?" (bản sao)":""),days:[...h.days]}:{id:"",name:"",scheduleType:"ROTATING",department:"",active:!0,kind:"WEEK",days:Array(7).fill("OFF"),note:""},On.value=R,Tn.value=!0}async function _t(){await An(()=>En.template({...rn.value,days:[...rn.value.days]}))&&(Tn.value=!1)}async function el(h){await i.push("/schedules/assign"),_e.value=!0,ye.value=h.scheduleType,fe.value=h.department,Pe.value="template",setTimeout(()=>{fn.value=h.id},0)}const Cn=C(!1),Mn=C("ALL"),$n=C({assignmentId:"",targetAssignmentId:"",shiftId:"",reason:""}),kt=C("employee"),Un=C(),Rn=C(!1),Fn=C(""),nl=Z(()=>m.value.swaps.filter(h=>Mn.value==="ALL"||(Mn.value==="DONE"?h.status!=="PENDING":h.status==="PENDING"))),tl=Z(()=>m.value.assignments.filter(h=>h.status==="SCHEDULED"));function wt(h){const o=m.value.assignments.find(R=>R.id===h);return o?`${q(o.employeeId)} · ${$e(o.date)} · ${ne(o)}`:"Lịch không còn tồn tại"}const ll=C([]),Tt=C(!1);function Hn(h,o=!1){return(o?h.targetSnapshot:h.sourceSnapshot)||m.value.assignments.find(R=>R.id===(o?h.targetAssignmentId:h.assignmentId))}function al(h,o=!1){const R=Hn(h,o);return R?`${q(R.employeeId)} · ${$e(R.date)} · ${ne(R)}`:"Lịch không còn tồn tại"}re(rn,()=>{Tn.value&&!On.value&&(S.value=!0)},{deep:!0}),re($n,()=>{Cn.value&&(S.value=!0)},{deep:!0});function ol(h,o=!1){var Y,y;const R=Hn(h,o),F=o?(Y=Hn(h))==null?void 0:Y.shiftId:h.targetAssignmentId?(y=Hn(h,!0))==null?void 0:y.shiftId:h.shiftId;return R?`${q(R.employeeId)} · ${$e(R.date)} · ${V(F||"")}`:"Lịch không còn tồn tại"}async function il(){await An(()=>En.request({...$n.value}))&&(Cn.value=!1)}async function sl(h){const o=Un.value;o&&await An(()=>En.decide(o.id,h,Fn.value))&&(Rn.value=!1)}return(h,o)=>{var F,Y;const R=Jn("RouterLink");return a(),s("div",xu,[n("div",Au,[n("div",null,[o[50]||(o[50]=n("div",{class:"eyebrow"},"VẬN HÀNH KHÁCH SẠN / XẾP CA",-1)),n("h1",null,u(_.value),1),o[51]||(o[51]=n("p",null,"Quản lý lịch hành chính và ca xoay của đội ngũ khách sạn",-1))]),L.value==="calendar"&&W(t).can("schedules","create")?(a(),Te(R,{key:0,class:"primary",to:"/schedules/assign"},{default:ce(()=>[...o[52]||(o[52]=[O(" + Phân công ca ",-1)])]),_:1})):D("",!0)]),j(xr,{items:T,"active-key":L.value==="exchange"||L.value==="leave-calendar"?"assign":L.value},null,8,["active-key"]),L.value==="templates"||L.value==="swaps"?(a(),s("p",Lu," ⓘ Chế độ demo · Dữ liệu lưu trên trình duyệt. API xếp ca thật chưa được cung cấp. ")):D("",!0),k.value||c.error.value||d.error.value?(a(),s("p",Pu,[O(u(k.value||c.error.value||d.error.value)+" ",1),n("button",{onClick:o[0]||(o[0]=y=>{Fe(),c.load(),d.load()})}," Tải lại dữ liệu ")])):D("",!0),K.value||c.loading.value||d.loading.value?(a(),s("p",Bu," Đang tải dữ liệu xếp ca… ")):(a(),s(H,{key:3},[L.value==="reports"?(a(),s("section",Ou,[n("label",null,[o[54]||(o[54]=O("Bộ phận",-1)),ae(n("select",{"onUpdate:modelValue":o[1]||(o[1]=y=>ve.value=y)},[o[53]||(o[53]=n("option",{value:""},"Tất cả bộ phận",-1)),(a(!0),s(H,null,z(U.value,y=>(a(),s("option",{key:y},u(y),1))),128))],512),[[Ie,ve.value]])]),n("label",null,[o[56]||(o[56]=O("Nhân viên",-1)),ae(n("select",{"onUpdate:modelValue":o[2]||(o[2]=y=>B.value=y)},[o[55]||(o[55]=n("option",{value:""},"Tất cả nhân viên",-1)),(a(!0),s(H,null,z(c.all.value,y=>(a(),s("option",{key:y.code,value:y.code},u(q(y.code)),9,Mu))),128))],512),[[Ie,B.value]])]),n("label",null,[o[58]||(o[58]=O("Loại lịch",-1)),ae(n("select",{"onUpdate:modelValue":o[3]||(o[3]=y=>M.value=y)},[...o[57]||(o[57]=[n("option",{value:""},"Tất cả",-1),n("option",{value:"ADMINISTRATIVE"},"Hành chính",-1),n("option",{value:"ROTATING"},"Xoay ca",-1)])],512),[[Ie,M.value]])]),n("label",null,[o[60]||(o[60]=O("Ca",-1)),ae(n("select",{"onUpdate:modelValue":o[4]||(o[4]=y=>ee.value=y)},[o[59]||(o[59]=n("option",{value:""},"Tất cả ca",-1)),(a(!0),s(H,null,z(m.value.shifts,y=>(a(),s("option",{key:y.id,value:y.id},u(y.name),9,Uu))),128))],512),[[Ie,ee.value]])]),n("label",null,[o[61]||(o[61]=O("Tìm kiếm",-1)),ae(n("input",{"onUpdate:modelValue":o[5]||(o[5]=y=>pe.value=y),placeholder:"Mã NV hoặc họ tên"},null,512),[[Xe,pe.value]])])])):D("",!0),L.value==="calendar"?(a(),Te(Eu,{key:1,visible:J.value,"onUpdate:visible":o[12]||(o[12]=y=>J.value=y),modal:"",header:"Bộ lọc lịch phân công",style:{width:"min(680px, 94vw)"},class:"schedule-filter-dialog"},{footer:ce(()=>[n("button",{type:"button",class:"schedule-filter-clear",onClick:je},[...o[71]||(o[71]=[n("i",{class:"pi pi-filter-slash","aria-hidden":"true"},null,-1),O(" Xóa bộ lọc ",-1)])]),n("div",Gu,[n("button",{type:"button",onClick:o[11]||(o[11]=y=>J.value=!1)},"Hủy"),n("button",{type:"button",class:"schedule-filter-apply",onClick:ln}," Áp dụng ")])]),default:ce(()=>[n("div",Ru,[n("label",null,[o[63]||(o[63]=O("Nhân viên",-1)),ae(n("select",{"onUpdate:modelValue":o[6]||(o[6]=y=>ge.employee=y)},[o[62]||(o[62]=n("option",{value:""},"Tất cả nhân viên",-1)),(a(!0),s(H,null,z(c.all.value,y=>(a(),s("option",{key:y.code,value:y.code},u(q(y.code)),9,Fu))),128))],512),[[Ie,ge.employee]])]),n("label",null,[o[65]||(o[65]=O("Loại lịch",-1)),ae(n("select",{"onUpdate:modelValue":o[7]||(o[7]=y=>ge.type=y)},[...o[64]||(o[64]=[n("option",{value:""},"Tất cả loại lịch",-1),n("option",{value:"ADMINISTRATIVE"},"Hành chính",-1),n("option",{value:"ROTATING"},"Xoay ca",-1)])],512),[[Ie,ge.type]])]),n("label",null,[o[67]||(o[67]=O("Ca",-1)),ae(n("select",{"onUpdate:modelValue":o[8]||(o[8]=y=>ge.shiftFilter=y)},[o[66]||(o[66]=n("option",{value:""},"Tất cả ca",-1)),(a(!0),s(H,null,z(m.value.shifts,y=>(a(),s("option",{key:y.id,value:y.id},u(y.name),9,Hu))),128))],512),[[Ie,ge.shiftFilter]])]),n("label",null,[o[69]||(o[69]=O("Trạng thái",-1)),ae(n("select",{"onUpdate:modelValue":o[9]||(o[9]=y=>ge.status=y)},[...o[68]||(o[68]=[n("option",{value:""},"Tất cả trạng thái",-1),n("option",{value:"SCHEDULED"},"Đã xếp",-1),n("option",{value:"UNASSIGNED"},"Chưa xếp",-1),n("option",{value:"OFF"},"Nghỉ",-1),n("option",{value:"LEAVE"},"Nghỉ phép",-1)])],512),[[Ie,ge.status]])]),n("label",Ku,[o[70]||(o[70]=O("Tìm kiếm",-1)),ae(n("input",{"onUpdate:modelValue":o[10]||(o[10]=y=>ge.search=y),placeholder:"Mã NV hoặc họ tên",type:"search"},null,512),[[Xe,ge.search]])])])]),_:1},8,["visible"])):D("",!0),L.value==="calendar"?(a(),s("div",zu,[n("aside",ju,[o[73]||(o[73]=n("h2",{id:"department-filter-title"},"Bộ phận",-1)),f.value?(a(),s("p",Xu,"Đang tải cây bộ phận…")):D("",!0),w.value?(a(),s("p",Wu,[O(u(w.value)+" ",1),n("button",{type:"button",onClick:P},"Tải lại")])):D("",!0),n("button",{type:"button",class:te(["department-filter-all",{selected:!ve.value}]),"aria-pressed":!ve.value,onClick:o[13]||(o[13]=y=>ve.value="")}," Tất cả bộ phận ",10,Yu),n("nav",Ju,[(a(!0),s(H,null,z(v.value,y=>(a(),s("details",{key:y.type,open:""},[n("summary",null,[O(u(y.label)+" ",1),n("small",null,u(y.departments.length),1)]),(a(!0),s(H,null,z(y.departments,Ne=>(a(),s("button",{key:Ne.code,type:"button",class:te({selected:ve.value===Ne.name}),"aria-pressed":ve.value===Ne.name,onClick:qe=>ve.value=Ne.name},[n("span",null,u(Ne.name),1),n("small",null,u(Ne.code),1)],10,Qu))),128))]))),128)),p.value.length?(a(),s("details",Zu,[n("summary",null,[o[72]||(o[72]=O(" Chưa phân loại ",-1)),n("small",null,u(p.value.length),1)]),(a(!0),s(H,null,z(p.value,y=>(a(),s("button",{key:y.code,type:"button",class:te({selected:ve.value===y.name}),"aria-pressed":ve.value===y.name,onClick:Ne=>ve.value=y.name},[n("span",null,u(y.name),1),n("small",null,u(y.code),1)],10,_u))),128))])):D("",!0)])]),n("div",ed,[n("div",nd,[n("button",{type:"button",class:"schedule-filter-launcher","aria-label":`Mở bộ lọc lịch${Ye.value?`, ${Ye.value} mục đang áp dụng`:""}`,onClick:mn},[o[74]||(o[74]=n("i",{class:"pi pi-filter","aria-hidden":"true"},null,-1)),o[75]||(o[75]=n("span",null,"Bộ lọc",-1)),Ye.value?(a(),s("span",ld,u(Ye.value),1)):D("",!0)],8,td)]),j(Er,{view:ie.value,"onUpdate:view":o[14]||(o[14]=y=>ie.value=y),anchor:X.value,"onUpdate:anchor":o[15]||(o[15]=y=>X.value=y),employees:c.all.value.map(y=>({code:y.code,name:y.name,department:String(y.department||"")})),"visible-employees":Ke.value.map(y=>({code:y.code,name:y.name,department:String(y.department||"")})),"group-by-department":!ve.value,dates:he.value,today:W(E),shifts:m.value.shifts,"can-create":W(t).can("schedules","create"),"employee-assignments":x,cell:Q,matches:le,fmt:$e,name:q,"shift-name":V,symbol:A,label:ne,pending:Ee,onMove:De,onOpen:jt},null,8,["view","anchor","employees","visible-employees","group-by-department","dates","today","shifts","can-create"])])])):D("",!0),L.value==="exchange"||L.value==="leave-calendar"?(a(),Te(Lo,{key:3,mode:L.value==="exchange"?"exchange":"leave",employees:c.all.value,departments:d.all.value,"can-edit":W(t).can("schedules","edit")},null,8,["mode","employees","departments","can-edit"])):D("",!0),L.value==="assign"?(a(),Te(lr,{key:4,onReload:on,bulk:_e.value,"onUpdate:bulk":o[16]||(o[16]=y=>_e.value=y),selected:Me.value,"onUpdate:selected":o[17]||(o[17]=y=>Me.value=y),"form-department":fe.value,"onUpdate:formDepartment":o[18]||(o[18]=y=>fe.value=y),"form-search":et.value,"onUpdate:formSearch":o[19]||(o[19]=y=>et.value=y),"schedule-type":ye.value,"onUpdate:scheduleType":o[20]||(o[20]=y=>ye.value=y),method:Pe.value,"onUpdate:method":o[21]||(o[21]=y=>Pe.value=y),"day-plans":Ce.value,"onUpdate:dayPlans":o[22]||(o[22]=y=>Ce.value=y),"calendar-mode":sn.value,"onUpdate:calendarMode":o[23]||(o[23]=y=>sn.value=y),"calendar-anchor":kn.value,"onUpdate:calendarAnchor":o[24]||(o[24]=y=>kn.value=y),editing:be.value,busy:G.value,"can-create":W(t).can("schedules","create"),"can-edit":W(t).can("schedules",be.value?"edit":_e.value?"bulk":"create"),"can-update":W(t).can("schedules","edit"),"can-bulk":W(t).can("schedules","bulk"),"tree-loading":f.value,"tree-error":w.value,"department-groups":v.value,"unclassified-departments":p.value,"load-department-tree":P,"shifts-loading":bn.value,"shifts-error":Pn.value,"load-manual-shifts":tt,eligible:Wt.value,name:q,"manual-shifts":ze.value,data:m.value,"scheduled-dates":Yt.value,start:He.value,"administrative-shift-id":(F=m.value.shifts.find(y=>y.active&&y.code==="D"))==null?void 0:F.id,"make-preview":Jt,"create-assignment":be.value?void 0:Xt,onEdit:mt,onAdministrativeBusy:o[25]||(o[25]=y=>G.value=y),onAdministrativeCreated:on,onInput:o[26]||(o[26]=y=>S.value=!0),onChange:o[27]||(o[27]=y=>S.value=!0)},null,8,["bulk","selected","form-department","form-search","schedule-type","method","day-plans","calendar-mode","calendar-anchor","editing","busy","can-create","can-edit","can-update","can-bulk","tree-loading","tree-error","department-groups","unclassified-departments","shifts-loading","shifts-error","eligible","manual-shifts","data","scheduled-dates","start","administrative-shift-id","create-assignment"])):D("",!0),L.value==="templates"?(a(),Te(Su,{key:5,templates:m.value.templates,shifts:m.value.shifts,departments:U.value,busy:G.value,"can-create":W(t).can("schedules","create"),"can-edit":W(t).can("schedules","edit"),"can-bulk":W(t).can("schedules","bulk"),onCreate:o[28]||(o[28]=y=>qt()),onOpen:qt,onToggle:o[29]||(o[29]=y=>An(()=>W(En).template({...y,days:[...y.days],active:!y.active}))),onApply:el},null,8,["templates","shifts","departments","busy","can-create","can-edit","can-bulk"])):D("",!0),L.value==="swaps"?(a(),Te(fu,{key:6,tab:Mn.value,"onUpdate:tab":o[30]||(o[30]=y=>Mn.value=y),rows:nl.value,"can-approve":W(t).can("schedules","approve"),"can-create":W(t).can("schedules","create"),"assignment-label":wt,"shift-name":V,onCreate:o[31]||(o[31]=y=>{$n.value={assignmentId:"",targetAssignmentId:"",shiftId:"",reason:""},Cn.value=!0}),onDetail:o[32]||(o[32]=y=>{Un.value=y,Fn.value="",Rn.value=!0})},null,8,["tab","rows","can-approve","can-create"])):D("",!0),L.value==="reports"?(a(),Te(uu,{key:7})):D("",!0)],64)),j(Kt,{assignment:an.value,"department-code":((Y=d.all.value.find(y=>y.name===fe.value))==null?void 0:Y.code)||"","employee-name":an.value?q(an.value.employeeId):"",onClose:o[33]||(o[33]=y=>an.value=void 0),onSaved:zt},null,8,["assignment","department-code","employee-name"]),j(ti,{detail:Ln.value,"onUpdate:detail":o[34]||(o[34]=y=>Ln.value=y),"detail-open":_n.value,"onUpdate:detailOpen":o[35]||(o[35]=y=>_n.value=y),"history-open":pt.value,"onUpdate:historyOpen":o[36]||(o[36]=y=>pt.value=y),preview:Ue.value,"onUpdate:preview":o[37]||(o[37]=y=>Ue.value=y),"preview-open":yn.value,"onUpdate:previewOpen":o[38]||(o[38]=y=>yn.value=y),history:m.value.history,issues:yt.value,error:k.value,busy:G.value,today:W(E),"can-edit":W(t).can("schedules","edit"),name:q,"employee-name":$,fmt:$e,label:ne,symbol:A,pending:Ee,"save-assignments":Qt,"edit-assignment":Zt,onClosePreview:o[39]||(o[39]=y=>yn.value=!1)},null,8,["detail","detail-open","history-open","preview","preview-open","history","issues","error","busy","today","can-edit"]),j(Vi,{open:Tn.value,"onUpdate:open":o[40]||(o[40]=y=>Tn.value=y),read:On.value,"onUpdate:read":o[41]||(o[41]=y=>On.value=y),template:rn.value,"onUpdate:template":o[42]||(o[42]=y=>rn.value=y),departments:U.value,shifts:m.value.shifts,busy:G.value,error:k.value,onSave:_t},null,8,["open","read","template","departments","shifts","busy","error"]),j(wi,{open:Cn.value,"onUpdate:open":o[43]||(o[43]=y=>Cn.value=y),"detail-open":Rn.value,"onUpdate:detailOpen":o[44]||(o[44]=y=>Rn.value=y),swap:$n.value,"onUpdate:swap":o[45]||(o[45]=y=>$n.value=y),mode:kt.value,"onUpdate:mode":o[46]||(o[46]=y=>kt.value=y),detail:Un.value,"onUpdate:detail":o[47]||(o[47]=y=>Un.value=y),decision:Fn.value,"onUpdate:decision":o[48]||(o[48]=y=>Fn.value=y),scheduled:tl.value,assignments:m.value.assignments,shifts:m.value.shifts,busy:G.value,error:k.value,"can-approve":W(t).can("schedules","approve"),"assignment-label":wt,"shift-name":V,"swap-before":al,"swap-after":ol,onSend:il,onDecide:sl},null,8,["open","detail-open","swap","mode","detail","decision","scheduled","assignments","shifts","busy","error","can-approve"]),j(ii,{open:Tt.value,"onUpdate:open":o[49]||(o[49]=y=>Tt.value=y),assignments:ll.value,name:q,fmt:$e,label:ne},null,8,["open","assignments"])])}}});export{yd as default};
