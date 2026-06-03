import env from '../config/env';
import { HTTP_STATUS } from '../config/constants';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

export function applyInterceptors(client) {
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem(env.AUTH_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  }, Promise.reject);

  client.interceptors.response.use(
    (res) => res,
    async (error) => {
      const orig = error.config;
      if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !orig._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
            .then((token) => { orig.headers.Authorization = `Bearer ${token}`; return client(orig); });
        }
        orig._retry = true;
        isRefreshing = true;
        const refresh = localStorage.getItem(env.REFRESH_TOKEN_KEY);
        if (!refresh) { window.location.href = '/auth/login'; return Promise.reject(error); }
        try {
          const { data } = await client.post('/auth/refresh', { refreshToken: refresh });
          localStorage.setItem(env.AUTH_TOKEN_KEY, data.accessToken);
          processQueue(null, data.accessToken);
          orig.headers.Authorization = `Bearer ${data.accessToken}`;
          return client(orig);
        } catch (e) {
          processQueue(e, null);
          localStorage.removeItem(env.AUTH_TOKEN_KEY);
          localStorage.removeItem(env.REFRESH_TOKEN_KEY);
          window.location.href = '/auth/login';
          return Promise.reject(e);
        } finally { isRefreshing = false; }
      }
      return Promise.reject(error);
    }
  );
}
