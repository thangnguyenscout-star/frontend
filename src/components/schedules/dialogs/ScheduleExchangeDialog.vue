<script setup lang="ts">
import { getApiErrorMessage } from '@/utils/error-message';
import { ref, watch, onBeforeUnmount } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Editor from 'primevue/editor';
import AppButton from '@/components/common/AppButton.vue';
import { getScheduleExchangeAssignments } from '@/services/modules/schedule-exchange-assignment.service';
import { exchangeScheduleAssignments } from '@/services/modules/schedule-exchange.service';
import { useToast } from '@/composables/useToast';
import type { Assignment } from '@/types/schedule';
const props = defineProps<{
  assignment?: Assignment;
  departmentCode: string | null;
  employeeName: string;
}>();
const emit = defineEmits<{ close: []; confirmed: []; busy: [boolean] }>();
const saving = ref(false);
const toast = useToast();
watch(saving, (value) => emit('busy', value), { flush: 'sync' });
const date = ref(''),
  candidates = ref<Assignment[]>([]),
  loading = ref(false),
  error = ref('');
const target = ref<Assignment>();
const reason = ref('');
let sequence = 0;
const isDayOff = (a: Assignment) =>
  a.status === 'OFF' ||
  [a.shiftId, a.shiftSymbol].some((code) => /^(DO(?:0+)?|OFF)$/i.test(code?.trim() || ''));
