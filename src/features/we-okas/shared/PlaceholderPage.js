import { useLocation } from 'react-router-dom';
import { TopNav, LeftNav } from './SharedNav';
import useAuthStore from '../../auth/authStore';

const ROLE_LABELS = {
  distributor: 'Distributor',
  si:          'System Integrator',
  pm:          'Project Manager',
  user:        'User',
  admin:       'Admin',
};

const PATH_LABELS = {
  'system-integrators': 'System Integrators',
  'projects':           'Projects',
  'members':            'Members',
  'roles':              'Roles & Permissions',
  'support':            'Support',
  'dashboard':          'Dashboard',
};

function getPageTitle(pathname) {
  const segment = pathname.split('/').filter(Boolean).pop();
  return PATH_LABELS[segment] ?? segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function PlaceholderPage() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  const roleLabel = ROLE_LABELS[user?.role] ?? 'Portal';
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="bg-white flex flex-col h-screen w-full overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <div className="bg-[#f4f7fb] flex-1 flex flex-col items-center justify-center gap-[12px]">
          <p className="font-medium text-[#5c7089] text-[12px] tracking-[2.4px] uppercase">
            {roleLabel} Portal
          </p>
          <p className="font-semibold text-[#0a1e3f] text-[40px] tracking-[-0.8px]">
            {pageTitle}
          </p>
          <p className="text-[#5c7089] text-[15px]">
            This section is coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
