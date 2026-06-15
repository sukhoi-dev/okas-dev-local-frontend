import { Card, CardContent, Typography, Grid, Chip, Box } from '@mui/material';
import PageWrapper from '../../../shared/components/PageWrapper';

export default function MQTTPage() {
  return (
    <PageWrapper title="MQTT" subtitle="MQTT broker status and message monitor">
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Broker Status</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Chip label="Connected" color="success" size="small" />
                <Typography variant="body2">tcp://localhost:1883</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Active Subscriptions</Typography>
              <Typography variant="h4" fontWeight={700}>0</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Messages Today</Typography>
              <Typography variant="h4" fontWeight={700}>0</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageWrapper>
  );
}
