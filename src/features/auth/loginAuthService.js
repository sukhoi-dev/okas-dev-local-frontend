import env from '../../config/env';

const BASE_URL = env.API_BASE_URL;

async function fetchPermissions(accessToken) {
  try {
    const res = await fetch(`${BASE_URL}/auth/permissions`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return { flat: [], grouped: {} };
    const data = await res.json().catch(() => ({}));
    return data.permissions ?? { flat: [], grouped: {} };
  } catch {
    return { flat: [], grouped: {} };
  }
}

export async function sendOtp(email) {
  const res = await fetch(`${BASE_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || data.detail || 'Failed to send OTP');
  }
  if (data.otp) {
    alert(`OTP: ${data.otp}`);
  }
}

export async function verifyOtp(email, otp) {
  const params = new URLSearchParams({ email, otp, keep_logged_in: false });
  const res = await fetch(`${BASE_URL}/auth/verify-otp?${params}`);
  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.success) {
    throw new Error(data.message || data.detail || 'Invalid or expired OTP');
  }

  return {
    org_type:        data.org_type ?? null,
    email:           data.email ?? email,
    organization_id: data.organization_id ?? null,
    access_token:    data.access_token ?? null,
  };
}

export async function loginWithPassword(email, password) {
  const res = await fetch(`${BASE_URL}/members/auth/login/password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || json.detail || 'Invalid email or password');

  const accessToken    = data.access_token ?? null;
  const permissionsData = accessToken ? await fetchPermissions(accessToken) : { flat: [], grouped: {} };

  return {
    sessionToken: null,
    accessToken,
    user:         data.user ?? null,
    permissionsData,
  };
}
