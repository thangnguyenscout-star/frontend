import { gql } from '@apollo/client/core';
import { apolloClient } from '@/services/graphql/apollo';
import { ApiError } from '@/services/api/apiErrorHandler';
import { privateApi } from '@/services/api/privateApi';
import { tokenService } from '@/services/auth/token.service';
import { listPeriods, exactPeriodId } from '@/modules/attendance-periods/period.service';
import { usePermissionStore } from '@/stores/permission.store';
import { dateKey, displayDate, fullName, indexAttendance } from './monthly.utils';
import type {
  Calculation,
  CalculationContext,
  CalculationResult,
  DayRow,
  Filter,
  InputField,
  MonthRow,
  PreparedCalculation,
  TypeRef,
} from './monthly.types';
interface Envelope<T> {
  isResults: boolean;
  message?: string | null;
  data: T | null;
}
function unwrap<T>(result?: Envelope<T> | null): T {
  if (result?.isResults !== true || result.data == null)
    throw new Error(result?.message || 'Không nhận được dữ liệu chấm công hợp lệ.');
  return result.data;
}
const employeeFields = 'maNhanVien ho tenDem ten maBoPhan tenBoPhan';
const periodFields = 'thang nam tuNgay denNgay trangThai ngayChot';
const monthFields =
  employeeFields +
  ' ' +
  periodFields +
  ' ngaySinh gioiTinh soNgayCoDuLieuCong soNgayDuLog soNgayKhongLog soNgayCoCong tongSoPhutLamViecThucTe tongSoPhutDiTre tongSoPhutVeSom soNgayDiTre soNgayVeSom tongSoPhutTangCa soNgayQuaDem tongCongHopLe tongNgayNghi tongNgayNghiCoLuong tongNgayNghiKhongLuong tongCongHuongLuong';
const dayFields =
  employeeFields +
  ' ' +
  periodFields +
  ' maCa kyHieuCa ngayChamCong gioVao gioRa soPhutLamViec soGioLamViec maLoaiNghiPhep laNgayLe hienThiCa trangThaiCong ngayNghiPhep ngayNghiHuongLuong nghiLe ngayNghiKhongHuongLuong otNgayLe otNgayThuong';
