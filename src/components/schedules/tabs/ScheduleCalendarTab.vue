<script setup lang="ts">
import { computed } from 'vue';
import type { Assignment, Shift } from '@/types/schedule';

interface ScheduleEmployee {
  code: string;
  name: string;
  department: string;
}

const view = defineModel<string>('view', { required: true });
const anchor = defineModel<string>('anchor', { required: true });
const props = defineProps<{
  employees: ScheduleEmployee[];
  visibleEmployees: ScheduleEmployee[];
  groupByDepartment: boolean;
  dates: string[];
  today: string;
  shifts: Shift[];
  canCreate: boolean;
  employeeAssignments: (id: string) => Assignment[];
  cell: (id: string, date: string) => Assignment | undefined;
  matches: (assignment?: Assignment) => boolean;
  fmt: (date: string) => string;
  name: (id: string) => string;
  shiftName: (id: string) => string;
  symbol: (assignment: Assignment) => string;
  label: (assignment?: Assignment) => string;
  pending: (assignment?: Assignment) => boolean;
}>();
const emit = defineEmits<{
  move: [amount: number];
  open: [employeeId: string, date: string];
}>();
const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
function cellSymbol(assignment?: Assignment) {
  if (!assignment) return '—';
  if (assignment.status === 'OFF') return 'OFF';
  if (assignment.status === 'LEAVE') return assignment.shiftSymbol || assignment.shiftId || 'NP';
  return props.symbol(assignment) || '—';
}

