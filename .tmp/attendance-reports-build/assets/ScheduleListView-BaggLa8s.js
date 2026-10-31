import{an as Ve,am as Ae,T as sl,at as rl,au as ul,o as a,c as i,b as e,Q as St,H as oe,aj as Et,ak as xt,d as Se,y as re,I as hn,F as H,h as j,f as W,s as ce,r as C,e as B,t as s,g as D,_ as ke,v as G,K as Ue,x as Te,L as we,G as dn,n as te,z as ae,av as Ct,w as Vt,N as At,i as Z,J as Lt,as as Pt,A as Xe,E as Ie,q as Jn,aw as de,ax as Pe,C as un,ap as it,al as dl,af as cl,R as hl,p as Ot,k as vl,j as ml}from"./index-BFd7YyoW.js";import{s as Fe,a as Gn,g as pl,b as gl}from"./schedule-shift.service-BXI_WThP.js";import{b as fl,s as Qe}from"./index-B4_IdRKf.js";import{s as We,i as xe,a as xn}from"./schedule-date-C26Sytjz.js";import{u as vn}from"./useToast-BIvLDxtQ.js";import{_ as tn}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{s as Ze}from"./index-C5lattmR.js";import{s as Bt}from"./index-C7YcxaAg.js";import{s as Mt}from"./index-gxqtc5Fv.js";import{e as yl}from"./employee.service-CpxENftw.js";import{p as Nn,r as bl}from"./record.service-BNFY4pZZ.js";import"./employee.documents-Be0Xb_P6.js";import"./employee.type-r6lgm8XD.js";import"./modules-CJV0O-xn.js";function jn(n){if(!n||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(n))return{date:"",time:""};const r=n.slice(0,10),u=Fe(n.slice(11,19)),t=new Date(`${r}T12:00:00Z`);return!u||!Number.isFinite(t.getTime())||t.toISOString().slice(0,10)!==r?{date:"",time:""}:{date:r,time:u}}function Xn(n){const r=Fe(n);if(!r)throw new Error("Invalid schedule clock time.");return`PT${Number(r.slice(0,2))}H${Number(r.slice(3))}M`}function ql(n,r,u,t=!1){const l=Fe(r),c=Fe(u);if(!/^\d{4}-\d{2}-\d{2}$/.test(n)||!l||!c||l===c)throw new Error("Ngày hoặc giờ của ca không hợp lệ.");const d=new Date(`${n}T12:00:00Z`);if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==n)throw new Error("Ngày của ca không hợp lệ.");return(t||c<l)&&d.setUTCDate(d.getUTCDate()+1),{thoiGianBatDau:`${n}T${l}:00+07:00`,thoiGianKetThuc:`${d.toISOString().slice(0,10)}T${c}:00+07:00`}}function kl(n,r,u,t){if(console.log("Mapping bulk assignments:",{rows:n,shifts:r,departmentCode:u,employees:t}),!u||!n.length)throw new Error("Chọn bộ phận và ít nhất một phân công.");return[...n].sort((l,c)=>l.date.localeCompare(c.date)||l.employeeId.localeCompare(c.employeeId)).map(l=>{const c=r.find(f=>f.id===l.shiftId);if(l.status!=="SCHEDULED"||!c)throw new Error("Chỉ có thể tạo phân công với mã ca hợp lệ.");const d=t.find(f=>f.code===l.employeeId);if(!d)throw new Error("Không tìm thấy nhân viên trong bộ phận đã chọn.");const v=Fe(l.startTime||c.startTime),p=Fe(l.endTime||c.endTime);if(!/^\d{4}-\d{2}-\d{2}$/.test(l.date)||!/^\d{2}:\d{2}$/.test(v)||!/^\d{2}:\d{2}$/.test(p))throw new Error("Ngày hoặc giờ của ca không hợp lệ.");return{...l.fullTime===!1?{toanCa:!1,maLoaiNghiPhep:l.leaveTypeId||null}:{},ngayLamViec:`${l.date}T00:00:00+07:00`,maNhanVien:l.employeeId,maCa:c.id,maBoPhan:u,maChucVu:d.positionCode||null,...ql(l.date,v,p,l.crossDay??c.crossDay),trangThai:"2",nguonPhanCong:"1",ghiChu:l.note||null}})}async function wl(n){const r=n.map(c=>"{"+Object.entries(c).map(([d,v])=>`${d}: ${JSON.stringify(v)}`).join(",")+"}",3).join(","),u=Ve`mutation CreatePhanCongHangLoat {
    createPhanCongHangLoat(input: { danhSachPhanCong: [${r}] }) {
      isResults message data { tongSo thanhCong thatBai loi { maNhanVien ngayLamViec message } }
    }
  }`,{data:t}=await Ae.mutate({mutation:u,errorPolicy:"none"}),l=t==null?void 0:t.createPhanCongHangLoat;if(!(l!=null&&l.data))throw new Error((l==null?void 0:l.message)||"Không thể lưu phân công ca.");if(!l.isResults&&!l.data.thatBai)throw new Error(l.message||"Không thể lưu phân công ca.");return{...l.data,loi:l.data.loi||[]}}var Tl=`
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
`,Cl={root:function(r){var u=r.instance;return["p-editor",{"p-invalid":u.$invalid}]},toolbar:"p-editor-toolbar",content:"p-editor-content"},$l=sl.extend({name:"editor",style:Tl,classes:Cl}),Dl={name:"BaseEditor",extends:fl,props:{placeholder:String,readonly:Boolean,formats:Array,editorStyle:null,modules:null},style:$l,provide:function(){return{$pcEditor:this,$parentInstance:this}}};function Vn(n){"@babel/helpers - typeof";return Vn=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(r){return typeof r}:function(r){return r&&typeof Symbol=="function"&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},Vn(n)}function $t(n,r){var u=Object.keys(n);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(n);r&&(t=t.filter(function(l){return Object.getOwnPropertyDescriptor(n,l).enumerable})),u.push.apply(u,t)}return u}function Nl(n){for(var r=1;r<arguments.length;r++){var u=arguments[r]!=null?arguments[r]:{};r%2?$t(Object(u),!0).forEach(function(t){Il(n,t,u[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(u)):$t(Object(u)).forEach(function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(u,t))})}return n}function Il(n,r,u){return(r=Sl(r))in n?Object.defineProperty(n,r,{value:u,enumerable:!0,configurable:!0,writable:!0}):n[r]=u,n}function Sl(n){var r=El(n,"string");return Vn(r)=="symbol"?r:r+""}function El(n,r){if(Vn(n)!="object"||!n)return n;var u=n[Symbol.toPrimitive];if(u!==void 0){var t=u.call(n,r);if(Vn(t)!="object")return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return(r==="string"?String:Number)(n)}var Dt=(function(){try{return window.Quill}catch{return null}})(),st={name:"Editor",extends:Dl,inheritAttrs:!1,emits:["text-change","selection-change","load"],quill:null,watch:{modelValue:function(r,u){r!==u&&this.quill&&!this.quill.hasFocus()&&this.renderValue(r)},d_value:function(r,u){r!==u&&this.quill&&!this.quill.hasFocus()&&this.renderValue(r)},readonly:function(){this.handleReadOnlyChange()}},mounted:function(){var r=this,u={modules:Nl({toolbar:this.$refs.toolbarElement},this.modules),readOnly:this.readonly,theme:"snow",formats:this.formats,placeholder:this.placeholder};Dt?(this.quill=new Dt(this.$refs.editorElement,u),this.initQuill(),this.handleLoad()):rl(()=>import("./quill-BKoT5U3A.js"),[]).then(function(t){t&&ul(r.$refs.editorElement)&&(t.default?r.quill=new t.default(r.$refs.editorElement,u):r.quill=new t(r.$refs.editorElement,u),r.initQuill())}).then(function(){r.handleLoad()})},beforeUnmount:function(){this.quill=null},methods:{renderValue:function(r){if(this.quill)if(r){var u=this.quill.clipboard.convert({html:r});this.quill.setContents(u)}else this.quill.setText("")},initQuill:function(){var r=this;this.renderValue(this.d_value),this.quill.on("text-change",function(u,t,l){if(l==="user"){var c=r.quill.getSemanticHTML(),d=r.quill.getText().trim();c==="<p><br></p>"&&(c=""),r.writeValue(c),r.$emit("text-change",{htmlValue:c,textValue:d,delta:u,source:l,instance:r.quill})}}),this.quill.on("selection-change",function(u,t,l){var c=r.quill.getSemanticHTML(),d=r.quill.getText().trim();r.$emit("selection-change",{htmlValue:c,textValue:d,range:u,oldRange:t,source:l,instance:r.quill})})},handleLoad:function(){this.quill&&this.quill.getModule("toolbar")&&this.$emit("load",{instance:this.quill})},handleReadOnlyChange:function(){this.quill&&this.quill.enable(!this.readonly)}}};function xl(n,r,u,t,l,c){return a(),i("div",oe({class:n.cx("root")},n.ptmi("root")),[e("div",oe({ref:"toolbarElement",class:n.cx("toolbar")},n.ptm("toolbar")),[St(n.$slots,"toolbar",{},function(){return[e("span",oe({class:"ql-formats"},n.ptm("formats")),[e("select",oe({class:"ql-header",defaultValue:"0"},n.ptm("header")),[e("option",oe({value:"1"},n.ptm("option")),"Heading",16),e("option",oe({value:"2"},n.ptm("option")),"Subheading",16),e("option",oe({value:"0"},n.ptm("option")),"Normal",16)],16),e("select",oe({class:"ql-font"},n.ptm("font")),[e("option",Et(xt(n.ptm("option"))),null,16),e("option",oe({value:"serif"},n.ptm("option")),null,16),e("option",oe({value:"monospace"},n.ptm("option")),null,16)],16)],16),e("span",oe({class:"ql-formats"},n.ptm("formats")),[e("button",oe({class:"ql-bold",type:"button"},n.ptm("bold")),null,16),e("button",oe({class:"ql-italic",type:"button"},n.ptm("italic")),null,16),e("button",oe({class:"ql-underline",type:"button"},n.ptm("underline")),null,16)],16),e("span",oe({class:"ql-formats"},n.ptm("formats")),[e("select",oe({class:"ql-color"},n.ptm("color")),null,16),e("select",oe({class:"ql-background"},n.ptm("background")),null,16)],16),e("span",oe({class:"ql-formats"},n.ptm("formats")),[e("button",oe({class:"ql-list",value:"ordered",type:"button"},n.ptm("list")),null,16),e("button",oe({class:"ql-list",value:"bullet",type:"button"},n.ptm("list")),null,16),e("select",oe({class:"ql-align"},n.ptm("select")),[e("option",oe({defaultValue:""},n.ptm("option")),null,16),e("option",oe({value:"center"},n.ptm("option")),null,16),e("option",oe({value:"right"},n.ptm("option")),null,16),e("option",oe({value:"justify"},n.ptm("option")),null,16)],16)],16),e("span",oe({class:"ql-formats"},n.ptm("formats")),[e("button",oe({class:"ql-link",type:"button"},n.ptm("link")),null,16),e("button",oe({class:"ql-image",type:"button"},n.ptm("image")),null,16),e("button",oe({class:"ql-code-block",type:"button"},n.ptm("codeBlock")),null,16)],16),e("span",oe({class:"ql-formats"},n.ptm("formats")),[e("button",oe({class:"ql-clean",type:"button"},n.ptm("clean")),null,16)],16)]})],16),e("div",oe({ref:"editorElement",class:n.cx("content"),style:n.editorStyle},n.ptm("content")),null,16)],16)}st.render=xl;const Vl=Ve`
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
`,Al=Ve`
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
`;async function Ll(n,r){const{data:u}=await Ae.query({query:Al,variables:{tuNgay:`${n}T00:00:00+07:00`,denNgay:`${r}T23:59:59.999+07:00`},fetchPolicy:"no-cache",errorPolicy:"none"}),t=u==null?void 0:u.nhanVienChuaXepCa;if(!(t!=null&&t.isResults)||!Array.isArray(t.data))throw new Error((t==null?void 0:t.message)||"Không thể tải danh sách nhân viên chưa xếp ca.");return t.data.filter(l=>!!l).map(l=>({...l,danhSachNgayXepCa:(l.danhSachNgayXepCa||[]).filter(c=>typeof c=="string").map(We).filter(c=>/^\d{4}-\d{2}-\d{2}$/.test(c))}))}async function zn(n,r,u=null){const{data:t}=await Ae.query({query:Vl,variables:{tuNgay:`${n}T00:00:00+07:00`,denNgay:`${r}T23:59:59.999+07:00`,maBoPhan:u},fetchPolicy:"no-cache",errorPolicy:"none"}),l=t==null?void 0:t.phanCongCa;if(!(l!=null&&l.isResults)||!Array.isArray(l.data))throw new Error((l==null?void 0:l.message)||"Không thể tải lịch phân công ca.");const c=l.data.filter(d=>!!d);return Ut(c)}function Ut(n){const r=new Map;return{assignments:n.map(t=>{var p;const{date:l,time:c}=jn(t.thoiGianBatDau),{date:d,time:v}=jn(t.thoiGianKetThuc);return r.set(t.maCa,{id:t.maCa,code:t.kyHieuCa||t.maCa,name:t.tenCa,scheduleType:"ROTATING",startTime:c,endTime:v,crossDay:l&&d?d>l:!!t.quaNgay,displayColor:"#2563eb",active:!0}),{id:String(t.id),employeeId:t.maNhanVien,employeeName:t.hoTen,departmentCode:t.maBoPhan,locked:t.isLocked===!0,date:We(t.ngayLamViec),shiftId:t.maCa,shiftSymbol:t.kyHieuCa||t.maCa,shiftName:t.tenCa,scheduleType:"ROTATING",status:"SCHEDULED",note:t.ghiChu||"",revision:1,fullTime:t.toanCa!==!1,leaveTypeId:((p=t.maLoaiNghiPhep)==null?void 0:p.trim())||null,startTime:c,endTime:v,crossDay:l&&d?d>l:!!t.quaNgay,apiStatus:t.trangThai,assignmentSource:t.nguonPhanCong,startDate:l||We(t.ngayLamViec),endDate:d||void 0}}),shifts:[...r.values()]}}async function Pl(n){const r=Object.entries(n).map(([c,d])=>c+": "+JSON.stringify(d)).join(","),u=Ve`mutation CreatePhanCongCa {
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
  }`,{data:t}=await Ae.mutate({mutation:u,errorPolicy:"none"}),l=t==null?void 0:t.createPhanCongCa;if(!(l!=null&&l.isResults))throw new Error((l==null?void 0:l.message)||"Không thể tạo phân công ca.");return l}const Ol=Ve`
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
`;async function Bl(n,r=null){const{data:u}=await Ae.query({query:Ol,variables:{selectedNgay:n,maBoPhan:r},fetchPolicy:"no-cache",errorPolicy:"none"}),t=u==null?void 0:u.loadDanhSachNgay;if(!(t!=null&&t.isResults)||!Array.isArray(t.data))throw new Error((t==null?void 0:t.message)||"Không thể tải danh sách đổi ca.");return Ut(t.data.filter(l=>!!l))}async function Ml(n,r,u=""){var v,p;const t=f=>!!f.id.trim()&&f.leaveTypeId==null&&f.status!=="OFF"&&![f.shiftId,f.shiftSymbol].some(w=>/^(DO(?:0+)?|OFF)$/i.test((w==null?void 0:w.trim())||""));if(!t(n)||!t(r)||n.id===r.id||n.employeeId===r.employeeId||n.date===r.date&&n.shiftId.trim()===r.shiftId.trim())throw new Error("Chọn hai ca làm việc hợp lệ của hai nhân viên khác nhau.");const l=f=>/^\d+$/.test(f.trim())?f.trim().replace(/^0+(?=\d)/,""):JSON.stringify(f.trim()),c=Ve`mutation DoiCa($lyDoDoiCa: String!) {
    doiCa(idCaYeuCauDoi: ${l(n.id)}, idCaDuocDoi: ${l(r.id)}, lyDoDoiCa: $lyDoDoiCa) {
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
  }`,{data:d}=await Ae.mutate({mutation:c,variables:{lyDoDoiCa:u||null},errorPolicy:"none"});if(!((v=d==null?void 0:d.doiCa)!=null&&v.isResults))throw new Error(((p=d==null?void 0:d.doiCa)==null?void 0:p.message)||"Không thể đổi ca. Vui lòng thử lại.");return d.doiCa}const Ul={key:0,class:"exchange-form"},Fl={class:"employee-summary","aria-label":"Ca làm việc hiện tại"},Rl={class:"employee-code"},Hl={class:"shift-details"},Kl={class:"shift-name"},zl={key:0,class:"error",role:"alert"},Gl={class:"date-actions"},jl={class:"date-field",for:"exchange-date"},Xl={class:"reason-field","aria-labelledby":"exchange-reason-label"},Wl={key:1,class:"error",role:"alert"},Yl={class:"candidate-list","aria-label":"Nhân viên có thể đổi ca"},Jl={class:"list-heading"},Ql={class:"hint"},Zl={key:0,class:"empty-state",role:"status"},_l={key:1,class:"empty-state"},ea={key:2,class:"candidate-scroll"},na={class:"candidate-table","aria-label":"Danh sách ca làm việc có thể đổi"},ta={class:"selection-column"},la=["id","value","aria-label","onChange"],aa=["for"],oa={class:"date-column"},ia={class:"time-column"},sa={class:"dialog-footer"},ra={key:0,class:"exchange-form"},ua={class:"confirmation-pair"},da={class:"employee-summary"},ca={class:"employee-code"},ha={class:"hint"},va={class:"employee-summary"},ma={class:"employee-code"},pa={class:"hint"},ga={class:"reason-field reason-preview","aria-label":"Lý do đổi ca"},fa={key:1,class:"hint"},ya={key:0,class:"error",role:"alert"},ba={class:"dialog-footer"},qa=Se({__name:"ScheduleExchangeDialog",props:{assignment:{},departmentCode:{},employeeName:{}},emits:["close","confirmed","busy"],setup(n,{emit:r}){const u=n,t=r,l=C(!1),c=vn();re(l,S=>t("busy",S),{flush:"sync"});const d=C(""),v=C([]),p=C(!1),f=C(""),w=C(),g=C("");let P=0;const m=S=>S.status==="OFF"||[S.shiftId,S.shiftSymbol].some(T=>/^(DO(?:0+)?|OFF)$/i.test((T==null?void 0:T.trim())||"")),b=S=>S.leaveTypeId===null&&!m(S);function K(){++P,v.value=[],w.value=void 0,f.value="",p.value=!1}re(()=>u.assignment,S=>{K(),d.value=(S==null?void 0:S.date)||"",g.value=""}),re(d,K),hn(()=>{++P});async function z(){const S=u.assignment;if(!S||!d.value||!b(S))return;const T=++P,L=d.value;v.value=[],w.value=void 0,f.value="",p.value=!0;try{const _=await Bl(L,u.departmentCode);T===P&&(v.value=_.assignments.filter(N=>N.employeeId!==S.employeeId&&b(N)&&!(L===S.date&&N.shiftId.trim()===S.shiftId.trim())).map(N=>({...N,date:L})))}catch(_){T===P&&(f.value=we(_))}finally{T===P&&(p.value=!1)}}async function k(){if(!(l.value||!u.assignment||!w.value||!b(u.assignment)||!b(w.value)||w.value.date===u.assignment.date&&w.value.shiftId.trim()===u.assignment.shiftId.trim())){l.value=!0,f.value="";try{const S=await Ml(u.assignment,w.value,g.value);c.success(S.message||"Đổi ca thành công."),w.value=void 0,t("close"),t("confirmed")}catch(S){c.error(S),f.value=we(S)}finally{l.value=!1}}}return(S,T)=>(a(),i(H,null,[j(W(Ue),{visible:!!n.assignment&&!w.value,modal:"",header:"Chọn nhân viên đổi ca",style:{width:"900px",maxWidth:"95vw"},"onUpdate:visible":T[3]||(T[3]=L=>!L&&t("close"))},{default:ce(()=>[n.assignment?(a(),i("div",Ul,[e("section",Fl,[T[8]||(T[8]=e("span",{class:"section-label"},"Ca làm việc hiện tại",-1)),e("strong",null,[B(s(n.employeeName)+" ",1),e("span",Rl,s(n.assignment.employeeId),1)]),e("div",Hl,[e("span",null,[T[6]||(T[6]=e("i",{class:"pi pi-calendar","aria-hidden":"true"},null,-1)),B(s(n.assignment.date),1)]),e("span",Kl,s(n.assignment.shiftName||n.assignment.shiftSymbol||n.assignment.shiftId),1),e("span",null,[T[7]||(T[7]=e("i",{class:"pi pi-clock","aria-hidden":"true"},null,-1)),B(s(n.assignment.startTime)+"–"+s(n.assignment.endTime)+s(n.assignment.crossDay?" (+1 ngày)":""),1)])])]),b(n.assignment)?D("",!0):(a(),i("p",zl," Chỉ ca làm việc không có mã nghỉ phép mới được đổi ca. Ca nghỉ DO không thể đổi ca. ")),e("div",Gl,[e("label",jl,[T[9]||(T[9]=B("Chọn ngày ",-1)),j(W(Qe),{id:"exchange-date",modelValue:d.value,"onUpdate:modelValue":T[0]||(T[0]=L=>d.value=L),type:"date"},null,8,["modelValue"])]),j(ke,{type:"button",label:"Tải lại danh sách",icon:"pi pi-refresh",outlined:"",loading:p.value,disabled:p.value||!d.value||!b(n.assignment),onClick:z},null,8,["loading","disabled"])]),e("section",Xl,[T[11]||(T[11]=e("label",{id:"exchange-reason-label"},"Lý do đổi ca",-1)),j(W(st),{modelValue:g.value,"onUpdate:modelValue":T[1]||(T[1]=L=>g.value=L),"editor-style":"height: 140px",placeholder:"Nhập lý do đổi ca…"},{toolbar:ce(()=>[...T[10]||(T[10]=[e("span",{class:"ql-formats"},[e("button",{class:"ql-bold",type:"button","aria-label":"In đậm",title:"In đậm"}),e("button",{class:"ql-italic",type:"button","aria-label":"In nghiêng",title:"In nghiêng"}),e("button",{class:"ql-underline",type:"button","aria-label":"Gạch chân",title:"Gạch chân"})],-1),e("span",{class:"ql-formats"},[e("button",{class:"ql-list",value:"ordered",type:"button","aria-label":"Danh sách đánh số",title:"Danh sách đánh số"}),e("button",{class:"ql-list",value:"bullet",type:"button","aria-label":"Danh sách dấu chấm",title:"Danh sách dấu chấm"}),e("button",{class:"ql-clean",type:"button","aria-label":"Xóa định dạng",title:"Xóa định dạng"})],-1)])]),_:1},8,["modelValue"])]),f.value?(a(),i("p",Wl,s(f.value),1)):D("",!0),e("section",Yl,[e("div",Jl,[T[12]||(T[12]=e("strong",null,"Nhân viên có thể đổi ca",-1)),e("span",Ql,s(v.value.length)+" nhân viên",1)]),p.value?(a(),i("div",Zl,[...T[13]||(T[13]=[e("i",{class:"pi pi-spin pi-spinner","aria-hidden":"true"},null,-1),B("Đang tải danh sách nhân viên… ",-1)])])):v.value.length?(a(),i("div",ea,[e("table",na,[T[15]||(T[15]=e("thead",null,[e("tr",null,[e("th",{scope:"col",class:"selection-column"},"Chọn"),e("th",{scope:"col"},"Mã nhân viên"),e("th",{scope:"col"},"Họ tên"),e("th",{scope:"col"},"Ngày làm việc"),e("th",{scope:"col"},"Ca làm việc"),e("th",{scope:"col"},"Giờ làm việc")])],-1)),e("tbody",null,[(a(!0),i(H,null,G(v.value,L=>(a(),i("tr",{key:L.id,class:"candidate"},[e("td",ta,[e("input",{id:"exchange-candidate-"+L.id,type:"radio",name:"exchange-employee",value:L.id,"aria-label":"Chọn "+(L.employeeName||L.employeeId)+" · "+L.date,onChange:_=>w.value=L},null,40,la)]),e("td",null,s(L.employeeId),1),e("td",null,[e("label",{for:"exchange-candidate-"+L.id},s(L.employeeName||L.employeeId),9,aa)]),e("td",oa,s(L.date.split("-").reverse().join("/")),1),e("td",null,s(L.shiftName||L.shiftSymbol||L.shiftId),1),e("td",ia,s(L.startTime||"—")+"–"+s(L.endTime||"—")+s(L.crossDay?" (+1 ngày)":""),1)]))),128))])])])):(a(),i("div",_l,[...T[14]||(T[14]=[e("i",{class:"pi pi-users","aria-hidden":"true"},null,-1),e("p",null,"Chưa có nhân viên phù hợp.",-1),e("span",{class:"hint"},"Chọn ngày rồi nhấn Tải lại danh sách.",-1)])]))]),T[16]||(T[16]=e("p",{class:"hint"},"Chọn nhân viên để xem thông tin xác nhận chuyển ca.",-1)),e("footer",sa,[j(ke,{type:"button",label:"Hủy",severity:"secondary",outlined:"",onClick:T[2]||(T[2]=L=>t("close"))})])])):D("",!0)]),_:1},8,["visible"]),j(W(Ue),{visible:!!w.value,modal:"",header:"Xác nhận chuyển ca",closable:!l.value,"close-on-escape":!l.value,style:{width:"560px",maxWidth:"95vw"},"onUpdate:visible":T[5]||(T[5]=L=>!l.value&&!L&&(w.value=void 0))},{default:ce(()=>[n.assignment&&w.value?(a(),i("div",ra,[T[22]||(T[22]=e("p",null,"Bạn có xác nhận chuyển ca giữa hai nhân viên sau không?",-1)),e("div",ua,[e("section",da,[T[17]||(T[17]=e("span",{class:"section-label"},"Ca hiện tại",-1)),e("strong",null,[B(s(n.employeeName)+" ",1),e("span",ca,s(n.assignment.employeeId),1)]),e("span",null,s(n.assignment.date)+" · "+s(n.assignment.shiftName||n.assignment.shiftId),1),e("span",ha,s(n.assignment.startTime)+"–"+s(n.assignment.endTime)+s(n.assignment.crossDay?" (+1 ngày)":""),1)]),T[19]||(T[19]=e("i",{class:"pi pi-arrow-right-arrow-left exchange-icon","aria-hidden":"true"},null,-1)),e("section",va,[T[18]||(T[18]=e("span",{class:"section-label"},"Ca được chọn",-1)),e("strong",null,[B(s(w.value.employeeName||w.value.employeeId)+" ",1),e("span",ma,s(w.value.employeeId),1)]),e("span",null,s(w.value.date)+" · "+s(w.value.shiftName||w.value.shiftId),1),e("span",pa,s(w.value.startTime)+"–"+s(w.value.endTime)+s(w.value.crossDay?" (+1 ngày)":""),1)])]),e("section",ga,[T[21]||(T[21]=e("strong",null,"Lý do đổi ca",-1)),g.value?(a(),Te(W(st),{key:0,"model-value":g.value,readonly:"","editor-style":"min-height: 80px"},{toolbar:ce(()=>[...T[20]||(T[20]=[e("span",{class:"hint"},"Nội dung lý do đã nhập",-1)])]),_:1},8,["model-value"])):(a(),i("p",fa,"Chưa nhập lý do đổi ca."))]),f.value?(a(),i("p",ya,s(f.value),1)):D("",!0),e("footer",ba,[j(ke,{type:"button",label:"Quay lại",severity:"secondary",outlined:"",disabled:l.value,onClick:T[4]||(T[4]=L=>w.value=void 0)},null,8,["disabled"]),j(ke,{type:"button",label:"OK",icon:"pi pi-check",loading:l.value,disabled:l.value,onClick:k},null,8,["loading","disabled"])])])):D("",!0)]),_:1},8,["visible","closable","close-on-escape"])],64))}}),Ft=tn(qa,[["__scopeId","data-v-6f0ce4b9"]]);async function ka(n){var l,c;const r=Object.entries(n).map(([d,v])=>d+": "+(d==="id"&&/^\d+$/.test(String(v))?String(v):JSON.stringify(v))).join(","),u=Ve`mutation UpdatePhanCongCa {
    updatePhanCongCa(input: { ${r} }) { isResults message }
  }`,{data:t}=await Ae.mutate({mutation:u,errorPolicy:"none"});if(!((l=t==null?void 0:t.updatePhanCongCa)!=null&&l.isResults))throw new Error(((c=t==null?void 0:t.updatePhanCongCa)==null?void 0:c.message)||"Không thể cập nhật phân công.");return t.updatePhanCongCa}function wa(n,r,u){if(!n.id||xe(n.date))throw new Error("Không thể sửa phân công ngày quá khứ.");const t=u.find(d=>d.id===r&&d.active&&d.workType!=="0"&&d.scheduleType===n.scheduleType);if(!t||r===n.shiftId)throw new Error("Vui lòng chọn ca làm việc khác ca hiện tại.");const l=Fe(t.startTime),c=Fe(t.endTime);if(!l||!c||l===c)throw new Error("Ca được chọn chưa có giờ làm việc hợp lệ. Vui lòng cấu hình giờ của ca.");return{id:n.id,maNhanVien:n.employeeId,ngayLamViec:`${n.date}T00:00:00+07:00`,maCa:r,toanCa:!0,gioBatDau:Xn(l),gioKetThuc:Xn(c),maLoaiNghiPhep:null,ghiChu:(n.note||"").trim()||null}}const ct=6e4,rt=1440*ct,Ta=420*ct;function cn(n){return new Date(n+Ta).toISOString().slice(0,19)+"+07:00"}function Wn(n,r){if(!/^\d{4}-\d{2}-\d{2}$/.test(n)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(r))throw new Error("Vui lòng nhập ngày và giờ hợp lệ.");const u=Date.parse(`${n}T${r}:00+07:00`);if(!Number.isFinite(u)||cn(u).slice(0,10)!==n)throw new Error("Ngày nghỉ phép không hợp lệ.");return u}function ht(n){const r=Wn(n.fromDate,n.fromTime),u=Wn(n.toDate,n.toTime);if(xe(n.fromDate))throw new Error("Không thể đăng ký nghỉ phép ngày quá khứ.");if(u<=r)throw new Error("Thời điểm kết thúc nghỉ phép phải sau thời điểm bắt đầu.");if(u-r>366*rt)throw new Error("Khoảng nghỉ phép không được vượt quá 366 ngày.");return{start:r,end:u}}function Rt(n,r,u){const{start:t,end:l}=ht(r);if(!n)throw new Error("Chưa xác định nhân viên nghỉ phép.");const c=[],d=new Set;for(const v of u){if(v.employeeId!==n||v.status!=="SCHEDULED")continue;if(!v.id||d.has(v.id))throw new Error("ID phân công bị thiếu hoặc trùng lặp.");d.add(v.id);const p=Wn(v.startDate||v.date,Fe(v.startTime));let f=Wn(v.endDate||v.startDate||v.date,Fe(v.endTime));if(!v.endDate&&(v.crossDay||f<=p)&&(f+=rt),f<=p||f-p>rt)throw new Error(`Thời gian ca ngày ${v.date} không hợp lệ; vui lòng tải lại phân công.`);const w=Math.max(t,p),g=Math.min(l,f);w>=g||c.push({assignmentId:v.id,date:v.date,shiftLabel:v.shiftSymbol||v.shiftName||v.shiftId,fullTime:w===p&&g===f,start:cn(w),end:cn(g),minutes:(g-w)/ct})}return c}function Nt(n,r,u,t,l=new Date){if(!t.some(p=>p.id===r.leaveTypeId&&p.workType==="0"&&p.active))throw new Error("Vui lòng chọn loại nghỉ phép hợp lệ.");if(!r.reason.trim())throw new Error("Vui lòng nhập lý do nghỉ phép.");const{start:c,end:d}=ht(r),v=Rt(n,r,u);return{maNhanVien:n,ngayDangKyLichNghi:cn(l.getTime()).slice(0,10)+"T00:00:00+07:00",tuNgay:cn(c),denNgay:cn(d),loaiNghiPhep:r.leaveTypeId,lyDoNghi:r.reason.trim(),tinhTrang:"1",danhSachPhanCong:v.map(p=>({id:p.assignmentId,ngayLamViec:`${p.date}T00:00:00+07:00`,toanCa:p.fullTime,batDauLamViec:p.start,ketThucLamViec:p.end}))}}const Ca=Ve`
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
`;async function $a(n){var v,p;const{maNhanVien:r,tuNgay:u,denNgay:t,lyDoNghi:l,loaiNghiPhep:c}=n,{data:d}=await Ae.mutate({mutation:Ca,variables:{input:{maNhanVien:r,tuNgay:u,denNgay:t,lyDoNghi:l,loaiNghiPhep:c}},errorPolicy:"none"});if(!((v=d==null?void 0:d.taoNhanVienNghiPhep)!=null&&v.isResults))throw new Error(((p=d==null?void 0:d.taoNhanVienNghiPhep)==null?void 0:p.message)||"Không thể đăng ký nghỉ phép.");return d.taoNhanVienNghiPhep}const Da=Ve`
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
`;async function Na(n,r){if(ht(r),!n)throw new Error("Chưa xác định nhân viên nghỉ phép.");const{data:u}=await Ae.query({query:Da,variables:{tuNgay:`${r.fromDate}T00:00:00+07:00`,denNgay:`${r.toDate}T23:59:59.999+07:00`,maNhanVien:n},fetchPolicy:"no-cache",errorPolicy:"none"}),t=u==null?void 0:u.phanCongCa;if(!(t!=null&&t.isResults)||!Array.isArray(t.data))throw new Error((t==null?void 0:t.message)||"Không thể tải phân công ca cho khoảng nghỉ phép.");return t.data.filter(l=>!!l&&l.maNhanVien===n).map(l=>{const c=We(l.ngayLamViec),{date:d,time:v}=jn(l.thoiGianBatDau),{date:p,time:f}=jn(l.thoiGianKetThuc);return{id:String(l.id),employeeId:l.maNhanVien,date:c,shiftId:l.maCa,shiftSymbol:l.kyHieuCa||l.maCa,scheduleType:"ROTATING",status:"SCHEDULED",note:"",revision:1,startDate:d||c,endDate:p||void 0,startTime:v,endTime:f,crossDay:p?p>(d||c):!!v&&!!f&&f<=v}})}const Ia={class:"employee-summary"},Sa=["disabled"],Ea={key:1,role:"status"},xa={key:0,class:"hint"},Va={class:"time-grid"},Aa={class:"load-schedule-actions"},La={key:0,class:"hint",role:"status"},Pa={key:1,class:"hint"},Oa={key:0,class:"leave-preview","aria-label":"Ca làm việc đã phân công"},Ba={class:"preview-scroll"},Ma={key:1,role:"status"},Ua={key:2,class:"error",role:"alert"},Fa={key:3,class:"error",role:"alert"},Ra={key:4,class:"error",role:"alert"},Ha=Se({__name:"ScheduleEditDialog",props:{assignment:{},departmentCode:{},employeeName:{},initialAction:{},leaveRange:{}},emits:["close","saved","busy"],setup(n,{emit:r}){const u=vn(),t=n,l=r,c=C("shift"),d=C(""),v=At({fromDate:"",fromTime:"",toDate:"",toTime:"",leaveTypeId:"",reason:""}),p=C([]),f=C([]),w=C(""),g=Z(()=>{var O,M;return JSON.stringify([(O=t.assignment)==null?void 0:O.employeeId,(M=t.assignment)==null?void 0:M.id,c.value,v.fromDate,v.fromTime,v.toDate,v.toTime])}),P=Z(()=>!!w.value&&w.value===g.value),m=C(!1),b=C(!1),K=C(!1),z=C(""),k=C("");let S=0,T=0;re(K,O=>l("busy",O),{flush:"sync"});const L=xn(),_=Z(()=>p.value.filter(O=>{var M,ee;return O.active&&O.workType!=="0"&&O.scheduleType===((M=t.assignment)==null?void 0:M.scheduleType)&&O.id!==((ee=t.assignment)==null?void 0:ee.shiftId)}).map(O=>({...O,label:`${O.code} · ${O.name}${O.startTime&&O.endTime?` (${O.startTime}–${O.endTime})`:""}`}))),N=Z(()=>p.value.filter(O=>O.active&&O.workType==="0").map(O=>({...O,label:`${O.id} · ${O.name}`}))),E=Z(()=>{if(c.value!=="leave"||!P.value||b.value||k.value||!t.assignment)return{periods:[],error:""};try{return{periods:Rt(t.assignment.employeeId,v,f.value),error:""}}catch(O){return{periods:[],error:we(O)}}}),X=Z(()=>new Map(E.value.periods.map(O=>[O.assignmentId,O])));function ie(O,M){const ee=new Date(`${O}T12:00:00Z`);return ee.setUTCDate(ee.getUTCDate()+M),ee.toISOString().slice(0,10)}function ue(O){return`${O.slice(8,10)}/${O.slice(5,7)}/${O.slice(0,4)} ${O.slice(11,16)}`}async function me(){const O=++S;if(p.value=[],z.value="",!t.assignment){m.value=!1;return}m.value=!0;try{if(!t.departmentCode)throw new Error("Chưa xác định bộ phận của phân công.");const[M,ee]=await Promise.all([Gn(t.departmentCode,t.assignment.scheduleType),Gn(null,t.assignment.scheduleType)]);O===S&&(p.value=[...new Map([...M,...ee.filter(se=>se.workType==="0")].map(se=>[se.id,se])).values()])}catch(M){O===S&&(z.value=we(M))}finally{O===S&&(m.value=!1)}}async function he(){return Na(t.assignment.employeeId,{...v})}function De(){++T,f.value=[],w.value="",b.value=!1,k.value="",z.value=""}async function $e(){if(K.value||b.value)return;const O=++T,M=g.value;if(w.value="",f.value=[],k.value="",!t.assignment||c.value!=="leave"){b.value=!1;return}b.value=!0;try{const ee=await he();O===T&&M===g.value&&(f.value=ee,w.value=M)}catch(ee){O===T&&(k.value=we(ee))}finally{O===T&&(b.value=!1)}}re(()=>t.assignment,O=>{c.value=t.initialAction||"shift",d.value="",De(),Object.assign(v,{fromDate:(O==null?void 0:O.startDate)||(O==null?void 0:O.date)||"",fromTime:(O==null?void 0:O.startTime)||"",toDate:(O==null?void 0:O.endDate)||(O!=null&&O.date?ie(O.date,O.crossDay||O.endTime&&O.startTime&&O.endTime<=O.startTime?1:0):""),toTime:(O==null?void 0:O.endTime)||"",leaveTypeId:"",reason:""}),t.leaveRange&&Object.assign(v,t.leaveRange,{fromTime:"",toTime:""}),me()},{immediate:!0}),re(g,De,{flush:"sync"});async function ve(){if(!(!t.assignment||K.value||m.value||b.value)){z.value="",K.value=!0;try{if(c.value==="shift")await ka(wa(t.assignment,d.value,p.value));else{if(!P.value)throw new Error("Vui lòng tải phân công ca trước khi xác nhận nghỉ phép.");const O=Nt(t.assignment.employeeId,v,f.value,N.value),M=await he(),ee=Nt(t.assignment.employeeId,v,M,N.value);if(f.value=M,JSON.stringify(O.danhSachPhanCong)!==JSON.stringify(ee.danhSachPhanCong))throw new Error("Lịch phân công vừa thay đổi. Vui lòng kiểm tra lại danh sách nghỉ và xác nhận lần nữa.");const se=await $a(ee);u.success(se.message||"Đăng ký nghỉ phép thành công.")}l("saved")}catch(O){u.error(O),z.value=we(O)}finally{K.value=!1}}}return hn(()=>{++S,++T}),(O,M)=>(a(),Te(W(Ue),{class:"schedule-dialog",visible:!!n.assignment,modal:"",header:n.initialAction==="leave"?"Đăng ký nghỉ phép":"Điều chỉnh phân công ca",closable:!K.value,"close-on-escape":!K.value,style:dn({width:c.value==="leave"?"720px":"520px",maxWidth:"95vw"}),"onUpdate:visible":M[10]||(M[10]=ee=>!K.value&&l("close"))},{default:ce(()=>{var ee,se,pe;return[e("form",{class:"edit-form",onSubmit:Vt(ve,["prevent"])},[e("p",Ia,[e("strong",null,s(n.employeeName),1),n.initialAction?D("",!0):(a(),i(H,{key:0},[M[11]||(M[11]=e("br",null,null,-1)),B(s((ee=n.assignment)==null?void 0:ee.date)+" · Ca hiện tại: "+s(((se=n.assignment)==null?void 0:se.shiftSymbol)||((pe=n.assignment)==null?void 0:pe.shiftId)),1)],64))]),n.initialAction?D("",!0):(a(),i("fieldset",{key:0,class:"action-options",disabled:K.value||m.value},[M[14]||(M[14]=e("legend",null,"Thao tác",-1)),e("label",{class:te({selected:c.value==="shift"})},[ae(e("input",{"onUpdate:modelValue":M[0]||(M[0]=J=>c.value=J),type:"radio",value:"shift",name:"schedule-edit-action"},null,512),[[Ct,c.value]]),M[12]||(M[12]=B("Đổi ca",-1))],2),e("label",{class:te({selected:c.value==="leave"})},[ae(e("input",{"onUpdate:modelValue":M[1]||(M[1]=J=>c.value=J),type:"radio",value:"leave",name:"schedule-edit-action"},null,512),[[Ct,c.value]]),M[13]||(M[13]=B("Nghỉ phép",-1))],2)],8,Sa)),m.value?(a(),i("p",Ea,"Đang tải danh mục ca...")):D("",!0),c.value==="shift"?(a(),i(H,{key:2},[e("label",null,[M[15]||(M[15]=B("Ca làm việc mới *",-1)),j(W(Ze),{modelValue:d.value,"onUpdate:modelValue":M[2]||(M[2]=J=>d.value=J),options:_.value,"option-label":"label","option-value":"id",placeholder:"Chọn ca làm việc",disabled:m.value||K.value},null,8,["modelValue","options","disabled"])]),!m.value&&!z.value&&!_.value.length?(a(),i("p",xa," Chưa có ca làm việc khác trong bộ phận để đổi. ")):D("",!0)],64)):(a(),i(H,{key:3},[e("div",Va,[e("label",null,[M[16]||(M[16]=B("Từ ngày *",-1)),j(W(Qe),{modelValue:v.fromDate,"onUpdate:modelValue":M[3]||(M[3]=J=>v.fromDate=J),type:"date",min:W(L),required:"",disabled:K.value||m.value},null,8,["modelValue","min","disabled"])]),e("label",null,[M[17]||(M[17]=B("Giờ bắt đầu nghỉ *",-1)),j(W(Qe),{modelValue:v.fromTime,"onUpdate:modelValue":M[4]||(M[4]=J=>v.fromTime=J),type:"time",required:"",disabled:K.value||m.value},null,8,["modelValue","disabled"])]),e("label",null,[M[18]||(M[18]=B("Đến ngày *",-1)),j(W(Qe),{modelValue:v.toDate,"onUpdate:modelValue":M[5]||(M[5]=J=>v.toDate=J),type:"date",min:v.fromDate||W(L),required:"",disabled:K.value||m.value},null,8,["modelValue","min","disabled"])]),e("label",null,[M[19]||(M[19]=B("Giờ kết thúc nghỉ *",-1)),j(W(Qe),{modelValue:v.toTime,"onUpdate:modelValue":M[6]||(M[6]=J=>v.toTime=J),type:"time",required:"",disabled:K.value||m.value},null,8,["modelValue","disabled"])])]),e("label",null,[M[20]||(M[20]=B("Lý do *",-1)),j(W(Bt),{modelValue:v.reason,"onUpdate:modelValue":M[7]||(M[7]=J=>v.reason=J),rows:"3",required:"",placeholder:"Nhập lý do nghỉ phép",disabled:K.value||m.value},null,8,["modelValue","disabled"])]),e("label",null,[M[21]||(M[21]=B("Loại nghỉ phép *",-1)),j(W(Ze),{modelValue:v.leaveTypeId,"onUpdate:modelValue":M[8]||(M[8]=J=>v.leaveTypeId=J),options:N.value,"option-label":"label","option-value":"id",placeholder:"Chọn loại nghỉ phép",disabled:K.value||m.value},null,8,["modelValue","options","disabled"])]),M[25]||(M[25]=e("p",{class:"hint"}," Nhập giờ bắt đầu và kết thúc nghỉ phép, sau đó tải phân công để kiểm tra các ca trong khoảng đã chọn. ",-1)),e("div",Aa,[j(ke,{type:"button",label:P.value?"Tải lại phân công ca":"Tải phân công ca",icon:"pi pi-refresh",outlined:"",loading:b.value,disabled:K.value||m.value||!v.fromDate||!v.toDate||!v.fromTime||!v.toTime,onClick:$e},null,8,["label","loading","disabled"]),P.value?(a(),i("span",La,"Đã tải "+s(f.value.length)+" phân công ca từ hệ thống.",1)):!b.value&&!k.value?(a(),i("span",Pa,"Tải phân công ca để kiểm tra danh sách trước khi xác nhận.")):D("",!0)]),P.value&&f.value.length?(a(),i("section",Oa,[M[23]||(M[23]=e("div",{class:"preview-heading"},[e("strong",null,"Ca làm việc đã phân công")],-1)),e("div",Ba,[e("table",null,[M[22]||(M[22]=e("thead",null,[e("tr",null,[e("th",null,"ID"),e("th",null,"Ngày làm việc"),e("th",null,"Ca"),e("th",null,"Bắt đầu ca"),e("th",null,"Kết thúc ca"),e("th",null,"Bắt đầu nghỉ"),e("th",null,"Kết thúc nghỉ"),e("th",null,"Cập nhật")])],-1)),e("tbody",null,[(a(!0),i(H,null,G(f.value,J=>(a(),i("tr",{key:J.id},[e("td",null,s(J.id),1),e("td",null,s(J.date),1),e("td",null,s(J.shiftSymbol),1),e("td",null,s(J.startDate||J.date)+" "+s(J.startTime),1),e("td",null,s(J.endDate||ie(J.startDate||J.date,J.crossDay?1:0))+" "+s(J.endTime),1),e("td",null,s(X.value.has(J.id)?ue(X.value.get(J.id).start):"—"),1),e("td",null,s(X.value.has(J.id)?ue(X.value.get(J.id).end):"—"),1),e("td",null,s(X.value.has(J.id)?X.value.get(J.id).fullTime?"Toàn ca":"Một phần ca":"Không cập nhật"),1)]))),128))])])])])):D("",!0),b.value?(a(),i("p",Ma,[...M[24]||(M[24]=[e("i",{class:"pi pi-spin pi-spinner","aria-hidden":"true"},null,-1),B(" Đang tải lịch trong khoảng nghỉ... ",-1)])])):k.value?(a(),i("p",Ua,[B(s(k.value)+" ",1),j(ke,{type:"button",label:"Tải lại lịch",text:"",disabled:K.value,onClick:$e},null,8,["disabled"])])):E.value.error?(a(),i("p",Fa,s(E.value.error),1)):D("",!0)],64)),z.value?(a(),i("p",Ra,[B(s(z.value),1),p.value.length?D("",!0):(a(),Te(ke,{key:0,type:"button",label:"Tải lại danh mục",text:"",disabled:K.value||m.value,onClick:me},null,8,["disabled"]))])):D("",!0),e("footer",null,[j(ke,{type:"button",label:"Hủy",severity:"secondary",outlined:"",disabled:K.value,onClick:M[9]||(M[9]=J=>l("close"))},null,8,["disabled"]),j(ke,{type:"submit",label:"Xác nhận",loading:K.value,disabled:m.value||!p.value.length||(c.value==="shift"?!d.value:!P.value||b.value||!!k.value||!!E.value.error||!v.leaveTypeId||!v.reason.trim())},null,8,["loading","disabled"])])],32)]}),_:1},8,["visible","header","closable","close-on-escape","style"]))}}),Ht=tn(Ha,[["__scopeId","data-v-96f9caa6"]]),Ka=Ve`
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
`;async function za(n,r,u=null,t=null){const{data:l}=await Ae.query({query:Ka,variables:{tuNgay:n+"T00:00:00+07:00",denNgay:r+"T23:59:59.999+07:00",maBoPhan:u,maNhanVien:t},fetchPolicy:"no-cache",errorPolicy:"none"}),c=l==null?void 0:l.leaveHistory;if(!(c!=null&&c.isResults)||!Array.isArray(c.data))throw new Error((c==null?void 0:c.message)||"Không thể tải lịch sử nghỉ phép.");return c.data.filter(d=>!!d)}function Ga(n,r=null){const u=(r||n).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").toLowerCase();let t;if(/khong luong|unpaid|sans solde/.test(u))t=215;else if(/thai san|maternity|paternity|maternite/.test(u))t=275;else if(/om|benh|sick|maladie/.test(u))t=35;else if(/phep nam|hang nam|annual|annuel/.test(u))t=150;else if(/viec rieng|gia dinh|personal|family|familial/.test(u))t=205;else{let l=0;for(const c of n)l=l*31+c.charCodeAt(0)>>>0;t=l%360}return{background:"hsl("+t+", 75%, 94%)",border:"hsl("+t+", 55%, 65%)",text:"hsl("+t+", 65%, 25%)"}}function ot(n){return Date.parse(/(?:Z|[+-]\d{2}:?\d{2})$/i.test(n)?n:n+(n.includes("T")?"":"T00:00:00")+"+07:00")}function ja(n,r){const u=new Map;for(const t of n){const l=ot(t.tuNgay),c=ot(t.denNgay);if(!(!Number.isFinite(l)||!Number.isFinite(c)||c<=l))for(const d of r){const v=ot(d);if(l<v+864e5&&c>v){const p=t.maNhanVien+":"+d,f=u.get(p)||[];f.push(t),u.set(p,f)}}}return u}const Xa=Ve`
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
`;async function Wa(){const{data:n}=await Ae.query({query:Xa,fetchPolicy:"no-cache",errorPolicy:"none"}),r=n==null?void 0:n.danhSachNgayLe;if(!(r!=null&&r.isResults)||!Array.isArray(r.data))throw new Error((r==null?void 0:r.message)||"Không thể tải danh sách ngày lễ.");return r.data.filter(u=>!!u&&u.trangThai===!0)}function Qn(n,r){const u=new Date(`${n}T12:00:00`);r==="week"&&u.setDate(u.getDate()-(u.getDay()+6)%7),r==="month"&&u.setDate(1);const t=new Date(u);r==="week"&&t.setDate(t.getDate()+6),r==="month"&&t.setMonth(t.getMonth()+1,0);const l=c=>`${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,"0")}-${String(c.getDate()).padStart(2,"0")}`;return{from:l(u),to:l(t)}}const Ya={class:"calendar-header"},Ja={class:"calendar-heading"},Qa={class:"calendar-heading-icon","aria-hidden":"true"},Za={class:"calendar-subtitle"},_a={class:"calendar-controls"},eo={class:"control-field"},no={class:"date-navigation"},to=["disabled"],lo=["disabled"],ao=["disabled"],oo={class:"control-field"},io=["disabled"],so={class:"control-field department-control"},ro=["disabled"],uo=["value"],co={class:"control-field search-control"},ho={class:"search-input-wrap"},vo=["disabled"],mo=["disabled"],po={class:"calendar-hint"},go={key:0,class:"leave-legend","aria-label":"Chú giải loại nghỉ phép"},fo={key:1,role:"status"},yo={key:2},bo={key:3,role:"status"},qo={key:4,role:"alert",class:"error"},ko={ref:"scrollArea",class:"calendar-scroll"},wo={key:0,class:"holiday-name"},To={class:"number"},Co={class:"person"},$o=["data-employee-id","data-date","aria-disabled","title","onPointerdown","onPointerenter"],Do=["data-assignment-id","disabled","onClick"],No={key:0,class:"holiday-name"},Io=["title","aria-label"],So={key:0},Eo=Se({__name:"ScheduleActionCalendar",props:{mode:{},employees:{},departments:{},canEdit:{type:Boolean}},setup(n){const r=n,u=C(xn()),t=C("month"),l=C(""),c=C(""),d=C([]),v=C(!1),p=C([]),f=C([]),w=C(!1),g=C(!1),P=C(""),m=Z(()=>Qn(u.value||xn(),t.value)),b=Z(()=>{const U=[],I=new Date(m.value.from+"T12:00:00Z");for(;I.toISOString().slice(0,10)<=m.value.to;)U.push(I.toISOString().slice(0,10)),I.setUTCDate(I.getUTCDate()+1);return U}),K=Z(()=>d.value.filter(U=>U.trangThai).map(U=>({...U,from:We(U.tuNgay),to:We(U.denNgay)}))),z=U=>K.value.filter(I=>I.from<=U&&I.to>=U),k=U=>z(U).map(I=>I.tenNgayLe).join(" · ");function S(U,I){const[q,$]=[U,I].sort();return K.value.some(x=>x.from<=$&&x.to>=q)}const T=Z(()=>{const U=new Map(r.employees.map(I=>[I.code,I]));if(r.mode==="leave")for(const I of p.value){const q=U.get(I.maNhanVien);U.set(I.maNhanVien,{...q,code:I.maNhanVien,name:I.hoTen||(q==null?void 0:q.name)||I.maNhanVien,department:I.tenBoPhan||(q==null?void 0:q.department)||""})}return[...U.values()]}),L=Z(()=>T.value.filter(U=>(!l.value||U.department===l.value)&&(U.code+" "+U.name).toLocaleLowerCase().includes(c.value.toLocaleLowerCase()))),_=Z(()=>ja(p.value,b.value)),N=(U,I)=>_.value.get(U+":"+I)||[],E=Z(()=>[...new Map(p.value.map(U=>[U.loaiNghiPhep,{code:U.loaiNghiPhep,name:U.tenLoaiNghi||U.loaiNghiPhep,...Ga(U.loaiNghiPhep,U.tenLoaiNghi)}])).values()].sort((U,I)=>U.name.localeCompare(I.name,"vi"))),X=U=>{const I=E.value.find(q=>q.code===U.loaiNghiPhep);return{backgroundColor:I.background,borderColor:I.border,color:I.text}};function ie(U,I){const q=N(U,I);return r.mode!=="leave"||!q.length?{}:q.length===1?{backgroundColor:X(q[0]).backgroundColor}:{background:"linear-gradient(135deg, "+q.map((x,V)=>X(x).backgroundColor+" "+V*100/q.length+"% "+(V+1)*100/q.length+"%").join(", ")+")"}}function ue(U){return[U.tenLoaiNghi||U.loaiNghiPhep,U.hoTen||U.maNhanVien,U.tuNgay+" → "+U.denNgay,U.soNgayNghi+" ngày",U.lyDoNghi,"Trạng thái: "+U.tinhTrang].filter(Boolean).join(`
`)}Lt(()=>!g.value),Pt(()=>!g.value);let me=0;async function he(){var I;const U=++me;w.value=!0,P.value="",f.value=[],p.value=[],d.value=[],v.value=!1;try{if(r.mode==="leave"){const q=((I=r.departments.find(V=>V.name===l.value))==null?void 0:I.code)||null,[$,x]=await Promise.all([za(m.value.from,m.value.to,q),Wa()]);U===me&&(p.value=$,d.value=x,v.value=!0)}else{const q=await zn(m.value.from,m.value.to);U===me&&(f.value=q.assignments)}}catch(q){U===me&&(P.value=we(q))}finally{U===me&&(w.value=!1)}}re([m,()=>r.mode,l],he,{immediate:!0});function De(U){const I=new Date(u.value+"T12:00:00Z");t.value==="month"?(I.setUTCDate(1),I.setUTCMonth(I.getUTCMonth()+U)):I.setUTCDate(I.getUTCDate()+U*7),u.value=I.toISOString().slice(0,10)}const $e=(U,I)=>f.value.filter(q=>q.employeeId===U&&q.date===I),ve=U=>{var I;return((I=T.value.find(q=>q.code===U))==null?void 0:I.name)||U},O=C(),M=C(),ee=C(),se=C(),pe=U=>new Date(U+"T12:00:00Z").getUTCDay()===0;function J(U,I){const[q,$]=[U,I].sort(),x=new Date(q+"T12:00:00Z"),V=(Date.parse($+"T12:00:00Z")-x.getTime())/864e5;return(7-x.getUTCDay())%7<=V}function ge(U,I,q){U.button!==0||r.mode!=="leave"||!r.canEdit||g.value||w.value||xe(q)||pe(q)||!v.value||z(q).length>0||(U.preventDefault(),M.value={employeeId:I,fromDate:q,toDate:q})}function Ye(U,I){var q;((q=M.value)==null?void 0:q.employeeId)===U&&!xe(I)&&v.value&&!S(M.value.fromDate,I)&&!J(M.value.fromDate,I)&&(M.value.toDate=I)}function mn(U,I){const q=M.value;return(q==null?void 0:q.employeeId)===U&&!pe(I)&&!z(I).length&&I>=[q.fromDate,q.toDate].sort()[0]&&I<=[q.fromDate,q.toDate].sort()[1]}function ln(){const U=M.value;if(!U)return;if(!v.value||S(U.fromDate,U.toDate)||J(U.fromDate,U.toDate)){M.value=void 0;return}const[I,q]=[U.fromDate,U.toDate].sort();se.value={fromDate:I,toDate:q},ee.value={id:"",employeeId:U.employeeId,date:I,shiftId:"",scheduleType:"ROTATING",status:"SCHEDULED",note:"",revision:1},M.value=void 0}function je(){M.value=void 0}return window.addEventListener("pointerup",ln),window.addEventListener("pointercancel",je),window.addEventListener("blur",je),hn(()=>{++me,window.removeEventListener("pointerup",ln),window.removeEventListener("pointercancel",je),window.removeEventListener("blur",je)}),re([m,()=>r.mode,l,c],()=>{je(),O.value=void 0,ee.value=void 0}),(U,I)=>{var $,x,V;const q=Jn("RouterLink");return a(),i("section",{class:te(["action-calendar",{"month-view":t.value==="month"}])},[e("header",Ya,[e("div",Ja,[e("span",Qa,[e("i",{class:te(n.mode==="exchange"?"pi pi-arrow-right-arrow-left":"pi pi-calendar-minus")},null,2)]),e("div",null,[e("h2",null,s(n.mode==="exchange"?"Đổi ca":"Lịch nghỉ phép"),1),e("span",Za,s(L.value.length)+" nhân viên · "+s(t.value==="month"?"Lịch tháng":"Lịch tuần"),1)])]),j(q,{class:"calendar-back",to:"/schedules/assign"},{default:ce(()=>[...I[11]||(I[11]=[e("i",{class:"pi pi-arrow-left","aria-hidden":"true"},null,-1),B("Quay về lịch phân công",-1)])]),_:1})]),e("div",_a,[e("div",eo,[I[14]||(I[14]=e("span",{class:"control-label"},"Thời gian",-1)),e("div",no,[e("button",{type:"button",class:"calendar-nav-button",disabled:g.value,"aria-label":"Xem kỳ trước",onClick:I[0]||(I[0]=A=>De(-1))},[...I[12]||(I[12]=[e("i",{class:"pi pi-chevron-left","aria-hidden":"true"},null,-1)])],8,to),ae(e("input",{"onUpdate:modelValue":I[1]||(I[1]=A=>u.value=A),class:"control-input calendar-date",type:"date","aria-label":"Ngày xem lịch",disabled:g.value},null,8,lo),[[Xe,u.value]]),e("button",{type:"button",class:"calendar-nav-button",disabled:g.value,"aria-label":"Xem kỳ sau",onClick:I[2]||(I[2]=A=>De(1))},[...I[13]||(I[13]=[e("i",{class:"pi pi-chevron-right","aria-hidden":"true"},null,-1)])],8,ao)])]),e("label",oo,[I[16]||(I[16]=e("span",{class:"control-label"},"Chế độ xem",-1)),ae(e("select",{"onUpdate:modelValue":I[3]||(I[3]=A=>t.value=A),class:"control-input",disabled:g.value},[...I[15]||(I[15]=[e("option",{value:"month"},"Lịch tháng",-1),e("option",{value:"week"},"Lịch tuần",-1)])],8,io),[[Ie,t.value]])]),e("label",so,[I[18]||(I[18]=e("span",{class:"control-label"},"Bộ phận",-1)),ae(e("select",{"onUpdate:modelValue":I[4]||(I[4]=A=>l.value=A),class:"control-input",disabled:g.value},[I[17]||(I[17]=e("option",{value:""},"Tất cả bộ phận",-1)),(a(!0),i(H,null,G(n.departments,A=>(a(),i("option",{key:A.code,value:A.name},s(A.name),9,uo))),128))],8,ro),[[Ie,l.value]])]),e("label",co,[I[20]||(I[20]=e("span",{class:"control-label"},"Nhân viên",-1)),e("span",ho,[I[19]||(I[19]=e("i",{class:"pi pi-search","aria-hidden":"true"},null,-1)),ae(e("input",{"onUpdate:modelValue":I[5]||(I[5]=A=>c.value=A),class:"control-input",placeholder:"Tìm mã hoặc họ tên",disabled:g.value},null,8,vo),[[Xe,c.value]])])]),e("button",{type:"button",class:"calendar-reload",disabled:w.value||g.value,onClick:he},[e("i",{class:te(w.value?"pi pi-spin pi-spinner":"pi pi-refresh"),"aria-hidden":"true"},null,2),I[21]||(I[21]=B("Tải lại ",-1))],8,mo)]),e("p",po,s(n.mode==="exchange"?"Bấm vào ca làm việc để chọn nhân viên đổi ca.":"Kéo chọn các ngày trên cùng hàng nhân viên, sau đó nhập giờ và loại nghỉ phép."),1),n.mode==="leave"&&E.value.length?(a(),i("div",go,[(a(!0),i(H,null,G(E.value,A=>(a(),i("span",{key:A.code,style:dn({backgroundColor:A.background,color:A.text,borderColor:A.border})},s(A.name)+" ("+s(A.code)+")",5))),128))])):D("",!0),n.mode==="leave"&&!w.value&&!P.value&&!p.value.length?(a(),i("p",fo," Không có lịch nghỉ phép trong khoảng thời gian đã chọn. ")):D("",!0),n.canEdit?D("",!0):(a(),i("p",yo,"Bạn không có quyền điều chỉnh lịch.")),w.value?(a(),i("p",bo,"Đang tải lịch…")):D("",!0),P.value?(a(),i("p",qo,s(P.value),1)):D("",!0),e("div",ko,[e("table",null,[e("thead",null,[e("tr",null,[I[22]||(I[22]=e("th",{class:"number"},"STT",-1)),I[23]||(I[23]=e("th",{class:"person"},"Họ và tên / Bộ phận / Chức vụ",-1)),(a(!0),i(H,null,G(b.value,A=>(a(),i("th",{key:A,class:te(["date-column",{"holiday-heading":n.mode==="leave"&&z(A).length}])},[B(s(A.slice(8))+"/"+s(A.slice(5,7)),1),e("small",null,s(new Date(A+"T12:00:00").toLocaleDateString("vi-VN",{weekday:"short"})),1),n.mode==="leave"&&z(A).length?(a(),i("small",wo,s(k(A)),1)):D("",!0)],2))),128))])]),e("tbody",null,[(a(!0),i(H,null,G(L.value,(A,Q)=>(a(),i("tr",{key:A.code},[e("td",To,s(Q+1),1),e("th",Co,[B(s(A.name),1),e("small",null,s(A.code),1),e("small",null,s(A.department)+" / "+s(A.position||"—"),1)]),(a(!0),i(H,null,G(b.value,ne=>(a(),i("td",{key:ne,class:te(["date-column",{selected:mn(A.code,ne),"sunday-locked":n.mode==="leave"&&pe(ne),"holiday-locked":n.mode==="leave"&&z(ne).length>0,past:W(xe)(ne),"has-leave":n.mode==="leave"&&N(A.code,ne).length>0}]),"data-employee-id":A.code,"data-date":ne,style:dn(ie(A.code,ne)),"aria-disabled":n.mode==="leave"&&(!v.value||pe(ne)||z(ne).length>0)?!0:void 0,title:n.mode==="leave"&&z(ne).length?"Ngày nghỉ lễ: "+k(ne):n.mode==="leave"&&pe(ne)?"Không thể chọn nghỉ phép vào Chủ nhật.":void 0,onPointerdown:le=>ge(le,A.code,ne),onPointerenter:le=>Ye(A.code,ne)},[n.mode==="exchange"?(a(!0),i(H,{key:0},G($e(A.code,ne),le=>(a(),i("button",{key:le.id,class:"sticker",type:"button","data-assignment-id":le.id,disabled:!n.canEdit||g.value||w.value,title:"Bấm để chọn nhân viên đổi ca",onClick:Ke=>O.value=le},[e("strong",null,s(le.shiftSymbol||le.shiftId),1),e("small",null,s(le.startTime)+"–"+s(le.endTime)+s(le.crossDay?" (+1)":""),1)],8,Do))),128)):(a(),i(H,{key:1},[z(ne).length?(a(),i("span",No,s(k(ne)),1)):D("",!0),(a(!0),i(H,null,G(N(A.code,ne),le=>(a(),i("span",{key:le.id,class:"leave-badge",style:dn(X(le)),title:ue(le),"aria-label":ue(le),tabindex:"0"},s(le.tenLoaiNghi||le.loaiNghiPhep),13,Io))),128))],64))],46,$o))),128))]))),128))])]),L.value.length?D("",!0):(a(),i("p",So,"Không tìm thấy nhân viên."))],512),j(Ft,{onBusy:I[6]||(I[6]=A=>g.value=A),assignment:O.value,"department-code":(($=n.departments.find(A=>A.name===l.value))==null?void 0:$.code)||((x=O.value)==null?void 0:x.departmentCode)||null,"employee-name":O.value?ve(O.value.employeeId):"",onClose:I[7]||(I[7]=A=>O.value=void 0),onConfirmed:he},null,8,["assignment","department-code","employee-name"]),j(Ht,{assignment:ee.value,"initial-action":"leave","leave-range":se.value,"department-code":((V=n.departments.find(A=>{var Q;return A.name===((Q=T.value.find(ne=>{var le;return ne.code===((le=ee.value)==null?void 0:le.employeeId)}))==null?void 0:Q.department)}))==null?void 0:V.code)||"","employee-name":ee.value?ve(ee.value.employeeId):"",onBusy:I[8]||(I[8]=A=>g.value=A),onClose:I[9]||(I[9]=A=>ee.value=void 0),onSaved:I[10]||(I[10]=A=>{ee.value=void 0,he()})},null,8,["assignment","leave-range","department-code","employee-name"])],2)}}}),xo=tn(Eo,[["__scopeId","data-v-764d868a"]]),Vo={key:0},Ao={class:"actions"},Lo={key:1},Po={key:0},Oo={class:"schedule-dialog"},Bo={key:0,class:"error"},Mo={class:"preview-calendar-toolbar"},Uo=["aria-label"],Fo={key:0},Ro=["aria-label"],Ho={class:"preview-calendar-mode"},Ko={class:"preview-calendar-table"},zo={class:"preview-calendar-employee"},Go={key:0},jo={key:0},Xo={key:0},Wo=["colspan"],Yo={key:1,class:"error",role:"alert",style:{"white-space":"pre-line"}},Jo={class:"actions"},Qo=["disabled"],Zo=["disabled"],_o=Se({__name:"ScheduleAssignmentDialogs",props:Pe({history:{},issues:{},error:{},busy:{type:Boolean},today:{},canEdit:{type:Boolean},name:{type:Function},employeeName:{type:Function},fmt:{type:Function},label:{type:Function},symbol:{type:Function},pending:{type:Function},saveAssignments:{type:Function},editAssignment:{type:Function}},{detail:{},detailModifiers:{},detailOpen:{type:Boolean,required:!0},detailOpenModifiers:{},historyOpen:{type:Boolean,required:!0},historyOpenModifiers:{},preview:{required:!0},previewModifiers:{},previewOpen:{type:Boolean,required:!0},previewOpenModifiers:{}}),emits:Pe(["closePreview"],["update:detail","update:detailOpen","update:historyOpen","update:preview","update:previewOpen"]),setup(n,{emit:r}){const u=de(n,"detail"),t=de(n,"detailOpen"),l=de(n,"historyOpen"),c=de(n,"preview"),d=de(n,"previewOpen"),v=n,p=r,f=C("week"),w=C(v.today),g=["T2","T3","T4","T5","T6","T7","CN"];re(d,k=>{if(!k)return;const S=c.value.map(_=>_.date).sort(),T=S[0]||v.today,L=S[S.length-1]||T;w.value=T,f.value=P(T,L)>6?"month":"week"});function P(k,S){return Math.round((new Date(`${S}T12:00:00`).getTime()-new Date(`${k}T12:00:00`).getTime())/864e5)}const m=Z(()=>{const k=new Date(w.value+"T12:00:00");f.value==="week"?k.setDate(k.getDate()-(k.getDay()+6)%7):k.setDate(1);const S=f.value==="week"?7:new Date(k.getFullYear(),k.getMonth()+1,0).getDate();return Array.from({length:S},(T,L)=>{const _=new Date(k);return _.setDate(_.getDate()+L),`${_.getFullYear()}-${String(_.getMonth()+1).padStart(2,"0")}-${String(_.getDate()).padStart(2,"0")}`})}),b=Z(()=>[...new Set(c.value.map(S=>S.employeeId))].map(S=>({code:S,name:v.employeeName(S)})).sort((S,T)=>S.name.localeCompare(T.name,"vi")));function K(k,S){return c.value.filter(T=>T.employeeId===k&&T.date===S)}function z(k){const S=new Date(w.value+"T12:00:00");f.value==="month"?(S.setDate(1),S.setMonth(S.getMonth()+k)):S.setDate(S.getDate()+k*7),w.value=`${S.getFullYear()}-${String(S.getMonth()+1).padStart(2,"0")}-${String(S.getDate()).padStart(2,"0")}`}return(k,S)=>(a(),i(H,null,[j(W(Mt),{visible:t.value,"onUpdate:visible":S[2]||(S[2]=T=>t.value=T),header:"Chi tiết phân công",position:"right",class:"schedule-drawer"},{default:ce(()=>[u.value?(a(),i(H,{key:0},[e("h3",null,s(n.name(u.value.employeeId)),1),e("p",null,s(n.fmt(u.value.date))+" · "+s(u.value.scheduleType==="ADMINISTRATIVE"?"Hành chính":"Xoay ca"),1),e("p",null,s(n.label(u.value)),1),e("p",null,s(u.value.note||"Chưa có ghi chú"),1),n.pending(u.value)?(a(),i("p",Vo,"↔ Có yêu cầu đổi ca chờ duyệt")):D("",!0),e("div",Ao,[e("button",{onClick:S[0]||(S[0]=T=>l.value=!l.value)},"Lịch sử"),n.canEdit?(a(),i("button",{key:0,onClick:S[1]||(S[1]=(...T)=>n.editAssignment&&n.editAssignment(...T))},"Sửa phân công")):D("",!0)]),l.value?(a(),i("ul",Lo,[(a(!0),i(H,null,G(n.history.filter(T=>{var L;return T.assignmentId===((L=u.value)==null?void 0:L.id)}),(T,L)=>(a(),i("li",{key:L},s(T.action)+" · "+s(new Date(T.date).toLocaleString("vi-VN")),1))),128)),n.history.some(T=>{var L;return T.assignmentId===((L=u.value)==null?void 0:L.id)})?D("",!0):(a(),i("li",Po," Chưa có lịch sử thay đổi. "))])):D("",!0)],64)):D("",!0)]),_:1},8,["visible"]),j(W(Ue),{visible:d.value,"onUpdate:visible":S[9]||(S[9]=T=>d.value=T),modal:"",header:"Xem trước phân công",style:{width:"1000px",maxWidth:"95vw"}},{default:ce(()=>[e("div",Oo,[e("p",null,s(c.value.length)+" phân công · "+s(b.value.length)+" nhân viên",1),n.issues.length?(a(),i("div",Bo,[e("strong",null,"⚠ "+s(n.issues.length)+" xung đột — không thể lưu",1),(a(!0),i(H,null,G(n.issues,(T,L)=>(a(),i("p",{key:L},[B(s(n.name(T.row.employeeId))+" · "+s(n.fmt(T.row.date)),1),S[10]||(S[10]=e("br",null,null,-1)),B(" Ca mới: "+s(n.label(T.row)),1),S[11]||(S[11]=e("br",null,null,-1)),B(" Đã có: "+s(n.label(T.existing))+" · "+s(n.fmt(T.existing.date)),1),S[12]||(S[12]=e("br",null,null,-1)),B(" "+s(T.reason),1)]))),128))])):D("",!0),e("div",Mo,[e("button",{type:"button","aria-label":f.value==="week"?"Tuần trước":"Tháng trước",onClick:S[3]||(S[3]=T=>z(-1))}," ‹ ",8,Uo),m.value.length?(a(),i("strong",Fo,s(n.fmt(m.value[0]))+" – "+s(n.fmt(m.value[m.value.length-1])),1)):D("",!0),e("button",{type:"button","aria-label":f.value==="week"?"Tuần sau":"Tháng sau",onClick:S[4]||(S[4]=T=>z(1))}," › ",8,Ro),e("div",Ho,[e("button",{class:te({active:f.value==="week"}),onClick:S[5]||(S[5]=T=>f.value="week")}," Tuần ",2),e("button",{class:te({active:f.value==="month"}),onClick:S[6]||(S[6]=T=>f.value="month")}," Tháng ",2)])]),e("div",{class:te(["preview-calendar-scroll","mode-"+f.value])},[e("table",Ko,[e("thead",null,[e("tr",null,[S[13]||(S[13]=e("th",{class:"preview-calendar-employee"},"Nhân viên",-1)),(a(!0),i(H,null,G(m.value,T=>(a(),i("th",{key:T,class:te({weekend:[0,6].includes(new Date(T+"T12:00:00").getDay()),today:T===n.today})},[B(s(g[(new Date(T+"T12:00:00").getDay()+6)%7])+" ",1),e("small",null,s(Number(T.slice(-2)))+"/"+s(Number(T.slice(5,7))),1)],2))),128))])]),e("tbody",null,[(a(!0),i(H,null,G(b.value,T=>(a(),i("tr",{key:T.code},[e("th",zo,[e("strong",null,s(T.name),1),e("small",null,s(T.code),1)]),(a(!0),i(H,null,G(m.value,L=>(a(),i("td",{key:L,class:te({weekend:[0,6].includes(new Date(L+"T12:00:00").getDay())})},[(a(!0),i(H,null,G(K(T.code,L),_=>(a(),i(H,{key:_.id+_.shiftId},[e("strong",null,s(_.status==="OFF"?"Nghỉ":n.symbol(_)),1),_.startTime&&_.endTime?(a(),i("small",Go,s(W(Fe)(_.startTime))+"–"+s(W(Fe)(_.endTime))+s(_.crossDay?" (+1 ngày)":""),1)):D("",!0)],64))),128)),K(T.code,L).length?D("",!0):(a(),i("span",jo,"—"))],2))),128))]))),128)),b.value.length?D("",!0):(a(),i("tr",Xo,[e("td",{colspan:m.value.length+1,class:"empty-state"}," Không có phân công trong khoảng này. ",8,Wo)]))])])],2),n.error?(a(),i("p",Yo,s(n.error),1)):D("",!0),e("div",Jo,[e("button",{disabled:n.busy,onClick:S[7]||(S[7]=T=>p("closePreview"))},"Quay lại",8,Qo),e("button",{class:"primary",disabled:n.busy||!!n.issues.length||!c.value.length,onClick:S[8]||(S[8]=(...T)=>n.saveAssignments&&n.saveAssignments(...T))},s(n.busy?"Đang lưu…":"Lưu phân công"),9,Zo)])])]),_:1},8,["visible"])],64))}}),ei={class:"table-scroll schedule-dialog"},ni={class:"report"},ti={key:0},li=Se({__name:"ScheduleDrillDialog",props:Pe({assignments:{},name:{type:Function},fmt:{type:Function},label:{type:Function}},{open:{type:Boolean,required:!0},openModifiers:{}}),emits:["update:open"],setup(n){const r=de(n,"open");return(u,t)=>(a(),Te(W(Ue),{visible:r.value,"onUpdate:visible":t[0]||(t[0]=l=>r.value=l),modal:"",header:"Lịch chi tiết",style:{width:"800px",maxWidth:"95vw"}},{default:ce(()=>[e("div",ei,[e("table",ni,[t[2]||(t[2]=e("thead",null,[e("tr",null,[e("th",null,"Nhân viên"),e("th",null,"Ngày"),e("th",null,"Phân công")])],-1)),e("tbody",null,[(a(!0),i(H,null,G(n.assignments,l=>(a(),i("tr",{key:l.id},[e("td",null,s(n.name(l.employeeId)),1),e("td",null,s(n.fmt(l.date)),1),e("td",null,s(n.label(l)),1)]))),128)),n.assignments.length?D("",!0):(a(),i("tr",ti,[...t[1]||(t[1]=[e("td",{colspan:"3"},"Chưa có lịch phù hợp.",-1)])]))])])])]),_:1},8,["visible"]))}}),ai={class:"schedule-dialog"},oi=["value"],ii={key:0},si=["value"],ri={key:1},ui=["value"],di={key:2,class:"error"},ci=["disabled"],hi={key:0},vi={key:1},mi={key:2},pi={key:0,class:"error"},gi={class:"actions"},fi=["disabled"],yi=["disabled"],bi=Se({__name:"ScheduleSwapDialogs",props:Pe({scheduled:{},assignments:{},shifts:{},busy:{type:Boolean},error:{},canApprove:{type:Boolean},assignmentLabel:{type:Function},shiftName:{type:Function},swapBefore:{type:Function},swapAfter:{type:Function}},{open:{type:Boolean,required:!0},openModifiers:{},detailOpen:{type:Boolean,required:!0},detailOpenModifiers:{},swap:{required:!0},swapModifiers:{},mode:{required:!0},modeModifiers:{},detail:{},detailModifiers:{},decision:{required:!0},decisionModifiers:{}}),emits:Pe(["send","decide"],["update:open","update:detailOpen","update:swap","update:mode","update:detail","update:decision"]),setup(n,{emit:r}){const u=de(n,"open"),t=de(n,"detailOpen"),l=de(n,"swap"),c=de(n,"mode"),d=de(n,"detail"),v=de(n,"decision"),p=n,f=r,w={PENDING:"Chờ duyệt",APPROVED:"Đã duyệt",REJECTED:"Từ chối",CANCELLED:"Đã hủy"},g=Z(()=>p.assignments.find(P=>P.id===l.value.assignmentId));return(P,m)=>(a(),i(H,null,[j(W(Ue),{visible:u.value,"onUpdate:visible":m[7]||(m[7]=b=>u.value=b),modal:"",header:"Tạo yêu cầu đổi ca",style:{width:"650px",maxWidth:"95vw"}},{default:ce(()=>[e("div",ai,[e("label",null,[m[13]||(m[13]=B(" Ca muốn đổi * ",-1)),ae(e("select",{"onUpdate:modelValue":m[0]||(m[0]=b=>l.value.assignmentId=b)},[m[12]||(m[12]=e("option",{value:""},"Chọn ca đã phân công",-1)),(a(!0),i(H,null,G(n.scheduled,b=>(a(),i("option",{key:b.id,value:b.id},s(n.assignmentLabel(b.id)),9,oi))),128))],512),[[Ie,l.value.assignmentId]])]),e("label",null,[m[15]||(m[15]=B(" Hình thức ",-1)),ae(e("select",{"onUpdate:modelValue":m[1]||(m[1]=b=>c.value=b),onChange:m[2]||(m[2]=b=>{l.value.targetAssignmentId="",l.value.shiftId=""})},[...m[14]||(m[14]=[e("option",{value:"employee"},"Đổi với nhân viên khác",-1),e("option",{value:"shift"},"Xin đổi sang ca khác",-1)])],544),[[Ie,c.value]])]),c.value==="employee"?(a(),i("label",ii,[m[17]||(m[17]=B(" Ca của nhân viên đổi cùng ",-1)),ae(e("select",{"onUpdate:modelValue":m[3]||(m[3]=b=>l.value.targetAssignmentId=b)},[m[16]||(m[16]=e("option",{value:""},"Chọn nhân viên / ca",-1)),(a(!0),i(H,null,G(n.scheduled.filter(b=>{var K;return b.employeeId!==((K=g.value)==null?void 0:K.employeeId)}),b=>(a(),i("option",{key:b.id,value:b.id},s(n.assignmentLabel(b.id)),9,si))),128))],512),[[Ie,l.value.targetAssignmentId]])])):(a(),i("label",ri,[m[19]||(m[19]=B(" Ca muốn đổi sang ",-1)),ae(e("select",{"onUpdate:modelValue":m[4]||(m[4]=b=>l.value.shiftId=b)},[m[18]||(m[18]=e("option",{value:""},"Chọn ca",-1)),(a(!0),i(H,null,G(n.shifts.filter(b=>b.active),b=>(a(),i("option",{key:b.id,value:b.id},s(n.shiftName(b.id)),9,ui))),128))],512),[[Ie,l.value.shiftId]])])),e("label",null,[m[20]||(m[20]=B("Lý do *",-1)),ae(e("textarea",{"onUpdate:modelValue":m[5]||(m[5]=b=>l.value.reason=b)},null,512),[[Xe,l.value.reason]])]),n.error?(a(),i("p",di,s(n.error),1)):D("",!0),e("button",{class:"primary",disabled:n.busy,onClick:m[6]||(m[6]=b=>f("send"))},s(n.busy?"Đang gửi…":"Gửi yêu cầu"),9,ci)])]),_:1},8,["visible"]),j(W(Mt),{visible:t.value,"onUpdate:visible":m[11]||(m[11]=b=>t.value=b),header:"Chi tiết yêu cầu đổi ca",position:"right",class:"schedule-drawer"},{default:ce(()=>[d.value?(a(),i(H,{key:0},[e("h3",null,s(d.value.code)+" · "+s(w[d.value.status]),1),m[22]||(m[22]=e("h4",null,"Trước khi đổi",-1)),e("p",null,s(n.swapBefore(d.value)),1),d.value.targetAssignmentId?(a(),i("p",hi,s(n.swapBefore(d.value,!0)),1)):D("",!0),m[23]||(m[23]=e("h4",null,"Sau khi đổi (dự kiến)",-1)),e("p",null,s(n.swapAfter(d.value)),1),d.value.targetAssignmentId?(a(),i("p",vi,s(n.swapAfter(d.value,!0)),1)):D("",!0),e("p",null,"Lý do: "+s(d.value.reason),1),d.value.decision?(a(),i("p",mi,"Phản hồi: "+s(d.value.decision),1)):D("",!0),d.value.status==="PENDING"&&n.canApprove?(a(),i(H,{key:3},[e("label",null,[m[21]||(m[21]=B("Phản hồi / lý do từ chối",-1)),ae(e("textarea",{"onUpdate:modelValue":m[8]||(m[8]=b=>v.value=b)},null,512),[[Xe,v.value]])]),n.error?(a(),i("p",pi,s(n.error),1)):D("",!0),e("div",gi,[e("button",{disabled:n.busy,onClick:m[9]||(m[9]=b=>f("decide",!1))},"Từ chối",8,fi),e("button",{class:"primary",disabled:n.busy,onClick:m[10]||(m[10]=b=>f("decide",!0))}," Duyệt đổi ca ",8,yi)])],64)):D("",!0)],64)):D("",!0)]),_:1},8,["visible"])],64))}}),qi={class:"schedule-dialog"},ki=["disabled"],wi={class:"form-grid"},Ti={class:"pattern"},Ci=["onUpdate:modelValue"],$i=["value"],Di={key:0,class:"error"},Ni=["disabled"],Ii=Se({__name:"ScheduleTemplateDialog",props:Pe({departments:{},shifts:{},busy:{type:Boolean},error:{}},{open:{type:Boolean,required:!0},openModifiers:{},read:{type:Boolean,required:!0},readModifiers:{},template:{required:!0},templateModifiers:{}}),emits:Pe(["save"],["update:open","update:read","update:template"]),setup(n,{emit:r}){const u=de(n,"open"),t=de(n,"read"),l=de(n,"template"),c=r,d=["T2","T3","T4","T5","T6","T7","CN"];return(v,p)=>(a(),Te(W(Ue),{visible:u.value,"onUpdate:visible":p[10]||(p[10]=f=>u.value=f),modal:"",header:t.value?"Chi tiết mẫu lịch":"Cấu hình mẫu lịch",style:{width:"800px",maxWidth:"95vw"}},{default:ce(()=>[e("div",qi,[e("fieldset",{disabled:t.value||n.busy},[e("div",wi,[e("label",null,[p[11]||(p[11]=B("Tên mẫu *",-1)),ae(e("input",{"onUpdate:modelValue":p[0]||(p[0]=f=>l.value.name=f)},null,512),[[Xe,l.value.name]])]),e("label",null,[p[13]||(p[13]=B(" Loại lịch ",-1)),ae(e("select",{"onUpdate:modelValue":p[1]||(p[1]=f=>l.value.scheduleType=f),onChange:p[2]||(p[2]=f=>l.value.days=Array(l.value.days.length).fill("OFF"))},[...p[12]||(p[12]=[e("option",{value:"ADMINISTRATIVE"},"Hành chính",-1),e("option",{value:"ROTATING"},"Xoay ca",-1)])],544),[[Ie,l.value.scheduleType]])]),e("label",null,[p[15]||(p[15]=B(" Bộ phận ",-1)),ae(e("select",{"onUpdate:modelValue":p[3]||(p[3]=f=>l.value.department=f)},[p[14]||(p[14]=e("option",{value:""},"Tất cả",-1)),(a(!0),i(H,null,G(n.departments,f=>(a(),i("option",{key:f},s(f),1))),128))],512),[[Ie,l.value.department]])]),e("label",null,[p[17]||(p[17]=B(" Loại mẫu ",-1)),ae(e("select",{"onUpdate:modelValue":p[4]||(p[4]=f=>l.value.kind=f),onChange:p[5]||(p[5]=f=>l.value.days=Array(7).fill("OFF"))},[...p[16]||(p[16]=[e("option",{value:"WEEK"},"Mẫu tuần",-1),e("option",{value:"CYCLE"},"Chu kỳ xoay",-1)])],544),[[Ie,l.value.kind]])])]),e("div",Ti,[(a(!0),i(H,null,G(l.value.days,(f,w)=>(a(),i("label",{key:w},[B(s(l.value.kind==="WEEK"?d[w]:"Ngày "+(w+1))+" ",1),ae(e("select",{"onUpdate:modelValue":g=>l.value.days[w]=g},[p[18]||(p[18]=e("option",{value:"OFF"},"Nghỉ",-1)),(a(!0),i(H,null,G(n.shifts.filter(g=>g.active&&g.scheduleType===l.value.scheduleType),g=>(a(),i("option",{key:g.id,value:g.id},s(g.name),9,$i))),128))],8,Ci),[[Ie,l.value.days[w]]])]))),128)),l.value.kind==="CYCLE"?(a(),i("button",{key:0,onClick:p[6]||(p[6]=f=>l.value.days.push("OFF"))}," + Thêm ngày ")):D("",!0),l.value.kind==="CYCLE"&&l.value.days.length>1?(a(),i("button",{key:1,onClick:p[7]||(p[7]=f=>l.value.days.pop())}," Bỏ ngày cuối ")):D("",!0)]),e("label",null,[p[19]||(p[19]=B("Ghi chú",-1)),ae(e("textarea",{"onUpdate:modelValue":p[8]||(p[8]=f=>l.value.note=f)},null,512),[[Xe,l.value.note]])])],8,ki),n.error?(a(),i("p",Di,s(n.error),1)):D("",!0),t.value?D("",!0):(a(),i("button",{key:1,class:"primary",disabled:n.busy,onClick:p[9]||(p[9]=f=>c("save"))},s(n.busy?"Đang lưu…":"Lưu mẫu"),9,Ni))])]),_:1},8,["visible","header"]))}});function ut(n,r=We(new Date().toISOString())){if(!/^\d{4}-\d{2}-\d{2}$/.test(n))return!1;const{from:u}=Qn(n,"week");return u>=r}const Si=Ve`
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
`;async function Ei(n,r){if(!n||!ut(r))throw new Error("Chỉ được tạo lịch tuần tương lai hoặc tuần hiện tại vào thứ Hai.");const{from:u,to:t}=Qn(r,"week"),{data:l}=await Ae.mutate({mutation:Si,variables:{maBoPhan:n,tuNgay:u,denNgay:t},errorPolicy:"none"});if(!(l!=null&&l.createLichXoayCa))throw new Error("Không nhận được kết quả xếp ca.");return l.createLichXoayCa}const xi={key:0,class:"auto-schedule"},Vi=["disabled"],Ai={key:0},Li={key:1},Pi={key:0,class:"schedule-dialog-body"},Oi={key:0,class:"schedule-dialog-details"},Bi={key:1,class:"schedule-dialog-message warning"},Mi=Se({__name:"ScheduleRotatingDialog",props:{eligible:{type:Boolean},departmentCode:{},anchor:{},week:{type:Boolean},disabled:{type:Boolean}},emits:["saved","busy"],setup(n,{emit:r}){const u=vn(),t=n,l=r,c=C(!1),d=C(!1),v=C(),p=Z(()=>t.week&&ut(t.anchor));async function f(){if(!(!t.eligible||t.disabled||c.value||!t.departmentCode||!t.week||!ut(t.anchor))){c.value=!0,l("busy",!0);try{v.value=await Ei(t.departmentCode,t.anchor),v.value.isResults?l("saved"):(v.value.message=we(v.value),u.error(v.value.message))}catch(w){u.error(w),v.value={isResults:!1,message:we(w)}}finally{d.value=!0,c.value=!1,l("busy",!1)}}}return(w,g)=>(a(),i(H,null,[n.eligible?(a(),i("div",xi,[e("button",{type:"button",class:"auto-schedule-button",disabled:n.disabled||c.value||!p.value||!n.departmentCode,onClick:f},s(c.value?"Đang tạo lịch…":"Tự động tạo lịch"),9,Vi),n.week?p.value?D("",!0):(a(),i("p",Li,"Chỉ được tạo lịch tuần tương lai hoặc tuần hiện tại vào thứ Hai.")):(a(),i("p",Ai,"Chọn chế độ tuần để tự động tạo lịch."))])):D("",!0),j(W(Ue),{class:"schedule-dialog",visible:d.value,"onUpdate:visible":g[1]||(g[1]=P=>d.value=P),modal:"",header:"Kết quả xếp ca",style:{width:"520px",maxWidth:"95vw"}},{footer:ce(()=>[j(ke,{type:"button",label:"Đóng",severity:"secondary",outlined:"",onClick:g[0]||(g[0]=P=>d.value=!1)})]),default:ce(()=>{var P;return[v.value?(a(),i("div",Pi,[e("p",{class:te(["schedule-dialog-message",v.value.isResults?"success":"error"]),role:"status"},s(v.value.message||(v.value.isResults?"Tạo lịch thành công.":"Tạo lịch không thành công.")),3),v.value.data?(a(),i("dl",Oi,[g[2]||(g[2]=e("dt",null,"Bộ phận",-1)),e("dd",null,s(v.value.data.maBoPhan),1),g[3]||(g[3]=e("dt",null,"Từ ngày",-1)),e("dd",null,s(v.value.data.tuNgay),1),g[4]||(g[4]=e("dt",null,"Đến ngày",-1)),e("dd",null,s(v.value.data.denNgay),1),g[5]||(g[5]=e("dt",null,"Số phân công",-1)),e("dd",null,s(v.value.data.soPhanCong),1),g[6]||(g[6]=e("dt",null,"Số ca làm việc",-1)),e("dd",null,s(v.value.data.soCaLamViec),1),g[7]||(g[7]=e("dt",null,"Số ngày DO000",-1)),e("dd",null,s(v.value.data.soNgayDO000),1),g[8]||(g[8]=e("dt",null,"Đủ định biên",-1)),e("dd",null,s(v.value.data.duDinhBien?"Có":"Không"),1),g[9]||(g[9]=e("dt",null,"Tất cả nhân viên đủ sáu ngày",-1)),e("dd",null,s(v.value.data.tatCaNhanVienDuSauNgay?"Có":"Không"),1)])):D("",!0),(P=v.value.data)!=null&&P.canhBao?(a(),i("p",Bi,s(Array.isArray(v.value.data.canhBao)?v.value.data.canhBao.join(`
`):v.value.data.canhBao),1)):D("",!0)])):D("",!0)]}),_:1},8,["visible"])],64))}});function Yn(n=new Date){const r=new Date(n.getTime()+252e5);return{month:r.getUTCMonth()+1,year:r.getUTCFullYear()}}function Ui(n,r,u=new Date){const t=Yn(u);if(!Number.isInteger(n)||!Number.isInteger(r)||n<1||n>12||r<1)throw new Error("Vui lòng chọn tháng và năm hợp lệ.");if(r<t.year||r===t.year&&n<t.month)throw new Error("Không thể phân ca cho tháng/năm quá khứ.")}const Fi=Ve`
  mutation CreateLichHanhChinh($thang: Int!, $nam: Int!) {
    createLichHanhChinh(thang: $thang, nam: $nam) {
      isResults
      message
    }
  }
`;async function Ri(n,r){var t,l;Ui(n,r);const{data:u}=await Ae.mutate({mutation:Fi,variables:{thang:n,nam:r},errorPolicy:"none"});if(!((t=u==null?void 0:u.createLichHanhChinh)!=null&&t.isResults))throw new Error(((l=u==null?void 0:u.createLichHanhChinh)==null?void 0:l.message)||"Phân ca hành chính thất bại.");return u.createLichHanhChinh.message||"Phân ca hành chính thành công."}const Hi={class:"period-fields"},Ki=Se({__name:"ScheduleAdministrativeDialog",props:{disabled:{type:Boolean}},emits:["saved","busy"],setup(n,{emit:r}){const u=n,t=r,l=vn(),c=C(!1),d=C(!1),v=C(Yn()),p=C(v.value.month),f=C(v.value.year),w=Z(()=>Array.from({length:12},(b,K)=>({value:K+1,label:"Tháng "+(K+1)})).filter(b=>f.value!==v.value.year||b.value>=v.value.month)),g=Z(()=>Array.from({length:Math.max(0,2100-v.value.year+1)},(b,K)=>({value:v.value.year+K,label:String(v.value.year+K)})));re(f,b=>{b===v.value.year&&(p.value==null||p.value<v.value.month)&&(p.value=v.value.month)});function P(){u.disabled||d.value||(v.value=Yn(),p.value=v.value.month,f.value=v.value.year,c.value=!0)}async function m(){if(!(d.value||u.disabled)){d.value=!0,t("busy",!0);try{const b=await Ri(p.value,f.value);l.success(b),c.value=!1,t("saved")}catch(b){l.error(b)}finally{d.value=!1,t("busy",!1)}}}return(b,K)=>(a(),i(H,null,[j(ke,{label:"Phân ca hành chính",icon:"pi pi-calendar-plus",disabled:n.disabled||d.value,onClick:P},null,8,["disabled"]),j(W(Ue),{class:"schedule-dialog",visible:c.value,modal:"",header:"Phân ca hành chính",closable:!d.value,"close-on-escape":!d.value,style:{width:"440px",maxWidth:"95vw"},"onUpdate:visible":K[3]||(K[3]=z=>!d.value&&(c.value=z))},{default:ce(()=>[e("form",{class:"period-form",onSubmit:Vt(m,["prevent"])},[e("div",Hi,[e("label",null,[K[4]||(K[4]=B("Tháng",-1)),j(W(Ze),{modelValue:p.value,"onUpdate:modelValue":K[0]||(K[0]=z=>p.value=z),options:w.value,"option-label":"label","option-value":"value",disabled:d.value,placeholder:"Chọn tháng"},null,8,["modelValue","options","disabled"])]),e("label",null,[K[5]||(K[5]=B("Năm",-1)),j(W(Ze),{modelValue:f.value,"onUpdate:modelValue":K[1]||(K[1]=z=>f.value=z),options:g.value,"option-label":"label","option-value":"value",filter:"",disabled:d.value,placeholder:"Chọn năm"},null,8,["modelValue","options","disabled"])])]),e("footer",null,[j(ke,{type:"button",label:"Hủy",severity:"secondary",outlined:"",disabled:d.value,onClick:K[2]||(K[2]=z=>c.value=!1)},null,8,["disabled"]),j(ke,{type:"submit",label:"Xác nhận",icon:"pi pi-check",loading:d.value,disabled:p.value==null||f.value==null||f.value<v.value.year},null,8,["loading","disabled"])])],32)]),_:1},8,["visible","closable","close-on-escape"])],64))}}),zi=tn(Ki,[["__scopeId","data-v-1f0b35a9"]]),Gi={class:"assignment-calendar"},ji={class:"calendar-toolbar"},Xi={class:"calendar-navigation"},Wi=["aria-label","disabled"],Yi=["value","disabled"],Ji=["value","disabled"],Qi=["aria-label","disabled"],Zi={key:2},_i={class:"view-toggle",role:"group","aria-label":"Phạm vi lịch phân công"},es=["aria-pressed"],ns=["aria-pressed"],ts={class:"employee-calendar-wrap"},ls={class:"employee-calendar"},as={class:"employee-column"},os={class:"department-column"},is=["title"],ss=["disabled","aria-label","onClick"],rs={key:0},us={key:0},ds=["colspan"],cs=["disabled"],hs={class:"schedule-dialog-summary"},vs={class:"full-time"},ms={key:0},ps={key:1,role:"alert"},gs={key:0,class:"full-time"},fs={key:1},ys={key:2},bs={key:3,role:"alert"},qs={key:0},ks={key:2,class:"schedule-dialog-message error",role:"alert"},ws={class:"schedule-dialog-actions"},Ts={class:"schedule-dialog-body"},Cs={class:"schedule-dialog-summary"},$s={class:"schedule-dialog-details"},Ds=Se({__name:"AssignmentCalendar",props:{employees:{},shifts:{},existingAssignments:{},canEdit:{type:Boolean},scheduledDates:{},shiftsLoading:{type:Boolean},shiftsError:{},modelValue:{},createAssignment:{type:Function},initialDate:{},viewMode:{},anchorDate:{},fixedDate:{},disabled:{type:Boolean},administrative:{type:Boolean},administrativeShiftId:{}},emits:["edit","request-shifts","update:modelValue","update:viewMode","update:anchorDate"],setup(n,{emit:r}){const u=vn(),t=n,l=r,c=C(!1),d=C(!1),v=C(),p=C(!1),f=C(""),w=C(""),g=C(!0),P=C(""),m=C(""),b=C(""),K=C("12:00"),z=C(""),k=C([]),S=C(!1),T=C("");async function L(){if(!S.value){S.value=!0,T.value="";try{k.value=(await Gn(null,"ADMINISTRATIVE")).filter(q=>q.workType==="0")}catch(q){T.value=we(q)}finally{S.value=!1}}}re(g,q=>{t.administrative&&!q&&!k.value.length&&L()}),re(()=>t.disabled,q=>{q&&!c.value&&(p.value=!1,d.value=!1)});const _=Z(()=>t.shifts.find(q=>q.id===w.value)),N=Z(()=>{var q;return!t.administrative&&!!((q=_.value)!=null&&q.code.endsWith("XX"))}),E=Z(()=>{if(t.administrative&&!g.value)return K.value;if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(b.value))return"";const[q,$]=b.value.split(":").map(Number);return`${String((q+(g.value?8:4))%24).padStart(2,"0")}:${String($).padStart(2,"0")}`}),X=Z(()=>!!E.value&&E.value<=b.value);re([w,_],()=>{var q,$,x,V;if(t.administrative){b.value="08:00";return}b.value=((q=se(f.value))==null?void 0:q.shiftId)===w.value?(($=se(f.value))==null?void 0:$.startTime)||((x=_.value)==null?void 0:x.startTime)||"":((V=_.value)==null?void 0:V.startTime)||""});const ie=C(xn());let ue;un(()=>{ue=setInterval(()=>{ie.value=xn()},3e4)}),hn(()=>clearInterval(ue));const me=["T2","T3","T4","T5","T6","T7","CN"],he=C(""),De=Z(()=>t.employees.find(q=>q.code===he.value)),$e=Z(()=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(t.anchorDate))return[];const q=new Date(t.anchorDate+"T12:00:00");if(Number.isNaN(q.getTime()))return[];t.viewMode==="week"?q.setDate(q.getDate()-(q.getDay()+6)%7):q.setDate(1);const $=t.viewMode==="week"?7:new Date(q.getFullYear(),q.getMonth()+1,0).getDate();return Array.from({length:$},(x,V)=>{const A=new Date(q);return A.setDate(A.getDate()+V),`${A.getFullYear()}-${String(A.getMonth()+1).padStart(2,"0")}-${String(A.getDate()).padStart(2,"0")}`})});function ve(q){const $=new Date(t.anchorDate+"T12:00:00");t.viewMode==="month"?($.setDate(1),$.setMonth($.getMonth()+q)):$.setDate($.getDate()+q*7),O($)}function O(q){l("update:anchorDate",`${q.getFullYear()}-${String(q.getMonth()+1).padStart(2,"0")}-${String(q.getDate()).padStart(2,"0")}`)}function M(q){/^\d{4}-\d{2}$/.test(q)&&O(new Date(`${q}-01T12:00:00`))}function ee(q){return new Date(`${q}T12:00:00`).toLocaleDateString("vi-VN")}function se(q,$=he.value){return t.modelValue.find(x=>x.date===q&&x.employeeId===$)}function pe(q,$){var x,V;return t.fixedDate===q?!1:((x=t.scheduledDates)==null?void 0:x.some(A=>A.employeeId===$&&A.dates.includes(q)))||((V=t.existingAssignments)==null?void 0:V.some(A=>A.employeeId===$&&A.date===q))}function J(q,$){var x,V;return((V=(x=t.existingAssignments)==null?void 0:x.find(A=>A.employeeId===$&&A.date===q))==null?void 0:V.assignmentSource)==="S"}function ge(q){return t.administrative&&new Date(`${q}T12:00:00`).getDay()===0}function Ye(q,$){var A,Q;if(c.value||d.value)return;const x=(A=t.existingAssignments)==null?void 0:A.find(ne=>ne.employeeId===$&&ne.date===q);if(x&&t.canEdit&&!t.disabled&&!xe(q)){l("edit",x);return}if(t.administrative||t.disabled||ge(q)||xe(q)||pe(q,$))return;he.value=$;const V=se(q);f.value=q,w.value=t.administrative?t.administrativeShiftId||"":(V==null?void 0:V.shiftId)||"",z.value=(V==null?void 0:V.leaveTypeId)||"",g.value=t.createAssignment?!0:(V==null?void 0:V.fullTime)??!0,t.administrative&&!g.value&&!k.value.length&&L(),P.value=(V==null?void 0:V.note)||"",m.value="",b.value=t.administrative?"08:00":(V==null?void 0:V.startTime)||((Q=_.value)==null?void 0:Q.startTime)||"",K.value=(V==null?void 0:V.fullTime)===!1&&V.endTime||"12:00",p.value=!0,t.administrative||l("request-shifts")}function mn(){var q,$,x;if(!(t.disabled||c.value)){if(t.administrative&&!g.value&&(!/^([01]\d|2[0-3]):[0-5]\d$/.test(K.value)||K.value<="08:00"||K.value>"16:00")){m.value="Giờ kết thúc phải sau 08:00 và không quá 16:00.";return}if(t.administrative&&!g.value&&(S.value||!k.value.some(V=>V.id===z.value))){m.value="Chọn mã nghỉ phép cho nửa ca còn lại.";return}if(xe(f.value)){m.value="Không được phân công ngày trong quá khứ.";return}if(!(!t.administrative&&(t.shiftsLoading||t.shiftsError))){if(N.value&&!E.value){m.value="Vui lòng nhập giờ bắt đầu hợp lệ.";return}if(!t.administrative&&(!w.value||w.value!=="OFF"&&!t.shifts.some(V=>V.id===w.value))||t.administrative&&!t.administrativeShiftId){m.value="Vui lòng chọn ca đang hoạt động.";return}if(t.createAssignment){const V=_.value;if(!V||!V.active||V.workType==="0"){m.value="Vui lòng chọn ca làm việc đang hoạt động.";return}if(!g.value){m.value="Vui lòng chọn toàn thời gian để tạo phân công ca.";return}v.value={employeeId:he.value,date:f.value,shiftId:V.id,fullTime:!0,note:P.value,startTime:N.value?b.value:V.startTime,endTime:N.value?E.value:V.endTime,crossDay:N.value?X.value:V.crossDay},d.value=!0;return}l("update:modelValue",[...t.modelValue.filter(V=>V.date!==f.value||V.employeeId!==he.value),{employeeId:he.value,date:f.value,shiftId:t.administrative?t.administrativeShiftId:w.value,leaveTypeId:t.administrative&&!g.value?z.value:null,fullTime:w.value==="OFF"?!0:g.value,note:t.administrative?"":P.value,...t.administrative&&!g.value?{startTime:b.value,endTime:E.value,crossDay:X.value}:{},...!t.administrative&&w.value!=="OFF"?{startTime:N.value?b.value:(q=_.value)==null?void 0:q.startTime,endTime:N.value?E.value:($=_.value)==null?void 0:$.endTime,crossDay:N.value?X.value:(x=_.value)==null?void 0:x.crossDay}:{}}].sort((V,A)=>V.date.localeCompare(A.date))),p.value=!1}}}async function ln(){if(d.value&&!(!d.value||!v.value||!t.createAssignment||c.value||t.disabled)){if(xe(v.value.date)||pe(v.value.date,v.value.employeeId)){d.value=!1,m.value="Ngày phân công không còn hợp lệ hoặc nhân viên đã được phân ca. Vui lòng tải lại lịch.";return}c.value=!0,m.value="";try{await t.createAssignment({...v.value}),d.value=!1,p.value=!1,v.value=void 0}catch(q){u.error(q),d.value=!1,m.value=we(q)}finally{c.value=!1}}}function je(){l("update:modelValue",t.modelValue.filter(q=>q.date!==f.value||q.employeeId!==he.value)),p.value=!1}function U(q,$=he.value){var A,Q,ne,le,Ke;const x=(A=t.existingAssignments)==null?void 0:A.find(Ee=>Ee.employeeId===$&&Ee.date===q);if(x)return((Q=x.shiftSymbol)==null?void 0:Q.trim())||((ne=t.shifts.find(Ee=>Ee.id===x.shiftId))==null?void 0:ne.code)||x.shiftId;const V=se(q,$);return V?V.shiftId==="OFF"?"Nghỉ":((le=t.shifts.find(Ee=>Ee.id===V.shiftId))==null?void 0:le.code)||V.shiftId:pe(q,$)?t.administrative&&(((Ke=t.shifts.find(Ee=>Ee.id===t.administrativeShiftId))==null?void 0:Ke.code)||t.administrativeShiftId)||"Đã xếp":ge(q)?"Không xếp":""}function I(q,$){var Oe,Re;const x=(Oe=t.existingAssignments)==null?void 0:Oe.find(ze=>ze.employeeId===$&&ze.date===q),V=se(q,$);if(!x&&!V)return;const A=t.shifts.find(ze=>ze.id===((x==null?void 0:x.shiftId)||(V==null?void 0:V.shiftId))),Q=((Re=t.employees.find(ze=>ze.code===$))==null?void 0:Re.name)||(x==null?void 0:x.employeeName)||$,ne=(x==null?void 0:x.shiftName)||(A==null?void 0:A.name)||U(q,$),le=(x==null?void 0:x.startTime)||(V==null?void 0:V.startTime)||(A==null?void 0:A.startTime),Ke=(x==null?void 0:x.endTime)||(V==null?void 0:V.endTime)||(A==null?void 0:A.endTime),Ee=(x==null?void 0:x.crossDay)??(V==null?void 0:V.crossDay)??(A==null?void 0:A.crossDay);return[`Họ tên: ${Q} (${$})`,`Ngày làm việc: ${ee(q)}`,`Ca làm việc: ${ne}`,`Thời gian làm việc: ${le||"—"}–${Ke||"—"}${Ee?" (+1 ngày)":""}`].join(`
`)}return(q,$)=>(a(),i("section",Gi,[e("div",ji,[e("div",null,[$[18]||($[18]=e("h3",null,"Lịch phân công theo nhân viên",-1)),e("p",null,s(n.administrative?"Lịch hành chính được sắp xếp sẵn.":"Bấm ô ngày của nhân viên để chọn ca.")+" "+s(n.employees.length)+" nhân viên · "+s(n.modelValue.length)+" phân công đã chọn. ",1)]),e("div",Xi,[e("button",{type:"button","aria-label":n.viewMode==="week"?"Tuần trước":"Tháng trước",disabled:!!n.fixedDate,onClick:$[0]||($[0]=x=>ve(-1))}," ‹",8,Wi),n.viewMode==="week"?(a(),i("input",{key:0,value:n.anchorDate,type:"date","aria-label":"Ngày trong tuần phân công",disabled:!!n.fixedDate,onInput:$[1]||($[1]=x=>O(new Date(x.target.value+"T12:00:00")))},null,40,Yi)):(a(),i("input",{key:1,value:n.anchorDate.slice(0,7),type:"month","aria-label":"Tháng phân công",disabled:!!n.fixedDate,onInput:$[2]||($[2]=x=>M(x.target.value))},null,40,Ji)),e("button",{type:"button","aria-label":n.viewMode==="week"?"Tuần sau":"Tháng sau",disabled:!!n.fixedDate,onClick:$[3]||($[3]=x=>ve(1))}," › ",8,Qi),$e.value.length?(a(),i("strong",Zi,s(ee($e.value[0]))+" – "+s(ee($e.value[$e.value.length-1])),1)):D("",!0),e("div",_i,[e("button",{type:"button",class:te({active:n.viewMode==="week"}),"aria-pressed":n.viewMode==="week",onClick:$[4]||($[4]=x=>l("update:viewMode","week"))}," Tuần ",10,es),e("button",{type:"button",class:te({active:n.viewMode==="month"}),"aria-pressed":n.viewMode==="month",onClick:$[5]||($[5]=x=>l("update:viewMode","month"))}," Tháng ",10,ns)])])]),e("div",ts,[e("table",ls,[e("thead",null,[e("tr",null,[$[19]||($[19]=e("th",{class:"employee-column"},"Nhân viên",-1)),$[20]||($[20]=e("th",{class:"department-column"},"Bộ phận",-1)),(a(!0),i(H,null,G($e.value,x=>(a(),i("th",{key:x,class:te({weekend:[0,6].includes(new Date(x+"T12:00:00").getDay())})},[B(s(me[(new Date(x+"T12:00:00").getDay()+6)%7]),1),e("small",null,s(Number(x.slice(-2)))+"/"+s(Number(x.slice(5,7))),1)],2))),128))])]),e("tbody",null,[(a(!0),i(H,null,G(n.employees,x=>(a(),i("tr",{key:x.code},[e("th",as,[e("strong",null,s(x.name),1),e("small",null,s(x.code),1)]),e("td",os,s(x.department||"Chưa có bộ phận"),1),(a(!0),i(H,null,G($e.value,V=>{var A,Q;return a(),i("td",{key:V,title:I(V,x.code),class:te({weekend:[0,6].includes(new Date(V+"T12:00:00").getDay())})},[e("button",{type:"button",class:te({picked:!!se(V,x.code),assigned:pe(V,x.code),"source-s":J(V,x.code)}),disabled:n.administrative&&!(n.canEdit&&pe(V,x.code))||n.disabled||V<ie.value||!!n.fixedDate&&V!==n.fixedDate||ge(V)||pe(V,x.code)&&!n.canEdit,"aria-label":x.name+" · "+V+" · "+U(V,x.code),onClick:ne=>Ye(V,x.code)},[e("strong",null,s(U(V,x.code)||"+ Chọn ca"),1),se(V,x.code)&&((A=se(V,x.code))==null?void 0:A.shiftId)!=="OFF"?(a(),i("small",rs,s((Q=se(V,x.code))!=null&&Q.fullTime?"Cả ca":"1/2 ca"),1)):D("",!0)],10,ss)],10,is)}),128))]))),128)),n.employees.length?D("",!0):(a(),i("tr",us,[e("td",{colspan:$e.value.length+2,class:"empty-state"}," Không tìm thấy nhân viên thuộc bộ phận hoặc từ khóa đã chọn. ",8,ds)]))])])]),j(W(Ue),{class:"schedule-dialog",visible:p.value,"onUpdate:visible":$[15]||($[15]=x=>p.value=x),modal:"",closable:!c.value,"close-on-escape":!c.value,header:n.createAssignment?"Tạo phân công ca":"Chọn ca",style:{width:"520px",maxWidth:"95vw"}},{default:ce(()=>{var x,V,A;return[e("fieldset",{class:"day-shift-dialog",disabled:c.value||d.value},[e("p",hs,[e("strong",null,s((x=De.value)==null?void 0:x.name),1),B(" · "+s((V=De.value)==null?void 0:V.code),1),$[21]||($[21]=e("br",null,null,-1)),B(s(ee(f.value))+" · "+s((A=De.value)==null?void 0:A.department),1)]),n.administrative?(a(),i(H,{key:0},[e("label",vs,[ae(e("input",{"onUpdate:modelValue":$[6]||($[6]=Q=>g.value=Q),type:"checkbox"},null,512),[[it,g.value]]),$[22]||($[22]=B("Toàn ca",-1))]),g.value?D("",!0):(a(),i(H,{key:0},[e("label",null,[$[23]||($[23]=B("Giờ kết thúc",-1)),j(W(Qe),{modelValue:K.value,"onUpdate:modelValue":$[7]||($[7]=Q=>K.value=Q),type:"time",min:"08:01",max:"16:00",required:""},null,8,["modelValue"])]),e("label",null,[$[24]||($[24]=B("Loại nghỉ phép *",-1)),j(W(Ze),{modelValue:z.value,"onUpdate:modelValue":$[8]||($[8]=Q=>z.value=Q),options:k.value,"option-label":"name","option-value":"id",placeholder:"Chọn mã nghỉ phép",disabled:c.value||d.value||S.value},null,8,["modelValue","options","disabled"])]),S.value?(a(),i("p",ms,"Đang tải loại nghỉ phép...")):D("",!0),T.value?(a(),i("p",ps,[B(s(T.value)+" ",1),j(ke,{type:"button",label:"Thử lại",text:"",size:"small",onClick:L})])):D("",!0)],64))],64)):(a(),i(H,{key:1},[e("label",null,[$[25]||($[25]=B("Ca làm việc *",-1)),j(W(Ze),{modelValue:w.value,"onUpdate:modelValue":$[9]||($[9]=Q=>w.value=Q),options:[...n.shifts.map(Q=>({value:Q.id,label:Q.code+" · "+Q.name+(Q.startTime&&Q.endTime?" · "+Q.startTime+"–"+Q.endTime:"")+(Q.crossDay?" (+1 ngày)":"")})),...n.createAssignment?[]:[{value:"OFF",label:"Nghỉ"}]],"option-label":"label","option-value":"value",placeholder:"Chọn ca làm việc",disabled:c.value||d.value||n.shiftsLoading||!!n.shiftsError},null,8,["modelValue","options","disabled"])]),!n.createAssignment&&w.value&&w.value!=="OFF"?(a(),i("label",gs,[ae(e("input",{"onUpdate:modelValue":$[10]||($[10]=Q=>g.value=Q),type:"checkbox"},null,512),[[it,g.value]]),$[26]||($[26]=B("Toàn thời gian",-1))])):D("",!0),w.value&&w.value!=="OFF"?(a(),i("p",fs,[B(s(g.value?"Làm cả ca đã chọn.":"Làm 1/2 ca đã chọn.")+" ",1),g.value?D("",!0):(a(),i(H,{key:0},[B("Khung giờ cụ thể của nửa ca chưa được xác định.")],64))])):D("",!0),n.shiftsLoading?(a(),i("p",ys,"Đang tải danh sách ca...")):D("",!0),n.shiftsError?(a(),i("p",bs,[B(s(n.shiftsError)+" ",1),j(ke,{type:"button",label:"Thử lại",text:"",size:"small",onClick:$[11]||($[11]=Q=>l("request-shifts"))})])):D("",!0),N.value?(a(),i(H,{key:4},[e("label",null,[$[27]||($[27]=B("Giờ bắt đầu *",-1)),j(W(Qe),{modelValue:b.value,"onUpdate:modelValue":$[12]||($[12]=Q=>b.value=Q),type:"time",required:""},null,8,["modelValue"])]),e("label",null,[$[28]||($[28]=B("Giờ kết thúc",-1)),j(W(Qe),{"model-value":E.value,type:"time",readonly:""},null,8,["model-value"])]),X.value?(a(),i("p",qs,"Giờ kết thúc thuộc ngày hôm sau.")):D("",!0)],64)):D("",!0),e("label",null,[$[29]||($[29]=B("Ghi chú",-1)),j(W(Bt),{modelValue:P.value,"onUpdate:modelValue":$[13]||($[13]=Q=>P.value=Q),rows:"3","auto-resize":"",placeholder:"Nhập ghi chú (nếu có)"},null,8,["modelValue"])])],64)),m.value?(a(),i("p",ks,s(m.value),1)):D("",!0),e("div",ws,[se(f.value)?(a(),Te(ke,{key:0,type:"button",label:"Bỏ ngày này",severity:"danger",text:"",onClick:je})):D("",!0),j(ke,{type:"button",label:"Hủy",severity:"secondary",outlined:"",onClick:$[14]||($[14]=Q=>p.value=!1)}),j(ke,{type:"button",label:n.createAssignment?"Tạo ca":"Chọn ca",icon:"pi pi-check",disabled:!n.administrative&&(n.shiftsLoading||!!n.shiftsError),onClick:mn},null,8,["label","disabled"])])],8,cs)]}),_:1},8,["visible","closable","close-on-escape","header"]),j(W(Ue),{class:"schedule-dialog",visible:d.value,modal:"",header:"Xác nhận tạo phân công ca",closable:!c.value,"close-on-escape":!c.value,style:{width:"520px",maxWidth:"95vw"},"onUpdate:visible":$[17]||($[17]=x=>!c.value&&(d.value=x))},{footer:ce(()=>[j(ke,{type:"button",label:"Quay lại",severity:"secondary",outlined:"",disabled:c.value,onClick:$[16]||($[16]=x=>d.value=!1)},null,8,["disabled"]),j(ke,{type:"button",label:"Xác nhận tạo ca",icon:"pi pi-check",loading:c.value,disabled:c.value,onClick:ln},null,8,["loading","disabled"])]),default:ce(()=>{var x,V,A,Q,ne,le,Ke,Ee,Oe,Re;return[e("div",Ts,[e("p",Cs,[$[30]||($[30]=B(" Xác nhận tạo ca cho ",-1)),e("strong",null,s((x=De.value)==null?void 0:x.name)+" ("+s((V=v.value)==null?void 0:V.employeeId)+")",1),$[31]||($[31]=B(". ",-1))]),e("dl",$s,[$[33]||($[33]=e("dt",null,"Ngày làm việc",-1)),e("dd",null,s((A=v.value)!=null&&A.date?ee(v.value.date):""),1),$[34]||($[34]=e("dt",null,"Bộ phận",-1)),e("dd",null,s(((Q=De.value)==null?void 0:Q.department)||"—"),1),$[35]||($[35]=e("dt",null,"Ca làm việc",-1)),e("dd",null,s((ne=_.value)==null?void 0:ne.code)+" · "+s((le=_.value)==null?void 0:le.name),1),$[36]||($[36]=e("dt",null,"Giờ làm",-1)),e("dd",null,s(((Ke=v.value)==null?void 0:Ke.startTime)||"Theo cấu hình ca")+" – "+s(((Ee=v.value)==null?void 0:Ee.endTime)||"Theo cấu hình ca")+s((Oe=v.value)!=null&&Oe.crossDay?" (+1 ngày)":""),1),(Re=v.value)!=null&&Re.note?(a(),i(H,{key:0},[$[32]||($[32]=e("dt",null,"Ghi chú",-1)),e("dd",null,s(v.value.note),1)],64)):D("",!0)])])]}),_:1},8,["visible","closable","close-on-escape"])]))}}),Ns=tn(Ds,[["__scopeId","data-v-a8611e83"]]),Is={class:"panel form"},Ss={class:"toolbar"},Es={key:0,class:"actions"},xs={key:0},Vs={key:1,class:"assignment-workspace"},As={class:"department-tree-panel"},Ls={key:0,role:"status"},Ps={key:1,role:"alert"},Os={key:2,"aria-label":"Cây bộ phận theo loại lịch"},Bs=["aria-pressed","disabled","onClick"],Ms={key:0,class:"tree-hint"},Us={key:3,class:"tree-unavailable"},Fs={class:"assignment-schedule-panel"},Rs={key:0,class:"assignment-lock"},Hs={key:1,role:"status"},Ks={key:2,role:"alert",class:"error"},zs={key:3,class:"department-schedule-type"},Gs={key:4,class:"employee-picker"},js={key:0},Xs=["checked"],Ws=["value"],Ys=["checked","disabled","onChange"],Js={key:1},Qs={class:"actions schedule-actions"},Zs=["disabled"],_s=Se({__name:"ScheduleAssignmentTab",props:Pe({editing:{},busy:{type:Boolean},canCreate:{type:Boolean},canEdit:{type:Boolean},canUpdate:{type:Boolean},canBulk:{type:Boolean},treeLoading:{type:Boolean},treeError:{},departmentGroups:{},unclassifiedDepartments:{},loadDepartmentTree:{type:Function},shiftsLoading:{type:Boolean},shiftsError:{},loadManualShifts:{type:Function},eligible:{},name:{type:Function},manualShifts:{},data:{},scheduledDates:{},start:{},administrativeShiftId:{},makePreview:{type:Function},createAssignment:{type:Function}},{bulk:{type:Boolean,required:!0},bulkModifiers:{},selected:{required:!0},selectedModifiers:{},formDepartment:{required:!0},formDepartmentModifiers:{},formSearch:{required:!0},formSearchModifiers:{},scheduleType:{required:!0},scheduleTypeModifiers:{},method:{required:!0},methodModifiers:{},dayPlans:{required:!0},dayPlansModifiers:{},calendarMode:{required:!0},calendarModeModifiers:{},calendarAnchor:{required:!0},calendarAnchorModifiers:{}}),emits:Pe(["edit","reload","administrative-created","administrative-busy"],["update:bulk","update:selected","update:formDepartment","update:formSearch","update:scheduleType","update:method","update:dayPlans","update:calendarMode","update:calendarAnchor"]),setup(n,{emit:r}){const u=C(),t=de(n,"bulk"),l=de(n,"selected"),c=de(n,"formDepartment"),d=de(n,"formSearch"),v=de(n,"scheduleType"),p=de(n,"method"),f=de(n,"dayPlans"),w=de(n,"calendarMode"),g=de(n,"calendarAnchor"),P=r,m=n,b=Z(()=>{var z;return((z=m.departmentGroups.flatMap(k=>k.departments).find(k=>k.name===c.value))==null?void 0:z.code)||""}),K=Z(()=>m.manualShifts.some(z=>{var k;return z.active&&((k=z.workType)==null?void 0:k.trim().toUpperCase())==="C"}));return(z,k)=>{var T,L,_;const S=Jn("RouterLink");return a(),i("section",Is,[e("div",Ss,[e("h2",null,s(n.editing?"Sửa phân công":"Tạo phân công"),1),n.editing?D("",!0):(a(),i("div",Es,[n.canUpdate?(a(),Te(S,{key:0,class:"schedule-action-link",to:"/schedules/exchange"},{default:ce(()=>[...k[19]||(k[19]=[B("Đổi ca",-1)])]),_:1})):D("",!0),n.canUpdate?(a(),Te(S,{key:1,class:"schedule-action-link",to:"/schedules/leave-calendar"},{default:ce(()=>[...k[20]||(k[20]=[B("Nghỉ phép",-1)])]),_:1})):D("",!0),n.canCreate?(a(),Te(zi,{key:2,disabled:n.busy,onSaved:k[0]||(k[0]=N=>P("administrative-created")),onBusy:k[1]||(k[1]=N=>P("administrative-busy",N))},null,8,["disabled"])):D("",!0),e("button",{class:te({chosen:!t.value}),onClick:k[2]||(k[2]=N=>{t.value=!1,l.value=[],p.value="calendar"})}," Cá nhân ",2),n.canBulk?(a(),i("button",{key:3,class:te({chosen:t.value}),onClick:k[3]||(k[3]=N=>{t.value=!0,l.value=[]})}," Hàng loạt ",2)):D("",!0)]))]),n.canEdit?(a(),i("div",Vs,[e("aside",As,[k[23]||(k[23]=e("h3",null,"Bộ phận",-1)),k[24]||(k[24]=e("p",{class:"tree-hint"},"Chọn bộ phận để phân công ca",-1)),n.treeLoading?(a(),i("p",Ls,"Đang phân loại bộ phận…")):D("",!0),n.treeError?(a(),i("p",Ps,s(n.treeError),1)):D("",!0),n.treeLoading?D("",!0):(a(),i("nav",Os,[(a(!0),i(H,null,G(n.departmentGroups,N=>(a(),i("details",{key:N.type,open:"",class:"department-tree-group"},[e("summary",null,[B(s(N.label)+" ",1),e("span",null,s(N.departments.length),1)]),(a(!0),i(H,null,G(N.departments,E=>(a(),i("button",{key:E.code,type:"button",class:te({selected:c.value===E.name}),"aria-pressed":c.value===E.name,disabled:n.busy||!!n.editing,onClick:X=>c.value=E.name},[k[21]||(k[21]=e("i",{class:"pi pi-building","aria-hidden":"true"},null,-1)),e("span",null,[B(s(E.name),1),e("small",null,s(E.code),1)])],10,Bs))),128)),N.departments.length?D("",!0):(a(),i("p",Ms,"Chưa có bộ phận"))]))),128))])),!n.treeLoading&&n.unclassifiedDepartments.length?(a(),i("div",Us,[k[22]||(k[22]=e("p",null,"Chưa xác định loại lịch hoặc chưa có ca hoạt động:",-1)),(a(!0),i(H,null,G(n.unclassifiedDepartments,N=>(a(),i("small",{key:N.code},s(N.name),1))),128)),e("button",{type:"button",onClick:k[4]||(k[4]=(...N)=>n.loadDepartmentTree&&n.loadDepartmentTree(...N))},"Tải lại")])):D("",!0)]),e("div",Fs,[c.value?D("",!0):(a(),i("p",Rs,[...k[25]||(k[25]=[e("i",{class:"pi pi-lock","aria-hidden":"true"},null,-1),B(" Chọn bộ phận ở bên trái để mở chức năng chọn ca. ",-1)])])),n.shiftsLoading?(a(),i("p",Hs,"Đang tải ca và xác định loại lịch…")):D("",!0),n.shiftsError?(a(),i("p",Ks,[B(s(n.shiftsError)+" ",1),e("button",{onClick:k[5]||(k[5]=(...N)=>n.loadManualShifts&&n.loadManualShifts(...N))},"Thử lại")])):D("",!0),c.value&&!n.shiftsLoading&&!n.shiftsError&&n.manualShifts.length?(a(),i("p",zs," Loại lịch của bộ phận: "+s(v.value==="ADMINISTRATIVE"?"Hành chính":"Làm theo ca"),1)):D("",!0),e("h3",null,s(p.value==="calendar"?"Tìm nhân viên trong lịch":"1. Chọn nhân viên · "+l.value.length+" đã chọn"),1),ae(e("input",{"onUpdate:modelValue":k[6]||(k[6]=N=>d.value=N),placeholder:"Tìm mã NV hoặc họ tên","aria-label":"Tìm nhân viên"},null,512),[[Xe,d.value]]),p.value!=="calendar"?(a(),i("div",Gs,[t.value?(a(),i("label",js,[e("input",{type:"checkbox",checked:!!n.eligible.length&&n.eligible.every(N=>l.value.includes(N.code)),onChange:k[7]||(k[7]=N=>l.value=n.eligible.every(E=>l.value.includes(E.code))?[]:n.eligible.map(E=>E.code))},null,40,Xs),k[26]||(k[26]=B("Chọn tất cả kết quả ",-1))])):D("",!0),(a(!0),i(H,null,G(n.eligible,N=>(a(),i("label",{key:N.code},[t.value?ae((a(),i("input",{key:0,"onUpdate:modelValue":k[8]||(k[8]=E=>l.value=E),type:"checkbox",value:N.code},null,8,Ws)),[[it,l.value]]):(a(),i("input",{key:1,type:"radio",name:"employee",checked:l.value.includes(N.code),disabled:!!n.editing,onChange:E=>l.value=[N.code]},null,40,Ys)),B(s(n.name(N.code)),1)]))),128)),n.eligible.length?D("",!0):(a(),i("p",Js,"Không tìm thấy nhân viên."))])):D("",!0),p.value==="calendar"?(a(),Te(Ns,{key:((T=n.editing)==null?void 0:T.id)||n.start,modelValue:f.value,"onUpdate:modelValue":k[9]||(k[9]=N=>f.value=N),employees:(n.editing?n.eligible.filter(N=>{var E;return N.code===((E=n.editing)==null?void 0:E.employeeId)}):n.eligible).map(N=>({code:N.code,name:N.name,department:String(N.department||"")})),shifts:n.manualShifts,"existing-assignments":n.data.assignments,"create-assignment":n.createAssignment,"can-edit":n.canUpdate&&!n.editing,onEdit:k[10]||(k[10]=N=>u.value=N),"scheduled-dates":n.scheduledDates,"shifts-loading":n.shiftsLoading,"shifts-error":n.shiftsError,onRequestShifts:n.loadManualShifts,"view-mode":w.value,"anchor-date":g.value,"onUpdate:viewMode":k[11]||(k[11]=N=>w.value=N),"onUpdate:anchorDate":k[12]||(k[12]=N=>g.value=N),administrative:v.value==="ADMINISTRATIVE","administrative-shift-id":n.administrativeShiftId,"initial-date":n.start,"fixed-date":(L=n.editing)==null?void 0:L.date,disabled:n.busy||!c.value||v.value==="ADMINISTRATIVE"&&(n.shiftsLoading||!!n.shiftsError||!n.administrativeShiftId)},null,8,["modelValue","employees","shifts","existing-assignments","create-assignment","can-edit","scheduled-dates","shifts-loading","shifts-error","onRequestShifts","view-mode","anchor-date","administrative","administrative-shift-id","initial-date","fixed-date","disabled"])):D("",!0),!n.editing&&n.canCreate?(a(),Te(Mi,{key:6,eligible:K.value,"department-code":b.value,anchor:g.value,week:w.value==="week",disabled:n.busy||n.shiftsLoading||!!n.shiftsError,onBusy:k[13]||(k[13]=N=>P("administrative-busy",N)),onSaved:k[14]||(k[14]=N=>{f.value=[],P("reload")})},null,8,["eligible","department-code","anchor","week","disabled"])):D("",!0),e("div",Qs,[e("button",{class:"primary",disabled:n.busy||!c.value||n.shiftsLoading||!!n.shiftsError||!n.manualShifts.length||(p.value==="calendar"?!f.value.length:!l.value.length),onClick:k[15]||(k[15]=(...N)=>n.makePreview&&n.makePreview(...N))}," Xem trước phân công ",8,Zs),k[27]||(k[27]=e("span",null,"Không ghi đè lịch âm thầm.",-1))])])])):(a(),i("p",xs,"Bạn không có quyền phân công ca.")),j(Ft,{onBusy:k[16]||(k[16]=N=>P("administrative-busy",N)),assignment:u.value,"department-code":((_=[...n.departmentGroups.flatMap(N=>N.departments),...n.unclassifiedDepartments].find(N=>N.name===c.value))==null?void 0:_.code)||null,"employee-name":u.value?n.name(u.value.employeeId):"",onClose:k[17]||(k[17]=N=>u.value=void 0),onConfirmed:k[18]||(k[18]=N=>P("reload"))},null,8,["assignment","department-code","employee-name"])])}}}),er=tn(_s,[["__scopeId","data-v-c10c225c"]]),nr={class:"toolbar"},tr={class:"actions"},lr={class:"actions"},ar=["onClick"],or={key:0,class:"panel empty-state"},ir={key:0,class:"demo"},sr={key:0},rr={key:1,class:"panel month-calendar"},ur={class:"month-heading"},dr={class:"calendar-employee"},cr={class:"month-shifts"},hr=["title","onClick"],vr={class:"assignment-date"},mr={key:0,class:"unassigned-note"},pr={key:2,class:"day-calendar"},gr={class:"calendar-employee"},fr={class:"day-shifts"},yr=["title","onClick"],br={class:"shift-symbol"},qr={key:0,class:"day-unassigned"},kr=["onClick"],wr={key:3,class:"panel grid-wrap"},Tr=["title","disabled","onClick"],Cr={key:1},$r={key:4,class:"agenda"},Dr=["onClick"],Nr=Se({__name:"ScheduleCalendarTab",props:Pe({employees:{},visibleEmployees:{},groupByDepartment:{type:Boolean},dates:{},today:{},shifts:{},canCreate:{type:Boolean},employeeAssignments:{type:Function},cell:{type:Function},matches:{type:Function},fmt:{type:Function},name:{type:Function},shiftName:{type:Function},symbol:{type:Function},label:{type:Function},pending:{type:Function}},{view:{required:!0},viewModifiers:{},anchor:{required:!0},anchorModifiers:{}}),emits:Pe(["move","open"],["update:view","update:anchor"]),setup(n,{emit:r}){const u=de(n,"view"),t=de(n,"anchor"),l=n,c=r,d=["T2","T3","T4","T5","T6","T7","CN"];function v(w){return w?w.status==="OFF"?"OFF":w.status==="LEAVE"?w.shiftSymbol||w.shiftId||"NP":l.symbol(w)||"—":"—"}const p=Z(()=>{if(!l.groupByDepartment)return[{department:"",employees:l.visibleEmployees}];const w=new Map;for(const g of l.visibleEmployees){const P=g.department||"Chưa có bộ phận",m=w.get(P)||[];m.push(g),w.set(P,m)}return[...w.entries()].sort(([g],[P])=>g.localeCompare(P,"vi")).map(([g,P])=>({department:g,employees:P.sort((m,b)=>m.name.localeCompare(b.name,"vi"))}))});function f(w){if(!w)return"unassigned";const g="employeeId"in w?w:void 0;if((g==null?void 0:g.status)==="OFF"||(g==null?void 0:g.shiftId)==="OFF"||w.id==="OFF")return"off";if((g==null?void 0:g.status)==="LEAVE")return"leave";const P="employeeId"in w?l.shifts.find(k=>k.id===w.shiftId):w,m=String((P==null?void 0:P.code)||(g==null?void 0:g.shiftSymbol)||(g==null?void 0:g.shiftId)||"").toUpperCase(),b=String((P==null?void 0:P.name)||(g==null?void 0:g.shiftName)||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();if((g==null?void 0:g.scheduleType)==="ADMINISTRATIVE"||(P==null?void 0:P.scheduleType)==="ADMINISTRATIVE"||["D","HC","ADMINISTRATIVE"].includes(m)||b.includes("hanh chinh"))return"administrative";if(m.endsWith("XX")||b.includes("tuy chon")||b.includes("linh hoat")||b.includes("flex"))return"flexible";if(m==="M"||b.includes("sang")||b.includes("morning"))return"morning";if(m==="E"||b.includes("chieu")||b.includes("afternoon"))return"afternoon";if(m==="N"||b.includes("toi")||b.includes("dem")||b.includes("night"))return"night";const K=(g==null?void 0:g.startTime)||(P==null?void 0:P.startTime)||"",z=Number(K.slice(0,2));return K&&Number.isFinite(z)?z<5||z>=18?"night":z<11?"morning":"afternoon":"unassigned"}return(w,g)=>(a(),i(H,null,[e("div",nr,[e("div",tr,[e("button",{"aria-label":"Kỳ trước",onClick:g[0]||(g[0]=P=>c("move",-1))}," ‹ "),e("button",{onClick:g[1]||(g[1]=P=>t.value=n.today)}," Hôm nay "),e("button",{"aria-label":"Kỳ sau",onClick:g[2]||(g[2]=P=>c("move",1))}," › "),e("strong",null,s(n.fmt(n.dates[0]))+" – "+s(n.fmt(n.dates[n.dates.length-1])),1)]),e("div",lr,[(a(),i(H,null,G([{id:"day",name:"Ngày"},{id:"week",name:"Tuần"},{id:"month",name:"Tháng"}],P=>e("button",{key:P.id,class:te({chosen:u.value===P.id}),onClick:m=>u.value=P.id},s(P.name),11,ar)),64))])]),g[7]||(g[7]=dl('<div class="legend"><span class="shift-legend-item shift-tone--morning"><i></i>Ca sáng</span><span class="shift-legend-item shift-tone--afternoon"><i></i>Ca chiều</span><span class="shift-legend-item shift-tone--flexible"><i></i>Ca tùy chọn</span><span class="shift-legend-item shift-tone--night"><i></i>Ca tối</span><span class="shift-legend-item shift-tone--off"><i></i>OFF</span><span class="shift-legend-item shift-tone--administrative"><i></i>Hành chính</span><span class="shift-legend-item shift-tone--leave"><i></i>Nghỉ phép</span><span>↔ Chờ đổi ca</span></div>',1)),n.visibleEmployees.length?(a(),i(H,{key:1},[n.visibleEmployees.some(P=>n.dates.some(m=>n.cell(P.code,m)))?D("",!0):(a(),i("p",ir," Chưa có lịch làm việc trong khoảng thời gian này. Chọn Phân công ca để lập lịch. ")),(a(!0),i(H,null,G(p.value,P=>(a(),Te(cl(n.groupByDepartment?"details":"div"),{key:P.department||"selected-department",class:"department-calendar-group",open:n.groupByDepartment?!0:void 0},{default:ce(()=>[n.groupByDepartment?(a(),i("summary",sr,[e("strong",null,s(P.department),1),e("small",null,s(P.employees.length)+" nhân viên",1)])):D("",!0),u.value==="month"?(a(),i("section",rr,[e("div",ur,[g[3]||(g[3]=e("strong",null,"Nhân viên / Bộ phận",-1)),e("strong",null,"Ca được phân công trong tháng · "+s(t.value.slice(0,7)),1)]),(a(!0),i(H,null,G(P.employees,m=>(a(),i("article",{key:m.code,class:"month-row"},[e("div",dr,[e("strong",null,s(m.name),1),e("small",null,s(m.code),1),e("small",null,s(m.department||"Chưa có bộ phận"),1)]),e("div",cr,[(a(!0),i(H,null,G(n.employeeAssignments(m.code),b=>(a(),i("button",{key:b.id,class:te(["assignment-chip",`shift-tone--${f(b)}`]),title:n.label(b),onClick:K=>c("open",m.code,b.date)},[e("span",vr,s(n.fmt(b.date)),1),e("strong",null,s(n.symbol(b)),1)],10,hr))),128)),n.employeeAssignments(m.code).length?D("",!0):(a(),i("p",mr," Chưa phân công ca trong tháng "))])]))),128))])):u.value==="day"?(a(),i("section",pr,[(a(!0),i(H,null,G(P.employees,m=>(a(),i("article",{key:m.code,class:"panel day-employee"},[e("div",gr,[e("strong",null,s(m.name),1),e("small",null,s(m.code)+" · "+s(m.department||"Chưa có bộ phận"),1)]),e("div",fr,[(a(!0),i(H,null,G(n.employeeAssignments(m.code),b=>(a(),i("button",{key:b.id,title:n.label(b),class:te(["day-assignment",`shift-tone--${f(b)}`]),onClick:K=>c("open",m.code,b.date)},[e("strong",br,s(n.symbol(b)),1)],10,yr))),128)),n.employeeAssignments(m.code).length?D("",!0):(a(),i("div",qr,[g[4]||(g[4]=e("span",null,"Chưa phân công",-1)),n.canCreate?(a(),i("button",{key:0,onClick:b=>c("open",m.code,n.dates[0])}," + Phân công ca ",8,kr)):D("",!0)]))])]))),128))])):(a(),i("section",wr,[e("table",{class:"schedule-grid",style:dn({minWidth:240+n.dates.length*88+"px"})},[e("colgroup",null,[g[5]||(g[5]=e("col",{class:"employee-col"},null,-1)),(a(!0),i(H,null,G(n.dates,m=>(a(),i("col",{key:m}))),128))]),e("thead",null,[e("tr",null,[e("th",null,[g[6]||(g[6]=B(" NHÂN VIÊN",-1)),e("small",null,s(P.employees.length)+" nhân viên",1)]),(a(!0),i(H,null,G(n.dates,m=>(a(),i("th",{key:m,class:te({today:m===n.today,weekend:[0,6].includes(new Date(m+"T12:00:00").getDay())})},[B(s(d[(new Date(m+"T12:00:00").getDay()+6)%7])+" ",1),e("small",null,s(n.fmt(m)),1)],2))),128))])]),e("tbody",null,[(a(!0),i(H,null,G(P.employees,m=>(a(),i("tr",{key:m.code},[e("th",null,[e("strong",null,s(m.name),1),e("small",null,s(m.code)+" · "+s(m.department),1)]),(a(!0),i(H,null,G(n.dates,b=>(a(),i("td",{key:b,class:te({today:b===n.today,weekend:[0,6].includes(new Date(b+"T12:00:00").getDay())})},[n.matches(n.cell(m.code,b))?(a(),i("button",{key:0,class:te(["shift-cell",`shift-tone--${f(n.cell(m.code,b))}`]),title:n.label(n.cell(m.code,b)),disabled:!n.cell(m.code,b)&&!n.canCreate,onClick:K=>c("open",m.code,b)},[e("strong",null,s(v(n.cell(m.code,b))),1)],10,Tr)):(a(),i("span",Cr,"—"))],2))),128))]))),128))])],4)])),u.value==="week"?(a(),i("section",$r,[(a(!0),i(H,null,G(n.dates,m=>(a(),i("article",{key:m,class:"panel"},[e("h3",null,s(n.fmt(m))+" "+s(m===n.today?"· Hôm nay":""),1),(a(!0),i(H,null,G(P.employees.filter(b=>n.matches(n.cell(b.code,m))),b=>(a(),i("button",{key:b.code,class:te(["agenda-assignment",`shift-tone--${f(n.cell(b.code,m))}`]),onClick:K=>c("open",b.code,m)},[e("strong",null,s(n.name(b.code)),1),e("small",null,s(n.label(n.cell(b.code,m)))+" "+s(n.pending(n.cell(b.code,m))?"↔ Chờ đổi ca":""),1)],10,Dr))),128))]))),128))])):D("",!0)]),_:2},1032,["open"]))),128))],64)):(a(),i("div",or," Không tìm thấy nhân viên theo bộ lọc. "))],64))}}),Ir={class:"tabs","aria-label":"Xếp ca"},Sr=Se({__name:"ScheduleModuleNavigation",props:{items:{},activeKey:{}},setup(n){return(r,u)=>{const t=Jn("RouterLink");return a(),i("nav",Ir,[(a(!0),i(H,null,G(n.items,l=>(a(),Te(t,{key:l.key,to:l.key==="calendar"?"/schedules":"/schedules/"+l.key,class:te({active:n.activeKey===l.key})},{default:ce(()=>[B(s(l.label),1)]),_:2},1032,["to","class"]))),128))])}}}),Er=Ve`
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
`;async function xr(n,r){if(!Number.isInteger(n)||n<2e3||n>2100||!Number.isInteger(r)||r<1||r>12)throw new Error("Tháng/năm báo cáo không hợp lệ.");const{data:u}=await Ae.query({query:Er,variables:{nam:n,thang:r},fetchPolicy:"no-cache",errorPolicy:"none"}),t=u==null?void 0:u.baoCaoCaLamViecThang;if(!(t!=null&&t.isResults)||!t.data)throw new Error((t==null?void 0:t.message)||"Không thể tải báo cáo ca làm việc.");return{...t.data,cotNgay:[...t.data.cotNgay||[]].sort((l,c)=>l.ngayTrongThang-c.ngayTrongThang),nhanVien:t.data.nhanVien||[]}}const Vr={class:"monthly-report"},Ar={class:"report-toolbar"},Lr={class:"report-controls"},Pr={key:0,class:"report-status",role:"status"},Or={key:1,class:"report-status error",role:"alert"},Br={class:"report-summary"},Mr={key:0,class:"outline-controls","aria-label":"Hiển thị nhóm bộ phận"},Ur=["disabled"],Fr=["disabled"],Rr={class:"print-heading"},Hr={class:"schedule-sheet"},Kr=["title"],zr={class:"department-heading"},Gr={colspan:"3",scope:"rowgroup",class:"frozen department-label"},jr=["aria-expanded","aria-label","onClick"],Xr={class:"outline-icon","aria-hidden":"true"},Wr={class:"department-title"},Yr={class:"department-count"},Jr=["colspan"],Qr={class:"frozen ordinal"},Zr={class:"frozen employee-code"},_r={class:"frozen employee-name name"},eu={class:"department"},nu={class:"position"},tu=["title","onMouseenter"],lu={key:0},au=["colspan"],ou=Se({__name:"ScheduleReportsTab",setup(n){const r=Yn(),u=C(r.month),t=C(r.year),l=Array.from({length:12},(N,E)=>({value:E+1,label:"Tháng "+(E+1)})),c=Array.from({length:101},(N,E)=>({value:2e3+E,label:String(2e3+E)})),d=C(),v=C(!1),p=C(""),f=C(null),w=C(),g=C(new Set);let P=0;async function m(){const N=++P;v.value=!0,p.value="",d.value=void 0,g.value=new Set;try{const E=await xr(t.value,u.value);N===P&&(d.value=E)}catch(E){N===P&&(p.value=we(E))}finally{N===P&&(v.value=!1)}}re([u,t],m,{immediate:!0}),hn(()=>++P);const b=Z(()=>{var N;return(((N=d.value)==null?void 0:N.nhanVien)||[]).map(E=>({...E,days:new Map((E.cacNgay||[]).map(X=>[X.ngayTrongThang,X.giaTri]))}))}),K=Z(()=>{var E,X;const N=new Map;for(const ie of b.value){const ue=(E=ie.maBoPhan)==null?void 0:E.trim(),me=(X=ie.boPhan)==null?void 0:X.trim(),he=ue?`code:${ue}`:me?`name:${me}`:"unassigned";let De=N.get(he);De||(De={key:he,label:me||ue||"Chưa có bộ phận",employees:[]},N.set(he,De)),De.employees.push(ie)}return[...N.values()]});function z(N){const E=new Set(g.value);E.has(N)?E.delete(N):E.add(N),g.value=E,f.value=null}function k(){g.value=new Set}function S(){g.value=new Set(K.value.map(N=>N.key)),f.value=null}const T=[{key:"al",label:"AL"},{key:"do",label:"DO"},{key:"ph",label:"PH"},{key:"cl",label:"CL"},{key:"ul",label:"UL"},{key:"soNgayCongThucTe",label:"Số ngày công thực tế"},{key:"soNgayCongTieuChuan",label:"Số ngày công tiêu chuẩn"},{key:"soNgayPhep",label:"Số ngày phép"},{key:"soNgayCongHuongLuong",label:"Số ngày công hưởng lương"}];function L(N){return[0,6].includes(new Date(d.value.nam,d.value.thang-1,N).getDay())}function _(){if(!w.value||!d.value||v.value)return;const N=document.createElement("iframe");N.title="In báo cáo ca làm việc",N.style.cssText="position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;",N.onload=()=>{const E=N.contentWindow;if(!E){N.remove();return}E.addEventListener("afterprint",()=>N.remove(),{once:!0}),E.focus(),E.print(),setTimeout(()=>N.remove(),6e4)},N.srcdoc='<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Báo cáo ca làm việc</title><style>@page{size:A3 landscape;margin:10mm}body{font-family:Arial,sans-serif;color:#111}h2{font-size:16px}p{font-size:10px}col{width:auto!important}table{width:100%;border-collapse:collapse;table-layout:auto;font-size:7px}th,td{border:1px solid #777;padding:4px 2px;text-align:center}th{background:#eee}thead{display:table-header-group}tr{break-inside:avoid}.name,.department,.position{text-align:left}small{display:block}.employee-name{min-width:90px}.department-heading th{background:#e2efda;text-align:left}.department-toggle{border:0;background:transparent;font:inherit;color:inherit;text-align:left}.outline-icon{display:none}.department-count{margin-left:8px;font-weight:normal}.employee-row{display:table-row!important}</style></head><body>'+w.value.innerHTML+"</body></html>",document.body.appendChild(N)}return(N,E)=>(a(),i("section",Vr,[e("div",Ar,[E[5]||(E[5]=e("div",null,[e("h2",null,"Báo cáo ca làm việc tháng"),e("p",null,"Chọn tháng và năm để xem lịch và tổng công.")],-1)),e("div",Lr,[e("label",null,[E[3]||(E[3]=B("Tháng",-1)),j(W(Ze),{modelValue:u.value,"onUpdate:modelValue":E[0]||(E[0]=X=>u.value=X),options:W(l),"option-label":"label","option-value":"value"},null,8,["modelValue","options"])]),e("label",null,[E[4]||(E[4]=B("Năm",-1)),j(W(Ze),{modelValue:t.value,"onUpdate:modelValue":E[1]||(E[1]=X=>t.value=X),options:W(c),"option-label":"label","option-value":"value",filter:""},null,8,["modelValue","options"])]),j(ke,{label:"In báo cáo",icon:"pi pi-print",outlined:"",disabled:v.value||!d.value||!b.value.length,onClick:_},null,8,["disabled"])])]),v.value?(a(),i("div",Pr,[E[6]||(E[6]=e("i",{class:"pi pi-spin pi-spinner"},null,-1)),B(" Đang tải báo cáo tháng "+s(u.value)+"/"+s(t.value)+"... ",1)])):p.value?(a(),i("div",Or,[B(s(p.value)+" ",1),j(ke,{label:"Thử lại",text:"",onClick:m})])):d.value?(a(),i(H,{key:2},[e("div",Br,[e("span",null," Tháng "+s(d.value.thang)+"/"+s(d.value.nam)+" · "+s(d.value.soNgayTrongThang)+" ngày · "+s(b.value.length)+" nhân viên · "+s(K.value.length)+" bộ phận ",1),b.value.length?(a(),i("div",Mr,[e("button",{type:"button",disabled:!g.value.size,onClick:k},[...E[7]||(E[7]=[e("i",{class:"pi pi-plus","aria-hidden":"true"},null,-1),B(" Mở tất cả ",-1)])],8,Ur),e("button",{type:"button",disabled:g.value.size===K.value.length,onClick:S},[...E[8]||(E[8]=[e("i",{class:"pi pi-minus","aria-hidden":"true"},null,-1),B(" Thu gọn tất cả ",-1)])],8,Fr)])):D("",!0)]),e("div",{class:"sheet-scroll",onMouseleave:E[2]||(E[2]=X=>f.value=null)},[e("div",{ref_key:"printable",ref:w},[e("div",Rr,[e("h2",null,"Báo cáo ca làm việc tháng "+s(d.value.thang)+"/"+s(d.value.nam),1),e("p",null,s(b.value.length)+" nhân viên",1)]),e("table",Hr,[e("colgroup",null,[E[9]||(E[9]=e("col",{style:{width:"44px"}},null,-1)),E[10]||(E[10]=e("col",{style:{width:"90px"}},null,-1)),E[11]||(E[11]=e("col",{style:{width:"180px"}},null,-1)),E[12]||(E[12]=e("col",{style:{width:"140px"}},null,-1)),E[13]||(E[13]=e("col",{style:{width:"140px"}},null,-1)),(a(!0),i(H,null,G(d.value.cotNgay,X=>(a(),i("col",{key:X.ngayTrongThang,style:{width:"44px"}}))),128)),(a(),i(H,null,G(T,X=>e("col",{key:X.key,style:dn({width:X.key.startsWith("soNgay")?"110px":"56px"})},null,4)),64))]),e("thead",null,[e("tr",null,[E[14]||(E[14]=e("th",{class:"frozen ordinal"},"TT",-1)),E[15]||(E[15]=e("th",{class:"frozen employee-code"},"Mã NV",-1)),E[16]||(E[16]=e("th",{class:"frozen employee-name"},"Họ và tên",-1)),E[17]||(E[17]=e("th",null,"Bộ phận",-1)),E[18]||(E[18]=e("th",null,"Chức vụ",-1)),(a(!0),i(H,null,G(d.value.cotNgay,X=>(a(),i("th",{key:X.ngayTrongThang,title:X.ngay,class:te({weekend:L(X.ngayTrongThang),highlight:f.value===X.ngayTrongThang})},s(String(X.ngayTrongThang).padStart(2,"0")),11,Kr))),128)),(a(),i(H,null,G(T,X=>e("th",{key:X.key,class:"total"},s(X.label),1)),64))])]),(a(!0),i(H,null,G(K.value,X=>(a(),i("tbody",{key:X.key},[e("tr",zr,[e("th",Gr,[e("button",{type:"button",class:"department-toggle","aria-expanded":!g.value.has(X.key),"aria-label":`${g.value.has(X.key)?"Mở":"Thu gọn"} bộ phận ${X.label}`,onClick:ie=>z(X.key)},[e("span",Xr,s(g.value.has(X.key)?"+":"−"),1),e("span",Wr,s(X.label),1),e("span",Yr,s(X.employees.length)+" NV",1)],8,jr)]),e("th",{colspan:2+d.value.cotNgay.length+T.length,class:"department-fill"},null,8,Jr)]),(a(!0),i(H,null,G(X.employees,ie=>ae((a(),i("tr",{key:ie.maNhanVien,class:"employee-row"},[e("td",Qr,s(ie.tt),1),e("td",Zr,s(ie.maNhanVien),1),e("td",_r,s(ie.hoVaTen),1),e("td",eu,s(ie.boPhan||ie.maBoPhan||"—"),1),e("td",nu,s(ie.chucVu||ie.maChucVu||"—"),1),(a(!0),i(H,null,G(d.value.cotNgay,ue=>(a(),i("td",{key:ue.ngayTrongThang,class:te({weekend:L(ue.ngayTrongThang),highlight:f.value===ue.ngayTrongThang}),title:ie.hoVaTen+" · "+ue.ngay+" · "+(ie.days.get(ue.ngayTrongThang)||"Chưa phân công"),onMouseenter:me=>f.value=ue.ngayTrongThang},s(ie.days.get(ue.ngayTrongThang)||""),43,tu))),128)),(a(),i(H,null,G(T,ue=>e("td",{key:ue.key,class:"total"},s(ie[ue.key]??0),1)),64))])),[[hl,!g.value.has(X.key)]])),128))]))),128)),b.value.length?D("",!0):(a(),i("tbody",lu,[e("tr",null,[e("td",{colspan:5+d.value.cotNgay.length+T.length,class:"empty"}," Chưa có dữ liệu báo cáo trong tháng này. ",8,au)])]))])],512)],32)],64)):D("",!0)]))}}),iu=tn(ou,[["__scopeId","data-v-4fb17054"]]),su={class:"panel form"},ru={class:"toolbar"},uu={class:"actions"},du={class:"table-scroll"},cu={class:"report"},hu=["onClick"],vu={key:0},mu=Se({__name:"ScheduleSwapsTab",props:Pe({rows:{},canApprove:{type:Boolean},canCreate:{type:Boolean},assignmentLabel:{type:Function},shiftName:{type:Function}},{tab:{required:!0},tabModifiers:{}}),emits:Pe(["create","detail"],["update:tab"]),setup(n,{emit:r}){const u=de(n,"tab"),t=r,l={PENDING:"Chờ duyệt",APPROVED:"Đã duyệt",REJECTED:"Từ chối",CANCELLED:"Đã hủy"};return(c,d)=>(a(),i("section",su,[e("div",ru,[e("div",uu,[e("button",{class:te({chosen:u.value==="ALL"}),onClick:d[0]||(d[0]=v=>u.value="ALL")},"Yêu cầu",2),n.canApprove?(a(),i("button",{key:0,class:te({chosen:u.value==="PENDING"}),onClick:d[1]||(d[1]=v=>u.value="PENDING")}," Chờ tôi duyệt ",2)):D("",!0),e("button",{class:te({chosen:u.value==="DONE"}),onClick:d[2]||(d[2]=v=>u.value="DONE")},"Đã xử lý",2)]),n.canCreate?(a(),i("button",{key:0,class:"primary",onClick:d[3]||(d[3]=v=>t("create"))},"+ Tạo yêu cầu")):D("",!0)]),e("div",du,[e("table",cu,[d[5]||(d[5]=e("thead",null,[e("tr",null,[e("th",null,"Mã yêu cầu"),e("th",null,"Ca hiện tại"),e("th",null,"Đổi với / ca sau đổi"),e("th",null,"Lý do"),e("th",null,"Ngày gửi"),e("th",null,"Trạng thái"),e("th",null,"Thao tác")])],-1)),e("tbody",null,[(a(!0),i(H,null,G(n.rows,v=>(a(),i("tr",{key:v.id},[e("td",null,s(v.code),1),e("td",null,s(n.assignmentLabel(v.assignmentId)),1),e("td",null,s(v.targetAssignmentId?n.assignmentLabel(v.targetAssignmentId):n.shiftName(v.shiftId)),1),e("td",null,s(v.reason),1),e("td",null,s(new Date(v.createdAt).toLocaleString("vi-VN")),1),e("td",null,s(l[v.status]),1),e("td",null,[e("button",{onClick:p=>t("detail",v)},"Xem",8,hu)])]))),128)),n.rows.length?D("",!0):(a(),i("tr",vu,[...d[4]||(d[4]=[e("td",{colspan:"7",class:"empty-state"},"Không có yêu cầu trong trạng thái này.",-1)])]))])])])]))}}),pu={class:"panel form"},gu={class:"toolbar"},fu={key:0,class:"empty-state"},yu={class:"toolbar"},bu={class:"pattern"},qu={class:"actions"},ku=["onClick"],wu=["onClick"],Tu=["onClick"],Cu=["disabled","onClick"],$u=["onClick"],Du=Se({__name:"ScheduleTemplatesTab",props:{templates:{},shifts:{},departments:{},busy:{type:Boolean},canCreate:{type:Boolean},canEdit:{type:Boolean},canBulk:{type:Boolean}},emits:["create","open","toggle","apply"],setup(n,{emit:r}){const u=r;return(t,l)=>(a(),i("section",pu,[e("div",gu,[l[1]||(l[1]=e("div",null,[e("h2",null,"Mẫu lịch tái sử dụng"),e("p",null,"Mẫu chỉ trở thành lịch thực tế khi được áp dụng.")],-1)),n.canCreate?(a(),i("button",{key:0,class:"primary",onClick:l[0]||(l[0]=c=>u("create"))},"+ Tạo mẫu")):D("",!0)]),n.templates.length?D("",!0):(a(),i("p",fu," Chưa có mẫu lịch. Tạo mẫu để tái sử dụng khi phân công. ")),(a(!0),i(H,null,G(n.templates,c=>(a(),i("article",{key:c.id,class:"template-card"},[e("div",yu,[e("h3",null,s(c.name),1),e("span",null,s(c.active?"Hoạt động":"Ngừng sử dụng"),1)]),e("p",null,s(c.scheduleType==="ADMINISTRATIVE"?"Hành chính":"Xoay ca")+" · "+s(c.department||"Tất cả bộ phận")+" · "+s(c.kind==="WEEK"?"Tuần":"Chu kỳ "+c.days.length+" ngày"),1),e("div",bu,[(a(!0),i(H,null,G(c.days,(d,v)=>{var p;return a(),i("span",{key:v},[e("small",null,s(c.kind==="WEEK"?["T2","T3","T4","T5","T6","T7","CN"][v]:v+1),1),B(" "+s(d==="OFF"?"Nghỉ":(p=n.shifts.find(f=>f.id===d))==null?void 0:p.name),1)])}),128))]),e("div",qu,[e("button",{onClick:d=>u("open",c,!1,!0)},"Xem",8,ku),n.canEdit?(a(),i("button",{key:0,onClick:d=>u("open",c,!1,!1)},"Sửa",8,wu)):D("",!0),n.canCreate?(a(),i("button",{key:1,onClick:d=>u("open",c,!0,!1)},"Nhân bản",8,Tu)):D("",!0),n.canEdit?(a(),i("button",{key:2,disabled:n.busy,onClick:d=>u("toggle",c)},s(c.active?"Ngừng sử dụng":"Kích hoạt"),9,Cu)):D("",!0),c.active&&n.canBulk?(a(),i("button",{key:3,onClick:d=>u("apply",c)}," Áp dụng mẫu ",8,$u)):D("",!0)])]))),128))]))}}),Nu=Se({__name:"AppDialog",setup(n){return(r,u)=>(a(),Te(W(Ue),Et(xt(r.$attrs)),{default:ce(()=>[St(r.$slots,"default")]),_:3},16))}}),It=[{id:"HC",code:"D",name:"Ca D · Hành chính",scheduleType:"ADMINISTRATIVE",startTime:"08:00",endTime:"17:00",crossDay:!1,displayColor:"#2563eb",active:!0},{id:"M",code:"M",name:"Ca sáng",scheduleType:"ROTATING",startTime:"06:00",endTime:"14:00",crossDay:!1,displayColor:"#059669",active:!0},{id:"E",code:"E",name:"Ca chiều",scheduleType:"ROTATING",startTime:"14:00",endTime:"22:00",crossDay:!1,displayColor:"#d97706",active:!0},{id:"N",code:"N",name:"Ca đêm",scheduleType:"ROTATING",startTime:"22:00",endTime:"06:00",crossDay:!0,displayColor:"#7c3aed",active:!0}],Kt="hotel-shift-scheduling-v2";let Je;function In(n){if(!Ot().can("schedules",n))throw new Error("Bạn không có quyền thực hiện thao tác này.")}async function Sn(){if(Je)return Je;const n=localStorage.getItem(Kt);if(n){Je=JSON.parse(n);const u=Je.shifts.find(t=>t.id==="HC"||t.code==="HC");return u&&(u.code="D",u.name="Ca D · Hành chính"),Je}const r=await bl.list("schedules",{page:1,pageSize:1e3,search:"",filters:{},sortField:"date",sortOrder:1});return Je={shifts:structuredClone(It),templates:[],swaps:[],history:[],assignments:r.all.map(u=>{const t=It.find(l=>`${l.startTime}–${l.endTime}`===u.shift||l.code===u.shift);return{id:u.id,employeeId:String(u.employeeId),date:String(u.date),shiftId:(t==null?void 0:t.id)||"",scheduleType:(t==null?void 0:t.scheduleType)||"ROTATING",status:u.shift==="OFF"?"OFF":["AL","SL"].includes(String(u.shift))?"LEAVE":"SCHEDULED",note:String(u.note||""),revision:1}})},Je}function Kn(n){return localStorage.setItem(Kt,JSON.stringify(n)),Je=n,structuredClone(n)}function dt(n,r){const u=[],t=l=>{const c=n.shifts.find(d=>d.id===l.shiftId);if(!(!c||l.status!=="SCHEDULED"))return[Date.parse(`${l.date}T${l.startTime||c.startTime}:00`),Date.parse(`${l.date}T${l.endTime||c.endTime}:00`)+(l.crossDay??c.crossDay?864e5:0)]};return r.forEach((l,c)=>{for(const d of[...n.assignments.filter(v=>v.id!==l.id),...r.slice(0,c)]){if(l.employeeId!==d.employeeId)continue;const v=t(l),p=t(d);(l.date===d.date||v&&p&&v[0]<p[1]&&p[0]<v[1])&&u.push({row:l,existing:d,reason:d.status==="LEAVE"?"Nhân viên đang nghỉ phép":l.date===d.date?"Đã có phân công trong ngày":"Ca chồng lấn thời gian, có thể qua đêm"})}}),u}const En={load:()=>Nn(async()=>(In("view"),structuredClone(await Sn()))),assign:(n,r=[])=>Nn(async()=>{var c;if(In(n.length>1?"bulk":(c=n[0])!=null&&c.id?"edit":"create"),n.some(d=>xe(d.date)))throw new Error("Không được phân công ngày trong quá khứ.");const u=await Sn(),t={...u,shifts:[...u.shifts.filter(d=>!r.some(v=>v.id===d.id)),...r]};if(!n.length)throw new Error("Chưa có phân công để lưu.");if(dt(t,n).length)throw new Error("Lịch có xung đột. Hãy kiểm tra nhân viên, ngày và ca hiện có.");const l=structuredClone(t);for(const d of n){const v=t.assignments.find(f=>f.id===d.id);if(d.id&&(!v||v.revision!==d.revision))throw new Error("Lịch gốc đã thay đổi. Vui lòng tải lại.");if(d.status==="SCHEDULED"&&!t.shifts.some(f=>f.id===d.shiftId&&f.active&&f.scheduleType===d.scheduleType))throw new Error("Ca không hoạt động hoặc không phù hợp loại lịch.");const p={...d,id:d.id||crypto.randomUUID(),revision:((v==null?void 0:v.revision)||0)+1};l.assignments=[...l.assignments.filter(f=>f.id!==p.id),p],l.history.push({assignmentId:p.id,date:new Date().toISOString(),action:v?"Sửa phân công":"Tạo phân công"})}return Kn(l)}),template:n=>Nn(async()=>{In(n.id?"edit":"create");const r=structuredClone(await Sn());if(!n.name.trim()||!n.days.length||n.kind==="WEEK"&&n.days.length!==7)throw new Error("Nhập tên mẫu và cấu hình đầy đủ các ngày.");if(n.days.some(t=>t!=="OFF"&&!r.shifts.some(l=>l.id===t&&l.active&&l.scheduleType===n.scheduleType)))throw new Error("Mẫu có ca không hợp lệ.");const u={...n,id:n.id||crypto.randomUUID()};return r.templates=[...r.templates.filter(t=>t.id!==u.id),u],Kn(r)}),request:n=>Nn(async()=>{In("create");const r=structuredClone(await Sn()),u=r.assignments.find(l=>l.id===n.assignmentId),t=r.assignments.find(l=>l.id===n.targetAssignmentId);if(!u||u.status!=="SCHEDULED"||!n.reason.trim())throw new Error("Chọn ca đã phân công và nhập lý do.");if(n.targetAssignmentId&&(!t||t.employeeId===u.employeeId||t.status!=="SCHEDULED"))throw new Error("Chọn ca của nhân viên khác.");if(!t&&!r.shifts.some(l=>l.id===n.shiftId&&l.active))throw new Error("Chọn ca muốn đổi.");if(r.swaps.some(l=>l.status==="PENDING"&&[l.assignmentId,l.targetAssignmentId].some(c=>c&&[u.id,t==null?void 0:t.id].includes(c))))throw new Error("Ca đã có yêu cầu chờ duyệt.");return r.swaps.push({...n,id:crypto.randomUUID(),code:"DC"+String(r.swaps.length+1).padStart(5,"0"),status:"PENDING",createdAt:new Date().toISOString(),sourceSnapshot:{...u},targetSnapshot:t?{...t}:void 0,sourceRevision:u.revision,targetRevision:(t==null?void 0:t.revision)||0,decision:""}),Kn(r)}),decide:(n,r,u)=>Nn(async()=>{In(r?"approve":"reject");const t=structuredClone(await Sn()),l=t.swaps.find(c=>c.id===n);if(!l||l.status!=="PENDING")throw new Error("Yêu cầu đã xử lý hoặc không tồn tại.");if(!r&&!u.trim())throw new Error("Nhập lý do từ chối.");if(r){const c=t.assignments.find(w=>w.id===l.assignmentId),d=t.assignments.find(w=>w.id===l.targetAssignmentId);if(!c||c.revision!==l.sourceRevision||l.targetAssignmentId&&(!d||d.revision!==l.targetRevision))throw new Error("Lịch gốc đã thay đổi; yêu cầu không còn hợp lệ.");const v=[{...c,shiftId:(d==null?void 0:d.shiftId)||l.shiftId,revision:c.revision+1}];d&&v.push({...d,shiftId:c.shiftId,revision:d.revision+1}),v.forEach(w=>{const g=t.shifts.find(P=>P.id===w.shiftId&&P.active);if(!g)throw new Error("Ca không còn hoạt động.");w.scheduleType=g.scheduleType});const p={...t,assignments:t.assignments.filter(w=>!v.some(g=>g.id===w.id))},f=dt(p,v);if(f.length)throw new Error(f.map(w=>`${w.row.employeeId} · ${w.row.date}: ${w.row.shiftId} xung đột ${w.existing.shiftId} (${w.reason})`).join(`
`));t.assignments=[...p.assignments,...v],v.forEach(w=>t.history.push({assignmentId:w.id,date:new Date().toISOString(),action:"Duyệt đổi ca "+l.code}))}return l.status=r?"APPROVED":"REJECTED",l.decision=u,Kn(t)})};function Iu(n,r,u,t,l){const c=p=>u.scheduleType==="ADMINISTRATIVE"&&new Date(`${p}T12:00:00`).getDay()===0,d=l.filter(p=>!c(p.date)),v=new Set([...t,...d].map(p=>`${p.employeeId}:${p.date}`));for(const p of n)for(const f of r)c(f)||xe(f)||v.has(`${p.code}:${f}`)||(d.push({employeeId:p.code,date:f,shiftId:u.id,fullTime:!0,note:""}),v.add(`${p.code}:${f}`));return d.sort((p,f)=>p.date.localeCompare(f.date))}const Su={class:"shift-module"},Eu={class:"page-heading"},xu={key:0,class:"demo"},Vu={key:1,class:"error",role:"alert"},Au={key:2,role:"status"},Lu={key:0,class:"panel filters"},Pu=["value"],Ou=["value"],Bu={class:"schedule-filter-fields"},Mu=["value"],Uu=["value"],Fu={class:"schedule-filter-search"},Ru={class:"schedule-filter-actions"},Hu={key:2,class:"schedule-calendar-layout"},Ku={class:"department-filter-tree","aria-labelledby":"department-filter-title"},zu={key:0,role:"status"},Gu={key:1,role:"alert",class:"error"},ju=["aria-pressed"],Xu={"aria-label":"Cây bộ phận theo loại lịch"},Wu=["aria-pressed","onClick"],Yu={key:0,open:""},Ju=["aria-pressed","onClick"],Qu={class:"schedule-calendar-pane"},Zu={class:"schedule-filter-toolbar"},_u=["aria-label"],ed={key:0,class:"schedule-filter-count"},pd=Se({__name:"ScheduleListView",setup(n){const r=vl(),u=ml(),t=Ot(),l=vn(),c={all:C([]),loading:C(!1),error:C(""),async load(){c.loading.value=!0,c.error.value="";try{c.all.value=(await yl.list(null)).map(h=>({id:h.maNhanVien,code:h.maNhanVien,name:String(h.hoTen||[h.ho,h.tenDem,h.ten].filter(Boolean).join(" ")),department:String(h.tenBoPhan||""),position:String(h.tenChucVu||""),positionCode:h.maChucVu==null?"":String(h.maChucVu),status:String(h.trangThaiNhanVien??"")}))}catch(h){c.error.value=we(h)}finally{c.loading.value=!1}}};un(()=>c.load());const d={all:C([]),loading:C(!1),error:C(""),async load(){d.loading.value=!0,d.error.value="";try{d.all.value=await pl()}catch(h){d.error.value=we(h)}finally{d.loading.value=!1}}};un(()=>d.load());const v=C([]),p=C([]),f=C(!1),w=C("");let g=0;async function P(){const h=++g;f.value=!0,w.value="";try{const o=await gl(d.all.value);if(h!==g)return;v.value=o.groups,p.value=o.unavailable}catch(o){h===g&&(w.value=we(o))}finally{h===g&&(f.value=!1)}}re(()=>d.all.value,()=>{P()});const m=C({shifts:[],assignments:[],templates:[],swaps:[],history:[]}),b=C([]),K=C(!1),z=C(!1),k=C(""),S=C(!1),T=[{key:"assign",label:"Phân công ca"},{key:"reports",label:"Báo cáo lịch làm việc"}],L=Z(()=>String(r.meta.schedulePage||"assign")),_=Z(()=>{var h;return L.value==="exchange"?"Đổi ca":L.value==="leave-calendar"?"Lịch nghỉ phép":(h=T.find(o=>o.key===L.value))==null?void 0:h.label});function N(h){return`${h.getFullYear()}-${String(h.getMonth()+1).padStart(2,"0")}-${String(h.getDate()).padStart(2,"0")}`}const E=N(new Date),X=C(E),ie=C("week");function ue(h,o){const F=[],R=new Date(h+"T12:00:00");for(;N(R)<=o&&F.length<367;)F.push(N(R)),R.setDate(R.getDate()+1);return F}const me=Z(()=>Qn(X.value,ie.value)),he=Z(()=>ue(me.value.from,me.value.to));function De(h){const o=new Date(X.value+"T12:00:00");ie.value==="month"?(o.setDate(1),o.setMonth(o.getMonth()+h)):o.setDate(o.getDate()+h*(ie.value==="week"?7:1)),X.value=N(o)}function $e(h){return new Date(h+"T12:00:00").toLocaleDateString("vi-VN")}const ve=C(""),O=C(""),M=C(""),ee=C(""),se=C(""),pe=C(""),J=C(!1),ge=At({employee:"",type:"",shiftFilter:"",status:"",search:""}),Ye=Z(()=>[ve.value,O.value,M.value,ee.value,se.value,pe.value].filter(h=>h.trim()).length);function mn(){Object.assign(ge,{employee:O.value,type:M.value,shiftFilter:ee.value,status:se.value,search:pe.value}),J.value=!0}function ln(){O.value=ge.employee,M.value=ge.type,ee.value=ge.shiftFilter,se.value=ge.status,pe.value=ge.search.trim(),J.value=!1}function je(){ve.value="",O.value="",M.value="",ee.value="",se.value="",pe.value="",Object.assign(ge,{employee:"",type:"",shiftFilter:"",status:"",search:""}),J.value=!1}const U=Z(()=>d.all.value.map(h=>h.name)),I=Z(()=>c.all.value.filter(h=>(!ve.value||h.department===ve.value)&&(!O.value||h.code===O.value)&&`${h.code} ${h.name}`.toLocaleLowerCase().includes(pe.value.toLocaleLowerCase())));function q(h){const o=c.all.value.find(F=>F.code===h);return o?`${o.code} · ${o.name}`:h}function $(h){var o;return((o=c.all.value.find(F=>F.code===h))==null?void 0:o.name)||h}function x(h){if(h==="OFF")return"Nghỉ";const o=m.value.shifts.find(F=>F.id===h);return o?`${o.name} · ${o.startTime}–${o.endTime}${o.crossDay?" (+1 ngày)":""}`:"⚠ Ca chưa có trong danh mục"}function V(h){return m.value.assignments.filter(o=>o.employeeId===h&&he.value.includes(o.date)&&le(o)).sort((o,F)=>o.date.localeCompare(F.date)||(o.startTime||"").localeCompare(F.startTime||""))}function A(h){var o;return h.shiftSymbol||((o=m.value.shifts.find(F=>F.id===h.shiftId))==null?void 0:o.code)||h.shiftId}function Q(h,o){return m.value.assignments.find(F=>F.employeeId===h&&F.date===o)}function ne(h){var o;return h?h.status==="OFF"?"Nghỉ":h.status==="LEAVE"?"Nghỉ phép":(h.startTime&&h.endTime?`${h.shiftName||((o=m.value.shifts.find(F=>F.id===h.shiftId))==null?void 0:o.name)||h.shiftId} · ${h.startTime}–${h.endTime}${h.crossDay?" (+1 ngày)":""}`:x(h.shiftId))+(h.fullTime===!1?" · 1/2 ca":" · Cả ca"):"Chưa phân công"}function le(h){return(!M.value||(h==null?void 0:h.scheduleType)===M.value)&&(!ee.value||(h==null?void 0:h.shiftId)===ee.value)&&(!se.value||((h==null?void 0:h.status)||"UNASSIGNED")===se.value)}const Ke=Z(()=>I.value.filter(h=>he.value.some(o=>le(Q(h.code,o))))),Ee=h=>!!h&&m.value.swaps.some(o=>o.status==="PENDING"&&[o.assignmentId,o.targetAssignmentId].includes(h.id));let Oe=0;async function Re(){const h=++Oe;if(L.value==="exchange"||L.value==="leave-calendar"){K.value=!1,k.value="";return}K.value=!0,k.value="";try{if(L.value==="calendar"){const o=await zn(me.value.from,me.value.to);if(h!==Oe)return;m.value={...m.value,...o}}else if(L.value==="assign"){const o=await zn(nn.value.start,nn.value.end);if(h!==Oe)return;m.value={...m.value,...o}}else{const o=await En.load();if(h!==Oe)return;m.value=o}}catch(o){h===Oe&&(k.value=we(o))}finally{h===Oe&&(K.value=!1)}}un(Re);let ze=0;async function Zn(){if(L.value!=="assign")return;const h=++ze,{start:o,end:F}=lt.value;try{const R=await Ll(o,F);h===ze&&L.value==="assign"&&(b.value=R)}catch(R){h===ze&&(k.value=we(R))}}un(Zn),re([L,()=>me.value.from,()=>me.value.to],([h])=>{h==="calendar"&&Re()}),re(L,()=>{L.value!=="calendar"&&Re()});async function An(h){if(z.value)return!1;z.value=!0,k.value="";try{return m.value=await h(),S.value=!1,l.success("success"),!0}catch(o){return k.value=we(o),!1}finally{z.value=!1}}Lt(()=>!S.value||window.confirm("Có thay đổi chưa lưu. Bạn muốn rời màn hình?")),Pt(()=>!S.value||window.confirm("Có thay đổi chưa lưu. Bạn muốn rời màn hình?"));const vt=h=>{S.value&&h.preventDefault()};window.addEventListener("beforeunload",vt),hn(()=>window.removeEventListener("beforeunload",vt));const an=C();function mt(h){z.value||!t.can("schedules","edit")||(an.value={...h,scheduleType:ye.value})}async function zt(){an.value=void 0,await on()}const Ln=C(),_n=C(!1),pt=C(!1);function Gt(h,o){Q(h,o)||t.can("schedules","create")&&u.push({path:"/schedules/assign",query:{employee:h,date:o}})}const _e=C(!1),fe=C(""),Be=C([]),et=C(""),ye=C("ROTATING"),He=C(E),en=C(E),pn=C(""),Le=C("calendar"),gn=C(Array(7).fill("OFF")),fn=C(""),nt=C(""),be=C(),Me=C([]),yn=C(!1),Ce=C([]),Ge=C([]),bn=C(!1),Pn=C("");let qn=0;async function tt(){var F,R;const h=++qn;bn.value=!0,Pn.value="",Ge.value=[];const o=((F=d.all.value.find(Y=>Y.name===fe.value))==null?void 0:F.code)||null;if(!o){bn.value=!1;return}try{const[Y,y]=await Promise.all([Gn(o,ye.value),zn(nn.value.start,nn.value.end)]);if(h!==qn)return;m.value.assignments=y.assignments,Ge.value=Y.filter(Ne=>Ne.workType!=="0"),be.value||(ye.value=((R=Y[0])==null?void 0:R.scheduleType)||"ROTATING"),m.value.shifts=[...m.value.shifts.filter(Ne=>!Y.some(qe=>qe.id===Ne.id)),...Y],!be.value&&ye.value==="ADMINISTRATIVE"&&wn()}catch(Y){h===qn&&(Pn.value=we(Y))}finally{h===qn&&(bn.value=!1)}}async function jt(h){var Ne;if(z.value||!t.can("schedules","create"))throw new Error("Bạn không có quyền tạo phân công ca hoặc hệ thống đang bận.");if(xe(h.date))throw new Error("Không được phân công ngày trong quá khứ.");const o=(Ne=d.all.value.find(qe=>qe.name===fe.value))==null?void 0:Ne.code,F=b.value.find(qe=>qe.maNhanVien===h.employeeId),R=c.all.value.find(qe=>qe.code===h.employeeId),Y=Ge.value.find(qe=>qe.id===h.shiftId&&qe.active&&qe.workType!=="0");if(!o||!On.value.some(qe=>qe.code===h.employeeId)||!Y)throw new Error("Nhân viên, bộ phận hoặc ca làm việc không hợp lệ.");if(m.value.assignments.some(qe=>qe.employeeId===h.employeeId&&qe.date===h.date))throw new Error("Nhân viên đã có phân công trong ngày này. Vui lòng tải lại lịch.");const y={maBoPhan:o,maChucVu:(F==null?void 0:F.maChucVu)||(R!=null&&R.positionCode?String(R.positionCode):null),maNhanVien:h.employeeId,ngayLamViec:h.date+"T00:00:00+07:00",maCa:h.shiftId,gioBatDau:h.startTime?Xn(h.startTime):null,gioKetThuc:h.endTime?Xn(h.endTime):null,ghiChu:h.note.trim()||null};z.value=!0;try{const qe=await Pl(y);Ce.value=Ce.value.filter(Dn=>Dn.employeeId!==h.employeeId||Dn.date!==h.date),l.success(qe.message||"Tạo phân công ca thành công."),await on()}finally{z.value=!1}}async function on(){await tt(),await Zn()}re(fe,()=>{++qn,Ge.value=[],bn.value=!1,Pn.value="",be.value||(Ce.value=[])}),re(Ce,()=>{S.value=!0,Me.value=[]},{deep:!0});const On=Z(()=>{var F;const h=((F=d.all.value.find(R=>R.name===fe.value))==null?void 0:F.code)||"",o=b.value.filter(R=>!fe.value||R.maBoPhan===h||R.tenBoPhan===fe.value).map(R=>({code:R.maNhanVien,name:R.hoTen,department:R.tenBoPhan||""}));for(const R of c.all.value.filter(Y=>Y.department===fe.value))o.some(Y=>Y.code===R.code)||o.push({code:R.code,name:R.name,department:String(R.department||"")});return o}),Xt=Z(()=>(be.value?c.all.value.filter(o=>{var F;return o.code===((F=be.value)==null?void 0:F.employeeId)}).map(o=>({code:o.code,name:o.name,department:String(o.department||"")})):On.value).filter(o=>`${o.code} ${o.name}`.toLowerCase().includes(et.value.toLowerCase())));function gt(){var h;return((h=Ge.value[0])==null?void 0:h.scheduleType)||"ROTATING"}const ft=Z(()=>Ge.value.filter(h=>h.active&&h.scheduleType===ye.value)),sn=C("week"),kn=C(E),nn=Z(()=>{const h=new Date(kn.value+"T12:00:00");sn.value==="week"?h.setDate(h.getDate()-(h.getDay()+6)%7):h.setDate(1);const o=new Date(h);return sn.value==="week"?o.setDate(o.getDate()+6):o.setMonth(o.getMonth()+1,0),{start:N(h),end:N(o)}}),lt=Z(()=>nn.value);re([L,()=>lt.value.start,()=>lt.value.end],([h])=>{h==="assign"&&Zn()});function wn(h=!1){const o=Ge.value.find(R=>R.active&&R.scheduleType==="ADMINISTRATIVE");if(!fe.value||!o){h&&(Ce.value=[]);return}const F=On.value;Ce.value=Iu(F,ue(nn.value.start,nn.value.end),o,m.value.assignments,h?[]:Ce.value).filter(R=>!b.value.some(Y=>Y.maNhanVien===R.employeeId&&Y.danhSachNgayXepCa.includes(R.date)))}re([Be,ye,He,en,pn,Le,gn,fn,nt,_e],()=>{S.value=!0,Me.value=[]},{deep:!0}),re(ye,()=>{pn.value="",fn.value="",gn.value=Array(7).fill("OFF"),be.value||(ye.value==="ADMINISTRATIVE"?wn(!0):Ce.value=[])}),re(fe,()=>{be.value||(Be.value=[]),fn.value="",be.value||(ye.value=gt()),!be.value&&ye.value==="ADMINISTRATIVE"&&wn(!0)}),re([fe,sn,kn,()=>d.all.value],()=>{L.value==="assign"&&fe.value&&tt()}),re(()=>b.value,()=>{!be.value&&ye.value==="ADMINISTRATIVE"&&wn()});const Wt=Z(()=>b.value.map(h=>({employeeId:h.maNhanVien,dates:h.danhSachNgayXepCa})));function at(){var o,F;be.value=void 0,Ce.value=[],Le.value="calendar",_e.value=!1,fe.value="",ye.value="ROTATING",Be.value=r.query.employee?[String(r.query.employee)]:[],He.value=String(r.query.date||E),en.value=He.value,sn.value="week",kn.value=He.value;const h=m.value.assignments.find(R=>R.id===r.query.edit);if(h)be.value=h,Be.value=[h.employeeId],fe.value=String(((o=c.all.value.find(R=>R.code===h.employeeId))==null?void 0:o.department)||""),ye.value=h.scheduleType,He.value=en.value=h.date,nt.value=h.note,setTimeout(()=>{pn.value=h.status==="OFF"?"OFF":h.shiftId,Ce.value=[{employeeId:h.employeeId,date:h.date,shiftId:pn.value,fullTime:h.fullTime!==!1,note:h.note,startTime:h.startTime,endTime:h.endTime,crossDay:h.crossDay}],S.value=!1},0);else if(Be.value.length){const R=Be.value[0];fe.value=String(((F=c.all.value.find(Y=>Y.code===R))==null?void 0:F.department)||""),ye.value=gt(),setTimeout(()=>{Be.value=[R],S.value=!1},0)}!h&&ye.value==="ADMINISTRATIVE"&&fe.value&&wn(),setTimeout(()=>{S.value=!1},0)}re(()=>r.fullPath,at),re(()=>m.value.assignments.length,()=>{r.query.edit&&!be.value&&at()}),un(at);function Yt(){if(be.value){mt(be.value);return}if(k.value="",Le.value==="calendar"?Ce.value.some(F=>xe(F.date)):xe(He.value)){k.value="Không được phân công ngày trong quá khứ.";return}if(Le.value==="calendar"&&ye.value==="ADMINISTRATIVE"&&Ce.value.some(F=>new Date(`${F.date}T12:00:00`).getDay()===0)){k.value="Không phân công ca hành chính vào Chủ nhật.";return}if(!fe.value){k.value="Chọn bộ phận để xác định loại lịch phân công.";return}if(Le.value!=="calendar"&&(!Be.value.length||!_e.value&&Be.value.length!==1)){k.value="Chọn nhân viên cần phân công.";return}if(!He.value||!en.value||He.value>en.value||ue(He.value,en.value).length>366){k.value="Khoảng ngày không hợp lệ (tối đa 366 ngày mỗi lần).";return}if(Le.value==="calendar"){if(!Ce.value.length){k.value="Chọn ít nhất một ngày trên lịch và ca cho ngày đó.";return}if(Ce.value.some(R=>!On.value.some(Y=>Y.code===R.employeeId))){k.value="Nhân viên trong phân công không còn tồn tại.";return}const F=Ce.value.map(R=>{var Y,y;return{id:((Y=be.value)==null?void 0:Y.id)||"",employeeId:R.employeeId,date:R.date,shiftId:R.shiftId==="OFF"?"":R.shiftId,scheduleType:ye.value,status:R.shiftId==="OFF"?"OFF":"SCHEDULED",note:R.note,fullTime:R.fullTime,leaveTypeId:R.leaveTypeId,startTime:R.startTime,endTime:R.endTime,crossDay:R.crossDay,revision:((y=be.value)==null?void 0:y.revision)||0}});if(F.some(R=>R.status==="SCHEDULED"&&!ft.value.some(Y=>Y.id===R.shiftId))){k.value="Ca đã chọn không còn hoạt động hoặc không phù hợp loại lịch. Chọn lại ca.";return}bt(F);return}const h=m.value.templates.find(F=>F.id===fn.value&&F.active);if(Le.value==="template"&&!h){k.value="Chọn mẫu đang hoạt động.";return}const o=[];for(const F of Be.value)ue(He.value,en.value).forEach((R,Y)=>{var qe,Dn;const y=(new Date(R+"T12:00:00").getDay()+6)%7;if(ye.value==="ADMINISTRATIVE"&&y===6)return;const Ne=Le.value==="template"&&h?h.days[h.kind==="WEEK"?y:Y%h.days.length]:Le.value==="weekly"?gn.value[y]:Le.value==="cycle"?gn.value[Y%gn.value.length]:pn.value;o.push({id:((qe=be.value)==null?void 0:qe.id)||"",employeeId:F,date:R,shiftId:Ne==="OFF"?"":Ne,scheduleType:ye.value,status:Ne==="OFF"?"OFF":"SCHEDULED",note:nt.value,revision:((Dn=be.value)==null?void 0:Dn.revision)||0})});if(!o.length||o.some(F=>F.status==="SCHEDULED"&&!ft.value.some(R=>R.id===F.shiftId))){k.value="Chọn ca hợp lệ và ít nhất một ngày áp dụng.";return}bt(o)}const yt=Z(()=>dt(m.value,Me.value));function bt(h){Me.value=h.map(o=>{const F=Ge.value.find(Y=>Y.id===o.shiftId);if(!F)return o;const R=new Date(`${o.date}T12:00:00Z`);return F.crossDay&&R.setUTCDate(R.getUTCDate()+1),{...o,startTime:o.startTime||F.startTime,endTime:o.endTime||F.endTime,startDate:o.date,endDate:R.toISOString().slice(0,10),crossDay:F.crossDay}}),yn.value=!0}async function Jt(){if(!(z.value||yt.value.length||!Me.value.length)){if(!t.can("schedules",Me.value.length>1?"bulk":"create")){k.value="Bạn không có quyền tạo phân công này.";return}if(Me.value.some(h=>xe(h.date))){k.value="Không được phân công ngày trong quá khứ.";return}z.value=!0,k.value="";try{const h=d.all.value.find(R=>R.name===fe.value),o=kl(Me.value,Ge.value,(h==null?void 0:h.code)||"",b.value.filter(R=>R.maBoPhan===(h==null?void 0:h.code)||R.tenBoPhan===fe.value).map(R=>({code:R.maNhanVien,positionCode:R.maChucVu})));console.log("Saving assignments:",o);const F=await wl(o);if(F.thatBai>0){k.value=`Đã lưu ${F.thanhCong}/${F.tongSo}. ${F.thatBai} phân công thất bại. `+F.loi.map(Y=>`${Y.maNhanVien} · ${We(Y.ngayLamViec)}: ${we(Y)}`).join(`
`),l.error(k.value);const R=new Set(F.loi.map(Y=>`${Y.maNhanVien}:${We(Y.ngayLamViec)}`));Me.value=Me.value.filter(Y=>R.has(`${Y.employeeId}:${Y.date}`)),Ce.value=Ce.value.filter(Y=>R.has(`${Y.employeeId}:${Y.date}`)),await on();return}Ce.value=[],S.value=!1,yn.value=!1,l.success(`Đã lưu ${F.thanhCong} phân công ca.`),await on(),await u.push("/schedules"),await Re()}catch(h){l.error(h),k.value=we(h)}finally{z.value=!1}}}function Qt(){Ln.value&&(_n.value=!1,u.push({path:"/schedules/assign",query:{edit:Ln.value.id}}))}const Tn=C(!1),Bn=C(!1),rn=C({id:"",name:"",scheduleType:"ROTATING",department:"",active:!0,kind:"WEEK",days:Array(7).fill("OFF"),note:""});function qt(h,o=!1,F=!1){rn.value=h?{...h,id:o?"":h.id,name:h.name+(o?" (bản sao)":""),days:[...h.days]}:{id:"",name:"",scheduleType:"ROTATING",department:"",active:!0,kind:"WEEK",days:Array(7).fill("OFF"),note:""},Bn.value=F,Tn.value=!0}async function Zt(){await An(()=>En.template({...rn.value,days:[...rn.value.days]}))&&(Tn.value=!1)}async function _t(h){await u.push("/schedules/assign"),_e.value=!0,ye.value=h.scheduleType,fe.value=h.department,Le.value="template",setTimeout(()=>{fn.value=h.id},0)}const Cn=C(!1),Mn=C("ALL"),$n=C({assignmentId:"",targetAssignmentId:"",shiftId:"",reason:""}),kt=C("employee"),Un=C(),Fn=C(!1),Rn=C(""),el=Z(()=>m.value.swaps.filter(h=>Mn.value==="ALL"||(Mn.value==="DONE"?h.status!=="PENDING":h.status==="PENDING"))),nl=Z(()=>m.value.assignments.filter(h=>h.status==="SCHEDULED"));function wt(h){const o=m.value.assignments.find(F=>F.id===h);return o?`${q(o.employeeId)} · ${$e(o.date)} · ${ne(o)}`:"Lịch không còn tồn tại"}const tl=C([]),Tt=C(!1);function Hn(h,o=!1){return(o?h.targetSnapshot:h.sourceSnapshot)||m.value.assignments.find(F=>F.id===(o?h.targetAssignmentId:h.assignmentId))}function ll(h,o=!1){const F=Hn(h,o);return F?`${q(F.employeeId)} · ${$e(F.date)} · ${ne(F)}`:"Lịch không còn tồn tại"}re(rn,()=>{Tn.value&&!Bn.value&&(S.value=!0)},{deep:!0}),re($n,()=>{Cn.value&&(S.value=!0)},{deep:!0});function al(h,o=!1){var Y,y;const F=Hn(h,o),R=o?(Y=Hn(h))==null?void 0:Y.shiftId:h.targetAssignmentId?(y=Hn(h,!0))==null?void 0:y.shiftId:h.shiftId;return F?`${q(F.employeeId)} · ${$e(F.date)} · ${x(R||"")}`:"Lịch không còn tồn tại"}async function ol(){await An(()=>En.request({...$n.value}))&&(Cn.value=!1)}async function il(h){const o=Un.value;o&&await An(()=>En.decide(o.id,h,Rn.value))&&(Fn.value=!1)}return(h,o)=>{var R,Y;const F=Jn("RouterLink");return a(),i("div",Su,[e("div",Eu,[e("div",null,[o[50]||(o[50]=e("div",{class:"eyebrow"},"VẬN HÀNH KHÁCH SẠN / XẾP CA",-1)),e("h1",null,s(_.value),1),o[51]||(o[51]=e("p",null,"Quản lý lịch hành chính và ca xoay của đội ngũ khách sạn",-1))]),L.value==="calendar"&&W(t).can("schedules","create")?(a(),Te(F,{key:0,class:"primary",to:"/schedules/assign"},{default:ce(()=>[...o[52]||(o[52]=[B(" + Phân công ca ",-1)])]),_:1})):D("",!0)]),j(Sr,{items:T,"active-key":L.value==="exchange"||L.value==="leave-calendar"?"assign":L.value},null,8,["active-key"]),L.value==="templates"||L.value==="swaps"?(a(),i("p",xu," ⓘ Chế độ demo · Dữ liệu lưu trên trình duyệt. API xếp ca thật chưa được cung cấp. ")):D("",!0),k.value||c.error.value||d.error.value?(a(),i("p",Vu,[B(s(k.value||c.error.value||d.error.value)+" ",1),e("button",{onClick:o[0]||(o[0]=y=>{Re(),c.load(),d.load()})}," Tải lại dữ liệu ")])):D("",!0),K.value||c.loading.value||d.loading.value?(a(),i("p",Au," Đang tải dữ liệu xếp ca… ")):(a(),i(H,{key:3},[L.value==="reports"?(a(),i("section",Lu,[e("label",null,[o[54]||(o[54]=B("Bộ phận",-1)),ae(e("select",{"onUpdate:modelValue":o[1]||(o[1]=y=>ve.value=y)},[o[53]||(o[53]=e("option",{value:""},"Tất cả bộ phận",-1)),(a(!0),i(H,null,G(U.value,y=>(a(),i("option",{key:y},s(y),1))),128))],512),[[Ie,ve.value]])]),e("label",null,[o[56]||(o[56]=B("Nhân viên",-1)),ae(e("select",{"onUpdate:modelValue":o[2]||(o[2]=y=>O.value=y)},[o[55]||(o[55]=e("option",{value:""},"Tất cả nhân viên",-1)),(a(!0),i(H,null,G(c.all.value,y=>(a(),i("option",{key:y.code,value:y.code},s(q(y.code)),9,Pu))),128))],512),[[Ie,O.value]])]),e("label",null,[o[58]||(o[58]=B("Loại lịch",-1)),ae(e("select",{"onUpdate:modelValue":o[3]||(o[3]=y=>M.value=y)},[...o[57]||(o[57]=[e("option",{value:""},"Tất cả",-1),e("option",{value:"ADMINISTRATIVE"},"Hành chính",-1),e("option",{value:"ROTATING"},"Xoay ca",-1)])],512),[[Ie,M.value]])]),e("label",null,[o[60]||(o[60]=B("Ca",-1)),ae(e("select",{"onUpdate:modelValue":o[4]||(o[4]=y=>ee.value=y)},[o[59]||(o[59]=e("option",{value:""},"Tất cả ca",-1)),(a(!0),i(H,null,G(m.value.shifts,y=>(a(),i("option",{key:y.id,value:y.id},s(y.name),9,Ou))),128))],512),[[Ie,ee.value]])]),e("label",null,[o[61]||(o[61]=B("Tìm kiếm",-1)),ae(e("input",{"onUpdate:modelValue":o[5]||(o[5]=y=>pe.value=y),placeholder:"Mã NV hoặc họ tên"},null,512),[[Xe,pe.value]])])])):D("",!0),L.value==="calendar"?(a(),Te(Nu,{key:1,visible:J.value,"onUpdate:visible":o[12]||(o[12]=y=>J.value=y),modal:"",header:"Bộ lọc lịch phân công",style:{width:"min(680px, 94vw)"},class:"schedule-filter-dialog"},{footer:ce(()=>[e("button",{type:"button",class:"schedule-filter-clear",onClick:je},[...o[71]||(o[71]=[e("i",{class:"pi pi-filter-slash","aria-hidden":"true"},null,-1),B(" Xóa bộ lọc ",-1)])]),e("div",Ru,[e("button",{type:"button",onClick:o[11]||(o[11]=y=>J.value=!1)},"Hủy"),e("button",{type:"button",class:"schedule-filter-apply",onClick:ln}," Áp dụng ")])]),default:ce(()=>[e("div",Bu,[e("label",null,[o[63]||(o[63]=B("Nhân viên",-1)),ae(e("select",{"onUpdate:modelValue":o[6]||(o[6]=y=>ge.employee=y)},[o[62]||(o[62]=e("option",{value:""},"Tất cả nhân viên",-1)),(a(!0),i(H,null,G(c.all.value,y=>(a(),i("option",{key:y.code,value:y.code},s(q(y.code)),9,Mu))),128))],512),[[Ie,ge.employee]])]),e("label",null,[o[65]||(o[65]=B("Loại lịch",-1)),ae(e("select",{"onUpdate:modelValue":o[7]||(o[7]=y=>ge.type=y)},[...o[64]||(o[64]=[e("option",{value:""},"Tất cả loại lịch",-1),e("option",{value:"ADMINISTRATIVE"},"Hành chính",-1),e("option",{value:"ROTATING"},"Xoay ca",-1)])],512),[[Ie,ge.type]])]),e("label",null,[o[67]||(o[67]=B("Ca",-1)),ae(e("select",{"onUpdate:modelValue":o[8]||(o[8]=y=>ge.shiftFilter=y)},[o[66]||(o[66]=e("option",{value:""},"Tất cả ca",-1)),(a(!0),i(H,null,G(m.value.shifts,y=>(a(),i("option",{key:y.id,value:y.id},s(y.name),9,Uu))),128))],512),[[Ie,ge.shiftFilter]])]),e("label",null,[o[69]||(o[69]=B("Trạng thái",-1)),ae(e("select",{"onUpdate:modelValue":o[9]||(o[9]=y=>ge.status=y)},[...o[68]||(o[68]=[e("option",{value:""},"Tất cả trạng thái",-1),e("option",{value:"SCHEDULED"},"Đã xếp",-1),e("option",{value:"UNASSIGNED"},"Chưa xếp",-1),e("option",{value:"OFF"},"Nghỉ",-1),e("option",{value:"LEAVE"},"Nghỉ phép",-1)])],512),[[Ie,ge.status]])]),e("label",Fu,[o[70]||(o[70]=B("Tìm kiếm",-1)),ae(e("input",{"onUpdate:modelValue":o[10]||(o[10]=y=>ge.search=y),placeholder:"Mã NV hoặc họ tên",type:"search"},null,512),[[Xe,ge.search]])])])]),_:1},8,["visible"])):D("",!0),L.value==="calendar"?(a(),i("div",Hu,[e("aside",Ku,[o[73]||(o[73]=e("h2",{id:"department-filter-title"},"Bộ phận",-1)),f.value?(a(),i("p",zu,"Đang tải cây bộ phận…")):D("",!0),w.value?(a(),i("p",Gu,[B(s(w.value)+" ",1),e("button",{type:"button",onClick:P},"Tải lại")])):D("",!0),e("button",{type:"button",class:te(["department-filter-all",{selected:!ve.value}]),"aria-pressed":!ve.value,onClick:o[13]||(o[13]=y=>ve.value="")}," Tất cả bộ phận ",10,ju),e("nav",Xu,[(a(!0),i(H,null,G(v.value,y=>(a(),i("details",{key:y.type,open:""},[e("summary",null,[B(s(y.label)+" ",1),e("small",null,s(y.departments.length),1)]),(a(!0),i(H,null,G(y.departments,Ne=>(a(),i("button",{key:Ne.code,type:"button",class:te({selected:ve.value===Ne.name}),"aria-pressed":ve.value===Ne.name,onClick:qe=>ve.value=Ne.name},[e("span",null,s(Ne.name),1),e("small",null,s(Ne.code),1)],10,Wu))),128))]))),128)),p.value.length?(a(),i("details",Yu,[e("summary",null,[o[72]||(o[72]=B(" Chưa phân loại ",-1)),e("small",null,s(p.value.length),1)]),(a(!0),i(H,null,G(p.value,y=>(a(),i("button",{key:y.code,type:"button",class:te({selected:ve.value===y.name}),"aria-pressed":ve.value===y.name,onClick:Ne=>ve.value=y.name},[e("span",null,s(y.name),1),e("small",null,s(y.code),1)],10,Ju))),128))])):D("",!0)])]),e("div",Qu,[e("div",Zu,[e("button",{type:"button",class:"schedule-filter-launcher","aria-label":`Mở bộ lọc lịch${Ye.value?`, ${Ye.value} mục đang áp dụng`:""}`,onClick:mn},[o[74]||(o[74]=e("i",{class:"pi pi-filter","aria-hidden":"true"},null,-1)),o[75]||(o[75]=e("span",null,"Bộ lọc",-1)),Ye.value?(a(),i("span",ed,s(Ye.value),1)):D("",!0)],8,_u)]),j(Nr,{view:ie.value,"onUpdate:view":o[14]||(o[14]=y=>ie.value=y),anchor:X.value,"onUpdate:anchor":o[15]||(o[15]=y=>X.value=y),employees:c.all.value.map(y=>({code:y.code,name:y.name,department:String(y.department||"")})),"visible-employees":Ke.value.map(y=>({code:y.code,name:y.name,department:String(y.department||"")})),"group-by-department":!ve.value,dates:he.value,today:W(E),shifts:m.value.shifts,"can-create":W(t).can("schedules","create"),"employee-assignments":V,cell:Q,matches:le,fmt:$e,name:q,"shift-name":x,symbol:A,label:ne,pending:Ee,onMove:De,onOpen:Gt},null,8,["view","anchor","employees","visible-employees","group-by-department","dates","today","shifts","can-create"])])])):D("",!0),L.value==="exchange"||L.value==="leave-calendar"?(a(),Te(xo,{key:3,mode:L.value==="exchange"?"exchange":"leave",employees:c.all.value,departments:d.all.value,"can-edit":W(t).can("schedules","edit")},null,8,["mode","employees","departments","can-edit"])):D("",!0),L.value==="assign"?(a(),Te(er,{key:4,onReload:on,bulk:_e.value,"onUpdate:bulk":o[16]||(o[16]=y=>_e.value=y),selected:Be.value,"onUpdate:selected":o[17]||(o[17]=y=>Be.value=y),"form-department":fe.value,"onUpdate:formDepartment":o[18]||(o[18]=y=>fe.value=y),"form-search":et.value,"onUpdate:formSearch":o[19]||(o[19]=y=>et.value=y),"schedule-type":ye.value,"onUpdate:scheduleType":o[20]||(o[20]=y=>ye.value=y),method:Le.value,"onUpdate:method":o[21]||(o[21]=y=>Le.value=y),"day-plans":Ce.value,"onUpdate:dayPlans":o[22]||(o[22]=y=>Ce.value=y),"calendar-mode":sn.value,"onUpdate:calendarMode":o[23]||(o[23]=y=>sn.value=y),"calendar-anchor":kn.value,"onUpdate:calendarAnchor":o[24]||(o[24]=y=>kn.value=y),editing:be.value,busy:z.value,"can-create":W(t).can("schedules","create"),"can-edit":W(t).can("schedules",be.value?"edit":_e.value?"bulk":"create"),"can-update":W(t).can("schedules","edit"),"can-bulk":W(t).can("schedules","bulk"),"tree-loading":f.value,"tree-error":w.value,"department-groups":v.value,"unclassified-departments":p.value,"load-department-tree":P,"shifts-loading":bn.value,"shifts-error":Pn.value,"load-manual-shifts":tt,eligible:Xt.value,name:q,"manual-shifts":Ge.value,data:m.value,"scheduled-dates":Wt.value,start:He.value,"administrative-shift-id":(R=m.value.shifts.find(y=>y.active&&y.code==="D"))==null?void 0:R.id,"make-preview":Yt,"create-assignment":be.value?void 0:jt,onEdit:mt,onAdministrativeBusy:o[25]||(o[25]=y=>z.value=y),onAdministrativeCreated:on,onInput:o[26]||(o[26]=y=>S.value=!0),onChange:o[27]||(o[27]=y=>S.value=!0)},null,8,["bulk","selected","form-department","form-search","schedule-type","method","day-plans","calendar-mode","calendar-anchor","editing","busy","can-create","can-edit","can-update","can-bulk","tree-loading","tree-error","department-groups","unclassified-departments","shifts-loading","shifts-error","eligible","manual-shifts","data","scheduled-dates","start","administrative-shift-id","create-assignment"])):D("",!0),L.value==="templates"?(a(),Te(Du,{key:5,templates:m.value.templates,shifts:m.value.shifts,departments:U.value,busy:z.value,"can-create":W(t).can("schedules","create"),"can-edit":W(t).can("schedules","edit"),"can-bulk":W(t).can("schedules","bulk"),onCreate:o[28]||(o[28]=y=>qt()),onOpen:qt,onToggle:o[29]||(o[29]=y=>An(()=>W(En).template({...y,days:[...y.days],active:!y.active}))),onApply:_t},null,8,["templates","shifts","departments","busy","can-create","can-edit","can-bulk"])):D("",!0),L.value==="swaps"?(a(),Te(mu,{key:6,tab:Mn.value,"onUpdate:tab":o[30]||(o[30]=y=>Mn.value=y),rows:el.value,"can-approve":W(t).can("schedules","approve"),"can-create":W(t).can("schedules","create"),"assignment-label":wt,"shift-name":x,onCreate:o[31]||(o[31]=y=>{$n.value={assignmentId:"",targetAssignmentId:"",shiftId:"",reason:""},Cn.value=!0}),onDetail:o[32]||(o[32]=y=>{Un.value=y,Rn.value="",Fn.value=!0})},null,8,["tab","rows","can-approve","can-create"])):D("",!0),L.value==="reports"?(a(),Te(iu,{key:7})):D("",!0)],64)),j(Ht,{assignment:an.value,"department-code":((Y=d.all.value.find(y=>y.name===fe.value))==null?void 0:Y.code)||"","employee-name":an.value?q(an.value.employeeId):"",onClose:o[33]||(o[33]=y=>an.value=void 0),onSaved:zt},null,8,["assignment","department-code","employee-name"]),j(_o,{detail:Ln.value,"onUpdate:detail":o[34]||(o[34]=y=>Ln.value=y),"detail-open":_n.value,"onUpdate:detailOpen":o[35]||(o[35]=y=>_n.value=y),"history-open":pt.value,"onUpdate:historyOpen":o[36]||(o[36]=y=>pt.value=y),preview:Me.value,"onUpdate:preview":o[37]||(o[37]=y=>Me.value=y),"preview-open":yn.value,"onUpdate:previewOpen":o[38]||(o[38]=y=>yn.value=y),history:m.value.history,issues:yt.value,error:k.value,busy:z.value,today:W(E),"can-edit":W(t).can("schedules","edit"),name:q,"employee-name":$,fmt:$e,label:ne,symbol:A,pending:Ee,"save-assignments":Jt,"edit-assignment":Qt,onClosePreview:o[39]||(o[39]=y=>yn.value=!1)},null,8,["detail","detail-open","history-open","preview","preview-open","history","issues","error","busy","today","can-edit"]),j(Ii,{open:Tn.value,"onUpdate:open":o[40]||(o[40]=y=>Tn.value=y),read:Bn.value,"onUpdate:read":o[41]||(o[41]=y=>Bn.value=y),template:rn.value,"onUpdate:template":o[42]||(o[42]=y=>rn.value=y),departments:U.value,shifts:m.value.shifts,busy:z.value,error:k.value,onSave:Zt},null,8,["open","read","template","departments","shifts","busy","error"]),j(bi,{open:Cn.value,"onUpdate:open":o[43]||(o[43]=y=>Cn.value=y),"detail-open":Fn.value,"onUpdate:detailOpen":o[44]||(o[44]=y=>Fn.value=y),swap:$n.value,"onUpdate:swap":o[45]||(o[45]=y=>$n.value=y),mode:kt.value,"onUpdate:mode":o[46]||(o[46]=y=>kt.value=y),detail:Un.value,"onUpdate:detail":o[47]||(o[47]=y=>Un.value=y),decision:Rn.value,"onUpdate:decision":o[48]||(o[48]=y=>Rn.value=y),scheduled:nl.value,assignments:m.value.assignments,shifts:m.value.shifts,busy:z.value,error:k.value,"can-approve":W(t).can("schedules","approve"),"assignment-label":wt,"shift-name":x,"swap-before":ll,"swap-after":al,onSend:ol,onDecide:il},null,8,["open","detail-open","swap","mode","detail","decision","scheduled","assignments","shifts","busy","error","can-approve"]),j(li,{open:Tt.value,"onUpdate:open":o[49]||(o[49]=y=>Tt.value=y),assignments:tl.value,name:q,fmt:$e,label:ne},null,8,["open","assignments"])])}}});export{pd as default};
