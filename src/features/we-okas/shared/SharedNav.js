import { useState, useRef, useEffect, useCallback } from 'react';
import env from '../../../config/env';
import { useNavigate, useLocation } from 'react-router-dom';
import { Settings, LogOut, Home, Box, Folder, Users, ShieldCheck, Headphones, HelpCircle } from 'lucide-react';
import useAuthStore from '../../auth/authStore';
import svgPaths from '../project-managers/assets/svg-members';
import imgWeOkasLogo from '../../../assets/weOkasLogo.png';
import imgAvatar from '../../../assets/avatar.png';
import ProfileModal from '../_layout/ProfileModal';

// ── Nav items per role ────────────────────────────────────────────────────────
const NAV_CONFIG = {
  pm: [
    { name: 'Home',     path: '/dashboard', icon: Home       },
    { name: 'Projects', path: '/projects',  icon: Folder     },
    { name: 'Members',  path: '/members',   icon: Users      },
    { name: 'Support',  path: '/support',   icon: Headphones },
  ],
  distributor: [
    { name: 'Home',                 path: '/distributor/dashboard',          icon: Home        },
    { name: 'System\nIntegrators',  path: '/distributor/system-integrators', icon: Box         },
    { name: 'Projects',             path: '/distributor/projects',           icon: Folder      },
    { name: 'Members',              path: '/distributor/members',            icon: Users       },
    { name: 'Roles &\nPermissions', path: '/distributor/roles',              icon: ShieldCheck },
    { name: 'Support',              path: '/distributor/support',            icon: Headphones  },
  ],
  si: [
    { name: 'Home',                 path: '/si/dashboard', icon: Home        },
    { name: 'Projects',             path: '/si/projects',  icon: Folder      },
    { name: 'Members',              path: '/si/members',   icon: Users       },
    { name: 'Roles &\nPermissions', path: '/si/roles',     icon: ShieldCheck },
    { name: 'Support',              path: '/si/support',   icon: Headphones  },
  ],
  user: [
    { name: 'Home',     path: '/user/dashboard', icon: Home       },
    { name: 'Projects', path: '/user/projects',  icon: Folder     },
    { name: 'Support',  path: '/user/support',   icon: Headphones },
  ],
};

// ── Derive list-page path from role + result type ────────────────────────────
function getResultPath(role, type) {
  const items = NAV_CONFIG[role] ?? NAV_CONFIG.pm;
  const label = type === 'Project' ? 'Projects' : 'Members';
  return items.find(i => i.name === label)?.path ?? null;
}
// ─────────────────────────────────────────────────────────────────────────────


