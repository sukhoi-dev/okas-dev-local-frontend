import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Plus, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import FilterDropdown from './FilterDropdown';
import RoleFormDrawer, { PM_MODULES } from './RoleFormDrawer';
import { useRoles, useDeleteRole } from './useRoles';

// ── Module summary for a role card ────────────────────────────────────────────
function getModuleSummary(permissions, modules) {
  if (!permissions) return '—';
  const active = [];
  modules.forEach((mod) => {
    if (mod.type === 'radio') {
      if (permissions[mod.id]?.scope !== 'none') active.push(mod.label);
    } else {
      if (mod.options.some((opt) => permissions[mod.id]?.[opt.id])) active.push(mod.label);
    }
  });
  if (!active.length) return 'No permissions';
  if (active.length === modules.length) return 'All Permissions';
  return active.join(', ');
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-white rounded-[12px] border border-[#e8edf3] p-[24px] animate-pulse">
      <div className="h-[20px] bg-[#f0f4f8] rounded w-[55%] mb-[12px]" />
      <div className="h-[14px] bg-[#f0f4f8] rounded w-[90%] mb-[6px]" />
      <div className="h-[14px] bg-[#f0f4f8] rounded w-[70%] mb-[20px]" />
      <div className="h-[14px] bg-[#f0f4f8] rounded w-[45%]" />
      <div className="h-px bg-[#f0f4f8] my-[16px]" />
      <div className="flex justify-between">
        <div className="h-[14px] bg-[#f0f4f8] rounded w-[30%]" />
        <div className="h-[14px] bg-[#f0f4f8] rounded w-[20%]" />
      </div>
    </div>
  );
}

