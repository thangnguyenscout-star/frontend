import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createRenderer, nextTick, ssrContextKey, type App } from 'vue';
import type { Assignment } from '@/types/schedule';
const api = vi.hoisted(() => ({
  load: vi.fn(),
  exchange: vi.fn(),
  close: vi.fn(),
  confirmed: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
}));
vi.mock('@/composables/useToast', () => ({
  useToast: () => ({ success: api.success, error: api.error }),
}));
vi.mock('@/services/modules/schedule-exchange-assignment.service', () => ({
  getScheduleExchangeAssignments: api.load,
}));
vi.mock('@/services/modules/schedule-exchange.service', () => ({
  exchangeScheduleAssignments: api.exchange,
}));
vi.mock('vue-router', () => ({ onBeforeRouteLeave: vi.fn(), onBeforeRouteUpdate: vi.fn() }));
import ScheduleExchangeDialog from './dialogs/ScheduleExchangeDialog.vue';
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
const source: Assignment = {
  id: '1',
  employeeId: 'NV1',
  date: '2099-10-10',
  shiftId: 'M',
  scheduleType: 'ROTATING',
  status: 'SCHEDULED',
  note: '',
  revision: 1,
  fullTime: true,
  leaveTypeId: null,
  startTime: '06:00',
  endTime: '14:00',
};
const target = { ...source, id: '2', employeeId: 'NV2', shiftId: 'E' };
let app: App | undefined;
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal('document', {
    elementFromPoint: vi.fn(() => ({ closest: () => ({ dataset: { assignmentId: target.id } }) })),
  });
  vi.stubGlobal('window', { addEventListener: vi.fn(), removeEventListener: vi.fn() });
  api.load.mockResolvedValue({ assignments: [source, target] });
  api.exchange.mockResolvedValue({});
});
afterEach(() => {
  app?.unmount();
  vi.unstubAllGlobals();
});

async function mountDialog() {
  const vmProps = {
    assignment: source,
    departmentCode: 'BP1',
    employeeName: 'One',
    onClose: api.close,
    onConfirmed: api.confirmed,
  };
  app = renderer.createApp({ ...ScheduleExchangeDialog, render: () => null }, vmProps);
  app.provide(ssrContextKey, {});
  app.mount(node('root'));
  const state = (
    app._instance as unknown as {
      setupState: {
        date: string;
        reason: string;
        target?: Assignment;
        candidates: Assignment[];
        reload: () => Promise<void>;
        confirm: () => Promise<void>;
        saving: boolean;
        error: string;
        eligible: (a: Assignment) => boolean;
      };
    }
  ).setupState;
  state.date = source.date;
  await nextTick();
  return state;
}
it('loads the selected date and parent department and excludes leave and days off while accepting locked assignments and API-scoped dates', async () => {
  api.load.mockResolvedValue({
    assignments: [
      source,
      target,
      { ...target, id: '3', leaveTypeId: 'NP' },
      { ...target, id: '4', fullTime: false },
      { ...target, id: '5', locked: true },
      { ...target, id: '6', shiftId: 'DO000' },
      { ...target, id: '7', shiftSymbol: ' do ' },
      { ...target, id: '8', status: 'OFF' },
      { ...target, id: '9', date: '2099-10-11' },
      { ...target, id: '10', shiftId: source.shiftId },
    ],
  });
  const state = await mountDialog();
  await state.reload();
  expect(api.load).toHaveBeenCalledWith(source.date, 'BP1');
  expect(state.candidates.map((a: Assignment) => a.id)).toEqual(['2', '4', '5', '9']);
  expect(api.exchange).not.toHaveBeenCalled();
  state.date = '2099-10-11';
  await nextTick();
  expect(state.candidates).toEqual([]);
});
it('does not load partners for a source shift with leave', async () => {
  const state = await mountDialog();
  expect(state.eligible({ ...source, leaveTypeId: 'NP' })).toBe(false);
  expect(state.eligible({ ...source, fullTime: false })).toBe(true);
});
it('submits the selected assignments then closes and reloads on success', async () => {
  const state = await mountDialog();
  state.target = target;
  await state.confirm();
  expect(api.close).toHaveBeenCalledOnce();
  expect(api.confirmed).toHaveBeenCalledOnce();
  expect(api.exchange).toHaveBeenCalledWith(source, target, '');
});

it('refuses day-off shifts as either side of an exchange', async () => {
  const state = await mountDialog();
  for (const a of [
    { ...source, shiftId: ' DO000 ' },
    { ...source, shiftSymbol: 'DO' },
    { ...source, status: 'OFF' as const },
  ]) {
    expect(state.eligible(a)).toBe(false);
    state.target = a;
    await state.confirm();
  }
  expect(api.confirmed).not.toHaveBeenCalled();
});
it('preserves the rich text reason when reloading candidates and changing dates', async () => {
  const state = await mountDialog();
  state.reason = '<p><strong>Personal reason</strong></p>';
  await state.reload();
  state.date = '2099-10-11';
  await nextTick();
  expect(state.reason).toBe('<p><strong>Personal reason</strong></p>');
});

it('keeps the target and reason when the API fails and allows retry', async () => {
  api.exchange.mockRejectedValueOnce(new Error('Server rejected swap'));
  const state = await mountDialog();
  state.target = target;
  state.reason = '<p>Reason</p>';
  await state.confirm();
  expect(state.error).toBe('Server rejected swap');
  expect(state.target?.id).toBe(target.id);
  expect(state.reason).toBe('<p>Reason</p>');
  expect(api.exchange).toHaveBeenCalledWith(source, target, '<p>Reason</p>');
  expect(state.saving).toBe(false);
  expect(api.close).not.toHaveBeenCalled();
  expect(api.confirmed).not.toHaveBeenCalled();
  await state.confirm();
  expect(api.confirmed).toHaveBeenCalledOnce();
});
it('blocks duplicate submissions and waits for the API before closing', async () => {
  let finish!: (value: object) => void;
  api.exchange.mockReturnValueOnce(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  const state = await mountDialog();
  state.target = target;
  const pending = state.confirm();
  await state.confirm();
  expect(api.exchange).toHaveBeenCalledOnce();
  expect(state.saving).toBe(true);
  expect(api.close).not.toHaveBeenCalled();
  finish({});
  await pending;
  expect(state.saving).toBe(false);
  expect(api.confirmed).toHaveBeenCalledOnce();
});

it('uses the selected day on confirmation and accepts the same shift on a different day', async () => {
  const state = await mountDialog();
  state.date = '2099-10-21';
  await nextTick();
  api.load.mockResolvedValue({
    assignments: [{ ...target, date: '2099-10-20', shiftId: source.shiftId, locked: true }],
  });
  await state.reload();
  expect(api.load).toHaveBeenLastCalledWith('2099-10-21', 'BP1');
  expect(state.candidates[0]).toMatchObject({ id: target.id, date: '2099-10-21' });
  state.target = state.candidates[0];
  await state.confirm();
  expect(api.exchange).toHaveBeenCalledWith(
    source,
    expect.objectContaining({ date: '2099-10-21', shiftId: source.shiftId }),
    '',
  );
});
it('does not submit a same-day same-shift target', async () => {
  const state = await mountDialog();
  state.target = { ...target, shiftId: source.shiftId };
  await state.confirm();
  expect(api.exchange).not.toHaveBeenCalled();
});
