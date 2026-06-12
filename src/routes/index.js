import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PortalProtectedRoute from './PortalProtectedRoute';
import WEOKASRoutes from './WEOKASRoutes';
import PlaceholderPage from '../features/we-okas/shared/PlaceholderPage';
import DashboardHome from '../features/we-okas/shared/DashboardHome';

// Auth
const LoginPage          = lazy(() => import('../features/auth/LoginPage'));
const OtpPage            = lazy(() => import('../features/auth/OtpPage'));
const ForgotPasswordPage = lazy(() => import('../features/auth/ForgotPasswordPage'));

// PM portal
const PMProjects = lazy(() => import('../features/we-okas/project-managers/ProjectManagersPage'));
const PMMembers  = lazy(() => import('../features/we-okas/project-managers/Members'));

// Distributor portal
const DistributorProjects  = lazy(() => import('../features/we-okas/distributors/DistributorProjectsPage'));
const DistributorMembers   = lazy(() => import('../features/we-okas/distributors/Members'));
const DistributorSIListing = lazy(() => import('../features/we-okas/system-integrators/SystemIntegratorsListPage'));

// SI portal
const SIProjects = lazy(() => import('../features/we-okas/system-integrators/DashboardPage'));
const SIMembers  = lazy(() => import('../features/we-okas/system-integrators/Members'));

// User portal
const UserProjects = lazy(() => import('../features/we-okas/users/DashboardPage'));
const UserMembers  = lazy(() => import('../features/we-okas/users/Members'));

// Design Studio
const DesignStudioApp = lazy(() => import('../features/design-studio/DesignStudioApp'));

const S = ({ children }) => <Suspense fallback={null}>{children}</Suspense>;

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      {/* Public — single login page for all roles */}
      <Route path="/auth/login"           element={<S><LoginPage /></S>} />
      <Route path="/auth/otp"             element={<S><OtpPage /></S>} />
      <Route path="/auth/forgot-password" element={<S><ForgotPasswordPage /></S>} />

      {/* WE.OKAS admin console */}
      <Route element={<ProtectedRoute />}>
        {WEOKASRoutes()}
      </Route>

      {/* PM portal */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/projects"  element={<S><PMProjects /></S>} />
        <Route path="/members"   element={<S><PMMembers /></S>} />
        <Route path="/support"   element={<PlaceholderPage />} />
      </Route>

      {/* Distributor portal */}
      <Route element={<PortalProtectedRoute loginPath="/auth/login" />}>
        <Route path="/distributor/dashboard"          element={<DashboardHome />} />
        <Route path="/distributor/projects"           element={<S><DistributorProjects /></S>} />
        <Route path="/distributor/members"            element={<S><DistributorMembers /></S>} />
        <Route path="/distributor/system-integrators" element={<S><DistributorSIListing /></S>} />
        <Route path="/distributor/roles"              element={<PlaceholderPage />} />
        <Route path="/distributor/support"            element={<PlaceholderPage />} />
      </Route>

      {/* SI portal */}
      <Route element={<PortalProtectedRoute loginPath="/auth/login" />}>
        <Route path="/si/dashboard" element={<DashboardHome />} />
        <Route path="/si/projects"  element={<S><SIProjects /></S>} />
        <Route path="/si/members"   element={<S><SIMembers /></S>} />
        <Route path="/si/roles"     element={<PlaceholderPage />} />
        <Route path="/si/support"   element={<PlaceholderPage />} />
      </Route>

      {/* User portal */}
      <Route element={<PortalProtectedRoute loginPath="/auth/login" />}>
        <Route path="/user/dashboard" element={<DashboardHome />} />
        <Route path="/user/projects"  element={<S><UserProjects /></S>} />
        <Route path="/user/members"   element={<S><UserMembers /></S>} />
        <Route path="/user/support"   element={<PlaceholderPage />} />
      </Route>

      {/* Design Studio */}
      <Route path="/studio" element={<S><DesignStudioApp /></S>} />

      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}
