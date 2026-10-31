import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createRenderer, h, reactive, ssrContextKey, type Component, type App } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
const mocks = vi.hoisted(() => ({ permission: vi.fn(() => true), submit: vi.fn() }));
vi.mock('@/composables/usePermission', () => ({ usePermission: () => ({ can: mocks.permission }) }));
vi.mock('@/services/modules/attendance-import.service', () => ({ startAttendanceImport: mocks.submit }));
vi.mock('@/utils/error-message', () => ({ getApiErrorMessage: (error: unknown) => error instanceof Error ? error.message : String(error) }));
import ImportDialog from './ImportSyncDialog.vue';
interface State {
  files: Array<{ id: string; file: File; state: string; rows: Array<{ status: string | null }>; result?: unknown }>;
  working: boolean;
  processed: boolean;
  addFiles: (event: Event) => void;
  startProcessing: () => Promise<void>;
  saveToDatabase: () => Promise<void>;
  removeFile: (id: string) => void;
}
const renderer = createRenderer<object, object>({
  createElement: () => ({}), createText: () => ({}), createComment: () => ({}),
  setText: () => {}, setElementText: () => {}, patchProp: () => {}, insert: () => {},
  remove: () => {}, parentNode: () => null, nextSibling: () => null,
});
let app: App | undefined;
function mount(): State {
  const component = { ...ImportDialog, render: () => null } as Component;
  app = renderer.createApp({ render: () => h(component, reactive({ visible: true })) });
  app.provide(ssrContextKey, {});
  app.mount({});
  return (app._instance?.subTree.component as unknown as { setupState: State }).setupState;
}
const contents = 'MaThietBi\tMaNguoiDungMay\tMaNhanVien\tThoiGianQuet\tLoaiSuKien\n7\t000123\tE0001\t2026-10-01 08:00:00\tI';
const file = (name = 'sample.dat', text = contents) => new File([text], name);
const choose = (...files: File[]) => ({ target: { files, value: 'selected' } }) as unknown as Event;
const okResult = { trangThai: 'COMPLETED', tongBanGhi: 1, soBanGhiMoi: 1, soBanGhiTrung: 0, soBanGhiLoi: 0, soBanGhiChuaMapping: 0, loi: [] };
beforeEach(() => { setActivePinia(createPinia()); mocks.permission.mockReturnValue(true); mocks.submit.mockReset(); });
afterEach(() => { app?.unmount(); app = undefined; });

it('processes DAT locally on Start and calls the API only on Save to database', async () => {
  mocks.submit.mockResolvedValue(okResult);
  const state = mount();
  state.addFiles(choose(file('first.dat'), file('second.dat', contents.replace('000123', '000124').replace('08:00:00', '09:00:00'))));
  expect(state.files.map(item => item.file.name)).toEqual(['first.dat', 'second.dat']);
  expect(mocks.submit).not.toHaveBeenCalled();
  await state.startProcessing();
  expect(state.processed).toBe(true);
  expect(state.files.map(item => item.state)).toEqual(['PROCESSED', 'PROCESSED']);
  expect(mocks.submit).not.toHaveBeenCalled();
  expect(state.files[0].rows[0]).toMatchObject({
    line: 2, machineNo: 7, user: '000123', time: '2026-10-01 08:00:00',
    eventType: 'I', rawStatus: 'E0001', raw: '7\t000123\tE0001\t2026-10-01 08:00:00\tI',
    status: 'VALID', message: null,
  });
  await state.saveToDatabase();
  expect(mocks.submit).toHaveBeenCalledTimes(2);
  expect(mocks.submit.mock.calls[0][0].rows).toEqual(state.files[0].rows);
  expect(state.files.map(item => item.state)).toEqual(['COMPLETED', 'COMPLETED']);
});

it('rejects invalid files and does not process or save without attendance:create', async () => {
  const state = mount();
  state.addFiles(choose(file('wrong.csv'), new File([], 'empty.dat')));
  expect(state.files).toHaveLength(0);
  expect(mocks.submit).not.toHaveBeenCalled();
  app?.unmount(); app = undefined;
  mocks.permission.mockReturnValue(false);
  const denied = mount();
  denied.addFiles(choose(file()));
  await denied.startProcessing();
  await denied.saveToDatabase();
  expect(mocks.submit).not.toHaveBeenCalled();
});

it('validates DAT locally without a network request', async () => {
  const state = mount();
  state.addFiles(choose(file('bad-header.dat', 'x\ty\nz')));
  await state.startProcessing();
  expect(state.files[0].state).toBe('INVALID');
  expect(mocks.submit).not.toHaveBeenCalled();
});

it('marks an uncertain API result only on Save and never resends that file automatically', async () => {
  mocks.submit.mockRejectedValue(new Error('Network error'));
  const state = mount();
  state.addFiles(choose(file()));
  await state.startProcessing();
  expect(mocks.submit).not.toHaveBeenCalled();
  await state.saveToDatabase();
  expect(state.files[0].state).toBe('UNCERTAIN');
  await state.saveToDatabase();
  expect(mocks.submit).toHaveBeenCalledTimes(1);
});

it('stops after an uncertain file while keeping later files pending', async () => {
  mocks.submit.mockResolvedValueOnce(okResult);
  mocks.submit.mockRejectedValueOnce(new Error('Server timeout'));
  const state = mount();
  state.addFiles(choose(file('one.dat'), file('two.dat', contents.replace('000123', '000124').replace('08:00:00', '09:00:00')), file('three.dat', contents.replace('000123', '000125').replace('08:00:00', '10:00:00'))));
  await state.startProcessing();
  expect(mocks.submit).not.toHaveBeenCalled();
  await state.saveToDatabase();
  expect(mocks.submit).toHaveBeenCalledTimes(2);
  expect(state.files.map(item => item.state)).toEqual(['COMPLETED', 'UNCERTAIN', 'PROCESSED']);
  await state.saveToDatabase();
  expect(mocks.submit).toHaveBeenCalledTimes(3);
});

it('sends only valid unique rows to GraphQL when saving multiple DAT records', async () => {
  mocks.submit.mockResolvedValue(okResult);
  const state = mount();
  const withInvalidAndDuplicate = [
    contents,
    '7\t000124\tE0002\t2026-10-01 09:00:00\tI',
    '7\t000123\tE0001\t2026-10-01 08:00:00\tI',
    '7\t\tE0003\t2026-10-01 10:00:00\tI',
  ].join('\n');
  state.addFiles(choose(file('first.dat', withInvalidAndDuplicate)));
  await state.startProcessing();
  expect(state.files[0].rows.map((row) => row.status)).toEqual(['VALID', 'VALID', 'DUPLICATE', 'INVALID']);
  await state.saveToDatabase();
  expect(mocks.submit).toHaveBeenCalledTimes(1);
  const submittedRows = mocks.submit.mock.calls[0][0].rows as Array<{ status: string | null }>;
  expect(submittedRows.map((row: { status: string | null }) => row.status)).toEqual(['VALID', 'VALID']);
});

it('keeps confirmed partial batch results visible when a later batch is uncertain', async () => {
  const partial = { ...okResult, trangThai: 'PARTIAL', tongBanGhi: 2000, soBanGhiMoi: 1990, soBanGhiTrung: 10 };
  mocks.submit.mockRejectedValue(Object.assign(new Error('Network timeout'), { partialResult: partial }));
  const state = mount();
  state.addFiles(choose(file()));
  await state.startProcessing();
  await state.saveToDatabase();
  expect(state.files[0].state).toBe('UNCERTAIN');
  expect(state.files[0].result).toEqual(partial);
});