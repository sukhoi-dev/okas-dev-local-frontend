import apiClient from '../../../api/client';
const dashboardService = {
  getStats: () => apiClient.get('/dashboard/stats').then((r) => r.data),
};
export default dashboardService;
