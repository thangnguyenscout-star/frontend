<script setup lang="ts">
import { ref, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import AppButton from '@/components/common/AppButton.vue';
import AppDataTable from '@/components/common/AppDataTable.vue';
import { useRecords } from '@/composables/useRecords';
import { usePermission } from '@/composables/usePermission';
import { useToast } from '@/composables/useToast';
import { useConfirm } from '@/composables/useConfirm';
import { departments } from '@/constants/modules';
import { currency } from '@/utils/currency';
import { exportCsv } from '@/utils/export';
import { apiErrorKey } from '@/services/api/apiErrorHandler';
import type { HrRecord } from '@/types/common';
const props = withDefaults(defineProps<{ serviceCharge?: boolean }>(), { serviceCharge: false });
const module = props.serviceCharge ? 'service-charge' : 'payroll';
const { rows, all, total, query, loading, error, load, save } = useRecords(module);
const permission = usePermission(),
  toast = useToast(),
  confirm = useConfirm();
query.filters.period = new Date().toISOString().slice(0, 7);
const selected = ref<HrRecord>(),
  visible = ref(false),
  busy = ref(false);
const columns = props.serviceCharge
  ? ['employeeId', 'name', 'department', 'coefficient', 'serviceCharge', 'status']
  : [
      'employeeId',
      'name',
      'department',
      'salary',
      'days',
      'overtimePay',
      'coefficient',
      'serviceCharge',
      'allowance',
      'gross',
      'insurance',
      'tax',
      'deductions',
      'amount',
      'status',
    ];
const sum = (key: string) => all.value.reduce((s, r) => s + Number(r[key] || 0), 0);
const status = computed(() =>
  all.value.length && all.value.every((r) => r.status === 'approved')
    ? 'Đã phê duyệt'
    : all.value.length && all.value.every((r) => r.status === 'locked')
      ? 'Đã khóa'
      : 'Đang rà soát',
);
function view(row: HrRecord) {
  selected.value = row;
  visible.value = true;
}
async function changeStatus(next: string) {
  busy.value = true;
  try {
    for (const row of all.value) await save({ ...row, status: next });
    toast.success('success');
  } catch (e) {
    toast.error(apiErrorKey(e));
  } finally {
    busy.value = false;
  }
}
async function calculate() {
  busy.value = true;
  try {
    for (const row of all.value.filter((r) => !['locked', 'approved'].includes(r.status))) {
      const gross =
        Number(row.salary || 0) +
        Number(row.serviceCharge || 0) +
        Number(row.overtimePay || 0) +
        Number(row.allowance || 0);
      await save({
        ...row,
        gross,
        amount:
          gross - Number(row.insurance || 0) - Number(row.tax || 0) - Number(row.deductions || 0),
      });
    }
    toast.success('success');
  } catch (e) {
    toast.error(apiErrorKey(e));
  } finally {
    busy.value = false;
  }
}
function download() {
  exportCsv(all.value, columns, columns, module);
}
const print = () => window.print();
</script>
<template>
  <div class="page-heading">
    <div>
      <div class="eyebrow">
        Tài chính nhân sự › {{ serviceCharge ? 'Phân bổ phí phục vụ' : 'Bảng lương tháng' }}
      </div>
      <h1>{{ serviceCharge ? 'Service Charge' : 'Kỳ lương' }} {{ query.filters.period }}</h1>
      <span class="status-badge info"><span class="status-dot" />{{ status }}</span>
    </div>
    <label class="form-field">Kỳ lương<input
      v-model="query.filters.period"
      class="period-input"
      type="month"
      @change="query.page = 1"
    ></label>
  </div>
  <div
    class="toolbar-actions"
    style="margin-bottom: 20px"
  >
    <AppButton
      v-if="permission.can(module, 'edit') && !serviceCharge"
      label="Tính toán lại"
      icon="pi pi-sync"
      :loading="busy"
      @click="calculate"
    /><AppButton
      v-if="permission.can(module, 'edit')"
      label="Khóa bảng lương"
      icon="pi pi-lock"
      severity="secondary"
      outlined
      :disabled="!all.length || busy"
      @click="confirm(() => changeStatus('locked'))"
    /><AppButton
      label="Xuất bảng CSV"
      icon="pi pi-download"
      severity="secondary"
      outlined
      @click="download"
    /><AppButton
      v-if="permission.can(module, 'approve')"
      label="Phê duyệt"
      icon="pi pi-verified"
      severity="secondary"
      outlined
      :disabled="!all.length || busy"
      @click="confirm(() => changeStatus('approved'))"
    />
  </div>
  <div class="kpi-grid">
    <article class="kpi-card">
      <div>
        <span>{{ serviceCharge ? 'Quỹ Service Charge' : 'Tổng thu nhập Gross' }}</span><strong style="font-size: 22px">{{
          currency(sum(serviceCharge ? 'serviceCharge' : 'gross'))
        }}</strong><small>{{ total }} nhân sự trong bộ lọc</small>
      </div>
    </article>
    <article class="kpi-card">
      <div>
        <span>{{ serviceCharge ? 'Tổng điểm phân bổ' : 'Tổng Service Charge' }}</span><strong style="font-size: 22px">{{
          serviceCharge ? sum('coefficient') : currency(sum('serviceCharge'))
        }}</strong><small>Theo dữ liệu kỳ lương</small>
      </div>
    </article>
    <article class="kpi-card">
      <div>
        <span>{{ serviceCharge ? 'Trạng thái kỳ' : 'Thực lĩnh (Net)' }}</span><strong style="font-size: 22px">{{
          serviceCharge ? status : currency(sum('amount'))
        }}</strong><small>Grand Hotel Saigon</small>
      </div>
    </article>
  </div>
  <section class="panel">
    <nav class="detail-tabs">
      <button
        :class="{ active: !query.filters.department }"
        @click="
          query.filters.department = '';
          query.page = 1;
        "
      >
        Tất cả phòng ban
      </button><button
        v-for="dept in departments"
        :key="dept"
        :class="{ active: query.filters.department === dept }"
        @click="
          query.filters.department = dept;
          query.page = 1;
        "
      >
        {{ dept }}
      </button>
    </nav>
    <div class="filters">
      <div class="search-field">
        <i class="pi pi-search" /><InputText
          v-model="query.search"
          placeholder="Tìm nhân viên, mã NV…"
          aria-label="Tìm kiếm bảng lương"
          @update:model-value="query.page = 1"
        />
      </div>
      <AppButton
        label="Làm mới"
        icon="pi pi-refresh"
        severity="secondary"
        text
        @click="load"
      />
    </div>
    <AppDataTable
      :rows="rows"
      :columns="columns"
      :total="total"
      :page="query.page"
      :page-size="query.pageSize"
      :loading="loading"
      :error="error"
      @page="
        query.page = $event.page + 1;
        query.pageSize = $event.rows;
      "
      @sort="
        query.sortField = $event.sortField || 'code';
        query.sortOrder = $event.sortOrder || 1;
      "
      @view="view"
      @retry="load"
      @reset="
        query.search = '';
        query.filters.department = '';
      "
    >
      <template #actions="{ row }">
        <button
          class="icon-button"
          aria-label="Xem phiếu lương"
          @click="view(row)"
        >
          <i class="pi pi-receipt" />
        </button>
      </template>
    </AppDataTable>
    <div class="panel-top">
      <strong>Tổng cộng {{ all.length }} nhân sự</strong><strong class="money">{{
        currency(sum(serviceCharge ? 'serviceCharge' : 'amount'))
      }}</strong>
    </div>
  </section>
  <Dialog
    v-model:visible="visible"
    modal
    header="PHIẾU LƯƠNG ĐIỆN TỬ (PAYSLIP)"
    :style="{ width: '640px', maxWidth: '95vw' }"
  >
    <template v-if="selected">
      <small>Kỳ lương {{ selected.period }} · Grand Hotel Saigon</small>
      <div
        class="summary-card"
        style="margin: 16px 0"
      >
        <h2>{{ selected.name }}</h2>
        <p>{{ selected.position }} · {{ selected.department }}</p>
        <strong class="table-link">{{ selected.employeeId }}</strong>
      </div>
      <h3>CÁC KHOẢN THU NHẬP</h3>
      <div
        v-for="(label, key) in {
          salary: 'Lương cơ bản',
          serviceCharge: 'Phân bổ Service Charge',
          overtimePay: 'Lương OT & Ca đêm',
          allowance: 'Phụ cấp & Thưởng',
        }"
        :key="key"
        class="summary-row"
      >
        <span>{{ label }}</span><strong>{{ currency(selected[key]) }}</strong>
      </div>
      <div class="allowance-row">
        <strong>Tổng thu nhập Gross</strong><strong>{{ currency(selected.gross) }}</strong>
      </div>
      <h3 style="margin-top: 20px">
        CÁC KHOẢN KHẤU TRỪ
      </h3>
      <div
        v-for="(label, key) in {
          insurance: 'BHXH, BHYT, BHTN',
          tax: 'Thuế TNCN tạm khấu trừ',
          deductions: 'Khấu trừ khác',
        }"
        :key="key"
        class="summary-row"
      >
        <span>{{ label }}</span><strong>{{ currency(selected[key]) }}</strong>
      </div>
      <div class="payroll-total">
        <div>
          Thực lĩnh chuyển khoản<small style="display: block; margin-top: 8px">{{ selected.bank || '—' }} · {{ selected.bankAccount || '—' }}</small>
        </div>
        <strong>{{ currency(selected.amount) }}</strong>
      </div>
      <footer class="dialog-footer">
        <AppButton
          label="Đóng"
          severity="secondary"
          outlined
          @click="visible = false"
        /><AppButton
          label="In / Lưu PDF"
          icon="pi pi-print"
          @click="print"
        />
      </footer>
    </template>
  </Dialog>
</template>
