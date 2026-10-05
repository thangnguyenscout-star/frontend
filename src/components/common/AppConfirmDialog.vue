<script setup lang="ts">
import PrimeControl from 'primevue/confirmdialog';
</script>
<template>
  <PrimeControl v-bind="$attrs">
    <slot />
  </PrimeControl>
</template>
