export interface Filter {
  thang: number;
  nam: number;
  maBoPhan: string | null;
  maNhanVien: string | null;
}
export interface Employee {
  maNhanVien: string;
  ho?: string | null;
  tenDem?: string | null;
  ten?: string | null;
  hoTen?: string | null;
  maBoPhan?: string | null;
  tenBoPhan?: string | null;
}
export interface MonthRow extends Employee {
  [key: string]: string | number | boolean | null | undefined;
  thang: number;
  nam: number;
  tuNgay?: string | null;
  denNgay?: string | null;
  trangThai?: string | null;
  ngayChot?: string | null;
}
export interface DayRow extends Employee {
  thang: number;
  nam: number;
  tuNgay?: string | null;
  denNgay?: string | null;
  trangThai?: string | null;
  ngayChot?: string | null;
  maCa?: string | null;
  kyHieuCa?: string | null;
  ngayChamCong: string;
  gioVao?: string | null;
  gioRa?: string | null;
  soPhutLamViec?: number | null;
  soGioLamViec?: number | null;
  maLoaiNghiPhep?: string | null;
  laNgayLe?: boolean | null;
  hienThiCa?: string | null;
  trangThaiCong?: string | null;
  ngayNghiPhep?: number | null;
  ngayNghiHuongLuong?: number | null;
  nghiLe?: number | null;
  ngayNghiKhongHuongLuong?: number | null;
  otNgayLe?: number | null;
  otNgayThuong?: number | null;
}
export type Calculation = 'batch' | 'month' | 'person';
export interface CalculationContext {
  filter: Filter;
  employee?: Employee;
  day?: DayRow;
  kyChamCongId?: string | number;
}
export interface CalculationResult {
  returnCode: number | string | null;
  thongKe: Record<string, number | string | null> | null;
  resultSets: { columns: unknown; rows: unknown }[] | null;
}
export interface TypeRef {
  kind: string;
  name: string | null;
  ofType?: TypeRef | null;
}
export interface InputField {
  name: string;
  type: TypeRef;
  defaultValue?: string | null;
}
export interface PreparedCalculation {
  kind: Calculation;
  context: CalculationContext;
  input: Record<string, unknown>;
  inputType: string;
  scope: string[];
}
