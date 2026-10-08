<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from 'vue-router';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import AppDatePicker from '@/components/common/AppDatePicker.vue';
import RadioButton from 'primevue/radiobutton';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import AppButton from '@/components/common/AppButton.vue';
import AppInfoSection from '@/components/common/AppInfoSection.vue';
import AppStatusBadge from '@/components/common/AppStatusBadge.vue';
import { employeeProfileFields as defaultFields, employeeAllowanceMock } from '@/mock/employeeProfile';
import { employeeStatusLabels } from '@/constants/employee';
import { currency } from '@/utils/currency';
import type { EmployeeProfileField } from '@/mock/employeeProfile';
import type { HrRecord } from '@/types/common';

const props = defineProps<{
  record: HrRecord;
  fields?: EmployeeProfileField[];
  selectOptions?: Record<string, { value: string; label: string }[]>;
  contract?: HrRecord;
  busy?: boolean;
  serverErrors?: Record<string, string>;
  readonly?: boolean;
  showStatus?: boolean;
  activeTab?: number;
  canAdjustContract?: boolean;
  canViewContract: boolean;
  canViewInsurance: boolean;
}>();
const emit = defineEmits<{ save: [HrRecord]; cancel: []; tabChange: [number] }>();
const { t, te } = useI18n();
const active = ref(
  (props.activeTab === 2 && !props.canViewContract) ||
    (props.activeTab === 3 && !props.canViewInsurance)
    ? 0
    : (props.activeTab ?? 0),
);
const errors = ref<Record<string, string>>({});
const invalidDates = reactive<Record<string, boolean>>({});
const confirmCancel = ref(false);
const form = reactive<HrRecord>({ ...props.record });
const initial = ref('');
const tabs = computed(() => [
  { id: 0, label: 'Thông tin cá nhân', icon: 'pi-user' },
  { id: 1, label: 'Giấy tờ pháp lý', icon: 'pi-id-card' },
  ...(props.canViewContract ? [{ id: 2, label: 'Công việc / HĐLĐ', icon: 'pi-briefcase' }] : []),
  ...(props.canViewInsurance
    ? [{ id: 3, label: 'BHXH & Tài khoản', icon: 'pi-building-columns' }]
    : []),
]);
watch(
  () => props.activeTab,
  (value) => {
    active.value = tabs.value.some((tab) => tab.id === value) ? value! : 0;
  },
);
watch(active, (value) => emit('tabChange', value));
const adjustmentOpen = ref(false);
const adjustment = reactive({ salary: 0, income: 0, date: null as Date | null, note: '' });
const adjustmentError = ref('');
const adjustmentPreview = ref<HrRecord>();
function openAdjustment() {
  adjustment.salary = Number(adjustmentPreview.value?.salary ?? props.contract?.salary ?? 0);
  adjustment.income = Number(adjustmentPreview.value?.income ?? props.contract?.income ?? 0);
  adjustment.date = null;
  adjustment.note = '';
  adjustmentError.value = '';
  adjustmentOpen.value = true;
}
function applyAdjustment() {
  if (
    !Number.isFinite(adjustment.salary) ||
    !Number.isFinite(adjustment.income) ||
    adjustment.salary < 0 ||
    adjustment.income < adjustment.salary ||
    !adjustment.date
  ) {
    adjustmentError.value =
      'Nhập mức lương hợp lệ, tổng thu nhập không nhỏ hơn lương cơ bản và ngày hiệu lực.';
    return;
  }
  if (props.contract)
    adjustmentPreview.value = {
      ...props.contract,
      salary: adjustment.salary,
      income: adjustment.income,
    };
  adjustmentOpen.value = false;
}
const availableFields = computed(() =>
  (props.fields ?? defaultFields).filter((f) => f.tab !== 3 || props.canViewInsurance),
);
watch(
  () => props.record,
  (record) => {
    Object.keys(form).forEach((key) => delete form[key]);
    Object.assign(form, record);
    Object.keys(invalidDates).forEach(key => delete invalidDates[key]);
    const names = record.name.trim().split(/\s+/);
    form.lastName = record.lastName ?? (names.length > 1 ? names[0] : '');
    form.firstName = record.firstName ?? names[names.length - 1] ?? '';
    form.middleName = record.middleName ?? names.slice(1, -1).join(' ');
    if (String(record.gender) === 'M' || String(record.gender) === 'true') form.gender = 'Nam';
    if (String(record.gender) === 'F' || String(record.gender) === 'false') form.gender = 'Nữ';
    errors.value = {};
    initial.value = JSON.stringify(form);
  },
  { immediate: true },
);
const dirty = computed(() => JSON.stringify(form) !== initial.value);
function markSaved() {
  initial.value = JSON.stringify(form);
}
defineExpose({ markSaved });
const displayName = computed(
  () =>
    [form.lastName, form.middleName, form.firstName].filter(Boolean).join(' ').trim() ||
    props.record.name ||
    'Nhân viên mới',
);
const initials = computed(() =>
  displayName.value
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0])
    .join(''),
);
let resolveLeave: ((leave: boolean) => void) | undefined;
onBeforeRouteLeave(() => {
  if (props.busy) return false;
  if (!dirty.value || props.readonly) return true;
  confirmCancel.value = true;
  return new Promise<boolean>((resolve) => {
    resolveLeave = resolve;
  });
});
watch(confirmCancel, (visible) => {
  if (!visible && resolveLeave) {
    resolveLeave(false);
    resolveLeave = undefined;
  }
});
function discard() {
  if (resolveLeave) {
    const resolve = resolveLeave;
    resolveLeave = undefined;
    resolve(true);
  } else {
    markSaved();
    emit('cancel');
  }
  confirmCancel.value = false;
}
function cancel() {
  if (props.busy || props.readonly) return;
  if (dirty.value) confirmCancel.value = true;
  else emit('cancel');
}
function fieldError(key: string) {
  return (invalidDates[key] ? 'Ngày không hợp lệ. Nhập theo định dạng dd/mm/yyyy.' : '') || errors.value[key] || (props.serverErrors?.[key] ? t(props.serverErrors[key]) : '');
}
function tabHasError(tab: number) {
  return availableFields.value.some((field) => field.tab === tab && fieldError(field.key));
}
async function moveTab(index: number) {
  active.value = tabs.value[(index + tabs.value.length) % tabs.value.length].id;
  await nextTick();
  document.getElementById('profile-tab-' + active.value)?.focus();
}
function dateValue(key: string) {
  const value = String(form[key] || '');
  return value ? new Date(value + 'T00:00:00') : null;
}
function setDate(key: string, value: unknown) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    form[key] = '';
    return;
  }
  form[key] = [
    value.getFullYear(),
    String(value.getMonth() + 1).padStart(2, '0'),
    String(value.getDate()).padStart(2, '0'),
  ].join('-');
}
function submit() {
  if (props.busy || props.readonly) return;
  errors.value = {};
  for (const field of availableFields.value) {
    const value = String(form[field.key] ?? '').trim();
    if (field.kind === 'date' && invalidDates[field.key])
      errors.value[field.key] = 'Ngày không hợp lệ. Nhập theo định dạng dd/mm/yyyy.';
    else if (field.required && !value)
      errors.value[field.key] = 'Vui lòng nhập ' + field.label.toLowerCase() + '.';
    else if (value && field.max && value.length > field.max)
      errors.value[field.key] = 'Tối đa ' + field.max + ' ký tự.';
    else if (value && field.letters && !/^[\p{L}\p{M} ]+$/u.test(value))
      errors.value[field.key] = 'Chỉ nhập chữ cái và khoảng trắng.';
    else if (value && field.numeric && !/^\d+$/.test(value))
      errors.value[field.key] = 'Chỉ nhập chữ số.';
    else if (value && field.key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      errors.value[field.key] = 'Email không hợp lệ.';
    else if (
      value &&
      field.kind === 'date' &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        Number.isNaN(dateValue(field.key)?.getTime()) ||
        (dateValue(field.key) &&
          [
            dateValue(field.key)!.getFullYear(),
            String(dateValue(field.key)!.getMonth() + 1).padStart(2, '0'),
            String(dateValue(field.key)!.getDate()).padStart(2, '0'),
          ].join('-') !== value))
    )
      errors.value[field.key] = 'Ngày không hợp lệ.';
  }
  if (Object.keys(errors.value).length) {
    active.value = availableFields.value.find((f) => errors.value[f.key])?.tab ?? 0;
    return;
  }
  emit('save', {
    ...form,
    name: [form.lastName, form.middleName, form.firstName].map((v) => String(v).trim()).join(' '),
  });
}
const contractLabels: Record<string, string> = {
  department: 'Bộ phận',
  position: 'Chức vụ',
  type: 'Loại hợp đồng',
  signingDate: 'Ngày ký hợp đồng',
  startDate: 'Ngày bắt đầu hiệu lực',
  endDate: 'Ngày kết thúc',
  salary: 'Lương cơ bản',
  income: 'Tổng thu nhập',
  insurance: 'Mức đóng BHXH',
  tax: 'Mức đóng thuế TNCN',
};
const contractDisplay = computed<HrRecord>(() => {
  const record: HrRecord = { id: '', code: '', name: '', status: '' };
  for (const key of Object.keys(contractLabels)) {
    const value =
      key === 'department' || key === 'position'
        ? props.record[key]
        : (adjustmentPreview.value ?? props.contract)?.[key];
    record[key] =
      value == null || value === ''
        ? '—'
        : ['salary', 'income', 'insurance', 'tax'].includes(key)
          ? currency(value)
          : ['signingDate', 'startDate', 'endDate'].includes(key)
            ? String(value).split('-').reverse().join('/')
            : te(String(value))
              ? t(String(value))
              : value;
  }
  return record;
});
const allowances = computed(() => (props.contract ? employeeAllowanceMock : []));
const allowanceTotal = computed(() => allowances.value.reduce((sum, item) => sum + item.total, 0));
</script>
<template>
  <form
    class="employee-profile-form"
    novalidate
    @submit.prevent="submit"
  >
    <header class="profile-summary">
      <div>
        <div
          class="profile-avatar"
          aria-hidden="true"
        >
          {{ initials }}
        </div>
        <div>
          <span class="profile-code">{{ record.code }}</span>
          <h2>{{ displayName }}</h2>
          <p class="muted">
            {{ record.department || 'Chưa có bộ phận' }} ·
            {{ record.position || 'Chưa có chức vụ' }}
          </p>
        </div>
      </div>
      <AppStatusBadge
        v-if="showStatus !== false"
        :label="
          record.status === 'draft'
            ? 'Hồ sơ mới'
            : record.status === 'active'
              ? 'Đang làm việc'
              : employeeStatusLabels[String(record.status)] ?? t(record.status)
        "
        :severity="record.status === 'active' ? 'success' : 'warning'"
      />
    </header>
    <nav
      class="detail-tabs profile-tabs"
      role="tablist"
      aria-label="Thông tin hồ sơ nhân viên"
    >
      <button
        v-for="(tab, index) in tabs"
        :id="'profile-tab-' + tab.id"
        :key="tab.id"
        type="button"
        role="tab"
        :aria-selected="active === tab.id"
        :aria-controls="'profile-panel-' + tab.id"
        :tabindex="active === tab.id ? 0 : -1"
        :class="{ active: active === tab.id, 'tab-error': tabHasError(tab.id) }"
        @click="active = tab.id"
        @keydown.right.prevent="moveTab(index + 1)"
        @keydown.left.prevent="moveTab(index - 1)"
        @keydown.home.prevent="moveTab(0)"
        @keydown.end.prevent="moveTab(tabs.length - 1)"
      >
        <i :class="['pi', tab.icon]" /> {{ tab.label }}
        <i
          v-if="tabHasError(tab.id)"
          class="pi pi-exclamation-circle"
          aria-label="Có lỗi nhập liệu"
        />
      </button>
    </nav>
    <p
      v-if="!readonly"
      class="muted profile-hint"
    >
      Các trường có dấu <span class="required">*</span> là bắt buộc.
    </p>
    <section
      v-for="tab in tabs"
      v-show="active === tab.id"
      :id="'profile-panel-' + tab.id"
      :key="tab.id"
      role="tabpanel"
      :aria-labelledby="'profile-tab-' + tab.id"
      class="profile-tab-panel"
    >
      <template v-if="tab.id === 2">
        <AppInfoSection
          title="Công việc / Hợp đồng lao động"
          :record="contractDisplay"
          :fields="Object.keys(contractLabels)"
          :labels="contractLabels"
        />
        <p class="muted">
          Thông tin hợp đồng chỉ đọc. Sử dụng Cập nhật điều chỉnh để nhập mức lương mới.
        </p>
        <div class="contract-allowances">
          <h3>Chi tiết phụ cấp</h3>
          <p class="muted">
            Dữ liệu phụ cấp minh họa.
          </p>
          <DataTable
            :value="allowances"
            scrollable
            scroll-height="240px"
            :table-style="{ minWidth: '640px' }"
          >
            <Column
              field="code"
              header="Mã phụ cấp"
            />
            <Column
              field="name"
              header="Phụ cấp"
            />
            <Column
              field="unit"
              header="Đơn vị"
            />
            <Column header="Số tiền phụ cấp">
              <template #body="{ data }">
                {{ currency(data.amount) }}
              </template>
            </Column>
            <Column header="Tổng phụ cấp tháng">
              <template #body="{ data }">
                {{ currency(data.total) }}
              </template>
            </Column>
            <template #footer>
              Tổng phụ cấp tháng: {{ currency(allowanceTotal) }}
            </template>
          </DataTable>
          <AppButton
            v-if="canAdjustContract && !readonly"
            id="btnDieuChinhLuong"
            :disabled="!contract || busy"
            class="contract-adjustment"
            type="button"
            label="Cập nhật điều chỉnh"
            icon="pi pi-pencil"
            outlined
            @click="openAdjustment"
          />
          <p
            v-if="adjustmentPreview"
            class="muted"
            role="status"
          >
            Đang xem mức lương điều chỉnh mẫu trong phiên này.
          </p>
        </div>
        <p
          v-if="!contract"
          class="muted"
        >
          Chưa có hợp đồng liên kết. Thông tin công việc và phụ cấp sẽ hiển thị khi nhân viên có hợp
          đồng.
        </p>
      </template>
      <div
        v-else
        class="form-grid profile-fields"
      >
        <div
          v-for="field in availableFields.filter((f) => f.tab === tab.id)"
          :key="field.key"
          class="form-field"
          :class="{
            'full-width': field.wide,
            'field-short': field.key === 'code' || field.letters || field.key === 'phone',
            'field-date': field.kind === 'date',
            'field-address': field.wide && field.key !== 'code',
          }"
        >
          <label :for="'profile-' + field.key">{{ field.label }} <b
            v-if="field.required"
            class="required"
          >*</b></label>
          <div
            v-if="field.kind === 'gender'"
            :id="'profile-' + field.key"
            class="gender-options"
            role="radiogroup"
            aria-label="Giới tính"
            :aria-describedby="fieldError(field.key) ? 'profile-error-' + field.key : undefined"
          >
            <label
              v-for="gender in ['Nam', 'Nữ']"
              :key="gender"
              :for="'profile-gender-' + gender"
            >
              <RadioButton
                v-model="form.gender"
                :input-id="'profile-gender-' + gender"
                name="profile-gender"
                :value="gender"
                :disabled="busy || readonly"
              />
              {{ gender }}
            </label>
          </div>
          <AppDatePicker
            v-else-if="field.kind === 'date'"
            :input-id="'profile-' + field.key"
            :model-value="dateValue(field.key)"
            date-format="dd/mm/yy"
            show-icon
            :disabled="busy || readonly"
            :invalid="!!fieldError(field.key)"
            :aria-describedby="fieldError(field.key) ? 'profile-error-' + field.key : undefined"
            @update:model-value="setDate(field.key, $event)"
            @invalid-change="invalidDates[field.key] = $event"
          />
          <Select
            v-else-if="field.kind === 'select'"
            v-model="form[field.key]"
            :input-id="'profile-' + field.key"
            :options="
              props.selectOptions?.[field.key] ??
                [
                  ...new Set([
                    ...(field.options || []),
                    ...(form[field.key] ? [String(form[field.key])] : []),
                  ]),
                ].map((value) => ({ value, label: value }))
            "
            option-label="label"
            option-value="value"
            filter
            placeholder="Chọn thông tin"
            :disabled="busy || readonly"
            :invalid="!!fieldError(field.key)"
            :aria-describedby="fieldError(field.key) ? 'profile-error-' + field.key : undefined"
          />
          <InputText
            v-else
            :id="'profile-' + field.key"
            :model-value="String(form[field.key] ?? '')"
            :maxlength="field.max"
            :disabled="field.key === 'code' || busy || readonly"
            :invalid="!!fieldError(field.key)"
            :type="field.key === 'email' ? 'email' : 'text'"
            :inputmode="field.numeric ? 'numeric' : undefined"
            :aria-required="field.required"
            :aria-describedby="fieldError(field.key) ? 'profile-error-' + field.key : undefined"
            @update:model-value="
              form[field.key] = field.numeric
                ? String($event ?? '').replace(/\D/g, '')
                : field.letters
                  ? String($event ?? '').replace(/[^\p{L}\p{M} ]/gu, '')
                  : ($event ?? '')
            "
          />
          <small
            v-if="field.key === 'code'"
            class="muted"
          >Mã nhân viên được tạo tự động.</small>
          <small
            v-if="fieldError(field.key)"
            :id="'profile-error-' + field.key"
            class="field-error"
            role="alert"
          >{{ fieldError(field.key) }}</small>
        </div>
      </div>
    </section>
    <footer
      v-if="!readonly"
      class="dialog-footer profile-actions"
    >
      <AppButton
        label="Hủy"
        type="button"
        severity="secondary"
        outlined
        :disabled="busy || readonly"
        @click="cancel"
      />
      <AppButton
        label="Lưu"
        type="submit"
        icon="pi pi-check"
        :loading="busy"
        :disabled="busy || readonly"
      />
    </footer>
    <Dialog
      v-model:visible="confirmCancel"
      modal
      header="Hủy thay đổi?"
      :style="{ width: '420px', maxWidth: '95vw' }"
    >
      <p>Các thay đổi chưa lưu sẽ bị mất.</p>
      <template #footer>
        <AppButton
          label="Tiếp tục chỉnh sửa"
          severity="secondary"
          outlined
          @click="confirmCancel = false"
        />
        <AppButton
          label="Hủy thay đổi"
          severity="danger"
          @click="discard"
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="adjustmentOpen"
      modal
      header="Điều chỉnh lương"
      :style="{ width: '620px', maxWidth: '95vw' }"
    >
      <p class="muted">
        Xem trước điều chỉnh bằng dữ liệu mẫu; không cập nhật hợp đồng thực tế.
      </p>
      <div class="adjustment-current">
        <span>Lương cơ bản hiện tại
          <strong>{{ currency((adjustmentPreview || contract)?.salary) }}</strong></span>
        <span>Tổng thu nhập hiện tại
          <strong>{{ currency((adjustmentPreview || contract)?.income) }}</strong></span>
      </div>
      <div class="form-grid">
        <label
          class="form-field"
          for="adjustment-salary"
        >Lương cơ bản mới *
          <InputNumber
            v-model="adjustment.salary"
            input-id="adjustment-salary"
            mode="currency"
            currency="VND"
            locale="vi-VN"
            :min="0"
          />
        </label>
        <label
          class="form-field"
          for="adjustment-income"
        >Tổng thu nhập mới *
          <InputNumber
            v-model="adjustment.income"
            input-id="adjustment-income"
            mode="currency"
            currency="VND"
            locale="vi-VN"
            :min="0"
          />
        </label>
        <label
          class="form-field"
          for="adjustment-date"
        >Ngày hiệu lực *
          <AppDatePicker
            :model-value="adjustment.date"
            input-id="adjustment-date"
            date-format="dd/mm/yy"
            show-icon
            @update:model-value="adjustment.date = $event instanceof Date ? $event : null"
          />
        </label>
        <label
          class="form-field"
          for="adjustment-note"
        >Ghi chú
          <InputText
            id="adjustment-note"
            v-model="adjustment.note"
            :maxlength="200"
          />
        </label>
      </div>
      <p
        v-if="adjustmentError"
        class="field-error"
        role="alert"
      >
        {{ adjustmentError }}
      </p>
      <template #footer>
        <AppButton
          type="button"
          label="Hủy"
          severity="secondary"
          outlined
          @click="adjustmentOpen = false"
        />
        <AppButton
          type="button"
          label="Áp dụng mẫu"
          icon="pi pi-check"
          @click="applyAdjustment"
        />
      </template>
    </Dialog>
  </form>
