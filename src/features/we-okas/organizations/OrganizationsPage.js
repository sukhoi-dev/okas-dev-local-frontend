import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageWrapper from '../../../shared/components/PageWrapper';
import DataTable from '../../../shared/components/DataTable';
import PermissionGuard from '../../../rbac/PermissionGuard';
import P from '../../../rbac/permissions';

const COLUMNS = [
  { field: 'name',     headerName: 'Organization', minWidth: 200 },
  { field: 'industry', headerName: 'Industry',     minWidth: 160 },
  { field: 'city',     headerName: 'City',         minWidth: 120 },
  { field: 'projects', headerName: 'Projects',     minWidth: 100 },
];

export default function OrganizationsPage() {
  return (
    <PageWrapper title="Organizations" subtitle="Manage organizations"
      action={<PermissionGuard permission={P.ORGS_CREATE}><Button variant="contained" startIcon={<AddIcon />}>Add Organization</Button></PermissionGuard>}>
      <DataTable columns={COLUMNS} rows={[]} />
    </PageWrapper>
  );
}
