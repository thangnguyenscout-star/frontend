<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  leaveDateTime,
  leaveRequestStatuses,
  type LeaveRequest,
  type LeaveRequestFilter,
} from '@/services/modules/leave-request.service';
import type { LeaveEmployee } from './leave-gantt.service';
import { buildLeaveGantt, ganttDays, type GanttBar } from './leave-gantt.model';
const props = defineProps<{
  employees: LeaveEmployee[];
  requests: LeaveRequest[];
  filter: LeaveRequestFilter;
}>();
const emit = defineEmits<{ open: [request: LeaveRequest] }>();
const onlyWithLeave = ref(false);
const dayWidth = ref(40);
const collapsed = ref(new Set<string>());
const days = computed(() => ganttDays(props.filter));
const model = computed(() =>
  buildLeaveGantt(props.employees, props.requests, props.filter, onlyWithLeave.value),
);
const employeeCount = computed(() =>
  model.value.groups.reduce((sum, group) => sum + group.employees.length, 0),
);
const requestCount = computed(() =>
  model.value.groups.reduce((sum, group) => sum + group.requests, 0),
);
const today = new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10);
const todayIndex = computed(() => days.value.findIndex((day) => day.date === today));
const months = computed(() => {
  const groups: { key: string; label: string; count: number }[] = [];
  for (const day of days.value) {
    const key = day.date.slice(0, 7),
      last = groups.at(-1);
    if (last?.key === key) last.count++;
    else groups.push({ key, label: 'Tháng ' + key.slice(5) + '/' + key.slice(0, 4), count: 1 });
  }
  return groups;
});
const gridStyle = computed(() => ({
  '--gantt-day-width': dayWidth.value + 'px',
  '--gantt-timeline-width': days.value.length * dayWidth.value + 'px',
  '--gantt-days-bg': `linear-gradient(to right, ${days.value.map((day, index) => `${day.weekend ? '#f7f4ee' : '#fff'} ${index * dayWidth.value}px ${(index + 1) * dayWidth.value}px`).join(', ')})`,
}));
const statusLabel = (code: string | null) =>
  leaveRequestStatuses.find((status) => status.code === code)?.label || code || 'Chưa xác định';
