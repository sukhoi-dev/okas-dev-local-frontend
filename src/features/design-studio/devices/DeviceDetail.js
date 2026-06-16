import { useParams, useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageWrapper from '../../../shared/components/PageWrapper';

export default function DeviceDetail() {
  const { buildingId, floorId, roomId, deviceId } = useParams();
  const navigate = useNavigate();
  return (
    <PageWrapper title={`Device #${deviceId}`}
      action={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button>
          <Button variant="contained" startIcon={<SettingsIcon />} onClick={() => navigate(`/design-studio/buildings/${buildingId}/floors/${floorId}/rooms/${roomId}/devices/${deviceId}/config`)}>Configure</Button>
        </Box>
      }>
    </PageWrapper>
  );
}
