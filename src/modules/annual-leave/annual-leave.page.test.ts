import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createRenderer, createSSRApp, nextTick, ssrContextKey, type App } from 'vue';
import { renderToString } from '@vue/server-renderer';
import PrimeVue from 'primevue/config';
import { createMemoryHistory, createRouter } from 'vue-router';
import type { AnnualLeaveState, LeaveBalance, LeavePolicy } from './annual-leave.model';
const auth = vi.hoisted(() => ({ role: 'HR Manager', allowed: true }));
vi.mock('@/stores/auth.store', () => ({ useAuthStore: () => auth }));
vi.mock('@/stores/permission.store', () => ({
  usePermissionStore: () => ({ can: () => auth.allowed }),
}));
import Page from './AnnualLeavePage.vue';
import Sheet from '@/modules/attendance-reports/ExcelReportSheet.vue';
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
  state: AnnualLeaveState;
  canManage: boolean;
  storageReady: boolean;
  tab: 'balances' | 'policies';
  year: number;
  yearDraft: number;
  search: string;
  department: string;
  status: string;
  rows: { code: string }[];
  balanceForm: LeaveBalance;
  balanceOpen: boolean;
  policyForm: LeavePolicy;
  policyOpen: boolean;
  selected: LeaveBalance | null;
  adjustment: { delta: number; reason: string };
  formError: string;
  openBalance: (balance?: LeaveBalance) => void;
  submitBalance: () => void;
  openPolicy: (policy?: LeavePolicy) => void;
  submitPolicy: () => void;
  submitAdjustment: () => void;
  changeTab: (value: 'balances' | 'policies') => void;
  applyYear: () => void;
}
let app: App | undefined;
function mount() {
  app = renderer.createApp({ ...Page, render: () => null });
  app.provide(ssrContextKey, {});
  app.mount({});
  return (app._instance as unknown as { setupState: State }).setupState;
}
beforeEach(() => {
  auth.role = 'HR Manager';
  auth.allowed = true;
  const saved = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => saved.get(key) ?? null,
    setItem: (key: string, value: string) => saved.set(key, value),
  });
  vi.stubGlobal('window', { addEventListener: vi.fn(), removeEventListener: vi.fn() });
});
afterEach(() => {
  app?.unmount();
  vi.unstubAllGlobals();
});
it('renders the annual leave workspace and Excel table without invalid numeric totals', async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/leave', component: { render: () => null } }],
  });
  await router.push('/leave');
  const html = await renderToString(createSSRApp(Page).use(PrimeVue).use(router));
  for (const label of [
    'Quản lý phép năm',
    'Chính sách nghỉ phép',
    'Số dư phép nhân viên',
    'Còn khả dụng',
    'Khởi tạo hàng loạt',
    'TỔNG CỘNG',
    'Prototype',
  ])
    expect(html).toContain(label);
  expect(html).not.toContain('NaN');
});
it('keeps unknown DDL values readable and excludes them from spreadsheet totals', async () => {
  const rows = [
    { id: '1', code: 'NV0001', name: 'Nhân viên A', department: 'Khoa Nội', days: '—' },
    { id: '2', code: 'NV0002', name: 'Nhân viên B', department: 'Khoa Nội', days: 1.5 },
  ];
  const html = await renderToString(
    createSSRApp(Sheet, {
      columns: [
        { key: 'days', label: 'Số ngày', group: 'Số dư', width: 100, numeric: true, total: true },
      ],
      rows,
      allRows: rows,
      offset: 0,
      sortKey: '',
      sortDirection: 1,
    }),
  );
  expect(html).toContain('—');
  expect(html).toContain('1,5');
  expect(html).not.toContain('NaN');
});
it('allows managers to save a new unique balance and blocks duplicates', () => {
  const state = mount();
  state.storageReady = true;
  state.openBalance();
  state.balanceForm.nhanVienId = 'NV0011';
  state.submitBalance();
  expect(state.balanceOpen).toBe(false);
  expect(state.state.balances).toHaveLength(11);
  state.openBalance();
  state.balanceForm.nhanVienId = 'NV0011';
  state.submitBalance();
  expect(state.balanceOpen).toBe(true);
  expect(state.formError).toContain('đã có số dư');
});
it('blocks staff from mutating data even when handlers are called directly', () => {
  auth.role = 'Staff';
  const state = mount();
  state.storageReady = true;
  state.openBalance();
  state.balanceForm.nhanVienId = 'NV0011';
  state.submitBalance();
  expect(state.canManage).toBe(false);
  expect(state.formError).toContain('không có quyền');
  expect(state.state.balances).toHaveLength(10);
});
it('keeps forms open and data unchanged if browser storage cannot persist a change', () => {
  const state = mount();
  state.storageReady = true;
  const before = JSON.stringify(state.state);
  vi.stubGlobal('localStorage', {
    setItem: () => {
      throw new Error('Không thể lưu dữ liệu mẫu');
    },
  });
  state.openPolicy();
  state.policyForm.tenChinhSach = 'Chính sách mới';
  state.submitPolicy();
  expect(state.policyOpen).toBe(true);
  expect(state.formError).toContain('Không thể lưu');
  expect(JSON.stringify(state.state)).toBe(before);
});
it('filters employees, handles a year with no records and clears incompatible tab filters', async () => {
  const state = mount();
  state.search = 'dang duc anh';
  expect(state.rows).toHaveLength(1);
  state.yearDraft = 2027;
  state.applyYear();
  expect(state.rows).toHaveLength(0);
  state.changeTab('policies');
  await nextTick();
  expect(state.search).toBe('');
  expect(state.rows).toHaveLength(3);
  state.status = 'active';
  expect(state.rows).toHaveLength(2);
});
