import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageWrapper from '../../../shared/components/PageWrapper';
import DataTable from '../../../shared/components/DataTable';

const COLUMNS = [
  { field: 'name',    headerName: 'Room Name', minWidth: 180 },
  { field: 'type',    headerName: 'Type',      minWidth: 120 },
  { field: 'devices', headerName: 'Devices',   minWidth: 80  },
];

export default function RoomsPage() {
  const { buildingId, floorId } = useParams();
  return (
    <PageWrapper title="Rooms" subtitle={`Floor #${floorId} — Building #${buildingId}`}
      action={<Button variant="contained" startIcon={<AddIcon />}>Add Room</Button>}>
      <DataTable columns={COLUMNS} rows={[]} />
    </PageWrapper>
  );
}
