import apiClient from '../../../api/client';
import { ROOMS } from '../../../api/endpoints';
const roomService = { list: (b, f, p) => apiClient.get(ROOMS.LIST(b, f), { params: p }).then((r) => r.data), detail: (b, f, r) => apiClient.get(ROOMS.DETAIL(b, f, r)).then((res) => res.data), create: (b, f, d) => apiClient.post(ROOMS.CREATE(b, f), d).then((r) => r.data), update: (b, f, r, d) => apiClient.put(ROOMS.UPDATE(b, f, r), d).then((res) => res.data), delete: (b, f, r) => apiClient.delete(ROOMS.DELETE(b, f, r)).then((res) => res.data) };
export default roomService;
