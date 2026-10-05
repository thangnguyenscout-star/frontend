import type { HrRecord } from '@/types/common';
export function exportCsv(rows: HrRecord[], columns: string[], headers: string[], name: string) {
  const cell = (v: unknown) => {
    let text = String(v ?? '');
    if (/^[=+@\-\t\r]/.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  };
  const csv =
    '\ufeff' +
    [headers, ...rows.map((r) => columns.map((c) => r[c]))]
      .map((row) => row.map(cell).join(','))
      .join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}
