<script setup lang="ts">
withDefaults(defineProps<{ label: string; severity?: string }>(), { severity: 'secondary' });
</script>
<template>
  <span
    class="status-badge"
    :class="severity"
  ><span class="status-dot" />{{ label }}</span>
</template>