const eligible = (a: Assignment) => a.leaveTypeId === null && !isDayOff(a);
function reset() {
  ++sequence;
  candidates.value = [];
  target.value = undefined;
  error.value = '';
  loading.value = false;
}
watch(
  () => props.assignment,
  (a) => {
    reset();
    date.value = a?.date || '';
    reason.value = '';
  },
);
watch(date, reset);
onBeforeUnmount(() => {
  ++sequence;
});
async function reload() {
  const source = props.assignment;
  if (!source || !date.value || !eligible(source)) return;
  const request = ++sequence;
  const selectedDate = date.value;
  candidates.value = [];
  target.value = undefined;
  error.value = '';
  loading.value = true;
  try {
    const result = await getScheduleExchangeAssignments(selectedDate, props.departmentCode);
    if (request === sequence)
      candidates.value = result.assignments
        .filter(
          (a) =>
            a.employeeId !== source.employeeId &&
            eligible(a) &&
            !(selectedDate === source.date && a.shiftId.trim() === source.shiftId.trim()),
        )
        // This single-day query is scoped by the API; use the requested calendar day.
        .map((a) => ({ ...a, date: selectedDate }));
  } catch (e) {
    if (request === sequence) error.value = getApiErrorMessage(e);
  } finally {
    if (request === sequence) loading.value = false;
  }
}
async function confirm() {
  if (
    saving.value ||
    !props.assignment ||
    !target.value ||
    !eligible(props.assignment) ||
    !eligible(target.value) ||
    (target.value.date === props.assignment.date &&
      target.value.shiftId.trim() === props.assignment.shiftId.trim())
  )
    return;
  saving.value = true;
  error.value = '';
  try {
    const result = await exchangeScheduleAssignments(props.assignment, target.value, reason.value);
    toast.success(result.message || 'Đổi ca thành công.');
    target.value = undefined;
    emit('close');
    emit('confirmed');
  } catch (e) {
    toast.error(e);
    error.value = getApiErrorMessage(e);
  } finally {
    saving.value = false;
  }
}
</script>
<template>
  <Dialog
    :visible="!!assignment && !target"
    modal
    header="Chọn nhân viên đổi ca"
    :style="{ width: '900px', maxWidth: '95vw' }"
    @update:visible="!$event && emit('close')"
  >
    <div v-if="assignment" class="exchange-form">
      <section class="employee-summary" aria-label="Ca làm việc hiện tại">
        <span class="section-label">Ca làm việc hiện tại</span>
        <strong
          >{{ employeeName }} <span class="employee-code">{{ assignment.employeeId }}</span></strong
        >
        <div class="shift-details">
          <span><i class="pi pi-calendar" aria-hidden="true" />{{ assignment.date }}</span>
          <span class="shift-name">{{
            assignment.shiftName || assignment.shiftSymbol || assignment.shiftId
          }}</span>
          <span
            ><i class="pi pi-clock" aria-hidden="true" />{{ assignment.startTime }}–{{
              assignment.endTime
            }}{{ assignment.crossDay ? ' (+1 ngày)' : '' }}</span
          >
        </div>
      </section>
      <p v-if="!eligible(assignment)" class="error" role="alert">
        Chỉ ca làm việc không có mã nghỉ phép mới được đổi ca. Ca nghỉ DO không thể đổi ca.
      </p>
      <div class="date-actions">
        <label class="date-field" for="exchange-date"
          >Chọn ngày
          <InputText id="exchange-date" v-model="date" type="date" />
        </label>
        <AppButton
          type="button"
          label="Tải lại danh sách"
          icon="pi pi-refresh"
          outlined
          :loading="loading"
          :disabled="loading || !date || !eligible(assignment)"
          @click="reload"
        />
      </div>
      <section class="reason-field" aria-labelledby="exchange-reason-label">
        <label id="exchange-reason-label">Lý do đổi ca</label>
        <Editor v-model="reason" editor-style="height: 140px" placeholder="Nhập lý do đổi ca…">
          <template #toolbar>
            <span class="ql-formats">
              <button class="ql-bold" type="button" aria-label="In đậm" title="In đậm"></button>
              <button
                class="ql-italic"
                type="button"
                aria-label="In nghiêng"
                title="In nghiêng"
              ></button>
              <button
                class="ql-underline"
                type="button"
                aria-label="Gạch chân"
                title="Gạch chân"
              ></button>
            </span>
            <span class="ql-formats">
              <button
                class="ql-list"
                value="ordered"
                type="button"
                aria-label="Danh sách đánh số"
                title="Danh sách đánh số"
              ></button>
              <button
                class="ql-list"
                value="bullet"
                type="button"
                aria-label="Danh sách dấu chấm"
                title="Danh sách dấu chấm"
              ></button>
              <button
                class="ql-clean"
                type="button"
                aria-label="Xóa định dạng"
                title="Xóa định dạng"
              ></button>
            </span>
          </template>
        </Editor>
      </section>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <section class="candidate-list" aria-label="Nhân viên có thể đổi ca">
        <div class="list-heading">
          <strong>Nhân viên có thể đổi ca</strong>
          <span class="hint">{{ candidates.length }} nhân viên</span>
        </div>
        <div v-if="loading" class="empty-state" role="status">
          <i class="pi pi-spin pi-spinner" aria-hidden="true" />Đang tải danh sách nhân viên…
        </div>
        <div v-else-if="!candidates.length" class="empty-state">
          <i class="pi pi-users" aria-hidden="true" />
          <p>Chưa có nhân viên phù hợp.</p>
          <span class="hint">Chọn ngày rồi nhấn Tải lại danh sách.</span>
        </div>
        <div v-else class="candidate-scroll">
          <table class="candidate-table" aria-label="Danh sách ca làm việc có thể đổi">
            <thead>
              <tr>
                <th scope="col" class="selection-column">Chọn</th>
                <th scope="col">Mã nhân viên</th>
                <th scope="col">Họ tên</th>
                <th scope="col">Ngày làm việc</th>
                <th scope="col">Ca làm việc</th>
                <th scope="col">Giờ làm việc</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in candidates" :key="a.id" class="candidate">
                <td class="selection-column">
                  <input
                    :id="'exchange-candidate-' + a.id"
                    type="radio"
                    name="exchange-employee"
                    :value="a.id"
                    :aria-label="'Chọn ' + (a.employeeName || a.employeeId) + ' · ' + a.date"
                    @change="target = a"
                  />
                </td>
                <td>{{ a.employeeId }}</td>
                <td>
                  <label :for="'exchange-candidate-' + a.id">{{
                    a.employeeName || a.employeeId
                  }}</label>
                </td>
                <td class="date-column">{{ a.date.split('-').reverse().join('/') }}</td>
                <td>{{ a.shiftName || a.shiftSymbol || a.shiftId }}</td>
                <td class="time-column">
                  {{ a.startTime || '—' }}–{{ a.endTime || '—'
                  }}{{ a.crossDay ? ' (+1 ngày)' : '' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <p class="hint">Chọn nhân viên để xem thông tin xác nhận chuyển ca.</p>
      <footer class="dialog-footer">
        <AppButton type="button" label="Hủy" severity="secondary" outlined @click="emit('close')" />
      </footer>
    </div>
  </Dialog>
  <Dialog
    :visible="!!target"
    modal
    header="Xác nhận chuyển ca"
    :closable="!saving"
    :close-on-escape="!saving"
    :style="{ width: '560px', maxWidth: '95vw' }"
    @update:visible="!saving && !$event && (target = undefined)"
  >
    <div v-if="assignment && target" class="exchange-form">
      <p>Bạn có xác nhận chuyển ca giữa hai nhân viên sau không?</p>
      <div class="confirmation-pair">
        <section class="employee-summary">
          <span class="section-label">Ca hiện tại</span>
          <strong
            >{{ employeeName }}
            <span class="employee-code">{{ assignment.employeeId }}</span></strong
          >
          <span>{{ assignment.date }} · {{ assignment.shiftName || assignment.shiftId }}</span>
          <span class="hint"
            >{{ assignment.startTime }}–{{ assignment.endTime
            }}{{ assignment.crossDay ? ' (+1 ngày)' : '' }}</span
          >
        </section>
        <i class="pi pi-arrow-right-arrow-left exchange-icon" aria-hidden="true" />
        <section class="employee-summary">
          <span class="section-label">Ca được chọn</span>
          <strong
            >{{ target.employeeName || target.employeeId }}
            <span class="employee-code">{{ target.employeeId }}</span></strong
          >
          <span>{{ target.date }} · {{ target.shiftName || target.shiftId }}</span>
          <span class="hint"
            >{{ target.startTime }}–{{ target.endTime
            }}{{ target.crossDay ? ' (+1 ngày)' : '' }}</span
          >
        </section>
      </div>
      <section class="reason-field reason-preview" aria-label="Lý do đổi ca">
        <strong>Lý do đổi ca</strong>
        <Editor v-if="reason" :model-value="reason" readonly editor-style="min-height: 80px">
          <template #toolbar><span class="hint">Nội dung lý do đã nhập</span></template>
        </Editor>
        <p v-else class="hint">Chưa nhập lý do đổi ca.</p>
      </section>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <footer class="dialog-footer">
        <AppButton
          type="button"
          label="Quay lại"
          severity="secondary"
          outlined
          :disabled="saving"
          @click="target = undefined"
        />
        <AppButton
          type="button"
          label="OK"
          icon="pi pi-check"
          :loading="saving"
          :disabled="saving"
          @click="confirm"
        />
      </footer>
    </div>
  </Dialog>
</template>
<style scoped>
.reason-field {
  display: grid;
  gap: 7px;
  min-width: 0;
  font-size: 13px;
}
.reason-field :deep(.p-editor) {
  width: 100%;
}
.reason-preview :deep(.p-editor-toolbar) {
  display: none;
}
.reason-preview :deep(.ql-container) {
  border-top: 1px solid var(--line);
}
.exchange-form {
  display: grid;
  gap: 16px;
}
.exchange-form p {
  margin: 0;
}
.employee-summary {
  display: grid;
  gap: 8px;
  min-width: 0;
  padding: 12px 14px;
  background: #f8fafc;
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow-wrap: anywhere;
}
.section-label {
  color: var(--muted);
  font-size: 12px;
}
.employee-code {
  margin-left: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 400;
}
.shift-details {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 16px;
  font-size: 12px;
  color: #475569;
}
.shift-details > span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.shift-name {
  color: var(--accent);
  font-weight: 600;
}
.date-actions {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}
.date-field {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
  font-size: 13px;
}
.date-field :deep(.p-inputtext) {
  width: 100%;
}
.candidate-list {
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
}
.list-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  background: #f8fafc;
  border-bottom: 1px solid var(--line);
}
.candidate-scroll {
  max-height: 280px;
  overflow: auto;
}
.candidate-table {
  width: 100%;
  min-width: 720px;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
  color: #334155;
}
.candidate-table th,
.candidate-table td {
  padding: 10px 12px;
  text-align: left;
  border-right: 1px solid #d1d5db;
  border-bottom: 1px solid #d1d5db;
}
.candidate-table th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #e2efda;
  color: #375623;
  font-weight: 600;
  white-space: nowrap;
}
.candidate-table th:last-child,
.candidate-table td:last-child {
  border-right: 0;
}
.candidate:last-child td {
  border-bottom: 0;
}
.candidate:nth-child(even) {
  background: #f8fafc;
}
.candidate:hover,
.candidate:focus-within {
  background: #eff6ff;
}
.candidate-table .selection-column {
  width: 56px;
  text-align: center;
}
.candidate-table .date-column,
.candidate-table .time-column {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.candidate input {
  margin: 0;
  accent-color: var(--accent);
  width: 16px;
  height: 16px;
  cursor: pointer;
}
.candidate label {
  display: block;
  cursor: pointer;
  font-weight: 600;
}
.hint {
  color: var(--muted);
  font-size: 12px;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 28px 16px;
  color: var(--muted);
  text-align: center;
}
.empty-state > i {
  font-size: 22px;
}
.confirmation-pair {
  display: grid;
  gap: 10px;
}
.exchange-icon {
  color: var(--accent);
  justify-self: center;
}
.error {
  color: #b42318;
}
.dialog-footer {
  margin-top: 0;
}
@media (max-width: 480px) {
  .date-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .list-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
