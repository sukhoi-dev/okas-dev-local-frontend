import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCreateRole, useUpdateRole } from './useRoles';

// ── Default PM modules (used by PM portal + WE.OKAS admin) ───────────────────
export const PM_MODULES = [
  {
    id: 'projects',
    label: 'Projects',
    type: 'radio',
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

// ── Build initial permission state from a role + module list ──────────────────
function initPermissions(role, modules) {
  const init = {};
  modules.forEach((mod) => {
    if (mod.type === 'radio') {
      init[mod.id] = { scope: role?.permissions?.[mod.id]?.scope ?? 'none' };
    } else {
      const saved = role?.permissions?.[mod.id] ?? {};
      const opts = {};
      mod.options.forEach((opt) => { opts[opt.id] = !!saved[opt.id]; });
      init[mod.id] = opts;
    }
  });
  return init;
}

const LABEL = 'text-[11px] font-semibold tracking-[2px] text-[#5c7089] uppercase mb-[8px] block';
const INPUT  = 'w-full bg-[#f4f7fb] rounded-[8px] px-[14px] py-[12px] text-[14px] text-[#0a1e3f] placeholder:text-[#9bb0c7] outline-none border border-transparent focus:border-[#0094AD] transition-colors';

// ── Per-module permission block ───────────────────────────────────────────────
function ModuleBlock({ mod, permissions, onChange, onSelectAll }) {
  const allSelected = mod.options.every((opt) =>
    mod.type === 'radio'
      ? permissions[mod.id]?.scope === opt.id
      : permissions[mod.id]?.[opt.id] === true,
  );

  return (
    <div className="border-b border-[#f0f4f8] last:border-0 pb-[16px] mb-[16px] last:mb-0 last:pb-0">
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

      <div className="flex flex-col gap-[10px]">
        {mod.options.map((opt) => {
          const checked =
            mod.type === 'radio'
              ? permissions[mod.id]?.scope === opt.id
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
export default function RoleFormDrawer({ open, role, onClose, onSuccess, modules = PM_MODULES }) {
  const isEdit = !!role;
  const [name,        setName]        = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState(() => initPermissions(null, modules));
  const [errors,      setErrors]      = useState({});

  const create = useCreateRole();
  const update = useUpdateRole();
  const isBusy = create.isPending || update.isPending;

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setName(role?.name || '');
    setDescription(role?.description || '');
    setPermissions(initPermissions(role, modules));
  }, [open, role, modules]);

  const handleChange = (moduleId, type, optionId, checked) => {
    setPermissions((prev) => {
      const next = { ...prev };
      if (type === 'radio') {
        next[moduleId] = { scope: checked ? optionId : 'none' };
      } else {
        next[moduleId] = { ...next[moduleId], [optionId]: checked };
      }
      return next;
    });
  };

  const handleSelectAll = (moduleId) => {
    setPermissions((prev) => {
      const next = { ...prev };
      const mod = modules.find((m) => m.id === moduleId);
      if (mod.type === 'radio') {
        const firstOpt = mod.options[0]?.id;
        next[moduleId] = { scope: prev[moduleId]?.scope === firstOpt ? 'none' : firstOpt };
      } else {
        const allOn = mod.options.every((o) => prev[moduleId]?.[o.id]);
        const updated = {};
        mod.options.forEach((o) => { updated[o.id] = !allOn; });
        next[moduleId] = updated;
      }
      return next;
    });
  };

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Role name is required';
    const hasAny = modules.some((mod) => {
      if (mod.type === 'radio') return permissions[mod.id]?.scope !== 'none';
      return mod.options.some((opt) => permissions[mod.id]?.[opt.id]);
    });
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={isBusy ? undefined : onClose}
            className="fixed inset-0 bg-[rgba(10,30,63,0.2)] z-40"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-[500px] bg-white shadow-[-8px_0_40px_rgba(10,30,63,0.10)] z-50 flex flex-col"
          >
            {/* Header */}
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

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
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
                  {modules.map((mod) => (
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

            {/* Footer */}
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
