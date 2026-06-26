import PageWrapper from '../../../shared/components/PageWrapper';
import DataTable from '../../../shared/components/DataTable';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PermissionGuard from '../../../rbac/PermissionGuard';
import P from '../../../rbac/permissions';

const COLUMNS = [
  { field: 'name',      headerName: 'Report Name', minWidth: 200 },
  { field: 'type',      headerName: 'Type',        minWidth: 120 },
  { field: 'generatedAt', headerName: 'Generated', minWidth: 160 },
];

export default function ReportsPage() {
  return (
    <PageWrapper title="Reports" subtitle="View and export reports"
      action={<PermissionGuard permission={P.REPORTS_EXPORT}><Button variant="contained" startIcon={<DownloadIcon />}>Export</Button></PermissionGuard>}>
      <DataTable columns={COLUMNS} rows={[]} />
    </PageWrapper>
  );
}
