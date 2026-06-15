import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageWrapper from '../../../shared/components/PageWrapper';
import DataTable from '../../../shared/components/DataTable';
import StatusBadge from '../../../shared/components/StatusBadge';

const COLUMNS = [
  { field: 'name',     headerName: 'Device Name', minWidth: 180 },
  { field: 'type',     headerName: 'Type',        minWidth: 120 },
  { field: 'mac',      headerName: 'MAC Address', minWidth: 150 },
  { field: 'status',   headerName: 'Status',      minWidth: 100, renderCell: (r) => <StatusBadge status={r.status} /> },
];

export default function DevicesPage() {
  const { roomId } = useParams();
  return (
    <PageWrapper title="Devices" subtitle={`Room #${roomId}`}
      action={<Button variant="contained" startIcon={<AddIcon />}>Add Device</Button>}>
      <DataTable columns={COLUMNS} rows={[]} />
    </PageWrapper>
  );
}
