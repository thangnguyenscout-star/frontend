<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppButton from './AppButton.vue';
const { t } = useI18n();
defineProps<{ title?: string; description?: string; icon?: string }>();
defineEmits(['reset']);
</script>
<template>
  <div class="empty-state">
    <i :class="['pi', icon || 'pi-inbox']" />
    <h3>{{ title || t('empty') }}</h3>
    <p>{{ description || t('emptyHint') }}</p>
    <AppButton
      :label="t('reset')"
      severity="secondary"
      @click="$emit('reset')"
    />
  </div>
</template>
