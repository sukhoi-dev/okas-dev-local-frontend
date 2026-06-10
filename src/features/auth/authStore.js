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
      keepLoggedIn: false,
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      login: (user, accessToken, refreshToken, keepLoggedIn = false) => {
        if (keepLoggedIn) {
          localStorage.setItem(env.AUTH_TOKEN_KEY, accessToken);
          sessionStorage.removeItem(env.AUTH_TOKEN_KEY);
        } else {
          sessionStorage.setItem(env.AUTH_TOKEN_KEY, accessToken);
          localStorage.removeItem(env.AUTH_TOKEN_KEY);
        }
        set({ user, accessToken, isAuthenticated: true, error: null, keepLoggedIn });
      },
      logout: () => {
        localStorage.removeItem(env.AUTH_TOKEN_KEY);
        localStorage.removeItem(env.REFRESH_TOKEN_KEY);
        localStorage.removeItem('okas-auth');
        sessionStorage.removeItem(env.AUTH_TOKEN_KEY);
        sessionStorage.removeItem(env.REFRESH_TOKEN_KEY);
        sessionStorage.removeItem('okas-auth');
        set({ user: null, accessToken: null, isAuthenticated: false, keepLoggedIn: false });
      },
      setUser: (user) => set({ user, isAuthenticated: true }),
    }),
    {
      name: 'okas-auth',
      partialize: (s) => ({ user: s.user, accessToken: s.accessToken, isAuthenticated: s.isAuthenticated, keepLoggedIn: s.keepLoggedIn }),
    }
  )
);

export default useAuthStore;
