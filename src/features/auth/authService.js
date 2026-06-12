import apiClient from '../../api/client';
import { AUTH } from '../../api/endpoints';

const authService = {
  login: (data) => apiClient.post(AUTH.LOGIN, data).then((r) => r.data),
  logout: () => apiClient.post(AUTH.LOGOUT),
  getMe: () => apiClient.get(AUTH.ME).then((r) => r.data),
  forgotPassword: (email) => apiClient.post(AUTH.FORGOT_PASSWORD, { email }).then((r) => r.data),
  resetPassword: (data) => apiClient.post(AUTH.RESET_PASSWORD, data).then((r) => r.data),
};

export default authService;
