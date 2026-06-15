const BASE_URL = '/api';

export async function sendOtp(email) {
  const res = await fetch(`${BASE_URL}/auth/otp/send`, {
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
  const res = await fetch(`${BASE_URL}/auth/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, keep_logged_in: false }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.detail || 'Invalid or expired OTP');

  return {
    sessionToken: data.token ?? null,
    accessToken:  data.access_token ?? null,
    user:         data.user ?? null,
    permissionsData: { flat: [], grouped: {} },
  };
}

export async function loginWithPassword(email, password) {
  const res = await fetch(`${BASE_URL}/members/auth/login/password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || 'Invalid email or password');

  return {
    sessionToken: null,
    accessToken:  data.access_token ?? null,
    user:         data.user ?? null,
    permissionsData: { flat: [], grouped: {} },
  };
}
