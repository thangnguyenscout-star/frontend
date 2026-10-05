<script setup lang="ts">
import { ref,watch,computed } from 'vue';
import AppLoading from '@/components/common/AppLoading.vue';
import AppErrorState from '@/components/common/AppErrorState.vue';
import { employeeTaxService } from '@/services/modules/employee-tax.service';
import { apiErrorKey } from '@/services/api/apiErrorHandler';
import { currency } from '@/utils/currency';
import type { HrRecord } from '@/types/common';
const props=defineProps<{employee:HrRecord;payroll:HrRecord[]}>();
const period=ref(new Date().toISOString().slice(0,7)),data=ref<Awaited<ReturnType<typeof employeeTaxService.get>>>(),loading=ref(false),error=ref('');
const payroll=computed(()=>props.payroll.find(r=>r.period===period.value));
let request=0;
async function load(){const n=++request;loading.value=true;error.value='';try{const result=await employeeTaxService.get(props.employee,payroll.value);if(n===request)data.value=result;}catch(e){if(n===request)error.value=apiErrorKey(e);}finally{if(n===request)loading.value=false;}}
watch([()=>props.employee,payroll],load,{immediate:true});
</script>
<template><div class="alert-strip"><i class="pi pi-shield"/><div><strong>Th?ng tin Thu? &amp; B?o hi?m</strong><p style="margin:4px 0 0">H? s? ph?p l? v? c?c kho?n tr?ch ??ng theo k?</p></div></div><label class="form-field">K? d? li?u<input v-model="period" class="period-input" type="month"/></label><AppLoading v-if="loading"/><AppErrorState v-else-if="error" :error="error" @retry="load"/><template v-else-if="data"><section class="profile-panel"><h2>1. B?o hi?m x? h?i (BHXH &amp; BHTN)</h2><dl class="detail-grid"><div><dt>S? s? b?o hi?m x? h?i</dt><dd>{{ employee.insuranceNumber || '?' }}</dd></div><div><dt>L??ng ??ng b?o hi?m</dt><dd>{{ currency(data.base) }}</dd></div></dl><div class="table-scroll"><table class="compact-table"><thead><tr><th>Kho?n m?c tr?ch ??ng</th><th>T? l? NL?</th><th>NL? ??ng</th><th>T? l? DN</th><th>DN ??ng</th></tr></thead><tbody><tr v-for="r in data.contributions" :key="r.label"><td>{{ r.label }}</td><td>{{ r.employeeRate }}%</td><td>{{ currency(r.employeeAmount) }}</td><td>{{ r.employerRate }}%</td><td>{{ currency(r.employerAmount) }}</td></tr></tbody><tfoot><tr><th>T?ng tr?ch n?p</th><td></td><td>{{ currency(data.contributions.reduce((s,r)=>s+r.employeeAmount,0)) }}</td><td></td><td>{{ currency(data.contributions.reduce((s,r)=>s+r.employerAmount,0)) }}</td></tr></tfoot></table></div></section>
<section class="profile-panel"><h2>2. Thu? thu nh?p c? nh?n (PIT)</h2><dl class="detail-grid"><div><dt>M? s? thu? thu nh?p c? nh?n</dt><dd>{{ employee.taxNumber || '?' }}</dd></div><div><dt>K? t?nh thu?</dt><dd>{{ period }}</dd></div></dl><template v-if="data.hasPayroll"><div class="summary-row"><span>Thu nh?p Gross trong k?</span><strong>{{ currency(data.gross) }}</strong></div><div class="payroll-total"><span>Thu? TNCN t?m kh?u tr?</span><strong>{{ currency(data.tax) }}</strong></div></template><p v-else class="muted">Ch?a c? b?ng l??ng trong k? n?y.</p></section>
<section class="profile-panel"><h2>3. B?o hi?m y t? (BHYT &amp; Ph?c l?i s?c kh?e)</h2><dl class="detail-grid"><div><dt>S? th? BHYT</dt><dd>{{ employee.healthInsuranceNumber || '?' }}</dd></div><div><dt>N?i ??ng k? kh?m ch?a b?nh ban ??u</dt><dd>{{ employee.healthcareProvider || '?' }}</dd></div></dl></section></template></template>
