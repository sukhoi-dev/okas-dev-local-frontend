import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageWrapper from '../../../shared/components/PageWrapper';
import DataTable from '../../../shared/components/DataTable';
import StatusBadge from '../../../shared/components/StatusBadge';

const COLUMNS = [
  { field: 'name',      headerName: 'Schedule Name', minWidth: 200 },
  { field: 'frequency', headerName: 'Frequency',     minWidth: 120 },
  { field: 'nextRun',   headerName: 'Next Run',      minWidth: 160 },
  { field: 'status',    headerName: 'Status',        minWidth: 100, renderCell: (r) => <StatusBadge status={r.status} /> },
];

export default function SchedulingPage() {
  return (
    <PageWrapper title="Scheduling" subtitle="Schedule automated tasks and scenes"
      action={<Button variant="contained" startIcon={<AddIcon />}>Add Schedule</Button>}>
      <DataTable columns={COLUMNS} rows={[]} />
    </PageWrapper>
  );
}
