<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import AppButton from '@/components/common/AppButton.vue';
import { useReconciliation } from './useReconciliation';
import {
  issueLabels,
  severityLabels,
  adjustmentLabels,
  formatDate,
  formatTime,
  type IssueFilters,
  type IssueViewModel,
  type Severity,
} from './reconciliation.types';

const props = defineProps<{
  periodId: number;
  departmentCode: string;
  priority?: boolean;
  severity?: Severity | '';
  runId?: number;
}>();
const emit = defineEmits<{ open: [row: IssueViewModel]; all: []; clearRun: [] }>();
const store = useReconciliation();
const filters = reactive({
  employeeCode: '',
  date: '',
  code: '',
  severity: props.severity || '',
  status: '',
  search: '',
});
const first = reactive({ value: 0 });
watch(
  () => props.severity,
  (value) => {
    filters.severity = value || '';
  },
);
const allRows = computed(() =>
  store.getIssues({
    periodId: props.periodId,
    departmentCode: props.departmentCode,
    runId: props.runId,
  }),
);
const codes = computed(() => [
  ...new Map(
    allRows.value.map((r) => [r.issue.maLoi, { code: r.issue.maLoi, label: r.issue.moTa }]),
  ).values(),
]);
const employees = computed(() =>
  store.state.employees.filter(
    (e) => !props.departmentCode || e.departmentCode === props.departmentCode,
  ),
);
const rows = computed(() => {
  const result = store.getIssues({
    periodId: props.periodId,
    departmentCode: props.departmentCode,
    runId: props.runId,
    ...filters,
  } as IssueFilters);
  if (!props.priority) return result;
  const rank = { CRITICAL: 0, WARNING: 1, INFO: 2 };
  return result
    .filter((r) => ['OPEN', 'IN_REVIEW'].includes(r.issue.trangThai))
    .sort((a, b) => rank[a.issue.mucDo] - rank[b.issue.mucDo])
    .slice(0, 5);
});
watch(
  [filters, () => props.periodId, () => props.departmentCode, () => props.runId],
  () => {
    first.value = 0;
  },
  { deep: true },
);
function clear() {
  Object.assign(filters, {
    employeeCode: '',
    date: '',
    code: '',
    severity: '',
    status: '',
    search: '',
  });
}
watch(
  () => props.departmentCode,
  () => {
    if (filters.employeeCode && !employees.value.some((e) => e.code === filters.employeeCode))
      filters.employeeCode = '';
    if (filters.code && !codes.value.some((c) => c.code === filters.code)) filters.code = '';
  },
);
defineExpose({ clear });
</script>

