import { beforeEach, afterEach, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({
  authenticated: true,
  can: vi.fn((module: string) => ['insurance', 'pit'].includes(module)),
}));
vi.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({ authenticated: state.authenticated }),
}));
vi.mock('@/stores/permission.store', () => ({ usePermissionStore: () => ({ can: state.can }) }));
vi.mock('@/components/layout/AppShell.vue', () => ({ default: { render: () => null } }));
vi.mock('@/modules/statutory/StatutoryHome.vue', () => ({ default: { render: () => null } }));
vi.mock('@/views/shared/ForbiddenView.vue', () => ({ default: { render: () => null } }));
vi.mock('@/views/auth/LoginView.vue', () => ({ default: { render: () => null } }));
vi.mock('vue-router', async (original) => {
  const actual = await original<typeof import('vue-router')>();
  return { ...actual, createWebHistory: actual.createMemoryHistory };
});
import { router } from '@/router';
import { statutoryNavigation } from './statutory-navigation';
beforeEach(() => {
  state.authenticated = true;
  state.can.mockImplementation((module) => ['insurance', 'pit'].includes(module));
  vi.stubGlobal('window', { dispatchEvent: vi.fn() });
});
afterEach(() => vi.unstubAllGlobals());
it('supports direct entry, canonical section queries and only one named landing route', async () => {
  await router.push('/statutory');
  expect(router.currentRoute.value.fullPath).toBe('/statutory?section=insurance');
  await router.push('/statutory?section=pit');
  expect(router.currentRoute.value.query.section).toBe('pit');
  expect(router.getRoutes().filter((route) => route.name === 'statutory-home')).toHaveLength(1);
  for (const item of statutoryNavigation) expect(router.hasRoute(item.routeName)).toBe(false);
});
it('redirects legacy lists and details to the matching group without loading old mock screens', async () => {
  for (const section of ['insurance', 'pit'])
    for (const suffix of ['', '/legacy-id']) {
      await router.push('/' + section + suffix);
      expect(router.currentRoute.value.path).toBe('/statutory');
      expect(router.currentRoute.value.query.section).toBe(section);
    }
});
it('redirects to the first permitted section and denies users without statutory access', async () => {
  state.can.mockImplementation((module) => module === 'pit');
  await router.push('/statutory?section=insurance');
  expect(router.currentRoute.value.query.section).toBe('pit');
  state.can.mockReturnValue(false);
  await router.push('/statutory?section=insurance');
  expect(router.currentRoute.value.path).toBe('/forbidden');
});
it('keeps authentication ahead of module access checks', async () => {
  state.authenticated = false;
  await router.push('/statutory?section=pit');
  expect(router.currentRoute.value.path).toBe('/login');
  expect(router.currentRoute.value.query.redirect).toBe('/statutory?section=pit');
});
it('preserves group selection through browser back and forward', async () => {
  await router.push('/statutory?section=insurance');
  await router.push('/statutory?section=pit');
  await new Promise<void>((resolve) => {
    const off = router.afterEach(() => {
      off();
      resolve();
    });
    router.back();
  });
  expect(router.currentRoute.value.query.section).toBe('insurance');
  await new Promise<void>((resolve) => {
    const off = router.afterEach(() => {
      off();
      resolve();
    });
    router.forward();
  });
  expect(router.currentRoute.value.query.section).toBe('pit');
});
