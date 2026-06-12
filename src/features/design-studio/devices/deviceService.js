import apiClient from '../../../api/client';
import { DEVICES } from '../../../api/endpoints';
const deviceService = { list: (b, f, r, p) => apiClient.get(DEVICES.LIST(b, f, r), { params: p }).then((res) => res.data), detail: (b, f, r, d) => apiClient.get(DEVICES.DETAIL(b, f, r, d)).then((res) => res.data), create: (b, f, r, d) => apiClient.post(DEVICES.CREATE(b, f, r), d).then((res) => res.data), update: (b, f, r, d, data) => apiClient.put(DEVICES.UPDATE(b, f, r, d), data).then((res) => res.data), delete: (b, f, r, d) => apiClient.delete(DEVICES.DELETE(b, f, r, d)).then((res) => res.data), getConfig: (d) => apiClient.get(DEVICES.CONFIG(d)).then((res) => res.data) };
export default deviceService;
