import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const LoginPage          = lazy(() => import('../features/auth/LoginPage'));
const OtpPage            = lazy(() => import('../features/auth/OtpPage'));
const ForgotPasswordPage = lazy(() => import('../features/auth/ForgotPasswordPage'));
const ProjectManagersPage  = lazy(() => import('../features/we-okas/project-managers/ProjectManagersPage'));
const Members              = lazy(() => import('../features/we-okas/project-managers/Members'));
const DesignStudioApp      = lazy(() => import('../features/design-studio/DesignStudioApp'));

const S = ({ children }) => <Suspense fallback={null}>{children}</Suspense>;

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      {/* Public */}
      <Route path="/auth/login"           element={<S><LoginPage /></S>} />
      <Route path="/auth/otp"             element={<S><OtpPage /></S>} />
      <Route path="/auth/forgot-password" element={<S><ForgotPasswordPage /></S>} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<S><ProjectManagersPage /></S>} />
        <Route path="/members"   element={<S><Members /></S>} />
      </Route>

      {/* Design Studio standalone */}
      <Route path="/studio" element={<S><DesignStudioApp /></S>} />

      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}
