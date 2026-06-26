const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || window.location.origin + '/callback';

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (b) => chars[b % chars.length]).join('');
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  return hash;
}

function base64urlEncode(buffer) {
  const bytes = new Uint8Array(buffer);
  let str = '';
  bytes.forEach((b) => { str += String.fromCharCode(b); });
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function initiateGoogleLogin() {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64urlEncode(hashed);

  sessionStorage.setItem('pkce_verifier', codeVerifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'openid email profile',
    identity_provider: 'Google',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  window.location.href = `https://${COGNITO_DOMAIN}/oauth2/authorize?${params}`;
}

export async function handleCallback(code) {
  const codeVerifier = sessionStorage.getItem('pkce_verifier');
  if (!codeVerifier) throw new Error('Missing PKCE verifier');

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code,
    code_verifier: codeVerifier,
  });

  const res = await fetch(`https://${COGNITO_DOMAIN}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error('Token exchange failed: ' + err);
  }

  const tokens = await res.json();
  sessionStorage.setItem('id_token', tokens.id_token);
  sessionStorage.setItem('access_token', tokens.access_token);
  sessionStorage.removeItem('pkce_verifier');

  return parseJwt(tokens.id_token);
}

function parseJwt(token) {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(json);
}

export function getUser() {
  const token = sessionStorage.getItem('id_token');
  if (!token) return null;
  try {
    return parseJwt(token);
  } catch {
    return null;
  }
}

export function logout() {
  sessionStorage.removeItem('id_token');
  sessionStorage.removeItem('access_token');

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    logout_uri: REDIRECT_URI.replace('/callback', '/login'),
  });
  window.location.href = `https://${COGNITO_DOMAIN}/logout?${params}`;
}
