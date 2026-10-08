<script setup lang="ts">
import { getApiErrorMessage } from '@/utils/error-message';
import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import AppButton from '@/components/common/AppButton.vue';
import AppDatePicker from '@/components/common/AppDatePicker.vue';
import AppErrorState from '@/components/common/AppErrorState.vue';
import AppLoading from '@/components/common/AppLoading.vue';
import { recruitmentService } from '@/services/modules/recruitment.service';
import type {
  RecruitmentCatalogs,
  RecruitmentRecord,
  RecruitmentInput,
  RecruitmentValidation,
} from '@/types/recruitment';
import {
  recruitmentStatusLabels,
  emptyRecruitment,
  validateRecruitment,
} from '@/utils/recruitment';

const route = useRoute();
const router = useRouter();
const id = computed(() => String(route.params.id || ''));
const mode = computed(() =>
  !id.value ? 'INSERT' : route.meta.recruitmentMode === 'READ' ? 'READ' : 'EDIT',
);
const editing = computed(() => mode.value === 'EDIT');
const readOnly = computed(() => mode.value === 'READ');
const loaded = ref(false);
const detail = ref<RecruitmentRecord | null>(null);
const displayDate = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('vi-VN');
};
const form = reactive<RecruitmentInput>(emptyRecruitment());
const catalogs = ref<RecruitmentCatalogs>({ departments: [], positions: [] });
const issuePlaces = ref<{ value: string; label: string }[]>([]);
const invalidIssueDate = ref(false);
const errors = ref<RecruitmentValidation>({});
const loading = ref(true);
const saving = ref(false);
const loadingPositions = ref(false);
const positionError = ref('');
let positionSequence = 0;
async function loadPositions() {
  const sequence = ++positionSequence;
  catalogs.value.positions = [];
  positionError.value = '';
  loadingPositions.value = true;
  try {
    const positions = await recruitmentService.getPositions(form.maBoPhanDuKien);
    if (sequence === positionSequence) catalogs.value.positions = positions;
  } catch (exception) {
    if (sequence === positionSequence) positionError.value = getApiErrorMessage(exception);
  } finally {
    if (sequence === positionSequence) loadingPositions.value = false;
  }
}
watch(
  () => form.maBoPhanDuKien,
  () => {
    if (loading.value) return;
    form.maChucVuDuKien = '';
    void loadPositions();
  },
  { flush: 'sync' },
);
const error = ref('');
const genderOptions = [
  { value: 'M', label: 'Nam' },
  { value: 'F', label: 'Nữ' },
  { value: 'O', label: 'Khác' },
];
const dateValue = (value: string | null) => (value ? new Date(value + 'T00:00:00') : null);
function setDate(key: 'ngayTiepNhan' | 'ngayCap', value: unknown) {
  form[key] =
    value instanceof Date && !Number.isNaN(value.getTime())
      ? [
          value.getFullYear(),
          String(value.getMonth() + 1).padStart(2, '0'),
          String(value.getDate()).padStart(2, '0'),
        ].join('-')
      : null;
}
let loadSequence = 0;
async function load() {
  const sequence = ++loadSequence;
  loading.value = true;
  ++positionSequence;
  positionError.value = '';
  loadingPositions.value = false;
  loaded.value = false;
  detail.value = null;
  errors.value = {};
  invalidIssueDate.value = false;
  Object.assign(form, emptyRecruitment());
  error.value = '';
  try {
    const [options, record, places] = await Promise.all([
      recruitmentService.getCatalogs(),
      id.value ? recruitmentService.getDetail(id.value) : Promise.resolve(null),
      recruitmentService.getIssuePlaces(),
    ]);
    if (sequence !== loadSequence) return;
    catalogs.value = options;
    issuePlaces.value = places;
    detail.value = record;
    if (record) {
      const {
        ngayTiepNhan,
        ho,
        tenDem,
        ten,
        gioiTinh,
        soCCCD,
        ngayCap,
        noiCap,
        soDienThoai,
        email,
        tongThuNhapThoaThuan,
        luongCoBan,
        luongThuViec,
        maBoPhanDuKien,
        maChucVuDuKien,
        ngayBatDauLamViec,
      } = record;
      Object.assign(form, {
        ngayTiepNhan,
        ho,
        tenDem,
        ten,
        gioiTinh,
        soCCCD,
        ngayCap,
        noiCap,
        soDienThoai,
        email,
        tongThuNhapThoaThuan,
        luongCoBan,
        luongThuViec,
        maBoPhanDuKien,
        maChucVuDuKien,
        ngayBatDauLamViec,
      });
    }
    await loadPositions();
    if (sequence !== loadSequence) return;
    loaded.value = true;
  } catch (exception) {
    if (sequence !== loadSequence) return;
    error.value = getApiErrorMessage(exception);
  } finally {
    if (sequence === loadSequence) loading.value = false;
  }
}
async function save() {
  if (
    readOnly.value ||
    loading.value ||
    loadingPositions.value ||
    positionError.value ||
    !loaded.value ||
    saving.value
  )
    return;
  errors.value = validateRecruitment(form);
  if (invalidIssueDate.value)
    errors.value.ngayCap = 'Ngày cấp không hợp lệ. Vui lòng nhập đầy đủ ngày/tháng/năm.';
  if (Object.keys(errors.value).length || saving.value) return;
  saving.value = true;
  error.value = '';
  try {
    if (editing.value) await recruitmentService.update(id.value, { ...form });
    else await recruitmentService.create({ ...form });
    await router.push({ path: '/tuyen-dung', query: { saved: '1' } });
  } catch (exception) {
    error.value = getApiErrorMessage(exception);
  } finally {
    saving.value = false;
  }
}
watch(() => route.fullPath, load, { immediate: true });
</script>

