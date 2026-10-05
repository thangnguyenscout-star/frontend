<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Dialog from 'primevue/dialog';
import AppButton from '@/components/common/AppButton.vue';
import AppForm from '@/components/common/AppForm.vue';
import AppStatusBadge from '@/components/common/AppStatusBadge.vue';
import AppLoading from '@/components/common/AppLoading.vue';
import AppErrorState from '@/components/common/AppErrorState.vue';
import { getModule } from '@/constants/modules';
import { useRecordDetail } from '@/composables/useRecordDetail';
import { usePermission } from '@/composables/usePermission';
import { useConfirm } from '@/composables/useConfirm';
import { useToast } from '@/composables/useToast';
import { apiErrorKey, ApiError } from '@/services/api/apiErrorHandler';
import { currency } from '@/utils/currency';
import type { HrRecord } from '@/types/common';
const props = defineProps<{ module: string }>();
const route = useRoute(),
  router = useRouter();
const { t, te, locale } = useI18n();
const definition = getModule(props.module);
const { row, related, history, loading, error, load, save } = useRecordDetail(
  props.module,
  String(route.params.id),
);
const permission = usePermission(),
  confirm = useConfirm(),
  toast = useToast();
const activeTab = ref(definition.detailTabs?.[0] || 'information');
const editing = ref(false),
  busy = ref(false),
  formError = ref('');
