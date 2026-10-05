<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { employeeService } from '@/services/modules/employee.service';
import { employeeErrorMessage, mapEmployeeDetailToForm } from '@/types/employee.type';
import { employeeApiFields, employeeMasterCategories } from '@/constants/employee';
import { useToast } from '@/composables/useToast';
import { useConfirm } from '@/composables/useConfirm';
import { usePermission } from '@/composables/usePermission';
import EmployeeProfileForm from '@/components/employees/EmployeeProfileForm.vue';
import AppLoading from '@/components/common/AppLoading.vue';
import AppErrorState from '@/components/common/AppErrorState.vue';
import AppButton from '@/components/common/AppButton.vue';
import type { HrRecord } from '@/types/common';
const route = useRoute(),
  router = useRouter(),
  toast = useToast(),
  confirm = useConfirm(),
  permission = usePermission();
const mode = computed(() => String(route.meta.employeeMode || 'CREATE'));
const formFields = computed(() => mode.value === 'CREATE'
  ? employeeApiFields.filter(field => !['status', 'endDate'].includes(field.key))
  : employeeApiFields);
const allowed = computed(() =>
  permission.can(
    'employees',
    mode.value === 'CREATE' ? 'create' : mode.value === 'EDIT' ? 'edit' : undefined,
  ),
);
const title = computed(() =>
  mode.value === 'CREATE'
    ? 'Thêm hồ sơ nhân viên'
    : mode.value === 'EDIT'
      ? 'Sửa hồ sơ nhân viên'
      : 'Thông tin nhân viên',
);
const record = ref<HrRecord>();
const loading = ref(true),
  error = ref(''),
  busy = ref(false);
const selectOptions = ref<Record<string, { value: string; label: string }[]>>({});
const profileForm = ref<InstanceType<typeof EmployeeProfileForm>>();
let requestId = 0;
async function load() {
  const id = ++requestId;
  loading.value = true;
  error.value = '';
  record.value = undefined;
  if (!allowed.value) {
    loading.value = false;
    return;
  }
  try {
    const categories = [...new Set(Object.values(employeeMasterCategories))];
    const codes = await Promise.all(
      categories.map((category) => employeeService.masterCodes(category)),
    );
    const detail =
      mode.value === 'CREATE'
        ? { maNhanVien: await employeeService.generateCode(), trangThaiNhanVien: '1' }
        : await employeeService.getEmployeeDetail(String(route.params.maNhanVien || ''));
    if (id !== requestId) return;
    if (!detail.maNhanVien?.trim()) throw new Error('Mã nhân viên không hợp lệ.');
    selectOptions.value = Object.fromEntries(
      Object.entries(employeeMasterCategories).map(([field, category]) => [
        field,
        codes[categories.indexOf(category)].map((item) => ({
          value: item.maKey,
          label: item.tenGiaTri,
        })),
      ]),
    );
    record.value = mapEmployeeDetailToForm(detail);
  } catch (e) {
    if (id !== requestId) return;
    error.value = employeeErrorMessage(e);
    toast.error(error.value);
  } finally {
    if (id === requestId) loading.value = false;
  }
}
function save(value: HrRecord) {
  if (mode.value === 'READ' || !allowed.value || busy.value || loading.value || !record.value)
    return;
  const savingMode = mode.value;
  const payload = { ...value, code: record.value.code };
  confirm(
    async () => {
      if (busy.value || mode.value !== savingMode || !allowed.value) return;
      busy.value = true;
      let saved = false;
      try {
        const result =
          savingMode === 'CREATE'
            ? await employeeService.create(payload)
            : await employeeService.update(payload);
        profileForm.value?.markSaved();
        toast.success(result.message || 'Lưu thông tin nhân viên thành công.');
        saved = true;
      } catch (e) {
        toast.error(employeeErrorMessage(e));
      } finally {
        busy.value = false;
      }
      if (saved) {
        await nextTick();
        await router.push('/employees');
      }
    },
    { message: 'Bạn có chắc chắn muốn lưu thông tin nhân viên?', acceptLabel: 'OK' },
  );
}
watch(() => route.fullPath, load, { immediate: true });
</script>
<template>
  <section class="employee-create-page">
    <nav
      class="profile-breadcrumb"
      aria-label="Đường dẫn"
    >
      <RouterLink to="/employees">
        Nhân viên
      </RouterLink><i class="pi pi-angle-right" /><span>{{
        title
      }}</span>
    </nav>
    <header class="profile-page-title">
      <h1>{{ title }}</h1>
      <p>Thông tin cá nhân, giấy tờ pháp lý, bảo hiểm và tài khoản.</p>
    </header>
    <AppLoading v-if="loading" />
    <AppErrorState
      v-else-if="error"
      :error="error"
      @retry="load"
    />
    <div
      v-else-if="!allowed"
      class="alert-strip"
      role="alert"
    >
      Bạn không có quyền thực hiện thao tác này.
    </div>
    <EmployeeProfileForm
      v-else-if="record"
      :key="route.fullPath"
      ref="profileForm"
      :record="record"
      :fields="formFields"
      :select-options="selectOptions"
      :can-view-contract="permission.can('contracts')"
      :can-view-insurance="permission.can('insurance')"
      :can-adjust-contract="false"
      :busy="busy"
      :readonly="mode === 'READ'"
      @save="save"
      @cancel="router.push('/employees')"
    />
    <AppButton
      v-if="mode === 'READ' || error"
      label="Quay lại"
      severity="secondary"
      @click="router.push('/employees')"
    />
  </section>
</template>
<style scoped>
.employee-create-page {
  max-width: 1280px;
  margin: 0 auto;
  min-width: 0;
}
.profile-breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #64748b;
  font-size: 13px;
  margin-bottom: 20px;
}
.profile-breadcrumb a {
  color: #0067c0;
  text-decoration: none;
}
.profile-page-title {
  margin-bottom: 24px;
}
.profile-page-title h1 {
  font-size: 26px;
  font-weight: 600;
  margin: 0 0 8px;
}
.profile-page-title p {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}
.profile-save-error {
  padding: 14px 18px;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 8px;
}
@media (max-width: 640px) {
  .profile-page-title h1 {
    font-size: 22px;
  }
}
</style>
