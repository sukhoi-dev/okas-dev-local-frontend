import PageWrapper from '../../../shared/components/PageWrapper';
import DataTable from '../../../shared/components/DataTable';

const COLUMNS = [
  { field: 'name',        headerName: 'Role',        minWidth: 160 },
  { field: 'description', headerName: 'Description', minWidth: 280 },
  { field: 'users',       headerName: 'Users',       minWidth: 80  },
];

export default function RolesPage() {
  return (
    <PageWrapper title="Roles & Permissions" subtitle="Manage roles and their permissions">
      <DataTable columns={COLUMNS} rows={[]} />
    </PageWrapper>
  );
}
