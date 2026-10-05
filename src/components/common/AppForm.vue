<script setup lang="ts">
import { reactive, watch, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import AppButton from './AppButton.vue';
import type { Field, HrRecord } from '@/types/common';
const props = defineProps<{
  fields: Field[];
  record: HrRecord;
  busy?: boolean;
  employee?: boolean;
  allowDraft?: boolean;
  serverErrors?: Record<string, string>;
}>();
const emit = defineEmits<{ save: [HrRecord]; draft: [HrRecord]; cancel: [] }>();
const { t, te } = useI18n();
const form = reactive<HrRecord>({ ...props.record });
const errors = ref<Record<string, string>>({});
const step = ref(0);
const steps = [
  { title: '1. Thông tin cá nhân', keys: ['code', 'name', 'gender', 'birthDate', 'education'] },
  { title: '2. Giấy tờ pháp lý', keys: ['identityNumber'] },
  { title: '3. Thông tin liên lạc', keys: ['address', 'phone', 'email', 'emergencyContact'] },
  {
    title: '4. Công việc & Hợp đồng',
    keys: [
      'hotel',
      'department',
      'subDepartment',
      'position',
      'grade',
      'manager',
      'startDate',
      'type',
      'salary',
      'probationSalary',
      'serviceChargeRate',
      'shiftPattern',
      'status',
    ],
  },
  {
    title: '5. Thuế & BHXH',
    keys: [
      'taxNumber',
      'insuranceNumber',
      'healthInsuranceNumber',
      'healthcareProvider',
      'bank',
      'bankAccount',
    ],
  },
];
steps.push({title: '6. X?c nh?n h? s?', keys: []});
const checklist = [
  { key: 'healthCheck', label: 'Phiếu khám sức khỏe' },
  { key: 'backgroundCheck', label: 'Sơ yếu lý lịch' },
  { key: 'identityVerified', label: 'Bản sao CCCD đã đối soát' },
  { key: 'qualifications', label: 'Bằng cấp & Chứng chỉ' },
  { key: 'bankReady', label: 'Tài khoản nhận lương' },
  { key: 'uniformReady', label: 'Đồng phục & Thẻ tên' },
];
const visibleFields = computed(() =>
  props.employee
    ? props.fields.filter((f) => steps[step.value].keys.includes(f.key))
    : props.fields,
);

watch(
  () => props.record,
  (value) => {
    Object.keys(form).forEach((k) => delete form[k]);
    Object.assign(form, value);
    errors.value = {};
  },
  { deep: true },
);
function validate(keys?: string[]) {
  errors.value = {};
  props.fields.forEach((f) => {
    if (typeof form[f.key] === 'string') form[f.key] = String(form[f.key]).trim();
    if (f.required && (form[f.key] === '' || form[f.key] == null)) errors.value[f.key] = 'required';
    if (
      f.kind === 'number' &&
      form[f.key] !== undefined &&
      (!Number.isFinite(Number(form[f.key])) || Number(form[f.key]) < 0)
    )
      errors.value[f.key] = 'nonNegative';
    if (
      f.kind === 'email' &&
      form[f.key] &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form[f.key]))
    )
      errors.value[f.key] = 'invalidEmail';
  });
  if (form.endDate && form.startDate && String(form.endDate) < String(form.startDate))
    errors.value.endDate = 'invalidDate';
  if (props.employee) {
    if (form.identityNumber && !/^\d{12}$/.test(String(form.identityNumber))) errors.value.identityNumber='CCCD ph?i g?m 12 ch? s?.';
    if (form.phone && !/^[+\d ()-]{9,16}$/.test(String(form.phone))) errors.value.phone='S? ?i?n tho?i kh?ng h?p l?.';
    if (form.birthDate && String(form.birthDate) >= new Date().toISOString().slice(0,10)) errors.value.birthDate='Ng?y sinh ph?i tr??c ng?y hi?n t?i.';
  }
  if (keys) errors.value=Object.fromEntries(Object.entries(errors.value).filter(([key])=>keys.includes(key)));
  return !Object.keys(errors.value).length;
}
function next() {if(validate(steps[step.value].keys)) step.value++;}
function submit() {
  if (validate()) emit('save', { ...form });
  else if (props.employee)
    step.value = Math.max(
      0,
      steps.findIndex((s) => s.keys.includes(Object.keys(errors.value)[0])),
    );
}
</script>
<template>
  <form
    class="record-form"
    novalidate
    @submit.prevent="submit"
  >
    <nav
      v-if="employee"
      class="onboarding-steps"
      aria-label="Các bước thêm nhân viên"
    >
      <button
        v-for="(item, index) in steps"
        :key="item.title"
        type="button"
        class="chip-button"
        :class="{ active: step === index }"
        @click="step = index"
      >
        {{ item.title }}
      </button>
    </nav>
    <h3 v-if="employee">
      {{ steps[step].title }}
    </h3>
    <div v-if="employee && step === 5" class="onboarding-review"><h3>Ki?m tra th?ng tin tr??c khi ti?p nh?n</h3><dl class="detail-grid"><div v-for="field in fields" :key="field.key"><dt>{{ t(field.key) }}</dt><dd>{{ form[field.key] || '?' }}</dd></div></dl></div>
    <div class="form-grid">
      <label
        v-for="field in visibleFields"
        :key="field.key"
        class="form-field"
        :class="{ 'full-width': field.kind === 'textarea' }"
        :for="'field-' + field.key"
      ><span>{{ t(field.key) }} <b v-if="field.required">*</b></span><Select
        v-if="field.kind === 'select'"
        :id="'field-' + field.key"
        v-model="form[field.key]"
        :options="field.options?.map((v) => ({ label: te(v) ? t(v) : v, value: v }))"
        option-label="label"
        option-value="value"
        :placeholder="t('all')"
      /><InputNumber
        v-else-if="field.kind === 'number'"
        :input-id="'field-' + field.key"
        :model-value="Number(form[field.key]) || 0"
        :min="0"
        @update:model-value="form[field.key] = $event ?? 0"
      /><Textarea
        v-else-if="field.kind === 'textarea'"
        :id="'field-' + field.key"
        :model-value="String(form[field.key] ?? '')"
        rows="3"
        @update:model-value="form[field.key] = $event ?? ''"
      /><InputText
        v-else
        :id="'field-' + field.key"
        :model-value="String(form[field.key] ?? '')"
        :aria-invalid="!!(errors[field.key] || serverErrors?.[field.key])"
        :aria-describedby="errors[field.key] ? 'error-'+field.key : undefined"
        :type="field.kind === 'date' ? 'date' : field.kind === 'email' ? 'email' : 'text'"
        @update:model-value="form[field.key] = $event ?? ''"
      /><small
        v-if="errors[field.key] || serverErrors?.[field.key]"
        :id="'error-'+field.key"
        role="alert"
        class="field-error"
      >{{
        t(errors[field.key] || serverErrors?.[field.key] || 'required')
      }}</small></label>
    </div>
    <section
      v-if="employee && step === 3"
      class="onboarding-section"
      style="margin-top: 20px"
    >
      <h3>Hồ sơ tiếp nhận & Kiểm tra tuân thủ</h3>
      <div class="form-grid">
        <label
          v-for="item in checklist"
          :key="item.key"
          style="display: flex; gap: 8px; align-items: center"
        ><input
          type="checkbox"
          :checked="!!form[item.key]"
          @change="form[item.key] = ($event.target as HTMLInputElement).checked ? 1 : 0"
        >{{ item.label }}</label>
      </div>
    </section>
    <footer class="dialog-footer">
      <AppButton v-if="employee && allowDraft" label="L?u nh?p" type="button" severity="secondary" outlined :disabled="busy" @click="emit('draft', { ...form })" />
      <AppButton
        v-if="employee && step > 0"
        label="Bước trước"
        type="button"
        severity="secondary"
        outlined
        @click="step--"
      />
      <AppButton
        v-if="employee && step < steps.length - 1"
        label="Tiếp tục"
        type="button"
        icon="pi pi-arrow-right"
        @click="next"
      />
      <AppButton
        :label="t('cancel')"
        severity="secondary"
        type="button"
        @click="emit('cancel')"
      /><AppButton
        :label="t('save')"
        icon="pi pi-check"
        type="submit"
        :loading="busy"
      />
    </footer>
  </form>
</template>
