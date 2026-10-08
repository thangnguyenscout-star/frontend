<script setup lang="ts">
import { onBeforeUnmount, reactive, ref, watch } from 'vue';
import Select from 'primevue/select';
import { recruitmentService } from '@/services/modules/recruitment.service';
import { contractService } from '@/services/modules/contract.service';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import AppButton from '@/components/common/AppButton.vue';
import ContractAllowanceTable from './ContractAllowanceTable.vue';
import { emptyContractForm, validateContractForm } from '@/utils/contract-api';
import { contractCompensation, contractEndDate } from '@/utils/contract-calculations';
import type { AllowanceCatalogItem, CreateContractInput } from '@/types/contract-api';
const props = defineProps<{
  initial?: CreateContractInput;
  initialDepartment?: string;
  probation?: boolean;
  saving?: boolean;
}>();
const emit = defineEmits<{ submit: [CreateContractInput]; dirty: [boolean] }>();
const form = reactive(emptyContractForm());
const errors = ref<Record<string, string>>({});

// Department is form-only until CreateHopDongInput exposes maBoPhan.
const department = ref('');
const allowances = ref<AllowanceCatalogItem[]>([]);
const catalogs = ref<Awaited<ReturnType<typeof contractService.getCatalogs>>>({
  types: [],
  departments: [],
  positions: [],
});
const loadingCatalogs = ref(false);
const catalogError = ref('');
const loadingPositions = ref(false);
const positionError = ref('');
let positionSequence = 0;
async function loadPositions() {
  const current = ++positionSequence;
  catalogs.value.positions = [];
  positionError.value = '';
  loadingPositions.value = true;
  try {
    const positions = await recruitmentService.getPositions(department.value || null);
    if (current === positionSequence) catalogs.value.positions = positions;
  } catch {
    if (current === positionSequence) positionError.value = 'Không thể tải danh mục chức vụ.';
  } finally {
    if (current === positionSequence) loadingPositions.value = false;
  }
}
watch(
  department,
  () => {
    if (loadingCatalogs.value) return;
    form.maChucVu = '';
    void loadPositions();
  },
  { flush: 'sync' },
);
let catalogSequence = 0;
async function loadCatalogs() {
  const current = ++catalogSequence;
  loadingCatalogs.value = true;
  catalogError.value = '';
  ++positionSequence;
  positionError.value = '';
  loadingPositions.value = false;
  try {
    const [result, allowanceCatalog] = await Promise.all([
      contractService.getCatalogs(department.value || null),
      contractService.getAllowanceCatalog(),
    ]);
    if (current === catalogSequence) {
      catalogs.value = result;
      allowances.value = allowanceCatalog;
    }
  } catch {
    if (current === catalogSequence)
      catalogError.value = 'Không thể tải danh mục hợp đồng, bộ phận, chức vụ và phụ cấp.';
  } finally {
    if (current === catalogSequence) loadingCatalogs.value = false;
  }
}
onBeforeUnmount(() => {
  ++catalogSequence;
  ++positionSequence;
});

