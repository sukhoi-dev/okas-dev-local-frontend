import React, { useEffect, useState } from 'react';
import { getUser } from '../auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const SIDEBAR_ITEMS = [
  { icon: HomeIcon,    label: 'Home',    path: '/projects' },
  { icon: BoxIcon,     label: 'Devices', path: '/devices' },
  { icon: UsersIcon,   label: 'Users',   path: '/users' },
  { icon: SearchIcon,  label: 'Search',  path: '/search' },
  { icon: SupportIcon, label: 'Support', path: '/support' },
  { icon: AddIcon,     label: 'New',     path: '/add', bottom: false },
];

export default function ProjectsPage() {
  const user = getUser();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ownerFilter, setOwnerFilter] = useState('');
  const [managerFilter, setManagerFilter] = useState('');

  useEffect(() => {
    if (!user) { window.location.pathname = '/login'; return; }
    fetch(`${API_BASE}/api/projects`)
      .then(r => r.json())
      .then(res => { setProjects(res.data || []); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [user]);

  if (!user) return null;

  const filtered = projects.filter(p => {
    const om = ownerFilter ? (p.owner_name || '').toLowerCase().includes(ownerFilter.toLowerCase()) : true;
    const mm = managerFilter ? (p.manager_name || '').toLowerCase().includes(managerFilter.toLowerCase()) : true;
    return om && mm;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#EDEDED' }}>
      <Sidebar user={user} active="Home" />
      <main style={{ flex: 1, padding: '36px 40px' }}>
        <TopBar user={user} />
        <h1 style={{ fontSize: 28, fontWeight: 600, color: '#1C1C1E', margin: '28px 0 20px' }}>List of Projects</h1>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
          <FilterDropdown label="Owner" value={ownerFilter} onChange={setOwnerFilter} />
          <FilterDropdown label="Manager" value={managerFilter} onChange={setManagerFilter} />
          <button style={iconBtnStyle} title="Search">
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="#555" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => window.location.pathname = '/projects/new'}
            style={{ background: '#1C1C1E', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Add New Project
          </button>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fff', borderBottom: '1px solid #E8E8E8' }}>
                {['Owner', 'Address', 'Serial no.', 'Manager', 'Installed D&T', 'Subscription', 'Action'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#666' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#999', fontSize: 14 }}>Loading…</td></tr>
              )}
              {error && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#c0392b', fontSize: 14 }}>Error: {error}</td></tr>
              )}
              {!loading && !error && filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#999', fontSize: 14 }}>No projects found.</td></tr>
              )}
              {filtered.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #F2F2F2', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                  <td style={tdStyle}><strong style={{ fontWeight: 600, color: '#1C1C1E' }}>{p.owner_name || '—'}</strong></td>
                  <td style={{ ...tdStyle, color: '#555', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {truncate(p.address || `${p.city || ''}`)}
                  </td>
                  <td style={tdStyle}>{p.serial_number || '—'}</td>
                  <td style={tdStyle}>{p.manager_name || '—'}</td>
                  <td style={tdStyle}>{p.installed_at ? formatDT(p.installed_at) : '—'}</td>
                  <td style={tdStyle}>{p.subscription_status || 'N/A'}</td>
                  <td style={tdStyle}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: 20, lineHeight: 1, padding: '0 4px' }} title="Actions">⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

function FilterDropdown({ label, value, onChange }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={label}
        style={{
          border: '1.5px solid #D0D0D0', borderRadius: 6, padding: '8px 32px 8px 14px',
          fontSize: 14, color: '#333', outline: 'none', width: 130, background: '#fff',
        }}
      />
      <svg style={{ position: 'absolute', right: 10, pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  );
}

function Sidebar({ user, active }) {
  return (
    <aside style={{ width: 72, background: '#D9D9D9', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 24 }}>
      {SIDEBAR_ITEMS.map(({ icon: Icon, label, path }) => (
        <SidebarBtn key={label} icon={<Icon />} label={label} active={label === active} onClick={() => window.location.pathname = path} />
      ))}
    </aside>
  );
}

function SidebarBtn({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} title={label} style={{
      background: active ? 'rgba(0,0,0,0.12)' : 'none',
      border: 'none', borderRadius: 8, width: 48, height: 48, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4,
      color: '#444',
    }}>
      {icon}
    </button>
  );
}

function TopBar({ user }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span style={{ fontSize: 22, fontWeight: 700, color: '#1C1C1E', letterSpacing: 0.3 }}>We.OKAS</span>
      <div style={{ flex: 1, margin: '0 24px' }}>
        <input placeholder="Search" style={{
          width: '100%', maxWidth: 520, border: '1.5px solid #CCC', borderRadius: 8,
          padding: '8px 16px', fontSize: 14, background: '#fff', outline: 'none',
        }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', background: '#1C1C1E',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" stroke="#C5A25E" strokeWidth="2.5" fill="none"/><path d="M16 30 L24 14 L32 30" stroke="#C5A25E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><line x1="18.5" y1="25" x2="29.5" y2="25" stroke="#C5A25E" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        {/* Bell */}
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#555" strokeWidth="1.8">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        {user.picture
          ? <img src={user.picture} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
          : <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#C5A25E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>{(user.name || user.email || 'U')[0].toUpperCase()}</div>
        }
      </div>
    </div>
  );
}

// ── Icon components ───────────────────────────────────────────
function HomeIcon() {
  return <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>;
}
function BoxIcon() {
  return <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>;
}
function UsersIcon() {
  return <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
}
function SearchIcon() {
  return <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
function SupportIcon() {
  return <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>;
}
function AddIcon() {
  return <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}

// ── Helpers ───────────────────────────────────────────────────
const tdStyle = { padding: '14px 20px', fontSize: 14, color: '#333' };
const iconBtnStyle = { background: '#fff', border: '1.5px solid #D0D0D0', borderRadius: 6, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };

function truncate(str, n = 22) {
  return str && str.length > n ? str.slice(0, n) + '…' : str;
}

function formatDT(dt) {
  if (!dt) return '—';
  try {
    const d = new Date(dt);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  } catch { return dt; }
}
