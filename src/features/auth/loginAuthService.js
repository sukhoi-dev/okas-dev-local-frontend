export const DEV_OTP_HINT = '123456';

const API_BASE = 'http://localhost:8000';

async function _post(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      json.message ||
      (json.body && json.body.message) ||
      'Authentication failed — check that the backend is running';
    throw new Error(msg);
  }
  return json;
}

async function _get(path, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json;
}

function _normaliseResponse(json) {
  const data = json.body;
  const rawUser = data.user;
  const roleName = rawUser.role?.name ?? rawUser.role ?? null;
  return {
    token: data.access_token,
    user: { ...rawUser, role: roleName },
  };
}

/**
 * Email + password login.
 * Step 1 — POST /we-okas/auth/login  → JWT + user profile
 * Step 2 — GET  /we-okas/auth/permissions  → full permissions (flat + grouped)
 */
export async function loginWithPassword(email, password) {
  const json      = await _post('/we-okas/auth/login', { email, password });
  const { token, user } = _normaliseResponse(json);
  const permsData = await fetchPermissions(token);
  return { token, user, permissionsData: permsData };
}

/**
 * Fetch full permissions for the given JWT.
 * Returns { flat: [...], grouped: { feature: [action, ...] } }
 */
export async function fetchPermissions(token) {
  try {
    const json = await _get('/we-okas/auth/permissions', token);
    return json.body?.permissions ?? { flat: [], grouped: {} };
  } catch {
    return { flat: [], grouped: {} };
  }
}

/**
 * "Send OTP" step — validates the email exists; no OTP email is sent in dev.
 */
export async function sendOtp(email) {
  await _post('/we-okas/auth/token', { email });
}

/**
 * "Verify OTP" step — OTP is not validated server-side in dev.
 * Step 1 — POST /we-okas/auth/token  → JWT + user profile
 * Step 2 — GET  /we-okas/auth/permissions  → full permissions (flat + grouped)
 */
export async function verifyOtp(email, _otp) {
  const json = await _post('/we-okas/auth/token', { email });
  const { token, user } = _normaliseResponse(json);
  const permsData = await fetchPermissions(token);
  return { token, user, permissionsData: permsData };
}
