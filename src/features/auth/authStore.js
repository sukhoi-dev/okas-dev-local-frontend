import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import env from '../../config/env';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      permissions: [],
      permissionsGrouped: {},
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      login: (user, accessToken, permissions = [], permissionsGrouped = {}, sessionToken = null) => {
        if (accessToken) localStorage.setItem(env.AUTH_TOKEN_KEY, accessToken);
        if (sessionToken) localStorage.setItem(env.SESSION_TOKEN_KEY, sessionToken);
        set({ user, accessToken, permissions, permissionsGrouped, isAuthenticated: true, error: null });
      },

      logout: () => {
        localStorage.removeItem(env.AUTH_TOKEN_KEY);
        localStorage.removeItem(env.SESSION_TOKEN_KEY);
        set({ user: null, accessToken: null, permissions: [], permissionsGrouped: {}, isAuthenticated: false });
      },

      /** Check if the user has a specific permission, e.g. "members.create" */
      hasPermission: (permKey) => {
        const state = useAuthStore.getState();
        return state.permissions.includes(permKey);
      },

      /** Check if the user has any permission under a feature, e.g. "members" */
      hasFeature: (feature) => {
        const state = useAuthStore.getState();
        return !!(state.permissionsGrouped[feature]?.length);
      },
    }),
    {
      name: 'okas-auth',
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        permissions: s.permissions,
        permissionsGrouped: s.permissionsGrouped,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
