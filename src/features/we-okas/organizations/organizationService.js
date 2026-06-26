import apiClient from '../../../api/client';
import { ORGANIZATIONS } from '../../../api/endpoints';
const organizationService = { list: (p) => apiClient.get(ORGANIZATIONS.LIST, { params: p }).then((r) => r.data), detail: (id) => apiClient.get(ORGANIZATIONS.DETAIL(id)).then((r) => r.data), create: (d) => apiClient.post(ORGANIZATIONS.CREATE, d).then((r) => r.data), update: (id, d) => apiClient.put(ORGANIZATIONS.UPDATE(id), d).then((r) => r.data), delete: (id) => apiClient.delete(ORGANIZATIONS.DELETE(id)).then((r) => r.data) };
export default organizationService;
