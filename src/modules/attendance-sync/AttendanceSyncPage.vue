<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import { gql } from '@apollo/client/core';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import AppButton from '@/components/common/AppButton.vue';
import { usePermission } from '@/composables/usePermission';
import ImportSyncDialog from './ImportSyncDialog.vue';
import { apolloClient } from '@/services/graphql/apollo';
import {
  getScheduleDepartments,
  type ScheduleDepartment,
} from '@/services/modules/schedule-shift.service';

interface MonthlyAttendanceDayLog {
  ngayTrongThang: number;
  logDau: string | null;
  logCuoi: string | null;
}
interface MonthlyAttendanceEmployee {
  maNhanVien: string;
  hoTen: string;
  maBoPhan: string | null;
  tenBoPhan: string | null;
  maCa: string | null;
  tenCa: string | null;
  cacNgay: MonthlyAttendanceDayLog[] | null;
}

const MONTHLY_ATTENDANCE_LOG_REPORT = gql`
  query BaoCaoTongHopLogChamCongThang($thang: Int!, $nam: Int!, $maBoPhan: String) {
    baoCaoTongHopLogChamCongThang(thang: $thang, nam: $nam, maBoPhan: $maBoPhan) {
      isResults
      message
      data {
        maNhanVien
        hoTen
        maBoPhan
        tenBoPhan
        maCa
        tenCa
        cacNgay {
          ngayTrongThang
          logDau
          logCuoi
        }
      }
    }
  }
`;

const now = new Date();
const permission = usePermission();
const canSync = computed(() => permission.can('attendance', 'create'));
const importVisible = ref(false);
const importBusy = ref(false);
const selectedMonth = ref(now.getMonth() + 1);
const selectedYear = ref(now.getFullYear());
const selectedDepartment = ref('');
const departments = ref<ScheduleDepartment[]>([]);
const departmentLoading = ref(false);
const departmentError = ref('');
const reportRows = ref<MonthlyAttendanceEmployee[]>([]);
const reportLoading = ref(false);
const reportError = ref('');
const monthOptions = Array.from({ length: 12 }, (_, index) => ({
  value: index + 1,
  label: String(index + 1).padStart(2, '0'),
}));
const reportDays = computed(() => [...new Set(
  reportRows.value.flatMap((employee) => (employee.cacNgay || []).map((day) => day.ngayTrongThang)),
)].sort((a, b) => a - b));
const reportTableStyle = computed(() => ({
  minWidth: String(900 + reportDays.value.length * 190) + 'px',
}));
let requestSequence = 0;

function openImport() {
  if (canSync.value && !importBusy.value) importVisible.value = true;
}

function closeImport() {
  if (importBusy.value || !importVisible.value) return;
  importVisible.value = false;
  void loadReport();
}

onBeforeRouteLeave(() => !importBusy.value);
onBeforeRouteUpdate(() => !importBusy.value);

async function loadDepartments() {
  departmentLoading.value = true;
  departmentError.value = '';
  try {
    departments.value = await getScheduleDepartments();
  } catch (error) {
    departmentError.value = error instanceof Error ? error.message : String(error);
  } finally {
    departmentLoading.value = false;
  }
}

