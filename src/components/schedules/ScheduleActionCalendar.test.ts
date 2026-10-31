import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createRenderer, createSSRApp, h, nextTick, ssrContextKey, type App } from 'vue';
import { renderToString } from '@vue/server-renderer';
import type { Assignment } from '@/types/schedule';

const api = vi.hoisted(() => ({ load: vi.fn() }));
vi.mock('@/services/modules/schedule-assignment.service', () => ({
  getScheduleAssignments: api.load,
}));
vi.mock('./dialogs/ScheduleExchangeDialog.vue', () => ({ default: { render: () => null } }));
vi.mock('vue-router', () => ({ onBeforeRouteLeave: vi.fn(), onBeforeRouteUpdate: vi.fn() }));
import ScheduleActionCalendar from './ScheduleActionCalendar.vue';
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

const assignment = {
  id: '1',
  employeeId: 'NV1',
  date: '2099-10-10',
  shiftId: 'D',
  status: 'SCHEDULED',
} as Assignment;
let app: App | undefined;
const props = {
  canEdit: true,
  employees: [{ code: 'NV1', name: 'One', department: 'Dept' }],
  departments: [{ code: 'BP1', name: 'Dept' }],
};
beforeEach(() => {
  api.load.mockReset().mockResolvedValue({ assignments: [assignment] });
});
afterEach(() => app?.unmount());
async function mount() {
  app = renderer.createApp({ ...ScheduleActionCalendar, render: () => null }, props);
  app.provide(ssrContextKey, {});
  app.mount(node('root'));
  await Promise.resolve();
  await Promise.resolve();
  await nextTick();
  return (
    app._instance as unknown as {
      setupState: {
        anchor: string;
        search: string;
        source?: Assignment;
        assignments: Assignment[];
        error: string;
        load: () => Promise<void>;
      };
    }
  ).setupState;
}
it('loads assignments for the exchange calendar month', async () => {
  const state = await mount();
  state.anchor = '2099-10-10';
  await nextTick();
  await state.load();
  expect(api.load).toHaveBeenLastCalledWith('2099-10-01', '2099-10-31');
  expect(state.assignments).toEqual([assignment]);
});
it('ignores stale requests and clears assignments after a failure', async () => {
  const state = await mount();
  let finish!: (value: { assignments: Assignment[] }) => void;
  api.load.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const stale = state.load();
  api.load.mockResolvedValueOnce({ assignments: [{ ...assignment, id: 'new' }] });
  await state.load();
  finish({ assignments: [assignment] });
  await stale;
  expect(state.assignments[0].id).toBe('new');
  api.load.mockRejectedValueOnce(new Error('Offline'));
  await state.load();
  expect(state.error).toBe('Offline');
  expect(state.assignments).toEqual([]);
});
it('clears the selected exchange source when filters change', async () => {
  const state = await mount();
  state.source = assignment;
  state.search = 'Other';
  await nextTick();
  expect(state.source).toBeUndefined();
});
it('renders an exchange calendar without leave actions', async () => {
  const instance = createSSRApp(ScheduleActionCalendar, props);
  instance.component('RouterLink', { render: () => h('a') });
  const html = await renderToString(instance);
  expect(html).toContain('Đổi ca');
  expect(html).not.toContain('Lịch nghỉ phép');
  expect(html).not.toContain('Kéo chọn');
});
