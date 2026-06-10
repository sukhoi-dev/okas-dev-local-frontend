// ── Dev bypass ────────────────────────────────────────────────────────────────
const DEV_OTP = '123456';

const MOCK_USERS = {
  'admin@weokas.com':       { id: 1, full_name: 'Admin User',           email: 'admin@weokas.com',       role: 'admin',       password: 'admin@123' },
  'pm@weokas.com':          { id: 2, full_name: 'PM User',              email: 'pm@weokas.com',          role: 'pm',          password: 'pm@123'    },
  'distributor@weokas.com': { id: 3, full_name: 'Super Distributor Co.',email: 'distributor@weokas.com', role: 'distributor', password: 'dist@123'  },
  'si@weokas.com':          { id: 4, full_name: 'SI User',              email: 'si@weokas.com',          role: 'si',          password: 'si@123'    },
  'user@weokas.com':        { id: 5, full_name: 'End User',             email: 'user@weokas.com',        role: 'user',        password: 'user@123'  },
};

function isMock(email) { return email in MOCK_USERS; }
// ─────────────────────────────────────────────────────────────────────────────

export async function sendOtp(email) {
  if (isMock(email)) return;

  const res = await fetch('/auth/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || data.detail || 'Failed to send OTP');
  }
}

export async function verifyOtp(email, otp, keepLoggedIn = false) {
  if (isMock(email)) {
    if (otp !== DEV_OTP) throw new Error('Invalid OTP. Use ' + DEV_OTP + ' for mock login.');
    return { token: 'dev_mock_token', user: MOCK_USERS[email] };
  }

  const res = await fetch('/auth/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, keep_logged_in: keepLoggedIn }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.detail || 'Invalid or expired OTP');
  return { token: data.token, user: data.user };
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

export async function loginWithPassword(email, password) {
  if (isMock(email)) {
    const mockUser = MOCK_USERS[email];
    if (password !== mockUser.password) throw new Error('Invalid password. Use ' + mockUser.password + ' for mock login.');
    return { token: 'dev_mock_token', user: mockUser };
  }

  const res = await fetch('/api/auth/login/password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || 'Invalid email or password');
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
