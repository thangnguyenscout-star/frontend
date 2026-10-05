<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppStatusBadge from '@/components/common/AppStatusBadge.vue';
import type { HrRecord } from '@/types/common';
defineProps<{records:HrRecord[]}>();
const {t}=useI18n();
</script>
<template><section class="profile-panel"><h2>L?ch s? h?p ??ng lao ??ng t?i Grand Hotel</h2><p v-if="!records.length" class="muted">Ch?a c? l?ch s? h?p ??ng.</p><article v-for="record in [...records].sort((a,b)=>String(b.startDate).localeCompare(String(a.startDate)))" :key="record.id" class="history-row"><i class="pi pi-file-edit" /><div><RouterLink :to="'/contracts/'+record.id"><strong>{{ record.code }} ? {{ t(String(record.type)) }}</strong></RouterLink><p>{{ record.startDate }} ? {{ record.endDate || 'Kh?ng x?c ??nh th?i h?n' }}</p><p>{{ record.position }} ? {{ record.department }}</p><AppStatusBadge :label="t(record.status)" :severity="record.status==='active'?'success':'secondary'" /></div></article></section></template>
