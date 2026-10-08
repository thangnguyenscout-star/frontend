<script setup lang="ts">
import { scheduleTime } from '@/utils/schedule-time';
import { computed, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Drawer from 'primevue/drawer';
import type { Assignment } from '@/types/schedule';

interface HistoryEntry {
  assignmentId: string;
  date: string;
  action: string;
}
interface ScheduleConflict {
  row: Assignment;
  existing: Assignment;
  reason: string;
}

const detail = defineModel<Assignment | undefined>('detail');
const detailOpen = defineModel<boolean>('detailOpen', { required: true });
const historyOpen = defineModel<boolean>('historyOpen', { required: true });
const preview = defineModel<Assignment[]>('preview', { required: true });
const previewOpen = defineModel<boolean>('previewOpen', { required: true });
const props = defineProps<{
  history: HistoryEntry[];
  issues: ScheduleConflict[];
  error: string;
  busy: boolean;
  today: string;
  canEdit: boolean;
  name: (id: string) => string;
  employeeName: (id: string) => string;
  fmt: (date: string) => string;
  label: (assignment?: Assignment) => string;
  symbol: (assignment: Assignment) => string;
  pending: (assignment?: Assignment) => boolean;
  saveAssignments: () => void;
  editAssignment: () => void;
}>();
const emit = defineEmits<{
  closePreview: [];
}>();
const calendarMode = ref<'week' | 'month'>('week');
const calendarAnchor = ref(props.today);
const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
watch(previewOpen, (visible) => {
  if (!visible) return;
  const dates = preview.value.map((assignment) => assignment.date).sort();
  const first = dates[0] || props.today;
  const last = dates[dates.length - 1] || first;
  calendarAnchor.value = first;
  calendarMode.value = daysBetween(first, last) > 6 ? 'month' : 'week';
});
function daysBetween(first: string, last: string) {
  return Math.round(
    (new Date(`${last}T12:00:00`).getTime() - new Date(`${first}T12:00:00`).getTime()) / 86400000,
  );
}
const calendarDates = computed(() => {
  const first = new Date(calendarAnchor.value + 'T12:00:00');
  if (calendarMode.value === 'week') first.setDate(first.getDate() - ((first.getDay() + 6) % 7));
  else first.setDate(1);
  const count =
    calendarMode.value === 'week'
      ? 7
      : new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(first);
    date.setDate(date.getDate() + index);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  });
});
const employees = computed(() => {
  const ids = [...new Set(preview.value.map((assignment) => assignment.employeeId))];
  return ids
    .map((code) => ({ code, name: props.employeeName(code) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'vi'));
});
function assignmentsFor(employeeId: string, date: string) {
  return preview.value.filter(
    (assignment) => assignment.employeeId === employeeId && assignment.date === date,
  );
}
function movePeriod(amount: number) {
  const date = new Date(calendarAnchor.value + 'T12:00:00');
  if (calendarMode.value === 'month') {
    date.setDate(1);
    date.setMonth(date.getMonth() + amount);
  } else date.setDate(date.getDate() + amount * 7);
  calendarAnchor.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
</script>

<template>
  <Drawer
    v-model:visible="detailOpen"
    header="Chi tiết phân công"
    position="right"
    class="schedule-drawer"
  >
    <template v-if="detail">
      <h3>{{ name(detail.employeeId) }}</h3>
      <p>
        {{ fmt(detail.date) }} ·
        {{ detail.scheduleType === 'ADMINISTRATIVE' ? 'Hành chính' : 'Xoay ca' }}
      </p>
      <p>{{ label(detail) }}</p>
      <p>{{ detail.note || 'Chưa có ghi chú' }}</p>
      <p v-if="pending(detail)">↔ Có yêu cầu đổi ca chờ duyệt</p>
      <div class="actions">
        <button @click="historyOpen = !historyOpen">Lịch sử</button>
        <button v-if="canEdit" @click="editAssignment">Sửa phân công</button>
      </div>
      <ul v-if="historyOpen">
        <li
          v-for="(entry, index) in history.filter((item) => item.assignmentId === detail?.id)"
          :key="index"
        >
          {{ entry.action }} · {{ new Date(entry.date).toLocaleString('vi-VN') }}
        </li>
        <li v-if="!history.some((item) => item.assignmentId === detail?.id)">
          Chưa có lịch sử thay đổi.
        </li>
      </ul>
    </template>
  </Drawer>

  <Dialog
    v-model:visible="previewOpen"
    modal
    header="Xem trước phân công"
    :style="{ width: '1000px', maxWidth: '95vw' }"
  >
    <div class="schedule-dialog">
      <p>{{ preview.length }} phân công · {{ employees.length }} nhân viên</p>
      <div v-if="issues.length" class="error">
        <strong>⚠ {{ issues.length }} xung đột — không thể lưu</strong>
        <p v-for="(issue, index) in issues" :key="index">
          {{ name(issue.row.employeeId) }} · {{ fmt(issue.row.date) }}<br />
          Ca mới: {{ label(issue.row) }}<br />
          Đã có: {{ label(issue.existing) }} · {{ fmt(issue.existing.date) }}<br />
          {{ issue.reason }}
        </p>
      </div>
      <div class="preview-calendar-toolbar">
        <button
          type="button"
          :aria-label="calendarMode === 'week' ? 'Tuần trước' : 'Tháng trước'"
          @click="movePeriod(-1)"
        >
          ‹
        </button>
        <strong v-if="calendarDates.length">
          {{ fmt(calendarDates[0]) }} – {{ fmt(calendarDates[calendarDates.length - 1]) }}
        </strong>
        <button
          type="button"
          :aria-label="calendarMode === 'week' ? 'Tuần sau' : 'Tháng sau'"
          @click="movePeriod(1)"
        >
          ›
        </button>
        <div class="preview-calendar-mode">
          <button :class="{ active: calendarMode === 'week' }" @click="calendarMode = 'week'">
            Tuần
          </button>
          <button :class="{ active: calendarMode === 'month' }" @click="calendarMode = 'month'">
            Tháng
          </button>
        </div>
      </div>
      <div class="preview-calendar-scroll" :class="'mode-' + calendarMode">
        <table class="preview-calendar-table">
          <thead>
            <tr>
              <th class="preview-calendar-employee">Nhân viên</th>
              <th
                v-for="date in calendarDates"
                :key="date"
                :class="{
                  weekend: [0, 6].includes(new Date(date + 'T12:00:00').getDay()),
                  today: date === today,
                }"
              >
                {{ dayLabels[(new Date(date + 'T12:00:00').getDay() + 6) % 7] }}
                <small>{{ Number(date.slice(-2)) }}/{{ Number(date.slice(5, 7)) }}</small>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.code">
              <th class="preview-calendar-employee">
                <strong>{{ employee.name }}</strong
                ><small>{{ employee.code }}</small>
              </th>
              <td
                v-for="date in calendarDates"
                :key="date"
                :class="{ weekend: [0, 6].includes(new Date(date + 'T12:00:00').getDay()) }"
              >
                <template
                  v-for="assignment in assignmentsFor(employee.code, date)"
                  :key="assignment.id + assignment.shiftId"
                >
                  <strong>{{ assignment.status === 'OFF' ? 'Nghỉ' : symbol(assignment) }}</strong>
                  <small v-if="assignment.startTime && assignment.endTime"
                    >{{ scheduleTime(assignment.startTime) }}–{{ scheduleTime(assignment.endTime)
                    }}{{ assignment.crossDay ? ' (+1 ngày)' : '' }}</small
                  >
                </template>
                <span v-if="!assignmentsFor(employee.code, date).length">—</span>
              </td>
            </tr>
            <tr v-if="!employees.length">
              <td :colspan="calendarDates.length + 1" class="empty-state">
                Không có phân công trong khoảng này.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="error" class="error" role="alert" style="white-space: pre-line">{{ error }}</p>
      <div class="actions">
        <button :disabled="busy" @click="emit('closePreview')">Quay lại</button>
        <button
          class="primary"
          :disabled="busy || !!issues.length || !preview.length"
          @click="saveAssignments"
        >
          {{ busy ? 'Đang lưu…' : 'Lưu phân công' }}
        </button>
      </div>
    </div>
  </Dialog>
</template>
