<script setup lang="ts">
import { ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import AppButton from '@/components/common/AppButton.vue';
import { contractService } from '@/services/modules/contract.service';
import { contractApiError } from '@/utils/contract-api';
import { useContractPermission } from '@/composables/useContractPermission';
import { useToast } from '@/composables/useToast';
const props = defineProps<{ visible: boolean; contractId: string; currentStatus: string }>();
const emit = defineEmits<{ 'update:visible': [boolean]; changed: []; busy: [boolean] }>();
const hasPermission = useContractPermission();
const toast = useToast();
const target = ref(''),
  note = ref(''),
  error = ref('');
const changingStatus = ref(false);
watch(
  () => props.visible,
  (value) => {
    if (value) {
      target.value = '';
      note.value = '';
      error.value = '';
    }
  },
);
async function submit() {
  if (changingStatus.value || !hasPermission('HOPDONG_STATUS_UPDATE')) return;
  if (!target.value.trim() || target.value.trim() === props.currentStatus) {
    error.value = 'Vui lòng nhập mã trạng thái mới khác trạng thái hiện tại.';
    return;
  }
  changingStatus.value = true;
  emit('busy', true);
  error.value = '';
  try {
    const result = await contractService.changeStatus(props.contractId, target.value, note.value);
    if (!result.success) {
      error.value = result.message;
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    emit('update:visible', false);
    emit('changed');
  } catch (e) {
    error.value = contractApiError(e);
    toast.error(error.value);
  } finally {
    changingStatus.value = false;
    emit('busy', false);
  }
}
</script>
<template>
  <Dialog
    :visible="visible"
    modal
    header="Xác nhận chuyển trạng thái"
    :closable="!changingStatus"
    :close-on-escape="!changingStatus"
    :style="{ width: '480px', maxWidth: '95vw' }"
    @update:visible="!changingStatus && emit('update:visible', $event)"
  >
    <p>Trạng thái hiện tại: {{ currentStatus }}</p>
    <div class="fields">
      <label for="next-contract-status">Mã trạng thái mới</label>
      <InputText
        id="next-contract-status"
        v-model="target"
        :disabled="changingStatus"
      />
      <label for="status-note">Ghi chú</label>
      <Textarea
        id="status-note"
        v-model="note"
        :disabled="changingStatus"
      />
      <p
        v-if="error"
        role="alert"
      >
        {{ error }}
      </p>
    </div>
    <template #footer>
      <AppButton
        label="Hủy"
        severity="secondary"
        :disabled="changingStatus"
        @click="emit('update:visible', false)"
      />
      <AppButton
        label="Xác nhận"
        :loading="changingStatus"
        :disabled="changingStatus || !hasPermission('HOPDONG_STATUS_UPDATE')"
        @click="submit"
      />
    </template>
  </Dialog>
</template>
<style scoped>
.fields {
  display: grid;
  gap: 8px;
}
[role='alert'] {
  color: #b42318;
}
</style>
