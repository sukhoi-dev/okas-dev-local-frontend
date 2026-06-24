import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageWrapper from '../../../shared/components/PageWrapper';
import DataTable from '../../../shared/components/DataTable';
import StatusBadge from '../../../shared/components/StatusBadge';
import PermissionGuard from '../../../rbac/PermissionGuard';
import P from '../../../rbac/permissions';

const COLUMNS = [
  { field: 'name',    headerName: 'Name',    minWidth: 180 },
  { field: 'email',   headerName: 'Email',   minWidth: 200 },
  { field: 'phone',   headerName: 'Phone',   minWidth: 140 },
  { field: 'status',  headerName: 'Status',  minWidth: 110, renderCell: (r) => <StatusBadge status={r.status} /> },
];

export default function DistributorsPage() {
  return (
    <PageWrapper title="Distributors" subtitle="Manage distributors"
      action={<PermissionGuard permission={P.DISTRIBUTORS_CREATE}><Button variant="contained" startIcon={<AddIcon />}>Add Distributor</Button></PermissionGuard>}>
      <DataTable columns={COLUMNS} rows={[]} />
    </PageWrapper>
  );
}
