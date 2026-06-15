import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import useAuthStore from '../features/auth/authStore';

const ORG_TYPE_HOME = {
  distributor: '/distributor/dashboard',
  si:          '/si/dashboard',
};

export default function PortalProtectedRoute({ loginPath = '/auth/login', allowedOrgTypes }) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // If this portal requires a specific org_type and user doesn't match, redirect them to their own portal
  if (allowedOrgTypes && !allowedOrgTypes.includes(user?.org_type)) {
    const home = ORG_TYPE_HOME[user?.org_type] ?? '/dashboard';
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
}
