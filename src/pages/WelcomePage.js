import React from 'react';
import { getUser, logout } from '../auth';

export default function WelcomePage() {
  const user = getUser();

  if (!user) {
    window.location.pathname = '/login';
    return null;
  }

  const name = user.name || user.email || 'there';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '3rem 3.5rem',
        textAlign: 'center',
        maxWidth: 480,
        boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
      }}>
        {user.picture && (
          <img
            src={user.picture}
            alt="profile"
            style={{ width: 72, height: 72, borderRadius: '50%', marginBottom: '1.5rem', border: '3px solid #C5A25E' }}
          />
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: '0.5rem' }}>
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="#C5A25E" strokeWidth="2.5" fill="none"/>
            <path d="M16 30 L24 14 L32 30" stroke="#C5A25E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <line x1="18.5" y1="25" x2="29.5" y2="25" stroke="#C5A25E" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: '#C5A25E' }}>OKAS Signature</span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1C1C1E', margin: '0.5rem 0 0.25rem' }}>
          Welcome, {name.split(' ')[0]}!
        </h1>
        <p style={{ color: '#888', fontSize: 14, marginBottom: '2rem' }}>
          {user.email}
        </p>

        <div style={{
          background: '#F8F6F2',
          borderRadius: 10,
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          borderLeft: '3px solid #C5A25E',
          textAlign: 'left',
        }}>
          <p style={{ color: '#444', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            Your smart home dashboard is being prepared.<br/>
            Our team is putting the finishing touches on your personalized experience.
          </p>
        </div>

        <button
          onClick={logout}
          style={{
            background: 'none',
            border: '1.5px solid #1C1C1E',
            borderRadius: 8,
            padding: '0.6rem 1.5rem',
            fontSize: 14,
            fontWeight: 600,
            color: '#1C1C1E',
            cursor: 'pointer',
            letterSpacing: 0.5,
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
