import { afterEach, expect, it, vi } from 'vitest';
import { createSSRApp } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { renderToString } from '@vue/server-renderer';
import { i18n } from '@/locales';
const state = vi.hoisted(() => ({
  can: vi.fn((module: string) => ['insurance', 'pit'].includes(module)),
}));
vi.mock('@/composables/usePermission', () => ({ usePermission: () => ({ can: state.can }) }));
vi.mock('@/composables/useAuth', () => ({ useAuth: () => ({ role: 'HR Staff' }) }));
vi.mock('@/stores/app.store', () => ({ useAppStore: () => ({ collapsed: false }) }));
import Sidebar from '@/components/layout/AppSidebar.vue';
afterEach(() => {
  state.can.mockImplementation((module) => ['insurance', 'pit'].includes(module));
});
async function render() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/statutory/:pathMatch(.*)*', component: { render: () => null } },
      { path: '/dashboard', component: { render: () => null } },
    ],
  });
  await router.push('/statutory/insurance/settings');
  return renderToString(createSSRApp(Sidebar).use(router).use(i18n));
}
it('renders exactly one top-level statutory link and marks it active for nested URLs', async () => {
  const html = await render();
  expect(html.match(/href="\/statutory"/g)).toHaveLength(1);
  expect(html).not.toContain('href="/insurance"');
  expect(html).not.toContain('href="/pit"');
  expect(html).toContain('statutory-active');
});
it('hides the combined menu for users without insurance or PIT access', async () => {
  state.can.mockReturnValue(false);
  expect(await render()).not.toContain('href="/statutory"');
});
