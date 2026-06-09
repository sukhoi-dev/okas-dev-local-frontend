import React, { useEffect, useState } from 'react';
import { getUser, getUserRole, logout } from '../auth';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

// ── Role display metadata ─────────────────────────────────────
const ROLE_META = {
  super_admin:       { label: 'Super Admin',     bg: '#FFF8EC', color: '#92620B', border: '#F6D58A' },
  distributor_admin: { label: 'Distributor',      bg: '#FDE8F5', color: '#8B1A6B', border: '#F0A8D8' },
  si_admin:          { label: 'SI Admin',          bg: '#E6F0FF', color: '#1A4B8B', border: '#A3C1F8' },
  project_manager:   { label: 'Project Manager',  bg: '#F0E6FF', color: '#5B1A8B', border: '#C4A3F8' },
  programmer:        { label: 'Programmer',        bg: '#E6FFEE', color: '#1A6B34', border: '#86E8A7' },
};

// ── Sidebar nav items with role-based visibility ───────────────
// minRole: minimum role that can see this item (index in hierarchy)
const ROLE_HIERARCHY = ['super_admin', 'distributor_admin', 'si_admin', 'project_manager', 'programmer'];

function roleIndex(role) {
  const i = ROLE_HIERARCHY.indexOf(role);
  return i === -1 ? 999 : i;
}

const NAV_ITEMS = [
  {
    label: 'Home',
    path:  '/projects',
    icon:  <HomeIcon />,
    minRoleIdx: 0, // all roles
  },
  {
    label: 'System Integrators',
    path:  '/system-integrators',
    icon:  <BoxIcon />,
    minRoleIdx: 1, // distributor_admin and above
  },
  {
    label: 'Projects',
    path:  '/projects',
    icon:  <FolderIcon />,
    minRoleIdx: 0,
  },
  {
    label: 'Members',
    path:  '/members',
    icon:  <UsersIcon />,
    minRoleIdx: 2, // si_admin and above
  },
  {
    label: 'Roles & Permissions',
    path:  '/roles',
    icon:  <RolesIcon />,
    minRoleIdx: 2,
  },
  {
    label: 'Support',
    path:  '/support',
    icon:  <SupportIcon />,
    minRoleIdx: 0,
  },
];

