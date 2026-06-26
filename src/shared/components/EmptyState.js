import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

export default function EmptyState({ title = 'No data found', description, actionLabel, onAction, icon }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
      <Box sx={{ color: 'text.disabled', mb: 2, fontSize: 48 }}>
        {icon || <InboxIcon sx={{ fontSize: 56, color: 'text.disabled' }} />}
      </Box>
      <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>{title}</Typography>
      {description && <Typography variant="body2" color="text.secondary" mb={3}>{description}</Typography>}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>{actionLabel}</Button>
      )}
    </Box>
  );
}
