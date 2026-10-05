<script setup lang="ts">
import { computed, onMounted, ref, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import Dialog from 'primevue/dialog';
import AssignmentCalendar, { type DayPlan } from '@/components/schedules/AssignmentCalendar.vue';
import Drawer from 'primevue/drawer';
import { useRecords } from '@/composables/useRecords';
import { usePermission } from '@/composables/usePermission';
import { useToast } from '@/composables/useToast';
import { scheduleService, conflicts } from '@/services/modules/schedule.service';
import { systemToday, isPastScheduleDate } from '@/utils/schedule-date';
import {
  getScheduleDepartments,
  type ScheduleDepartment,
  getDepartmentShifts,
} from '@/services/modules/schedule-shift.service';
import type { Shift } from '@/types/schedule';
import { buildRotatingSchedule } from '@/utils/schedule-auto';
import type {
  Assignment,
  ScheduleData,
  ScheduleTemplate,
  ScheduleType,
  SwapRequest,
} from '@/types/schedule';
const route = useRoute(),
  router = useRouter(),
  permission = usePermission(),
  toast = useToast(),
  staff = useRecords('employees'),
  departmentSettings = useRecords('departments');
const departmentRecords = {
  all: ref<ScheduleDepartment[]>([]),
  loading: ref(false),
  error: ref(''),
  async load() {
    departmentRecords.loading.value = true;
    departmentRecords.error.value = '';
    try {
      departmentRecords.all.value = await getScheduleDepartments();
    } catch (e) {
      departmentRecords.error.value = e instanceof Error ? e.message : String(e);
    } finally {
      departmentRecords.loading.value = false;
    }
  },
};
onMounted(() => departmentRecords.load());
const data = ref<ScheduleData>({
  shifts: [],
  assignments: [],
  templates: [],
  swaps: [],
  history: [],
});
const loading = ref(false),
  busy = ref(false),
  error = ref(''),
  dirty = ref(false);
const menu = [
  { key: 'calendar', label: 'Lịch phân công' },
  { key: 'assign', label: 'Phân công ca' },
  { key: 'templates', label: 'Mẫu lịch' },
  { key: 'swaps', label: 'Đổi ca' },
  { key: 'reports', label: 'Báo cáo lịch làm việc' },
];
const page = computed(() => String(route.meta.schedulePage || 'calendar'));
const title = computed(() => menu.find((m) => m.key === page.value)?.label);
function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const today = dateKey(new Date()),
  anchor = ref(today),
  view = ref('week'),
  dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
function range(start: string, end: string) {
  const out: string[] = [];
  const d = new Date(start + 'T12:00:00');
  while (dateKey(d) <= end && out.length < 367) {
    out.push(dateKey(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}
const dates = computed(() => {
  const d = new Date(anchor.value + 'T12:00:00');
  if (view.value === 'week') d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  if (view.value === 'month') d.setDate(1);
  const end = new Date(d);
  if (view.value === 'week') end.setDate(end.getDate() + 6);
  if (view.value === 'month') end.setMonth(end.getMonth() + 1, 0);
  return range(dateKey(d), dateKey(end));
});
function move(n: number) {
  const d = new Date(anchor.value + 'T12:00:00');
  if (view.value === 'month') {
    d.setDate(1);
    d.setMonth(d.getMonth() + n);
  } else d.setDate(d.getDate() + n * (view.value === 'week' ? 7 : 1));
  anchor.value = dateKey(d);
}
function fmt(date: string) {
  return new Date(date + 'T12:00:00').toLocaleDateString('vi-VN');
}
const department = ref(''),
  employee = ref(''),
  type = ref(''),
  shiftFilter = ref(''),
  status = ref(''),
  search = ref('');
const departments = computed(() =>
  departmentRecords.all.value.map((department) => department.name),
);
const employees = computed(() =>
  staff.all.value.filter(
    (e) =>
      (!department.value || e.department === department.value) &&
      (!employee.value || e.code === employee.value) &&
      `${e.code} ${e.name}`.toLocaleLowerCase().includes(search.value.toLocaleLowerCase()),
  ),
);
function name(id: string) {
  const e = staff.all.value.find((e) => e.code === id);
  return e ? `${e.code} · ${e.name}` : id;
}
function shiftName(id: string) {
  if (id === 'OFF') return 'Nghỉ';
  const s = data.value.shifts.find((s) => s.id === id);
  return s
    ? `${s.name} · ${s.startTime}–${s.endTime}${s.crossDay ? ' (+1 ngày)' : ''}`
    : '⚠ Ca chưa có trong danh mục';
}
function cell(id: string, date: string) {
  return data.value.assignments.find((a) => a.employeeId === id && a.date === date);
}
function label(a?: Assignment) {
  return !a
    ? 'Chưa phân công'
    : a.status === 'OFF'
      ? 'Nghỉ'
      : a.status === 'LEAVE'
        ? 'Nghỉ phép'
        : (a.startTime && a.endTime
            ? `${data.value.shifts.find((s) => s.id === a.shiftId)?.name || a.shiftId} · ${a.startTime}–${a.endTime}${a.crossDay ? ' (+1 ngày)' : ''}`
            : shiftName(a.shiftId)) + (a.fullTime === false ? ' · 1/2 ca' : ' · Cả ca');
}
function matches(a?: Assignment) {
  return (
    (!type.value || a?.scheduleType === type.value) &&
    (!shiftFilter.value || a?.shiftId === shiftFilter.value) &&
    (!status.value || (a?.status || 'UNASSIGNED') === status.value)
  );
}
const visibleEmployees = computed(() =>
  employees.value.filter((e) => dates.value.some((d) => matches(cell(e.code, d)))),
);
const pending = (a?: Assignment) =>
  !!a &&
  data.value.swaps.some(
    (s) => s.status === 'PENDING' && [s.assignmentId, s.targetAssignmentId].includes(a.id),
  );
async function load() {
  loading.value = true;
  error.value = '';
  try {
    data.value = await scheduleService.load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  } finally {
    loading.value = false;
  }
}
onMounted(load);
async function run(job: () => Promise<ScheduleData>) {
  if (busy.value) return false;
  busy.value = true;
  error.value = '';
  try {
    data.value = await job();
    dirty.value = false;
    toast.success('success');
    return true;
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
    return false;
  } finally {
    busy.value = false;
  }
}
onBeforeRouteLeave(
  () => !dirty.value || window.confirm('Có thay đổi chưa lưu. Bạn muốn rời màn hình?'),
);
onBeforeRouteUpdate(
  () => !dirty.value || window.confirm('Có thay đổi chưa lưu. Bạn muốn rời màn hình?'),
);
const unload = (e: BeforeUnloadEvent) => {
  if (dirty.value) e.preventDefault();
};
window.addEventListener('beforeunload', unload);
onBeforeUnmount(() => window.removeEventListener('beforeunload', unload));
const detail = ref<Assignment>(),
  detailOpen = ref(false),
  historyOpen = ref(false);
function open(id: string, date: string) {
  const a = cell(id, date);
  if (a) {
    detail.value = a;
    detailOpen.value = true;
    historyOpen.value = false;
  } else if (permission.can('schedules', 'create'))
    router.push({ path: '/schedules/assign', query: { employee: id, date } });
}
const bulk = ref(false),
  formDepartment = ref(''),
  selected = ref<string[]>([]),
  formSearch = ref(''),
  scheduleType = ref<ScheduleType>('ROTATING'),
  start = ref(today),
  end = ref(today),
  choice = ref(''),
  method = ref('calendar'),
  pattern = ref<string[]>(Array(7).fill('OFF')),
  templateId = ref(''),
  note = ref(''),
  editing = ref<Assignment>(),
  preview = ref<Assignment[]>([]),
  previewOpen = ref(false);
const dayPlans = ref<DayPlan[]>([]);
const manualShifts = ref<Shift[]>([]);
const shiftsLoading = ref(false),
  shiftsError = ref('');
let shiftRequest = 0;
async function loadManualShifts() {
  const request = ++shiftRequest;
  shiftsLoading.value = true;
  shiftsError.value = '';
  manualShifts.value = [];
  const departmentCode =
    departmentRecords.all.value.find((d) => d.name === formDepartment.value)?.code || null;
  try {
    const shifts = await getDepartmentShifts(departmentCode, scheduleType.value);
    if (request !== shiftRequest) return;
    manualShifts.value = shifts;
    data.value.shifts = [
      ...data.value.shifts.filter((s) => !shifts.some((item) => item.id === s.id)),
      ...shifts,
    ];
  } catch (e) {
    if (request === shiftRequest) shiftsError.value = e instanceof Error ? e.message : String(e);
  } finally {
    if (request === shiftRequest) shiftsLoading.value = false;
  }
}
watch(formDepartment, () => {
  ++shiftRequest;
  manualShifts.value = [];
  shiftsLoading.value = false;
  shiftsError.value = '';
  if (!editing.value && scheduleType.value !== 'ADMINISTRATIVE') dayPlans.value = [];
});
watch(
  dayPlans,
  () => {
    dirty.value = true;
    preview.value = [];
  },
  { deep: true },
);
const eligible = computed(() =>
  staff.all.value.filter(
    (e) =>
      (!formDepartment.value || e.department === formDepartment.value) &&
      `${e.code} ${e.name}`.toLowerCase().includes(formSearch.value.toLowerCase()),
  ),
);
// The department API supplies codes/names; schedule configuration remains in its existing source.
function departmentScheduleType(departmentName = formDepartment.value): ScheduleType {
  const code = departmentRecords.all.value.find((d) => d.name === departmentName)?.code;
  return departmentSettings.all.value.find((d) => d.code === code || d.name === departmentName)
    ?.workSchedule === 'administrativeSchedule'
    ? 'ADMINISTRATIVE'
    : 'ROTATING';
}

const choices = computed(() =>
  data.value.shifts.filter((s) => s.active && s.scheduleType === scheduleType.value),
);
const calendarMode = ref<'week' | 'month'>('week'),
  calendarAnchor = ref(today);
const calendarRange = computed(() => {
  const first = new Date(calendarAnchor.value + 'T12:00:00');
  if (calendarMode.value === 'week') first.setDate(first.getDate() - ((first.getDay() + 6) % 7));
  else first.setDate(1);
  const last = new Date(first);
  if (calendarMode.value === 'week') last.setDate(last.getDate() + 6);
  else last.setMonth(last.getMonth() + 1, 0);
  return { start: dateKey(first), end: dateKey(last) };
});
function fillAdministrativePlans(reset = false) {
  const shift = data.value.shifts.find((item) => item.active && item.code === 'D');
  if (!formDepartment.value || !shift) {
    if (reset) dayPlans.value = [];
    return;
  }
  const roster = staff.all.value.filter((item) => item.department === formDepartment.value);
  const rows = reset ? [] : [...dayPlans.value];
  const existing = new Set(rows.map((plan) => `${plan.employeeId}:${plan.date}`));
  for (const employee of roster) {
    for (const date of range(calendarRange.value.start, calendarRange.value.end)) {
      if (isPastScheduleDate(date) || existing.has(`${employee.code}:${date}`)) continue;
      rows.push({
        employeeId: employee.code,
        date,
        shiftId: new Date(`${date}T12:00:00`).getDay() === 0 ? 'OFF' : shift.id,
        fullTime: true,
        note: '',
      });
    }
  }
  dayPlans.value = rows.sort((a, b) => a.date.localeCompare(b.date));
}
const activeTemplates = computed(() =>
  data.value.templates.filter(
    (t) =>
      t.active &&
      t.scheduleType === scheduleType.value &&
      (!t.department || t.department === formDepartment.value),
  ),
);
watch(
  [selected, scheduleType, start, end, choice, method, pattern, templateId, note, bulk],
  () => {
    dirty.value = true;
    preview.value = [];
  },
  { deep: true },
);
watch(scheduleType, () => {
  choice.value = '';
  templateId.value = '';
  pattern.value = Array(7).fill('OFF');
  if (!editing.value) {
    if (scheduleType.value === 'ADMINISTRATIVE') fillAdministrativePlans(true);
    else dayPlans.value = [];
  }
});
watch(formDepartment, () => {
  if (!editing.value) selected.value = [];
  templateId.value = '';
  if (!editing.value) scheduleType.value = departmentScheduleType();
  if (!editing.value && scheduleType.value === 'ADMINISTRATIVE') fillAdministrativePlans(true);
});
watch([() => departmentRecords.all.value, () => departmentSettings.all.value], () => {
  if (!editing.value && formDepartment.value) scheduleType.value = departmentScheduleType();
});
watch(
  () => data.value.shifts.length,
  () => {
    if (!editing.value && scheduleType.value === 'ADMINISTRATIVE' && formDepartment.value)
      fillAdministrativePlans();
  },
);
watch([calendarMode, calendarAnchor], () => {
  if (!editing.value && scheduleType.value === 'ADMINISTRATIVE' && formDepartment.value)
    fillAdministrativePlans();
});
function initialize() {
  editing.value = undefined;
  dayPlans.value = [];
  method.value = 'calendar';
  bulk.value = false;
  formDepartment.value = '';
  scheduleType.value = 'ROTATING';
  selected.value = route.query.employee ? [String(route.query.employee)] : [];
  start.value = String(route.query.date || today);
  end.value = start.value;
  calendarMode.value = 'week';
  calendarAnchor.value = start.value;
  const existing = data.value.assignments.find((a) => a.id === route.query.edit);
  if (existing) {
    editing.value = existing;
    selected.value = [existing.employeeId];
    formDepartment.value = String(
      staff.all.value.find((e) => e.code === existing.employeeId)?.department || '',
    );
    scheduleType.value = existing.scheduleType;
    start.value = end.value = existing.date;
    note.value = existing.note;
    setTimeout(() => {
      choice.value = existing.status === 'OFF' ? 'OFF' : existing.shiftId;
      dayPlans.value = [
        {
          employeeId: existing.employeeId,
          date: existing.date,
          shiftId: choice.value,
          fullTime: existing.fullTime !== false,
          note: existing.note,
          startTime: existing.startTime,
          endTime: existing.endTime,
          crossDay: existing.crossDay,
        },
      ];
      dirty.value = false;
    }, 0);
  } else if (selected.value.length) {
    const id = selected.value[0];
    formDepartment.value = String(staff.all.value.find((e) => e.code === id)?.department || '');
    scheduleType.value = departmentScheduleType();
    setTimeout(() => {
      selected.value = [id];
      dirty.value = false;
    }, 0);
  }
  if (!existing && scheduleType.value === 'ADMINISTRATIVE' && formDepartment.value)
    fillAdministrativePlans();
  setTimeout(() => {
    dirty.value = false;
  }, 0);
}
watch(() => route.fullPath, initialize);
watch(
  () => data.value.assignments.length,
  () => {
    if (route.query.edit && !editing.value) initialize();
  },
);
onMounted(initialize);
function makePreview() {
  error.value = '';
  if (
    method.value === 'calendar'
      ? dayPlans.value.some((p) => isPastScheduleDate(p.date))
      : isPastScheduleDate(start.value)
  ) {
    error.value = 'Không được phân công ngày trong quá khứ.';
    return;
  }
  if (!formDepartment.value) {
    error.value = 'Chọn bộ phận để xác định loại lịch phân công.';
    return;
  }
  if (
    method.value !== 'calendar' &&
    (!selected.value.length || (!bulk.value && selected.value.length !== 1))
  ) {
    error.value = 'Chọn nhân viên cần phân công.';
    return;
  }
  if (
    !start.value ||
    !end.value ||
    start.value > end.value ||
    range(start.value, end.value).length > 366
  ) {
    error.value = 'Khoảng ngày không hợp lệ (tối đa 366 ngày mỗi lần).';
    return;
  }
  if (method.value === 'calendar') {
    if (!dayPlans.value.length) {
      error.value = 'Chọn ít nhất một ngày trên lịch và ca cho ngày đó.';
      return;
    }
    if (dayPlans.value.some((p) => !staff.all.value.some((e) => e.code === p.employeeId))) {
      error.value = 'Nhân viên trong phân công không còn tồn tại.';
      return;
    }
    const rows: Assignment[] = dayPlans.value.map((p) => ({
      id: editing.value?.id || '',
      employeeId: p.employeeId,
      date: p.date,
      shiftId: p.shiftId === 'OFF' ? '' : p.shiftId,
      scheduleType: scheduleType.value,
      status: p.shiftId === 'OFF' ? ('OFF' as const) : ('SCHEDULED' as const),
      note: p.note,
      fullTime: p.fullTime,
      startTime: p.startTime,
      endTime: p.endTime,
      crossDay: p.crossDay,
      revision: editing.value?.revision || 0,
    }));
    if (
      rows.some((a) => a.status === 'SCHEDULED' && !choices.value.some((s) => s.id === a.shiftId))
    ) {
      error.value = 'Ca đã chọn không còn hoạt động hoặc không phù hợp loại lịch. Chọn lại ca.';
      return;
    }
    preview.value = rows;
    previewOpen.value = true;
    return;
  }
  const t = data.value.templates.find((t) => t.id === templateId.value && t.active);
  if (method.value === 'template' && !t) {
    error.value = 'Chọn mẫu đang hoạt động.';
    return;
  }
  const rows: Assignment[] = [];
  for (const id of selected.value)
    range(start.value, end.value).forEach((date, index) => {
      const dow = (new Date(date + 'T12:00:00').getDay() + 6) % 7;
      if (!editing.value && !bulk.value && scheduleType.value === 'ADMINISTRATIVE' && dow === 6)
        return;
      const shiftId =
        method.value === 'template' && t
          ? t.days[t.kind === 'WEEK' ? dow : index % t.days.length]
          : method.value === 'weekly'
            ? pattern.value[dow]
            : method.value === 'cycle'
              ? pattern.value[index % pattern.value.length]
              : choice.value;
      rows.push({
        id: editing.value?.id || '',
        employeeId: id,
        date,
        shiftId: shiftId === 'OFF' ? '' : shiftId,
        scheduleType: scheduleType.value,
        status: shiftId === 'OFF' ? 'OFF' : 'SCHEDULED',
        note: note.value,
        revision: editing.value?.revision || 0,
      });
    });
  if (
    !rows.length ||
    rows.some((a) => a.status === 'SCHEDULED' && !choices.value.some((s) => s.id === a.shiftId))
  ) {
    error.value = 'Chọn ca hợp lệ và ít nhất một ngày áp dụng.';
    return;
  }
  preview.value = rows;
  previewOpen.value = true;
}
const issues = computed(() => conflicts(data.value, preview.value));
function autoAssignRotating() {
  error.value = '';
  const roster = staff.all.value.filter((item) => item.department === formDepartment.value);
  if (!formDepartment.value || !roster.length) {
    error.value = 'Chọn bộ phận có nhân viên trước khi tự động xếp ca.';
    return;
  }
  if (roster.length > 1 && !permission.can('schedules', 'bulk')) {
    error.value = 'Bạn không có quyền phân công hàng loạt cho bộ phận này.';
    return;
  }
  try {
    preview.value = buildRotatingSchedule(
      roster.map((item) => item.code),
      calendarRange.value.start,
      calendarRange.value.end,
      data.value.shifts,
    );
    preview.value = preview.value.filter((a) => !isPastScheduleDate(a.date));
    if (!preview.value.length) throw new Error('Không có ngày hợp lệ để phân công.');
    previewOpen.value = true;
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  }
}
async function saveAssignments() {
  if (preview.value.some((a) => isPastScheduleDate(a.date))) {
    error.value = 'Không được phân công ngày trong quá khứ.';
    return;
  }
  if (issues.value.length) return;
  if (
    await run(() =>
      scheduleService.assign(
        preview.value.map((a) => ({ ...a })),
        manualShifts.value,
      ),
    )
  ) {
    previewOpen.value = false;
    router.push('/schedules');
  }
}
function editAssignment() {
  if (!detail.value) return;
  detailOpen.value = false;
  router.push({ path: '/schedules/assign', query: { edit: detail.value.id } });
}
const templateOpen = ref(false),
  templateRead = ref(false),
  template = ref<ScheduleTemplate>({
    id: '',
    name: '',
    scheduleType: 'ROTATING',
    department: '',
    active: true,
    kind: 'WEEK',
    days: Array(7).fill('OFF'),
    note: '',
  });
function openTemplate(t?: ScheduleTemplate, copy = false, read = false) {
  template.value = t
    ? { ...t, id: copy ? '' : t.id, name: t.name + (copy ? ' (bản sao)' : ''), days: [...t.days] }
    : {
        id: '',
        name: '',
        scheduleType: 'ROTATING',
        department: '',
        active: true,
        kind: 'WEEK',
        days: Array(7).fill('OFF'),
        note: '',
      };
  templateRead.value = read;
  templateOpen.value = true;
}
async function applyTemplate(t: ScheduleTemplate) {
  await router.push('/schedules/assign');
  bulk.value = true;
  scheduleType.value = t.scheduleType;
  formDepartment.value = t.department;
  method.value = 'template';
  setTimeout(() => {
    templateId.value = t.id;
  }, 0);
}
const swapOpen = ref(false),
  swapTab = ref('ALL'),
  swap = ref({ assignmentId: '', targetAssignmentId: '', shiftId: '', reason: '' }),
  swapMode = ref('employee'),
  swapDetail = ref<SwapRequest>(),
  swapDetailOpen = ref(false),
  decision = ref('');
const swapRows = computed(() =>
  data.value.swaps.filter(
    (s) =>
      swapTab.value === 'ALL' ||
      (swapTab.value === 'DONE' ? s.status !== 'PENDING' : s.status === 'PENDING'),
  ),
);
const scheduled = computed(() => data.value.assignments.filter((a) => a.status === 'SCHEDULED'));
function assignmentLabel(id: string) {
  const a = data.value.assignments.find((a) => a.id === id);
  return a ? `${name(a.employeeId)} · ${fmt(a.date)} · ${label(a)}` : 'Lịch không còn tồn tại';
}
const swapLabels = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
  CANCELLED: 'Đã hủy',
};
const reportMode = ref('employee'),
  reportStart = ref(today.slice(0, 7) + '-01'),
  reportEnd = ref(today);
const reportAssignments = computed(() =>
  data.value.assignments.filter(
    (a) =>
      a.date >= reportStart.value &&
      a.date <= reportEnd.value &&
      employees.value.some((e) => e.code === a.employeeId) &&
      matches(a),
  ),
);
const reports = computed(() => {
  if (reportMode.value === 'employee')
    return employees.value.map((e) => {
      const rows = reportAssignments.value.filter((a) => a.employeeId === e.code);
      return {
        key: e.code,
        name: name(e.code),
        sub: String(e.department),
        work: new Set(rows.filter((a) => a.status === 'SCHEDULED').map((a) => a.date)).size,
        off: new Set(rows.filter((a) => a.status === 'OFF').map((a) => a.date)).size,
        count: rows.filter((a) => a.status === 'SCHEDULED').length,
      };
    });
  if (reportMode.value === 'department')
    return departments.value
      .filter((d) => !department.value || d === department.value)
      .map((d) => {
        const ids = employees.value.filter((e) => e.department === d).map((e) => e.code),
          rows = reportAssignments.value.filter((a) => ids.includes(a.employeeId));
        return {
          key: d,
          name: d,
          sub: 'Bộ phận',
          work: ids.length,
          off: 0,
          count: rows.filter((a) => a.status === 'SCHEDULED').length,
        };
      });
  return data.value.shifts
    .filter(
      (s) =>
        (!shiftFilter.value || s.id === shiftFilter.value) &&
        (!type.value || s.scheduleType === type.value),
    )
    .map((s) => {
      const rows = reportAssignments.value.filter(
        (a) => a.status === 'SCHEDULED' && a.shiftId === s.id,
      );
      return {
        key: s.id,
        name: s.name,
        sub: shiftName(s.id),
        work: new Set(rows.map((a) => a.employeeId)).size,
        off: 0,
        count: rows.length,
      };
    });
});
const drill = ref<Assignment[]>([]),
  drillOpen = ref(false);
function drillReport(key: string) {
  drill.value = reportAssignments.value.filter((a) =>
    reportMode.value === 'employee'
      ? a.employeeId === key
      : reportMode.value === 'shift'
        ? a.shiftId === key
        : staff.all.value.find((e) => e.code === a.employeeId)?.department === key,
  );
  drillOpen.value = true;
}
function swapOriginal(request: SwapRequest, target = false) {
  return (
    (target ? request.targetSnapshot : request.sourceSnapshot) ||
    data.value.assignments.find(
      (a) => a.id === (target ? request.targetAssignmentId : request.assignmentId),
    )
  );
}
function swapBefore(request: SwapRequest, target = false) {
  const a = swapOriginal(request, target);
  return a ? `${name(a.employeeId)} · ${fmt(a.date)} · ${label(a)}` : 'Lịch không còn tồn tại';
}
watch(
  template,
  () => {
    if (templateOpen.value && !templateRead.value) dirty.value = true;
  },
  { deep: true },
);
watch(
  swap,
  () => {
    if (swapOpen.value) dirty.value = true;
  },
  { deep: true },
);
function swapAfter(request: SwapRequest, target = false) {
  const a = swapOriginal(request, target);
  const shiftId = target
    ? swapOriginal(request)?.shiftId
    : request.targetAssignmentId
      ? swapOriginal(request, true)?.shiftId
      : request.shiftId;
  return a
    ? `${name(a.employeeId)} · ${fmt(a.date)} · ${shiftName(shiftId || '')}`
    : 'Lịch không còn tồn tại';
}
</script>
<template>
  <div class="shift-module">
    <div class="page-heading">
      <div>
        <div class="eyebrow">VẬN HÀNH KHÁCH SẠN / XẾP CA</div>
        <h1>{{ title }}</h1>
        <p>Quản lý lịch hành chính và ca xoay của đội ngũ khách sạn</p>
      </div>
      <RouterLink
        v-if="page === 'calendar' && permission.can('schedules', 'create')"
        class="primary"
        to="/schedules/assign"
        >+ Phân công ca</RouterLink
      >
    </div>
    <nav class="tabs" aria-label="Xếp ca">
      <RouterLink
        v-for="m in menu"
        :key="m.key"
        :to="m.key === 'calendar' ? '/schedules' : '/schedules/' + m.key"
        :class="{ active: page === m.key }"
        >{{ m.label }}</RouterLink
      >
    </nav>
    <p class="demo">
      ⓘ Chế độ demo · Dữ liệu lưu trên trình duyệt. API xếp ca thật chưa được cung cấp.
    </p>
    <p
      v-if="error || staff.error.value || departmentRecords.error.value"
      class="error"
      role="alert"
    >
      {{ error || staff.error.value || departmentRecords.error.value }}
      <button
        @click="
          load();
          staff.load();
          departmentRecords.load();
        "
      >
        Tải lại dữ liệu
      </button>
    </p>
    <p v-if="loading || staff.loading.value || departmentRecords.loading.value" role="status">
      Đang tải dữ liệu xếp ca…
    </p>
    <template v-else>
      <section v-if="page === 'calendar' || page === 'reports'" class="panel filters">
        <label
          >Bộ phận<select v-model="department">
            <option value="">Tất cả bộ phận</option>
            <option v-for="d in departments" :key="d">{{ d }}</option>
          </select></label
        >
        <label
          >Nhân viên<select v-model="employee">
            <option value="">Tất cả nhân viên</option>
            <option v-for="e in staff.all.value" :key="e.code" :value="e.code">
              {{ name(e.code) }}
            </option>
          </select></label
        >
        <label
          >Loại lịch<select v-model="type">
            <option value="">Tất cả</option>
            <option value="ADMINISTRATIVE">Hành chính</option>
            <option value="ROTATING">Xoay ca</option>
          </select></label
        >
        <label
          >Ca<select v-model="shiftFilter">
            <option value="">Tất cả ca</option>
            <option v-for="s in data.shifts" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select></label
        >
        <label v-if="page === 'calendar'"
          >Trạng thái<select v-model="status">
            <option value="">Tất cả</option>
            <option value="SCHEDULED">Đã xếp</option>
            <option value="UNASSIGNED">Chưa xếp</option>
            <option value="OFF">Nghỉ</option>
            <option value="LEAVE">Nghỉ phép</option>
          </select></label
        >
        <label>Tìm kiếm<input v-model="search" placeholder="Mã NV hoặc họ tên" /></label>
      </section>
      <template v-if="page === 'calendar'">
        <div class="toolbar">
          <div class="actions">
            <button aria-label="Kỳ trước" @click="move(-1)">‹</button
            ><button @click="anchor = today">Hôm nay</button
            ><button aria-label="Kỳ sau" @click="move(1)">›</button
            ><strong>{{ fmt(dates[0]) }} – {{ fmt(dates[dates.length - 1]) }}</strong>
          </div>
          <div class="actions">
            <button
              v-for="v in [
                { id: 'day', name: 'Ngày' },
                { id: 'week', name: 'Tuần' },
                { id: 'month', name: 'Tháng' },
              ]"
              :key="v.id"
              :class="{ chosen: view === v.id }"
              @click="view = v.id"
            >
              {{ v.name }}
            </button>
          </div>
        </div>
        <div class="legend">
          <span v-for="s in data.shifts" :key="s.id"
            ><i :style="{ background: s.displayColor }" />{{ s.code }} · {{ s.name }}</span
          ><span>○ Nghỉ</span><span>◇ Nghỉ phép</span><span>— Chưa xếp</span
          ><span>↔ Chờ đổi ca</span>
        </div>
        <div v-if="!visibleEmployees.length" class="panel empty-state">
          Không tìm thấy nhân viên theo bộ lọc.
        </div>
        <template v-else
          ><p
            v-if="
              !data.assignments.some(
                (a) =>
                  dates.includes(a.date) && visibleEmployees.some((e) => e.code === a.employeeId),
              )
            "
            class="demo"
          >
            Chưa có lịch làm việc trong khoảng thời gian này. Chọn Phân công ca để lập lịch.
          </p>
          <section class="panel grid-wrap">
            <table class="grid">
              <thead>
                <tr>
                  <th>
                    NHÂN VIÊN<small>{{ visibleEmployees.length }} nhân viên</small>
                  </th>
                  <th
                    v-for="d in dates"
                    :key="d"
                    :class="{
                      today: d === today,
                      weekend: [0, 6].includes(new Date(d + 'T12:00:00').getDay()),
                    }"
                  >
                    {{ dayLabels[(new Date(d + 'T12:00:00').getDay() + 6) % 7]
                    }}<small>{{ fmt(d) }}</small>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="e in visibleEmployees" :key="e.code">
                  <th>
                    <strong>{{ e.name }}</strong
                    ><small>{{ e.code }} · {{ e.department }}</small>
                  </th>
                  <td
                    v-for="d in dates"
                    :key="d"
                    :class="{
                      today: d === today,
                      weekend: [0, 6].includes(new Date(d + 'T12:00:00').getDay()),
                    }"
                  >
                    <button
                      v-if="matches(cell(e.code, d))"
                      class="shift-cell"
                      :title="label(cell(e.code, d))"
                      :style="{
                        '--shift-color':
                          data.shifts.find((s) => s.id === cell(e.code, d)?.shiftId)
                            ?.displayColor || '#94a3b8',
                      }"
                      :disabled="!cell(e.code, d) && !permission.can('schedules', 'create')"
                      @click="open(e.code, d)"
                    >
                      <strong>{{
                        cell(e.code, d)?.status === 'SCHEDULED'
                          ? data.shifts.find((s) => s.id === cell(e.code, d)?.shiftId)?.name ||
                            '⚠ Ca chưa xác định'
                          : label(cell(e.code, d))
                      }}</strong
                      ><small v-if="cell(e.code, d)?.status === 'SCHEDULED'"
                        >{{
                          cell(e.code, d)?.startTime ||
                          data.shifts.find((s) => s.id === cell(e.code, d)?.shiftId)?.startTime
                        }}
                        –
                        {{
                          cell(e.code, d)?.endTime ||
                          data.shifts.find((s) => s.id === cell(e.code, d)?.shiftId)?.endTime
                        }}</small
                      ><small
                        v-if="data.shifts.find((s) => s.id === cell(e.code, d)?.shiftId)?.crossDay"
                        >+1 ngày</small
                      ><small v-if="cell(e.code, d)?.status === 'SCHEDULED'">{{
                        cell(e.code, d)?.fullTime === false ? '1/2 ca' : 'Cả ca'
                      }}</small
                      ><small v-if="pending(cell(e.code, d))">↔ Chờ duyệt đổi ca</small></button
                    ><span v-else>—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
          <section class="agenda">
            <article v-for="d in dates" :key="d" class="panel">
              <h3>{{ fmt(d) }} {{ d === today ? '· Hôm nay' : '' }}</h3>
              <button
                v-for="e in visibleEmployees.filter((e) => matches(cell(e.code, d)))"
                :key="e.code"
                @click="open(e.code, d)"
              >
                <strong>{{ name(e.code) }}</strong
                ><small
                  >{{ label(cell(e.code, d)) }}
                  {{ pending(cell(e.code, d)) ? '↔ Chờ đổi ca' : '' }}</small
                >
              </button>
            </article>
          </section></template
        >
      </template>
      <section
        v-if="page === 'assign'"
        class="panel form"
        @input="dirty = true"
        @change="dirty = true"
      >
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
              Cá nhân</button
            ><button
              v-if="permission.can('schedules', 'bulk')"
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
        <p v-if="!permission.can('schedules', editing ? 'edit' : bulk ? 'bulk' : 'create')">
          Bạn không có quyền phân công ca.
        </p>
        <template v-else
          ><div class="form-grid">
            <label
              >Bộ phận *<select v-model="formDepartment" :disabled="!!editing">
                <option value="">Chọn bộ phận</option>
                <option v-for="d in departments" :key="d">{{ d }}</option>
              </select></label
            >
          </div>
          <p v-if="formDepartment" class="department-schedule-type">
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
            <label v-if="bulk"
              ><input
                type="checkbox"
                :checked="!!eligible.length && eligible.every((e) => selected.includes(e.code))"
                @change="
                  selected = eligible.every((e) => selected.includes(e.code))
                    ? []
                    : eligible.map((e) => e.code)
                "
              />Chọn tất cả kết quả</label
            ><label v-for="e in eligible" :key="e.code"
              ><input v-if="bulk" v-model="selected" type="checkbox" :value="e.code" /><input
                v-else
                type="radio"
                name="employee"
                :checked="selected.includes(e.code)"
                :disabled="!!editing"
                @change="selected = [e.code]"
              />{{ name(e.code) }}</label
            >
            <p v-if="!eligible.length">Không tìm thấy nhân viên.</p>
          </div>
          <label v-if="bulk && !editing"
            >Cách phân công<select v-model="method">
              <option value="calendar">Chọn ngày trên lịch</option>
              <option value="single">Một ca cho khoảng ngày</option>
              <option value="weekly">Theo ngày trong tuần</option>
              <option value="template">Áp dụng mẫu lịch</option>
              <option value="cycle">Chu kỳ xoay ca</option>
            </select></label
          >
          <AssignmentCalendar
            v-if="method === 'calendar'"
            :key="editing?.id || start"
            v-model="dayPlans"
            :employees="
              (editing ? eligible.filter((e) => e.code === editing?.employeeId) : eligible).map(
                (e) => ({ code: e.code, name: e.name, department: String(e.department || '') }),
              )
            "
            :shifts="scheduleType === 'ADMINISTRATIVE' ? choices : manualShifts"
            :shifts-loading="shiftsLoading"
            :shifts-error="shiftsError"
            @request-shifts="loadManualShifts"
            :view-mode="calendarMode"
            :anchor-date="calendarAnchor"
            @update:view-mode="calendarMode = $event"
            @update:anchor-date="calendarAnchor = $event"
            :administrative="scheduleType === 'ADMINISTRATIVE'"
            :administrative-shift-id="data.shifts.find((s) => s.active && s.code === 'D')?.id"
            :initial-date="start"
            :fixed-date="editing?.date"
            :disabled="busy"
          />
          <div v-if="scheduleType === 'ROTATING'" class="auto-schedule">
            <h3>Tự động xếp ca xoay</h3>
            <p>
              Phạm vi {{ calendarMode === 'week' ? 'tuần' : 'tháng' }} đang xem · mỗi nhân viên nghỉ
              1 ngày/tuần · ca M/E tối đa 2 người mỗi ngày · ca N nhận phần còn lại.
              <template v-if="calendarMode === 'month'">
                Lịch tháng bao gồm trọn các tuần chạm vào tháng đã chọn.
              </template>
            </p>
          </div>
          <template v-else>
            <h3>2. Cấu hình phân công</h3>
            <div class="form-grid">
              <label
                >Từ ngày *<input
                  v-model="start"
                  type="date"
                  :min="systemToday()"
                  :disabled="!!editing" /></label
              ><label
                >Đến ngày *<input
                  v-model="end"
                  type="date"
                  :min="systemToday()"
                  :disabled="!!editing" /></label
              ><label v-if="!bulk || method === 'single'"
                >Ca *<select v-model="choice">
                  <option value="">Chọn ca</option>
                  <option v-for="s in choices" :key="s.id" :value="s.id">
                    {{ shiftName(s.id) }}
                  </option>
                  <option value="OFF">Nghỉ</option>
                </select></label
              ><label v-if="bulk && method === 'template'"
                >Mẫu lịch *<select v-model="templateId">
                  <option value="">Chọn mẫu</option>
                  <option v-for="t in activeTemplates" :key="t.id" :value="t.id">
                    {{ t.name }}
                  </option>
                </select></label
              >
            </div>
            <div v-if="bulk && ['weekly', 'cycle'].includes(method)" class="pattern">
              <label v-for="(_, i) in pattern" :key="i"
                >{{ method === 'weekly' ? dayLabels[i] : 'Ngày ' + (i + 1)
                }}<select v-model="pattern[i]">
                  <option value="OFF">Nghỉ</option>
                  <option v-for="s in choices" :key="s.id" :value="s.id">{{ s.name }}</option>
                </select></label
              ><button v-if="method === 'cycle'" @click="pattern.push('OFF')">+ Thêm ngày</button
              ><button v-if="method === 'cycle' && pattern.length > 1" @click="pattern.pop()">
                Bỏ ngày cuối
              </button>
            </div>
            <label>Ghi chú<textarea v-model="note" rows="3" /></label
          ></template>
          <div class="actions schedule-actions">
            <button
              v-if="scheduleType === 'ROTATING'"
              class="auto-schedule-button"
              :disabled="busy || !formDepartment"
              @click="autoAssignRotating"
            >
              Tự động xếp ca
            </button>
            <button
              class="primary"
              :disabled="busy || (method === 'calendar' ? !dayPlans.length : !selected.length)"
              @click="makePreview"
            >
              Xem trước phân công</button
            ><span>Không ghi đè lịch âm thầm.</span>
          </div></template
        >
      </section>
      <section v-if="page === 'templates'" class="panel form">
        <div class="toolbar">
          <div>
            <h2>Mẫu lịch tái sử dụng</h2>
            <p>Mẫu chỉ trở thành lịch thực tế khi được áp dụng.</p>
          </div>
          <button
            v-if="permission.can('schedules', 'create')"
            class="primary"
            @click="openTemplate()"
          >
            + Tạo mẫu
          </button>
        </div>
        <p v-if="!data.templates.length" class="empty-state">
          Chưa có mẫu lịch. Tạo mẫu để tái sử dụng khi phân công.
        </p>
        <article v-for="t in data.templates" :key="t.id" class="template-card">
          <div class="toolbar">
            <h3>{{ t.name }}</h3>
            <span>{{ t.active ? 'Hoạt động' : 'Ngừng sử dụng' }}</span>
          </div>
          <p>
            {{ t.scheduleType === 'ADMINISTRATIVE' ? 'Hành chính' : 'Xoay ca' }} ·
            {{ t.department || 'Tất cả bộ phận' }} ·
            {{ t.kind === 'WEEK' ? 'Tuần' : 'Chu kỳ ' + t.days.length + ' ngày' }}
          </p>
          <div class="pattern">
            <span v-for="(id, i) in t.days" :key="i"
              ><small>{{ t.kind === 'WEEK' ? dayLabels[i] : i + 1 }}</small
              >{{ id === 'OFF' ? 'Nghỉ' : data.shifts.find((s) => s.id === id)?.name }}</span
            >
          </div>
          <div class="actions">
            <button @click="openTemplate(t, false, true)">Xem</button
            ><button v-if="permission.can('schedules', 'edit')" @click="openTemplate(t)">Sửa</button
            ><button v-if="permission.can('schedules', 'create')" @click="openTemplate(t, true)">
              Nhân bản</button
            ><button
              v-if="permission.can('schedules', 'edit')"
              :disabled="busy"
              @click="
                run(() => scheduleService.template({ ...t, days: [...t.days], active: !t.active }))
              "
            >
              {{ t.active ? 'Ngừng sử dụng' : 'Kích hoạt' }}</button
            ><button
              v-if="t.active && permission.can('schedules', 'bulk')"
              @click="applyTemplate(t)"
            >
              Áp dụng mẫu
            </button>
          </div>
        </article>
      </section>
      <section v-if="page === 'swaps'" class="panel form">
        <div class="toolbar">
          <div class="actions">
            <button @click="swapTab = 'ALL'">Yêu cầu</button
            ><button v-if="permission.can('schedules', 'approve')" @click="swapTab = 'PENDING'">
              Chờ tôi duyệt</button
            ><button @click="swapTab = 'DONE'">Đã xử lý</button>
          </div>
          <button
            v-if="permission.can('schedules', 'create')"
            class="primary"
            @click="
              swap = { assignmentId: '', targetAssignmentId: '', shiftId: '', reason: '' };
              swapOpen = true;
            "
          >
            + Tạo yêu cầu
          </button>
        </div>
        <div class="table-scroll">
          <table class="report">
            <thead>
              <tr>
                <th>Mã yêu cầu</th>
                <th>Ca hiện tại</th>
                <th>Đổi với / ca sau đổi</th>
                <th>Lý do</th>
                <th>Ngày gửi</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in swapRows" :key="s.id">
                <td>{{ s.code }}</td>
                <td>{{ assignmentLabel(s.assignmentId) }}</td>
                <td>
                  {{
                    s.targetAssignmentId
                      ? assignmentLabel(s.targetAssignmentId)
                      : shiftName(s.shiftId)
                  }}
                </td>
                <td>{{ s.reason }}</td>
                <td>{{ new Date(s.createdAt).toLocaleString('vi-VN') }}</td>
                <td>{{ swapLabels[s.status] }}</td>
                <td>
                  <button
                    @click="
                      swapDetail = s;
                      decision = '';
                      swapDetailOpen = true;
                    "
                  >
                    Xem
                  </button>
                </td>
              </tr>
              <tr v-if="!swapRows.length">
                <td colspan="7" class="empty-state">Không có yêu cầu trong trạng thái này.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section v-if="page === 'reports'" class="panel form">
        <div class="toolbar">
          <div class="actions">
            <button
              v-for="r in [
                { id: 'employee', name: 'Theo nhân viên' },
                { id: 'department', name: 'Theo bộ phận' },
                { id: 'shift', name: 'Theo ca' },
              ]"
              :key="r.id"
              :class="{ chosen: reportMode === r.id }"
              @click="reportMode = r.id"
            >
              {{ r.name }}
            </button>
          </div>
          <label>Từ ngày<input v-model="reportStart" type="date" /></label
          ><label>Đến ngày<input v-model="reportEnd" type="date" /></label>
        </div>
        <p>Tổng hợp từ lịch đã phân công; không tính công, OT hoặc giờ tính lương.</p>
        <p v-if="reportStart > reportEnd" class="error">Từ ngày không được lớn hơn đến ngày.</p>
        <div v-else class="table-scroll">
          <table class="report">
            <thead>
              <tr>
                <th>
                  {{
                    reportMode === 'employee'
                      ? 'Nhân viên'
                      : reportMode === 'department'
                        ? 'Bộ phận'
                        : 'Ca'
                  }}
                </th>
                <th>{{ reportMode === 'employee' ? 'Ngày làm' : 'Số nhân viên' }}</th>
                <th v-if="reportMode === 'employee'">Ngày nghỉ</th>
                <th>Số phân công</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in reports" :key="r.key">
                <td>
                  <strong>{{ r.name }}</strong
                  ><small>{{ r.sub }}</small>
                </td>
                <td>{{ r.work }}</td>
                <td v-if="reportMode === 'employee'">{{ r.off }}</td>
                <td>{{ r.count }}</td>
                <td><button @click="drillReport(r.key)">Xem lịch</button></td>
              </tr>
              <tr v-if="!reportAssignments.length">
                <td colspan="5" class="empty-state">
                  Chưa có lịch phù hợp trong khoảng ngày đã chọn.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
    <Drawer
      v-model:visible="detailOpen"
      header="Chi tiết phân công"
      position="right"
      class="schedule-drawer"
      ><template v-if="detail"
        ><h3>{{ name(detail.employeeId) }}</h3>
        <p>
          {{ fmt(detail.date) }} ·
          {{ detail.scheduleType === 'ADMINISTRATIVE' ? 'Hành chính' : 'Xoay ca' }}
        </p>
        <p>{{ label(detail) }}</p>
        <p>{{ detail.note || 'Chưa có ghi chú' }}</p>
        <p v-if="pending(detail)">↔ Có yêu cầu đổi ca chờ duyệt</p>
        <div class="actions">
          <button @click="historyOpen = !historyOpen">Lịch sử</button
          ><button v-if="permission.can('schedules', 'edit')" @click="editAssignment">
            Sửa phân công
          </button>
        </div>
        <ul v-if="historyOpen">
          <li v-for="(h, i) in data.history.filter((h) => h.assignmentId === detail?.id)" :key="i">
            {{ h.action }} · {{ new Date(h.date).toLocaleString('vi-VN') }}
          </li>
          <li v-if="!data.history.some((h) => h.assignmentId === detail?.id)">
            Chưa có lịch sử thay đổi.
          </li>
        </ul></template
      ></Drawer
    >
    <Dialog
      v-model:visible="previewOpen"
      modal
      header="Xem trước phân công"
      :style="{ width: '900px', maxWidth: '95vw' }"
      ><div class="schedule-dialog">
        <p>
          {{ preview.length }} phân công ·
          {{ new Set(preview.map((a) => a.employeeId)).size }}
          nhân viên
        </p>
        <div v-if="issues.length" class="error">
          <strong>⚠ {{ issues.length }} xung đột — không thể lưu</strong>
          <p v-for="(i, index) in issues" :key="index">
            {{ name(i.row.employeeId) }} · {{ fmt(i.row.date) }}<br />Ca mới: {{ label(i.row)
            }}<br />Đã có: {{ label(i.existing) }} · {{ fmt(i.existing.date) }}<br />{{ i.reason }}
          </p>
        </div>
        <div class="table-scroll preview-table">
          <table class="report">
            <thead>
              <tr>
                <th>Nhân viên</th>
                <th>Ngày</th>
                <th>Ca dự kiến</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(a, i) in preview" :key="i">
                <td>{{ name(a.employeeId) }}</td>
                <td>{{ fmt(a.date) }}</td>
                <td>{{ label(a) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <div class="actions">
          <button :disabled="busy" @click="previewOpen = false">Quay lại</button
          ><button
            class="primary"
            :disabled="busy || !!issues.length || !preview.length"
            @click="saveAssignments"
          >
            {{ busy ? 'Đang lưu…' : 'Lưu phân công' }}
          </button>
        </div>
      </div></Dialog
    >
    <Dialog
      v-model:visible="templateOpen"
      modal
      :header="templateRead ? 'Chi tiết mẫu lịch' : 'Cấu hình mẫu lịch'"
      :style="{ width: '800px', maxWidth: '95vw' }"
      ><div class="schedule-dialog">
        <fieldset :disabled="templateRead || busy">
          <div class="form-grid">
            <label>Tên mẫu *<input v-model="template.name" /></label
            ><label
              >Loại lịch<select
                v-model="template.scheduleType"
                @change="template.days = Array(template.days.length).fill('OFF')"
              >
                <option value="ADMINISTRATIVE">Hành chính</option>
                <option value="ROTATING">Xoay ca</option>
              </select></label
            ><label
              >Bộ phận<select v-model="template.department">
                <option value="">Tất cả</option>
                <option v-for="d in departments" :key="d">{{ d }}</option>
              </select></label
            ><label
              >Loại mẫu<select
                v-model="template.kind"
                @change="template.days = Array(7).fill('OFF')"
              >
                <option value="WEEK">Mẫu tuần</option>
                <option value="CYCLE">Chu kỳ xoay</option>
              </select></label
            >
          </div>
          <div class="pattern">
            <label v-for="(_, i) in template.days" :key="i"
              >{{ template.kind === 'WEEK' ? dayLabels[i] : 'Ngày ' + (i + 1)
              }}<select v-model="template.days[i]">
                <option value="OFF">Nghỉ</option>
                <option
                  v-for="s in data.shifts.filter(
                    (s) => s.active && s.scheduleType === template.scheduleType,
                  )"
                  :key="s.id"
                  :value="s.id"
                >
                  {{ s.name }}
                </option>
              </select></label
            ><button v-if="template.kind === 'CYCLE'" @click="template.days.push('OFF')">
              + Thêm ngày</button
            ><button
              v-if="template.kind === 'CYCLE' && template.days.length > 1"
              @click="template.days.pop()"
            >
              Bỏ ngày cuối
            </button>
          </div>
          <label>Ghi chú<textarea v-model="template.note" /></label>
        </fieldset>
        <p v-if="error" class="error">{{ error }}</p>
        <button
          v-if="!templateRead"
          class="primary"
          :disabled="busy"
          @click="
            run(() => scheduleService.template({ ...template, days: [...template.days] })).then(
              (ok) => {
                if (ok) templateOpen = false;
              },
            )
          "
        >
          {{ busy ? 'Đang lưu…' : 'Lưu mẫu' }}
        </button>
      </div></Dialog
    >
    <Dialog
      v-model:visible="swapOpen"
      modal
      header="Tạo yêu cầu đổi ca"
      :style="{ width: '650px', maxWidth: '95vw' }"
      ><div class="schedule-dialog">
        <label
          >Ca muốn đổi *<select v-model="swap.assignmentId">
            <option value="">Chọn ca đã phân công</option>
            <option v-for="a in scheduled" :key="a.id" :value="a.id">
              {{ assignmentLabel(a.id) }}
            </option>
          </select></label
        ><label
          >Hình thức<select
            v-model="swapMode"
            @change="
              swap.targetAssignmentId = '';
              swap.shiftId = '';
            "
          >
            <option value="employee">Đổi với nhân viên khác</option>
            <option value="shift">Xin đổi sang ca khác</option>
          </select></label
        ><label v-if="swapMode === 'employee'"
          >Ca của nhân viên đổi cùng<select v-model="swap.targetAssignmentId">
            <option value="">Chọn nhân viên / ca</option>
            <option
              v-for="a in scheduled.filter(
                (a) =>
                  a.employeeId !==
                  data.assignments.find((s) => s.id === swap.assignmentId)?.employeeId,
              )"
              :key="a.id"
              :value="a.id"
            >
              {{ assignmentLabel(a.id) }}
            </option>
          </select></label
        ><label v-else
          >Ca muốn đổi sang<select v-model="swap.shiftId">
            <option value="">Chọn ca</option>
            <option v-for="s in data.shifts.filter((s) => s.active)" :key="s.id" :value="s.id">
              {{ shiftName(s.id) }}
            </option>
          </select></label
        ><label>Lý do *<textarea v-model="swap.reason" /></label>
        <p v-if="error" class="error">{{ error }}</p>
        <button
          class="primary"
          :disabled="busy"
          @click="
            run(() => scheduleService.request({ ...swap })).then((ok) => {
              if (ok) swapOpen = false;
            })
          "
        >
          {{ busy ? 'Đang gửi…' : 'Gửi yêu cầu' }}
        </button>
      </div></Dialog
    >
    <Drawer
      v-model:visible="swapDetailOpen"
      header="Chi tiết yêu cầu đổi ca"
      position="right"
      class="schedule-drawer"
      ><template v-if="swapDetail"
        ><h3>{{ swapDetail.code }} · {{ swapLabels[swapDetail.status] }}</h3>
        <h4>Trước khi đổi</h4>
        <p>{{ swapBefore(swapDetail) }}</p>
        <p v-if="swapDetail.targetAssignmentId">
          {{ swapBefore(swapDetail, true) }}
        </p>
        <h4>Sau khi đổi (dự kiến)</h4>
        <p>{{ swapAfter(swapDetail) }}</p>
        <p v-if="swapDetail.targetAssignmentId">{{ swapAfter(swapDetail, true) }}</p>
        <p>Lý do: {{ swapDetail.reason }}</p>
        <p v-if="swapDetail.decision">Phản hồi: {{ swapDetail.decision }}</p>
        <template v-if="swapDetail.status === 'PENDING' && permission.can('schedules', 'approve')"
          ><label>Phản hồi / lý do từ chối<textarea v-model="decision" /></label>
          <p v-if="error" class="error">{{ error }}</p>
          <div class="actions">
            <button
              :disabled="busy"
              @click="
                run(() => scheduleService.decide(swapDetail!.id, false, decision)).then((ok) => {
                  if (ok) swapDetailOpen = false;
                })
              "
            >
              Từ chối</button
            ><button
              class="primary"
              :disabled="busy"
              @click="
                run(() => scheduleService.decide(swapDetail!.id, true, decision)).then((ok) => {
                  if (ok) swapDetailOpen = false;
                })
              "
            >
              Duyệt đổi ca
            </button>
          </div></template
        ></template
      ></Drawer
    >
    <Dialog
      v-model:visible="drillOpen"
      modal
      header="Lịch chi tiết"
      :style="{ width: '800px', maxWidth: '95vw' }"
      ><div class="table-scroll schedule-dialog">
        <table class="report">
          <thead>
            <tr>
              <th>Nhân viên</th>
              <th>Ngày</th>
              <th>Phân công</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in drill" :key="a.id">
              <td>{{ name(a.employeeId) }}</td>
              <td>{{ fmt(a.date) }}</td>
              <td>{{ label(a) }}</td>
            </tr>
            <tr v-if="!drill.length">
              <td colspan="3">Chưa có lịch phù hợp.</td>
            </tr>
          </tbody>
        </table>
      </div></Dialog
    >
  </div>
