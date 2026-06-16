import { useParams } from 'react-router-dom';
import PageWrapper from '../../../shared/components/PageWrapper';
export default function DeviceConfigPage() {
  const { deviceId } = useParams();
  return <PageWrapper title={`Configure Device #${deviceId}`} subtitle="Device configuration settings" />;
}
