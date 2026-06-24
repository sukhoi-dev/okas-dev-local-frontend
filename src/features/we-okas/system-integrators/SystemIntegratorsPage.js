import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Building2 } from 'lucide-react';
import { toast } from 'react-toastify';
import AppShell from '../_layout/AppShell';
import SIFormDrawer from './SIFormDrawer';
import { useSIs, useDeleteSI } from './useSIs';

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const active = status === 'active';
  return (
    <span className={`inline-flex items-center gap-[6px] text-[12px] font-medium px-[10px] py-[4px] rounded-full ${active ? 'bg-[#e6f9f0] text-[#16a34a]' : 'bg-[#f4f7fb] text-[#5c7089]'}`}>
      <span className={`size-[6px] rounded-full ${active ? 'bg-[#16a34a]' : 'bg-[#9bb0c7]'}`} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

// ── Row action kebab ──────────────────────────────────────────────────────────
function RowActions({ si, onEdit, onDeactivate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

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
              className="absolute right-0 top-full mt-[4px] w-[160px] bg-white rounded-[8px] shadow-[0_8px_32px_rgba(10,30,63,0.12)] border border-[#e2e2e2] overflow-hidden z-20"
            >
              <button
                onClick={() => { onEdit(si); setOpen(false); }}
                className="w-full px-[16px] py-[11px] text-left text-[14px] text-[#0a1e3f] hover:bg-[#f4f7fb] font-medium"
              >
                Edit
              </button>
              {si.status === 'active' && (
                <>
                  <div className="h-px bg-[#f0f0f0]" />
                  <button
                    onClick={() => { onDeactivate(si); setOpen(false); }}
                    className="w-full px-[16px] py-[11px] text-left text-[14px] text-red-600 hover:bg-[#fff5f5] font-medium"
                  >
                    Deactivate
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Skeleton row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_80px] px-[24px] py-[18px] border-b border-[#f8fafc] animate-pulse items-center">
      {[80, 70, 55, 60, 30].map((w, i) => (
        <div key={i} className="h-[13px] bg-[#f4f7fb] rounded" style={{ width: `${w}%`, marginRight: 16 }} />
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SystemIntegratorsPage() {
  const [statusFilter, setStatusFilter] = useState('active');
  const [search,       setSearch]       = useState('');
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [delTarget,    setDelTarget]    = useState(null);
  const [showDelConfirm, setShowDelConfirm] = useState(false);

  const { data: sis = [], isLoading } = useSIs({ status: statusFilter });
  const deleteMutation = useDeleteSI();

  const filtered = search
    ? sis.filter((s) =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase()) ||
        s.phone?.toLowerCase().includes(search.toLowerCase())
      )
    : sis;

  const openAdd  = () => { setEditTarget(null); setDrawerOpen(true); };
  const openEdit = (s) => { setEditTarget(s);   setDrawerOpen(true); };
  const askDel   = (s) => { setDelTarget(s);    setShowDelConfirm(true); };

  const confirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(delTarget.id);
      toast.success(`${delTarget.name} deactivated`);
    } catch (err) {
      toast.error(err?.message || 'Failed to deactivate');
    } finally {
      setShowDelConfirm(false);
      setDelTarget(null);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-[24px] px-[40px] pt-[32px] pb-[48px]">

        {/* Title */}
        <div>
          <h1 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[40px] tracking-[-0.8px] text-[#0a1e3f] leading-[1.1]">
            System Integrators
          </h1>
          <p className="text-[15px] text-[#5c7089] mt-[6px]">
            Manage all SI organisations on the platform.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-[12px]">

          {/* Search */}
          <div className="bg-white h-[44px] rounded-[6px] px-[14px] border border-[#e2e2e2] flex items-center gap-[10px] w-[300px]">
            <Search size={16} className="text-[#5c7089] shrink-0" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search organisations"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-[14px] text-[#0a1e3f] placeholder:text-[#9bb0c7] bg-transparent outline-none"
            />
          </div>

          {/* Status filter */}
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

          {/* Add button */}
          <button
            onClick={openAdd}
            className="bg-[#0a1e3f] h-[44px] rounded-[6px] px-[20px] flex items-center gap-[8px] text-white font-semibold text-[14px] hover:bg-[#0a2a5a] transition-colors"
          >
            <Plus size={18} />
            Add Organisation
          </button>
        </div>

        {/* Stats row */}
        <div className="flex gap-[16px]">
          {[
            { label: 'Total SIs',  value: sis.length },
            { label: 'Active',     value: sis.filter((s) => s.status === 'active').length },
            { label: 'Inactive',   value: sis.filter((s) => s.status === 'inactive').length },
            { label: 'Total Members', value: sis.reduce((a, s) => a + (s.member_count || 0), 0) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-[10px] border border-[#e8edf3] px-[20px] py-[16px] flex-1">
              <p className="text-[12px] text-[#5c7089] font-medium tracking-[0.5px]">{label}</p>
              <p className="text-[28px] font-semibold text-[#0a1e3f] leading-none mt-[6px]">{isLoading ? '—' : value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-[12px] border border-[#e8edf3] overflow-hidden">

          {/* Header */}
          <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_80px] px-[24px] py-[14px] border-b border-[#f0f4f8]">
            {['ORGANISATION', 'EMAIL', 'PHONE', 'STATUS', ''].map((col) => (
              <span key={col} className="text-[11px] font-semibold tracking-[1.8px] text-[#5c7089] uppercase">
                {col}
              </span>
            ))}
          </div>

          {/* Rows */}
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : filtered.length === 0 ? (
            <div className="py-[64px] flex flex-col items-center gap-[12px] text-[#9bb0c7]">
              <Building2 size={36} strokeWidth={1.2} />
              <p className="text-[14px]">
                {search ? 'No organisations match your search.' : 'No organisations found. Add your first SI.'}
              </p>
            </div>
          ) : (
            filtered.map((si, i) => (
              <motion.div
                key={si.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-[2fr_2fr_1.5fr_1fr_80px] px-[24px] py-[18px] border-b border-[#f8fafc] last:border-0 hover:bg-[#fcfcff] transition-colors items-center"
              >
                {/* Name + member count */}
                <div className="flex flex-col gap-[3px] pr-4">
                  <span className="font-semibold text-[14px] text-[#0a1e3f] truncate">{si.name}</span>
                  <span className="text-[12px] text-[#9bb0c7]">{si.member_count ?? 0} member{si.member_count !== 1 ? 's' : ''}</span>
                </div>

                <span className="text-[14px] text-[#5c7089] truncate pr-4">{si.email || '—'}</span>
                <span className="text-[14px] text-[#5c7089] truncate pr-4">{si.phone || '—'}</span>
                <StatusBadge status={si.status} />

                <div className="flex justify-end">
                  <RowActions si={si} onEdit={openEdit} onDeactivate={askDel} />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit drawer */}
      <SIFormDrawer
        open={drawerOpen}
        si={editTarget}
        onClose={() => setDrawerOpen(false)}
        onSuccess={() => setDrawerOpen(false)}
      />

      {/* Deactivate confirm */}
      <AnimatePresence>
        {showDelConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[rgba(10,30,63,0.4)] z-50 flex items-center justify-center"
            onClick={() => setShowDelConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[12px] p-[32px] w-[440px] shadow-xl"
            >
              <div className="size-[48px] rounded-full bg-red-50 flex items-center justify-center mb-[16px]">
                <Building2 size={22} className="text-red-500" />
              </div>
              <h3 className="font-semibold text-[18px] text-[#0a1e3f] mb-[8px]">Deactivate Organisation?</h3>
              <p className="text-[14px] text-[#5c7089] mb-[24px] leading-[1.6]">
                <strong>{delTarget?.name}</strong> and all its members will immediately lose platform access.
                Their data is retained and can be reactivated via Edit.
              </p>
              <div className="flex gap-[12px] justify-end">
                <button
                  onClick={() => setShowDelConfirm(false)}
                  className="px-[20px] py-[10px] text-[14px] text-[#5c7089] hover:text-[#0a1e3f] transition-colors"
                >
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
    </AppShell>
  );
}
