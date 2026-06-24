import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Avatar, Box, Typography, Divider, Chip, Grid
} from '@mui/material';
import useAuthStore from '../../auth/authStore';
import { ROLES } from '../../../config/constants';

const ROLE_FIELDS = {
  [ROLES.ADMIN]: [
    { label: 'Department',    value: 'Management' },
    { label: 'Phone',         value: '+1-555-0100' },
    { label: 'Access Level',  value: 'Super Admin' },
    { label: 'Office',        value: 'HQ - Floor 3' },
  ],
  [ROLES.DISTRIBUTOR]: [
    { label: 'Company',       value: 'TechWave Distributors' },
    { label: 'Region',        value: 'North America' },
    { label: 'License No.',   value: 'DIST-2024-001' },
    { label: 'Phone',         value: '+1-555-0200' },
  ],
  [ROLES.SYSTEM_INTEGRATOR]: [
    { label: 'Company',         value: 'SmartSys Integration' },
    { label: 'Specialization',  value: 'Building Automation' },
    { label: 'License No.',     value: 'SI-2024-042' },
    { label: 'Region',          value: 'West Coast' },
  ],
  [ROLES.PROJECT_MANAGER]: [
    { label: 'Department',        value: 'Operations' },
    { label: 'Projects Managed',  value: '12' },
    { label: 'Reporting To',      value: 'Sarah Mitchell' },
    { label: 'Phone',             value: '+1-555-0300' },
  ],
  [ROLES.USER]: [
    { label: 'Account Type',   value: 'Standard' },
    { label: 'Subscription',   value: 'Active' },
    { label: 'Member Since',   value: 'January 2024' },
    { label: 'Phone',          value: '+1-555-0400' },
  ],
};

const ROLE_LABEL = {
  [ROLES.ADMIN]:             'Admin',
  [ROLES.DISTRIBUTOR]:       'Distributor',
  [ROLES.SYSTEM_INTEGRATOR]: 'System Integrator',
  [ROLES.PROJECT_MANAGER]:   'Project Manager',
  [ROLES.USER]:              'User',
};

export default function ProfileModal({ open, onClose }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const fields = ROLE_FIELDS[user.role] || [];
  const roleLabel = ROLE_LABEL[user.role] || user.role;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 0 }}>Profile</DialogTitle>

      <DialogContent>
        {/* Avatar + name block */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: '#0094AD', fontSize: 20, fontWeight: 700 }}>
            {initials}
          </Avatar>
          <Box>
            <Typography fontWeight={700} fontSize={16}>{user.name}</Typography>
            <Typography fontSize={13} color="text.secondary">{user.email}</Typography>
            <Chip label={roleLabel} size="small" sx={{ mt: 0.5, fontSize: 11 }} />
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Role-specific fields */}
        <Grid container spacing={1.5}>
          {fields.map(({ label, value }) => (
            <Grid item xs={6} key={label}>
              <Typography fontSize={11} color="text.disabled" textTransform="uppercase" letterSpacing={0.5}>
                {label}
              </Typography>
              <Typography fontSize={14} fontWeight={500} mt={0.25}>
                {value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
