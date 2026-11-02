import { expect, it } from 'vitest';
import { modules } from '@/constants/modules';
import {
  statutoryNavigation,
  statutoryCards,
  canStatutory,
  availableStatutorySections,
  resolveStatutorySection,
  statutorySidebarItems,
} from './statutory-navigation';
const insuranceOnly = (module: string) => module === 'insurance';
const pitOnly = (module: string) => module === 'pit';
it('defines the nine planned features once, with unique paths, route names and permissions', () => {
  expect(statutoryNavigation).toHaveLength(9);
  for (const property of ['key', 'path', 'routeName', 'permission'] as const)
    expect(new Set(statutoryNavigation.map((item) => item[property])).size).toBe(9);
  expect(statutoryNavigation.filter((item) => item.section === 'insurance')).toHaveLength(5);
  expect(statutoryNavigation.filter((item) => item.section === 'pit')).toHaveLength(4);
  expect(statutoryNavigation.every((item) => !item.enabled)).toBe(true);
});
it('adapts only known statutory permissions to existing insurance and PIT access', () => {
  expect(canStatutory('STATUTORY_VIEW', insuranceOnly)).toBe(true);
  expect(canStatutory('INSURANCE_SETTINGS_VIEW', insuranceOnly)).toBe(true);
  expect(canStatutory('PIT_SETTINGS_VIEW', insuranceOnly)).toBe(false);
  expect(canStatutory('PIT_DEPENDENT_VIEW', pitOnly)).toBe(true);
  expect(canStatutory('STATUTORY_VIEW', () => false)).toBe(false);
  expect(canStatutory('UNKNOWN_PERMISSION', () => true)).toBe(false);
});
it('filters cards and chooses the first permitted section when a deep-link section is inaccessible', () => {
  expect(statutoryCards(insuranceOnly)).toHaveLength(5);
  expect(availableStatutorySections(pitOnly)).toEqual(['pit']);
  expect(resolveStatutorySection('insurance', pitOnly)).toBe('pit');
  expect(resolveStatutorySection('pit', insuranceOnly)).toBe('insurance');
  expect(resolveStatutorySection(['pit'], insuranceOnly)).toBe('insurance');
  expect(resolveStatutorySection(null, () => false)).toBeNull();
});
it('replaces both legacy sidebar entries with exactly one item without mutating domain definitions', () => {
  const before = modules.map((item) => item.key);
  const items = statutorySidebarItems(modules, () => true);
  expect(items.filter((item) => item.key === 'statutory')).toHaveLength(1);
  expect(items.some((item) => ['insurance', 'pit'].includes(item.key))).toBe(false);
  expect(items.filter((item) => item.key !== 'statutory').map((item) => item.key)).toEqual(
    before.filter((key) => !['insurance', 'pit'].includes(key)),
  );
  expect(modules.map((item) => item.key)).toEqual(before);
  expect(statutorySidebarItems(modules, () => false)).toEqual([]);
});