const employeeGroups = computed(() => {
  if (!props.groupByDepartment) return [{ department: '', employees: props.visibleEmployees }];
  const groups = new Map<string, ScheduleEmployee[]>();
  for (const employee of props.visibleEmployees) {
    const department = employee.department || 'Chưa có bộ phận';
    const members = groups.get(department) || [];
    members.push(employee);
    groups.set(department, members);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'vi'))
    .map(([department, employees]) => ({
      department,
      employees: employees.sort((a, b) => a.name.localeCompare(b.name, 'vi')),
    }));
});
function shiftTone(value?: Assignment | Shift) {
  if (!value) return 'unassigned';
  const assignment = 'employeeId' in value ? value : undefined;
  if (assignment?.status === 'OFF' || assignment?.shiftId === 'OFF' || value.id === 'OFF')
    return 'off';
  if (assignment?.status === 'LEAVE') return 'leave';

  const shift = 'employeeId' in value ? props.shifts.find((item) => item.id === value.shiftId) : value;
  const code = String(shift?.code || assignment?.shiftSymbol || assignment?.shiftId || '').toUpperCase();
  const name = String(shift?.name || assignment?.shiftName || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  if (
    assignment?.scheduleType === 'ADMINISTRATIVE' ||
    shift?.scheduleType === 'ADMINISTRATIVE' ||
    ['D', 'HC', 'ADMINISTRATIVE'].includes(code) ||
    name.includes('hanh chinh')
  )
    return 'administrative';
  if (
    code.endsWith('XX') ||
    name.includes('tuy chon') ||
    name.includes('linh hoat') ||
    name.includes('flex')
  )
    return 'flexible';
  if (code === 'M' || name.includes('sang') || name.includes('morning')) return 'morning';
  if (code === 'E' || name.includes('chieu') || name.includes('afternoon')) return 'afternoon';
  if (code === 'N' || name.includes('toi') || name.includes('dem') || name.includes('night'))
    return 'night';

  const startTime = assignment?.startTime || shift?.startTime || '';
  const startHour = Number(startTime.slice(0, 2));
  if (startTime && Number.isFinite(startHour)) {
    if (startHour < 5 || startHour >= 18) return 'night';
    if (startHour < 11) return 'morning';
    return 'afternoon';
  }
  return 'unassigned';
}
</script>

<template>
  <div class="toolbar">
    <div class="actions">
      <button
        aria-label="Kỳ trước"
        @click="emit('move', -1)"
      >
        ‹
      </button>
      <button @click="anchor = today">
        Hôm nay
      </button>
      <button
        aria-label="Kỳ sau"
        @click="emit('move', 1)"
      >
        ›
      </button>
      <strong>{{ fmt(dates[0]) }} – {{ fmt(dates[dates.length - 1]) }}</strong>
    </div>
    <div class="actions">
      <button
        v-for="item in [
          { id: 'day', name: 'Ngày' },
          { id: 'week', name: 'Tuần' },
          { id: 'month', name: 'Tháng' },
        ]"
        :key="item.id"
        :class="{ chosen: view === item.id }"
        @click="view = item.id"
      >
        {{ item.name }}
      </button>
    </div>
  </div>
  <div class="legend">
    <span class="shift-legend-item shift-tone--morning"><i />Ca sáng</span>
    <span class="shift-legend-item shift-tone--afternoon"><i />Ca chiều</span>
    <span class="shift-legend-item shift-tone--flexible"><i />Ca tùy chọn</span>
    <span class="shift-legend-item shift-tone--night"><i />Ca tối</span>
    <span class="shift-legend-item shift-tone--off"><i />OFF</span>
    <span class="shift-legend-item shift-tone--administrative"><i />Hành chính</span>
    <span class="shift-legend-item shift-tone--leave"><i />Nghỉ phép</span>
    <span>↔ Chờ đổi ca</span>
  </div>
  <div
    v-if="!visibleEmployees.length"
    class="panel empty-state"
  >
    Không tìm thấy nhân viên theo bộ lọc.
  </div>
  <template v-else>
    <p
      v-if="!visibleEmployees.some((item) => dates.some((date) => cell(item.code, date)))"
      class="demo"
    >
      Chưa có lịch làm việc trong khoảng thời gian này. Chọn Phân công ca để lập lịch.
    </p>
    <component
      :is="groupByDepartment ? 'details' : 'div'"
      v-for="group in employeeGroups"
      :key="group.department || 'selected-department'"
      class="department-calendar-group"
      :open="groupByDepartment ? true : undefined"
    >
      <summary v-if="groupByDepartment">
        <strong>{{ group.department }}</strong>
        <small>{{ group.employees.length }} nhân viên</small>
      </summary>
      <section
        v-if="view === 'month'"
        class="panel month-calendar"
      >
        <div class="month-heading">
          <strong>Nhân viên / Bộ phận</strong>
          <strong>Ca được phân công trong tháng · {{ anchor.slice(0, 7) }}</strong>
        </div>
        <article
          v-for="item in group.employees"
          :key="item.code"
          class="month-row"
        >
          <div class="calendar-employee">
            <strong>{{ item.name }}</strong>
            <small>{{ item.code }}</small>
            <small>{{ item.department || 'Chưa có bộ phận' }}</small>
          </div>
          <div class="month-shifts">
            <button
              v-for="assignment in employeeAssignments(item.code)"
              :key="assignment.id"
              :class="['assignment-chip', `shift-tone--${shiftTone(assignment)}`]"
              :title="label(assignment)"
              @click="emit('open', item.code, assignment.date)"
            >
              <span class="assignment-date">{{ fmt(assignment.date) }}</span>
              <strong>{{ symbol(assignment) }}</strong>
            </button>
            <p
              v-if="!employeeAssignments(item.code).length"
              class="unassigned-note"
            >
              Chưa phân công ca trong tháng
            </p>
          </div>
        </article>
      </section>
      <section
        v-else-if="view === 'day'"
        class="day-calendar"
      >
        <article
          v-for="item in group.employees"
          :key="item.code"
          class="panel day-employee"
        >
          <div class="calendar-employee">
            <strong>{{ item.name }}</strong>
            <small>{{ item.code }} · {{ item.department || 'Chưa có bộ phận' }}</small>
          </div>
          <div class="day-shifts">
            <button
              v-for="assignment in employeeAssignments(item.code)"
              :key="assignment.id"
              :title="label(assignment)"
              :class="['day-assignment', `shift-tone--${shiftTone(assignment)}`]"
              @click="emit('open', item.code, assignment.date)"
            >
              <strong class="shift-symbol">{{ symbol(assignment) }}</strong>
            </button>
            <div
              v-if="!employeeAssignments(item.code).length"
              class="day-unassigned"
            >
              <span>Chưa phân công</span>
              <button
                v-if="canCreate"
                @click="emit('open', item.code, dates[0])"
              >
                + Phân công ca
              </button>
            </div>
          </div>
        </article>
      </section>
      <section
        v-else
        class="panel grid-wrap"
      >
        <table class="schedule-grid" :style="{ minWidth: (240 + dates.length * 88) + 'px' }">
          <colgroup><col class="employee-col" /><col v-for="date in dates" :key="date" /></colgroup>
          <thead>
            <tr>
              <th>
                NHÂN VIÊN<small>{{ group.employees.length }} nhân viên</small>
              </th>
              <th
                v-for="date in dates"
                :key="date"
                :class="{
                  today: date === today,
                  weekend: [0, 6].includes(new Date(date + 'T12:00:00').getDay()),
                }"
              >
                {{ dayLabels[(new Date(date + 'T12:00:00').getDay() + 6) % 7] }}
                <small>{{ fmt(date) }}</small>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in group.employees"
              :key="item.code"
            >
              <th>
                <strong>{{ item.name }}</strong>
                <small>{{ item.code }} · {{ item.department }}</small>
              </th>
              <td
                v-for="date in dates"
                :key="date"
                :class="{
                  today: date === today,
                  weekend: [0, 6].includes(new Date(date + 'T12:00:00').getDay()),
                }"
              >
                <button
                  v-if="matches(cell(item.code, date))"
                  :class="['shift-cell', `shift-tone--${shiftTone(cell(item.code, date))}`]"
                  :title="label(cell(item.code, date))"
                  :disabled="!cell(item.code, date) && !canCreate"
                  @click="emit('open', item.code, date)"
                >
                  <strong>{{ cellSymbol(cell(item.code, date)) }}</strong>
                </button>
                <span v-else>—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section
        v-if="view === 'week'"
        class="agenda"
      >
        <article
          v-for="date in dates"
          :key="date"
          class="panel"
        >
          <h3>{{ fmt(date) }} {{ date === today ? '· Hôm nay' : '' }}</h3>
          <button
            v-for="item in group.employees.filter((person) => matches(cell(person.code, date)))"
            :key="item.code"
            :class="['agenda-assignment', `shift-tone--${shiftTone(cell(item.code, date))}`]"
            @click="emit('open', item.code, date)"
          >
            <strong>{{ name(item.code) }}</strong>
            <small>{{ label(cell(item.code, date)) }}
              {{ pending(cell(item.code, date)) ? '↔ Chờ đổi ca' : '' }}</small>
          </button>
        </article>
      </section>
    </component>
  </template>
</template>