import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createRenderer, createSSRApp, h, nextTick, ssrContextKey, type App } from 'vue';
import { renderToString } from '@vue/server-renderer';

const api = vi.hoisted(() => ({ shifts: vi.fn(), create: vi.fn(), workShift: vi.fn() }));
vi.mock('@/services/modules/schedule-shift.service', () => ({ getDepartmentShifts: api.shifts }));
vi.mock('@/services/modules/leave-request.service', async (original) => ({
  ...(await original<object>()),
  createLeaveRequest: api.create,
  getLeaveWorkShift: api.workShift,
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
import LeaveRequestForm from './LeaveRequestForm.vue';
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

interface State {
  singleDay: boolean;
  fromPart: 'full' | 'first' | 'last' | 'half';
  toPart: 'full' | 'first' | 'last' | 'half';
  form: { fromDate: string; toDate: string; leaveTypeId: string; reason: string };
  calculation: { range: import('@/utils/leave-request').LeaveRequestRange | null; error: string };
  workShifts: Record<'from' | 'to', { ready: boolean; loading: boolean; error: string }>;
  cannotSubmit: boolean;
  error: string;
  save: () => Promise<void>;
  loadWorkShift: (side: 'from' | 'to') => Promise<void>;
}
let app: App | undefined;
const shift = { code: 'D', startTime: '08:00', endTime: '16:00', overnight: false };
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-30T05:00:00Z'));
  vi.clearAllMocks();
  api.shifts
    .mockReset()
    .mockResolvedValue([{ id: 'NP', name: 'Phép năm', active: true, workType: '0' }]);
  api.create.mockReset().mockResolvedValue({ isResults: true });
  api.workShift.mockReset().mockResolvedValue(shift);
});
afterEach(() => {
  app?.unmount();
  vi.useRealTimers();
});
async function settle() {
  for (let i = 0; i < 6; i++) {
    await Promise.resolve();
    await nextTick();
  }
}
async function mount(extra: Record<string, unknown> = {}) {
  app = renderer.createApp(
    { ...LeaveRequestForm, render: () => null },
    { employeeId: 'NV01', employeeName: 'Employee', ...extra },
  );
  app.provide(ssrContextKey, {});
  app.mount(node('root'));
  await settle();
  const state = (app._instance as unknown as { setupState: State }).setupState;
  state.form.leaveTypeId = 'NP';
  state.form.reason = 'Family';
  return state;
}
it('defaults to one day, mirrors the end date and queries the selected day only once', async () => {
  const state = await mount();
  expect(state.singleDay).toBe(true);
  expect(state.form.toDate).toBe(state.form.fromDate);
  expect(api.workShift).toHaveBeenCalledExactlyOnceWith('NV01', '2026-10-30');
  expect(state.calculation.range).toMatchObject({ fromTime: '08:00', toTime: '16:00' });
  state.form.fromDate = '2026-11-02';
  await settle();
  expect(state.form.toDate).toBe('2026-11-02');
  expect(api.workShift).toHaveBeenCalledTimes(2);
  expect(api.workShift).toHaveBeenLastCalledWith('NV01', '2026-11-02');
});
it('renders permanently disabled time inputs and a disabled end-day section', async () => {
  const html = await renderToString(
    createSSRApp(LeaveRequestForm, { employeeId: 'NV01', employeeName: 'Employee' }),
  );
  const inputs = html.match(/<input\b[^>]*>/g)!;
  expect(inputs.find((input) => input.includes('type="checkbox"'))).toContain('checked');
  const timeInputs = inputs.filter((input) => input.includes('type="time"'));
  expect(timeInputs).toHaveLength(2);
  for (const input of timeInputs) expect(input).toContain('disabled');
  expect(inputs.find((input) => input.includes('aria-label="Đến ngày"'))).toContain('disabled');
  expect(html).not.toContain('<table');
});
it('changes single-day half-shift hours without issuing another shift query', async () => {
  const state = await mount();
  state.fromPart = 'first';
  await settle();
  expect(state.toPart).toBe('first');
  expect(state.calculation.range).toMatchObject({ fromTime: '08:00', toTime: '12:00' });
  state.fromPart = 'last';
  await settle();
  expect(state.toPart).toBe('last');
  expect(state.calculation.range).toMatchObject({ fromTime: '12:00', toTime: '16:00' });
  expect(api.workShift).toHaveBeenCalledTimes(1);
});
it('loads each endpoint separately for multiple days and rejects equal selected dates', async () => {
  const state = await mount();
  state.singleDay = false;
  await settle();
  expect(state.form.toDate).toBe('2026-10-31');
  expect(api.workShift).toHaveBeenLastCalledWith('NV01', '2026-10-31');
  state.fromPart = 'half';
  state.toPart = 'half';
  await settle();
  expect(state.calculation.range).toMatchObject({
    fromDate: '2026-10-30',
    fromTime: '12:00',
    toDate: '2026-10-31',
    toTime: '12:00',
  });
  state.form.toDate = '2026-10-30';
  await settle();
  expect(state.calculation.error).toContain('sau từ ngày');
  expect(state.cannotSubmit).toBe(true);
  await state.save();
  expect(api.create).not.toHaveBeenCalled();
});
it('returns to one day, resets the parts and ignores an unfinished end-day query', async () => {
  const state = await mount();
  let finish!: (value: typeof shift) => void;
  api.workShift.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  state.singleDay = false;
  await settle();
  expect(state.workShifts.to.loading).toBe(true);
  state.singleDay = true;
  await settle();
  finish({ ...shift, endTime: '19:00' });
  await settle();
  expect(state.form.toDate).toBe(state.form.fromDate);
  expect(state.fromPart).toBe('full');
  expect(state.calculation.range?.toTime).toBe('16:00');
});
it('ignores stale shift responses after the selected date changes', async () => {
  const state = await mount();
  let finish!: (value: typeof shift) => void;
  api.workShift.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  state.form.fromDate = '2026-11-02';
  await settle();
  expect(state.cannotSubmit).toBe(true);
  api.workShift.mockResolvedValueOnce({ ...shift, startTime: '09:00', endTime: '17:00' });
  state.form.fromDate = '2026-11-03';
  await settle();
  finish({ ...shift, startTime: '10:00', endTime: '18:00' });
  await settle();
  expect(state.calculation.range).toMatchObject({
    fromDate: '2026-11-03',
    fromTime: '09:00',
    toTime: '17:00',
  });
});
it('blocks saving on a shift API failure, then supports retry without treating errors as unassigned days', async () => {
  api.workShift.mockRejectedValueOnce(new Error('Offline'));
  const state = await mount();
  expect(state.workShifts.from.error).toBe('Offline');
  expect(state.calculation.range).toBeNull();
  await state.save();
  expect(api.create).not.toHaveBeenCalled();
  await state.loadWorkShift('from');
  expect(state.calculation.range?.fromTime).toBe('08:00');
});
it('uses the corrected unassigned-day hours for each single-day part', async () => {
  api.workShift.mockResolvedValue(null);
  const state = await mount();
  for (const part of ['full', 'first', 'last'] as const) {
    state.fromPart = part;
    await settle();
    expect(state.calculation.range).toMatchObject({
      fromTime: '00:00',
      toTime: part === 'full' ? '08:00' : '04:00',
    });
  }
});
it('submits midnight for both dates when a multi-day request has no assigned shifts', async () => {
  api.workShift.mockResolvedValue(null);
  const state = await mount();
  state.singleDay = false;
  await settle();
  state.fromPart = 'half';
  state.toPart = 'half';
  await settle();
  expect(state.calculation.range).toMatchObject({ fromTime: '00:00', toTime: '00:00' });
  await state.save();
  expect(api.create).toHaveBeenCalledExactlyOnceWith({
    maNhanVien: 'NV01',
    tuNgay: '2026-10-30T00:00:00+07:00',
    denNgay: '2026-10-31T00:00:00+07:00',
    loaiNghiPhep: 'NP',
    lyDoNghi: 'Family',
  });
});
it('submits calculated overnight dates rather than the disabled mirrored calendar date', async () => {
  api.workShift.mockResolvedValue({
    code: 'N',
    startTime: '22:00',
    endTime: '06:00',
    overnight: true,
  });
  const saved = vi.fn();
  const state = await mount({ onSaved: saved });
  state.fromPart = 'last';
  await settle();
  expect(state.form.toDate).toBe('2026-10-30');
  await state.save();
  expect(api.create).toHaveBeenCalledExactlyOnceWith({
    maNhanVien: 'NV01',
    tuNgay: '2026-10-31T02:00:00+07:00',
    denNgay: '2026-10-31T06:00:00+07:00',
    loaiNghiPhep: 'NP',
    lyDoNghi: 'Family',
  });
  expect(saved).toHaveBeenCalledOnce();
});
it('preserves form selections on submission failure and prevents duplicate submissions', async () => {
  const busy = vi.fn(),
    saved = vi.fn();
  const state = await mount({ onBusy: busy, onSaved: saved });
  api.create.mockRejectedValueOnce(new Error('Offline'));
  await state.save();
  expect(state.error).toBe('Offline');
  expect(state.form.reason).toBe('Family');
  expect(saved).not.toHaveBeenCalled();
  let finish!: () => void;
  api.create.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = () => resolve({ isResults: true });
      }),
  );
  const pending = state.save();
  await state.save();
  expect(api.create).toHaveBeenCalledTimes(2);
  expect(busy).toHaveBeenLastCalledWith(true);
  finish();
  await pending;
  expect(busy).toHaveBeenLastCalledWith(false);
  expect(saved).toHaveBeenCalledOnce();
});
