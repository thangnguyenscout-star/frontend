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
 {label:'Tổng nhân viên',value:employees.value.length,note:'Toàn khách sạn',icon:'pi-users'},
 {label:'Đang làm việc',value:employees.value.filter(r => r.status === 'active').length,note:'Nhân sự đang hoạt động',icon:'pi-id-card'},
 {label:'Thử việc',value:employees.value.filter(r => r.type === 'probation').length,note:'Theo loại hợp đồng',icon:'pi-hourglass'},
 {label:'HĐLĐ hết hạn (<30d)',value:contracts.value.length,note:'Cần rà soát tái ký',icon:'pi-file-edit'},
 {label:'Nghỉ phép hôm nay',value:related('leave').filter(r => r.status === 'approved' && r.date === today).length,note:'Phiếu đã được duyệt',icon:'pi-calendar-minus'},
 {label:'OT hôm nay',value:related('overtime').filter(r => r.date === today).reduce((s,r) => s + Number(r.hours || 0),0) + 'h',note:'Tổng giờ ghi nhận',icon:'pi-clock'},
 {label:'Quỹ lương ước tính',value:compact(related('payroll').filter(r => r.period === period.value).reduce((s,r) => s + Number(r.amount || 0),0)) + ' ₫',note:'Kỳ ' + period.value,icon:'pi-wallet'},
]);
const trend = computed(() => Array.from({length:14}, (_, i) => {
 const d = new Date(period.value + '-01T12:00:00'); d.setDate(i + 1);
 const date = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
 const rows = related('attendance').filter(r => r.date === date), late = rows.filter(r => Number(r.lateMinutes) > 0).length;
 return {date, label:d.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit'}),count:rows.length,late,rate:rows.length ? (rows.length-late)/rows.length*100 : null};
}));
const points = computed(() => trend.value.filter(v => v.rate !== null).map(v => (20+trend.value.indexOf(v)*42)+','+(160-Number(v.rate)*1.3)).join(' '));
const average = computed(() => { const rows = trend.value.filter(v => v.rate !== null); return rows.length ? (rows.reduce((s,v) => s+Number(v.rate),0)/rows.length).toFixed(1)+'%' : 'Chưa có dữ liệu'; });
const shifts = [{name:'Ca Sáng',time:'06:00–14:00',icon:'pi-sun'},{name:'Ca Chiều',time:'14:00–22:00',icon:'pi-cloud'},{name:'Ca Đêm',time:'22:00–06:00',icon:'pi-moon'},{name:'Ca Gãy (Split Shift)',time:'10–14 & 18–22',icon:'pi-arrows-h'}];
async function approve(row: HrRecord, status: string) {
 if (!permission.can('leave','edit') || busy.value) return;
 busy.value=row.id;
 try { await recordService.save('leave',{...row,status}); await load(); toast.success('success'); }
 catch(e){toast.error(apiErrorKey(e));} finally{busy.value='';}
}
function download(){exportCsv(employees.value,['code','name','department','status'],['Mã NV','Họ tên','Bộ phận','Trạng thái'],'nhan-su');}
</script>
<template>
 <section class="stitch-dashboard">
 <div class="page-heading"><div><div class="eyebrow"><i class="pi pi-building" /> BÁO CÁO NHÂN SỰ ĐIỀU HÀNH KHÁCH SẠN</div><h1>Tổng quan Vận hành Nhân sự</h1></div>
 <div class="toolbar-actions"><label class="sr-label">Khách sạn<select v-model="hotel" class="period-input"><option value="">Toàn khách sạn</option><option v-for="item in hotels" :key="item">{{ item }}</option></select></label><label class="sr-label">Kỳ báo cáo<input v-model="period" type="month" required class="period-input" /></label><AppButton label="Cập nhật" icon="pi pi-sync" severity="secondary" outlined :loading="loading" @click="load" /><AppButton label="Xuất báo cáo" icon="pi pi-download" :disabled="loading || !!error || !employees.length" @click="download" /></div></div>
 <AppLoading v-if="loading" /><AppErrorState v-else-if="error" :error="error" @retry="load" /><AppEmptyState v-else-if="!employees.length" title="Chưa có dữ liệu nhân sự" @reset="hotel=''; load()" />
 <template v-else>
 <div class="dashboard-kpis"><AppKpiCard v-for="stat in stats.filter(s => s.icon !== 'pi-wallet' || permission.can('payroll'))" :key="stat.label" v-bind="stat" /></div>
 <div class="dashboard-grid"><section class="panel detail-body"><h2>Cơ cấu Nhân sự theo Khối</h2><small>Phân bố {{ employees.length }} nhân sự theo trung tâm doanh thu</small><div class="distribution"><div class="donut" :style="{background:donut}" role="img" aria-label="Phân bố nhân sự theo khối"><div class="donut-center"><strong>{{ employees.length }}</strong>Nhân sự</div></div><div class="chart-legend"><p v-for="d in distribution" :key="d.name"><span class="legend-dot" :style="{background:d.color}" />{{ d.name }}<b>{{ Math.round(d.count/employees.length*100) }}% ({{ d.count }})</b></p></div></div><RouterLink class="widget-footer" to="/employees">Xem danh sách nhân sự →</RouterLink></section>
 <section class="panel detail-body"><h2>Xu hướng Chấm công &amp; Đi trễ (14 ngày)</h2><small>Theo dõi tỷ lệ đúng giờ và số lượng trường hợp check-in muộn</small><div class="trend-legend"><span><i class="legend-dot" style="background:#0067c0" /> Đi làm đúng giờ (%)</span><span><i class="legend-dot" style="background:#f7630c" /> Đi trễ (Số ca)</span></div>
 <svg class="trend-chart" viewBox="0 0 590 190" role="img" aria-label="Biểu đồ tỷ lệ đúng giờ và đi trễ"><path v-for="y in [30,70,110,160]" :key="y" :d="'M 20 '+y+' H 566'" stroke="#efeded" /><rect v-for="(v,i) in trend" :key="v.date" :x="12+i*42" :y="160-v.late/Math.max(1,...trend.map(r=>r.late))*95" width="16" :height="v.late/Math.max(1,...trend.map(r=>r.late))*95" fill="#f7630c" opacity=".5"><title>{{ v.label }}: {{ v.late }} ca trễ</title></rect><polyline :points="points" fill="none" stroke="#0067c0" stroke-width="3" /><template v-for="(v,i) in trend" :key="v.date"><circle v-if="v.rate !== null" :cx="20+i*42" :cy="160-v.rate*1.3" r="4" fill="#0067c0"><title>{{ v.label }}: {{ v.rate.toFixed(1) }}% đúng giờ</title></circle></template></svg><div class="chart-labels"><span v-for="v in trend" :key="v.date">{{ v.label }}</span></div><p class="widget-footer">Tỷ lệ đi làm đúng giờ trung bình: <strong>{{ average }}</strong></p></section></div>
 <div class="dashboard-widgets"><section class="panel detail-body"><h2><i class="pi pi-clock" /> Bố trí Ca trực Hôm nay</h2><div v-for="shift in shifts" :key="shift.name" class="widget-item shift-item"><i :class="['pi',shift.icon]" /><div><strong>{{ shift.name }}<span class="count-pill">{{ related('schedules').filter(r=>r.shift===shift.time && r.date===today).length }} NV</span></strong><p>{{ shift.time }}</p></div></div><RouterLink v-if="permission.can('schedules')" class="widget-footer" to="/schedules">Xem biểu đồ phân ca tuần →</RouterLink></section>
 <section class="panel detail-body"><h2><i class="pi pi-inbox" /> Chờ Trưởng Bộ Phận Duyệt <span class="count-pill">{{ pending.length }}</span></h2><div v-for="r in pending.slice(0,3)" :key="r.id" class="widget-item"><strong>{{ r.name }}</strong><p>{{ r.department }} • {{ r.date }} • {{ r.days }} ngày</p><div class="toolbar-actions"><AppButton v-if="permission.can('leave','edit')" label="Bỏ qua" severity="secondary" text :disabled="!!busy" @click="approve(r,'rejected')" /><AppButton v-if="permission.can('leave','edit')" label="Duyệt" size="small" :loading="busy===r.id" :disabled="!!busy && busy!==r.id" @click="approve(r,'approved')" /><RouterLink v-if="permission.can('leave')" :to="'/leave/'+r.id">Chi tiết</RouterLink></div></div><p v-if="!pending.length" class="muted">Không có yêu cầu chờ duyệt.</p><RouterLink v-if="permission.can('leave')" to="/leave" class="widget-footer">Xem tất cả yêu cầu →</RouterLink></section>
 <section class="panel detail-body"><h2><i class="pi pi-file-edit" /> Đáo hạn Hợp đồng (&lt;15 ngày)</h2><div v-for="r in urgentContracts.slice(0,3)" :key="r.id" class="widget-item"><strong>{{ r.name }}</strong><p>{{ r.position }} • {{ r.department }}</p><p>Hết hạn: {{ r.endDate }}</p><RouterLink v-if="permission.can('contracts')" :to="'/contracts/'+r.id">Chi tiết &amp; gia hạn →</RouterLink></div><p v-if="!urgentContracts.length" class="muted">Không có hợp đồng sắp hết hạn.</p><RouterLink v-if="permission.can('contracts')" to="/contracts" class="widget-footer">Mở toàn bộ danh mục HĐLĐ →</RouterLink></section></div>
 </template></section>
</template>
<style scoped>
.stitch-dashboard h1{font-size:28px;line-height:36px}.dashboard-kpis{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:12px;margin:20px 0 24px}.sr-label{display:flex;flex-direction:column;gap:4px;color:#717783;font-size:11px}.trend-legend{display:flex;gap:20px;margin-top:20px;font-size:11px}.trend-legend span{display:flex;align-items:center;gap:6px}.shift-item{display:flex;align-items:center;gap:12px}.shift-item>i{padding:12px;background:#eff6fc;color:#0067c0;border-radius:8px}.shift-item>div{flex:1}.stitch-dashboard .detail-body{padding:24px}.stitch-dashboard .toolbar-actions{flex-wrap:wrap}.stitch-dashboard .widget-item{padding:14px;background:#f8f9fa}.stitch-dashboard h2{font-size:14px}
@media(max-width:1500px){.dashboard-kpis{grid-template-columns:repeat(4,minmax(0,1fr))}}@media(max-width:750px){.dashboard-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.stitch-dashboard .detail-body{padding:16px}.trend-legend{flex-wrap:wrap}.stitch-dashboard h1{font-size:24px}}
</style>
