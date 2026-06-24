import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import useAuthStore from '../features/auth/authStore';
import { ROUTE_PATHS } from '../config/constants';

// Use as a layout route: renders <Outlet /> when authenticated
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
