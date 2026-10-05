<script setup lang="ts">
import AppKpiCard from '@/components/common/AppKpiCard.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { HrRecord } from '@/types/common';
const props = defineProps<{ rows: HrRecord[]; contract?: boolean; employee?: boolean }>();
const { t } = useI18n();
const soon = (days: number) =>
  props.rows.filter(
    (r) =>
      r.endDate &&
      new Date(String(r.endDate)).getTime() >= Date.now() &&
      new Date(String(r.endDate)).getTime() <= Date.now() + days * 86400000,
  ).length;
const stats = computed(() => [
  {
    label: props.employee ? 'employeeTotal' : 'total',
    value: props.rows.length,
    icon: 'pi-file',
    color: 'green',
  },
  {
    label: props.employee ? 'employeeActive' : 'activeCount',
    value: props.rows.filter((r) => r.status === 'active').length,
    icon: 'pi-check-circle',
    color: 'green',
  },
  ...(props.contract
    ? [
        { label: 'expiring30', value: soon(30), icon: 'pi-clock', color: 'amber' },
        { label: 'expiring7', value: soon(7), icon: 'pi-exclamation-circle', color: 'orange' },
        {
          label: 'expiredCount',
          value: props.rows.filter((r) => r.status === 'expired').length,
          icon: 'pi-calendar-times',
          color: 'red',
        },
        {
          label: 'terminatedCount',
          value: props.rows.filter((r) => r.status === 'terminated').length,
          icon: 'pi-folder',
          color: 'red',
        },
      ]
    : props.employee
      ? [
          {
            label: 'employeeProbation',
            value: props.rows.filter((r) => r.type === 'probation').length,
            icon: 'pi-hourglass',
            color: 'amber',
          },
          {
            label: 'employeeInactive',
            value: props.rows.filter((r) => ['expired', 'terminated'].includes(r.status)).length,
            icon: 'pi-pause',
            color: 'red',
          },
        ]
      : [
          {
            label: 'pending',
            value: props.rows.filter((r) => r.status === 'pending').length,
            icon: 'pi-clock',
            color: 'amber',
          },
        ]),
]);
</script>
<template>
  <div
    class="kpi-grid"
    :class="{ five: contract, four: employee }"
  >
    <AppKpiCard v-if="contract || employee" v-for="stat in stats" :key="stat.label" :label="t(stat.label)" :value="stat.value" :icon="stat.icon" :tone="stat.color === 'green' ? 'green' : stat.color === 'red' ? 'red' : 'amber'" />
    <article
      v-else
      v-for="stat in stats"
      :key="stat.label"
      class="kpi-card"
    >
      <div>
        <span>{{ t(stat.label) }}</span><strong>{{ stat.value.toLocaleString() }}</strong>
      </div>
      <i :class="['pi', stat.icon, stat.color]" />
    </article>
  </div>
</template>
