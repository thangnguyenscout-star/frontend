import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { print } from 'graphql';
const api = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { query: api.query } }));
vi.mock('@/services/api/privateApi', () => ({
  privateApi: (request: () => Promise<unknown>) => request(),
}));
vi.mock('@/services/auth/token.service', () => ({
  tokenService: { get: () => 'test-access-token' },
}));
import { ApiError } from '@/services/api/apiErrorHandler';
import { getLateEarlyReport, exportLateEarlyReport, LATE_EARLY_REPORT } from './late-early.service';
const filter = { thang: 10, nam: 2026, ten: ' Nguyễn ', maBoPhan: '01' };
const item = { maNhanVien: '000001', hoVaTen: 'Nguyễn An', diTre: 12, veSom: 3 };
const result = (data: unknown) => ({ data: { diMuonVeSom: { isResults: true, data } } });
beforeEach(() => api.query.mockReset());
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
it('sends the exact typed input, selected filters and pagination and retains server metadata', async () => {
  api.query.mockResolvedValueOnce(
    result({ pageIndex: 2, pageSize: 20, totalRecords: 35, totalPages: 2, items: [null, item] }),
  );
  await expect(getLateEarlyReport(filter, 2, 20)).resolves.toEqual({
    pageIndex: 2,
    pageSize: 20,
    totalRecords: 35,
    totalPages: 2,
    items: [item],
  });
  expect(api.query).toHaveBeenCalledExactlyOnceWith({
    query: LATE_EARLY_REPORT,
    variables: {
      input: { thang: 10, nam: 2026, ten: 'Nguyễn', maBoPhan: '01', pageIndex: 2, pageSize: 20 },
    },
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  const document = print(LATE_EARLY_REPORT);
  expect(document).toContain('$input: DiMuonVeSomInput!');
  for (const field of [
    'thang',
    'nam',
    'maNhanVien',
    'hoVaTen',
    'ngaySinh',
    'gioiTinh',
    'maBoPhan',
    'tenBoPhan',
    'maCa',
    'tenCa',
    'gioBatDau',
    'gioKetThuc',
    'tinhCaDem',
    'ngayChamCong',
    'gioVao',
    'gioRa',
    'diTre',
    'veSom',
    'tinhTrang',
  ])
    expect(document).toContain(field);
});
it('defaults to page 1/20 and normalizes empty optional filters to null', async () => {
  api.query.mockResolvedValueOnce(
    result({ pageIndex: 1, pageSize: 20, totalRecords: 0, totalPages: 0, items: [] }),
  );
  await getLateEarlyReport({ ...filter, ten: ' ', maBoPhan: '' });
  expect(api.query.mock.calls[0][0].variables.input).toEqual({
    thang: 10,
    nam: 2026,
    ten: null,
    maBoPhan: null,
    pageIndex: 1,
    pageSize: 20,
  });
});
it('rejects invalid filters and pagination before querying', async () => {
  for (const invalid of [
    { thang: 0 },
    { thang: 13 },
    { nam: 1752 },
    { nam: 9999 },
    { ten: 'a'.repeat(101) },
  ])
    await expect(getLateEarlyReport({ ...filter, ...invalid })).rejects.toThrow();
  await expect(getLateEarlyReport(filter, 0)).rejects.toThrow();
  await expect(getLateEarlyReport(filter, 1, 201)).rejects.toThrow();
  expect(api.query).not.toHaveBeenCalled();
});
it('surfaces business, transport and malformed pagination failures', async () => {
  api.query.mockResolvedValueOnce({
    data: { diMuonVeSom: { isResults: false, message: 'ACCESS_DENIED' } },
  });
  await expect(getLateEarlyReport(filter)).rejects.toThrow('ACCESS_DENIED');
  api.query.mockResolvedValueOnce(result({ items: [] }));
  await expect(getLateEarlyReport(filter)).rejects.toThrow('phân trang');
  api.query.mockRejectedValueOnce(new Error('Offline'));
  await expect(getLateEarlyReport(filter)).rejects.toThrow('Offline');
});
function setup(response: Response) {
  vi.stubGlobal('window', { location: { origin: 'https://frontend.example.com' } });
  vi.stubEnv('VITE_API_URL', 'https://backend.example.com/graphql');
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
it.each(['excel', 'pdf'] as const)(
  'exports all filtered rows through the %s endpoint with authentication',
  async (format) => {
    const fetchMock = setup(
      new Response('binary', {
        headers: {
          'content-type': format === 'pdf' ? 'application/pdf' : 'application/octet-stream',
        },
      }),
    );
    const file = await exportLateEarlyReport(filter, format);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url.origin).toBe('https://backend.example.com');
    expect(url.pathname).toBe('/api/di-muon-ve-som/export-' + format);
    expect(Object.fromEntries(url.searchParams)).toEqual({
      thang: '10',
      nam: '2026',
      ten: 'Nguyễn',
      maBoPhan: '01',
    });
    expect(options).toMatchObject({
      method: 'GET',
      credentials: 'include',
      headers: { Authorization: 'Bearer test-access-token' },
    });
    expect(file.filename).toBe('DiMuonVeSom_2026_10.' + (format === 'pdf' ? 'pdf' : 'xlsx'));
    expect(await file.blob.text()).toBe('binary');
  },
);
it('supports same-origin APIs and server UTF-8 filenames', async () => {
  const filename = 'Đi muộn tháng 10.pdf';
  const fetchMock = setup(
    new Response('binary', {
      headers: {
        'Content-Disposition': `attachment; filename="report.pdf"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      },
    }),
  );
  vi.stubEnv('VITE_API_URL', '/graphql');
  const file = await exportLateEarlyReport({ ...filter, ten: null, maBoPhan: null }, 'pdf');
  expect(fetchMock.mock.calls[0][0].origin).toBe('https://frontend.example.com');
  expect(file.filename).toBe(filename);
  expect(Object.fromEntries(fetchMock.mock.calls[0][0].searchParams)).toEqual({
    thang: '10',
    nam: '2026',
  });
});
it('keeps a safe fallback for malformed encoded filenames', async () => {
  setup(
    new Response('binary', {
      headers: {
        'Content-Disposition': `attachment; filename="folder/report.xlsx"; filename*=UTF-8''%ZZ`,
      },
    }),
  );
  expect((await exportLateEarlyReport(filter, 'excel')).filename).toBe('folder_report.xlsx');
});
it('exposes unauthorized responses to the session-refresh wrapper and rejects JSON errors and empty files', async () => {
  setup(new Response(null, { status: 401 }));
  await expect(exportLateEarlyReport(filter, 'pdf')).rejects.toBeInstanceOf(ApiError);
  setup(Response.json({ code: 'REPORT_EXPORT_TOO_MANY_ROWS' }, { status: 413 }));
  await expect(exportLateEarlyReport(filter, 'excel')).rejects.toThrow(
    'REPORT_EXPORT_TOO_MANY_ROWS',
  );
  setup(Response.json({ message: 'Không thể xuất.' }));
  await expect(exportLateEarlyReport(filter, 'pdf')).rejects.toThrow('Không thể xuất.');
  setup(new Response(null));
  await expect(exportLateEarlyReport(filter, 'pdf')).rejects.toThrow('trống');
  setup(
    new Response('<html>Error</html>', { status: 502, headers: { 'content-type': 'text/html' } }),
  );
  await expect(exportLateEarlyReport(filter, 'excel')).rejects.toThrow('HTTP 502');
});
