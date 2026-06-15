import { Box, Typography, Divider } from '@mui/material';

export default function PageWrapper({ title, subtitle, action, children }) {
  return (
    <Box sx={{ p: 3 }}>
      {(title || action) && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1, gap: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight={700} color="text.primary">{title}</Typography>
              {subtitle && <Typography variant="body2" color="text.secondary" mt={0.5}>{subtitle}</Typography>}
            </Box>
            {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
          </Box>
          <Divider sx={{ mb: 3 }} />
        </>
      )}
      {children}
    </Box>
  );
}
