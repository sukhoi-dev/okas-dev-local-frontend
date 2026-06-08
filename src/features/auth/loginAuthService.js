const BASE_URL = '/api';

// ── Dev bypass ────────────────────────────────────────────────────────────────
const DEV_OTP = '123456';

const MOCK_USERS = {
  'admin@weokas.com':       { id: 1, name: 'Admin User',        email: 'admin@weokas.com',       role: 'admin',       password: 'admin@123', token: null                  },
  'pm@weokas.com':          { id: 2, name: 'PM User',           email: 'pm@weokas.com',          role: 'pm',          password: 'pm@123',    token: null                  },
  'distributor@weokas.com': { id: 2, name: 'Super Distributor Co.', email: 'distributor@weokas.com', role: 'distributor', password: 'dist@123', token: 'dist-dev-token-001' },
  'si@weokas.com':          { id: 4, name: 'SI User',           email: 'si@weokas.com',          role: 'si',          password: 'si@123',    token: null                  },
  'user@weokas.com':        { id: 5, name: 'End User',          email: 'user@weokas.com',        role: 'user',        password: 'user@123',  token: null                  },
};

function isMock(email) { return email in MOCK_USERS; }

// Try real API for token — use mock user data for role/id on frontend
async function getRealToken(endpoint, body) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.access_token) return data.access_token;
  } catch {}
  return null;
}
// ─────────────────────────────────────────────────────────────────────────────

export async function sendOtp(email) {
  if (isMock(email)) return;

  const res = await fetch(`${BASE_URL}/members/auth/otp/send`, {
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
    const mockUser = MOCK_USERS[email];
    const realToken = mockUser.token ?? await getRealToken('/members/auth/otp/verify', { email, otp });
    return { token: realToken ?? 'dev_mock_token', user: mockUser };
  }

  const res = await fetch(`${BASE_URL}/members/auth/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.detail || 'Invalid or expired OTP');
  return { token: data.access_token, user: null };
}

export async function loginWithPassword(email, password) {
  if (isMock(email)) {
    const mockUser = MOCK_USERS[email];
    if (password !== mockUser.password) throw new Error('Invalid password. Use ' + mockUser.password + ' for mock login.');
    const realToken = mockUser.token ?? await getRealToken('/members/auth/login/password', { email, password });
    return { token: realToken ?? 'dev_mock_token', user: mockUser };
  }

  const res = await fetch(`${BASE_URL}/members/auth/login/password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || 'Invalid email or password');
  return { token: data.access_token, user: null };
}
