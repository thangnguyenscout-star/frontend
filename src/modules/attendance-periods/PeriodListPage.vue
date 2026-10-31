<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppButton from '@/components/common/AppButton.vue';
import PeriodStatusTag from './PeriodStatusTag.vue';
import CreatePeriodDialog from './CreatePeriodDialog.vue';
import { listPeriods } from './period.service';
import type { AttendancePeriod } from './period.types';
import { usePeriodPermissions } from './usePeriodPermissions';
import { getApiErrorMessage } from '@/utils/error-message';
import { scheduleDate } from '@/utils/schedule-date';
const route = useRoute(),
  router = useRouter(),
  permissions = usePeriodPermissions();
const currentYear = Number(
  new Intl.DateTimeFormat('en', { timeZone: 'Asia/Bangkok', year: 'numeric' }).format(new Date()),
);
const year = ref(currentYear),
  month = ref(''),
  status = ref(''),
  keyword = ref(''),
  page = ref(1),
  size = 10;
const rows = ref<AttendancePeriod[]>([]),
  loading = ref(false),
  error = ref(''),
  creating = ref(false),
  creatingBusy = ref(false);
let sequence = 0,
  timer: ReturnType<typeof setTimeout> | undefined;
const filtered = computed(() =>
  rows.value.filter((row) => row.maKy.toLowerCase().includes(keyword.value.trim().toLowerCase())),
);
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / size)));
const visible = computed(() => filtered.value.slice((page.value - 1) * size, page.value * size));
const date = (value: string) => scheduleDate(value).split('-').reverse().join('/');
const timestamp = (value: string | null) =>
  value ? new Date(value).toLocaleString('vi-VN', { timeZone: 'Asia/Bangkok' }) : '—';
