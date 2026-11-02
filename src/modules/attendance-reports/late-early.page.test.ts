import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createRenderer, nextTick, ssrContextKey, type App } from 'vue';
import type { ReportRow } from './reports.model';
import { i18n } from '@/locales';
import type { LateEarlyFilter, LateEarlyItem, LateEarlyPage } from './late-early.service';
const api = vi.hoisted(() => ({
  list: vi.fn(),
  export: vi.fn(),
  departments: vi.fn(),
  save: vi.fn(),
}));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { query: vi.fn() } }));
vi.mock('./late-early.service', async (original) => ({
  ...(await original<object>()),
  getLateEarlyReport: api.list,
  exportLateEarlyReport: api.export,
}));
vi.mock('@/services/modules/schedule-shift.service', () => ({
  getScheduleDepartments: api.departments,
}));
vi.mock('@/services/api/report-download', () => ({
  saveReportFile: api.save,
  downloadReportFile: vi.fn(),
}));
import Page from './LateEarlyReport.vue';
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
  detail: ReportRow | null;
  columns: { key: string; label: string }[];
  openDetail: (row: ReportRow) => void;
  draft: { period: string; department: string; name: string };
  applied: { period: string; department: string; name: string };
  page: number;
  pageSize: number;
  metadata: Omit<LateEarlyPage, 'items'>;
  items: LateEarlyItem[];
  rows: ReportRow[];
  loading: boolean;
  error: string;
  filterError: string;
  exportError: string;
  departmentsError: string;
  exporting: string | null;
  apply: () => void;
  reset: () => void;
  load: () => Promise<void>;
  exportReport: (format: 'excel' | 'pdf') => Promise<void>;
}
const row: LateEarlyItem = {
  thang: 10,
  nam: 2026,
  maNhanVien: '000001',
  hoVaTen: 'Nguyễn An',
  ngaySinh: '1990-01-02',
  gioiTinh: 'Nam',
  maBoPhan: '01',
  tenBoPhan: 'Khoa Nội',
  maCa: 'N',
  tenCa: 'Ca đêm',
  gioBatDau: '22:00',
  gioKetThuc: '06:00',
  tinhCaDem: true,
  ngayChamCong: '2026-10-03',
  gioVao: '22:12',
  gioRa: '05:58',
  diTre: 12,
  veSom: 2,
  tinhTrang: 'Chờ xử lý',
};
const response = (pageIndex = 1, pageSize = 20, items = [row]): LateEarlyPage => ({
  pageIndex,
  pageSize,
  items,
  totalRecords: 35,
  totalPages: Math.ceil(35 / pageSize),
});
let app: App | undefined;
async function settle() {
  for (let i = 0; i < 6; i++) {
    await Promise.resolve();
    await nextTick();
  }
}
async function mount() {
  app = renderer.createApp({ ...Page, render: () => null });
  app.provide(ssrContextKey, {});
  app.mount({});
  await settle();
  return (app._instance as unknown as { setupState: State }).setupState;
}
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-31T05:00:00Z'));
  vi.clearAllMocks();
  i18n.global.locale.value = 'vi';
  api.list
    .mockReset()
    .mockImplementation((_filter: LateEarlyFilter, page: number, size: number) =>
      Promise.resolve(response(page, size)),
    );
  api.export
    .mockReset()
    .mockResolvedValue({ blob: new Blob(['binary']), filename: 'DiMuonVeSom_2026_10.xlsx' });
  api.departments.mockReset().mockResolvedValue([{ code: '01', name: 'Khoa Nội' }]);
});
afterEach(() => {
  app?.unmount();
  app = undefined;
  vi.useRealTimers();
  i18n.global.locale.value = 'vi';
});
it('loads the current month from the server and uses server totals rather than the page length', async () => {
  const state = await mount();
  expect(api.list).toHaveBeenCalledExactlyOnceWith(
    { thang: 10, nam: 2026, ten: null, maBoPhan: null },
    1,
    20,
  );
  expect(state.rows).toHaveLength(1);
  expect(state.metadata.totalRecords).toBe(35);
  expect(state.metadata.totalPages).toBe(2);
  expect(state.rows[0].name).toBe('Nguyễn An');
});
it('applies month, name and department code only on submit and retains them while paging', async () => {
  const state = await mount();
  Object.assign(state.draft, { period: '2026-09', department: '01', name: ' Nguyễn ' });
  expect(api.list).toHaveBeenCalledTimes(1);
  state.apply();
  await settle();
  const filter = { thang: 9, nam: 2026, ten: 'Nguyễn', maBoPhan: '01' };
  expect(api.list).toHaveBeenLastCalledWith(filter, 1, 20);
  state.draft.name = 'Not applied';
  state.page = 2;
  await settle();
  expect(api.list).toHaveBeenLastCalledWith(filter, 2, 20);
  state.pageSize = 50;
  await settle();
  expect(state.page).toBe(1);
  expect(api.list).toHaveBeenLastCalledWith(filter, 1, 50);
});
it('rejects invalid filters and resets to the current month', async () => {
  const state = await mount();
  state.draft.period = '';
  state.apply();
  await settle();
  expect(state.filterError).toBeTruthy();
  expect(api.list).toHaveBeenCalledTimes(1);
  Object.assign(state.draft, { period: '2026-09', department: '01', name: 'Nguyễn' });
  state.apply();
  await settle();
  state.reset();
  await settle();
  expect(api.list).toHaveBeenLastCalledWith(
    { thang: 10, nam: 2026, ten: null, maBoPhan: null },
    1,
    20,
  );
});
it('discards stale responses and clears displayed data on a request failure', async () => {
  const state = await mount();
  let finish!: (page: LateEarlyPage) => void;
  api.list.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const older = state.load();
  api.list.mockResolvedValueOnce(response(1, 20, [{ ...row, maNhanVien: 'NEW' }]));
  await state.load();
  finish(response());
  await older;
  expect(state.rows[0].code).toBe('NEW');
  api.list.mockRejectedValueOnce(new Error('Offline'));
  await state.load();
  expect(state.error).toBe('Offline');
  expect(state.rows).toEqual([]);
  expect(state.metadata.totalRecords).toBe(0);
});
it('does not turn catalog failures into sample departments or sample report rows', async () => {
  api.departments.mockRejectedValueOnce(new Error('Catalog offline'));
  api.list.mockResolvedValueOnce({ ...response(), items: [], totalRecords: 0, totalPages: 0 });
  const state = await mount();
  expect(state.departmentsError).toBe('Catalog offline');
  expect(state.rows).toEqual([]);
  await state.exportReport('excel');
  expect(api.export).not.toHaveBeenCalled();
});
it.each(['excel', 'pdf'] as const)(
  'exports all applied filters through the %s handler, independent of pagination and draft edits',
  async (format) => {
    const state = await mount();
    Object.assign(state.draft, { period: '2026-09', department: '01', name: 'Nguyễn' });
    state.apply();
    await settle();
    state.page = 2;
    await settle();
    state.draft.period = '2026-08';
    state.draft.name = 'Not applied';
    await state.exportReport(format);
    expect(api.export).toHaveBeenCalledExactlyOnceWith(
      { thang: 9, nam: 2026, ten: 'Nguyễn', maBoPhan: '01' },
      format,
    );
    expect(api.save).toHaveBeenCalledOnce();
  },
);
it('prevents duplicate exports and displays export errors', async () => {
  const state = await mount();
  let finish!: (file: { blob: Blob; filename: string }) => void;
  api.export.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const pending = state.exportReport('excel');
  await state.exportReport('pdf');
  expect(api.export).toHaveBeenCalledOnce();
  finish({ blob: new Blob(['file']), filename: 'report.xlsx' });
  await pending;
  expect(state.exporting).toBeNull();
  api.export.mockRejectedValueOnce(new Error('Export unavailable'));
  await state.exportReport('pdf');
  expect(state.exportError).toBe('Export unavailable');
  expect(api.save).toHaveBeenCalledTimes(1);
});
it('does not download an export after leaving the tab', async () => {
  const state = await mount();
  let finish!: (file: { blob: Blob; filename: string }) => void;
  api.export.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const pending = state.exportReport('pdf');
  app!.unmount();
  app = undefined;
  finish({ blob: new Blob(['file']), filename: 'report.pdf' });
  await pending;
  expect(api.save).not.toHaveBeenCalled();
});

it('translates table and open-detail status labels when the language changes without altering the server code', async () => {
  api.list.mockResolvedValueOnce(response(1, 20, [{ ...row, tinhTrang: 'IN_LATE' }]));
  const state = await mount();
  expect(state.rows[0].status).toBe('Đi trễ');
  expect(state.items[0].tinhTrang).toBe('IN_LATE');
  state.openDetail(state.rows[0]);
  expect(state.detail?.status).toBe('Đi trễ');
  i18n.global.locale.value = 'en';
  await settle();
  expect(state.rows[0].status).toBe('Late arrival');
  expect(state.detail?.status).toBe('Late arrival');
  expect(state.columns.find((column) => column.key === 'status')?.label).toBe('Status');
  expect(api.list).toHaveBeenCalledTimes(1);
});
