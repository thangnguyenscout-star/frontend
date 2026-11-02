export type StatutorySection = 'insurance' | 'pit';
export type StatutoryPermission =
  | 'STATUTORY_VIEW'
  | 'INSURANCE_SETTINGS_VIEW'
  | 'INSURANCE_MOVEMENT_VIEW'
  | 'INSURANCE_SUBMISSION_VIEW'
  | 'INSURANCE_BENEFIT_VIEW'
  | 'INSURANCE_PAYMENT_VIEW'
  | 'PIT_SETTINGS_VIEW'
  | 'PIT_DEPENDENT_VIEW'
  | 'PIT_WITHHOLDING_VIEW'
  | 'PIT_SETTLEMENT_VIEW';
export interface StatutoryNavItem {
  key: string;
  section: StatutorySection;
  messageKey: string;
  icon: string;
  routeName: string;
  path: string;
  permission: Exclude<StatutoryPermission, 'STATUTORY_VIEW'>;
  enabled: boolean;
}
export const statutoryMenu = {
  key: 'statutory',
  icon: 'pi-shield',
  group: 'finance',
  path: '/statutory',
} as const;
export const statutorySections: StatutorySection[] = ['insurance', 'pit'];
// The existing insurance/PIT pages are generic mock lists, not implemented statutory features.
// Enable a card only when its real page and guarded route are available.
export const statutoryNavigation: StatutoryNavItem[] = [
  {
    key: 'insurance-settings',
    section: 'insurance',
    messageKey: 'insuranceSettings',
    icon: 'pi-sliders-h',
    routeName: 'insurance-settings',
    path: '/statutory/insurance/settings',
    permission: 'INSURANCE_SETTINGS_VIEW',
    enabled: false,
  },
  {
    key: 'insurance-movements',
    section: 'insurance',
    messageKey: 'insuranceMovements',
    icon: 'pi-arrow-right-arrow-left',
    routeName: 'insurance-movements',
    path: '/statutory/insurance/movements',
    permission: 'INSURANCE_MOVEMENT_VIEW',
    enabled: false,
  },
  {
    key: 'insurance-submissions',
    section: 'insurance',
    messageKey: 'insuranceSubmissions',
    icon: 'pi-folder-open',
    routeName: 'insurance-submissions',
    path: '/statutory/insurance/submissions',
    permission: 'INSURANCE_SUBMISSION_VIEW',
    enabled: false,
  },
  {
    key: 'insurance-benefits',
    section: 'insurance',
    messageKey: 'insuranceBenefits',
    icon: 'pi-heart',
    routeName: 'insurance-benefits',
    path: '/statutory/insurance/benefits',
    permission: 'INSURANCE_BENEFIT_VIEW',
    enabled: false,
  },
  {
    key: 'insurance-payments',
    section: 'insurance',
    messageKey: 'insurancePayments',
    icon: 'pi-credit-card',
    routeName: 'insurance-payments',
    path: '/statutory/insurance/payments',
    permission: 'INSURANCE_PAYMENT_VIEW',
    enabled: false,
  },
  {
    key: 'pit-settings',
    section: 'pit',
    messageKey: 'pitSettings',
    icon: 'pi-sliders-h',
    routeName: 'pit-settings',
    path: '/statutory/pit/settings',
    permission: 'PIT_SETTINGS_VIEW',
    enabled: false,
  },
  {
    key: 'pit-dependents',
    section: 'pit',
    messageKey: 'pitDependents',
    icon: 'pi-users',
    routeName: 'pit-dependents',
    path: '/statutory/pit/dependents',
    permission: 'PIT_DEPENDENT_VIEW',
    enabled: false,
  },
  {
    key: 'pit-withholding',
    section: 'pit',
    messageKey: 'pitWithholding',
    icon: 'pi-calculator',
    routeName: 'pit-withholding',
    path: '/statutory/pit/withholding',
    permission: 'PIT_WITHHOLDING_VIEW',
    enabled: false,
  },
  {
    key: 'pit-settlement',
    section: 'pit',
    messageKey: 'pitSettlement',
    icon: 'pi-file-check',
    routeName: 'pit-settlement',
    path: '/statutory/pit/settlement',
    permission: 'PIT_SETTLEMENT_VIEW',
    enabled: false,
  },
];
export type ExistingPermissionCheck = (module: string, action?: string) => boolean;
// Phase 1 adapts the existing module/action RBAC. The login response has no granular permission claims.
export function canStatutory(permission: string, can: ExistingPermissionCheck): boolean {
  if (permission === 'STATUTORY_VIEW') return can('insurance', 'view') || can('pit', 'view');
  const item = statutoryNavigation.find((item) => item.permission === permission);
  return !!item && can(item.section, 'view');
}
export function statutoryCards(can: ExistingPermissionCheck) {
  return statutoryNavigation.filter((item) => canStatutory(item.permission, can));
}
export function availableStatutorySections(can: ExistingPermissionCheck): StatutorySection[] {
  const cards = statutoryCards(can);
  return statutorySections.filter((section) => cards.some((item) => item.section === section));
}
export function resolveStatutorySection(
  requested: unknown,
  can: ExistingPermissionCheck,
): StatutorySection | null {
  const sections = availableStatutorySections(can);
  return sections.find((section) => section === requested) || sections[0] || null;
}
export function statutorySidebarItems<T extends { key: string; icon: string; group: string }>(
  items: T[],
  can: ExistingPermissionCheck,
): (T | typeof statutoryMenu)[] {
  const result: (T | typeof statutoryMenu)[] = [];
  let inserted = false;
  for (const item of items) {
    if (item.key === 'insurance' || item.key === 'pit' || item.key === 'statutory') {
      if (!inserted && canStatutory('STATUTORY_VIEW', can)) {
        result.push(statutoryMenu);
        inserted = true;
      }
    } else if (can(item.key)) result.push(item);
  }
  if (!inserted && canStatutory('STATUTORY_VIEW', can)) result.push(statutoryMenu);
  return result;
}
