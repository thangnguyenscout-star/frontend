import { ApiError } from './apiErrorHandler';
import { privateApi } from './privateApi';
import { tokenService } from '@/services/auth/token.service';

export type ReportExportFormat = 'excel' | 'pdf';
export interface ReportFile {
  blob: Blob;
  filename: string;
}
export async function downloadReportFile(
  path: string,
  parameters: Record<string, string | number | null>,
  format: ReportExportFormat,
  fallback: string,
): Promise<ReportFile> {
  const url = new URL(
    path,
    new URL(import.meta.env.VITE_API_URL || '/graphql', window.location.origin),
  );
  for (const [key, value] of Object.entries(parameters))
    if (value !== null && value !== '') url.searchParams.set(key, String(value));
  return privateApi(async () => {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${tokenService.get()}`,
        Accept:
          format === 'pdf'
            ? 'application/pdf'
            : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
    if (response.status === 401) throw new ApiError(401);
    const type = (response.headers.get('content-type') || '').toLowerCase();
    if (!response.ok || type.includes('json') || type.includes('text/html')) {
      const payload = await response.json().catch(() => null);
      throw new Error(
        payload?.message ||
          payload?.detail ||
          payload?.title ||
          payload?.code ||
          payload?.Code ||
          `Không thể xuất báo cáo (HTTP ${response.status}).`,
      );
    }
    const blob = await response.blob();
    if (!blob.size) throw new Error('Máy chủ trả về tệp báo cáo trống.');
    const disposition = response.headers.get('content-disposition') || '';
    const encoded = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(disposition)?.[1];
    const plain = /filename\s*=\s*(?:"([^"]+)"|([^;]+))/i.exec(disposition);
    let filename = plain?.[1] || plain?.[2]?.trim() || fallback;
    if (encoded) {
      try {
        filename = decodeURIComponent(encoded.trim());
      } catch {
        /* Keep the plain name if the encoded name is malformed. */
      }
    }
    filename = filename.replace(/[/\\\r\n]/g, '_');
    return { blob, filename: filename || fallback };
  });
}
export function saveReportFile(file: ReportFile) {
  const url = URL.createObjectURL(file.blob);
  const link = document.createElement('a');
  try {
    link.href = url;
    link.download = file.filename;
    document.body.append(link);
    link.click();
  } finally {
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
