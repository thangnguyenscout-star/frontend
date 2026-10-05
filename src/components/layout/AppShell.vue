<script setup lang="ts">
import AppSidebar from './AppSidebar.vue';
import AppHeader from './AppHeader.vue';
import { useAppStore } from '@/stores/app.store';
const app = useAppStore();
</script>
<template>
  <div
    class="app-shell"
    :class="{ 'sidebar-collapsed': app.collapsed }"
  >
    <AppSidebar />
    <div class="main-area">
      <AppHeader />
      <main><RouterView :key="$route.path" /></main>
    </div>
  </div>
</template>
