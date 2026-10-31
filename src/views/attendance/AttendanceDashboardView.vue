<script setup lang="ts">
import { computed, ref } from 'vue';
import AppKpiCard from '@/components/common/AppKpiCard.vue';
import { useRouter } from 'vue-router';
import { demoAttendance, demoDepartments, type AttendanceStatus } from './attendance-demo';
const router = useRouter();
const localDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Bangkok',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());
const date = ref(localDate),
  period = ref(localDate.slice(0, 7)),
  department = ref(''),
  shift = ref(''),
  granularity = ref('day');
const updated = ref(new Date()),
  refreshing = ref(false);
const shortDate = (value: string) => value.split('-').reverse().join('/');
const rows = computed(() =>
  demoAttendance(date.value || localDate).filter(
    (r) =>
      (!department.value || r.department === department.value) &&
      (!shift.value || r.shift === shift.value),
  ),
);
const total = computed(() => rows.value.length);
const count = (status: AttendanceStatus) =>
  rows.value.filter((row) => row.status === status).length;
const working = computed(
  () => rows.value.filter((r) => ['present', 'late', 'early'].includes(r.status)).length,
);
const percent = (value: number) =>
  total.value ? ((value / total.value) * 100).toFixed(1) + '%' : '0%';
const categories = computed(() => [
  { key: 'present', label: 'Đang làm việc', value: count('present'), color: '#34c780' },
  { key: 'late', label: 'Đi muộn', value: count('late'), color: '#ffbc3b' },
  { key: 'early', label: 'Về sớm', value: count('early'), color: '#ff729d' },
  { key: 'absent', label: 'Vắng mặt', value: count('absent'), color: '#ff656b' },
  { key: 'leave', label: 'Nghỉ phép', value: count('leave'), color: '#a46bff' },
]);
const cards = computed(() => [
  {
    label: 'Tổng nhân viên',
    value: total.value,
    icon: 'pi-users',
    tone: 'blue',
    note: 'Theo bộ lọc hiện tại',
  },
  {
    label: 'Đang làm việc',
    value: working.value,
    icon: 'pi-user-plus',
    tone: 'green',
    note: 'Có dữ liệu chấm công',
  },
  { label: 'Đi muộn', value: count('late'), icon: 'pi-clock', tone: 'amber', note: 'Nhân viên' },
  { label: 'Về sớm', value: count('early'), icon: 'pi-sign-out', tone: 'pink', note: 'Nhân viên' },
  {
    label: 'Vắng mặt',
    value: count('absent'),
    icon: 'pi-exclamation-triangle',
    tone: 'red',
    note: 'Nhân viên',
  },
  {
    label: 'Nghỉ phép',
    value: count('leave'),
    icon: 'pi-calendar',
    tone: 'purple',
    note: 'Nhân viên',
  },
]);
function gradient(items: { value: number; color: string }[]) {
  let start = 0;
  const sum = items.reduce((s, v) => s + v.value, 0);
  if (!sum) return '#edf2f7';
  return (
    'conic-gradient(' +
    items
      .map((item) => {
        const end = start + (item.value / sum) * 100;
        const part = item.color + ' ' + start + '% ' + end + '%';
        start = end;
        return part;
      })
      .join(',') +
    ')'
  );
}
const donut = computed(() => gradient(categories.value));
const departments = computed(() =>
  demoDepartments
    .filter(([name]) => !department.value || department.value === name)
    .map(([name]) => {
      const items = rows.value.filter((r) => r.department === name);
      return {
        name,
        total: items.length,
        present: items.filter((r) => ['present', 'late', 'early'].includes(r.status)).length,
        late: items.filter((r) => r.status === 'late').length,
        absent: items.filter((r) => r.status === 'absent').length,
        leave: items.filter((r) => r.status === 'leave').length,
      };
    }),
);
const late = computed(() => rows.value.filter((r) => r.status === 'late'));
const absent = computed(() => rows.value.filter((r) => r.status === 'absent'));
const shifts = computed(() =>
  ['HC', 'C1', 'C2', 'C3'].map((code, i) => ({
    code,
    label: ['Ca hành chính', 'Ca chiều', 'Ca đêm', 'Ca khác'][i],
    value: rows.value.filter(
      (r) => r.shift === code && ['present', 'late', 'early'].includes(r.status),
    ).length,
    color: ['#4c8dff', '#50c782', '#ffb532', '#9f72ff'][i],
  })),
);
const trend = computed(() => {
  const [year, month] = period.value.split('-').map(Number);
  if (!year || !month) return [];
  const days = new Date(year, month, 0).getDate();
  const points = Array.from({ length: days }, (_, i) => {
    const key = period.value + '-' + String(i + 1).padStart(2, '0');
    const all = demoAttendance(key).filter(
      (r) =>
        (!department.value || r.department === department.value) &&
        (!shift.value || r.shift === shift.value),
    );
    return {
      label: String(i + 1).padStart(2, '0'),
      total: all.length,
      present: all.filter((r) => ['present', 'early'].includes(r.status)).length,
      late: all.filter((r) => r.status === 'late').length,
      absent: all.filter((r) => r.status === 'absent').length,
      leave: all.filter((r) => r.status === 'leave').length,
    };
  });
  if (granularity.value === 'day') return points;
  return Array.from({ length: Math.ceil(points.length / 7) }, (_, i) => {
    const chunk = points.slice(i * 7, i * 7 + 7);
    const average = (field: 'total' | 'present' | 'late' | 'absent' | 'leave') =>
      chunk.reduce((sum, p) => sum + p[field], 0) / chunk.length;
    return {
      label: 'T' + (i + 1),
      total: average('total'),
      present: average('present'),
      late: average('late'),
      absent: average('absent'),
      leave: average('leave'),
    };
  });
});
const chartMax = computed(() => Math.max(10, ...trend.value.map((p) => p.total)) * 1.15);
const chartY = (value: number) => 160 - (value / chartMax.value) * 135;
const chartX = (i: number) => 30 + (i * 480) / Math.max(1, trend.value.length - 1);
const trendLine = computed(() =>
  trend.value.map((p, i) => chartX(i) + ',' + chartY(p.total)).join(' '),
);
const periodLabel = computed(() => {
  const [year, month] = period.value.split('-').map(Number);
  return (
    month +
    '/' +
    year +
    ' (01/' +
    month +
    ' – ' +
    new Date(year, month, 0).getDate() +
    '/' +
    month +
    ')'
  );
});
function changePeriod() {
  if (!date.value.startsWith(period.value)) date.value = period.value + '-01';
}
function changeDate() {
  if (date.value) period.value = date.value.slice(0, 7);
}
async function refresh() {
  refreshing.value = true;
  await new Promise((resolve) => setTimeout(resolve, 350));
  updated.value = new Date();
  refreshing.value = false;
}
const expandedStatus = ref('');
const expandedRows = computed(() =>
  rows.value.filter((row) => row.status === expandedStatus.value),
);
function openDaily(status?: string) {
  if (status) {
    expandedStatus.value = status;
    return;
  }
  router.push({ path: '/attendance/daily', query: { date: date.value } });
}
const quickLinks = [
  { path: 'daily', label: 'Xem bảng công ngày', icon: 'pi-calendar', tone: 'blue' },
  { path: 'adjustments', label: 'Điều chỉnh chấm công', icon: 'pi-file-edit', tone: 'purple' },
  { path: 'reports', label: 'Báo cáo chấm công', icon: 'pi-chart-bar', tone: 'green' },
  { path: 'raw-data', label: 'Dữ liệu máy chấm công', icon: 'pi-server', tone: 'amber' },
];
</script>
<template>
  <section class="attendance-dashboard">
    <nav class="breadcrumbs" aria-label="Đường dẫn">
      <i class="pi pi-home" /><span>Chấm công</span><i class="pi pi-angle-right" /><span
        >Tổng quan</span
      >
    </nav>
    <div class="overview-heading">
      <div>
        <h1>Tổng quan chấm công</h1>
        <span class="demo-label"
          ><i class="pi pi-info-circle" /> Dữ liệu minh họa · Chưa kết nối API chấm công</span
        >
      </div>
      <div class="update-status">
        <span>Cập nhật: {{ updated.toLocaleString('vi-VN') }}</span
        ><button :disabled="refreshing" @click="refresh">
          <i :class="['pi', refreshing ? 'pi-spin pi-spinner' : 'pi-refresh']" /> Làm mới
        </button>
      </div>
    </div>
    <form class="overview-filters" @submit.prevent="refresh">
      <label
        >Kỳ chấm công
        <div class="period-control">
          <input v-model="period" type="month" required @change="changePeriod" /><span
            class="open-tag"
            >Đang mở</span
          >
        </div></label
      >
      <label
        >Bộ phận<select v-model="department">
          <option value="">Tất cả bộ phận</option>
          <option v-for="[name] in demoDepartments" :key="name">{{ name }}</option>
        </select></label
      >
      <label
        >Ca làm việc<select v-model="shift">
          <option value="">Tất cả ca</option>
          <option v-for="item in shifts" :key="item.code" :value="item.code">
            {{ item.label }} ({{ item.code }})
          </option>
        </select></label
      >
      <label>Ngày xem<input v-model="date" type="date" required @change="changeDate" /></label>
    </form>
    <div class="overview-kpis">
      <AppKpiCard
        v-for="(card, i) in cards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :icon="card.icon"
        :note="card.note"
        :tone="
          card.tone === 'green'
            ? 'green'
            : card.tone === 'amber'
              ? 'amber'
              : ['pink', 'red'].includes(card.tone)
                ? 'red'
                : 'blue'
        "
      >
        <span v-if="i" class="metric-rate">{{ percent(card.value) }} nhân viên</span>
      </AppKpiCard>
    </div>
    <section v-if="expandedStatus" class="overview-panel expanded-list" aria-live="polite">
      <div class="panel-heading">
        <h2>
          {{
            expandedStatus === 'late'
              ? 'Danh sách nhân viên đi muộn'
              : 'Danh sách nhân viên vắng mặt'
          }}
          · {{ shortDate(date) }} · {{ expandedRows.length }} nhân viên
        </h2>
        <button class="text-link" @click="expandedStatus = ''">Đóng ✕</button>
      </div>
      <div class="overview-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Mã NV</th>
              <th>Họ tên</th>
              <th>Bộ phận</th>
              <th>Ca</th>
              <th>Giờ vào</th>
              <th>Đi muộn</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in expandedRows" :key="row.code">
              <td>{{ row.code }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.department }}</td>
              <td>{{ row.shift }}</td>
              <td>{{ row.checkIn }}</td>
              <td>{{ row.minutes ? row.minutes + ' phút' : '—' }}</td>
            </tr>
            <tr v-if="!expandedRows.length">
              <td colspan="6">Không có dữ liệu theo bộ lọc.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <div class="overview-grid top-grid">
      <section class="overview-panel">
        <h2>
          Tình hình chấm công <span>({{ shortDate(date) }})</span>
        </h2>
        <div class="donut-layout">
          <div
            class="overview-donut"
            :style="{ background: donut }"
            role="img"
            :aria-label="'Tình hình chấm công ' + total + ' nhân viên'"
          >
            <div>
              <strong>{{ total }}</strong
              ><small>Nhân viên</small>
            </div>
          </div>
          <ul class="donut-legend">
            <li v-for="item in categories" :key="item.key">
              <i :style="{ background: item.color }" /><span>{{ item.label }}</span
              ><b>{{ item.value }}</b
              ><small>{{ percent(item.value) }}</small>
            </li>
          </ul>
        </div>
      </section>
      <section class="overview-panel trend-panel">
        <div class="panel-heading">
          <h2>
            Biểu đồ xu hướng chấm công <span>({{ period }})</span>
          </h2>
          <select v-model="granularity" aria-label="Nhóm biểu đồ">
            <option value="day">Theo ngày</option>
            <option value="week">Theo tuần</option>
          </select>
        </div>
        <svg
          viewBox="0 0 540 195"
          class="attendance-trend"
          role="img"
          aria-label="Xu hướng chấm công trong kỳ"
        >
          <g v-for="tick in [0, 1, 2, 3, 4]" :key="tick">
            <line
              x1="24"
              x2="522"
              :y1="chartY((tick * chartMax) / 4)"
              :y2="chartY((tick * chartMax) / 4)"
              stroke="#e9eff6"
            />
            <text x="18" :y="chartY((tick * chartMax) / 4) + 3" text-anchor="end">
              {{ Math.round((tick * chartMax) / 4) }}
            </text>
          </g>
          <g v-for="(point, i) in trend" :key="point.label">
            <rect
              :x="chartX(i) - 4"
              :y="chartY(point.present)"
              width="8"
              :height="160 - chartY(point.present)"
              fill="#a7edc8"
            />
            <rect
              :x="chartX(i) - 4"
              :y="chartY(point.present + point.late)"
              width="8"
              :height="(point.late / chartMax) * 135"
              fill="#ffc54c"
            />
            <rect
              :x="chartX(i) - 4"
              :y="chartY(point.present + point.late + point.absent)"
              width="8"
              :height="(point.absent / chartMax) * 135"
              fill="#ff858b"
            />
            <rect
              :x="chartX(i) - 4"
              :y="chartY(point.total)"
              width="8"
              :height="(point.leave / chartMax) * 135"
              fill="#d6c4fb"
            />
            <text
              v-if="i % 2 === 0 || granularity === 'week'"
              :x="chartX(i)"
              y="177"
              text-anchor="middle"
            >
              {{ point.label }}
            </text>
            <title>{{ point.label }}: {{ Math.round(point.total) }} nhân viên</title>
          </g>
          <polyline :points="trendLine" fill="none" stroke="#4a8fff" stroke-width="2" />
          <circle
            v-for="(point, i) in trend"
            :key="'dot' + i"
            :cx="chartX(i)"
            :cy="chartY(point.total)"
            r="2.5"
            fill="#4a8fff"
          />
        </svg>
        <div class="trend-legend">
          <span><i style="background: #65d69a" />Có mặt</span
          ><span><i style="background: #ffc54c" />Đi muộn</span
          ><span><i style="background: #ff858b" />Vắng mặt</span
          ><span><i style="background: #d6c4fb" />Nghỉ phép</span
          ><span><i style="background: #4a8fff" />Tổng nhân viên</span>
        </div>
      </section>
      <section class="overview-panel">
        <div class="panel-heading">
          <h2>Tình trạng theo bộ phận</h2>
          <RouterLink to="/attendance/daily">Xem tất cả</RouterLink>
        </div>
        <div class="overview-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Bộ phận</th>
                <th>Tổng NV</th>
                <th>Có mặt</th>
                <th>Muộn</th>
                <th>Vắng</th>
                <th>Nghỉ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in departments" :key="item.name">
                <td>{{ item.name }}</td>
                <td>{{ item.total }}</td>
                <td>{{ item.present }}</td>
                <td class="red-text">{{ item.late }}</td>
                <td class="red-text">{{ item.absent }}</td>
                <td class="purple-text">{{ item.leave }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
    <div class="overview-grid middle-grid">
      <section
        v-for="list in [
          { title: 'Nhân viên đi muộn', rows: late, status: 'late' },
          { title: 'Nhân viên vắng mặt', rows: absent, status: 'absent' },
        ]"
        :key="list.status"
        class="overview-panel"
      >
        <div class="panel-heading">
          <h2>
            {{ list.title }} <span>({{ shortDate(date) }})</span>
          </h2>
          <button class="text-link" @click="openDaily(list.status)">Xem tất cả</button>
        </div>
        <div class="overview-table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Mã NV</th>
                <th>Họ và tên</th>
                <th>Bộ phận</th>
                <th>Ca</th>
                <th>{{ list.status === 'late' ? 'Giờ vào' : 'Lý do' }}</th>
                <th v-if="list.status === 'late'">Muộn</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(employee, i) in list.rows.slice(0, 5)" :key="employee.code">
                <td>{{ i + 1 }}</td>
                <td>{{ employee.code }}</td>
                <td>{{ employee.name }}</td>
                <td>{{ employee.department }}</td>
                <td>{{ employee.shift }}</td>
                <td>
                  <span v-if="list.status === 'absent'" class="absence-tag">Chưa ghi nhận</span
                  ><template v-else>{{ employee.checkIn }}</template>
                </td>
                <td v-if="list.status === 'late'">
                  <span class="late-tag">{{ employee.minutes }} phút</span>
                </td>
              </tr>
              <tr v-if="!list.rows.length">
                <td colspan="7" class="empty-row">Không có nhân viên trong danh sách.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="overview-panel">
        <h2>Tỷ lệ chấm công theo ca</h2>
        <div class="donut-layout">
          <div
            class="overview-donut shift-donut"
            :style="{ background: gradient(shifts) }"
            role="img"
            aria-label="Phân bổ nhân viên có mặt theo ca"
          >
            <div>
              <strong>{{ working }}</strong
              ><small>Có mặt</small>
            </div>
          </div>
          <ul class="donut-legend">
            <li v-for="item in shifts" :key="item.code">
              <i :style="{ background: item.color }" /><span>{{ item.label }}</span
              ><b>{{ item.value }}</b
              ><small>{{ working ? ((item.value / working) * 100).toFixed(1) : 0 }}%</small>
            </li>
          </ul>
        </div>
      </section>
    </div>
    <div class="overview-grid bottom-grid">
      <section class="overview-panel">
        <div class="panel-heading">
          <h2>Trạng thái kỳ chấm công</h2>
          <RouterLink to="/attendance/periods">Chi tiết</RouterLink>
        </div>
        <div class="period-steps">
          <div
            v-for="(step, i) in ['Mở kỳ', 'Đối soát', 'Chốt công', 'Khóa lương']"
            :key="step"
            :class="{ complete: i === 0, current: i === 1 }"
          >
            <i :class="['pi', i === 0 ? 'pi-check' : i === 1 ? 'pi-sync' : 'pi-lock']" /><strong>{{
              step
            }}</strong
            ><small>{{
              i === 0 ? periodLabel.split(' (')[0] : i === 1 ? 'Đang thực hiện' : 'Chưa thực hiện'
            }}</small>
          </div>
        </div>
        <p class="period-note">Quy trình minh họa · {{ periodLabel }}</p>
      </section>
      <section class="overview-panel">
        <h2>Công việc cần thực hiện</h2>
        <div class="task-list">
          <button @click="openDaily('late')">
            <i class="pi pi-exclamation-triangle red-text" />Kiểm tra {{ late.length }} nhân viên đi
            muộn</button
          ><button @click="openDaily('absent')">
            <i class="pi pi-user-minus red-text" />Xử lý {{ absent.length }} nhân viên vắng mặt</button
          ><RouterLink to="/attendance/adjustments"
            ><i class="pi pi-pencil" />Kiểm tra yêu cầu điều chỉnh chấm công</RouterLink
          ><RouterLink to="/attendance/raw-data"
            ><i class="pi pi-server" />Đối soát dữ liệu máy chấm công</RouterLink
          >
        </div>
      </section>
      <section class="overview-panel">
        <h2>Truy cập nhanh</h2>
        <div class="attendance-quick-links">
          <RouterLink
            v-for="item in quickLinks"
            :key="item.path"
            :to="'/attendance/' + item.path"
            :class="item.tone"
            ><i :class="['pi', item.icon]" />{{ item.label }}</RouterLink
          >
        </div>
      </section>
    </div>
  </section>
</template>
<style scoped src="./attendance-dashboard.css"></style>
