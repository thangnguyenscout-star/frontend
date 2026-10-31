<script setup lang="ts">
import { computed, ref } from 'vue';
import ScheduleRotatingDialog from '@/components/schedules/dialogs/ScheduleRotatingDialog.vue';
import ScheduleExchangeDialog from '@/components/schedules/dialogs/ScheduleExchangeDialog.vue';
const exchangeAssignment = ref<Assignment>();
import ScheduleAdministrativeDialog from '@/components/schedules/dialogs/ScheduleAdministrativeDialog.vue';
import AssignmentCalendar, { type DayPlan } from '@/components/schedules/AssignmentCalendar.vue';
import type {
  ScheduleDepartment,
  ScheduleDepartmentGroup,
} from '@/services/modules/schedule-shift.service';
import type { Assignment, ScheduleData, ScheduleType, Shift } from '@/types/schedule';

interface ScheduleEmployee {
  code: string;
  name: string;
  department: string;
}
interface ScheduledDates {
  employeeId: string;
  dates: string[];
}

const bulk = defineModel<boolean>('bulk', { required: true });
const selected = defineModel<string[]>('selected', { required: true });
const formDepartment = defineModel<string>('formDepartment', { required: true });
const formSearch = defineModel<string>('formSearch', { required: true });
const scheduleType = defineModel<ScheduleType>('scheduleType', { required: true });
const method = defineModel<string>('method', { required: true });
const dayPlans = defineModel<DayPlan[]>('dayPlans', { required: true });
const calendarMode = defineModel<'week' | 'month'>('calendarMode', { required: true });
const calendarAnchor = defineModel<string>('calendarAnchor', { required: true });
const emit = defineEmits<{
  edit: [assignment: Assignment];
  reload: [];
  'administrative-created': [];
  'administrative-busy': [boolean];
}>();

const props = defineProps<{
  editing?: Assignment;
  busy: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canUpdate: boolean;
  canBulk: boolean;
  treeLoading: boolean;
  treeError: string;
  departmentGroups: ScheduleDepartmentGroup[];
  unclassifiedDepartments: ScheduleDepartment[];
  loadDepartmentTree: () => void;
  shiftsLoading: boolean;
  shiftsError: string;
  loadManualShifts: () => void;
  eligible: ScheduleEmployee[];
  name: (id: string) => string;
  manualShifts: Shift[];
  data: ScheduleData;
  scheduledDates: ScheduledDates[];
  start: string;
  administrativeShiftId?: string;
  makePreview: () => void;
  createAssignment?: (plan: DayPlan) => Promise<void>;
}>();
const rotatingDepartmentCode = computed(
  () =>
    props.departmentGroups
      .flatMap((group) => group.departments)
      .find((department) => department.name === formDepartment.value)?.code || '',
);
const isCSchedule = computed(() =>
  props.manualShifts.some((shift) => shift.active && shift.workType?.trim().toUpperCase() === 'C'),
);
</script>

