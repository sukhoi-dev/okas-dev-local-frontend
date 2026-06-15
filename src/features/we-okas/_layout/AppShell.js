import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home, Boxes, FolderOpen, Users, UserCheck,
  Headphones, HelpCircle, Bell, Search, Settings, LogOut,
} from 'lucide-react';
import { ROUTE_PATHS } from '../../../config/constants';
import useAuthStore from '../../auth/authStore';
import imgWeOkasLogo from '../../../assets/weOkasLogo.png';
import imgAvatar from '../../../assets/avatar.png';

// ── Nav items ─────────────────────────────────────────────────────────────────
// Items with `permission` are only rendered when that permission is present.
const NAV_ITEMS = [
  { name: 'Home',                 path: '/dashboard',                Icon: Home       },
  { name: 'System Integrators',   path: ROUTE_PATHS.WEOKAS_SIS,      Icon: Boxes,     permission: 'organizations.manage' },
  { name: 'Projects',             path: '/projects',  Icon: FolderOpen },
  { name: 'Members',              path: '/members',                   Icon: Users      },
  { name: 'Roles &\nPermissions', path: '/roles-permissions',         Icon: UserCheck  },
  { name: 'Support',              path: '#',                          Icon: Headphones },
];

// ── Top navigation ────────────────────────────────────────────────────────────
export function TopNav() {
  const navigate = useNavigate();
  const logout   = useAuthStore((s) => s.logout);
  const user     = useAuthStore((s) => s.user);
  const [ddOpen, setDdOpen] = useState(false);
  const ddRef = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleLogout = () => { logout(); navigate('/auth/login'); };

  return (
    <div className="bg-white flex gap-[24px] h-[64px] items-center px-[28px] shrink-0 w-full border-b border-[#f0f0f0] z-30">
      {/* Logo */}
      <div className="h-[20px] relative shrink-0 w-[130px]">
        <img alt="WE.OKAS" className="absolute inset-0 max-w-none object-contain size-full pointer-events-none" src={imgWeOkasLogo} />
      </div>
      <div className="flex-1" />

      {/* Search */}
      <div className="bg-[#f4f7fb] flex gap-[10px] h-[42px] items-center px-[16px] rounded-[6px] w-[440px]">
        <Search size={16} className="text-[#5c7089] shrink-0" />
        <span className="font-normal text-[#9bb0c7] text-[14px]">Search</span>
      </div>
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex gap-[16px] items-center shrink-0">
        <button className="size-[38px] flex items-center justify-center text-[#5c7089] hover:bg-[#f4f7fb] rounded-full transition-colors">
          <Bell size={19} strokeWidth={1.8} />
        </button>
        <div className="relative" ref={ddRef}>
          <button
            onClick={() => setDdOpen(!ddOpen)}
            className="size-[38px] rounded-full overflow-hidden border-2 border-transparent hover:border-[#0094AD] transition-colors"
          >
            <img alt="" src={imgAvatar} className="size-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }} />
          </button>
          <AnimatePresence>
            {ddOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-[46px] bg-white rounded-[10px] p-[8px] shadow-[0_8px_32px_rgba(10,30,63,0.12)] border border-[#e8edf3] min-w-[200px] z-50"
              >
                <div className="px-[14px] py-[10px] border-b border-[#f0f4f8] mb-[4px]">
                  <p className="text-[13px] font-semibold text-[#0a1e3f] leading-none mb-[3px]">{user?.full_name || 'User'}</p>
                  <p className="text-[12px] text-[#5c7089]">{user?.email || ''}</p>
                </div>
                <button onClick={() => setDdOpen(false)} className="w-full px-[14px] py-[10px] text-[13px] text-[#0a1e3f] rounded-[6px] hover:bg-[#f4f7fb] flex items-center gap-[10px] text-left">
                  <Settings size={15} /> Profile Settings
                </button>
                <button onClick={handleLogout} className="w-full px-[14px] py-[10px] text-[13px] text-red-600 rounded-[6px] hover:bg-[#fff5f5] flex items-center gap-[10px] text-left">
                  <LogOut size={15} /> Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Left sidebar (narrow, icon + label stacked) ───────────────────────────────
export function LeftNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const permissions = useAuthStore((s) => s.permissions);

  const isActive = (path) => pathname === path || (path !== '/dashboard' && pathname.startsWith(path));

  const visibleItems = NAV_ITEMS.filter(
    ({ permission }) => !permission || permissions.includes(permission)
  );

  return (
    <div className="bg-white shrink-0 w-[110px] border-r border-[#f0f0f0] flex flex-col h-full">

      {/* Nav items */}
      <div className="flex flex-col items-stretch pt-[16px] px-[8px] flex-1 gap-[2px]">
        {visibleItems.map(({ name, path, Icon }) => {
          const active = isActive(path);
          return (
            <button
              key={name}
              onClick={() => path !== '#' && navigate(path)}
              className={`flex flex-col items-center gap-[5px] py-[10px] px-[6px] rounded-[8px] transition-colors w-full ${active ? 'bg-[#eef3ff]' : 'hover:bg-[#f4f7fb]'}`}
            >
              <Icon
                size={20}
                className={active ? 'text-[#0a1e3f]' : 'text-[#8ea3bb]'}
                strokeWidth={active ? 2.2 : 1.6}
              />
              <span
                className={`text-center leading-tight text-[10px] whitespace-pre-line ${active ? 'font-semibold text-[#0a1e3f]' : 'text-[#8ea3bb]'}`}
                style={{ fontSize: 10 }}
              >
                {name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Help at bottom */}
      <div className="px-[8px] pb-[16px]">
        <button className="flex flex-col items-center gap-[5px] py-[10px] px-[6px] rounded-[8px] hover:bg-[#f4f7fb] transition-colors w-full">
          <HelpCircle size={20} className="text-[#8ea3bb]" strokeWidth={1.6} />
          <span className="text-[10px] text-[#8ea3bb]">Help</span>
        </button>
      </div>
    </div>
  );
}

// ── AppShell wrapper ──────────────────────────────────────────────────────────
export default function AppShell({ children }) {
  return (
    <div className="bg-white h-screen flex flex-col overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <main className="bg-[#f4f7fb] flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
