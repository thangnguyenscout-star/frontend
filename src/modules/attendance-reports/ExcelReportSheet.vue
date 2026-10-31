<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  cellTone,
  excelColumn,
  numberLabel,
  type ReportColumn,
  type ReportRow,
} from './reports.model';
const props = defineProps<{
  columns: ReportColumn[];
  rows: ReportRow[];
  allRows: ReportRow[];
  offset: number;
  sortKey: string;
  sortDirection: number;
}>();
const emit = defineEmits<{ sort: [key: string]; open: [row: ReportRow] }>();
const selected = ref<{ row: number; col: number } | null>(null);
const viewport = ref<HTMLElement>();
const groups = computed(() => {
  const result: { label: string; span: number }[] = [];
  for (const column of props.columns) {
    const last = result.at(-1);
    if (last?.label === column.group) last.span++;
    else result.push({ label: column.group, span: 1 });
  }
  return result;
});
const width = computed(() => 44 + props.columns.reduce((sum, col) => sum + col.width, 0));
const totals = computed(() =>
  Object.fromEntries(
    props.columns
      .filter((c) => c.total)
      .map((c) => [
        c.key,
        props.allRows.reduce(
          (sum, row) => sum + (Number.isFinite(Number(row[c.key])) ? Number(row[c.key]) : 0),
          0,
        ),
      ]),
  ),
);
const activeCell = computed(() => {
  if (!selected.value) return null;
  const column = props.columns[selected.value.col];
  const row = props.rows[selected.value.row];
  return column && row
    ? {
        address: excelColumn(selected.value.col) + (props.offset + selected.value.row + 1),
        value: row[column.key],
        row,
      }
    : null;
});
watch(
  () => [props.columns, props.rows],
  () => {
    selected.value = null;
  },
);
const sticky = (index: number) =>
  index < 2 ? { left: (index === 0 ? 44 : 44 + props.columns[0].width) + 'px' } : undefined;
