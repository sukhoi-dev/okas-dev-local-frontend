import { lazy, Suspense } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import WEOKASLayout from '../features/we-okas/_layout/WEOKASLayout';
import { ROLES } from '../config/constants';
import { useHasRole } from '../rbac/useRole';

const Wrap = ({ children }) => (
  <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>}>
    {children}
  </Suspense>
);

const Guard = ({ roles, children }) => {
  const ok = useHasRole(roles);
  return ok ? children : <Navigate to="/we-okas/dashboard" replace />;
};

const DashboardPage        = lazy(() => import('../features/we-okas/dashboard/DashboardPage'));
const ProjectsPage         = lazy(() => import('../features/we-okas/system-integrators/projects/ProjectsPage'));
const ProjectDetail        = lazy(() => import('../features/we-okas/system-integrators/projects/ProjectDetail'));
const DistributorsPage     = lazy(() => import('../features/we-okas/distributors/DistributorsPage'));
const SystemIntegratorsPage= lazy(() => import('../features/we-okas/system-integrators/SystemIntegratorsPage'));
const ProjectManagersPage  = lazy(() => import('../features/we-okas/project-managers/ProjectManagersPage'));
const UsersPage            = lazy(() => import('../features/we-okas/users/UsersPage'));
const OrganizationsPage    = lazy(() => import('../features/we-okas/organizations/OrganizationsPage'));
const RolesPage            = lazy(() => import('../features/we-okas/roles-permissions/RolesPage'));
const ReportsPage          = lazy(() => import('../features/we-okas/reports/ReportsPage'));
const NotificationsPage    = lazy(() => import('../features/we-okas/notifications/NotificationsPage'));
const SettingsPage         = lazy(() => import('../features/we-okas/settings/SettingsPage'));

export default function WEOKASRoutes() {
  return (
    <Route path="we-okas" element={<WEOKASLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard"          element={<Wrap><DashboardPage /></Wrap>} />
      <Route path="projects"           element={<Wrap><ProjectsPage /></Wrap>} />
      <Route path="projects/:projectId"element={<Wrap><ProjectDetail /></Wrap>} />
      <Route path="distributors"       element={<Wrap><Guard roles={[ROLES.ADMIN]}><DistributorsPage /></Guard></Wrap>} />
      <Route path="system-integrators" element={<Wrap><Guard roles={[ROLES.ADMIN, ROLES.DISTRIBUTOR]}><SystemIntegratorsPage /></Guard></Wrap>} />
      <Route path="project-managers"   element={<Wrap><Guard roles={[ROLES.ADMIN, ROLES.DISTRIBUTOR]}><ProjectManagersPage /></Guard></Wrap>} />
      <Route path="users"              element={<Wrap><UsersPage /></Wrap>} />
      <Route path="organizations"      element={<Wrap><Guard roles={[ROLES.ADMIN]}><OrganizationsPage /></Guard></Wrap>} />
      <Route path="roles-permissions"  element={<Wrap><Guard roles={[ROLES.ADMIN]}><RolesPage /></Guard></Wrap>} />
      <Route path="reports"            element={<Wrap><ReportsPage /></Wrap>} />
      <Route path="notifications"      element={<Wrap><NotificationsPage /></Wrap>} />
      <Route path="settings"           element={<Wrap><SettingsPage /></Wrap>} />
    </Route>
  );
}
