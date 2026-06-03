import React, { useEffect, useState } from 'react';
import { getUser } from '../auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const PROJECT_TYPES = ['residential', 'commercial', 'hospitality', 'retail', 'other'];

export default function AddProjectPage() {
  const user = getUser();
  const [appUsers, setAppUsers] = useState([]);
  const [orgs, setOrgs] = useState([]);

  const [form, setForm] = useState({
    serial_number: '',
    project_type: 'residential',
    address: '',
    notes: '',
    project_manager_id: '',
    organization_id: '',
    primary_contact: { full_name: '', phone: '', email: '' },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) { window.location.pathname = '/login'; return; }
    Promise.all([
      fetch(`${API_BASE}/api/app-users`).then(r => r.json()),
      fetch(`${API_BASE}/api/organizations`).then(r => r.json()),
    ]).then(([u, o]) => {
      setAppUsers(u.data || []);
      setOrgs(o.data || []);
      if (o.data?.length === 1) setForm(f => ({ ...f, organization_id: o.data[0].id }));
    }).catch(console.error);
  }, [user]);

  if (!user) return null;

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setContact = (key, val) => setForm(f => ({ ...f, primary_contact: { ...f.primary_contact, [key]: val } }));

  const handleSave = async () => {
    if (!form.organization_id) return setError('Please select an organization.');
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.primary_contact.full_name || `Project ${form.serial_number}`,
        serial_number: form.serial_number || null,
        project_type: form.project_type,
        address: form.address || null,
        notes: form.notes || null,
        project_manager_id: form.project_manager_id ? parseInt(form.project_manager_id) : null,
        organization_id: parseInt(form.organization_id),
        primary_contact: form.primary_contact.email ? form.primary_contact : null,
      };
      const res = await fetch(`${API_BASE}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create project');
      window.location.pathname = '/projects';
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#EDEDED' }}>
      {/* Minimal sidebar */}
      <aside style={{ width: 72, background: '#D9D9D9', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 24 }}>
        <button onClick={() => window.location.pathname = '/projects'} style={{ background: '#rgba(0,0,0,0.1)', border: 'none', borderRadius: 8, width: 48, height: 48, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        </button>
      </aside>

      <main style={{ flex: 1, padding: '36px 40px' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#1C1C1E', letterSpacing: 0.3 }}>We.OKAS</span>
          <div style={{ flex: 1, margin: '0 24px' }}>
            <input placeholder="Search" style={{ width: '100%', maxWidth: 520, border: '1.5px solid #CCC', borderRadius: 8, padding: '8px 16px', fontSize: 14, background: '#fff', outline: 'none' }} />
          </div>
          {user.picture
            ? <img src={user.picture} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
            : <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#C5A25E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>{(user.name || 'U')[0]}</div>
          }
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 600, color: '#1C1C1E', margin: '0 0 24px' }}>Add Project</h1>

        {error && (
          <div style={{ background: '#fdecea', border: '1px solid #f5c6cb', borderRadius: 6, padding: '10px 16px', marginBottom: 20, color: '#c0392b', fontSize: 14 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
          {/* Project Details */}
          <Card title="Project Details">
            <Field label="Building ID (Serial No.)">
              <Input value={form.serial_number} onChange={v => set('serial_number', v)} placeholder="e.g. 202036" />
            </Field>
            <Field label="Building Type">
              <Select value={form.project_type} onChange={v => set('project_type', v)} options={PROJECT_TYPES} />
            </Field>
            {orgs.length > 1 && (
              <Field label="Organization">
                <Select value={form.organization_id} onChange={v => set('organization_id', v)} options={[{ label: '— select —', value: '' }, ...orgs.map(o => ({ label: o.name, value: o.id }))]} />
              </Field>
            )}
            <Field label="Address">
              <Input value={form.address} onChange={v => set('address', v)} placeholder="Full address" />
            </Field>
            <Field label="Landmark / Notes">
              <Input value={form.notes} onChange={v => set('notes', v)} placeholder="e.g. City Union Bank" />
            </Field>
            <Field label="Member (Manager)">
              <Select
                value={form.project_manager_id}
                onChange={v => set('project_manager_id', v)}
                options={[{ label: '— select —', value: '' }, ...appUsers.map(u => ({ label: u.full_name, value: u.id }))]}
              />
            </Field>
          </Card>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Card title="Primary Contact Details">
              <Field label="Name">
                <Input value={form.primary_contact.full_name} onChange={v => setContact('full_name', v)} placeholder="Owner full name" />
              </Field>
              <Field label="Phone No.">
                <Input value={form.primary_contact.phone} onChange={v => setContact('phone', v)} placeholder="e.g. 9812345678" type="tel" />
              </Field>
              <Field label="Email">
                <Input value={form.primary_contact.email} onChange={v => setContact('email', v)} placeholder="owner@example.com" type="email" />
              </Field>
            </Card>

            <Card title="Processor Details">
              <Field label="Serial no.">
                <Input value={form.serial_number} onChange={v => set('serial_number', v)} placeholder="e.g. 202036" />
              </Field>
            </Card>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
          <button onClick={() => window.location.pathname = '/projects'} style={{ background: '#fff', border: '1.5px solid #999', borderRadius: 6, padding: '9px 28px', fontSize: 14, fontWeight: 500, cursor: 'pointer', color: '#333' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} style={{ background: '#1C1C1E', border: 'none', borderRadius: 6, padding: '9px 28px', fontSize: 14, fontWeight: 600, color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </main>
    </div>
  );
}

// ── Small form helpers ────────────────────────────────────────

function Card({ title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
      <div style={{ background: '#9E9E9E', padding: '10px 20px' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: 0.3 }}>{title}</span>
      </div>
      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', border: '1px solid #E0E0E0', borderRadius: 6, padding: '9px 12px',
        fontSize: 14, color: '#333', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box',
      }}
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', border: '1px solid #E0E0E0', borderRadius: 6, padding: '9px 32px 9px 12px',
          fontSize: 14, color: '#333', outline: 'none', background: '#FAFAFA', appearance: 'none',
          boxSizing: 'border-box', cursor: 'pointer',
        }}
      >
        {options.map(o =>
          typeof o === 'string'
            ? <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
            : <option key={o.value} value={o.value}>{o.label}</option>
        )}
      </select>
      <svg style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  );
}
