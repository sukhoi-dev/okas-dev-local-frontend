import apiClient from '../../../api/client';
import { ROLES_PERMISSIONS } from '../../../api/endpoints';
const rolesService = { listRoles: () => apiClient.get(ROLES_PERMISSIONS.ROLES_LIST).then((r) => r.data), listPermissions: () => apiClient.get(ROLES_PERMISSIONS.PERMISSIONS_LIST).then((r) => r.data), assign: (d) => apiClient.post(ROLES_PERMISSIONS.ASSIGN, d).then((r) => r.data) };
export default rolesService;
