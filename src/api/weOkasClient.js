import axios from 'axios';
import { applyInterceptors } from './interceptors';

// Dedicated client for the local FastAPI backend (http://localhost:8000).
// CORS is open on the backend so direct calls work without the Vite proxy.
const weOkasClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

applyInterceptors(weOkasClient);

export default weOkasClient;
