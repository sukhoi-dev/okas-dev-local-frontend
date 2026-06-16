import useAuthStore from '../features/auth/authStore';
import { roleHasPermission, roleHasAllPermissions, roleHasAnyPermission } from './roles';

export function usePermission(permission) {
  const role = useAuthStore((s) => s.user?.role);
  return role ? roleHasPermission(role, permission) : false;
}
export function useAllPermissions(permissions) {
  const role = useAuthStore((s) => s.user?.role);
  return role ? roleHasAllPermissions(role, permissions) : false;
}
export function useAnyPermission(permissions) {
  const role = useAuthStore((s) => s.user?.role);
  return role ? roleHasAnyPermission(role, permissions) : false;
}