export default function ProjectsPage() {
  const user    = getUser();
  const role    = getUserRole();
  const roleIdx = roleIndex(role);

  const [projects, setProjects]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState('');

  useEffect(() => {
    if (!user) { window.location.pathname = '/login'; return; }
    fetch(`${API_BASE}/api/projects`)
      .then(r => r.json())
      .then(res => { setProjects(res.data || []); setLoading(false); })
      .catch(e  => { setError(e.message); setLoading(false); });
  }, [user]);

  if (!user) return null;

  const filtered = projects.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (p.owner_name   || '').toLowerCase().includes(q) ||
      (p.address      || '').toLowerCase().includes(q) ||
      (p.serial_number|| '').toLowerCase().includes(q) ||
      (p.manager_name || '').toLowerCase().includes(q)
    );
  });

  const filteredNav = NAV_ITEMS.filter(n => roleIdx <= n.minRoleIdx || role === 'super_admin');

  return (
    <div style={styles.root}>

      {/* ── Top Header ── */}
      <header style={styles.header}>
        {/* Logo */}
        <div style={styles.headerLogo}>
          <WeOkasLogo />
          <span style={styles.logoText}>We.OKAS</span>
        </div>

        {/* Search */}
        <div style={styles.searchWrap}>
          <svg style={styles.searchIcon} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9BA8B7" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            style={styles.searchInput}
            placeholder="Search projects…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Right: role badge + bell + avatar */}
        <div style={styles.headerRight}>
          {role && ROLE_META[role] && (
            <span style={{
              ...styles.roleBadge,
              background:   ROLE_META[role].bg,
              color:        ROLE_META[role].color,
              border:       `1px solid ${ROLE_META[role].border}`,
            }}>
              {ROLE_META[role].label}
            </span>
          )}

          {/* Bell */}
          <button style={styles.iconBtn} title="Notifications">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.8">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </button>

          {/* Avatar + dropdown */}
          <div style={{ position: 'relative' }}>
            <AvatarMenu user={user} />
          </div>
        </div>
      </header>

      {/* ── Body: sidebar + content ── */}
      <div style={styles.body}>

        {/* ── Sidebar ── */}
        <aside style={styles.sidebar}>
          <nav style={styles.nav}>
            {filteredNav.map(item => {
              const active = (window.location.pathname === item.path &&
                (item.path !== '/projects' || item.label === 'Home')) ||
                (window.location.pathname === '/projects' && item.label === 'Home');
              return (
                <button
                  key={item.label}
                  style={{
                    ...styles.navItem,
                    ...(active ? styles.navItemActive : {}),
                  }}
                  onClick={() => { window.location.pathname = item.path; }}
                  title={item.label}
                >
                  <span style={{ color: active ? '#1A4B8B' : '#6B7A90', lineHeight: 0 }}>
                    {item.icon}
                  </span>
                  <span style={{ ...styles.navLabel, color: active ? '#1A4B8B' : '#6B7A90', fontWeight: active ? 600 : 400 }}>
                    {item.label}
                  </span>
                </button>
              );
            })}

            {/* Admin link for super_admin */}
            {role === 'super_admin' && (
              <button
                style={{
                  ...styles.navItem,
                  ...(window.location.pathname === '/admin' ? styles.navItemActive : {}),
                }}
                onClick={() => { window.location.pathname = '/admin'; }}
                title="User Management"
              >
                <span style={{ color: window.location.pathname === '/admin' ? '#1A4B8B' : '#6B7A90', lineHeight: 0 }}>
                  <AdminIcon />
                </span>
                <span style={{ ...styles.navLabel, color: window.location.pathname === '/admin' ? '#1A4B8B' : '#6B7A90', fontWeight: window.location.pathname === '/admin' ? 600 : 400 }}>
                  User Mgmt
                </span>
              </button>
            )}
          </nav>

          {/* Help at bottom */}
          <button style={styles.helpBtn} title="Help">
            <HelpIcon />
            <span style={styles.navLabel}>Help</span>
          </button>
        </aside>

        {/* ── Main content ── */}
        <main style={styles.main}>
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>Projects</h1>
            <button
              style={styles.addBtn}
              onClick={() => window.location.pathname = '/projects/new'}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add New Project
            </button>
          </div>

          {/* ── Table card ── */}
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Project Information', 'Serial Number', 'Assigned Member', 'Installation Date', 'Status', ''].map(h => (
                    <th key={h} style={styles.th}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} style={styles.emptyCell}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', color: '#9BA8B7' }}>
                      <span style={{ width: 18, height: 18, border: '2px solid #DDE3EC', borderTopColor: '#1DB5AA', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }}/>
                      Loading…
                    </div>
                  </td></tr>
                )}
                {error && (
                  <tr><td colSpan={6} style={styles.emptyCell}>
                    <span style={{ color: '#E53E3E' }}>Error: {error}</span>
                  </td></tr>
                )}
                {!loading && !error && filtered.length === 0 && (
                  <tr><td colSpan={6} style={styles.emptyCell}>
                    <span style={{ color: '#9BA8B7' }}>
                      {search ? 'No projects match your search.' : 'No projects found.'}
                    </span>
                  </td></tr>
                )}
                {filtered.map(p => (
                  <ProjectRow key={p.id} project={p} />
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Project row ───────────────────────────────────────────────
function ProjectRow({ project: p }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <tr style={styles.tr} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFB'} onMouseLeave={e => e.currentTarget.style.background = ''}>
      <td style={styles.td}>
        <div style={{ fontWeight: 600, color: '#0D1B2A', fontSize: 14 }}>{p.owner_name || '—'}</div>
        <div style={{ fontSize: 12, color: '#9BA8B7', marginTop: 2 }}>{truncate(p.address || p.city || '', 30)}</div>
      </td>
      <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 13, color: '#4A5568' }}>{p.serial_number || '—'}</td>
      <td style={{ ...styles.td, color: '#4A5568' }}>{p.manager_name || '—'}</td>
      <td style={{ ...styles.td, color: '#4A5568', fontSize: 13 }}>
        {p.installed_at ? formatDate(p.installed_at) : '—'}
      </td>
      <td style={styles.td}>
        <StatusBadge status={p.subscription_status} />
      </td>
      <td style={{ ...styles.td, textAlign: 'right', position: 'relative' }}>
        <button
          style={styles.menuBtn}
          onClick={() => setMenuOpen(o => !o)}
          onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
          title="Actions"
        >⋮</button>
        {menuOpen && (
          <div style={styles.dropdown}>
            <button style={styles.dropdownItem}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              Edit
            </button>
            <button style={styles.dropdownItem}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
              Archive
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

// ── Status badge ──────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = (status || '').toLowerCase();
  let bg = '#E6FFEE', color = '#1A6B34', dot = '#38A169', label = status || 'N/A';
  if (s === 'inactive')    { bg = '#F5F5F5'; color = '#9BA8B7'; dot = '#CBD5E0'; label = 'Inactive'; }
  if (s === 'in_progress' || s === 'in progress') {
    bg = '#FFF5E6'; color = '#92620B'; dot = '#D97706'; label = 'In Progress';
  }
  if (s === 'active') { label = 'Active'; }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: bg, color, fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: dot, display: 'inline-block' }} />
      {label}
    </span>
  );
}

