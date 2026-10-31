import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createRenderer, createSSRApp, h, nextTick, ssrContextKey, type App } from 'vue';
import { renderToString } from '@vue/server-renderer';
import type { Assignment } from '@/types/schedule';
const api = vi.hoisted(() => ({ shifts: vi.fn(), update: vi.fn() }));
vi.mock('@/services/modules/schedule-shift.service', () => ({ getDepartmentShifts: api.shifts }));
vi.mock('@/services/modules/schedule-update.service', async (original) => ({
  ...(await original<object>()),
  updateScheduleAssignment: api.update,
}));
vi.mock('primevue/dialog', () => ({
  default: {
    setup:
      (_props: unknown, { slots }: { slots: { default?: () => unknown } }) =>
      () =>
        h('dialog', slots.default?.() as []),
  },
}));
vi.mock('primevue/select', () => ({ default: { render: () => h('select') } }));
vi.mock('primevue/inputtext', () => ({ default: { render: () => h('input') } }));
vi.mock('primevue/textarea', () => ({ default: { render: () => h('textarea') } }));
vi.mock('@/components/common/AppButton.vue', () => ({
  default: {
    props: ['label'],
    setup:
      (props: { label: string }, { attrs }: { attrs: object }) =>
      () =>
        h('button', attrs, props.label),
  },
}));
vi.mock('@/composables/useToast', () => ({
  useToast: () => ({ error: vi.fn(), success: vi.fn() }),
}));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { query: vi.fn(), mutate: vi.fn() } }));
import ScheduleEditDialog from './ScheduleEditDialog.vue';
interface TestNode {
  type: string;
  children: TestNode[];
  parent: TestNode | null;
  text: string;
  props: Record<string, unknown>;
}
const node = (type: string): TestNode => ({
  type,
  children: [],
  parent: null,
  text: '',
  props: {},
});
const renderer = createRenderer<TestNode, TestNode>({
  createElement: node,
  createText: (text) => ({ ...node('text'), text }),
  createComment: (text) => ({ ...node('comment'), text }),
  setText: (element, text) => {
    element.text = text;
  },
  setElementText: (element, text) => {
    element.text = text;
    element.children = [];
  },
  patchProp: (element, key, _previous, value) => {
    element.props[key] = value;
  },
  insert: (element, parent, anchor = null) => {
    if (element.parent) element.parent.children.splice(element.parent.children.indexOf(element), 1);
    element.parent = parent;
    const index = anchor ? parent.children.indexOf(anchor) : -1;
    if (index < 0) parent.children.push(element);
    else parent.children.splice(index, 0, element);
  },
  remove: (element) => {
    if (element.parent) element.parent.children.splice(element.parent.children.indexOf(element), 1);
  },
  parentNode: (element) => element.parent,
  nextSibling: (element) =>
    element.parent?.children[element.parent.children.indexOf(element) + 1] || null,
});
const assignment: Assignment = {
  id: '12',
  employeeId: 'NV01',
  date: '2099-10-13',
  shiftId: 'D',
  scheduleType: 'ROTATING',
  status: 'SCHEDULED',
  note: '',
  revision: 1,
  startTime: '08:00',
  endTime: '17:00',
};

let app: App | undefined;
const shifts = [
  {
    id: 'D',
    code: 'D',
    name: 'Day',
    active: true,
    workType: 'C',
    scheduleType: 'ROTATING',
    startTime: '08:00',
    endTime: '17:00',
  },
  {
    id: 'N',
    code: 'N',
    name: 'Night',
    active: true,
    workType: 'C',
    scheduleType: 'ROTATING',
    startTime: '22:00',
    endTime: '06:00',
  },
  { id: 'NP', active: true, workType: '0' },
];
beforeEach(() => {
  vi.clearAllMocks();
  api.shifts.mockReset().mockResolvedValue(shifts);
  api.update.mockReset().mockResolvedValue({ isResults: true });
});
afterEach(() => app?.unmount());
async function mount(extra: Record<string, unknown> = {}) {
  app = renderer.createApp(
    { ...ScheduleEditDialog, render: () => null },
    { assignment, departmentCode: 'BP01', employeeName: 'Employee', ...extra },
  );
  app.provide(ssrContextKey, {});
  app.mount(node('root'));
  await Promise.resolve();
  await Promise.resolve();
  await nextTick();
  return (
    app._instance as unknown as {
      setupState: {
        shiftId: string;
        options: { id: string }[];
        error: string;
        load: () => Promise<void>;
        save: () => Promise<void>;
      };
    }
  ).setupState;
}
it('loads only the department work shifts and excludes current and leave options', async () => {
  const state = await mount();
  expect(api.shifts).toHaveBeenCalledExactlyOnceWith('BP01', 'ROTATING');
  expect(state.options.map((item) => item.id)).toEqual(['N']);
});
it('renders only change-shift fields without leave actions or a leave form', async () => {
  const html = await renderToString(
    createSSRApp(ScheduleEditDialog, {
      assignment,
      departmentCode: 'BP01',
      employeeName: 'Employee',
    }),
  );
  expect(html).toContain('Ca làm việc mới');
  for (const text of ['Nghỉ phép', 'Loại nghỉ phép', 'Tải phân công ca', 'type="radio"'])
    expect(html).not.toContain(text);
});
it('saves the selected work shift and notifies the parent only on success', async () => {
  const saved = vi.fn();
  const state = await mount({ onSaved: saved });
  state.shiftId = 'N';
  await state.save();
  expect(api.update).toHaveBeenCalledWith(
    expect.objectContaining({
      id: assignment.id,
      maCa: 'N',
      gioBatDau: 'PT22H0M',
      gioKetThuc: 'PT6H0M',
      maLoaiNghiPhep: null,
    }),
  );
  expect(saved).toHaveBeenCalledOnce();
});
it('keeps the selected shift on failure and rejects leave shifts before writing', async () => {
  const saved = vi.fn();
  const state = await mount({ onSaved: saved });
  state.shiftId = 'NP';
  await state.save();
  expect(api.update).not.toHaveBeenCalled();
  state.shiftId = 'N';
  api.update.mockRejectedValueOnce(new Error('Offline'));
  await state.save();
  expect(state.error).toBe('Offline');
  expect(state.shiftId).toBe('N');
  expect(saved).not.toHaveBeenCalled();
});
it('does not submit twice while saving', async () => {
  const state = await mount();
  state.shiftId = 'N';
  let finish!: () => void;
  api.update.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  const pending = state.save();
  await state.save();
  expect(api.update).toHaveBeenCalledOnce();
  finish();
  await pending;
});
