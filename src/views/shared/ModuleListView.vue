<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import Select from 'primevue/select';
import MultiSelect from 'primevue/multiselect';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import AppInspector from '@/components/common/AppInspector.vue';
import ContractInspector from '@/components/contracts/ContractInspector.vue';
import EmployeeInspector from '@/components/employees/EmployeeInspector.vue';
import AppStatusBadge from '@/components/common/AppStatusBadge.vue';
import { currency } from '@/utils/currency';
import AppButton from '@/components/common/AppButton.vue';
import AppDataTable from '@/components/common/AppDataTable.vue';
import AppForm from '@/components/common/AppForm.vue';
import ContractKpis from '@/components/contracts/ContractKpis.vue';
import { getModule, departments, positions } from '@/constants/modules';
import { useRecords } from '@/composables/useRecords';
import { usePermission } from '@/composables/usePermission';
import { useToast } from '@/composables/useToast';
import { useConfirm } from '@/composables/useConfirm';
import { ApiError, apiErrorKey } from '@/services/api/apiErrorHandler';
import { exportCsv } from '@/utils/export';
import type { HrRecord } from '@/types/common';
const props = defineProps<{ module: string }>();
const definition = getModule(props.module);
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const preview = ref<HrRecord>();
const previewVisible = ref(false);
const previewTab = ref('information');
function viewRow(row: HrRecord) {
  if (['employees', 'contracts'].includes(props.module)) {
    preview.value = row;
    previewVisible.value = true;
    previewTab.value = 'information';
  } else router.push('/' + props.module + '/' + row.id);
}
const permission = usePermission();
const toast = useToast();
const confirm = useConfirm();
const { rows, all, total, loading, error, query, load, reset, save, remove, simulateError } =
  useRecords(props.module);
watch(
  () => route.query.search,
  (value) => {
    if (props.module === 'employees') {
      query.search = typeof value === 'string' ? value : '';
      query.page = 1;
    }
  },
  { immediate: true },
);
const visibleColumns = ref([...definition.columns]);
const dialog = ref(false),
  busy = ref(false),
  more = ref(false);