// ── Role card ─────────────────────────────────────────────────────────────────
function RoleCard({ role, onEdit, modules }) {
  const count = role.member_count ?? 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-[12px] border border-[#e8edf3] flex flex-col transition-shadow hover:shadow-[0_4px_20px_rgba(10,30,63,0.08)]"
    >
      <div className="p-[24px] flex-1">
        <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[18px] text-[#0a1e3f] mb-[8px] leading-tight">
          {role.name}
        </h3>
        <p className="text-[14px] text-[#5c7089] leading-[1.6] mb-[16px] min-h-[44px]">
          {role.description || <em className="opacity-50">No description</em>}
        </p>
        <div className="flex items-center gap-[6px] flex-wrap">
          <span className="text-[13px] text-[#5c7089]">Modules:</span>
          <span className="text-[13px] font-semibold text-[#0a1e3f]">
            {getModuleSummary(role.permissions, modules)}
          </span>
        </div>
      </div>

      <div className="h-px bg-[#f0f4f8] mx-0" />

      <div className="px-[24px] py-[14px] flex items-center justify-between">
        <span className="text-[13px] text-[#5c7089]">
          Assigned to {count} user{count !== 1 ? 's' : ''}
        </span>
        <button
          onClick={() => onEdit(role)}
          className="text-[13px] font-semibold text-[#5c7089] hover:text-[#0a1e3f] transition-colors"
        >
          Edit Role
        </button>
      </div>
    </motion.div>
  );
}

const EMPTY_SELECTION = { module: new Set(), status: new Set() };

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RolesPage({ modules = PM_MODULES }) {
  const [search,       setSearch]       = useState('');
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [editRole,     setEditRole]     = useState(null);
  const [filterOpen,   setFilterOpen]   = useState(false);
  const [filterSel,    setFilterSel]    = useState(EMPTY_SELECTION);
  const filterRef = useRef(null);

  const { data: allRoles = [], isLoading } = useRoles();

  // Build filter categories from the active module list
  const filterCategories = [
    {
      id: 'module',
      label: 'Module',
      options: modules.map((m) => ({ id: m.id, label: m.label })),
    },
    {
      id: 'status',
      label: 'Status',
      options: [
        { id: 'has_members', label: 'Has members' },
        { id: 'empty',       label: 'No members'  },
      ],
    },
  ];

  const filtered = allRoles.filter((role) => {
    if (search) {
      const q = search.toLowerCase();
      if (!role.name.toLowerCase().includes(q) && !(role.description || '').toLowerCase().includes(q)) return false;
    }
    const mods = filterSel.module;
    if (mods.size > 0) {
      const p = role.permissions || {};
      const hasModule = [...mods].some((modId) => {
        const mod = modules.find((m) => m.id === modId);
        if (!mod) return false;
        if (mod.type === 'radio') return p[modId]?.scope !== 'none';
        return mod.options.some((opt) => p[modId]?.[opt.id]);
      });
      if (!hasModule) return false;
    }
    const statuses = filterSel.status;
    if (statuses.size > 0) {
      const count = role.member_count ?? 0;
      if (statuses.has('has_members') && count === 0) return false;
      if (statuses.has('empty') && count > 0) return false;
    }
    return true;
  });

  const totalFilterCount = filterSel.module.size + filterSel.status.size;

  const handleFilterChange = (catId, optId, checked) => {
    setFilterSel((prev) => {
      const next = { ...prev, [catId]: new Set(prev[catId]) };
      checked ? next[catId].add(optId) : next[catId].delete(optId);
      return next;
    });
  };

  const handleEdit = (role) => { setEditRole(role);  setDrawerOpen(true); };
  const handleAdd  = ()     => { setEditRole(null);  setDrawerOpen(true); };

  return (
    <>
      <div className="flex flex-col gap-[24px] px-[40px] pt-[32px] pb-[48px]">
        <h1 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[40px] tracking-[-0.8px] text-[#0a1e3f] leading-[1.1]">
          Roles and Permission
        </h1>

        <div className="flex items-center gap-[12px]">
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="bg-white h-[44px] rounded-[6px] px-[16px] border border-[#e2e2e2] hover:bg-[#f4f7fb] transition-colors flex items-center gap-[8px] text-[#0a1e3f]"
            >
              <Filter size={16} strokeWidth={1.8} />
              <span className="font-medium text-[14px]">Filters</span>
              {totalFilterCount > 0 && (
                <span className="bg-[#0a1e3f] text-white rounded-full size-[20px] flex items-center justify-center text-[11px] font-bold">
                  {totalFilterCount}
                </span>
              )}
            </button>

            {filterOpen && (
              <FilterDropdown
                categories={filterCategories}
                selected={filterSel}
                onChange={handleFilterChange}
                onClear={() => setFilterSel(EMPTY_SELECTION)}
                onCancel={() => setFilterOpen(false)}
                onApply={() => setFilterOpen(false)}
              />
            )}
          </div>

          <div className="bg-white h-[44px] rounded-[6px] px-[14px] border border-[#e2e2e2] flex items-center gap-[10px] w-[280px]">
            <Search size={16} className="text-[#5c7089] shrink-0" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search roles"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-[14px] text-[#0a1e3f] placeholder:text-[#9bb0c7] bg-transparent outline-none"
            />
          </div>

          <div className="flex-1" />

          <button
            onClick={handleAdd}
            className="bg-[#0a1e3f] h-[44px] rounded-[6px] px-[20px] flex items-center gap-[8px] text-white font-semibold text-[14px] hover:bg-[#0a2a5a] transition-colors"
          >
            <Plus size={18} />
            Add New Role
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
            {[1, 2, 3, 4].map((n) => <CardSkeleton key={n} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[80px] text-[#9bb0c7]">
            <p className="text-[15px]">{search || totalFilterCount > 0 ? 'No roles match your filters.' : 'No roles yet — create your first one.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
            {filtered.map((role) => (
              <RoleCard key={role.id} role={role} onEdit={handleEdit} modules={modules} />
            ))}
          </div>
        )}
      </div>

      <RoleFormDrawer
        open={drawerOpen}
        role={editRole}
        modules={modules}
        onClose={() => setDrawerOpen(false)}
        onSuccess={() => setDrawerOpen(false)}
      />

      {filterOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
      )}
    </>
  );
}
