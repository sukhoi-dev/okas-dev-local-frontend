import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import svgPaths from './assets/svg-dashboard-projects';
import FilterDropdown from './FilterDropdown';
import AddProjectDrawer from './AddProjectDrawer';
import { TopNav, LeftNav } from '../shared/SharedNav';
import { DUMMY_PROJECTS } from './dummyData';

function mapApiProject(p) {
  const addressParts = [p.address, p.landmark].filter(Boolean).join(', ');
  return {
    id: p.id,
    owner: p.name,
    address: addressParts,
    serialNo: p.okas_box_info || '—',
    manager: p.assigned_member,
    installedDT: p.created_at
      ? new Date(p.created_at).toLocaleString('en-GB', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit',
        }).replace(',', '')
      : 'N/A',
    subscription: 'N/A',
  };
}

function ProjectKebabMenu({ onEdit, onDelete, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggle = (val) => {
    setIsOpen(val);
    setConfirmDelete(false);
    onOpenChange?.(val);
  };

  const handleDelete = () => {
    toggle(false);
    onDelete();
  };

  const handleEdit = () => {
    toggle(false);
    onEdit();
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => toggle(!isOpen)}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center rounded-[4px] shrink-0 size-[32px] hover:bg-[#f4f7fb] transition-colors"
      >
        <div className="relative shrink-0 size-[20px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p5447340} fill="#5C7089" />
            <path d={svgPaths.p261b7780} fill="#5C7089" />
            <path d={svgPaths.p2d702100} fill="#5C7089" />
          </svg>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => toggle(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 w-[160px] bg-white rounded-[8px] shadow-[0px_8px_32px_0px_rgba(10,30,63,0.12)] border border-[#e2e2e2] overflow-hidden z-20"
            >
              {confirmDelete ? (
                <div className="px-[16px] py-[10px] flex flex-col gap-[8px]">
                  <p className="font-['Inter:Medium',sans-serif] text-[#0a1e3f] text-[13px]">Delete this project?</p>
                  <div className="flex gap-[8px]">
                    <button onClick={handleDelete} className="flex-1 bg-[#ff4444] text-white text-[12px] font-['Inter:Medium',sans-serif] rounded-[4px] py-[6px] hover:bg-[#e03333] transition-colors">
                      Yes
                    </button>
                    <button onClick={() => setConfirmDelete(false)} className="flex-1 border border-[#e2e2e2] text-[#5c7089] text-[12px] font-['Inter:Medium',sans-serif] rounded-[4px] py-[6px] hover:bg-[#f4f7fb] transition-colors">
                      No
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <motion.button onClick={handleEdit} whileHover={{ x: 4, backgroundColor: '#f4f7fb' }} className="w-full px-[16px] py-[12px] text-left text-[14px] text-[#0a1e3f] transition-colors font-['Inter:Medium',sans-serif] font-medium">
                    Edit
                  </motion.button>
                  <div className="h-px w-full bg-[#e2e2e2]" />
                  <motion.button whileHover={{ x: 4, backgroundColor: '#f4f7fb' }} className="w-full px-[16px] py-[12px] text-left text-[14px] text-[#0a1e3f] transition-colors font-['Inter:Medium',sans-serif] font-medium">
                    Configure
                  </motion.button>
                  <div className="h-px w-full bg-[#e2e2e2]" />
                  <motion.button onClick={() => setConfirmDelete(true)} whileHover={{ x: 4, backgroundColor: '#fef2f2' }} className="w-full px-[16px] py-[12px] text-left text-[14px] text-[#ff4444] transition-colors font-['Inter:Medium',sans-serif] font-medium">
                    Delete
                  </motion.button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProjectManagersPage() {
  const navigate = useNavigate();
  const [projectSearch, setProjectSearch] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [projects, setProjects] = useState([]);
  const [apiProjects, setApiProjects] = useState([]);
  const [showAddProjectDrawer, setShowAddProjectDrawer] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [editProjectData, setEditProjectData] = useState(undefined);
  const [editProjectId, setEditProjectId] = useState(undefined);
  const [openKebabId, setOpenKebabId] = useState(null);
  const filterRef = useRef(null);

  const fetchProjects = () => {
    setApiProjects(DUMMY_PROJECTS);
    setProjects(DUMMY_PROJECTS.map(mapApiProject));
  };

  const filterCategories = [
    { name: 'Owner', options: [...new Set(projects.map(p => p.owner))].sort().map(name => ({ label: name, value: name })) },
    { name: 'Manager', options: [...new Set(projects.map(p => p.manager))].sort().map(name => ({ label: name, value: name })) },
  ];

  useEffect(() => { fetchProjects(); }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.owner.toLowerCase().includes(projectSearch.toLowerCase()) ||
      project.address.toLowerCase().includes(projectSearch.toLowerCase());
    const selectedOwners = appliedFilters['Owner'] ?? [];
    const selectedManagers = appliedFilters['Manager'] ?? [];
    const matchesOwner = selectedOwners.length === 0 || selectedOwners.includes(project.owner);
    const matchesManager = selectedManagers.length === 0 || selectedManagers.includes(project.manager);
    return matchesSearch && matchesOwner && matchesManager;
  });

  const handleDelete = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setApiProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const handleEdit = (projectId) => {
    const raw = apiProjects.find(p => p.id === projectId);
    if (raw) {
      setEditProjectData({
        buildingId: raw.building_id,
        buildingType: raw.building_type || 'Residential',
        address: raw.address,
        landmark: raw.landmark || '',
        assignedMember: raw.assigned_member,
        contactName: raw.name,
        phoneCountryCode: '+91',
        phoneNumber: raw.mobile || '',
        email: raw.email || '',
        serialNumber: raw.okas_box_info || '',
      });
      setEditProjectId(projectId);
      setShowEditDrawer(true);
    }
  };

  return (
    <div className="bg-white flex flex-col items-start relative h-screen w-full overflow-hidden">
      <TopNav />

      <div className="flex flex-1 items-start relative w-full overflow-hidden">
        <LeftNav />

        <div className="bg-[#f4f7fb] flex flex-col gap-[20px] md:gap-[28px] items-start overflow-y-auto pb-[20px] md:pb-[40px] pt-[20px] md:pt-[32px] px-[16px] md:px-[40px] relative flex-1 w-full h-full">
          <div className="flex flex-col gap-[20px] md:gap-[28px] items-start relative shrink-0 w-full">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.1] text-[#0a1e3f] text-[24px] md:text-[32px] lg:text-[40px] tracking-[-0.8px]">List of Projects</p>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-[12px] items-stretch md:items-center justify-between relative shrink-0 w-full">
              <div className="flex flex-wrap gap-[12px] items-center relative">
                <div className="relative" ref={filterRef}>
                  <motion.button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white h-[40px] md:h-[44px] rounded-[4px] px-[14px] md:px-[16px] border border-[#e2e2e2] font-['Inter:Medium',sans-serif] font-medium text-[#0a1e3f] text-[13px] md:text-[14px] hover:bg-[#f4f7fb] transition-colors flex items-center gap-[8px]"
                  >
                    <svg className="size-[20px]" fill="none" viewBox="0 0 20 20">
                      <path d="M3 6H17M6 10H14M8 14H12" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.4" />
                    </svg>
                    <span>Filters</span>
                    {Object.values(appliedFilters).some(arr => arr.length > 0) && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-[#0a1e3f] text-white rounded-full size-[20px] flex items-center justify-center text-[11px] font-semibold">
                        {Object.values(appliedFilters).reduce((acc, arr) => acc + arr.length, 0)}
                      </motion.span>
                    )}
                  </motion.button>
                  {showFilterDropdown && (
                    <FilterDropdown categories={filterCategories} onApply={(f) => setAppliedFilters(f)} onClose={() => setShowFilterDropdown(false)} />
                  )}
                </div>

                <motion.div whileFocus={{ scale: 1.01 }} className="bg-white h-[40px] md:h-[44px] relative rounded-[4px] w-full md:w-[280px] border border-[#e2e2e2] focus-within:ring-2 focus-within:ring-[#0a1e3f]/10 focus-within:border-[#0a1e3f]/30 transition-all">
                  <div className="flex gap-[8px] items-center px-[14px] md:px-[16px] rounded-[inherit] size-full">
                    <svg className="shrink-0 size-[20px]" fill="none" viewBox="0 0 20 20">
                      <path d={svgPaths.p204aec00} stroke="#5C7089" strokeWidth="1.4" />
                      <path d="M13 13L16.5 16.5" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" />
                    </svg>
                    <input type="text" value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} placeholder="Search projects" className="flex-1 font-['Inter:Regular',sans-serif] font-normal text-[#5c7089] text-[14px] bg-transparent border-none outline-none placeholder:text-[#5c7089]" />
                  </div>
                </motion.div>
              </div>

              <motion.button
                onClick={() => setShowAddProjectDrawer(true)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#0a1e3f] flex gap-[8px] h-[40px] md:h-[44px] items-center justify-center px-[16px] md:px-[20px] rounded-[4px] shrink-0 w-full md:w-[180px] hover:bg-[#0a2a5a] transition-colors shadow-sm hover:shadow-lg"
              >
                <motion.svg animate={{ rotate: [0, 90, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="shrink-0 size-[20px]" fill="none" viewBox="0 0 20 20">
                  <path d="M10 4V16M4 10H16" stroke="white" strokeLinecap="round" strokeWidth="1.6" />
                </motion.svg>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white tracking-[0.14px] whitespace-nowrap">Add New Project</p>
              </motion.button>
            </div>

            {/* Table */}
            <div className="bg-white relative rounded-[4px] shrink-0 w-full border border-[#e2e2e2] overflow-x-auto flex-1">
              <div className="flex flex-col items-start relative rounded-[inherit] min-w-[1200px] w-full">

                {/* Header */}
                <div className="bg-white h-[52px] relative shrink-0 w-full">
                  <div className="flex items-center px-[24px] h-full">
                    <div className="flex h-[52px] items-center w-[180px]"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px] whitespace-nowrap">OWNER</p></div>
                    <div className="flex h-[52px] items-center w-[220px]"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px] whitespace-nowrap">ADDRESS</p></div>
                    <div className="flex h-[52px] items-center w-[150px]"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px] whitespace-nowrap">SERIAL NO.</p></div>
                    <div className="flex h-[52px] items-center w-[150px]"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px] whitespace-nowrap">MANAGER</p></div>
                    <div className="flex h-[52px] items-center w-[190px]"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px] whitespace-nowrap">INSTALLED D&T</p></div>
                    <div className="flex h-[52px] items-center flex-1"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px] whitespace-nowrap">SUBSCRIPTION</p></div>
                    <div className="flex h-[52px] items-center justify-end w-[104px]"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px] whitespace-nowrap">ACTION</p></div>
                  </div>
                </div>

                <div className="bg-[#e2e2e2] h-px shrink-0 w-full" />

                {/* Rows */}
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project, index) => (
                    <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ delay: index * 0.05 }} style={{ position: 'relative', zIndex: openKebabId === project.id ? 50 : 0 }}>
                      <motion.div whileHover={{ backgroundColor: '#f4f7fb', x: 4 }} className="bg-white h-[64px] relative shrink-0 w-full transition-colors">
                        <div className="flex items-center px-[24px] h-full">
                          <div className="flex h-[64px] items-center w-[180px]"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#0a1e3f] text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">{project.owner}</p></div>
                          <div className="flex h-[64px] items-center w-[220px]"><p className="font-['Inter:Regular',sans-serif] text-[#5c7089] text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">{project.address}</p></div>
                          <div className="flex h-[64px] items-center w-[150px]"><p className="font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">{project.serialNo}</p></div>
                          <div className="flex h-[64px] items-center w-[150px]"><p className="font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">{project.manager}</p></div>
                          <div className="flex h-[64px] items-center w-[190px]"><p className="font-['Inter:Regular',sans-serif] text-[#5c7089] text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">{project.installedDT}</p></div>
                          <div className="flex h-[64px] items-center flex-1"><p className="font-['Inter:Regular',sans-serif] text-[#5c7089] text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">{project.subscription}</p></div>
                          <div className="flex h-[64px] items-center justify-end w-[294px]">
                            <ProjectKebabMenu
                              onEdit={() => handleEdit(project.id)}
                              onDelete={() => handleDelete(project.id)}
                              onOpenChange={(open) => setOpenKebabId(open ? project.id : null)}
                            />
                          </div>
                        </div>
                      </motion.div>
                      {index < filteredProjects.length - 1 && <div className="bg-[#e2e2e2] h-px shrink-0 w-full" />}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="absolute left-0 size-[20px] top-0">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <path d={svgPaths.p13fe4b00} fill="white" />
            </svg>
          </div>
        </div>
      </div>

      <AddProjectDrawer isOpen={showAddProjectDrawer} onClose={() => setShowAddProjectDrawer(false)} onSave={fetchProjects} />
      <AddProjectDrawer
        isOpen={showEditDrawer}
        onClose={() => { setShowEditDrawer(false); setEditProjectData(undefined); setEditProjectId(undefined); }}
        onSave={() => { setShowEditDrawer(false); fetchProjects(); }}
        mode="edit"
        initialData={editProjectData}
        projectId={editProjectId}
      />
    </div>
  );
}
