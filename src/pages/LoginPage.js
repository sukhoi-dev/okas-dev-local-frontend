import React, { useState } from 'react';
import { initiateGoogleLogin, getUser } from '../auth';
import '../styles/LoginPage.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

const OTP_ERROR_MESSAGES = {
  no_access:        'Your account has not been set up. Contact your OKAS administrator.',
  account_disabled: 'Your account is disabled. Contact your OKAS administrator.',
  invalid_otp:      'Incorrect code. Please check and try again.',
  otp_already_used: 'This code has already been used. Request a new one.',
  otp_expired:      'This code has expired. Please request a new one.',
  email_send_failed:'Unable to send email right now. Please try again.',
};

export default function LoginPage() {
  const [email, setEmail]           = useState('');
  const [otpSent, setOtpSent]       = useState(false);
  const [otp, setOtp]               = useState(['', '', '', '', '', '']);
  const [loading, setLoading]       = useState(false);
  const [fieldError, setFieldError] = useState('');

  if (getUser()) {
    window.location.pathname = '/projects';
    return null;
  }

  // ── Google sign-in ───────────────────────────────────────────
  function handleGoogleSignIn() {
    initiateGoogleLogin();
  }

  // ── Send OTP ─────────────────────────────────────────────────
  async function handleSendOtp(e) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setFieldError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) {
        setFieldError(OTP_ERROR_MESSAGES[json.detail] || json.detail || 'Failed to send OTP.');
        return;
      }
      setOtpSent(true);
    } catch {
      setFieldError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── OTP input helpers ─────────────────────────────────────────
  function handleOtpChange(value, index) {
    const next = [...otp];
    next[index] = value.replace(/\D/g, '').slice(-1);
    setOtp(next);
    setFieldError('');
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  function handleOtpKeyDown(e, index) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  function handleOtpPaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...otp];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    const lastFilled = Math.min(pasted.length, 5);
    document.getElementById(`otp-${lastFilled}`)?.focus();
  }

  // ── Verify OTP ────────────────────────────────────────────────
  async function handleOtpLogin(e) {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { setFieldError('Please enter all 6 digits.'); return; }
    setLoading(true);
    setFieldError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, otp: code }),
      });
      const json = await res.json();
      if (!res.ok) {
        setFieldError(OTP_ERROR_MESSAGES[json.detail] || json.detail || 'Verification failed.');
        return;
      }
      const data = json.data || {};
      sessionStorage.setItem('is_super_admin', data.is_super_admin ? 'true' : 'false');
      sessionStorage.setItem('user_roles', JSON.stringify(data.roles || []));
      sessionStorage.setItem('otp_session', JSON.stringify({
        email:   data.email   || email,
        name:    data.full_name || email,
        picture: null,
        sub:     data.email   || email,
      }));
      window.location.pathname = '/projects';
    } catch {
      setFieldError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="login-root">

      {/* ── Left panel: brand photo ── */}
      <div className="login-left">
        <div className="login-brand">
          <span className="brand-text">WE.OKAS</span>
        </div>

        <div className="login-left-footer">
          <span>© {new Date().getFullYear()} OKAS. All rights reserved.</span>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="login-right">
        <div className="login-card">
          {!otpSent ? (

            /* ── Sign-in form ── */
            <>
              <div className="login-header">
                <h2 className="login-title">Sign in</h2>
                <p className="login-subtitle">Welcome back to WE.OKAS</p>
              </div>

              {/* Google */}
              <button className="btn-google" onClick={handleGoogleSignIn} disabled={loading}>
                <GoogleIcon />
                Continue with Google
              </button>

              <div className="divider"><span>or sign in with email</span></div>

              {/* Email OTP form */}
              <form onSubmit={handleSendOtp}>
                <label className="field-label">Email address</label>
                <input
                  type="email"
                  className={`field-input ${fieldError ? 'field-input--error' : ''}`}
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldError(''); }}
                  required
                  autoComplete="email"
                />
                {fieldError && <p className="field-error">{fieldError}</p>}
                <button type="submit" className="btn-primary" disabled={loading || !email}>
                  {loading ? <Spinner /> : 'Send One-Time Password'}
                </button>
              </form>

              <p className="login-note">
                By continuing you agree to the{' '}
                <a href="/terms" className="link">Terms of Service</a> and{' '}
                <a href="/privacy" className="link">Privacy Policy</a>.
              </p>
            </>

          ) : (

            /* ── OTP verification ── */
            <>
              <button className="btn-back" onClick={() => { setOtpSent(false); setOtp(['','','','','','']); setFieldError(''); }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Back
              </button>

              <div className="login-header">
                <h2 className="login-title">Enter OTP</h2>
                <p className="login-subtitle">
                  We sent a 6-digit code to<br/>
                  <strong style={{ color: '#1C1C1E' }}>{email}</strong>
                </p>
              </div>

              <form onSubmit={handleOtpLogin}>
                <div className="otp-row" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className={`otp-box ${fieldError ? 'otp-box--error' : ''}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    />
                  ))}
                </div>
                {fieldError && <p className="field-error" style={{ textAlign: 'center', marginTop: 12 }}>{fieldError}</p>}

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ marginTop: '1.75rem' }}
                  disabled={loading || otp.join('').length !== 6}
                >
                  {loading ? <Spinner /> : 'Verify & Sign In'}
                </button>
              </form>

              <p className="login-note" style={{ marginTop: '1.5rem' }}>
                Didn't receive it?{' '}
                <button
                  className="link-btn"
                  onClick={() => { setOtpSent(false); setOtp(['','','','','','']); setFieldError(''); }}
                >
                  Resend OTP
                </button>
              </p>
            </>
          )}
        </div>
      </div>

    </div>
  );
}

// ── Inline SVG helpers ─────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.2 33.9 29.6 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 1.1 8.1 2.9l6.4-6.4C34.6 5 29.6 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.2-2.7-.2-3z"/>
      <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.1 19.2 13 24 13c3.1 0 6 1.1 8.1 2.9l6.4-6.4C34.6 5 29.6 3 24 3c-7.7 0-14.3 4.6-17.7 11.7z"/>
      <path fill="#FBBC05" d="M24 43c5.4 0 10.2-1.8 13.9-4.9l-6.4-5.2C29.5 34.8 26.9 36 24 36c-5.5 0-10.2-3.5-11.8-8.4l-7 5.4C8.6 39.5 15.8 43 24 43z"/>
      <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-1 3-3.4 5.3-6.3 6.8l6.4 5.2C40 37.4 44.5 30.7 44.5 23c0-1-.2-2-.2-3H44.5z"/>
    </svg>
  );
}

function Spinner() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        width: 16, height: 16, border: '2px solid rgba(255,255,255,0.35)',
        borderTopColor: '#fff', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite', display: 'inline-block',
      }}/>
      Processing…
    </span>
  );
}