</template>
<style scoped>
.employee-profile-form {
  --control-border: #aeb8c4;
  --control-focus: #0078d4;
  font-family: 'Segoe UI', sans-serif;
  font-size: 13px;
  min-width: 0;
  background: #fff;
  border: 1px solid #ccd2d9;
  border-radius: 6px;
  box-shadow: 0 1px 3px #0f172a08;
}
.profile-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 22px;
  border-bottom: 1px solid #dce1e7;
  background: #fafbfc;
  border-radius: 6px 6px 0 0;
}
.profile-summary > div {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.profile-summary h2 {
  margin: 2px 0 4px;
  font-size: 18px;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.profile-summary p {
  margin: 0;
  font-size: 12px;
}
.profile-code {
  color: #64748b;
  font-size: 11px;
  font-weight: 600;
}
.profile-avatar {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 5px;
  background: #e8f1fa;
  color: #0067c0;
  font-size: 17px;
  font-weight: 600;
  flex-shrink: 0;
}
.profile-tabs {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 3px;
  margin: 0;
  padding: 10px 16px 0;
  background: #f3f4f6;
  border-bottom: 1px solid #cbd2da;
}
.profile-tabs button {
  flex-shrink: 0;
  white-space: nowrap;
  padding: 9px 14px;
  border: 1px solid transparent;
  border-bottom: 0;
  border-radius: 4px 4px 0 0;
  background: transparent;
  color: #475569;
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
}
.profile-tabs button.active {
  color: #0067c0;
  background: #fff;
  border-color: #cbd2da;
  box-shadow: inset 0 2px #0078d4;
  font-weight: 600;
}
.profile-tabs button:hover:not(.active) {
  background: #e8edf3;
}
.profile-tabs button:focus-visible {
  outline: 2px solid #0078d4;
  outline-offset: -3px;
}
.profile-tabs .tab-error,
.required {
  color: #b42318;
}
.profile-hint {
  margin: 0;
  padding: 12px 22px;
  font-size: 12px;
}
.profile-tab-panel {
  min-width: 0;
  min-height: 250px;
  padding: 16px 22px 22px;
}
.profile-hint + .profile-tab-panel {
  padding-top: 4px;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 24px;
  align-items: start;
}
.form-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  font-size: 13px;
}
.profile-fields {
  padding: 18px 16px;
  border: 1px solid #dce1e7;
  border-radius: 3px;
  background: #fcfcfd;
}
.profile-fields > .form-field {
  display: grid;
  grid-template-columns: 142px minmax(0, 1fr);
  align-items: start;
  column-gap: 10px;
  row-gap: 4px;
}
.profile-fields > .form-field > label {
  padding-top: 7px;
  color: #334155;
  font-weight: 400;
  line-height: 18px;
}
.profile-fields > .form-field > small {
  grid-column: 2;
  line-height: 16px;
  font-size: 11px;
}
.profile-fields > .form-field > :not(label):not(small) {
  width: 100%;
  max-width: 280px;
  min-width: 0;
}
.profile-fields > .field-short > :not(label):not(small) {
  max-width: 190px;
}
.profile-fields > .field-date > :not(label):not(small) {
  max-width: 174px;
}
.profile-fields > .field-address > :not(label):not(small) {
  max-width: 640px;
}
.full-width {
  grid-column: 1 / -1;
}
.gender-options,
.gender-options label {
  display: flex;
  align-items: center;
  gap: 7px;
}
.gender-options {
  min-height: 32px;
  gap: 20px;
}
.form-field :deep(.p-inputtext),
.form-field :deep(.p-select),
.form-field :deep(.p-datepicker),
.form-field :deep(.p-inputnumber) {
  width: 100%;
  min-width: 0;
  font-family: 'Segoe UI', sans-serif;
  font-size: 13px;
}
.form-field :deep(.p-inputtext),
.form-field :deep(.p-select) {
  height: 32px;
  min-height: 32px;
  border: 1px solid var(--control-border, #aeb8c4);
  border-radius: 3px;
  background: #fff;
  box-shadow: none;
}
.form-field :deep(.p-inputtext) {
  padding: 5px 9px;
}
.form-field :deep(.p-select-label) {
  padding: 5px 9px;
  line-height: 20px;
  font-size: 13px;
}
.form-field :deep(.p-select-dropdown) {
  width: 28px;
}
.form-field :deep(.p-datepicker-dropdown) {
  width: 30px;
  min-width: 30px;
  border-radius: 0 3px 3px 0;
  padding: 0;
  border-color: var(--control-border, #aeb8c4);
  background: #f3f4f6;
  color: #475569;
}
.form-field :deep(.p-datepicker .p-inputtext) {
  border-radius: 3px 0 0 3px;
}
.form-field :deep(.p-inputtext:enabled:hover),
.form-field :deep(.p-select:not(.p-disabled):hover) {
  border-color: #76879a;
}
.form-field :deep(.p-inputtext:enabled:focus),
.form-field :deep(.p-select.p-focus) {
  border-color: #0078d4;
  outline: 1px solid #0078d4;
  outline-offset: 0;
}
.form-field :deep(.p-inputtext:disabled),
.form-field :deep(.p-select.p-disabled) {
  background: #edf0f3;
  color: #667385;
  border-color: #ccd2d9;
  opacity: 1;
}
.form-field :deep(.p-inputtext.p-invalid),
.form-field :deep(.p-select.p-invalid) {
  border-color: #b42318;
}
.profile-tab-panel :deep(.profile-panel) {
  padding: 16px;
  border: 1px solid #dce1e7;
  border-radius: 3px;
  background: #fcfcfd;
  box-shadow: none;
}
.profile-tab-panel :deep(.profile-panel h2) {
  font-size: 14px;
  margin: 0 0 14px;
}
.profile-tab-panel :deep(.detail-grid) {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 24px;
  margin: 0;
}
.profile-tab-panel :deep(.detail-grid dt) {
  font-size: 12px;
  color: #64748b;
}
.profile-tab-panel :deep(.detail-grid dd) {
  margin-top: 4px;
  font-size: 13px;
}
.contract-allowances h3 {
  font-size: 14px;
  margin: 20px 0 8px;
}
.contract-allowances :deep(.p-datatable) {
  font-size: 13px;
  border: 1px solid #dce1e7;
  border-radius: 3px;
  overflow: hidden;
}
.contract-allowances :deep(.p-datatable-thead > tr > th),
.contract-allowances :deep(.p-datatable-tbody > tr > td),
.contract-allowances :deep(.p-datatable-footer) {
  padding: 8px 10px;
}
.contract-adjustment {
  margin-top: 14px;
}
.profile-actions {
  position: sticky;
  bottom: 0;
  z-index: 1;
  margin: 0;
  padding: 10px 22px;
  border-top: 1px solid #dce1e7;
  border-radius: 0 0 6px 6px;
  background: #f7f8fa;
  gap: 8px;
}
.profile-actions :deep(.p-button),
.contract-adjustment {
  min-height: 32px;
  padding: 5px 14px;
  border-radius: 3px;
  font-size: 13px;
}
.profile-actions :deep(.p-button) {
  min-width: 86px;
}
.adjustment-current {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin: 14px 0;
  padding: 12px;
  border: 1px solid #dce1e7;
  border-radius: 3px;
  background: #f7f8fa;
  font-size: 13px;
}
.adjustment-current strong {
  display: block;
  margin-top: 5px;
}
@media (max-width: 1100px) {
  .profile-fields {
    grid-template-columns: 1fr;
  }
  .profile-fields > .form-field {
    grid-template-columns: 152px minmax(0, 1fr);
  }
  .profile-fields > .form-field > :not(label):not(small) {
    max-width: 340px;
  }
  .profile-fields > .field-short > :not(label):not(small) {
    max-width: 190px;
  }
  .profile-fields > .field-date > :not(label):not(small) {
    max-width: 174px;
  }
  .profile-fields > .field-address > :not(label):not(small) {
    max-width: 640px;
  }
}
@media (max-width: 640px) {
  .profile-summary {
    padding: 14px;
  }
  .profile-summary h2 {
    font-size: 16px;
  }
  .profile-tabs {
    padding: 8px 8px 0;
  }
  .profile-tabs button {
    padding: 11px 12px;
  }
  .profile-hint {
    padding: 12px 14px;
  }
  .profile-tab-panel {
    padding: 12px 14px 16px;
  }
  .form-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .profile-fields {
    padding: 12px;
  }
  .profile-fields > .form-field {
    grid-template-columns: 1fr;
    gap: 5px;
  }
  .profile-fields > .form-field > label {
    padding-top: 0;
  }
  .profile-fields > .form-field > small {
    grid-column: 1;
  }
  .profile-fields > .form-field > :not(label):not(small) {
    max-width: 100%;
  }
  .form-field :deep(.p-inputtext),
  .form-field :deep(.p-select) {
    height: 38px;
    min-height: 38px;
  }
  .form-field :deep(.p-select-label) {
    padding-top: 8px;
  }
  .gender-options {
    min-height: 38px;
  }
  .profile-tab-panel :deep(.detail-grid),
  .adjustment-current {
    grid-template-columns: 1fr;
  }
  .profile-actions {
    padding: 10px 14px;
  }
  .profile-actions :deep(.p-button) {
    min-height: 38px;
  }
}
</style>

