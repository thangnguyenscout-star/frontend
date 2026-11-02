import { afterEach, expect, it, vi } from 'vitest';
vi.mock('./LateEarlyReport.vue', () => ({ default: { render: () => null } }));
import { createRenderer, createSSRApp, nextTick, ssrContextKey, type App } from 'vue';
import { renderToString } from '@vue/server-renderer';
import PrimeVue from 'primevue/config';
import Page from './AttendanceReportsPage.vue';
import type { ReportKey, ReportRow } from './reports.model';

const renderer = createRenderer<object, object>({
  createElement: () => ({}),
  createText: () => ({}),
  createComment: () => ({}),
  setText: () => {},
  setElementText: () => {},
  patchProp: () => {},
  insert: () => {},
  remove: () => {},
  parentNode: () => null,
  nextSibling: () => null,
});
interface State {
  active: ReportKey;
  draft: { period: string; department: string };
  applied: { period: string; department: string };
  criterion: string;
  search: string;
  page: number;
  pageSize: number;
  filterError: string;
  filtered: ReportRow[];
  sorted: ReportRow[];
  visibleRows: ReportRow[];
  pages: number;
  detailRecords: { code: string; date: string }[];
  detailOpen: boolean;
  apply: () => void;
  reset: () => void;
  sortBy: (key: string) => void;
  openDetail: (row: ReportRow) => void;
}
let app: App | undefined;
function mount() {
  app = renderer.createApp({ ...Page, render: () => null });
  app.provide(ssrContextKey, {});
  app.mount({});
  return (app._instance as unknown as { setupState: State }).setupState;
}
afterEach(() => app?.unmount());

it('renders all report destinations, spreadsheet headings and sample data', async () => {
  const html = await renderToString(createSSRApp(Page).use(PrimeVue));
  for (const label of [
    'Chi tiết tháng',
    'Đi muộn / Về sớm',
    'Tăng ca / Làm thêm',
    'Bất thường quẹt thẻ',
    'Tổng hợp công &amp; Phép',
    'TỔNG CỘNG',
    'Nguyễn Minh Anh',
    'Xuất CSV mẫu',
    'Xuất Excel',
    'Xuất PDF',
    'Dữ liệu minh họa',
  ])
    expect(html).toContain(label);
  expect(html).not.toContain('NaN');
  expect(html).toContain('excel-frozen');
  expect(html).toContain('excel-letters');
});
it('applies department and period only after submitting and rejects an empty month', async () => {
  const state = mount();
  state.draft.department = 'Khoa Nội';
  state.draft.period = '2024-02';
  expect(state.filtered).toHaveLength(24);
  state.apply();
  await nextTick();
  expect(state.filtered).toHaveLength(4);
  expect(state.filtered.every((r) => r.department === 'Khoa Nội')).toBe(true);
  expect(state.applied.period).toBe('2024-02');
  state.draft.period = '';
  state.apply();
  expect(state.filterError).toBeTruthy();
  expect(state.applied.period).toBe('2024-02');
});
it('supports accent-insensitive search, resets pagination and handles no matches', async () => {
  const state = mount();
  state.page = 2;
  state.search = 'dang duc anh';
  await nextTick();
  expect(state.page).toBe(1);
  expect(state.filtered).toHaveLength(1);
  expect(state.filtered[0].name).toBe('Đặng Đức Anh');
  state.search = 'does not exist';
  expect(state.visibleRows).toHaveLength(0);
  expect(state.pages).toBe(1);
});
it('switches report types without carrying incompatible status filters', async () => {
  const state = mount();
  state.active = 'anomaly';
  await nextTick();
  state.criterion = 'Chờ xử lý';
  expect(state.filtered.length).toBeGreaterThan(0);
  expect(state.filtered.every((r) => r.status === 'Chờ xử lý')).toBe(true);
  state.active = 'overtime';
  await nextTick();
  expect(state.criterion).toBe('');
  state.criterion = 'pendingOt';
  expect(state.filtered.every((r) => Number(r.pendingOt) > 0)).toBe(true);
});
it('sorts numeric totals both ways and opens the selected employee and date', async () => {
  const state = mount();
  state.active = 'overtime';
  await nextTick();
  state.sortBy('ot');
  const ascending = state.sorted.map((r) => Number(r.ot));
  expect(ascending).toEqual([...ascending].sort((a, b) => a - b));
  state.sortBy('ot');
  expect(state.sorted.map((r) => Number(r.ot))).toEqual([...ascending].reverse());
  state.active = 'anomaly';
  await nextTick();
  const row = state.filtered[0];
  state.openDetail(row);
  expect(state.detailOpen).toBe(true);
  expect(state.detailRecords).toHaveLength(1);
  expect(state.detailRecords[0].code).toBe(row.code);
  expect(state.detailRecords[0].date.split('-').reverse().join('/')).toBe(row.date);
});
