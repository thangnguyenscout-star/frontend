<script setup lang="ts">
interface TabItem {
  key: string;
  label: string;
}

defineProps<{
  items: TabItem[];
  activeKey: string;
}>();
</script>

<template>
  <nav class="tabs" aria-label="Xếp ca">
    <RouterLink
      v-for="item in items"
      :key="item.key"
      :to="item.key === 'calendar' ? '/schedules' : '/schedules/' + item.key"
      :class="{ active: activeKey === item.key }"
    >
      {{ item.label }}
    </RouterLink>
  </nav>
</template>