async function loadReport() {
  if (
    !Number.isInteger(selectedMonth.value) ||
    selectedMonth.value < 1 ||
    selectedMonth.value > 12 ||
    !Number.isInteger(selectedYear.value) ||
    selectedYear.value < 2000 ||
    selectedYear.value > 2100
  ) {
    reportError.value = 'Vui lòng chọn tháng và năm hợp lệ.';
    reportRows.value = [];
    return;
  }

  const requestId = ++requestSequence;
  reportLoading.value = true;
  reportError.value = '';
  try {
    const { data } = await apolloClient.query<{
      baoCaoTongHopLogChamCongThang: {
        isResults: boolean;
        message: string | null;
        data: MonthlyAttendanceEmployee[] | null;
      };
    }>({
      query: MONTHLY_ATTENDANCE_LOG_REPORT,
      variables: {
        thang: selectedMonth.value,
        nam: selectedYear.value,
        maBoPhan: selectedDepartment.value || null,
      },
      fetchPolicy: 'no-cache',
      errorPolicy: 'none',
    });
    if (requestId !== requestSequence) return;
    const result = data?.baoCaoTongHopLogChamCongThang;
    if (!result?.isResults)
      throw new Error(result?.message || 'Không thể tải báo cáo tổng hợp log chấm công.');
    reportRows.value = result.data || [];
  } catch (error) {
    if (requestId === requestSequence)
      reportError.value = error instanceof Error ? error.message : String(error);
  } finally {
    if (requestId === requestSequence) reportLoading.value = false;
  }
}

function monthlyLog(
  employee: MonthlyAttendanceEmployee,
  day: number,
  field: 'logDau' | 'logCuoi',
) {
  return employee.cacNgay?.find((entry) => entry.ngayTrongThang === day)?.[field] || '—';
}

onMounted(() => void loadDepartments());
watch([selectedMonth, selectedYear, selectedDepartment], () => void loadReport(), {
  immediate: true,
});
</script>

<template>
  <main class="attendance-monthly-report">
    <header class="report-heading">
      <div>
        <p class="report-eyebrow">ĐỒNG BỘ DỮ LIỆU CHẤM CÔNG</p>
        <h1>Báo cáo tổng hợp log chấm công</h1>
        <p class="report-description">Log đầu và log cuối theo nhân viên, ca làm việc và từng ngày trong tháng.</p>
      </div>
      <div class="report-actions">
        <AppButton
          v-if="canSync"
          label="Đồng bộ dữ liệu máy chấm công"
          icon="pi pi-upload"
          :disabled="importBusy"
          @click="openImport"
        />
        <AppButton
          label="Tải lại"
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          :loading="reportLoading"
          :disabled="reportLoading"
          @click="loadReport"
        />
      </div>
    </header>

    <section class="report-filters" aria-label="Bộ lọc báo cáo">
      <label>
        Tháng
        <select v-model.number="selectedMonth" :disabled="reportLoading">
          <option v-for="month in monthOptions" :key="month.value" :value="month.value">
            {{ month.label }}
          </option>
        </select>
      </label>
      <label>
        Năm
        <input
          v-model.number="selectedYear"
          type="number"
          min="2000"
          max="2100"
          step="1"
          :disabled="reportLoading"
        >
      </label>
      <label>
        Bộ phận
        <select v-model="selectedDepartment" :disabled="departmentLoading || reportLoading">
          <option value="">Tất cả bộ phận</option>
          <option v-for="department in departments" :key="department.code" :value="department.code">
            {{ department.name }}
          </option>
        </select>
      </label>
      <AppButton
        label="Lọc báo cáo"
        icon="pi pi-filter"
        :loading="reportLoading"
        :disabled="reportLoading"
        @click="loadReport"
      />
    </section>

    <p v-if="departmentLoading" class="report-state" role="status">Đang tải danh sách bộ phận…</p>
    <div v-else-if="departmentError" class="report-state report-error" role="alert">
      {{ departmentError }}
      <AppButton label="Tải lại bộ phận" text @click="loadDepartments" />
    </div>
    <p v-if="reportLoading" class="report-state" role="status">Đang tải báo cáo…</p>
    <p v-else-if="reportError" class="report-state report-error" role="alert">{{ reportError }}</p>

    <section v-if="!reportLoading && !reportError" class="report-table-panel">
      <div class="report-table-heading">
        <h2>
          Tháng {{ String(selectedMonth).padStart(2, '0') }}/{{ selectedYear }}
          <span v-if="selectedDepartment">· {{ departments.find((item) => item.code === selectedDepartment)?.name || selectedDepartment }}</span>
          <span v-else>· Tất cả bộ phận</span>
        </h2>
        <span>{{ reportRows.length }} nhân viên</span>
      </div>

      <DataTable
        :value="reportRows"
        data-key="maNhanVien"
        paginator
        :rows="10"
        :rows-per-page-options="[10, 20, 50]"
        scrollable
        size="small"
        :table-style="reportTableStyle"
      >
        <template #empty>Không có dữ liệu báo cáo cho bộ lọc đã chọn.</template>
        <ColumnGroup type="header">
          <Row>
            <Column header="Mã nhân viên" :rowspan="2" />
            <Column header="Họ tên" :rowspan="2" />
            <Column header="Mã bộ phận" :rowspan="2" />
            <Column header="Tên bộ phận" :rowspan="2" />
            <Column header="Mã ca" :rowspan="2" />
            <Column header="Tên ca" :rowspan="2" />
            <Column
              v-for="day in reportDays"
              :key="'day-' + day"
              :header="'Ngày ' + day"
              :colspan="2"
            />
          </Row>
          <Row>
            <template v-for="day in reportDays" :key="'sub-' + day">
              <Column header="Log đầu" />
              <Column header="Log cuối" />
            </template>
          </Row>
        </ColumnGroup>

        <Column field="maNhanVien" header="Mã nhân viên" />
        <Column field="hoTen" header="Họ tên" />
        <Column field="maBoPhan" header="Mã bộ phận" />
        <Column field="tenBoPhan" header="Tên bộ phận" />
        <Column field="maCa" header="Mã ca" />
        <Column field="tenCa" header="Tên ca" />
        <template v-for="day in reportDays" :key="'body-' + day">
          <Column :header="'Ngày ' + day + ' · log đầu'">
            <template #body="{ data }">{{ monthlyLog(data, day, 'logDau') }}</template>
          </Column>
          <Column :header="'Ngày ' + day + ' · log cuối'">
            <template #body="{ data }">{{ monthlyLog(data, day, 'logCuoi') }}</template>
          </Column>
        </template>
      </DataTable>
    </section>
    <ImportSyncDialog
      v-if="importVisible"
      :visible="importVisible"
      @busy="importBusy = $event"
      @close="closeImport"
    />
  </main>
