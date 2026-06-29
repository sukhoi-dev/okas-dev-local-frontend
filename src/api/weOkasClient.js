import axios from 'axios';
import { applyInterceptors } from './interceptors';
import env from '../config/env';

const weOkasClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

applyInterceptors(weOkasClient);

export default weOkasClient;