async function load() {
  const request = ++sequence;
  loading.value = true;
  error.value = '';
  try {
    const data = await listPeriods({
      nam: year.value,
      thang: month.value ? Number(month.value) : null,
      trangThai: status.value || null,
    });
    if (request === sequence) {
      rows.value = data;
      page.value = Math.min(page.value, pages.value);
    }
  } catch (e) {
    if (request === sequence) {
      rows.value = [];
      error.value = getApiErrorMessage(e);
    }
  } finally {
    if (request === sequence) loading.value = false;
  }
}
function apply(reset = true) {
  if (reset) page.value = 1;
  router.replace({
    path: route.path,
    query: {
      nam: String(year.value),
      ...(month.value ? { thang: month.value } : {}),
      ...(status.value ? { trangThai: status.value } : {}),
      ...(keyword.value.trim() ? { q: keyword.value.trim() } : {}),
      page: String(page.value),
    },
  });
}
watch(
  () => route.query,
  (query) => {
    year.value = /^\d{1,4}$/.test(String(query.nam))
      ? Math.min(9998, Math.max(1, Number(query.nam)))
      : currentYear;
    month.value = /^(?:[1-9]|1[0-2])$/.test(String(query.thang)) ? String(query.thang) : '';
    status.value = ['O', 'C', 'L'].includes(String(query.trangThai)) ? String(query.trangThai) : '';
    keyword.value = typeof query.q === 'string' ? query.q : '';
    page.value = Math.max(1, Number(query.page) || 1);
    void load();
  },
  { immediate: true },
);
function search() {
  clearTimeout(timer);
  timer = setTimeout(() => apply(), 300);
}
function navigatePage(amount: number) {
  page.value = Math.min(pages.value, Math.max(1, page.value + amount));
  apply(false);
}
function created(id: string) {
  creating.value = false;
  router.push('/attendance/periods/' + id);
}
onBeforeUnmount(() => {
  ++sequence;
  clearTimeout(timer);
});
</script>
<template>
  <section class="period-page">
    <nav class="period-breadcrumb">
      <RouterLink to="/attendance/overview">Chấm công</RouterLink><span> / Kỳ chấm công</span>
    </nav>
    <header class="period-heading">
      <div>
        <h1>Kỳ chấm công</h1>
        <p>Quản lý kỳ công, theo dõi chốt công và khóa kỳ.</p>
      </div>
      <div class="period-actions">
        <AppButton
          label="Làm mới"
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          :loading="loading"
          @click="load"
        /><AppButton
          v-if="permissions.canCreate.value"
          label="Tạo kỳ"
          icon="pi pi-plus"
          :disabled="creatingBusy"
          @click="creating = true"
        />
      </div>
    </header>
    <form class="period-filters" @submit.prevent="apply()">
      <label
        >Năm<input
          v-model.number="year"
          type="number"
          min="1"
          max="9998"
          required
          @change="apply()" /></label
      ><label
        >Tháng<select v-model="month" @change="apply()">
          <option value="">Tất cả tháng</option>
          <option v-for="m in 12" :key="m" :value="String(m)">Tháng {{ m }}</option>
        </select></label
      ><label
        >Trạng thái<select v-model="status" @change="apply()">
          <option value="">Tất cả trạng thái</option>
          <option value="O">Đang mở</option>
          <option value="C">Đã chốt</option>
          <option value="L">Đã khóa</option>
        </select></label
      ><label
        >Mã kỳ<input
          v-model="keyword"
          type="search"
          placeholder="Tìm mã kỳ YYYY-MM"
          @input="search"
      /></label>
    </form>
    <p class="period-notice">
      API hiện hỗ trợ Đang mở → Đã chốt → Đã khóa. Chưa hỗ trợ đối soát (R), kiểm tra trước chốt và
      lịch sử đầy đủ. Danh sách lọc tại server theo năm/tháng/trạng thái; tìm mã và phân trang tại
      trình duyệt vì API chưa hỗ trợ.
    </p>
    <p v-if="loading" role="status" class="period-empty">
      <i class="pi pi-spin pi-spinner" /> Đang tải kỳ chấm công…
    </p>
    <div v-else-if="error" class="period-empty">
      <p role="alert" class="period-error">{{ error }}</p>
      <AppButton label="Thử lại" @click="load" />
    </div>
    <div v-else class="period-table-wrap">
      <table class="period-table">
        <thead>
          <tr>
            <th>Mã kỳ</th>
            <th>Tháng/Năm</th>
            <th>Từ ngày – Đến ngày</th>
            <th>Trạng thái</th>
            <th>Ngày / Người chốt</th>
            <th>Cập nhật cuối</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in visible" :key="row.id">
            <td>
              <RouterLink :to="'/attendance/periods/' + row.id"
                ><strong>{{ row.maKy }}</strong></RouterLink
              >
            </td>
            <td>{{ String(row.thang).padStart(2, '0') }}/{{ row.nam }}</td>
            <td>{{ date(row.tuNgay) }} – {{ date(row.denNgay) }}</td>
            <td><PeriodStatusTag :status="row.trangThai" /></td>
            <td>
              {{ timestamp(row.ngayChot) }}<small>{{ row.nguoiChot || '—' }}</small>
            </td>
            <td>{{ timestamp(row.updatedAt || row.createdAt) }}</td>
            <td class="period-row-actions">
              <RouterLink :to="'/attendance/periods/' + row.id">Xem chi tiết</RouterLink
              ><RouterLink
                v-if="row.trangThai === 'O' && permissions.canClose.value"
                :to="{ path: '/attendance/periods/' + row.id, query: { action: 'close' } }"
                >Chốt công</RouterLink
              ><RouterLink
                v-if="row.trangThai === 'C' && permissions.canLock.value"
                :to="{ path: '/attendance/periods/' + row.id, query: { action: 'lock' } }"
                >Khóa kỳ</RouterLink
              >
            </td>
          </tr>
          <tr v-if="!visible.length">
            <td colspan="7" class="period-empty">Không có kỳ chấm công theo bộ lọc.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <footer v-if="!loading && !error" class="period-pagination">
      <span>{{ filtered.length }} kỳ · Trang {{ page }}/{{ pages }}</span>
      <div class="period-actions">
        <AppButton
          label="Trước"
          severity="secondary"
          outlined
          :disabled="page <= 1"
          @click="navigatePage(-1)"
        /><AppButton
          label="Sau"
          severity="secondary"
          outlined
          :disabled="page >= pages"
          @click="navigatePage(1)"
        />
      </div>
    </footer>
    <CreatePeriodDialog
      :visible="creating"
      @close="creating = false"
      @created="created"
      @busy="creatingBusy = $event"
    />
  </section>
</template>
<style scoped src="./periods.css"></style>
