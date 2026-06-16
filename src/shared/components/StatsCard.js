import { Card, CardContent, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function StatsCard({ label, value, delta, icon, borderColor = '#0094AD' }) {
  const isPositive = delta > 0;
  return (
    <Card sx={{ borderLeft: `4px solid ${borderColor}`, height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
          {icon && <Box sx={{ color: borderColor, opacity: 0.8, fontSize: 22 }}>{icon}</Box>}
        </Box>
        <Typography variant="h4" fontWeight={700} mt={1} color="text.primary">{value}</Typography>
        {delta !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            {isPositive
              ? <TrendingUpIcon fontSize="small" sx={{ color: 'success.main' }} />
              : <TrendingDownIcon fontSize="small" sx={{ color: 'error.main' }} />}
            <Typography variant="caption" color={isPositive ? 'success.main' : 'error.main'}>
              {Math.abs(delta)}% vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
