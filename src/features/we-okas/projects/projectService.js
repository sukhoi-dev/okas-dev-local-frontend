import apiClient from '../../../api/client';
import { PROJECTS } from '../../../api/endpoints';
const projectService = {
  list: (p) => apiClient.get(PROJECTS.LIST, { params: p }).then((r) => r.data),
  detail: (id) => apiClient.get(PROJECTS.DETAIL(id)).then((r) => r.data),
  create: (d) => apiClient.post(PROJECTS.CREATE, d).then((r) => r.data),
  update: (id, d) => apiClient.put(PROJECTS.UPDATE(id), d).then((r) => r.data),
  delete: (id) => apiClient.delete(PROJECTS.DELETE(id)).then((r) => r.data),
};
export default projectService;
