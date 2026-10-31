<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import AppButton from '@/components/common/AppButton.vue';
import { createPeriod } from './period.service';
import { getApiErrorMessage } from '@/utils/error-message';
import { useToast } from '@/composables/useToast';
import { usePeriodPermissions } from './usePeriodPermissions';
const props = defineProps<{ visible: boolean }>();
const emit = defineEmits<{ close: []; created: [id: string]; busy: [value: boolean] }>();
const toast = useToast(),
  permissions = usePeriodPermissions();
const month = ref(
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(new Date())
    .slice(0, 7),
);
const form = reactive({ tuNgay: '', denNgay: '', ghiChu: '' });
const busy = ref(false),
  error = ref('');
function defaults() {
  if (!/^\d{4}-\d{2}$/.test(month.value)) return;
  const [y, m] = month.value.split('-').map(Number);
  form.tuNgay = month.value + '-01';
  form.denNgay =
    month.value + '-' + String(new Date(Date.UTC(y, m, 0)).getUTCDate()).padStart(2, '0');
}
watch(month, defaults, { immediate: true });
watch(
  () => props.visible,
  (value) => {
    if (value) {
      error.value = '';
      form.ghiChu = '';
      defaults();
    }
  },
);
async function submit() {
  if (busy.value || !permissions.canCreate.value) return;
  busy.value = true;
  emit('busy', true);
  error.value = '';
  try {
    const [nam, thang] = month.value.split('-').map(Number);
    const row = await createPeriod({ nam, thang, ...form });
    toast.success('Tạo kỳ chấm công thành công.');
    emit('created', String(row.id));
  } catch (e) {
    error.value = getApiErrorMessage(e);
  } finally {
    busy.value = false;
    emit('busy', false);
  }
}
</script>
<template>
  <Dialog
    :visible="visible"
    modal
    header="Tạo kỳ chấm công"
    :style="{ width: '520px', maxWidth: '95vw' }"
    :closable="!busy"
    :close-on-escape="!busy"
    @update:visible="!busy && emit('close')"
    ><form class="period-form" @submit.prevent="submit">
      <label
        >Tháng / Năm<input
          v-model="month"
          type="month"
          min="0001-01"
          max="9998-12"
          required
          :disabled="busy"
      /></label>
      <p>
        Mã kỳ: <strong>{{ month }}</strong> · Trạng thái ban đầu: Đang mở (O)
      </p>
      <div class="period-date-grid">
        <label>Từ ngày<input v-model="form.tuNgay" type="date" required :disabled="busy" /></label
        ><label
          >Đến ngày<input
            v-model="form.denNgay"
            type="date"
            :min="form.tuNgay"
            required
            :disabled="busy"
        /></label>
      </div>
      <label
        >Ghi chú<textarea v-model="form.ghiChu" rows="3" maxlength="500" :disabled="busy" /></label
      ><small>{{ form.ghiChu.length }}/500 ký tự</small>
      <p class="period-notice">
        Hệ thống sẽ kiểm tra/mở rộng partition khi tạo kỳ; có thể mất thời gian.
      </p>
      <p v-if="error" class="period-error" role="alert">{{ error }}</p>
      <footer>
        <AppButton
          label="Hủy"
          severity="secondary"
          outlined
          :disabled="busy"
          @click="emit('close')"
        /><AppButton
          label="Tạo kỳ"
          type="submit"
          :loading="busy"
          :disabled="busy || !permissions.canCreate.value"
        />
      </footer></form
  ></Dialog>
</template>
<style scoped src="./periods.css"></style>