export function TopNav() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const homePath = (NAV_CONFIG[user?.role] ?? NAV_CONFIG.pm)[0].path;

  // Avatar dropdown
  const [avatarOpen, setAvatarOpen]     = useState(false);
  const [profileOpen, setProfileOpen]   = useState(false);
  const avatarRef                        = useRef(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen]   = useState(false);
  const searchRef                      = useRef(null);

  // Notifications
  const [notifOpen, setNotifOpen]     = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New project assigned', message: 'You have been assigned to Solar Farm – Phase 2.', time: '2 min ago', read: false },
    { id: 2, title: 'Member added', message: 'Ravi Kumar joined your organisation as a Technician.', time: '1 hr ago', read: false },
    { id: 3, title: 'Project status updated', message: 'Rooftop Install – Block C moved to In Progress.', time: '3 hrs ago', read: false },
    { id: 4, title: 'Support ticket resolved', message: 'Ticket #1042 has been marked as resolved.', time: 'Yesterday', read: true },
    { id: 5, title: 'Role changed', message: 'Priya Mehta\'s role was updated to Project Manager.', time: '2 days ago', read: true },
  ]);
  const notifRef                       = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const [filteredResults, setFilteredResults] = useState([]);
  const [searchLoading, setSearchLoading]     = useState(false);

  const fetchResults = useCallback(async (query) => {
    if (!query || query.trim().length < 2) { setFilteredResults([]); return; }
    setSearchLoading(true);

    const token = localStorage.getItem('okas_jwt_token') || localStorage.getItem(env.AUTH_TOKEN_KEY);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const base = env.API_BASE_URL;

    const safeFetch = async (url) => {
      try {
        const res = await fetch(url, { headers });
        if (!res.ok) return null;
        return res.json();
      } catch { return null; }
    };

    try {
      const [projectsData, membersData] = await Promise.all([
        safeFetch(`${base}/we-okas/projects?search=${encodeURIComponent(query)}`),
        safeFetch(`${base}/we-okas/members?search=${encodeURIComponent(query)}`),
      ]);

      const projects = projectsData?.body?.projects ?? projectsData?.projects ?? [];
      const members  = membersData?.body ?? membersData?.data ?? (Array.isArray(membersData) ? membersData : []);

      setFilteredResults([
        ...projects.slice(0, 5).map(p => ({
          type: 'Project',
          name: p.name || '—',
          sub:  p.address || '—',
        })),
        ...members.slice(0, 5).map(m => ({
          type:  'Member',
          name:  m.full_name || m.name || '—',
          sub:   m.role_name || (typeof m.role === 'string' ? m.role : m.role?.name) || '—',
          email: m.email || '',
        })),
      ]);
    } catch {
      setFilteredResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchResults(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchResults]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (notifRef.current  && !notifRef.current.contains(e.target))  setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/auth/login');
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="bg-white flex gap-[32px] h-[72px] items-center px-[32px] shrink-0 w-full border-b border-[#f0f0f0]">

      {/* Logo */}
      <button onClick={() => navigate(homePath)} className="h-[21px] relative shrink-0 w-[140px] cursor-pointer">
        <img alt="WE.OKAS" className="absolute inset-0 max-w-none object-contain size-full" src={imgWeOkasLogo} />
      </button>

      <div className="flex-1 h-px min-w-px relative" />

      {/* Search */}
      <div className="relative shrink-0 w-[480px]" ref={searchRef}>
        <div className="bg-[#f4f7fb] flex gap-[12px] h-[44px] items-center px-[16px] rounded-[4px] w-full">
          <div className="relative shrink-0 size-[20px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <path d={svgPaths.p204aec00} stroke="#5C7089" strokeWidth="1.4" />
              <path d="M13 13L16.5 16.5" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search projects, members..."
            className="flex-1 bg-transparent border-none outline-none text-[#0a1e3f] text-[14px] placeholder:text-[#5c7089]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-[#5c7089] hover:text-[#0a1e3f] text-[18px] leading-none">×</button>
          )}
        </div>

        {/* Search dropdown */}
        {searchOpen && (
          <div className="absolute top-[50px] left-0 w-full bg-white rounded-[8px] shadow-[0px_8px_32px_0px_rgba(10,30,63,0.12)] border border-[#e2e2e2] z-50 overflow-hidden">
            <div className="px-[16px] py-[10px] border-b border-[#f0f0f0]">
              <p className="text-[11px] font-medium text-[#5c7089] tracking-[1.6px] uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
                {searchQuery ? 'Results' : 'Recent'}
              </p>
            </div>
            {searchLoading ? (
              <div className="px-[16px] py-[20px] flex justify-center">
                <div className="size-[20px] rounded-full border-[2px] border-[#e2e2e2] border-t-[#0a1e3f] animate-spin" />
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="px-[16px] py-[20px] text-center">
                <p className="text-[14px] text-[#5c7089]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {searchQuery.length >= 2 ? 'No results found' : 'Type at least 2 characters to search'}
                </p>
              </div>
            ) : (
              filteredResults.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const path = getResultPath(user?.role, item.type);
                    if (path) navigate(path);
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full flex items-center gap-[12px] px-[16px] py-[12px] hover:bg-[#f4f7fb] transition-colors text-left"
                >
                  <div className={`shrink-0 size-[32px] rounded-[6px] flex items-center justify-center text-[11px] font-semibold ${item.type === 'Project' ? 'bg-[#edf2f7] text-[#0a1e3f]' : 'bg-[#f0fdf4] text-[#16a34a]'}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    {item.type === 'Project' ? 'PR' : 'MB'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-[14px] font-medium text-[#0a1e3f] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</p>
                    <p className="text-[12px] text-[#5c7089] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{item.sub}</p>
                    {item.email && (
                      <p className="text-[11px] text-[#9aacbf] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{item.email}</p>
                    )}
                  </div>
                  <span className="ml-auto shrink-0 text-[11px] text-[#5c7089] bg-[#f4f7fb] px-[8px] py-[2px] rounded-[4px]"
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    {item.type}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="flex-1 h-px min-w-px relative" />

      <div className="flex gap-[20px] items-center shrink-0">

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex items-center justify-center shrink-0 size-[40px] hover:bg-[#f4f7fb] rounded-[8px] transition-colors"
          >
            <div className="relative shrink-0 size-[20px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                <path d={svgPaths.p100568f2} stroke="#0A1E3F" strokeLinejoin="round" strokeWidth="1.4" />
                <path d={svgPaths.p3c26a500} stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.4" />
              </svg>
            </div>
            {unreadCount > 0 && (
              <span className="absolute top-[6px] right-[6px] size-[8px] bg-red-500 rounded-full" />
            )}
          </button>

          {/* Notifications dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-[48px] w-[360px] bg-white rounded-[12px] shadow-[0px_8px_32px_0px_rgba(10,30,63,0.14)] border border-[#e2e2e2] z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#f0f0f0]">
                <div className="flex items-center gap-[8px]">
                  <p className="text-[15px] font-semibold text-[#0a1e3f]" style={{ fontFamily: 'Inter, sans-serif' }}>Notifications</p>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[11px] font-semibold rounded-full px-[7px] py-[1px]"
                      style={{ fontFamily: 'Inter, sans-serif' }}>
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[12px] text-[#5c7089] hover:text-[#0a1e3f] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    Mark all as read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-[380px] overflow-y-auto">
                {notifications.map((notif, i) => (
                  <button
                    key={notif.id}
                    onClick={() => markRead(notif.id)}
                    className={`w-full flex items-start gap-[12px] px-[20px] py-[14px] hover:bg-[#f4f7fb] transition-colors text-left border-b border-[#f0f0f0] last:border-0 ${!notif.read ? 'bg-[#fafcff]' : ''}`}
                  >
                    {/* Unread dot */}
                    <div className="shrink-0 mt-[6px]">
                      {notif.read
                        ? <div className="size-[8px] rounded-full bg-transparent" />
                        : <div className="size-[8px] rounded-full bg-[#0a1e3f]" />
                      }
                    </div>
                    <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                      <p className={`text-[13px] truncate ${notif.read ? 'font-normal text-[#5c7089]' : 'font-semibold text-[#0a1e3f]'}`}
                        style={{ fontFamily: 'Inter, sans-serif' }}>
                        {notif.title}
                      </p>
                      <p className="text-[12px] text-[#5c7089] leading-[1.4]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {notif.message}
                      </p>
                      <p className="text-[11px] text-[#9aacbf] mt-[2px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {notif.time}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar dropdown */}
        <div className="relative" ref={avatarRef}>
          <button
            onClick={() => setAvatarOpen(!avatarOpen)}
            className="shrink-0 size-[40px] cursor-pointer rounded-full hover:opacity-80 transition-opacity outline-none overflow-hidden border-0 block"
          >
            <img
              alt="User avatar"
              className="block size-full rounded-full object-cover"
              src={imgAvatar}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.style.background = '#0a1e3f';
              }}
            />
          </button>

          {avatarOpen && (
            <div className="absolute right-0 top-[48px] bg-white rounded-[8px] p-[8px] shadow-[0px_8px_32px_0px_rgba(10,30,63,0.12)] border border-[#e2e2e2] min-w-[200px] z-50">
              <button
                onClick={() => { setAvatarOpen(false); setProfileOpen(true); }}
                className="w-full px-[16px] py-[12px] text-[14px] text-[#0a1e3f] rounded-[4px] hover:bg-[#f4f7fb] font-['Inter:Regular',sans-serif] flex items-center gap-[12px] text-left"
              >
                <Settings size={16} />
                Profile Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-[16px] py-[12px] text-[14px] text-red-600 rounded-[4px] hover:bg-[#f4f7fb] font-['Inter:Regular',sans-serif] flex items-center gap-[12px] text-left"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          )}
        </div>

      </div>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}

export function LeftNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  const navItems = NAV_CONFIG[user?.role] ?? NAV_CONFIG.pm;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white flex flex-col h-full items-center py-[16px] shrink-0 w-[90px] border-r border-[#f0f0f0]">
      <div className="flex flex-col items-center w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-[4px] w-full py-[10px] px-[8px] group"
            >
              <div className={`flex items-center justify-center rounded-[10px] size-[44px] transition-colors ${active ? 'bg-[#edf2f7]' : 'group-hover:bg-[#f4f7fb]'}`}>
                <Icon size={20} color={active ? '#0a1e3f' : '#5c7089'} strokeWidth={1.5} />
              </div>
              <p
                className={`text-[10px] font-medium text-center leading-[1.3] w-full whitespace-pre-line ${active ? 'text-[#0a1e3f]' : 'text-[#5c7089]'}`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {item.name}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex-1" />

      <div className="w-full px-[12px] mb-[8px]">
        <div className="h-px bg-[#e8ecf0]" />
      </div>

      <button className="flex flex-col items-center gap-[4px] w-full py-[10px] px-[8px] group">
        <div className="flex items-center justify-center size-[44px] rounded-[10px] group-hover:bg-[#f4f7fb] transition-colors">
          <HelpCircle size={20} color="#5c7089" strokeWidth={1.5} />
        </div>
        <p className="text-[10px] font-medium text-center text-[#5c7089]" style={{ fontFamily: 'Inter, sans-serif' }}>Help</p>
      </button>
    </div>
  );
}
