<script setup lang="ts">
import { useContractPermission } from '@/composables/useContractPermission';
const hasPermission = useContractPermission();
import AppButton from '@/components/common/AppButton.vue';
import RecruitmentOfferLetter from './RecruitmentOfferLetter.vue';
import AppDrawer from '@/components/common/AppDrawer.vue';
import AppStatusBadge from '@/components/common/AppStatusBadge.vue';
import type { RecruitmentRecord, RecruitmentStatus } from '@/types/recruitment';
import {
  genderLabels,
  recruitmentStatusLabels,
  recruitmentStatusSeverity,
} from '@/utils/recruitment';

defineProps<{ visible: boolean; record?: RecruitmentRecord; busy?: boolean }>();
const emit = defineEmits<{
  'update:visible': [boolean];
  edit: [];
  probation: [];
  status: [RecruitmentStatus];
}>();
const STATUS_TRANSITIONS: Record<string, string[]> = {
  '1': ['2', '3', '4', '5'],
  '2': ['4', '5'],
  '3': [],
  '4': [],
  '5': [],
};
const money = (value: number | null) =>
  value == null ? '—' : new Intl.NumberFormat('vi-VN').format(value) + ' VND';
const date = (value: string | null) =>
  value ? new Intl.DateTimeFormat('vi-VN').format(new Date(value + 'T00:00:00')) : '—';
const actions = Object.entries(recruitmentStatusLabels).map(([value, label]) => ({
  value: value as RecruitmentStatus,
  label,
}));
const workflowDate = (value?: string | null) => {
  if (!value) return 'Chưa có';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : new Intl.DateTimeFormat('vi-VN').format(parsed);
};

const canChangeStatus = (currentStatus: string, targetStatus: string): boolean => {
  return STATUS_TRANSITIONS[currentStatus]?.includes(targetStatus) ?? false;
};
</script>

<template>
  <AppDrawer
    :visible="visible"
    position="right"
    :style="{ width: '720px', maxWidth: '100vw' }"
    @update:visible="emit('update:visible', $event)"
  >
    <template #header>
      <div
        v-if="record"
        class="min-w-0"
      >
        <p class="text-xs font-semibold uppercase tracking-wider text-surface-500">
          Hồ sơ ứng viên
        </p>
        <h2 class="truncate text-xl font-bold text-surface-900">
          {{ record.hoTen }}
        </h2>
      </div>
    </template>

    <div
      v-if="record"
      class="drawer-content"
    >
      <div class="drawer-summary">
        <div>
          <p class="font-semibold text-surface-900">
            {{ record.tenChucVuDuKien }}
          </p>
          <p class="mt-1 text-sm text-surface-500">
            {{ record.tenBoPhanDuKien }}
          </p>
        </div>
        <AppStatusBadge
          :label="recruitmentStatusLabels[record.trangThai]"
          :severity="recruitmentStatusSeverity[record.trangThai]"
        />
      </div>

      <section
        class="drawer-section"
        aria-label="Thông tin phê duyệt"
      >
        <h3>Thông tin phê duyệt</h3>
        <dl class="drawer-grid">
          <div>
            <dt>Trưởng bộ phận</dt>
            <dd>{{ record.hodApprovedBy || '—' }} · {{ workflowDate(record.hodApprovedDate) }}</dd>
          </div>
          <div>
            <dt>Nhân sự</dt>
            <dd>{{ record.hrApprovedBy || '—' }} · {{ workflowDate(record.hrApprovedDate) }}</dd>
          </div>
          <div>
            <dt>Ngày chủ sở hữu ký</dt>
            <dd>{{ workflowDate(record.ownerSignedDate) }}</dd>
          </div>
        </dl>
      </section>
      <div class="drawer-sections">
        <section class="drawer-section">
          <h3 class="mb-3 text-sm font-bold uppercase tracking-wide text-primary-700">
            Thông tin cá nhân
          </h3>
          <dl class="drawer-grid">
            <div>
              <dt class="text-surface-500">
                Họ và tên
              </dt>
              <dd class="mt-1 font-medium">
                {{ record.hoTen }}
              </dd>
            </div>
            <div>
              <dt class="text-surface-500">
                Giới tính
              </dt>
              <dd class="mt-1 font-medium">
                {{ genderLabels[record.gioiTinh] || '—' }}
              </dd>
            </div>
            <div>
              <dt class="text-surface-500">
                Điện thoại
              </dt>
              <dd class="mt-1 font-medium">
                {{ record.soDienThoai || '—' }}
              </dd>
            </div>
            <div>
              <dt class="text-surface-500">
                Email
              </dt>
              <dd class="mt-1 break-all font-medium">
                {{ record.email || '—' }}
              </dd>
            </div>
          </dl>
        </section>

        <section class="drawer-section">
          <h3 class="mb-3 text-sm font-bold uppercase tracking-wide text-primary-700">
            Thông tin tuyển dụng
          </h3>
          <dl class="drawer-grid">
            <div>
              <dt class="text-surface-500">
                Ngày tiếp nhận
              </dt>
              <dd class="mt-1 font-medium">
                {{ date(record.ngayTiepNhan) }}
              </dd>
            </div>
            <div>
              <dt class="text-surface-500">
                Ngày bắt đầu
              </dt>
              <dd class="mt-1 font-medium">
                {{ date(record.ngayBatDauLamViec) }}
              </dd>
            </div>
            <div>
              <dt class="text-surface-500">
                Bộ phận dự kiến
              </dt>
              <dd class="mt-1 font-medium">
                {{ record.tenBoPhanDuKien }}
              </dd>
            </div>
            <div>
              <dt class="text-surface-500">
                Chức vụ dự kiến
              </dt>
              <dd class="mt-1 font-medium">
                {{ record.tenChucVuDuKien }}
              </dd>
            </div>
          </dl>
        </section>

        <section class="drawer-section">
          <h3 class="mb-3 text-sm font-bold uppercase tracking-wide text-primary-700">
            Thu nhập
          </h3>
          <dl class="drawer-grid income-grid">
            <div class="rounded-lg bg-surface-50 p-3">
              <dt class="text-surface-500">
                Thu nhập thỏa thuận
              </dt>
              <dd class="mt-1 font-semibold">
                {{ money(record.tongThuNhapThoaThuan) }}
              </dd>
            </div>
            <div class="rounded-lg bg-surface-50 p-3">
              <dt class="text-surface-500">
                Lương cơ bản
              </dt>
              <dd class="mt-1 font-semibold">
                {{ money(record.luongCoBan) }}
              </dd>
            </div>
            <div class="rounded-lg bg-surface-50 p-3">
              <dt class="text-surface-500">
                Lương thử việc
              </dt>
              <dd class="mt-1 font-semibold">
                {{ money(record.luongThuViec) }}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <div class="drawer-actions">
        <div class="drawer-edit">
          <RecruitmentOfferLetter
            v-if="record.trangThai === '5'"
            :record="record"
            :busy="busy"
          />
          <AppButton
            v-if="
              record.trangThai === '5' &&
                hasPermission('HOPDONG_CREATE') &&
                !!record.maNhanVien?.trim()
            "
            label="Tạo hợp đồng thử việc"
            icon="pi pi-file-plus"
            :disabled="busy"
            @click="emit('probation')"
          />
          <AppButton
            :disabled="busy || record.trangThai === '5'"
            label="Chỉnh sửa"
            icon="pi pi-pencil"
            severity="secondary"
            @click="emit('edit')"
          />
        </div>
        <div class="drawer-status-actions">
          <AppButton
            v-for="action in actions"
            :key="action.value"
            :label="action.label"
            :disabled="busy || !canChangeStatus(record.trangThai, action.value)"
            :severity="
              action.value === '3' || action.value === '4'
                ? 'danger'
                : action.value === '5'
                  ? 'success'
                  : 'primary'
            "
            outlined
            @click="emit('status', action.value)"
          />
        </div>
      </div>
    </div>
  </AppDrawer>
