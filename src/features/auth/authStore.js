import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import env from '../../config/env';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      login: (user, accessToken, refreshToken) => {
        localStorage.setItem(env.AUTH_TOKEN_KEY, accessToken);
        localStorage.setItem(env.REFRESH_TOKEN_KEY, refreshToken);
        set({ user, accessToken, isAuthenticated: true, error: null });
      },
      logout: () => {
        localStorage.removeItem(env.AUTH_TOKEN_KEY);
        localStorage.removeItem(env.REFRESH_TOKEN_KEY);
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'okas-auth',
      partialize: (s) => ({ user: s.user, accessToken: s.accessToken, isAuthenticated: s.isAuthenticated }),
    }
  )
);

export default useAuthStore;
