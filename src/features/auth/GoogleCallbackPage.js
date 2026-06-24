import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleGoogleCallback } from './googleAuth';
import useAuthStore from './authStore';
import env from '../../config/env';

const ERROR_MESSAGES = {
  no_access:        'Your account has not been set up yet. Please contact your OKAS administrator to get access.',
  account_disabled: 'Your account has been disabled. Please contact your OKAS administrator.',
};

function getRoleRedirectPath(user) {
  if (user?.is_super_admin)             return '/we-okas/dashboard';
  if (user?.org_type === 'distributor') return '/distributor/dashboard';
  if (user?.org_type === 'si')          return '/si/dashboard';
  switch (user?.role) {
    case 'admin':            return '/we-okas/dashboard';
    case 'Viewer':           return '/user/dashboard';
    case 'Project Manager':
    default:                 return '/dashboard';
  }
}

export default function GoogleCallbackPage() {
  const navigate   = useNavigate();
  const storeLogin = useAuthStore((s) => s.login);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code   = params.get('code');
    const err    = params.get('error');

    if (err) {
      setError(err + ': ' + (params.get('error_description') || ''));
      return;
    }
    if (!code) {
      setError('No authorization code received.');
      return;
    }

    handleGoogleCallback(code)
      .then(async ({ cognitoUser, accessToken }) => {
        const res = await fetch(`${env.API_BASE_URL}/auth/verify`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email: cognitoUser.email }),
        });

        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json.detail || json.message || 'no_access');
        }

        const json = await res.json();
        const raw  = json.data;
        // Super admins come from SSM without a role field — synthesize 'admin' so RBAC works
        const user = raw.is_super_admin ? { ...raw, role: 'admin' } : raw;
        // Permissions are fetched lazily by authStore.refreshPermissions on mount
        storeLogin(user, accessToken, [], {});
        navigate(getRoleRedirectPath(user), { replace: true });
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    const friendly      = ERROR_MESSAGES[error] || error;
    const isAccessDenied = error === 'no_access' || error === 'account_disabled';
    return (
      <div className="flex items-center justify-center h-screen bg-[#f4f7fb]">
        <div className="text-center max-w-[420px] bg-white rounded-[12px] px-[32px] py-[40px] shadow-md">
          <div className={`w-[56px] h-[56px] rounded-full flex items-center justify-center mx-auto mb-[20px] ${isAccessDenied ? 'bg-[#FFF8EC]' : 'bg-[#FFF0F0]'}`}>
            {isAccessDenied
              ? <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#C5A25E" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              : <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#D93025" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            }
          </div>
          <p className="font-semibold text-[17px] text-[#0a1e3f] mb-[10px]">
            {isAccessDenied ? 'Access Denied' : 'Sign-in Failed'}
          </p>
          <p className="text-[14px] text-[#5c7089] leading-[1.6] mb-[28px]">{friendly}</p>
          <button
            onClick={() => navigate('/auth/login', { replace: true })}
            className="bg-[#0a1e3f] text-white text-[14px] font-semibold px-[28px] py-[10px] rounded-[6px] hover:bg-[#0a2a5a] transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#f4f7fb]">
      <div className="text-center">
        <div className="w-[40px] h-[40px] border-[3px] border-[#0a1e3f] border-t-transparent rounded-full animate-spin mx-auto mb-[16px]" />
        <p className="text-[#5c7089] text-[14px]">Signing you in…</p>
      </div>
    </div>
  );
}
