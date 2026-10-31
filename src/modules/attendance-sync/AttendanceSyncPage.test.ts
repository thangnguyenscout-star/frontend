import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createRenderer, createSSRApp, h, nextTick, ssrContextKey, type App, type Component } from 'vue';
import { renderToString } from '@vue/server-renderer';

const mocks = vi.hoisted(() => ({
  permission: vi.fn(() => true), query: vi.fn(), departments: vi.fn(),
  leave: vi.fn(), update: vi.fn(),
}));
vi.mock('@/composables/usePermission', () => ({ usePermission: () => ({ can: mocks.permission }) }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { query: mocks.query } }));
vi.mock('@/services/modules/schedule-shift.service', () => ({ getScheduleDepartments: mocks.departments }));
vi.mock('vue-router', () => ({ onBeforeRouteLeave: mocks.leave, onBeforeRouteUpdate: mocks.update }));
vi.mock('@/components/common/AppButton.vue', () => ({
  default: { props: ['label'], setup: (props: { label: string }) => () => h('button', props.label) },
}));
vi.mock('primevue/datatable', () => ({ default: { render: () => null } }));
vi.mock('./ImportSyncDialog.vue', () => ({ default: { render: () => null } }));
import Page from './AttendanceSyncPage.vue';

interface State {
  importVisible: boolean;
  importBusy: boolean;
  openImport: () => void;
  closeImport: () => void;
}
const renderer = createRenderer<object, object>({
  createElement: () => ({}), createText: () => ({}), createComment: () => ({}),
  setText: () => {}, setElementText: () => {}, patchProp: () => {}, insert: () => {},
  remove: () => {}, parentNode: () => null, nextSibling: () => null,
});
let app: App | undefined;
function mount(): State {
  const component = { ...Page, render: () => null } as Component;
  app = renderer.createApp({ render: () => h(component) });
  app.provide(ssrContextKey, {});
  app.mount({});
  return (app._instance!.subTree.component as unknown as { setupState: State }).setupState;
}
async function settle() {
  await Promise.resolve();
  await nextTick();
}
beforeEach(() => {
  vi.clearAllMocks();
  mocks.permission.mockReturnValue(true);
  mocks.query.mockResolvedValue({ data: { baoCaoTongHopLogChamCongThang: { isResults: true, data: [] } } });
  mocks.departments.mockResolvedValue([]);
});
afterEach(() => { app?.unmount(); app = undefined; });

it('renders the restored sync action alongside the monthly report', async () => {
  const html = await renderToString(createSSRApp(Page));
  expect(html).toContain('Đồng bộ dữ liệu máy chấm công');
  expect(html).toContain('Báo cáo tổng hợp log chấm công');
  expect(mocks.permission).toHaveBeenCalledWith('attendance', 'create');
});

it('opens the DAT dialog and reloads the selected report after closing it', async () => {
  const state = mount();
  await settle();
  expect(state.importVisible).toBe(false);
  state.openImport();
  expect(state.importVisible).toBe(true);
  const reportRequests = mocks.query.mock.calls.length;
  state.closeImport();
  await settle();
  expect(state.importVisible).toBe(false);
  expect(mocks.query).toHaveBeenCalledTimes(reportRequests + 1);
  expect(mocks.query.mock.calls.at(-1)![0].variables).toMatchObject({ maBoPhan: null });
});

it('blocks closing the dialog and navigating while processing or saving', async () => {
  const state = mount();
  await settle();
  state.openImport();
  state.importBusy = true;
  expect(mocks.leave.mock.calls[0][0]()).toBe(false);
  expect(mocks.update.mock.calls[0][0]()).toBe(false);
  const reportRequests = mocks.query.mock.calls.length;
  state.closeImport();
  expect(state.importVisible).toBe(true);
  expect(mocks.query).toHaveBeenCalledTimes(reportRequests);
  state.importBusy = false;
  expect(mocks.leave.mock.calls[0][0]()).toBe(true);
  expect(mocks.update.mock.calls[0][0]()).toBe(true);
  state.closeImport();
  expect(state.importVisible).toBe(false);
});

it('hides and blocks syncing without attendance:create while keeping the report available', async () => {
  mocks.permission.mockReturnValue(false);
  const html = await renderToString(createSSRApp(Page));
  expect(html).not.toContain('Đồng bộ dữ liệu máy chấm công');
  expect(html).toContain('Báo cáo tổng hợp log chấm công');
  const state = mount();
  state.openImport();
  expect(state.importVisible).toBe(false);
});
