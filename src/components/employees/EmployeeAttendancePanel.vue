<script setup lang="ts">
import { ref,computed,watch } from 'vue';
import AppKpiCard from '@/components/common/AppKpiCard.vue';
import AppDataTable from '@/components/common/AppDataTable.vue';
import AppButton from '@/components/common/AppButton.vue';
import AttendanceLogDrawer from '@/components/attendance/AttendanceLogDrawer.vue';
import { exportCsv } from '@/utils/export';
import type { HrRecord } from '@/types/common';
const props=defineProps<{records:HrRecord[];employee:HrRecord}>();
const emit=defineEmits<{refresh:[]}>();
const period=ref(new Date().toISOString().slice(0,7)),filter=ref('all'),page=ref(1),pageSize=ref(10),sortField=ref('date'),sortOrder=ref(-1),selected=ref<HrRecord>(),visible=ref(false);
const monthly=computed(()=>props.records.filter(r=>String(r.date).startsWith(period.value)));
const filtered=computed(()=>monthly.value.filter(r=>filter.value==='all'||(filter.value==='late'?Number(r.lateMinutes)>0:filter.value==='night'?String(r.shift).startsWith('22:'):filter.value==='off'?r.shift==='OFF':Number(r.lateMinutes||0)===0)).sort((a,b)=>String(a[sortField.value]??'').localeCompare(String(b[sortField.value]??''),'vi',{numeric:true})*sortOrder.value));
const hours=computed(()=>monthly.value.reduce((s,r)=>s+Number(r.hours||0),0));
const late=computed(()=>monthly.value.filter(r=>Number(r.lateMinutes)>0).length);
watch([period,filter],()=>{page.value=1;});
function view(row:HrRecord){selected.value=row;visible.value=true;}
function download(){exportCsv(filtered.value,['date','shift','checkIn','checkOut','hours','lateMinutes','status'],['Ng?y','Ca','V?o','Ra','Gi?','Tr?','Tr?ng th?i'],'cham-cong-'+props.employee.code);}
</script>
<template><div class="schedule-toolbar"><label class="form-field">K? ch?m c?ng<input v-model="period" type="month" class="period-input" /></label><div class="toolbar-actions"><RouterLink :to="{path:'/attendance',query:{employee:employee.code,period}}">B?ng ch?m c?ng ma tr?n th?ng ?</RouterLink><AppButton label="Xu?t CSV" icon="pi pi-download" severity="secondary" outlined :disabled="!filtered.length" @click="download" /></div></div><div class="attendance-kpis"><AppKpiCard label="Ng?y c?ng th?c t?" :value="(hours/8).toFixed(1)" note="Quy ??i 8 gi? / c?ng" icon="pi-calendar"/><AppKpiCard label="Gi? l?m ghi nh?n" :value="hours+'h'" icon="pi-clock"/><AppKpiCard label="?i tr?" :value="late+' l??t'" tone="amber" icon="pi-exclamation-circle"/><AppKpiCard label="Ca ??m" :value="monthly.filter(r=>String(r.shift).startsWith('22:')).length" icon="pi-moon"/></div><div class="quick-filters"><button v-for="item in [{key:'all',label:'T?t c?'},{key:'ontime',label:'??ng gi?'},{key:'late',label:'?i tr?'},{key:'night',label:'Ca ??m'},{key:'off',label:'Ngh? tu?n'}]" :key="item.key" class="chip-button" :class="{active:filter===item.key}" @click="filter=item.key">{{ item.label }}</button></div><section class="panel"><div class="panel-top"><h2>B?ng nh?t k? ch?m c?ng chi ti?t</h2><small>{{ filtered.length }} d?ng ghi nh?n</small></div><AppDataTable :rows="filtered.slice((page-1)*pageSize,page*pageSize)" :columns="['date','shift','checkIn','checkOut','hours','lateMinutes','status']" :total="filtered.length" :page="page" :page-size="pageSize" :loading="false" error="" @page="page=$event.page+1;pageSize=$event.rows" @sort="sortField=$event.sortField||'date';sortOrder=$event.sortOrder||1" @view="view" @reset="filter='all';period=new Date().toISOString().slice(0,7)"><template #actions="{row}"><AppButton icon="pi pi-receipt" aria-label="Nh?t k? qu?t th?" text @click="view(row)"/></template></AppDataTable></section><section class="profile-panel"><h2>Tu?n th? &amp; Chuy?n c?n</h2><div class="summary-row"><span>T? l? kh?ng ?i tr?</span><strong>{{ monthly.length?((monthly.length-late)/monthly.length*100).toFixed(1)+'%':'Ch?a c? d? li?u' }}</strong></div></section><AttendanceLogDrawer v-model:visible="visible" :record="selected" @saved="emit('refresh')"/></template>
<style scoped>.attendance-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}@media(max-width:800px){.attendance-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}</style>
