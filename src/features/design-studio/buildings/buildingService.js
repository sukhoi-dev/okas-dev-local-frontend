import apiClient from '../../../api/client';
import { BUILDINGS } from '../../../api/endpoints';
const buildingService = { list: (p) => apiClient.get(BUILDINGS.LIST, { params: p }).then((r) => r.data), detail: (id) => apiClient.get(BUILDINGS.DETAIL(id)).then((r) => r.data), create: (d) => apiClient.post(BUILDINGS.CREATE, d).then((r) => r.data), update: (id, d) => apiClient.put(BUILDINGS.UPDATE(id), d).then((r) => r.data), delete: (id) => apiClient.delete(BUILDINGS.DELETE(id)).then((r) => r.data), byProject: (pid) => apiClient.get(BUILDINGS.BY_PROJECT(pid)).then((r) => r.data) };
export default buildingService;
