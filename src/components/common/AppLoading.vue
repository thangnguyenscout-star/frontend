<script setup lang="ts">
import Skeleton from 'primevue/skeleton';
</script>
<template>
  <div
    class="loading-state"
    aria-busy="true"
  >
    <Skeleton
      v-for="n in 6"
      :key="n"
      height="2.5rem"
    />
  </div>
</template>
