import React, { useEffect, useState } from 'react';
import { handleCallback } from '../auth';

export default function CallbackPage() {
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const err = params.get('error');

    if (err) {
      setError(err + ': ' + (params.get('error_description') || ''));
      return;
    }

    if (!code) {
      setError('No authorization code received.');
      return;
    }

    handleCallback(code)
      .then(() => {
        window.location.pathname = '/projects';
      })
      .catch((e) => {
        setError(e.message);
      });
  }, []);

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', color: '#c0392b' }}>
          <p style={{ fontWeight: 600 }}>Authentication failed</p>
          <p style={{ fontSize: 14, color: '#666' }}>{error}</p>
          <a href="/login" style={{ color: '#C5A25E', fontWeight: 600 }}>Back to Login</a>
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
