import React, { useState } from 'react';
import { initiateGoogleLogin, getUser } from '../auth';
import '../styles/LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // Already logged in
  if (getUser()) {
    window.location.pathname = '/welcome';
    return null;
  }

  function handleGoogleSignIn() {
    initiateGoogleLogin();
  }

  function handleSendOtp(e) {
    e.preventDefault();
    if (!email) return;
    // OTP flow — to be implemented by dev team
    setOtpSent(true);
  }

  function handleOtpChange(value, index) {
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  function handleOtpKeyDown(e, index) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  function handleOtpLogin(e) {
    e.preventDefault();
    // OTP verification — to be implemented by dev team
    alert('OTP login coming soon! Please use Google Sign-In for now.');
  }

  return (
    <div className="login-root">
      {/* Left panel */}
      <div className="login-left">
        <div className="login-brand">
          <div className="brand-logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="#C5A25E" strokeWidth="2.5" fill="none"/>
              <path d="M16 30 L24 14 L32 30" stroke="#C5A25E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <line x1="18.5" y1="25" x2="29.5" y2="25" stroke="#C5A25E" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="brand-name">OKAS <span className="brand-signature">Signature</span></h1>
        </div>

        <div className="brand-hero">
          <div className="hero-icon">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <rect x="10" y="35" width="100" height="70" rx="8" fill="#1C1C1E" opacity="0.08"/>
              <rect x="20" y="42" width="80" height="56" rx="6" fill="#1C1C1E" opacity="0.05"/>
              <path d="M45 42 L60 20 L75 42" fill="#C5A25E" opacity="0.9"/>
              <rect x="50" y="70" width="20" height="28" rx="3" fill="#C5A25E" opacity="0.15"/>
              <circle cx="60" cy="58" r="6" fill="#C5A25E" opacity="0.6"/>
              <rect x="30" y="62" width="14" height="14" rx="2" fill="#C5A25E" opacity="0.25"/>
              <rect x="76" y="62" width="14" height="14" rx="2" fill="#C5A25E" opacity="0.25"/>
            </svg>
          </div>
          <p className="hero-tagline">Intelligent Luxury.<br/>Seamless Living.</p>
          <p className="hero-sub">Premium smart home automation,<br/>crafted for the discerning homeowner.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="login-right">
        <div className="login-card">
          {!otpSent ? (
            <>
              <h2 className="login-title">Welcome</h2>
              <p className="login-subtitle">Sign in to your OKAS Signature account</p>

              {/* Google Sign-In */}
              <button className="btn-google" onClick={handleGoogleSignIn}>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.2 33.9 29.6 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 1.1 8.1 2.9l6.4-6.4C34.6 5 29.6 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.2-2.7-.2-3z"/>
                  <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.1 19.2 13 24 13c3.1 0 6 1.1 8.1 2.9l6.4-6.4C34.6 5 29.6 3 24 3c-7.7 0-14.3 4.6-17.7 11.7z"/>
                  <path fill="#FBBC05" d="M24 43c5.4 0 10.2-1.8 13.9-4.9l-6.4-5.2C29.5 34.8 26.9 36 24 36c-5.5 0-10.2-3.5-11.8-8.4l-7 5.4C8.6 39.5 15.8 43 24 43z"/>
                  <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-1 3-3.4 5.3-6.3 6.8l6.4 5.2C40 37.4 44.5 30.7 44.5 23c0-1-.2-2-.2-3H44.5z"/>
                </svg>
                Continue with Google
              </button>

              <div className="divider"><span>or</span></div>

              {/* Email OTP */}
              <form onSubmit={handleSendOtp}>
                <label className="field-label">Email Address</label>
                <input
                  type="email"
                  className="field-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="btn-primary">
                  Continue with Email OTP
                </button>
              </form>

              <p className="login-note">
                By continuing, you agree to the{' '}
                <a href="/terms" className="link">Terms of Service</a> and{' '}
                <a href="/privacy" className="link">Privacy Policy</a>.
              </p>
            </>
          ) : (
            <>
              <button className="btn-back" onClick={() => setOtpSent(false)}>
                ← Back
              </button>
              <h2 className="login-title">Enter OTP</h2>
              <p className="login-subtitle">
                A 6-digit code was sent to<br/><strong>{email}</strong>
              </p>

              <form onSubmit={handleOtpLogin}>
                <div className="otp-row">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="otp-box"
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    />
                  ))}
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '2rem' }}>
                  Verify &amp; Sign In
                </button>
              </form>

              <p className="login-note" style={{ marginTop: '1.5rem' }}>
                Didn't receive the code?{' '}
                <button className="link-btn" onClick={() => setOtpSent(false)}>Resend OTP</button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
