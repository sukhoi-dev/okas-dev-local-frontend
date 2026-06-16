import { Card, CardContent, Typography, Box, TextField, Button, Divider } from '@mui/material';
import PageWrapper from '../../../shared/components/PageWrapper';

export default function SettingsPage() {
  return (
    <PageWrapper title="Settings" subtitle="Application settings and preferences">
      <Card sx={{ maxWidth: 640 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>General Settings</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Application Name" defaultValue="WE.OKAS" fullWidth />
            <TextField label="Support Email"    defaultValue="support@weokas.com" fullWidth />
          </Box>
          <Divider sx={{ my: 3 }} />
          <Button variant="contained">Save Changes</Button>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
