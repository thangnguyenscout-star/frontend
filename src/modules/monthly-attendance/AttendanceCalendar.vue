<script setup lang="ts">
import { computed } from 'vue';
import {
  calendarCells,
  dateKey,
  displayDate,
  indexDays,
  statusOf,
  statuses,
} from './monthly.utils';
import type { DayRow } from './monthly.types';
const props = withDefaults(
  defineProps<{
    rows: DayRow[];
    year: number;
    month: number;
    readonly?: boolean;
  }>(),
  { readonly: false },
);
const emit = defineEmits<{
  menu: [row: DayRow, event: MouseEvent];
  detail: [row: DayRow];
}>();
const days = computed(() => indexDays(props.rows));
const cells = computed(() => calendarCells(props.year, props.month));
const weeks = computed(() =>
  Array.from({ length: cells.value.length / 7 }, (_, i) => cells.value.slice(i * 7, i * 7 + 7)),
);
const prefix = computed(
  () => String(props.year).padStart(4, '0') + '-' + String(props.month).padStart(2, '0'),
);
const outside = computed(() =>
  props.rows
    .filter((r) => !dateKey(r.ngayChamCong).startsWith(prefix.value))
    .sort((a, b) => a.ngayChamCong.localeCompare(b.ngayChamCong)),
);
function rightClick(row: DayRow | undefined, event: MouseEvent) {
  if (props.readonly || !row || !statusOf(row).abnormal) return;
  event.preventDefault();
  emit('menu', row, event);
}
function select(row?: DayRow) {
  if (!props.readonly && row && !statusOf(row).abnormal) emit('detail', row);
}
function colors(row?: DayRow) {
  const s = statusOf(row);
  return { background: s.bg, color: s.text, borderColor: s.border };
}
</script>
<template>
  <div class="attendance-calendar">
    <div class="monthly-table-scroll">
      <table class="month-grid" aria-label="Lịch chấm công tháng">
        <thead>
          <tr>
            <th
              v-for="weekday in [
                'Thứ Hai',
                'Thứ Ba',
                'Thứ Tư',
                'Thứ Năm',
                'Thứ Sáu',
                'Thứ Bảy',
                'Chủ nhật',
              ]"
              :key="weekday"
              scope="col"
            >
              {{ weekday }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, wi) in weeks" :key="wi">
            <td v-for="(key, di) in week" :key="key || di" :class="{ 'empty-calendar-cell': !key }">
              <div
                v-if="key"
                class="calendar-day"
                :style="colors(days.get(key))"
                @contextmenu="rightClick(days.get(key), $event)"
              >
                <div class="day-top">
                  <time :datetime="key" :class="{ weekend: di > 4 }">{{
                    Number(key.slice(-2))
                  }}</time>
                  <button
                    v-if="!readonly && days.has(key) && statusOf(days.get(key)).abnormal"
                    type="button"
                    class="day-more"
                    :aria-label="'Xử lý công ngày ' + displayDate(key)"
                    @click.stop="emit('menu', days.get(key)!, $event)"
                  >
                    •••
                  </button>
                </div>
                <button
                  v-if="!readonly && days.has(key) && !statusOf(days.get(key)).abnormal"
                  type="button"
                  class="day-body"
                  :aria-label="'Xem công ngày ' + displayDate(key)"
                  @click="select(days.get(key))"
                >
                  <strong>{{ days.get(key)?.hienThiCa || '—' }}</strong
                  ><span>{{ statusOf(days.get(key)).label }}</span>
                </button>
                <div v-else class="day-body">
                  <strong>{{ days.get(key)?.hienThiCa || '—' }}</strong
                  ><span>{{ statusOf(days.get(key)).label }}</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <section v-if="outside.length" class="outside-days">
      <h3>Ngày ngoài tháng thuộc kỳ công</h3>
      <div class="outside-grid">
        <div
          v-for="row in outside"
          :key="row.ngayChamCong"
          class="calendar-day"
          :style="colors(row)"
          @contextmenu="rightClick(row, $event)"
        >
          <div class="day-top">
            <time :datetime="dateKey(row.ngayChamCong)">{{ displayDate(row.ngayChamCong) }}</time
            ><button
              v-if="!readonly && statusOf(row).abnormal"
              type="button"
              class="day-more"
              :aria-label="'Xử lý công ngày ' + displayDate(row.ngayChamCong)"
              @click="emit('menu', row, $event)"
            >
              •••
            </button>
          </div>
          <button
            v-if="!readonly && !statusOf(row).abnormal"
            class="day-body"
            type="button"
            @click="select(row)"
          >
            <strong>{{ row.hienThiCa || '—' }}</strong
            ><span>{{ statusOf(row).label }}</span>
          </button>
          <div v-else class="day-body">
            <strong>{{ row.hienThiCa || '—' }}</strong
            ><span>{{ statusOf(row).label }}</span>
          </div>
        </div>
      </div>
    </section>
    <div class="monthly-legend" aria-label="Chú giải trạng thái">
      <span v-for="(status, key) in statuses" :key="key"
        ><i :style="{ background: status.bg, borderColor: status.border }" aria-hidden="true" />{{
          status.label
        }}</span
      ><span><i aria-hidden="true" />Chưa có dữ liệu</span>
    </div>
  </div>
</template>
