import apiClient from '../../../api/client';
import { SCENES } from '../../../api/endpoints';
const sceneService = { list: () => apiClient.get(SCENES.LIST).then((r) => r.data), detail: (id) => apiClient.get(SCENES.DETAIL(id)).then((r) => r.data), create: (d) => apiClient.post(SCENES.CREATE, d).then((r) => r.data), update: (id, d) => apiClient.put(SCENES.UPDATE(id), d).then((r) => r.data), delete: (id) => apiClient.delete(SCENES.DELETE(id)).then((r) => r.data), activate: (id) => apiClient.post(SCENES.ACTIVATE(id)).then((r) => r.data) };
export default sceneService;
