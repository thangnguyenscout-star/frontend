<script setup lang="ts">
import ContractCreateView from '@/views/contracts/ContractCreateView.vue';
import type { HrRecord } from '@/types/common';
defineProps<{ record: HrRecord }>();
const emit = defineEmits<{ changed: []; busy: [boolean] }>();
</script>
<template>
  <ContractCreateView
    mode="READ"
    :contract-id="record.id"
    @changed="emit('changed')"
    @busy="emit('busy', $event)"
  />
</template>
