import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import FilterDropdown from '../../project-managers/FilterDropdown';
import AddProjectDrawer from './AddProjectDrawer';
import { useProjects } from './useProjects';
import projectService from './projectService';
import { TopNav, LeftNav } from '../../shared/SharedNav';

function mapApiProject(p) {
  const addressParts = [p.address, p.landmark].filter(Boolean).join(', ');
  const raw = p.installed_at ? new Date(p.installed_at) : null;
  const installationDate = raw
    ? `${String(raw.getDate()).padStart(2, '0')}-${String(raw.getMonth() + 1).padStart(2, '0')}-${raw.getFullYear()}`
    : '—';
  return {
    id: p.id,
    name: p.name || p.building_id || '—',
    address: addressParts || '—',
    serialNo: p.okas_box_info || p.serial_number || '—',
    assignedMember: p.project_manager_id ?? p.assigned_member ?? '—',
    installationDate,
    status: p.status || 'Active',
  };
}

function StatusBadge({ status }) {
  if (status === 'Active'||'active') {
    return (
      <div className="flex items-center gap-[6px]">
        <span className="w-[8px] h-[8px] rounded-full bg-[#0a1e3f] shrink-0" />
        <span className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#0a1e3f]">Active</span>
      </div>
    );
  }
  if (status === 'In Progress') {
    return (
      <div className="flex items-center gap-[6px]">
        <svg className="shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="6.5" stroke="#5C7089" strokeWidth="1.3" />
          <path d="M8 5V8.5L10 10" stroke="#5C7089" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        </svg>
        <span className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#5c7089]">In Progress</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-[6px]">
      <span className="w-[8px] h-[8px] rounded-full border border-[#5c7089] shrink-0" />
      <span className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#5c7089]">Inactive</span>
    </div>
  );
}

function KebabMenu({ onEdit, onDelete, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);

  const toggle = (val) => {
    if (val && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    setIsOpen(val);
    setConfirmDelete(false);
    onOpenChange?.(val);
  };

  return (
    <div>
      <motion.button
        ref={btnRef}
        onClick={() => toggle(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center rounded-[4px] size-[32px] hover:bg-[#f4f7fb] transition-colors"
      >
        <svg className="size-[20px]" fill="none" viewBox="0 0 20 20">
          <circle cx="10" cy="5"  r="1.2" fill="#5C7089" />
          <circle cx="10" cy="10" r="1.2" fill="#5C7089" />
          <circle cx="10" cy="15" r="1.2" fill="#5C7089" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0" style={{ zIndex: 150 }} onClick={() => toggle(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15 }}
              style={{ position: 'fixed', top: menuPos.top, right: menuPos.right, zIndex: 200 }}
              className="w-[160px] bg-white rounded-[8px] shadow-[0px_8px_32px_0px_rgba(10,30,63,0.12)] border border-[#e2e2e2] overflow-hidden"
            >
              {confirmDelete ? (
                <div className="px-[16px] py-[10px] flex flex-col gap-[8px]">
                  <p className="font-['Inter:Medium',sans-serif] text-[#0a1e3f] text-[13px]">Delete this project?</p>
                  <div className="flex gap-[8px]">
                    <button onClick={() => { toggle(false); onDelete(); }} className="flex-1 bg-[#ff4444] text-white text-[12px] font-['Inter:Medium',sans-serif] rounded-[4px] py-[6px] hover:bg-[#e03333] transition-colors">Yes</button>
                    <button onClick={() => setConfirmDelete(false)} className="flex-1 border border-[#e2e2e2] text-[#5c7089] text-[12px] font-['Inter:Medium',sans-serif] rounded-[4px] py-[6px] hover:bg-[#f4f7fb] transition-colors">No</button>
                  </div>
                </div>
              ) : (
                <>
                  <motion.button onClick={() => { toggle(false); onEdit(); }} whileHover={{ x: 4, backgroundColor: '#f4f7fb' }} className="w-full px-[16px] py-[12px] text-left text-[14px] text-[#0a1e3f] font-['Inter:Medium',sans-serif] font-medium transition-colors">Edit</motion.button>
                  <div className="h-px bg-[#e2e2e2]" />
                  <motion.button whileHover={{ x: 4, backgroundColor: '#f4f7fb' }} className="w-full px-[16px] py-[12px] text-left text-[14px] text-[#0a1e3f] font-['Inter:Medium',sans-serif] font-medium transition-colors">Configure</motion.button>
                  <div className="h-px bg-[#e2e2e2]" />
                  <motion.button onClick={() => setConfirmDelete(true)} whileHover={{ x: 4, backgroundColor: '#fef2f2' }} className="w-full px-[16px] py-[12px] text-left text-[14px] text-[#ff4444] font-['Inter:Medium',sans-serif] font-medium transition-colors">Delete</motion.button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProjectsPage() {
  const { data, isLoading, isError, refetch } = useProjects();

  const rawProjects = data?.body?.projects ?? data?.projects ?? (Array.isArray(data) ? data : []);
  const allProjects = rawProjects.map(mapApiProject);

  const [memberNames, setMemberNames] = useState({});

  useEffect(() => {
    projectService.getMembers()
      .then(data => {
        const list = data?.body?.members ?? data?.body?.data ?? data?.members ?? data?.data ?? (Array.isArray(data?.body) ? data.body : Array.isArray(data) ? data : []);
        const map = {};
        list.forEach(m => { map[m.id] = m.full_name || m.name || String(m.id); });
        setMemberNames(map);
      })
      .catch(() => {});
  }, []);

  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [localDeleted, setLocalDeleted] = useState([]);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [editData, setEditData] = useState(undefined);
  const [editId, setEditId] = useState(undefined);
  const [openKebabId, setOpenKebabId] = useState(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilter(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const projects = allProjects.filter(p => !localDeleted.includes(p.id));

  const filterCategories = [
    {
      name: 'Assigned Member',
      options: [...new Set(projects.map(p => p.assignedMember))].sort().map(id => ({
        label: memberNames[id] || id,
        value: id,
      })),
    },
    { name: 'Project Information', options: [...new Set(projects.map(p => p.name))].sort().map(n => ({ label: n, value: n })) },
  ];

  const filtered = projects.filter(p => {
    const q = search.toLowerCase();
    const memberDisplay = (memberNames[p.assignedMember] || String(p.assignedMember)).toLowerCase();
    const matchSearch =
      String(p.name).toLowerCase().includes(q) ||
      String(p.address).toLowerCase().includes(q) ||
      String(p.serialNo).toLowerCase().includes(q) ||
      String(p.status).toLowerCase().includes(q) ||
      memberDisplay.includes(q);
    const selMembers  = appliedFilters['Assigned Member']    ?? [];
    const selProjects = appliedFilters['Project Information'] ?? [];
    return (
      matchSearch &&
      (selMembers.length  === 0 || selMembers.includes(p.assignedMember)) &&
      (selProjects.length === 0 || selProjects.includes(p.name))
    );
  });

  const handleDelete = (id) => setLocalDeleted(prev => [...prev, id]);

  const handleEdit = (id) => {
    const raw = rawProjects.find(p => p.id === id);
    if (!raw) return;

    const ownerPhone = raw.owner?.phone || raw.mobile || '';
    const knownCodes = ['+91', '+1', '+44', '+86'];
    const phoneCountryCode = knownCodes.find(c => ownerPhone.startsWith(c)) || '+91';
    const phoneNumber = ownerPhone.startsWith(phoneCountryCode) ? ownerPhone.slice(phoneCountryCode.length) : ownerPhone;

    const rawType = raw.project_type || raw.building_type || 'residential';
    const buildingType = rawType.charAt(0).toUpperCase() + rawType.slice(1);

    setEditData({
      projectName:      raw.name            || '',
      buildingId:       raw.building_id || (raw.id != null ? String(raw.id) : ''),
      buildingType,
      address:          raw.address         || '',
      landmark:         raw.landmark        || raw.notes || '',
      assignedMember:   raw.project_manager_id ?? raw.assigned_member ?? '',
      contactName:      raw.owner?.full_name || raw.owner?.name || '',
      phoneCountryCode,
      phoneNumber,
      email:            raw.owner?.email    || raw.email || '',
      serialNumber:     raw.serial_number   || raw.okas_box_info || '',
    });
    setEditId(id);
    setShowEditDrawer(true);
  };

  const activeFilterCount = Object.values(appliedFilters).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className="bg-white flex flex-col h-screen w-full overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
    <div className="bg-[#f4f7fb] flex flex-col gap-[28px] items-start overflow-y-auto pb-[40px] pt-[32px] px-[40px] flex-1 h-full">
      {/* Page Title */}
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.1] text-[#0a1e3f] text-[40px] tracking-[-0.8px]">Projects</p>

      {/* Toolbar */}
      <div className="flex gap-[12px] items-center justify-between relative shrink-0 w-full">
        <div className="flex gap-[12px] items-center">
          {/* Filters */}
          <div className="relative" ref={filterRef}>
            <motion.button
              onClick={() => setShowFilter(!showFilter)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white h-[44px] rounded-[4px] px-[16px] border border-[#e2e2e2] font-['Inter:Medium',sans-serif] font-medium text-[#0a1e3f] text-[14px] hover:bg-[#f4f7fb] transition-colors flex items-center gap-[8px]"
            >
              <svg className="size-[18px]" fill="none" viewBox="0 0 20 20">
                <path d="M3 6H17M6 10H14M8 14H12" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.4" />
              </svg>
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-[#0a1e3f] text-white rounded-full size-[20px] flex items-center justify-center text-[11px] font-semibold">
                  {activeFilterCount}
                </motion.span>
              )}
            </motion.button>
            {showFilter && (
              <FilterDropdown
                categories={filterCategories}
                onApply={(f) => setAppliedFilters(f)}
                onClose={() => setShowFilter(false)}
                initialFilters={appliedFilters}
              />
            )}
          </div>

          {/* Search */}
          <div className="bg-white h-[44px] rounded-[4px] w-[280px] border border-[#e2e2e2] flex items-center gap-[8px] px-[16px]">
            <svg className="shrink-0 size-[18px]" fill="none" viewBox="0 0 20 20">
              <circle cx="9" cy="9" r="5.5" stroke="#5C7089" strokeWidth="1.4" />
              <path d="M13 13L16.5 16.5" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search project"
              className="flex-1 font-['Inter:Regular',sans-serif] text-[#5c7089] text-[14px] bg-transparent border-none outline-none placeholder:text-[#5c7089]"
            />
          </div>
        </div>

        {/* Add New Project */}
        <motion.button
          onClick={() => setShowAddDrawer(true)}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="bg-[#0a1e3f] flex gap-[8px] h-[44px] items-center justify-center px-[20px] rounded-[4px] shrink-0 hover:bg-[#0a2a5a] transition-colors shadow-sm hover:shadow-lg"
        >
          <motion.svg animate={{ rotate: [0, 90, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="shrink-0 size-[20px]" fill="none" viewBox="0 0 20 20">
            <path d="M10 4V16M4 10H16" stroke="white" strokeLinecap="round" strokeWidth="1.6" />
          </motion.svg>
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white tracking-[0.14px] whitespace-nowrap">Add New Project</p>
        </motion.button>
      </div>

      {/* Table */}
      <div className="bg-white relative rounded-[4px] shrink-0 w-full border border-[#e2e2e2] overflow-x-auto" style={{ minHeight: '733px', maxHeight: '733px' }}>
        <div className="flex flex-col items-start min-w-[900px] w-full">
          {/* Header row */}
          <div className="flex items-center px-[24px] h-[52px] w-full">
            <div className="flex-1 min-w-0 pr-[16px]">
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">PROJECT INFORMATION</p>
            </div>
            <div className="w-[160px] shrink-0">
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">SERIAL NUMBER</p>
            </div>
            <div className="w-[180px] shrink-0">
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">ASSIGNED MEMBER</p>
            </div>
            <div className="w-[160px] shrink-0">
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">INSTALLATION DATE</p>
            </div>
            <div className="w-[120px] shrink-0">
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">STATUS</p>
            </div>
            <div className="w-[80px] shrink-0 flex justify-center">
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">ACTION</p>
            </div>
          </div>
          <div className="bg-[#e2e2e2] h-px w-full" />

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center w-full py-[60px]">
              <div className="w-[28px] h-[28px] border-[3px] border-[#e2e2e2] border-t-[#0a1e3f] rounded-full animate-spin" />
            </div>
          )}

          {/* Error */}
          {isError && !isLoading && (
            <div className="flex flex-col items-center justify-center w-full py-[60px] gap-[12px]">
              <p className="font-['Inter:Medium',sans-serif] text-[14px] text-[#ff4444]">Failed to load projects</p>
              <motion.button onClick={() => refetch()} whileHover={{ scale: 1.03 }} className="px-[16px] py-[8px] rounded-[4px] bg-[#0a1e3f] text-white text-[13px] font-['Inter:Medium',sans-serif]">Retry</motion.button>
            </div>
          )}

          {/* Rows */}
          {!isLoading && !isError && (
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center w-full py-[60px]">
                  <p className="font-['Inter:Regular',sans-serif] text-[#5c7089] text-[14px]">No projects found.</p>
                </motion.div>
              ) : (
                filtered.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -80 }}
                    transition={{ delay: index * 0.04 }}
                    style={{ position: 'relative', zIndex: openKebabId === project.id ? 50 : 0 }}
                    className="w-full"
                  >
                    <motion.div
                      whileHover={{ backgroundColor: '#f8fafc' }}
                      className="flex items-center px-[24px] h-[68px] bg-white w-full transition-colors border-b border-[#e2e2e2]"
                    >
                      {/* Project Information */}
                      <div className="flex-1 min-w-0 flex flex-col gap-[2px] pr-[16px]">
                        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0a1e3f] text-[14px] truncate">{project.name}</p>
                        <p className="font-['Inter:Regular',sans-serif] text-[#5c7089] text-[12px] truncate">{project.address}</p>
                      </div>
                      {/* Serial Number */}
                      <div className="w-[160px] shrink-0 pr-[16px]">
                        <p className="font-['Inter:Regular',sans-serif] text-[#1a7f64] text-[14px] truncate">{project.serialNo}</p>
                      </div>
                      {/* Assigned Member */}
                      <div className="w-[180px] shrink-0 pr-[16px]">
                        <p className="font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[14px] truncate">
                          {memberNames[project.assignedMember] || project.assignedMember}
                        </p>
                      </div>
                      {/* Installation Date */}
                      <div className="w-[160px] shrink-0 pr-[16px]">
                        <p className="font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[14px] truncate">{project.installationDate}</p>
                      </div>
                      {/* Status */}
                      <div className="w-[120px] shrink-0">
                        <StatusBadge status={project.status} />
                      </div>
                      {/* Kebab */}
                      <div className="w-[80px] shrink-0 flex justify-center">
                        <KebabMenu
                          onEdit={() => handleEdit(project.id)}
                          onDelete={() => handleDelete(project.id)}
                          onOpenChange={(open) => setOpenKebabId(open ? project.id : null)}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Add Drawer */}
      <AddProjectDrawer
        isOpen={showAddDrawer}
        onClose={() => setShowAddDrawer(false)}
        onSave={() => { setShowAddDrawer(false); refetch(); }}
      />

      {/* Edit Drawer */}
      <AddProjectDrawer
        isOpen={showEditDrawer}
        onClose={() => { setShowEditDrawer(false); setEditData(undefined); setEditId(undefined); }}
        onSave={() => { setShowEditDrawer(false); refetch(); }}
        mode="edit"
        initialData={editData}
        projectId={editId}
      />
    </div>
      </div>
    </div>
  );
}
