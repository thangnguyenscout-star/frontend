<script setup lang="ts">
import PrimeControl from 'primevue/toast';
</script>
<template>
  <PrimeControl v-bind="$attrs">
    <slot />
  </PrimeControl>
</template>
