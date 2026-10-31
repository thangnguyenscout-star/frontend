import { computed, reactive, ref } from 'vue';
import {
  getAttendanceDevices,
  type AttendanceDevice,
} from '@/services/modules/attendance-device.service';
import { getApiErrorMessage } from '@/utils/error-message';
import { defineStore } from 'pinia';
import { createSyncFixtures } from './sync.fixtures';
import {
  demoKey,
  existingKeys,
  localTimestamp,
  MOCK_USERS,
  parseTextFixture,
  validLocalTimestamp,
} from './sync.utils';
import type { PreviewRow, MockBatch, SyncFilters } from './sync.types';
export const useAttendanceSyncMock = defineStore('attendance-sync-prototype', () => {
  const initial = createSyncFixtures();
  const logs = ref(initial.logs),
    devices = ref<AttendanceDevice[]>([]),
    batches = ref(initial.batches),
    errors = ref(initial.errors),
    rawStatuses = ref(initial.rawStatuses),
    loading = ref(false);
  const devicesLoading = ref(false),
    devicesError = ref(''),
    devicesLoaded = ref(false);
  let devicesRequest: Promise<void> | null = null;
  async function loadDevices(force = false): Promise<void> {
    if (devicesRequest) return devicesRequest;
    if (devicesLoaded.value && !force) return;
    devicesLoading.value = true;
    devicesError.value = '';
    devicesRequest = (async () => {
      try {
        devices.value = await getAttendanceDevices();
        devicesLoaded.value = true;
        if (filters.device !== null && !devices.value.some((d) => d.maThietBi === filters.device))
          filters.device = null;
      } catch (error) {
        devices.value = [];
        devicesLoaded.value = false;
        devicesError.value = getApiErrorMessage(error);
      } finally {
        devicesLoading.value = false;
        devicesRequest = null;
      }
    })();
    return devicesRequest;
  }
  const filters = reactive<SyncFilters>({
    from: '2026-10-01',
    to: '2026-10-20',
    device: null,
    search: '',
    source: '',
    event: '',
    mapping: '',
    batch: null,
  });
  const rangeError = computed(() =>
    filters.from && filters.to && filters.from > filters.to
      ? 'Từ ngày phải trước hoặc bằng đến ngày.'
      : '',
  );
  const filteredLogs = computed(() =>
    rangeError.value
      ? []
      : logs.value.filter((row) => {
          const day = row.thoiGianQuet.slice(0, 10),
            q = filters.search.trim().toLowerCase();
          return (
            (!filters.from || day >= filters.from) &&
            (!filters.to || day <= filters.to) &&
            (filters.device === null || row.maThietBi === filters.device) &&
            (!q ||
              [row.maNhanVien, row.maNguoiDungMay].some((v) =>
                (v || '').trim().toLowerCase().includes(q),
              )) &&
            (!filters.source || row.nguon === filters.source) &&
            (!filters.event || row.loaiSuKien === filters.event) &&
            (!filters.mapping ||
              (filters.mapping === 'unmapped' ? !row.maNhanVien : !!row.maNhanVien)) &&
            (filters.batch === null || row.dotDongBoId === filters.batch)
          );
        }),
  );
  const relevantErrors = computed(() =>
    errors.value.filter((error) => {
      const batch = batches.value.find((row) => row.id === error.dotDongBoId);
      const day = batch?.batDau.slice(0, 10) || '';
      return (
        (!filters.from || day >= filters.from) &&
        (!filters.to || day <= filters.to) &&
        (filters.device === null || batch?.maThietBi === filters.device) &&
        (filters.batch === null || error.dotDongBoId === filters.batch)
      );
    }),
  );
  const summary = computed(() => ({
    total: filteredLogs.value.length,
    today: filteredLogs.value.filter((row) =>
      row.thoiGianQuet.startsWith(localTimestamp().slice(0, 10)),
    ).length,
    unmapped: filteredLogs.value.filter((row) => !row.maNhanVien).length,
    errors: rangeError.value
      ? 0
      : relevantErrors.value.filter((row) => row.trangThai === 'NEW').length,
  }));
  const logsByBatch = (id: number) => logs.value.filter((row) => row.dotDongBoId === id);
  const errorsByBatch = (id: number) => errors.value.filter((row) => row.dotDongBoId === id);
  function clearFilters() {
    Object.assign(filters, {
      from: '',
      to: '',
      device: null,
      search: '',
      source: '',
      event: '',
      mapping: '',
      batch: null,
    });
  }
  function resetDemoData() {
    if (loading.value) return;
    const next = createSyncFixtures();
    logs.value = next.logs;
    batches.value = next.batches;
    errors.value = next.errors;
    rawStatuses.value = next.rawStatuses;
    clearFilters();
  }
  function previewText(
    text: string,
    format: 'csv' | 'dat',
    header: boolean,
    device: number | null,
  ) {
    return parseTextFixture(
      text,
      format,
      header,
      device,
      existingKeys(logs.value, rawStatuses.value),
    );
  }
  function addRows(rows: PreviewRow[], device: number | null, batch: MockBatch) {
    const seen = existingKeys(logs.value, rawStatuses.value);
    let nextLog = Math.max(0, ...logs.value.map((r) => r.id)) + 1,
      nextError = Math.max(0, ...errors.value.map((r) => r.id)) + 1;
    for (const row of rows) {
      let status = row.status;
      const key = demoKey(device, row.user, row.time, row.rawStatus);
      if (status !== 'error' && seen.has(key)) status = 'duplicate';
      if (status === 'error') batch.soLoi++;
      else if (status === 'duplicate') batch.soTrung++;
      else {
        const id = nextLog++;
        logs.value.push({
          id,
          thoiGianQuet: row.time,
          maThietBi: device,
          maNguoiDungMay: row.user.trim(),
          maNhanVien: MOCK_USERS[row.user.trim()] || null,
          nguon: 'D',
          loaiSuKien: 'U',
          maSuKienNguon: null,
          maYeuCauBoSung: null,
          lyDo: 'Giả lập; raw status fixture: ' + row.rawStatus,
          createdBy: 'HR_DEMO',
          createdAt: localTimestamp(),
          dotDongBoId: batch.id,
        });
        rawStatuses.value[id] = row.rawStatus;
        batch.soMoi++;
        seen.add(key);
      }
      if (status !== 'valid')
        errors.value.push({
          id: nextError++,
          dotDongBoId: batch.id,
          soDong: row.line,
          maNguoiDungMay: row.user || null,
          duLieuGoc: row.raw,
          maLoi:
            status === 'duplicate'
              ? 'DUPLICATE'
              : status === 'unmapped'
                ? 'UNMAPPED_USER'
                : row.errorCode || 'OTHER',
          noiDung:
            status === 'duplicate' ? 'Trùng theo heuristic UI; không thêm log mẫu.' : row.message,
          trangThai: 'NEW',
        });
    }
  }
  function newBatch(method: MockBatch['phuongThuc'], device: number | null, file?: string) {
    const batch: MockBatch = {
      id: Math.max(0, ...batches.value.map((b) => b.id)) + 1,
      maThietBi: device,
      phuongThuc: method,
      batDau: localTimestamp(),
      ketThuc: null,
      tongBanGhi: 0,
      soMoi: 0,
      soTrung: 0,
      soLoi: 0,
      trangThai: 'RUNNING',
      nguoiThucHien: 'HR_DEMO',
      ...(file ? { tenFile: file } : {}),
    };
    batches.value.unshift(batch);
    return batches.value[0];
  }
  function finish(batch: MockBatch) {
    batch.ketThuc = localTimestamp();
    batch.trangThai =
      batch.soLoi === batch.tongBanGhi && batch.tongBanGhi > 0
        ? 'FAILED'
        : batch.soLoi || errorsByBatch(batch.id).some((e) => e.maLoi === 'UNMAPPED_USER')
          ? 'PARTIAL'
          : 'SUCCESS';
  }
  async function simulateFileImport(
    rows: PreviewRow[],
    device: number | null,
    method: 'DAT' | 'CSV' | 'EXCEL',
    filename: string,
  ) {
    if (loading.value) throw new Error('Đang chạy mô phỏng khác.');
    if (!rows.length) throw new Error('Chưa có dữ liệu preview.');
    loading.value = true;
    const batch = newBatch(method, device, filename);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      batch.tongBanGhi = rows.length;
      addRows(rows, device, batch);
      finish(batch);
      return batch;
    } finally {
      loading.value = false;
    }
  }
  async function simulateDeviceSync(deviceId: number | null, from: string, to: string) {
    if (loading.value) throw new Error('Đang chạy mô phỏng khác.');
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(from) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(to) ||
      from > to ||
      !validLocalTimestamp(from + 'T00:00:00') ||
      !validLocalTimestamp(to + 'T00:00:00')
    )
      throw new Error('Vui lòng chọn khoảng ngày hợp lệ.');
    const start = Date.parse(from + 'T12:00:00Z'),
      end = Date.parse(to + 'T12:00:00Z'),
      days = (end - start) / 86400000 + 1;
    if (!Number.isFinite(days) || days > 366) throw new Error('Khoảng mô phỏng tối đa 366 ngày.');
    const selected = devices.value.filter(
      (d) => (deviceId === null || d.maThietBi === deviceId) && d.isActive,
    );
    if (!selected.length) throw new Error('Không có máy đang hoạt động được chọn để mô phỏng.');
    loading.value = true;
    const batch = newBatch('DEVICE', deviceId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 450));
      for (const device of selected) {
        const text: string[] = [];
        for (let i = 0; i < days; i++) {
          const day = new Date(start + i * 86400000).toISOString().slice(0, 10);
          for (const user of ['1007', '1008'])
            for (const [time, status] of [
              ['07:54:00', '0'],
              ['17:02:00', '1'],
            ])
              text.push([String(device.maThietBi), user, status, day + ' ' + time, '0'].join('\t'));
        }
        const preview = previewText(text.join('\n'), 'dat', false, device.maThietBi);
        batch.tongBanGhi += preview.length;
        addRows(preview, device.maThietBi, batch);
      }
      finish(batch);
      return batch;
    } finally {
      loading.value = false;
    }
  }
  return {
    logs,
    devices,
    devicesLoading,
    devicesError,
    devicesLoaded,
    loadDevices,
    batches,
    errors,
    rawStatuses,
    filters,
    filteredLogs,
    summary,
    rangeError,
    loading,
    logsByBatch,
    errorsByBatch,
    clearFilters,
    resetDemoData,
    previewText,
    simulateDeviceSync,
    simulateFileImport,
  };
});
