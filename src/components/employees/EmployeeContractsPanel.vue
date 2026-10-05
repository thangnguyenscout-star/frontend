<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppInfoSection from '@/components/common/AppInfoSection.vue';
import AppStatusBadge from '@/components/common/AppStatusBadge.vue';
import ContractTimeline from '@/components/contracts/ContractTimeline.vue';
import { currency } from '@/utils/currency';
import type { HrRecord } from '@/types/common';
defineProps<{records:HrRecord[];employee:HrRecord}>();
const {t}=useI18n();
</script>
<template>
 <section v-if="!records.length" class="panel empty-state"><i class="pi pi-file" /><h3>Ch?a c? h?p ??ng li?n k?t</h3><RouterLink to="/contracts">M? danh s?ch h?p ??ng ?</RouterLink></section>
 <template v-for="record in records.filter(r=>r.status==='active').slice(0,1)" :key="record.id"><section class="profile-panel"><div class="panel-top" style="padding:0 0 16px"><div><h2>H?p ??ng lao ??ng ? {{ t(String(record.type)) }}</h2><RouterLink :to="'/contracts/'+record.id">{{ record.code }}</RouterLink></div><AppStatusBadge :label="t(record.status)" severity="success" /></div><AppInfoSection title="Th?ng tin k? k?t & V? tr? c?ng t?c" :record="{...employee,...record}" :fields="['name','department','position','hotel','startDate','endDate','shiftPattern','bank','bankAccount']" /><div class="compensation-cards" style="margin-top:20px"><div><span>L??ng c?n b?n ??ng BHXH</span><strong>{{ currency(record.salary) }}</strong></div><div><span>T?ng thu nh?p h?p ??ng</span><strong>{{ currency(record.income) }}</strong></div></div><div class="summary-row"><span>H? s? Service Charge</span><strong>{{ employee.serviceChargeRate || '?' }} ?i?m</strong></div><footer class="dialog-footer"><RouterLink :to="'/contracts/'+record.id">Ph? l?c, ph? c?p &amp; gia h?n h?p ??ng ?</RouterLink></footer></section></template>
 <ContractTimeline :records="records" />
</template>
