import apiClient from '../../../api/client';
import { LAYOUT_CONFIG } from '../../../api/endpoints';
const layoutConfigService = { get: (b) => apiClient.get(LAYOUT_CONFIG.GET(b)).then((r) => r.data), save: (b, d) => apiClient.put(LAYOUT_CONFIG.SAVE(b), d).then((r) => r.data) };
export default layoutConfigService;
