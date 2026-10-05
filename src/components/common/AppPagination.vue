<script setup lang="ts">
import PrimeControl from 'primevue/paginator';
</script>
<template>
  <PrimeControl v-bind="$attrs">
    <slot />
  </PrimeControl>
</template>
