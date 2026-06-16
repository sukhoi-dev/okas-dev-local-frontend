import apiClient from '../../../api/client';
import { AUTOMATION } from '../../../api/endpoints';
const automationService = { list: () => apiClient.get(AUTOMATION.LIST).then((r) => r.data), detail: (id) => apiClient.get(AUTOMATION.DETAIL(id)).then((r) => r.data), create: (d) => apiClient.post(AUTOMATION.CREATE, d).then((r) => r.data), update: (id, d) => apiClient.put(AUTOMATION.UPDATE(id), d).then((r) => r.data), delete: (id) => apiClient.delete(AUTOMATION.DELETE(id)).then((r) => r.data) };
export default automationService;
