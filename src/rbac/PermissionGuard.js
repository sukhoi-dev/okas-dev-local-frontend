import { usePermission, useAnyPermission, useAllPermissions } from './usePermission';

export default function PermissionGuard({ permission, any, all, fallback = null, children }) {
  const hasSingle = usePermission(permission || '');
  const hasAny    = useAnyPermission(any || []);
  const hasAll    = useAllPermissions(all || []);
  if (permission && !hasSingle) return fallback;
  if (any?.length  && !hasAny)  return fallback;
  if (all?.length  && !hasAll)  return fallback;
  return children;
}
