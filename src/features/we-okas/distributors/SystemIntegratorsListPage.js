import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pencil, Archive, EyeOff, EyeIcon, Download, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { TopNav, LeftNav } from '../shared/SharedNav';
import FilterDropdown from '../project-managers/FilterDropdown';
import AddSIDrawer from './AddSIDrawer';
import useAuthStore from '../../auth/authStore';
import {
  getSIs, addSI, editSI,
  toggleSIStatus, archiveSI, downloadSI,
} from './siService';
import apiClient from '../../../api/client';

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const active = status?.toLowerCase() === 'active';
  return (
    <div className="flex gap-[8px] items-center">
      <div className={`shrink-0 size-[8px] rounded-full ${active ? 'bg-[#0a1e3f]' : 'border-[1.5px] border-[#5c7089]'}`} />
      <p className={`text-[14px] ${active ? 'text-[#0a1e3f]' : 'text-[#5c7089]'}`}
        style={{ fontFamily: 'Inter, sans-serif' }}>
        {active ? 'Active' : 'Inactive'}
      </p>
    </div>
  );
}

// ── Kebab menu ────────────────────────────────────────────────────────────────
function KebabMenu({ si, onEdit, onArchive, onToggleStatus, onDownload }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = si?.status?.toLowerCase() === 'active';

  const items = [
    { label: 'Edit',                             icon: Pencil,              action: onEdit          },
    { label: 'Archive',                          icon: Archive,             action: onArchive       },
    { label: isActive ? 'Mark Inactive' : 'Mark Active',
                                                 icon: isActive ? EyeOff : EyeIcon, action: onToggleStatus },
    { label: 'Download',                         icon: Download,            action: onDownload      },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center rounded-[4px] size-[32px] hover:bg-[#f4f7fb] transition-colors"
      >
        <svg className="size-[20px]" fill="none" viewBox="0 0 20 20">
          <circle cx="10" cy="4"  r="1.5" fill="#5C7089" />
          <circle cx="10" cy="10" r="1.5" fill="#5C7089" />
          <circle cx="10" cy="16" r="1.5" fill="#5C7089" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 w-[180px] bg-white rounded-[10px] shadow-[0px_8px_32px_0px_rgba(10,30,63,0.14)] border border-[#e2e2e2] overflow-hidden z-20"
          >
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.label}
                  onClick={(e) => { e.stopPropagation(); item.action(); setIsOpen(false); }}
                  whileHover={{ backgroundColor: '#f4f7fb', x: 4 }}
                  className="w-full px-[16px] py-[12px] flex items-center gap-[12px] text-left transition-colors"
                >
                  <Icon size={16} color="#0a1e3f" strokeWidth={1.6} />
                  <p className="text-[14px] text-[#0a1e3f]"
                    style={{ fontFamily: 'Inter, sans-serif' }}>{item.label}</p>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Detail drawer ─────────────────────────────────────────────────────────────
function DetailField({ label, value }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <p className="text-[11px] font-medium text-[#5c7089] tracking-[2px] uppercase"
        style={{ fontFamily: 'Inter, sans-serif' }}>{label}</p>
      <p className="text-[16px] text-[#0a1e3f] leading-[1.4]"
        style={{ fontFamily: 'Inter, sans-serif' }}>{value || '—'}</p>
      <div className="h-px bg-[#e8ecf0]" />
    </div>
  );
}

function DetailDrawer({ si, onClose, onEdit }) {
  return (
    <AnimatePresence>
      {si && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0a1e3f]/20 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[480px] bg-white z-50 flex flex-col shadow-[0px_0px_48px_0px_rgba(10,30,63,0.16)]"
          >
            <div className="flex items-start justify-between px-[40px] pt-[40px] pb-[24px] border-b border-[#e8ecf0]">
              <div className="flex flex-col gap-[4px]">
                <p className="text-[13px] text-[#5c7089]"
                  style={{ fontFamily: 'Inter, sans-serif' }}>System Integrator — VIEW</p>
                <p className="text-[28px] font-semibold text-[#0a1e3f] tracking-[-0.6px]"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Integrator Details</p>
              </div>
              <motion.button onClick={onClose} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-[#f4f7fb] transition-colors mt-[4px]">
                <X size={18} color="#5c7089" />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto px-[40px] py-[32px] flex flex-col gap-[28px]">
              <DetailField label="Full Name"      value={si.contact_name}   />
              <DetailField label="Company Name"   value={si.name}           />
              <DetailField label="Address"        value={si.address}        />
              <DetailField label="Email Address"  value={si.email}          />
              <DetailField label="Contact"        value={si.phone}          />
              <DetailField label="GST/VAT Number" value={si.gst_vat_number} />
              <DetailField label="Status"         value={si.status}         />
            </div>

            <div className="px-[40px] py-[24px] border-t border-[#e8ecf0] flex justify-end">
              <motion.button
                onClick={() => onEdit(si)}
                whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                className="bg-[#0a1e3f] text-white px-[40px] py-[14px] rounded-[4px] text-[15px] font-semibold hover:bg-[#0a2a5a] transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                Edit
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SystemIntegratorsListPage() {
  const { user, accessToken }               = useAuthStore();
  const distributorId                        = user?.organization_id;

  const [sis, setSIs]                        = useState([]);
  const [isLoading, setIsLoading]            = useState(false);
  const [fetchError, setFetchError]          = useState(null);
  const [siOrgIds, setSiOrgIds]              = useState(new Set());
  const [memberOrgIds, setMemberOrgIds]      = useState(new Set());
  const [searchQuery, setSearchQuery]        = useState('');
  const [appliedFilters, setAppliedFilters]  = useState({});
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedSI, setSelectedSI]          = useState(null);
  const [showAddDrawer, setShowAddDrawer]    = useState(false);
  const [editingSI, setEditingSI]            = useState(null);
  const filterRef                             = useRef(null);

  // ── Fetch list ──────────────────────────────────────────────────────────────
  const fetchSIs = useCallback(async () => {
    if (!distributorId || !accessToken) return;
    setIsLoading(true);
    setFetchError(null);
    try {
      const selectedNames     = appliedFilters['Name']         ?? [];
      const selectedCompanies = appliedFilters['Company Name'] ?? [];
      const selectedStatuses  = appliedFilters['Status']       ?? [];

      const res = await getSIs(accessToken, distributorId, {
        search:  searchQuery || undefined,
        name:    selectedNames.length     ? selectedNames     : undefined,
        company: selectedCompanies.length ? selectedCompanies : undefined,
        status:  selectedStatuses.length === 1 ? selectedStatuses[0] : undefined,
      });
      setSIs(res.data ?? []);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load data.');
    } finally {
      setIsLoading(false);
    }
  }, [distributorId, accessToken, searchQuery, appliedFilters]);

  useEffect(() => { fetchSIs(); }, [fetchSIs]);

  useEffect(() => {
    apiClient.get('/we-okas/projects').then(res => {
      const projects = res.data?.body?.projects ?? res.data?.projects ?? [];
      setSiOrgIds(new Set(projects.map(p => p.organization_id).filter(Boolean)));
    }).catch(() => {});

    apiClient.get('/we-okas/members').then(res => {
      const members = res.data?.body ?? res.data?.data ?? (Array.isArray(res.data) ? res.data : []);
      setMemberOrgIds(new Set(members.map(m => m.organization_id).filter(Boolean)));
    }).catch(() => {});
  }, []);

  // ── Click outside filter ────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilterDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Filter categories ───────────────────────────────────────────────────────
  const filterCategories = [
    { name: 'Name',         options: [...new Set(sis.map(s => s.contact_name))].map(n => ({ label: n, value: n })) },
    { name: 'Company Name', options: [...new Set(sis.map(s => s.name))].map(n => ({ label: n, value: n })) },
    { name: 'Status',       options: [{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }] },
  ];

  const hasActiveFilters = Object.values(appliedFilters).some(a => a.length > 0);

  // Strip empty optional fields — FastAPI rejects empty strings for optional fields
  const buildPayload = (formData) => {
    const payload = {
      contact_name: formData.contact_name.trim(),
      name:         formData.name.trim(),
      email:        formData.email.trim(),
      status:       formData.status,
    };
    payload.address = formData.address.trim();
    if (formData.phone?.trim())          payload.phone          = `+91 ${formData.phone.trim()}`;
    if (formData.gst_vat_number?.trim()) payload.gst_vat_number = formData.gst_vat_number.trim();
    return payload;
  };

  // ── Actions ─────────────────────────────────────────────────────────────────
  const handleAdd = async (formData) => {
    const res = await addSI(accessToken, distributorId, buildPayload(formData));
    setSIs(prev => [res.data, ...prev]);
  };

  const handleEdit = async (formData) => {
    const res = await editSI(accessToken, distributorId, editingSI.id, buildPayload(formData));
    setSIs(prev => prev.map(s => s.id === res.data.id ? res.data : s));
    if (selectedSI?.id === res.data.id) setSelectedSI(res.data);
  };

  const handleToggleStatus = async (si) => {
    const newStatus = si.status === 'Active' ? 'Inactive' : 'Active';
    const res = await toggleSIStatus(accessToken, distributorId, si.id, newStatus);
    setSIs(prev => prev.map(s => s.id === si.id ? res.data : s));
  };

  const handleArchive = async (si) => {
    if (siOrgIds.has(si.id)) {
      toast.error('Cannot delete — this SI has projects assigned.');
      return;
    }
    if (memberOrgIds.has(si.id)) {
      toast.error('Cannot delete — this SI has members assigned.');
      return;
    }
    await archiveSI(accessToken, distributorId, si.id);
    setSIs(prev => prev.filter(s => s.id !== si.id));
    if (selectedSI?.id === si.id) setSelectedSI(null);
  };

  const handleDownload = async (si) => {
    await downloadSI(accessToken, distributorId, si.id, 'pdf');
  };

  const openEdit = (si) => {
    setSelectedSI(null);
    setEditingSI(si);
  };

  return (
    <div className="bg-white flex flex-col h-screen w-full overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />

        <div className="bg-[#f4f7fb] flex-1 min-w-0 flex flex-col gap-[28px] overflow-y-auto overflow-x-hidden pb-[40px] pt-[32px] px-[40px]">

          {/* Header */}
          <p className="font-semibold text-[#0a1e3f] text-[40px] tracking-[-0.8px] leading-[1.1]"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            System Integrators
          </p>

          {/* Toolbar */}
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-[12px] items-center">

              {/* Filter */}
              <div className="relative" ref={filterRef}>
                <motion.button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="bg-white h-[44px] rounded-[4px] px-[16px] border border-[#e2e2e2] hover:bg-[#f4f7fb] transition-colors flex items-center gap-[8px]"
                >
                  <svg className="size-[18px]" fill="none" viewBox="0 0 18 18">
                    <path d="M2.5 5.5H15.5M5.5 9H12.5M8 12.5H10" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.3" />
                  </svg>
                  <p className="text-[14px] font-medium text-[#0a1e3f] whitespace-nowrap"
                    style={{ fontFamily: 'Inter, sans-serif' }}>Filters</p>
                  {hasActiveFilters && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="bg-[#0a1e3f] text-white rounded-full size-[20px] flex items-center justify-center text-[11px] font-semibold">
                      {Object.values(appliedFilters).reduce((acc, arr) => acc + arr.length, 0)}
                    </motion.span>
                  )}
                </motion.button>
                {showFilterDropdown && (
                  <FilterDropdown
                    categories={filterCategories}
                    onApply={(f) => { setAppliedFilters(f); setShowFilterDropdown(false); }}
                    onClose={() => setShowFilterDropdown(false)}
                  />
                )}
              </div>

              {/* Search */}
              <div className="bg-white h-[44px] rounded-[4px] w-[280px] border border-[#e2e2e2] flex items-center gap-[8px] px-[16px]">
                <svg className="shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18">
                  <circle cx="8" cy="8" r="5.5" stroke="#5C7089" strokeWidth="1.3" />
                  <path d="M12 12L15.5 15.5" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.3" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search members"
                  className="flex-1 bg-transparent outline-none text-[14px] text-[#0a1e3f] placeholder:text-[#5c7089]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}
                    className="text-[#5c7089] hover:text-[#0a1e3f] text-[16px] leading-none">×</button>
                )}
              </div>
            </div>

            {/* Add button */}
            <motion.button
              onClick={() => setShowAddDrawer(true)}
              whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}
              className="bg-[#0a1e3f] flex gap-[8px] h-[44px] items-center justify-center px-[20px] rounded-[4px] hover:bg-[#0a2a5a] transition-colors shadow-sm hover:shadow-lg"
            >
              <svg className="size-[18px]" fill="none" viewBox="0 0 18 18">
                <path d="M9 3.6V14.4M3.6 9H14.4" stroke="white" strokeLinecap="round" strokeWidth="1.5" />
              </svg>
              <p className="text-[14px] font-semibold text-white whitespace-nowrap"
                style={{ fontFamily: 'Inter, sans-serif' }}>Add New Integrator</p>
            </motion.button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[4px] w-full border border-[#e2e2e2]">

            {/* Header row */}
            <div className="flex items-center px-[24px] h-[52px] border-b border-[#e2e2e2]">
              <div className="w-[30%] min-w-0">
                <p className="text-[11px] font-medium text-[#5c7089] tracking-[1.6px] uppercase"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Name</p>
              </div>
              <div className="w-[22%] min-w-0">
                <p className="text-[11px] font-medium text-[#5c7089] tracking-[1.6px] uppercase"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Company Name</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-[#5c7089] tracking-[1.6px] uppercase"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Address</p>
              </div>
              <div className="w-[130px] shrink-0">
                <p className="text-[11px] font-medium text-[#5c7089] tracking-[1.6px] uppercase"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Status</p>
              </div>
              <div className="w-[60px] shrink-0 flex justify-end">
                <p className="text-[11px] font-medium text-[#5c7089] tracking-[1.6px] uppercase"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Action</p>
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-[60px]">
                <div className="size-[28px] rounded-full border-[3px] border-[#e2e2e2] border-t-[#0a1e3f] animate-spin" />
              </div>
            )}

            {/* Error */}
            {fetchError && !isLoading && (
              <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
                <p className="text-[15px] font-medium text-red-500"
                  style={{ fontFamily: 'Inter, sans-serif' }}>{fetchError}</p>
                <button onClick={fetchSIs}
                  className="text-[13px] text-[#0a1e3f] underline"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Retry</button>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !fetchError && sis.length === 0 && (
              <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
                <svg className="size-[40px]" fill="none" viewBox="0 0 40 40">
                  <rect x="6" y="10" width="28" height="22" rx="3" stroke="#5C7089" strokeWidth="1.5" />
                  <path d="M13 18H27M13 23H21" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.5" />
                </svg>
                <p className="text-[15px] font-medium text-[#0a1e3f]"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {searchQuery || hasActiveFilters ? 'No results found' : 'No System Integrators yet'}
                </p>
                <p className="text-[13px] text-[#5c7089]"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {searchQuery || hasActiveFilters ? 'Try adjusting your search or filter.' : 'Add your first SI to get started.'}
                </p>
              </div>
            )}

            {/* Rows */}
            {!isLoading && !fetchError && (
              <AnimatePresence mode="popLayout">
                {sis.map((si, index) => (
                  <motion.div
                    key={si.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <motion.div
                      onClick={() => setSelectedSI(si)}
                      whileHover={{ backgroundColor: '#f4f7fb' }}
                      className="flex items-center px-[24px] h-[64px] bg-white transition-colors cursor-pointer"
                    >
                      <div className="w-[30%] min-w-0 pr-[16px]">
                        <p className="text-[14px] font-semibold text-[#0a1e3f] truncate"
                          style={{ fontFamily: 'Inter, sans-serif' }}>{si.contact_name}</p>
                        <p className="text-[12px] text-[#5c7089] truncate mt-[2px]"
                          style={{ fontFamily: 'Inter, sans-serif' }}>{si.email}</p>
                      </div>
                      <div className="w-[22%] min-w-0 pr-[16px]">
                        <p className="text-[14px] text-[#0a1e3f] truncate"
                          style={{ fontFamily: 'Inter, sans-serif' }}>{si.name}</p>
                      </div>
                      <div className="flex-1 min-w-0 pr-[16px]">
                        <p className="text-[14px] text-[#5c7089] truncate"
                          style={{ fontFamily: 'Inter, sans-serif' }}>{si.address}</p>
                      </div>
                      <div className="w-[130px] shrink-0">
                        <StatusBadge status={si.status} />
                      </div>
                      <div className="w-[60px] shrink-0 flex justify-end">
                        <KebabMenu
                          si={si}
                          onEdit={() => openEdit(si)}
                          onArchive={() => handleArchive(si)}
                          onToggleStatus={() => handleToggleStatus(si)}
                          onDownload={() => handleDownload(si)}
                        />
                      </div>
                    </motion.div>
                    {index < sis.length - 1 && <div className="h-px bg-[#e2e2e2]" />}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      <DetailDrawer
        si={selectedSI}
        onClose={() => setSelectedSI(null)}
        onEdit={openEdit}
      />

      {/* Add drawer */}
      <AddSIDrawer
        isOpen={showAddDrawer}
        onClose={() => setShowAddDrawer(false)}
        onSave={handleAdd}
        mode="add"
      />

      {/* Edit drawer */}
      <AddSIDrawer
        isOpen={!!editingSI}
        onClose={() => setEditingSI(null)}
        onSave={handleEdit}
        mode="edit"
        initialData={editingSI}
      />
    </div>
  );
}
