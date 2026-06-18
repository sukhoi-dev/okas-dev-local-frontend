import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Plus, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import AppShell from '../_layout/AppShell';
import FilterDropdown from './FilterDropdown';
import RoleFormDrawer from './RoleFormDrawer';
import { useRoles, useDeleteRole } from './useRoles';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getModuleSummary(permissions) {
  if (!permissions) return '—';
  const p = permissions;
  const isAll =
    p.projects?.scope === 'all_projects' &&
    p.members?.create && p.members?.view && p.members?.edit && p.members?.delete &&
    p.design_studio?.access;
  if (isAll) return 'All Permissions';
  const mods = [];
  if (p.projects?.scope !== 'none') mods.push('Project');
  if (p.members && Object.values(p.members).some(Boolean)) mods.push('Members');
  if (p.design_studio?.access) mods.push('Design Studio');
  return mods.length ? mods.join(', ') : 'No permissions';
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
function RoleCard({ role, onEdit }) {
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
            {getModuleSummary(role.permissions)}
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

// ── Filter state helpers ──────────────────────────────────────────────────────
const EMPTY_SELECTION = { module: new Set(), status: new Set() };

const FILTER_CATEGORIES = [
  {
    id: 'module',
    label: 'Module',
    options: [
      { id: 'projects',      label: 'Projects'      },
      { id: 'members',       label: 'Members'       },
      { id: 'design_studio', label: 'Design Studio' },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    options: [
      { id: 'has_members',    label: 'Has members'   },
      { id: 'empty',          label: 'No members'    },
    ],
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RolesPage() {
  const [search,       setSearch]       = useState('');
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [editRole,     setEditRole]     = useState(null);
  const [filterOpen,   setFilterOpen]   = useState(false);
  const [filterSel,    setFilterSel]    = useState(EMPTY_SELECTION);
  const filterRef = useRef(null);

  const { data: allRoles = [], isLoading } = useRoles();

  // Client-side filtering
  const filtered = allRoles.filter((role) => {
    // Text search
    if (search) {
      const q = search.toLowerCase();
      if (!role.name.toLowerCase().includes(q) && !(role.description || '').toLowerCase().includes(q)) return false;
    }
    // Module filter
    const modules = filterSel.module;
    if (modules.size > 0) {
      const p = role.permissions || {};
      const roleModules = new Set();
      if (p.projects?.scope !== 'none') roleModules.add('projects');
      if (p.members && Object.values(p.members).some(Boolean)) roleModules.add('members');
      if (p.design_studio?.access) roleModules.add('design_studio');
      if (![...modules].some((m) => roleModules.has(m))) return false;
    }
    // Status filter
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
  const handleAdd  = ()     => { setEditRole(null);   setDrawerOpen(true); };

  return (
    <AppShell>
      <div className="flex flex-col gap-[24px] px-[40px] pt-[32px] pb-[48px]">

        {/* Title */}
        <h1 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[40px] tracking-[-0.8px] text-[#0a1e3f] leading-[1.1]">
          Roles and Permission
        </h1>

        {/* Controls */}
        <div className="flex items-center gap-[12px]">
          {/* Filters */}
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
                categories={FILTER_CATEGORIES}
                selected={filterSel}
                onChange={handleFilterChange}
                onClear={() => setFilterSel(EMPTY_SELECTION)}
                onCancel={() => setFilterOpen(false)}
                onApply={() => setFilterOpen(false)}
              />
            )}
          </div>

          {/* Search */}
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

          {/* Add New Role */}
          <button
            onClick={handleAdd}
            className="bg-[#0a1e3f] h-[44px] rounded-[6px] px-[20px] flex items-center gap-[8px] text-white font-semibold text-[14px] hover:bg-[#0a2a5a] transition-colors"
          >
            <Plus size={18} />
            Add New Role
          </button>
        </div>

        {/* Cards */}
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
              <RoleCard key={role.id} role={role} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit drawer */}
      <RoleFormDrawer
        open={drawerOpen}
        role={editRole}
        onClose={() => setDrawerOpen(false)}
        onSuccess={() => setDrawerOpen(false)}
      />

      {/* Dismiss filter on outside click */}
      {filterOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
      )}
    </AppShell>
  );
}