const fieldErrors = ref<Record<string, string>>({});
const draft = ref<HrRecord>({ id: '', code: '', name: '', status: '' });
const files = ref<File[]>([]);
const linked = computed(() =>
  (related.value[activeTab.value] || []).filter((r) =>
    props.module === 'positions'
      ? r.position === row.value?.name
      : r.employeeId === (row.value?.employeeId || row.value?.code),
  ),
);
function openEdit(renew = false) {
  if (!row.value) return;
  draft.value = { ...row.value };
  if (renew) {
    draft.value.startDate = new Date().toISOString().slice(0, 10);
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    draft.value.endDate = date.toISOString().slice(0, 10);
    draft.value.status = 'active';
  }
  formError.value = '';
  fieldErrors.value = {};
  editing.value = true;
}
async function submit(value: HrRecord) {
  busy.value = true;
  try {
    await save(value);
    editing.value = false;
    toast.success('success');
  } catch (e) {
    formError.value = apiErrorKey(e);
    fieldErrors.value = e instanceof ApiError ? e.fields : {};
    toast.error(apiErrorKey(e));
  } finally {
    busy.value = false;
  }
}
function status(value: string) {
  confirm(async () => {
    if (row.value) await submit({ ...row.value, status: value });
  });
}
function upload(event: Event) {
  const input = event.target as HTMLInputElement;
  for (const file of Array.from(input.files || [])) {
    if (file.size > 5 * 1024 * 1024) toast.error('fileTooLarge');
    else files.value.push(file);
  }
  input.value = '';
}
function download(file: File) {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(url);
}
const remainingDays = computed(() =>
  row.value?.endDate
    ? Math.ceil((new Date(String(row.value.endDate)).getTime() - Date.now()) / 86400000)
    : undefined,
);
const contractSections = [
  {
    title: 'Định danh pháp lý & Phân loại hợp đồng',
    keys: ['code', 'type', 'employeeId', 'name', 'signingDate', 'startDate', 'endDate', 'status'],
  },
  { title: 'Vị trí chức danh & Địa điểm làm việc', keys: ['department', 'position'] },
];
const print = () => window.print();
</script>
<template>
  <AppLoading v-if="loading" /><AppErrorState
    v-else-if="error"
    :error="error"
    @retry="load"
  />
  <section v-else-if="row">
    <AppButton
      :label="t('back')"
      icon="pi pi-arrow-left"
      text
      severity="secondary"
      @click="router.push('/' + module)"
    />
    <div class="page-heading detail-heading">
      <div>
        <div class="eyebrow">
          {{ t('modules.' + module) }}
        </div>
        <h1>
          {{ module === 'contracts' ? row.name : row.code }}
          <span
            v-if="module === 'contracts'"
            class="count-pill"
          >{{ row.code }}</span>
        </h1>
        <p>{{ row.name }} · {{ row.employeeId }} · {{ row.department }} · {{ row.position }}</p>
        <AppStatusBadge
          :label="t(row.status)"
          :severity="row.status === 'active' ? 'success' : 'warning'"
        />
      </div>
      <div class="toolbar-actions">
        <AppButton
          v-if="permission.can(module, 'edit')"
          :label="t('edit')"
          icon="pi pi-pencil"
          @click="openEdit()"
        /><AppButton
          v-if="module === 'contracts' && permission.can(module, 'renew')"
          :label="t('renew')"
          outlined
          @click="openEdit(true)"
        /><AppButton
          v-if="
            module === 'contracts' &&
              permission.can(module, 'terminate') &&
              row.status !== 'terminated'
          "
          :label="t('terminate')"
          severity="danger"
          outlined
          @click="status('terminated')"
        /><AppButton
          v-if="row.status === 'pending' && permission.can(module, 'approve')"
          :label="t('approve')"
          @click="status('approved')"
        /><AppButton
          v-if="row.status === 'pending' && permission.can(module, 'reject')"
          :label="t('reject')"
          severity="danger"
          outlined
          @click="status('rejected')"
        /><AppButton
          :label="t('print')"
          icon="pi pi-print"
          severity="secondary"
          outlined
          @click="print"
        />
      </div>
    </div>
    <div :class="module === 'contracts' ? 'two-column' : 'section-stack'">
      <div class="panel">
        <nav class="detail-tabs">
          <button
            v-for="tab in definition.detailTabs || ['information', 'history']"
            :key="tab"
            :class="{ active: tab === activeTab }"
            @click="activeTab = tab"
          >
            {{ te(tab) ? t(tab) : t('modules.' + tab) }}
          </button>
        </nav>
        <div class="detail-body">
          <template v-if="module === 'contracts' && activeTab === 'information'">
            <div class="section-stack">
              <section
                v-for="section in contractSections"
                :key="section.title"
                class="profile-panel"
              >
                <h2>{{ section.title }}</h2>
                <dl class="detail-grid">
                  <div
                    v-for="key in section.keys"
                    :key="key"
                  >
                    <dt>{{ t(key) }}</dt>
                    <dd>{{ te(String(row[key])) ? t(String(row[key])) : row[key] || '—' }}</dd>
                  </div>
                </dl>
              </section>
              <section class="profile-panel">
                <h2>Cấu trúc Lương Hợp đồng & Chế độ Đãi ngộ</h2>
                <div class="compensation-cards">
                  <div>
                    <span>Lương căn bản</span><strong>{{ currency(row.salary, locale) }}</strong>
                  </div>
                  <div>
                    <span>Tổng thu nhập ký HĐ</span><strong>{{ currency(row.income, locale) }}</strong>
                  </div>
                </div>
                <div class="summary-row">
                  <span>Phụ cấp cố định theo hợp đồng</span><strong>{{
                    currency(Number(row.income || 0) - Number(row.salary || 0), locale)
                  }}</strong>
                </div>
                <button
                  class="chip-button"
                  @click="activeTab = 'compensation'"
                >
                  Xem chi tiết lương & thu nhập →
                </button>
              </section>
            </div>
          </template><template v-else-if="['information', 'personal', 'employment'].includes(activeTab)">
            <h2>{{ t(activeTab) }}</h2>
            <dl class="detail-grid">
              <div
                v-for="field in definition.fields"
                :key="field.key"
              >
                <dt>{{ t(field.key) }}</dt>
                <dd>
                  {{
                    te(String(row[field.key])) ? t(String(row[field.key])) : row[field.key] || '—'
                  }}
                </dd>
              </div>
            </dl>
          </template><template v-else-if="activeTab === 'compensation'">
            <h2>{{ t('compensation') }}</h2>
            <div class="compensation-cards">
              <div>
                <span>{{ t('salary') }}</span><strong>{{ currency(row.salary, locale) }}</strong>
              </div>
              <div>
                <span>{{ t('income') }}</span><strong>{{ currency(row.income, locale) }}</strong>
              </div>
            </div>
          </template><template v-else-if="activeTab === 'allowances'">
            <h2>{{ t('allowances') }}</h2>
            <div class="allowance-row">
              <span>{{ t('allowances') }}</span><strong>{{ currency(Number(row.income) - Number(row.salary), locale) }}</strong>
            </div>
          </template><template v-else-if="activeTab === 'history'">
            <h2>{{ t('history') }}</h2>
            <p
              v-if="!history.length"
              class="muted"
            >
              {{ t('noHistory') }}
            </p>
            <div
              v-for="(item, index) in history"
              :key="index"
              class="history-row"
            >
              <i class="pi pi-history" />
              <div>
                <strong>{{ t(item.action) }} · {{ item.code }}</strong>
                <p>{{ new Date(item.date).toLocaleString(locale) }}</p>
              </div>
            </div>
          </template><template v-else-if="activeTab === 'documents'">
            <h2>{{ t('documents') }}</h2>
            <p class="muted">
              {{ t('documentHint') }}
            </p>
            <label
              v-if="permission.can(module, 'edit')"
              class="upload-zone"
            ><i class="pi pi-cloud-upload" /><span>{{ t('upload') }}</span><input
              type="file"
              multiple
              @change="upload"
            ></label>
            <div
              v-for="(file, index) in files"
              :key="index"
              class="allowance-row"
            >
              <span>{{ file.name }}</span><AppButton
                :label="t('download')"
                text
                @click="download(file)"
              />
            </div>
          </template><template v-else>
            <h2>{{ t('modules.' + activeTab) }}</h2>
            <p
              v-if="!linked.length"
              class="muted"
            >
              {{ t('empty') }}
            </p>
            <div
              v-for="item in linked"
              :key="item.id"
              class="allowance-row"
            >
              <RouterLink
                v-if="permission.can(activeTab)"
                :to="'/' + activeTab + '/' + item.id"
              >
                {{ item.code }} · {{ item.name }}
              </RouterLink><span v-else>{{ item.code }}</span><AppStatusBadge
                :label="t(item.status)"
                severity="info"
              />
            </div>
          </template>
        </div>
      </div>
      <aside
        v-if="module === 'contracts'"
        class="section-stack"
        style="align-content: start"
      >
        <section class="profile-panel">
          <h2>Thời hạn hợp đồng</h2>
          <div
            class="donut"
            style="margin: 20px auto; background: conic-gradient(#0067c0 75%, #e9e8e7 0)"
          >
            <div class="donut-center">
              <strong>{{ remainingDays === undefined ? '∞' : Math.max(0, remainingDays) }}</strong>{{
                remainingDays === undefined
                  ? 'Không thời hạn'
                  : remainingDays < 0
                    ? 'Đã hết hạn'
                    : 'Ngày còn lại'
              }}
            </div>
          </div>
          <div class="snapshot">
            <p>
              Ngày bắt đầu: <strong>{{ row.startDate }}</strong>
            </p>
            <p>
              Ngày kết thúc: <strong>{{ row.endDate || 'Không xác định' }}</strong>
            </p>
          </div>
          <div
            v-if="remainingDays !== undefined && remainingDays <= 30"
            class="alert-strip warning"
            style="margin-top: 16px"
          >
            <i class="pi pi-exclamation-triangle" />{{
              remainingDays < 0
                ? 'Hợp đồng đã hết hạn. Cần rà soát hồ sơ.'
                : 'Hợp đồng sắp hết hạn. Cần xem xét tái ký.'
            }}
          </div>
          <div
            class="section-stack"
            style="margin-top: 16px"
          >
            <AppButton
              v-if="permission.can(module, 'renew')"
              label="Kích hoạt quy trình Tái ký HĐ"
              icon="pi pi-refresh"
              @click="openEdit(true)"
            /><AppButton
              v-if="permission.can(module, 'terminate') && row.status !== 'terminated'"
              label="Chấm dứt hợp đồng"
              icon="pi pi-exclamation-triangle"
              severity="danger"
              outlined
              @click="status('terminated')"
            />
          </div>
        </section>
        <section class="profile-panel">
          <h2>Bố trí nhân sự Khách sạn</h2>
          <div class="summary-row">
            <span>Nhân viên</span><strong>{{ row.name }}</strong>
          </div>
          <div class="summary-row">
            <span>Bộ phận</span><strong>{{ row.department }}</strong>
          </div>
          <div class="summary-row">
            <span>Vị trí công tác</span><strong>{{ row.position }}</strong>
          </div>
        </section>
      </aside>
    </div>
    <Dialog
      v-model:visible="editing"
      modal
      :header="t('edit')"
      :style="{ width: '740px' }"
      :breakpoints="{ '800px': '95vw' }"
    >
      <p
        v-if="formError"
        class="field-error"
      >
        {{ t(formError) }}
      </p>
      <AppForm
        :record="draft"
        :fields="definition.fields"
        :busy="busy"
        :server-errors="fieldErrors"
        @save="submit"
        @cancel="editing = false"
      />
    </Dialog>
  </section>
</template>