function toggle(code: string) {
  if (collapsed.value.has(code)) collapsed.value.delete(code);
  else collapsed.value.add(code);
}
function tooltip(bar: GanttBar, name: string) {
  return `${name} · ${bar.request.maNhanVien}\n${leaveDateTime(bar.request.tuNgay)} → ${leaveDateTime(bar.request.denNgay)}\n${statusLabel(bar.request.tinhTrang)} · ${bar.request.soNgayNghi ?? '—'} ngày\n${bar.request.lyDoNghi || 'Chưa có lý do'}`;
}
</script>
<template>
  <section class="leave-gantt" aria-label="Biểu đồ Gantt nghỉ phép theo nhân viên và bộ phận">
    <div class="gantt-controls">
      <div class="gantt-summary">
        <strong>{{ employeeCount }}</strong> nhân viên <span>·</span
        ><strong>{{ model.groups.length }}</strong> bộ phận <span>·</span
        ><strong>{{ requestCount }}</strong> đơn trong khoảng xem
      </div>
      <div class="gantt-options">
        <label><input v-model="onlyWithLeave" type="checkbox" /> Chỉ nhân viên có đơn</label
        ><label
          >Độ rộng ngày<select v-model.number="dayWidth" aria-label="Độ rộng ngày Gantt">
            <option :value="32">Thu gọn</option>
            <option :value="40">Tiêu chuẩn</option>
            <option :value="56">Chi tiết</option>
          </select></label
        >
      </div>
    </div>
    <div class="gantt-legend">
      <span v-for="status in leaveRequestStatuses" :key="status.code"
        ><i :class="'gantt-color-' + status.code" />{{ status.label }}</span
      ><span><i class="gantt-weekend-swatch" />Cuối tuần</span
      ><span><i class="gantt-today-swatch" />Hôm nay</span
      ><small>Nhấn thanh nghỉ để xem chi tiết · Cuộn ngang để xem các ngày</small>
    </div>
    <p v-if="model.invalid" class="leave-catalog-error" role="alert">
      Có {{ model.invalid }} đơn có khoảng thời gian không hợp lệ nên chưa vẽ được trên biểu đồ.
    </p>
    <div
      v-if="model.groups.length"
      class="gantt-scroll"
      tabindex="0"
      role="region"
      aria-label="Lịch nghỉ phép, cuộn ngang và dọc"
      :style="gridStyle"
    >
      <div class="gantt-canvas">
        <div class="gantt-header gantt-grid-row">
          <div class="gantt-person-cell gantt-person-header">
            <strong>Nhân viên</strong><span>Mã nhân viên · Chức vụ</span>
          </div>
          <div>
            <div class="gantt-months">
              <span
                v-for="month in months"
                :key="month.key"
                :style="{ width: month.count * dayWidth + 'px' }"
                >{{ month.label }}</span
              >
            </div>
            <div class="gantt-day-headings">
              <div
                v-for="day in days"
                :key="day.date"
                :class="{ 'is-weekend': day.weekend, 'is-today': day.date === today }"
                :title="day.date.split('-').reverse().join('/')"
              >
                <strong>{{ day.label }}</strong
                ><small>{{ day.weekday }}</small>
              </div>
            </div>
          </div>
        </div>
        <template v-for="group in model.groups" :key="group.code">
          <div class="gantt-group gantt-grid-row">
            <button
              type="button"
              class="gantt-person-cell gantt-group-button"
              :aria-expanded="!collapsed.has(group.code)"
              @click="toggle(group.code)"
            >
              <i
                :class="['pi', collapsed.has(group.code) ? 'pi-angle-right' : 'pi-angle-down']"
              /><strong>{{ group.name }}</strong
              ><b>{{ group.employees.length }}</b>
            </button>
            <div class="gantt-group-track">
              <span>{{ group.requests }} đơn</span>
            </div>
          </div>
          <template v-if="!collapsed.has(group.code)"
            ><div
              v-for="row in group.employees"
              :key="row.employee.maNhanVien"
              class="gantt-employee-row gantt-grid-row"
              :style="{ height: row.height + 'px' }"
            >
              <div class="gantt-person-cell gantt-employee">
                <span class="gantt-avatar">{{ row.name.split(' ').at(-1)?.[0] || '?' }}</span>
                <div>
                  <strong :title="row.name">{{ row.name }}</strong
                  ><small :title="row.employee.tenChucVu || row.employee.maChucVu || ''"
                    >{{ row.employee.maNhanVien }} ·
                    {{
                      row.employee.tenChucVu || row.employee.maChucVu || 'Chưa có chức vụ'
                    }}</small
                  >
                </div>
                <span v-if="row.bars.length" class="gantt-row-count">{{ row.bars.length }}</span>
              </div>
              <div class="gantt-track">
                <span
                  v-if="todayIndex >= 0"
                  class="gantt-today-line"
                  :style="{ left: (todayIndex + 0.5) * dayWidth + 'px' }"
                /><button
                  v-for="bar in row.bars"
                  :key="String(bar.request.id)"
                  type="button"
                  :class="[
                    'gantt-bar',
                    'gantt-color-' +
                      (['N', 'A', 'C'].includes(bar.request.tinhTrang || '')
                        ? bar.request.tinhTrang
                        : 'unknown'),
                    { 'gantt-bar-compact': (bar.width / 100) * days.length * dayWidth < 70 },
                  ]"
                  :style="{
                    left: bar.left + '%',
                    width: bar.width + '%',
                    top: 8 + bar.lane * 26 + 'px',
                  }"
                  :title="tooltip(bar, row.name)"
                  :aria-label="tooltip(bar, row.name)"
                  @click="emit('open', bar.request)"
                >
                  <span
                    >{{ statusLabel(bar.request.tinhTrang) }} ·
                    {{ bar.request.soNgayNghi ?? '—' }} ngày</span
                  >
                </button>
              </div>
            </div></template
          >
        </template>
      </div>
    </div>
    <div v-else class="leave-empty">
      <i class="pi pi-users" /><strong>Không có nhân viên phù hợp</strong
      ><span>Thử đổi bộ phận, nhân viên hoặc bỏ chọn “Chỉ nhân viên có đơn”.</span>
    </div>
    <div class="gantt-bottom-note">
      <span>Nhân viên chưa có đơn vẫn xuất hiện trong danh sách.</span
      ><span>Các đơn trùng thời gian được xếp thành nhiều hàng.</span>
    </div>
  </section>
</template>
