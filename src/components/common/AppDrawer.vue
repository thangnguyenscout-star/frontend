<script setup lang="ts">
import PrimeControl from 'primevue/drawer';
</script>
<template>
  <PrimeControl v-bind="$attrs">
    <slot />
  </PrimeControl>
</template>
