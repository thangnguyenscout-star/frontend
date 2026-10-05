<script setup lang="ts">
import { shifts } from '@/utils/shifts';
</script>
<template><div class="shift-legend" aria-label="Quy ??c m? ca"><strong>Quy ??c m? ca:</strong><span v-for="shift in shifts" :key="shift.code"><b :class="['shift-code',shift.code]">{{ shift.code }}</b>{{ shift.name }}<small v-if="shift.hours">{{ shift.time }}</small></span></div></template>
