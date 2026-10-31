<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router';
import Dialog from 'primevue/dialog';
import AppButton from '@/components/common/AppButton.vue';
import PeriodStatusTag from './PeriodStatusTag.vue';
import { getPeriod, changePeriodState } from './period.service';
import type { AttendancePeriod } from './period.types';
import { usePeriodPermissions } from './usePeriodPermissions';
import { getApiErrorMessage } from '@/utils/error-message';
import { useToast } from '@/composables/useToast';
import { scheduleDate } from '@/utils/schedule-date';
const route = useRoute(),
  permissions = usePeriodPermissions(),
  toast = useToast();
const row = ref<AttendancePeriod>(),
  loading = ref(false),
  error = ref(''),
  busy = ref(false),
  action = ref<'close' | 'lock' | null>(null),
  actionError = ref(''),
  acknowledged = ref(false),
  tab = ref('overview');
let sequence = 0;
const date = (value: string) => scheduleDate(value).split('-').reverse().join('/');
const timestamp = (value: string | null) =>
  value ? new Date(value).toLocaleString('vi-VN', { timeZone: 'Asia/Bangkok' }) : '—';
const tabs = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'daily', label: 'Công ngày' },
  { id: 'monthly', label: 'Công tháng' },
  { id: 'issues', label: 'Bất thường' },
  { id: 'history', label: 'Lịch sử' },
];
const canClose = computed(() => row.value?.trangThai === 'O' && permissions.canClose.value);
const canLock = computed(() => row.value?.trangThai === 'C' && permissions.canLock.value);
async function load() {
  const request = ++sequence;
  loading.value = true;
  error.value = '';
  try {
    const result = await getPeriod(String(route.params.id));
    if (request === sequence) row.value = result;
  } catch (e) {
    if (request === sequence) {
      row.value = undefined;
      error.value = getApiErrorMessage(e);
    }
  } finally {
    if (request === sequence) loading.value = false;
  }
}
function open(value: 'close' | 'lock') {
  if (busy.value || (value === 'close' ? !canClose.value : !canLock.value)) return;
  action.value = value;
  actionError.value = '';
  acknowledged.value = false;
}
watch(
  () => route.params.id,
  async () => {
    action.value = null;
    tab.value = 'overview';
    await load();
    if (route.query.action === 'close' && canClose.value) open('close');
    if (route.query.action === 'lock' && canLock.value) open('lock');
  },
  { immediate: true },
);
async function confirm() {
  if (
    !row.value ||
    !action.value ||
    busy.value ||
    !acknowledged.value ||
    (action.value === 'close' ? !canClose.value : !canLock.value)
  )
    return;
  const chosen = action.value;
  busy.value = true;
  actionError.value = '';
  try {
    row.value = await changePeriodState(row.value.id, chosen, chosen === 'close' ? 'O' : 'C');
    action.value = null;
    toast.success(
      chosen === 'close'
        ? 'Đã chốt kỳ chấm công.'
        : 'Đã khóa kỳ chấm công. Chưa có xác nhận bàn giao lương.',
    );
  } catch (e) {
    actionError.value = getApiErrorMessage(e);
    toast.error(e);
    await load();
    acknowledged.value = false;
  } finally {
    busy.value = false;
  }
}
onBeforeRouteLeave(() => !busy.value);
onBeforeRouteUpdate(() => !busy.value);
onBeforeUnmount(() => ++sequence);
</script>
<template>
  <section class="period-page">
    <nav class="period-breadcrumb">
      <RouterLink to="/attendance/overview">Chấm công</RouterLink> /
      <RouterLink to="/attendance/periods">Kỳ chấm công</RouterLink> /
      {{ row?.maKy || route.params.id }}
    </nav>
    <p v-if="loading" role="status" class="period-empty">Đang tải chi tiết kỳ…</p>
    <div v-else-if="error" class="period-empty">
      <p role="alert" class="period-error">{{ error }}</p>
      <AppButton label="Thử lại" @click="load" />
    </div>
    <template v-else-if="row"
      ><header class="period-heading">
        <div>
          <h1>Kỳ chấm công {{ row.maKy }}</h1>
          <p>{{ date(row.tuNgay) }} – {{ date(row.denNgay) }}</p>
          <PeriodStatusTag :status="row.trangThai" />
        </div>
        <div class="period-actions">
          <AppButton
            label="Làm mới"
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            :disabled="busy"
            @click="load"
          /><AppButton
            v-if="canClose"
            label="Chốt công"
            icon="pi pi-check"
            :disabled="busy"
            @click="open('close')"
          /><AppButton
            v-if="canLock"
            label="Khóa kỳ"
            icon="pi pi-lock"
            :disabled="busy"
            @click="open('lock')"
          />
        </div>
      </header>
      <nav class="period-tabs" aria-label="Thông tin kỳ">
        <button
          v-for="item in tabs"
          :key="item.id"
          :class="{ active: tab === item.id }"
          :disabled="busy"
          @click="tab = item.id"
        >
          {{ item.label }}
        </button>
      </nav>
      <section class="period-panel">
        <template v-if="tab === 'overview'"
          ><h2>Thông tin kỳ chấm công</h2>
          <dl class="period-metadata">
            <div>
              <dt>Mã kỳ</dt>
              <dd>{{ row.maKy }}</dd>
            </div>
            <div>
              <dt>Trạng thái</dt>
              <dd><PeriodStatusTag :status="row.trangThai" /></dd>
            </div>
            <div>
              <dt>Ngày tạo</dt>
              <dd>{{ timestamp(row.createdAt) }}</dd>
            </div>
            <div>
              <dt>Người tạo</dt>
              <dd>{{ row.createdBy || '—' }}</dd>
            </div>
            <div>
              <dt>Ngày chốt / Người chốt</dt>
              <dd>{{ timestamp(row.ngayChot) }} · {{ row.nguoiChot || '—' }}</dd>
            </div>
            <div>
              <dt>Ngày khóa / Người khóa</dt>
              <dd>{{ timestamp(row.ngayKhoa) }} · {{ row.nguoiKhoa || '—' }}</dd>
            </div>
            <div>
              <dt>Cập nhật cuối</dt>
              <dd>{{ timestamp(row.updatedAt) }} · {{ row.updatedBy || '—' }}</dd>
            </div>
            <div>
              <dt>Ghi chú</dt>
              <dd class="period-note">{{ row.ghiChu || '—' }}</dd>
            </div>
          </dl>
          <p class="period-notice">
            Backend chưa cung cấp thống kê nhân viên, số ca, thiếu log và tiến độ tính công cho kỳ
            này.
          </p>
          <p v-if="row.trangThai === 'L'" class="period-notice">
            Kỳ đã khóa. API chưa trả trạng thái bàn giao hoặc xác nhận nhận dữ liệu từ module lương.
            Không thể xác nhận đã chuyển lương.
          </p>
          <p class="period-notice">
            Chưa có API chuyển đối soát (R), mở lại kỳ hoặc lý do/audit cho thao tác ngoại lệ.
          </p></template
        ><template v-else-if="tab === 'daily' || tab === 'monthly'"
          ><h2>{{ tab === 'daily' ? 'Công ngày' : 'Công tháng' }} · {{ row.maKy }}</h2>
          <p>
            Backend hiện chưa cung cấp API bảng công lọc theo KyChamCongId. Chưa thể hiển thị dữ
            liệu của kỳ này.
          </p>
          <RouterLink :to="tab === 'daily' ? '/attendance/daily' : '/attendance/monthly'"
            >Mở màn hình {{ tab === 'daily' ? 'bảng công ngày' : 'bảng công tháng' }} →</RouterLink
          ></template
        ><template v-else-if="tab === 'issues'"
          ><h2>Bất thường và điều kiện chốt</h2>
          <p class="period-notice">
            Chưa có API preflight hoặc danh sách lỗi chặn/cảnh báo. Không thể kết luận kỳ đã đủ điều
            kiện chốt, không có bất thường hoặc đã đồng bộ đầy đủ.
          </p>
          <RouterLink to="/attendance/adjustments">Mở điều chỉnh chấm công →</RouterLink></template
        ><template v-else
          ><h2>Dấu mốc hiện có</h2>
          <p class="period-notice">
            Chưa có API lịch sử đầy đủ. Các mốc dưới đây chỉ lấy từ bản ghi kỳ, không thay thế nhật
            ký thao tác.
          </p>
          <table class="period-table">
            <thead>
              <tr>
                <th>Mốc</th>
                <th>Thời gian</th>
                <th>Người thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tạo kỳ</td>
                <td>{{ timestamp(row.createdAt) }}</td>
                <td>{{ row.createdBy || '—' }}</td>
              </tr>
              <tr v-if="row.ngayChot">
                <td>Chốt công</td>
                <td>{{ timestamp(row.ngayChot) }}</td>
                <td>{{ row.nguoiChot || '—' }}</td>
              </tr>
              <tr v-if="row.ngayKhoa">
                <td>Khóa kỳ</td>
                <td>{{ timestamp(row.ngayKhoa) }}</td>
                <td>{{ row.nguoiKhoa || '—' }}</td>
              </tr>
            </tbody>
          </table></template
        >
      </section></template
    ><Dialog
      :visible="!!action"
      modal
      :header="action === 'close' ? 'Xác nhận chốt công' : 'Xác nhận khóa kỳ'"
      :style="{ width: '560px', maxWidth: '95vw' }"
      :closable="!busy"
      :close-on-escape="!busy"
      @update:visible="!busy && (action = null)"
      ><div v-if="row" class="period-form">
        <p>
          <strong>Kỳ {{ row.maKy }}</strong> · {{ date(row.tuNgay) }} – {{ date(row.denNgay) }}
        </p>
        <p v-if="action === 'close'" class="period-notice">
          API hiện tại chốt trực tiếp O → C. Server chưa cung cấp preflight: không có kết quả tự
          động về lỗi chặn, đồng bộ log, ca qua ngày hay tổng hợp công tháng. Cần đối soát nghiệp vụ
          trước khi xác nhận.
        </p>
        <p v-else class="period-notice">
          Sau khi khóa, không thể sửa công bằng thao tác thông thường. Thao tác này đổi C → L; chưa
          có xác nhận bàn giao hoặc nhận dữ liệu từ module lương.
        </p>
        <label class="period-check"
          ><input v-model="acknowledged" type="checkbox" :disabled="busy" />{{
            action === 'close'
              ? 'Tôi xác nhận đã đối soát và muốn chốt kỳ này.'
              : 'Tôi xác nhận khóa kỳ và hiểu không thể mở lại bằng thao tác thông thường.'
          }}</label
        >
        <p v-if="actionError" role="alert" class="period-error">{{ actionError }}</p>
        <footer>
          <AppButton
            label="Hủy"
            severity="secondary"
            outlined
            :disabled="busy"
            @click="action = null"
          /><AppButton
            :label="action === 'close' ? 'Chốt kỳ' : 'Khóa kỳ'"
            :loading="busy"
            :disabled="
              busy || loading || !acknowledged || (action === 'close' ? !canClose : !canLock)
            "
            @click="confirm"
          />
        </footer></div
    ></Dialog>
  </section>
</template>
<style scoped src="./periods.css"></style>
