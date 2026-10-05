<script setup lang="ts">
import PrimeControl from 'primevue/dialog';
</script>
<template>
  <PrimeControl v-bind="$attrs">
    <slot />
  </PrimeControl>
</template>