<template>
  <div class="contract-create">
    <header class="form-page-header">
      <div>
        <button :disabled="saving" class="breadcrumb-back" @click="router.push('/tuyen-dung')">
          <i class="pi pi-arrow-left mr-2" />Quay lại tuyển dụng
        </button>
        <h1 class="text-2xl font-bold text-surface-900">
          {{
            readOnly
              ? 'Chi tiết hồ sơ tuyển dụng'
              : editing
                ? 'Chỉnh sửa hồ sơ tuyển dụng'
                : 'Thêm hồ sơ tuyển dụng'
          }}
        </h1>
        <p class="mt-1 text-sm text-surface-500">
          Các trường có dấu * là bắt buộc. Ngày bắt đầu làm việc được cập nhật theo quy trình tuyển
          dụng.
          <span v-if="!editing && !readOnly">Hồ sơ mới có trạng thái Tuyển dụng (1).</span>
        </p>
      </div>
      <div class="header-actions">
        <AppButton
          label="Hủy"
          severity="secondary"
          outlined
          :disabled="saving"
          @click="router.push('/tuyen-dung')"
        />
        <AppButton
          v-if="!readOnly"
          :disabled="loading || loadingPositions || !!positionError || !loaded"
          label="Lưu hồ sơ"
          icon="pi pi-check"
          :loading="saving"
          @click="save"
        />
      </div>
    </header>

    <AppErrorState v-if="error" :error="error" @retry="load" />
    <AppErrorState v-if="positionError" :error="positionError" @retry="loadPositions" />
    <AppLoading v-if="loading" />

    <form v-else-if="loaded" novalidate class="recruitment-form" @submit.prevent="save">
      <section v-if="detail" class="profile-panel record-summary">
        <div class="record-heading">
          <h2>{{ detail.hoTen }}</h2>
          <span>{{ recruitmentStatusLabels[detail.trangThai] }}</span>
        </div>
        <dl class="record-metadata">
          <div>
            <dt>Mã nhân viên</dt>
            <dd>{{ detail.maNhanVien || '—' }}</dd>
          </div>
          <div>
            <dt>Ngày sinh</dt>
            <dd>{{ displayDate(detail.ngaySinh) }}</dd>
          </div>
          <div>
            <dt>Trưởng bộ phận phê duyệt</dt>
            <dd>{{ detail.hodApprovedBy || '—' }} · {{ displayDate(detail.hodApprovedDate) }}</dd>
          </div>
          <div>
            <dt>Nhân sự phê duyệt</dt>
            <dd>{{ detail.hrApprovedBy || '—' }} · {{ displayDate(detail.hrApprovedDate) }}</dd>
          </div>
          <div>
            <dt>Ngày chủ sở hữu ký</dt>
            <dd>{{ displayDate(detail.ownerSignedDate) }}</dd>
          </div>
          <div>
            <dt>Ghi chú</dt>
            <dd class="record-note">
              {{ detail.ghiChu || '—' }}
            </dd>
          </div>
        </dl>
      </section>
      <fieldset :disabled="readOnly || saving" class="form-fields">
        <section class="profile-panel contract-master">
          <h2>Thông tin cá nhân</h2>
          <div class="form-grid recruitment-grid">
            <label class="field"
              ><span>Họ <b>*</b></span
              ><InputText
                v-model="form.ho"
                :disabled="readOnly || saving"
                maxlength="10"
              /><small>{{ errors.ho }}</small></label
            >
            <label class="field"
              ><span>Tên đệm <b>*</b></span
              ><InputText
                v-model="form.tenDem"
                :disabled="readOnly || saving"
                maxlength="30"
              /><small>{{ errors.tenDem }}</small></label
            >
            <label class="field"
              ><span>Tên <b>*</b></span
              ><InputText
                v-model="form.ten"
                :disabled="readOnly || saving"
                maxlength="20"
              /><small>{{ errors.ten }}</small></label
            >
            <label class="field"
              ><span>Giới tính <b>*</b></span
              ><Select
                v-model="form.gioiTinh"
                :disabled="readOnly || saving"
                :options="genderOptions"
                option-label="label"
                option-value="value"
                placeholder="Chọn giới tính"
              /><small>{{ errors.gioiTinh }}</small></label
            >
            <label class="field"
              ><span>Số điện thoại</span
              ><InputText
                v-model="form.soDienThoai"
                :disabled="readOnly || saving"
                maxlength="13"
              /><small>{{ errors.soDienThoai }}</small></label
            >
            <label class="field"
              ><span>Email</span
              ><InputText
                v-model="form.email"
                :disabled="readOnly || saving"
                type="email"
                maxlength="100"
              /><small>{{ errors.email }}</small></label
            >
          </div>
        </section>

        <section class="profile-panel contract-master">
          <h2>Thông tin căn cước công dân</h2>
          <div class="form-grid recruitment-grid">
            <label class="field">
              <span>Số CCCD</span>
              <InputText
                v-model="form.soCCCD"
                :disabled="readOnly || saving"
                :invalid="!!errors.soCCCD"
                placeholder="Nhập số CCCD"
              />
              <small>{{ errors.soCCCD }}</small>
            </label>
            <label class="field">
              <span>Ngày cấp</span>
              <AppDatePicker
                :model-value="dateValue(form.ngayCap)"
                :disabled="readOnly || saving"
                :invalid="!!errors.ngayCap"
                :manual-input="true"
                show-icon
                date-format="dd/mm/yy"
                placeholder="dd/mm/yyyy"
                @update:model-value="setDate('ngayCap', $event)"
                @invalid-change="invalidIssueDate = $event"
              />
              <small>{{ errors.ngayCap }}</small>
            </label>
            <label class="field">
              <span>Nơi cấp</span>
              <Select
                v-model="form.noiCap"
                :options="issuePlaces"
                :disabled="readOnly || saving"
                :invalid="!!errors.noiCap"
                option-label="label"
                option-value="value"
                filter
                filter-by="label,value"
                placeholder="Chọn tỉnh/thành phố"
                empty-message="Chưa có danh mục tỉnh/thành phố"
                empty-filter-message="Không tìm thấy tỉnh/thành phố"
              />
              <small>{{ errors.noiCap }}</small>
            </label>
          </div>
        </section>

        <section class="profile-panel contract-master recruitment-details">
          <h2>Thông tin tuyển dụng</h2>
          <div class="form-grid recruitment-grid">
            <label class="field"
              ><span>Ngày tiếp nhận</span
              ><AppDatePicker
                :disabled="readOnly || saving"
                :model-value="dateValue(form.ngayTiepNhan)"
                show-icon
                date-format="dd/mm/yy"
                @update:model-value="setDate('ngayTiepNhan', $event)"
            /></label>
            <label class="field"
              ><span>Bộ phận dự kiến <b>*</b></span
              ><Select
                v-model="form.maBoPhanDuKien"
                :disabled="readOnly || saving"
                :options="catalogs.departments"
                option-label="label"
                option-value="value"
                filter
                filter-by="label,value"
                :invalid="!!errors.maBoPhanDuKien"
                empty-message="Chưa có bộ phận"
                empty-filter-message="Không tìm thấy bộ phận"
                placeholder="Chọn bộ phận"
              /><small>{{ errors.maBoPhanDuKien }}</small></label
            >
            <label class="field"
              ><span>Chức danh dự kiến <b>*</b></span
              ><Select
                v-model="form.maChucVuDuKien"
                :disabled="
                  readOnly || saving || loadingPositions || !!positionError || !form.maBoPhanDuKien
                "
                :loading="loadingPositions"
                :options="catalogs.positions"
                option-label="label"
                option-value="value"
                filter
                filter-by="label,value"
                :invalid="!!errors.maChucVuDuKien"
                empty-message="Chưa có chức danh"
                empty-filter-message="Không tìm thấy chức danh"
                placeholder="Chọn chức danh"
              /><small>{{ positionError || errors.maChucVuDuKien }}</small></label
            >
            <label class="field"
              ><span>Ngày bắt đầu làm việc</span
              ><AppDatePicker
                :disabled="true"
                :model-value="dateValue(form.ngayBatDauLamViec)"
                show-icon
                date-format="dd/mm/yy"
            /></label>
          </div>
        </section>

        <section class="profile-panel contract-master">
          <h2>Thu nhập</h2>
          <div class="form-grid recruitment-grid">
            <label class="field"
              ><span>Tổng thu nhập thỏa thuận <b>*</b></span
              ><InputNumber
                v-model="form.tongThuNhapThoaThuan"
                :disabled="readOnly || saving"
                mode="currency"
                currency="VND"
                locale="vi-VN"
                :min="0"
              /><small>{{ errors.tongThuNhapThoaThuan }}</small></label
            >
            <label class="field"
              ><span>Lương cơ bản <b>*</b></span
              ><InputNumber
                v-model="form.luongCoBan"
                :disabled="readOnly || saving"
                mode="currency"
                currency="VND"
                locale="vi-VN"
                :min="0"
              /><small>{{ errors.luongCoBan }}</small></label
            >
            <label class="field"
              ><span>Lương thử việc <b>*</b></span
              ><InputNumber
                v-model="form.luongThuViec"
                :disabled="readOnly || saving"
                mode="currency"
                currency="VND"
                locale="vi-VN"
                :min="0"
              /><small>{{ errors.luongThuViec }}</small></label
            >
          </div>
        </section>
      </fieldset>
      <div v-if="!readOnly" class="dialog-footer contract-form-actions">
        <AppButton
          type="button"
          label="Hủy"
          severity="secondary"
          outlined
          :disabled="saving"
          @click="router.push('/tuyen-dung')"
        />
        <AppButton type="submit" label="Lưu hồ sơ" icon="pi pi-check" :loading="saving" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.record-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.record-heading h2 {
  margin: 0;
  font-size: 18px;
}
.record-heading span {
  padding: 6px 12px;
  border-radius: 16px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 13px;
}
.record-metadata {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
  margin-bottom: 0;
}
.record-metadata dt {
  color: #64748b;
  font-size: 12px;
}
.record-metadata dd {
  margin: 6px 0 0;
  font-size: 13px;
  overflow-wrap: anywhere;
}
.record-note {
  white-space: pre-wrap;
}

