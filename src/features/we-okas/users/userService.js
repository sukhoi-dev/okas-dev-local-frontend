import apiClient from '../../../api/client';
import { USERS } from '../../../api/endpoints';
const userService = { list: (p) => apiClient.get(USERS.LIST, { params: p }).then((r) => r.data), detail: (id) => apiClient.get(USERS.DETAIL(id)).then((r) => r.data), create: (d) => apiClient.post(USERS.CREATE, d).then((r) => r.data), update: (id, d) => apiClient.put(USERS.UPDATE(id), d).then((r) => r.data), delete: (id) => apiClient.delete(USERS.DELETE(id)).then((r) => r.data) };
export default userService;
