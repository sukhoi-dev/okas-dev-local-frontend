import { Chip } from '@mui/material';

const CONFIG = {
  active:    { label: 'Active',    color: 'success' },
  inactive:  { label: 'Inactive',  color: 'default' },
  pending:   { label: 'Pending',   color: 'warning' },
  completed: { label: 'Completed', color: 'info'    },
  cancelled: { label: 'Cancelled', color: 'error'   },
};

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status?.toLowerCase()] || { label: status, color: 'default' };
  return <Chip label={cfg.label} color={cfg.color} size="small" />;
}
