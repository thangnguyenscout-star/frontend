<script setup lang="ts">
import { getApiErrorMessage } from '@/utils/error-message';
import { computed, ref, watch, onBeforeUnmount } from 'vue';
import ScheduleExchangeDialog from './dialogs/ScheduleExchangeDialog.vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import { getScheduleAssignments } from '@/services/modules/schedule-assignment.service';
import { scheduleRange } from '@/utils/schedule-range';
import { systemToday, isPastScheduleDate } from '@/utils/schedule-date';
import type { Assignment } from '@/types/schedule';
import type { ScheduleDepartment } from '@/services/modules/schedule-shift.service';
const props = defineProps<{
  employees: { code: string; name: string; department?: unknown; position?: unknown }[];
  departments: ScheduleDepartment[];
  canEdit: boolean;
}>();
const anchor = ref(systemToday()),
  view = ref<'week' | 'month'>('month');
const department = ref(''),
  search = ref('');
const assignments = ref<Assignment[]>([]),
  loading = ref(false),
  saving = ref(false),
  error = ref('');
const range = computed(() => scheduleRange(anchor.value || systemToday(), view.value));
const dates = computed(() => {
  const result: string[] = [];
  const d = new Date(range.value.from + 'T12:00:00Z');
  while (d.toISOString().slice(0, 10) <= range.value.to) {
    result.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return result;
});
const roster = computed(() =>
  props.employees.filter(
    (e) =>
      (!department.value || e.department === department.value) &&
      (e.code + ' ' + e.name).toLocaleLowerCase().includes(search.value.toLocaleLowerCase()),
  ),
);
onBeforeRouteLeave(() => !saving.value);
onBeforeRouteUpdate(() => !saving.value);
let sequence = 0;
async function load() {
  const request = ++sequence;
  loading.value = true;
  error.value = '';
  assignments.value = [];
  try {
    const result = await getScheduleAssignments(range.value.from, range.value.to);
    if (request === sequence) assignments.value = result.assignments;
  } catch (e) {
    if (request === sequence) error.value = getApiErrorMessage(e);
  } finally {
    if (request === sequence) loading.value = false;
  }
}
watch([range, department], load, { immediate: true });
function move(n: number) {
  const d = new Date(anchor.value + 'T12:00:00Z');
  if (view.value === 'month') {
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() + n);
  } else d.setUTCDate(d.getUTCDate() + n * 7);
  anchor.value = d.toISOString().slice(0, 10);
}
const cell = (id: string, date: string) =>
  assignments.value.filter((a) => a.employeeId === id && a.date === date);
