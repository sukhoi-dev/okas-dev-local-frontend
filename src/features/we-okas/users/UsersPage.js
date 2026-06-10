import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageWrapper from '../../../shared/components/PageWrapper';
import DataTable from '../../../shared/components/DataTable';
import StatusBadge from '../../../shared/components/StatusBadge';
import PermissionGuard from '../../../rbac/PermissionGuard';
import P from '../../../rbac/permissions';
import { roleLabel } from '../../../shared/utils/format.utils';

const COLUMNS = [
  { field: 'name',  headerName: 'Name',   minWidth: 180 },
  { field: 'email', headerName: 'Email',  minWidth: 200 },
  { field: 'role',  headerName: 'Role',   minWidth: 140, renderCell: (r) => roleLabel(r.role) },
  { field: 'status',headerName: 'Status', minWidth: 110, renderCell: (r) => <StatusBadge status={r.status} /> },
];

export default function UsersPage() {
  return (
    <PageWrapper title="Users" subtitle="Manage platform users"
      action={<PermissionGuard permission={P.USERS_CREATE}><Button variant="contained" startIcon={<AddIcon />}>Add User</Button></PermissionGuard>}>
      <DataTable columns={COLUMNS} rows={[]} />
    </PageWrapper>
  );
}
