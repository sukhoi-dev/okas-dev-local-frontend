import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

const LoginPage          = lazy(() => import('../features/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../features/auth/ForgotPasswordPage'));

const Fallback = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
    <CircularProgress />
  </Box>
);

export default function AuthRoutes() {
  return (
    <>
      <Route path="login"           element={<Suspense fallback={<Fallback />}><LoginPage /></Suspense>} />
      <Route path="forgot-password" element={<Suspense fallback={<Fallback />}><ForgotPasswordPage /></Suspense>} />
    </>
  );
}