const employeeName = (id: string) => props.employees.find((e) => e.code === id)?.name || id;
const source = ref<Assignment>();
onBeforeUnmount(() => {
  ++sequence;
});
watch([range, department, search], () => {
  source.value = undefined;
});
</script>
<template>
  <section class="action-calendar" :class="{ 'month-view': view === 'month' }">
    <header class="calendar-header">
      <div class="calendar-heading">
        <span class="calendar-heading-icon" aria-hidden="true"
          ><i class="pi pi-arrow-right-arrow-left"
        /></span>
        <div>
          <h2>Đổi ca</h2>
          <span class="calendar-subtitle"
            >{{ roster.length }} nhân viên ·
            {{ view === 'month' ? 'Lịch tháng' : 'Lịch tuần' }}</span
          >
        </div>
      </div>
      <RouterLink class="calendar-back" to="/schedules/assign"
        ><i class="pi pi-arrow-left" aria-hidden="true" />Quay về lịch phân công</RouterLink
      >
    </header>
    <div class="calendar-controls">
      <div class="control-field">
        <span class="control-label">Thời gian</span>
        <div class="date-navigation">
          <button
            type="button"
            class="calendar-nav-button"
            :disabled="saving"
            aria-label="Xem kỳ trước"
            @click="move(-1)"
          >
            <i class="pi pi-chevron-left" aria-hidden="true" />
          </button>
          <input
            v-model="anchor"
            class="control-input calendar-date"
            type="date"
            aria-label="Ngày xem lịch"
            :disabled="saving"
          />
          <button
            type="button"
            class="calendar-nav-button"
            :disabled="saving"
            aria-label="Xem kỳ sau"
            @click="move(1)"
          >
            <i class="pi pi-chevron-right" aria-hidden="true" />
          </button>
        </div>
      </div>
      <label class="control-field">
        <span class="control-label">Chế độ xem</span>
        <select v-model="view" class="control-input" :disabled="saving">
          <option value="month">Lịch tháng</option>
          <option value="week">Lịch tuần</option>
        </select>
      </label>
      <label class="control-field department-control">
        <span class="control-label">Bộ phận</span>
        <select v-model="department" class="control-input" :disabled="saving">
          <option value="">Tất cả bộ phận</option>
          <option v-for="d in departments" :key="d.code" :value="d.name">{{ d.name }}</option>
        </select>
      </label>
      <label class="control-field search-control">
        <span class="control-label">Nhân viên</span>
        <span class="search-input-wrap"
          ><i class="pi pi-search" aria-hidden="true" /><input
            v-model="search"
            class="control-input"
            placeholder="Tìm mã hoặc họ tên"
            :disabled="saving"
        /></span>
      </label>
      <button type="button" class="calendar-reload" :disabled="loading || saving" @click="load">
        <i :class="loading ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'" aria-hidden="true" />Tải lại
      </button>
    </div>
    <p class="calendar-hint">Bấm vào ca làm việc để chọn nhân viên đổi ca.</p>
    <p v-if="!canEdit">Bạn không có quyền điều chỉnh lịch.</p>
    <p v-if="loading" role="status">Đang tải lịch…</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <div ref="scrollArea" class="calendar-scroll">
      <table>
        <thead>
          <tr>
            <th class="number">STT</th>
            <th class="person">Họ và tên / Bộ phận / Chức vụ</th>
            <th v-for="date in dates" :key="date" class="date-column">
              {{ date.slice(8) }}/{{ date.slice(5, 7)
              }}<small>{{
                new Date(date + 'T12:00:00').toLocaleDateString('vi-VN', { weekday: 'short' })
              }}</small>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(e, i) in roster" :key="e.code">
            <td class="number">{{ i + 1 }}</td>
            <th class="person">
              {{ e.name }}<small>{{ e.code }}</small
              ><small>{{ e.department }} / {{ e.position || '—' }}</small>
            </th>
            <td
              v-for="date in dates"
              :key="date"
              class="date-column"
              :data-employee-id="e.code"
              :data-date="date"
              :class="{ past: isPastScheduleDate(date) }"
            >
              <button
                v-for="a in cell(e.code, date)"
                :key="a.id"
                class="sticker"
                type="button"
                :data-assignment-id="a.id"
                :disabled="!canEdit || saving || loading"
                :title="'Bấm để chọn nhân viên đổi ca'"
                @click="source = a"
              >
                <strong>{{ a.shiftSymbol || a.shiftId }}</strong
                ><small>{{ a.startTime }}–{{ a.endTime }}{{ a.crossDay ? ' (+1)' : '' }}</small>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!roster.length">Không tìm thấy nhân viên.</p>
    </div>
    <ScheduleExchangeDialog
      @busy="saving = $event"
      :assignment="source"
      :department-code="
        departments.find((d) => d.name === department)?.code || source?.departmentCode || null
      "
      :employee-name="source ? employeeName(source.employeeId) : ''"
      @close="source = undefined"
      @confirmed="load"
    />
  </section>
</template>
<style scoped>
.action-calendar {
  min-width: 0;
  padding: 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}
