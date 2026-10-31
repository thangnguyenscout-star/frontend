<script setup lang="ts">
import { useToast } from '@/composables/useToast';
const toast = useToast();
import { getApiErrorMessage } from '@/utils/error-message';
import { computed, ref } from 'vue';
import Dialog from 'primevue/dialog';
import AppButton from '@/components/common/AppButton.vue';
import '../schedule-dialog.css';
import {
  canCreateRotatingWeek,
  createRotatingSchedule,
  type RotatingScheduleResult,
} from '@/services/modules/schedule-rotating.service';
const props = defineProps<{
  eligible: boolean;
  departmentCode: string;
  anchor: string;
  week: boolean;
  disabled: boolean;
}>();
const emit = defineEmits<{ saved: []; busy: [boolean] }>();
const saving = ref(false);
const visible = ref(false);
const result = ref<RotatingScheduleResult>();
const allowed = computed(() => props.week && canCreateRotatingWeek(props.anchor));
async function create() {
  if (
    !props.eligible ||
    props.disabled ||
    saving.value ||
    !props.departmentCode ||
    !props.week ||
    !canCreateRotatingWeek(props.anchor)
  )
    return;
  saving.value = true;
  emit('busy', true);
  try {
    result.value = await createRotatingSchedule(props.departmentCode, props.anchor);
    if (result.value.isResults) emit('saved');
    else {
      result.value.message = getApiErrorMessage(result.value);
      toast.error(result.value.message);
    }
  } catch (e) {
    toast.error(e);
    result.value = { isResults: false, message: getApiErrorMessage(e) };
  } finally {
    visible.value = true;
    saving.value = false;
    emit('busy', false);
  }
}
</script>
<template>
  <div v-if="eligible" class="auto-schedule">
    <button
      type="button"
      class="auto-schedule-button"
      :disabled="disabled || saving || !allowed || !departmentCode"
      @click="create"
    >
      {{ saving ? 'Đang tạo lịch…' : 'Tự động tạo lịch' }}
    </button>
    <p v-if="!week">Chọn chế độ tuần để tự động tạo lịch.</p>
    <p v-else-if="!allowed">Chỉ được tạo lịch tuần tương lai hoặc tuần hiện tại vào thứ Hai.</p>
  </div>
  <Dialog
    class="schedule-dialog"
    v-model:visible="visible"
    modal
    header="Kết quả xếp ca"
    :style="{ width: '520px', maxWidth: '95vw' }"
  >
    <div v-if="result" class="schedule-dialog-body">
      <p
        class="schedule-dialog-message"
        :class="result.isResults ? 'success' : 'error'"
        role="status"
      >
        {{
          result.message ||
          (result.isResults ? 'Tạo lịch thành công.' : 'Tạo lịch không thành công.')
        }}
      </p>
      <dl v-if="result.data" class="schedule-dialog-details">
        <dt>Bộ phận</dt>
        <dd>{{ result.data.maBoPhan }}</dd>
        <dt>Từ ngày</dt>
        <dd>{{ result.data.tuNgay }}</dd>
        <dt>Đến ngày</dt>
        <dd>{{ result.data.denNgay }}</dd>
        <dt>Số phân công</dt>
        <dd>{{ result.data.soPhanCong }}</dd>
        <dt>Số ca làm việc</dt>
        <dd>{{ result.data.soCaLamViec }}</dd>
        <dt>Số ngày DO000</dt>
        <dd>{{ result.data.soNgayDO000 }}</dd>
        <dt>Đủ định biên</dt>
        <dd>{{ result.data.duDinhBien ? 'Có' : 'Không' }}</dd>
        <dt>Tất cả nhân viên đủ sáu ngày</dt>
        <dd>{{ result.data.tatCaNhanVienDuSauNgay ? 'Có' : 'Không' }}</dd>
      </dl>
      <p v-if="result.data?.canhBao" class="schedule-dialog-message warning">
        {{
          Array.isArray(result.data.canhBao) ? result.data.canhBao.join('\n') : result.data.canhBao
        }}
      </p>
    </div>
    <template #footer
      ><AppButton type="button" label="Đóng" severity="secondary" outlined @click="visible = false"
    /></template>
  </Dialog>
</template>
