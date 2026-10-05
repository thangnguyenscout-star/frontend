<script setup lang="ts">
import PrimeControl from 'primevue/inputnumber';
</script>
<template>
  <PrimeControl v-bind="$attrs">
    <slot />
  </PrimeControl>
</template>
