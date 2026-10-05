<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import AppButton from '@/components/common/AppButton.vue';
import { contractMoney } from '@/utils/contract';
import type { AllowanceCatalogItem, ContractAllowanceDto } from '@/types/contract-api';
const props = defineProps<{
  modelValue: ContractAllowanceDto[];
  catalog?: AllowanceCatalogItem[];
  readonly?: boolean;
  busy?: boolean;
  errors?: Record<string, string>;
}>();
const emit = defineEmits<{ 'update:modelValue': [ContractAllowanceDto[]] }>();
const calculationLabels: Record<string, string> = { 1: 'Tiền', 2: '%' };
const timeLabels: Record<string, string> = { 1: 'Tháng', 2: 'Ngày', 3: 'Giờ' };
function selectedAllowance(code: string) {
  return props.catalog?.find((item) => item.maPhuCap === code);
}
function options(index: number) {
  return (props.catalog || []).filter(
    (item) => !props.modelValue.some((row, i) => i !== index && row.maPhuCap === item.maPhuCap),
  );
}
function selectAllowance(index: number, code: string) {
  if (props.busy || props.readonly) return;
  const item = options(index).find((item) => item.maPhuCap === code);
  if (!item) return;
  emit(
    'update:modelValue',
    props.modelValue.map((row, i) =>
      i === index ? { ...row, maPhuCap: item.maPhuCap, tenPhuCap: item.tenPhuCap } : row,
    ),
  );
}
const numbers = [
  { key: 'soTien', label: 'Số tiền' },
  { key: 'tyLe', label: 'Tỷ lệ (% lương BHXH)' },
  { key: 'mucTinh', label: 'Mức tính / tháng' },
] as const;
function update(index: number, key: keyof ContractAllowanceDto, value: unknown) {
  if (props.busy || props.readonly || key === 'mucTinh') return;
  emit(
    'update:modelValue',
    props.modelValue.map((row, i) => (i === index ? { ...row, [key]: value } : row)),
  );
}
function add() {
  if (!props.busy && !props.readonly)
    emit('update:modelValue', [...props.modelValue, { maPhuCap: '', soTien: 0 }]);
}
function remove(index: number) {
  if (!props.busy && !props.readonly)
    emit(
      'update:modelValue',
      props.modelValue.filter((_, i) => i !== index),
    );
}
</script>
<template>
  <section class="profile-panel">
    <div class="panel-top">
      <h2>Phụ cấp</h2>
      <AppButton
        v-if="!readonly"
        type="button"
        label="Thêm phụ cấp"
        icon="pi pi-plus"
        :disabled="busy"
        @click="add"
      />
    </div>
    <div class="table-scroll">
      <table class="compact-table">
        <thead>
          <tr>
            <th>Mã phụ cấp</th>
            <th>Tên phụ cấp</th>
            <th v-if="!readonly">
              Loại tính
            </th>
            <th v-if="!readonly">
              Đơn vị thời gian
            </th>
            <th
              v-for="field in numbers"
              :key="field.key"
            >
              {{ field.label }}
            </th>
            <th>Ghi chú</th>
            <th v-if="!readonly">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in modelValue"
            :key="index"
          >
            <td>
              <span v-if="readonly">{{ row.maPhuCap }}</span>
              <Select
                v-else
                :model-value="row.maPhuCap"
                :options="options(index)"
                option-label="tenPhuCap"
                option-value="maPhuCap"
                filter
                filter-by="maPhuCap,tenPhuCap"
                placeholder="Chọn phụ cấp"
                :disabled="busy"
                :aria-label="'Mã phụ cấp dòng ' + (index + 1)"
                @update:model-value="selectAllowance(index, $event)"
              />
              <small class="field-error">{{ errors?.['phuCaps.' + index + '.maPhuCap'] }}</small>
            </td>
            <td>
              {{ selectedAllowance(row.maPhuCap)?.tenPhuCap || row.tenPhuCap || '—'
              }}<small v-if="row.isActive === false"> (Ngừng áp dụng)</small>
            </td>
            <td v-if="!readonly">
              {{ calculationLabels[String(selectedAllowance(row.maPhuCap)?.loaiTinh)] || '—' }}
            </td>
            <td v-if="!readonly">
              {{ timeLabels[String(selectedAllowance(row.maPhuCap)?.donViThoiGian)] || '—' }}
            </td>
            <td
              v-for="field in numbers"
              :key="field.key"
            >
              <span v-if="readonly">{{ contractMoney(row[field.key] ?? null) }}</span>
              <InputNumber
                v-else
                :model-value="row[field.key]"
                :min="0"
                :max-fraction-digits="4"
                locale="vi-VN"
                :disabled="busy || field.key === 'mucTinh'
                  || (field.key === 'soTien' && Number(selectedAllowance(row.maPhuCap)?.loaiTinh) === 2)
                  || (field.key === 'tyLe' && Number(selectedAllowance(row.maPhuCap)?.loaiTinh) === 1)"
                :aria-label="field.label + ' dòng ' + (index + 1)"
                @update:model-value="update(index, field.key, $event)"
              />
              <small class="field-error">{{
                errors?.['phuCaps.' + index + '.' + field.key]
              }}</small>
            </td>
            <td>
              <span v-if="readonly">{{ row.ghiChu || '—' }}</span><InputText
                v-else
                :model-value="row.ghiChu"
                :disabled="busy"
                :aria-label="'Ghi chú phụ cấp dòng ' + (index + 1)"
                @update:model-value="update(index, 'ghiChu', $event)"
              />
            </td>
            <td v-if="!readonly">
              <AppButton
                type="button"
                icon="pi pi-trash"
                :aria-label="'Xóa phụ cấp dòng ' + (index + 1)"
                severity="danger"
                text
                :disabled="busy"
                @click="remove(index)"
              />
            </td>
          </tr>
          <tr v-if="!modelValue.length">
            <td :colspan="readonly ? 6 : 9">
              Chưa có khoản phụ cấp.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
<style scoped>
.table-scroll {
  overflow: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: top;
  min-width: 140px;
}
:deep(input) {
  width: 140px;
}
.field-error {
  display: block;
  color: #b42318;
  margin-top: 4px;
}
</style>
