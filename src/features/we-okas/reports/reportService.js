import apiClient from '../../../api/client';
import { REPORTS } from '../../../api/endpoints';
const reportService = { list: () => apiClient.get(REPORTS.LIST).then((r) => r.data), generate: (d) => apiClient.post(REPORTS.GENERATE, d).then((r) => r.data), export: (id) => apiClient.get(REPORTS.EXPORT(id), { responseType: 'blob' }) };
export default reportService;
