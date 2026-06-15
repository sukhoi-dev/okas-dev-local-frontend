import PageWrapper from '../../../shared/components/PageWrapper';
import DataTable from '../../../shared/components/DataTable';
import { formatDateTime } from '../../../shared/utils/date.utils';

const COLUMNS = [
  { field: 'title',   headerName: 'Notification', minWidth: 280 },
  { field: 'type',    headerName: 'Type',         minWidth: 120 },
  { field: 'sentAt',  headerName: 'Sent At',      minWidth: 160, renderCell: (r) => formatDateTime(r.sentAt) },
];

export default function NotificationsPage() {
  return (
    <PageWrapper title="Notifications" subtitle="All system notifications">
      <DataTable columns={COLUMNS} rows={[]} />
    </PageWrapper>
  );
}
