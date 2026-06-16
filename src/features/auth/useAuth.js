import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from './authStore';
import authService from './authService';
import { ROUTE_PATHS } from '../../config/constants';

export default function useAuth() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error, login, logout, setLoading, setError } = useAuthStore();

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { user: u, accessToken, refreshToken } = await authService.login(credentials);
      login(u, accessToken, refreshToken);
      navigate(ROUTE_PATHS.WEOKAS_DASHBOARD);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await authService.logout(); } catch (_) {}
    logout();
    toast.info('You have been logged out.');
    navigate(ROUTE_PATHS.LOGIN);
  };

  return { user, isAuthenticated, isLoading, error, login: handleLogin, logout: handleLogout };
}
