<script setup lang="ts">
import {
  createBulkAssignments,
  mapBulkAssignments,
} from '@/services/modules/schedule-bulk.service';
import { computed, onMounted, ref, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import { type DayPlan } from '@/components/schedules/AssignmentCalendar.vue';
import ScheduleAssignmentDialogs from '@/components/schedules/dialogs/ScheduleAssignmentDialogs.vue';
import ScheduleDrillDialog from '@/components/schedules/dialogs/ScheduleDrillDialog.vue';
import ScheduleSwapDialogs from '@/components/schedules/dialogs/ScheduleSwapDialogs.vue';
import ScheduleTemplateDialog from '@/components/schedules/dialogs/ScheduleTemplateDialog.vue';
import ScheduleAssignmentTab from '@/components/schedules/tabs/ScheduleAssignmentTab.vue';
import ScheduleCalendarTab from '@/components/schedules/tabs/ScheduleCalendarTab.vue';
import ScheduleModuleNavigation from '@/components/schedules/tabs/ScheduleModuleNavigation.vue';
import ScheduleReportsTab from '@/components/schedules/tabs/ScheduleReportsTab.vue';
import ScheduleSwapsTab from '@/components/schedules/tabs/ScheduleSwapsTab.vue';
import ScheduleTemplatesTab from '@/components/schedules/tabs/ScheduleTemplatesTab.vue';
import { employeeService } from '@/services/modules/employee.service';
import {
  getEmployeesMissingSchedule,
  getScheduleAssignments,
  type UnscheduledScheduleEmployee,
} from '@/services/modules/schedule-assignment.service';
import type { HrRecord } from '@/types/common';

import { usePermission } from '@/composables/usePermission';
import { useToast } from '@/composables/useToast';
import { scheduleService, conflicts } from '@/services/modules/schedule.service';
import { fillUnassignedPlans } from '@/utils/schedule-fill';
import { scheduleRange } from '@/utils/schedule-range';
import { isPastScheduleDate } from '@/utils/schedule-date';
import {
  getScheduleDepartments,
  getScheduleDepartmentGroups,
  type ScheduleDepartmentGroup,
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
  toast = useToast();
const staff = {
  all: ref<HrRecord[]>([]),
  loading: ref(false),
  error: ref(''),
  async load() {
    staff.loading.value = true;
    staff.error.value = '';
    try {
      staff.all.value = (await employeeService.list(null)).map((item) => ({
        id: item.maNhanVien,
        code: item.maNhanVien,
        name: String(item.hoTen || [item.ho, item.tenDem, item.ten].filter(Boolean).join(' ')),
        department: String(item.tenBoPhan || ''),
        position: String(item.tenChucVu || ''),
        positionCode: item.maChucVu == null ? '' : String(item.maChucVu),
        status: String(item.trangThaiNhanVien ?? ''),
      }));
    } catch (e) {
      staff.error.value = e instanceof Error ? e.message : String(e);
    } finally {
      staff.loading.value = false;
    }
  },
};
onMounted(() => staff.load());
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
const departmentGroups = ref<ScheduleDepartmentGroup[]>([]);
const unclassifiedDepartments = ref<ScheduleDepartment[]>([]);
const treeLoading = ref(false),
  treeError = ref('');
let treeRequest = 0;
async function loadDepartmentTree() {
  const request = ++treeRequest;
  treeLoading.value = true;
  treeError.value = '';
  try {
    const result = await getScheduleDepartmentGroups(departmentRecords.all.value);
    if (request !== treeRequest) return;
    departmentGroups.value = result.groups;
    unclassifiedDepartments.value = result.unavailable;
  } catch (e) {
    if (request === treeRequest) treeError.value = e instanceof Error ? e.message : String(e);
  } finally {
    if (request === treeRequest) treeLoading.value = false;
  }
}
watch(
  () => departmentRecords.all.value,
  () => {
    void loadDepartmentTree();
  },
);
const data = ref<ScheduleData>({
  shifts: [],
  assignments: [],
  templates: [],
  swaps: [],
  history: [],
});
const scheduleEmployees = ref<UnscheduledScheduleEmployee[]>([]);
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
  view = ref('week');
function range(start: string, end: string) {
  const out: string[] = [];
  const d = new Date(start + 'T12:00:00');
  while (dateKey(d) <= end && out.length < 367) {
    out.push(dateKey(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}
const displayedRange = computed(() => scheduleRange(anchor.value, view.value));
const dates = computed(() => range(displayedRange.value.from, displayedRange.value.to));
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
function employeeName(id: string) {
  return staff.all.value.find((employee) => employee.code === id)?.name || id;
}
function shiftName(id: string) {
  if (id === 'OFF') return 'Nghỉ';
  const s = data.value.shifts.find((s) => s.id === id);
  return s
    ? `${s.name} · ${s.startTime}–${s.endTime}${s.crossDay ? ' (+1 ngày)' : ''}`
    : '⚠ Ca chưa có trong danh mục';
}
function employeeAssignments(id: string) {
  return data.value.assignments
    .filter((a) => a.employeeId === id && dates.value.includes(a.date) && matches(a))
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) || (a.startTime || '').localeCompare(b.startTime || ''),
    );
}
function symbol(a: Assignment) {
  return a.shiftSymbol || data.value.shifts.find((s) => s.id === a.shiftId)?.code || a.shiftId;
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
            ? `${a.shiftName || data.value.shifts.find((s) => s.id === a.shiftId)?.name || a.shiftId} · ${a.startTime}–${a.endTime}${a.crossDay ? ' (+1 ngày)' : ''}`
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
let calendarRequest = 0;
async function load() {
  const request = ++calendarRequest;
  loading.value = true;
  error.value = '';
  try {
    if (page.value === 'calendar') {
      const calendar = await getScheduleAssignments(
        displayedRange.value.from,
        displayedRange.value.to,
      );
      if (request !== calendarRequest) return;
      data.value = { ...data.value, ...calendar };
    } else if (page.value === 'assign') {
      const stored = await scheduleService.load();
      if (request !== calendarRequest) return;
      data.value = stored;
    } else {
      const stored = await scheduleService.load();
      if (request !== calendarRequest) return;
      data.value = stored;
    }
  } catch (e) {
    if (request === calendarRequest) error.value = e instanceof Error ? e.message : String(e);
  } finally {
    if (request === calendarRequest) loading.value = false;
  }
}
onMounted(load);
let scheduleEmployeeRequest = 0;
async function loadScheduleEmployees() {
  if (page.value !== 'assign') return;
  const request = ++scheduleEmployeeRequest;
  const { start, end } = scheduleEmployeeRange.value;
  try {
    const employees = await getEmployeesMissingSchedule(start, end);
    if (request === scheduleEmployeeRequest && page.value === 'assign')
      scheduleEmployees.value = employees;
  } catch (e) {
    if (request === scheduleEmployeeRequest)
      error.value = e instanceof Error ? e.message : String(e);
  }
}
onMounted(loadScheduleEmployees);
watch([page, () => displayedRange.value.from, () => displayedRange.value.to], ([currentPage]) => {
  if (currentPage === 'calendar') void load();
});
watch(page, () => {
  if (page.value !== 'calendar') void load();
});
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
  if (!departmentCode) {
    shiftsLoading.value = false;
    return;
  }
  try {
    const [shifts, calendar] = await Promise.all([
      getDepartmentShifts(departmentCode, scheduleType.value),
      getScheduleAssignments(calendarRange.value.start, calendarRange.value.end),
    ]);
    if (request !== shiftRequest) return;
    data.value.assignments = calendar.assignments;
    manualShifts.value = shifts;
    if (!editing.value) scheduleType.value = shifts[0]?.scheduleType || 'ROTATING';
    data.value.shifts = [
      ...data.value.shifts.filter((s) => !shifts.some((item) => item.id === s.id)),
      ...shifts,
    ];
    if (!editing.value && scheduleType.value === 'ADMINISTRATIVE') fillAdministrativePlans();
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
  if (!editing.value) dayPlans.value = [];
});
watch(
  dayPlans,
  () => {
    dirty.value = true;
    preview.value = [];
  },
  { deep: true },
);
const departmentRoster = computed(() => {
  const departmentCode =
    departmentRecords.all.value.find((item) => item.name === formDepartment.value)?.code || '';
  return scheduleEmployees.value
    .filter(
      (item) =>
        !formDepartment.value ||
        item.maBoPhan === departmentCode ||
        item.tenBoPhan === formDepartment.value,
    )
    .map((item) => ({
      code: item.maNhanVien,
      name: item.hoTen,
      department: item.tenBoPhan || '',
    }));
});
const eligible = computed(() => {
  const roster = editing.value
    ? staff.all.value
        .filter((item) => item.code === editing.value?.employeeId)
        .map((item) => ({
          code: item.code,
          name: item.name,
          department: String(item.department || ''),
        }))
    : departmentRoster.value;
  return roster.filter((item) =>
    `${item.code} ${item.name}`.toLowerCase().includes(formSearch.value.toLowerCase()),
  );
});
function departmentScheduleType(): ScheduleType {
  return manualShifts.value[0]?.scheduleType || 'ROTATING';
}

const choices = computed(() =>
  manualShifts.value.filter((s) => s.active && s.scheduleType === scheduleType.value),
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
const scheduleEmployeeRange = computed(() => {
  return calendarRange.value;
});
watch(
  [page, () => scheduleEmployeeRange.value.start, () => scheduleEmployeeRange.value.end],
  ([currentPage]) => {
    if (currentPage === 'assign') void loadScheduleEmployees();
  },
);
function fillAdministrativePlans(reset = false) {
  const shift = manualShifts.value.find(
    (item) => item.active && item.scheduleType === 'ADMINISTRATIVE',
  );
  if (!formDepartment.value || !shift) {
    if (reset) dayPlans.value = [];
    return;
  }
  const roster = departmentRoster.value;
  dayPlans.value = fillUnassignedPlans(
    roster,
    range(calendarRange.value.start, calendarRange.value.end),
    shift,
    data.value.assignments,
    reset ? [] : dayPlans.value,
  ).filter(
    (plan) =>
      !scheduleEmployees.value.some(
        (item) => item.maNhanVien === plan.employeeId && item.danhSachNgayXepCa.includes(plan.date),
      ),
  );
}
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

watch([formDepartment, calendarMode, calendarAnchor, () => departmentRecords.all.value], () => {
  if (page.value === 'assign' && formDepartment.value) void loadManualShifts();
});
watch(
  () => scheduleEmployees.value,
  () => {
    if (!editing.value && scheduleType.value === 'ADMINISTRATIVE') fillAdministrativePlans();
  },
);
const scheduledDates = computed(() =>
  scheduleEmployees.value.map((item) => ({
    employeeId: item.maNhanVien,
    dates: item.danhSachNgayXepCa,
  })),
);
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
  if (
    method.value === 'calendar' &&
    scheduleType.value === 'ADMINISTRATIVE' &&
    dayPlans.value.some((plan) => new Date(`${plan.date}T12:00:00`).getDay() === 0)
  ) {
    error.value = 'Không phân công ca hành chính vào Chủ nhật.';
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
    if (dayPlans.value.some((p) => !departmentRoster.value.some((e) => e.code === p.employeeId))) {
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
    openPreview(rows);
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
      if (scheduleType.value === 'ADMINISTRATIVE' && dow === 6) return;
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
  openPreview(rows);
}
const issues = computed(() => conflicts(data.value, preview.value));
function openPreview(rows: Assignment[]) {
  preview.value = rows.map((row) => {
    const shift = manualShifts.value.find((s) => s.id === row.shiftId);
    if (!shift) return row;
    const end = new Date(`${row.date}T12:00:00Z`);
    if (shift.crossDay) end.setUTCDate(end.getUTCDate() + 1);
    return {
      ...row,
      startTime: row.startTime || shift.startTime,
      endTime: row.endTime || shift.endTime,
      startDate: row.date,
      endDate: end.toISOString().slice(0, 10),
      crossDay: shift.crossDay,
    };
  });
  previewOpen.value = true;
}
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
    openPreview(preview.value);
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  }
}
async function saveAssignments() {
  if (busy.value || issues.value.length || !preview.value.length) return;
  if (!permission.can('schedules', preview.value.length > 1 ? 'bulk' : 'create')) {
    error.value = 'Bạn không có quyền tạo phân công này.';
    return;
  }
  if (preview.value.some((a) => isPastScheduleDate(a.date))) {
    error.value = 'Không được phân công ngày trong quá khứ.';
    return;
  }
  busy.value = true;
  error.value = '';
  try {
    const department = departmentRecords.all.value.find((d) => d.name === formDepartment.value);
    const payload = mapBulkAssignments(
      preview.value,
      manualShifts.value,
      department?.code || '',
      scheduleEmployees.value
        .filter((e) => e.maBoPhan === department?.code || e.tenBoPhan === formDepartment.value)
        .map((e) => ({ code: e.maNhanVien, positionCode: e.maChucVu })),
    );
    console.log('Saving assignments:', payload);
    const result = await createBulkAssignments(payload);
    if (result.thatBai > 0) {
      error.value =
        `Đã lưu ${result.thanhCong}/${result.tongSo}. ${result.thatBai} phân công thất bại. ` +
        result.loi
          .map((e) => `${e.maNhanVien} · ${e.ngayLamViec.slice(0, 10)}: ${e.message}`)
          .join('\n');
      const failed = new Set(
        result.loi.map((e) => `${e.maNhanVien}:${e.ngayLamViec.slice(0, 10)}`),
      );
      preview.value = preview.value.filter((a) => failed.has(`${a.employeeId}:${a.date}`));
      dayPlans.value = dayPlans.value.filter((a) => failed.has(`${a.employeeId}:${a.date}`));
      return;
    }
    dayPlans.value = [];
    dirty.value = false;
    previewOpen.value = false;
    toast.success(`Đã lưu ${result.thanhCong} phân công ca.`);
    await router.push('/schedules');
    await load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  } finally {
    busy.value = false;
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
async function saveTemplate() {
  if (
    await run(() => scheduleService.template({ ...template.value, days: [...template.value.days] }))
  )
    templateOpen.value = false;
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
  swapMode = ref<'employee' | 'shift'>('employee'),
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
async function sendSwapRequest() {
  if (await run(() => scheduleService.request({ ...swap.value }))) swapOpen.value = false;
}
async function decideSwap(approve: boolean) {
  const request = swapDetail.value;
  if (!request) return;
  if (await run(() => scheduleService.decide(request.id, approve, decision.value)))
    swapDetailOpen.value = false;
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
    <ScheduleModuleNavigation :items="menu" :active-key="page" />
    <p v-if="page !== 'calendar'" class="demo">
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
      <ScheduleCalendarTab
        v-if="page === 'calendar'"
        v-model:view="view"
        v-model:anchor="anchor"
        :employees="
          staff.all.value.map((item) => ({
            code: item.code,
            name: item.name,
            department: String(item.department || ''),
          }))
        "
        :visible-employees="
          visibleEmployees.map((item) => ({
            code: item.code,
            name: item.name,
            department: String(item.department || ''),
          }))
        "
        :dates="dates"
        :today="today"
        :shifts="data.shifts"
        :can-create="permission.can('schedules', 'create')"
        :employee-assignments="employeeAssignments"
        :cell="cell"
        :matches="matches"
        :fmt="fmt"
        :name="name"
        :shift-name="shiftName"
        :symbol="symbol"
        :label="label"
        :pending="pending"
        @move="move"
        @open="open"
      />
      <ScheduleAssignmentTab
        v-if="page === 'assign'"
        v-model:bulk="bulk"
        v-model:selected="selected"
        v-model:form-department="formDepartment"
        v-model:form-search="formSearch"
        v-model:schedule-type="scheduleType"
        v-model:method="method"
        v-model:day-plans="dayPlans"
        v-model:calendar-mode="calendarMode"
        v-model:calendar-anchor="calendarAnchor"
        :editing="editing"
        :busy="busy"
        :can-create="permission.can('schedules', 'create')"
        :can-edit="permission.can('schedules', editing ? 'edit' : bulk ? 'bulk' : 'create')"
        :can-bulk="permission.can('schedules', 'bulk')"
        :tree-loading="treeLoading"
        :tree-error="treeError"
        :department-groups="departmentGroups"
        :unclassified-departments="unclassifiedDepartments"
        :load-department-tree="loadDepartmentTree"
        :shifts-loading="shiftsLoading"
        :shifts-error="shiftsError"
        :load-manual-shifts="loadManualShifts"
        :eligible="eligible"
        :name="name"
        :manual-shifts="manualShifts"
        :data="data"
        :scheduled-dates="scheduledDates"
        :start="start"
        :administrative-shift-id="
          data.shifts.find((shift) => shift.active && shift.code === 'D')?.id
        "
        :make-preview="makePreview"
        :auto-assign-rotating="autoAssignRotating"
        @input="dirty = true"
        @change="dirty = true"
      />
      <ScheduleTemplatesTab
        v-if="page === 'templates'"
        :templates="data.templates"
        :shifts="data.shifts"
        :departments="departments"
        :busy="busy"
        :can-create="permission.can('schedules', 'create')"
        :can-edit="permission.can('schedules', 'edit')"
        :can-bulk="permission.can('schedules', 'bulk')"
        @create="openTemplate()"
        @open="openTemplate"
        @toggle="
          (template) =>
            run(() =>
              scheduleService.template({
                ...template,
                days: [...template.days],
                active: !template.active,
              }),
            )
        "
        @apply="applyTemplate"
      />
      <ScheduleSwapsTab
        v-if="page === 'swaps'"
        v-model:tab="swapTab"
        :rows="swapRows"
        :can-approve="permission.can('schedules', 'approve')"
        :can-create="permission.can('schedules', 'create')"
        :assignment-label="assignmentLabel"
        :shift-name="shiftName"
        @create="
          swap = { assignmentId: '', targetAssignmentId: '', shiftId: '', reason: '' };
          swapOpen = true;
        "
        @detail="
          swapDetail = $event;
          decision = '';
          swapDetailOpen = true;
        "
      />
      <ScheduleReportsTab
        v-if="page === 'reports'"
        v-model:report-mode="reportMode"
        v-model:report-start="reportStart"
        v-model:report-end="reportEnd"
        :reports="reports"
        :assignment-count="reportAssignments.length"
        @drill="drillReport"
      />
    </template>
    <ScheduleAssignmentDialogs
      v-model:detail="detail"
      v-model:detail-open="detailOpen"
      v-model:history-open="historyOpen"
      v-model:preview="preview"
      v-model:preview-open="previewOpen"
      :history="data.history"
      :issues="issues"
      :error="error"
      :busy="busy"
      :today="today"
      :can-edit="permission.can('schedules', 'edit')"
      :name="name"
      :employee-name="employeeName"
      :fmt="fmt"
      :label="label"
      :symbol="symbol"
      :pending="pending"
      :save-assignments="saveAssignments"
      :edit-assignment="editAssignment"
      @close-preview="previewOpen = false"
    />
    <ScheduleTemplateDialog
      v-model:open="templateOpen"
      v-model:read="templateRead"
      v-model:template="template"
      :departments="departments"
      :shifts="data.shifts"
      :busy="busy"
      :error="error"
      @save="saveTemplate"
    />
    <ScheduleSwapDialogs
      v-model:open="swapOpen"
      v-model:detail-open="swapDetailOpen"
      v-model:swap="swap"
      v-model:mode="swapMode"
      v-model:detail="swapDetail"
      v-model:decision="decision"
      :scheduled="scheduled"
      :assignments="data.assignments"
      :shifts="data.shifts"
      :busy="busy"
      :error="error"
      :can-approve="permission.can('schedules', 'approve')"
      :assignment-label="assignmentLabel"
      :shift-name="shiftName"
      :swap-before="swapBefore"
      :swap-after="swapAfter"
      @send="sendSwapRequest"
      @decide="decideSwap"
    />
    <ScheduleDrillDialog
      v-model:open="drillOpen"
      :assignments="drill"
      :name="name"
      :fmt="fmt"
      :label="label"
    />
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
.schedule-dialog .preview-calendar-toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  margin: 12px 0;
}
.schedule-dialog .preview-calendar-mode {
  display: flex;
  gap: 4px;
}
.schedule-dialog .preview-calendar-mode .active {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}
.schedule-dialog .preview-calendar-scroll {
  overflow: auto;
  max-height: 55vh;
}
.schedule-dialog .preview-calendar-table {
  width: max-content;
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 12px;
}
.schedule-dialog .preview-calendar-table th,
.schedule-dialog .preview-calendar-table td {
  padding: 8px;
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  text-align: center;
}
.schedule-dialog .preview-calendar-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  min-width: 82px;
  color: #64748b;
  background: #f8fafc;
}
.schedule-dialog .preview-calendar-table thead small,
.schedule-dialog .preview-calendar-employee small {
  display: block;
  margin-top: 3px;
  color: #64748b;
  font-weight: 400;
}
.schedule-dialog .preview-calendar-table th.today {
  background: #eff6ff;
}
.schedule-dialog .preview-calendar-table .weekend {
  background: #f8fafc;
}
.schedule-dialog .preview-calendar-table .preview-calendar-employee {
  position: sticky;
  left: 0;
  z-index: 1;
  min-width: 175px;
  max-width: 175px;
  text-align: left;
  background: #fff;
}
.schedule-dialog .preview-calendar-table thead .preview-calendar-employee {
  z-index: 3;
  background: #f8fafc;
}
.schedule-dialog .preview-calendar-table td {
  min-width: 82px;
  height: 54px;
}
.schedule-dialog .preview-calendar-table td strong,
.schedule-dialog .preview-calendar-table td small {
  display: block;
}
.schedule-dialog .preview-calendar-table td small {
  margin-top: 3px;
  color: #64748b;
}
.schedule-dialog .mode-month .preview-calendar-table th:not(.preview-calendar-employee),
.schedule-dialog .mode-month .preview-calendar-table td {
  min-width: 64px;
  padding: 6px 4px;
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
.month-calendar {
  overflow: hidden;
}
.month-heading,
.month-row {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
}
.month-heading {
  background: #f1f5f9;
  color: #475569;
  font-size: 12px;
}
.month-heading > strong {
  padding: 16px 20px;
}
.month-row {
  border-top: 1px solid #e2e8f0;
}
.calendar-employee {
  padding: 20px;
  min-width: 0;
}
.month-row > .calendar-employee {
  background: #fafbfc;
  border-right: 1px solid #e2e8f0;
}
.month-shifts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 16px;
  align-items: flex-start;
}
.shift-module .assignment-chip {
  display: grid;
  gap: 6px;
  text-align: left;
  padding: 12px 14px;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  min-width: 155px;
}
.assignment-chip strong {
  color: #2563eb;
  font-size: 16px;
}
.assignment-chip span {
  font-size: 12px;
}
.assignment-date {
  color: #64748b;
}
.unassigned-note {
  color: #94a3b8;
  font-size: 13px;
  margin: 10px 0;
}
.day-calendar {
  display: grid;
  gap: 12px;
}
.day-employee {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  align-items: center;
}
.day-shifts {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
}
.shift-module .day-assignment {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 250px;
  text-align: left;
  padding: 14px;
  background: #f8fafc;
  border-color: #e2e8f0;
  border-radius: 10px;
}
.shift-symbol {
  display: grid;
  place-items: center;
  min-width: 48px;
  min-height: 48px;
  border-radius: 8px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 18px;
}
.day-unassigned {
  display: flex;
  align-items: center;
  gap: 20px;
  color: #94a3b8;
  font-size: 13px;
}
@media (max-width: 700px) {
  .month-heading {
    display: none;
  }
  .month-row,
  .day-employee {
    grid-template-columns: 1fr;
  }
  .month-row > .calendar-employee {
    border-right: 0;
    border-bottom: 1px solid #eef2f6;
  }
  .calendar-employee {
    padding: 16px;
  }
  .month-shifts,
  .day-shifts {
    padding: 12px;
  }
  .shift-module .assignment-chip {
    min-width: 140px;
    flex: 1;
  }
  .day-assignment {
    width: 100%;
  }
  .day-unassigned {
    flex-wrap: wrap;
  }
}
.assignment-workspace {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}
.department-tree-panel {
  max-height: min(640px, 70vh);
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  padding: 16px;
}
.assignment-schedule-panel {
  min-width: 0;
}
.department-tree-panel h3 {
  margin: 0 0 8px;
}
.tree-hint {
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
}
.department-tree-group {
  margin-top: 14px;
}
.department-tree-group summary {
  cursor: pointer;
  padding: 10px 0;
  font-weight: 600;
  font-size: 13px;
  color: #334155;
}
.department-tree-group summary span {
  float: right;
  color: #64748b;
}
.shift-module .department-tree-group button {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
  text-align: left;
  margin: 4px 0;
  padding: 10px 12px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 6px;
}
.shift-module .department-tree-group button.selected {
  background: #dbeafe;
  border-color: #93c5fd;
  color: #1d4ed8;
}
.department-tree-group button > span {
  flex: 1;
  min-width: 0;
}
.department-tree-group button small {
  margin-top: 3px;
  font-size: 11px;
}
.tree-unavailable {
  margin-top: 16px;
  font-size: 12px;
  color: #64748b;
}
.assignment-lock {
  display: flex;
  gap: 10px;
  align-items: center;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  color: #1e40af;
  padding: 14px 16px;
  border-radius: 8px;
  font-size: 13px;
}
@media (max-width: 900px) {
  .assignment-workspace {
    grid-template-columns: 1fr;
  }
  .department-tree-panel {
    max-height: min(360px, 50vh);
    overflow-y: auto;
  }
}
</style>
