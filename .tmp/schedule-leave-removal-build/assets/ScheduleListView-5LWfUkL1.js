import{an as Pe,am as Me,T as Yt,at as Qt,au as Jt,o,c as i,b as e,Q as yt,H as J,aj as bt,ak as qt,d as ge,y as ee,I as on,F as P,h as G,f as z,s as te,r as $,e as O,t as s,g as I,_ as ve,v as R,K as Se,x as ce,L as me,J as kt,as as wt,n as Q,z as Z,A as He,E as pe,i as W,q as Hn,w as Tt,av as ne,aw as we,C as tn,ap as Zn,al as Zt,G as Ct,af as _t,R as el,p as $t,k as nl,N as tl,j as ll}from"./index-BuDlQ0Ex.js";import{s as Be,a as Dt,g as al,b as ol}from"./schedule-shift.service-BivadwEd.js";import{b as il,s as Pn}from"./index-DWhub5hH.js";import{s as ln,a as Fn,i as Ie}from"./schedule-date-C26Sytjz.js";import{u as sn}from"./useToast-BxcD7gsY.js";import{_ as Ye}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{s as an}from"./index-CWLQtrPO.js";import{s as It}from"./index-DIQRsk-I.js";import{s as sl}from"./index-CpZXAyUc.js";import{e as rl}from"./employee.service-D_CfHwtC.js";import{p as kn,r as ul}from"./record.service-CmhAXuaD.js";import"./employee.documents-DcR950Mp.js";import"./employee.type-BRUlH-lO.js";import"./modules-CJV0O-xn.js";function mt(n){if(!n||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(n))return{date:"",time:""};const c=n.slice(0,10),u=Be(n.slice(11,19)),t=new Date(`${c}T12:00:00Z`);return!u||!Number.isFinite(t.getTime())||t.toISOString().slice(0,10)!==c?{date:"",time:""}:{date:c,time:u}}function Un(n){const c=Be(n);if(!c)throw new Error("Invalid schedule clock time.");return`PT${Number(c.slice(0,2))}H${Number(c.slice(3))}M`}function dl(n,c,u,t=!1){const a=Be(c),v=Be(u);if(!/^\d{4}-\d{2}-\d{2}$/.test(n)||!a||!v||a===v)throw new Error("Ngày hoặc giờ của ca không hợp lệ.");const d=new Date(`${n}T12:00:00Z`);if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==n)throw new Error("Ngày của ca không hợp lệ.");return(t||v<a)&&d.setUTCDate(d.getUTCDate()+1),{thoiGianBatDau:`${n}T${a}:00+07:00`,thoiGianKetThuc:`${d.toISOString().slice(0,10)}T${v}:00+07:00`}}function cl(n,c,u,t){if(console.log("Mapping bulk assignments:",{rows:n,shifts:c,departmentCode:u,employees:t}),!u||!n.length)throw new Error("Chọn bộ phận và ít nhất một phân công.");return[...n].sort((a,v)=>a.date.localeCompare(v.date)||a.employeeId.localeCompare(v.employeeId)).map(a=>{const v=c.find(k=>k.id===a.shiftId);if(a.status!=="SCHEDULED"||!v)throw new Error("Chỉ có thể tạo phân công với mã ca hợp lệ.");const d=t.find(k=>k.code===a.employeeId);if(!d)throw new Error("Không tìm thấy nhân viên trong bộ phận đã chọn.");const m=Be(a.startTime||v.startTime),f=Be(a.endTime||v.endTime);if(!/^\d{4}-\d{2}-\d{2}$/.test(a.date)||!/^\d{2}:\d{2}$/.test(m)||!/^\d{2}:\d{2}$/.test(f))throw new Error("Ngày hoặc giờ của ca không hợp lệ.");return{...a.fullTime===!1?{toanCa:!1}:{},ngayLamViec:`${a.date}T00:00:00+07:00`,maNhanVien:a.employeeId,maCa:v.id,maBoPhan:u,maChucVu:d.positionCode||null,...dl(a.date,m,f,a.crossDay??v.crossDay),trangThai:"2",nguonPhanCong:"1",ghiChu:a.note||null}})}async function vl(n){const c=n.map(v=>"{"+Object.entries(v).map(([d,m])=>`${d}: ${JSON.stringify(m)}`).join(",")+"}",3).join(","),u=Pe`mutation CreatePhanCongHangLoat {
    createPhanCongHangLoat(input: { danhSachPhanCong: [${c}] }) {
      isResults message data { tongSo thanhCong thatBai loi { maNhanVien ngayLamViec message } }
    }
  }`,{data:t}=await Me.mutate({mutation:u,errorPolicy:"none"}),a=t==null?void 0:t.createPhanCongHangLoat;if(!(a!=null&&a.data))throw new Error((a==null?void 0:a.message)||"Không thể lưu phân công ca.");if(!a.isResults&&!a.data.thatBai)throw new Error(a.message||"Không thể lưu phân công ca.");return{...a.data,loi:a.data.loi||[]}}var hl=`
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
`,ml={root:function(c){var u=c.instance;return["p-editor",{"p-invalid":u.$invalid}]},toolbar:"p-editor-toolbar",content:"p-editor-content"},pl=Yt.extend({name:"editor",style:hl,classes:ml}),gl={name:"BaseEditor",extends:il,props:{placeholder:String,readonly:Boolean,formats:Array,editorStyle:null,modules:null},style:pl,provide:function(){return{$pcEditor:this,$parentInstance:this}}};function $n(n){"@babel/helpers - typeof";return $n=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(c){return typeof c}:function(c){return c&&typeof Symbol=="function"&&c.constructor===Symbol&&c!==Symbol.prototype?"symbol":typeof c},$n(n)}function pt(n,c){var u=Object.keys(n);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(n);c&&(t=t.filter(function(a){return Object.getOwnPropertyDescriptor(n,a).enumerable})),u.push.apply(u,t)}return u}function fl(n){for(var c=1;c<arguments.length;c++){var u=arguments[c]!=null?arguments[c]:{};c%2?pt(Object(u),!0).forEach(function(t){yl(n,t,u[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(u)):pt(Object(u)).forEach(function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(u,t))})}return n}function yl(n,c,u){return(c=bl(c))in n?Object.defineProperty(n,c,{value:u,enumerable:!0,configurable:!0,writable:!0}):n[c]=u,n}function bl(n){var c=ql(n,"string");return $n(c)=="symbol"?c:c+""}function ql(n,c){if($n(n)!="object"||!n)return n;var u=n[Symbol.toPrimitive];if(u!==void 0){var t=u.call(n,c);if($n(t)!="object")return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return(c==="string"?String:Number)(n)}var gt=(function(){try{return window.Quill}catch{return null}})(),_n={name:"Editor",extends:gl,inheritAttrs:!1,emits:["text-change","selection-change","load"],quill:null,watch:{modelValue:function(c,u){c!==u&&this.quill&&!this.quill.hasFocus()&&this.renderValue(c)},d_value:function(c,u){c!==u&&this.quill&&!this.quill.hasFocus()&&this.renderValue(c)},readonly:function(){this.handleReadOnlyChange()}},mounted:function(){var c=this,u={modules:fl({toolbar:this.$refs.toolbarElement},this.modules),readOnly:this.readonly,theme:"snow",formats:this.formats,placeholder:this.placeholder};gt?(this.quill=new gt(this.$refs.editorElement,u),this.initQuill(),this.handleLoad()):Qt(()=>import("./quill-BKoT5U3A.js"),[]).then(function(t){t&&Jt(c.$refs.editorElement)&&(t.default?c.quill=new t.default(c.$refs.editorElement,u):c.quill=new t(c.$refs.editorElement,u),c.initQuill())}).then(function(){c.handleLoad()})},beforeUnmount:function(){this.quill=null},methods:{renderValue:function(c){if(this.quill)if(c){var u=this.quill.clipboard.convert({html:c});this.quill.setContents(u)}else this.quill.setText("")},initQuill:function(){var c=this;this.renderValue(this.d_value),this.quill.on("text-change",function(u,t,a){if(a==="user"){var v=c.quill.getSemanticHTML(),d=c.quill.getText().trim();v==="<p><br></p>"&&(v=""),c.writeValue(v),c.$emit("text-change",{htmlValue:v,textValue:d,delta:u,source:a,instance:c.quill})}}),this.quill.on("selection-change",function(u,t,a){var v=c.quill.getSemanticHTML(),d=c.quill.getText().trim();c.$emit("selection-change",{htmlValue:v,textValue:d,range:u,oldRange:t,source:a,instance:c.quill})})},handleLoad:function(){this.quill&&this.quill.getModule("toolbar")&&this.$emit("load",{instance:this.quill})},handleReadOnlyChange:function(){this.quill&&this.quill.enable(!this.readonly)}}};function kl(n,c,u,t,a,v){return o(),i("div",J({class:n.cx("root")},n.ptmi("root")),[e("div",J({ref:"toolbarElement",class:n.cx("toolbar")},n.ptm("toolbar")),[yt(n.$slots,"toolbar",{},function(){return[e("span",J({class:"ql-formats"},n.ptm("formats")),[e("select",J({class:"ql-header",defaultValue:"0"},n.ptm("header")),[e("option",J({value:"1"},n.ptm("option")),"Heading",16),e("option",J({value:"2"},n.ptm("option")),"Subheading",16),e("option",J({value:"0"},n.ptm("option")),"Normal",16)],16),e("select",J({class:"ql-font"},n.ptm("font")),[e("option",bt(qt(n.ptm("option"))),null,16),e("option",J({value:"serif"},n.ptm("option")),null,16),e("option",J({value:"monospace"},n.ptm("option")),null,16)],16)],16),e("span",J({class:"ql-formats"},n.ptm("formats")),[e("button",J({class:"ql-bold",type:"button"},n.ptm("bold")),null,16),e("button",J({class:"ql-italic",type:"button"},n.ptm("italic")),null,16),e("button",J({class:"ql-underline",type:"button"},n.ptm("underline")),null,16)],16),e("span",J({class:"ql-formats"},n.ptm("formats")),[e("select",J({class:"ql-color"},n.ptm("color")),null,16),e("select",J({class:"ql-background"},n.ptm("background")),null,16)],16),e("span",J({class:"ql-formats"},n.ptm("formats")),[e("button",J({class:"ql-list",value:"ordered",type:"button"},n.ptm("list")),null,16),e("button",J({class:"ql-list",value:"bullet",type:"button"},n.ptm("list")),null,16),e("select",J({class:"ql-align"},n.ptm("select")),[e("option",J({defaultValue:""},n.ptm("option")),null,16),e("option",J({value:"center"},n.ptm("option")),null,16),e("option",J({value:"right"},n.ptm("option")),null,16),e("option",J({value:"justify"},n.ptm("option")),null,16)],16)],16),e("span",J({class:"ql-formats"},n.ptm("formats")),[e("button",J({class:"ql-link",type:"button"},n.ptm("link")),null,16),e("button",J({class:"ql-image",type:"button"},n.ptm("image")),null,16),e("button",J({class:"ql-code-block",type:"button"},n.ptm("codeBlock")),null,16)],16),e("span",J({class:"ql-formats"},n.ptm("formats")),[e("button",J({class:"ql-clean",type:"button"},n.ptm("clean")),null,16)],16)]})],16),e("div",J({ref:"editorElement",class:n.cx("content"),style:n.editorStyle},n.ptm("content")),null,16)],16)}_n.render=kl;const wl=Pe`
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
`,Tl=Pe`
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
`;async function Cl(n,c){const{data:u}=await Me.query({query:Tl,variables:{tuNgay:`${n}T00:00:00+07:00`,denNgay:`${c}T23:59:59.999+07:00`},fetchPolicy:"no-cache",errorPolicy:"none"}),t=u==null?void 0:u.nhanVienChuaXepCa;if(!(t!=null&&t.isResults)||!Array.isArray(t.data))throw new Error((t==null?void 0:t.message)||"Không thể tải danh sách nhân viên chưa xếp ca.");return t.data.filter(a=>!!a).map(a=>({...a,danhSachNgayXepCa:(a.danhSachNgayXepCa||[]).filter(v=>typeof v=="string").map(ln).filter(v=>/^\d{4}-\d{2}-\d{2}$/.test(v))}))}async function Mn(n,c,u=null){const{data:t}=await Me.query({query:wl,variables:{tuNgay:`${n}T00:00:00+07:00`,denNgay:`${c}T23:59:59.999+07:00`,maBoPhan:u},fetchPolicy:"no-cache",errorPolicy:"none"}),a=t==null?void 0:t.phanCongCa;if(!(a!=null&&a.isResults)||!Array.isArray(a.data))throw new Error((a==null?void 0:a.message)||"Không thể tải lịch phân công ca.");const v=a.data.filter(d=>!!d);return St(v)}function St(n){const c=new Map;return{assignments:n.map(t=>{var f;const{date:a,time:v}=mt(t.thoiGianBatDau),{date:d,time:m}=mt(t.thoiGianKetThuc);return c.set(t.maCa,{id:t.maCa,code:t.kyHieuCa||t.maCa,name:t.tenCa,scheduleType:"ROTATING",startTime:v,endTime:m,crossDay:a&&d?d>a:!!t.quaNgay,displayColor:"#2563eb",active:!0}),{id:String(t.id),employeeId:t.maNhanVien,employeeName:t.hoTen,departmentCode:t.maBoPhan,locked:t.isLocked===!0,date:ln(t.ngayLamViec),shiftId:t.maCa,shiftSymbol:t.kyHieuCa||t.maCa,shiftName:t.tenCa,scheduleType:"ROTATING",status:"SCHEDULED",note:t.ghiChu||"",revision:1,fullTime:t.toanCa!==!1,leaveTypeId:((f=t.maLoaiNghiPhep)==null?void 0:f.trim())||null,startTime:v,endTime:m,crossDay:a&&d?d>a:!!t.quaNgay,apiStatus:t.trangThai,assignmentSource:t.nguonPhanCong,startDate:a||ln(t.ngayLamViec),endDate:d||void 0}}),shifts:[...c.values()]}}async function $l(n){const c=Object.entries(n).map(([v,d])=>v+": "+JSON.stringify(d)).join(","),u=Pe`mutation CreatePhanCongCa {
    createPhanCongCa(input: { ${c} }) {
      isResults
      message
      data {
        id ngayLamViec maNhanVien maNhanVienThaThe gioCongChuan heSoCa isLocked
        hoTen maBoPhan tenBoPhan maChucVu tenChucVu maCa tenCa kyHieuCa
        thoiGianBatDau thoiGianKetThuc quaNgay trangThai nguonPhanCong
        toanCa maLoaiNghiPhep ghiChu
      }
    }
  }`,{data:t}=await Me.mutate({mutation:u,errorPolicy:"none"}),a=t==null?void 0:t.createPhanCongCa;if(!(a!=null&&a.isResults))throw new Error((a==null?void 0:a.message)||"Không thể tạo phân công ca.");return a}const Dl=Pe`
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
`;async function Il(n,c=null){const{data:u}=await Me.query({query:Dl,variables:{selectedNgay:n,maBoPhan:c},fetchPolicy:"no-cache",errorPolicy:"none"}),t=u==null?void 0:u.loadDanhSachNgay;if(!(t!=null&&t.isResults)||!Array.isArray(t.data))throw new Error((t==null?void 0:t.message)||"Không thể tải danh sách đổi ca.");return St(t.data.filter(a=>!!a))}async function Sl(n,c,u=""){var m,f;const t=k=>!!k.id.trim()&&k.leaveTypeId==null&&k.status!=="OFF"&&![k.shiftId,k.shiftSymbol].some(T=>/^(DO(?:0+)?|OFF)$/i.test((T==null?void 0:T.trim())||""));if(!t(n)||!t(c)||n.id===c.id||n.employeeId===c.employeeId||n.date===c.date&&n.shiftId.trim()===c.shiftId.trim())throw new Error("Chọn hai ca làm việc hợp lệ của hai nhân viên khác nhau.");const a=k=>/^\d+$/.test(k.trim())?k.trim().replace(/^0+(?=\d)/,""):JSON.stringify(k.trim()),v=Pe`mutation DoiCa($lyDoDoiCa: String!) {
    doiCa(idCaYeuCauDoi: ${a(n.id)}, idCaDuocDoi: ${a(c.id)}, lyDoDoiCa: $lyDoDoiCa) {
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
  }`,{data:d}=await Me.mutate({mutation:v,variables:{lyDoDoiCa:u||null},errorPolicy:"none"});if(!((m=d==null?void 0:d.doiCa)!=null&&m.isResults))throw new Error(((f=d==null?void 0:d.doiCa)==null?void 0:f.message)||"Không thể đổi ca. Vui lòng thử lại.");return d.doiCa}const Nl={key:0,class:"exchange-form"},xl={class:"employee-summary","aria-label":"Ca làm việc hiện tại"},El={class:"employee-code"},Vl={class:"shift-details"},Al={class:"shift-name"},Ll={key:0,class:"error",role:"alert"},Ol={class:"date-actions"},Bl={class:"date-field",for:"exchange-date"},Pl={class:"reason-field","aria-labelledby":"exchange-reason-label"},Ml={key:1,class:"error",role:"alert"},Fl={class:"candidate-list","aria-label":"Nhân viên có thể đổi ca"},Ul={class:"list-heading"},Rl={class:"hint"},Hl={key:0,class:"empty-state",role:"status"},zl={key:1,class:"empty-state"},Gl={key:2,class:"candidate-scroll"},Kl={class:"candidate-table","aria-label":"Danh sách ca làm việc có thể đổi"},Xl={class:"selection-column"},jl=["id","value","aria-label","onChange"],Wl=["for"],Yl={class:"date-column"},Ql={class:"time-column"},Jl={class:"dialog-footer"},Zl={key:0,class:"exchange-form"},_l={class:"confirmation-pair"},ea={class:"employee-summary"},na={class:"employee-code"},ta={class:"hint"},la={class:"employee-summary"},aa={class:"employee-code"},oa={class:"hint"},ia={class:"reason-field reason-preview","aria-label":"Lý do đổi ca"},sa={key:1,class:"hint"},ra={key:0,class:"error",role:"alert"},ua={class:"dialog-footer"},da=ge({__name:"ScheduleExchangeDialog",props:{assignment:{},departmentCode:{},employeeName:{}},emits:["close","confirmed","busy"],setup(n,{emit:c}){const u=n,t=c,a=$(!1),v=sn();ee(a,C=>t("busy",C),{flush:"sync"});const d=$(""),m=$([]),f=$(!1),k=$(""),T=$(),q=$("");let x=0;const h=C=>C.status==="OFF"||[C.shiftId,C.shiftSymbol].some(b=>/^(DO(?:0+)?|OFF)$/i.test((b==null?void 0:b.trim())||"")),p=C=>C.leaveTypeId===null&&!h(C);function M(){++x,m.value=[],T.value=void 0,k.value="",f.value=!1}ee(()=>u.assignment,C=>{M(),d.value=(C==null?void 0:C.date)||"",q.value=""}),ee(d,M),on(()=>{++x});async function U(){const C=u.assignment;if(!C||!d.value||!p(C))return;const b=++x,g=d.value;m.value=[],T.value=void 0,k.value="",f.value=!0;try{const j=await Il(g,u.departmentCode);b===x&&(m.value=j.assignments.filter(S=>S.employeeId!==C.employeeId&&p(S)&&!(g===C.date&&S.shiftId.trim()===C.shiftId.trim())).map(S=>({...S,date:g})))}catch(j){b===x&&(k.value=me(j))}finally{b===x&&(f.value=!1)}}async function w(){if(!(a.value||!u.assignment||!T.value||!p(u.assignment)||!p(T.value)||T.value.date===u.assignment.date&&T.value.shiftId.trim()===u.assignment.shiftId.trim())){a.value=!0,k.value="";try{const C=await Sl(u.assignment,T.value,q.value);v.success(C.message||"Đổi ca thành công."),T.value=void 0,t("close"),t("confirmed")}catch(C){v.error(C),k.value=me(C)}finally{a.value=!1}}}return(C,b)=>(o(),i(P,null,[G(z(Se),{visible:!!n.assignment&&!T.value,modal:"",header:"Chọn nhân viên đổi ca",style:{width:"900px",maxWidth:"95vw"},"onUpdate:visible":b[3]||(b[3]=g=>!g&&t("close"))},{default:te(()=>[n.assignment?(o(),i("div",Nl,[e("section",xl,[b[8]||(b[8]=e("span",{class:"section-label"},"Ca làm việc hiện tại",-1)),e("strong",null,[O(s(n.employeeName)+" ",1),e("span",El,s(n.assignment.employeeId),1)]),e("div",Vl,[e("span",null,[b[6]||(b[6]=e("i",{class:"pi pi-calendar","aria-hidden":"true"},null,-1)),O(s(n.assignment.date),1)]),e("span",Al,s(n.assignment.shiftName||n.assignment.shiftSymbol||n.assignment.shiftId),1),e("span",null,[b[7]||(b[7]=e("i",{class:"pi pi-clock","aria-hidden":"true"},null,-1)),O(s(n.assignment.startTime)+"–"+s(n.assignment.endTime)+s(n.assignment.crossDay?" (+1 ngày)":""),1)])])]),p(n.assignment)?I("",!0):(o(),i("p",Ll," Chỉ ca làm việc không có mã nghỉ phép mới được đổi ca. Ca nghỉ DO không thể đổi ca. ")),e("div",Ol,[e("label",Bl,[b[9]||(b[9]=O("Chọn ngày ",-1)),G(z(Pn),{id:"exchange-date",modelValue:d.value,"onUpdate:modelValue":b[0]||(b[0]=g=>d.value=g),type:"date"},null,8,["modelValue"])]),G(ve,{type:"button",label:"Tải lại danh sách",icon:"pi pi-refresh",outlined:"",loading:f.value,disabled:f.value||!d.value||!p(n.assignment),onClick:U},null,8,["loading","disabled"])]),e("section",Pl,[b[11]||(b[11]=e("label",{id:"exchange-reason-label"},"Lý do đổi ca",-1)),G(z(_n),{modelValue:q.value,"onUpdate:modelValue":b[1]||(b[1]=g=>q.value=g),"editor-style":"height: 140px",placeholder:"Nhập lý do đổi ca…"},{toolbar:te(()=>[...b[10]||(b[10]=[e("span",{class:"ql-formats"},[e("button",{class:"ql-bold",type:"button","aria-label":"In đậm",title:"In đậm"}),e("button",{class:"ql-italic",type:"button","aria-label":"In nghiêng",title:"In nghiêng"}),e("button",{class:"ql-underline",type:"button","aria-label":"Gạch chân",title:"Gạch chân"})],-1),e("span",{class:"ql-formats"},[e("button",{class:"ql-list",value:"ordered",type:"button","aria-label":"Danh sách đánh số",title:"Danh sách đánh số"}),e("button",{class:"ql-list",value:"bullet",type:"button","aria-label":"Danh sách dấu chấm",title:"Danh sách dấu chấm"}),e("button",{class:"ql-clean",type:"button","aria-label":"Xóa định dạng",title:"Xóa định dạng"})],-1)])]),_:1},8,["modelValue"])]),k.value?(o(),i("p",Ml,s(k.value),1)):I("",!0),e("section",Fl,[e("div",Ul,[b[12]||(b[12]=e("strong",null,"Nhân viên có thể đổi ca",-1)),e("span",Rl,s(m.value.length)+" nhân viên",1)]),f.value?(o(),i("div",Hl,[...b[13]||(b[13]=[e("i",{class:"pi pi-spin pi-spinner","aria-hidden":"true"},null,-1),O("Đang tải danh sách nhân viên… ",-1)])])):m.value.length?(o(),i("div",Gl,[e("table",Kl,[b[15]||(b[15]=e("thead",null,[e("tr",null,[e("th",{scope:"col",class:"selection-column"},"Chọn"),e("th",{scope:"col"},"Mã nhân viên"),e("th",{scope:"col"},"Họ tên"),e("th",{scope:"col"},"Ngày làm việc"),e("th",{scope:"col"},"Ca làm việc"),e("th",{scope:"col"},"Giờ làm việc")])],-1)),e("tbody",null,[(o(!0),i(P,null,R(m.value,g=>(o(),i("tr",{key:g.id,class:"candidate"},[e("td",Xl,[e("input",{id:"exchange-candidate-"+g.id,type:"radio",name:"exchange-employee",value:g.id,"aria-label":"Chọn "+(g.employeeName||g.employeeId)+" · "+g.date,onChange:j=>T.value=g},null,40,jl)]),e("td",null,s(g.employeeId),1),e("td",null,[e("label",{for:"exchange-candidate-"+g.id},s(g.employeeName||g.employeeId),9,Wl)]),e("td",Yl,s(g.date.split("-").reverse().join("/")),1),e("td",null,s(g.shiftName||g.shiftSymbol||g.shiftId),1),e("td",Ql,s(g.startTime||"—")+"–"+s(g.endTime||"—")+s(g.crossDay?" (+1 ngày)":""),1)]))),128))])])])):(o(),i("div",zl,[...b[14]||(b[14]=[e("i",{class:"pi pi-users","aria-hidden":"true"},null,-1),e("p",null,"Chưa có nhân viên phù hợp.",-1),e("span",{class:"hint"},"Chọn ngày rồi nhấn Tải lại danh sách.",-1)])]))]),b[16]||(b[16]=e("p",{class:"hint"},"Chọn nhân viên để xem thông tin xác nhận chuyển ca.",-1)),e("footer",Jl,[G(ve,{type:"button",label:"Hủy",severity:"secondary",outlined:"",onClick:b[2]||(b[2]=g=>t("close"))})])])):I("",!0)]),_:1},8,["visible"]),G(z(Se),{visible:!!T.value,modal:"",header:"Xác nhận chuyển ca",closable:!a.value,"close-on-escape":!a.value,style:{width:"560px",maxWidth:"95vw"},"onUpdate:visible":b[5]||(b[5]=g=>!a.value&&!g&&(T.value=void 0))},{default:te(()=>[n.assignment&&T.value?(o(),i("div",Zl,[b[22]||(b[22]=e("p",null,"Bạn có xác nhận chuyển ca giữa hai nhân viên sau không?",-1)),e("div",_l,[e("section",ea,[b[17]||(b[17]=e("span",{class:"section-label"},"Ca hiện tại",-1)),e("strong",null,[O(s(n.employeeName)+" ",1),e("span",na,s(n.assignment.employeeId),1)]),e("span",null,s(n.assignment.date)+" · "+s(n.assignment.shiftName||n.assignment.shiftId),1),e("span",ta,s(n.assignment.startTime)+"–"+s(n.assignment.endTime)+s(n.assignment.crossDay?" (+1 ngày)":""),1)]),b[19]||(b[19]=e("i",{class:"pi pi-arrow-right-arrow-left exchange-icon","aria-hidden":"true"},null,-1)),e("section",la,[b[18]||(b[18]=e("span",{class:"section-label"},"Ca được chọn",-1)),e("strong",null,[O(s(T.value.employeeName||T.value.employeeId)+" ",1),e("span",aa,s(T.value.employeeId),1)]),e("span",null,s(T.value.date)+" · "+s(T.value.shiftName||T.value.shiftId),1),e("span",oa,s(T.value.startTime)+"–"+s(T.value.endTime)+s(T.value.crossDay?" (+1 ngày)":""),1)])]),e("section",ia,[b[21]||(b[21]=e("strong",null,"Lý do đổi ca",-1)),q.value?(o(),ce(z(_n),{key:0,"model-value":q.value,readonly:"","editor-style":"min-height: 80px"},{toolbar:te(()=>[...b[20]||(b[20]=[e("span",{class:"hint"},"Nội dung lý do đã nhập",-1)])]),_:1},8,["model-value"])):(o(),i("p",sa,"Chưa nhập lý do đổi ca."))]),k.value?(o(),i("p",ra,s(k.value),1)):I("",!0),e("footer",ua,[G(ve,{type:"button",label:"Quay lại",severity:"secondary",outlined:"",disabled:a.value,onClick:b[4]||(b[4]=g=>T.value=void 0)},null,8,["disabled"]),G(ve,{type:"button",label:"OK",icon:"pi pi-check",loading:a.value,disabled:a.value,onClick:w},null,8,["loading","disabled"])])])):I("",!0)]),_:1},8,["visible","closable","close-on-escape"])],64))}}),Nt=Ye(da,[["__scopeId","data-v-6f0ce4b9"]]);function zn(n,c){const u=new Date(`${n}T12:00:00`);c==="week"&&u.setDate(u.getDate()-(u.getDay()+6)%7),c==="month"&&u.setDate(1);const t=new Date(u);c==="week"&&t.setDate(t.getDate()+6),c==="month"&&t.setMonth(t.getMonth()+1,0);const a=v=>`${v.getFullYear()}-${String(v.getMonth()+1).padStart(2,"0")}-${String(v.getDate()).padStart(2,"0")}`;return{from:a(u),to:a(t)}}const ca={class:"calendar-header"},va={class:"calendar-heading"},ha={class:"calendar-subtitle"},ma={class:"calendar-controls"},pa={class:"control-field"},ga={class:"date-navigation"},fa=["disabled"],ya=["disabled"],ba=["disabled"],qa={class:"control-field"},ka=["disabled"],wa={class:"control-field department-control"},Ta=["disabled"],Ca=["value"],$a={class:"control-field search-control"},Da={class:"search-input-wrap"},Ia=["disabled"],Sa=["disabled"],Na={key:0},xa={key:1,role:"status"},Ea={key:2,role:"alert",class:"error"},Va={ref:"scrollArea",class:"calendar-scroll"},Aa={class:"number"},La={class:"person"},Oa=["data-employee-id","data-date"],Ba=["data-assignment-id","disabled","onClick"],Pa={key:0},Ma=ge({__name:"ScheduleActionCalendar",props:{employees:{},departments:{},canEdit:{type:Boolean}},setup(n){const c=n,u=$(Fn()),t=$("month"),a=$(""),v=$(""),d=$([]),m=$(!1),f=$(!1),k=$(""),T=W(()=>zn(u.value||Fn(),t.value)),q=W(()=>{const b=[],g=new Date(T.value.from+"T12:00:00Z");for(;g.toISOString().slice(0,10)<=T.value.to;)b.push(g.toISOString().slice(0,10)),g.setUTCDate(g.getUTCDate()+1);return b}),x=W(()=>c.employees.filter(b=>(!a.value||b.department===a.value)&&(b.code+" "+b.name).toLocaleLowerCase().includes(v.value.toLocaleLowerCase())));kt(()=>!f.value),wt(()=>!f.value);let h=0;async function p(){const b=++h;m.value=!0,k.value="",d.value=[];try{const g=await Mn(T.value.from,T.value.to);b===h&&(d.value=g.assignments)}catch(g){b===h&&(k.value=me(g))}finally{b===h&&(m.value=!1)}}ee([T,a],p,{immediate:!0});function M(b){const g=new Date(u.value+"T12:00:00Z");t.value==="month"?(g.setUTCDate(1),g.setUTCMonth(g.getUTCMonth()+b)):g.setUTCDate(g.getUTCDate()+b*7),u.value=g.toISOString().slice(0,10)}const U=(b,g)=>d.value.filter(j=>j.employeeId===b&&j.date===g),w=b=>{var g;return((g=c.employees.find(j=>j.code===b))==null?void 0:g.name)||b},C=$();return on(()=>{++h}),ee([T,a,v],()=>{C.value=void 0}),(b,g)=>{var S,N;const j=Hn("RouterLink");return o(),i("section",{class:Q(["action-calendar",{"month-view":t.value==="month"}])},[e("header",ca,[e("div",va,[g[9]||(g[9]=e("span",{class:"calendar-heading-icon","aria-hidden":"true"},[e("i",{class:"pi pi-arrow-right-arrow-left"})],-1)),e("div",null,[g[8]||(g[8]=e("h2",null,"Đổi ca",-1)),e("span",ha,s(x.value.length)+" nhân viên · "+s(t.value==="month"?"Lịch tháng":"Lịch tuần"),1)])]),G(j,{class:"calendar-back",to:"/schedules/assign"},{default:te(()=>[...g[10]||(g[10]=[e("i",{class:"pi pi-arrow-left","aria-hidden":"true"},null,-1),O("Quay về lịch phân công",-1)])]),_:1})]),e("div",ma,[e("div",pa,[g[13]||(g[13]=e("span",{class:"control-label"},"Thời gian",-1)),e("div",ga,[e("button",{type:"button",class:"calendar-nav-button",disabled:f.value,"aria-label":"Xem kỳ trước",onClick:g[0]||(g[0]=B=>M(-1))},[...g[11]||(g[11]=[e("i",{class:"pi pi-chevron-left","aria-hidden":"true"},null,-1)])],8,fa),Z(e("input",{"onUpdate:modelValue":g[1]||(g[1]=B=>u.value=B),class:"control-input calendar-date",type:"date","aria-label":"Ngày xem lịch",disabled:f.value},null,8,ya),[[He,u.value]]),e("button",{type:"button",class:"calendar-nav-button",disabled:f.value,"aria-label":"Xem kỳ sau",onClick:g[2]||(g[2]=B=>M(1))},[...g[12]||(g[12]=[e("i",{class:"pi pi-chevron-right","aria-hidden":"true"},null,-1)])],8,ba)])]),e("label",qa,[g[15]||(g[15]=e("span",{class:"control-label"},"Chế độ xem",-1)),Z(e("select",{"onUpdate:modelValue":g[3]||(g[3]=B=>t.value=B),class:"control-input",disabled:f.value},[...g[14]||(g[14]=[e("option",{value:"month"},"Lịch tháng",-1),e("option",{value:"week"},"Lịch tuần",-1)])],8,ka),[[pe,t.value]])]),e("label",wa,[g[17]||(g[17]=e("span",{class:"control-label"},"Bộ phận",-1)),Z(e("select",{"onUpdate:modelValue":g[4]||(g[4]=B=>a.value=B),class:"control-input",disabled:f.value},[g[16]||(g[16]=e("option",{value:""},"Tất cả bộ phận",-1)),(o(!0),i(P,null,R(n.departments,B=>(o(),i("option",{key:B.code,value:B.name},s(B.name),9,Ca))),128))],8,Ta),[[pe,a.value]])]),e("label",$a,[g[19]||(g[19]=e("span",{class:"control-label"},"Nhân viên",-1)),e("span",Da,[g[18]||(g[18]=e("i",{class:"pi pi-search","aria-hidden":"true"},null,-1)),Z(e("input",{"onUpdate:modelValue":g[5]||(g[5]=B=>v.value=B),class:"control-input",placeholder:"Tìm mã hoặc họ tên",disabled:f.value},null,8,Ia),[[He,v.value]])])]),e("button",{type:"button",class:"calendar-reload",disabled:m.value||f.value,onClick:p},[e("i",{class:Q(m.value?"pi pi-spin pi-spinner":"pi pi-refresh"),"aria-hidden":"true"},null,2),g[20]||(g[20]=O("Tải lại ",-1))],8,Sa)]),g[23]||(g[23]=e("p",{class:"calendar-hint"},"Bấm vào ca làm việc để chọn nhân viên đổi ca.",-1)),n.canEdit?I("",!0):(o(),i("p",Na,"Bạn không có quyền điều chỉnh lịch.")),m.value?(o(),i("p",xa,"Đang tải lịch…")):I("",!0),k.value?(o(),i("p",Ea,s(k.value),1)):I("",!0),e("div",Va,[e("table",null,[e("thead",null,[e("tr",null,[g[21]||(g[21]=e("th",{class:"number"},"STT",-1)),g[22]||(g[22]=e("th",{class:"person"},"Họ và tên / Bộ phận / Chức vụ",-1)),(o(!0),i(P,null,R(q.value,B=>(o(),i("th",{key:B,class:"date-column"},[O(s(B.slice(8))+"/"+s(B.slice(5,7)),1),e("small",null,s(new Date(B+"T12:00:00").toLocaleDateString("vi-VN",{weekday:"short"})),1)]))),128))])]),e("tbody",null,[(o(!0),i(P,null,R(x.value,(B,Y)=>(o(),i("tr",{key:B.code},[e("td",Aa,s(Y+1),1),e("th",La,[O(s(B.name),1),e("small",null,s(B.code),1),e("small",null,s(B.department)+" / "+s(B.position||"—"),1)]),(o(!0),i(P,null,R(q.value,_=>(o(),i("td",{key:_,class:Q(["date-column",{past:z(Ie)(_)}]),"data-employee-id":B.code,"data-date":_},[(o(!0),i(P,null,R(U(B.code,_),le=>(o(),i("button",{key:le.id,class:"sticker",type:"button","data-assignment-id":le.id,disabled:!n.canEdit||f.value||m.value,title:"Bấm để chọn nhân viên đổi ca",onClick:Ee=>C.value=le},[e("strong",null,s(le.shiftSymbol||le.shiftId),1),e("small",null,s(le.startTime)+"–"+s(le.endTime)+s(le.crossDay?" (+1)":""),1)],8,Ba))),128))],10,Oa))),128))]))),128))])]),x.value.length?I("",!0):(o(),i("p",Pa,"Không tìm thấy nhân viên."))],512),G(Nt,{onBusy:g[6]||(g[6]=B=>f.value=B),assignment:C.value,"department-code":((S=n.departments.find(B=>B.name===a.value))==null?void 0:S.code)||((N=C.value)==null?void 0:N.departmentCode)||null,"employee-name":C.value?w(C.value.employeeId):"",onClose:g[7]||(g[7]=B=>C.value=void 0),onConfirmed:p},null,8,["assignment","department-code","employee-name"])],2)}}}),Fa=Ye(Ma,[["__scopeId","data-v-076dfdfe"]]);async function Ua(n){var a,v;const c=Object.entries(n).map(([d,m])=>d+": "+(d==="id"&&/^\d+$/.test(String(m))?String(m):JSON.stringify(m))).join(","),u=Pe`mutation UpdatePhanCongCa {
    updatePhanCongCa(input: { ${c} }) { isResults message }
  }`,{data:t}=await Me.mutate({mutation:u,errorPolicy:"none"});if(!((a=t==null?void 0:t.updatePhanCongCa)!=null&&a.isResults))throw new Error(((v=t==null?void 0:t.updatePhanCongCa)==null?void 0:v.message)||"Không thể cập nhật phân công.");return t.updatePhanCongCa}function Ra(n,c,u){if(!n.id||Ie(n.date))throw new Error("Không thể sửa phân công ngày quá khứ.");const t=u.find(d=>d.id===c&&d.active&&d.workType!=="0"&&d.scheduleType===n.scheduleType);if(!t||c===n.shiftId)throw new Error("Vui lòng chọn ca làm việc khác ca hiện tại.");const a=Be(t.startTime),v=Be(t.endTime);if(!a||!v||a===v)throw new Error("Ca được chọn chưa có giờ làm việc hợp lệ. Vui lòng cấu hình giờ của ca.");return{id:n.id,maNhanVien:n.employeeId,ngayLamViec:`${n.date}T00:00:00+07:00`,maCa:c,toanCa:!0,gioBatDau:Un(a),gioKetThuc:Un(v),maLoaiNghiPhep:null,ghiChu:(n.note||"").trim()||null}}const Ha={class:"employee-summary"},za={key:0,role:"status"},Ga={key:1,class:"hint"},Ka={key:2,class:"error",role:"alert"},Xa=ge({__name:"ScheduleEditDialog",props:{assignment:{},departmentCode:{},employeeName:{}},emits:["close","saved","busy"],setup(n,{emit:c}){const u=n,t=c,a=sn(),v=$(""),d=$([]),m=$(!1),f=$(!1),k=$("");let T=0;const q=W(()=>d.value.filter(p=>{var M,U;return p.active&&p.workType!=="0"&&p.scheduleType===((M=u.assignment)==null?void 0:M.scheduleType)&&p.id!==((U=u.assignment)==null?void 0:U.shiftId)}).map(p=>({...p,label:`${p.code} · ${p.name}${p.startTime&&p.endTime?` (${p.startTime}–${p.endTime})`:""}`})));ee(f,p=>t("busy",p),{flush:"sync"});async function x(){const p=++T;if(d.value=[],k.value="",!u.assignment){m.value=!1;return}m.value=!0;try{if(!u.departmentCode)throw new Error("Chưa xác định bộ phận của phân công.");const M=await Dt(u.departmentCode,u.assignment.scheduleType);p===T&&(d.value=M)}catch(M){p===T&&(k.value=me(M))}finally{p===T&&(m.value=!1)}}ee(()=>[u.assignment,u.departmentCode],()=>{v.value="",x()},{immediate:!0});async function h(){if(!(!u.assignment||f.value||m.value)){k.value="",f.value=!0;try{await Ua(Ra(u.assignment,v.value,d.value)),t("saved")}catch(p){a.error(p),k.value=me(p)}finally{f.value=!1}}}return on(()=>{++T}),(p,M)=>(o(),ce(z(Se),{class:"schedule-dialog",visible:!!n.assignment,modal:"",header:"Điều chỉnh phân công ca",closable:!f.value,"close-on-escape":!f.value,style:{width:"520px",maxWidth:"95vw"},"onUpdate:visible":M[2]||(M[2]=U=>!f.value&&t("close"))},{default:te(()=>{var U,w,C;return[e("form",{class:"edit-form",onSubmit:Tt(h,["prevent"])},[e("p",Ha,[e("strong",null,s(n.employeeName),1),M[3]||(M[3]=e("br",null,null,-1)),O(s((U=n.assignment)==null?void 0:U.date)+" · Ca hiện tại: "+s(((w=n.assignment)==null?void 0:w.shiftSymbol)||((C=n.assignment)==null?void 0:C.shiftId)),1)]),m.value?(o(),i("p",za,"Đang tải danh mục ca...")):I("",!0),e("label",null,[M[4]||(M[4]=O("Ca làm việc mới *",-1)),G(z(an),{modelValue:v.value,"onUpdate:modelValue":M[0]||(M[0]=b=>v.value=b),options:q.value,"option-label":"label","option-value":"id",placeholder:"Chọn ca làm việc",disabled:m.value||f.value},null,8,["modelValue","options","disabled"])]),!m.value&&!k.value&&!q.value.length?(o(),i("p",Ga," Chưa có ca làm việc khác trong bộ phận để đổi. ")):I("",!0),k.value?(o(),i("p",Ka,[O(s(k.value),1),d.value.length?I("",!0):(o(),ce(ve,{key:0,type:"button",label:"Tải lại danh mục",text:"",disabled:f.value||m.value,onClick:x},null,8,["disabled"]))])):I("",!0),e("footer",null,[G(ve,{type:"button",label:"Hủy",severity:"secondary",outlined:"",disabled:f.value,onClick:M[1]||(M[1]=b=>t("close"))},null,8,["disabled"]),G(ve,{type:"submit",label:"Xác nhận",loading:f.value,disabled:m.value||!q.value.length||!v.value},null,8,["loading","disabled"])])],32)]}),_:1},8,["visible","closable","close-on-escape"]))}}),ja=Ye(Xa,[["__scopeId","data-v-12ed9831"]]),Wa={key:0},Ya={class:"actions"},Qa={key:1},Ja={key:0},Za={class:"schedule-dialog"},_a={key:0,class:"error"},eo={class:"preview-calendar-toolbar"},no=["aria-label"],to={key:0},lo=["aria-label"],ao={class:"preview-calendar-mode"},oo={class:"preview-calendar-table"},io={class:"preview-calendar-employee"},so={key:0},ro={key:0},uo={key:0},co=["colspan"],vo={key:1,class:"error",role:"alert",style:{"white-space":"pre-line"}},ho={class:"actions"},mo=["disabled"],po=["disabled"],go=ge({__name:"ScheduleAssignmentDialogs",props:we({history:{},issues:{},error:{},busy:{type:Boolean},today:{},canEdit:{type:Boolean},name:{type:Function},employeeName:{type:Function},fmt:{type:Function},label:{type:Function},symbol:{type:Function},pending:{type:Function},saveAssignments:{type:Function},editAssignment:{type:Function}},{detail:{},detailModifiers:{},detailOpen:{type:Boolean,required:!0},detailOpenModifiers:{},historyOpen:{type:Boolean,required:!0},historyOpenModifiers:{},preview:{required:!0},previewModifiers:{},previewOpen:{type:Boolean,required:!0},previewOpenModifiers:{}}),emits:we(["closePreview"],["update:detail","update:detailOpen","update:historyOpen","update:preview","update:previewOpen"]),setup(n,{emit:c}){const u=ne(n,"detail"),t=ne(n,"detailOpen"),a=ne(n,"historyOpen"),v=ne(n,"preview"),d=ne(n,"previewOpen"),m=n,f=c,k=$("week"),T=$(m.today),q=["T2","T3","T4","T5","T6","T7","CN"];ee(d,w=>{if(!w)return;const C=v.value.map(j=>j.date).sort(),b=C[0]||m.today,g=C[C.length-1]||b;T.value=b,k.value=x(b,g)>6?"month":"week"});function x(w,C){return Math.round((new Date(`${C}T12:00:00`).getTime()-new Date(`${w}T12:00:00`).getTime())/864e5)}const h=W(()=>{const w=new Date(T.value+"T12:00:00");k.value==="week"?w.setDate(w.getDate()-(w.getDay()+6)%7):w.setDate(1);const C=k.value==="week"?7:new Date(w.getFullYear(),w.getMonth()+1,0).getDate();return Array.from({length:C},(b,g)=>{const j=new Date(w);return j.setDate(j.getDate()+g),`${j.getFullYear()}-${String(j.getMonth()+1).padStart(2,"0")}-${String(j.getDate()).padStart(2,"0")}`})}),p=W(()=>[...new Set(v.value.map(C=>C.employeeId))].map(C=>({code:C,name:m.employeeName(C)})).sort((C,b)=>C.name.localeCompare(b.name,"vi")));function M(w,C){return v.value.filter(b=>b.employeeId===w&&b.date===C)}function U(w){const C=new Date(T.value+"T12:00:00");k.value==="month"?(C.setDate(1),C.setMonth(C.getMonth()+w)):C.setDate(C.getDate()+w*7),T.value=`${C.getFullYear()}-${String(C.getMonth()+1).padStart(2,"0")}-${String(C.getDate()).padStart(2,"0")}`}return(w,C)=>(o(),i(P,null,[G(z(It),{visible:t.value,"onUpdate:visible":C[2]||(C[2]=b=>t.value=b),header:"Chi tiết phân công",position:"right",class:"schedule-drawer"},{default:te(()=>[u.value?(o(),i(P,{key:0},[e("h3",null,s(n.name(u.value.employeeId)),1),e("p",null,s(n.fmt(u.value.date))+" · "+s(u.value.scheduleType==="ADMINISTRATIVE"?"Hành chính":"Xoay ca"),1),e("p",null,s(n.label(u.value)),1),e("p",null,s(u.value.note||"Chưa có ghi chú"),1),n.pending(u.value)?(o(),i("p",Wa,"↔ Có yêu cầu đổi ca chờ duyệt")):I("",!0),e("div",Ya,[e("button",{onClick:C[0]||(C[0]=b=>a.value=!a.value)},"Lịch sử"),n.canEdit?(o(),i("button",{key:0,onClick:C[1]||(C[1]=(...b)=>n.editAssignment&&n.editAssignment(...b))},"Sửa phân công")):I("",!0)]),a.value?(o(),i("ul",Qa,[(o(!0),i(P,null,R(n.history.filter(b=>{var g;return b.assignmentId===((g=u.value)==null?void 0:g.id)}),(b,g)=>(o(),i("li",{key:g},s(b.action)+" · "+s(new Date(b.date).toLocaleString("vi-VN")),1))),128)),n.history.some(b=>{var g;return b.assignmentId===((g=u.value)==null?void 0:g.id)})?I("",!0):(o(),i("li",Ja," Chưa có lịch sử thay đổi. "))])):I("",!0)],64)):I("",!0)]),_:1},8,["visible"]),G(z(Se),{visible:d.value,"onUpdate:visible":C[9]||(C[9]=b=>d.value=b),modal:"",header:"Xem trước phân công",style:{width:"1000px",maxWidth:"95vw"}},{default:te(()=>[e("div",Za,[e("p",null,s(v.value.length)+" phân công · "+s(p.value.length)+" nhân viên",1),n.issues.length?(o(),i("div",_a,[e("strong",null,"⚠ "+s(n.issues.length)+" xung đột — không thể lưu",1),(o(!0),i(P,null,R(n.issues,(b,g)=>(o(),i("p",{key:g},[O(s(n.name(b.row.employeeId))+" · "+s(n.fmt(b.row.date)),1),C[10]||(C[10]=e("br",null,null,-1)),O(" Ca mới: "+s(n.label(b.row)),1),C[11]||(C[11]=e("br",null,null,-1)),O(" Đã có: "+s(n.label(b.existing))+" · "+s(n.fmt(b.existing.date)),1),C[12]||(C[12]=e("br",null,null,-1)),O(" "+s(b.reason),1)]))),128))])):I("",!0),e("div",eo,[e("button",{type:"button","aria-label":k.value==="week"?"Tuần trước":"Tháng trước",onClick:C[3]||(C[3]=b=>U(-1))}," ‹ ",8,no),h.value.length?(o(),i("strong",to,s(n.fmt(h.value[0]))+" – "+s(n.fmt(h.value[h.value.length-1])),1)):I("",!0),e("button",{type:"button","aria-label":k.value==="week"?"Tuần sau":"Tháng sau",onClick:C[4]||(C[4]=b=>U(1))}," › ",8,lo),e("div",ao,[e("button",{class:Q({active:k.value==="week"}),onClick:C[5]||(C[5]=b=>k.value="week")}," Tuần ",2),e("button",{class:Q({active:k.value==="month"}),onClick:C[6]||(C[6]=b=>k.value="month")}," Tháng ",2)])]),e("div",{class:Q(["preview-calendar-scroll","mode-"+k.value])},[e("table",oo,[e("thead",null,[e("tr",null,[C[13]||(C[13]=e("th",{class:"preview-calendar-employee"},"Nhân viên",-1)),(o(!0),i(P,null,R(h.value,b=>(o(),i("th",{key:b,class:Q({weekend:[0,6].includes(new Date(b+"T12:00:00").getDay()),today:b===n.today})},[O(s(q[(new Date(b+"T12:00:00").getDay()+6)%7])+" ",1),e("small",null,s(Number(b.slice(-2)))+"/"+s(Number(b.slice(5,7))),1)],2))),128))])]),e("tbody",null,[(o(!0),i(P,null,R(p.value,b=>(o(),i("tr",{key:b.code},[e("th",io,[e("strong",null,s(b.name),1),e("small",null,s(b.code),1)]),(o(!0),i(P,null,R(h.value,g=>(o(),i("td",{key:g,class:Q({weekend:[0,6].includes(new Date(g+"T12:00:00").getDay())})},[(o(!0),i(P,null,R(M(b.code,g),j=>(o(),i(P,{key:j.id+j.shiftId},[e("strong",null,s(j.status==="OFF"?"Nghỉ":n.symbol(j)),1),j.startTime&&j.endTime?(o(),i("small",so,s(z(Be)(j.startTime))+"–"+s(z(Be)(j.endTime))+s(j.crossDay?" (+1 ngày)":""),1)):I("",!0)],64))),128)),M(b.code,g).length?I("",!0):(o(),i("span",ro,"—"))],2))),128))]))),128)),p.value.length?I("",!0):(o(),i("tr",uo,[e("td",{colspan:h.value.length+1,class:"empty-state"}," Không có phân công trong khoảng này. ",8,co)]))])])],2),n.error?(o(),i("p",vo,s(n.error),1)):I("",!0),e("div",ho,[e("button",{disabled:n.busy,onClick:C[7]||(C[7]=b=>f("closePreview"))},"Quay lại",8,mo),e("button",{class:"primary",disabled:n.busy||!!n.issues.length||!v.value.length,onClick:C[8]||(C[8]=(...b)=>n.saveAssignments&&n.saveAssignments(...b))},s(n.busy?"Đang lưu…":"Lưu phân công"),9,po)])])]),_:1},8,["visible"])],64))}}),fo={class:"table-scroll schedule-dialog"},yo={class:"report"},bo={key:0},qo=ge({__name:"ScheduleDrillDialog",props:we({assignments:{},name:{type:Function},fmt:{type:Function},label:{type:Function}},{open:{type:Boolean,required:!0},openModifiers:{}}),emits:["update:open"],setup(n){const c=ne(n,"open");return(u,t)=>(o(),ce(z(Se),{visible:c.value,"onUpdate:visible":t[0]||(t[0]=a=>c.value=a),modal:"",header:"Lịch chi tiết",style:{width:"800px",maxWidth:"95vw"}},{default:te(()=>[e("div",fo,[e("table",yo,[t[2]||(t[2]=e("thead",null,[e("tr",null,[e("th",null,"Nhân viên"),e("th",null,"Ngày"),e("th",null,"Phân công")])],-1)),e("tbody",null,[(o(!0),i(P,null,R(n.assignments,a=>(o(),i("tr",{key:a.id},[e("td",null,s(n.name(a.employeeId)),1),e("td",null,s(n.fmt(a.date)),1),e("td",null,s(n.label(a)),1)]))),128)),n.assignments.length?I("",!0):(o(),i("tr",bo,[...t[1]||(t[1]=[e("td",{colspan:"3"},"Chưa có lịch phù hợp.",-1)])]))])])])]),_:1},8,["visible"]))}}),ko={class:"schedule-dialog"},wo=["value"],To={key:0},Co=["value"],$o={key:1},Do=["value"],Io={key:2,class:"error"},So=["disabled"],No={key:0},xo={key:1},Eo={key:2},Vo={key:0,class:"error"},Ao={class:"actions"},Lo=["disabled"],Oo=["disabled"],Bo=ge({__name:"ScheduleSwapDialogs",props:we({scheduled:{},assignments:{},shifts:{},busy:{type:Boolean},error:{},canApprove:{type:Boolean},assignmentLabel:{type:Function},shiftName:{type:Function},swapBefore:{type:Function},swapAfter:{type:Function}},{open:{type:Boolean,required:!0},openModifiers:{},detailOpen:{type:Boolean,required:!0},detailOpenModifiers:{},swap:{required:!0},swapModifiers:{},mode:{required:!0},modeModifiers:{},detail:{},detailModifiers:{},decision:{required:!0},decisionModifiers:{}}),emits:we(["send","decide"],["update:open","update:detailOpen","update:swap","update:mode","update:detail","update:decision"]),setup(n,{emit:c}){const u=ne(n,"open"),t=ne(n,"detailOpen"),a=ne(n,"swap"),v=ne(n,"mode"),d=ne(n,"detail"),m=ne(n,"decision"),f=n,k=c,T={PENDING:"Chờ duyệt",APPROVED:"Đã duyệt",REJECTED:"Từ chối",CANCELLED:"Đã hủy"},q=W(()=>f.assignments.find(x=>x.id===a.value.assignmentId));return(x,h)=>(o(),i(P,null,[G(z(Se),{visible:u.value,"onUpdate:visible":h[7]||(h[7]=p=>u.value=p),modal:"",header:"Tạo yêu cầu đổi ca",style:{width:"650px",maxWidth:"95vw"}},{default:te(()=>[e("div",ko,[e("label",null,[h[13]||(h[13]=O(" Ca muốn đổi * ",-1)),Z(e("select",{"onUpdate:modelValue":h[0]||(h[0]=p=>a.value.assignmentId=p)},[h[12]||(h[12]=e("option",{value:""},"Chọn ca đã phân công",-1)),(o(!0),i(P,null,R(n.scheduled,p=>(o(),i("option",{key:p.id,value:p.id},s(n.assignmentLabel(p.id)),9,wo))),128))],512),[[pe,a.value.assignmentId]])]),e("label",null,[h[15]||(h[15]=O(" Hình thức ",-1)),Z(e("select",{"onUpdate:modelValue":h[1]||(h[1]=p=>v.value=p),onChange:h[2]||(h[2]=p=>{a.value.targetAssignmentId="",a.value.shiftId=""})},[...h[14]||(h[14]=[e("option",{value:"employee"},"Đổi với nhân viên khác",-1),e("option",{value:"shift"},"Xin đổi sang ca khác",-1)])],544),[[pe,v.value]])]),v.value==="employee"?(o(),i("label",To,[h[17]||(h[17]=O(" Ca của nhân viên đổi cùng ",-1)),Z(e("select",{"onUpdate:modelValue":h[3]||(h[3]=p=>a.value.targetAssignmentId=p)},[h[16]||(h[16]=e("option",{value:""},"Chọn nhân viên / ca",-1)),(o(!0),i(P,null,R(n.scheduled.filter(p=>{var M;return p.employeeId!==((M=q.value)==null?void 0:M.employeeId)}),p=>(o(),i("option",{key:p.id,value:p.id},s(n.assignmentLabel(p.id)),9,Co))),128))],512),[[pe,a.value.targetAssignmentId]])])):(o(),i("label",$o,[h[19]||(h[19]=O(" Ca muốn đổi sang ",-1)),Z(e("select",{"onUpdate:modelValue":h[4]||(h[4]=p=>a.value.shiftId=p)},[h[18]||(h[18]=e("option",{value:""},"Chọn ca",-1)),(o(!0),i(P,null,R(n.shifts.filter(p=>p.active),p=>(o(),i("option",{key:p.id,value:p.id},s(n.shiftName(p.id)),9,Do))),128))],512),[[pe,a.value.shiftId]])])),e("label",null,[h[20]||(h[20]=O("Lý do *",-1)),Z(e("textarea",{"onUpdate:modelValue":h[5]||(h[5]=p=>a.value.reason=p)},null,512),[[He,a.value.reason]])]),n.error?(o(),i("p",Io,s(n.error),1)):I("",!0),e("button",{class:"primary",disabled:n.busy,onClick:h[6]||(h[6]=p=>k("send"))},s(n.busy?"Đang gửi…":"Gửi yêu cầu"),9,So)])]),_:1},8,["visible"]),G(z(It),{visible:t.value,"onUpdate:visible":h[11]||(h[11]=p=>t.value=p),header:"Chi tiết yêu cầu đổi ca",position:"right",class:"schedule-drawer"},{default:te(()=>[d.value?(o(),i(P,{key:0},[e("h3",null,s(d.value.code)+" · "+s(T[d.value.status]),1),h[22]||(h[22]=e("h4",null,"Trước khi đổi",-1)),e("p",null,s(n.swapBefore(d.value)),1),d.value.targetAssignmentId?(o(),i("p",No,s(n.swapBefore(d.value,!0)),1)):I("",!0),h[23]||(h[23]=e("h4",null,"Sau khi đổi (dự kiến)",-1)),e("p",null,s(n.swapAfter(d.value)),1),d.value.targetAssignmentId?(o(),i("p",xo,s(n.swapAfter(d.value,!0)),1)):I("",!0),e("p",null,"Lý do: "+s(d.value.reason),1),d.value.decision?(o(),i("p",Eo,"Phản hồi: "+s(d.value.decision),1)):I("",!0),d.value.status==="PENDING"&&n.canApprove?(o(),i(P,{key:3},[e("label",null,[h[21]||(h[21]=O("Phản hồi / lý do từ chối",-1)),Z(e("textarea",{"onUpdate:modelValue":h[8]||(h[8]=p=>m.value=p)},null,512),[[He,m.value]])]),n.error?(o(),i("p",Vo,s(n.error),1)):I("",!0),e("div",Ao,[e("button",{disabled:n.busy,onClick:h[9]||(h[9]=p=>k("decide",!1))},"Từ chối",8,Lo),e("button",{class:"primary",disabled:n.busy,onClick:h[10]||(h[10]=p=>k("decide",!0))}," Duyệt đổi ca ",8,Oo)])],64)):I("",!0)],64)):I("",!0)]),_:1},8,["visible"])],64))}}),Po={class:"schedule-dialog"},Mo=["disabled"],Fo={class:"form-grid"},Uo={class:"pattern"},Ro=["onUpdate:modelValue"],Ho=["value"],zo={key:0,class:"error"},Go=["disabled"],Ko=ge({__name:"ScheduleTemplateDialog",props:we({departments:{},shifts:{},busy:{type:Boolean},error:{}},{open:{type:Boolean,required:!0},openModifiers:{},read:{type:Boolean,required:!0},readModifiers:{},template:{required:!0},templateModifiers:{}}),emits:we(["save"],["update:open","update:read","update:template"]),setup(n,{emit:c}){const u=ne(n,"open"),t=ne(n,"read"),a=ne(n,"template"),v=c,d=["T2","T3","T4","T5","T6","T7","CN"];return(m,f)=>(o(),ce(z(Se),{visible:u.value,"onUpdate:visible":f[10]||(f[10]=k=>u.value=k),modal:"",header:t.value?"Chi tiết mẫu lịch":"Cấu hình mẫu lịch",style:{width:"800px",maxWidth:"95vw"}},{default:te(()=>[e("div",Po,[e("fieldset",{disabled:t.value||n.busy},[e("div",Fo,[e("label",null,[f[11]||(f[11]=O("Tên mẫu *",-1)),Z(e("input",{"onUpdate:modelValue":f[0]||(f[0]=k=>a.value.name=k)},null,512),[[He,a.value.name]])]),e("label",null,[f[13]||(f[13]=O(" Loại lịch ",-1)),Z(e("select",{"onUpdate:modelValue":f[1]||(f[1]=k=>a.value.scheduleType=k),onChange:f[2]||(f[2]=k=>a.value.days=Array(a.value.days.length).fill("OFF"))},[...f[12]||(f[12]=[e("option",{value:"ADMINISTRATIVE"},"Hành chính",-1),e("option",{value:"ROTATING"},"Xoay ca",-1)])],544),[[pe,a.value.scheduleType]])]),e("label",null,[f[15]||(f[15]=O(" Bộ phận ",-1)),Z(e("select",{"onUpdate:modelValue":f[3]||(f[3]=k=>a.value.department=k)},[f[14]||(f[14]=e("option",{value:""},"Tất cả",-1)),(o(!0),i(P,null,R(n.departments,k=>(o(),i("option",{key:k},s(k),1))),128))],512),[[pe,a.value.department]])]),e("label",null,[f[17]||(f[17]=O(" Loại mẫu ",-1)),Z(e("select",{"onUpdate:modelValue":f[4]||(f[4]=k=>a.value.kind=k),onChange:f[5]||(f[5]=k=>a.value.days=Array(7).fill("OFF"))},[...f[16]||(f[16]=[e("option",{value:"WEEK"},"Mẫu tuần",-1),e("option",{value:"CYCLE"},"Chu kỳ xoay",-1)])],544),[[pe,a.value.kind]])])]),e("div",Uo,[(o(!0),i(P,null,R(a.value.days,(k,T)=>(o(),i("label",{key:T},[O(s(a.value.kind==="WEEK"?d[T]:"Ngày "+(T+1))+" ",1),Z(e("select",{"onUpdate:modelValue":q=>a.value.days[T]=q},[f[18]||(f[18]=e("option",{value:"OFF"},"Nghỉ",-1)),(o(!0),i(P,null,R(n.shifts.filter(q=>q.active&&q.scheduleType===a.value.scheduleType),q=>(o(),i("option",{key:q.id,value:q.id},s(q.name),9,Ho))),128))],8,Ro),[[pe,a.value.days[T]]])]))),128)),a.value.kind==="CYCLE"?(o(),i("button",{key:0,onClick:f[6]||(f[6]=k=>a.value.days.push("OFF"))}," + Thêm ngày ")):I("",!0),a.value.kind==="CYCLE"&&a.value.days.length>1?(o(),i("button",{key:1,onClick:f[7]||(f[7]=k=>a.value.days.pop())}," Bỏ ngày cuối ")):I("",!0)]),e("label",null,[f[19]||(f[19]=O("Ghi chú",-1)),Z(e("textarea",{"onUpdate:modelValue":f[8]||(f[8]=k=>a.value.note=k)},null,512),[[He,a.value.note]])])],8,Mo),n.error?(o(),i("p",zo,s(n.error),1)):I("",!0),t.value?I("",!0):(o(),i("button",{key:1,class:"primary",disabled:n.busy,onClick:f[9]||(f[9]=k=>v("save"))},s(n.busy?"Đang lưu…":"Lưu mẫu"),9,Go))])]),_:1},8,["visible","header"]))}});function et(n,c=ln(new Date().toISOString())){if(!/^\d{4}-\d{2}-\d{2}$/.test(n))return!1;const{from:u}=zn(n,"week");return u>=c}const Xo=Pe`
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
`;async function jo(n,c){if(!n||!et(c))throw new Error("Chỉ được tạo lịch tuần tương lai hoặc tuần hiện tại vào thứ Hai.");const{from:u,to:t}=zn(c,"week"),{data:a}=await Me.mutate({mutation:Xo,variables:{maBoPhan:n,tuNgay:u,denNgay:t},errorPolicy:"none"});if(!(a!=null&&a.createLichXoayCa))throw new Error("Không nhận được kết quả xếp ca.");return a.createLichXoayCa}const Wo={key:0,class:"auto-schedule"},Yo=["disabled"],Qo={key:0},Jo={key:1},Zo={key:0,class:"schedule-dialog-body"},_o={key:0,class:"schedule-dialog-details"},ei={key:1,class:"schedule-dialog-message warning"},ni=ge({__name:"ScheduleRotatingDialog",props:{eligible:{type:Boolean},departmentCode:{},anchor:{},week:{type:Boolean},disabled:{type:Boolean}},emits:["saved","busy"],setup(n,{emit:c}){const u=sn(),t=n,a=c,v=$(!1),d=$(!1),m=$(),f=W(()=>t.week&&et(t.anchor));async function k(){if(!(!t.eligible||t.disabled||v.value||!t.departmentCode||!t.week||!et(t.anchor))){v.value=!0,a("busy",!0);try{m.value=await jo(t.departmentCode,t.anchor),m.value.isResults?a("saved"):(m.value.message=me(m.value),u.error(m.value.message))}catch(T){u.error(T),m.value={isResults:!1,message:me(T)}}finally{d.value=!0,v.value=!1,a("busy",!1)}}}return(T,q)=>(o(),i(P,null,[n.eligible?(o(),i("div",Wo,[e("button",{type:"button",class:"auto-schedule-button",disabled:n.disabled||v.value||!f.value||!n.departmentCode,onClick:k},s(v.value?"Đang tạo lịch…":"Tự động tạo lịch"),9,Yo),n.week?f.value?I("",!0):(o(),i("p",Jo,"Chỉ được tạo lịch tuần tương lai hoặc tuần hiện tại vào thứ Hai.")):(o(),i("p",Qo,"Chọn chế độ tuần để tự động tạo lịch."))])):I("",!0),G(z(Se),{class:"schedule-dialog",visible:d.value,"onUpdate:visible":q[1]||(q[1]=x=>d.value=x),modal:"",header:"Kết quả xếp ca",style:{width:"520px",maxWidth:"95vw"}},{footer:te(()=>[G(ve,{type:"button",label:"Đóng",severity:"secondary",outlined:"",onClick:q[0]||(q[0]=x=>d.value=!1)})]),default:te(()=>{var x;return[m.value?(o(),i("div",Zo,[e("p",{class:Q(["schedule-dialog-message",m.value.isResults?"success":"error"]),role:"status"},s(m.value.message||(m.value.isResults?"Tạo lịch thành công.":"Tạo lịch không thành công.")),3),m.value.data?(o(),i("dl",_o,[q[2]||(q[2]=e("dt",null,"Bộ phận",-1)),e("dd",null,s(m.value.data.maBoPhan),1),q[3]||(q[3]=e("dt",null,"Từ ngày",-1)),e("dd",null,s(m.value.data.tuNgay),1),q[4]||(q[4]=e("dt",null,"Đến ngày",-1)),e("dd",null,s(m.value.data.denNgay),1),q[5]||(q[5]=e("dt",null,"Số phân công",-1)),e("dd",null,s(m.value.data.soPhanCong),1),q[6]||(q[6]=e("dt",null,"Số ca làm việc",-1)),e("dd",null,s(m.value.data.soCaLamViec),1),q[7]||(q[7]=e("dt",null,"Số ngày DO000",-1)),e("dd",null,s(m.value.data.soNgayDO000),1),q[8]||(q[8]=e("dt",null,"Đủ định biên",-1)),e("dd",null,s(m.value.data.duDinhBien?"Có":"Không"),1),q[9]||(q[9]=e("dt",null,"Tất cả nhân viên đủ sáu ngày",-1)),e("dd",null,s(m.value.data.tatCaNhanVienDuSauNgay?"Có":"Không"),1)])):I("",!0),(x=m.value.data)!=null&&x.canhBao?(o(),i("p",ei,s(Array.isArray(m.value.data.canhBao)?m.value.data.canhBao.join(`
`):m.value.data.canhBao),1)):I("",!0)])):I("",!0)]}),_:1},8,["visible"])],64))}});function Rn(n=new Date){const c=new Date(n.getTime()+252e5);return{month:c.getUTCMonth()+1,year:c.getUTCFullYear()}}function ti(n,c,u=new Date){const t=Rn(u);if(!Number.isInteger(n)||!Number.isInteger(c)||n<1||n>12||c<1)throw new Error("Vui lòng chọn tháng và năm hợp lệ.");if(c<t.year||c===t.year&&n<t.month)throw new Error("Không thể phân ca cho tháng/năm quá khứ.")}const li=Pe`
  mutation CreateLichHanhChinh($thang: Int!, $nam: Int!) {
    createLichHanhChinh(thang: $thang, nam: $nam) {
      isResults
      message
    }
  }
`;async function ai(n,c){var t,a;ti(n,c);const{data:u}=await Me.mutate({mutation:li,variables:{thang:n,nam:c},errorPolicy:"none"});if(!((t=u==null?void 0:u.createLichHanhChinh)!=null&&t.isResults))throw new Error(((a=u==null?void 0:u.createLichHanhChinh)==null?void 0:a.message)||"Phân ca hành chính thất bại.");return u.createLichHanhChinh.message||"Phân ca hành chính thành công."}const oi={class:"period-fields"},ii=ge({__name:"ScheduleAdministrativeDialog",props:{disabled:{type:Boolean}},emits:["saved","busy"],setup(n,{emit:c}){const u=n,t=c,a=sn(),v=$(!1),d=$(!1),m=$(Rn()),f=$(m.value.month),k=$(m.value.year),T=W(()=>Array.from({length:12},(p,M)=>({value:M+1,label:"Tháng "+(M+1)})).filter(p=>k.value!==m.value.year||p.value>=m.value.month)),q=W(()=>Array.from({length:Math.max(0,2100-m.value.year+1)},(p,M)=>({value:m.value.year+M,label:String(m.value.year+M)})));ee(k,p=>{p===m.value.year&&(f.value==null||f.value<m.value.month)&&(f.value=m.value.month)});function x(){u.disabled||d.value||(m.value=Rn(),f.value=m.value.month,k.value=m.value.year,v.value=!0)}async function h(){if(!(d.value||u.disabled)){d.value=!0,t("busy",!0);try{const p=await ai(f.value,k.value);a.success(p),v.value=!1,t("saved")}catch(p){a.error(p)}finally{d.value=!1,t("busy",!1)}}}return(p,M)=>(o(),i(P,null,[G(ve,{label:"Phân ca hành chính",icon:"pi pi-calendar-plus",disabled:n.disabled||d.value,onClick:x},null,8,["disabled"]),G(z(Se),{class:"schedule-dialog",visible:v.value,modal:"",header:"Phân ca hành chính",closable:!d.value,"close-on-escape":!d.value,style:{width:"440px",maxWidth:"95vw"},"onUpdate:visible":M[3]||(M[3]=U=>!d.value&&(v.value=U))},{default:te(()=>[e("form",{class:"period-form",onSubmit:Tt(h,["prevent"])},[e("div",oi,[e("label",null,[M[4]||(M[4]=O("Tháng",-1)),G(z(an),{modelValue:f.value,"onUpdate:modelValue":M[0]||(M[0]=U=>f.value=U),options:T.value,"option-label":"label","option-value":"value",disabled:d.value,placeholder:"Chọn tháng"},null,8,["modelValue","options","disabled"])]),e("label",null,[M[5]||(M[5]=O("Năm",-1)),G(z(an),{modelValue:k.value,"onUpdate:modelValue":M[1]||(M[1]=U=>k.value=U),options:q.value,"option-label":"label","option-value":"value",filter:"",disabled:d.value,placeholder:"Chọn năm"},null,8,["modelValue","options","disabled"])])]),e("footer",null,[G(ve,{type:"button",label:"Hủy",severity:"secondary",outlined:"",disabled:d.value,onClick:M[2]||(M[2]=U=>v.value=!1)},null,8,["disabled"]),G(ve,{type:"submit",label:"Xác nhận",icon:"pi pi-check",loading:d.value,disabled:f.value==null||k.value==null||k.value<m.value.year},null,8,["loading","disabled"])])],32)]),_:1},8,["visible","closable","close-on-escape"])],64))}}),si=Ye(ii,[["__scopeId","data-v-1f0b35a9"]]),ri={class:"assignment-calendar"},ui={class:"calendar-toolbar"},di={class:"calendar-navigation"},ci=["aria-label","disabled"],vi=["value","disabled"],hi=["value","disabled"],mi=["aria-label","disabled"],pi={key:2},gi={class:"view-toggle",role:"group","aria-label":"Phạm vi lịch phân công"},fi=["aria-pressed"],yi=["aria-pressed"],bi={class:"employee-calendar-wrap"},qi={class:"employee-calendar"},ki={class:"employee-column"},wi={class:"department-column"},Ti=["title"],Ci=["disabled","aria-label","onClick"],$i={key:0},Di={key:0},Ii=["colspan"],Si=["disabled"],Ni={class:"schedule-dialog-summary"},xi={class:"full-time"},Ei={key:0},Vi={key:0,class:"full-time"},Ai={key:1},Li={key:2},Oi={key:3,role:"alert"},Bi={key:0},Pi={key:2,class:"schedule-dialog-message error",role:"alert"},Mi={class:"schedule-dialog-actions"},Fi={class:"schedule-dialog-body"},Ui={class:"schedule-dialog-summary"},Ri={class:"schedule-dialog-details"},Hi=ge({__name:"AssignmentCalendar",props:{employees:{},shifts:{},existingAssignments:{},canEdit:{type:Boolean},scheduledDates:{},shiftsLoading:{type:Boolean},shiftsError:{},modelValue:{},createAssignment:{type:Function},initialDate:{},viewMode:{},anchorDate:{},fixedDate:{},disabled:{type:Boolean},administrative:{type:Boolean},administrativeShiftId:{}},emits:["edit","request-shifts","update:modelValue","update:viewMode","update:anchorDate"],setup(n,{emit:c}){const u=sn(),t=n,a=c,v=$(!1),d=$(!1),m=$(),f=$(!1),k=$(""),T=$(""),q=$(!0),x=$(""),h=$(""),p=$(""),M=$("12:00");ee(()=>t.disabled,F=>{F&&!v.value&&(f.value=!1,d.value=!1)});const U=W(()=>t.shifts.find(F=>F.id===T.value)),w=W(()=>{var F;return!t.administrative&&!!((F=U.value)!=null&&F.code.endsWith("XX"))}),C=W(()=>{if(t.administrative&&!q.value)return M.value;if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(p.value))return"";const[F,D]=p.value.split(":").map(Number);return`${String((F+(q.value?8:4))%24).padStart(2,"0")}:${String(D).padStart(2,"0")}`}),b=W(()=>!!C.value&&C.value<=p.value);ee([T,U],()=>{var F,D,V,E;if(t.administrative){p.value="08:00";return}p.value=((F=fe(k.value))==null?void 0:F.shiftId)===T.value?((D=fe(k.value))==null?void 0:D.startTime)||((V=U.value)==null?void 0:V.startTime)||"":((E=U.value)==null?void 0:E.startTime)||""});const g=$(Fn());let j;tn(()=>{j=setInterval(()=>{g.value=Fn()},3e4)}),on(()=>clearInterval(j));const S=["T2","T3","T4","T5","T6","T7","CN"],N=$(""),B=W(()=>t.employees.find(F=>F.code===N.value)),Y=W(()=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(t.anchorDate))return[];const F=new Date(t.anchorDate+"T12:00:00");if(Number.isNaN(F.getTime()))return[];t.viewMode==="week"?F.setDate(F.getDate()-(F.getDay()+6)%7):F.setDate(1);const D=t.viewMode==="week"?7:new Date(F.getFullYear(),F.getMonth()+1,0).getDate();return Array.from({length:D},(V,E)=>{const X=new Date(F);return X.setDate(X.getDate()+E),`${X.getFullYear()}-${String(X.getMonth()+1).padStart(2,"0")}-${String(X.getDate()).padStart(2,"0")}`})});function _(F){const D=new Date(t.anchorDate+"T12:00:00");t.viewMode==="month"?(D.setDate(1),D.setMonth(D.getMonth()+F)):D.setDate(D.getDate()+F*7),le(D)}function le(F){a("update:anchorDate",`${F.getFullYear()}-${String(F.getMonth()+1).padStart(2,"0")}-${String(F.getDate()).padStart(2,"0")}`)}function Ee(F){/^\d{4}-\d{2}$/.test(F)&&le(new Date(`${F}-01T12:00:00`))}function Te(F){return new Date(`${F}T12:00:00`).toLocaleDateString("vi-VN")}function fe(F,D=N.value){return t.modelValue.find(V=>V.date===F&&V.employeeId===D)}function ae(F,D){var V,E;return t.fixedDate===F?!1:((V=t.scheduledDates)==null?void 0:V.some(X=>X.employeeId===D&&X.dates.includes(F)))||((E=t.existingAssignments)==null?void 0:E.some(X=>X.employeeId===D&&X.date===F))}function Ve(F,D){var V,E;return((E=(V=t.existingAssignments)==null?void 0:V.find(X=>X.employeeId===D&&X.date===F))==null?void 0:E.assignmentSource)==="S"}function Ce(F){return t.administrative&&new Date(`${F}T12:00:00`).getDay()===0}function Ae(F,D){var X,K;if(v.value||d.value)return;const V=(X=t.existingAssignments)==null?void 0:X.find(be=>be.employeeId===D&&be.date===F);if(V&&t.canEdit&&!t.disabled&&!Ie(F)){a("edit",V);return}if(t.administrative||t.disabled||Ce(F)||Ie(F)||ae(F,D))return;N.value=D;const E=fe(F);k.value=F,T.value=t.administrative?t.administrativeShiftId||"":(E==null?void 0:E.shiftId)||"",q.value=t.createAssignment?!0:(E==null?void 0:E.fullTime)??!0,x.value=(E==null?void 0:E.note)||"",h.value="",p.value=t.administrative?"08:00":(E==null?void 0:E.startTime)||((K=U.value)==null?void 0:K.startTime)||"",M.value=(E==null?void 0:E.fullTime)===!1&&E.endTime||"12:00",f.value=!0,t.administrative||a("request-shifts")}function ze(){var F,D,V;if(!(t.disabled||v.value)){if(t.administrative&&!q.value&&(!/^([01]\d|2[0-3]):[0-5]\d$/.test(M.value)||M.value<="08:00"||M.value>"16:00")){h.value="Giờ kết thúc phải sau 08:00 và không quá 16:00.";return}if(Ie(k.value)){h.value="Không được phân công ngày trong quá khứ.";return}if(!(!t.administrative&&(t.shiftsLoading||t.shiftsError))){if(w.value&&!C.value){h.value="Vui lòng nhập giờ bắt đầu hợp lệ.";return}if(!t.administrative&&(!T.value||T.value!=="OFF"&&!t.shifts.some(E=>E.id===T.value))||t.administrative&&!t.administrativeShiftId){h.value="Vui lòng chọn ca đang hoạt động.";return}if(t.createAssignment){const E=U.value;if(!E||!E.active||E.workType==="0"){h.value="Vui lòng chọn ca làm việc đang hoạt động.";return}if(!q.value){h.value="Vui lòng chọn toàn thời gian để tạo phân công ca.";return}m.value={employeeId:N.value,date:k.value,shiftId:E.id,fullTime:!0,note:x.value,startTime:w.value?p.value:E.startTime,endTime:w.value?C.value:E.endTime,crossDay:w.value?b.value:E.crossDay},d.value=!0;return}a("update:modelValue",[...t.modelValue.filter(E=>E.date!==k.value||E.employeeId!==N.value),{employeeId:N.value,date:k.value,shiftId:t.administrative?t.administrativeShiftId:T.value,fullTime:T.value==="OFF"?!0:q.value,note:t.administrative?"":x.value,...t.administrative&&!q.value?{startTime:p.value,endTime:C.value,crossDay:b.value}:{},...!t.administrative&&T.value!=="OFF"?{startTime:w.value?p.value:(F=U.value)==null?void 0:F.startTime,endTime:w.value?C.value:(D=U.value)==null?void 0:D.endTime,crossDay:w.value?b.value:(V=U.value)==null?void 0:V.crossDay}:{}}].sort((E,X)=>E.date.localeCompare(X.date))),f.value=!1}}}async function Fe(){if(d.value&&!(!d.value||!m.value||!t.createAssignment||v.value||t.disabled)){if(Ie(m.value.date)||ae(m.value.date,m.value.employeeId)){d.value=!1,h.value="Ngày phân công không còn hợp lệ hoặc nhân viên đã được phân ca. Vui lòng tải lại lịch.";return}v.value=!0,h.value="";try{await t.createAssignment({...m.value}),d.value=!1,f.value=!1,m.value=void 0}catch(F){u.error(F),d.value=!1,h.value=me(F)}finally{v.value=!1}}}function Ge(){a("update:modelValue",t.modelValue.filter(F=>F.date!==k.value||F.employeeId!==N.value)),f.value=!1}function ue(F,D=N.value){var X,K,be,qe,Ue;const V=(X=t.existingAssignments)==null?void 0:X.find(ye=>ye.employeeId===D&&ye.date===F);if(V)return((K=V.shiftSymbol)==null?void 0:K.trim())||((be=t.shifts.find(ye=>ye.id===V.shiftId))==null?void 0:be.code)||V.shiftId;const E=fe(F,D);return E?E.shiftId==="OFF"?"Nghỉ":((qe=t.shifts.find(ye=>ye.id===E.shiftId))==null?void 0:qe.code)||E.shiftId:ae(F,D)?t.administrative&&(((Ue=t.shifts.find(ye=>ye.id===t.administrativeShiftId))==null?void 0:Ue.code)||t.administrativeShiftId)||"Đã xếp":Ce(F)?"Không xếp":""}function Qe(F,D){var Re,Ne;const V=(Re=t.existingAssignments)==null?void 0:Re.find(Le=>Le.employeeId===D&&Le.date===F),E=fe(F,D);if(!V&&!E)return;const X=t.shifts.find(Le=>Le.id===((V==null?void 0:V.shiftId)||(E==null?void 0:E.shiftId))),K=((Ne=t.employees.find(Le=>Le.code===D))==null?void 0:Ne.name)||(V==null?void 0:V.employeeName)||D,be=(V==null?void 0:V.shiftName)||(X==null?void 0:X.name)||ue(F,D),qe=(V==null?void 0:V.startTime)||(E==null?void 0:E.startTime)||(X==null?void 0:X.startTime),Ue=(V==null?void 0:V.endTime)||(E==null?void 0:E.endTime)||(X==null?void 0:X.endTime),ye=(V==null?void 0:V.crossDay)??(E==null?void 0:E.crossDay)??(X==null?void 0:X.crossDay);return[`Họ tên: ${K} (${D})`,`Ngày làm việc: ${Te(F)}`,`Ca làm việc: ${be}`,`Thời gian làm việc: ${qe||"—"}–${Ue||"—"}${ye?" (+1 ngày)":""}`].join(`
`)}return(F,D)=>(o(),i("section",ri,[e("div",ui,[e("div",null,[D[17]||(D[17]=e("h3",null,"Lịch phân công theo nhân viên",-1)),e("p",null,s(n.administrative?"Lịch hành chính được sắp xếp sẵn.":"Bấm ô ngày của nhân viên để chọn ca.")+" "+s(n.employees.length)+" nhân viên · "+s(n.modelValue.length)+" phân công đã chọn. ",1)]),e("div",di,[e("button",{type:"button","aria-label":n.viewMode==="week"?"Tuần trước":"Tháng trước",disabled:!!n.fixedDate,onClick:D[0]||(D[0]=V=>_(-1))}," ‹",8,ci),n.viewMode==="week"?(o(),i("input",{key:0,value:n.anchorDate,type:"date","aria-label":"Ngày trong tuần phân công",disabled:!!n.fixedDate,onInput:D[1]||(D[1]=V=>le(new Date(V.target.value+"T12:00:00")))},null,40,vi)):(o(),i("input",{key:1,value:n.anchorDate.slice(0,7),type:"month","aria-label":"Tháng phân công",disabled:!!n.fixedDate,onInput:D[2]||(D[2]=V=>Ee(V.target.value))},null,40,hi)),e("button",{type:"button","aria-label":n.viewMode==="week"?"Tuần sau":"Tháng sau",disabled:!!n.fixedDate,onClick:D[3]||(D[3]=V=>_(1))}," › ",8,mi),Y.value.length?(o(),i("strong",pi,s(Te(Y.value[0]))+" – "+s(Te(Y.value[Y.value.length-1])),1)):I("",!0),e("div",gi,[e("button",{type:"button",class:Q({active:n.viewMode==="week"}),"aria-pressed":n.viewMode==="week",onClick:D[4]||(D[4]=V=>a("update:viewMode","week"))}," Tuần ",10,fi),e("button",{type:"button",class:Q({active:n.viewMode==="month"}),"aria-pressed":n.viewMode==="month",onClick:D[5]||(D[5]=V=>a("update:viewMode","month"))}," Tháng ",10,yi)])])]),e("div",bi,[e("table",qi,[e("thead",null,[e("tr",null,[D[18]||(D[18]=e("th",{class:"employee-column"},"Nhân viên",-1)),D[19]||(D[19]=e("th",{class:"department-column"},"Bộ phận",-1)),(o(!0),i(P,null,R(Y.value,V=>(o(),i("th",{key:V,class:Q({weekend:[0,6].includes(new Date(V+"T12:00:00").getDay())})},[O(s(S[(new Date(V+"T12:00:00").getDay()+6)%7]),1),e("small",null,s(Number(V.slice(-2)))+"/"+s(Number(V.slice(5,7))),1)],2))),128))])]),e("tbody",null,[(o(!0),i(P,null,R(n.employees,V=>(o(),i("tr",{key:V.code},[e("th",ki,[e("strong",null,s(V.name),1),e("small",null,s(V.code),1)]),e("td",wi,s(V.department||"Chưa có bộ phận"),1),(o(!0),i(P,null,R(Y.value,E=>{var X,K;return o(),i("td",{key:E,title:Qe(E,V.code),class:Q({weekend:[0,6].includes(new Date(E+"T12:00:00").getDay())})},[e("button",{type:"button",class:Q({picked:!!fe(E,V.code),assigned:ae(E,V.code),"source-s":Ve(E,V.code)}),disabled:n.administrative&&!(n.canEdit&&ae(E,V.code))||n.disabled||E<g.value||!!n.fixedDate&&E!==n.fixedDate||Ce(E)||ae(E,V.code)&&!n.canEdit,"aria-label":V.name+" · "+E+" · "+ue(E,V.code),onClick:be=>Ae(E,V.code)},[e("strong",null,s(ue(E,V.code)||"+ Chọn ca"),1),fe(E,V.code)&&((X=fe(E,V.code))==null?void 0:X.shiftId)!=="OFF"?(o(),i("small",$i,s((K=fe(E,V.code))!=null&&K.fullTime?"Cả ca":"1/2 ca"),1)):I("",!0)],10,Ci)],10,Ti)}),128))]))),128)),n.employees.length?I("",!0):(o(),i("tr",Di,[e("td",{colspan:Y.value.length+2,class:"empty-state"}," Không tìm thấy nhân viên thuộc bộ phận hoặc từ khóa đã chọn. ",8,Ii)]))])])]),G(z(Se),{class:"schedule-dialog",visible:f.value,"onUpdate:visible":D[14]||(D[14]=V=>f.value=V),modal:"",closable:!v.value,"close-on-escape":!v.value,header:n.createAssignment?"Tạo phân công ca":"Chọn ca",style:{width:"520px",maxWidth:"95vw"}},{default:te(()=>{var V,E,X;return[e("fieldset",{class:"day-shift-dialog",disabled:v.value||d.value},[e("p",Ni,[e("strong",null,s((V=B.value)==null?void 0:V.name),1),O(" · "+s((E=B.value)==null?void 0:E.code),1),D[20]||(D[20]=e("br",null,null,-1)),O(s(Te(k.value))+" · "+s((X=B.value)==null?void 0:X.department),1)]),n.administrative?(o(),i(P,{key:0},[e("label",xi,[Z(e("input",{"onUpdate:modelValue":D[6]||(D[6]=K=>q.value=K),type:"checkbox"},null,512),[[Zn,q.value]]),D[21]||(D[21]=O("Toàn ca",-1))]),q.value?I("",!0):(o(),i("label",Ei,[D[22]||(D[22]=O("Giờ kết thúc",-1)),G(z(Pn),{modelValue:M.value,"onUpdate:modelValue":D[7]||(D[7]=K=>M.value=K),type:"time",min:"08:01",max:"16:00",required:""},null,8,["modelValue"])]))],64)):(o(),i(P,{key:1},[e("label",null,[D[23]||(D[23]=O("Ca làm việc *",-1)),G(z(an),{modelValue:T.value,"onUpdate:modelValue":D[8]||(D[8]=K=>T.value=K),options:[...n.shifts.map(K=>({value:K.id,label:K.code+" · "+K.name+(K.startTime&&K.endTime?" · "+K.startTime+"–"+K.endTime:"")+(K.crossDay?" (+1 ngày)":"")})),...n.createAssignment?[]:[{value:"OFF",label:"Nghỉ"}]],"option-label":"label","option-value":"value",placeholder:"Chọn ca làm việc",disabled:v.value||d.value||n.shiftsLoading||!!n.shiftsError},null,8,["modelValue","options","disabled"])]),!n.createAssignment&&T.value&&T.value!=="OFF"?(o(),i("label",Vi,[Z(e("input",{"onUpdate:modelValue":D[9]||(D[9]=K=>q.value=K),type:"checkbox"},null,512),[[Zn,q.value]]),D[24]||(D[24]=O("Toàn thời gian",-1))])):I("",!0),T.value&&T.value!=="OFF"?(o(),i("p",Ai,[O(s(q.value?"Làm cả ca đã chọn.":"Làm 1/2 ca đã chọn.")+" ",1),q.value?I("",!0):(o(),i(P,{key:0},[O("Khung giờ cụ thể của nửa ca chưa được xác định.")],64))])):I("",!0),n.shiftsLoading?(o(),i("p",Li,"Đang tải danh sách ca...")):I("",!0),n.shiftsError?(o(),i("p",Oi,[O(s(n.shiftsError)+" ",1),G(ve,{type:"button",label:"Thử lại",text:"",size:"small",onClick:D[10]||(D[10]=K=>a("request-shifts"))})])):I("",!0),w.value?(o(),i(P,{key:4},[e("label",null,[D[25]||(D[25]=O("Giờ bắt đầu *",-1)),G(z(Pn),{modelValue:p.value,"onUpdate:modelValue":D[11]||(D[11]=K=>p.value=K),type:"time",required:""},null,8,["modelValue"])]),e("label",null,[D[26]||(D[26]=O("Giờ kết thúc",-1)),G(z(Pn),{"model-value":C.value,type:"time",readonly:""},null,8,["model-value"])]),b.value?(o(),i("p",Bi,"Giờ kết thúc thuộc ngày hôm sau.")):I("",!0)],64)):I("",!0),e("label",null,[D[27]||(D[27]=O("Ghi chú",-1)),G(z(sl),{modelValue:x.value,"onUpdate:modelValue":D[12]||(D[12]=K=>x.value=K),rows:"3","auto-resize":"",placeholder:"Nhập ghi chú (nếu có)"},null,8,["modelValue"])])],64)),h.value?(o(),i("p",Pi,s(h.value),1)):I("",!0),e("div",Mi,[fe(k.value)?(o(),ce(ve,{key:0,type:"button",label:"Bỏ ngày này",severity:"danger",text:"",onClick:Ge})):I("",!0),G(ve,{type:"button",label:"Hủy",severity:"secondary",outlined:"",onClick:D[13]||(D[13]=K=>f.value=!1)}),G(ve,{type:"button",label:n.createAssignment?"Tạo ca":"Chọn ca",icon:"pi pi-check",disabled:!n.administrative&&(n.shiftsLoading||!!n.shiftsError),onClick:ze},null,8,["label","disabled"])])],8,Si)]}),_:1},8,["visible","closable","close-on-escape","header"]),G(z(Se),{class:"schedule-dialog",visible:d.value,modal:"",header:"Xác nhận tạo phân công ca",closable:!v.value,"close-on-escape":!v.value,style:{width:"520px",maxWidth:"95vw"},"onUpdate:visible":D[16]||(D[16]=V=>!v.value&&(d.value=V))},{footer:te(()=>[G(ve,{type:"button",label:"Quay lại",severity:"secondary",outlined:"",disabled:v.value,onClick:D[15]||(D[15]=V=>d.value=!1)},null,8,["disabled"]),G(ve,{type:"button",label:"Xác nhận tạo ca",icon:"pi pi-check",loading:v.value,disabled:v.value,onClick:Fe},null,8,["loading","disabled"])]),default:te(()=>{var V,E,X,K,be,qe,Ue,ye,Re,Ne;return[e("div",Fi,[e("p",Ui,[D[28]||(D[28]=O(" Xác nhận tạo ca cho ",-1)),e("strong",null,s((V=B.value)==null?void 0:V.name)+" ("+s((E=m.value)==null?void 0:E.employeeId)+")",1),D[29]||(D[29]=O(". ",-1))]),e("dl",Ri,[D[31]||(D[31]=e("dt",null,"Ngày làm việc",-1)),e("dd",null,s((X=m.value)!=null&&X.date?Te(m.value.date):""),1),D[32]||(D[32]=e("dt",null,"Bộ phận",-1)),e("dd",null,s(((K=B.value)==null?void 0:K.department)||"—"),1),D[33]||(D[33]=e("dt",null,"Ca làm việc",-1)),e("dd",null,s((be=U.value)==null?void 0:be.code)+" · "+s((qe=U.value)==null?void 0:qe.name),1),D[34]||(D[34]=e("dt",null,"Giờ làm",-1)),e("dd",null,s(((Ue=m.value)==null?void 0:Ue.startTime)||"Theo cấu hình ca")+" – "+s(((ye=m.value)==null?void 0:ye.endTime)||"Theo cấu hình ca")+s((Re=m.value)!=null&&Re.crossDay?" (+1 ngày)":""),1),(Ne=m.value)!=null&&Ne.note?(o(),i(P,{key:0},[D[30]||(D[30]=e("dt",null,"Ghi chú",-1)),e("dd",null,s(m.value.note),1)],64)):I("",!0)])])]}),_:1},8,["visible","closable","close-on-escape"])]))}}),zi=Ye(Hi,[["__scopeId","data-v-09bc8079"]]),Gi={class:"panel form"},Ki={class:"toolbar"},Xi={key:0,class:"actions"},ji={key:0},Wi={key:1,class:"assignment-workspace"},Yi={class:"department-tree-panel"},Qi={key:0,role:"status"},Ji={key:1,role:"alert"},Zi={key:2,"aria-label":"Cây bộ phận theo loại lịch"},_i=["aria-pressed","disabled","onClick"],es={key:0,class:"tree-hint"},ns={key:3,class:"tree-unavailable"},ts={class:"assignment-schedule-panel"},ls={key:0,class:"assignment-lock"},as={key:1,role:"status"},os={key:2,role:"alert",class:"error"},is={key:3,class:"department-schedule-type"},ss={key:4,class:"employee-picker"},rs={key:0},us=["checked"],ds=["value"],cs=["checked","disabled","onChange"],vs={key:1},hs={class:"actions schedule-actions"},ms=["disabled"],ps=ge({__name:"ScheduleAssignmentTab",props:we({editing:{},busy:{type:Boolean},canCreate:{type:Boolean},canEdit:{type:Boolean},canUpdate:{type:Boolean},canBulk:{type:Boolean},treeLoading:{type:Boolean},treeError:{},departmentGroups:{},unclassifiedDepartments:{},loadDepartmentTree:{type:Function},shiftsLoading:{type:Boolean},shiftsError:{},loadManualShifts:{type:Function},eligible:{},name:{type:Function},manualShifts:{},data:{},scheduledDates:{},start:{},administrativeShiftId:{},makePreview:{type:Function},createAssignment:{type:Function}},{bulk:{type:Boolean,required:!0},bulkModifiers:{},selected:{required:!0},selectedModifiers:{},formDepartment:{required:!0},formDepartmentModifiers:{},formSearch:{required:!0},formSearchModifiers:{},scheduleType:{required:!0},scheduleTypeModifiers:{},method:{required:!0},methodModifiers:{},dayPlans:{required:!0},dayPlansModifiers:{},calendarMode:{required:!0},calendarModeModifiers:{},calendarAnchor:{required:!0},calendarAnchorModifiers:{}}),emits:we(["edit","reload","administrative-created","administrative-busy"],["update:bulk","update:selected","update:formDepartment","update:formSearch","update:scheduleType","update:method","update:dayPlans","update:calendarMode","update:calendarAnchor"]),setup(n,{emit:c}){const u=$(),t=ne(n,"bulk"),a=ne(n,"selected"),v=ne(n,"formDepartment"),d=ne(n,"formSearch"),m=ne(n,"scheduleType"),f=ne(n,"method"),k=ne(n,"dayPlans"),T=ne(n,"calendarMode"),q=ne(n,"calendarAnchor"),x=c,h=n,p=W(()=>{var U;return((U=h.departmentGroups.flatMap(w=>w.departments).find(w=>w.name===v.value))==null?void 0:U.code)||""}),M=W(()=>h.manualShifts.some(U=>{var w;return U.active&&((w=U.workType)==null?void 0:w.trim().toUpperCase())==="C"}));return(U,w)=>{var b,g,j;const C=Hn("RouterLink");return o(),i("section",Gi,[e("div",Ki,[e("h2",null,s(n.editing?"Sửa phân công":"Tạo phân công"),1),n.editing?I("",!0):(o(),i("div",Xi,[n.canUpdate?(o(),ce(C,{key:0,class:"schedule-action-link",to:"/schedules/exchange"},{default:te(()=>[...w[19]||(w[19]=[O("Đổi ca",-1)])]),_:1})):I("",!0),n.canCreate?(o(),ce(si,{key:1,disabled:n.busy,onSaved:w[0]||(w[0]=S=>x("administrative-created")),onBusy:w[1]||(w[1]=S=>x("administrative-busy",S))},null,8,["disabled"])):I("",!0),e("button",{class:Q({chosen:!t.value}),onClick:w[2]||(w[2]=S=>{t.value=!1,a.value=[],f.value="calendar"})}," Cá nhân ",2),n.canBulk?(o(),i("button",{key:2,class:Q({chosen:t.value}),onClick:w[3]||(w[3]=S=>{t.value=!0,a.value=[]})}," Hàng loạt ",2)):I("",!0)]))]),n.canEdit?(o(),i("div",Wi,[e("aside",Yi,[w[22]||(w[22]=e("h3",null,"Bộ phận",-1)),w[23]||(w[23]=e("p",{class:"tree-hint"},"Chọn bộ phận để phân công ca",-1)),n.treeLoading?(o(),i("p",Qi,"Đang phân loại bộ phận…")):I("",!0),n.treeError?(o(),i("p",Ji,s(n.treeError),1)):I("",!0),n.treeLoading?I("",!0):(o(),i("nav",Zi,[(o(!0),i(P,null,R(n.departmentGroups,S=>(o(),i("details",{key:S.type,open:"",class:"department-tree-group"},[e("summary",null,[O(s(S.label)+" ",1),e("span",null,s(S.departments.length),1)]),(o(!0),i(P,null,R(S.departments,N=>(o(),i("button",{key:N.code,type:"button",class:Q({selected:v.value===N.name}),"aria-pressed":v.value===N.name,disabled:n.busy||!!n.editing,onClick:B=>v.value=N.name},[w[20]||(w[20]=e("i",{class:"pi pi-building","aria-hidden":"true"},null,-1)),e("span",null,[O(s(N.name),1),e("small",null,s(N.code),1)])],10,_i))),128)),S.departments.length?I("",!0):(o(),i("p",es,"Chưa có bộ phận"))]))),128))])),!n.treeLoading&&n.unclassifiedDepartments.length?(o(),i("div",ns,[w[21]||(w[21]=e("p",null,"Chưa xác định loại lịch hoặc chưa có ca hoạt động:",-1)),(o(!0),i(P,null,R(n.unclassifiedDepartments,S=>(o(),i("small",{key:S.code},s(S.name),1))),128)),e("button",{type:"button",onClick:w[4]||(w[4]=(...S)=>n.loadDepartmentTree&&n.loadDepartmentTree(...S))},"Tải lại")])):I("",!0)]),e("div",ts,[v.value?I("",!0):(o(),i("p",ls,[...w[24]||(w[24]=[e("i",{class:"pi pi-lock","aria-hidden":"true"},null,-1),O(" Chọn bộ phận ở bên trái để mở chức năng chọn ca. ",-1)])])),n.shiftsLoading?(o(),i("p",as,"Đang tải ca và xác định loại lịch…")):I("",!0),n.shiftsError?(o(),i("p",os,[O(s(n.shiftsError)+" ",1),e("button",{onClick:w[5]||(w[5]=(...S)=>n.loadManualShifts&&n.loadManualShifts(...S))},"Thử lại")])):I("",!0),v.value&&!n.shiftsLoading&&!n.shiftsError&&n.manualShifts.length?(o(),i("p",is," Loại lịch của bộ phận: "+s(m.value==="ADMINISTRATIVE"?"Hành chính":"Làm theo ca"),1)):I("",!0),e("h3",null,s(f.value==="calendar"?"Tìm nhân viên trong lịch":"1. Chọn nhân viên · "+a.value.length+" đã chọn"),1),Z(e("input",{"onUpdate:modelValue":w[6]||(w[6]=S=>d.value=S),placeholder:"Tìm mã NV hoặc họ tên","aria-label":"Tìm nhân viên"},null,512),[[He,d.value]]),f.value!=="calendar"?(o(),i("div",ss,[t.value?(o(),i("label",rs,[e("input",{type:"checkbox",checked:!!n.eligible.length&&n.eligible.every(S=>a.value.includes(S.code)),onChange:w[7]||(w[7]=S=>a.value=n.eligible.every(N=>a.value.includes(N.code))?[]:n.eligible.map(N=>N.code))},null,40,us),w[25]||(w[25]=O("Chọn tất cả kết quả ",-1))])):I("",!0),(o(!0),i(P,null,R(n.eligible,S=>(o(),i("label",{key:S.code},[t.value?Z((o(),i("input",{key:0,"onUpdate:modelValue":w[8]||(w[8]=N=>a.value=N),type:"checkbox",value:S.code},null,8,ds)),[[Zn,a.value]]):(o(),i("input",{key:1,type:"radio",name:"employee",checked:a.value.includes(S.code),disabled:!!n.editing,onChange:N=>a.value=[S.code]},null,40,cs)),O(s(n.name(S.code)),1)]))),128)),n.eligible.length?I("",!0):(o(),i("p",vs,"Không tìm thấy nhân viên."))])):I("",!0),f.value==="calendar"?(o(),ce(zi,{key:((b=n.editing)==null?void 0:b.id)||n.start,modelValue:k.value,"onUpdate:modelValue":w[9]||(w[9]=S=>k.value=S),employees:(n.editing?n.eligible.filter(S=>{var N;return S.code===((N=n.editing)==null?void 0:N.employeeId)}):n.eligible).map(S=>({code:S.code,name:S.name,department:String(S.department||"")})),shifts:n.manualShifts,"existing-assignments":n.data.assignments,"create-assignment":n.createAssignment,"can-edit":n.canUpdate&&!n.editing,onEdit:w[10]||(w[10]=S=>u.value=S),"scheduled-dates":n.scheduledDates,"shifts-loading":n.shiftsLoading,"shifts-error":n.shiftsError,onRequestShifts:n.loadManualShifts,"view-mode":T.value,"anchor-date":q.value,"onUpdate:viewMode":w[11]||(w[11]=S=>T.value=S),"onUpdate:anchorDate":w[12]||(w[12]=S=>q.value=S),administrative:m.value==="ADMINISTRATIVE","administrative-shift-id":n.administrativeShiftId,"initial-date":n.start,"fixed-date":(g=n.editing)==null?void 0:g.date,disabled:n.busy||!v.value||m.value==="ADMINISTRATIVE"&&(n.shiftsLoading||!!n.shiftsError||!n.administrativeShiftId)},null,8,["modelValue","employees","shifts","existing-assignments","create-assignment","can-edit","scheduled-dates","shifts-loading","shifts-error","onRequestShifts","view-mode","anchor-date","administrative","administrative-shift-id","initial-date","fixed-date","disabled"])):I("",!0),!n.editing&&n.canCreate?(o(),ce(ni,{key:6,eligible:M.value,"department-code":p.value,anchor:q.value,week:T.value==="week",disabled:n.busy||n.shiftsLoading||!!n.shiftsError,onBusy:w[13]||(w[13]=S=>x("administrative-busy",S)),onSaved:w[14]||(w[14]=S=>{k.value=[],x("reload")})},null,8,["eligible","department-code","anchor","week","disabled"])):I("",!0),e("div",hs,[e("button",{class:"primary",disabled:n.busy||!v.value||n.shiftsLoading||!!n.shiftsError||!n.manualShifts.length||(f.value==="calendar"?!k.value.length:!a.value.length),onClick:w[15]||(w[15]=(...S)=>n.makePreview&&n.makePreview(...S))}," Xem trước phân công ",8,ms),w[26]||(w[26]=e("span",null,"Không ghi đè lịch âm thầm.",-1))])])])):(o(),i("p",ji,"Bạn không có quyền phân công ca.")),G(Nt,{onBusy:w[16]||(w[16]=S=>x("administrative-busy",S)),assignment:u.value,"department-code":((j=[...n.departmentGroups.flatMap(S=>S.departments),...n.unclassifiedDepartments].find(S=>S.name===v.value))==null?void 0:j.code)||null,"employee-name":u.value?n.name(u.value.employeeId):"",onClose:w[17]||(w[17]=S=>u.value=void 0),onConfirmed:w[18]||(w[18]=S=>x("reload"))},null,8,["assignment","department-code","employee-name"])])}}}),gs=Ye(ps,[["__scopeId","data-v-c0bd536f"]]),fs={class:"toolbar"},ys={class:"actions"},bs={class:"actions"},qs=["onClick"],ks={key:0,class:"panel empty-state"},ws={key:0,class:"demo"},Ts={key:0},Cs={key:1,class:"panel month-calendar"},$s={class:"month-heading"},Ds={class:"calendar-employee"},Is={class:"month-shifts"},Ss=["title","onClick"],Ns={class:"assignment-date"},xs={key:0,class:"unassigned-note"},Es={key:2,class:"day-calendar"},Vs={class:"calendar-employee"},As={class:"day-shifts"},Ls=["title","onClick"],Os={class:"shift-symbol"},Bs={key:0,class:"day-unassigned"},Ps=["onClick"],Ms={key:3,class:"panel grid-wrap"},Fs=["title","disabled","onClick"],Us={key:1},Rs={key:4,class:"agenda"},Hs=["onClick"],zs=ge({__name:"ScheduleCalendarTab",props:we({employees:{},visibleEmployees:{},groupByDepartment:{type:Boolean},dates:{},today:{},shifts:{},canCreate:{type:Boolean},employeeAssignments:{type:Function},cell:{type:Function},matches:{type:Function},fmt:{type:Function},name:{type:Function},shiftName:{type:Function},symbol:{type:Function},label:{type:Function},pending:{type:Function}},{view:{required:!0},viewModifiers:{},anchor:{required:!0},anchorModifiers:{}}),emits:we(["move","open"],["update:view","update:anchor"]),setup(n,{emit:c}){const u=ne(n,"view"),t=ne(n,"anchor"),a=n,v=c,d=["T2","T3","T4","T5","T6","T7","CN"];function m(T){return T?T.status==="OFF"?"OFF":T.status==="LEAVE"?T.shiftSymbol||T.shiftId||"NP":a.symbol(T)||"—":"—"}const f=W(()=>{if(!a.groupByDepartment)return[{department:"",employees:a.visibleEmployees}];const T=new Map;for(const q of a.visibleEmployees){const x=q.department||"Chưa có bộ phận",h=T.get(x)||[];h.push(q),T.set(x,h)}return[...T.entries()].sort(([q],[x])=>q.localeCompare(x,"vi")).map(([q,x])=>({department:q,employees:x.sort((h,p)=>h.name.localeCompare(p.name,"vi"))}))});function k(T){if(!T)return"unassigned";const q="employeeId"in T?T:void 0;if((q==null?void 0:q.status)==="OFF"||(q==null?void 0:q.shiftId)==="OFF"||T.id==="OFF")return"off";if((q==null?void 0:q.status)==="LEAVE")return"leave";const x="employeeId"in T?a.shifts.find(w=>w.id===T.shiftId):T,h=String((x==null?void 0:x.code)||(q==null?void 0:q.shiftSymbol)||(q==null?void 0:q.shiftId)||"").toUpperCase(),p=String((x==null?void 0:x.name)||(q==null?void 0:q.shiftName)||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();if((q==null?void 0:q.scheduleType)==="ADMINISTRATIVE"||(x==null?void 0:x.scheduleType)==="ADMINISTRATIVE"||["D","HC","ADMINISTRATIVE"].includes(h)||p.includes("hanh chinh"))return"administrative";if(h.endsWith("XX")||p.includes("tuy chon")||p.includes("linh hoat")||p.includes("flex"))return"flexible";if(h==="M"||p.includes("sang")||p.includes("morning"))return"morning";if(h==="E"||p.includes("chieu")||p.includes("afternoon"))return"afternoon";if(h==="N"||p.includes("toi")||p.includes("dem")||p.includes("night"))return"night";const M=(q==null?void 0:q.startTime)||(x==null?void 0:x.startTime)||"",U=Number(M.slice(0,2));return M&&Number.isFinite(U)?U<5||U>=18?"night":U<11?"morning":"afternoon":"unassigned"}return(T,q)=>(o(),i(P,null,[e("div",fs,[e("div",ys,[e("button",{"aria-label":"Kỳ trước",onClick:q[0]||(q[0]=x=>v("move",-1))}," ‹ "),e("button",{onClick:q[1]||(q[1]=x=>t.value=n.today)}," Hôm nay "),e("button",{"aria-label":"Kỳ sau",onClick:q[2]||(q[2]=x=>v("move",1))}," › "),e("strong",null,s(n.fmt(n.dates[0]))+" – "+s(n.fmt(n.dates[n.dates.length-1])),1)]),e("div",bs,[(o(),i(P,null,R([{id:"day",name:"Ngày"},{id:"week",name:"Tuần"},{id:"month",name:"Tháng"}],x=>e("button",{key:x.id,class:Q({chosen:u.value===x.id}),onClick:h=>u.value=x.id},s(x.name),11,qs)),64))])]),q[7]||(q[7]=Zt('<div class="legend"><span class="shift-legend-item shift-tone--morning"><i></i>Ca sáng</span><span class="shift-legend-item shift-tone--afternoon"><i></i>Ca chiều</span><span class="shift-legend-item shift-tone--flexible"><i></i>Ca tùy chọn</span><span class="shift-legend-item shift-tone--night"><i></i>Ca tối</span><span class="shift-legend-item shift-tone--off"><i></i>OFF</span><span class="shift-legend-item shift-tone--administrative"><i></i>Hành chính</span><span class="shift-legend-item shift-tone--leave"><i></i>Nghỉ phép</span><span>↔ Chờ đổi ca</span></div>',1)),n.visibleEmployees.length?(o(),i(P,{key:1},[n.visibleEmployees.some(x=>n.dates.some(h=>n.cell(x.code,h)))?I("",!0):(o(),i("p",ws," Chưa có lịch làm việc trong khoảng thời gian này. Chọn Phân công ca để lập lịch. ")),(o(!0),i(P,null,R(f.value,x=>(o(),ce(_t(n.groupByDepartment?"details":"div"),{key:x.department||"selected-department",class:"department-calendar-group",open:n.groupByDepartment?!0:void 0},{default:te(()=>[n.groupByDepartment?(o(),i("summary",Ts,[e("strong",null,s(x.department),1),e("small",null,s(x.employees.length)+" nhân viên",1)])):I("",!0),u.value==="month"?(o(),i("section",Cs,[e("div",$s,[q[3]||(q[3]=e("strong",null,"Nhân viên / Bộ phận",-1)),e("strong",null,"Ca được phân công trong tháng · "+s(t.value.slice(0,7)),1)]),(o(!0),i(P,null,R(x.employees,h=>(o(),i("article",{key:h.code,class:"month-row"},[e("div",Ds,[e("strong",null,s(h.name),1),e("small",null,s(h.code),1),e("small",null,s(h.department||"Chưa có bộ phận"),1)]),e("div",Is,[(o(!0),i(P,null,R(n.employeeAssignments(h.code),p=>(o(),i("button",{key:p.id,class:Q(["assignment-chip",`shift-tone--${k(p)}`]),title:n.label(p),onClick:M=>v("open",h.code,p.date)},[e("span",Ns,s(n.fmt(p.date)),1),e("strong",null,s(n.symbol(p)),1)],10,Ss))),128)),n.employeeAssignments(h.code).length?I("",!0):(o(),i("p",xs," Chưa phân công ca trong tháng "))])]))),128))])):u.value==="day"?(o(),i("section",Es,[(o(!0),i(P,null,R(x.employees,h=>(o(),i("article",{key:h.code,class:"panel day-employee"},[e("div",Vs,[e("strong",null,s(h.name),1),e("small",null,s(h.code)+" · "+s(h.department||"Chưa có bộ phận"),1)]),e("div",As,[(o(!0),i(P,null,R(n.employeeAssignments(h.code),p=>(o(),i("button",{key:p.id,title:n.label(p),class:Q(["day-assignment",`shift-tone--${k(p)}`]),onClick:M=>v("open",h.code,p.date)},[e("strong",Os,s(n.symbol(p)),1)],10,Ls))),128)),n.employeeAssignments(h.code).length?I("",!0):(o(),i("div",Bs,[q[4]||(q[4]=e("span",null,"Chưa phân công",-1)),n.canCreate?(o(),i("button",{key:0,onClick:p=>v("open",h.code,n.dates[0])}," + Phân công ca ",8,Ps)):I("",!0)]))])]))),128))])):(o(),i("section",Ms,[e("table",{class:"schedule-grid",style:Ct({minWidth:240+n.dates.length*88+"px"})},[e("colgroup",null,[q[5]||(q[5]=e("col",{class:"employee-col"},null,-1)),(o(!0),i(P,null,R(n.dates,h=>(o(),i("col",{key:h}))),128))]),e("thead",null,[e("tr",null,[e("th",null,[q[6]||(q[6]=O(" NHÂN VIÊN",-1)),e("small",null,s(x.employees.length)+" nhân viên",1)]),(o(!0),i(P,null,R(n.dates,h=>(o(),i("th",{key:h,class:Q({today:h===n.today,weekend:[0,6].includes(new Date(h+"T12:00:00").getDay())})},[O(s(d[(new Date(h+"T12:00:00").getDay()+6)%7])+" ",1),e("small",null,s(n.fmt(h)),1)],2))),128))])]),e("tbody",null,[(o(!0),i(P,null,R(x.employees,h=>(o(),i("tr",{key:h.code},[e("th",null,[e("strong",null,s(h.name),1),e("small",null,s(h.code)+" · "+s(h.department),1)]),(o(!0),i(P,null,R(n.dates,p=>(o(),i("td",{key:p,class:Q({today:p===n.today,weekend:[0,6].includes(new Date(p+"T12:00:00").getDay())})},[n.matches(n.cell(h.code,p))?(o(),i("button",{key:0,class:Q(["shift-cell",`shift-tone--${k(n.cell(h.code,p))}`]),title:n.label(n.cell(h.code,p)),disabled:!n.cell(h.code,p)&&!n.canCreate,onClick:M=>v("open",h.code,p)},[e("strong",null,s(m(n.cell(h.code,p))),1)],10,Fs)):(o(),i("span",Us,"—"))],2))),128))]))),128))])],4)])),u.value==="week"?(o(),i("section",Rs,[(o(!0),i(P,null,R(n.dates,h=>(o(),i("article",{key:h,class:"panel"},[e("h3",null,s(n.fmt(h))+" "+s(h===n.today?"· Hôm nay":""),1),(o(!0),i(P,null,R(x.employees.filter(p=>n.matches(n.cell(p.code,h))),p=>(o(),i("button",{key:p.code,class:Q(["agenda-assignment",`shift-tone--${k(n.cell(p.code,h))}`]),onClick:M=>v("open",p.code,h)},[e("strong",null,s(n.name(p.code)),1),e("small",null,s(n.label(n.cell(p.code,h)))+" "+s(n.pending(n.cell(p.code,h))?"↔ Chờ đổi ca":""),1)],10,Hs))),128))]))),128))])):I("",!0)]),_:2},1032,["open"]))),128))],64)):(o(),i("div",ks," Không tìm thấy nhân viên theo bộ lọc. "))],64))}}),Gs={class:"tabs","aria-label":"Xếp ca"},Ks=ge({__name:"ScheduleModuleNavigation",props:{items:{},activeKey:{}},setup(n){return(c,u)=>{const t=Hn("RouterLink");return o(),i("nav",Gs,[(o(!0),i(P,null,R(n.items,a=>(o(),ce(t,{key:a.key,to:a.key==="calendar"?"/schedules":"/schedules/"+a.key,class:Q({active:n.activeKey===a.key})},{default:te(()=>[O(s(a.label),1)]),_:2},1032,["to","class"]))),128))])}}}),Xs=Pe`
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
`;async function js(n,c){if(!Number.isInteger(n)||n<2e3||n>2100||!Number.isInteger(c)||c<1||c>12)throw new Error("Tháng/năm báo cáo không hợp lệ.");const{data:u}=await Me.query({query:Xs,variables:{nam:n,thang:c},fetchPolicy:"no-cache",errorPolicy:"none"}),t=u==null?void 0:u.baoCaoCaLamViecThang;if(!(t!=null&&t.isResults)||!t.data)throw new Error((t==null?void 0:t.message)||"Không thể tải báo cáo ca làm việc.");return{...t.data,cotNgay:[...t.data.cotNgay||[]].sort((a,v)=>a.ngayTrongThang-v.ngayTrongThang),nhanVien:t.data.nhanVien||[]}}const Ws={class:"monthly-report"},Ys={class:"report-toolbar"},Qs={class:"report-controls"},Js={key:0,class:"report-status",role:"status"},Zs={key:1,class:"report-status error",role:"alert"},_s={class:"report-summary"},er={key:0,class:"outline-controls","aria-label":"Hiển thị nhóm bộ phận"},nr=["disabled"],tr=["disabled"],lr={class:"print-heading"},ar={class:"schedule-sheet"},or=["title"],ir={class:"department-heading"},sr={colspan:"3",scope:"rowgroup",class:"frozen department-label"},rr=["aria-expanded","aria-label","onClick"],ur={class:"outline-icon","aria-hidden":"true"},dr={class:"department-title"},cr={class:"department-count"},vr=["colspan"],hr={class:"frozen ordinal"},mr={class:"frozen employee-code"},pr={class:"frozen employee-name name"},gr={class:"department"},fr={class:"position"},yr=["title","onMouseenter"],br={key:0},qr=["colspan"],kr=ge({__name:"ScheduleReportsTab",setup(n){const c=Rn(),u=$(c.month),t=$(c.year),a=Array.from({length:12},(S,N)=>({value:N+1,label:"Tháng "+(N+1)})),v=Array.from({length:101},(S,N)=>({value:2e3+N,label:String(2e3+N)})),d=$(),m=$(!1),f=$(""),k=$(null),T=$(),q=$(new Set);let x=0;async function h(){const S=++x;m.value=!0,f.value="",d.value=void 0,q.value=new Set;try{const N=await js(t.value,u.value);S===x&&(d.value=N)}catch(N){S===x&&(f.value=me(N))}finally{S===x&&(m.value=!1)}}ee([u,t],h,{immediate:!0}),on(()=>++x);const p=W(()=>{var S;return(((S=d.value)==null?void 0:S.nhanVien)||[]).map(N=>({...N,days:new Map((N.cacNgay||[]).map(B=>[B.ngayTrongThang,B.giaTri]))}))}),M=W(()=>{var N,B;const S=new Map;for(const Y of p.value){const _=(N=Y.maBoPhan)==null?void 0:N.trim(),le=(B=Y.boPhan)==null?void 0:B.trim(),Ee=_?`code:${_}`:le?`name:${le}`:"unassigned";let Te=S.get(Ee);Te||(Te={key:Ee,label:le||_||"Chưa có bộ phận",employees:[]},S.set(Ee,Te)),Te.employees.push(Y)}return[...S.values()]});function U(S){const N=new Set(q.value);N.has(S)?N.delete(S):N.add(S),q.value=N,k.value=null}function w(){q.value=new Set}function C(){q.value=new Set(M.value.map(S=>S.key)),k.value=null}const b=[{key:"al",label:"AL"},{key:"do",label:"DO"},{key:"ph",label:"PH"},{key:"cl",label:"CL"},{key:"ul",label:"UL"},{key:"soNgayCongThucTe",label:"Số ngày công thực tế"},{key:"soNgayCongTieuChuan",label:"Số ngày công tiêu chuẩn"},{key:"soNgayPhep",label:"Số ngày phép"},{key:"soNgayCongHuongLuong",label:"Số ngày công hưởng lương"}];function g(S){return[0,6].includes(new Date(d.value.nam,d.value.thang-1,S).getDay())}function j(){if(!T.value||!d.value||m.value)return;const S=document.createElement("iframe");S.title="In báo cáo ca làm việc",S.style.cssText="position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;",S.onload=()=>{const N=S.contentWindow;if(!N){S.remove();return}N.addEventListener("afterprint",()=>S.remove(),{once:!0}),N.focus(),N.print(),setTimeout(()=>S.remove(),6e4)},S.srcdoc='<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Báo cáo ca làm việc</title><style>@page{size:A3 landscape;margin:10mm}body{font-family:Arial,sans-serif;color:#111}h2{font-size:16px}p{font-size:10px}col{width:auto!important}table{width:100%;border-collapse:collapse;table-layout:auto;font-size:7px}th,td{border:1px solid #777;padding:4px 2px;text-align:center}th{background:#eee}thead{display:table-header-group}tr{break-inside:avoid}.name,.department,.position{text-align:left}small{display:block}.employee-name{min-width:90px}.department-heading th{background:#e2efda;text-align:left}.department-toggle{border:0;background:transparent;font:inherit;color:inherit;text-align:left}.outline-icon{display:none}.department-count{margin-left:8px;font-weight:normal}.employee-row{display:table-row!important}</style></head><body>'+T.value.innerHTML+"</body></html>",document.body.appendChild(S)}return(S,N)=>(o(),i("section",Ws,[e("div",Ys,[N[5]||(N[5]=e("div",null,[e("h2",null,"Báo cáo ca làm việc tháng"),e("p",null,"Chọn tháng và năm để xem lịch và tổng công.")],-1)),e("div",Qs,[e("label",null,[N[3]||(N[3]=O("Tháng",-1)),G(z(an),{modelValue:u.value,"onUpdate:modelValue":N[0]||(N[0]=B=>u.value=B),options:z(a),"option-label":"label","option-value":"value"},null,8,["modelValue","options"])]),e("label",null,[N[4]||(N[4]=O("Năm",-1)),G(z(an),{modelValue:t.value,"onUpdate:modelValue":N[1]||(N[1]=B=>t.value=B),options:z(v),"option-label":"label","option-value":"value",filter:""},null,8,["modelValue","options"])]),G(ve,{label:"In báo cáo",icon:"pi pi-print",outlined:"",disabled:m.value||!d.value||!p.value.length,onClick:j},null,8,["disabled"])])]),m.value?(o(),i("div",Js,[N[6]||(N[6]=e("i",{class:"pi pi-spin pi-spinner"},null,-1)),O(" Đang tải báo cáo tháng "+s(u.value)+"/"+s(t.value)+"... ",1)])):f.value?(o(),i("div",Zs,[O(s(f.value)+" ",1),G(ve,{label:"Thử lại",text:"",onClick:h})])):d.value?(o(),i(P,{key:2},[e("div",_s,[e("span",null," Tháng "+s(d.value.thang)+"/"+s(d.value.nam)+" · "+s(d.value.soNgayTrongThang)+" ngày · "+s(p.value.length)+" nhân viên · "+s(M.value.length)+" bộ phận ",1),p.value.length?(o(),i("div",er,[e("button",{type:"button",disabled:!q.value.size,onClick:w},[...N[7]||(N[7]=[e("i",{class:"pi pi-plus","aria-hidden":"true"},null,-1),O(" Mở tất cả ",-1)])],8,nr),e("button",{type:"button",disabled:q.value.size===M.value.length,onClick:C},[...N[8]||(N[8]=[e("i",{class:"pi pi-minus","aria-hidden":"true"},null,-1),O(" Thu gọn tất cả ",-1)])],8,tr)])):I("",!0)]),e("div",{class:"sheet-scroll",onMouseleave:N[2]||(N[2]=B=>k.value=null)},[e("div",{ref_key:"printable",ref:T},[e("div",lr,[e("h2",null,"Báo cáo ca làm việc tháng "+s(d.value.thang)+"/"+s(d.value.nam),1),e("p",null,s(p.value.length)+" nhân viên",1)]),e("table",ar,[e("colgroup",null,[N[9]||(N[9]=e("col",{style:{width:"44px"}},null,-1)),N[10]||(N[10]=e("col",{style:{width:"90px"}},null,-1)),N[11]||(N[11]=e("col",{style:{width:"180px"}},null,-1)),N[12]||(N[12]=e("col",{style:{width:"140px"}},null,-1)),N[13]||(N[13]=e("col",{style:{width:"140px"}},null,-1)),(o(!0),i(P,null,R(d.value.cotNgay,B=>(o(),i("col",{key:B.ngayTrongThang,style:{width:"44px"}}))),128)),(o(),i(P,null,R(b,B=>e("col",{key:B.key,style:Ct({width:B.key.startsWith("soNgay")?"110px":"56px"})},null,4)),64))]),e("thead",null,[e("tr",null,[N[14]||(N[14]=e("th",{class:"frozen ordinal"},"TT",-1)),N[15]||(N[15]=e("th",{class:"frozen employee-code"},"Mã NV",-1)),N[16]||(N[16]=e("th",{class:"frozen employee-name"},"Họ và tên",-1)),N[17]||(N[17]=e("th",null,"Bộ phận",-1)),N[18]||(N[18]=e("th",null,"Chức vụ",-1)),(o(!0),i(P,null,R(d.value.cotNgay,B=>(o(),i("th",{key:B.ngayTrongThang,title:B.ngay,class:Q({weekend:g(B.ngayTrongThang),highlight:k.value===B.ngayTrongThang})},s(String(B.ngayTrongThang).padStart(2,"0")),11,or))),128)),(o(),i(P,null,R(b,B=>e("th",{key:B.key,class:"total"},s(B.label),1)),64))])]),(o(!0),i(P,null,R(M.value,B=>(o(),i("tbody",{key:B.key},[e("tr",ir,[e("th",sr,[e("button",{type:"button",class:"department-toggle","aria-expanded":!q.value.has(B.key),"aria-label":`${q.value.has(B.key)?"Mở":"Thu gọn"} bộ phận ${B.label}`,onClick:Y=>U(B.key)},[e("span",ur,s(q.value.has(B.key)?"+":"−"),1),e("span",dr,s(B.label),1),e("span",cr,s(B.employees.length)+" NV",1)],8,rr)]),e("th",{colspan:2+d.value.cotNgay.length+b.length,class:"department-fill"},null,8,vr)]),(o(!0),i(P,null,R(B.employees,Y=>Z((o(),i("tr",{key:Y.maNhanVien,class:"employee-row"},[e("td",hr,s(Y.tt),1),e("td",mr,s(Y.maNhanVien),1),e("td",pr,s(Y.hoVaTen),1),e("td",gr,s(Y.boPhan||Y.maBoPhan||"—"),1),e("td",fr,s(Y.chucVu||Y.maChucVu||"—"),1),(o(!0),i(P,null,R(d.value.cotNgay,_=>(o(),i("td",{key:_.ngayTrongThang,class:Q({weekend:g(_.ngayTrongThang),highlight:k.value===_.ngayTrongThang}),title:Y.hoVaTen+" · "+_.ngay+" · "+(Y.days.get(_.ngayTrongThang)||"Chưa phân công"),onMouseenter:le=>k.value=_.ngayTrongThang},s(Y.days.get(_.ngayTrongThang)||""),43,yr))),128)),(o(),i(P,null,R(b,_=>e("td",{key:_.key,class:"total"},s(Y[_.key]??0),1)),64))])),[[el,!q.value.has(B.key)]])),128))]))),128)),p.value.length?I("",!0):(o(),i("tbody",br,[e("tr",null,[e("td",{colspan:5+d.value.cotNgay.length+b.length,class:"empty"}," Chưa có dữ liệu báo cáo trong tháng này. ",8,qr)])]))])],512)],32)],64)):I("",!0)]))}}),wr=Ye(kr,[["__scopeId","data-v-4fb17054"]]),Tr={class:"panel form"},Cr={class:"toolbar"},$r={class:"actions"},Dr={class:"table-scroll"},Ir={class:"report"},Sr=["onClick"],Nr={key:0},xr=ge({__name:"ScheduleSwapsTab",props:we({rows:{},canApprove:{type:Boolean},canCreate:{type:Boolean},assignmentLabel:{type:Function},shiftName:{type:Function}},{tab:{required:!0},tabModifiers:{}}),emits:we(["create","detail"],["update:tab"]),setup(n,{emit:c}){const u=ne(n,"tab"),t=c,a={PENDING:"Chờ duyệt",APPROVED:"Đã duyệt",REJECTED:"Từ chối",CANCELLED:"Đã hủy"};return(v,d)=>(o(),i("section",Tr,[e("div",Cr,[e("div",$r,[e("button",{class:Q({chosen:u.value==="ALL"}),onClick:d[0]||(d[0]=m=>u.value="ALL")},"Yêu cầu",2),n.canApprove?(o(),i("button",{key:0,class:Q({chosen:u.value==="PENDING"}),onClick:d[1]||(d[1]=m=>u.value="PENDING")}," Chờ tôi duyệt ",2)):I("",!0),e("button",{class:Q({chosen:u.value==="DONE"}),onClick:d[2]||(d[2]=m=>u.value="DONE")},"Đã xử lý",2)]),n.canCreate?(o(),i("button",{key:0,class:"primary",onClick:d[3]||(d[3]=m=>t("create"))},"+ Tạo yêu cầu")):I("",!0)]),e("div",Dr,[e("table",Ir,[d[5]||(d[5]=e("thead",null,[e("tr",null,[e("th",null,"Mã yêu cầu"),e("th",null,"Ca hiện tại"),e("th",null,"Đổi với / ca sau đổi"),e("th",null,"Lý do"),e("th",null,"Ngày gửi"),e("th",null,"Trạng thái"),e("th",null,"Thao tác")])],-1)),e("tbody",null,[(o(!0),i(P,null,R(n.rows,m=>(o(),i("tr",{key:m.id},[e("td",null,s(m.code),1),e("td",null,s(n.assignmentLabel(m.assignmentId)),1),e("td",null,s(m.targetAssignmentId?n.assignmentLabel(m.targetAssignmentId):n.shiftName(m.shiftId)),1),e("td",null,s(m.reason),1),e("td",null,s(new Date(m.createdAt).toLocaleString("vi-VN")),1),e("td",null,s(a[m.status]),1),e("td",null,[e("button",{onClick:f=>t("detail",m)},"Xem",8,Sr)])]))),128)),n.rows.length?I("",!0):(o(),i("tr",Nr,[...d[4]||(d[4]=[e("td",{colspan:"7",class:"empty-state"},"Không có yêu cầu trong trạng thái này.",-1)])]))])])])]))}}),Er={class:"panel form"},Vr={class:"toolbar"},Ar={key:0,class:"empty-state"},Lr={class:"toolbar"},Or={class:"pattern"},Br={class:"actions"},Pr=["onClick"],Mr=["onClick"],Fr=["onClick"],Ur=["disabled","onClick"],Rr=["onClick"],Hr=ge({__name:"ScheduleTemplatesTab",props:{templates:{},shifts:{},departments:{},busy:{type:Boolean},canCreate:{type:Boolean},canEdit:{type:Boolean},canBulk:{type:Boolean}},emits:["create","open","toggle","apply"],setup(n,{emit:c}){const u=c;return(t,a)=>(o(),i("section",Er,[e("div",Vr,[a[1]||(a[1]=e("div",null,[e("h2",null,"Mẫu lịch tái sử dụng"),e("p",null,"Mẫu chỉ trở thành lịch thực tế khi được áp dụng.")],-1)),n.canCreate?(o(),i("button",{key:0,class:"primary",onClick:a[0]||(a[0]=v=>u("create"))},"+ Tạo mẫu")):I("",!0)]),n.templates.length?I("",!0):(o(),i("p",Ar," Chưa có mẫu lịch. Tạo mẫu để tái sử dụng khi phân công. ")),(o(!0),i(P,null,R(n.templates,v=>(o(),i("article",{key:v.id,class:"template-card"},[e("div",Lr,[e("h3",null,s(v.name),1),e("span",null,s(v.active?"Hoạt động":"Ngừng sử dụng"),1)]),e("p",null,s(v.scheduleType==="ADMINISTRATIVE"?"Hành chính":"Xoay ca")+" · "+s(v.department||"Tất cả bộ phận")+" · "+s(v.kind==="WEEK"?"Tuần":"Chu kỳ "+v.days.length+" ngày"),1),e("div",Or,[(o(!0),i(P,null,R(v.days,(d,m)=>{var f;return o(),i("span",{key:m},[e("small",null,s(v.kind==="WEEK"?["T2","T3","T4","T5","T6","T7","CN"][m]:m+1),1),O(" "+s(d==="OFF"?"Nghỉ":(f=n.shifts.find(k=>k.id===d))==null?void 0:f.name),1)])}),128))]),e("div",Br,[e("button",{onClick:d=>u("open",v,!1,!0)},"Xem",8,Pr),n.canEdit?(o(),i("button",{key:0,onClick:d=>u("open",v,!1,!1)},"Sửa",8,Mr)):I("",!0),n.canCreate?(o(),i("button",{key:1,onClick:d=>u("open",v,!0,!1)},"Nhân bản",8,Fr)):I("",!0),n.canEdit?(o(),i("button",{key:2,disabled:n.busy,onClick:d=>u("toggle",v)},s(v.active?"Ngừng sử dụng":"Kích hoạt"),9,Ur)):I("",!0),v.active&&n.canBulk?(o(),i("button",{key:3,onClick:d=>u("apply",v)}," Áp dụng mẫu ",8,Rr)):I("",!0)])]))),128))]))}}),zr=ge({__name:"AppDialog",setup(n){return(c,u)=>(o(),ce(z(Se),bt(qt(c.$attrs)),{default:te(()=>[yt(c.$slots,"default")]),_:3},16))}}),ft=[{id:"HC",code:"D",name:"Ca D · Hành chính",scheduleType:"ADMINISTRATIVE",startTime:"08:00",endTime:"17:00",crossDay:!1,displayColor:"#2563eb",active:!0},{id:"M",code:"M",name:"Ca sáng",scheduleType:"ROTATING",startTime:"06:00",endTime:"14:00",crossDay:!1,displayColor:"#059669",active:!0},{id:"E",code:"E",name:"Ca chiều",scheduleType:"ROTATING",startTime:"14:00",endTime:"22:00",crossDay:!1,displayColor:"#d97706",active:!0},{id:"N",code:"N",name:"Ca đêm",scheduleType:"ROTATING",startTime:"22:00",endTime:"06:00",crossDay:!0,displayColor:"#7c3aed",active:!0}],xt="hotel-shift-scheduling-v2";let Ke;function wn(n){if(!$t().can("schedules",n))throw new Error("Bạn không có quyền thực hiện thao tác này.")}async function Tn(){if(Ke)return Ke;const n=localStorage.getItem(xt);if(n){Ke=JSON.parse(n);const u=Ke.shifts.find(t=>t.id==="HC"||t.code==="HC");return u&&(u.code="D",u.name="Ca D · Hành chính"),Ke}const c=await ul.list("schedules",{page:1,pageSize:1e3,search:"",filters:{},sortField:"date",sortOrder:1});return Ke={shifts:structuredClone(ft),templates:[],swaps:[],history:[],assignments:c.all.map(u=>{const t=ft.find(a=>`${a.startTime}–${a.endTime}`===u.shift||a.code===u.shift);return{id:u.id,employeeId:String(u.employeeId),date:String(u.date),shiftId:(t==null?void 0:t.id)||"",scheduleType:(t==null?void 0:t.scheduleType)||"ROTATING",status:u.shift==="OFF"?"OFF":["AL","SL"].includes(String(u.shift))?"LEAVE":"SCHEDULED",note:String(u.note||""),revision:1}})},Ke}function Bn(n){return localStorage.setItem(xt,JSON.stringify(n)),Ke=n,structuredClone(n)}function nt(n,c){const u=[],t=a=>{const v=n.shifts.find(d=>d.id===a.shiftId);if(!(!v||a.status!=="SCHEDULED"))return[Date.parse(`${a.date}T${a.startTime||v.startTime}:00`),Date.parse(`${a.date}T${a.endTime||v.endTime}:00`)+(a.crossDay??v.crossDay?864e5:0)]};return c.forEach((a,v)=>{for(const d of[...n.assignments.filter(m=>m.id!==a.id),...c.slice(0,v)]){if(a.employeeId!==d.employeeId)continue;const m=t(a),f=t(d);(a.date===d.date||m&&f&&m[0]<f[1]&&f[0]<m[1])&&u.push({row:a,existing:d,reason:d.status==="LEAVE"?"Nhân viên đang nghỉ phép":a.date===d.date?"Đã có phân công trong ngày":"Ca chồng lấn thời gian, có thể qua đêm"})}}),u}const Cn={load:()=>kn(async()=>(wn("view"),structuredClone(await Tn()))),assign:(n,c=[])=>kn(async()=>{var v;if(wn(n.length>1?"bulk":(v=n[0])!=null&&v.id?"edit":"create"),n.some(d=>Ie(d.date)))throw new Error("Không được phân công ngày trong quá khứ.");const u=await Tn(),t={...u,shifts:[...u.shifts.filter(d=>!c.some(m=>m.id===d.id)),...c]};if(!n.length)throw new Error("Chưa có phân công để lưu.");if(nt(t,n).length)throw new Error("Lịch có xung đột. Hãy kiểm tra nhân viên, ngày và ca hiện có.");const a=structuredClone(t);for(const d of n){const m=t.assignments.find(k=>k.id===d.id);if(d.id&&(!m||m.revision!==d.revision))throw new Error("Lịch gốc đã thay đổi. Vui lòng tải lại.");if(d.status==="SCHEDULED"&&!t.shifts.some(k=>k.id===d.shiftId&&k.active&&k.scheduleType===d.scheduleType))throw new Error("Ca không hoạt động hoặc không phù hợp loại lịch.");const f={...d,id:d.id||crypto.randomUUID(),revision:((m==null?void 0:m.revision)||0)+1};a.assignments=[...a.assignments.filter(k=>k.id!==f.id),f],a.history.push({assignmentId:f.id,date:new Date().toISOString(),action:m?"Sửa phân công":"Tạo phân công"})}return Bn(a)}),template:n=>kn(async()=>{wn(n.id?"edit":"create");const c=structuredClone(await Tn());if(!n.name.trim()||!n.days.length||n.kind==="WEEK"&&n.days.length!==7)throw new Error("Nhập tên mẫu và cấu hình đầy đủ các ngày.");if(n.days.some(t=>t!=="OFF"&&!c.shifts.some(a=>a.id===t&&a.active&&a.scheduleType===n.scheduleType)))throw new Error("Mẫu có ca không hợp lệ.");const u={...n,id:n.id||crypto.randomUUID()};return c.templates=[...c.templates.filter(t=>t.id!==u.id),u],Bn(c)}),request:n=>kn(async()=>{wn("create");const c=structuredClone(await Tn()),u=c.assignments.find(a=>a.id===n.assignmentId),t=c.assignments.find(a=>a.id===n.targetAssignmentId);if(!u||u.status!=="SCHEDULED"||!n.reason.trim())throw new Error("Chọn ca đã phân công và nhập lý do.");if(n.targetAssignmentId&&(!t||t.employeeId===u.employeeId||t.status!=="SCHEDULED"))throw new Error("Chọn ca của nhân viên khác.");if(!t&&!c.shifts.some(a=>a.id===n.shiftId&&a.active))throw new Error("Chọn ca muốn đổi.");if(c.swaps.some(a=>a.status==="PENDING"&&[a.assignmentId,a.targetAssignmentId].some(v=>v&&[u.id,t==null?void 0:t.id].includes(v))))throw new Error("Ca đã có yêu cầu chờ duyệt.");return c.swaps.push({...n,id:crypto.randomUUID(),code:"DC"+String(c.swaps.length+1).padStart(5,"0"),status:"PENDING",createdAt:new Date().toISOString(),sourceSnapshot:{...u},targetSnapshot:t?{...t}:void 0,sourceRevision:u.revision,targetRevision:(t==null?void 0:t.revision)||0,decision:""}),Bn(c)}),decide:(n,c,u)=>kn(async()=>{wn(c?"approve":"reject");const t=structuredClone(await Tn()),a=t.swaps.find(v=>v.id===n);if(!a||a.status!=="PENDING")throw new Error("Yêu cầu đã xử lý hoặc không tồn tại.");if(!c&&!u.trim())throw new Error("Nhập lý do từ chối.");if(c){const v=t.assignments.find(T=>T.id===a.assignmentId),d=t.assignments.find(T=>T.id===a.targetAssignmentId);if(!v||v.revision!==a.sourceRevision||a.targetAssignmentId&&(!d||d.revision!==a.targetRevision))throw new Error("Lịch gốc đã thay đổi; yêu cầu không còn hợp lệ.");const m=[{...v,shiftId:(d==null?void 0:d.shiftId)||a.shiftId,revision:v.revision+1}];d&&m.push({...d,shiftId:v.shiftId,revision:d.revision+1}),m.forEach(T=>{const q=t.shifts.find(x=>x.id===T.shiftId&&x.active);if(!q)throw new Error("Ca không còn hoạt động.");T.scheduleType=q.scheduleType});const f={...t,assignments:t.assignments.filter(T=>!m.some(q=>q.id===T.id))},k=nt(f,m);if(k.length)throw new Error(k.map(T=>`${T.row.employeeId} · ${T.row.date}: ${T.row.shiftId} xung đột ${T.existing.shiftId} (${T.reason})`).join(`
`));t.assignments=[...f.assignments,...m],m.forEach(T=>t.history.push({assignmentId:T.id,date:new Date().toISOString(),action:"Duyệt đổi ca "+a.code}))}return a.status=c?"APPROVED":"REJECTED",a.decision=u,Bn(t)})};function Gr(n,c,u,t,a){const v=f=>u.scheduleType==="ADMINISTRATIVE"&&new Date(`${f}T12:00:00`).getDay()===0,d=a.filter(f=>!v(f.date)),m=new Set([...t,...d].map(f=>`${f.employeeId}:${f.date}`));for(const f of n)for(const k of c)v(k)||Ie(k)||m.has(`${f.code}:${k}`)||(d.push({employeeId:f.code,date:k,shiftId:u.id,fullTime:!0,note:""}),m.add(`${f.code}:${k}`));return d.sort((f,k)=>f.date.localeCompare(k.date))}const Kr={class:"shift-module"},Xr={class:"page-heading"},jr={key:0,class:"demo"},Wr={key:1,class:"error",role:"alert"},Yr={key:2,role:"status"},Qr={key:0,class:"panel filters"},Jr=["value"],Zr=["value"],_r={class:"schedule-filter-fields"},eu=["value"],nu=["value"],tu={class:"schedule-filter-search"},lu={class:"schedule-filter-actions"},au={key:2,class:"schedule-calendar-layout"},ou={class:"department-filter-tree","aria-labelledby":"department-filter-title"},iu={key:0,role:"status"},su={key:1,role:"alert",class:"error"},ru=["aria-pressed"],uu={"aria-label":"Cây bộ phận theo loại lịch"},du=["aria-pressed","onClick"],cu={key:0,open:""},vu=["aria-pressed","onClick"],hu={class:"schedule-calendar-pane"},mu={class:"schedule-filter-toolbar"},pu=["aria-label"],gu={key:0,class:"schedule-filter-count"},Eu=ge({__name:"ScheduleListView",setup(n){const c=nl(),u=ll(),t=$t(),a=sn(),v={all:$([]),loading:$(!1),error:$(""),async load(){v.loading.value=!0,v.error.value="";try{v.all.value=(await rl.list(null)).map(r=>({id:r.maNhanVien,code:r.maNhanVien,name:String(r.hoTen||[r.ho,r.tenDem,r.ten].filter(Boolean).join(" ")),department:String(r.tenBoPhan||""),position:String(r.tenChucVu||""),positionCode:r.maChucVu==null?"":String(r.maChucVu),status:String(r.trangThaiNhanVien??"")}))}catch(r){v.error.value=me(r)}finally{v.loading.value=!1}}};tn(()=>v.load());const d={all:$([]),loading:$(!1),error:$(""),async load(){d.loading.value=!0,d.error.value="";try{d.all.value=await al()}catch(r){d.error.value=me(r)}finally{d.loading.value=!1}}};tn(()=>d.load());const m=$([]),f=$([]),k=$(!1),T=$("");let q=0;async function x(){const r=++q;k.value=!0,T.value="";try{const l=await ol(d.all.value);if(r!==q)return;m.value=l.groups,f.value=l.unavailable}catch(l){r===q&&(T.value=me(l))}finally{r===q&&(k.value=!1)}}ee(()=>d.all.value,()=>{x()});const h=$({shifts:[],assignments:[],templates:[],swaps:[],history:[]}),p=$([]),M=$(!1),U=$(!1),w=$(""),C=$(!1),b=[{key:"assign",label:"Phân công ca"},{key:"reports",label:"Báo cáo lịch làm việc"}],g=W(()=>String(c.meta.schedulePage||"assign")),j=W(()=>{var r;return g.value==="exchange"?"Đổi ca":(r=b.find(l=>l.key===g.value))==null?void 0:r.label});function S(r){return`${r.getFullYear()}-${String(r.getMonth()+1).padStart(2,"0")}-${String(r.getDate()).padStart(2,"0")}`}const N=S(new Date),B=$(N),Y=$("week");function _(r,l){const A=[],L=new Date(r+"T12:00:00");for(;S(L)<=l&&A.length<367;)A.push(S(L)),L.setDate(L.getDate()+1);return A}const le=W(()=>zn(B.value,Y.value)),Ee=W(()=>_(le.value.from,le.value.to));function Te(r){const l=new Date(B.value+"T12:00:00");Y.value==="month"?(l.setDate(1),l.setMonth(l.getMonth()+r)):l.setDate(l.getDate()+r*(Y.value==="week"?7:1)),B.value=S(l)}function fe(r){return new Date(r+"T12:00:00").toLocaleDateString("vi-VN")}const ae=$(""),Ve=$(""),Ce=$(""),Ae=$(""),ze=$(""),Fe=$(""),Ge=$(!1),ue=tl({employee:"",type:"",shiftFilter:"",status:"",search:""}),Qe=W(()=>[ae.value,Ve.value,Ce.value,Ae.value,ze.value,Fe.value].filter(r=>r.trim()).length);function F(){Object.assign(ue,{employee:Ve.value,type:Ce.value,shiftFilter:Ae.value,status:ze.value,search:Fe.value}),Ge.value=!0}function D(){Ve.value=ue.employee,Ce.value=ue.type,Ae.value=ue.shiftFilter,ze.value=ue.status,Fe.value=ue.search.trim(),Ge.value=!1}function V(){ae.value="",Ve.value="",Ce.value="",Ae.value="",ze.value="",Fe.value="",Object.assign(ue,{employee:"",type:"",shiftFilter:"",status:"",search:""}),Ge.value=!1}const E=W(()=>d.all.value.map(r=>r.name)),X=W(()=>v.all.value.filter(r=>(!ae.value||r.department===ae.value)&&(!Ve.value||r.code===Ve.value)&&`${r.code} ${r.name}`.toLocaleLowerCase().includes(Fe.value.toLocaleLowerCase())));function K(r){const l=v.all.value.find(A=>A.code===r);return l?`${l.code} · ${l.name}`:r}function be(r){var l;return((l=v.all.value.find(A=>A.code===r))==null?void 0:l.name)||r}function qe(r){if(r==="OFF")return"Nghỉ";const l=h.value.shifts.find(A=>A.id===r);return l?`${l.name} · ${l.startTime}–${l.endTime}${l.crossDay?" (+1 ngày)":""}`:"⚠ Ca chưa có trong danh mục"}function Ue(r){return h.value.assignments.filter(l=>l.employeeId===r&&Ee.value.includes(l.date)&&Le(l)).sort((l,A)=>l.date.localeCompare(A.date)||(l.startTime||"").localeCompare(A.startTime||""))}function ye(r){var l;return r.shiftSymbol||((l=h.value.shifts.find(A=>A.id===r.shiftId))==null?void 0:l.code)||r.shiftId}function Re(r,l){return h.value.assignments.find(A=>A.employeeId===r&&A.date===l)}function Ne(r){var l;return r?r.status==="OFF"?"Nghỉ":r.status==="LEAVE"?"Nghỉ phép":(r.startTime&&r.endTime?`${r.shiftName||((l=h.value.shifts.find(A=>A.id===r.shiftId))==null?void 0:l.name)||r.shiftId} · ${r.startTime}–${r.endTime}${r.crossDay?" (+1 ngày)":""}`:qe(r.shiftId))+(r.fullTime===!1?" · 1/2 ca":" · Cả ca"):"Chưa phân công"}function Le(r){return(!Ce.value||(r==null?void 0:r.scheduleType)===Ce.value)&&(!Ae.value||(r==null?void 0:r.shiftId)===Ae.value)&&(!ze.value||((r==null?void 0:r.status)||"UNASSIGNED")===ze.value)}const Et=W(()=>X.value.filter(r=>Ee.value.some(l=>Le(Re(r.code,l))))),tt=r=>!!r&&h.value.swaps.some(l=>l.status==="PENDING"&&[l.assignmentId,l.targetAssignmentId].includes(r.id));let Je=0;async function rn(){const r=++Je;if(g.value==="exchange"){M.value=!1,w.value="";return}M.value=!0,w.value="";try{if(g.value==="calendar"){const l=await Mn(le.value.from,le.value.to);if(r!==Je)return;h.value={...h.value,...l}}else if(g.value==="assign"){const l=await Mn(We.value.start,We.value.end);if(r!==Je)return;h.value={...h.value,...l}}else{const l=await Cn.load();if(r!==Je)return;h.value=l}}catch(l){r===Je&&(w.value=me(l))}finally{r===Je&&(M.value=!1)}}tn(rn);let Gn=0;async function Kn(){if(g.value!=="assign")return;const r=++Gn,{start:l,end:A}=Qn.value;try{const L=await Cl(l,A);r===Gn&&g.value==="assign"&&(p.value=L)}catch(L){r===Gn&&(w.value=me(L))}}tn(Kn),ee([g,()=>le.value.from,()=>le.value.to],([r])=>{r==="calendar"&&rn()}),ee(g,()=>{g.value!=="calendar"&&rn()});async function Dn(r){if(U.value)return!1;U.value=!0,w.value="";try{return h.value=await r(),C.value=!1,a.success("success"),!0}catch(l){return w.value=me(l),!1}finally{U.value=!1}}kt(()=>!C.value||window.confirm("Có thay đổi chưa lưu. Bạn muốn rời màn hình?")),wt(()=>!C.value||window.confirm("Có thay đổi chưa lưu. Bạn muốn rời màn hình?"));const lt=r=>{C.value&&r.preventDefault()};window.addEventListener("beforeunload",lt),on(()=>window.removeEventListener("beforeunload",lt));const Ze=$();function at(r){U.value||!t.can("schedules","edit")||(Ze.value={...r,scheduleType:ie.value})}async function Vt(){Ze.value=void 0,await _e()}const In=$(),Xn=$(!1),ot=$(!1);function At(r,l){Re(r,l)||t.can("schedules","create")&&u.push({path:"/schedules/assign",query:{employee:r,date:l}})}const Xe=$(!1),oe=$(""),$e=$([]),jn=$(""),ie=$("ROTATING"),xe=$(N),je=$(N),un=$(""),ke=$("calendar"),dn=$(Array(7).fill("OFF")),cn=$(""),Wn=$(""),se=$(),De=$([]),vn=$(!1),de=$([]),Oe=$([]),hn=$(!1),Sn=$("");let mn=0;async function Yn(){var A,L;const r=++mn;hn.value=!0,Sn.value="",Oe.value=[];const l=((A=d.all.value.find(H=>H.name===oe.value))==null?void 0:A.code)||null;if(!l){hn.value=!1;return}try{const[H,y]=await Promise.all([Dt(l,ie.value),Mn(We.value.start,We.value.end)]);if(r!==mn)return;h.value.assignments=y.assignments,Oe.value=H.filter(he=>he.workType!=="0"),se.value||(ie.value=((L=H[0])==null?void 0:L.scheduleType)||"ROTATING"),h.value.shifts=[...h.value.shifts.filter(he=>!H.some(re=>re.id===he.id)),...H],!se.value&&ie.value==="ADMINISTRATIVE"&&gn()}catch(H){r===mn&&(Sn.value=me(H))}finally{r===mn&&(hn.value=!1)}}async function Lt(r){var he;if(U.value||!t.can("schedules","create"))throw new Error("Bạn không có quyền tạo phân công ca hoặc hệ thống đang bận.");if(Ie(r.date))throw new Error("Không được phân công ngày trong quá khứ.");const l=(he=d.all.value.find(re=>re.name===oe.value))==null?void 0:he.code,A=p.value.find(re=>re.maNhanVien===r.employeeId),L=v.all.value.find(re=>re.code===r.employeeId),H=Oe.value.find(re=>re.id===r.shiftId&&re.active&&re.workType!=="0");if(!l||!Nn.value.some(re=>re.code===r.employeeId)||!H)throw new Error("Nhân viên, bộ phận hoặc ca làm việc không hợp lệ.");if(h.value.assignments.some(re=>re.employeeId===r.employeeId&&re.date===r.date))throw new Error("Nhân viên đã có phân công trong ngày này. Vui lòng tải lại lịch.");const y={maBoPhan:l,maChucVu:(A==null?void 0:A.maChucVu)||(L!=null&&L.positionCode?String(L.positionCode):null),maNhanVien:r.employeeId,ngayLamViec:r.date+"T00:00:00+07:00",maCa:r.shiftId,gioBatDau:r.startTime?Un(r.startTime):null,gioKetThuc:r.endTime?Un(r.endTime):null,ghiChu:r.note.trim()||null};U.value=!0;try{const re=await $l(y);de.value=de.value.filter(qn=>qn.employeeId!==r.employeeId||qn.date!==r.date),a.success(re.message||"Tạo phân công ca thành công."),await _e()}finally{U.value=!1}}async function _e(){await Yn(),await Kn()}ee(oe,()=>{++mn,Oe.value=[],hn.value=!1,Sn.value="",se.value||(de.value=[])}),ee(de,()=>{C.value=!0,De.value=[]},{deep:!0});const Nn=W(()=>{var A;const r=((A=d.all.value.find(L=>L.name===oe.value))==null?void 0:A.code)||"",l=p.value.filter(L=>!oe.value||L.maBoPhan===r||L.tenBoPhan===oe.value).map(L=>({code:L.maNhanVien,name:L.hoTen,department:L.tenBoPhan||""}));for(const L of v.all.value.filter(H=>H.department===oe.value))l.some(H=>H.code===L.code)||l.push({code:L.code,name:L.name,department:String(L.department||"")});return l}),Ot=W(()=>(se.value?v.all.value.filter(l=>{var A;return l.code===((A=se.value)==null?void 0:A.employeeId)}).map(l=>({code:l.code,name:l.name,department:String(l.department||"")})):Nn.value).filter(l=>`${l.code} ${l.name}`.toLowerCase().includes(jn.value.toLowerCase())));function it(){var r;return((r=Oe.value[0])==null?void 0:r.scheduleType)||"ROTATING"}const st=W(()=>Oe.value.filter(r=>r.active&&r.scheduleType===ie.value)),en=$("week"),pn=$(N),We=W(()=>{const r=new Date(pn.value+"T12:00:00");en.value==="week"?r.setDate(r.getDate()-(r.getDay()+6)%7):r.setDate(1);const l=new Date(r);return en.value==="week"?l.setDate(l.getDate()+6):l.setMonth(l.getMonth()+1,0),{start:S(r),end:S(l)}}),Qn=W(()=>We.value);ee([g,()=>Qn.value.start,()=>Qn.value.end],([r])=>{r==="assign"&&Kn()});function gn(r=!1){const l=Oe.value.find(L=>L.active&&L.scheduleType==="ADMINISTRATIVE");if(!oe.value||!l){r&&(de.value=[]);return}const A=Nn.value;de.value=Gr(A,_(We.value.start,We.value.end),l,h.value.assignments,r?[]:de.value).filter(L=>!p.value.some(H=>H.maNhanVien===L.employeeId&&H.danhSachNgayXepCa.includes(L.date)))}ee([$e,ie,xe,je,un,ke,dn,cn,Wn,Xe],()=>{C.value=!0,De.value=[]},{deep:!0}),ee(ie,()=>{un.value="",cn.value="",dn.value=Array(7).fill("OFF"),se.value||(ie.value==="ADMINISTRATIVE"?gn(!0):de.value=[])}),ee(oe,()=>{se.value||($e.value=[]),cn.value="",se.value||(ie.value=it()),!se.value&&ie.value==="ADMINISTRATIVE"&&gn(!0)}),ee([oe,en,pn,()=>d.all.value],()=>{g.value==="assign"&&oe.value&&Yn()}),ee(()=>p.value,()=>{!se.value&&ie.value==="ADMINISTRATIVE"&&gn()});const Bt=W(()=>p.value.map(r=>({employeeId:r.maNhanVien,dates:r.danhSachNgayXepCa})));function Jn(){var l,A;se.value=void 0,de.value=[],ke.value="calendar",Xe.value=!1,oe.value="",ie.value="ROTATING",$e.value=c.query.employee?[String(c.query.employee)]:[],xe.value=String(c.query.date||N),je.value=xe.value,en.value="week",pn.value=xe.value;const r=h.value.assignments.find(L=>L.id===c.query.edit);if(r)se.value=r,$e.value=[r.employeeId],oe.value=String(((l=v.all.value.find(L=>L.code===r.employeeId))==null?void 0:l.department)||""),ie.value=r.scheduleType,xe.value=je.value=r.date,Wn.value=r.note,setTimeout(()=>{un.value=r.status==="OFF"?"OFF":r.shiftId,de.value=[{employeeId:r.employeeId,date:r.date,shiftId:un.value,fullTime:r.fullTime!==!1,note:r.note,startTime:r.startTime,endTime:r.endTime,crossDay:r.crossDay}],C.value=!1},0);else if($e.value.length){const L=$e.value[0];oe.value=String(((A=v.all.value.find(H=>H.code===L))==null?void 0:A.department)||""),ie.value=it(),setTimeout(()=>{$e.value=[L],C.value=!1},0)}!r&&ie.value==="ADMINISTRATIVE"&&oe.value&&gn(),setTimeout(()=>{C.value=!1},0)}ee(()=>c.fullPath,Jn),ee(()=>h.value.assignments.length,()=>{c.query.edit&&!se.value&&Jn()}),tn(Jn);function Pt(){if(se.value){at(se.value);return}if(w.value="",ke.value==="calendar"?de.value.some(A=>Ie(A.date)):Ie(xe.value)){w.value="Không được phân công ngày trong quá khứ.";return}if(ke.value==="calendar"&&ie.value==="ADMINISTRATIVE"&&de.value.some(A=>new Date(`${A.date}T12:00:00`).getDay()===0)){w.value="Không phân công ca hành chính vào Chủ nhật.";return}if(!oe.value){w.value="Chọn bộ phận để xác định loại lịch phân công.";return}if(ke.value!=="calendar"&&(!$e.value.length||!Xe.value&&$e.value.length!==1)){w.value="Chọn nhân viên cần phân công.";return}if(!xe.value||!je.value||xe.value>je.value||_(xe.value,je.value).length>366){w.value="Khoảng ngày không hợp lệ (tối đa 366 ngày mỗi lần).";return}if(ke.value==="calendar"){if(!de.value.length){w.value="Chọn ít nhất một ngày trên lịch và ca cho ngày đó.";return}if(de.value.some(L=>!Nn.value.some(H=>H.code===L.employeeId))){w.value="Nhân viên trong phân công không còn tồn tại.";return}const A=de.value.map(L=>{var H,y;return{id:((H=se.value)==null?void 0:H.id)||"",employeeId:L.employeeId,date:L.date,shiftId:L.shiftId==="OFF"?"":L.shiftId,scheduleType:ie.value,status:L.shiftId==="OFF"?"OFF":"SCHEDULED",note:L.note,fullTime:L.fullTime,startTime:L.startTime,endTime:L.endTime,crossDay:L.crossDay,revision:((y=se.value)==null?void 0:y.revision)||0}});if(A.some(L=>L.status==="SCHEDULED"&&!st.value.some(H=>H.id===L.shiftId))){w.value="Ca đã chọn không còn hoạt động hoặc không phù hợp loại lịch. Chọn lại ca.";return}ut(A);return}const r=h.value.templates.find(A=>A.id===cn.value&&A.active);if(ke.value==="template"&&!r){w.value="Chọn mẫu đang hoạt động.";return}const l=[];for(const A of $e.value)_(xe.value,je.value).forEach((L,H)=>{var re,qn;const y=(new Date(L+"T12:00:00").getDay()+6)%7;if(ie.value==="ADMINISTRATIVE"&&y===6)return;const he=ke.value==="template"&&r?r.days[r.kind==="WEEK"?y:H%r.days.length]:ke.value==="weekly"?dn.value[y]:ke.value==="cycle"?dn.value[H%dn.value.length]:un.value;l.push({id:((re=se.value)==null?void 0:re.id)||"",employeeId:A,date:L,shiftId:he==="OFF"?"":he,scheduleType:ie.value,status:he==="OFF"?"OFF":"SCHEDULED",note:Wn.value,revision:((qn=se.value)==null?void 0:qn.revision)||0})});if(!l.length||l.some(A=>A.status==="SCHEDULED"&&!st.value.some(L=>L.id===A.shiftId))){w.value="Chọn ca hợp lệ và ít nhất một ngày áp dụng.";return}ut(l)}const rt=W(()=>nt(h.value,De.value));function ut(r){De.value=r.map(l=>{const A=Oe.value.find(H=>H.id===l.shiftId);if(!A)return l;const L=new Date(`${l.date}T12:00:00Z`);return A.crossDay&&L.setUTCDate(L.getUTCDate()+1),{...l,startTime:l.startTime||A.startTime,endTime:l.endTime||A.endTime,startDate:l.date,endDate:L.toISOString().slice(0,10),crossDay:A.crossDay}}),vn.value=!0}async function Mt(){if(!(U.value||rt.value.length||!De.value.length)){if(!t.can("schedules",De.value.length>1?"bulk":"create")){w.value="Bạn không có quyền tạo phân công này.";return}if(De.value.some(r=>Ie(r.date))){w.value="Không được phân công ngày trong quá khứ.";return}U.value=!0,w.value="";try{const r=d.all.value.find(L=>L.name===oe.value),l=cl(De.value,Oe.value,(r==null?void 0:r.code)||"",p.value.filter(L=>L.maBoPhan===(r==null?void 0:r.code)||L.tenBoPhan===oe.value).map(L=>({code:L.maNhanVien,positionCode:L.maChucVu})));console.log("Saving assignments:",l);const A=await vl(l);if(A.thatBai>0){w.value=`Đã lưu ${A.thanhCong}/${A.tongSo}. ${A.thatBai} phân công thất bại. `+A.loi.map(H=>`${H.maNhanVien} · ${ln(H.ngayLamViec)}: ${me(H)}`).join(`
`),a.error(w.value);const L=new Set(A.loi.map(H=>`${H.maNhanVien}:${ln(H.ngayLamViec)}`));De.value=De.value.filter(H=>L.has(`${H.employeeId}:${H.date}`)),de.value=de.value.filter(H=>L.has(`${H.employeeId}:${H.date}`)),await _e();return}de.value=[],C.value=!1,vn.value=!1,a.success(`Đã lưu ${A.thanhCong} phân công ca.`),await _e(),await u.push("/schedules"),await rn()}catch(r){a.error(r),w.value=me(r)}finally{U.value=!1}}}function Ft(){In.value&&(Xn.value=!1,u.push({path:"/schedules/assign",query:{edit:In.value.id}}))}const fn=$(!1),xn=$(!1),nn=$({id:"",name:"",scheduleType:"ROTATING",department:"",active:!0,kind:"WEEK",days:Array(7).fill("OFF"),note:""});function dt(r,l=!1,A=!1){nn.value=r?{...r,id:l?"":r.id,name:r.name+(l?" (bản sao)":""),days:[...r.days]}:{id:"",name:"",scheduleType:"ROTATING",department:"",active:!0,kind:"WEEK",days:Array(7).fill("OFF"),note:""},xn.value=A,fn.value=!0}async function Ut(){await Dn(()=>Cn.template({...nn.value,days:[...nn.value.days]}))&&(fn.value=!1)}async function Rt(r){await u.push("/schedules/assign"),Xe.value=!0,ie.value=r.scheduleType,oe.value=r.department,ke.value="template",setTimeout(()=>{cn.value=r.id},0)}const yn=$(!1),En=$("ALL"),bn=$({assignmentId:"",targetAssignmentId:"",shiftId:"",reason:""}),ct=$("employee"),Vn=$(),An=$(!1),Ln=$(""),Ht=W(()=>h.value.swaps.filter(r=>En.value==="ALL"||(En.value==="DONE"?r.status!=="PENDING":r.status==="PENDING"))),zt=W(()=>h.value.assignments.filter(r=>r.status==="SCHEDULED"));function vt(r){const l=h.value.assignments.find(A=>A.id===r);return l?`${K(l.employeeId)} · ${fe(l.date)} · ${Ne(l)}`:"Lịch không còn tồn tại"}const Gt=$([]),ht=$(!1);function On(r,l=!1){return(l?r.targetSnapshot:r.sourceSnapshot)||h.value.assignments.find(A=>A.id===(l?r.targetAssignmentId:r.assignmentId))}function Kt(r,l=!1){const A=On(r,l);return A?`${K(A.employeeId)} · ${fe(A.date)} · ${Ne(A)}`:"Lịch không còn tồn tại"}ee(nn,()=>{fn.value&&!xn.value&&(C.value=!0)},{deep:!0}),ee(bn,()=>{yn.value&&(C.value=!0)},{deep:!0});function Xt(r,l=!1){var H,y;const A=On(r,l),L=l?(H=On(r))==null?void 0:H.shiftId:r.targetAssignmentId?(y=On(r,!0))==null?void 0:y.shiftId:r.shiftId;return A?`${K(A.employeeId)} · ${fe(A.date)} · ${qe(L||"")}`:"Lịch không còn tồn tại"}async function jt(){await Dn(()=>Cn.request({...bn.value}))&&(yn.value=!1)}async function Wt(r){const l=Vn.value;l&&await Dn(()=>Cn.decide(l.id,r,Ln.value))&&(An.value=!1)}return(r,l)=>{var L,H;const A=Hn("RouterLink");return o(),i("div",Kr,[e("div",Xr,[e("div",null,[l[50]||(l[50]=e("div",{class:"eyebrow"},"VẬN HÀNH KHÁCH SẠN / XẾP CA",-1)),e("h1",null,s(j.value),1),l[51]||(l[51]=e("p",null,"Quản lý lịch hành chính và ca xoay của đội ngũ khách sạn",-1))]),g.value==="calendar"&&z(t).can("schedules","create")?(o(),ce(A,{key:0,class:"primary",to:"/schedules/assign"},{default:te(()=>[...l[52]||(l[52]=[O(" + Phân công ca ",-1)])]),_:1})):I("",!0)]),G(Ks,{items:b,"active-key":g.value==="exchange"?"assign":g.value},null,8,["active-key"]),g.value==="templates"||g.value==="swaps"?(o(),i("p",jr," ⓘ Chế độ demo · Dữ liệu lưu trên trình duyệt. API xếp ca thật chưa được cung cấp. ")):I("",!0),w.value||v.error.value||d.error.value?(o(),i("p",Wr,[O(s(w.value||v.error.value||d.error.value)+" ",1),e("button",{onClick:l[0]||(l[0]=y=>{rn(),v.load(),d.load()})}," Tải lại dữ liệu ")])):I("",!0),M.value||v.loading.value||d.loading.value?(o(),i("p",Yr," Đang tải dữ liệu xếp ca… ")):(o(),i(P,{key:3},[g.value==="reports"?(o(),i("section",Qr,[e("label",null,[l[54]||(l[54]=O("Bộ phận",-1)),Z(e("select",{"onUpdate:modelValue":l[1]||(l[1]=y=>ae.value=y)},[l[53]||(l[53]=e("option",{value:""},"Tất cả bộ phận",-1)),(o(!0),i(P,null,R(E.value,y=>(o(),i("option",{key:y},s(y),1))),128))],512),[[pe,ae.value]])]),e("label",null,[l[56]||(l[56]=O("Nhân viên",-1)),Z(e("select",{"onUpdate:modelValue":l[2]||(l[2]=y=>Ve.value=y)},[l[55]||(l[55]=e("option",{value:""},"Tất cả nhân viên",-1)),(o(!0),i(P,null,R(v.all.value,y=>(o(),i("option",{key:y.code,value:y.code},s(K(y.code)),9,Jr))),128))],512),[[pe,Ve.value]])]),e("label",null,[l[58]||(l[58]=O("Loại lịch",-1)),Z(e("select",{"onUpdate:modelValue":l[3]||(l[3]=y=>Ce.value=y)},[...l[57]||(l[57]=[e("option",{value:""},"Tất cả",-1),e("option",{value:"ADMINISTRATIVE"},"Hành chính",-1),e("option",{value:"ROTATING"},"Xoay ca",-1)])],512),[[pe,Ce.value]])]),e("label",null,[l[60]||(l[60]=O("Ca",-1)),Z(e("select",{"onUpdate:modelValue":l[4]||(l[4]=y=>Ae.value=y)},[l[59]||(l[59]=e("option",{value:""},"Tất cả ca",-1)),(o(!0),i(P,null,R(h.value.shifts,y=>(o(),i("option",{key:y.id,value:y.id},s(y.name),9,Zr))),128))],512),[[pe,Ae.value]])]),e("label",null,[l[61]||(l[61]=O("Tìm kiếm",-1)),Z(e("input",{"onUpdate:modelValue":l[5]||(l[5]=y=>Fe.value=y),placeholder:"Mã NV hoặc họ tên"},null,512),[[He,Fe.value]])])])):I("",!0),g.value==="calendar"?(o(),ce(zr,{key:1,visible:Ge.value,"onUpdate:visible":l[12]||(l[12]=y=>Ge.value=y),modal:"",header:"Bộ lọc lịch phân công",style:{width:"min(680px, 94vw)"},class:"schedule-filter-dialog"},{footer:te(()=>[e("button",{type:"button",class:"schedule-filter-clear",onClick:V},[...l[71]||(l[71]=[e("i",{class:"pi pi-filter-slash","aria-hidden":"true"},null,-1),O(" Xóa bộ lọc ",-1)])]),e("div",lu,[e("button",{type:"button",onClick:l[11]||(l[11]=y=>Ge.value=!1)},"Hủy"),e("button",{type:"button",class:"schedule-filter-apply",onClick:D}," Áp dụng ")])]),default:te(()=>[e("div",_r,[e("label",null,[l[63]||(l[63]=O("Nhân viên",-1)),Z(e("select",{"onUpdate:modelValue":l[6]||(l[6]=y=>ue.employee=y)},[l[62]||(l[62]=e("option",{value:""},"Tất cả nhân viên",-1)),(o(!0),i(P,null,R(v.all.value,y=>(o(),i("option",{key:y.code,value:y.code},s(K(y.code)),9,eu))),128))],512),[[pe,ue.employee]])]),e("label",null,[l[65]||(l[65]=O("Loại lịch",-1)),Z(e("select",{"onUpdate:modelValue":l[7]||(l[7]=y=>ue.type=y)},[...l[64]||(l[64]=[e("option",{value:""},"Tất cả loại lịch",-1),e("option",{value:"ADMINISTRATIVE"},"Hành chính",-1),e("option",{value:"ROTATING"},"Xoay ca",-1)])],512),[[pe,ue.type]])]),e("label",null,[l[67]||(l[67]=O("Ca",-1)),Z(e("select",{"onUpdate:modelValue":l[8]||(l[8]=y=>ue.shiftFilter=y)},[l[66]||(l[66]=e("option",{value:""},"Tất cả ca",-1)),(o(!0),i(P,null,R(h.value.shifts,y=>(o(),i("option",{key:y.id,value:y.id},s(y.name),9,nu))),128))],512),[[pe,ue.shiftFilter]])]),e("label",null,[l[69]||(l[69]=O("Trạng thái",-1)),Z(e("select",{"onUpdate:modelValue":l[9]||(l[9]=y=>ue.status=y)},[...l[68]||(l[68]=[e("option",{value:""},"Tất cả trạng thái",-1),e("option",{value:"SCHEDULED"},"Đã xếp",-1),e("option",{value:"UNASSIGNED"},"Chưa xếp",-1),e("option",{value:"OFF"},"Nghỉ",-1),e("option",{value:"LEAVE"},"Nghỉ phép",-1)])],512),[[pe,ue.status]])]),e("label",tu,[l[70]||(l[70]=O("Tìm kiếm",-1)),Z(e("input",{"onUpdate:modelValue":l[10]||(l[10]=y=>ue.search=y),placeholder:"Mã NV hoặc họ tên",type:"search"},null,512),[[He,ue.search]])])])]),_:1},8,["visible"])):I("",!0),g.value==="calendar"?(o(),i("div",au,[e("aside",ou,[l[73]||(l[73]=e("h2",{id:"department-filter-title"},"Bộ phận",-1)),k.value?(o(),i("p",iu,"Đang tải cây bộ phận…")):I("",!0),T.value?(o(),i("p",su,[O(s(T.value)+" ",1),e("button",{type:"button",onClick:x},"Tải lại")])):I("",!0),e("button",{type:"button",class:Q(["department-filter-all",{selected:!ae.value}]),"aria-pressed":!ae.value,onClick:l[13]||(l[13]=y=>ae.value="")}," Tất cả bộ phận ",10,ru),e("nav",uu,[(o(!0),i(P,null,R(m.value,y=>(o(),i("details",{key:y.type,open:""},[e("summary",null,[O(s(y.label)+" ",1),e("small",null,s(y.departments.length),1)]),(o(!0),i(P,null,R(y.departments,he=>(o(),i("button",{key:he.code,type:"button",class:Q({selected:ae.value===he.name}),"aria-pressed":ae.value===he.name,onClick:re=>ae.value=he.name},[e("span",null,s(he.name),1),e("small",null,s(he.code),1)],10,du))),128))]))),128)),f.value.length?(o(),i("details",cu,[e("summary",null,[l[72]||(l[72]=O(" Chưa phân loại ",-1)),e("small",null,s(f.value.length),1)]),(o(!0),i(P,null,R(f.value,y=>(o(),i("button",{key:y.code,type:"button",class:Q({selected:ae.value===y.name}),"aria-pressed":ae.value===y.name,onClick:he=>ae.value=y.name},[e("span",null,s(y.name),1),e("small",null,s(y.code),1)],10,vu))),128))])):I("",!0)])]),e("div",hu,[e("div",mu,[e("button",{type:"button",class:"schedule-filter-launcher","aria-label":`Mở bộ lọc lịch${Qe.value?`, ${Qe.value} mục đang áp dụng`:""}`,onClick:F},[l[74]||(l[74]=e("i",{class:"pi pi-filter","aria-hidden":"true"},null,-1)),l[75]||(l[75]=e("span",null,"Bộ lọc",-1)),Qe.value?(o(),i("span",gu,s(Qe.value),1)):I("",!0)],8,pu)]),G(zs,{view:Y.value,"onUpdate:view":l[14]||(l[14]=y=>Y.value=y),anchor:B.value,"onUpdate:anchor":l[15]||(l[15]=y=>B.value=y),employees:v.all.value.map(y=>({code:y.code,name:y.name,department:String(y.department||"")})),"visible-employees":Et.value.map(y=>({code:y.code,name:y.name,department:String(y.department||"")})),"group-by-department":!ae.value,dates:Ee.value,today:z(N),shifts:h.value.shifts,"can-create":z(t).can("schedules","create"),"employee-assignments":Ue,cell:Re,matches:Le,fmt:fe,name:K,"shift-name":qe,symbol:ye,label:Ne,pending:tt,onMove:Te,onOpen:At},null,8,["view","anchor","employees","visible-employees","group-by-department","dates","today","shifts","can-create"])])])):I("",!0),g.value==="exchange"?(o(),ce(Fa,{key:3,employees:v.all.value,departments:d.all.value,"can-edit":z(t).can("schedules","edit")},null,8,["employees","departments","can-edit"])):I("",!0),g.value==="assign"?(o(),ce(gs,{key:4,onReload:_e,bulk:Xe.value,"onUpdate:bulk":l[16]||(l[16]=y=>Xe.value=y),selected:$e.value,"onUpdate:selected":l[17]||(l[17]=y=>$e.value=y),"form-department":oe.value,"onUpdate:formDepartment":l[18]||(l[18]=y=>oe.value=y),"form-search":jn.value,"onUpdate:formSearch":l[19]||(l[19]=y=>jn.value=y),"schedule-type":ie.value,"onUpdate:scheduleType":l[20]||(l[20]=y=>ie.value=y),method:ke.value,"onUpdate:method":l[21]||(l[21]=y=>ke.value=y),"day-plans":de.value,"onUpdate:dayPlans":l[22]||(l[22]=y=>de.value=y),"calendar-mode":en.value,"onUpdate:calendarMode":l[23]||(l[23]=y=>en.value=y),"calendar-anchor":pn.value,"onUpdate:calendarAnchor":l[24]||(l[24]=y=>pn.value=y),editing:se.value,busy:U.value,"can-create":z(t).can("schedules","create"),"can-edit":z(t).can("schedules",se.value?"edit":Xe.value?"bulk":"create"),"can-update":z(t).can("schedules","edit"),"can-bulk":z(t).can("schedules","bulk"),"tree-loading":k.value,"tree-error":T.value,"department-groups":m.value,"unclassified-departments":f.value,"load-department-tree":x,"shifts-loading":hn.value,"shifts-error":Sn.value,"load-manual-shifts":Yn,eligible:Ot.value,name:K,"manual-shifts":Oe.value,data:h.value,"scheduled-dates":Bt.value,start:xe.value,"administrative-shift-id":(L=h.value.shifts.find(y=>y.active&&y.code==="D"))==null?void 0:L.id,"make-preview":Pt,"create-assignment":se.value?void 0:Lt,onEdit:at,onAdministrativeBusy:l[25]||(l[25]=y=>U.value=y),onAdministrativeCreated:_e,onInput:l[26]||(l[26]=y=>C.value=!0),onChange:l[27]||(l[27]=y=>C.value=!0)},null,8,["bulk","selected","form-department","form-search","schedule-type","method","day-plans","calendar-mode","calendar-anchor","editing","busy","can-create","can-edit","can-update","can-bulk","tree-loading","tree-error","department-groups","unclassified-departments","shifts-loading","shifts-error","eligible","manual-shifts","data","scheduled-dates","start","administrative-shift-id","create-assignment"])):I("",!0),g.value==="templates"?(o(),ce(Hr,{key:5,templates:h.value.templates,shifts:h.value.shifts,departments:E.value,busy:U.value,"can-create":z(t).can("schedules","create"),"can-edit":z(t).can("schedules","edit"),"can-bulk":z(t).can("schedules","bulk"),onCreate:l[28]||(l[28]=y=>dt()),onOpen:dt,onToggle:l[29]||(l[29]=y=>Dn(()=>z(Cn).template({...y,days:[...y.days],active:!y.active}))),onApply:Rt},null,8,["templates","shifts","departments","busy","can-create","can-edit","can-bulk"])):I("",!0),g.value==="swaps"?(o(),ce(xr,{key:6,tab:En.value,"onUpdate:tab":l[30]||(l[30]=y=>En.value=y),rows:Ht.value,"can-approve":z(t).can("schedules","approve"),"can-create":z(t).can("schedules","create"),"assignment-label":vt,"shift-name":qe,onCreate:l[31]||(l[31]=y=>{bn.value={assignmentId:"",targetAssignmentId:"",shiftId:"",reason:""},yn.value=!0}),onDetail:l[32]||(l[32]=y=>{Vn.value=y,Ln.value="",An.value=!0})},null,8,["tab","rows","can-approve","can-create"])):I("",!0),g.value==="reports"?(o(),ce(wr,{key:7})):I("",!0)],64)),G(ja,{assignment:Ze.value,"department-code":((H=d.all.value.find(y=>y.name===oe.value))==null?void 0:H.code)||"","employee-name":Ze.value?K(Ze.value.employeeId):"",onClose:l[33]||(l[33]=y=>Ze.value=void 0),onSaved:Vt},null,8,["assignment","department-code","employee-name"]),G(go,{detail:In.value,"onUpdate:detail":l[34]||(l[34]=y=>In.value=y),"detail-open":Xn.value,"onUpdate:detailOpen":l[35]||(l[35]=y=>Xn.value=y),"history-open":ot.value,"onUpdate:historyOpen":l[36]||(l[36]=y=>ot.value=y),preview:De.value,"onUpdate:preview":l[37]||(l[37]=y=>De.value=y),"preview-open":vn.value,"onUpdate:previewOpen":l[38]||(l[38]=y=>vn.value=y),history:h.value.history,issues:rt.value,error:w.value,busy:U.value,today:z(N),"can-edit":z(t).can("schedules","edit"),name:K,"employee-name":be,fmt:fe,label:Ne,symbol:ye,pending:tt,"save-assignments":Mt,"edit-assignment":Ft,onClosePreview:l[39]||(l[39]=y=>vn.value=!1)},null,8,["detail","detail-open","history-open","preview","preview-open","history","issues","error","busy","today","can-edit"]),G(Ko,{open:fn.value,"onUpdate:open":l[40]||(l[40]=y=>fn.value=y),read:xn.value,"onUpdate:read":l[41]||(l[41]=y=>xn.value=y),template:nn.value,"onUpdate:template":l[42]||(l[42]=y=>nn.value=y),departments:E.value,shifts:h.value.shifts,busy:U.value,error:w.value,onSave:Ut},null,8,["open","read","template","departments","shifts","busy","error"]),G(Bo,{open:yn.value,"onUpdate:open":l[43]||(l[43]=y=>yn.value=y),"detail-open":An.value,"onUpdate:detailOpen":l[44]||(l[44]=y=>An.value=y),swap:bn.value,"onUpdate:swap":l[45]||(l[45]=y=>bn.value=y),mode:ct.value,"onUpdate:mode":l[46]||(l[46]=y=>ct.value=y),detail:Vn.value,"onUpdate:detail":l[47]||(l[47]=y=>Vn.value=y),decision:Ln.value,"onUpdate:decision":l[48]||(l[48]=y=>Ln.value=y),scheduled:zt.value,assignments:h.value.assignments,shifts:h.value.shifts,busy:U.value,error:w.value,"can-approve":z(t).can("schedules","approve"),"assignment-label":vt,"shift-name":qe,"swap-before":Kt,"swap-after":Xt,onSend:jt,onDecide:Wt},null,8,["open","detail-open","swap","mode","detail","decision","scheduled","assignments","shifts","busy","error","can-approve"]),G(qo,{open:ht.value,"onUpdate:open":l[49]||(l[49]=y=>ht.value=y),assignments:Gt.value,name:K,fmt:fe,label:Ne},null,8,["open","assignments"])])}}});export{Eu as default};