<template>
  <section class="panel form">
    <div class="toolbar">
      <h2>{{ editing ? 'Sửa phân công' : 'Tạo phân công' }}</h2>
      <div v-if="!editing" class="actions">
        <RouterLink v-if="canUpdate" class="schedule-action-link" to="/schedules/exchange"
          >Đổi ca</RouterLink
        >
        <ScheduleAdministrativeDialog
          v-if="canCreate"
          :disabled="busy"
          @saved="emit('administrative-created')"
          @busy="emit('administrative-busy', $event)"
        />
        <button
          :class="{ chosen: !bulk }"
          @click="
            bulk = false;
            selected = [];
            method = 'calendar';
          "
        >
          Cá nhân
        </button>
        <button
          v-if="canBulk"
          :class="{ chosen: bulk }"
          @click="
            bulk = true;
            selected = [];
          "
        >
          Hàng loạt
        </button>
      </div>
    </div>
    <p v-if="!canEdit">Bạn không có quyền phân công ca.</p>
    <template v-else>
      <div class="assignment-workspace">
        <aside class="department-tree-panel">
          <h3>Bộ phận</h3>
          <p class="tree-hint">Chọn bộ phận để phân công ca</p>
          <p v-if="treeLoading" role="status">Đang phân loại bộ phận…</p>
          <p v-if="treeError" role="alert">{{ treeError }}</p>
          <nav v-if="!treeLoading" aria-label="Cây bộ phận theo loại lịch">
            <details
              v-for="group in departmentGroups"
              :key="group.type"
              open
              class="department-tree-group"
            >
              <summary>
                {{ group.label }} <span>{{ group.departments.length }}</span>
              </summary>
              <button
                v-for="department in group.departments"
                :key="department.code"
                type="button"
                :class="{ selected: formDepartment === department.name }"
                :aria-pressed="formDepartment === department.name"
                :disabled="busy || !!editing"
                @click="formDepartment = department.name"
              >
                <i class="pi pi-building" aria-hidden="true" />
                <span
                  >{{ department.name }}<small>{{ department.code }}</small></span
                >
              </button>
              <p v-if="!group.departments.length" class="tree-hint">Chưa có bộ phận</p>
            </details>
          </nav>
          <div v-if="!treeLoading && unclassifiedDepartments.length" class="tree-unavailable">
            <p>Chưa xác định loại lịch hoặc chưa có ca hoạt động:</p>
            <small v-for="department in unclassifiedDepartments" :key="department.code">
              {{ department.name }}
            </small>
            <button type="button" @click="loadDepartmentTree">Tải lại</button>
          </div>
        </aside>
        <div class="assignment-schedule-panel">
          <p v-if="!formDepartment" class="assignment-lock">
            <i class="pi pi-lock" aria-hidden="true" /> Chọn bộ phận ở bên trái để mở chức năng chọn
            ca.
          </p>
          <p v-if="shiftsLoading" role="status">Đang tải ca và xác định loại lịch…</p>
          <p v-if="shiftsError" role="alert" class="error">
            {{ shiftsError }} <button @click="loadManualShifts">Thử lại</button>
          </p>
          <p
            v-if="formDepartment && !shiftsLoading && !shiftsError && manualShifts.length"
            class="department-schedule-type"
          >
            Loại lịch của bộ phận:
            {{ scheduleType === 'ADMINISTRATIVE' ? 'Hành chính' : 'Làm theo ca' }}
          </p>
          <h3>
            {{
              method === 'calendar'
                ? 'Tìm nhân viên trong lịch'
                : '1. Chọn nhân viên · ' + selected.length + ' đã chọn'
            }}
          </h3>
          <input
            v-model="formSearch"
            placeholder="Tìm mã NV hoặc họ tên"
            aria-label="Tìm nhân viên"
          />
          <div v-if="method !== 'calendar'" class="employee-picker">
            <label v-if="bulk">
              <input
                type="checkbox"
                :checked="
                  !!eligible.length && eligible.every((item) => selected.includes(item.code))
                "
                @change="
                  selected = eligible.every((item) => selected.includes(item.code))
                    ? []
                    : eligible.map((item) => item.code)
                "
              />Chọn tất cả kết quả
            </label>
            <label v-for="item in eligible" :key="item.code">
              <input v-if="bulk" v-model="selected" type="checkbox" :value="item.code" />
              <input
                v-else
                type="radio"
                name="employee"
                :checked="selected.includes(item.code)"
                :disabled="!!editing"
                @change="selected = [item.code]"
              />{{ name(item.code) }}
            </label>
            <p v-if="!eligible.length">Không tìm thấy nhân viên.</p>
          </div>

          <AssignmentCalendar
            v-if="method === 'calendar'"
            :key="editing?.id || start"
            v-model="dayPlans"
            :employees="
              (editing
                ? eligible.filter((item) => item.code === editing?.employeeId)
                : eligible
              ).map((item) => ({
                code: item.code,
                name: item.name,
                department: String(item.department || ''),
              }))
            "
            :shifts="manualShifts"
            :existing-assignments="data.assignments"
            :create-assignment="createAssignment"
            :can-edit="canUpdate && !editing"
            @edit="exchangeAssignment = $event"
            :scheduled-dates="scheduledDates"
            :shifts-loading="shiftsLoading"
            :shifts-error="shiftsError"
            @request-shifts="loadManualShifts"
            :view-mode="calendarMode"
            :anchor-date="calendarAnchor"
            @update:view-mode="calendarMode = $event"
            @update:anchor-date="calendarAnchor = $event"
            :administrative="scheduleType === 'ADMINISTRATIVE'"
            :administrative-shift-id="administrativeShiftId"
            :initial-date="start"
            :fixed-date="editing?.date"
            :disabled="
              busy ||
              !formDepartment ||
              (scheduleType === 'ADMINISTRATIVE' &&
                (shiftsLoading || !!shiftsError || !administrativeShiftId))
            "
          />
          <ScheduleRotatingDialog
            v-if="!editing && canCreate"
            :eligible="isCSchedule"
            :department-code="rotatingDepartmentCode"
            :anchor="calendarAnchor"
            :week="calendarMode === 'week'"
            :disabled="busy || shiftsLoading || !!shiftsError"
            @busy="emit('administrative-busy', $event)"
            @saved="
              dayPlans = [];
              emit('reload');
            "
          />
          <div class="actions schedule-actions">
            <button
              class="primary"
              :disabled="
                busy ||
                !formDepartment ||
                shiftsLoading ||
                !!shiftsError ||
                !manualShifts.length ||
                (method === 'calendar' ? !dayPlans.length : !selected.length)
              "
              @click="makePreview"
            >
              Xem trước phân công
            </button>
            <span>Không ghi đè lịch âm thầm.</span>
          </div>
        </div>
      </div>
    </template>
    <ScheduleExchangeDialog
      @busy="emit('administrative-busy', $event)"
      :assignment="exchangeAssignment"
      :department-code="
        [...departmentGroups.flatMap((g) => g.departments), ...unclassifiedDepartments].find(
          (d) => d.name === formDepartment,
        )?.code || null
      "
      :employee-name="exchangeAssignment ? name(exchangeAssignment.employeeId) : ''"
      @close="exchangeAssignment = undefined"
      @confirmed="emit('reload')"
    />
  </section>
</template>

<style scoped>
.schedule-action-link {
  display: inline-flex;
  align-items: center;
  padding: 9px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  color: #1d4ed8;
  background: #eff6ff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
}
</style>
