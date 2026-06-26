import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography, Divider } from '@mui/material';
import { NavLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import designStudioNav from './navConfig';
import { roleHasPermission } from '../../../rbac/roles';
import useAuthStore from '../../auth/authStore';
import useAuth from '../../auth/useAuth';
import { ROUTE_PATHS, APP_NAME, DESIGN_STUDIO_NAME } from '../../../config/constants';

const BG          = '#0c1a2e';
const ACTIVE_BG   = '#0369a1';
const HOVER_BG    = 'rgba(3,105,161,0.18)';
const TEXT_COLOR  = '#b0bec5';
const ACTIVE_TEXT = '#ffffff';
const WIDTH       = 240;
const COLLAPSED   = 64;

export default function Sidebar({ collapsed }) {
  const role = useAuthStore((s) => s.user?.role);
  const { logout } = useAuth();
  const width = collapsed ? COLLAPSED : WIDTH;
  const visible = designStudioNav.filter((i) => !i.permission || roleHasPermission(role, i.permission));

  return (
    <Drawer variant="permanent" sx={{ width, flexShrink: 0, '& .MuiDrawer-paper': { width, background: BG, borderRight: 'none', overflowX: 'hidden', transition: 'width 0.2s ease' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: collapsed ? 1.5 : 2, py: 2, minHeight: 64, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Typography fontWeight={800} fontSize={12} color="#fff">DS</Typography>
        </Box>
        {!collapsed && <Typography fontWeight={800} fontSize={14} color="#fff" noWrap>{DESIGN_STUDIO_NAME}</Typography>}
      </Box>

      <List sx={{ flex: 1, px: 1, pt: 1, pb: 0, overflowY: 'auto', overflowX: 'hidden' }} disablePadding>
        {visible.map(({ key, label, path, icon: Icon }) => (
          <Tooltip key={key} title={collapsed ? label : ''} placement="right">
            <ListItemButton component={NavLink} to={path}
              sx={{ borderRadius: 1.5, mb: 0.5, px: 1.5, py: 0.9, color: TEXT_COLOR, minHeight: 42, '&:hover': { bgcolor: HOVER_BG, color: '#fff' }, '&.active': { bgcolor: ACTIVE_BG, color: ACTIVE_TEXT, '& .MuiListItemIcon-root': { color: ACTIVE_TEXT } } }}>
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}><Icon fontSize="small" /></ListItemIcon>
              {!collapsed && <ListItemText primary={label} primaryTypographyProps={{ fontSize: 13, fontWeight: 500, noWrap: true }} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 1 }} />
      <List sx={{ px: 1, py: 0.5 }} disablePadding>
        <Tooltip title={collapsed ? APP_NAME : ''} placement="right">
          <ListItemButton component={NavLink} to={ROUTE_PATHS.WEOKAS}
            sx={{ borderRadius: 1.5, px: 1.5, py: 0.9, color: '#7dd3fc', minHeight: 42, '&:hover': { bgcolor: HOVER_BG, color: '#bae6fd' } }}>
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}><ArrowBackIcon fontSize="small" /></ListItemIcon>
            {!collapsed && <ListItemText primary={APP_NAME} primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }} />}
          </ListItemButton>
        </Tooltip>
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 1 }} />
      <List sx={{ px: 1, py: 0.5 }} disablePadding>
        <Tooltip title={collapsed ? 'Logout' : ''} placement="right">
          <ListItemButton onClick={logout} sx={{ borderRadius: 1.5, px: 1.5, py: 0.9, color: TEXT_COLOR, minHeight: 42, '&:hover': { bgcolor: 'rgba(239,68,68,0.12)', color: '#fca5a5' } }}>
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}><LogoutIcon fontSize="small" /></ListItemIcon>
            {!collapsed && <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }} />}
          </ListItemButton>
        </Tooltip>
      </List>
    </Drawer>
  );
}
