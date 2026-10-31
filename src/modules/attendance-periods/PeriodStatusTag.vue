<script setup lang="ts">
import { periodStatuses, type PeriodStatus } from './period.types';
defineProps<{ status: PeriodStatus }>();
</script>
<template>
  <span class="period-status" :class="status"
    >{{ periodStatuses[status] || status }} ({{ status }})</span
  >
</template>
<style scoped>
.period-status {
  display: inline-flex;
  padding: 5px 9px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}
.O {
  background: #dff6dd;
  color: #107c10;
}
.R {
  background: #fff4ce;
  color: #925700;
}
.C {
  background: #e4eeff;
  color: #0067c0;
}
.L {
  background: #ede8f3;
  color: #66517d;
}
</style>
