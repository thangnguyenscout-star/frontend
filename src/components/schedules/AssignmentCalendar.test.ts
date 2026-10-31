vi.mock('@/composables/useToast', () => ({ useToast: () => ({ error: vi.fn() }) }));
import { afterEach, expect, it, vi } from 'vitest';
import { createRenderer, nextTick, ssrContextKey, type App } from 'vue';
import type { DayPlan } from './AssignmentCalendar.vue';
vi.mock('primevue/dialog', () => ({ default: { render: () => null } }));
vi.mock('@/services/modules/schedule-shift.service', () => ({ getDepartmentShifts: vi.fn() }));
import AssignmentCalendar from './AssignmentCalendar.vue';
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
let app: App | undefined;
afterEach(() => app?.unmount());
async function mount() {
  const create = vi.fn().mockResolvedValue(undefined);
  app = renderer.createApp(
    { ...AssignmentCalendar, render: () => null },
    {
      employees: [{ code: 'NV1', name: 'Nguyen A', department: 'Dept' }],
      shifts: [
        {
          id: 'N',
          code: 'N',
          name: 'Đêm',
          scheduleType: 'ROTATING',
          active: true,
          workType: 'C',
          startTime: '22:00',
          endTime: '06:00',
          crossDay: true,
        },
      ],
      modelValue: [],
      initialDate: '2099-10-13',
      viewMode: 'week',
      anchorDate: '2099-10-13',
      createAssignment: create,
    },
  );
  app.provide(ssrContextKey, {});
  app.mount(node('root'));
  await nextTick();
  const state = (
    app._instance as unknown as {
      setupState: {
        open: (date: string, id: string) => void;
        save: () => void;
        confirmCreate: () => Promise<void>;
        shiftId: string;
        note: string;
        visible: boolean;
        confirmation: boolean;
        saving: boolean;
        error: string;
        pending?: DayPlan;
      };
    }
  ).setupState;
  state.open('2099-10-13', 'NV1');
  state.shiftId = 'N';
  state.note = 'Ca đêm';
  await nextTick();
  return { state, create };
}
it('opens confirmation without creating and submits only after explicit confirmation', async () => {
  const { state, create } = await mount();
  expect(create).not.toHaveBeenCalled();
  state.save();
  expect(state.confirmation).toBe(true);
  expect(create).not.toHaveBeenCalled();
  // Quay lại leaves the form open and sends nothing.
  state.confirmation = false;
  expect(state.visible).toBe(true);
  expect(create).not.toHaveBeenCalled();
  state.save();
  await state.confirmCreate();
  expect(create).toHaveBeenCalledExactlyOnceWith({
    employeeId: 'NV1',
    date: '2099-10-13',
    shiftId: 'N',
    fullTime: true,
    note: 'Ca đêm',
    startTime: '22:00',
    endTime: '06:00',
    crossDay: true,
  });
  expect(state.visible).toBe(false);
});
it('prevents duplicate submissions while the request is pending', async () => {
  const { state, create } = await mount();
  let resolve!: () => void;
  create.mockImplementation(
    () =>
      new Promise<void>((done) => {
        resolve = done;
      }),
  );
  state.save();
  const first = state.confirmCreate();
  await state.confirmCreate();
  expect(create).toHaveBeenCalledTimes(1);
  resolve();
  await first;
});
it('keeps the selected shift and note on API failure', async () => {
  const { state, create } = await mount();
  create.mockRejectedValueOnce(new Error('Không thể tạo ca'));
  state.save();
  await state.confirmCreate();
  expect(state.visible).toBe(true);
  expect(state.confirmation).toBe(false);
  expect(state.shiftId).toBe('N');
  expect(state.note).toBe('Ca đêm');
  expect(state.error).toBe('Không thể tạo ca');
  expect(state.saving).toBe(false);
});

it('does not submit a canceled confirmation', async () => {
  const { state, create } = await mount();
  state.save();
  state.confirmation = false;
  await state.confirmCreate();
  expect(create).not.toHaveBeenCalled();
});
