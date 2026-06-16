import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageWrapper from '../../../shared/components/PageWrapper';
import DataTable from '../../../shared/components/DataTable';
import StatusBadge from '../../../shared/components/StatusBadge';

const COLUMNS = [
  { field: 'name',      headerName: 'Rule Name',  minWidth: 200 },
  { field: 'trigger',   headerName: 'Trigger',    minWidth: 160 },
  { field: 'action',    headerName: 'Action',     minWidth: 160 },
  { field: 'status',    headerName: 'Status',     minWidth: 100, renderCell: (r) => <StatusBadge status={r.status} /> },
];

export default function AutomationPage() {
  return (
    <PageWrapper title="Automation" subtitle="Manage automation rules"
      action={<Button variant="contained" startIcon={<AddIcon />}>Add Rule</Button>}>
      <DataTable columns={COLUMNS} rows={[]} />
    </PageWrapper>
  );
}
