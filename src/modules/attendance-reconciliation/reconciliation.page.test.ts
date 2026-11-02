import { afterEach, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import {
  createRenderer,
  createSSRApp,
  h,
  nextTick,
  ssrContextKey,
  type App,
  type Component,
} from 'vue';
import { renderToString } from '@vue/server-renderer';
import PrimeVue from 'primevue/config';
import { attendanceNavigation } from '@/constants/attendance';
import { useReconciliation } from './useReconciliation';
import Page from './AttendanceReconciliationWorkspace.vue';

vi.mock('@/composables/useToast', () => ({ useToast: () => ({ info: vi.fn(), error: vi.fn() }) }));
vi.mock('vue-router', () => ({ onBeforeRouteLeave: vi.fn() }));
interface PageState {
  role: 'HR' | 'HOD' | 'Payroll';
  departmentCode: string;
  periodId: number;
  step: number;
  tab: number;
  selectedRunId: number | undefined;
  snapshotVersion: number;
  compareVersion: number;
  goStep: (step: number) => void;
  goIssues: (severity?: string) => void;
  eligibility: { canClose: boolean };
  mutable: boolean;
  closed: boolean;
}
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
let app: App | undefined;
function mount() {
  const pinia = createPinia();
  setActivePinia(pinia);
  app = renderer.createApp({ render: () => h({ ...Page, render: () => null } as Component) });
  app.use(pinia);
  app.provide(ssrContextKey, {});
  app.mount({});
  return (app._instance!.subTree.component as unknown as { setupState: PageState }).setupState;
}
afterEach(() => {
  app?.unmount();
  app = undefined;
});

it('renders the Vietnamese workspace, six workflow steps and priority cases with existing PrimeVue components', async () => {
  const instance = createSSRApp(Page).use(createPinia()).use(PrimeVue);
  const html = await renderToString(instance);
  expect(html).toContain('Đối soát &amp; Chốt công');
  expect(html).toContain('Dữ liệu mô phỏng — chưa lưu lên hệ thống');
  expect(html).toContain('Chuẩn bị dữ liệu');
  expect(html).toContain('Tính &amp; kiểm tra');
  expect(html).toContain('HOD xác nhận');
  expect(html).toContain('Bàn giao Payroll');
  expect(html).toContain('Nguyễn Minh Anh');
  expect(html).toContain('Thiếu giờ ra');
  expect(html).toContain('Tổng quan quy trình');
  expect(attendanceNavigation.filter((n) => n.path === '/attendance/reconciliation')).toHaveLength(
    1,
  );
});
it('keeps period and department when navigating workflow steps and internal tabs', () => {
  const state = mount();
  state.departmentCode = 'HK';
  state.goStep(4);
  expect(state.tab).toBe(2);
  state.goStep(5);
  expect(state.tab).toBe(3);
  state.goIssues('CRITICAL');
  expect(state.tab).toBe(1);
  expect(state.periodId).toBe(1);
  expect(state.departmentCode).toBe('HK');
  expect(state.eligibility.canClose).toBe(false);
});
it('enforces demo HOD scope and switches Payroll to read-only snapshot view', async () => {
  const state = mount();
  state.role = 'HOD';
  await nextTick();
  expect(state.departmentCode).toBe('FO');
  state.role = 'Payroll';
  await nextTick();
  expect(state.mutable).toBe(false);
  expect(state.step).toBe(6);
  expect(state.tab).toBe(3);
});
it('changes to closed period without losing department and exposes the matching immutable snapshot', async () => {
  const state = mount();
  state.departmentCode = 'FB';
  state.periodId = 2;
  await nextTick();
  expect(state.closed).toBe(true);
  expect(state.mutable).toBe(false);
  expect(state.step).toBe(6);
  expect(state.snapshotVersion).toBe(1);
  expect(state.departmentCode).toBe('FB');
  expect(useReconciliation().getSnapshots(2, 1, 'FB')).toHaveLength(8);
});
