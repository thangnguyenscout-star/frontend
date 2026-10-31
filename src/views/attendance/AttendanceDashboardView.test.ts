import { expect, it } from 'vitest';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { createMemoryHistory, createRouter } from 'vue-router';
import Dashboard from './AttendanceDashboardView.vue';
it('renders the overview panels, charts and module destinations without invalid chart coordinates', async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/attendance/:page', component: { render: () => null } }],
  });
  await router.push('/attendance/overview');
  const app = createSSRApp(Dashboard);
  app.use(router);
  const html = await renderToString(app);
  for (const title of [
    'Tổng quan chấm công',
    'Tổng nhân viên',
    'Biểu đồ xu hướng chấm công',
    'Tình trạng theo bộ phận',
    'Nhân viên đi muộn',
    'Nhân viên vắng mặt',
    'Tỷ lệ chấm công theo ca',
    'Trạng thái kỳ chấm công',
    'Công việc cần thực hiện',
    'Truy cập nhanh',
    'Dữ liệu minh họa',
  ])
    expect(html).toContain(title);
  expect(html).toContain('325');
  expect(html).toContain('<svg');
  for (const path of ['daily', 'periods', 'adjustments', 'reports', 'raw-data'])
    expect(html).toContain('/attendance/' + path);
  expect(html).not.toContain('NaN');
  expect(html).not.toContain('undefined');
});
