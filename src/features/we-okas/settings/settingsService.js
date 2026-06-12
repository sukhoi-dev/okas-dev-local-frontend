import apiClient from '../../../api/client';
import { SETTINGS } from '../../../api/endpoints';
const settingsService = { get: () => apiClient.get(SETTINGS.GET).then((r) => r.data), update: (d) => apiClient.put(SETTINGS.UPDATE, d).then((r) => r.data) };
export default settingsService;
