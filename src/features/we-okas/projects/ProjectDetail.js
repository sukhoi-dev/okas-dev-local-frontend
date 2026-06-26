import { useParams, useNavigate } from 'react-router-dom';
import { Button, Box, Chip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageWrapper from '../../../shared/components/PageWrapper';
import PermissionGuard from '../../../rbac/PermissionGuard';
import P from '../../../rbac/permissions';
import { ROUTE_PATHS } from '../../../config/constants';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate      = useNavigate();

  return (
    <PageWrapper
      title={`Project #${projectId}`}
      action={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(ROUTE_PATHS.WEOKAS_PROJECTS)}>
            Back
          </Button>
          <PermissionGuard permission={P.PROJECTS_CONFIGURE}>
            <Button
              variant="contained"
              startIcon={<SettingsIcon />}
              onClick={() => navigate(`/design-studio/project/${projectId}`)}
            >
              Configure in Design Studio
            </Button>
          </PermissionGuard>
        </Box>
      }
    >
      {/* Project detail content goes here */}
    </PageWrapper>
  );
}
