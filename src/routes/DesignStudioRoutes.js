import { lazy, Suspense } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import DesignStudioLayout from '../features/design-studio/_layout/DesignStudioLayout';

const Wrap = ({ children }) => (
  <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>}>
    {children}
  </Suspense>
);

const BuildingsPage      = lazy(() => import('../features/design-studio/buildings/BuildingsPage'));
const BuildingDetail     = lazy(() => import('../features/design-studio/buildings/BuildingDetail'));
const FloorsPage         = lazy(() => import('../features/design-studio/floors/FloorsPage'));
const RoomsPage          = lazy(() => import('../features/design-studio/rooms/RoomsPage'));
const DevicesPage        = lazy(() => import('../features/design-studio/devices/DevicesPage'));
const DeviceDetail       = lazy(() => import('../features/design-studio/devices/DeviceDetail'));
const DeviceConfigPage   = lazy(() => import('../features/design-studio/devices/DeviceConfigPage'));
const AutomationPage     = lazy(() => import('../features/design-studio/automation/AutomationPage'));
const ScenesPage         = lazy(() => import('../features/design-studio/scenes/ScenesPage'));
const SchedulingPage     = lazy(() => import('../features/design-studio/scheduling/SchedulingPage'));
const MQTTPage           = lazy(() => import('../features/design-studio/mqtt/MQTTPage'));
const LayoutConfigPage   = lazy(() => import('../features/design-studio/layout-config/LayoutConfigPage'));

export default function DesignStudioRoutes() {
  return (
    <Route path="design-studio" element={<DesignStudioLayout />}>
      <Route index element={<Navigate to="buildings" replace />} />
      <Route path="buildings"                                                                    element={<Wrap><BuildingsPage /></Wrap>} />
      <Route path="buildings/:buildingId"                                                        element={<Wrap><BuildingDetail /></Wrap>} />
      <Route path="buildings/:buildingId/floors"                                                 element={<Wrap><FloorsPage /></Wrap>} />
      <Route path="buildings/:buildingId/floors/:floorId/rooms"                                  element={<Wrap><RoomsPage /></Wrap>} />
      <Route path="buildings/:buildingId/floors/:floorId/rooms/:roomId/devices"                  element={<Wrap><DevicesPage /></Wrap>} />
      <Route path="buildings/:buildingId/floors/:floorId/rooms/:roomId/devices/:deviceId"        element={<Wrap><DeviceDetail /></Wrap>} />
      <Route path="buildings/:buildingId/floors/:floorId/rooms/:roomId/devices/:deviceId/config" element={<Wrap><DeviceConfigPage /></Wrap>} />
      <Route path="buildings/:buildingId/layout"                                                 element={<Wrap><LayoutConfigPage /></Wrap>} />
      <Route path="project/:projectId"                                                           element={<Wrap><BuildingsPage /></Wrap>} />
      <Route path="automation"    element={<Wrap><AutomationPage /></Wrap>} />
      <Route path="scenes"        element={<Wrap><ScenesPage /></Wrap>} />
      <Route path="scheduling"    element={<Wrap><SchedulingPage /></Wrap>} />
      <Route path="mqtt"          element={<Wrap><MQTTPage /></Wrap>} />
      <Route path="layout-config" element={<Wrap><LayoutConfigPage /></Wrap>} />
    </Route>
  );
}
