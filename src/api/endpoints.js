export const AUTH = {
  LOGIN: '/auth/login', LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh', ME: '/auth/me',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
};
export const PROJECTS = {
  LIST: '/projects', DETAIL: (id) => `/projects/${id}`,
  CREATE: '/projects', UPDATE: (id) => `/projects/${id}`, DELETE: (id) => `/projects/${id}`,
};
export const DISTRIBUTORS = {
  LIST: '/distributors', DETAIL: (id) => `/distributors/${id}`,
  CREATE: '/distributors', UPDATE: (id) => `/distributors/${id}`, DELETE: (id) => `/distributors/${id}`,
};
export const SYSTEM_INTEGRATORS = {
  LIST: '/system-integrators', DETAIL: (id) => `/system-integrators/${id}`,
  CREATE: '/system-integrators', UPDATE: (id) => `/system-integrators/${id}`, DELETE: (id) => `/system-integrators/${id}`,
};
export const PROJECT_MANAGERS = {
  LIST: '/project-managers', DETAIL: (id) => `/project-managers/${id}`,
  CREATE: '/project-managers', UPDATE: (id) => `/project-managers/${id}`, DELETE: (id) => `/project-managers/${id}`,
};
export const USERS = {
  LIST: '/users', DETAIL: (id) => `/users/${id}`,
  CREATE: '/users', UPDATE: (id) => `/users/${id}`, DELETE: (id) => `/users/${id}`,
};
export const ORGANIZATIONS = {
  LIST: '/organizations', DETAIL: (id) => `/organizations/${id}`,
  CREATE: '/organizations', UPDATE: (id) => `/organizations/${id}`, DELETE: (id) => `/organizations/${id}`,
};
export const ROLES_PERMISSIONS = {
  ROLES_LIST: '/roles', ROLE_DETAIL: (id) => `/roles/${id}`,
  PERMISSIONS_LIST: '/permissions', ASSIGN: '/roles/assign',
};
export const REPORTS    = { LIST: '/reports', GENERATE: '/reports/generate', EXPORT: (id) => `/reports/${id}/export` };
export const NOTIFICATIONS = { LIST: '/notifications', MARK_READ: (id) => `/notifications/${id}/read`, MARK_ALL_READ: '/notifications/read-all' };
export const SETTINGS   = { GET: '/settings', UPDATE: '/settings' };
export const BUILDINGS  = {
  LIST: '/buildings', DETAIL: (id) => `/buildings/${id}`,
  CREATE: '/buildings', UPDATE: (id) => `/buildings/${id}`, DELETE: (id) => `/buildings/${id}`,
  BY_PROJECT: (pid) => `/projects/${pid}/buildings`,
};
export const FLOORS = {
  LIST: (b) => `/buildings/${b}/floors`, DETAIL: (b, f) => `/buildings/${b}/floors/${f}`,
  CREATE: (b) => `/buildings/${b}/floors`, UPDATE: (b, f) => `/buildings/${b}/floors/${f}`, DELETE: (b, f) => `/buildings/${b}/floors/${f}`,
};
export const ROOMS = {
  LIST: (b, f) => `/buildings/${b}/floors/${f}/rooms`,
  DETAIL: (b, f, r) => `/buildings/${b}/floors/${f}/rooms/${r}`,
  CREATE: (b, f) => `/buildings/${b}/floors/${f}/rooms`,
  UPDATE: (b, f, r) => `/buildings/${b}/floors/${f}/rooms/${r}`,
  DELETE: (b, f, r) => `/buildings/${b}/floors/${f}/rooms/${r}`,
};
export const DEVICES = {
  LIST: (b, f, r) => `/buildings/${b}/floors/${f}/rooms/${r}/devices`,
  DETAIL: (b, f, r, d) => `/buildings/${b}/floors/${f}/rooms/${r}/devices/${d}`,
  CREATE: (b, f, r) => `/buildings/${b}/floors/${f}/rooms/${r}/devices`,
  UPDATE: (b, f, r, d) => `/buildings/${b}/floors/${f}/rooms/${r}/devices/${d}`,
  DELETE: (b, f, r, d) => `/buildings/${b}/floors/${f}/rooms/${r}/devices/${d}`,
  CONFIG: (d) => `/devices/${d}/config`,
};
export const AUTOMATION  = { LIST: '/automation', DETAIL: (id) => `/automation/${id}`, CREATE: '/automation', UPDATE: (id) => `/automation/${id}`, DELETE: (id) => `/automation/${id}` };
export const SCENES      = { LIST: '/scenes', DETAIL: (id) => `/scenes/${id}`, CREATE: '/scenes', UPDATE: (id) => `/scenes/${id}`, DELETE: (id) => `/scenes/${id}`, ACTIVATE: (id) => `/scenes/${id}/activate` };
export const SCHEDULING  = { LIST: '/scheduling', DETAIL: (id) => `/scheduling/${id}`, CREATE: '/scheduling', UPDATE: (id) => `/scheduling/${id}`, DELETE: (id) => `/scheduling/${id}` };
export const MQTT        = { PUBLISH: '/mqtt/publish', SUBSCRIBE: '/mqtt/subscribe', STATUS: '/mqtt/status' };
export const LAYOUT_CONFIG = { GET: (b) => `/buildings/${b}/layout`, SAVE: (b) => `/buildings/${b}/layout` };