<template>
  <section class="rc-card rc-issues">
    <div class="rc-section-heading">
      <div>
        <h2>
          {{ priority ? 'Bất thường cần ưu tiên' : 'Danh sách bất thường' }}
          <span class="rc-count">{{ rows.length }}</span>
        </h2>
        <p>
          {{
            priority
              ? 'Ưu tiên lỗi nghiêm trọng trước khi xác nhận công bộ phận.'
              : 'Đối chiếu từng ca làm việc, giữ nguyên dữ liệu chấm công gốc.'
          }}
        </p>
      </div>
      <AppButton
        v-if="priority"
        label="Xem tất cả"
        icon="pi pi-arrow-right"
        icon-pos="right"
        text
        @click="emit('all')"
      />
    </div>
    <div
      v-if="runId"
      class="rc-notice"
    >
      <i class="pi pi-history" /><span>Đang xem lịch sử lần chạy #{{ store.state.runs.find((r) => r.id === runId)?.lanChay }}. Kết
        quả lịch sử chỉ đọc.</span><AppButton
        label="Về kết quả hiện hành"
        text
        @click="emit('clearRun')"
      />
    </div>
    <div
      v-if="!priority"
      class="rc-issue-filters"
    >
      <label class="rc-search"><span>Tìm kiếm</span><input
        v-model="filters.search"
        placeholder="Tên, mã nhân viên hoặc bất thường…"
        type="search"
      ></label>
      <label><span>Nhân viên</span><select v-model="filters.employeeCode">
        <option value="">Tất cả nhân viên</option>
        <option
          v-for="e in employees"
          :key="e.code"
          :value="e.code"
        >
          {{ e.code }} · {{ e.name }}
        </option>
      </select></label>
      <label><span>Ngày công</span><input
        v-model="filters.date"
        type="date"
        :min="store.state.periods.find((p) => p.id === periodId)?.tuNgay"
        :max="store.state.periods.find((p) => p.id === periodId)?.denNgay"
      ></label>
      <label><span>Nhóm sai lệch</span><select v-model="filters.code">
        <option value="">Tất cả nhóm</option>
        <option
          v-for="c in codes"
          :key="c.code"
          :value="c.code"
        >
          {{ c.code }} · {{ c.label }}
        </option>
      </select></label>
      <label><span>Mức độ</span><select v-model="filters.severity">
        <option value="">Tất cả mức độ</option>
        <option
          v-for="(label, code) in severityLabels"
          :key="code"
          :value="code"
        >
          {{ label }}
        </option>
      </select></label>
      <label><span>Trạng thái bất thường</span><select v-model="filters.status">
        <option value="">Tất cả trạng thái</option>
        <option
          v-for="(label, code) in issueLabels"
          :key="code"
          :value="code"
        >
          {{ label }}
        </option>
      </select></label>
      <AppButton
        label="Xóa bộ lọc"
        icon="pi pi-filter-slash"
        severity="secondary"
        text
        @click="clear"
      />
    </div>
    <DataTable
      :value="rows"
      :paginator="!priority && rows.length > 0"
      :rows="10"
      :first="first.value"
      :rows-per-page-options="[10, 20, 50]"
      data-key="issue.id"
      scrollable
      removable-sort
      :table-style="{ minWidth: '1040px' }"
      sort-field="issue.ngayCong"
      :sort-order="-1"
      @page="first.value = $event.first"
    >
      <Column
        field="employeeName"
        header="Nhân viên"
        sortable
        style="min-width: 200px"
      >
        <template #body="{ data }">
          <div class="rc-person">
            <span class="rc-avatar">{{
              data.employeeName
                .split(' ')
                .slice(-2)
                .map((s: string) => s[0])
                .join('')
            }}</span>
            <div>
              <strong>{{ data.employeeName }}</strong><small>{{ data.issue.maNhanVien }} · {{ data.departmentName }}</small>
            </div>
          </div>
        </template>
      </Column>
      <Column
        field="issue.ngayCong"
        header="Ngày / ca"
        sortable
        style="min-width: 150px"
      >
        <template #body="{ data }">
          <strong>{{ formatDate(data.issue.ngayCong) }}</strong><small>{{ data.shift.shift }}</small><small>{{ formatTime(data.shift.start) }} – {{ formatTime(data.shift.end)
          }}{{
            data.shift.end.slice(0, 10) !== data.shift.start.slice(0, 10) ? ' (+1 ngày)' : ''
          }}</small>
        </template>
      </Column>
      <Column
        header="Log thực tế"
        style="min-width: 100px"
      >
        <template #body="{ data }">
          <div class="rc-mono">
            {{ formatTime(data.shift.originalIn) }} <span class="rc-muted">/</span>
            {{ formatTime(data.shift.originalOut) }}
          </div>
          <small>IN / OUT gốc</small>
        </template>
      </Column>
      <Column
        field="issue.maLoi"
        header="Bất thường"
        sortable
        style="min-width: 190px"
      >
        <template #body="{ data }">
          <strong>{{ data.issue.moTa }}</strong><small>{{ data.issue.maLoi }} ·
            {{
              data.issue.phanCongCaId ? 'Phân ca #' + data.issue.phanCongCaId : 'Chưa phân ca'
            }}</small>
        </template>
      </Column>
      <Column
        field="issue.mucDo"
        header="Mức độ"
        sortable
        style="min-width: 135px"
      >
        <template #body="{ data }">
          <span
            class="rc-badge"
            :class="
              data.issue.mucDo === 'CRITICAL'
                ? 'danger'
                : data.issue.mucDo === 'WARNING'
                  ? 'warning'
                  : 'info'
            "
          ><i
            :class="[
              'pi',
              data.issue.mucDo === 'CRITICAL' ? 'pi-exclamation-circle' : 'pi-info-circle',
            ]"
          />{{ severityLabels[data.issue.mucDo as keyof typeof severityLabels] }}</span>
        </template>
      </Column>
      <Column
        field="issue.trangThai"
        header="Trạng thái"
        sortable
        style="min-width: 175px"
      >
        <template #body="{ data }">
          <span
            class="rc-badge"
            :class="['RESOLVED', 'ACCEPTED'].includes(data.issue.trangThai) ? 'success' : 'neutral'"
          >{{ issueLabels[data.issue.trangThai as keyof typeof issueLabels] }}</span><small v-if="data.pendingAdjustment">{{
            adjustmentLabels[data.pendingAdjustment.trangThai as keyof typeof adjustmentLabels]
          }}</small><small
            v-if="data.isStale"
            class="rc-text-warning"
          ><i class="pi pi-history" /> Kết quả cũ, cần đối soát lại</small>
        </template>
      </Column>
      <Column header="Phụ trách">
        <template #body="{ data }">
          {{
            data.issue.mucDo === 'CRITICAL' ? 'HR' : 'HOD'
          }}
        </template>
      </Column>
      <Column
        header="Thao tác"
        frozen
        align-frozen="right"
        style="min-width: 120px"
      >
        <template #body="{ data }">
          <AppButton
            label="Xem & xử lý"
            text
            size="small"
            @click="emit('open', data)"
          />
        </template>
      </Column>
      <template #empty>
        <div class="rc-empty">
          <i class="pi pi-check-circle" />
          <h3>{{ priority ? 'Không còn bất thường ưu tiên' : 'Không có kết quả phù hợp' }}</h3>
          <p>
            {{
              priority
                ? 'Tiếp tục kiểm tra duyệt bộ phận và điều kiện chốt.'
                : 'Thử thay đổi điều kiện lọc hoặc chọn kỳ công khác.'
            }}
          </p>
          <AppButton
            v-if="!priority"
            label="Xóa bộ lọc"
            text
            @click="clear"
          />
        </div>
      </template>
      <template #paginatorstart>
        <span class="rc-muted">{{ rows.length }} trường hợp</span>
      </template>
      <template #paginatorend>
        <span class="rc-muted">Dữ liệu mô phỏng</span>
      </template>
    </DataTable>
  </section>
</template>