</template>

<style scoped>
.attendance-monthly-report {
  display: grid;
  gap: 20px;
  min-width: 0;
}
.report-heading,
.report-actions,
.report-table-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.report-actions {
  flex-wrap: wrap;
  justify-content: flex-end;
}
.report-eyebrow {
  margin: 0 0 6px;
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
}
.report-heading h1 {
  margin: 0;
  font-size: 24px;
}
.report-description {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 13px;
}
.report-filters {
  display: grid;
  grid-template-columns: minmax(130px, 0.7fr) minmax(130px, 0.7fr) minmax(220px, 1.5fr) auto;
  align-items: end;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface);
}
.report-filters label {
  display: grid;
  gap: 7px;
  color: var(--text);
  font-size: 12px;
  font-weight: 600;
}
.report-filters select,
.report-filters input {
  width: 100%;
  min-height: 40px;
  padding: 8px 10px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--surface);
  color: inherit;
  font: inherit;
}
.report-state {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}
.report-error {
  color: #b42318;
}
.report-table-panel {
  min-width: 0;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface);
}
.report-table-heading {
  margin-bottom: 16px;
}
.report-table-heading h2 {
  margin: 0;
  font-size: 16px;
}
.report-table-heading h2 span {
  color: var(--muted);
  font-size: 13px;
  font-weight: 400;
}
.report-table-heading > span {
  color: var(--muted);
  font-size: 12px;
}
@media (max-width: 850px) {
  .report-filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .report-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .report-actions {
    justify-content: flex-start;
  }
  .report-filters {
    grid-template-columns: 1fr;
  }
  .report-table-panel {
    padding: 12px;
  }
}
</style>