.form-fields {
  display: grid;
  gap: 20px;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
.contract-create {
  max-width: 1200px;
  margin: 0 auto;
  min-width: 0;
}
.field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 7px;
  color: var(--p-surface-700);
  font-size: 13px;
  font-weight: 500;
}
.field :deep(.p-inputtext),
.field :deep(.p-select),
.field :deep(.p-inputnumber),
.field :deep(.p-datepicker) {
  width: 100%;
  min-width: 0;
  font-size: 13px;
}
.field > span {
  min-height: 20px;
  line-height: 20px;
}
.field :deep(.p-inputtext),
.field :deep(.p-select) {
  height: 40px;
}
.field :deep(.p-select-label) {
  padding-block: 9px;
}
.field :deep(.p-inputnumber-input) {
  text-align: right;
}
.field :deep(.app-date-picker) {
  width: 100%;
  min-width: 0;
}
.field :deep(.p-datepicker-dropdown) {
  width: 40px;
}
.field b {
  color: var(--p-red-500);
}
.field small {
  color: var(--p-red-500);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
}
.form-page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 20px;
}
.form-page-header h1 {
  margin: 0 0 6px;
  font-size: 26px;
  font-weight: 600;
}
.form-page-header p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}
.breadcrumb-back {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: 0 0 14px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #0067c0;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.breadcrumb-back:hover {
  text-decoration: underline;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}