export function validateFilter(filter: Filter) {
  if (
    !Number.isInteger(filter.thang) ||
    filter.thang < 1 ||
    filter.thang > 12 ||
    !Number.isInteger(filter.nam) ||
    filter.nam < 100 ||
    filter.nam > 9998
  )
    throw new Error('Tháng hoặc năm không hợp lệ.');
}
export async function exportMonthlyAttendance(
  filter: Filter,
): Promise<{ blob: Blob; filename: string }> {
  validateFilter(filter);
  // REST uses the same backend origin as the configured GraphQL endpoint.
  const url = new URL(
    '/api/bang-cham-cong/export-excel',
    new URL(import.meta.env.VITE_API_URL || '/graphql', window.location.origin),
  );
  url.searchParams.set('thang', String(filter.thang));
  url.searchParams.set('nam', String(filter.nam));
  if (filter.maNhanVien) url.searchParams.set('manhanvien', filter.maNhanVien);
  if (filter.maBoPhan) url.searchParams.set('mabophan', filter.maBoPhan);
  const fallback = `BangChamCong_${filter.nam}_${String(filter.thang).padStart(2, '0')}.xlsx`;
  return privateApi(async () => {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${tokenService.get()}`,
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
    if (response.status === 401) throw new ApiError(401);
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || contentType.toLowerCase().includes('json')) {
      const payload = await response.json().catch(() => null);
      throw new Error(
        payload?.message ||
          payload?.detail ||
          payload?.title ||
          `Không thể xuất Excel (HTTP ${response.status}).`,
      );
    }
    const blob = await response.blob();
    if (!blob.size) throw new Error('Máy chủ trả về tệp Excel trống.');
    const disposition = response.headers.get('content-disposition') || '';
    const encoded = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(disposition)?.[1];
    const plain = /filename\s*=\s*(?:"([^"]+)"|([^;]+))/i.exec(disposition);
    let filename = plain?.[1] || plain?.[2]?.trim() || fallback;
    if (encoded) {
      try {
        filename = decodeURIComponent(encoded.trim());
      } catch {
        // Keep the plain filename or fallback if the encoded header is malformed.
      }
    }
    filename = filename.replace(/[/\\]/g, '_');
    return { blob, filename };
  });
}
function args(filter: Filter) {
  validateFilter(filter);
  return (
    'thang:' +
    filter.thang +
    ',nam:' +
    filter.nam +
    ',maBoPhan:' +
    JSON.stringify(filter.maBoPhan || null)
  );
}
// Validated numeric and JSON-escaped string literals avoid guessing custom GraphQL scalar names.
export async function getMonthlyAttendance(filter: Filter): Promise<MonthRow[]> {
  const { data } = await apolloClient.query<Record<string, Envelope<MonthRow[]>>>({
    query: gql(
      'query BangCongThang { bangCongThang(' +
        args(filter) +
        '){isResults message data{' +
        monthFields +
        '}}}',
    ),
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  const rows = unwrap(data?.bangCongThang);
  if (!Array.isArray(rows)) throw new Error('Báo cáo tháng không đúng định dạng.');
  return rows.filter(Boolean);
}
export async function getDailyAttendance(filter: Filter): Promise<DayRow[]> {
  const { data } = await apolloClient.query<Record<string, Envelope<DayRow[]>>>({
    query: gql(
      'query BangTongHopNgay { bangTongHopNgay(' +
        args(filter) +
        ',maNhanVien:' +
        JSON.stringify(filter.maNhanVien) +
        '){isResults message data{' +
        dayFields +
        '}}}',
    ),
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  const rows = unwrap(data?.bangTongHopNgay);
  if (!Array.isArray(rows)) throw new Error('Công ngày không đúng định dạng.');
  const clean = rows.filter(Boolean);
  indexAttendance(clean, filter.maNhanVien);
  return clean;
}
export const mutationNames: Record<Calculation, string> = {
  batch: 'tinhChamCongHangLoat',
  month: 'chamCongThang',
  person: 'tinhChamCongNgayTheoNhanVien',
};
export function typeName(type: TypeRef): string {
  if (type.kind === 'NON_NULL') return typeName(type.ofType!) + '!';
  if (type.kind === 'LIST') return '[' + typeName(type.ofType!) + ']';
  if (!type.name) throw new Error('Schema input không hợp lệ.');
  return type.name;
}
function baseType(type: TypeRef): string {
  return type.ofType ? baseType(type.ofType) : type.name || '';
}
const typeSelection =
  'kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name}}}}';
const contractCache = new Map<string, Promise<{ inputType: string; fields: InputField[] }>>();
async function loadContract(kind: Calculation) {
  const field = mutationNames[kind];
  let promise = contractCache.get(field);
  if (!promise) {
    promise = (async () => {
      const { data } = await apolloClient.query<{
        __schema: {
          mutationType: {
            fields: { name: string; args: InputField[] }[];
          } | null;
        };
      }>({
        query: gql(
          'query AttendanceMutationContract {__schema{mutationType{fields{name args{name defaultValue type{' +
            typeSelection +
            '}}}}}}',
        ),
        fetchPolicy: 'no-cache',
        errorPolicy: 'none',
      });
      const mutation = data?.__schema?.mutationType?.fields.find((f) => f.name === field);
      const input = mutation?.args.find((a) => a.name === 'input');
      if (!input) throw new Error('Máy chủ chưa cung cấp hợp đồng input cho ' + field + '.');
      if (
        mutation!.args.some(
          (a) => a.name !== 'input' && a.type.kind === 'NON_NULL' && a.defaultValue == null,
        )
      )
        throw new Error('Mutation có tham số bắt buộc ngoài input chưa được ánh xạ.');
      const name = baseType(input.type);
      const response = await apolloClient.query<{
        __type: { inputFields: InputField[] | null } | null;
      }>({
        query: gql(
          'query AttendanceInputFields($name:String!){__type(name:$name){inputFields{name defaultValue type{' +
            typeSelection +
            '}}}}',
        ),
        variables: { name },
        fetchPolicy: 'no-cache',
        errorPolicy: 'none',
      });
      const fields = response.data?.__type?.inputFields;
      if (!fields) throw new Error('Input chưa phải kiểu đối tượng được hỗ trợ.');
      return { inputType: typeName(input.type), fields };
    })().catch((error) => {
      contractCache.delete(field);
      throw error;
    });
    contractCache.set(field, promise);
  }
  return promise;
}
export function buildCalculationInput(
  kind: Calculation,
  context: CalculationContext,
  fields: InputField[],
): Record<string, unknown> {
  validateFilter(context.filter);
  const names = new Set(fields.map((f) => f.name));
  const { filter } = context;
  const dayName = ['ngayChamCong', 'ngayLamViec', 'ngay'].find((n) => names.has(n));
  if (
    kind === 'person' &&
    (!context.day ||
      !context.employee ||
      context.day.maNhanVien !== context.employee.maNhanVien ||
      !names.has('maNhanVien') ||
      !dayName)
  )
    throw new Error('Input chưa hỗ trợ đúng phạm vi nhân viên và ngày được chọn.');
  if (kind !== 'person' && filter.maNhanVien && !names.has('maNhanVien'))
    throw new Error(
      'API này không hỗ trợ lọc nhân viên. Hãy chọn Tất cả nhân viên trước khi tính.',
    );
  if (kind !== 'person' && filter.maBoPhan && !names.has('maBoPhan'))
    throw new Error(
      'API này không hỗ trợ bộ phận đang chọn. Hãy chọn Tất cả bộ phận trước khi tính.',
    );
  if (!names.has('kyChamCongId') && !(names.has('thang') && names.has('nam')))
    throw new Error('Input chưa có kỳ hoặc tháng/năm được hỗ trợ.');
  if (
    kind !== 'person' &&
    dayName &&
    fields.find((f) => f.name === dayName)?.type.kind === 'NON_NULL'
  )
    throw new Error(
      'API yêu cầu chọn ngày cho thao tác hàng loạt; cần bổ sung hợp đồng trước khi sử dụng.',
    );
  const values: Record<string, unknown> = {
    thang: filter.thang,
    nam: filter.nam,
    maBoPhan: filter.maBoPhan,
    maNhanVien: kind === 'person' ? context.employee!.maNhanVien : filter.maNhanVien,
    previewOnly: false,
    debug: false,
  };
  if (names.has('kyChamCongId')) {
    if (context.kyChamCongId == null) throw new Error('Chưa xác định được kỳ công.');
    const id = exactPeriodId(context.kyChamCongId);
    const scalar = baseType(fields.find((f) => f.name === 'kyChamCongId')!.type);
    if (scalar === 'ID' || scalar === 'String') values.kyChamCongId = id;
    else {
      const number = Number(id);
      if (!Number.isSafeInteger(number))
        throw new Error('ID kỳ vượt giới hạn số an toàn của input.');
      values.kyChamCongId = number;
    }
  }
  if (kind === 'person' && dayName) {
    const day = dateKey(context.day!.ngayChamCong);
    const row = context.day!;
    if ((row.tuNgay && day < dateKey(row.tuNgay)) || (row.denNgay && day > dateKey(row.denNgay)))
      throw new Error('Ngày nằm ngoài kỳ công.');
    const scalar = baseType(fields.find((f) => f.name === dayName)!.type);
    values[dayName] = scalar === 'DateTime' ? day + 'T00:00:00+07:00' : day;
  }
  const input: Record<string, unknown> = {};
  for (const field of fields) {
    if (
      Object.hasOwn(values, field.name) &&
      (values[field.name] != null || field.type.kind !== 'NON_NULL')
    )
      input[field.name] = values[field.name];
    else if (field.type.kind === 'NON_NULL' && field.defaultValue == null)
      throw new Error('Cần ánh xạ trường input bắt buộc: ' + field.name);
  }
  return input;
}
export async function prepareCalculation(
  kind: Calculation,
  context: CalculationContext,
): Promise<PreparedCalculation> {
  if (!usePermissionStore().can('attendance', 'update'))
    throw new Error('Bạn không có quyền tính công.');
  const snapshot: CalculationContext = JSON.parse(JSON.stringify(context));
  const contract = await loadContract(kind);
  const periods = await listPeriods({
    nam: snapshot.filter.nam,
    thang: snapshot.filter.thang,
    trangThai: null,
  });
  if (periods.length !== 1)
    throw new Error('Cần xác định chính xác một kỳ chấm công cho tháng đã chọn.');
  const period = periods[0];
  if (period.trangThai !== 'O') throw new Error('Chỉ tính công khi kỳ đang mở.');
  if (snapshot.day) {
    const day = dateKey(snapshot.day.ngayChamCong);
    if (day < dateKey(period.tuNgay) || day > dateKey(period.denNgay))
      throw new Error('Ngày được chọn nằm ngoài kỳ công.');
  }
  snapshot.kyChamCongId = period.id;
  const input = buildCalculationInput(kind, snapshot, contract.fields);
  const scope = [
    'Kỳ: ' + snapshot.filter.thang + '/' + snapshot.filter.nam,
    kind === 'person'
      ? 'Nhân viên: ' + fullName(snapshot.employee) + ' (' + snapshot.employee!.maNhanVien + ')'
      : 'Nhân viên: ' + (snapshot.filter.maNhanVien || 'Tất cả'),
    kind === 'person'
      ? 'Ngày: ' + displayDate(snapshot.day!.ngayChamCong)
      : 'Phạm vi: toàn kỳ đã chọn',
  ];
  if (kind !== 'person') scope.push('Bộ phận: ' + (snapshot.filter.maBoPhan || 'Tất cả'));
  return {
    kind,
    context: snapshot,
    input,
    inputType: contract.inputType,
    scope,
  };
}
export async function executeCalculation(
  plan: PreparedCalculation,
): Promise<{ message: string; data: CalculationResult }> {
  if (!usePermissionStore().can('attendance', 'update'))
    throw new Error('Bạn không có quyền tính công.');
  const periods = await listPeriods({
    nam: plan.context.filter.nam,
    thang: plan.context.filter.thang,
    trangThai: null,
  });
  if (
    periods.length !== 1 ||
    String(periods[0].id) !== String(plan.context.kyChamCongId) ||
    periods[0].trangThai !== 'O'
  )
    throw new Error('Kỳ công đã thay đổi hoặc không còn mở.');
  const field = mutationNames[plan.kind];
  const stats =
    plan.kind === 'month'
      ? 'thang nam kyChamCongId soNhanVienThemMoi soNhanVienCapNhat soNhanVienBoQuaDaKhoa'
      : (plan.kind === 'person' ? 'soDongBoQuaKhongCapNhat ' : '') +
        'tongDongTinh soDongThemMoi soDongCapNhat soDongThieuLog soDongNgayLe soDongNghiPhep';
  const { data } = await apolloClient.mutate<Record<string, Envelope<CalculationResult>>>({
    mutation: gql(
      'mutation AttendanceCalculate($input:' +
        plan.inputType +
        '){' +
        field +
        '(input:$input){isResults message data{returnCode thongKe{' +
        stats +
        '} resultSets{columns rows}}}}',
    ),
    variables: { input: plan.input },
    errorPolicy: 'none',
  });
  const result = data?.[field];
  const payload = unwrap(result);
  return {
    message: result?.message || 'Máy chủ đã trả kết quả xử lý.',
    data: payload,
  };
}
