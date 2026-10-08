import { getApiErrorMessage, getErrorMessage } from '@/utils/error-message';
import type { DocumentNode } from 'graphql';
import { employeeService } from './employee.service';
import { recruitmentService } from './recruitment.service';
import { apolloClient } from '@/services/graphql/apollo';
import {
  CONTRACT_LIST,
  GENERATE_CONTRACT_NUMBER,
  ALLOWANCE_CATALOG,
  CONTRACT_DETAIL,
  CONTRACT_EXPIRY,
  CREATE_CONTRACT,
  CHANGE_CONTRACT_STATUS,
} from '@/graphql/queries/contracts';
import {
  buildCreateContractInput,
  buildProbationContractInput,
  ContractApiError,
} from '@/utils/contract-api';
import type {
  ContractDto,
  AllowanceCatalogItem,
  ContractListInput,
  PageResult,
  ExpiringContract,
  CreateContractInput,
  ContractMutationResult,
} from '@/types/contract-api';

async function query<T>(document: DocumentNode, field: string, variables = {}): Promise<T> {
  const response = await apolloClient.query<Record<string, T>>({
    query: document,
    variables,
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  const result = response.data?.[field];
  if (result == null)
    throw new ContractApiError(
      field === 'thongTinHopDong'
        ? getErrorMessage('HOPDONG_NOT_FOUND')
        : 'Máy chủ không trả về dữ liệu hợp đồng.',
    );
  return result;
}
async function mutate<T>(
  document: DocumentNode,
  field: string,
  input: object,
): Promise<ContractMutationResult<T>> {
  const response = await apolloClient.mutate<Record<string, ContractMutationResult<T>>>({
    mutation: document,
    variables: { input },
    errorPolicy: 'none',
  });
  const result = response.data?.[field];
  if (!result) throw new ContractApiError('Máy chủ không trả về kết quả hợp đồng.');
  return {
    ...result,
    message: result.success
      ? result.message || 'Thao tác thành công.'
      : getApiErrorMessage(result.message),
  };
}
export const contractService = {
  async generateContractNumber(
    maLoaiHopDong: string,
    ngayKyHopDong: Date | string,
  ): Promise<string> {
    const number = await query<string>(GENERATE_CONTRACT_NUMBER, 'taoSoHopDongLaoDong', {
      maLoaiHopDong,
      ngayKyHopDong,
    });
    if (typeof number !== 'string' || !number.trim())
      throw new ContractApiError(getErrorMessage('HOPDONG_CREATE_FAILED'));
    return number.trim();
  },
  generateProbationContractNumber(): Promise<string> {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    // The API derives the numbering year from the signing date.
    return contractService.generateContractNumber('07001', formattedDate);
  },
  async getAllowanceCatalog(): Promise<AllowanceCatalogItem[]> {
    const result = await query<{
      isResults: boolean;
      message?: string;
      data?: AllowanceCatalogItem[];
    }>(ALLOWANCE_CATALOG, 'danhSachDanhMucPhuCap');
    if (!result.isResults)
      throw new ContractApiError(result.message || 'Không thể tải danh mục phụ cấp.');
    return result.data || [];
  },
  async getCatalogs(maBoPhan: string | null = null) {
    const [types, organization] = await Promise.all([
      employeeService.masterCodes('07'),
      recruitmentService.getCatalogs(maBoPhan),
    ]);
    return {
      types: types.map((item) => ({ value: item.maKey, label: item.tenGiaTri })),
      ...organization,
    };
  },
  getList: (input: ContractListInput) =>
    query<PageResult<ContractDto>>(CONTRACT_LIST, 'danhSachHopDong', { input }),
  getById: (id: string) => query<ContractDto>(CONTRACT_DETAIL, 'thongTinHopDong', { id }),
  getExpiringContracts: () =>
    query<{ totalRecords: number; items: ExpiringContract[] }>(
      CONTRACT_EXPIRY,
      'kiemTraThoiHanHopDong',
    ),
  create: (input: CreateContractInput) =>
    mutate<Pick<ContractDto, 'id' | 'maNhanVien' | 'soHopDongLaoDong' | 'trangThaiHopDong'>>(
      CREATE_CONTRACT,
      'createHopDong',
      buildCreateContractInput(input),
    ),
  changeStatus: (id: string, trangThaiMoi: string, ghiChu?: string) =>
    mutate<Pick<ContractDto, 'id' | 'trangThaiHopDong'>>(
      CHANGE_CONTRACT_STATUS,
      'chuyenTrangThaiHopDong',
      { id, trangThaiMoi: trangThaiMoi.trim(), ghiChu: ghiChu?.trim() || undefined },
    ),
  async createProbationFromRecruitment(input: CreateContractInput, recruitmentId: string) {
    const record = await recruitmentService.getDetail(recruitmentId);
    return contractService.create(buildProbationContractInput(input, record));
  },
};
