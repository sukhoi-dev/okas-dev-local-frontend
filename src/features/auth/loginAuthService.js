export const DEV_OTP_HINT = '123456';

const BASE_URL = '/api';

// ── Dev bypass ────────────────────────────────────────────────────────────────
const DEV_OTP = '123456';

const MOCK_USERS = {
  'admin@weokas.com':       { id: 1, name: 'Admin User',            email: 'admin@weokas.com',       role: 'admin',       password: 'admin@123' },
  'pm@weokas.com':          { id: 2, name: 'PM User',               email: 'pm@weokas.com',          role: 'pm',          password: 'pm@123'    },
  'distributor@weokas.com': { id: 3, name: 'Super Distributor Co.', email: 'distributor@weokas.com', role: 'distributor', password: 'dist@123'  },
  'si@weokas.com':          { id: 4, name: 'SI User',               email: 'si@weokas.com',          role: 'si',          password: 'si@123'    },
  'user@weokas.com':        { id: 5, name: 'End User',              email: 'user@weokas.com',        role: 'user',        password: 'user@123'  },
};

function isMock(email) { return email in MOCK_USERS; }
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchPermissions(token) {
  try {
    const res = await fetch(`${BASE_URL}/we-okas/auth/permissions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { flat: [], grouped: {} };
    return json.body?.permissions ?? { flat: [], grouped: {} };
  } catch {
    return { flat: [], grouped: {} };
  }
}

export async function sendOtp(email) {
  if (isMock(email)) return;

  const res = await fetch(`/auth/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || data.detail || 'Failed to send OTP');
  }
}

export async function verifyOtp(email, otp) {
  if (isMock(email)) {
    if (otp !== DEV_OTP) throw new Error('Invalid OTP. Use ' + DEV_OTP + ' for mock login.');
    return { token: 'dev_mock_token', user: MOCK_USERS[email], permissionsData: { flat: [], grouped: {} } };
  }

  const res = await fetch(`/auth/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.detail || 'Invalid or expired OTP');

  const token = data.token;             // session token — used for /auth/me
  const jwt   = data.access_token;      // JWT — used for JWT-protected routes
  if (jwt) localStorage.setItem('okas_jwt_token', jwt);
  const permissionsData = await fetchPermissions(jwt);
  return { token, user: data.user ?? null, permissionsData };
}

export async function loginWithPassword(email, password) {
  if (isMock(email)) {
    const mockUser = MOCK_USERS[email];
    if (password !== mockUser.password) throw new Error('Invalid password. Use ' + mockUser.password + ' for mock login.');
    return { token: 'dev_mock_token', user: mockUser, permissionsData: { flat: [], grouped: {} } };
  }

  // Hit the real we-okas backend: POST /we-okas/auth/login
  const res = await fetch(`${BASE_URL}/we-okas/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || json.detail || 'Invalid email or password');

  // Backend envelope: { body: { access_token, user: { ..., role: { name } } } }
  const body     = json.body ?? json;
  const token    = body.access_token;
  const rawUser  = body.user ?? null;
  const roleName = rawUser?.role?.name ?? rawUser?.role ?? null;
  const user     = rawUser ? { ...rawUser, role: roleName } : null;

  // Store for weOkasClient interceptor
  if (token) localStorage.setItem('okas_jwt_token', token);

  const permissionsData = await fetchPermissions(token);
  return { token, user, permissionsData };
}

export async function loginWithGoogle(access_token, keepLoggedIn = false) {
  const res = await fetch('/auth/google/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token, keep_logged_in: keepLoggedIn }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || 'Google sign-in failed');
  return { token: data.token, user: data.user };
}

export async function validateSession() {
  const token = localStorage.getItem('okas_access_token') || sessionStorage.getItem('okas_access_token');
  if (!token) return null;
  const res = await fetch('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  return data?.user ?? null;
}

export async function logoutUser() {
  const token = localStorage.getItem('okas_access_token') || sessionStorage.getItem('okas_access_token');
  if (!token) return;
  await fetch('/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {});
}
