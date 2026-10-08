<script setup lang="ts">
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
defineProps<{
  editing?: Assignment;
  busy: boolean;
  canCreate: boolean;
  canEdit: boolean;
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
  autoAssignRotating: () => void;
}>();
</script>

<template>
  <section class="panel form">
    <div class="toolbar">
      <h2>{{ editing ? 'Sửa phân công' : 'Tạo phân công' }}</h2>
      <div v-if="!editing" class="actions">
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
              busy || !formDepartment || shiftsLoading || !!shiftsError || !manualShifts.length
            "
          />
          <div v-if="scheduleType === 'ROTATING'" class="auto-schedule">
            <h3>Tự động xếp ca xoay</h3>
            <p>
              Phạm vi {{ calendarMode === 'week' ? 'tuần' : 'tháng' }} đang xem · mỗi nhân viên nghỉ
              1 ngày/tuần · ca M/E tối đa 2 người mỗi ngày · ca N nhận phần còn lại.
              <template v-if="calendarMode === 'month'"
                >Lịch tháng bao gồm trọn các tuần chạm vào tháng đã chọn.</template
              >
            </p>
          </div>
          <div class="actions schedule-actions">
            <button
              v-if="scheduleType === 'ROTATING'"
              class="auto-schedule-button"
              :disabled="
                busy || !formDepartment || shiftsLoading || !!shiftsError || !manualShifts.length
              "
              @click="autoAssignRotating"
            >
              Tự động xếp ca
            </button>
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
  </section>
</template>
