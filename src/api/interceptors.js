import env from '../config/env';
import { HTTP_STATUS } from '../config/constants';

export function applyInterceptors(client) {
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem(env.AUTH_TOKEN_KEY) || sessionStorage.getItem(env.AUTH_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  }, Promise.reject);

  client.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
        localStorage.removeItem(env.AUTH_TOKEN_KEY);
        localStorage.removeItem(env.REFRESH_TOKEN_KEY);
        localStorage.removeItem('okas-auth');
        sessionStorage.removeItem(env.AUTH_TOKEN_KEY);
        sessionStorage.removeItem(env.REFRESH_TOKEN_KEY);
        sessionStorage.removeItem('okas-auth');
        window.location.href = '/auth/login';
      }
      return Promise.reject(error);
    }
  );
}
