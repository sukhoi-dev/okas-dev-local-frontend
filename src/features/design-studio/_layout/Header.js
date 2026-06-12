import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Box, Avatar, Menu, MenuItem, Divider, ListItemIcon, Typography, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuthStore from '../../auth/authStore';
import useAuth from '../../auth/useAuth';
import { roleLabel } from '../../../shared/utils/format.utils';
import { ROUTE_PATHS } from '../../../config/constants';

export default function Header({ onToggleSidebar, sidebarWidth }) {
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const initials = user?.name ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() : '?';

  return (
    <AppBar position="fixed" elevation={0} sx={{ width: `calc(100% - ${sidebarWidth}px)`, ml: `${sidebarWidth}px`, bgcolor: '#0c1a2e', borderBottom: '1px solid rgba(255,255,255,0.06)', transition: 'width 0.2s ease, margin 0.2s ease' }}>
      <Toolbar sx={{ minHeight: '64px !important', gap: 1 }}>
        <IconButton color="inherit" edge="start" onClick={onToggleSidebar} sx={{ color: '#b0bec5' }}><MenuIcon /></IconButton>
        <Box sx={{ flex: 1 }} />
        <Tooltip title="Account">
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: '#0369a1', fontSize: 13, fontWeight: 700 }}>{initials}</Avatar>
          </IconButton>
        </Tooltip>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} PaperProps={{ elevation: 2, sx: { mt: 1, minWidth: 200 } }}>
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography fontWeight={600} fontSize={14}>{user?.name}</Typography>
            <Typography fontSize={12} color="text.secondary">{roleLabel(user?.role)}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { setAnchorEl(null); navigate(ROUTE_PATHS.WEOKAS_SETTINGS); }}>
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { setAnchorEl(null); logout(); }} sx={{ color: 'error.main' }}>
            <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
