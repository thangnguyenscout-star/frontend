import{an as Ue,am as Re,T as Qt,at as Jt,au as Zt,o as a,c as i,b as e,Q as kt,H as ee,aj as wt,ak as Tt,d as De,y as ae,I as Nn,F as U,h as X,f as j,s as ie,r as $,e as F,t as s,g as S,_ as $e,v as R,K as Fe,x as ke,L as Ce,J as Ct,as as $t,n as Z,z as ne,A as Xe,E as Te,i as Q,q as Kn,G as $n,av as le,aw as Ae,w as _t,C as an,ap as nt,al as el,af as nl,R as tl,p as Dt,k as ll,N as al,j as ol}from"./index-GtMBMh2b.js";import{b as il,s as gt,S as Nt,a as ft}from"./ScheduleEditDialog-B3_Obx_g.js";import{s as Hn,a as It,g as sl,b as rl}from"./schedule-shift.service-Crq_Ywcn.js";import{b as ul,s as Un}from"./index-DXpaTkR0.js";import{s as Ye,a as zn,i as Ee}from"./schedule-date-C26Sytjz.js";import{u as In}from"./useToast-BfKEXqAj.js";import{_ as sn}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{s as St}from"./index-C7sb-Wl_.js";import{s as on}from"./index-DpfWdQaO.js";import{s as dl}from"./index-DuK2gmMI.js";import{e as cl}from"./employee.service-CcbuQuk-.js";import{p as kn,r as vl}from"./record.service-BHHKsTl9.js";import"./employee.documents-DiekI6Sr.js";import"./employee.type-C4yVNWhM.js";import"./modules-CJV0O-xn.js";function hl(n,d,u,t){if(console.log("Mapping bulk assignments:",{rows:n,shifts:d,departmentCode:u,employees:t}),!u||!n.length)throw new Error("Chọn bộ phận và ít nhất một phân công.");return[...n].sort((o,v)=>o.date.localeCompare(v.date)||o.employeeId.localeCompare(v.employeeId)).map(o=>{const v=d.find(q=>q.id===o.shiftId);if(o.status!=="SCHEDULED"||!v)throw new Error("Chỉ có thể tạo phân công với mã ca hợp lệ.");const c=t.find(q=>q.code===o.employeeId);if(!c)throw new Error("Không tìm thấy nhân viên trong bộ phận đã chọn.");const m=Hn(o.startTime||v.startTime),y=Hn(o.endTime||v.endTime);if(!/^\d{4}-\d{2}-\d{2}$/.test(o.date)||!/^\d{2}:\d{2}$/.test(m)||!/^\d{2}:\d{2}$/.test(y))throw new Error("Ngày hoặc giờ của ca không hợp lệ.");return{...o.fullTime===!1?{toanCa:!1,maLoaiNghiPhep:o.leaveTypeId||null}:{},ngayLamViec:`${o.date}T00:00:00+07:00`,maNhanVien:o.employeeId,maCa:v.id,maBoPhan:u,maChucVu:c.positionCode||null,...il(o.date,m,y,o.crossDay??v.crossDay),trangThai:"2",nguonPhanCong:"1",ghiChu:o.note||null}})}async function ml(n){const d=n.map(v=>"{"+Object.entries(v).map(([c,m])=>`${c}: ${JSON.stringify(m)}`).join(",")+"}",3).join(","),u=Ue`mutation CreatePhanCongHangLoat {
    createPhanCongHangLoat(input: { danhSachPhanCong: [${d}] }) {
      isResults message data { tongSo thanhCong thatBai loi { maNhanVien ngayLamViec message } }
    }
  }`,{data:t}=await Re.mutate({mutation:u,errorPolicy:"none"}),o=t==null?void 0:t.createPhanCongHangLoat;if(!(o!=null&&o.data))throw new Error((o==null?void 0:o.message)||"Không thể lưu phân công ca.");if(!o.isResults&&!o.data.thatBai)throw new Error(o.message||"Không thể lưu phân công ca.");return{...o.data,loi:o.data.loi||[]}}var pl=`
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
`,gl={root:function(d){var u=d.instance;return["p-editor",{"p-invalid":u.$invalid}]},toolbar:"p-editor-toolbar",content:"p-editor-content"},fl=Qt.extend({name:"editor",style:pl,classes:gl}),yl={name:"BaseEditor",extends:ul,props:{placeholder:String,readonly:Boolean,formats:Array,editorStyle:null,modules:null},style:fl,provide:function(){return{$pcEditor:this,$parentInstance:this}}};function Dn(n){"@babel/helpers - typeof";return Dn=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(d){return typeof d}:function(d){return d&&typeof Symbol=="function"&&d.constructor===Symbol&&d!==Symbol.prototype?"symbol":typeof d},Dn(n)}function yt(n,d){var u=Object.keys(n);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(n);d&&(t=t.filter(function(o){return Object.getOwnPropertyDescriptor(n,o).enumerable})),u.push.apply(u,t)}return u}function bl(n){for(var d=1;d<arguments.length;d++){var u=arguments[d]!=null?arguments[d]:{};d%2?yt(Object(u),!0).forEach(function(t){ql(n,t,u[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(u)):yt(Object(u)).forEach(function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(u,t))})}return n}function ql(n,d,u){return(d=kl(d))in n?Object.defineProperty(n,d,{value:u,enumerable:!0,configurable:!0,writable:!0}):n[d]=u,n}function kl(n){var d=wl(n,"string");return Dn(d)=="symbol"?d:d+""}function wl(n,d){if(Dn(n)!="object"||!n)return n;var u=n[Symbol.toPrimitive];if(u!==void 0){var t=u.call(n,d);if(Dn(t)!="object")return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return(d==="string"?String:Number)(n)}var bt=(function(){try{return window.Quill}catch{return null}})(),tt={name:"Editor",extends:yl,inheritAttrs:!1,emits:["text-change","selection-change","load"],quill:null,watch:{modelValue:function(d,u){d!==u&&this.quill&&!this.quill.hasFocus()&&this.renderValue(d)},d_value:function(d,u){d!==u&&this.quill&&!this.quill.hasFocus()&&this.renderValue(d)},readonly:function(){this.handleReadOnlyChange()}},mounted:function(){var d=this,u={modules:bl({toolbar:this.$refs.toolbarElement},this.modules),readOnly:this.readonly,theme:"snow",formats:this.formats,placeholder:this.placeholder};bt?(this.quill=new bt(this.$refs.editorElement,u),this.initQuill(),this.handleLoad()):Jt(()=>import("./quill-BKoT5U3A.js"),[]).then(function(t){t&&Zt(d.$refs.editorElement)&&(t.default?d.quill=new t.default(d.$refs.editorElement,u):d.quill=new t(d.$refs.editorElement,u),d.initQuill())}).then(function(){d.handleLoad()})},beforeUnmount:function(){this.quill=null},methods:{renderValue:function(d){if(this.quill)if(d){var u=this.quill.clipboard.convert({html:d});this.quill.setContents(u)}else this.quill.setText("")},initQuill:function(){var d=this;this.renderValue(this.d_value),this.quill.on("text-change",function(u,t,o){if(o==="user"){var v=d.quill.getSemanticHTML(),c=d.quill.getText().trim();v==="<p><br></p>"&&(v=""),d.writeValue(v),d.$emit("text-change",{htmlValue:v,textValue:c,delta:u,source:o,instance:d.quill})}}),this.quill.on("selection-change",function(u,t,o){var v=d.quill.getSemanticHTML(),c=d.quill.getText().trim();d.$emit("selection-change",{htmlValue:v,textValue:c,range:u,oldRange:t,source:o,instance:d.quill})})},handleLoad:function(){this.quill&&this.quill.getModule("toolbar")&&this.$emit("load",{instance:this.quill})},handleReadOnlyChange:function(){this.quill&&this.quill.enable(!this.readonly)}}};function Tl(n,d,u,t,o,v){return a(),i("div",ee({class:n.cx("root")},n.ptmi("root")),[e("div",ee({ref:"toolbarElement",class:n.cx("toolbar")},n.ptm("toolbar")),[kt(n.$slots,"toolbar",{},function(){return[e("span",ee({class:"ql-formats"},n.ptm("formats")),[e("select",ee({class:"ql-header",defaultValue:"0"},n.ptm("header")),[e("option",ee({value:"1"},n.ptm("option")),"Heading",16),e("option",ee({value:"2"},n.ptm("option")),"Subheading",16),e("option",ee({value:"0"},n.ptm("option")),"Normal",16)],16),e("select",ee({class:"ql-font"},n.ptm("font")),[e("option",wt(Tt(n.ptm("option"))),null,16),e("option",ee({value:"serif"},n.ptm("option")),null,16),e("option",ee({value:"monospace"},n.ptm("option")),null,16)],16)],16),e("span",ee({class:"ql-formats"},n.ptm("formats")),[e("button",ee({class:"ql-bold",type:"button"},n.ptm("bold")),null,16),e("button",ee({class:"ql-italic",type:"button"},n.ptm("italic")),null,16),e("button",ee({class:"ql-underline",type:"button"},n.ptm("underline")),null,16)],16),e("span",ee({class:"ql-formats"},n.ptm("formats")),[e("select",ee({class:"ql-color"},n.ptm("color")),null,16),e("select",ee({class:"ql-background"},n.ptm("background")),null,16)],16),e("span",ee({class:"ql-formats"},n.ptm("formats")),[e("button",ee({class:"ql-list",value:"ordered",type:"button"},n.ptm("list")),null,16),e("button",ee({class:"ql-list",value:"bullet",type:"button"},n.ptm("list")),null,16),e("select",ee({class:"ql-align"},n.ptm("select")),[e("option",ee({defaultValue:""},n.ptm("option")),null,16),e("option",ee({value:"center"},n.ptm("option")),null,16),e("option",ee({value:"right"},n.ptm("option")),null,16),e("option",ee({value:"justify"},n.ptm("option")),null,16)],16)],16),e("span",ee({class:"ql-formats"},n.ptm("formats")),[e("button",ee({class:"ql-link",type:"button"},n.ptm("link")),null,16),e("button",ee({class:"ql-image",type:"button"},n.ptm("image")),null,16),e("button",ee({class:"ql-code-block",type:"button"},n.ptm("codeBlock")),null,16)],16),e("span",ee({class:"ql-formats"},n.ptm("formats")),[e("button",ee({class:"ql-clean",type:"button"},n.ptm("clean")),null,16)],16)]})],16),e("div",ee({ref:"editorElement",class:n.cx("content"),style:n.editorStyle},n.ptm("content")),null,16)],16)}tt.render=Tl;const Cl=Ue`
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
`,$l=Ue`
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
`;async function Dl(n,d){const{data:u}=await Re.query({query:$l,variables:{tuNgay:`${n}T00:00:00+07:00`,denNgay:`${d}T23:59:59.999+07:00`},fetchPolicy:"no-cache",errorPolicy:"none"}),t=u==null?void 0:u.nhanVienChuaXepCa;if(!(t!=null&&t.isResults)||!Array.isArray(t.data))throw new Error((t==null?void 0:t.message)||"Không thể tải danh sách nhân viên chưa xếp ca.");return t.data.filter(o=>!!o).map(o=>({...o,danhSachNgayXepCa:(o.danhSachNgayXepCa||[]).filter(v=>typeof v=="string").map(Ye).filter(v=>/^\d{4}-\d{2}-\d{2}$/.test(v))}))}async function Rn(n,d,u=null){const{data:t}=await Re.query({query:Cl,variables:{tuNgay:`${n}T00:00:00+07:00`,denNgay:`${d}T23:59:59.999+07:00`,maBoPhan:u},fetchPolicy:"no-cache",errorPolicy:"none"}),o=t==null?void 0:t.phanCongCa;if(!(o!=null&&o.isResults)||!Array.isArray(o.data))throw new Error((o==null?void 0:o.message)||"Không thể tải lịch phân công ca.");const v=o.data.filter(c=>!!c);return xt(v)}function xt(n){const d=new Map;return{assignments:n.map(t=>{var y;const{date:o,time:v}=gt(t.thoiGianBatDau),{date:c,time:m}=gt(t.thoiGianKetThuc);return d.set(t.maCa,{id:t.maCa,code:t.kyHieuCa||t.maCa,name:t.tenCa,scheduleType:"ROTATING",startTime:v,endTime:m,crossDay:o&&c?c>o:!!t.quaNgay,displayColor:"#2563eb",active:!0}),{id:String(t.id),employeeId:t.maNhanVien,employeeName:t.hoTen,departmentCode:t.maBoPhan,locked:t.isLocked===!0,date:Ye(t.ngayLamViec),shiftId:t.maCa,shiftSymbol:t.kyHieuCa||t.maCa,shiftName:t.tenCa,scheduleType:"ROTATING",status:"SCHEDULED",note:t.ghiChu||"",revision:1,fullTime:t.toanCa!==!1,leaveTypeId:((y=t.maLoaiNghiPhep)==null?void 0:y.trim())||null,startTime:v,endTime:m,crossDay:o&&c?c>o:!!t.quaNgay,apiStatus:t.trangThai,assignmentSource:t.nguonPhanCong,startDate:o||Ye(t.ngayLamViec),endDate:c||void 0}}),shifts:[...d.values()]}}async function Nl(n){const d=Object.entries(n).map(([v,c])=>v+": "+JSON.stringify(c)).join(","),u=Ue`mutation CreatePhanCongCa {
    createPhanCongCa(input: { ${d} }) {
      isResults
      message
      data {
        id ngayLamViec maNhanVien maNhanVienThaThe gioCongChuan heSoCa isLocked
        hoTen maBoPhan tenBoPhan maChucVu tenChucVu maCa tenCa kyHieuCa
        thoiGianBatDau thoiGianKetThuc quaNgay trangThai nguonPhanCong
        toanCa maLoaiNghiPhep ghiChu
      }
    }
  }`,{data:t}=await Re.mutate({mutation:u,errorPolicy:"none"}),o=t==null?void 0:t.createPhanCongCa;if(!(o!=null&&o.isResults))throw new Error((o==null?void 0:o.message)||"Không thể tạo phân công ca.");return o}const Il=Ue`
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
`;async function Sl(n,d=null){const{data:u}=await Re.query({query:Il,variables:{selectedNgay:n,maBoPhan:d},fetchPolicy:"no-cache",errorPolicy:"none"}),t=u==null?void 0:u.loadDanhSachNgay;if(!(t!=null&&t.isResults)||!Array.isArray(t.data))throw new Error((t==null?void 0:t.message)||"Không thể tải danh sách đổi ca.");return xt(t.data.filter(o=>!!o))}async function xl(n,d,u=""){var m,y;const t=q=>!!q.id.trim()&&q.leaveTypeId==null&&q.status!=="OFF"&&![q.shiftId,q.shiftSymbol].some(C=>/^(DO(?:0+)?|OFF)$/i.test((C==null?void 0:C.trim())||""));if(!t(n)||!t(d)||n.id===d.id||n.employeeId===d.employeeId||n.date===d.date&&n.shiftId.trim()===d.shiftId.trim())throw new Error("Chọn hai ca làm việc hợp lệ của hai nhân viên khác nhau.");const o=q=>/^\d+$/.test(q.trim())?q.trim().replace(/^0+(?=\d)/,""):JSON.stringify(q.trim()),v=Ue`mutation DoiCa($lyDoDoiCa: String!) {
    doiCa(idCaYeuCauDoi: ${o(n.id)}, idCaDuocDoi: ${o(d.id)}, lyDoDoiCa: $lyDoDoiCa) {
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
  }`,{data:c}=await Re.mutate({mutation:v,variables:{lyDoDoiCa:u||null},errorPolicy:"none"});if(!((m=c==null?void 0:c.doiCa)!=null&&m.isResults))throw new Error(((y=c==null?void 0:c.doiCa)==null?void 0:y.message)||"Không thể đổi ca. Vui lòng thử lại.");return c.doiCa}const El={key:0,class:"exchange-form"},Al={class:"employee-summary","aria-label":"Ca làm việc hiện tại"},Vl={class:"employee-code"},Ll={class:"shift-details"},Pl={class:"shift-name"},Bl={key:0,class:"error",role:"alert"},Ol={class:"date-actions"},Ml={class:"date-field",for:"exchange-date"},Fl={class:"reason-field","aria-labelledby":"exchange-reason-label"},Ul={key:1,class:"error",role:"alert"},Rl={class:"candidate-list","aria-label":"Nhân viên có thể đổi ca"},Hl={class:"list-heading"},zl={class:"hint"},Gl={key:0,class:"empty-state",role:"status"},Kl={key:1,class:"empty-state"},Xl={key:2,class:"candidate-scroll"},jl={class:"candidate-table","aria-label":"Danh sách ca làm việc có thể đổi"},Wl={class:"selection-column"},Yl=["id","value","aria-label","onChange"],Ql=["for"],Jl={class:"date-column"},Zl={class:"time-column"},_l={class:"dialog-footer"},ea={key:0,class:"exchange-form"},na={class:"confirmation-pair"},ta={class:"employee-summary"},la={class:"employee-code"},aa={class:"hint"},oa={class:"employee-summary"},ia={class:"employee-code"},sa={class:"hint"},ra={class:"reason-field reason-preview","aria-label":"Lý do đổi ca"},ua={key:1,class:"hint"},da={key:0,class:"error",role:"alert"},ca={class:"dialog-footer"},va=De({__name:"ScheduleExchangeDialog",props:{assignment:{},departmentCode:{},employeeName:{}},emits:["close","confirmed","busy"],setup(n,{emit:d}){const u=n,t=d,o=$(!1),v=In();ae(o,I=>t("busy",I),{flush:"sync"});const c=$(""),m=$([]),y=$(!1),q=$(""),C=$(),p=$("");let P=0;const h=I=>I.status==="OFF"||[I.shiftId,I.shiftSymbol].some(w=>/^(DO(?:0+)?|OFF)$/i.test((w==null?void 0:w.trim())||"")),b=I=>I.leaveTypeId===null&&!h(I);function z(){++P,m.value=[],C.value=void 0,q.value="",y.value=!1}ae(()=>u.assignment,I=>{z(),c.value=(I==null?void 0:I.date)||"",p.value=""}),ae(c,z),Nn(()=>{++P});async function H(){const I=u.assignment;if(!I||!c.value||!b(I))return;const w=++P,L=c.value;m.value=[],C.value=void 0,q.value="",y.value=!0;try{const Y=await Sl(L,u.departmentCode);w===P&&(m.value=Y.assignments.filter(N=>N.employeeId!==I.employeeId&&b(N)&&!(L===I.date&&N.shiftId.trim()===I.shiftId.trim())).map(N=>({...N,date:L})))}catch(Y){w===P&&(q.value=Ce(Y))}finally{w===P&&(y.value=!1)}}async function k(){if(!(o.value||!u.assignment||!C.value||!b(u.assignment)||!b(C.value)||C.value.date===u.assignment.date&&C.value.shiftId.trim()===u.assignment.shiftId.trim())){o.value=!0,q.value="";try{const I=await xl(u.assignment,C.value,p.value);v.success(I.message||"Đổi ca thành công."),C.value=void 0,t("close"),t("confirmed")}catch(I){v.error(I),q.value=Ce(I)}finally{o.value=!1}}}return(I,w)=>(a(),i(U,null,[X(j(Fe),{visible:!!n.assignment&&!C.value,modal:"",header:"Chọn nhân viên đổi ca",style:{width:"900px",maxWidth:"95vw"},"onUpdate:visible":w[3]||(w[3]=L=>!L&&t("close"))},{default:ie(()=>[n.assignment?(a(),i("div",El,[e("section",Al,[w[8]||(w[8]=e("span",{class:"section-label"},"Ca làm việc hiện tại",-1)),e("strong",null,[F(s(n.employeeName)+" ",1),e("span",Vl,s(n.assignment.employeeId),1)]),e("div",Ll,[e("span",null,[w[6]||(w[6]=e("i",{class:"pi pi-calendar","aria-hidden":"true"},null,-1)),F(s(n.assignment.date),1)]),e("span",Pl,s(n.assignment.shiftName||n.assignment.shiftSymbol||n.assignment.shiftId),1),e("span",null,[w[7]||(w[7]=e("i",{class:"pi pi-clock","aria-hidden":"true"},null,-1)),F(s(n.assignment.startTime)+"–"+s(n.assignment.endTime)+s(n.assignment.crossDay?" (+1 ngày)":""),1)])])]),b(n.assignment)?S("",!0):(a(),i("p",Bl," Chỉ ca làm việc không có mã nghỉ phép mới được đổi ca. Ca nghỉ DO không thể đổi ca. ")),e("div",Ol,[e("label",Ml,[w[9]||(w[9]=F("Chọn ngày ",-1)),X(j(Un),{id:"exchange-date",modelValue:c.value,"onUpdate:modelValue":w[0]||(w[0]=L=>c.value=L),type:"date"},null,8,["modelValue"])]),X($e,{type:"button",label:"Tải lại danh sách",icon:"pi pi-refresh",outlined:"",loading:y.value,disabled:y.value||!c.value||!b(n.assignment),onClick:H},null,8,["loading","disabled"])]),e("section",Fl,[w[11]||(w[11]=e("label",{id:"exchange-reason-label"},"Lý do đổi ca",-1)),X(j(tt),{modelValue:p.value,"onUpdate:modelValue":w[1]||(w[1]=L=>p.value=L),"editor-style":"height: 140px",placeholder:"Nhập lý do đổi ca…"},{toolbar:ie(()=>[...w[10]||(w[10]=[e("span",{class:"ql-formats"},[e("button",{class:"ql-bold",type:"button","aria-label":"In đậm",title:"In đậm"}),e("button",{class:"ql-italic",type:"button","aria-label":"In nghiêng",title:"In nghiêng"}),e("button",{class:"ql-underline",type:"button","aria-label":"Gạch chân",title:"Gạch chân"})],-1),e("span",{class:"ql-formats"},[e("button",{class:"ql-list",value:"ordered",type:"button","aria-label":"Danh sách đánh số",title:"Danh sách đánh số"}),e("button",{class:"ql-list",value:"bullet",type:"button","aria-label":"Danh sách dấu chấm",title:"Danh sách dấu chấm"}),e("button",{class:"ql-clean",type:"button","aria-label":"Xóa định dạng",title:"Xóa định dạng"})],-1)])]),_:1},8,["modelValue"])]),q.value?(a(),i("p",Ul,s(q.value),1)):S("",!0),e("section",Rl,[e("div",Hl,[w[12]||(w[12]=e("strong",null,"Nhân viên có thể đổi ca",-1)),e("span",zl,s(m.value.length)+" nhân viên",1)]),y.value?(a(),i("div",Gl,[...w[13]||(w[13]=[e("i",{class:"pi pi-spin pi-spinner","aria-hidden":"true"},null,-1),F("Đang tải danh sách nhân viên… ",-1)])])):m.value.length?(a(),i("div",Xl,[e("table",jl,[w[15]||(w[15]=e("thead",null,[e("tr",null,[e("th",{scope:"col",class:"selection-column"},"Chọn"),e("th",{scope:"col"},"Mã nhân viên"),e("th",{scope:"col"},"Họ tên"),e("th",{scope:"col"},"Ngày làm việc"),e("th",{scope:"col"},"Ca làm việc"),e("th",{scope:"col"},"Giờ làm việc")])],-1)),e("tbody",null,[(a(!0),i(U,null,R(m.value,L=>(a(),i("tr",{key:L.id,class:"candidate"},[e("td",Wl,[e("input",{id:"exchange-candidate-"+L.id,type:"radio",name:"exchange-employee",value:L.id,"aria-label":"Chọn "+(L.employeeName||L.employeeId)+" · "+L.date,onChange:Y=>C.value=L},null,40,Yl)]),e("td",null,s(L.employeeId),1),e("td",null,[e("label",{for:"exchange-candidate-"+L.id},s(L.employeeName||L.employeeId),9,Ql)]),e("td",Jl,s(L.date.split("-").reverse().join("/")),1),e("td",null,s(L.shiftName||L.shiftSymbol||L.shiftId),1),e("td",Zl,s(L.startTime||"—")+"–"+s(L.endTime||"—")+s(L.crossDay?" (+1 ngày)":""),1)]))),128))])])])):(a(),i("div",Kl,[...w[14]||(w[14]=[e("i",{class:"pi pi-users","aria-hidden":"true"},null,-1),e("p",null,"Chưa có nhân viên phù hợp.",-1),e("span",{class:"hint"},"Chọn ngày rồi nhấn Tải lại danh sách.",-1)])]))]),w[16]||(w[16]=e("p",{class:"hint"},"Chọn nhân viên để xem thông tin xác nhận chuyển ca.",-1)),e("footer",_l,[X($e,{type:"button",label:"Hủy",severity:"secondary",outlined:"",onClick:w[2]||(w[2]=L=>t("close"))})])])):S("",!0)]),_:1},8,["visible"]),X(j(Fe),{visible:!!C.value,modal:"",header:"Xác nhận chuyển ca",closable:!o.value,"close-on-escape":!o.value,style:{width:"560px",maxWidth:"95vw"},"onUpdate:visible":w[5]||(w[5]=L=>!o.value&&!L&&(C.value=void 0))},{default:ie(()=>[n.assignment&&C.value?(a(),i("div",ea,[w[22]||(w[22]=e("p",null,"Bạn có xác nhận chuyển ca giữa hai nhân viên sau không?",-1)),e("div",na,[e("section",ta,[w[17]||(w[17]=e("span",{class:"section-label"},"Ca hiện tại",-1)),e("strong",null,[F(s(n.employeeName)+" ",1),e("span",la,s(n.assignment.employeeId),1)]),e("span",null,s(n.assignment.date)+" · "+s(n.assignment.shiftName||n.assignment.shiftId),1),e("span",aa,s(n.assignment.startTime)+"–"+s(n.assignment.endTime)+s(n.assignment.crossDay?" (+1 ngày)":""),1)]),w[19]||(w[19]=e("i",{class:"pi pi-arrow-right-arrow-left exchange-icon","aria-hidden":"true"},null,-1)),e("section",oa,[w[18]||(w[18]=e("span",{class:"section-label"},"Ca được chọn",-1)),e("strong",null,[F(s(C.value.employeeName||C.value.employeeId)+" ",1),e("span",ia,s(C.value.employeeId),1)]),e("span",null,s(C.value.date)+" · "+s(C.value.shiftName||C.value.shiftId),1),e("span",sa,s(C.value.startTime)+"–"+s(C.value.endTime)+s(C.value.crossDay?" (+1 ngày)":""),1)])]),e("section",ra,[w[21]||(w[21]=e("strong",null,"Lý do đổi ca",-1)),p.value?(a(),ke(j(tt),{key:0,"model-value":p.value,readonly:"","editor-style":"min-height: 80px"},{toolbar:ie(()=>[...w[20]||(w[20]=[e("span",{class:"hint"},"Nội dung lý do đã nhập",-1)])]),_:1},8,["model-value"])):(a(),i("p",ua,"Chưa nhập lý do đổi ca."))]),q.value?(a(),i("p",da,s(q.value),1)):S("",!0),e("footer",ca,[X($e,{type:"button",label:"Quay lại",severity:"secondary",outlined:"",disabled:o.value,onClick:w[4]||(w[4]=L=>C.value=void 0)},null,8,["disabled"]),X($e,{type:"button",label:"OK",icon:"pi pi-check",loading:o.value,disabled:o.value,onClick:k},null,8,["loading","disabled"])])])):S("",!0)]),_:1},8,["visible","closable","close-on-escape"])],64))}}),Et=sn(va,[["__scopeId","data-v-6f0ce4b9"]]),ha=Ue`
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
`;async function ma(n,d,u=null,t=null){const{data:o}=await Re.query({query:ha,variables:{tuNgay:n+"T00:00:00+07:00",denNgay:d+"T23:59:59.999+07:00",maBoPhan:u,maNhanVien:t},fetchPolicy:"no-cache",errorPolicy:"none"}),v=o==null?void 0:o.leaveHistory;if(!(v!=null&&v.isResults)||!Array.isArray(v.data))throw new Error((v==null?void 0:v.message)||"Không thể tải lịch sử nghỉ phép.");return v.data.filter(c=>!!c)}function pa(n,d=null){const u=(d||n).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").toLowerCase();let t;if(/khong luong|unpaid|sans solde/.test(u))t=215;else if(/thai san|maternity|paternity|maternite/.test(u))t=275;else if(/om|benh|sick|maladie/.test(u))t=35;else if(/phep nam|hang nam|annual|annuel/.test(u))t=150;else if(/viec rieng|gia dinh|personal|family|familial/.test(u))t=205;else{let o=0;for(const v of n)o=o*31+v.charCodeAt(0)>>>0;t=o%360}return{background:"hsl("+t+", 75%, 94%)",border:"hsl("+t+", 55%, 65%)",text:"hsl("+t+", 65%, 25%)"}}function et(n){return Date.parse(/(?:Z|[+-]\d{2}:?\d{2})$/i.test(n)?n:n+(n.includes("T")?"":"T00:00:00")+"+07:00")}function ga(n,d){const u=new Map;for(const t of n){const o=et(t.tuNgay),v=et(t.denNgay);if(!(!Number.isFinite(o)||!Number.isFinite(v)||v<=o))for(const c of d){const m=et(c);if(o<m+864e5&&v>m){const y=t.maNhanVien+":"+c,q=u.get(y)||[];q.push(t),u.set(y,q)}}}return u}const fa=Ue`
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
`;async function ya(){const{data:n}=await Re.query({query:fa,fetchPolicy:"no-cache",errorPolicy:"none"}),d=n==null?void 0:n.danhSachNgayLe;if(!(d!=null&&d.isResults)||!Array.isArray(d.data))throw new Error((d==null?void 0:d.message)||"Không thể tải danh sách ngày lễ.");return d.data.filter(u=>!!u&&u.trangThai===!0)}function Xn(n,d){const u=new Date(`${n}T12:00:00`);d==="week"&&u.setDate(u.getDate()-(u.getDay()+6)%7),d==="month"&&u.setDate(1);const t=new Date(u);d==="week"&&t.setDate(t.getDate()+6),d==="month"&&t.setMonth(t.getMonth()+1,0);const o=v=>`${v.getFullYear()}-${String(v.getMonth()+1).padStart(2,"0")}-${String(v.getDate()).padStart(2,"0")}`;return{from:o(u),to:o(t)}}const ba={class:"calendar-header"},qa={class:"calendar-heading"},ka={class:"calendar-heading-icon","aria-hidden":"true"},wa={class:"calendar-subtitle"},Ta={class:"calendar-controls"},Ca={class:"control-field"},$a={class:"date-navigation"},Da=["disabled"],Na=["disabled"],Ia=["disabled"],Sa={class:"control-field"},xa=["disabled"],Ea={class:"control-field department-control"},Aa=["disabled"],Va=["value"],La={class:"control-field search-control"},Pa={class:"search-input-wrap"},Ba=["disabled"],Oa=["disabled"],Ma={class:"calendar-hint"},Fa={key:0,class:"leave-legend","aria-label":"Chú giải loại nghỉ phép"},Ua={key:1,role:"status"},Ra={key:2},Ha={key:3,role:"status"},za={key:4,role:"alert",class:"error"},Ga={ref:"scrollArea",class:"calendar-scroll"},Ka={key:0,class:"holiday-name"},Xa={class:"number"},ja={class:"person"},Wa=["data-employee-id","data-date","aria-disabled","title","onPointerdown","onPointerenter"],Ya=["data-assignment-id","disabled","onClick"],Qa={key:0,class:"holiday-name"},Ja=["title","aria-label"],Za={key:0},_a=De({__name:"ScheduleActionCalendar",props:{mode:{},employees:{},departments:{},canEdit:{type:Boolean}},setup(n){const d=n,u=$(zn()),t=$("month"),o=$(""),v=$(""),c=$([]),m=$(!1),y=$([]),q=$([]),C=$(!1),p=$(!1),P=$(""),h=Q(()=>Xn(u.value||zn(),t.value)),b=Q(()=>{const B=[],D=new Date(h.value.from+"T12:00:00Z");for(;D.toISOString().slice(0,10)<=h.value.to;)B.push(D.toISOString().slice(0,10)),D.setUTCDate(D.getUTCDate()+1);return B}),z=Q(()=>c.value.filter(B=>B.trangThai).map(B=>({...B,from:Ye(B.tuNgay),to:Ye(B.denNgay)}))),H=B=>z.value.filter(D=>D.from<=B&&D.to>=B),k=B=>H(B).map(D=>D.tenNgayLe).join(" · ");function I(B,D){const[f,T]=[B,D].sort();return z.value.some(x=>x.from<=T&&x.to>=f)}const w=Q(()=>{const B=new Map(d.employees.map(D=>[D.code,D]));if(d.mode==="leave")for(const D of y.value){const f=B.get(D.maNhanVien);B.set(D.maNhanVien,{...f,code:D.maNhanVien,name:D.hoTen||(f==null?void 0:f.name)||D.maNhanVien,department:D.tenBoPhan||(f==null?void 0:f.department)||""})}return[...B.values()]}),L=Q(()=>w.value.filter(B=>(!o.value||B.department===o.value)&&(B.code+" "+B.name).toLocaleLowerCase().includes(v.value.toLocaleLowerCase()))),Y=Q(()=>ga(y.value,b.value)),N=(B,D)=>Y.value.get(B+":"+D)||[],A=Q(()=>[...new Map(y.value.map(B=>[B.loaiNghiPhep,{code:B.loaiNghiPhep,name:B.tenLoaiNghi||B.loaiNghiPhep,...pa(B.loaiNghiPhep,B.tenLoaiNghi)}])).values()].sort((B,D)=>B.name.localeCompare(D.name,"vi"))),G=B=>{const D=A.value.find(f=>f.code===B.loaiNghiPhep);return{backgroundColor:D.background,borderColor:D.border,color:D.text}};function te(B,D){const f=N(B,D);return d.mode!=="leave"||!f.length?{}:f.length===1?{backgroundColor:G(f[0]).backgroundColor}:{background:"linear-gradient(135deg, "+f.map((x,E)=>G(x).backgroundColor+" "+E*100/f.length+"% "+(E+1)*100/f.length+"%").join(", ")+")"}}function oe(B){return[B.tenLoaiNghi||B.loaiNghiPhep,B.hoTen||B.maNhanVien,B.tuNgay+" → "+B.denNgay,B.soNgayNghi+" ngày",B.lyDoNghi,"Trạng thái: "+B.tinhTrang].filter(Boolean).join(`
`)}Ct(()=>!p.value),$t(()=>!p.value);let ge=0;async function me(){var D;const B=++ge;C.value=!0,P.value="",q.value=[],y.value=[],c.value=[],m.value=!1;try{if(d.mode==="leave"){const f=((D=d.departments.find(E=>E.name===o.value))==null?void 0:D.code)||null,[T,x]=await Promise.all([ma(h.value.from,h.value.to,f),ya()]);B===ge&&(y.value=T,c.value=x,m.value=!0)}else{const f=await Rn(h.value.from,h.value.to);B===ge&&(q.value=f.assignments)}}catch(f){B===ge&&(P.value=Ce(f))}finally{B===ge&&(C.value=!1)}}ae([h,()=>d.mode,o],me,{immediate:!0});function Se(B){const D=new Date(u.value+"T12:00:00Z");t.value==="month"?(D.setUTCDate(1),D.setUTCMonth(D.getUTCMonth()+B)):D.setUTCDate(D.getUTCDate()+B*7),u.value=D.toISOString().slice(0,10)}const Ne=(B,D)=>q.value.filter(f=>f.employeeId===B&&f.date===D),ue=B=>{var D;return((D=w.value.find(f=>f.code===B))==null?void 0:D.name)||B},fe=$(),pe=$(),se=$(),ye=$(),be=B=>new Date(B+"T12:00:00Z").getUTCDay()===0;function Be(B,D){const[f,T]=[B,D].sort(),x=new Date(f+"T12:00:00Z"),E=(Date.parse(T+"T12:00:00Z")-x.getTime())/864e5;return(7-x.getUTCDay())%7<=E}function re(B,D,f){B.button!==0||d.mode!=="leave"||!d.canEdit||p.value||C.value||Ee(f)||be(f)||!m.value||H(f).length>0||(B.preventDefault(),pe.value={employeeId:D,fromDate:f,toDate:f})}function je(B,D){var f;((f=pe.value)==null?void 0:f.employeeId)===B&&!Ee(D)&&m.value&&!I(pe.value.fromDate,D)&&!Be(pe.value.fromDate,D)&&(pe.value.toDate=D)}function rn(B,D){const f=pe.value;return(f==null?void 0:f.employeeId)===B&&!be(D)&&!H(D).length&&D>=[f.fromDate,f.toDate].sort()[0]&&D<=[f.fromDate,f.toDate].sort()[1]}function _e(){const B=pe.value;if(!B)return;if(!m.value||I(B.fromDate,B.toDate)||Be(B.fromDate,B.toDate)){pe.value=void 0;return}const[D,f]=[B.fromDate,B.toDate].sort();ye.value={fromDate:D,toDate:f},se.value={id:"",employeeId:B.employeeId,date:D,shiftId:"",scheduleType:"ROTATING",status:"SCHEDULED",note:"",revision:1},pe.value=void 0}function Ke(){pe.value=void 0}return window.addEventListener("pointerup",_e),window.addEventListener("pointercancel",Ke),window.addEventListener("blur",Ke),Nn(()=>{++ge,window.removeEventListener("pointerup",_e),window.removeEventListener("pointercancel",Ke),window.removeEventListener("blur",Ke)}),ae([h,()=>d.mode,o,v],()=>{Ke(),fe.value=void 0,se.value=void 0}),(B,D)=>{var T,x,E;const f=Kn("RouterLink");return a(),i("section",{class:Z(["action-calendar",{"month-view":t.value==="month"}])},[e("header",ba,[e("div",qa,[e("span",ka,[e("i",{class:Z(n.mode==="exchange"?"pi pi-arrow-right-arrow-left":"pi pi-calendar-minus")},null,2)]),e("div",null,[e("h2",null,s(n.mode==="exchange"?"Đổi ca":"Lịch nghỉ phép"),1),e("span",wa,s(L.value.length)+" nhân viên · "+s(t.value==="month"?"Lịch tháng":"Lịch tuần"),1)])]),X(f,{class:"calendar-back",to:"/schedules/assign"},{default:ie(()=>[...D[11]||(D[11]=[e("i",{class:"pi pi-arrow-left","aria-hidden":"true"},null,-1),F("Quay về lịch phân công",-1)])]),_:1})]),e("div",Ta,[e("div",Ca,[D[14]||(D[14]=e("span",{class:"control-label"},"Thời gian",-1)),e("div",$a,[e("button",{type:"button",class:"calendar-nav-button",disabled:p.value,"aria-label":"Xem kỳ trước",onClick:D[0]||(D[0]=V=>Se(-1))},[...D[12]||(D[12]=[e("i",{class:"pi pi-chevron-left","aria-hidden":"true"},null,-1)])],8,Da),ne(e("input",{"onUpdate:modelValue":D[1]||(D[1]=V=>u.value=V),class:"control-input calendar-date",type:"date","aria-label":"Ngày xem lịch",disabled:p.value},null,8,Na),[[Xe,u.value]]),e("button",{type:"button",class:"calendar-nav-button",disabled:p.value,"aria-label":"Xem kỳ sau",onClick:D[2]||(D[2]=V=>Se(1))},[...D[13]||(D[13]=[e("i",{class:"pi pi-chevron-right","aria-hidden":"true"},null,-1)])],8,Ia)])]),e("label",Sa,[D[16]||(D[16]=e("span",{class:"control-label"},"Chế độ xem",-1)),ne(e("select",{"onUpdate:modelValue":D[3]||(D[3]=V=>t.value=V),class:"control-input",disabled:p.value},[...D[15]||(D[15]=[e("option",{value:"month"},"Lịch tháng",-1),e("option",{value:"week"},"Lịch tuần",-1)])],8,xa),[[Te,t.value]])]),e("label",Ea,[D[18]||(D[18]=e("span",{class:"control-label"},"Bộ phận",-1)),ne(e("select",{"onUpdate:modelValue":D[4]||(D[4]=V=>o.value=V),class:"control-input",disabled:p.value},[D[17]||(D[17]=e("option",{value:""},"Tất cả bộ phận",-1)),(a(!0),i(U,null,R(n.departments,V=>(a(),i("option",{key:V.code,value:V.name},s(V.name),9,Va))),128))],8,Aa),[[Te,o.value]])]),e("label",La,[D[20]||(D[20]=e("span",{class:"control-label"},"Nhân viên",-1)),e("span",Pa,[D[19]||(D[19]=e("i",{class:"pi pi-search","aria-hidden":"true"},null,-1)),ne(e("input",{"onUpdate:modelValue":D[5]||(D[5]=V=>v.value=V),class:"control-input",placeholder:"Tìm mã hoặc họ tên",disabled:p.value},null,8,Ba),[[Xe,v.value]])])]),e("button",{type:"button",class:"calendar-reload",disabled:C.value||p.value,onClick:me},[e("i",{class:Z(C.value?"pi pi-spin pi-spinner":"pi pi-refresh"),"aria-hidden":"true"},null,2),D[21]||(D[21]=F("Tải lại ",-1))],8,Oa)]),e("p",Ma,s(n.mode==="exchange"?"Bấm vào ca làm việc để chọn nhân viên đổi ca.":"Kéo chọn các ngày trên cùng hàng nhân viên, sau đó nhập giờ và loại nghỉ phép."),1),n.mode==="leave"&&A.value.length?(a(),i("div",Fa,[(a(!0),i(U,null,R(A.value,V=>(a(),i("span",{key:V.code,style:$n({backgroundColor:V.background,color:V.text,borderColor:V.border})},s(V.name)+" ("+s(V.code)+")",5))),128))])):S("",!0),n.mode==="leave"&&!C.value&&!P.value&&!y.value.length?(a(),i("p",Ua," Không có lịch nghỉ phép trong khoảng thời gian đã chọn. ")):S("",!0),n.canEdit?S("",!0):(a(),i("p",Ra,"Bạn không có quyền điều chỉnh lịch.")),C.value?(a(),i("p",Ha,"Đang tải lịch…")):S("",!0),P.value?(a(),i("p",za,s(P.value),1)):S("",!0),e("div",Ga,[e("table",null,[e("thead",null,[e("tr",null,[D[22]||(D[22]=e("th",{class:"number"},"STT",-1)),D[23]||(D[23]=e("th",{class:"person"},"Họ và tên / Bộ phận / Chức vụ",-1)),(a(!0),i(U,null,R(b.value,V=>(a(),i("th",{key:V,class:Z(["date-column",{"holiday-heading":n.mode==="leave"&&H(V).length}])},[F(s(V.slice(8))+"/"+s(V.slice(5,7)),1),e("small",null,s(new Date(V+"T12:00:00").toLocaleDateString("vi-VN",{weekday:"short"})),1),n.mode==="leave"&&H(V).length?(a(),i("small",Ka,s(k(V)),1)):S("",!0)],2))),128))])]),e("tbody",null,[(a(!0),i(U,null,R(L.value,(V,W)=>(a(),i("tr",{key:V.code},[e("td",Xa,s(W+1),1),e("th",ja,[F(s(V.name),1),e("small",null,s(V.code),1),e("small",null,s(V.department)+" / "+s(V.position||"—"),1)]),(a(!0),i(U,null,R(b.value,J=>(a(),i("td",{key:J,class:Z(["date-column",{selected:rn(V.code,J),"sunday-locked":n.mode==="leave"&&be(J),"holiday-locked":n.mode==="leave"&&H(J).length>0,past:j(Ee)(J),"has-leave":n.mode==="leave"&&N(V.code,J).length>0}]),"data-employee-id":V.code,"data-date":J,style:$n(te(V.code,J)),"aria-disabled":n.mode==="leave"&&(!m.value||be(J)||H(J).length>0)?!0:void 0,title:n.mode==="leave"&&H(J).length?"Ngày nghỉ lễ: "+k(J):n.mode==="leave"&&be(J)?"Không thể chọn nghỉ phép vào Chủ nhật.":void 0,onPointerdown:_=>re(_,V.code,J),onPointerenter:_=>je(V.code,J)},[n.mode==="exchange"?(a(!0),i(U,{key:0},R(Ne(V.code,J),_=>(a(),i("button",{key:_.id,class:"sticker",type:"button","data-assignment-id":_.id,disabled:!n.canEdit||p.value||C.value,title:"Bấm để chọn nhân viên đổi ca",onClick:He=>fe.value=_},[e("strong",null,s(_.shiftSymbol||_.shiftId),1),e("small",null,s(_.startTime)+"–"+s(_.endTime)+s(_.crossDay?" (+1)":""),1)],8,Ya))),128)):(a(),i(U,{key:1},[H(J).length?(a(),i("span",Qa,s(k(J)),1)):S("",!0),(a(!0),i(U,null,R(N(V.code,J),_=>(a(),i("span",{key:_.id,class:"leave-badge",style:$n(G(_)),title:oe(_),"aria-label":oe(_),tabindex:"0"},s(_.tenLoaiNghi||_.loaiNghiPhep),13,Ja))),128))],64))],46,Wa))),128))]))),128))])]),L.value.length?S("",!0):(a(),i("p",Za,"Không tìm thấy nhân viên."))],512),X(Et,{onBusy:D[6]||(D[6]=V=>p.value=V),assignment:fe.value,"department-code":((T=n.departments.find(V=>V.name===o.value))==null?void 0:T.code)||((x=fe.value)==null?void 0:x.departmentCode)||null,"employee-name":fe.value?ue(fe.value.employeeId):"",onClose:D[7]||(D[7]=V=>fe.value=void 0),onConfirmed:me},null,8,["assignment","department-code","employee-name"]),X(Nt,{assignment:se.value,"initial-action":"leave","leave-range":ye.value,"department-code":((E=n.departments.find(V=>{var W;return V.name===((W=w.value.find(J=>{var _;return J.code===((_=se.value)==null?void 0:_.employeeId)}))==null?void 0:W.department)}))==null?void 0:E.code)||"","employee-name":se.value?ue(se.value.employeeId):"",onBusy:D[8]||(D[8]=V=>p.value=V),onClose:D[9]||(D[9]=V=>se.value=void 0),onSaved:D[10]||(D[10]=V=>{se.value=void 0,me()})},null,8,["assignment","leave-range","department-code","employee-name"])],2)}}}),eo=sn(_a,[["__scopeId","data-v-764d868a"]]),no={key:0},to={class:"actions"},lo={key:1},ao={key:0},oo={class:"schedule-dialog"},io={key:0,class:"error"},so={class:"preview-calendar-toolbar"},ro=["aria-label"],uo={key:0},co=["aria-label"],vo={class:"preview-calendar-mode"},ho={class:"preview-calendar-table"},mo={class:"preview-calendar-employee"},po={key:0},go={key:0},fo={key:0},yo=["colspan"],bo={key:1,class:"error",role:"alert",style:{"white-space":"pre-line"}},qo={class:"actions"},ko=["disabled"],wo=["disabled"],To=De({__name:"ScheduleAssignmentDialogs",props:Ae({history:{},issues:{},error:{},busy:{type:Boolean},today:{},canEdit:{type:Boolean},name:{type:Function},employeeName:{type:Function},fmt:{type:Function},label:{type:Function},symbol:{type:Function},pending:{type:Function},saveAssignments:{type:Function},editAssignment:{type:Function}},{detail:{},detailModifiers:{},detailOpen:{type:Boolean,required:!0},detailOpenModifiers:{},historyOpen:{type:Boolean,required:!0},historyOpenModifiers:{},preview:{required:!0},previewModifiers:{},previewOpen:{type:Boolean,required:!0},previewOpenModifiers:{}}),emits:Ae(["closePreview"],["update:detail","update:detailOpen","update:historyOpen","update:preview","update:previewOpen"]),setup(n,{emit:d}){const u=le(n,"detail"),t=le(n,"detailOpen"),o=le(n,"historyOpen"),v=le(n,"preview"),c=le(n,"previewOpen"),m=n,y=d,q=$("week"),C=$(m.today),p=["T2","T3","T4","T5","T6","T7","CN"];ae(c,k=>{if(!k)return;const I=v.value.map(Y=>Y.date).sort(),w=I[0]||m.today,L=I[I.length-1]||w;C.value=w,q.value=P(w,L)>6?"month":"week"});function P(k,I){return Math.round((new Date(`${I}T12:00:00`).getTime()-new Date(`${k}T12:00:00`).getTime())/864e5)}const h=Q(()=>{const k=new Date(C.value+"T12:00:00");q.value==="week"?k.setDate(k.getDate()-(k.getDay()+6)%7):k.setDate(1);const I=q.value==="week"?7:new Date(k.getFullYear(),k.getMonth()+1,0).getDate();return Array.from({length:I},(w,L)=>{const Y=new Date(k);return Y.setDate(Y.getDate()+L),`${Y.getFullYear()}-${String(Y.getMonth()+1).padStart(2,"0")}-${String(Y.getDate()).padStart(2,"0")}`})}),b=Q(()=>[...new Set(v.value.map(I=>I.employeeId))].map(I=>({code:I,name:m.employeeName(I)})).sort((I,w)=>I.name.localeCompare(w.name,"vi")));function z(k,I){return v.value.filter(w=>w.employeeId===k&&w.date===I)}function H(k){const I=new Date(C.value+"T12:00:00");q.value==="month"?(I.setDate(1),I.setMonth(I.getMonth()+k)):I.setDate(I.getDate()+k*7),C.value=`${I.getFullYear()}-${String(I.getMonth()+1).padStart(2,"0")}-${String(I.getDate()).padStart(2,"0")}`}return(k,I)=>(a(),i(U,null,[X(j(St),{visible:t.value,"onUpdate:visible":I[2]||(I[2]=w=>t.value=w),header:"Chi tiết phân công",position:"right",class:"schedule-drawer"},{default:ie(()=>[u.value?(a(),i(U,{key:0},[e("h3",null,s(n.name(u.value.employeeId)),1),e("p",null,s(n.fmt(u.value.date))+" · "+s(u.value.scheduleType==="ADMINISTRATIVE"?"Hành chính":"Xoay ca"),1),e("p",null,s(n.label(u.value)),1),e("p",null,s(u.value.note||"Chưa có ghi chú"),1),n.pending(u.value)?(a(),i("p",no,"↔ Có yêu cầu đổi ca chờ duyệt")):S("",!0),e("div",to,[e("button",{onClick:I[0]||(I[0]=w=>o.value=!o.value)},"Lịch sử"),n.canEdit?(a(),i("button",{key:0,onClick:I[1]||(I[1]=(...w)=>n.editAssignment&&n.editAssignment(...w))},"Sửa phân công")):S("",!0)]),o.value?(a(),i("ul",lo,[(a(!0),i(U,null,R(n.history.filter(w=>{var L;return w.assignmentId===((L=u.value)==null?void 0:L.id)}),(w,L)=>(a(),i("li",{key:L},s(w.action)+" · "+s(new Date(w.date).toLocaleString("vi-VN")),1))),128)),n.history.some(w=>{var L;return w.assignmentId===((L=u.value)==null?void 0:L.id)})?S("",!0):(a(),i("li",ao," Chưa có lịch sử thay đổi. "))])):S("",!0)],64)):S("",!0)]),_:1},8,["visible"]),X(j(Fe),{visible:c.value,"onUpdate:visible":I[9]||(I[9]=w=>c.value=w),modal:"",header:"Xem trước phân công",style:{width:"1000px",maxWidth:"95vw"}},{default:ie(()=>[e("div",oo,[e("p",null,s(v.value.length)+" phân công · "+s(b.value.length)+" nhân viên",1),n.issues.length?(a(),i("div",io,[e("strong",null,"⚠ "+s(n.issues.length)+" xung đột — không thể lưu",1),(a(!0),i(U,null,R(n.issues,(w,L)=>(a(),i("p",{key:L},[F(s(n.name(w.row.employeeId))+" · "+s(n.fmt(w.row.date)),1),I[10]||(I[10]=e("br",null,null,-1)),F(" Ca mới: "+s(n.label(w.row)),1),I[11]||(I[11]=e("br",null,null,-1)),F(" Đã có: "+s(n.label(w.existing))+" · "+s(n.fmt(w.existing.date)),1),I[12]||(I[12]=e("br",null,null,-1)),F(" "+s(w.reason),1)]))),128))])):S("",!0),e("div",so,[e("button",{type:"button","aria-label":q.value==="week"?"Tuần trước":"Tháng trước",onClick:I[3]||(I[3]=w=>H(-1))}," ‹ ",8,ro),h.value.length?(a(),i("strong",uo,s(n.fmt(h.value[0]))+" – "+s(n.fmt(h.value[h.value.length-1])),1)):S("",!0),e("button",{type:"button","aria-label":q.value==="week"?"Tuần sau":"Tháng sau",onClick:I[4]||(I[4]=w=>H(1))}," › ",8,co),e("div",vo,[e("button",{class:Z({active:q.value==="week"}),onClick:I[5]||(I[5]=w=>q.value="week")}," Tuần ",2),e("button",{class:Z({active:q.value==="month"}),onClick:I[6]||(I[6]=w=>q.value="month")}," Tháng ",2)])]),e("div",{class:Z(["preview-calendar-scroll","mode-"+q.value])},[e("table",ho,[e("thead",null,[e("tr",null,[I[13]||(I[13]=e("th",{class:"preview-calendar-employee"},"Nhân viên",-1)),(a(!0),i(U,null,R(h.value,w=>(a(),i("th",{key:w,class:Z({weekend:[0,6].includes(new Date(w+"T12:00:00").getDay()),today:w===n.today})},[F(s(p[(new Date(w+"T12:00:00").getDay()+6)%7])+" ",1),e("small",null,s(Number(w.slice(-2)))+"/"+s(Number(w.slice(5,7))),1)],2))),128))])]),e("tbody",null,[(a(!0),i(U,null,R(b.value,w=>(a(),i("tr",{key:w.code},[e("th",mo,[e("strong",null,s(w.name),1),e("small",null,s(w.code),1)]),(a(!0),i(U,null,R(h.value,L=>(a(),i("td",{key:L,class:Z({weekend:[0,6].includes(new Date(L+"T12:00:00").getDay())})},[(a(!0),i(U,null,R(z(w.code,L),Y=>(a(),i(U,{key:Y.id+Y.shiftId},[e("strong",null,s(Y.status==="OFF"?"Nghỉ":n.symbol(Y)),1),Y.startTime&&Y.endTime?(a(),i("small",po,s(j(Hn)(Y.startTime))+"–"+s(j(Hn)(Y.endTime))+s(Y.crossDay?" (+1 ngày)":""),1)):S("",!0)],64))),128)),z(w.code,L).length?S("",!0):(a(),i("span",go,"—"))],2))),128))]))),128)),b.value.length?S("",!0):(a(),i("tr",fo,[e("td",{colspan:h.value.length+1,class:"empty-state"}," Không có phân công trong khoảng này. ",8,yo)]))])])],2),n.error?(a(),i("p",bo,s(n.error),1)):S("",!0),e("div",qo,[e("button",{disabled:n.busy,onClick:I[7]||(I[7]=w=>y("closePreview"))},"Quay lại",8,ko),e("button",{class:"primary",disabled:n.busy||!!n.issues.length||!v.value.length,onClick:I[8]||(I[8]=(...w)=>n.saveAssignments&&n.saveAssignments(...w))},s(n.busy?"Đang lưu…":"Lưu phân công"),9,wo)])])]),_:1},8,["visible"])],64))}}),Co={class:"table-scroll schedule-dialog"},$o={class:"report"},Do={key:0},No=De({__name:"ScheduleDrillDialog",props:Ae({assignments:{},name:{type:Function},fmt:{type:Function},label:{type:Function}},{open:{type:Boolean,required:!0},openModifiers:{}}),emits:["update:open"],setup(n){const d=le(n,"open");return(u,t)=>(a(),ke(j(Fe),{visible:d.value,"onUpdate:visible":t[0]||(t[0]=o=>d.value=o),modal:"",header:"Lịch chi tiết",style:{width:"800px",maxWidth:"95vw"}},{default:ie(()=>[e("div",Co,[e("table",$o,[t[2]||(t[2]=e("thead",null,[e("tr",null,[e("th",null,"Nhân viên"),e("th",null,"Ngày"),e("th",null,"Phân công")])],-1)),e("tbody",null,[(a(!0),i(U,null,R(n.assignments,o=>(a(),i("tr",{key:o.id},[e("td",null,s(n.name(o.employeeId)),1),e("td",null,s(n.fmt(o.date)),1),e("td",null,s(n.label(o)),1)]))),128)),n.assignments.length?S("",!0):(a(),i("tr",Do,[...t[1]||(t[1]=[e("td",{colspan:"3"},"Chưa có lịch phù hợp.",-1)])]))])])])]),_:1},8,["visible"]))}}),Io={class:"schedule-dialog"},So=["value"],xo={key:0},Eo=["value"],Ao={key:1},Vo=["value"],Lo={key:2,class:"error"},Po=["disabled"],Bo={key:0},Oo={key:1},Mo={key:2},Fo={key:0,class:"error"},Uo={class:"actions"},Ro=["disabled"],Ho=["disabled"],zo=De({__name:"ScheduleSwapDialogs",props:Ae({scheduled:{},assignments:{},shifts:{},busy:{type:Boolean},error:{},canApprove:{type:Boolean},assignmentLabel:{type:Function},shiftName:{type:Function},swapBefore:{type:Function},swapAfter:{type:Function}},{open:{type:Boolean,required:!0},openModifiers:{},detailOpen:{type:Boolean,required:!0},detailOpenModifiers:{},swap:{required:!0},swapModifiers:{},mode:{required:!0},modeModifiers:{},detail:{},detailModifiers:{},decision:{required:!0},decisionModifiers:{}}),emits:Ae(["send","decide"],["update:open","update:detailOpen","update:swap","update:mode","update:detail","update:decision"]),setup(n,{emit:d}){const u=le(n,"open"),t=le(n,"detailOpen"),o=le(n,"swap"),v=le(n,"mode"),c=le(n,"detail"),m=le(n,"decision"),y=n,q=d,C={PENDING:"Chờ duyệt",APPROVED:"Đã duyệt",REJECTED:"Từ chối",CANCELLED:"Đã hủy"},p=Q(()=>y.assignments.find(P=>P.id===o.value.assignmentId));return(P,h)=>(a(),i(U,null,[X(j(Fe),{visible:u.value,"onUpdate:visible":h[7]||(h[7]=b=>u.value=b),modal:"",header:"Tạo yêu cầu đổi ca",style:{width:"650px",maxWidth:"95vw"}},{default:ie(()=>[e("div",Io,[e("label",null,[h[13]||(h[13]=F(" Ca muốn đổi * ",-1)),ne(e("select",{"onUpdate:modelValue":h[0]||(h[0]=b=>o.value.assignmentId=b)},[h[12]||(h[12]=e("option",{value:""},"Chọn ca đã phân công",-1)),(a(!0),i(U,null,R(n.scheduled,b=>(a(),i("option",{key:b.id,value:b.id},s(n.assignmentLabel(b.id)),9,So))),128))],512),[[Te,o.value.assignmentId]])]),e("label",null,[h[15]||(h[15]=F(" Hình thức ",-1)),ne(e("select",{"onUpdate:modelValue":h[1]||(h[1]=b=>v.value=b),onChange:h[2]||(h[2]=b=>{o.value.targetAssignmentId="",o.value.shiftId=""})},[...h[14]||(h[14]=[e("option",{value:"employee"},"Đổi với nhân viên khác",-1),e("option",{value:"shift"},"Xin đổi sang ca khác",-1)])],544),[[Te,v.value]])]),v.value==="employee"?(a(),i("label",xo,[h[17]||(h[17]=F(" Ca của nhân viên đổi cùng ",-1)),ne(e("select",{"onUpdate:modelValue":h[3]||(h[3]=b=>o.value.targetAssignmentId=b)},[h[16]||(h[16]=e("option",{value:""},"Chọn nhân viên / ca",-1)),(a(!0),i(U,null,R(n.scheduled.filter(b=>{var z;return b.employeeId!==((z=p.value)==null?void 0:z.employeeId)}),b=>(a(),i("option",{key:b.id,value:b.id},s(n.assignmentLabel(b.id)),9,Eo))),128))],512),[[Te,o.value.targetAssignmentId]])])):(a(),i("label",Ao,[h[19]||(h[19]=F(" Ca muốn đổi sang ",-1)),ne(e("select",{"onUpdate:modelValue":h[4]||(h[4]=b=>o.value.shiftId=b)},[h[18]||(h[18]=e("option",{value:""},"Chọn ca",-1)),(a(!0),i(U,null,R(n.shifts.filter(b=>b.active),b=>(a(),i("option",{key:b.id,value:b.id},s(n.shiftName(b.id)),9,Vo))),128))],512),[[Te,o.value.shiftId]])])),e("label",null,[h[20]||(h[20]=F("Lý do *",-1)),ne(e("textarea",{"onUpdate:modelValue":h[5]||(h[5]=b=>o.value.reason=b)},null,512),[[Xe,o.value.reason]])]),n.error?(a(),i("p",Lo,s(n.error),1)):S("",!0),e("button",{class:"primary",disabled:n.busy,onClick:h[6]||(h[6]=b=>q("send"))},s(n.busy?"Đang gửi…":"Gửi yêu cầu"),9,Po)])]),_:1},8,["visible"]),X(j(St),{visible:t.value,"onUpdate:visible":h[11]||(h[11]=b=>t.value=b),header:"Chi tiết yêu cầu đổi ca",position:"right",class:"schedule-drawer"},{default:ie(()=>[c.value?(a(),i(U,{key:0},[e("h3",null,s(c.value.code)+" · "+s(C[c.value.status]),1),h[22]||(h[22]=e("h4",null,"Trước khi đổi",-1)),e("p",null,s(n.swapBefore(c.value)),1),c.value.targetAssignmentId?(a(),i("p",Bo,s(n.swapBefore(c.value,!0)),1)):S("",!0),h[23]||(h[23]=e("h4",null,"Sau khi đổi (dự kiến)",-1)),e("p",null,s(n.swapAfter(c.value)),1),c.value.targetAssignmentId?(a(),i("p",Oo,s(n.swapAfter(c.value,!0)),1)):S("",!0),e("p",null,"Lý do: "+s(c.value.reason),1),c.value.decision?(a(),i("p",Mo,"Phản hồi: "+s(c.value.decision),1)):S("",!0),c.value.status==="PENDING"&&n.canApprove?(a(),i(U,{key:3},[e("label",null,[h[21]||(h[21]=F("Phản hồi / lý do từ chối",-1)),ne(e("textarea",{"onUpdate:modelValue":h[8]||(h[8]=b=>m.value=b)},null,512),[[Xe,m.value]])]),n.error?(a(),i("p",Fo,s(n.error),1)):S("",!0),e("div",Uo,[e("button",{disabled:n.busy,onClick:h[9]||(h[9]=b=>q("decide",!1))},"Từ chối",8,Ro),e("button",{class:"primary",disabled:n.busy,onClick:h[10]||(h[10]=b=>q("decide",!0))}," Duyệt đổi ca ",8,Ho)])],64)):S("",!0)],64)):S("",!0)]),_:1},8,["visible"])],64))}}),Go={class:"schedule-dialog"},Ko=["disabled"],Xo={class:"form-grid"},jo={class:"pattern"},Wo=["onUpdate:modelValue"],Yo=["value"],Qo={key:0,class:"error"},Jo=["disabled"],Zo=De({__name:"ScheduleTemplateDialog",props:Ae({departments:{},shifts:{},busy:{type:Boolean},error:{}},{open:{type:Boolean,required:!0},openModifiers:{},read:{type:Boolean,required:!0},readModifiers:{},template:{required:!0},templateModifiers:{}}),emits:Ae(["save"],["update:open","update:read","update:template"]),setup(n,{emit:d}){const u=le(n,"open"),t=le(n,"read"),o=le(n,"template"),v=d,c=["T2","T3","T4","T5","T6","T7","CN"];return(m,y)=>(a(),ke(j(Fe),{visible:u.value,"onUpdate:visible":y[10]||(y[10]=q=>u.value=q),modal:"",header:t.value?"Chi tiết mẫu lịch":"Cấu hình mẫu lịch",style:{width:"800px",maxWidth:"95vw"}},{default:ie(()=>[e("div",Go,[e("fieldset",{disabled:t.value||n.busy},[e("div",Xo,[e("label",null,[y[11]||(y[11]=F("Tên mẫu *",-1)),ne(e("input",{"onUpdate:modelValue":y[0]||(y[0]=q=>o.value.name=q)},null,512),[[Xe,o.value.name]])]),e("label",null,[y[13]||(y[13]=F(" Loại lịch ",-1)),ne(e("select",{"onUpdate:modelValue":y[1]||(y[1]=q=>o.value.scheduleType=q),onChange:y[2]||(y[2]=q=>o.value.days=Array(o.value.days.length).fill("OFF"))},[...y[12]||(y[12]=[e("option",{value:"ADMINISTRATIVE"},"Hành chính",-1),e("option",{value:"ROTATING"},"Xoay ca",-1)])],544),[[Te,o.value.scheduleType]])]),e("label",null,[y[15]||(y[15]=F(" Bộ phận ",-1)),ne(e("select",{"onUpdate:modelValue":y[3]||(y[3]=q=>o.value.department=q)},[y[14]||(y[14]=e("option",{value:""},"Tất cả",-1)),(a(!0),i(U,null,R(n.departments,q=>(a(),i("option",{key:q},s(q),1))),128))],512),[[Te,o.value.department]])]),e("label",null,[y[17]||(y[17]=F(" Loại mẫu ",-1)),ne(e("select",{"onUpdate:modelValue":y[4]||(y[4]=q=>o.value.kind=q),onChange:y[5]||(y[5]=q=>o.value.days=Array(7).fill("OFF"))},[...y[16]||(y[16]=[e("option",{value:"WEEK"},"Mẫu tuần",-1),e("option",{value:"CYCLE"},"Chu kỳ xoay",-1)])],544),[[Te,o.value.kind]])])]),e("div",jo,[(a(!0),i(U,null,R(o.value.days,(q,C)=>(a(),i("label",{key:C},[F(s(o.value.kind==="WEEK"?c[C]:"Ngày "+(C+1))+" ",1),ne(e("select",{"onUpdate:modelValue":p=>o.value.days[C]=p},[y[18]||(y[18]=e("option",{value:"OFF"},"Nghỉ",-1)),(a(!0),i(U,null,R(n.shifts.filter(p=>p.active&&p.scheduleType===o.value.scheduleType),p=>(a(),i("option",{key:p.id,value:p.id},s(p.name),9,Yo))),128))],8,Wo),[[Te,o.value.days[C]]])]))),128)),o.value.kind==="CYCLE"?(a(),i("button",{key:0,onClick:y[6]||(y[6]=q=>o.value.days.push("OFF"))}," + Thêm ngày ")):S("",!0),o.value.kind==="CYCLE"&&o.value.days.length>1?(a(),i("button",{key:1,onClick:y[7]||(y[7]=q=>o.value.days.pop())}," Bỏ ngày cuối ")):S("",!0)]),e("label",null,[y[19]||(y[19]=F("Ghi chú",-1)),ne(e("textarea",{"onUpdate:modelValue":y[8]||(y[8]=q=>o.value.note=q)},null,512),[[Xe,o.value.note]])])],8,Ko),n.error?(a(),i("p",Qo,s(n.error),1)):S("",!0),t.value?S("",!0):(a(),i("button",{key:1,class:"primary",disabled:n.busy,onClick:y[9]||(y[9]=q=>v("save"))},s(n.busy?"Đang lưu…":"Lưu mẫu"),9,Jo))])]),_:1},8,["visible","header"]))}});function lt(n,d=Ye(new Date().toISOString())){if(!/^\d{4}-\d{2}-\d{2}$/.test(n))return!1;const{from:u}=Xn(n,"week");return u>=d}const _o=Ue`
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
`;async function ei(n,d){if(!n||!lt(d))throw new Error("Chỉ được tạo lịch tuần tương lai hoặc tuần hiện tại vào thứ Hai.");const{from:u,to:t}=Xn(d,"week"),{data:o}=await Re.mutate({mutation:_o,variables:{maBoPhan:n,tuNgay:u,denNgay:t},errorPolicy:"none"});if(!(o!=null&&o.createLichXoayCa))throw new Error("Không nhận được kết quả xếp ca.");return o.createLichXoayCa}const ni={key:0,class:"auto-schedule"},ti=["disabled"],li={key:0},ai={key:1},oi={key:0,class:"schedule-dialog-body"},ii={key:0,class:"schedule-dialog-details"},si={key:1,class:"schedule-dialog-message warning"},ri=De({__name:"ScheduleRotatingDialog",props:{eligible:{type:Boolean},departmentCode:{},anchor:{},week:{type:Boolean},disabled:{type:Boolean}},emits:["saved","busy"],setup(n,{emit:d}){const u=In(),t=n,o=d,v=$(!1),c=$(!1),m=$(),y=Q(()=>t.week&&lt(t.anchor));async function q(){if(!(!t.eligible||t.disabled||v.value||!t.departmentCode||!t.week||!lt(t.anchor))){v.value=!0,o("busy",!0);try{m.value=await ei(t.departmentCode,t.anchor),m.value.isResults?o("saved"):(m.value.message=Ce(m.value),u.error(m.value.message))}catch(C){u.error(C),m.value={isResults:!1,message:Ce(C)}}finally{c.value=!0,v.value=!1,o("busy",!1)}}}return(C,p)=>(a(),i(U,null,[n.eligible?(a(),i("div",ni,[e("button",{type:"button",class:"auto-schedule-button",disabled:n.disabled||v.value||!y.value||!n.departmentCode,onClick:q},s(v.value?"Đang tạo lịch…":"Tự động tạo lịch"),9,ti),n.week?y.value?S("",!0):(a(),i("p",ai,"Chỉ được tạo lịch tuần tương lai hoặc tuần hiện tại vào thứ Hai.")):(a(),i("p",li,"Chọn chế độ tuần để tự động tạo lịch."))])):S("",!0),X(j(Fe),{class:"schedule-dialog",visible:c.value,"onUpdate:visible":p[1]||(p[1]=P=>c.value=P),modal:"",header:"Kết quả xếp ca",style:{width:"520px",maxWidth:"95vw"}},{footer:ie(()=>[X($e,{type:"button",label:"Đóng",severity:"secondary",outlined:"",onClick:p[0]||(p[0]=P=>c.value=!1)})]),default:ie(()=>{var P;return[m.value?(a(),i("div",oi,[e("p",{class:Z(["schedule-dialog-message",m.value.isResults?"success":"error"]),role:"status"},s(m.value.message||(m.value.isResults?"Tạo lịch thành công.":"Tạo lịch không thành công.")),3),m.value.data?(a(),i("dl",ii,[p[2]||(p[2]=e("dt",null,"Bộ phận",-1)),e("dd",null,s(m.value.data.maBoPhan),1),p[3]||(p[3]=e("dt",null,"Từ ngày",-1)),e("dd",null,s(m.value.data.tuNgay),1),p[4]||(p[4]=e("dt",null,"Đến ngày",-1)),e("dd",null,s(m.value.data.denNgay),1),p[5]||(p[5]=e("dt",null,"Số phân công",-1)),e("dd",null,s(m.value.data.soPhanCong),1),p[6]||(p[6]=e("dt",null,"Số ca làm việc",-1)),e("dd",null,s(m.value.data.soCaLamViec),1),p[7]||(p[7]=e("dt",null,"Số ngày DO000",-1)),e("dd",null,s(m.value.data.soNgayDO000),1),p[8]||(p[8]=e("dt",null,"Đủ định biên",-1)),e("dd",null,s(m.value.data.duDinhBien?"Có":"Không"),1),p[9]||(p[9]=e("dt",null,"Tất cả nhân viên đủ sáu ngày",-1)),e("dd",null,s(m.value.data.tatCaNhanVienDuSauNgay?"Có":"Không"),1)])):S("",!0),(P=m.value.data)!=null&&P.canhBao?(a(),i("p",si,s(Array.isArray(m.value.data.canhBao)?m.value.data.canhBao.join(`
`):m.value.data.canhBao),1)):S("",!0)])):S("",!0)]}),_:1},8,["visible"])],64))}});function Gn(n=new Date){const d=new Date(n.getTime()+252e5);return{month:d.getUTCMonth()+1,year:d.getUTCFullYear()}}function ui(n,d,u=new Date){const t=Gn(u);if(!Number.isInteger(n)||!Number.isInteger(d)||n<1||n>12||d<1)throw new Error("Vui lòng chọn tháng và năm hợp lệ.");if(d<t.year||d===t.year&&n<t.month)throw new Error("Không thể phân ca cho tháng/năm quá khứ.")}const di=Ue`
  mutation CreateLichHanhChinh($thang: Int!, $nam: Int!) {
    createLichHanhChinh(thang: $thang, nam: $nam) {
      isResults
      message
    }
  }
`;async function ci(n,d){var t,o;ui(n,d);const{data:u}=await Re.mutate({mutation:di,variables:{thang:n,nam:d},errorPolicy:"none"});if(!((t=u==null?void 0:u.createLichHanhChinh)!=null&&t.isResults))throw new Error(((o=u==null?void 0:u.createLichHanhChinh)==null?void 0:o.message)||"Phân ca hành chính thất bại.");return u.createLichHanhChinh.message||"Phân ca hành chính thành công."}const vi={class:"period-fields"},hi=De({__name:"ScheduleAdministrativeDialog",props:{disabled:{type:Boolean}},emits:["saved","busy"],setup(n,{emit:d}){const u=n,t=d,o=In(),v=$(!1),c=$(!1),m=$(Gn()),y=$(m.value.month),q=$(m.value.year),C=Q(()=>Array.from({length:12},(b,z)=>({value:z+1,label:"Tháng "+(z+1)})).filter(b=>q.value!==m.value.year||b.value>=m.value.month)),p=Q(()=>Array.from({length:Math.max(0,2100-m.value.year+1)},(b,z)=>({value:m.value.year+z,label:String(m.value.year+z)})));ae(q,b=>{b===m.value.year&&(y.value==null||y.value<m.value.month)&&(y.value=m.value.month)});function P(){u.disabled||c.value||(m.value=Gn(),y.value=m.value.month,q.value=m.value.year,v.value=!0)}async function h(){if(!(c.value||u.disabled)){c.value=!0,t("busy",!0);try{const b=await ci(y.value,q.value);o.success(b),v.value=!1,t("saved")}catch(b){o.error(b)}finally{c.value=!1,t("busy",!1)}}}return(b,z)=>(a(),i(U,null,[X($e,{label:"Phân ca hành chính",icon:"pi pi-calendar-plus",disabled:n.disabled||c.value,onClick:P},null,8,["disabled"]),X(j(Fe),{class:"schedule-dialog",visible:v.value,modal:"",header:"Phân ca hành chính",closable:!c.value,"close-on-escape":!c.value,style:{width:"440px",maxWidth:"95vw"},"onUpdate:visible":z[3]||(z[3]=H=>!c.value&&(v.value=H))},{default:ie(()=>[e("form",{class:"period-form",onSubmit:_t(h,["prevent"])},[e("div",vi,[e("label",null,[z[4]||(z[4]=F("Tháng",-1)),X(j(on),{modelValue:y.value,"onUpdate:modelValue":z[0]||(z[0]=H=>y.value=H),options:C.value,"option-label":"label","option-value":"value",disabled:c.value,placeholder:"Chọn tháng"},null,8,["modelValue","options","disabled"])]),e("label",null,[z[5]||(z[5]=F("Năm",-1)),X(j(on),{modelValue:q.value,"onUpdate:modelValue":z[1]||(z[1]=H=>q.value=H),options:p.value,"option-label":"label","option-value":"value",filter:"",disabled:c.value,placeholder:"Chọn năm"},null,8,["modelValue","options","disabled"])])]),e("footer",null,[X($e,{type:"button",label:"Hủy",severity:"secondary",outlined:"",disabled:c.value,onClick:z[2]||(z[2]=H=>v.value=!1)},null,8,["disabled"]),X($e,{type:"submit",label:"Xác nhận",icon:"pi pi-check",loading:c.value,disabled:y.value==null||q.value==null||q.value<m.value.year},null,8,["loading","disabled"])])],32)]),_:1},8,["visible","closable","close-on-escape"])],64))}}),mi=sn(hi,[["__scopeId","data-v-1f0b35a9"]]),pi={class:"assignment-calendar"},gi={class:"calendar-toolbar"},fi={class:"calendar-navigation"},yi=["aria-label","disabled"],bi=["value","disabled"],qi=["value","disabled"],ki=["aria-label","disabled"],wi={key:2},Ti={class:"view-toggle",role:"group","aria-label":"Phạm vi lịch phân công"},Ci=["aria-pressed"],$i=["aria-pressed"],Di={class:"employee-calendar-wrap"},Ni={class:"employee-calendar"},Ii={class:"employee-column"},Si={class:"department-column"},xi=["title"],Ei=["disabled","aria-label","onClick"],Ai={key:0},Vi={key:0},Li=["colspan"],Pi=["disabled"],Bi={class:"schedule-dialog-summary"},Oi={class:"full-time"},Mi={key:0},Fi={key:1,role:"alert"},Ui={key:0,class:"full-time"},Ri={key:1},Hi={key:2},zi={key:3,role:"alert"},Gi={key:0},Ki={key:2,class:"schedule-dialog-message error",role:"alert"},Xi={class:"schedule-dialog-actions"},ji={class:"schedule-dialog-body"},Wi={class:"schedule-dialog-summary"},Yi={class:"schedule-dialog-details"},Qi=De({__name:"AssignmentCalendar",props:{employees:{},shifts:{},existingAssignments:{},canEdit:{type:Boolean},scheduledDates:{},shiftsLoading:{type:Boolean},shiftsError:{},modelValue:{},createAssignment:{type:Function},initialDate:{},viewMode:{},anchorDate:{},fixedDate:{},disabled:{type:Boolean},administrative:{type:Boolean},administrativeShiftId:{}},emits:["edit","request-shifts","update:modelValue","update:viewMode","update:anchorDate"],setup(n,{emit:d}){const u=In(),t=n,o=d,v=$(!1),c=$(!1),m=$(),y=$(!1),q=$(""),C=$(""),p=$(!0),P=$(""),h=$(""),b=$(""),z=$("12:00"),H=$(""),k=$([]),I=$(!1),w=$("");async function L(){if(!I.value){I.value=!0,w.value="";try{k.value=(await It(null,"ADMINISTRATIVE")).filter(f=>f.workType==="0")}catch(f){w.value=Ce(f)}finally{I.value=!1}}}ae(p,f=>{t.administrative&&!f&&!k.value.length&&L()}),ae(()=>t.disabled,f=>{f&&!v.value&&(y.value=!1,c.value=!1)});const Y=Q(()=>t.shifts.find(f=>f.id===C.value)),N=Q(()=>{var f;return!t.administrative&&!!((f=Y.value)!=null&&f.code.endsWith("XX"))}),A=Q(()=>{if(t.administrative&&!p.value)return z.value;if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(b.value))return"";const[f,T]=b.value.split(":").map(Number);return`${String((f+(p.value?8:4))%24).padStart(2,"0")}:${String(T).padStart(2,"0")}`}),G=Q(()=>!!A.value&&A.value<=b.value);ae([C,Y],()=>{var f,T,x,E;if(t.administrative){b.value="08:00";return}b.value=((f=ye(q.value))==null?void 0:f.shiftId)===C.value?((T=ye(q.value))==null?void 0:T.startTime)||((x=Y.value)==null?void 0:x.startTime)||"":((E=Y.value)==null?void 0:E.startTime)||""});const te=$(zn());let oe;an(()=>{oe=setInterval(()=>{te.value=zn()},3e4)}),Nn(()=>clearInterval(oe));const ge=["T2","T3","T4","T5","T6","T7","CN"],me=$(""),Se=Q(()=>t.employees.find(f=>f.code===me.value)),Ne=Q(()=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(t.anchorDate))return[];const f=new Date(t.anchorDate+"T12:00:00");if(Number.isNaN(f.getTime()))return[];t.viewMode==="week"?f.setDate(f.getDate()-(f.getDay()+6)%7):f.setDate(1);const T=t.viewMode==="week"?7:new Date(f.getFullYear(),f.getMonth()+1,0).getDate();return Array.from({length:T},(x,E)=>{const V=new Date(f);return V.setDate(V.getDate()+E),`${V.getFullYear()}-${String(V.getMonth()+1).padStart(2,"0")}-${String(V.getDate()).padStart(2,"0")}`})});function ue(f){const T=new Date(t.anchorDate+"T12:00:00");t.viewMode==="month"?(T.setDate(1),T.setMonth(T.getMonth()+f)):T.setDate(T.getDate()+f*7),fe(T)}function fe(f){o("update:anchorDate",`${f.getFullYear()}-${String(f.getMonth()+1).padStart(2,"0")}-${String(f.getDate()).padStart(2,"0")}`)}function pe(f){/^\d{4}-\d{2}$/.test(f)&&fe(new Date(`${f}-01T12:00:00`))}function se(f){return new Date(`${f}T12:00:00`).toLocaleDateString("vi-VN")}function ye(f,T=me.value){return t.modelValue.find(x=>x.date===f&&x.employeeId===T)}function be(f,T){var x,E;return t.fixedDate===f?!1:((x=t.scheduledDates)==null?void 0:x.some(V=>V.employeeId===T&&V.dates.includes(f)))||((E=t.existingAssignments)==null?void 0:E.some(V=>V.employeeId===T&&V.date===f))}function Be(f,T){var x,E;return((E=(x=t.existingAssignments)==null?void 0:x.find(V=>V.employeeId===T&&V.date===f))==null?void 0:E.assignmentSource)==="S"}function re(f){return t.administrative&&new Date(`${f}T12:00:00`).getDay()===0}function je(f,T){var V,W;if(v.value||c.value)return;const x=(V=t.existingAssignments)==null?void 0:V.find(J=>J.employeeId===T&&J.date===f);if(x&&t.canEdit&&!t.disabled&&!Ee(f)){o("edit",x);return}if(t.administrative||t.disabled||re(f)||Ee(f)||be(f,T))return;me.value=T;const E=ye(f);q.value=f,C.value=t.administrative?t.administrativeShiftId||"":(E==null?void 0:E.shiftId)||"",H.value=(E==null?void 0:E.leaveTypeId)||"",p.value=t.createAssignment?!0:(E==null?void 0:E.fullTime)??!0,t.administrative&&!p.value&&!k.value.length&&L(),P.value=(E==null?void 0:E.note)||"",h.value="",b.value=t.administrative?"08:00":(E==null?void 0:E.startTime)||((W=Y.value)==null?void 0:W.startTime)||"",z.value=(E==null?void 0:E.fullTime)===!1&&E.endTime||"12:00",y.value=!0,t.administrative||o("request-shifts")}function rn(){var f,T,x;if(!(t.disabled||v.value)){if(t.administrative&&!p.value&&(!/^([01]\d|2[0-3]):[0-5]\d$/.test(z.value)||z.value<="08:00"||z.value>"16:00")){h.value="Giờ kết thúc phải sau 08:00 và không quá 16:00.";return}if(t.administrative&&!p.value&&(I.value||!k.value.some(E=>E.id===H.value))){h.value="Chọn mã nghỉ phép cho nửa ca còn lại.";return}if(Ee(q.value)){h.value="Không được phân công ngày trong quá khứ.";return}if(!(!t.administrative&&(t.shiftsLoading||t.shiftsError))){if(N.value&&!A.value){h.value="Vui lòng nhập giờ bắt đầu hợp lệ.";return}if(!t.administrative&&(!C.value||C.value!=="OFF"&&!t.shifts.some(E=>E.id===C.value))||t.administrative&&!t.administrativeShiftId){h.value="Vui lòng chọn ca đang hoạt động.";return}if(t.createAssignment){const E=Y.value;if(!E||!E.active||E.workType==="0"){h.value="Vui lòng chọn ca làm việc đang hoạt động.";return}if(!p.value){h.value="Vui lòng chọn toàn thời gian để tạo phân công ca.";return}m.value={employeeId:me.value,date:q.value,shiftId:E.id,fullTime:!0,note:P.value,startTime:N.value?b.value:E.startTime,endTime:N.value?A.value:E.endTime,crossDay:N.value?G.value:E.crossDay},c.value=!0;return}o("update:modelValue",[...t.modelValue.filter(E=>E.date!==q.value||E.employeeId!==me.value),{employeeId:me.value,date:q.value,shiftId:t.administrative?t.administrativeShiftId:C.value,leaveTypeId:t.administrative&&!p.value?H.value:null,fullTime:C.value==="OFF"?!0:p.value,note:t.administrative?"":P.value,...t.administrative&&!p.value?{startTime:b.value,endTime:A.value,crossDay:G.value}:{},...!t.administrative&&C.value!=="OFF"?{startTime:N.value?b.value:(f=Y.value)==null?void 0:f.startTime,endTime:N.value?A.value:(T=Y.value)==null?void 0:T.endTime,crossDay:N.value?G.value:(x=Y.value)==null?void 0:x.crossDay}:{}}].sort((E,V)=>E.date.localeCompare(V.date))),y.value=!1}}}async function _e(){if(c.value&&!(!c.value||!m.value||!t.createAssignment||v.value||t.disabled)){if(Ee(m.value.date)||be(m.value.date,m.value.employeeId)){c.value=!1,h.value="Ngày phân công không còn hợp lệ hoặc nhân viên đã được phân ca. Vui lòng tải lại lịch.";return}v.value=!0,h.value="";try{await t.createAssignment({...m.value}),c.value=!1,y.value=!1,m.value=void 0}catch(f){u.error(f),c.value=!1,h.value=Ce(f)}finally{v.value=!1}}}function Ke(){o("update:modelValue",t.modelValue.filter(f=>f.date!==q.value||f.employeeId!==me.value)),y.value=!1}function B(f,T=me.value){var V,W,J,_,He;const x=(V=t.existingAssignments)==null?void 0:V.find(Ie=>Ie.employeeId===T&&Ie.date===f);if(x)return((W=x.shiftSymbol)==null?void 0:W.trim())||((J=t.shifts.find(Ie=>Ie.id===x.shiftId))==null?void 0:J.code)||x.shiftId;const E=ye(f,T);return E?E.shiftId==="OFF"?"Nghỉ":((_=t.shifts.find(Ie=>Ie.id===E.shiftId))==null?void 0:_.code)||E.shiftId:be(f,T)?t.administrative&&(((He=t.shifts.find(Ie=>Ie.id===t.administrativeShiftId))==null?void 0:He.code)||t.administrativeShiftId)||"Đã xếp":re(f)?"Không xếp":""}function D(f,T){var Ve,Oe;const x=(Ve=t.existingAssignments)==null?void 0:Ve.find(ze=>ze.employeeId===T&&ze.date===f),E=ye(f,T);if(!x&&!E)return;const V=t.shifts.find(ze=>ze.id===((x==null?void 0:x.shiftId)||(E==null?void 0:E.shiftId))),W=((Oe=t.employees.find(ze=>ze.code===T))==null?void 0:Oe.name)||(x==null?void 0:x.employeeName)||T,J=(x==null?void 0:x.shiftName)||(V==null?void 0:V.name)||B(f,T),_=(x==null?void 0:x.startTime)||(E==null?void 0:E.startTime)||(V==null?void 0:V.startTime),He=(x==null?void 0:x.endTime)||(E==null?void 0:E.endTime)||(V==null?void 0:V.endTime),Ie=(x==null?void 0:x.crossDay)??(E==null?void 0:E.crossDay)??(V==null?void 0:V.crossDay);return[`Họ tên: ${W} (${T})`,`Ngày làm việc: ${se(f)}`,`Ca làm việc: ${J}`,`Thời gian làm việc: ${_||"—"}–${He||"—"}${Ie?" (+1 ngày)":""}`].join(`
`)}return(f,T)=>(a(),i("section",pi,[e("div",gi,[e("div",null,[T[18]||(T[18]=e("h3",null,"Lịch phân công theo nhân viên",-1)),e("p",null,s(n.administrative?"Lịch hành chính được sắp xếp sẵn.":"Bấm ô ngày của nhân viên để chọn ca.")+" "+s(n.employees.length)+" nhân viên · "+s(n.modelValue.length)+" phân công đã chọn. ",1)]),e("div",fi,[e("button",{type:"button","aria-label":n.viewMode==="week"?"Tuần trước":"Tháng trước",disabled:!!n.fixedDate,onClick:T[0]||(T[0]=x=>ue(-1))}," ‹",8,yi),n.viewMode==="week"?(a(),i("input",{key:0,value:n.anchorDate,type:"date","aria-label":"Ngày trong tuần phân công",disabled:!!n.fixedDate,onInput:T[1]||(T[1]=x=>fe(new Date(x.target.value+"T12:00:00")))},null,40,bi)):(a(),i("input",{key:1,value:n.anchorDate.slice(0,7),type:"month","aria-label":"Tháng phân công",disabled:!!n.fixedDate,onInput:T[2]||(T[2]=x=>pe(x.target.value))},null,40,qi)),e("button",{type:"button","aria-label":n.viewMode==="week"?"Tuần sau":"Tháng sau",disabled:!!n.fixedDate,onClick:T[3]||(T[3]=x=>ue(1))}," › ",8,ki),Ne.value.length?(a(),i("strong",wi,s(se(Ne.value[0]))+" – "+s(se(Ne.value[Ne.value.length-1])),1)):S("",!0),e("div",Ti,[e("button",{type:"button",class:Z({active:n.viewMode==="week"}),"aria-pressed":n.viewMode==="week",onClick:T[4]||(T[4]=x=>o("update:viewMode","week"))}," Tuần ",10,Ci),e("button",{type:"button",class:Z({active:n.viewMode==="month"}),"aria-pressed":n.viewMode==="month",onClick:T[5]||(T[5]=x=>o("update:viewMode","month"))}," Tháng ",10,$i)])])]),e("div",Di,[e("table",Ni,[e("thead",null,[e("tr",null,[T[19]||(T[19]=e("th",{class:"employee-column"},"Nhân viên",-1)),T[20]||(T[20]=e("th",{class:"department-column"},"Bộ phận",-1)),(a(!0),i(U,null,R(Ne.value,x=>(a(),i("th",{key:x,class:Z({weekend:[0,6].includes(new Date(x+"T12:00:00").getDay())})},[F(s(ge[(new Date(x+"T12:00:00").getDay()+6)%7]),1),e("small",null,s(Number(x.slice(-2)))+"/"+s(Number(x.slice(5,7))),1)],2))),128))])]),e("tbody",null,[(a(!0),i(U,null,R(n.employees,x=>(a(),i("tr",{key:x.code},[e("th",Ii,[e("strong",null,s(x.name),1),e("small",null,s(x.code),1)]),e("td",Si,s(x.department||"Chưa có bộ phận"),1),(a(!0),i(U,null,R(Ne.value,E=>{var V,W;return a(),i("td",{key:E,title:D(E,x.code),class:Z({weekend:[0,6].includes(new Date(E+"T12:00:00").getDay())})},[e("button",{type:"button",class:Z({picked:!!ye(E,x.code),assigned:be(E,x.code),"source-s":Be(E,x.code)}),disabled:n.administrative&&!(n.canEdit&&be(E,x.code))||n.disabled||E<te.value||!!n.fixedDate&&E!==n.fixedDate||re(E)||be(E,x.code)&&!n.canEdit,"aria-label":x.name+" · "+E+" · "+B(E,x.code),onClick:J=>je(E,x.code)},[e("strong",null,s(B(E,x.code)||"+ Chọn ca"),1),ye(E,x.code)&&((V=ye(E,x.code))==null?void 0:V.shiftId)!=="OFF"?(a(),i("small",Ai,s((W=ye(E,x.code))!=null&&W.fullTime?"Cả ca":"1/2 ca"),1)):S("",!0)],10,Ei)],10,xi)}),128))]))),128)),n.employees.length?S("",!0):(a(),i("tr",Vi,[e("td",{colspan:Ne.value.length+2,class:"empty-state"}," Không tìm thấy nhân viên thuộc bộ phận hoặc từ khóa đã chọn. ",8,Li)]))])])]),X(j(Fe),{class:"schedule-dialog",visible:y.value,"onUpdate:visible":T[15]||(T[15]=x=>y.value=x),modal:"",closable:!v.value,"close-on-escape":!v.value,header:n.createAssignment?"Tạo phân công ca":"Chọn ca",style:{width:"520px",maxWidth:"95vw"}},{default:ie(()=>{var x,E,V;return[e("fieldset",{class:"day-shift-dialog",disabled:v.value||c.value},[e("p",Bi,[e("strong",null,s((x=Se.value)==null?void 0:x.name),1),F(" · "+s((E=Se.value)==null?void 0:E.code),1),T[21]||(T[21]=e("br",null,null,-1)),F(s(se(q.value))+" · "+s((V=Se.value)==null?void 0:V.department),1)]),n.administrative?(a(),i(U,{key:0},[e("label",Oi,[ne(e("input",{"onUpdate:modelValue":T[6]||(T[6]=W=>p.value=W),type:"checkbox"},null,512),[[nt,p.value]]),T[22]||(T[22]=F("Toàn ca",-1))]),p.value?S("",!0):(a(),i(U,{key:0},[e("label",null,[T[23]||(T[23]=F("Giờ kết thúc",-1)),X(j(Un),{modelValue:z.value,"onUpdate:modelValue":T[7]||(T[7]=W=>z.value=W),type:"time",min:"08:01",max:"16:00",required:""},null,8,["modelValue"])]),e("label",null,[T[24]||(T[24]=F("Loại nghỉ phép *",-1)),X(j(on),{modelValue:H.value,"onUpdate:modelValue":T[8]||(T[8]=W=>H.value=W),options:k.value,"option-label":"name","option-value":"id",placeholder:"Chọn mã nghỉ phép",disabled:v.value||c.value||I.value},null,8,["modelValue","options","disabled"])]),I.value?(a(),i("p",Mi,"Đang tải loại nghỉ phép...")):S("",!0),w.value?(a(),i("p",Fi,[F(s(w.value)+" ",1),X($e,{type:"button",label:"Thử lại",text:"",size:"small",onClick:L})])):S("",!0)],64))],64)):(a(),i(U,{key:1},[e("label",null,[T[25]||(T[25]=F("Ca làm việc *",-1)),X(j(on),{modelValue:C.value,"onUpdate:modelValue":T[9]||(T[9]=W=>C.value=W),options:[...n.shifts.map(W=>({value:W.id,label:W.code+" · "+W.name+(W.startTime&&W.endTime?" · "+W.startTime+"–"+W.endTime:"")+(W.crossDay?" (+1 ngày)":"")})),...n.createAssignment?[]:[{value:"OFF",label:"Nghỉ"}]],"option-label":"label","option-value":"value",placeholder:"Chọn ca làm việc",disabled:v.value||c.value||n.shiftsLoading||!!n.shiftsError},null,8,["modelValue","options","disabled"])]),!n.createAssignment&&C.value&&C.value!=="OFF"?(a(),i("label",Ui,[ne(e("input",{"onUpdate:modelValue":T[10]||(T[10]=W=>p.value=W),type:"checkbox"},null,512),[[nt,p.value]]),T[26]||(T[26]=F("Toàn thời gian",-1))])):S("",!0),C.value&&C.value!=="OFF"?(a(),i("p",Ri,[F(s(p.value?"Làm cả ca đã chọn.":"Làm 1/2 ca đã chọn.")+" ",1),p.value?S("",!0):(a(),i(U,{key:0},[F("Khung giờ cụ thể của nửa ca chưa được xác định.")],64))])):S("",!0),n.shiftsLoading?(a(),i("p",Hi,"Đang tải danh sách ca...")):S("",!0),n.shiftsError?(a(),i("p",zi,[F(s(n.shiftsError)+" ",1),X($e,{type:"button",label:"Thử lại",text:"",size:"small",onClick:T[11]||(T[11]=W=>o("request-shifts"))})])):S("",!0),N.value?(a(),i(U,{key:4},[e("label",null,[T[27]||(T[27]=F("Giờ bắt đầu *",-1)),X(j(Un),{modelValue:b.value,"onUpdate:modelValue":T[12]||(T[12]=W=>b.value=W),type:"time",required:""},null,8,["modelValue"])]),e("label",null,[T[28]||(T[28]=F("Giờ kết thúc",-1)),X(j(Un),{"model-value":A.value,type:"time",readonly:""},null,8,["model-value"])]),G.value?(a(),i("p",Gi,"Giờ kết thúc thuộc ngày hôm sau.")):S("",!0)],64)):S("",!0),e("label",null,[T[29]||(T[29]=F("Ghi chú",-1)),X(j(dl),{modelValue:P.value,"onUpdate:modelValue":T[13]||(T[13]=W=>P.value=W),rows:"3","auto-resize":"",placeholder:"Nhập ghi chú (nếu có)"},null,8,["modelValue"])])],64)),h.value?(a(),i("p",Ki,s(h.value),1)):S("",!0),e("div",Xi,[ye(q.value)?(a(),ke($e,{key:0,type:"button",label:"Bỏ ngày này",severity:"danger",text:"",onClick:Ke})):S("",!0),X($e,{type:"button",label:"Hủy",severity:"secondary",outlined:"",onClick:T[14]||(T[14]=W=>y.value=!1)}),X($e,{type:"button",label:n.createAssignment?"Tạo ca":"Chọn ca",icon:"pi pi-check",disabled:!n.administrative&&(n.shiftsLoading||!!n.shiftsError),onClick:rn},null,8,["label","disabled"])])],8,Pi)]}),_:1},8,["visible","closable","close-on-escape","header"]),X(j(Fe),{class:"schedule-dialog",visible:c.value,modal:"",header:"Xác nhận tạo phân công ca",closable:!v.value,"close-on-escape":!v.value,style:{width:"520px",maxWidth:"95vw"},"onUpdate:visible":T[17]||(T[17]=x=>!v.value&&(c.value=x))},{footer:ie(()=>[X($e,{type:"button",label:"Quay lại",severity:"secondary",outlined:"",disabled:v.value,onClick:T[16]||(T[16]=x=>c.value=!1)},null,8,["disabled"]),X($e,{type:"button",label:"Xác nhận tạo ca",icon:"pi pi-check",loading:v.value,disabled:v.value,onClick:_e},null,8,["loading","disabled"])]),default:ie(()=>{var x,E,V,W,J,_,He,Ie,Ve,Oe;return[e("div",ji,[e("p",Wi,[T[30]||(T[30]=F(" Xác nhận tạo ca cho ",-1)),e("strong",null,s((x=Se.value)==null?void 0:x.name)+" ("+s((E=m.value)==null?void 0:E.employeeId)+")",1),T[31]||(T[31]=F(". ",-1))]),e("dl",Yi,[T[33]||(T[33]=e("dt",null,"Ngày làm việc",-1)),e("dd",null,s((V=m.value)!=null&&V.date?se(m.value.date):""),1),T[34]||(T[34]=e("dt",null,"Bộ phận",-1)),e("dd",null,s(((W=Se.value)==null?void 0:W.department)||"—"),1),T[35]||(T[35]=e("dt",null,"Ca làm việc",-1)),e("dd",null,s((J=Y.value)==null?void 0:J.code)+" · "+s((_=Y.value)==null?void 0:_.name),1),T[36]||(T[36]=e("dt",null,"Giờ làm",-1)),e("dd",null,s(((He=m.value)==null?void 0:He.startTime)||"Theo cấu hình ca")+" – "+s(((Ie=m.value)==null?void 0:Ie.endTime)||"Theo cấu hình ca")+s((Ve=m.value)!=null&&Ve.crossDay?" (+1 ngày)":""),1),(Oe=m.value)!=null&&Oe.note?(a(),i(U,{key:0},[T[32]||(T[32]=e("dt",null,"Ghi chú",-1)),e("dd",null,s(m.value.note),1)],64)):S("",!0)])])]}),_:1},8,["visible","closable","close-on-escape"])]))}}),Ji=sn(Qi,[["__scopeId","data-v-a8611e83"]]),Zi={class:"panel form"},_i={class:"toolbar"},es={key:0,class:"actions"},ns={key:0},ts={key:1,class:"assignment-workspace"},ls={class:"department-tree-panel"},as={key:0,role:"status"},os={key:1,role:"alert"},is={key:2,"aria-label":"Cây bộ phận theo loại lịch"},ss=["aria-pressed","disabled","onClick"],rs={key:0,class:"tree-hint"},us={key:3,class:"tree-unavailable"},ds={class:"assignment-schedule-panel"},cs={key:0,class:"assignment-lock"},vs={key:1,role:"status"},hs={key:2,role:"alert",class:"error"},ms={key:3,class:"department-schedule-type"},ps={key:4,class:"employee-picker"},gs={key:0},fs=["checked"],ys=["value"],bs=["checked","disabled","onChange"],qs={key:1},ks={class:"actions schedule-actions"},ws=["disabled"],Ts=De({__name:"ScheduleAssignmentTab",props:Ae({editing:{},busy:{type:Boolean},canCreate:{type:Boolean},canEdit:{type:Boolean},canUpdate:{type:Boolean},canBulk:{type:Boolean},treeLoading:{type:Boolean},treeError:{},departmentGroups:{},unclassifiedDepartments:{},loadDepartmentTree:{type:Function},shiftsLoading:{type:Boolean},shiftsError:{},loadManualShifts:{type:Function},eligible:{},name:{type:Function},manualShifts:{},data:{},scheduledDates:{},start:{},administrativeShiftId:{},makePreview:{type:Function},createAssignment:{type:Function}},{bulk:{type:Boolean,required:!0},bulkModifiers:{},selected:{required:!0},selectedModifiers:{},formDepartment:{required:!0},formDepartmentModifiers:{},formSearch:{required:!0},formSearchModifiers:{},scheduleType:{required:!0},scheduleTypeModifiers:{},method:{required:!0},methodModifiers:{},dayPlans:{required:!0},dayPlansModifiers:{},calendarMode:{required:!0},calendarModeModifiers:{},calendarAnchor:{required:!0},calendarAnchorModifiers:{}}),emits:Ae(["edit","reload","administrative-created","administrative-busy"],["update:bulk","update:selected","update:formDepartment","update:formSearch","update:scheduleType","update:method","update:dayPlans","update:calendarMode","update:calendarAnchor"]),setup(n,{emit:d}){const u=$(),t=le(n,"bulk"),o=le(n,"selected"),v=le(n,"formDepartment"),c=le(n,"formSearch"),m=le(n,"scheduleType"),y=le(n,"method"),q=le(n,"dayPlans"),C=le(n,"calendarMode"),p=le(n,"calendarAnchor"),P=d,h=n,b=Q(()=>{var H;return((H=h.departmentGroups.flatMap(k=>k.departments).find(k=>k.name===v.value))==null?void 0:H.code)||""}),z=Q(()=>h.manualShifts.some(H=>{var k;return H.active&&((k=H.workType)==null?void 0:k.trim().toUpperCase())==="C"}));return(H,k)=>{var w,L,Y;const I=Kn("RouterLink");return a(),i("section",Zi,[e("div",_i,[e("h2",null,s(n.editing?"Sửa phân công":"Tạo phân công"),1),n.editing?S("",!0):(a(),i("div",es,[n.canUpdate?(a(),ke(I,{key:0,class:"schedule-action-link",to:"/schedules/exchange"},{default:ie(()=>[...k[19]||(k[19]=[F("Đổi ca",-1)])]),_:1})):S("",!0),n.canUpdate?(a(),ke(I,{key:1,class:"schedule-action-link",to:"/schedules/leave-calendar"},{default:ie(()=>[...k[20]||(k[20]=[F("Nghỉ phép",-1)])]),_:1})):S("",!0),n.canCreate?(a(),ke(mi,{key:2,disabled:n.busy,onSaved:k[0]||(k[0]=N=>P("administrative-created")),onBusy:k[1]||(k[1]=N=>P("administrative-busy",N))},null,8,["disabled"])):S("",!0),e("button",{class:Z({chosen:!t.value}),onClick:k[2]||(k[2]=N=>{t.value=!1,o.value=[],y.value="calendar"})}," Cá nhân ",2),n.canBulk?(a(),i("button",{key:3,class:Z({chosen:t.value}),onClick:k[3]||(k[3]=N=>{t.value=!0,o.value=[]})}," Hàng loạt ",2)):S("",!0)]))]),n.canEdit?(a(),i("div",ts,[e("aside",ls,[k[23]||(k[23]=e("h3",null,"Bộ phận",-1)),k[24]||(k[24]=e("p",{class:"tree-hint"},"Chọn bộ phận để phân công ca",-1)),n.treeLoading?(a(),i("p",as,"Đang phân loại bộ phận…")):S("",!0),n.treeError?(a(),i("p",os,s(n.treeError),1)):S("",!0),n.treeLoading?S("",!0):(a(),i("nav",is,[(a(!0),i(U,null,R(n.departmentGroups,N=>(a(),i("details",{key:N.type,open:"",class:"department-tree-group"},[e("summary",null,[F(s(N.label)+" ",1),e("span",null,s(N.departments.length),1)]),(a(!0),i(U,null,R(N.departments,A=>(a(),i("button",{key:A.code,type:"button",class:Z({selected:v.value===A.name}),"aria-pressed":v.value===A.name,disabled:n.busy||!!n.editing,onClick:G=>v.value=A.name},[k[21]||(k[21]=e("i",{class:"pi pi-building","aria-hidden":"true"},null,-1)),e("span",null,[F(s(A.name),1),e("small",null,s(A.code),1)])],10,ss))),128)),N.departments.length?S("",!0):(a(),i("p",rs,"Chưa có bộ phận"))]))),128))])),!n.treeLoading&&n.unclassifiedDepartments.length?(a(),i("div",us,[k[22]||(k[22]=e("p",null,"Chưa xác định loại lịch hoặc chưa có ca hoạt động:",-1)),(a(!0),i(U,null,R(n.unclassifiedDepartments,N=>(a(),i("small",{key:N.code},s(N.name),1))),128)),e("button",{type:"button",onClick:k[4]||(k[4]=(...N)=>n.loadDepartmentTree&&n.loadDepartmentTree(...N))},"Tải lại")])):S("",!0)]),e("div",ds,[v.value?S("",!0):(a(),i("p",cs,[...k[25]||(k[25]=[e("i",{class:"pi pi-lock","aria-hidden":"true"},null,-1),F(" Chọn bộ phận ở bên trái để mở chức năng chọn ca. ",-1)])])),n.shiftsLoading?(a(),i("p",vs,"Đang tải ca và xác định loại lịch…")):S("",!0),n.shiftsError?(a(),i("p",hs,[F(s(n.shiftsError)+" ",1),e("button",{onClick:k[5]||(k[5]=(...N)=>n.loadManualShifts&&n.loadManualShifts(...N))},"Thử lại")])):S("",!0),v.value&&!n.shiftsLoading&&!n.shiftsError&&n.manualShifts.length?(a(),i("p",ms," Loại lịch của bộ phận: "+s(m.value==="ADMINISTRATIVE"?"Hành chính":"Làm theo ca"),1)):S("",!0),e("h3",null,s(y.value==="calendar"?"Tìm nhân viên trong lịch":"1. Chọn nhân viên · "+o.value.length+" đã chọn"),1),ne(e("input",{"onUpdate:modelValue":k[6]||(k[6]=N=>c.value=N),placeholder:"Tìm mã NV hoặc họ tên","aria-label":"Tìm nhân viên"},null,512),[[Xe,c.value]]),y.value!=="calendar"?(a(),i("div",ps,[t.value?(a(),i("label",gs,[e("input",{type:"checkbox",checked:!!n.eligible.length&&n.eligible.every(N=>o.value.includes(N.code)),onChange:k[7]||(k[7]=N=>o.value=n.eligible.every(A=>o.value.includes(A.code))?[]:n.eligible.map(A=>A.code))},null,40,fs),k[26]||(k[26]=F("Chọn tất cả kết quả ",-1))])):S("",!0),(a(!0),i(U,null,R(n.eligible,N=>(a(),i("label",{key:N.code},[t.value?ne((a(),i("input",{key:0,"onUpdate:modelValue":k[8]||(k[8]=A=>o.value=A),type:"checkbox",value:N.code},null,8,ys)),[[nt,o.value]]):(a(),i("input",{key:1,type:"radio",name:"employee",checked:o.value.includes(N.code),disabled:!!n.editing,onChange:A=>o.value=[N.code]},null,40,bs)),F(s(n.name(N.code)),1)]))),128)),n.eligible.length?S("",!0):(a(),i("p",qs,"Không tìm thấy nhân viên."))])):S("",!0),y.value==="calendar"?(a(),ke(Ji,{key:((w=n.editing)==null?void 0:w.id)||n.start,modelValue:q.value,"onUpdate:modelValue":k[9]||(k[9]=N=>q.value=N),employees:(n.editing?n.eligible.filter(N=>{var A;return N.code===((A=n.editing)==null?void 0:A.employeeId)}):n.eligible).map(N=>({code:N.code,name:N.name,department:String(N.department||"")})),shifts:n.manualShifts,"existing-assignments":n.data.assignments,"create-assignment":n.createAssignment,"can-edit":n.canUpdate&&!n.editing,onEdit:k[10]||(k[10]=N=>u.value=N),"scheduled-dates":n.scheduledDates,"shifts-loading":n.shiftsLoading,"shifts-error":n.shiftsError,onRequestShifts:n.loadManualShifts,"view-mode":C.value,"anchor-date":p.value,"onUpdate:viewMode":k[11]||(k[11]=N=>C.value=N),"onUpdate:anchorDate":k[12]||(k[12]=N=>p.value=N),administrative:m.value==="ADMINISTRATIVE","administrative-shift-id":n.administrativeShiftId,"initial-date":n.start,"fixed-date":(L=n.editing)==null?void 0:L.date,disabled:n.busy||!v.value||m.value==="ADMINISTRATIVE"&&(n.shiftsLoading||!!n.shiftsError||!n.administrativeShiftId)},null,8,["modelValue","employees","shifts","existing-assignments","create-assignment","can-edit","scheduled-dates","shifts-loading","shifts-error","onRequestShifts","view-mode","anchor-date","administrative","administrative-shift-id","initial-date","fixed-date","disabled"])):S("",!0),!n.editing&&n.canCreate?(a(),ke(ri,{key:6,eligible:z.value,"department-code":b.value,anchor:p.value,week:C.value==="week",disabled:n.busy||n.shiftsLoading||!!n.shiftsError,onBusy:k[13]||(k[13]=N=>P("administrative-busy",N)),onSaved:k[14]||(k[14]=N=>{q.value=[],P("reload")})},null,8,["eligible","department-code","anchor","week","disabled"])):S("",!0),e("div",ks,[e("button",{class:"primary",disabled:n.busy||!v.value||n.shiftsLoading||!!n.shiftsError||!n.manualShifts.length||(y.value==="calendar"?!q.value.length:!o.value.length),onClick:k[15]||(k[15]=(...N)=>n.makePreview&&n.makePreview(...N))}," Xem trước phân công ",8,ws),k[27]||(k[27]=e("span",null,"Không ghi đè lịch âm thầm.",-1))])])])):(a(),i("p",ns,"Bạn không có quyền phân công ca.")),X(Et,{onBusy:k[16]||(k[16]=N=>P("administrative-busy",N)),assignment:u.value,"department-code":((Y=[...n.departmentGroups.flatMap(N=>N.departments),...n.unclassifiedDepartments].find(N=>N.name===v.value))==null?void 0:Y.code)||null,"employee-name":u.value?n.name(u.value.employeeId):"",onClose:k[17]||(k[17]=N=>u.value=void 0),onConfirmed:k[18]||(k[18]=N=>P("reload"))},null,8,["assignment","department-code","employee-name"])])}}}),Cs=sn(Ts,[["__scopeId","data-v-c10c225c"]]),$s={class:"toolbar"},Ds={class:"actions"},Ns={class:"actions"},Is=["onClick"],Ss={key:0,class:"panel empty-state"},xs={key:0,class:"demo"},Es={key:0},As={key:1,class:"panel month-calendar"},Vs={class:"month-heading"},Ls={class:"calendar-employee"},Ps={class:"month-shifts"},Bs=["title","onClick"],Os={class:"assignment-date"},Ms={key:0,class:"unassigned-note"},Fs={key:2,class:"day-calendar"},Us={class:"calendar-employee"},Rs={class:"day-shifts"},Hs=["title","onClick"],zs={class:"shift-symbol"},Gs={key:0,class:"day-unassigned"},Ks=["onClick"],Xs={key:3,class:"panel grid-wrap"},js=["title","disabled","onClick"],Ws={key:1},Ys={key:4,class:"agenda"},Qs=["onClick"],Js=De({__name:"ScheduleCalendarTab",props:Ae({employees:{},visibleEmployees:{},groupByDepartment:{type:Boolean},dates:{},today:{},shifts:{},canCreate:{type:Boolean},employeeAssignments:{type:Function},cell:{type:Function},matches:{type:Function},fmt:{type:Function},name:{type:Function},shiftName:{type:Function},symbol:{type:Function},label:{type:Function},pending:{type:Function}},{view:{required:!0},viewModifiers:{},anchor:{required:!0},anchorModifiers:{}}),emits:Ae(["move","open"],["update:view","update:anchor"]),setup(n,{emit:d}){const u=le(n,"view"),t=le(n,"anchor"),o=n,v=d,c=["T2","T3","T4","T5","T6","T7","CN"];function m(C){return C?C.status==="OFF"?"OFF":C.status==="LEAVE"?C.shiftSymbol||C.shiftId||"NP":o.symbol(C)||"—":"—"}const y=Q(()=>{if(!o.groupByDepartment)return[{department:"",employees:o.visibleEmployees}];const C=new Map;for(const p of o.visibleEmployees){const P=p.department||"Chưa có bộ phận",h=C.get(P)||[];h.push(p),C.set(P,h)}return[...C.entries()].sort(([p],[P])=>p.localeCompare(P,"vi")).map(([p,P])=>({department:p,employees:P.sort((h,b)=>h.name.localeCompare(b.name,"vi"))}))});function q(C){if(!C)return"unassigned";const p="employeeId"in C?C:void 0;if((p==null?void 0:p.status)==="OFF"||(p==null?void 0:p.shiftId)==="OFF"||C.id==="OFF")return"off";if((p==null?void 0:p.status)==="LEAVE")return"leave";const P="employeeId"in C?o.shifts.find(k=>k.id===C.shiftId):C,h=String((P==null?void 0:P.code)||(p==null?void 0:p.shiftSymbol)||(p==null?void 0:p.shiftId)||"").toUpperCase(),b=String((P==null?void 0:P.name)||(p==null?void 0:p.shiftName)||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();if((p==null?void 0:p.scheduleType)==="ADMINISTRATIVE"||(P==null?void 0:P.scheduleType)==="ADMINISTRATIVE"||["D","HC","ADMINISTRATIVE"].includes(h)||b.includes("hanh chinh"))return"administrative";if(h.endsWith("XX")||b.includes("tuy chon")||b.includes("linh hoat")||b.includes("flex"))return"flexible";if(h==="M"||b.includes("sang")||b.includes("morning"))return"morning";if(h==="E"||b.includes("chieu")||b.includes("afternoon"))return"afternoon";if(h==="N"||b.includes("toi")||b.includes("dem")||b.includes("night"))return"night";const z=(p==null?void 0:p.startTime)||(P==null?void 0:P.startTime)||"",H=Number(z.slice(0,2));return z&&Number.isFinite(H)?H<5||H>=18?"night":H<11?"morning":"afternoon":"unassigned"}return(C,p)=>(a(),i(U,null,[e("div",$s,[e("div",Ds,[e("button",{"aria-label":"Kỳ trước",onClick:p[0]||(p[0]=P=>v("move",-1))}," ‹ "),e("button",{onClick:p[1]||(p[1]=P=>t.value=n.today)}," Hôm nay "),e("button",{"aria-label":"Kỳ sau",onClick:p[2]||(p[2]=P=>v("move",1))}," › "),e("strong",null,s(n.fmt(n.dates[0]))+" – "+s(n.fmt(n.dates[n.dates.length-1])),1)]),e("div",Ns,[(a(),i(U,null,R([{id:"day",name:"Ngày"},{id:"week",name:"Tuần"},{id:"month",name:"Tháng"}],P=>e("button",{key:P.id,class:Z({chosen:u.value===P.id}),onClick:h=>u.value=P.id},s(P.name),11,Is)),64))])]),p[7]||(p[7]=el('<div class="legend"><span class="shift-legend-item shift-tone--morning"><i></i>Ca sáng</span><span class="shift-legend-item shift-tone--afternoon"><i></i>Ca chiều</span><span class="shift-legend-item shift-tone--flexible"><i></i>Ca tùy chọn</span><span class="shift-legend-item shift-tone--night"><i></i>Ca tối</span><span class="shift-legend-item shift-tone--off"><i></i>OFF</span><span class="shift-legend-item shift-tone--administrative"><i></i>Hành chính</span><span class="shift-legend-item shift-tone--leave"><i></i>Nghỉ phép</span><span>↔ Chờ đổi ca</span></div>',1)),n.visibleEmployees.length?(a(),i(U,{key:1},[n.visibleEmployees.some(P=>n.dates.some(h=>n.cell(P.code,h)))?S("",!0):(a(),i("p",xs," Chưa có lịch làm việc trong khoảng thời gian này. Chọn Phân công ca để lập lịch. ")),(a(!0),i(U,null,R(y.value,P=>(a(),ke(nl(n.groupByDepartment?"details":"div"),{key:P.department||"selected-department",class:"department-calendar-group",open:n.groupByDepartment?!0:void 0},{default:ie(()=>[n.groupByDepartment?(a(),i("summary",Es,[e("strong",null,s(P.department),1),e("small",null,s(P.employees.length)+" nhân viên",1)])):S("",!0),u.value==="month"?(a(),i("section",As,[e("div",Vs,[p[3]||(p[3]=e("strong",null,"Nhân viên / Bộ phận",-1)),e("strong",null,"Ca được phân công trong tháng · "+s(t.value.slice(0,7)),1)]),(a(!0),i(U,null,R(P.employees,h=>(a(),i("article",{key:h.code,class:"month-row"},[e("div",Ls,[e("strong",null,s(h.name),1),e("small",null,s(h.code),1),e("small",null,s(h.department||"Chưa có bộ phận"),1)]),e("div",Ps,[(a(!0),i(U,null,R(n.employeeAssignments(h.code),b=>(a(),i("button",{key:b.id,class:Z(["assignment-chip",`shift-tone--${q(b)}`]),title:n.label(b),onClick:z=>v("open",h.code,b.date)},[e("span",Os,s(n.fmt(b.date)),1),e("strong",null,s(n.symbol(b)),1)],10,Bs))),128)),n.employeeAssignments(h.code).length?S("",!0):(a(),i("p",Ms," Chưa phân công ca trong tháng "))])]))),128))])):u.value==="day"?(a(),i("section",Fs,[(a(!0),i(U,null,R(P.employees,h=>(a(),i("article",{key:h.code,class:"panel day-employee"},[e("div",Us,[e("strong",null,s(h.name),1),e("small",null,s(h.code)+" · "+s(h.department||"Chưa có bộ phận"),1)]),e("div",Rs,[(a(!0),i(U,null,R(n.employeeAssignments(h.code),b=>(a(),i("button",{key:b.id,title:n.label(b),class:Z(["day-assignment",`shift-tone--${q(b)}`]),onClick:z=>v("open",h.code,b.date)},[e("strong",zs,s(n.symbol(b)),1)],10,Hs))),128)),n.employeeAssignments(h.code).length?S("",!0):(a(),i("div",Gs,[p[4]||(p[4]=e("span",null,"Chưa phân công",-1)),n.canCreate?(a(),i("button",{key:0,onClick:b=>v("open",h.code,n.dates[0])}," + Phân công ca ",8,Ks)):S("",!0)]))])]))),128))])):(a(),i("section",Xs,[e("table",{class:"schedule-grid",style:$n({minWidth:240+n.dates.length*88+"px"})},[e("colgroup",null,[p[5]||(p[5]=e("col",{class:"employee-col"},null,-1)),(a(!0),i(U,null,R(n.dates,h=>(a(),i("col",{key:h}))),128))]),e("thead",null,[e("tr",null,[e("th",null,[p[6]||(p[6]=F(" NHÂN VIÊN",-1)),e("small",null,s(P.employees.length)+" nhân viên",1)]),(a(!0),i(U,null,R(n.dates,h=>(a(),i("th",{key:h,class:Z({today:h===n.today,weekend:[0,6].includes(new Date(h+"T12:00:00").getDay())})},[F(s(c[(new Date(h+"T12:00:00").getDay()+6)%7])+" ",1),e("small",null,s(n.fmt(h)),1)],2))),128))])]),e("tbody",null,[(a(!0),i(U,null,R(P.employees,h=>(a(),i("tr",{key:h.code},[e("th",null,[e("strong",null,s(h.name),1),e("small",null,s(h.code)+" · "+s(h.department),1)]),(a(!0),i(U,null,R(n.dates,b=>(a(),i("td",{key:b,class:Z({today:b===n.today,weekend:[0,6].includes(new Date(b+"T12:00:00").getDay())})},[n.matches(n.cell(h.code,b))?(a(),i("button",{key:0,class:Z(["shift-cell",`shift-tone--${q(n.cell(h.code,b))}`]),title:n.label(n.cell(h.code,b)),disabled:!n.cell(h.code,b)&&!n.canCreate,onClick:z=>v("open",h.code,b)},[e("strong",null,s(m(n.cell(h.code,b))),1)],10,js)):(a(),i("span",Ws,"—"))],2))),128))]))),128))])],4)])),u.value==="week"?(a(),i("section",Ys,[(a(!0),i(U,null,R(n.dates,h=>(a(),i("article",{key:h,class:"panel"},[e("h3",null,s(n.fmt(h))+" "+s(h===n.today?"· Hôm nay":""),1),(a(!0),i(U,null,R(P.employees.filter(b=>n.matches(n.cell(b.code,h))),b=>(a(),i("button",{key:b.code,class:Z(["agenda-assignment",`shift-tone--${q(n.cell(b.code,h))}`]),onClick:z=>v("open",b.code,h)},[e("strong",null,s(n.name(b.code)),1),e("small",null,s(n.label(n.cell(b.code,h)))+" "+s(n.pending(n.cell(b.code,h))?"↔ Chờ đổi ca":""),1)],10,Qs))),128))]))),128))])):S("",!0)]),_:2},1032,["open"]))),128))],64)):(a(),i("div",Ss," Không tìm thấy nhân viên theo bộ lọc. "))],64))}}),Zs={class:"tabs","aria-label":"Xếp ca"},_s=De({__name:"ScheduleModuleNavigation",props:{items:{},activeKey:{}},setup(n){return(d,u)=>{const t=Kn("RouterLink");return a(),i("nav",Zs,[(a(!0),i(U,null,R(n.items,o=>(a(),ke(t,{key:o.key,to:o.key==="calendar"?"/schedules":"/schedules/"+o.key,class:Z({active:n.activeKey===o.key})},{default:ie(()=>[F(s(o.label),1)]),_:2},1032,["to","class"]))),128))])}}}),er=Ue`
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
`;async function nr(n,d){if(!Number.isInteger(n)||n<2e3||n>2100||!Number.isInteger(d)||d<1||d>12)throw new Error("Tháng/năm báo cáo không hợp lệ.");const{data:u}=await Re.query({query:er,variables:{nam:n,thang:d},fetchPolicy:"no-cache",errorPolicy:"none"}),t=u==null?void 0:u.baoCaoCaLamViecThang;if(!(t!=null&&t.isResults)||!t.data)throw new Error((t==null?void 0:t.message)||"Không thể tải báo cáo ca làm việc.");return{...t.data,cotNgay:[...t.data.cotNgay||[]].sort((o,v)=>o.ngayTrongThang-v.ngayTrongThang),nhanVien:t.data.nhanVien||[]}}const tr={class:"monthly-report"},lr={class:"report-toolbar"},ar={class:"report-controls"},or={key:0,class:"report-status",role:"status"},ir={key:1,class:"report-status error",role:"alert"},sr={class:"report-summary"},rr={key:0,class:"outline-controls","aria-label":"Hiển thị nhóm bộ phận"},ur=["disabled"],dr=["disabled"],cr={class:"print-heading"},vr={class:"schedule-sheet"},hr=["title"],mr={class:"department-heading"},pr={colspan:"3",scope:"rowgroup",class:"frozen department-label"},gr=["aria-expanded","aria-label","onClick"],fr={class:"outline-icon","aria-hidden":"true"},yr={class:"department-title"},br={class:"department-count"},qr=["colspan"],kr={class:"frozen ordinal"},wr={class:"frozen employee-code"},Tr={class:"frozen employee-name name"},Cr={class:"department"},$r={class:"position"},Dr=["title","onMouseenter"],Nr={key:0},Ir=["colspan"],Sr=De({__name:"ScheduleReportsTab",setup(n){const d=Gn(),u=$(d.month),t=$(d.year),o=Array.from({length:12},(N,A)=>({value:A+1,label:"Tháng "+(A+1)})),v=Array.from({length:101},(N,A)=>({value:2e3+A,label:String(2e3+A)})),c=$(),m=$(!1),y=$(""),q=$(null),C=$(),p=$(new Set);let P=0;async function h(){const N=++P;m.value=!0,y.value="",c.value=void 0,p.value=new Set;try{const A=await nr(t.value,u.value);N===P&&(c.value=A)}catch(A){N===P&&(y.value=Ce(A))}finally{N===P&&(m.value=!1)}}ae([u,t],h,{immediate:!0}),Nn(()=>++P);const b=Q(()=>{var N;return(((N=c.value)==null?void 0:N.nhanVien)||[]).map(A=>({...A,days:new Map((A.cacNgay||[]).map(G=>[G.ngayTrongThang,G.giaTri]))}))}),z=Q(()=>{var A,G;const N=new Map;for(const te of b.value){const oe=(A=te.maBoPhan)==null?void 0:A.trim(),ge=(G=te.boPhan)==null?void 0:G.trim(),me=oe?`code:${oe}`:ge?`name:${ge}`:"unassigned";let Se=N.get(me);Se||(Se={key:me,label:ge||oe||"Chưa có bộ phận",employees:[]},N.set(me,Se)),Se.employees.push(te)}return[...N.values()]});function H(N){const A=new Set(p.value);A.has(N)?A.delete(N):A.add(N),p.value=A,q.value=null}function k(){p.value=new Set}function I(){p.value=new Set(z.value.map(N=>N.key)),q.value=null}const w=[{key:"al",label:"AL"},{key:"do",label:"DO"},{key:"ph",label:"PH"},{key:"cl",label:"CL"},{key:"ul",label:"UL"},{key:"soNgayCongThucTe",label:"Số ngày công thực tế"},{key:"soNgayCongTieuChuan",label:"Số ngày công tiêu chuẩn"},{key:"soNgayPhep",label:"Số ngày phép"},{key:"soNgayCongHuongLuong",label:"Số ngày công hưởng lương"}];function L(N){return[0,6].includes(new Date(c.value.nam,c.value.thang-1,N).getDay())}function Y(){if(!C.value||!c.value||m.value)return;const N=document.createElement("iframe");N.title="In báo cáo ca làm việc",N.style.cssText="position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;",N.onload=()=>{const A=N.contentWindow;if(!A){N.remove();return}A.addEventListener("afterprint",()=>N.remove(),{once:!0}),A.focus(),A.print(),setTimeout(()=>N.remove(),6e4)},N.srcdoc='<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Báo cáo ca làm việc</title><style>@page{size:A3 landscape;margin:10mm}body{font-family:Arial,sans-serif;color:#111}h2{font-size:16px}p{font-size:10px}col{width:auto!important}table{width:100%;border-collapse:collapse;table-layout:auto;font-size:7px}th,td{border:1px solid #777;padding:4px 2px;text-align:center}th{background:#eee}thead{display:table-header-group}tr{break-inside:avoid}.name,.department,.position{text-align:left}small{display:block}.employee-name{min-width:90px}.department-heading th{background:#e2efda;text-align:left}.department-toggle{border:0;background:transparent;font:inherit;color:inherit;text-align:left}.outline-icon{display:none}.department-count{margin-left:8px;font-weight:normal}.employee-row{display:table-row!important}</style></head><body>'+C.value.innerHTML+"</body></html>",document.body.appendChild(N)}return(N,A)=>(a(),i("section",tr,[e("div",lr,[A[5]||(A[5]=e("div",null,[e("h2",null,"Báo cáo ca làm việc tháng"),e("p",null,"Chọn tháng và năm để xem lịch và tổng công.")],-1)),e("div",ar,[e("label",null,[A[3]||(A[3]=F("Tháng",-1)),X(j(on),{modelValue:u.value,"onUpdate:modelValue":A[0]||(A[0]=G=>u.value=G),options:j(o),"option-label":"label","option-value":"value"},null,8,["modelValue","options"])]),e("label",null,[A[4]||(A[4]=F("Năm",-1)),X(j(on),{modelValue:t.value,"onUpdate:modelValue":A[1]||(A[1]=G=>t.value=G),options:j(v),"option-label":"label","option-value":"value",filter:""},null,8,["modelValue","options"])]),X($e,{label:"In báo cáo",icon:"pi pi-print",outlined:"",disabled:m.value||!c.value||!b.value.length,onClick:Y},null,8,["disabled"])])]),m.value?(a(),i("div",or,[A[6]||(A[6]=e("i",{class:"pi pi-spin pi-spinner"},null,-1)),F(" Đang tải báo cáo tháng "+s(u.value)+"/"+s(t.value)+"... ",1)])):y.value?(a(),i("div",ir,[F(s(y.value)+" ",1),X($e,{label:"Thử lại",text:"",onClick:h})])):c.value?(a(),i(U,{key:2},[e("div",sr,[e("span",null," Tháng "+s(c.value.thang)+"/"+s(c.value.nam)+" · "+s(c.value.soNgayTrongThang)+" ngày · "+s(b.value.length)+" nhân viên · "+s(z.value.length)+" bộ phận ",1),b.value.length?(a(),i("div",rr,[e("button",{type:"button",disabled:!p.value.size,onClick:k},[...A[7]||(A[7]=[e("i",{class:"pi pi-plus","aria-hidden":"true"},null,-1),F(" Mở tất cả ",-1)])],8,ur),e("button",{type:"button",disabled:p.value.size===z.value.length,onClick:I},[...A[8]||(A[8]=[e("i",{class:"pi pi-minus","aria-hidden":"true"},null,-1),F(" Thu gọn tất cả ",-1)])],8,dr)])):S("",!0)]),e("div",{class:"sheet-scroll",onMouseleave:A[2]||(A[2]=G=>q.value=null)},[e("div",{ref_key:"printable",ref:C},[e("div",cr,[e("h2",null,"Báo cáo ca làm việc tháng "+s(c.value.thang)+"/"+s(c.value.nam),1),e("p",null,s(b.value.length)+" nhân viên",1)]),e("table",vr,[e("colgroup",null,[A[9]||(A[9]=e("col",{style:{width:"44px"}},null,-1)),A[10]||(A[10]=e("col",{style:{width:"90px"}},null,-1)),A[11]||(A[11]=e("col",{style:{width:"180px"}},null,-1)),A[12]||(A[12]=e("col",{style:{width:"140px"}},null,-1)),A[13]||(A[13]=e("col",{style:{width:"140px"}},null,-1)),(a(!0),i(U,null,R(c.value.cotNgay,G=>(a(),i("col",{key:G.ngayTrongThang,style:{width:"44px"}}))),128)),(a(),i(U,null,R(w,G=>e("col",{key:G.key,style:$n({width:G.key.startsWith("soNgay")?"110px":"56px"})},null,4)),64))]),e("thead",null,[e("tr",null,[A[14]||(A[14]=e("th",{class:"frozen ordinal"},"TT",-1)),A[15]||(A[15]=e("th",{class:"frozen employee-code"},"Mã NV",-1)),A[16]||(A[16]=e("th",{class:"frozen employee-name"},"Họ và tên",-1)),A[17]||(A[17]=e("th",null,"Bộ phận",-1)),A[18]||(A[18]=e("th",null,"Chức vụ",-1)),(a(!0),i(U,null,R(c.value.cotNgay,G=>(a(),i("th",{key:G.ngayTrongThang,title:G.ngay,class:Z({weekend:L(G.ngayTrongThang),highlight:q.value===G.ngayTrongThang})},s(String(G.ngayTrongThang).padStart(2,"0")),11,hr))),128)),(a(),i(U,null,R(w,G=>e("th",{key:G.key,class:"total"},s(G.label),1)),64))])]),(a(!0),i(U,null,R(z.value,G=>(a(),i("tbody",{key:G.key},[e("tr",mr,[e("th",pr,[e("button",{type:"button",class:"department-toggle","aria-expanded":!p.value.has(G.key),"aria-label":`${p.value.has(G.key)?"Mở":"Thu gọn"} bộ phận ${G.label}`,onClick:te=>H(G.key)},[e("span",fr,s(p.value.has(G.key)?"+":"−"),1),e("span",yr,s(G.label),1),e("span",br,s(G.employees.length)+" NV",1)],8,gr)]),e("th",{colspan:2+c.value.cotNgay.length+w.length,class:"department-fill"},null,8,qr)]),(a(!0),i(U,null,R(G.employees,te=>ne((a(),i("tr",{key:te.maNhanVien,class:"employee-row"},[e("td",kr,s(te.tt),1),e("td",wr,s(te.maNhanVien),1),e("td",Tr,s(te.hoVaTen),1),e("td",Cr,s(te.boPhan||te.maBoPhan||"—"),1),e("td",$r,s(te.chucVu||te.maChucVu||"—"),1),(a(!0),i(U,null,R(c.value.cotNgay,oe=>(a(),i("td",{key:oe.ngayTrongThang,class:Z({weekend:L(oe.ngayTrongThang),highlight:q.value===oe.ngayTrongThang}),title:te.hoVaTen+" · "+oe.ngay+" · "+(te.days.get(oe.ngayTrongThang)||"Chưa phân công"),onMouseenter:ge=>q.value=oe.ngayTrongThang},s(te.days.get(oe.ngayTrongThang)||""),43,Dr))),128)),(a(),i(U,null,R(w,oe=>e("td",{key:oe.key,class:"total"},s(te[oe.key]??0),1)),64))])),[[tl,!p.value.has(G.key)]])),128))]))),128)),b.value.length?S("",!0):(a(),i("tbody",Nr,[e("tr",null,[e("td",{colspan:5+c.value.cotNgay.length+w.length,class:"empty"}," Chưa có dữ liệu báo cáo trong tháng này. ",8,Ir)])]))])],512)],32)],64)):S("",!0)]))}}),xr=sn(Sr,[["__scopeId","data-v-4fb17054"]]),Er={class:"panel form"},Ar={class:"toolbar"},Vr={class:"actions"},Lr={class:"table-scroll"},Pr={class:"report"},Br=["onClick"],Or={key:0},Mr=De({__name:"ScheduleSwapsTab",props:Ae({rows:{},canApprove:{type:Boolean},canCreate:{type:Boolean},assignmentLabel:{type:Function},shiftName:{type:Function}},{tab:{required:!0},tabModifiers:{}}),emits:Ae(["create","detail"],["update:tab"]),setup(n,{emit:d}){const u=le(n,"tab"),t=d,o={PENDING:"Chờ duyệt",APPROVED:"Đã duyệt",REJECTED:"Từ chối",CANCELLED:"Đã hủy"};return(v,c)=>(a(),i("section",Er,[e("div",Ar,[e("div",Vr,[e("button",{class:Z({chosen:u.value==="ALL"}),onClick:c[0]||(c[0]=m=>u.value="ALL")},"Yêu cầu",2),n.canApprove?(a(),i("button",{key:0,class:Z({chosen:u.value==="PENDING"}),onClick:c[1]||(c[1]=m=>u.value="PENDING")}," Chờ tôi duyệt ",2)):S("",!0),e("button",{class:Z({chosen:u.value==="DONE"}),onClick:c[2]||(c[2]=m=>u.value="DONE")},"Đã xử lý",2)]),n.canCreate?(a(),i("button",{key:0,class:"primary",onClick:c[3]||(c[3]=m=>t("create"))},"+ Tạo yêu cầu")):S("",!0)]),e("div",Lr,[e("table",Pr,[c[5]||(c[5]=e("thead",null,[e("tr",null,[e("th",null,"Mã yêu cầu"),e("th",null,"Ca hiện tại"),e("th",null,"Đổi với / ca sau đổi"),e("th",null,"Lý do"),e("th",null,"Ngày gửi"),e("th",null,"Trạng thái"),e("th",null,"Thao tác")])],-1)),e("tbody",null,[(a(!0),i(U,null,R(n.rows,m=>(a(),i("tr",{key:m.id},[e("td",null,s(m.code),1),e("td",null,s(n.assignmentLabel(m.assignmentId)),1),e("td",null,s(m.targetAssignmentId?n.assignmentLabel(m.targetAssignmentId):n.shiftName(m.shiftId)),1),e("td",null,s(m.reason),1),e("td",null,s(new Date(m.createdAt).toLocaleString("vi-VN")),1),e("td",null,s(o[m.status]),1),e("td",null,[e("button",{onClick:y=>t("detail",m)},"Xem",8,Br)])]))),128)),n.rows.length?S("",!0):(a(),i("tr",Or,[...c[4]||(c[4]=[e("td",{colspan:"7",class:"empty-state"},"Không có yêu cầu trong trạng thái này.",-1)])]))])])])]))}}),Fr={class:"panel form"},Ur={class:"toolbar"},Rr={key:0,class:"empty-state"},Hr={class:"toolbar"},zr={class:"pattern"},Gr={class:"actions"},Kr=["onClick"],Xr=["onClick"],jr=["onClick"],Wr=["disabled","onClick"],Yr=["onClick"],Qr=De({__name:"ScheduleTemplatesTab",props:{templates:{},shifts:{},departments:{},busy:{type:Boolean},canCreate:{type:Boolean},canEdit:{type:Boolean},canBulk:{type:Boolean}},emits:["create","open","toggle","apply"],setup(n,{emit:d}){const u=d;return(t,o)=>(a(),i("section",Fr,[e("div",Ur,[o[1]||(o[1]=e("div",null,[e("h2",null,"Mẫu lịch tái sử dụng"),e("p",null,"Mẫu chỉ trở thành lịch thực tế khi được áp dụng.")],-1)),n.canCreate?(a(),i("button",{key:0,class:"primary",onClick:o[0]||(o[0]=v=>u("create"))},"+ Tạo mẫu")):S("",!0)]),n.templates.length?S("",!0):(a(),i("p",Rr," Chưa có mẫu lịch. Tạo mẫu để tái sử dụng khi phân công. ")),(a(!0),i(U,null,R(n.templates,v=>(a(),i("article",{key:v.id,class:"template-card"},[e("div",Hr,[e("h3",null,s(v.name),1),e("span",null,s(v.active?"Hoạt động":"Ngừng sử dụng"),1)]),e("p",null,s(v.scheduleType==="ADMINISTRATIVE"?"Hành chính":"Xoay ca")+" · "+s(v.department||"Tất cả bộ phận")+" · "+s(v.kind==="WEEK"?"Tuần":"Chu kỳ "+v.days.length+" ngày"),1),e("div",zr,[(a(!0),i(U,null,R(v.days,(c,m)=>{var y;return a(),i("span",{key:m},[e("small",null,s(v.kind==="WEEK"?["T2","T3","T4","T5","T6","T7","CN"][m]:m+1),1),F(" "+s(c==="OFF"?"Nghỉ":(y=n.shifts.find(q=>q.id===c))==null?void 0:y.name),1)])}),128))]),e("div",Gr,[e("button",{onClick:c=>u("open",v,!1,!0)},"Xem",8,Kr),n.canEdit?(a(),i("button",{key:0,onClick:c=>u("open",v,!1,!1)},"Sửa",8,Xr)):S("",!0),n.canCreate?(a(),i("button",{key:1,onClick:c=>u("open",v,!0,!1)},"Nhân bản",8,jr)):S("",!0),n.canEdit?(a(),i("button",{key:2,disabled:n.busy,onClick:c=>u("toggle",v)},s(v.active?"Ngừng sử dụng":"Kích hoạt"),9,Wr)):S("",!0),v.active&&n.canBulk?(a(),i("button",{key:3,onClick:c=>u("apply",v)}," Áp dụng mẫu ",8,Yr)):S("",!0)])]))),128))]))}}),Jr=De({__name:"AppDialog",setup(n){return(d,u)=>(a(),ke(j(Fe),wt(Tt(d.$attrs)),{default:ie(()=>[kt(d.$slots,"default")]),_:3},16))}}),qt=[{id:"HC",code:"D",name:"Ca D · Hành chính",scheduleType:"ADMINISTRATIVE",startTime:"08:00",endTime:"17:00",crossDay:!1,displayColor:"#2563eb",active:!0},{id:"M",code:"M",name:"Ca sáng",scheduleType:"ROTATING",startTime:"06:00",endTime:"14:00",crossDay:!1,displayColor:"#059669",active:!0},{id:"E",code:"E",name:"Ca chiều",scheduleType:"ROTATING",startTime:"14:00",endTime:"22:00",crossDay:!1,displayColor:"#d97706",active:!0},{id:"N",code:"N",name:"Ca đêm",scheduleType:"ROTATING",startTime:"22:00",endTime:"06:00",crossDay:!0,displayColor:"#7c3aed",active:!0}],At="hotel-shift-scheduling-v2";let We;function wn(n){if(!Dt().can("schedules",n))throw new Error("Bạn không có quyền thực hiện thao tác này.")}async function Tn(){if(We)return We;const n=localStorage.getItem(At);if(n){We=JSON.parse(n);const u=We.shifts.find(t=>t.id==="HC"||t.code==="HC");return u&&(u.code="D",u.name="Ca D · Hành chính"),We}const d=await vl.list("schedules",{page:1,pageSize:1e3,search:"",filters:{},sortField:"date",sortOrder:1});return We={shifts:structuredClone(qt),templates:[],swaps:[],history:[],assignments:d.all.map(u=>{const t=qt.find(o=>`${o.startTime}–${o.endTime}`===u.shift||o.code===u.shift);return{id:u.id,employeeId:String(u.employeeId),date:String(u.date),shiftId:(t==null?void 0:t.id)||"",scheduleType:(t==null?void 0:t.scheduleType)||"ROTATING",status:u.shift==="OFF"?"OFF":["AL","SL"].includes(String(u.shift))?"LEAVE":"SCHEDULED",note:String(u.note||""),revision:1}})},We}function Fn(n){return localStorage.setItem(At,JSON.stringify(n)),We=n,structuredClone(n)}function at(n,d){const u=[],t=o=>{const v=n.shifts.find(c=>c.id===o.shiftId);if(!(!v||o.status!=="SCHEDULED"))return[Date.parse(`${o.date}T${o.startTime||v.startTime}:00`),Date.parse(`${o.date}T${o.endTime||v.endTime}:00`)+(o.crossDay??v.crossDay?864e5:0)]};return d.forEach((o,v)=>{for(const c of[...n.assignments.filter(m=>m.id!==o.id),...d.slice(0,v)]){if(o.employeeId!==c.employeeId)continue;const m=t(o),y=t(c);(o.date===c.date||m&&y&&m[0]<y[1]&&y[0]<m[1])&&u.push({row:o,existing:c,reason:c.status==="LEAVE"?"Nhân viên đang nghỉ phép":o.date===c.date?"Đã có phân công trong ngày":"Ca chồng lấn thời gian, có thể qua đêm"})}}),u}const Cn={load:()=>kn(async()=>(wn("view"),structuredClone(await Tn()))),assign:(n,d=[])=>kn(async()=>{var v;if(wn(n.length>1?"bulk":(v=n[0])!=null&&v.id?"edit":"create"),n.some(c=>Ee(c.date)))throw new Error("Không được phân công ngày trong quá khứ.");const u=await Tn(),t={...u,shifts:[...u.shifts.filter(c=>!d.some(m=>m.id===c.id)),...d]};if(!n.length)throw new Error("Chưa có phân công để lưu.");if(at(t,n).length)throw new Error("Lịch có xung đột. Hãy kiểm tra nhân viên, ngày và ca hiện có.");const o=structuredClone(t);for(const c of n){const m=t.assignments.find(q=>q.id===c.id);if(c.id&&(!m||m.revision!==c.revision))throw new Error("Lịch gốc đã thay đổi. Vui lòng tải lại.");if(c.status==="SCHEDULED"&&!t.shifts.some(q=>q.id===c.shiftId&&q.active&&q.scheduleType===c.scheduleType))throw new Error("Ca không hoạt động hoặc không phù hợp loại lịch.");const y={...c,id:c.id||crypto.randomUUID(),revision:((m==null?void 0:m.revision)||0)+1};o.assignments=[...o.assignments.filter(q=>q.id!==y.id),y],o.history.push({assignmentId:y.id,date:new Date().toISOString(),action:m?"Sửa phân công":"Tạo phân công"})}return Fn(o)}),template:n=>kn(async()=>{wn(n.id?"edit":"create");const d=structuredClone(await Tn());if(!n.name.trim()||!n.days.length||n.kind==="WEEK"&&n.days.length!==7)throw new Error("Nhập tên mẫu và cấu hình đầy đủ các ngày.");if(n.days.some(t=>t!=="OFF"&&!d.shifts.some(o=>o.id===t&&o.active&&o.scheduleType===n.scheduleType)))throw new Error("Mẫu có ca không hợp lệ.");const u={...n,id:n.id||crypto.randomUUID()};return d.templates=[...d.templates.filter(t=>t.id!==u.id),u],Fn(d)}),request:n=>kn(async()=>{wn("create");const d=structuredClone(await Tn()),u=d.assignments.find(o=>o.id===n.assignmentId),t=d.assignments.find(o=>o.id===n.targetAssignmentId);if(!u||u.status!=="SCHEDULED"||!n.reason.trim())throw new Error("Chọn ca đã phân công và nhập lý do.");if(n.targetAssignmentId&&(!t||t.employeeId===u.employeeId||t.status!=="SCHEDULED"))throw new Error("Chọn ca của nhân viên khác.");if(!t&&!d.shifts.some(o=>o.id===n.shiftId&&o.active))throw new Error("Chọn ca muốn đổi.");if(d.swaps.some(o=>o.status==="PENDING"&&[o.assignmentId,o.targetAssignmentId].some(v=>v&&[u.id,t==null?void 0:t.id].includes(v))))throw new Error("Ca đã có yêu cầu chờ duyệt.");return d.swaps.push({...n,id:crypto.randomUUID(),code:"DC"+String(d.swaps.length+1).padStart(5,"0"),status:"PENDING",createdAt:new Date().toISOString(),sourceSnapshot:{...u},targetSnapshot:t?{...t}:void 0,sourceRevision:u.revision,targetRevision:(t==null?void 0:t.revision)||0,decision:""}),Fn(d)}),decide:(n,d,u)=>kn(async()=>{wn(d?"approve":"reject");const t=structuredClone(await Tn()),o=t.swaps.find(v=>v.id===n);if(!o||o.status!=="PENDING")throw new Error("Yêu cầu đã xử lý hoặc không tồn tại.");if(!d&&!u.trim())throw new Error("Nhập lý do từ chối.");if(d){const v=t.assignments.find(C=>C.id===o.assignmentId),c=t.assignments.find(C=>C.id===o.targetAssignmentId);if(!v||v.revision!==o.sourceRevision||o.targetAssignmentId&&(!c||c.revision!==o.targetRevision))throw new Error("Lịch gốc đã thay đổi; yêu cầu không còn hợp lệ.");const m=[{...v,shiftId:(c==null?void 0:c.shiftId)||o.shiftId,revision:v.revision+1}];c&&m.push({...c,shiftId:v.shiftId,revision:c.revision+1}),m.forEach(C=>{const p=t.shifts.find(P=>P.id===C.shiftId&&P.active);if(!p)throw new Error("Ca không còn hoạt động.");C.scheduleType=p.scheduleType});const y={...t,assignments:t.assignments.filter(C=>!m.some(p=>p.id===C.id))},q=at(y,m);if(q.length)throw new Error(q.map(C=>`${C.row.employeeId} · ${C.row.date}: ${C.row.shiftId} xung đột ${C.existing.shiftId} (${C.reason})`).join(`
`));t.assignments=[...y.assignments,...m],m.forEach(C=>t.history.push({assignmentId:C.id,date:new Date().toISOString(),action:"Duyệt đổi ca "+o.code}))}return o.status=d?"APPROVED":"REJECTED",o.decision=u,Fn(t)})};function Zr(n,d,u,t,o){const v=y=>u.scheduleType==="ADMINISTRATIVE"&&new Date(`${y}T12:00:00`).getDay()===0,c=o.filter(y=>!v(y.date)),m=new Set([...t,...c].map(y=>`${y.employeeId}:${y.date}`));for(const y of n)for(const q of d)v(q)||Ee(q)||m.has(`${y.code}:${q}`)||(c.push({employeeId:y.code,date:q,shiftId:u.id,fullTime:!0,note:""}),m.add(`${y.code}:${q}`));return c.sort((y,q)=>y.date.localeCompare(q.date))}const _r={class:"shift-module"},eu={class:"page-heading"},nu={key:0,class:"demo"},tu={key:1,class:"error",role:"alert"},lu={key:2,role:"status"},au={key:0,class:"panel filters"},ou=["value"],iu=["value"],su={class:"schedule-filter-fields"},ru=["value"],uu=["value"],du={class:"schedule-filter-search"},cu={class:"schedule-filter-actions"},vu={key:2,class:"schedule-calendar-layout"},hu={class:"department-filter-tree","aria-labelledby":"department-filter-title"},mu={key:0,role:"status"},pu={key:1,role:"alert",class:"error"},gu=["aria-pressed"],fu={"aria-label":"Cây bộ phận theo loại lịch"},yu=["aria-pressed","onClick"],bu={key:0,open:""},qu=["aria-pressed","onClick"],ku={class:"schedule-calendar-pane"},wu={class:"schedule-filter-toolbar"},Tu=["aria-label"],Cu={key:0,class:"schedule-filter-count"},Uu=De({__name:"ScheduleListView",setup(n){const d=ll(),u=ol(),t=Dt(),o=In(),v={all:$([]),loading:$(!1),error:$(""),async load(){v.loading.value=!0,v.error.value="";try{v.all.value=(await cl.list(null)).map(r=>({id:r.maNhanVien,code:r.maNhanVien,name:String(r.hoTen||[r.ho,r.tenDem,r.ten].filter(Boolean).join(" ")),department:String(r.tenBoPhan||""),position:String(r.tenChucVu||""),positionCode:r.maChucVu==null?"":String(r.maChucVu),status:String(r.trangThaiNhanVien??"")}))}catch(r){v.error.value=Ce(r)}finally{v.loading.value=!1}}};an(()=>v.load());const c={all:$([]),loading:$(!1),error:$(""),async load(){c.loading.value=!0,c.error.value="";try{c.all.value=await sl()}catch(r){c.error.value=Ce(r)}finally{c.loading.value=!1}}};an(()=>c.load());const m=$([]),y=$([]),q=$(!1),C=$("");let p=0;async function P(){const r=++p;q.value=!0,C.value="";try{const l=await rl(c.all.value);if(r!==p)return;m.value=l.groups,y.value=l.unavailable}catch(l){r===p&&(C.value=Ce(l))}finally{r===p&&(q.value=!1)}}ae(()=>c.all.value,()=>{P()});const h=$({shifts:[],assignments:[],templates:[],swaps:[],history:[]}),b=$([]),z=$(!1),H=$(!1),k=$(""),I=$(!1),w=[{key:"assign",label:"Phân công ca"},{key:"reports",label:"Báo cáo lịch làm việc"}],L=Q(()=>String(d.meta.schedulePage||"assign")),Y=Q(()=>{var r;return L.value==="exchange"?"Đổi ca":L.value==="leave-calendar"?"Lịch nghỉ phép":(r=w.find(l=>l.key===L.value))==null?void 0:r.label});function N(r){return`${r.getFullYear()}-${String(r.getMonth()+1).padStart(2,"0")}-${String(r.getDate()).padStart(2,"0")}`}const A=N(new Date),G=$(A),te=$("week");function oe(r,l){const O=[],M=new Date(r+"T12:00:00");for(;N(M)<=l&&O.length<367;)O.push(N(M)),M.setDate(M.getDate()+1);return O}const ge=Q(()=>Xn(G.value,te.value)),me=Q(()=>oe(ge.value.from,ge.value.to));function Se(r){const l=new Date(G.value+"T12:00:00");te.value==="month"?(l.setDate(1),l.setMonth(l.getMonth()+r)):l.setDate(l.getDate()+r*(te.value==="week"?7:1)),G.value=N(l)}function Ne(r){return new Date(r+"T12:00:00").toLocaleDateString("vi-VN")}const ue=$(""),fe=$(""),pe=$(""),se=$(""),ye=$(""),be=$(""),Be=$(!1),re=al({employee:"",type:"",shiftFilter:"",status:"",search:""}),je=Q(()=>[ue.value,fe.value,pe.value,se.value,ye.value,be.value].filter(r=>r.trim()).length);function rn(){Object.assign(re,{employee:fe.value,type:pe.value,shiftFilter:se.value,status:ye.value,search:be.value}),Be.value=!0}function _e(){fe.value=re.employee,pe.value=re.type,se.value=re.shiftFilter,ye.value=re.status,be.value=re.search.trim(),Be.value=!1}function Ke(){ue.value="",fe.value="",pe.value="",se.value="",ye.value="",be.value="",Object.assign(re,{employee:"",type:"",shiftFilter:"",status:"",search:""}),Be.value=!1}const B=Q(()=>c.all.value.map(r=>r.name)),D=Q(()=>v.all.value.filter(r=>(!ue.value||r.department===ue.value)&&(!fe.value||r.code===fe.value)&&`${r.code} ${r.name}`.toLocaleLowerCase().includes(be.value.toLocaleLowerCase())));function f(r){const l=v.all.value.find(O=>O.code===r);return l?`${l.code} · ${l.name}`:r}function T(r){var l;return((l=v.all.value.find(O=>O.code===r))==null?void 0:l.name)||r}function x(r){if(r==="OFF")return"Nghỉ";const l=h.value.shifts.find(O=>O.id===r);return l?`${l.name} · ${l.startTime}–${l.endTime}${l.crossDay?" (+1 ngày)":""}`:"⚠ Ca chưa có trong danh mục"}function E(r){return h.value.assignments.filter(l=>l.employeeId===r&&me.value.includes(l.date)&&_(l)).sort((l,O)=>l.date.localeCompare(O.date)||(l.startTime||"").localeCompare(O.startTime||""))}function V(r){var l;return r.shiftSymbol||((l=h.value.shifts.find(O=>O.id===r.shiftId))==null?void 0:l.code)||r.shiftId}function W(r,l){return h.value.assignments.find(O=>O.employeeId===r&&O.date===l)}function J(r){var l;return r?r.status==="OFF"?"Nghỉ":r.status==="LEAVE"?"Nghỉ phép":(r.startTime&&r.endTime?`${r.shiftName||((l=h.value.shifts.find(O=>O.id===r.shiftId))==null?void 0:l.name)||r.shiftId} · ${r.startTime}–${r.endTime}${r.crossDay?" (+1 ngày)":""}`:x(r.shiftId))+(r.fullTime===!1?" · 1/2 ca":" · Cả ca"):"Chưa phân công"}function _(r){return(!pe.value||(r==null?void 0:r.scheduleType)===pe.value)&&(!se.value||(r==null?void 0:r.shiftId)===se.value)&&(!ye.value||((r==null?void 0:r.status)||"UNASSIGNED")===ye.value)}const He=Q(()=>D.value.filter(r=>me.value.some(l=>_(W(r.code,l))))),Ie=r=>!!r&&h.value.swaps.some(l=>l.status==="PENDING"&&[l.assignmentId,l.targetAssignmentId].includes(r.id));let Ve=0;async function Oe(){const r=++Ve;if(L.value==="exchange"||L.value==="leave-calendar"){z.value=!1,k.value="";return}z.value=!0,k.value="";try{if(L.value==="calendar"){const l=await Rn(ge.value.from,ge.value.to);if(r!==Ve)return;h.value={...h.value,...l}}else if(L.value==="assign"){const l=await Rn(Ze.value.start,Ze.value.end);if(r!==Ve)return;h.value={...h.value,...l}}else{const l=await Cn.load();if(r!==Ve)return;h.value=l}}catch(l){r===Ve&&(k.value=Ce(l))}finally{r===Ve&&(z.value=!1)}}an(Oe);let ze=0;async function jn(){if(L.value!=="assign")return;const r=++ze,{start:l,end:O}=Zn.value;try{const M=await Dl(l,O);r===ze&&L.value==="assign"&&(b.value=M)}catch(M){r===ze&&(k.value=Ce(M))}}an(jn),ae([L,()=>ge.value.from,()=>ge.value.to],([r])=>{r==="calendar"&&Oe()}),ae(L,()=>{L.value!=="calendar"&&Oe()});async function Sn(r){if(H.value)return!1;H.value=!0,k.value="";try{return h.value=await r(),I.value=!1,o.success("success"),!0}catch(l){return k.value=Ce(l),!1}finally{H.value=!1}}Ct(()=>!I.value||window.confirm("Có thay đổi chưa lưu. Bạn muốn rời màn hình?")),$t(()=>!I.value||window.confirm("Có thay đổi chưa lưu. Bạn muốn rời màn hình?"));const ot=r=>{I.value&&r.preventDefault()};window.addEventListener("beforeunload",ot),Nn(()=>window.removeEventListener("beforeunload",ot));const en=$();function it(r){H.value||!t.can("schedules","edit")||(en.value={...r,scheduleType:ce.value})}async function Vt(){en.value=void 0,await nn()}const xn=$(),Wn=$(!1),st=$(!1);function Lt(r,l){W(r,l)||t.can("schedules","create")&&u.push({path:"/schedules/assign",query:{employee:r,date:l}})}const Qe=$(!1),de=$(""),Le=$([]),Yn=$(""),ce=$("ROTATING"),Me=$(A),Je=$(A),un=$(""),xe=$("calendar"),dn=$(Array(7).fill("OFF")),cn=$(""),Qn=$(""),ve=$(),Pe=$([]),vn=$(!1),qe=$([]),Ge=$([]),hn=$(!1),En=$("");let mn=0;async function Jn(){var O,M;const r=++mn;hn.value=!0,En.value="",Ge.value=[];const l=((O=c.all.value.find(K=>K.name===de.value))==null?void 0:O.code)||null;if(!l){hn.value=!1;return}try{const[K,g]=await Promise.all([It(l,ce.value),Rn(Ze.value.start,Ze.value.end)]);if(r!==mn)return;h.value.assignments=g.assignments,Ge.value=K.filter(we=>we.workType!=="0"),ve.value||(ce.value=((M=K[0])==null?void 0:M.scheduleType)||"ROTATING"),h.value.shifts=[...h.value.shifts.filter(we=>!K.some(he=>he.id===we.id)),...K],!ve.value&&ce.value==="ADMINISTRATIVE"&&gn()}catch(K){r===mn&&(En.value=Ce(K))}finally{r===mn&&(hn.value=!1)}}async function Pt(r){var we;if(H.value||!t.can("schedules","create"))throw new Error("Bạn không có quyền tạo phân công ca hoặc hệ thống đang bận.");if(Ee(r.date))throw new Error("Không được phân công ngày trong quá khứ.");const l=(we=c.all.value.find(he=>he.name===de.value))==null?void 0:we.code,O=b.value.find(he=>he.maNhanVien===r.employeeId),M=v.all.value.find(he=>he.code===r.employeeId),K=Ge.value.find(he=>he.id===r.shiftId&&he.active&&he.workType!=="0");if(!l||!An.value.some(he=>he.code===r.employeeId)||!K)throw new Error("Nhân viên, bộ phận hoặc ca làm việc không hợp lệ.");if(h.value.assignments.some(he=>he.employeeId===r.employeeId&&he.date===r.date))throw new Error("Nhân viên đã có phân công trong ngày này. Vui lòng tải lại lịch.");const g={maBoPhan:l,maChucVu:(O==null?void 0:O.maChucVu)||(M!=null&&M.positionCode?String(M.positionCode):null),maNhanVien:r.employeeId,ngayLamViec:r.date+"T00:00:00+07:00",maCa:r.shiftId,gioBatDau:r.startTime?ft(r.startTime):null,gioKetThuc:r.endTime?ft(r.endTime):null,ghiChu:r.note.trim()||null};H.value=!0;try{const he=await Nl(g);qe.value=qe.value.filter(qn=>qn.employeeId!==r.employeeId||qn.date!==r.date),o.success(he.message||"Tạo phân công ca thành công."),await nn()}finally{H.value=!1}}async function nn(){await Jn(),await jn()}ae(de,()=>{++mn,Ge.value=[],hn.value=!1,En.value="",ve.value||(qe.value=[])}),ae(qe,()=>{I.value=!0,Pe.value=[]},{deep:!0});const An=Q(()=>{var O;const r=((O=c.all.value.find(M=>M.name===de.value))==null?void 0:O.code)||"",l=b.value.filter(M=>!de.value||M.maBoPhan===r||M.tenBoPhan===de.value).map(M=>({code:M.maNhanVien,name:M.hoTen,department:M.tenBoPhan||""}));for(const M of v.all.value.filter(K=>K.department===de.value))l.some(K=>K.code===M.code)||l.push({code:M.code,name:M.name,department:String(M.department||"")});return l}),Bt=Q(()=>(ve.value?v.all.value.filter(l=>{var O;return l.code===((O=ve.value)==null?void 0:O.employeeId)}).map(l=>({code:l.code,name:l.name,department:String(l.department||"")})):An.value).filter(l=>`${l.code} ${l.name}`.toLowerCase().includes(Yn.value.toLowerCase())));function rt(){var r;return((r=Ge.value[0])==null?void 0:r.scheduleType)||"ROTATING"}const ut=Q(()=>Ge.value.filter(r=>r.active&&r.scheduleType===ce.value)),tn=$("week"),pn=$(A),Ze=Q(()=>{const r=new Date(pn.value+"T12:00:00");tn.value==="week"?r.setDate(r.getDate()-(r.getDay()+6)%7):r.setDate(1);const l=new Date(r);return tn.value==="week"?l.setDate(l.getDate()+6):l.setMonth(l.getMonth()+1,0),{start:N(r),end:N(l)}}),Zn=Q(()=>Ze.value);ae([L,()=>Zn.value.start,()=>Zn.value.end],([r])=>{r==="assign"&&jn()});function gn(r=!1){const l=Ge.value.find(M=>M.active&&M.scheduleType==="ADMINISTRATIVE");if(!de.value||!l){r&&(qe.value=[]);return}const O=An.value;qe.value=Zr(O,oe(Ze.value.start,Ze.value.end),l,h.value.assignments,r?[]:qe.value).filter(M=>!b.value.some(K=>K.maNhanVien===M.employeeId&&K.danhSachNgayXepCa.includes(M.date)))}ae([Le,ce,Me,Je,un,xe,dn,cn,Qn,Qe],()=>{I.value=!0,Pe.value=[]},{deep:!0}),ae(ce,()=>{un.value="",cn.value="",dn.value=Array(7).fill("OFF"),ve.value||(ce.value==="ADMINISTRATIVE"?gn(!0):qe.value=[])}),ae(de,()=>{ve.value||(Le.value=[]),cn.value="",ve.value||(ce.value=rt()),!ve.value&&ce.value==="ADMINISTRATIVE"&&gn(!0)}),ae([de,tn,pn,()=>c.all.value],()=>{L.value==="assign"&&de.value&&Jn()}),ae(()=>b.value,()=>{!ve.value&&ce.value==="ADMINISTRATIVE"&&gn()});const Ot=Q(()=>b.value.map(r=>({employeeId:r.maNhanVien,dates:r.danhSachNgayXepCa})));function _n(){var l,O;ve.value=void 0,qe.value=[],xe.value="calendar",Qe.value=!1,de.value="",ce.value="ROTATING",Le.value=d.query.employee?[String(d.query.employee)]:[],Me.value=String(d.query.date||A),Je.value=Me.value,tn.value="week",pn.value=Me.value;const r=h.value.assignments.find(M=>M.id===d.query.edit);if(r)ve.value=r,Le.value=[r.employeeId],de.value=String(((l=v.all.value.find(M=>M.code===r.employeeId))==null?void 0:l.department)||""),ce.value=r.scheduleType,Me.value=Je.value=r.date,Qn.value=r.note,setTimeout(()=>{un.value=r.status==="OFF"?"OFF":r.shiftId,qe.value=[{employeeId:r.employeeId,date:r.date,shiftId:un.value,fullTime:r.fullTime!==!1,note:r.note,startTime:r.startTime,endTime:r.endTime,crossDay:r.crossDay}],I.value=!1},0);else if(Le.value.length){const M=Le.value[0];de.value=String(((O=v.all.value.find(K=>K.code===M))==null?void 0:O.department)||""),ce.value=rt(),setTimeout(()=>{Le.value=[M],I.value=!1},0)}!r&&ce.value==="ADMINISTRATIVE"&&de.value&&gn(),setTimeout(()=>{I.value=!1},0)}ae(()=>d.fullPath,_n),ae(()=>h.value.assignments.length,()=>{d.query.edit&&!ve.value&&_n()}),an(_n);function Mt(){if(ve.value){it(ve.value);return}if(k.value="",xe.value==="calendar"?qe.value.some(O=>Ee(O.date)):Ee(Me.value)){k.value="Không được phân công ngày trong quá khứ.";return}if(xe.value==="calendar"&&ce.value==="ADMINISTRATIVE"&&qe.value.some(O=>new Date(`${O.date}T12:00:00`).getDay()===0)){k.value="Không phân công ca hành chính vào Chủ nhật.";return}if(!de.value){k.value="Chọn bộ phận để xác định loại lịch phân công.";return}if(xe.value!=="calendar"&&(!Le.value.length||!Qe.value&&Le.value.length!==1)){k.value="Chọn nhân viên cần phân công.";return}if(!Me.value||!Je.value||Me.value>Je.value||oe(Me.value,Je.value).length>366){k.value="Khoảng ngày không hợp lệ (tối đa 366 ngày mỗi lần).";return}if(xe.value==="calendar"){if(!qe.value.length){k.value="Chọn ít nhất một ngày trên lịch và ca cho ngày đó.";return}if(qe.value.some(M=>!An.value.some(K=>K.code===M.employeeId))){k.value="Nhân viên trong phân công không còn tồn tại.";return}const O=qe.value.map(M=>{var K,g;return{id:((K=ve.value)==null?void 0:K.id)||"",employeeId:M.employeeId,date:M.date,shiftId:M.shiftId==="OFF"?"":M.shiftId,scheduleType:ce.value,status:M.shiftId==="OFF"?"OFF":"SCHEDULED",note:M.note,fullTime:M.fullTime,leaveTypeId:M.leaveTypeId,startTime:M.startTime,endTime:M.endTime,crossDay:M.crossDay,revision:((g=ve.value)==null?void 0:g.revision)||0}});if(O.some(M=>M.status==="SCHEDULED"&&!ut.value.some(K=>K.id===M.shiftId))){k.value="Ca đã chọn không còn hoạt động hoặc không phù hợp loại lịch. Chọn lại ca.";return}ct(O);return}const r=h.value.templates.find(O=>O.id===cn.value&&O.active);if(xe.value==="template"&&!r){k.value="Chọn mẫu đang hoạt động.";return}const l=[];for(const O of Le.value)oe(Me.value,Je.value).forEach((M,K)=>{var he,qn;const g=(new Date(M+"T12:00:00").getDay()+6)%7;if(ce.value==="ADMINISTRATIVE"&&g===6)return;const we=xe.value==="template"&&r?r.days[r.kind==="WEEK"?g:K%r.days.length]:xe.value==="weekly"?dn.value[g]:xe.value==="cycle"?dn.value[K%dn.value.length]:un.value;l.push({id:((he=ve.value)==null?void 0:he.id)||"",employeeId:O,date:M,shiftId:we==="OFF"?"":we,scheduleType:ce.value,status:we==="OFF"?"OFF":"SCHEDULED",note:Qn.value,revision:((qn=ve.value)==null?void 0:qn.revision)||0})});if(!l.length||l.some(O=>O.status==="SCHEDULED"&&!ut.value.some(M=>M.id===O.shiftId))){k.value="Chọn ca hợp lệ và ít nhất một ngày áp dụng.";return}ct(l)}const dt=Q(()=>at(h.value,Pe.value));function ct(r){Pe.value=r.map(l=>{const O=Ge.value.find(K=>K.id===l.shiftId);if(!O)return l;const M=new Date(`${l.date}T12:00:00Z`);return O.crossDay&&M.setUTCDate(M.getUTCDate()+1),{...l,startTime:l.startTime||O.startTime,endTime:l.endTime||O.endTime,startDate:l.date,endDate:M.toISOString().slice(0,10),crossDay:O.crossDay}}),vn.value=!0}async function Ft(){if(!(H.value||dt.value.length||!Pe.value.length)){if(!t.can("schedules",Pe.value.length>1?"bulk":"create")){k.value="Bạn không có quyền tạo phân công này.";return}if(Pe.value.some(r=>Ee(r.date))){k.value="Không được phân công ngày trong quá khứ.";return}H.value=!0,k.value="";try{const r=c.all.value.find(M=>M.name===de.value),l=hl(Pe.value,Ge.value,(r==null?void 0:r.code)||"",b.value.filter(M=>M.maBoPhan===(r==null?void 0:r.code)||M.tenBoPhan===de.value).map(M=>({code:M.maNhanVien,positionCode:M.maChucVu})));console.log("Saving assignments:",l);const O=await ml(l);if(O.thatBai>0){k.value=`Đã lưu ${O.thanhCong}/${O.tongSo}. ${O.thatBai} phân công thất bại. `+O.loi.map(K=>`${K.maNhanVien} · ${Ye(K.ngayLamViec)}: ${Ce(K)}`).join(`
`),o.error(k.value);const M=new Set(O.loi.map(K=>`${K.maNhanVien}:${Ye(K.ngayLamViec)}`));Pe.value=Pe.value.filter(K=>M.has(`${K.employeeId}:${K.date}`)),qe.value=qe.value.filter(K=>M.has(`${K.employeeId}:${K.date}`)),await nn();return}qe.value=[],I.value=!1,vn.value=!1,o.success(`Đã lưu ${O.thanhCong} phân công ca.`),await nn(),await u.push("/schedules"),await Oe()}catch(r){o.error(r),k.value=Ce(r)}finally{H.value=!1}}}function Ut(){xn.value&&(Wn.value=!1,u.push({path:"/schedules/assign",query:{edit:xn.value.id}}))}const fn=$(!1),Vn=$(!1),ln=$({id:"",name:"",scheduleType:"ROTATING",department:"",active:!0,kind:"WEEK",days:Array(7).fill("OFF"),note:""});function vt(r,l=!1,O=!1){ln.value=r?{...r,id:l?"":r.id,name:r.name+(l?" (bản sao)":""),days:[...r.days]}:{id:"",name:"",scheduleType:"ROTATING",department:"",active:!0,kind:"WEEK",days:Array(7).fill("OFF"),note:""},Vn.value=O,fn.value=!0}async function Rt(){await Sn(()=>Cn.template({...ln.value,days:[...ln.value.days]}))&&(fn.value=!1)}async function Ht(r){await u.push("/schedules/assign"),Qe.value=!0,ce.value=r.scheduleType,de.value=r.department,xe.value="template",setTimeout(()=>{cn.value=r.id},0)}const yn=$(!1),Ln=$("ALL"),bn=$({assignmentId:"",targetAssignmentId:"",shiftId:"",reason:""}),ht=$("employee"),Pn=$(),Bn=$(!1),On=$(""),zt=Q(()=>h.value.swaps.filter(r=>Ln.value==="ALL"||(Ln.value==="DONE"?r.status!=="PENDING":r.status==="PENDING"))),Gt=Q(()=>h.value.assignments.filter(r=>r.status==="SCHEDULED"));function mt(r){const l=h.value.assignments.find(O=>O.id===r);return l?`${f(l.employeeId)} · ${Ne(l.date)} · ${J(l)}`:"Lịch không còn tồn tại"}const Kt=$([]),pt=$(!1);function Mn(r,l=!1){return(l?r.targetSnapshot:r.sourceSnapshot)||h.value.assignments.find(O=>O.id===(l?r.targetAssignmentId:r.assignmentId))}function Xt(r,l=!1){const O=Mn(r,l);return O?`${f(O.employeeId)} · ${Ne(O.date)} · ${J(O)}`:"Lịch không còn tồn tại"}ae(ln,()=>{fn.value&&!Vn.value&&(I.value=!0)},{deep:!0}),ae(bn,()=>{yn.value&&(I.value=!0)},{deep:!0});function jt(r,l=!1){var K,g;const O=Mn(r,l),M=l?(K=Mn(r))==null?void 0:K.shiftId:r.targetAssignmentId?(g=Mn(r,!0))==null?void 0:g.shiftId:r.shiftId;return O?`${f(O.employeeId)} · ${Ne(O.date)} · ${x(M||"")}`:"Lịch không còn tồn tại"}async function Wt(){await Sn(()=>Cn.request({...bn.value}))&&(yn.value=!1)}async function Yt(r){const l=Pn.value;l&&await Sn(()=>Cn.decide(l.id,r,On.value))&&(Bn.value=!1)}return(r,l)=>{var M,K;const O=Kn("RouterLink");return a(),i("div",_r,[e("div",eu,[e("div",null,[l[50]||(l[50]=e("div",{class:"eyebrow"},"VẬN HÀNH KHÁCH SẠN / XẾP CA",-1)),e("h1",null,s(Y.value),1),l[51]||(l[51]=e("p",null,"Quản lý lịch hành chính và ca xoay của đội ngũ khách sạn",-1))]),L.value==="calendar"&&j(t).can("schedules","create")?(a(),ke(O,{key:0,class:"primary",to:"/schedules/assign"},{default:ie(()=>[...l[52]||(l[52]=[F(" + Phân công ca ",-1)])]),_:1})):S("",!0)]),X(_s,{items:w,"active-key":L.value==="exchange"||L.value==="leave-calendar"?"assign":L.value},null,8,["active-key"]),L.value==="templates"||L.value==="swaps"?(a(),i("p",nu," ⓘ Chế độ demo · Dữ liệu lưu trên trình duyệt. API xếp ca thật chưa được cung cấp. ")):S("",!0),k.value||v.error.value||c.error.value?(a(),i("p",tu,[F(s(k.value||v.error.value||c.error.value)+" ",1),e("button",{onClick:l[0]||(l[0]=g=>{Oe(),v.load(),c.load()})}," Tải lại dữ liệu ")])):S("",!0),z.value||v.loading.value||c.loading.value?(a(),i("p",lu," Đang tải dữ liệu xếp ca… ")):(a(),i(U,{key:3},[L.value==="reports"?(a(),i("section",au,[e("label",null,[l[54]||(l[54]=F("Bộ phận",-1)),ne(e("select",{"onUpdate:modelValue":l[1]||(l[1]=g=>ue.value=g)},[l[53]||(l[53]=e("option",{value:""},"Tất cả bộ phận",-1)),(a(!0),i(U,null,R(B.value,g=>(a(),i("option",{key:g},s(g),1))),128))],512),[[Te,ue.value]])]),e("label",null,[l[56]||(l[56]=F("Nhân viên",-1)),ne(e("select",{"onUpdate:modelValue":l[2]||(l[2]=g=>fe.value=g)},[l[55]||(l[55]=e("option",{value:""},"Tất cả nhân viên",-1)),(a(!0),i(U,null,R(v.all.value,g=>(a(),i("option",{key:g.code,value:g.code},s(f(g.code)),9,ou))),128))],512),[[Te,fe.value]])]),e("label",null,[l[58]||(l[58]=F("Loại lịch",-1)),ne(e("select",{"onUpdate:modelValue":l[3]||(l[3]=g=>pe.value=g)},[...l[57]||(l[57]=[e("option",{value:""},"Tất cả",-1),e("option",{value:"ADMINISTRATIVE"},"Hành chính",-1),e("option",{value:"ROTATING"},"Xoay ca",-1)])],512),[[Te,pe.value]])]),e("label",null,[l[60]||(l[60]=F("Ca",-1)),ne(e("select",{"onUpdate:modelValue":l[4]||(l[4]=g=>se.value=g)},[l[59]||(l[59]=e("option",{value:""},"Tất cả ca",-1)),(a(!0),i(U,null,R(h.value.shifts,g=>(a(),i("option",{key:g.id,value:g.id},s(g.name),9,iu))),128))],512),[[Te,se.value]])]),e("label",null,[l[61]||(l[61]=F("Tìm kiếm",-1)),ne(e("input",{"onUpdate:modelValue":l[5]||(l[5]=g=>be.value=g),placeholder:"Mã NV hoặc họ tên"},null,512),[[Xe,be.value]])])])):S("",!0),L.value==="calendar"?(a(),ke(Jr,{key:1,visible:Be.value,"onUpdate:visible":l[12]||(l[12]=g=>Be.value=g),modal:"",header:"Bộ lọc lịch phân công",style:{width:"min(680px, 94vw)"},class:"schedule-filter-dialog"},{footer:ie(()=>[e("button",{type:"button",class:"schedule-filter-clear",onClick:Ke},[...l[71]||(l[71]=[e("i",{class:"pi pi-filter-slash","aria-hidden":"true"},null,-1),F(" Xóa bộ lọc ",-1)])]),e("div",cu,[e("button",{type:"button",onClick:l[11]||(l[11]=g=>Be.value=!1)},"Hủy"),e("button",{type:"button",class:"schedule-filter-apply",onClick:_e}," Áp dụng ")])]),default:ie(()=>[e("div",su,[e("label",null,[l[63]||(l[63]=F("Nhân viên",-1)),ne(e("select",{"onUpdate:modelValue":l[6]||(l[6]=g=>re.employee=g)},[l[62]||(l[62]=e("option",{value:""},"Tất cả nhân viên",-1)),(a(!0),i(U,null,R(v.all.value,g=>(a(),i("option",{key:g.code,value:g.code},s(f(g.code)),9,ru))),128))],512),[[Te,re.employee]])]),e("label",null,[l[65]||(l[65]=F("Loại lịch",-1)),ne(e("select",{"onUpdate:modelValue":l[7]||(l[7]=g=>re.type=g)},[...l[64]||(l[64]=[e("option",{value:""},"Tất cả loại lịch",-1),e("option",{value:"ADMINISTRATIVE"},"Hành chính",-1),e("option",{value:"ROTATING"},"Xoay ca",-1)])],512),[[Te,re.type]])]),e("label",null,[l[67]||(l[67]=F("Ca",-1)),ne(e("select",{"onUpdate:modelValue":l[8]||(l[8]=g=>re.shiftFilter=g)},[l[66]||(l[66]=e("option",{value:""},"Tất cả ca",-1)),(a(!0),i(U,null,R(h.value.shifts,g=>(a(),i("option",{key:g.id,value:g.id},s(g.name),9,uu))),128))],512),[[Te,re.shiftFilter]])]),e("label",null,[l[69]||(l[69]=F("Trạng thái",-1)),ne(e("select",{"onUpdate:modelValue":l[9]||(l[9]=g=>re.status=g)},[...l[68]||(l[68]=[e("option",{value:""},"Tất cả trạng thái",-1),e("option",{value:"SCHEDULED"},"Đã xếp",-1),e("option",{value:"UNASSIGNED"},"Chưa xếp",-1),e("option",{value:"OFF"},"Nghỉ",-1),e("option",{value:"LEAVE"},"Nghỉ phép",-1)])],512),[[Te,re.status]])]),e("label",du,[l[70]||(l[70]=F("Tìm kiếm",-1)),ne(e("input",{"onUpdate:modelValue":l[10]||(l[10]=g=>re.search=g),placeholder:"Mã NV hoặc họ tên",type:"search"},null,512),[[Xe,re.search]])])])]),_:1},8,["visible"])):S("",!0),L.value==="calendar"?(a(),i("div",vu,[e("aside",hu,[l[73]||(l[73]=e("h2",{id:"department-filter-title"},"Bộ phận",-1)),q.value?(a(),i("p",mu,"Đang tải cây bộ phận…")):S("",!0),C.value?(a(),i("p",pu,[F(s(C.value)+" ",1),e("button",{type:"button",onClick:P},"Tải lại")])):S("",!0),e("button",{type:"button",class:Z(["department-filter-all",{selected:!ue.value}]),"aria-pressed":!ue.value,onClick:l[13]||(l[13]=g=>ue.value="")}," Tất cả bộ phận ",10,gu),e("nav",fu,[(a(!0),i(U,null,R(m.value,g=>(a(),i("details",{key:g.type,open:""},[e("summary",null,[F(s(g.label)+" ",1),e("small",null,s(g.departments.length),1)]),(a(!0),i(U,null,R(g.departments,we=>(a(),i("button",{key:we.code,type:"button",class:Z({selected:ue.value===we.name}),"aria-pressed":ue.value===we.name,onClick:he=>ue.value=we.name},[e("span",null,s(we.name),1),e("small",null,s(we.code),1)],10,yu))),128))]))),128)),y.value.length?(a(),i("details",bu,[e("summary",null,[l[72]||(l[72]=F(" Chưa phân loại ",-1)),e("small",null,s(y.value.length),1)]),(a(!0),i(U,null,R(y.value,g=>(a(),i("button",{key:g.code,type:"button",class:Z({selected:ue.value===g.name}),"aria-pressed":ue.value===g.name,onClick:we=>ue.value=g.name},[e("span",null,s(g.name),1),e("small",null,s(g.code),1)],10,qu))),128))])):S("",!0)])]),e("div",ku,[e("div",wu,[e("button",{type:"button",class:"schedule-filter-launcher","aria-label":`Mở bộ lọc lịch${je.value?`, ${je.value} mục đang áp dụng`:""}`,onClick:rn},[l[74]||(l[74]=e("i",{class:"pi pi-filter","aria-hidden":"true"},null,-1)),l[75]||(l[75]=e("span",null,"Bộ lọc",-1)),je.value?(a(),i("span",Cu,s(je.value),1)):S("",!0)],8,Tu)]),X(Js,{view:te.value,"onUpdate:view":l[14]||(l[14]=g=>te.value=g),anchor:G.value,"onUpdate:anchor":l[15]||(l[15]=g=>G.value=g),employees:v.all.value.map(g=>({code:g.code,name:g.name,department:String(g.department||"")})),"visible-employees":He.value.map(g=>({code:g.code,name:g.name,department:String(g.department||"")})),"group-by-department":!ue.value,dates:me.value,today:j(A),shifts:h.value.shifts,"can-create":j(t).can("schedules","create"),"employee-assignments":E,cell:W,matches:_,fmt:Ne,name:f,"shift-name":x,symbol:V,label:J,pending:Ie,onMove:Se,onOpen:Lt},null,8,["view","anchor","employees","visible-employees","group-by-department","dates","today","shifts","can-create"])])])):S("",!0),L.value==="exchange"||L.value==="leave-calendar"?(a(),ke(eo,{key:3,mode:L.value==="exchange"?"exchange":"leave",employees:v.all.value,departments:c.all.value,"can-edit":j(t).can("schedules","edit")},null,8,["mode","employees","departments","can-edit"])):S("",!0),L.value==="assign"?(a(),ke(Cs,{key:4,onReload:nn,bulk:Qe.value,"onUpdate:bulk":l[16]||(l[16]=g=>Qe.value=g),selected:Le.value,"onUpdate:selected":l[17]||(l[17]=g=>Le.value=g),"form-department":de.value,"onUpdate:formDepartment":l[18]||(l[18]=g=>de.value=g),"form-search":Yn.value,"onUpdate:formSearch":l[19]||(l[19]=g=>Yn.value=g),"schedule-type":ce.value,"onUpdate:scheduleType":l[20]||(l[20]=g=>ce.value=g),method:xe.value,"onUpdate:method":l[21]||(l[21]=g=>xe.value=g),"day-plans":qe.value,"onUpdate:dayPlans":l[22]||(l[22]=g=>qe.value=g),"calendar-mode":tn.value,"onUpdate:calendarMode":l[23]||(l[23]=g=>tn.value=g),"calendar-anchor":pn.value,"onUpdate:calendarAnchor":l[24]||(l[24]=g=>pn.value=g),editing:ve.value,busy:H.value,"can-create":j(t).can("schedules","create"),"can-edit":j(t).can("schedules",ve.value?"edit":Qe.value?"bulk":"create"),"can-update":j(t).can("schedules","edit"),"can-bulk":j(t).can("schedules","bulk"),"tree-loading":q.value,"tree-error":C.value,"department-groups":m.value,"unclassified-departments":y.value,"load-department-tree":P,"shifts-loading":hn.value,"shifts-error":En.value,"load-manual-shifts":Jn,eligible:Bt.value,name:f,"manual-shifts":Ge.value,data:h.value,"scheduled-dates":Ot.value,start:Me.value,"administrative-shift-id":(M=h.value.shifts.find(g=>g.active&&g.code==="D"))==null?void 0:M.id,"make-preview":Mt,"create-assignment":ve.value?void 0:Pt,onEdit:it,onAdministrativeBusy:l[25]||(l[25]=g=>H.value=g),onAdministrativeCreated:nn,onInput:l[26]||(l[26]=g=>I.value=!0),onChange:l[27]||(l[27]=g=>I.value=!0)},null,8,["bulk","selected","form-department","form-search","schedule-type","method","day-plans","calendar-mode","calendar-anchor","editing","busy","can-create","can-edit","can-update","can-bulk","tree-loading","tree-error","department-groups","unclassified-departments","shifts-loading","shifts-error","eligible","manual-shifts","data","scheduled-dates","start","administrative-shift-id","create-assignment"])):S("",!0),L.value==="templates"?(a(),ke(Qr,{key:5,templates:h.value.templates,shifts:h.value.shifts,departments:B.value,busy:H.value,"can-create":j(t).can("schedules","create"),"can-edit":j(t).can("schedules","edit"),"can-bulk":j(t).can("schedules","bulk"),onCreate:l[28]||(l[28]=g=>vt()),onOpen:vt,onToggle:l[29]||(l[29]=g=>Sn(()=>j(Cn).template({...g,days:[...g.days],active:!g.active}))),onApply:Ht},null,8,["templates","shifts","departments","busy","can-create","can-edit","can-bulk"])):S("",!0),L.value==="swaps"?(a(),ke(Mr,{key:6,tab:Ln.value,"onUpdate:tab":l[30]||(l[30]=g=>Ln.value=g),rows:zt.value,"can-approve":j(t).can("schedules","approve"),"can-create":j(t).can("schedules","create"),"assignment-label":mt,"shift-name":x,onCreate:l[31]||(l[31]=g=>{bn.value={assignmentId:"",targetAssignmentId:"",shiftId:"",reason:""},yn.value=!0}),onDetail:l[32]||(l[32]=g=>{Pn.value=g,On.value="",Bn.value=!0})},null,8,["tab","rows","can-approve","can-create"])):S("",!0),L.value==="reports"?(a(),ke(xr,{key:7})):S("",!0)],64)),X(Nt,{assignment:en.value,"department-code":((K=c.all.value.find(g=>g.name===de.value))==null?void 0:K.code)||"","employee-name":en.value?f(en.value.employeeId):"",onClose:l[33]||(l[33]=g=>en.value=void 0),onSaved:Vt},null,8,["assignment","department-code","employee-name"]),X(To,{detail:xn.value,"onUpdate:detail":l[34]||(l[34]=g=>xn.value=g),"detail-open":Wn.value,"onUpdate:detailOpen":l[35]||(l[35]=g=>Wn.value=g),"history-open":st.value,"onUpdate:historyOpen":l[36]||(l[36]=g=>st.value=g),preview:Pe.value,"onUpdate:preview":l[37]||(l[37]=g=>Pe.value=g),"preview-open":vn.value,"onUpdate:previewOpen":l[38]||(l[38]=g=>vn.value=g),history:h.value.history,issues:dt.value,error:k.value,busy:H.value,today:j(A),"can-edit":j(t).can("schedules","edit"),name:f,"employee-name":T,fmt:Ne,label:J,symbol:V,pending:Ie,"save-assignments":Ft,"edit-assignment":Ut,onClosePreview:l[39]||(l[39]=g=>vn.value=!1)},null,8,["detail","detail-open","history-open","preview","preview-open","history","issues","error","busy","today","can-edit"]),X(Zo,{open:fn.value,"onUpdate:open":l[40]||(l[40]=g=>fn.value=g),read:Vn.value,"onUpdate:read":l[41]||(l[41]=g=>Vn.value=g),template:ln.value,"onUpdate:template":l[42]||(l[42]=g=>ln.value=g),departments:B.value,shifts:h.value.shifts,busy:H.value,error:k.value,onSave:Rt},null,8,["open","read","template","departments","shifts","busy","error"]),X(zo,{open:yn.value,"onUpdate:open":l[43]||(l[43]=g=>yn.value=g),"detail-open":Bn.value,"onUpdate:detailOpen":l[44]||(l[44]=g=>Bn.value=g),swap:bn.value,"onUpdate:swap":l[45]||(l[45]=g=>bn.value=g),mode:ht.value,"onUpdate:mode":l[46]||(l[46]=g=>ht.value=g),detail:Pn.value,"onUpdate:detail":l[47]||(l[47]=g=>Pn.value=g),decision:On.value,"onUpdate:decision":l[48]||(l[48]=g=>On.value=g),scheduled:Gt.value,assignments:h.value.assignments,shifts:h.value.shifts,busy:H.value,error:k.value,"can-approve":j(t).can("schedules","approve"),"assignment-label":mt,"shift-name":x,"swap-before":Xt,"swap-after":jt,onSend:Wt,onDecide:Yt},null,8,["open","detail-open","swap","mode","detail","decision","scheduled","assignments","shifts","busy","error","can-approve"]),X(No,{open:pt.value,"onUpdate:open":l[49]||(l[49]=g=>pt.value=g),assignments:Kt.value,name:f,fmt:Ne,label:J},null,8,["open","assignments"])])}}});export{Uu as default};
