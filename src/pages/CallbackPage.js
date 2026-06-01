import React, { useEffect, useState } from 'react';
import { handleCallback } from '../auth';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const ERROR_MESSAGES = {
  no_access:        'Your account has not been set up yet. Please contact your OKAS administrator to get access.',
  account_disabled: 'Your account has been disabled. Please contact your OKAS administrator.',
};

export default function CallbackPage() {
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const err  = params.get('error');

    if (err) {
      setError(err + ': ' + (params.get('error_description') || ''));
      return;
    }

    if (!code) {
      setError('No authorization code received.');
      return;
    }

    handleCallback(code)
      .then(async (cognitoUser) => {
        // Gate: check the authenticated email exists in app_users
        const res = await fetch(`${API_BASE}/api/auth/verify`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email: cognitoUser.email }),
        });

        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          const detail = json.detail || 'no_access';
          throw new Error(detail);
        }

        const json = await res.json();
        const isSuperAdmin = json.data?.is_super_admin === true;
        sessionStorage.setItem('is_super_admin', isSuperAdmin ? 'true' : 'false');

        window.location.pathname = '/projects';
      })
      .catch((e) => {
        setError(e.message);
      });
  }, []);

  if (error) {
    const friendly = ERROR_MESSAGES[error] || error;
    const isAccessDenied = error === 'no_access' || error === 'account_disabled';
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#F5F5F5' }}>
        <div style={{ textAlign: 'center', maxWidth: 420, padding: '40px 32px', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.09)' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: isAccessDenied ? '#FFF8EC' : '#FFF0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            {isAccessDenied
              ? <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#C5A25E" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              : <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#D93025" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            }
          </div>
          <p style={{ fontWeight: 700, fontSize: 17, color: '#1C1C1E', margin: '0 0 10px' }}>
            {isAccessDenied ? 'Access Denied' : 'Sign-in Failed'}
          </p>
          <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, margin: '0 0 28px' }}>{friendly}</p>
          <a href="/login" style={{ display: 'inline-block', background: '#1C1C1E', color: '#fff', padding: '10px 28px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #C5A25E', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#666', fontSize: 14 }}>Signing you in…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
