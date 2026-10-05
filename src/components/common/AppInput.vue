<script setup lang="ts">
import PrimeControl from 'primevue/inputtext';
</script>
<template>
  <PrimeControl v-bind="$attrs">
    <slot />
  </PrimeControl>
</template>
