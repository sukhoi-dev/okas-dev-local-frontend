import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCreateRole, useUpdateRole } from './useRoles';

// ── Permission module definitions ─────────────────────────────────────────────
const MODULES = [
  {
    id: 'projects',
    label: 'Projects',
    type: 'radio',   // mutually exclusive scope
    options: [
      { id: 'all_projects', label: 'All Projects' },
      { id: 'own_projects', label: 'Own Projects' },
    ],
  },
  {
    id: 'members',
    label: 'Members',
    type: 'checkbox',
    options: [
      { id: 'view',   label: 'View Members'   },
      { id: 'create', label: 'Add Members'    },
      { id: 'edit',   label: 'Edit Members'   },
      { id: 'delete', label: 'Delete Members' },
    ],
  },
  {
    id: 'design_studio',
    label: 'Design Studio',
    type: 'checkbox',
    options: [
      { id: 'access', label: 'Access Design Studio' },
    ],
  },
];

// ── Initial form state ────────────────────────────────────────────────────────
function initPermissions(role) {
  if (!role?.permissions) {
    return {
      projects:      { scope: 'none' },
      members:       { create: false, view: false, edit: false, delete: false },
      design_studio: { access: false },
    };
  }
  const p = role.permissions;
  return {
    projects:      { scope: p.projects?.scope ?? 'none' },
    members:       { create: !!p.members?.create, view: !!p.members?.view, edit: !!p.members?.edit, delete: !!p.members?.delete },
    design_studio: { access: !!p.design_studio?.access },
  };
}

// ── Label style ───────────────────────────────────────────────────────────────
const LABEL = 'text-[11px] font-semibold tracking-[2px] text-[#5c7089] uppercase mb-[8px] block';
const INPUT = 'w-full bg-[#f4f7fb] rounded-[8px] px-[14px] py-[12px] text-[14px] text-[#0a1e3f] placeholder:text-[#9bb0c7] outline-none border border-transparent focus:border-[#0094AD] transition-colors';

