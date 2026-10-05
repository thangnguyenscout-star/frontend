<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import EmployeeProfileForm from '@/components/employees/EmployeeProfileForm.vue';
import AppLoading from '@/components/common/AppLoading.vue';
import AppErrorState from '@/components/common/AppErrorState.vue';
import { useRecordDetail } from '@/composables/useRecordDetail';
import { usePermission } from '@/composables/usePermission';
import { useToast } from '@/composables/useToast';
import { apiErrorKey, ApiError } from '@/services/api/apiErrorHandler';
import type { HrRecord } from '@/types/common';

const route = useRoute(),
  router = useRouter(),
  { t } = useI18n();
const permission = usePermission(),
  toast = useToast();
const { row, related, loading, error, load, save } = useRecordDetail(
  'employees',
  String(route.params.id),
);
const busy = ref(false),
  formError = ref(''),
  fieldErrors = ref<Record<string, string>>({});
const formVersion = ref(0);
const currentContract = computed(() => {
  const contracts = (related.value.contracts || []).filter(
    (record) => record.employeeId === row.value?.code,
  );
  return contracts.find((record) => record.status === 'active') || contracts[0];
});
const tabKeys = ['personal', 'legal', 'contracts', 'insurance'];
const activeTab = computed(() =>
  Math.max(
    0,
    tabKeys.indexOf(String(route.query.tab === 'employment' ? 'contracts' : route.query.tab)),
  ),
);
function selectTab(index: number) {
  router.replace({ query: { ...route.query, tab: tabKeys[index] } });
}
function cancel() {
  formError.value = '';
  fieldErrors.value = {};
  formVersion.value++;
}
async function submit(record: HrRecord) {
  if (!permission.can('employees', 'edit') || busy.value) return;
  busy.value = true;
  formError.value = '';
  fieldErrors.value = {};
  try {
    await save(record);
    toast.success('success');
  } catch (e) {
    formError.value = apiErrorKey(e);
    fieldErrors.value = e instanceof ApiError ? e.fields : {};
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <AppLoading v-if="loading" />
  <AppErrorState
    v-else-if="error"
    :error="error"
    @retry="load"
  />
  <section
    v-else-if="row"
    class="employee-detail-page"
  >
    <nav
      class="profile-breadcrumb"
      aria-label="Đường dẫn"
    >
      <RouterLink to="/employees">
        Nhân viên
      </RouterLink>
      <i
        class="pi pi-angle-right"
        aria-hidden="true"
      />
      <span>Hồ sơ nhân viên</span>
    </nav>
    <div class="profile-page-title">
      <h1>Hồ sơ nhân viên</h1>
      <p>Quản lý thông tin cá nhân, giấy tờ và hồ sơ công việc.</p>
    </div>
    <p
      v-if="formError"
      class="field-error profile-save-error"
      role="alert"
    >
      {{ t(formError) }}
    </p>
    <EmployeeProfileForm
      :key="row.id + '-' + formVersion"
      :record="row"
      :contract="currentContract"
      :can-view-contract="permission.can('contracts')"
      :can-view-insurance="permission.can('insurance')"
      :readonly="!permission.can('employees', 'edit')"
      :can-adjust-contract="permission.can('contracts', 'edit')"
      :active-tab="activeTab"
      :busy="busy"
      :server-errors="fieldErrors"
      @tab-change="selectTab"
      @save="submit"
      @cancel="cancel"
    />
  </section>
</template>
<style scoped>
.employee-detail-page {
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
