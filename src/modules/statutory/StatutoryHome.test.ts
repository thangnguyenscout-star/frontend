import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import {
  createRenderer,
  createSSRApp,
  nextTick,
  ssrContextKey,
  type App,
} from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { renderToString } from '@vue/server-renderer';
import { i18n } from '@/locales';
import { statutoryNavigation } from './statutory-navigation';
const state = vi.hoisted(() => ({
  can: vi.fn((module: string) => ['insurance', 'pit'].includes(module)),
}));
vi.mock('@/composables/usePermission', () => ({ usePermission: () => ({ can: state.can }) }));
import Home from './StatutoryHome.vue';
let app: App | undefined;
beforeEach(() => {
  state.can.mockImplementation((module) => ['insurance', 'pit'].includes(module));
  i18n.global.locale.value = 'vi';
});
afterEach(() => {
  app?.unmount();
  app = undefined;
  i18n.global.locale.value = 'vi';
  vi.unstubAllGlobals();
});
async function render(section = 'insurance') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/statutory', name: 'statutory-home', component: Home },
      { path: '/dashboard', component: { render: () => null } },
      { path: '/forbidden', component: { render: () => null } },
    ],
  });
  await router.push('/statutory?section=' + section);
  return renderToString(createSSRApp(Home).use(router).use(i18n));
}
it('renders five disabled insurance cards, breadcrumbs and accessible tabs without financial or personal data', async () => {
  const html = await render();
  expect(html).toContain('BHXH &amp; Thuế TNCN');
  expect(html).toContain('Cấu hình BHXH');
  expect(html).toContain('Trích nộp &amp; đối soát');
  expect(html.match(/data-feature=/g)).toHaveLength(5);
  expect(html.match(/ disabled/g)).toHaveLength(5);
  expect(html).toContain('role="tablist"');
  expect(html).toContain('role="tabpanel"');
  expect(html).toContain('aria-current="page"');
  expect(html).not.toContain('localStorage');
  expect(html).not.toContain('17.5');
  expect(html).not.toContain('Nguyễn Minh Anh');
});
it('renders PIT deep links and only the four matching cards', async () => {
  const html = await render('pit');
  expect(html).toContain('Cấu hình thuế TNCN');
  expect(html).toContain('Người phụ thuộc');
  expect(html.match(/data-feature=/g)).toHaveLength(4);
  expect(html).not.toContain('data-feature="insurance-settings"');
});
it('filters inaccessible groups and translates the complete landing into English and French', async () => {
  state.can.mockImplementation((module) => module === 'pit');
  i18n.global.locale.value = 'en';
  const english = await render('pit');
  expect(english).toContain('Income tax settings');
  expect(english).not.toContain('statutory-tab-insurance');
  i18n.global.locale.value = 'fr';
  const french = await render('pit');
  expect(french).toContain('Personnes à charge');
  expect(french).toContain('En préparation');
  for (const locale of ['vi', 'en', 'fr'] as const)
    for (const item of statutoryNavigation)
      expect(i18n.global.te(`statutory.cards.${item.messageKey}.title`, locale)).toBe(true);
});

it('switches groups with the keyboard and performs no business requests on the landing', async () => {
  const request = vi.fn();
  vi.stubGlobal('fetch', request);
  const focus = vi.fn();
  vi.stubGlobal('document', { getElementById: vi.fn(() => ({ focus })) });
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/statutory', name: 'statutory-home', component: { render: () => null } },
      { path: '/forbidden', component: { render: () => null } },
    ],
  });
  await router.push('/statutory?section=insurance');
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
  app = renderer
    .createApp({ ...Home, render: () => null })
    .use(router)
    .use(i18n);
  app.provide(ssrContextKey, {});
  app.mount({});
  await nextTick();
  const instance = (
    app._instance as unknown as {
      setupState: { tabKey: (event: KeyboardEvent, index: number) => Promise<void> };
    }
  ).setupState;
  const preventDefault = vi.fn();
  await instance.tabKey({ key: 'ArrowRight', preventDefault } as unknown as KeyboardEvent, 0);
  expect(router.currentRoute.value.query.section).toBe('pit');
  expect(preventDefault).toHaveBeenCalledOnce();
  expect(focus).toHaveBeenCalledOnce();
  await instance.tabKey({ key: 'Home', preventDefault } as unknown as KeyboardEvent, 1);
  expect(router.currentRoute.value.query.section).toBe('insurance');
  expect(request).not.toHaveBeenCalled();
});
