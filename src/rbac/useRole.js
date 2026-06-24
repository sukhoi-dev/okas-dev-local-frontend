import useAuthStore from '../features/auth/authStore';
import { ROLES } from '../config/constants';

export function useRole() { return useAuthStore((s) => s.user?.role); }
export function useIsAdmin() { return useRole() === ROLES.ADMIN; }
export function useIsDistributor() { return useRole() === ROLES.DISTRIBUTOR; }
export function useIsSI() { return useRole() === ROLES.SYSTEM_INTEGRATOR; }
export function useIsPM() { return useRole() === ROLES.PROJECT_MANAGER; }
export function useHasRole(roles) { return roles.includes(useRole()); }
