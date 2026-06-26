import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../shared/components/PageWrapper';
import DataTable from '../../../shared/components/DataTable';
import PermissionGuard from '../../../rbac/PermissionGuard';
import P from '../../../rbac/permissions';

const COLUMNS = [
  { field: 'name',    headerName: 'Building Name', minWidth: 200 },
  { field: 'floors',  headerName: 'Floors',        minWidth: 80  },
  { field: 'rooms',   headerName: 'Rooms',         minWidth: 80  },
  { field: 'devices', headerName: 'Devices',       minWidth: 80  },
];

export default function BuildingsPage() {
  return (
    <PageWrapper title="Buildings" subtitle="Manage all buildings in Design Studio"
      action={<PermissionGuard permission={P.BUILDINGS_CREATE}><Button variant="contained" startIcon={<AddIcon />}>Add Building</Button></PermissionGuard>}>
      <DataTable columns={COLUMNS} rows={[]} />
    </PageWrapper>
  );
}
