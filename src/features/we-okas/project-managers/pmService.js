import apiClient from '../../../api/client';
import { PROJECT_MANAGERS } from '../../../api/endpoints';
const pmService = { list: (p) => apiClient.get(PROJECT_MANAGERS.LIST, { params: p }).then((r) => r.data), detail: (id) => apiClient.get(PROJECT_MANAGERS.DETAIL(id)).then((r) => r.data), create: (d) => apiClient.post(PROJECT_MANAGERS.CREATE, d).then((r) => r.data), update: (id, d) => apiClient.put(PROJECT_MANAGERS.UPDATE(id), d).then((r) => r.data), delete: (id) => apiClient.delete(PROJECT_MANAGERS.DELETE(id)).then((r) => r.data) };
export default pmService;
