import apiClient from '../../../api/client';
import { NOTIFICATIONS } from '../../../api/endpoints';
const notificationService = { list: () => apiClient.get(NOTIFICATIONS.LIST).then((r) => r.data), markRead: (id) => apiClient.patch(NOTIFICATIONS.MARK_READ(id)).then((r) => r.data), markAllRead: () => apiClient.patch(NOTIFICATIONS.MARK_ALL_READ).then((r) => r.data) };
export default notificationService;