</template>
<style scoped>
.drawer-content {
  display: flex;
  height: 100%;
  min-width: 0;
  flex-direction: column;
  gap: 20px;
  overflow-x: hidden;
}
.drawer-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  background: #f8f9fa;
}
.drawer-summary p {
  margin: 0;
}
.drawer-sections {
  display: grid;
  gap: 20px;
}
.drawer-section {
  padding-top: 18px;
  border-top: 1px solid var(--line);
}
.drawer-section:first-child {
  padding-top: 0;
  border-top: 0;
}
.drawer-section h3 {
  margin: 0 0 14px;
  color: #0067c0;
  font-size: 11px;
  text-transform: uppercase;
}
.drawer-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 24px;
  margin: 0;
}
.drawer-grid dt {
  color: #64748b;
  font-size: 11px;
}
.drawer-grid dd {
  margin: 4px 0 0;
  font-size: 13px;
  font-weight: 500;
  overflow-wrap: anywhere;
}
.income-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.income-grid > div {
  padding: 12px;
  border-radius: 6px;
  background: #f8f9fa;
}
.drawer-actions {
  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}
.drawer-edit {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.drawer-status-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.recruitment-progress {
  padding: 16px;
  border: 1px solid #dbe5f1;
  border-radius: 8px;
  background: #fbfdff;
}
.progress-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.35px;
  color: #64748b;
}
.progress-heading strong {
  color: #0067c0;
  font-size: 11px;
}
.progress-track {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
}
.progress-track li {
  position: relative;
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  text-align: center;
}
.progress-track li:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 12px;
  left: calc(50% + 14px);
  right: calc(-50% + 14px);
  height: 2px;
  background: #dbe2ea;
}
.progress-track li.complete:not(:last-child)::after {
  background: #0f6cbd;
}
.progress-marker {
  position: relative;
  z-index: 1;
  display: grid;
  width: 26px;
  height: 26px;
  place-items: center;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  background: #fff;
}
.progress-marker i {
  font-size: 9px;
}
.progress-label {
  font-size: 11px;
  font-weight: 600;
  line-height: 1.35;
}
.progress-track li.current {
  color: #0067c0;
}
.progress-track li.current .progress-marker {
  border-color: #0067c0;
  background: #e8f3fc;
}
.progress-track li.complete {
  color: #334155;
}
.progress-track li.complete .progress-marker {
  border-color: #0f6cbd;
  background: #0f6cbd;
  color: #fff;
}
.progress-track li.stopped {
  color: #b42318;
}
.progress-track li.stopped .progress-marker {
  border-color: #b42318;
  background: #fde7e9;
}
.progress-track.terminal li:first-child::after {
  background: #b42318;
}
@media (max-width: 600px) {
  .drawer-grid,
  .income-grid,
  .drawer-status-actions {
    grid-template-columns: 1fr;
  }
}
</style>
