<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { HrRecord } from '@/types/common';
defineProps<{ title:string; record:HrRecord; fields:string[]; labels?:Record<string,string> }>();
const {t,te}=useI18n();
</script>
<template><section class="profile-panel"><h2>{{ title }}</h2><dl class="detail-grid"><div v-for="key in fields" :key="key"><dt>{{ labels?.[key] || (te(key)?t(key):key) }}</dt><dd>{{ record[key] === undefined || record[key] === '' ? '?' : te(String(record[key])) ? t(String(record[key])) : record[key] }}</dd></div></dl><slot /></section></template>
