import apiClient from '../../../../api/client';

const projectService = {
  getProjects: () => apiClient.get('/we-okas/projects').then((r) => r.data),
  createProject: (payload) => apiClient.post('/we-okas/projects', payload).then((r) => r.data),
  updateProject: (id, payload) => apiClient.patch(`/we-okas/projects/${id}`, payload).then((r) => r.data),
  getMembers: () => apiClient.get('/we-okas/members').then((r) => r.data),
  getMember: (memberId) => apiClient.get(`/we-okas/members/${memberId}`).then((r) => r.data),
};

export default projectService;
