import apiClient from '../../../api/client';
import { SCHEDULING } from '../../../api/endpoints';
const schedulingService = { list: () => apiClient.get(SCHEDULING.LIST).then((r) => r.data), create: (d) => apiClient.post(SCHEDULING.CREATE, d).then((r) => r.data), update: (id, d) => apiClient.put(SCHEDULING.UPDATE(id), d).then((r) => r.data), delete: (id) => apiClient.delete(SCHEDULING.DELETE(id)).then((r) => r.data) };
export default schedulingService;
