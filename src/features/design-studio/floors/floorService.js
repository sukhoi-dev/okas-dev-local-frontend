import apiClient from '../../../api/client';
import { FLOORS } from '../../../api/endpoints';
const floorService = { list: (b, p) => apiClient.get(FLOORS.LIST(b), { params: p }).then((r) => r.data), detail: (b, f) => apiClient.get(FLOORS.DETAIL(b, f)).then((r) => r.data), create: (b, d) => apiClient.post(FLOORS.CREATE(b), d).then((r) => r.data), update: (b, f, d) => apiClient.put(FLOORS.UPDATE(b, f), d).then((r) => r.data), delete: (b, f) => apiClient.delete(FLOORS.DELETE(b, f)).then((r) => r.data) };
export default floorService;