function recalculate() {
  const calculated = contractCompensation(form.phuCaps || [], allowances.value, form.luongCoBan);
  if (JSON.stringify(form.phuCaps) !== JSON.stringify(calculated.phuCaps))
    form.phuCaps = calculated.phuCaps;
  form.mucDongBHXH = calculated.mucDongBHXH;
  form.luongPhuCap = calculated.luongPhuCap;
  form.tongThuNhap = props.probation ? (props.initial?.tongThuNhap ?? 0) : calculated.tongThuNhap;
  const type = catalogs.value.types.find((item) => item.value === form.maLoaiHopDong);
  form.ngayKetThuc = contractEndDate(form.ngayBatDau, form.maLoaiHopDong, type?.label || '');
}
let baseline = '';
watch(
  () => [props.initial, props.initialDepartment] as const,
  ([value]) => {
    Object.assign(form, emptyContractForm(), value ? JSON.parse(JSON.stringify(value)) : {});
    // Initial data must retain its position while the department options load.
    loadingCatalogs.value = true;
    department.value = props.initialDepartment || '';
    if (props.probation) form.maLoaiHopDong = '07001';
    recalculate();
    baseline = JSON.stringify(form);
    errors.value = {};
    void loadCatalogs();
  },
  { immediate: true },
);
watch(
  () => [
    form.phuCaps,
    form.luongCoBan,
    form.ngayBatDau,
    form.maLoaiHopDong,
    allowances.value,
    catalogs.value.types,
  ],
  recalculate,
  { deep: true },
);
watch(form, () => emit('dirty', JSON.stringify(form) !== baseline), { deep: true });
const textFields = [
  { key: 'maNhanVien', label: 'Mã nhân viên' },
  { key: 'soHopDongLaoDong', label: 'Số hợp đồng' },
] as const;
const dates = [
  { key: 'ngayKyHopDong', label: 'Ngày ký' },
  { key: 'ngayBatDau', label: 'Ngày bắt đầu' },
  { key: 'ngayKetThuc', label: 'Ngày kết thúc' },
] as const;
const money = [
  { key: 'luongCoBan', label: 'Lương cơ bản' },
  { key: 'mucDongBHXH', label: 'Mức đóng BHXH' },
  { key: 'luongPhuCap', label: 'Tổng phụ cấp' },
  { key: 'tongThuNhap', label: 'Tổng thu nhập dự kiến' },
  { key: 'luongThuViec', label: 'Lương thử việc' },
] as const;
function submit() {
  if (
    props.saving ||
    loadingCatalogs.value ||
    loadingPositions.value ||
    positionError.value ||
    catalogError.value
  )
    return;
  recalculate();
  errors.value = validateContractForm(form, props.probation);
  if (Object.keys(errors.value).length) return;
  emit('submit', JSON.parse(JSON.stringify(form)));
}
</script>
<template>
  <form novalidate class="contract-form" @submit.prevent="submit">
    <section class="profile-panel">
      <h2>Thông tin hợp đồng</h2>
      <p v-if="catalogError || positionError" role="alert" class="field-error">
        {{ catalogError || positionError }}
        <AppButton
          type="button"
          label="Tải lại danh mục"
          text
          :disabled="saving || loadingCatalogs"
          @click="loadCatalogs"
        />
      </p>
      <div class="contract-fields">
        <div class="field">
          <label for="contract-type">Loại hợp đồng *</label>
          <Select
            v-model="form.maLoaiHopDong"
            input-id="contract-type"
            :options="catalogs.types"
            option-label="label"
            option-value="value"
            filter
            filter-by="label,value"
            show-clear
            placeholder="Chọn loại hợp đồng"
            empty-message="Chưa có loại hợp đồng"
            empty-filter-message="Không tìm thấy loại hợp đồng"
            :loading="loadingCatalogs"
            :disabled="probation || saving || loadingCatalogs || !!catalogError"
            :invalid="!!errors.maLoaiHopDong"
            @update:model-value="form.maLoaiHopDong = $event || ''"
          />
          <small class="field-error">{{ errors.maLoaiHopDong }}</small>
        </div>
        <div class="field">
          <label for="contract-department">Bộ phận</label>
          <Select
            v-model="department"
            input-id="contract-department"
            :options="catalogs.departments"
            option-label="label"
            option-value="value"
            filter
            filter-by="label,value"
            show-clear
            placeholder="Chọn bộ phận"
            empty-message="Chưa có bộ phận"
            empty-filter-message="Không tìm thấy bộ phận"
            :loading="loadingCatalogs"
            :disabled="probation || saving || loadingCatalogs || !!catalogError"
          />
          <small v-if="!probation">Bộ phận chưa được lưu cùng hợp đồng.</small>
        </div>
        <div class="field">
          <label for="contract-position">Chức vụ{{ probation ? ' *' : '' }}</label>
          <Select
            v-model="form.maChucVu"
            input-id="contract-position"
            :options="catalogs.positions"
            option-label="label"
            option-value="value"
            filter
            filter-by="label,value"
            show-clear
            placeholder="Chọn chức vụ"
            empty-message="Chưa có chức vụ"
            empty-filter-message="Không tìm thấy chức vụ"
            :loading="loadingCatalogs || loadingPositions"
            :disabled="
              probation ||
              saving ||
              loadingCatalogs ||
              loadingPositions ||
              !!catalogError ||
              !!positionError
            "
            :invalid="!!errors.maChucVu"
            @update:model-value="form.maChucVu = $event || ''"
          />
          <small class="field-error">{{ positionError || errors.maChucVu }}</small>
        </div>
        <template v-for="field in textFields" :key="field.key">
          <div class="field wide-field">
            <label :for="'contract-' + field.key">{{ field.label }} *</label>
            <InputText
              :id="'contract-' + field.key"
              v-model="form[field.key]"
              :disabled="saving || (probation && field.key === 'maNhanVien')"
              :invalid="!!errors[field.key]"
            />
            <small class="field-error">{{ errors[field.key] }}</small>
          </div>
        </template>
        <div v-for="field in dates" :key="field.key" class="field">
          <label :for="'contract-' + field.key"
            >{{ field.label }}{{ field.key !== 'ngayKetThuc' || probation ? ' *' : '' }}</label
          >
          <InputText
            :id="'contract-' + field.key"
            v-model="form[field.key]"
            type="date"
            :disabled="
              saving || field.key === 'ngayKetThuc' || (probation && field.key === 'ngayBatDau')
            "
            :invalid="!!errors[field.key]"
          />
          <small class="field-error">{{ errors[field.key] }}</small>
        </div>
      </div>
    </section>
    <section class="profile-panel">
      <h2>Thu nhập và ghi chú</h2>
      <div class="contract-fields">
        <div
          v-for="(field, index) in money"
          :key="field.key"
          class="field"
          :class="{ 'wide-field': index >= 3 }"
        >
          <label :for="'contract-' + field.key">{{ field.label }} (VND)</label>
          <InputNumber
            v-model="form[field.key]"
            :input-id="'contract-' + field.key"
            :min="0"
            :max-fraction-digits="2"
            locale="vi-VN"
            :disabled="
              saving ||
              probation ||
              ['mucDongBHXH', 'luongPhuCap', 'tongThuNhap'].includes(field.key)
            "
            :invalid="!!errors[field.key]"
          />
          <small class="field-error">{{ errors[field.key] }}</small>
        </div>
        <div class="field full">
          <label for="contract-note">Ghi chú</label>
          <Textarea
            id="contract-note"
            v-model="form.ghiChu"
            :rows="3"
            :disabled="saving || probation"
          />
        </div>
      </div>
    </section>
    <ContractAllowanceTable
      :catalog="allowances"
      :model-value="form.phuCaps || []"
      :busy="saving || loadingCatalogs || !!catalogError"
      :errors="errors"
      @update:model-value="form.phuCaps = $event"
    />
    <p v-if="Object.keys(errors).length" role="alert" class="field-error">
      Vui lòng kiểm tra các trường chưa hợp lệ.
    </p>
    <footer class="dialog-footer">
      <AppButton
        type="submit"
        :label="probation ? 'Tạo hợp đồng thử việc' : 'Lưu hợp đồng'"
        icon="pi pi-save"
        :loading="saving"
        :disabled="saving || loadingCatalogs || !!catalogError"
      />
    </footer>
  </form>
