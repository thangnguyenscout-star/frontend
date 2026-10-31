import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createRenderer, nextTick, ssrContextKey, type App, type Component } from 'vue';
const api = vi.hoisted(() => ({
  create: vi.fn(),
  get: vi.fn(),
  change: vi.fn(),
  toast: vi.fn(),
  allow: true,
  route: { params: { id: '12' }, query: {} },
}));
vi.mock('./period.service', () => ({
  createPeriod: api.create,
  getPeriod: api.get,
  changePeriodState: api.change,
}));
vi.mock('./usePeriodPermissions', () => ({
  usePeriodPermissions: () => ({
    canCreate: {
      get value() {
        return api.allow;
      },
    },
    canClose: {
      get value() {
        return api.allow;
      },
    },
    canLock: {
      get value() {
        return api.allow;
      },
    },
  }),
}));
vi.mock('@/composables/useToast', () => ({
  useToast: () => ({ success: api.toast, error: vi.fn() }),
}));
vi.mock('vue-router', () => ({
  useRoute: () => api.route,
  onBeforeRouteLeave: vi.fn(),
  onBeforeRouteUpdate: vi.fn(),
}));
import CreateDialog from './CreatePeriodDialog.vue';
import Detail from './PeriodDetailPage.vue';
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
async function mount(component: Component, props: Record<string, unknown> = {}) {
  app = renderer.createApp({ ...component, render: () => null }, props);
  app.provide(ssrContextKey, {});
  app.mount({});
  for (let i = 0; i < 5; i++) await Promise.resolve();
  await nextTick();
  return (
    app._instance as unknown as {
      setupState: {
        month: string;
        form: { ghiChu: string };
        submit: () => Promise<void>;
        error: string;
        open: (action: 'close' | 'lock') => void;
        confirm: () => Promise<void>;
        acknowledged: boolean;
        row: typeof row;
        action: 'close' | 'lock' | null;
        canClose: boolean;
        canLock: boolean;
        actionError: string;
      };
    }
  ).setupState;
}
const row = {
  id: '12',
  maKy: '2026-10',
  nam: 2026,
  thang: 10,
  trangThai: 'O',
  tuNgay: '2026-10-01',
  denNgay: '2026-10-31',
};
beforeEach(() => {
  vi.clearAllMocks();
  api.allow = true;
  api.route.query = {};
  api.get.mockResolvedValue(row);
});
afterEach(() => app?.unmount());
it('prevents duplicate create requests and reports success only after completion', async () => {
  let done!: (row: object) => void;
  api.create.mockImplementationOnce(() => new Promise((resolve) => (done = resolve)));
  const created = vi.fn();
  const state = await mount(CreateDialog, { visible: true, onCreated: created });
  state.month = '2026-10';
  await nextTick();
  const pending = state.submit();
  await state.submit();
  expect(api.create).toHaveBeenCalledTimes(1);
  expect(created).not.toHaveBeenCalled();
  done(row);
  await pending;
  expect(created).toHaveBeenCalledWith('12');
  expect(api.toast).toHaveBeenCalledTimes(1);
});
it('keeps create form values on a partition failure', async () => {
  api.create.mockRejectedValueOnce(new Error('FAIL_BOUNARY_MONTHS'));
  const created = vi.fn();
  const state = await mount(CreateDialog, { visible: true, onCreated: created });
  state.form.ghiChu = 'Giữ ghi chú';
  await state.submit();
  expect(state.form.ghiChu).toBe('Giữ ghi chú');
  expect(state.error).toBeTruthy();
  expect(created).not.toHaveBeenCalled();
  expect(api.toast).not.toHaveBeenCalled();
});
it('requires explicit confirmation and blocks duplicate close clicks', async () => {
  let done!: (row: object) => void;
  api.change.mockImplementationOnce(() => new Promise((resolve) => (done = resolve)));
  const state = await mount(Detail);
  state.open('close');
  await state.confirm();
  expect(api.change).not.toHaveBeenCalled();
  state.acknowledged = true;
  const pending = state.confirm();
  await state.confirm();
  expect(api.change).toHaveBeenCalledTimes(1);
  done({ ...row, trangThai: 'C' });
  await pending;
  expect(state.row.trangThai).toBe('C');
  expect(state.action).toBeNull();
});
it('refreshes after a concurrent update and does not retry the mutation', async () => {
  const state = await mount(Detail);
  state.open('close');
  state.acknowledged = true;
  api.change.mockRejectedValueOnce(new Error('KY_CHAM_CONG_UPDATE_CONFLICT'));
  api.get.mockResolvedValueOnce({ ...row, trangThai: 'C' });
  await state.confirm();
  expect(state.row.trangThai).toBe('C');
  expect(state.acknowledged).toBe(false);
  expect(state.actionError).toBeTruthy();
  expect(api.change).toHaveBeenCalledTimes(1);
});
it('does not expose transitions from a locked period', async () => {
  api.get.mockResolvedValueOnce({ ...row, trangThai: 'L' });
  const state = await mount(Detail);
  state.open('close');
  state.open('lock');
  expect(state.action).toBeNull();
  expect(state.canClose).toBe(false);
  expect(state.canLock).toBe(false);
});
it('prevents a read-only user from submitting even if a method is called directly', async () => {
  api.allow = false;
  const state = await mount(CreateDialog, { visible: true });
  await state.submit();
  expect(api.create).not.toHaveBeenCalled();
});
