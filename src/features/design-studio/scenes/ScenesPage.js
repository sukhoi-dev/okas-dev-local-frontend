import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageWrapper from '../../../shared/components/PageWrapper';
import DataTable from '../../../shared/components/DataTable';

const COLUMNS = [
  { field: 'name',     headerName: 'Scene Name', minWidth: 200 },
  { field: 'devices',  headerName: 'Devices',    minWidth: 80  },
  { field: 'createdAt',headerName: 'Created',    minWidth: 140 },
];

export default function ScenesPage() {
  return (
    <PageWrapper title="Scenes" subtitle="Create and manage lighting and device scenes"
      action={<Button variant="contained" startIcon={<AddIcon />}>Create Scene</Button>}>
      <DataTable columns={COLUMNS} rows={[]} />
    </PageWrapper>
  );
}
