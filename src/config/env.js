const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  MQTT_BROKER_URL: import.meta.env.VITE_MQTT_BROKER_URL || 'ws://localhost:9001',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  AUTH_TOKEN_KEY: 'okas_access_token',
  REFRESH_TOKEN_KEY: 'okas_refresh_token',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};

export default env;
