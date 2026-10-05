<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
<template>
  <div class="empty-state">
    <i class="pi pi-lock" />
    <h1>403</h1>
    <p>{{ t('forbidden') }}</p>
    <RouterLink to="/dashboard">
      {{ t('dashboard') }}
    </RouterLink>
  </div>
</template>
