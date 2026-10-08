<script setup lang="ts">
import type { Assignment, Shift } from '@/types/schedule';

interface ScheduleEmployee {
  code: string;
  name: string;
  department: string;
}

const view = defineModel<string>('view', { required: true });
const anchor = defineModel<string>('anchor', { required: true });
defineProps<{
  employees: ScheduleEmployee[];
  visibleEmployees: ScheduleEmployee[];
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
</script>

<template>
  <div class="toolbar">
    <div class="actions">
      <button aria-label="Kỳ trước" @click="emit('move', -1)">‹</button>
      <button @click="anchor = today">Hôm nay</button>
      <button aria-label="Kỳ sau" @click="emit('move', 1)">›</button>
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
    <span v-for="shift in shifts" :key="shift.id">
      <i :style="{ background: shift.displayColor }" />{{ shift.code }} · {{ shift.name }}
    </span>
    <span>○ Nghỉ</span><span>◇ Nghỉ phép</span><span>— Chưa xếp</span><span>↔ Chờ đổi ca</span>
  </div>
  <div v-if="!visibleEmployees.length" class="panel empty-state">
    Không tìm thấy nhân viên theo bộ lọc.
  </div>
  <template v-else>
    <p
      v-if="!visibleEmployees.some((item) => dates.some((date) => cell(item.code, date)))"
      class="demo"
    >
      Chưa có lịch làm việc trong khoảng thời gian này. Chọn Phân công ca để lập lịch.
    </p>
    <section v-if="view === 'month'" class="panel month-calendar">
      <div class="month-heading">
        <strong>Nhân viên / Bộ phận</strong>
        <strong>Ca được phân công trong tháng · {{ anchor.slice(0, 7) }}</strong>
      </div>
      <article v-for="item in visibleEmployees" :key="item.code" class="month-row">
        <div class="calendar-employee">
          <strong>{{ item.name }}</strong>
          <small>{{ item.code }}</small>
          <small>{{ item.department || 'Chưa có bộ phận' }}</small>
        </div>
        <div class="month-shifts">
          <button
            v-for="assignment in employeeAssignments(item.code)"
            :key="assignment.id"
            class="assignment-chip"
            :title="label(assignment)"
            @click="emit('open', item.code, assignment.date)"
          >
            <span class="assignment-date">{{ fmt(assignment.date) }}</span>
            <strong>{{ symbol(assignment) }}</strong>
            <span>
              {{ assignment.startTime || '—' }} – {{ assignment.endTime || '—'
              }}{{ assignment.crossDay ? ' (+1 ngày)' : '' }}
            </span>
          </button>
          <p v-if="!employeeAssignments(item.code).length" class="unassigned-note">
            Chưa phân công ca trong tháng
          </p>
        </div>
      </article>
    </section>
    <section v-else-if="view === 'day'" class="day-calendar">
      <article v-for="item in visibleEmployees" :key="item.code" class="panel day-employee">
        <div class="calendar-employee">
          <strong>{{ item.name }}</strong>
          <small>{{ item.code }} · {{ item.department || 'Chưa có bộ phận' }}</small>
        </div>
        <div class="day-shifts">
          <button
            v-for="assignment in employeeAssignments(item.code)"
            :key="assignment.id"
            class="day-assignment"
            @click="emit('open', item.code, assignment.date)"
          >
            <strong class="shift-symbol">{{ symbol(assignment) }}</strong>
            <span>
              {{ assignment.shiftName || shiftName(assignment.shiftId) }}
              <small>
                {{ assignment.startTime || '—' }} – {{ assignment.endTime || '—'
                }}{{ assignment.crossDay ? ' (+1 ngày)' : '' }}
              </small>
              <small v-if="assignment.note">{{ assignment.note }}</small>
            </span>
          </button>
          <div v-if="!employeeAssignments(item.code).length" class="day-unassigned">
            <span>Chưa phân công</span>
            <button v-if="canCreate" @click="emit('open', item.code, dates[0])">
              + Phân công ca
            </button>
          </div>
        </div>
      </article>
    </section>
    <section v-else class="panel grid-wrap">
      <table class="grid">
        <thead>
          <tr>
            <th>
              NHÂN VIÊN<small>{{ visibleEmployees.length }} nhân viên</small>
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
          <tr v-for="item in visibleEmployees" :key="item.code">
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
                class="shift-cell"
                :title="label(cell(item.code, date))"
                :style="{
                  '--shift-color':
                    shifts.find((shift) => shift.id === cell(item.code, date)?.shiftId)
                      ?.displayColor || '#94a3b8',
                }"
                :disabled="!cell(item.code, date) && !canCreate"
                @click="emit('open', item.code, date)"
              >
                <strong>
                  {{
                    cell(item.code, date)?.status === 'SCHEDULED'
                      ? cell(item.code, date)?.shiftSymbol ||
                        shifts.find((shift) => shift.id === cell(item.code, date)?.shiftId)?.code ||
                        '⚠ Ca chưa xác định'
                      : label(cell(item.code, date))
                  }}
                </strong>
                <small v-if="cell(item.code, date)?.status === 'SCHEDULED'">
                  {{
                    cell(item.code, date)?.startTime ||
                    shifts.find((shift) => shift.id === cell(item.code, date)?.shiftId)?.startTime
                  }}
                  –
                  {{
                    cell(item.code, date)?.endTime ||
                    shifts.find((shift) => shift.id === cell(item.code, date)?.shiftId)?.endTime
                  }}
                </small>
                <small
                  v-if="
                    shifts.find((shift) => shift.id === cell(item.code, date)?.shiftId)?.crossDay
                  "
                  >+1 ngày</small
                >
                <small v-if="cell(item.code, date)?.status === 'SCHEDULED'">
                  {{ cell(item.code, date)?.fullTime === false ? '1/2 ca' : 'Cả ca' }}
                </small>
                <small v-if="pending(cell(item.code, date))">↔ Chờ duyệt đổi ca</small>
              </button>
              <span v-else>—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <section v-if="view === 'week'" class="agenda">
      <article v-for="date in dates" :key="date" class="panel">
        <h3>{{ fmt(date) }} {{ date === today ? '· Hôm nay' : '' }}</h3>
        <button
          v-for="item in visibleEmployees.filter((person) => matches(cell(person.code, date)))"
          :key="item.code"
          @click="emit('open', item.code, date)"
        >
          <strong>{{ name(item.code) }}</strong>
          <small
            >{{ label(cell(item.code, date)) }}
            {{ pending(cell(item.code, date)) ? '↔ Chờ đổi ca' : '' }}</small
          >
        </button>
      </article>
    </section>
  </template>
</template>
