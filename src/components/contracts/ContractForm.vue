<script setup lang="ts">
import { onBeforeUnmount, reactive, ref, watch } from 'vue';
import Select from 'primevue/select';
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
let catalogSequence = 0;
async function loadCatalogs() {
  const current = ++catalogSequence;
  loadingCatalogs.value = true;
  catalogError.value = '';
  try {
    const [result, allowanceCatalog] = await Promise.all([
      contractService.getCatalogs(),
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
});
void loadCatalogs();

function recalculate() {
  const calculated = contractCompensation(form.phuCaps || [], allowances.value, form.luongCoBan);
  if (JSON.stringify(form.phuCaps) !== JSON.stringify(calculated.phuCaps))
    form.phuCaps = calculated.phuCaps;
  form.mucDongBHXH = calculated.mucDongBHXH;
  form.luongPhuCap = calculated.luongPhuCap;
  form.tongThuNhap = props.probation ? (props.initial?.tongThuNhap ?? 0) : calculated.tongThuNhap;
  const type = catalogs.value.types.find(item => item.value === form.maLoaiHopDong);
  form.ngayKetThuc = contractEndDate(form.ngayBatDau, form.maLoaiHopDong, type?.label || '');
}
let baseline = '';
watch(
  () => props.initial,
  (value) => {
    Object.assign(form, emptyContractForm(), value ? JSON.parse(JSON.stringify(value)) : {});
    department.value = props.initialDepartment || '';
    if (props.probation) form.maLoaiHopDong = '07001';
    recalculate();
    baseline = JSON.stringify(form);
    errors.value = {};
  },
  { immediate: true },
);
watch(
  () => [form.phuCaps, form.luongCoBan, form.ngayBatDau, form.maLoaiHopDong, allowances.value, catalogs.value.types],
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
  if (props.saving || loadingCatalogs.value || catalogError.value) return;
  recalculate();
  errors.value = validateContractForm(form, props.probation);
  if (Object.keys(errors.value).length) return;
  emit('submit', JSON.parse(JSON.stringify(form)));
}
</script>
<template>
  <form
    novalidate
    @submit.prevent="submit"
  >
    <section class="profile-panel">
      <h2>Thông tin hợp đồng</h2>
      <p
        v-if="catalogError"
        role="alert"
        class="field-error"
      >
        {{ catalogError }}
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
            :loading="loadingCatalogs"
            :disabled="probation || saving || loadingCatalogs || !!catalogError"
            :invalid="!!errors.maChucVu"
            @update:model-value="form.maChucVu = $event || ''"
          />
          <small class="field-error">{{ errors.maChucVu }}</small>
        </div>
        <template
          v-for="field in textFields"
          :key="field.key"
        >
          <div
            class="field"
          >
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
        <div
          v-for="field in dates"
          :key="field.key"
          class="field"
        >
          <label :for="'contract-' + field.key">{{ field.label }}{{ field.key !== 'ngayKetThuc' || probation ? ' *' : '' }}</label>
          <InputText
            :id="'contract-' + field.key"
            v-model="form[field.key]"
            type="date"
            :disabled="saving || field.key === 'ngayKetThuc' || (probation && field.key === 'ngayBatDau')"
            :invalid="!!errors[field.key]"
          />
          <small class="field-error">{{ errors[field.key] }}</small>
        </div>
        <div
          v-for="field in money"
          :key="field.key"
          class="field"
        >
          <label :for="'contract-' + field.key">{{ field.label }} (VND)</label>
          <InputNumber
            v-model="form[field.key]"
            :input-id="'contract-' + field.key"
            :min="0"
            :max-fraction-digits="2"
            locale="vi-VN"
            :disabled="saving || probation || ['mucDongBHXH', 'luongPhuCap', 'tongThuNhap'].includes(field.key)"
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
    <p
      v-if="Object.keys(errors).length"
      role="alert"
      class="field-error"
    >
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
.contract-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.field {
  display: grid;
  gap: 6px;
}
.full {
  grid-column: 1 / -1;
}
.field-error {
  color: #b42318;
}
:deep(.p-inputnumber-input) {
  width: 100%;
}
@media (max-width: 600px) {
  .contract-fields {
    grid-template-columns: 1fr;
  }
}
</style>
