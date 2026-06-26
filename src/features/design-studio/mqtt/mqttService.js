import apiClient from '../../../api/client';
import { MQTT } from '../../../api/endpoints';
const mqttService = { publish: (d) => apiClient.post(MQTT.PUBLISH, d).then((r) => r.data), subscribe: (d) => apiClient.post(MQTT.SUBSCRIBE, d).then((r) => r.data), getStatus: () => apiClient.get(MQTT.STATUS).then((r) => r.data) };
export default mqttService;
