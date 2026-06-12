export const APP_NAME = 'WE.OKAS';
export const DESIGN_STUDIO_NAME = 'Design Studio';

export const ROLES = {
  ADMIN: 'admin',
  DISTRIBUTOR: 'distributor',
  SYSTEM_INTEGRATOR: 'si',
  PROJECT_MANAGER: 'pm',
  USER: 'user',
};

export const ROUTE_PATHS = {
  // Auth
  LOGIN: '/auth/login',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  // WE.OKAS
  WEOKAS: '/we-okas',
  WEOKAS_DASHBOARD: '/we-okas/dashboard',
  WEOKAS_PROJECTS: '/we-okas/projects',
  WEOKAS_PROJECT_DETAIL: '/we-okas/projects/:projectId',
  WEOKAS_DISTRIBUTORS: '/we-okas/distributors',
  WEOKAS_SIS: '/we-okas/system-integrators',
  WEOKAS_PMS: '/we-okas/project-managers',
  WEOKAS_USERS: '/we-okas/users',
  WEOKAS_ORGANIZATIONS: '/we-okas/organizations',
  WEOKAS_ROLES: '/we-okas/roles-permissions',
  WEOKAS_REPORTS: '/we-okas/reports',
  WEOKAS_NOTIFICATIONS: '/we-okas/notifications',
  WEOKAS_SETTINGS: '/we-okas/settings',

  // Design Studio
  DESIGN_STUDIO: '/design-studio',
  DS_BUILDINGS: '/design-studio/buildings',
  DS_BUILDING_DETAIL: '/design-studio/buildings/:buildingId',
  DS_FLOORS: '/design-studio/buildings/:buildingId/floors',
  DS_FLOOR_DETAIL: '/design-studio/buildings/:buildingId/floors/:floorId',
  DS_ROOMS: '/design-studio/buildings/:buildingId/floors/:floorId/rooms',
  DS_ROOM_DETAIL: '/design-studio/buildings/:buildingId/floors/:floorId/rooms/:roomId',
  DS_DEVICES: '/design-studio/buildings/:buildingId/floors/:floorId/rooms/:roomId/devices',
  DS_DEVICE_DETAIL: '/design-studio/buildings/:buildingId/floors/:floorId/rooms/:roomId/devices/:deviceId',
  DS_AUTOMATION: '/design-studio/automation',
  DS_SCENES: '/design-studio/scenes',
  DS_SCHEDULING: '/design-studio/scheduling',
  DS_MQTT: '/design-studio/mqtt',
  DS_LAYOUT_CONFIG: '/design-studio/layout-config',

  // Cross-domain: Project → Design Studio
  DS_PROJECT: '/design-studio/project/:projectId',
};

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE: 422,
  SERVER_ERROR: 500,
};
