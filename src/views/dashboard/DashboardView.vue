<script setup lang="ts">
// Stitch S01/S02: 027143fe95584014966f36a626fc9e45 / 969b37d2bcb84627bcff57e34cae3cd4.
import { computed, ref } from 'vue';
import { useDashboard } from '@/composables/useDashboard';
import { usePermission } from '@/composables/usePermission';
import { useToast } from '@/composables/useToast';
import { recordService } from '@/services/modules/record.service';
import { apiErrorKey } from '@/services/api/apiErrorHandler';
import AppLoading from '@/components/common/AppLoading.vue';
import AppErrorState from '@/components/common/AppErrorState.vue';
import AppEmptyState from '@/components/common/AppEmptyState.vue';
import AppButton from '@/components/common/AppButton.vue';
import AppKpiCard from '@/components/common/AppKpiCard.vue';
import { exportCsv } from '@/utils/export';
import type { HrRecord } from '@/types/common';
const { data, loading, error, load } = useDashboard();
const permission = usePermission(), toast = useToast();
const period = ref(new Date().toISOString().slice(0, 7)), hotel = ref(''), busy = ref('');
const today = new Date().toISOString().slice(0, 10);
const hotels = computed(() => [...new Set((data.value.employees || []).map(r => String(r.hotel || 'Grand Hotel Saigon')))]);
const employees = computed(() => (data.value.employees || []).filter(r => !hotel.value || r.hotel === hotel.value));
const employeeCodes = computed(() => new Set(employees.value.map(r => r.code)));
const related = (module: string) => (data.value[module] || []).filter(r => !hotel.value || employeeCodes.value.has(String(r.employeeId)));
const contracts = computed(() => related('contracts').filter(r => r.endDate && String(r.endDate) >= today && new Date(String(r.endDate)).getTime() < Date.now() + 30 * 86400000));
const urgentContracts = computed(() => contracts.value.filter(r => new Date(String(r.endDate)).getTime() < Date.now() + 15 * 86400000));
const pending = computed(() => related('leave').filter(r => r.status === 'pending'));
const palette = ['#0067c0', '#4ca0ff', '#a6c8ff', '#00518a', '#717783', '#c1c6d4'];
const distribution = computed(() => [...new Set(employees.value.map(r => String(r.department)))].map((name, i) => ({name, count: employees.value.filter(r => r.department === name).length, color: palette[i % palette.length]})));
const donut = computed(() => { let start = 0; return 'conic-gradient(' + distribution.value.map(d => { const end = start + d.count / Math.max(employees.value.length, 1) * 100; const part = d.color + ' ' + start + '% ' + end + '%'; start = end; return part; }).join(',') + ')'; });
const compact = (n: number) => new Intl.NumberFormat('vi-VN', {notation:'compact',maximumFractionDigits:1}).format(n);
const stats = computed(() => [
 {label:'T?ng nh?n vi?n',value:employees.value.length,note:'To?n kh?ch s?n',icon:'pi-users'},
 {label:'?ang l?m vi?c',value:employees.value.filter(r => r.status === 'active').length,note:'Nh?n s? ?ang ho?t ??ng',icon:'pi-id-card'},
 {label:'Th? vi?c',value:employees.value.filter(r => r.type === 'probation').length,note:'Theo lo?i h?p ??ng',icon:'pi-hourglass'},
 {label:'H?L? h?t h?n (<30d)',value:contracts.value.length,note:'C?n r? so?t t?i k?',icon:'pi-file-edit'},
 {label:'Ngh? ph?p h?m nay',value:related('leave').filter(r => r.status === 'approved' && r.date === today).length,note:'Phi?u ?? ???c duy?t',icon:'pi-calendar-minus'},
 {label:'OT h?m nay',value:related('overtime').filter(r => r.date === today).reduce((s,r) => s + Number(r.hours || 0),0) + 'h',note:'T?ng gi? ghi nh?n',icon:'pi-clock'},
 {label:'Qu? l??ng ??c t?nh',value:compact(related('payroll').filter(r => r.period === period.value).reduce((s,r) => s + Number(r.amount || 0),0)) + ' ?',note:'K? ' + period.value,icon:'pi-wallet'},
]);
const trend = computed(() => Array.from({length:14}, (_, i) => {
 const d = new Date(period.value + '-01T12:00:00'); d.setDate(i + 1);
 const date = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
 const rows = related('attendance').filter(r => r.date === date), late = rows.filter(r => Number(r.lateMinutes) > 0).length;
 return {date, label:d.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit'}),count:rows.length,late,rate:rows.length ? (rows.length-late)/rows.length*100 : null};
}));
const points = computed(() => trend.value.filter(v => v.rate !== null).map(v => (20+trend.value.indexOf(v)*42)+','+(160-Number(v.rate)*1.3)).join(' '));
const average = computed(() => { const rows = trend.value.filter(v => v.rate !== null); return rows.length ? (rows.reduce((s,v) => s+Number(v.rate),0)/rows.length).toFixed(1)+'%' : 'Ch?a c? d? li?u'; });
const shifts = [{name:'Ca S?ng',time:'06:00?14:00',icon:'pi-sun'},{name:'Ca Chi?u',time:'14:00?22:00',icon:'pi-cloud'},{name:'Ca ??m',time:'22:00?06:00',icon:'pi-moon'},{name:'Ca G?y (Split Shift)',time:'10?14 & 18?22',icon:'pi-arrows-h'}];
async function approve(row: HrRecord, status: string) {
 if (!permission.can('leave','edit') || busy.value) return;
 busy.value=row.id;
 try { await recordService.save('leave',{...row,status}); await load(); toast.success('success'); }
 catch(e){toast.error(apiErrorKey(e));} finally{busy.value='';}
}
function download(){exportCsv(employees.value,['code','name','department','status'],['M? NV','H? t?n','B? ph?n','Tr?ng th?i'],'nhan-su');}
</script>
<template>
 <section class="stitch-dashboard">
 <div class="page-heading"><div><div class="eyebrow"><i class="pi pi-building" /> B?O C?O NH?N S? ?I?U H?NH KH?CH S?N</div><h1>T?ng quan V?n h?nh Nh?n s?</h1></div>
 <div class="toolbar-actions"><label class="sr-label">Kh?ch s?n<select v-model="hotel" class="period-input"><option value="">To?n kh?ch s?n</option><option v-for="item in hotels" :key="item">{{ item }}</option></select></label><label class="sr-label">K? b?o c?o<input v-model="period" type="month" required class="period-input" /></label><AppButton label="C?p nh?t" icon="pi pi-sync" severity="secondary" outlined :loading="loading" @click="load" /><AppButton label="Xu?t b?o c?o" icon="pi pi-download" :disabled="loading || !!error || !employees.length" @click="download" /></div></div>
 <AppLoading v-if="loading" /><AppErrorState v-else-if="error" :error="error" @retry="load" /><AppEmptyState v-else-if="!employees.length" title="Ch?a c? d? li?u nh?n s?" @reset="hotel=''; load()" />
 <template v-else>
 <div class="dashboard-kpis"><AppKpiCard v-for="stat in stats.filter(s => s.icon !== 'pi-wallet' || permission.can('payroll'))" :key="stat.label" v-bind="stat" /></div>
 <div class="dashboard-grid"><section class="panel detail-body"><h2>C? c?u Nh?n s? theo Kh?i</h2><small>Ph?n b? {{ employees.length }} nh?n s? theo trung t?m doanh thu</small><div class="distribution"><div class="donut" :style="{background:donut}" role="img" aria-label="Ph?n b? nh?n s? theo kh?i"><div class="donut-center"><strong>{{ employees.length }}</strong>Nh?n s?</div></div><div class="chart-legend"><p v-for="d in distribution" :key="d.name"><span class="legend-dot" :style="{background:d.color}" />{{ d.name }}<b>{{ Math.round(d.count/employees.length*100) }}% ({{ d.count }})</b></p></div></div><RouterLink class="widget-footer" to="/employees">Xem danh s?ch nh?n s? ?</RouterLink></section>
 <section class="panel detail-body"><h2>Xu h??ng Ch?m c?ng &amp; ?i tr? (14 ng?y)</h2><small>Theo d?i t? l? ??ng gi? v? s? l??ng tr??ng h?p check-in mu?n</small><div class="trend-legend"><span><i class="legend-dot" style="background:#0067c0" /> ?i l?m ??ng gi? (%)</span><span><i class="legend-dot" style="background:#f7630c" /> ?i tr? (S? ca)</span></div>
 <svg class="trend-chart" viewBox="0 0 590 190" role="img" aria-label="Bi?u ?? t? l? ??ng gi? v? ?i tr?"><path v-for="y in [30,70,110,160]" :key="y" :d="'M 20 '+y+' H 566'" stroke="#efeded" /><rect v-for="(v,i) in trend" :key="v.date" :x="12+i*42" :y="160-v.late/Math.max(1,...trend.map(r=>r.late))*95" width="16" :height="v.late/Math.max(1,...trend.map(r=>r.late))*95" fill="#f7630c" opacity=".5"><title>{{ v.label }}: {{ v.late }} ca tr?</title></rect><polyline :points="points" fill="none" stroke="#0067c0" stroke-width="3" /><template v-for="(v,i) in trend" :key="v.date"><circle v-if="v.rate !== null" :cx="20+i*42" :cy="160-v.rate*1.3" r="4" fill="#0067c0"><title>{{ v.label }}: {{ v.rate.toFixed(1) }}% ??ng gi?</title></circle></template></svg><div class="chart-labels"><span v-for="v in trend" :key="v.date">{{ v.label }}</span></div><p class="widget-footer">T? l? ?i l?m ??ng gi? trung b?nh: <strong>{{ average }}</strong></p></section></div>
 <div class="dashboard-widgets"><section class="panel detail-body"><h2><i class="pi pi-clock" /> B? tr? Ca tr?c H?m nay</h2><div v-for="shift in shifts" :key="shift.name" class="widget-item shift-item"><i :class="['pi',shift.icon]" /><div><strong>{{ shift.name }}<span class="count-pill">{{ related('schedules').filter(r=>r.shift===shift.time && r.date===today).length }} NV</span></strong><p>{{ shift.time }}</p></div></div><RouterLink v-if="permission.can('schedules')" class="widget-footer" to="/schedules">Xem bi?u ?? ph?n ca tu?n ?</RouterLink></section>
 <section class="panel detail-body"><h2><i class="pi pi-inbox" /> Ch? Tr??ng B? Ph?n Duy?t <span class="count-pill">{{ pending.length }}</span></h2><div v-for="r in pending.slice(0,3)" :key="r.id" class="widget-item"><strong>{{ r.name }}</strong><p>{{ r.department }} ? {{ r.date }} ? {{ r.days }} ng?y</p><div class="toolbar-actions"><AppButton v-if="permission.can('leave','edit')" label="B? qua" severity="secondary" text :disabled="!!busy" @click="approve(r,'rejected')" /><AppButton v-if="permission.can('leave','edit')" label="Duy?t" size="small" :loading="busy===r.id" :disabled="!!busy && busy!==r.id" @click="approve(r,'approved')" /><RouterLink v-if="permission.can('leave')" :to="'/leave/'+r.id">Chi ti?t</RouterLink></div></div><p v-if="!pending.length" class="muted">Kh?ng c? y?u c?u ch? duy?t.</p><RouterLink v-if="permission.can('leave')" to="/leave" class="widget-footer">Xem t?t c? y?u c?u ?</RouterLink></section>
 <section class="panel detail-body"><h2><i class="pi pi-file-edit" /> ??o h?n H?p ??ng (&lt;15 ng?y)</h2><div v-for="r in urgentContracts.slice(0,3)" :key="r.id" class="widget-item"><strong>{{ r.name }}</strong><p>{{ r.position }} ? {{ r.department }}</p><p>H?t h?n: {{ r.endDate }}</p><RouterLink v-if="permission.can('contracts')" :to="'/contracts/'+r.id">Chi ti?t &amp; gia h?n ?</RouterLink></div><p v-if="!urgentContracts.length" class="muted">Kh?ng c? h?p ??ng s?p h?t h?n.</p><RouterLink v-if="permission.can('contracts')" to="/contracts" class="widget-footer">M? to?n b? danh m?c H?L? ?</RouterLink></section></div>
 </template></section>
</template>
<style scoped>
.stitch-dashboard h1{font-size:28px;line-height:36px}.dashboard-kpis{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:12px;margin:20px 0 24px}.sr-label{display:flex;flex-direction:column;gap:4px;color:#717783;font-size:11px}.trend-legend{display:flex;gap:20px;margin-top:20px;font-size:11px}.trend-legend span{display:flex;align-items:center;gap:6px}.shift-item{display:flex;align-items:center;gap:12px}.shift-item>i{padding:12px;background:#eff6fc;color:#0067c0;border-radius:8px}.shift-item>div{flex:1}.stitch-dashboard .detail-body{padding:24px}.stitch-dashboard .toolbar-actions{flex-wrap:wrap}.stitch-dashboard .widget-item{padding:14px;background:#f8f9fa}.stitch-dashboard h2{font-size:14px}
@media(max-width:1500px){.dashboard-kpis{grid-template-columns:repeat(4,minmax(0,1fr))}}@media(max-width:750px){.dashboard-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.stitch-dashboard .detail-body{padding:16px}.trend-legend{flex-wrap:wrap}.stitch-dashboard h1{font-size:24px}}
</style>
