import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { usePermissionStore } from '@/stores/permission.store';
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'Login', component: () => import('@/views/auth/LoginView.vue') },
    {
      path: '/',
      component: () => import('@/components/layout/AppShell.vue'),
      children: [
        { path: '', redirect: '/contracts' },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
          meta: { module: 'dashboard' },
        },
        {
          path: 'tuyen-dung',
          component: () => import('@/views/recruitment/RecruitmentView.vue'),
          meta: { module: 'tuyen-dung' },
        },
        {
          path: 'tuyen-dung/create',
          component: () => import('@/views/recruitment/RecruitmentFormView.vue'),
          meta: { module: 'tuyen-dung' },
        },
        {
          path: 'tuyen-dung/:id/edit',
          component: () => import('@/views/recruitment/RecruitmentFormView.vue'),
          meta: { module: 'tuyen-dung' },
        },
        {
          path: 'tuyen-dung/:id/view',
          component: () => import('@/views/recruitment/RecruitmentFormView.vue'),
          meta: { module: 'tuyen-dung', recruitmentMode: 'READ' },
        },
        {
          path: 'contracts',
          component: () => import('@/views/contracts/ContractListView.vue'),
          meta: { module: 'contracts' },
        },
        {
          path: 'contracts/new',
          component: () => import('@/views/contracts/ContractCreateView.vue'),
          props: { mode: 'INSERT' },
          meta: { module: 'contracts' },
        },
        {
          path: 'contracts/expiry',
          component: () => import('@/views/contracts/ContractExpiryView.vue'),
          meta: { module: 'contracts' },
        },
        {
          path: 'contracts/:id',
          redirect: (to) => ({ path: '/contracts', query: { contract: String(to.params.id) } }),
          meta: { module: 'contracts' },
        },
        {
          path: 'employees',
          component: () => import('@/views/employees/EmployeeListView.vue'),
          meta: { module: 'employees' },
        },
        {
          path: 'employees/new',
          component: () => import('@/views/employees/EmployeeCreateView.vue'),
          meta: { module: 'employees' },
        },
        {
          path: 'employees/edit/:maNhanVien',
          name: 'EmployeeEdit',
          component: () => import('@/views/employees/EmployeeCreateView.vue'),
          meta: { module: 'employees', employeeMode: 'EDIT' },
        },
        {
          path: 'employees/view/:maNhanVien',
          name: 'EmployeeRead',
          component: () => import('@/views/employees/EmployeeCreateView.vue'),
          meta: { module: 'employees', employeeMode: 'READ' },
        },
        {
          path: 'employees/:id',
          component: () => import('@/views/employees/EmployeeDetailView.vue'),
          meta: { module: 'employees' },
        },
        {
          path: 'departments',
          component: () => import('@/views/departments/DepartmentListView.vue'),
          meta: { module: 'departments' },
        },
        {
          path: 'departments/:id',
          component: () => import('@/views/departments/DepartmentDetailView.vue'),
          meta: { module: 'departments' },
        },
        {
          path: 'positions',
          component: () => import('@/views/positions/PositionListView.vue'),
          meta: { module: 'positions' },
        },
        {
          path: 'positions/:id',
          component: () => import('@/views/positions/PositionDetailView.vue'),
          meta: { module: 'positions' },
        },
        {
          path: 'contract-types',
          component: () => import('@/views/contract-types/ContractTypeListView.vue'),
          meta: { module: 'contract-types' },
        },
        {
          path: 'contract-types/:id',
          component: () => import('@/views/contract-types/ContractTypeDetailView.vue'),
          meta: { module: 'contract-types' },
        },
        {
          path: 'allowance-types',
          component: () => import('@/views/allowance-types/AllowanceTypeListView.vue'),
          meta: { module: 'allowance-types' },
        },
        {
          path: 'allowance-types/:id',
          component: () => import('@/views/allowance-types/AllowanceTypeDetailView.vue'),
          meta: { module: 'allowance-types' },
        },
        {
          path: 'attendance',
          component: () => import('@/views/attendance/AttendanceListView.vue'),
          meta: { module: 'attendance' },
        },
        {
          path: 'attendance/:id',
          component: () => import('@/views/attendance/AttendanceDetailView.vue'),
          meta: { module: 'attendance' },
        },
        {
          path: 'schedules',
          component: () => import('@/views/schedules/ScheduleListView.vue'),
          meta: { module: 'schedules' },
        },
        ...['assign', 'templates', 'swaps', 'reports'].map((page) => ({
          path: 'schedules/' + page,
          component: () => import('@/views/schedules/ScheduleListView.vue'),
          meta: { module: 'schedules', schedulePage: page },
        })),
        { path: 'schedules/:id', redirect: '/schedules', meta: { module: 'schedules' } },
        {
          path: 'leave',
          component: () => import('@/views/leave/LeaveListView.vue'),
          meta: { module: 'leave' },
        },
        {
          path: 'leave/:id',
          component: () => import('@/views/leave/LeaveDetailView.vue'),
          meta: { module: 'leave' },
        },
        {
          path: 'overtime',
          component: () => import('@/views/overtime/OvertimeListView.vue'),
          meta: { module: 'overtime' },
        },
        {
          path: 'overtime/:id',
          component: () => import('@/views/overtime/OvertimeDetailView.vue'),
          meta: { module: 'overtime' },
        },
        {
          path: 'night-shift',
          component: () => import('@/views/night-shift/NightShiftListView.vue'),
          meta: { module: 'night-shift' },
        },
        {
          path: 'night-shift/:id',
          component: () => import('@/views/night-shift/NightShiftDetailView.vue'),
          meta: { module: 'night-shift' },
        },
        {
          path: 'payroll',
          component: () => import('@/views/payroll/PayrollListView.vue'),
          meta: { module: 'payroll' },
        },
        {
          path: 'payroll/:id',
          component: () => import('@/views/payroll/PayrollDetailView.vue'),
          meta: { module: 'payroll' },
        },
        {
          path: 'insurance',
          component: () => import('@/views/insurance/InsuranceListView.vue'),
          meta: { module: 'insurance' },
        },
        {
          path: 'insurance/:id',
          component: () => import('@/views/insurance/InsuranceDetailView.vue'),
          meta: { module: 'insurance' },
        },
        {
          path: 'pit',
          component: () => import('@/views/pit/PitListView.vue'),
          meta: { module: 'pit' },
        },
        {
          path: 'pit/:id',
          component: () => import('@/views/pit/PitDetailView.vue'),
          meta: { module: 'pit' },
        },
        {
          path: 'service-charge',
          component: () => import('@/views/service-charge/ServiceChargeListView.vue'),
          meta: { module: 'service-charge' },
        },
        {
          path: 'service-charge/:id',
          component: () => import('@/views/service-charge/ServiceChargeDetailView.vue'),
          meta: { module: 'service-charge' },
        },
        {
          path: 'reports',
          component: () => import('@/views/reports/ReportListView.vue'),
          meta: { module: 'reports' },
        },
        {
          path: 'reports/:id',
          component: () => import('@/views/reports/ReportDetailView.vue'),
          meta: { module: 'reports' },
        },
        { path: 'forbidden', component: () => import('@/views/shared/ForbiddenView.vue') },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/contracts' },
  ],
});
router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.path !== '/login' && !auth.authenticated)
    return { path: '/login', query: { redirect: to.fullPath } };
  if (to.meta.module && !usePermissionStore().can(String(to.meta.module))) return '/forbidden';
});
router.afterEach(() => window.dispatchEvent(new Event('hr-navigation')));
