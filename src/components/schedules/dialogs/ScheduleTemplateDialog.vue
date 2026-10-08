<script setup lang="ts">
import Dialog from 'primevue/dialog';
import type { ScheduleTemplate, Shift } from '@/types/schedule';

const open = defineModel<boolean>('open', { required: true });
const templateRead = defineModel<boolean>('read', { required: true });
const template = defineModel<ScheduleTemplate>('template', { required: true });
defineProps<{
  departments: string[];
  shifts: Shift[];
  busy: boolean;
  error: string;
}>();
const emit = defineEmits<{
  save: [];
}>();
const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
</script>

<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="templateRead ? 'Chi tiết mẫu lịch' : 'Cấu hình mẫu lịch'"
    :style="{ width: '800px', maxWidth: '95vw' }"
  >
    <div class="schedule-dialog">
      <fieldset :disabled="templateRead || busy">
        <div class="form-grid">
          <label>Tên mẫu *<input v-model="template.name" /></label>
          <label>
            Loại lịch
            <select
              v-model="template.scheduleType"
              @change="template.days = Array(template.days.length).fill('OFF')"
            >
              <option value="ADMINISTRATIVE">Hành chính</option>
              <option value="ROTATING">Xoay ca</option>
            </select>
          </label>
          <label>
            Bộ phận
            <select v-model="template.department">
              <option value="">Tất cả</option>
              <option v-for="department in departments" :key="department">{{ department }}</option>
            </select>
          </label>
          <label>
            Loại mẫu
            <select v-model="template.kind" @change="template.days = Array(7).fill('OFF')">
              <option value="WEEK">Mẫu tuần</option>
              <option value="CYCLE">Chu kỳ xoay</option>
            </select>
          </label>
        </div>
        <div class="pattern">
          <label v-for="(_, index) in template.days" :key="index">
            {{ template.kind === 'WEEK' ? dayLabels[index] : 'Ngày ' + (index + 1) }}
            <select v-model="template.days[index]">
              <option value="OFF">Nghỉ</option>
              <option
                v-for="shift in shifts.filter(
                  (item) => item.active && item.scheduleType === template.scheduleType,
                )"
                :key="shift.id"
                :value="shift.id"
              >
                {{ shift.name }}
              </option>
            </select>
          </label>
          <button v-if="template.kind === 'CYCLE'" @click="template.days.push('OFF')">
            + Thêm ngày
          </button>
          <button
            v-if="template.kind === 'CYCLE' && template.days.length > 1"
            @click="template.days.pop()"
          >
            Bỏ ngày cuối
          </button>
        </div>
        <label>Ghi chú<textarea v-model="template.note" /></label>
      </fieldset>
      <p v-if="error" class="error">{{ error }}</p>
      <button v-if="!templateRead" class="primary" :disabled="busy" @click="emit('save')">
        {{ busy ? 'Đang lưu…' : 'Lưu mẫu' }}
      </button>
    </div>
  </Dialog>
</template>
