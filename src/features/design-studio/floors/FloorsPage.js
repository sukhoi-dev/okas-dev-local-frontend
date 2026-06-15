import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageWrapper from '../../../shared/components/PageWrapper';
import DataTable from '../../../shared/components/DataTable';

const COLUMNS = [
  { field: 'name',  headerName: 'Floor Name', minWidth: 180 },
  { field: 'level', headerName: 'Level',      minWidth: 80  },
  { field: 'rooms', headerName: 'Rooms',      minWidth: 80  },
];

export default function FloorsPage() {
  const { buildingId } = useParams();
  return (
    <PageWrapper title="Floors" subtitle={`Building #${buildingId}`}
      action={<Button variant="contained" startIcon={<AddIcon />}>Add Floor</Button>}>
      <DataTable columns={COLUMNS} rows={[]} />
    </PageWrapper>
  );
}
