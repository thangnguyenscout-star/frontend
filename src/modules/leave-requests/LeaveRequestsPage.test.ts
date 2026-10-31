import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createRenderer, nextTick, ssrContextKey, type App } from 'vue';
import type {
  LeaveRequest,
  LeaveRequestFilter,
  LeaveRequestPage,
} from '@/services/modules/leave-request.service';
const api = vi.hoisted(() => ({
  list: vi.fn(),
  employees: vi.fn(),
  departments: vi.fn(),
  gantt: vi.fn(),
  allow: true,
}));
vi.mock('@/services/modules/leave-request.service', async (original) => ({
  ...(await original<object>()),
  getLeaveRequests: api.list,
}));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { query: vi.fn(), mutate: vi.fn() } }));
vi.mock('./leave-gantt.service', async (original) => ({
  ...(await original<object>()),
  getLeaveEmployees: api.employees,
  getGanttLeaveRequests: api.gantt,
}));
vi.mock('@/services/modules/schedule-shift.service', () => ({
  getScheduleDepartments: api.departments,
}));
vi.mock('@/stores/permission.store', () => ({
  usePermissionStore: () => ({ can: () => api.allow }),
}));
vi.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({ role: 'HR Staff', maNhanVien: 'NV01' }),
}));
vi.mock('./LeaveRequestForm.vue', () => ({
  default: { render: () => null },
}));
import Page from './LeaveRequestsPage.vue';
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
  draft: LeaveRequestFilter;
  applied: LeaveRequestFilter;
  rows: LeaveRequest[];
  mode: 'list' | 'gantt';
  ganttRows: LeaveRequest[];
  ganttError: string;
  ganttLoading: boolean;
  switchMode: (mode: 'list' | 'gantt') => Promise<void>;
  refresh: () => Promise<void>;
  pageIndex: number;
  pageSize: number;
  totalRecords: number;
  filterError: string;
  error: string;
  createOpen: boolean;
  creatingBusy: boolean;
  createEmployeeId: string | null;
  load: (page?: number, size?: number) => Promise<void>;
  apply: () => void;
  reset: () => void;
  changePage: (event: { page: number; rows: number }) => void;
  openCreate: () => void;
  closeCreate: () => void;
  created: () => Promise<void>;
}
const row = {
  id: '100',
  maNhanVien: 'NV01',
  hoTen: 'Nguyễn Văn An',
  tinhTrang: 'N',
} as LeaveRequest;
const result = (pageIndex = 1, items = [row]): LeaveRequestPage => ({
  pageIndex,
  pageSize: 20,
  totalRecords: 30,
  totalPages: 2,
  items,
});
let app: App | undefined;
async function settle() {
  for (let i = 0; i < 5; i++) await Promise.resolve();
  await nextTick();
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
  vi.setSystemTime(new Date('2026-10-29T05:00:00Z'));
  vi.clearAllMocks();
  api.allow = true;
  api.list.mockReset().mockResolvedValue(result());
  api.gantt.mockReset().mockResolvedValue([row]);
  api.employees.mockResolvedValue([
    { maNhanVien: 'NV01', hoTen: 'Nguyễn Văn An', maBoPhan: 'BP01' },
  ]);
  api.departments.mockResolvedValue([{ code: 'BP01', name: 'Bộ phận 1' }]);
});
afterEach(() => {
  app?.unmount();
  vi.useRealTimers();
});
it('loads the current month by default and retains applied filters while paging', async () => {
  const state = await mount();
  expect(api.list).toHaveBeenCalledWith(
    {
      thang: 10,
      nam: 2026,
      maBoPhan: null,
      maNhanVien: null,
      tinhTrang: null,
    },
    1,
    20,
  );
  state.draft.thang = 9;
  state.draft.tinhTrang = 'A';
  state.apply();
  await settle();
  state.draft.tinhTrang = 'C';
  state.changePage({ page: 1, rows: 20 });
  await settle();
  expect(api.list).toHaveBeenLastCalledWith(
    expect.objectContaining({ thang: 9, nam: 2026, tinhTrang: 'A' }),
    2,
    20,
  );
  state.changePage({ page: 1, rows: 50 });
  expect(api.list).toHaveBeenLastCalledWith(expect.objectContaining({ tinhTrang: 'A' }), 1, 50);
  state.reset();
  expect(api.list).toHaveBeenLastCalledWith(
    {
      thang: 10,
      nam: 2026,
      maBoPhan: null,
      maNhanVien: null,
      tinhTrang: null,
    },
    1,
    50,
  );
});
it('allows clearing month/year for the list without sending date boundaries', async () => {
  const state = await mount();
  state.draft.thang = null;
  state.draft.nam = null;
  state.apply();
  await settle();
  expect(api.list).toHaveBeenLastCalledWith(
    { thang: null, nam: null, maBoPhan: null, maNhanVien: null, tinhTrang: null },
    1,
    20,
  );
});
it('rejects invalid months and clears an employee that no longer belongs to the selected department', async () => {
  const state = await mount();
  const calls = api.list.mock.calls.length;
  state.draft.thang = 13;
  state.apply();
  expect(state.filterError).toContain('Tháng');
  expect(api.list).toHaveBeenCalledTimes(calls);
  state.draft.maNhanVien = 'NV01';
  state.draft.maBoPhan = 'OTHER';
  await nextTick();
  expect(state.draft.maNhanVien).toBeNull();
});
it('ignores stale page responses and clears displayed rows on a request failure', async () => {
  const state = await mount();
  let finish!: (page: LeaveRequestPage) => void;
  api.list.mockImplementationOnce(
    () =>
      new Promise<LeaveRequestPage>((resolve) => {
        finish = resolve;
      }),
  );
  const older = state.load(1);
  api.list.mockResolvedValueOnce(result(2, [{ ...row, id: 'NEW' }]));
  await state.load(2);
  finish(result(1, [{ ...row, id: 'OLD' }]));
  await older;
  expect(state.rows[0].id).toBe('NEW');
  expect(state.pageIndex).toBe(2);
  api.list.mockRejectedValueOnce(new Error('Offline'));
  await state.load();
  expect(state.error).toBe('Offline');
  expect(state.rows).toEqual([]);
  expect(state.totalRecords).toBe(0);
});
it('opens the reusable create sidebar, prevents closing during submit and refreshes only after success', async () => {
  const state = await mount();
  state.openCreate();
  expect(state.createOpen).toBe(true);
  expect(state.createEmployeeId).toBe('NV01');
  state.creatingBusy = true;
  state.closeCreate();
  expect(state.createOpen).toBe(true);
  state.creatingBusy = false;
  const calls = api.list.mock.calls.length;
  state.closeCreate();
  expect(api.list).toHaveBeenCalledTimes(calls);
  state.openCreate();
  await state.created();
  expect(state.createOpen).toBe(false);
  expect(api.list).toHaveBeenLastCalledWith(state.applied, 1, 20);
});
it('does not open the create sidebar without creation permission', async () => {
  api.allow = false;
  const state = await mount();
  state.openCreate();
  expect(state.createOpen).toBe(false);
});
it('loads the Gantt from the employee catalog and all matching requests, preserving list pagination', async () => {
  const state = await mount();
  state.pageIndex = 2;
  await state.switchMode('gantt');
  expect(api.employees).toHaveBeenCalled();
  expect(api.gantt).toHaveBeenCalledWith(
    state.applied,
    expect.objectContaining({ isCurrent: expect.any(Function) }),
  );
  expect(state.ganttRows).toEqual([row]);
  expect(state.pageIndex).toBe(2);
  await state.refresh();
  expect(api.employees).toHaveBeenCalledTimes(2);
  state.draft.maNhanVien = 'NV01';
  state.draft.tinhTrang = 'A';
  state.apply();
  await settle();
  expect(api.gantt).toHaveBeenLastCalledWith(
    expect.objectContaining({ maNhanVien: 'NV01', tinhTrang: 'A' }),
    expect.any(Object),
  );
  await state.switchMode('list');
  expect(api.list).toHaveBeenLastCalledWith(state.applied, 1, 20);
});
it('requires a bounded Gantt range and surfaces failures without displaying partial data', async () => {
  const state = await mount();
  state.draft.nam = null;
  state.apply();
  await settle();
  await state.switchMode('gantt');
  expect(state.ganttError).toContain('chọn năm');
  expect(api.gantt).not.toHaveBeenCalled();
  state.reset();
  await settle();
  api.gantt.mockRejectedValueOnce(new Error('Offline'));
  state.apply();
  await settle();
  expect(state.ganttError).toBe('Offline');
  expect(state.ganttRows).toEqual([]);
});
