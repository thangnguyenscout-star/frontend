<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppButton from './AppButton.vue';
const { t } = useI18n();
defineProps<{ error: string }>();
defineEmits(['retry']);
</script>
<template>
  <div
    class="empty-state error-state"
    role="alert"
  >
    <i class="pi pi-exclamation-circle" />
    <h3>{{ t('error') }}</h3>
    <p>{{ t(error) }}</p>
    <AppButton
      :label="t('retry')"
      icon="pi pi-refresh"
      @click="$emit('retry')"
    />
  </div>
</template>
