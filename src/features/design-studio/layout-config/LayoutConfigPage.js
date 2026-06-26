import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import PageWrapper from '../../../shared/components/PageWrapper';

export default function LayoutConfigPage() {
  const { buildingId } = useParams();
  return (
    <PageWrapper title="Layout Configuration" subtitle={buildingId ? `Building #${buildingId}` : 'Select a building to configure its layout'}>
      <Box sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 2, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Floor plan canvas goes here</Typography>
      </Box>
    </PageWrapper>
  );
}
