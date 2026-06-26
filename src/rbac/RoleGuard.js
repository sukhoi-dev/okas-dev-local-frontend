import { useHasRole } from './useRole';

export default function RoleGuard({ roles, fallback = null, children }) {
  return useHasRole(roles) ? children : fallback;
}
