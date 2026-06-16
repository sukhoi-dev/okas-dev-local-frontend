import apiClient from '../../../api/client';
import { DISTRIBUTORS } from '../../../api/endpoints';
const distributorService = { list: (p) => apiClient.get(DISTRIBUTORS.LIST, { params: p }).then((r) => r.data), detail: (id) => apiClient.get(DISTRIBUTORS.DETAIL(id)).then((r) => r.data), create: (d) => apiClient.post(DISTRIBUTORS.CREATE, d).then((r) => r.data), update: (id, d) => apiClient.put(DISTRIBUTORS.UPDATE(id), d).then((r) => r.data), delete: (id) => apiClient.delete(DISTRIBUTORS.DELETE(id)).then((r) => r.data) };
export default distributorService;
