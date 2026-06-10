import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const LoginPage                = lazy(() => import('../features/auth/LoginPage'));
const OtpPage                  = lazy(() => import('../features/auth/OtpPage'));
const ForgotPasswordPage       = lazy(() => import('../features/auth/ForgotPasswordPage'));
const RolesPage                = lazy(() => import('../features/we-okas/roles-permissions/RolesPage'));
const UsersPage                = lazy(() => import('../features/we-okas/users/UsersPage'));
const SystemIntegratorsPage    = lazy(() => import('../features/we-okas/system-integrators/SystemIntegratorsPage'));
const ProjectManagersPage      = lazy(() => import('../features/we-okas/project-managers/ProjectManagersPage'));
const DesignStudioApp          = lazy(() => import('../features/design-studio/DesignStudioApp'));

const S = ({ children }) => <Suspense fallback={null}>{children}</Suspense>;

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      {/* ── Public ── */}
      <Route path="/auth/login"           element={<S><LoginPage /></S>} />
      <Route path="/auth/otp"             element={<S><OtpPage /></S>} />
      <Route path="/auth/forgot-password" element={<S><ForgotPasswordPage /></S>} />

      {/* ── Protected (each page has own AppShell layout) ── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/we-okas/roles-permissions"   element={<S><RolesPage /></S>} />
        <Route path="/we-okas/users"               element={<S><UsersPage /></S>} />
        <Route path="/we-okas/system-integrators"  element={<S><SystemIntegratorsPage /></S>} />
        <Route path="/dashboard"                   element={<Navigate to="/we-okas/roles-permissions" replace />} />
        <Route path="/members"                     element={<Navigate to="/we-okas/users" replace />} />

        {/* Legacy project-managers page */}
        <Route path="/pm-dashboard" element={<S><ProjectManagersPage /></S>} />
      </Route>

      {/* ── Design Studio ── */}
      <Route path="/studio" element={<S><DesignStudioApp /></S>} />

      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}