.action-calendar .calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
}
.calendar-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.calendar-heading-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 12px;
  color: #2563eb;
  background: #eff6ff;
  font-size: 19px;
}
.action-calendar .calendar-heading h2 {
  margin: 0 0 5px;
  font-size: 20px;
  line-height: 1.3;
  color: #0f172a;
}
.calendar-subtitle {
  font-size: 12px;
  color: #64748b;
}
.action-calendar .calendar-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #475569;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
}
.action-calendar .calendar-back:hover {
  color: #1d4ed8;
  background: #eff6ff;
  border-color: #bfdbfe;
}
.action-calendar .calendar-controls {
  display: grid;
  grid-template-columns: 256px 140px minmax(160px, 1fr) minmax(190px, 1.2fr) auto;
  align-items: end;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
}
.action-calendar .calendar-controls .control-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
  margin: 0;
}
.control-label {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}
.action-calendar .calendar-controls .control-field .control-input {
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 40px;
  margin: 0;
  padding: 8px 11px;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  background: #fff;
  color: #334155;
  font: inherit;
  font-size: 13px;
}
.action-calendar .calendar-controls .date-navigation {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.action-calendar .calendar-controls .date-navigation .calendar-date {
  flex: 1;
  width: 0;
}
.action-calendar .calendar-controls .calendar-nav-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 36px;
  width: 36px;
  height: 40px;
  margin: 0;
  padding: 0;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  background: #fff;
  color: #475569;
  font-size: 12px;
}
.search-input-wrap {
  position: relative;
  display: block;
  min-width: 0;
}
.search-input-wrap > i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 13px;
  pointer-events: none;
}
.action-calendar .calendar-controls .search-control .control-input {
  padding-left: 34px;
}
.action-calendar .calendar-controls .calendar-reload {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  margin: 0;
  padding: 0 14px;
  white-space: nowrap;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  background: #fff;
  color: #334155;
  font-size: 13px;
  font-weight: 500;
}
.action-calendar .calendar-controls button:hover:not(:disabled) {
  background: #eff6ff;
  color: #1d4ed8;
  border-color: #93c5fd;
}
.action-calendar .calendar-controls .control-input:focus {
  outline: 2px solid #bfdbfe;
  outline-offset: 1px;
  border-color: #3b82f6;
}
.action-calendar .calendar-controls :disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.action-calendar .calendar-hint {
  margin: 16px 0;
  padding: 10px 12px;
  border-radius: 7px;
  color: #475569;
  background: #eff6ff;
  font-size: 13px;
  line-height: 1.6;
}
@media (max-width: 1100px) {
  .action-calendar .calendar-controls {
    grid-template-columns: minmax(240px, 1fr) minmax(140px, 0.65fr) minmax(160px, 1fr);
  }
  .action-calendar .calendar-controls .search-control {
    grid-column: span 2;
  }
}
@media (max-width: 640px) {
  .action-calendar {
    padding: 14px;
  }
  .action-calendar .calendar-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }
  .action-calendar .calendar-heading h2 {
    font-size: 18px;
  }
  .action-calendar .calendar-controls {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    padding: 12px;
  }
  .action-calendar .calendar-controls .control-field:first-child,
  .action-calendar .calendar-controls .department-control {
    grid-column: 1 / -1;
  }
  .action-calendar .calendar-controls .search-control {
    grid-column: 1 / -1;
    grid-row: 4;
  }
  .action-calendar .calendar-controls .calendar-reload {
    grid-column: 2;
    grid-row: 2;
  }
}
.calendar-scroll {
  overflow: auto;
  max-height: 70vh;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  touch-action: pan-x;
}
table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  user-select: none;
}
th,
td {
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  padding: 8px;
  min-width: 86px;
  height: 52px;
  text-align: center;
}
thead th {
  position: sticky;
  top: 0;
  background: #f1f5f9;
  z-index: 2;
}
.person {
  position: sticky;
  left: 40px;
  min-width: 180px;
  max-width: 180px;
  text-align: left;
  background: white;
  z-index: 1;
}
.number {
  position: sticky;
  left: 0;
  min-width: 40px;
  box-sizing: border-box;
  width: 40px;
  background: white;
  z-index: 1;
}
thead .person,
thead .number {
  background: #f1f5f9;
  z-index: 3;
}
small {
  display: block;
  color: #64748b;
  font-size: 12px;
  margin-top: 4px;
}
.action-calendar .calendar-scroll .sticker {
  width: 100%;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 6px 4px;
  min-width: 0;
  touch-action: manipulation;
  cursor: pointer;
  margin: 3px 0;
}
.action-calendar .calendar-scroll .sticker[aria-disabled='true'] {
  cursor: default;
  opacity: 0.6;
}
td.past {
  background: #f8fafc;
}
.error {
  color: #b42318;
}

.action-calendar.month-view .calendar-scroll table {
  table-layout: fixed;
  width: max(100%, 1768px);
}
.action-calendar.month-view .calendar-scroll .date-column {
  width: 50px;
  min-width: 50px;
  height: 44px;
  padding: 4px 2px;
  font-size: 11px;
}
.action-calendar.month-view .calendar-scroll .person {
  width: 180px;
  padding: 6px 8px;
  font-size: 12px;
}
.action-calendar.month-view .calendar-scroll .number {
  padding: 4px;
  font-size: 11px;
}
.action-calendar.month-view .calendar-scroll .sticker {
  border-radius: 5px;
  padding: 6px 2px;
  font-size: 12px;
}
.action-calendar.month-view .calendar-scroll .sticker small {
  display: none;
}
.action-calendar.month-view .calendar-scroll small {
  font-size: 10px;
}
</style>
