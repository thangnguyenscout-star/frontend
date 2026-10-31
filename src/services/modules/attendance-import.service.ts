import { gql } from '@apollo/client/core';
import { apolloClient } from '@/services/graphql/apollo';
import type { AttendanceRowsRequest, AttendanceFrontendRow } from '@/modules/attendance-sync/sync.types';

export interface AttendanceInsertError {
  line: number;
  maLoi: string;
}

export interface AttendanceInsertResult {
  trangThai: string;
  tongBanGhi: number;
  soBanGhiMoi: number;
  soBanGhiTrung: number;
  soBanGhiLoi: number;
  soBanGhiChuaMapping: number;
  loi: AttendanceInsertError[];
}

export class AttendanceImportBatchError extends Error {
  constructor(message: string, readonly partialResult: AttendanceInsertResult) {
    super(message);
    this.name = 'AttendanceImportBatchError';
  }
}

const BATCH_SIZE = 2000;
const INSERT_ATTENDANCE_BATCH = gql`
  mutation GhiNhanMayChamCongTheoLo($rows: [AttendanceFrontendRowInput!]!) {
    ghiNhanMayChamCongTheoLo(rows: $rows) {
      isResults
      message
      data {
        trangThai
        tongBanGhi
        soBanGhiMoi
        soBanGhiTrung
        soBanGhiLoi
        soBanGhiChuaMapping
        loi { line maLoi }
      }
    }
  }
`;

function emptyResult(): AttendanceInsertResult {
  return {
    trangThai: 'SUCCESS', tongBanGhi: 0, soBanGhiMoi: 0, soBanGhiTrung: 0,
    soBanGhiLoi: 0, soBanGhiChuaMapping: 0, loi: [],
  };
}

function parseAttendanceInsertResult(payload: unknown): AttendanceInsertResult {
  const wrapped = payload as { data?: unknown; isResults?: boolean; message?: string } | null;
  if (wrapped?.isResults === false)
    throw new Error(wrapped.message || 'Server từ chối yêu cầu import.');
  const value = (wrapped?.data ?? payload) as Record<string, unknown> | null;
  if (!value || typeof value !== 'object')
    throw new Error('Phản hồi GraphQL import không đúng định dạng AttendanceInsertResult.');

  const counts = ['tongBanGhi', 'soBanGhiMoi', 'soBanGhiTrung', 'soBanGhiLoi', 'soBanGhiChuaMapping']
    .map((key) => value[key]);
  const loi = value.loi;
  if (typeof value.trangThai !== 'string' ||
      counts.some((count) => typeof count !== 'number' || !Number.isInteger(count) || count < 0) ||
      !Array.isArray(loi) || loi.some((item) => {
        const error = item as Record<string, unknown>;
        return !Number.isInteger(error.line) || (error.line as number) < 0 || typeof error.maLoi !== 'string';
      }))
    throw new Error('Phản hồi GraphQL import thiếu trường hoặc sai kiểu dữ liệu.');

  return value as unknown as AttendanceInsertResult;
}

function mergeResult(total: AttendanceInsertResult, batch: AttendanceInsertResult): void {
  total.tongBanGhi += batch.tongBanGhi;
  total.soBanGhiMoi += batch.soBanGhiMoi;
  total.soBanGhiTrung += batch.soBanGhiTrung;
  total.soBanGhiLoi += batch.soBanGhiLoi;
  total.soBanGhiChuaMapping += batch.soBanGhiChuaMapping;
  total.loi.push(...batch.loi);
  total.trangThai = total.soBanGhiLoi > 0
    ? (total.soBanGhiMoi + total.soBanGhiTrung > 0 ? 'PARTIAL' : 'FAILED')
    : 'SUCCESS';
}

export async function startAttendanceImport(
  request: AttendanceRowsRequest,
): Promise<AttendanceInsertResult> {
  const rowsToImport = request.rows.filter((row) => row.status === 'VALID');
  if (!rowsToImport.length) throw new Error('Không có dòng hợp lệ để lưu vào database.');
  if (rowsToImport.some((row) => !Number.isInteger(row.line) || row.line < 1 || !Number.isInteger(row.machineNo)))
    throw new Error('Dữ liệu dòng DAT không đúng contract AttendanceFrontendRow.');

  const batches = Math.ceil(rowsToImport.length / BATCH_SIZE);
  const total = emptyResult();
  for (let index = 0; index < batches; index++) {
    const rows: AttendanceFrontendRow[] = rowsToImport.slice(index * BATCH_SIZE, (index + 1) * BATCH_SIZE);
    try {
      const response = await apolloClient.mutate({
        mutation: INSERT_ATTENDANCE_BATCH,
        variables: { rows },
        errorPolicy: 'none',
      });
      const payload = (response.data as Record<string, unknown> | null)?.ghiNhanMayChamCongTheoLo;
      const result = parseAttendanceInsertResult(payload);
      mergeResult(total, result);
      // A database error is returned as a complete batch result; stop so later batches are not hidden behind it.
      if (result.trangThai === 'FAILED')
        throw new Error('Server không ghi được lô dữ liệu này.');
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Lỗi mạng không xác định.';
      throw new AttendanceImportBatchError(
        `Lỗi ở lô ${index + 1}/${batches}; các lô trước đã phản hồi: ${total.soBanGhiMoi} mới, ${total.soBanGhiTrung} trùng. ${detail}`,
        total,
      );
    }
  }
  return total;
}
