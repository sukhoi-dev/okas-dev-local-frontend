import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography, Divider } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import LogoutIcon from '@mui/icons-material/Logout';
import weOkasNav from './navConfig';
import { roleHasPermission } from '../../../rbac/roles';
import useAuthStore from '../../auth/authStore';
import useAuth from '../../auth/useAuth';
import { ROUTE_PATHS, DESIGN_STUDIO_NAME } from '../../../config/constants';
import featureFlags from '../../../config/featureFlags';

const SIDEBAR_BG     = '#1D2B36';
const ACTIVE_BG      = '#0094AD';
const HOVER_BG       = 'rgba(0,148,173,0.15)';
const TEXT_COLOR     = '#b0bec5';
const ACTIVE_TEXT    = '#ffffff';
const SIDEBAR_WIDTH  = 240;
const COLLAPSED_W    = 64;

export default function Sidebar({ open, collapsed }) {
  const role       = useAuthStore((s) => s.user?.role);
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const visibleNav = weOkasNav.filter((item) => !item.permission || roleHasPermission(role, item.permission));
  const width      = collapsed ? COLLAPSED_W : SIDEBAR_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          background: SIDEBAR_BG,
          borderRight: 'none',
          overflowX: 'hidden',
          transition: 'width 0.2s ease',
        },
      }}
    >
      {/* Brand */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: collapsed ? 1.5 : 2, py: 2, minHeight: 64, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: ACTIVE_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Typography fontWeight={800} fontSize={14} color="#fff">W</Typography>
        </Box>
        {!collapsed && (
          <Typography fontWeight={800} fontSize={15} color="#fff" letterSpacing={0.5} noWrap>
            WE.OKAS
          </Typography>
        )}
      </Box>

      {/* Nav items */}
      <List sx={{ flex: 1, px: 1, pt: 1, pb: 0, overflowY: 'auto', overflowX: 'hidden' }} disablePadding>
        {visibleNav.map(({ key, label, path, icon: Icon }) => (
          <Tooltip key={key} title={collapsed ? label : ''} placement="right">
            <ListItemButton
              component={NavLink}
              to={path}
              sx={{
                borderRadius: 1.5,
                mb: 0.5,
                px: collapsed ? 1.5 : 1.5,
                py: 0.9,
                color: TEXT_COLOR,
                minHeight: 42,
                '&:hover': { bgcolor: HOVER_BG, color: '#fff' },
                '&.active': { bgcolor: ACTIVE_BG, color: ACTIVE_TEXT, '& .MuiListItemIcon-root': { color: ACTIVE_TEXT } },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              {!collapsed && <ListItemText primary={label} primaryTypographyProps={{ fontSize: 13, fontWeight: 500, noWrap: true }} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      {/* Design Studio cross-domain link */}
      {featureFlags.DESIGN_STUDIO_ENABLED && (
        <>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 1 }} />
          <List sx={{ px: 1, py: 0.5 }} disablePadding>
            <Tooltip title={collapsed ? DESIGN_STUDIO_NAME : ''} placement="right">
              <ListItemButton
                component={NavLink}
                to={ROUTE_PATHS.DESIGN_STUDIO}
                sx={{ borderRadius: 1.5, px: 1.5, py: 0.9, color: '#7dd3fc', minHeight: 42, '&:hover': { bgcolor: HOVER_BG, color: '#bae6fd' }, '&.active': { bgcolor: '#0369a1', color: '#fff' } }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                  <DesignServicesIcon fontSize="small" />
                </ListItemIcon>
                {!collapsed && <ListItemText primary={DESIGN_STUDIO_NAME} primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }} />}
              </ListItemButton>
            </Tooltip>
          </List>
        </>
      )}

      {/* Logout */}
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
