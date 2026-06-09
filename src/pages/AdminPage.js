import React, { useEffect, useState, useCallback } from 'react';
import { getUser, logout } from '../auth';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

// ── Colours ───────────────────────────────────────────────────
const DARK   = '#0D1B2A';
const BORDER = '#E9EDF3';

const ROLE_BADGE_COLORS = {
  super_admin:      { bg: '#FFF0D6', color: '#A0700A' },
  distributor_admin:{ bg: '#FDE8F5', color: '#8B1A6B' },
  si_admin:         { bg: '#E8F4FF', color: '#1565C0' },
  programmer:       { bg: '#E8F9F0', color: '#1B6B3A' },
  project_manager:  { bg: '#F4E8FF', color: '#6A1BA0' },
};

export default function AdminPage() {
  const user = getUser();
  const [authState, setAuthState] = useState(
    // 'checking' if flag not yet set (e.g. session pre-dates this feature),
    // 'ok' if already confirmed, 'denied' if confirmed not super admin
    sessionStorage.getItem('is_super_admin') === 'true'  ? 'ok' :
    sessionStorage.getItem('is_super_admin') === 'false' ? 'denied' :
    'checking'
  );

  useEffect(() => {
    if (!user || authState !== 'checking') return;
    // Flag not in sessionStorage — re-verify against the backend
    fetch(`${API_BASE}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email }),
    })
      .then(r => r.json())
      .then(json => {
        const isSuper = json.data?.is_super_admin === true;
        sessionStorage.setItem('is_super_admin', isSuper ? 'true' : 'false');
        setAuthState(isSuper ? 'ok' : 'denied');
      })
      .catch(() => setAuthState('denied'));
  }, [user, authState]);

  if (!user) { window.location.pathname = '/login'; return null; }
  if (authState === 'denied') { window.location.pathname = '/projects'; return null; }
  if (authState === 'checking') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#EDEDED' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, border: '3px solid #C5A25E', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#666', fontSize: 14, fontFamily: 'system-ui' }}>Checking access…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <AdminPageInner user={user} />;
}

function AdminPageInner({ user }) {
  const [users,   setUsers]   = useState([]);
  const [roles,   setRoles]   = useState([]);
  const [orgs,    setOrgs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [orgFilter, setOrgFilter] = useState('');

  // Modal state
  const [modal,   setModal]   = useState(null); // null | 'create' | 'edit' | 'delete' | 'roles'
  const [target,  setTarget]  = useState(null); // user being acted on
  const [saving,  setSaving]  = useState(false);
  const [err,     setErr]     = useState('');

  // Form state
  const [form,    setForm]    = useState({});
  const [selRoles, setSelRoles] = useState([]);

  const loadUsers = useCallback(() => {
    const params = new URLSearchParams();
    if (search)    params.set('search', search);
    if (orgFilter) params.set('org_id', orgFilter);
    return fetch(`${API_BASE}/api/admin/users?${params}`)
      .then(r => r.json())
      .then(res => { setUsers(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, orgFilter]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/admin/roles`).then(r => r.json()),
      fetch(`${API_BASE}/api/admin/orgs`).then(r => r.json()),
    ]).then(([rolesRes, orgsRes]) => {
      setRoles(rolesRes.data || []);
      setOrgs(orgsRes.data || []);
    });
    loadUsers();
  }, [user, loadUsers]);

  // ── Handlers ────────────────────────────────────────────────

  function openCreate() {
    setForm({ full_name: '', email: '', phone: '', organization_id: orgs[0]?.id || '' });
    setSelRoles([]);
    setErr('');
    setModal('create');
  }

  function openEdit(u) {
    setTarget(u);
    setForm({ full_name: u.full_name, email: u.email, phone: u.phone || '', organization_id: u.org_id });
    setErr('');
    setModal('edit');
  }

  function openRoles(u) {
    setTarget(u);
    setSelRoles(u.roles.map(r => r.id));
    setErr('');
    setModal('roles');
  }

  function openDelete(u) {
    setTarget(u);
    setErr('');
    setModal('delete');
  }

  function closeModal() {
    setModal(null);
    setTarget(null);
    setErr('');
  }

  async function handleCreate() {
    setSaving(true); setErr('');
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role_ids: selRoles }),
      });
      const json = await res.json();
      if (!res.ok) { setErr(json.detail || 'Failed to create user'); setSaving(false); return; }
      closeModal();
      loadUsers();
    } catch (e) { setErr(e.message); }
    setSaving(false);
  }

  async function handleEdit() {
    setSaving(true); setErr('');
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${target.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) { setErr(json.detail || 'Failed to update user'); setSaving(false); return; }
      closeModal();
      loadUsers();
    } catch (e) { setErr(e.message); }
    setSaving(false);
  }

  async function handleToggle(u) {
    await fetch(`${API_BASE}/api/admin/users/${u.id}/toggle`, { method: 'PATCH' });
    loadUsers();
  }

  async function handleDelete() {
    setSaving(true);
    await fetch(`${API_BASE}/api/admin/users/${target.id}`, { method: 'DELETE' });
    closeModal();
    loadUsers();
    setSaving(false);
  }

  async function handleSaveRoles() {
    setSaving(true); setErr('');
    const currentIds = target.roles.map(r => r.id);
    const toAdd    = selRoles.filter(id => !currentIds.includes(id));
    const toRemove = currentIds.filter(id => !selRoles.includes(id));

    try {
      await Promise.all([
        ...toAdd.map(role_id =>
          fetch(`${API_BASE}/api/admin/users/${target.id}/roles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role_id, organization_id: target.org_id }),
          })
        ),
        ...toRemove.map(role_id =>
          fetch(`${API_BASE}/api/admin/users/${target.id}/roles/${role_id}`, { method: 'DELETE' })
        ),
      ]);
      closeModal();
      loadUsers();
    } catch (e) { setErr(e.message); }
    setSaving(false);
  }

  // ── Render ───────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", background: '#F0F2F5' }}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 210, flexShrink: 0 }}>
          <WeOkasLogo />
          <span style={logoTextStyle}>We.OKAS</span>
        </div>
        <div style={{ flex: 1, maxWidth: 480, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <svg style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9BA8B7" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '8px 12px 8px 38px', border: '1.5px solid #E9EDF3', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit', background: '#F8FAFB' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: '#FFF8EC', color: '#92620B', border: '1px solid #F6D58A', whiteSpace: 'nowrap' }}>
            Super Admin
          </span>
          <button style={iconBtnStyle} title="Notifications">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#4A5568" strokeWidth="1.8"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          </button>
          {user.picture
            ? <img src={user.picture} alt="avatar" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' }} onClick={logout} title="Sign out" />
            : <div style={{ width: 34, height: 34, borderRadius: '50%', background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }} onClick={logout} title="Sign out">{(user.name || user.email || 'U')[0].toUpperCase()}</div>
          }
        </div>
      </header>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <aside style={{ width: 210, background: '#fff', borderRight: '1px solid #E9EDF3', display: 'flex', flexDirection: 'column', padding: '16px 0', flexShrink: 0 }}>
          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px' }}>
            {[
              { label: 'Home', path: '/projects', icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
              { label: 'Projects', path: '/projects', icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg> },
              { label: 'User Mgmt', path: '/admin', active: true, icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
              { label: 'Support', path: '/support', icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg> },
            ].map(item => (
              <button key={item.label} onClick={() => { window.location.pathname = item.path; }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, background: item.active ? '#EEF3FF' : 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'inherit' }}>
                <span style={{ color: item.active ? '#1A4B8B' : '#6B7A90', lineHeight: 0 }}>{item.icon}</span>
                <span style={{ fontSize: 13.5, color: item.active ? '#1A4B8B' : '#6B7A90', fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: '28px 32px', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: DARK, margin: 0 }}>User Management</h1>
          <span style={{ marginLeft: 12, background: '#F0F2F5', borderRadius: 20, padding: '3px 10px', fontSize: 13, color: '#6B7A90' }}>
            {users.length} users
          </span>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 380 }}>
            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#999" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && loadUsers()}
              placeholder="Search by name or email…"
              style={{ width: '100%', border: '1.5px solid #D0D0D0', borderRadius: 6, padding: '9px 14px 9px 36px', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <select
            value={orgFilter}
            onChange={e => setOrgFilter(e.target.value)}
            style={{ border: '1.5px solid #D0D0D0', borderRadius: 6, padding: '9px 14px', fontSize: 14, background: '#fff', color: '#333', outline: 'none', minWidth: 160 }}
          >
            <option value="">All Organisations</option>
            {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>

          <button onClick={loadUsers} style={iconBtnStyle} title="Apply filters">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#555" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
          </button>

          <div style={{ flex: 1 }} />

          <button onClick={openCreate} style={{ background: DARK, color: '#fff', border: 'none', borderRadius: 6, padding: '9px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add New User
          </button>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fff', borderBottom: `1px solid ${BORDER}` }}>
                {['Name', 'Email', 'Organisation', 'Roles', 'Status', 'Last Login', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#666', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#999', fontSize: 14 }}>Loading…</td></tr>
              )}
              {!loading && users.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#999', fontSize: 14 }}>No users found.</td></tr>
              )}
              {users.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: `1px solid #F2F2F2`, background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={u.full_name} />
                      <span style={{ fontWeight: 600, color: DARK }}>{u.full_name}</span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, color: '#555' }}>{u.email}</td>
                  <td style={tdStyle}>
                    <div>{u.org_name || '—'}</div>
                    {u.org_type && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: u.org_type === 'distributor' ? '#8B1A6B' : '#1565C0', background: u.org_type === 'distributor' ? '#FDE8F5' : '#E8F4FF', padding: '1px 6px', borderRadius: 10 }}>
                        {u.org_type === 'distributor' ? 'Distributor' : 'SI'}
                      </span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {u.roles.length === 0
                        ? <span style={{ color: '#bbb', fontSize: 13 }}>No roles</span>
                        : u.roles.map(r => <RoleBadge key={r.id} role={r} />)
                      }
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <StatusToggle active={u.active_ind} onToggle={() => handleToggle(u)} />
                  </td>
                  <td style={{ ...tdStyle, color: '#888', fontSize: 13 }}>
                    {u.last_login_at ? formatDT(u.last_login_at) : '—'}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <ActionBtn title="Edit user" onClick={() => openEdit(u)}>
                        <EditIcon />
                      </ActionBtn>
                      <ActionBtn title="Manage roles" onClick={() => openRoles(u)}>
                        <RolesIcon />
                      </ActionBtn>
                      <ActionBtn title="Delete user" onClick={() => openDelete(u)} danger>
                        <TrashIcon />
                      </ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* ── Modals ─────────────────────────────────────────── */}
      {modal === 'create' && (
        <Modal title="Add New User" onClose={closeModal}>
          <UserForm form={form} setForm={setForm} orgs={orgs} roles={roles} selRoles={selRoles} setSelRoles={setSelRoles} showRoles />
          {err && <ErrorMsg msg={err} />}
          <ModalFooter onCancel={closeModal} onConfirm={handleCreate} confirmLabel="Create User" saving={saving} />
        </Modal>
      )}

      {modal === 'edit' && target && (
        <Modal title="Edit User" onClose={closeModal}>
          <UserForm form={form} setForm={setForm} orgs={orgs} />
          {err && <ErrorMsg msg={err} />}
          <ModalFooter onCancel={closeModal} onConfirm={handleEdit} confirmLabel="Save Changes" saving={saving} />
        </Modal>
      )}

      {modal === 'roles' && target && (
        <Modal title={`Manage Roles — ${target.full_name}`} onClose={closeModal}>
          <p style={{ margin: '0 0 16px', fontSize: 14, color: '#555' }}>
            Select the roles to assign to this user.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {roles.map(r => (
              <label key={r.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', padding: '12px 14px', borderRadius: 8, border: `1.5px solid ${selRoles.includes(r.id) ? '#1DB5AA' : BORDER}`, background: selRoles.includes(r.id) ? '#FFFBF2' : '#fff', transition: 'all 0.15s' }}>
                <input
                  type="checkbox"
                  checked={selRoles.includes(r.id)}
                  onChange={() => setSelRoles(prev => prev.includes(r.id) ? prev.filter(x => x !== r.id) : [...prev, r.id])}
                  style={{ marginTop: 2, accentColor: '#1DB5AA', width: 16, height: 16 }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: DARK }}>{r.display_name}</div>
                  {r.description && <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{r.description}</div>}
                </div>
              </label>
            ))}
          </div>
          {err && <ErrorMsg msg={err} />}
          <ModalFooter onCancel={closeModal} onConfirm={handleSaveRoles} confirmLabel="Save Roles" saving={saving} />
        </Modal>
      )}

      {modal === 'delete' && target && (
        <Modal title="Delete User" onClose={closeModal} width={420}>
          <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFF0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#D93025" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <p style={{ fontSize: 15, color: DARK, fontWeight: 600, margin: '0 0 8px' }}>Delete {target.full_name}?</p>
            <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
              This action cannot be undone. All role assignments for this user will also be removed.
            </p>
          </div>
          <ModalFooter onCancel={closeModal} onConfirm={handleDelete} confirmLabel="Delete" saving={saving} danger />
        </Modal>
      )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

function UserForm({ form, setForm, orgs, roles, selRoles, setSelRoles, showRoles }) {
  const f = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FormField label="Full Name" required>
        <input value={form.full_name || ''} onChange={f('full_name')} placeholder="Jane Smith" style={inputStyle} />
      </FormField>
      <FormField label="Email Address" required>
        <input value={form.email || ''} onChange={f('email')} placeholder="jane@example.com" type="email" style={inputStyle} />
      </FormField>
      <FormField label="Phone">
        <input value={form.phone || ''} onChange={f('phone')} placeholder="+91 98765 43210" style={inputStyle} />
      </FormField>
      <FormField label="Organisation" required>
        <select value={form.organization_id || ''} onChange={f('organization_id')} style={{ ...inputStyle, background: '#fff' }}>
          <option value="">Select organisation…</option>
          {['distributor', 'si'].map(type => {
            const group = orgs.filter(o => o.org_type === type);
            if (!group.length) return null;
            return (
              <optgroup key={type} label={type === 'distributor' ? 'Distributors' : 'System Integrators'}>
                {group.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </optgroup>
            );
          })}
        </select>
      </FormField>
      {showRoles && roles && (
        <FormField label="Roles">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {roles.map(r => (
              <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '6px 12px', borderRadius: 20, border: `1.5px solid ${selRoles.includes(r.id) ? '#C5A25E' : '#D0D0D0'}`, background: selRoles.includes(r.id) ? '#FFFBF2' : '#fff', fontSize: 13, fontWeight: 500, transition: 'all 0.15s' }}>
                <input
                  type="checkbox"
                  checked={selRoles.includes(r.id)}
                  onChange={() => setSelRoles(prev => prev.includes(r.id) ? prev.filter(x => x !== r.id) : [...prev, r.id])}
                  style={{ accentColor: '#C5A25E', width: 13, height: 13 }}
                />
                {r.display_name}
              </label>
            ))}
          </div>
        </FormField>
      )}
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#444', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#D93025', marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children, width = 520 }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: 12, width, maxWidth: '95vw', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', padding: '28px 28px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1C1C1E', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 22, lineHeight: 1, padding: 4 }}>×</button>
        </div>
        <div style={{ paddingBottom: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function ModalFooter({ onCancel, onConfirm, confirmLabel, saving, danger }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
      <button onClick={onCancel} style={{ background: '#F5F5F5', color: '#444', border: 'none', borderRadius: 6, padding: '9px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={saving}
        style={{ background: danger ? '#D93025' : DARK, color: '#fff', border: 'none', borderRadius: 6, padding: '9px 20px', fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
      >
        {saving ? 'Saving…' : confirmLabel}
      </button>
    </div>
  );
}

function StatusToggle({ active, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={active ? 'Click to disable' : 'Click to enable'}
      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, padding: 0 }}
    >
      <div style={{ width: 36, height: 20, borderRadius: 10, background: active ? '#34C759' : '#C0C0C0', position: 'relative', transition: 'background 0.2s' }}>
        <div style={{ position: 'absolute', top: 3, left: active ? 19 : 3, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
      </div>
      <span style={{ fontSize: 13, color: active ? '#34C759' : '#999', fontWeight: 500 }}>
        {active ? 'Active' : 'Disabled'}
      </span>
    </button>
  );
}

function RoleBadge({ role }) {
  const colors = ROLE_BADGE_COLORS[role.name] || { bg: '#F0F0F0', color: '#555' };
  return (
    <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: colors.bg, color: colors.color }}>
      {role.display_name}
    </span>
  );
}

function Avatar({ name }) {
  const initials = (name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const colors = ['#C5A25E', '#4A90D9', '#5C6BC0', '#26A69A', '#AB47BC'];
  const bg = colors[(name || '').charCodeAt(0) % colors.length];
  return (
    <div style={{ width: 32, height: 32, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function ActionBtn({ title, onClick, danger, children }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background: hover ? (danger ? '#FFF0F0' : '#F5F5F5') : 'none', border: `1px solid ${hover ? (danger ? '#FFCDD2' : '#D0D0D0') : 'transparent'}`, borderRadius: 6, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: danger ? '#D93025' : '#555', transition: 'all 0.15s' }}
    >
      {children}
    </button>
  );
}

function ErrorMsg({ msg }) {
  return <div style={{ marginTop: 12, padding: '10px 14px', background: '#FFF0F0', border: '1px solid #FFCDD2', borderRadius: 6, fontSize: 13, color: '#C62828' }}>{msg}</div>;
}

// ── Icon components ───────────────────────────────────────────
function EditIcon()  { return <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>; }
function RolesIcon() { return <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>; }
function TrashIcon() { return <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>; }

function WeOkasLogo() {
  return <svg width="30" height="30" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#0D1B2A"/><path d="M9 14 L14 26 L20 18 L26 26 L31 14" stroke="#1DB5AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="20" cy="28" r="2" fill="#E87B3B"/></svg>;
}

// ── Helpers ───────────────────────────────────────────────────
const tdStyle = { padding: '14px 20px', fontSize: 14, color: '#4A5568', verticalAlign: 'middle' };
const inputStyle = { width: '100%', border: '1.5px solid #E9EDF3', borderRadius: 8, padding: '9px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#0D1B2A', background: '#FAFBFC', fontFamily: 'inherit' };
const iconBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const headerStyle = { display: 'flex', alignItems: 'center', gap: 20, background: '#fff', borderBottom: '1px solid #E9EDF3', padding: '0 24px', height: 60, position: 'sticky', top: 0, zIndex: 50 };
const logoTextStyle = { fontSize: '1.15rem', fontWeight: 700, background: 'linear-gradient(90deg, #1DB5AA 0%, #E87B3B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };

function formatDT(dt) {
  if (!dt) return '—';
  try {
    const d = new Date(dt);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch { return dt; }
}
