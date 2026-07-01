import apiClient from '../../../../api/client';
import useAuthStore from '../../../auth/authStore';

const projectService = {
  getProjects: () => {
    const user = useAuthStore.getState().user;
    const params = user?.organization_id ? { organisation_id: user.organization_id } : {};
    return apiClient.get('/we-okas/projects', { params }).then((r) => r.data);
  },
  getProject: (id) => apiClient.get(`/we-okas/projects/${id}`).then((r) => r.data),
  createProject: (payload) => apiClient.post('/we-okas/projects', payload).then((r) => r.data),
  updateProject: (id, payload) => apiClient.patch(`/we-okas/projects/${id}`, payload).then((r) => r.data),
  getMembers: () => apiClient.get('/we-okas/members').then((r) => r.data),
  getMember: (memberId) => apiClient.get(`/we-okas/members/${memberId}`).then((r) => r.data),
};

export default projectService;
