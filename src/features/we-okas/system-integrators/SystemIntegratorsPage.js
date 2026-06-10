import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageWrapper from '../../../shared/components/PageWrapper';
import DataTable from '../../../shared/components/DataTable';
import StatusBadge from '../../../shared/components/StatusBadge';
import PermissionGuard from '../../../rbac/PermissionGuard';
import P from '../../../rbac/permissions';

const COLUMNS = [
  { field: 'name',    headerName: 'Name',         minWidth: 180 },
  { field: 'email',   headerName: 'Email',         minWidth: 200 },
  { field: 'company', headerName: 'Company',       minWidth: 160 },
  { field: 'status',  headerName: 'Status',        minWidth: 110, renderCell: (r) => <StatusBadge status={r.status} /> },
];

export default function SystemIntegratorsPage() {
  return (
    <PageWrapper title="System Integrators" subtitle="Manage system integrators"
      action={<PermissionGuard permission={P.SI_CREATE}><Button variant="contained" startIcon={<AddIcon />}>Add SI</Button></PermissionGuard>}>
      <DataTable columns={COLUMNS} rows={[]} />
    </PageWrapper>
  );
}
