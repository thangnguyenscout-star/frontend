import { expect, it, vi } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
vi.mock('./AppButton.vue', () => ({
  default: {
    props: ['label'],
    setup:
      (props: { label: string }, { attrs }: { attrs: object }) =>
      () =>
        h('button', attrs, props.label),
  },
}));
import Buttons from './ReportExportButtons.vue';
it('enables only formats available for the selected report tab', async () => {
  const unavailable = await renderToString(createSSRApp(Buttons));
  expect(unavailable).toContain('Xuất Excel');
  expect(unavailable).toContain('Xuất PDF');
  expect(unavailable.match(/disabled/g)).toHaveLength(2);
  const available = await renderToString(createSSRApp(Buttons, { formats: ['excel', 'pdf'] }));
  expect(available).not.toContain('disabled');
});
it('disables both export controls while one format is exporting', async () => {
  const html = await renderToString(
    createSSRApp(Buttons, { formats: ['excel', 'pdf'], busy: 'excel' }),
  );
  expect(html.match(/disabled/g)).toHaveLength(2);
});
