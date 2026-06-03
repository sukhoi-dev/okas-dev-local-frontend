const BASE_URL = '/api';

// ── Dev bypass ────────────────────────────────────────────────────────────────
const DEV_EMAIL    = 'pm@weokas.com';
const DEV_PASSWORD = 'pm@123';
const DEV_OTP      = '123456';
const DEV_TOKEN    = 'dev_mock_token';
const DEV_USER     = { id: 'dev-001', name: 'PM User', email: DEV_EMAIL, role: 'admin' };

function isMock(email) {
  return email === DEV_EMAIL;
}
// ─────────────────────────────────────────────────────────────────────────────

export async function sendOtp(email) {
  if (isMock(email)) return; // skip real API for dev credentials

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
    if (otp === DEV_OTP) return { token: DEV_TOKEN, user: DEV_USER };
    throw new Error('Invalid OTP. Use ' + DEV_OTP + ' for dev login.');
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
    if (password === DEV_PASSWORD) return { token: DEV_TOKEN, user: DEV_USER };
    throw new Error('Invalid password. Use ' + DEV_PASSWORD + ' for dev login.');
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
