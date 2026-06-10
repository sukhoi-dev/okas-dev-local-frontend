import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, IconButton, Typography, Box, Badge, Avatar,
  Menu, MenuItem, Divider, ListItemIcon, Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuthStore from '../../auth/authStore';
import useAuth from '../../auth/useAuth';
import { roleLabel } from '../../../shared/utils/format.utils';
import { ROUTE_PATHS } from '../../../config/constants';

export default function Header({ onToggleSidebar, sidebarWidth }) {
  const user            = useAuthStore((s) => s.user);
  const { logout }      = useAuth();
  const navigate        = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const initials = user?.name ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() : '?';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${sidebarWidth}px)`,
        ml: `${sidebarWidth}px`,
        bgcolor: '#1D2B36',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        transition: 'width 0.2s ease, margin 0.2s ease',
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important', gap: 1 }}>
        {/* Sidebar toggle */}
        <IconButton color="inherit" edge="start" onClick={onToggleSidebar} sx={{ color: '#b0bec5' }}>
          <MenuIcon />
        </IconButton>

        <Box sx={{ flex: 1 }} />

        {/* Notification bell */}
        <Tooltip title="Notifications">
          <IconButton sx={{ color: '#b0bec5' }} onClick={() => navigate(ROUTE_PATHS.WEOKAS_NOTIFICATIONS)}>
            <Badge badgeContent={0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User avatar menu */}
        <Tooltip title="Account">
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: '#0094AD', fontSize: 13, fontWeight: 700 }}>
              {initials}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{ elevation: 2, sx: { mt: 1, minWidth: 200 } }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography fontWeight={600} fontSize={14}>{user?.name}</Typography>
            <Typography fontSize={12} color="text.secondary">{roleLabel(user?.role)}</Typography>
            <Typography fontSize={11} color="text.disabled">{user?.email}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { setAnchorEl(null); navigate(ROUTE_PATHS.WEOKAS_SETTINGS); }}>
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
            Profile & Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { setAnchorEl(null); logout(); }} sx={{ color: 'error.main' }}>
            <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
