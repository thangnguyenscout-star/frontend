import { usePermission } from './usePermission';
export type ContractPermission =
  'HOPDONG_VIEW' | 'HOPDONG_CREATE' | 'HOPDONG_STATUS_UPDATE' | 'NHANVIEN_CREATE';
export function useContractPermission() {
  const permission = usePermission();
  // The current session exposes roles only. Keep the existing role policy until
  // the authentication API supplies permission claims; backend enforces authorization.
  const mapping: Record<ContractPermission, [string, string]> = {
    HOPDONG_VIEW: ['contracts', 'view'],
    HOPDONG_CREATE: ['contracts', 'create'],
    HOPDONG_STATUS_UPDATE: ['contracts', 'approve'],
    NHANVIEN_CREATE: ['employees', 'create'],
  };
  return (code: ContractPermission) => permission.can(...mapping[code]);
}
