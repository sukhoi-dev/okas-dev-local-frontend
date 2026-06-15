import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import useAuth from '../../auth/useAuth';
import useInactivityLogout from '../../../shared/hooks/useInactivityLogout';

const SIDEBAR_WIDTH   = 240;
const COLLAPSED_WIDTH = 64;

export default function WEOKASLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout }                = useAuth();
  const sidebarWidth              = collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  useInactivityLogout(logout, true);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar collapsed={collapsed} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', ml: `${sidebarWidth}px`, transition: 'margin 0.2s ease', minWidth: 0 }}>
        <Header onToggleSidebar={() => setCollapsed((c) => !c)} sidebarWidth={sidebarWidth} />

        {/* Page content — offset by AppBar height */}
        <Box component="main" sx={{ flex: 1, mt: '64px', overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
