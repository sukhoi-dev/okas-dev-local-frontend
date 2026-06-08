import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Pencil, Archive } from 'lucide-react';
import { TopNav, LeftNav } from '../shared/SharedNav';
import FilterDropdown from '../project-managers/FilterDropdown';
import { DUMMY_PROJECTS } from './projectsDummyData';

// ── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = status?.toLowerCase();

  if (s === 'in_progress') {
    return (
      <div className="flex gap-[8px] items-center">
        <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="6.5" stroke="#5c7089" strokeWidth="1.3" />
          <path d="M8 5V8L10 10" stroke="#5c7089" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        </svg>
        <p className="text-[14px] text-[#5c7089]" style={{ fontFamily: 'Inter, sans-serif' }}>
          In Progress
        </p>
      </div>
    );
  }

  const active = s === 'active';
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

// ── Kebab Menu ─────────────────────────────────────────────────────────────────
function KebabMenu({ onView, onEdit, onArchive }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const items = [
    { label: 'View Details', icon: Eye,     action: onView    },
    { label: 'Edit',         icon: Pencil,  action: onEdit    },
    { label: 'Archive',      icon: Archive, action: onArchive },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={(e) => { e.stopPropagation(); setIsOpen((v) => !v); }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
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
                  onClick={(e) => { e.stopPropagation(); item.action?.(); setIsOpen(false); }}
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

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function DistributorProjectsPage() {
  const [projects, setProjects]             = useState([]);
  const [isLoading, setIsLoading]           = useState(false);
  const [fetchError, setFetchError]         = useState(null);
  const [searchQuery, setSearchQuery]       = useState('');
  const [appliedFilters, setAppliedFilters] = useState({});
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterRef = useRef(null);

  const fetchProjects = useCallback(() => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const selectedSIs      = appliedFilters['Assigned SI']         ?? [];
      const selectedProjects = appliedFilters['Project Information']  ?? [];
      const q = searchQuery.toLowerCase();

      let data = [...DUMMY_PROJECTS];

      if (q) {
        data = data.filter((p) =>
          p.name.toLowerCase().includes(q) ||
          p.assignedSI.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
        );
      }
      if (selectedSIs.length) {
        data = data.filter((p) => selectedSIs.includes(p.assignedSI));
      }
      if (selectedProjects.length) {
        data = data.filter((p) => selectedProjects.includes(p.name));
      }

      setProjects(data);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load projects.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, appliedFilters]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target))
        setShowFilterDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allSINames      = [...new Set(DUMMY_PROJECTS.map((p) => p.assignedSI))];
  const allProjectNames = [...new Set(DUMMY_PROJECTS.map((p) => p.name))];

  const filterCategories = [
    { name: 'Assigned SI',         options: allSINames.map((n) => ({ label: n, value: n })) },
    { name: 'Project Information', options: allProjectNames.map((n) => ({ label: n, value: n })) },
  ];

  const hasActiveFilters = Object.values(appliedFilters).some((a) => a.length > 0);

  return (
    <div className="bg-white flex flex-col h-screen w-full overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />

        <div className="bg-[#f4f7fb] flex-1 min-w-0 flex flex-col gap-[28px] overflow-y-auto overflow-x-hidden pb-[40px] pt-[32px] px-[40px]">

          {/* Page title */}
          <p className="font-semibold text-[#0a1e3f] text-[40px] tracking-[-0.8px] leading-[1.1]"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            Projects
          </p>

          {/* Toolbar */}
          <div className="flex items-center gap-[12px]">

            {/* Filters button */}
            <div className="relative" ref={filterRef}>
              <motion.button
                onClick={() => setShowFilterDropdown((v) => !v)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white h-[44px] rounded-[4px] px-[16px] border border-[#e2e2e2] hover:bg-[#f4f7fb] transition-colors flex items-center gap-[8px]"
              >
                <svg className="size-[18px]" fill="none" viewBox="0 0 18 18">
                  <path d="M2.5 5.5H15.5M5.5 9H12.5M8 12.5H10" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.3" />
                </svg>
                <p className="text-[14px] font-medium text-[#0a1e3f] whitespace-nowrap"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Filters</p>
                {hasActiveFilters && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="bg-[#0a1e3f] text-white rounded-full size-[20px] flex items-center justify-center text-[11px] font-semibold"
                  >
                    {Object.values(appliedFilters).reduce((acc, a) => acc + a.length, 0)}
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

            {/* Search bar */}
            <div className="bg-white h-[44px] rounded-[4px] w-[280px] border border-[#e2e2e2] flex items-center gap-[8px] px-[16px]">
              <svg className="shrink-0 size-[18px]" fill="none" viewBox="0 0 18 18">
                <circle cx="8" cy="8" r="5.5" stroke="#5C7089" strokeWidth="1.3" />
                <path d="M12 12L15.5 15.5" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.3" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search system integrators"
                className="flex-1 bg-transparent outline-none text-[14px] text-[#0a1e3f] placeholder:text-[#5c7089]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#5c7089] hover:text-[#0a1e3f] text-[16px] leading-none"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[4px] w-full border border-[#e2e2e2]">

            {/* Header row */}
            <div className="flex items-center px-[24px] h-[52px] border-b border-[#e2e2e2]">
              <div className="w-[28%] min-w-0">
                <p className="text-[11px] font-medium text-[#5c7089] tracking-[1.6px] uppercase"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Project Information</p>
              </div>
              <div className="w-[15%] min-w-0">
                <p className="text-[11px] font-medium text-[#5c7089] tracking-[1.6px] uppercase"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Serial Number</p>
              </div>
              <div className="w-[20%] min-w-0">
                <p className="text-[11px] font-medium text-[#5c7089] tracking-[1.6px] uppercase"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Assigned SI</p>
              </div>
              <div className="w-[18%] min-w-0">
                <p className="text-[11px] font-medium text-[#5c7089] tracking-[1.6px] uppercase"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Installation Date</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-[#5c7089] tracking-[1.6px] uppercase"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Status</p>
              </div>
              <div className="w-[48px] shrink-0" />
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
                <button
                  onClick={fetchProjects}
                  className="text-[13px] text-[#0a1e3f] underline"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !fetchError && projects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
                <svg className="size-[40px]" fill="none" viewBox="0 0 40 40">
                  <rect x="6" y="10" width="28" height="22" rx="3" stroke="#5C7089" strokeWidth="1.5" />
                  <path d="M13 18H27M13 23H21" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.5" />
                </svg>
                <p className="text-[15px] font-medium text-[#0a1e3f]"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {searchQuery || hasActiveFilters ? 'No results found' : 'No projects yet'}
                </p>
                <p className="text-[13px] text-[#5c7089]"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {searchQuery || hasActiveFilters
                    ? 'Try adjusting your search or filter.'
                    : 'Projects assigned to your system integrators will appear here.'}
                </p>
              </div>
            )}

            {/* Data rows */}
            {!isLoading && !fetchError && (
              <AnimatePresence mode="popLayout">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <motion.div
                      whileHover={{ backgroundColor: '#f8f9fb' }}
                      className="flex items-center px-[24px] h-[68px] bg-white transition-colors"
                    >
                      <div className="w-[28%] min-w-0 pr-[16px]">
                        <p className="text-[14px] font-semibold text-[#0a1e3f] truncate"
                          style={{ fontFamily: 'Inter, sans-serif' }}>{project.name}</p>
                        <p className="text-[12px] text-[#5c7089] truncate mt-[2px]"
                          style={{ fontFamily: 'Inter, sans-serif' }}>{project.address}</p>
                      </div>
                      <div className="w-[15%] min-w-0 pr-[16px]">
                        <p className="text-[14px] text-[#0a1e3f] truncate"
                          style={{ fontFamily: 'Inter, sans-serif' }}>{project.serialNumber}</p>
                      </div>
                      <div className="w-[20%] min-w-0 pr-[16px]">
                        <p className="text-[14px] text-[#0a1e3f] truncate"
                          style={{ fontFamily: 'Inter, sans-serif' }}>{project.assignedSI}</p>
                      </div>
                      <div className="w-[18%] min-w-0 pr-[16px]">
                        <p className="text-[14px] text-[#0a1e3f] truncate"
                          style={{ fontFamily: 'Inter, sans-serif' }}>{project.installationDate}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <StatusBadge status={project.status} />
                      </div>
                      <div className="w-[48px] shrink-0 flex justify-end">
                        <KebabMenu
                          onView={() => {}}
                          onEdit={() => {}}
                          onArchive={() => {}}
                        />
                      </div>
                    </motion.div>
                    {index < projects.length - 1 && <div className="h-px bg-[#e2e2e2]" />}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