const editing = ref<HrRecord>({ id: '', code: '', name: '', status: 'draft' });
const fieldErrors = ref<Record<string, string>>({});
const dialogError = ref('');
const simulation = ref(0);
const options = computed(() =>
  [0, 400, 401, 403, 404, 409, 422, 429, 500, 503].map((value) => ({
    value,
    label: value ? String(value) : t('normal'),
  })),
);
function edit(row?: HrRecord) {
  editing.value = row ? { ...row } : { id: '', code: '', name: '', status: 'draft' };
  fieldErrors.value = {};
  dialogError.value = '';
  dialog.value = true;
}
async function submit(row: HrRecord) {
  busy.value = true;
  dialogError.value = '';
  try {
    await save(row);
    dialog.value = false;
    toast.success('success');
  } catch (e) {
    dialogError.value = apiErrorKey(e);
    fieldErrors.value = e instanceof ApiError ? e.fields : {};
  } finally {
    busy.value = false;
  }
}
function action(row: HrRecord, status: string) {
  confirm(async () => {
    try {
      await save({ ...row, status });
      toast.success('success');
    } catch (e) {
      toast.error(apiErrorKey(e));
    }
  });
}
function deleteRow(row: HrRecord) {
  confirm(async () => {
    try {
      await remove(row.id);
      toast.success('success');
    } catch (e) {
      toast.error(apiErrorKey(e));
    }
  });
}
function download() {
  exportCsv(
    all.value,
    visibleColumns.value,
    visibleColumns.value.map((c) => t(c)),
    props.module,
  );
}
function filter() {
  query.page = 1;
}
</script>
<template>
  <section :class="{ 'with-inspector': previewVisible }">
    <div class="page-heading">
      <div>
        <div class="eyebrow">
          {{ t('workspace') }} / {{ t('modules.' + module) }}
        </div>
        <h1>{{ t('modules.' + module) }}</h1>
        <p v-if="module === 'contracts'">Qu?n l? h? s? h?p ??ng, m?c l??ng BHXH, c? c?u ph? c?p, quy tr?nh t?i k? v? c?nh b?o th?i h?n.</p><p v-else>{{ t('subtitle') }}</p>
      </div>
      <AppButton
        v-if="permission.can(module, 'create')"
        :label="
          t(
            module === 'contracts'
              ? 'newContract'
              : module === 'employees'
                ? 'employeeCreate'
                : 'create',
          )
        "
        icon="pi pi-plus"
        @click="module === 'employees' ? router.push('/employees/new') : edit()"
      />
    </div>
    <ContractKpis
      :rows="all"
      :contract="module === 'contracts'"
      :employee="module === 'employees'"
    />
    <div class="panel">
      <div class="panel-t op">
        <div class="panel-title">
          <h2>{{ t('modules.' + module) }}</h2>
          <span class="count-pill">{{ total }}</span>
        </div>
        <div class="toolbar-actions">
          <AppButton
            :label="t('export')"
            icon="pi pi-download"
            severity="secondary"
            outlined
            @click="download"
          /><AppButton
            :aria-label="t('refresh')"
            icon="pi pi-refresh"
            severity="secondary"
            text
            @click="load"
          /><AppButton
            :aria-label="t('more')"
            icon="pi pi-ellipsis-h"
            severity="secondary"
            text
            @click="more = !more"
          />
        </div>
      </div>
      <div class="filters">
        <div class="search-field">
          <i class="pi pi-search" /><InputText
            v-model="query.search"
            :placeholder="t('search')"
            :aria-label="t('search')"
            @update:model-value="filter"
          />
        </div>
        <Select
          v-model="query.filters.department"
          :options="departments"
          :placeholder="t('department')"
          show-clear
          @change="filter"
        /><Select
          v-model="query.filters.status"
          :options="
            ['active', 'pending', 'expired', 'draft', 'approved', 'rejected', 'terminated'].map(
              (v) => ({ value: v, label: t(v) }),
            )
          "
          option-label="label"
          option-value="value"
          :placeholder="t('status')"
          show-clear
          @change="filter"
        /><template v-if="['contracts', 'employees'].includes(module)">
          <Select
            v-model="query.filters.type"
            :options="['fixed', 'permanent', 'probation'].map((v) => ({ value: v, label: t(v) }))"
            option-label="label"
            option-value="value"
            :placeholder="t('type')"
            show-clear
            @change="filter"
          /><Select
            v-model="query.filters.expiration"
            :options="[
              { value: '7', label: t('days7') },
              { value: '30', label: t('days30') },
            ]"
            option-label="label"
            option-value="value"
            :placeholder="t('expiration')"
            show-clear
            @change="filter"
          />
        </template><AppButton
          :aria-label="t('reset')"
          icon="pi pi-filter-slash"
          text
          severity="secondary"
          @click="reset"
        />
      </div>
      <div
        v-if="more"
        class="advanced-filters"
      >
        <label>{{ t('columns')
        }}<MultiSelect
          v-model="visibleColumns"
          :options="definition.columns.map((v) => ({ value: v, label: t(v) }))"
          option-label="label"
          option-value="value"
          display="chip"
        /></label><label>{{ t('simulate')
        }}<Select
          v-model="simulation"
          :options="options"
          option-label="label"
          option-value="value"
          @change="
            simulateError(simulation);
            load();
          "
        /></label><template v-if="module === 'contracts'">
          <label>{{ t('position')
          }}<Select
            v-model="query.filters.position"
            :options="positions"
            show-clear
            @change="filter"
          /></label><label>{{ t('startDate')
          }}<InputText
            v-model="query.filters.startDate"
            type="date"
            @change="filter"
          /></label><label>{{ t('endDate')
          }}<InputText
            v-model="query.filters.endDate"
            type="date"
            @change="filter"
          /></label>
        </template>
      </div>
      <div
        v-if="['employees', 'contracts'].includes(module)"
        class="quick-filters"
      >
        <span>Lờc nhanh:</span><button
          type="button"
          class="chip-button"
          :class="{ active: query.filters.expiration === '30' }"
          @click="
            query.filters.expiration = query.filters.expiration ? '' : '30';
            filter();
          "
        >
          Hết hạn Hĝ trong 30 ngày
        </button><button
          v-for="dept in departments.slice(0, 2)"
          :key="dept"
          type="button"
          class="chip-button"
          :class="{ active: query.filters.department === dept }"
          @click="
            query.filters.department = query.filters.department === dept ? '' : dept;
            filter();
          "
        >
          {{ dept }}
        </button>
      </div>
      <AppDataTable
        :rows="rows"
        :columns="visibleColumns"
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
        @view="viewRow"
        @reset="reset"
        @retry="load"
      >
        <template #actions="{ row }">
          <div class="row-actions">
            <button
              class="icon-button"
              :title="t('view')"
              :aria-label="t('view')"
              @click="viewRow(row)"
            >
              <i class="pi pi-eye" />
            </button><button
              v-if="permission.can(module, 'edit')"
              class="icon-button"
              :title="t('edit')"
              :aria-label="t('edit')"
              @click="edit(row)"
            >
              <i class="pi pi-pencil" />
            </button><button
              v-if="row.status === 'pending' && permission.can(module, 'approve')"
              class="icon-button"
              :title="t('approve')"
              :aria-label="t('approve')"
              @click="action(row, 'approved')"
            >
              <i class="pi pi-check" />
            </button><button
              v-if="permission.can(module, 'delete')"
              class="icon-button danger-text"
              :title="t('delete')"
              :aria-label="t('delete')"
              @click="deleteRow(row)"
            >
              <i class="pi pi-trash" />
            </button>
          </div>
        </template>
      </AppDataTable>
    </div>
    <p class="page-footnote">
      <i class="pi pi-shield" /> {{ t('demo') }}
    </p>
    <Dialog
      v-model:visible="dialog"
      modal
      :header="t(editing.id ? 'edit' : module === 'employees' ? 'employeeCreate' : 'create')"
      :style="{ width: module === 'employees' ? '1000px' : '740px' }"
      :breakpoints="{ '800px': '95vw' }"
    >
      <p
        v-if="dialogError"
        class="field-error"
        role="alert"
      >
        {{ t(dialogError) }}
      </p>
      <AppForm
        :record="editing"
        :employee="module === 'employees'"
        :fields="definition.fields"
        :busy="busy"
        :server-errors="fieldErrors"
        @save="submit"
        @cancel="dialog = false"
      />
    </Dialog>
    <AppInspector
      v-model:visible="previewVisible"
      position="right"
      :header="module === 'employees' ? 'Tóm tắt nhân sự' : 'Chi tiết hợp đồng'"
      :style="{ width: '420px', maxWidth: '95vw' }"
    >
      <EmployeeInspector v-if="preview && module === 'employees'" :record="preview" />
      <ContractInspector v-else-if="preview && module === 'contracts'" :record="preview" />
      <template v-else-if="preview">
        <div class="summary-card">
          <div class="profile-identity">
            <div
              class="profile-avatar"
              style="width: 56px; height: 56px; font-size: 18px"
            >
              {{
                preview.name
                  .split(' ')
                  .slice(-2)
                  .map((s) => s[0])
                  .join('')
              }}
            </div>
            <div>
              <span class="table-link">{{ preview.code }}</span>
              <h3>{{ preview.name }}</h3>
              <small>{{ preview.position }}</small>
            </div>
          </div>
          <AppStatusBadge
            :label="t(preview.status)"
            :severity="preview.status === 'active' ? 'success' : 'warning'"
          />
        </div>
        <nav class="drawer-tabs">
          <button
            v-for="tab in module === 'contracts' || permission.can('payroll')
              ? ['information', 'compensation']
              : ['information']"
            :key="tab"
            :class="{ active: previewTab === tab }"
            @click="previewTab = tab"
          >
            {{ t(tab) }}
          </button>
        </nav>
        <template v-if="previewTab === 'information'">
          <div
            v-for="key in module === 'employees'
              ? [
                'department',
                'startDate',
                'birthDate',
                'phone',
                'email',
                'identityNumber',
                'address',
              ]
              : ['employeeId', 'department', 'type', 'signingDate', 'startDate', 'endDate']"
            :key="key"
            class="summary-row"
          >
            <span>{{ t(key) }}</span><strong>{{
              preview[key]
                ? ['fixed', 'permanent', 'probation'].includes(String(preview[key]))
                  ? t(String(preview[key]))
                  : preview[key]
                : '—'
            }}</strong>
          </div>
        </template>
        <template v-else>
          <div
            v-for="key in ['salary', 'income', 'serviceCharge', 'allowance']"
            :key="key"
            class="summary-row"
          >
            <span>{{ t(key) }}</span><strong>{{ currency(preview[key]) }}</strong>
          </div>
          <div class="summary-row">
            <span>{{ t('bank') }}</span><strong>{{ preview.bank || '—' }}</strong>
          </div>
        </template>
        <footer class="dialog-footer">
          <AppButton
            label="Mở toàn bộ hồ sơ chi tiết"
            icon="pi pi-arrow-up-right"
            @click="router.push('/' + module + '/' + preview.id)"
          />
        </footer>
      </template>
    </AppInspector>
  </section>
</template>

<style scoped>
@media(min-width:1920px){.with-inspector{padding-right:404px}}
</style>