function move(event: KeyboardEvent, row: number, col: number) {
  const direction: Record<string, number[]> = {
    ArrowDown: [1, 0],
    ArrowUp: [-1, 0],
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1],
  };
  if (!direction[event.key]) return;
  event.preventDefault();
  const [dr, dc] = direction[event.key];
  row = Math.max(0, Math.min(props.rows.length - 1, row + dr));
  col = Math.max(0, Math.min(props.columns.length - 1, col + dc));
  selected.value = { row, col };
  viewport.value?.querySelector<HTMLElement>(`[data-cell="${row}-${col}"]`)?.focus();
}
</script>
<template>
  <div class="excel-sheet">
    <div class="excel-formula-bar">
      <span class="excel-address">{{ activeCell?.address || 'A1' }}</span>
      <span class="excel-fx" aria-hidden="true">ƒx</span>
      <span class="excel-formula-value">{{
        activeCell?.value ?? 'Chọn một ô để xem giá trị · Dùng phím mũi tên để di chuyển'
      }}</span>
      <button
        v-if="activeCell"
        type="button"
        class="report-text-button"
        @click="emit('open', activeCell.row)"
      >
        Xem chi tiết <i class="pi pi-arrow-up-right" />
      </button>
    </div>
    <div
      ref="viewport"
      class="excel-viewport"
      tabindex="0"
      role="region"
      aria-label="Bảng báo cáo kiểu Excel, cuộn ngang và dọc để xem các cột"
    >
      <table class="excel-table" :style="{ width: width + 'px' }">
        <caption class="report-sr-only">
          Báo cáo chấm công ·
          {{
            allRows.length
          }}
          bản ghi. Nhấn họ tên để xem chi tiết.
        </caption>
        <colgroup>
          <col style="width: 44px" />
          <col
            v-for="column in columns"
            :key="column.key"
            :style="{ width: column.width + 'px' }"
          />
        </colgroup>
        <thead>
          <tr class="excel-letters">
            <th class="excel-row-number" aria-label="Số dòng"><i class="pi pi-table" /></th>
            <th
              v-for="(column, c) in columns"
              :key="column.key"
              :class="{ 'excel-frozen': c < 2 }"
              :style="sticky(c)"
            >
              {{ excelColumn(c) }}
            </th>
          </tr>
          <tr class="excel-groups">
            <th class="excel-row-number" />
            <th
              v-for="(group, i) in groups"
              :key="group.label"
              :colspan="group.span"
              scope="colgroup"
              :class="{ 'excel-frozen': i === 0 }"
              :style="i === 0 ? { left: '44px' } : undefined"
            >
              {{ group.label }}
            </th>
          </tr>
          <tr class="excel-labels">
            <th class="excel-row-number">#</th>
            <th
              v-for="(column, c) in columns"
              :key="column.key"
              scope="col"
              :aria-sort="
                sortKey === column.key
                  ? sortDirection === 1
                    ? 'ascending'
                    : 'descending'
                  : undefined
              "
              :class="{ 'excel-frozen': c < 2, 'excel-weekend': column.weekend }"
              :style="sticky(c)"
            >
              <button
                type="button"
                :aria-label="'Sắp xếp theo ' + column.label"
                @click="emit('sort', column.key)"
              >
                {{ column.label
                }}<i
                  :class="[
                    'pi',
                    sortKey === column.key
                      ? sortDirection === 1
                        ? 'pi-sort-amount-up-alt'
                        : 'pi-sort-amount-down'
                      : 'pi-sort-alt',
                  ]"
                />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, r) in rows"
            :key="row.id"
            :class="{ 'excel-selected-row': selected?.row === r }"
          >
            <th scope="row" class="excel-row-number">{{ offset + r + 1 }}</th>
            <td
              v-for="(column, c) in columns"
              :key="column.key"
              :data-cell="`${r}-${c}`"
              :tabindex="
                selected
                  ? selected.row === r && selected.col === c
                    ? 0
                    : -1
                  : r === 0 && c === 0
                    ? 0
                    : -1
              "
              :class="[
                'excel-cell',
                'cell-' + cellTone(row[column.key], column.key),
                {
                  'excel-frozen': c < 2,
                  'excel-numeric': column.numeric,
                  'excel-weekend': column.weekend,
                  'excel-selected-cell': selected?.row === r && selected?.col === c,
                },
              ]"
              :style="sticky(c)"
              @focus="selected = { row: r, col: c }"
              @click="selected = { row: r, col: c }"
              @keydown="move($event, r, c)"
            >
              <button
                v-if="column.key === 'name'"
                class="excel-employee"
                type="button"
                @click="emit('open', row)"
              >
                {{ row.name }}
              </button>
              <span
                v-else-if="column.key === 'status' || column.key === 'level'"
                :class="[
                  'report-cell-status',
                  ['Đã duyệt', 'Đã đối soát', 'Đã giải trình'].includes(String(row[column.key]))
                    ? 'is-success'
                    : row[column.key] === 'Ưu tiên cao'
                      ? 'is-danger'
                      : 'is-warning',
                ]"
                >{{ row[column.key] }}</span
              >
              <template v-else>{{
                typeof row[column.key] === 'number'
                  ? numberLabel(Number(row[column.key]))
                  : row[column.key]
              }}</template>
            </td>
          </tr>
          <tr v-if="!rows.length">
            <td :colspan="columns.length + 1" class="excel-empty">
              <i class="pi pi-search" /><strong>Không tìm thấy dữ liệu</strong
              ><span>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</span>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="allRows.length">
          <tr>
            <th class="excel-row-number">Σ</th>
            <td
              v-for="(column, c) in columns"
              :key="column.key"
              :class="{ 'excel-frozen': c < 2, 'excel-numeric': column.numeric }"
              :style="sticky(c)"
            >
              {{
                c === 0
                  ? 'TỔNG CỘNG'
                  : c === 1
                    ? allRows.length + ' bản ghi'
                    : column.total
                      ? numberLabel(totals[column.key])
                      : '—'
              }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