// ── Module permission block ───────────────────────────────────────────────────
function ModuleBlock({ mod, permissions, onChange, onSelectAll }) {
  const allSelected = mod.options.every((opt) => {
    if (mod.type === 'radio') return permissions.projects?.scope === opt.id;
    return permissions[mod.id]?.[opt.id] === true;
  });

  return (
    <div className="border-b border-[#f0f4f8] last:border-0 pb-[16px] mb-[16px] last:mb-0 last:pb-0">
      {/* Module header */}
      <div className="flex items-center justify-between mb-[12px]">
        <span className="text-[14px] font-semibold text-[#0094AD]">{mod.label}</span>
        <button
          type="button"
          onClick={() => onSelectAll(mod.id)}
          className="text-[12px] font-medium text-[#0094AD] hover:text-[#007a8f] transition-colors"
        >
          {allSelected ? 'Deselect all' : 'Select all'}
        </button>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-[10px]">
        {mod.options.map((opt) => {
          const checked =
            mod.type === 'radio'
              ? permissions.projects?.scope === opt.id
              : permissions[mod.id]?.[opt.id] === true;

          return (
            <label key={opt.id} className="flex items-center gap-[12px] cursor-pointer group">
              <div
                onClick={() => onChange(mod.id, mod.type, opt.id, !checked)}
                className={`size-[18px] rounded-[4px] border-[1.5px] flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  checked ? 'bg-[#0a1e3f] border-[#0a1e3f]' : 'border-[#c0ccda] group-hover:border-[#0a1e3f]'
                }`}
              >
                {checked && (
                  <svg viewBox="0 0 12 10" fill="none" className="size-[10px]">
                    <path d="M1.5 5.5L4.5 8L10.5 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-[14px] text-[#0a1e3f]">{opt.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ── Drawer ────────────────────────────────────────────────────────────────────
export default function RoleFormDrawer({ open, role, onClose, onSuccess }) {
  const isEdit = !!role;
  const [name,        setName]        = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState(initPermissions(null));
  const [errors,      setErrors]      = useState({});

  const create = useCreateRole();
  const update = useUpdateRole();
  const isBusy = create.isPending || update.isPending;

  // Prefill on open
  useEffect(() => {
    if (!open) return;
    setErrors({});
    setName(role?.name || '');
    setDescription(role?.description || '');
    setPermissions(initPermissions(role));
  }, [open, role]);

  // ── Permission change handlers ──────────────────────────────────────────────

  const handleChange = (moduleId, type, optionId, checked) => {
    setPermissions((prev) => {
      const next = { ...prev };
      if (moduleId === 'projects' && type === 'radio') {
        // Radio: clicking already-selected deselects (→ 'none')
        next.projects = { scope: checked ? optionId : 'none' };
      } else {
        next[moduleId] = { ...next[moduleId], [optionId]: checked };
      }
      return next;
    });
  };

  const handleSelectAll = (moduleId) => {
    setPermissions((prev) => {
      const next = { ...prev };
      const mod = MODULES.find((m) => m.id === moduleId);
      if (moduleId === 'projects') {
        // "Select all" for projects = all_projects scope
        next.projects = { scope: prev.projects.scope === 'all_projects' ? 'none' : 'all_projects' };
      } else {
        const allOn = mod.options.every((o) => prev[moduleId]?.[o.id]);
        mod.options.forEach((o) => { next[moduleId] = { ...next[moduleId], [o.id]: !allOn }; });
      }
      return next;
    });
  };

  // ── Validate ──────────────────────────────────────────────────────────────────

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Role name is required';
    const p = permissions;
    const hasAny =
      p.projects.scope !== 'none' ||
      Object.values(p.members).some(Boolean) ||
      p.design_studio.access;
    if (!hasAny) e.permissions = 'Select at least one permission';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload = { name: name.trim(), description: description.trim(), permissions };
    try {
      if (isEdit) {
        await update.mutateAsync({ id: role.id, data: payload });
        toast.success('Role updated successfully');
      } else {
        await create.mutateAsync(payload);
        toast.success('Role created successfully');
      }
      onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={isBusy ? undefined : onClose}
            className="fixed inset-0 bg-[rgba(10,30,63,0.2)] z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-[500px] bg-white shadow-[-8px_0_40px_rgba(10,30,63,0.10)] z-50 flex flex-col"
          >
            {/* ── Header ── */}
            <div className="px-[32px] pt-[28px] pb-[20px] border-b border-[#f0f4f8]">
              <p className="text-[11px] font-semibold tracking-[2px] text-[#5c7089] uppercase mb-[6px]">
                Role and Permission — {isEdit ? 'EDIT' : 'NEW'}
              </p>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[22px] text-[#0a1e3f] tracking-[-0.3px]">
                  {isEdit ? 'Edit Role and Permission' : 'Add Role and Permission'}
                </h2>
                <button onClick={onClose} className="size-[34px] rounded-[6px] flex items-center justify-center text-[#5c7089] hover:bg-[#f4f7fb] hover:text-[#0a1e3f] transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto">

              {/* 01 Details */}
              <div className="px-[32px] pt-[24px] pb-[8px]">
                <p className="text-[11px] font-semibold tracking-[2.5px] text-[#5c7089] uppercase mb-[16px]">
                  01  DETAILS
                </p>
                <div className="bg-white border border-[#e8edf3] rounded-[10px] p-[20px]">
                  <div className="mb-[16px]">
                    <label className={LABEL}>*ROLE NAME</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Administrator"
                      className={`${INPUT} ${errors.name ? 'border-red-400' : ''}`}
                    />
                    {errors.name && <p className="text-red-500 text-[12px] mt-[4px]">{errors.name}</p>}
                  </div>
                  <div>
                    <label className={LABEL}>DESCRIPTION</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Full system access including billing and user management."
                      rows={3}
                      className={`${INPUT} resize-none`}
                    />
                  </div>
                </div>
              </div>

              {/* 02 Module Permissions */}
              <div className="px-[32px] pt-[20px] pb-[32px]">
                <p className="text-[11px] font-semibold tracking-[2.5px] text-[#5c7089] uppercase mb-[8px]">
                  02  MODULE PERMISSIONS
                </p>
                <p className="text-[13px] text-[#5c7089] mb-[16px]">
                  Select the permissions to grant for each module.
                </p>

                {errors.permissions && (
                  <p className="text-red-500 text-[12px] mb-[12px]">{errors.permissions}</p>
                )}

                <div className="bg-white border border-[#e8edf3] rounded-[10px] p-[20px]">
                  {MODULES.map((mod) => (
                    <ModuleBlock
                      key={mod.id}
                      mod={mod}
                      permissions={permissions}
                      onChange={handleChange}
                      onSelectAll={handleSelectAll}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="px-[32px] py-[18px] bg-white border-t border-[#f0f4f8] flex items-center justify-end gap-[12px]">
              <button
                type="button"
                onClick={onClose}
                disabled={isBusy}
                className="px-[20px] py-[11px] text-[14px] font-medium text-[#5c7089] hover:text-[#0a1e3f] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isBusy}
                className="bg-[#0a1e3f] text-white px-[28px] py-[11px] rounded-[6px] text-[14px] font-semibold hover:bg-[#0a2a5a] transition-colors disabled:opacity-60 flex items-center gap-[8px]"
              >
                {isBusy ? (
                  <>
                    <svg className="animate-spin size-[15px]" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Saving…
                  </>
                ) : (isEdit ? 'Update Role' : 'Save Role')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
