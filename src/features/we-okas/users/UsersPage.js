import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Plus, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import MemberFormDrawer from './MemberFormDrawer';
import { useMembers, useDeleteMember } from './useMembers';
import useAuthStore from '../../auth/authStore';

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const active = status === 'active';
  return (
    <span className={`inline-flex items-center gap-[6px] text-[12px] font-medium px-[10px] py-[4px] rounded-full ${active ? 'bg-[#e6f9f0] text-[#16a34a]' : 'bg-[#f4f7fb] text-[#5c7089]'}`}>
      <span className={`size-[6px] rounded-full ${active ? 'bg-[#16a34a]' : 'bg-[#9bb0c7]'}`} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

// ── Row action kebab ─────────────────────────────────────────────────────────
function RowActions({ member, onEdit, onDelete, canEdit, canDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  if (!canEdit && !canDelete) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="size-[32px] rounded-[4px] flex items-center justify-center text-[#5c7089] hover:bg-[#f4f7fb] transition-colors"
      >
        <svg viewBox="0 0 20 20" fill="none" className="size-[18px]">
          <circle cx="10" cy="5"  r="1.5" fill="currentColor" />
          <circle cx="10" cy="10" r="1.5" fill="currentColor" />
          <circle cx="10" cy="15" r="1.5" fill="currentColor" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -6 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-full mt-[4px] w-[140px] bg-white rounded-[8px] shadow-[0_8px_32px_rgba(10,30,63,0.12)] border border-[#e2e2e2] overflow-hidden z-20"
            >
              {canEdit && (
                <button onClick={() => { onEdit(member); setOpen(false); }} className="w-full px-[16px] py-[11px] text-left text-[14px] text-[#0a1e3f] hover:bg-[#f4f7fb] font-medium">
                  Edit
                </button>
              )}
              {canEdit && canDelete && <div className="h-px bg-[#f0f0f0]" />}
              {canDelete && (
                <button onClick={() => { onDelete(member); setOpen(false); }} className="w-full px-[16px] py-[11px] text-left text-[14px] text-red-600 hover:bg-[#fff5f5] font-medium">
                  Delete
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const user           = useAuthStore((s) => s.user);
  const permissions    = useAuthStore((s) => s.permissions);
  const is_super_admin = user?.is_super_admin;

  const canCreate = is_super_admin || permissions.includes('members.create');
  const canEdit   = is_super_admin || permissions.includes('members.edit');
  const canDelete = is_super_admin || permissions.includes('members.delete');

  const [statusFilter,  setStatusFilter]  = useState('active');
  const [search,        setSearch]        = useState('');
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [editTarget,    setEditTarget]    = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [showDelConfirm, setShowDelConfirm] = useState(false);

  const { data: members = [], isLoading } = useMembers({ status: statusFilter });
  const deleteMutation = useDeleteMember();

  const filtered = search
    ? members.filter(
        (m) =>
          m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          m.email?.toLowerCase().includes(search.toLowerCase()) ||
          m.role?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : members;

  const openAdd  = () => { setEditTarget(null); setDrawerOpen(true); };
  const openEdit = (m) => { setEditTarget(m);   setDrawerOpen(true); };

  const askDelete    = (m) => { setDeleteTarget(m); setShowDelConfirm(true); };
  const confirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`${deleteTarget.full_name} deactivated`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to deactivate');
    } finally {
      setShowDelConfirm(false);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-[24px] px-[40px] pt-[32px] pb-[48px]">

        {/* Title */}
        <h1 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[40px] tracking-[-0.8px] text-[#0a1e3f] leading-[1.1]">
          Members
        </h1>

        {/* Controls */}
        <div className="flex items-center gap-[12px]">
          <button className="bg-white h-[44px] rounded-[6px] px-[16px] border border-[#e2e2e2] hover:bg-[#f4f7fb] transition-colors flex items-center gap-[8px] text-[#0a1e3f]">
            <Filter size={16} strokeWidth={1.8} />
            <span className="font-medium text-[14px]">Filters</span>
          </button>

          <div className="bg-white h-[44px] rounded-[6px] px-[14px] border border-[#e2e2e2] flex items-center gap-[10px] w-[280px]">
            <Search size={16} className="text-[#5c7089] shrink-0" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search members"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-[14px] text-[#0a1e3f] placeholder:text-[#9bb0c7] bg-transparent outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white h-[44px] rounded-[6px] px-[12px] pr-[32px] border border-[#e2e2e2] text-[14px] text-[#5c7089] outline-none cursor-pointer appearance-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="all">All</option>
          </select>

          <div className="flex-1" />

          {canCreate && (
            <button
              onClick={openAdd}
              className="bg-[#0a1e3f] h-[44px] rounded-[6px] px-[20px] flex items-center gap-[8px] text-white font-semibold text-[14px] hover:bg-[#0a2a5a] transition-colors"
            >
              <Plus size={18} />
              Add Member
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-[12px] border border-[#e8edf3] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[2fr_1.5fr_2fr_1fr_60px] px-[24px] py-[14px] border-b border-[#f0f4f8]">
            {['MEMBER', 'ROLE', 'EMAIL', 'STATUS', ''].map((col) => (
              <span key={col} className="text-[11px] font-semibold tracking-[1.8px] text-[#5c7089] uppercase">
                {col}
              </span>
            ))}
          </div>

          {/* Rows */}
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[2fr_1.5fr_2fr_1fr_60px] px-[24px] py-[18px] border-b border-[#f8fafc] last:border-0 animate-pulse">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="h-[14px] bg-[#f4f7fb] rounded mr-6" />
                ))}
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="py-[60px] text-center text-[#9bb0c7] text-[14px]">
              {search ? 'No members match your search.' : 'No members found.'}
            </div>
          ) : (
            filtered.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-[2fr_1.5fr_2fr_1fr_60px] px-[24px] py-[18px] border-b border-[#f8fafc] last:border-0 hover:bg-[#fcfcff] transition-colors items-center"
              >
                <span className="font-medium text-[14px] text-[#0a1e3f] truncate pr-4">{m.full_name}</span>
                <span className="text-[14px] text-[#5c7089] truncate pr-4">{m.role?.name || '—'}</span>
                <span className="text-[14px] text-[#5c7089] truncate pr-4">{m.email}</span>
                <StatusBadge status={m.status} />
                <div className="flex justify-end">
                  <RowActions member={m} onEdit={openEdit} onDelete={askDelete} canEdit={canEdit} canDelete={canDelete} />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit panel */}
      <MemberFormDrawer
        open={drawerOpen}
        member={editTarget}
        organizationId={user?.organization_id ?? 1}
        onClose={() => setDrawerOpen(false)}
        onSuccess={() => setDrawerOpen(false)}
      />

      {/* Delete confirm */}
      <AnimatePresence>
        {showDelConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[rgba(10,30,63,0.4)] z-50 flex items-center justify-center"
            onClick={() => setShowDelConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[12px] p-[32px] w-[420px] shadow-xl"
            >
              <h3 className="font-semibold text-[18px] text-[#0a1e3f] mb-[8px]">Deactivate Member</h3>
              <p className="text-[14px] text-[#5c7089] mb-[24px]">
                Deactivate <strong>{deleteTarget?.full_name}</strong>? They will lose all platform access immediately. Their data is retained and the account can be reactivated via Edit.
              </p>
              <div className="flex gap-[12px] justify-end">
                <button onClick={() => setShowDelConfirm(false)} className="px-[20px] py-[10px] text-[14px] text-[#5c7089] hover:text-[#0a1e3f] transition-colors">
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="bg-red-600 text-white px-[20px] py-[10px] rounded-[6px] text-[14px] font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
                >
                  {deleteMutation.isPending ? 'Deactivating…' : 'Deactivate'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