</template>
<style scoped>
.contract-form {
  display: grid;
  gap: 20px;
  min-width: 0;
}
.contract-form > .profile-panel {
  margin: 0;
  padding: 24px;
}
.profile-panel h2 {
  margin: 0 0 20px;
  font-size: 16px;
  font-weight: 600;
}
.contract-fields {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 20px;
  align-items: start;
}
.field {
  display: flex;
  flex-direction: column;
  grid-column: span 2;
  min-width: 0;
  gap: 7px;
  color: var(--p-surface-700);
  font-size: 13px;
  font-weight: 500;
}
.field > label {
  min-height: 20px;
  line-height: 20px;
}
.wide-field {
  grid-column: span 3;
}
.full {
  grid-column: 1 / -1;
}
.field :deep(.p-inputtext),
.field :deep(.p-select),
.field :deep(.p-inputnumber),
.field :deep(.p-textarea) {
  width: 100%;
  min-width: 0;
  font-size: 13px;
}
.field :deep(.p-inputtext),
.field :deep(.p-select) {
  height: 40px;
}
.field :deep(.p-inputnumber-input) {
  width: 100%;
  text-align: right;
}
.field :deep(.p-select-label) {
  padding-block: 9px;
}
.field :deep(.p-textarea) {
  min-height: 100px;
  resize: vertical;
}
.field small {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
}
.field small:empty {
  display: none;
}
.field-error {
  color: #b42318;
}
p.field-error {
  margin: 0 0 16px;
}
.dialog-footer {
  margin-top: 0;
  padding: 16px 0 0;
}
.dialog-footer :deep(.p-button) {
  min-height: 40px;
  min-width: 140px;
}
@media (max-width: 900px) {
  .contract-fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .field,
  .wide-field {
    grid-column: span 1;
  }
  .full {
    grid-column: 1 / -1;
  }
}
@media (max-width: 640px) {
  .contract-form > .profile-panel {
    padding: 16px;
  }
  .contract-fields {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .dialog-footer :deep(.p-button) {
    width: 100%;
  }
}
</style>
