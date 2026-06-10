import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../shared/components/PageWrapper';
import DataTable from '../../../shared/components/DataTable';
import StatusBadge from '../../../shared/components/StatusBadge';
import PermissionGuard from '../../../rbac/PermissionGuard';
import P from '../../../rbac/permissions';
import { formatDate } from '../../../shared/utils/date.utils';

const MOCK = [
  { id: '1', name: 'Smart Office Alpha', organization: 'Techwave Ltd', status: 'active',    createdAt: '2024-01-15' },
  { id: '2', name: 'Residential Block B', organization: 'BuildCo',    status: 'completed', createdAt: '2024-03-22' },
  { id: '3', name: 'Hotel Automation',    organization: 'Hospitech',  status: 'pending',   createdAt: '2024-05-10' },
];

const COLUMNS = [
  { field: 'name',         headerName: 'Project Name',   minWidth: 200 },
  { field: 'organization', headerName: 'Organization',   minWidth: 160 },
  { field: 'status',       headerName: 'Status',         minWidth: 110, renderCell: (row) => <StatusBadge status={row.status} /> },
  { field: 'createdAt',    headerName: 'Created',        minWidth: 120, renderCell: (row) => formatDate(row.createdAt) },
];

export default function ProjectsPage() {
  const navigate = useNavigate();
  return (
    <PageWrapper
      title="Projects"
      subtitle="Manage all your WE.OKAS projects"
      action={
        <PermissionGuard permission={P.PROJECTS_CREATE}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => {}}>
            New Project
          </Button>
        </PermissionGuard>
      }
    >
      <DataTable columns={COLUMNS} rows={MOCK} />
    </PageWrapper>
  );
}
