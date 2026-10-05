<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { recordService } from '@/services/modules/record.service';
import { apiErrorKey } from '@/services/api/apiErrorHandler';
import { usePermission } from '@/composables/usePermission';
import AppLoading from '@/components/common/AppLoading.vue';
import AppErrorState from '@/components/common/AppErrorState.vue';
import AppStatusBadge from '@/components/common/AppStatusBadge.vue';
import { currency } from '@/utils/currency';
import type { HrRecord } from '@/types/common';
const props=defineProps<{record:HrRecord}>();
const {t}=useI18n(), permission=usePermission();
const active=ref('personal'), data=ref<Record<string,HrRecord[]>>({}), loading=ref(false),error=ref('');
let request=0;
async function load(){const current=++request;loading.value=true;error.value='';try{const result=await recordService.overview();if(current===request)data.value=result;}catch(e){if(current===request)error.value=apiErrorKey(e);}finally{if(current===request)loading.value=false;}}
watch(()=>props.record.id,()=>{active.value='personal';load();},{immediate:true});
const linked=(key:string)=>(data.value[key]||[]).filter(r=>r.employeeId===props.record.code);
const contract=computed(()=>linked('contracts').find(r=>r.status==='active')||linked('contracts')[0]);
const tabs=computed(()=>[{key:'personal',label:'H? s?'},{key:'contracts',label:'H?p ??ng'},{key:'attendance',label:'Ch?m c?ng'},{key:'payroll',label:'L??ng & SC'}].filter(v=>v.key==='personal'||permission.can(v.key)));
</script>
<template>
 <div class="summary-card"><span class="table-link">{{ record.code }}</span><h3>{{ record.name }}</h3><p>{{ record.position }}</p><AppStatusBadge :label="t(record.status)" :severity="record.status==='active'?'success':'warning'" /></div>
 <nav class="drawer-tabs" aria-label="T?m t?t nh?n s?"><button v-for="tab in tabs" :key="tab.key" :class="{active:active===tab.key}" @click="active=tab.key">{{ tab.label }}</button></nav>
 <AppLoading v-if="loading" /><AppErrorState v-else-if="error" :error="error" @retry="load" />
 <template v-else><template v-if="active==='personal'"><div v-for="key in ['department','startDate','birthDate','phone','email','identityNumber','hotel']" :key="key" class="summary-row"><span>{{ t(key) }}</span><strong>{{ record[key] || '?' }}</strong></div></template>
 <template v-else-if="active==='contracts'"><template v-if="contract"><div v-for="key in ['code','type','startDate','endDate']" :key="key" class="summary-row"><span>{{ t(key) }}</span><strong>{{ key==='type'?t(String(contract[key])):contract[key] || '?' }}</strong></div><RouterLink :to="'/contracts/'+contract.id">M? h?p ??ng ?</RouterLink></template><p v-else class="muted">Ch?a c? h?p ??ng li?n k?t.</p></template>
 <template v-else-if="active==='attendance'"><div class="summary-row"><span>Ng?y ghi nh?n</span><strong>{{ linked('attendance').length }}</strong></div><div class="summary-row"><span>T?ng gi? c?ng</span><strong>{{ linked('attendance').reduce((s,r)=>s+Number(r.hours||0),0) }}h</strong></div><div class="summary-row"><span>?i tr?</span><strong>{{ linked('attendance').reduce((s,r)=>s+Number(r.lateMinutes||0),0) }} ph?t</strong></div></template>
 <template v-else><div v-for="key in ['salary','serviceCharge','allowance']" :key="key" class="summary-row"><span>{{ t(key) }}</span><strong>{{ currency(record[key]) }}</strong></div><div class="summary-row"><span>Ng?n h?ng</span><strong>{{ record.bank || '?' }}</strong></div></template>
 </template><footer class="dialog-footer"><RouterLink :to="{path:'/employees/'+record.id,query:{tab:active}}">M? to?n b? h? s? chi ti?t ?</RouterLink></footer>
</template>