// ── Avatar menu ───────────────────────────────────────────────
function AvatarMenu({ user }) {
  const [open, setOpen] = useState(false);
  const initial = (user.name || user.email || 'U')[0].toUpperCase();

  return (
    <div style={{ position: 'relative' }}>
      <button
        style={{ ...styles.iconBtn, padding: 0, overflow: 'hidden', width: 34, height: 34, borderRadius: '50%' }}
        onClick={() => setOpen(o => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        title={user.name || user.email}
      >
        {user.picture
          ? <img src={user.picture} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ width: 34, height: 34, background: '#0D1B2A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>{initial}</span>
        }
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: 42, background: '#fff', border: '1px solid #E9EDF3', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 180, zIndex: 100, padding: '8px 0' }}>
          <div style={{ padding: '10px 16px 8px', borderBottom: '1px solid #F0F2F5' }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#0D1B2A' }}>{user.name || user.email}</div>
            <div style={{ fontSize: 12, color: '#9BA8B7', marginTop: 2 }}>{user.email}</div>
          </div>
          <button
            style={{ ...styles.dropdownItem, margin: '4px 8px', borderRadius: 6 }}
            onClick={() => { logout(); }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

// ── Logo component ────────────────────────────────────────────
function WeOkasLogo() {
  return (
    <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#0D1B2A"/>
      <path d="M9 14 L14 26 L20 18 L26 26 L31 14" stroke="#1DB5AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="20" cy="28" r="2" fill="#E87B3B"/>
    </svg>
  );
}

// ── Icon components ───────────────────────────────────────────
function HomeIcon() {
  return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>;
}
function BoxIcon() {
  return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>;
}
function FolderIcon() {
  return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>;
}
function UsersIcon() {
  return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
}
function RolesIcon() {
  return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>;
}
function SupportIcon() {
  return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>;
}
function AdminIcon() {
  return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M6 20v-1a6 6 0 0112 0v1"/><path strokeLinecap="round" d="M19 13l1 4-2.5-.5-1 2-1-2.5L13 17l2-2.5-1.5-1.5 2.5-.5.5-2.5"/></svg>;
}
function HelpIcon() {
  return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round"/></svg>;
}

// ── Styles ────────────────────────────────────────────────────
const styles = {
  root: {
    display: 'flex', flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    background: '#F0F2F5',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: 20,
    background: '#fff',
    borderBottom: '1px solid #E9EDF3',
    padding: '0 24px',
    height: 60,
    position: 'sticky', top: 0, zIndex: 50,
  },
  headerLogo: {
    display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
    width: 210,
  },
  logoText: {
    fontSize: '1.15rem', fontWeight: 700,
    background: 'linear-gradient(90deg, #1DB5AA 0%, #E87B3B 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  searchWrap: {
    flex: 1, position: 'relative', display: 'flex', alignItems: 'center',
    maxWidth: 480,
  },
  searchIcon: {
    position: 'absolute', left: 12, pointerEvents: 'none',
  },
  searchInput: {
    width: '100%', padding: '8px 12px 8px 38px',
    border: '1.5px solid #E9EDF3', borderRadius: 8,
    fontSize: 14, color: '#0D1B2A', background: '#F8FAFB',
    outline: 'none', fontFamily: 'inherit',
  },
  headerRight: {
    display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto',
  },
  roleBadge: {
    fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
    letterSpacing: 0.3, whiteSpace: 'nowrap',
  },
  iconBtn: {
    background: 'none', border: 'none', cursor: 'pointer', padding: 6,
    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.12s',
  },
  body: {
    display: 'flex', flex: 1,
  },
  sidebar: {
    width: 210, background: '#fff',
    borderRight: '1px solid #E9EDF3',
    display: 'flex', flexDirection: 'column',
    padding: '16px 0',
    flexShrink: 0,
  },
  nav: {
    flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px',
  },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 12px', borderRadius: 8,
    background: 'none', border: 'none', cursor: 'pointer',
    textAlign: 'left', width: '100%',
    transition: 'background 0.12s',
  },
  navItemActive: {
    background: '#EEF3FF',
  },
  navLabel: {
    fontSize: 13.5, lineHeight: 1,
  },
  helpBtn: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 24px', borderRadius: 8,
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#9BA8B7', fontSize: 13.5,
    margin: '8px 12px 4px',
    transition: 'color 0.12s',
  },
  main: {
    flex: 1, padding: '28px 32px', overflow: 'auto',
  },
  pageHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 26, fontWeight: 700, color: '#0D1B2A', margin: 0,
  },
  addBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#0D1B2A', color: '#fff',
    border: 'none', borderRadius: 8, padding: '9px 18px',
    fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 0.12s, box-shadow 0.12s',
  },
  tableCard: {
    background: '#fff', borderRadius: 10,
    border: '1px solid #E9EDF3',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  table: {
    width: '100%', borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 20px', textAlign: 'left',
    fontSize: 11, fontWeight: 600, color: '#9BA8B7', letterSpacing: 0.6,
    borderBottom: '1px solid #E9EDF3', background: '#fff',
  },
  tr: {
    borderBottom: '1px solid #F0F2F5',
    transition: 'background 0.1s',
  },
  td: {
    padding: '14px 20px', fontSize: 14, color: '#4A5568',
    verticalAlign: 'middle',
  },
  emptyCell: {
    padding: '48px 20px', textAlign: 'center', fontSize: 14,
  },
  menuBtn: {
    background: 'none', border: 'none', cursor: 'pointer', color: '#9BA8B7',
    fontSize: 18, lineHeight: 1, padding: '2px 6px', borderRadius: 4,
    fontFamily: 'inherit',
  },
  dropdown: {
    position: 'absolute', right: 8, top: '100%', marginTop: 4,
    background: '#fff', border: '1px solid #E9EDF3',
    borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
    minWidth: 130, zIndex: 100, padding: '4px 0',
  },
  dropdownItem: {
    display: 'flex', alignItems: 'center', gap: 8,
    width: '100%', padding: '8px 14px', background: 'none',
    border: 'none', cursor: 'pointer', fontSize: 13, color: '#4A5568',
    fontFamily: 'inherit', textAlign: 'left',
    transition: 'background 0.1s',
  },
};

// ── Helpers ───────────────────────────────────────────────────
function truncate(str, n = 28) {
  return str && str.length > n ? str.slice(0, n) + '…' : str || '—';
}

function formatDate(dt) {
  if (!dt) return '—';
  try {
    const d   = new Date(dt);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
  } catch { return dt; }
}
