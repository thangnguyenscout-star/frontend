export type RecordValue = string | number;
export interface HrRecord {
  id: string;
  code: string;
  name: string;
  status: string;
  [key: string]: RecordValue;
}
export interface ListQuery {
  page: number;
  pageSize: number;
  search: string;
  filters: Record<string, string>;
  sortField: string;
  sortOrder: number;
}
export interface Page<T> {
  items: T[];
  total: number;
  all: T[];
}
export interface Field {
  key: string;
  kind?: 'text' | 'number' | 'date' | 'select' | 'email' | 'textarea';
  options?: string[];
  required?: boolean;
}
export interface ModuleDefinition {
  key: string;
  icon: string;
  group: string;
  columns: string[];
  fields: Field[];
  detailTabs?: string[];
}
export interface HistoryEntry {
  date: string;
  action: string;
  code: string;
}