</template>
<style>
.shift-module,
.schedule-dialog,
.schedule-drawer {
  --accent: #2563eb;
}
.shift-module button,
.schedule-dialog button,
.schedule-drawer button,
.shift-module .primary {
  border: 1px solid #dbe3ee;
  background: white;
  border-radius: 8px;
  padding: 9px 13px;
  color: #334155;
  cursor: pointer;
  text-decoration: none;
  font: inherit;
}
.shift-module button:disabled,
.schedule-dialog button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.shift-module .primary,
.schedule-dialog .primary,
.schedule-drawer .primary,
.shift-module .chosen {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}
.shift-module .tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  border-bottom: 1px solid #dbe3ee;
  margin-bottom: 16px;
}
.shift-module .tabs a {
  padding: 14px;
  color: #64748b;
  text-decoration: none;
  border-bottom: 3px solid transparent;
}
.shift-module .tabs .active {
  border-color: #2563eb;
  color: #2563eb;
  font-weight: 700;
}
.shift-module .demo {
  padding: 12px 16px;
  background: #eff6ff;
  color: #475569;
  border-radius: 8px;
  font-size: 13px;
}
.shift-module .error,
.schedule-dialog .error,
.schedule-drawer .error {
  background: #fff1f2;
  color: #9f1239;
  padding: 14px;
  border-radius: 8px;
  white-space: pre-line;
}
.shift-module .filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
  gap: 12px;
  padding: 16px;
  margin: 16px 0;
}
.shift-module label,
.schedule-dialog label,
.schedule-drawer label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}
.shift-module input:not([type='checkbox']):not([type='radio']),
.shift-module select,
.shift-module textarea,
.schedule-dialog input,
.schedule-dialog select,
.schedule-dialog textarea,
.schedule-drawer textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  padding: 10px;
  background: white;
  color: #334155;
  font: inherit;
  min-width: 0;
}
.shift-module .toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin: 16px 0;
}
.shift-module .actions,
.schedule-dialog .actions,
.schedule-drawer .actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.shift-module .schedule-actions {
  gap: 12px;
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}
.shift-module .schedule-actions button {
  min-width: 190px;
  min-height: 44px;
  font-weight: 650;
}
.shift-module .schedule-actions .auto-schedule-button {
  color: #0f766e;
  background: #f0fdfa;
  border-color: #99f6e4;
}
.shift-module .schedule-actions .auto-schedule-button:hover:not(:disabled) {
  background: #ccfbf1;
  border-color: #5eead4;
}
.shift-module .actions label {
  flex-direction: row;
  align-items: center;
}
.shift-module .legend {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin: 20px 0;
  font-size: 12px;
  color: #64748b;
}
.shift-module .legend span {
  display: flex;
  align-items: center;
  gap: 6px;
}
.shift-module .legend i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}
.shift-module .grid-wrap {
  overflow: auto;
  max-height: 65vh;
}
.shift-module .grid {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  font-size: 13px;
}
.shift-module .grid th,
.shift-module .grid td {
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  border-right: 1px solid #eef2f6;
  min-width: 140px;
  background: white;
}
.shift-module .grid thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #f8fafc;
  text-align: center;
}
.shift-module .grid tr > th:first-child {
  position: sticky;
  left: 0;
  min-width: 240px;
  text-align: left;
  z-index: 1;
}
.shift-module .grid thead th:first-child {
  z-index: 3;
}
.shift-module small,
.schedule-dialog small {
  display: block;
  color: #64748b;
  margin-top: 6px;
  font-weight: 400;
}
.shift-module .grid .weekend {
  background: #f8fafc;
}
.shift-module .grid .today {
  background: #eff6ff;
}
.shift-module .shift-cell {
  border-left: 3px solid var(--shift-color);
  width: 100%;
  min-height: 76px;
  text-align: left;
  padding: 10px 8px;
}
.shift-module .shift-cell strong {
  color: var(--shift-color);
  font-size: 12px;
}
.shift-module .form {
  padding: 24px;
}
.shift-module .form h2 {
  margin: 0;
}
.shift-module .form-grid,
.schedule-dialog .form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin: 16px 0;
}
.shift-module .employee-picker {
  max-height: 220px;
  overflow: auto;
  background: #f8fafc;
  padding: 16px;
  margin: 12px 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.shift-module .employee-picker label {
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
}
.shift-module .pattern,
.schedule-dialog .pattern {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 20px 0;
}
.shift-module .pattern label,
.schedule-dialog .pattern label {
  flex: 1;
  min-width: 100px;
}
.shift-module .pattern span {
  background: #f1f5f9;
  border-radius: 8px;
  padding: 10px;
  font-size: 12px;
}
.shift-module .template-card {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  margin: 16px 0;
}
.shift-module textarea,
.schedule-dialog textarea {
  margin-bottom: 16px;
}
.shift-module .report,
.schedule-dialog .report {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.shift-module .report th,
.shift-module .report td,
.schedule-dialog .report th,
.schedule-dialog .report td {
  padding: 14px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}
.shift-module .report th,
.schedule-dialog .report th {
  background: #f8fafc;
  color: #64748b;
}
.schedule-dialog .preview-table {
  max-height: 45vh;
  overflow: auto;
  margin-bottom: 20px;
}
.schedule-dialog fieldset {
  border: 0;
  padding: 0;
}
.shift-module .agenda {
  display: none;
}
.schedule-dialog > label {
  margin-bottom: 16px;
}
.schedule-drawer {
  width: min(520px, 95vw) !important;
}
.schedule-drawer textarea {
  min-height: 90px;
  margin: 12px 0;
}
.shift-module :focus-visible,
.schedule-dialog :focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 3px;
}
@media (max-width: 767px) {
  .shift-module .grid-wrap {
    display: none;
  }
  .shift-module .agenda {
    display: grid;
    gap: 12px;
  }
  .shift-module .agenda article {
    padding: 16px;
  }
  .shift-module .agenda button {
    display: block;
    width: 100%;
    text-align: left;
    margin: 10px 0;
  }
  .shift-module .form-grid,
  .schedule-dialog .form-grid,
  .shift-module .employee-picker {
    grid-template-columns: 1fr;
  }
  .shift-module .form {
    padding: 16px;
  }
  .shift-module .tabs a {
    font-size: 12px;
    padding: 10px;
  }
  .shift-module .filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
