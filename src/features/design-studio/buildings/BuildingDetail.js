import { useParams, useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LayersIcon from '@mui/icons-material/Layers';
import PageWrapper from '../../../shared/components/PageWrapper';

export default function BuildingDetail() {
  const { buildingId } = useParams();
  const navigate       = useNavigate();
  return (
    <PageWrapper title={`Building #${buildingId}`}
      action={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/design-studio/buildings')}>Back</Button>
          <Button variant="contained" startIcon={<LayersIcon />} onClick={() => navigate(`/design-studio/buildings/${buildingId}/floors`)}>View Floors</Button>
        </Box>
      }>
    </PageWrapper>
  );
}
