<script setup lang="ts">
import PrimeControl from 'primevue/select';
</script>
<template>
  <PrimeControl v-bind="$attrs">
    <slot />
  </PrimeControl>
</template>
