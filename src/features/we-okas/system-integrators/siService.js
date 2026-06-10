import apiClient from '../../../api/client';
import { SYSTEM_INTEGRATORS } from '../../../api/endpoints';
const siService = { list: (p) => apiClient.get(SYSTEM_INTEGRATORS.LIST, { params: p }).then((r) => r.data), detail: (id) => apiClient.get(SYSTEM_INTEGRATORS.DETAIL(id)).then((r) => r.data), create: (d) => apiClient.post(SYSTEM_INTEGRATORS.CREATE, d).then((r) => r.data), update: (id, d) => apiClient.put(SYSTEM_INTEGRATORS.UPDATE(id), d).then((r) => r.data), delete: (id) => apiClient.delete(SYSTEM_INTEGRATORS.DELETE(id)).then((r) => r.data) };
export default siService;
