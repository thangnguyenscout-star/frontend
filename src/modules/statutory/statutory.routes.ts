import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router';
import {
  canStatutory,
  resolveStatutorySection,
  type ExistingPermissionCheck,
} from './statutory-navigation';
export const statutoryRoutes: RouteRecordRaw[] = [
  {
    path: 'statutory',
    name: 'statutory-home',
    component: () => import('./StatutoryHome.vue'),
    meta: { module: 'statutory', statutoryPermission: 'STATUTORY_VIEW' },
  },
  ...(['insurance', 'pit'] as const).flatMap((section) => [
    { path: section, redirect: { name: 'statutory-home', query: { section } } },
    { path: section + '/:id', redirect: { name: 'statutory-home', query: { section } } },
  ]),
];
export function statutoryRouteGuard(
  to: Pick<RouteLocationNormalized, 'meta' | 'name' | 'query' | 'hash'>,
  can: ExistingPermissionCheck,
) {
  if (!to.meta.statutoryPermission) return;
  if (!canStatutory(String(to.meta.statutoryPermission), can)) return '/forbidden';
  if (to.name === 'statutory-home') {
    const section = resolveStatutorySection(to.query.section, can);
    if (!section) return '/forbidden';
    if (to.query.section !== section)
      return {
        name: 'statutory-home',
        query: { ...to.query, section },
        hash: to.hash,
        replace: true,
      };
  }
}