.header-actions :deep(.p-button) {
  height: 40px;
  min-height: 40px;
  padding: 0 14px;
}
.recruitment-form {
  display: grid;
  gap: 20px;
}
.contract-master {
  margin: 0;
  padding: 24px;
}
.contract-master h2 {
  margin: 0 0 18px;
  padding-left: 12px;
  border-left: 3px solid #0067c0;
  font-size: 16px;
}
.recruitment-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  width: 100%;
  align-items: start;
}
.recruitment-details .recruitment-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.field small:empty {
  display: none;
}
.contract-form-actions {
  position: sticky;
  bottom: 0;
  z-index: 2;
  margin-top: 0;
  padding: 14px 0;
  background: #fff;
}
.contract-form-actions :deep(.p-button) {
  min-width: 110px;
  min-height: 40px;
}
@media (max-width: 1000px) {
  .header-actions {
    flex-wrap: wrap;
  }
}
@media (max-width: 900px) {
  .recruitment-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 640px) {
  .contract-master {
    padding: 16px;
  }
  .recruitment-grid {
    gap: 16px;
  }
  .header-actions {
    flex-wrap: wrap;
  }
  .header-actions :deep(.p-button),
  .contract-form-actions :deep(.p-button) {
    flex: 1;
  }
  .form-page-header {
    align-items: flex-start;
    flex-direction: column;
  }
  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
  .recruitment-grid,
  .recruitment-details .recruitment-grid {
    grid-template-columns: 1fr;
  }
}
</style>
