import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_PROJECTS, MOCK_MEMBERS } from '../_assets/mockData';

let nextProjectId = 50;

export default function DashboardPage({ onProjectSelected }) {
  const handleProjectSelect = (project) => {
    onProjectSelected(project.building_id, project.building_type);
  };

  return (
    <div className="relative size-full overflow-hidden bg-[#f4f7fb]">
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-8">
        <div className="w-full max-w-[1200px] h-auto max-h-[90vh] overflow-auto">
          <ProjectSelectionModal onSelectProject={handleProjectSelect} />
        </div>
      </div>
    </div>
  );
}

function ProjectSelectionModal({ onSelectProject }) {
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState('buildingType');
  const [appliedTypes, setAppliedTypes] = useState([]);
  const [pendingTypes, setPendingTypes] = useState([]);
  const [filterOptionSearch, setFilterOptionSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [activeActionId, setActiveActionId] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [showAddDrawer, setShowAddDrawer] = useState(false);

  const BUILDING_TYPES = ['Residential', 'Commercial', 'Industrial', 'Non business'];

  const filteredProjects = projects.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || [p.address, p.name, p.assigned_member, p.okas_box_info, p.building_id]
      .some(val => val?.toLowerCase().includes(q));
    const matchesType = appliedTypes.length === 0 || appliedTypes.includes(p.building_type);
    return matchesSearch && matchesType;
  });

  const openFilters = () => { setPendingTypes(appliedTypes); setFilterOptionSearch(''); setShowFilters(true); };
  const applyFilters = () => { setAppliedTypes(pendingTypes); setShowFilters(false); };
  const cancelFilters = () => setShowFilters(false);
  const handleDelete = (project) => setProjects(prev => prev.filter(p => p.id !== project.id));

  return (
    <div className="bg-white rounded-[4px] shadow-[0px_16px_48px_0px_rgba(10,30,63,0.12)] relative">
      <div className="flex flex-col gap-[8px] items-start pb-[28px] pt-[32px] px-[40px]">
        <div className="flex gap-[12px] items-center">
          <div className="bg-[#5c7089] h-px w-[24px]" />
          <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">PROJECTS — SELECT</p>
        </div>
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0a1e3f] text-[28px] tracking-[-0.56px]">Select a Project</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[#5c7089] text-[15px]">{`Choose which project you'd like to work on.`}</p>
      </div>

      <div className="bg-[#e2e2e2] h-px" />

      <div className="px-[40px] py-[24px]">
        <div className="flex items-center justify-between">
          <div className="flex gap-[12px] items-center">
            {/* Filters */}
            <div className="relative">
              <button onClick={openFilters} className={`h-[44px] rounded-[4px] border transition-colors ${appliedTypes.length > 0 ? 'bg-[#0a1e3f] border-[#0a1e3f]' : 'bg-white border-[#e2e2e2] hover:bg-[#f4f7fb]'}`}>
                <div className="flex gap-[10px] items-center px-[16px] h-full">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 5H17M5.5 10H14.5M8 15H12" stroke={appliedTypes.length > 0 ? 'white' : '#0A1E3F'} strokeLinecap="round" strokeWidth="1.4" />
                  </svg>
                  <p className={`font-['Inter:Medium',sans-serif] font-medium text-[14px] ${appliedTypes.length > 0 ? 'text-white' : 'text-[#0a1e3f]'}`}>
                    Filters{appliedTypes.length > 0 ? ` (${appliedTypes.length})` : ''}
                  </p>
                </div>
              </button>

              {showFilters && (
                <>
                  <div className="fixed inset-0 z-[9]" onClick={cancelFilters} />
                  <div className="absolute top-[52px] left-0 z-10 bg-white border border-[#e2e2e2] rounded-[12px] shadow-[0px_8px_32px_0px_rgba(10,30,63,0.12)] w-[480px] flex flex-col">
                    <div className="flex h-[360px]">
                      <div className="w-[140px] shrink-0 flex flex-col rounded-l-[12px] overflow-hidden" style={{ backgroundImage: "linear-gradient(rgb(248,249,251) 0%, rgb(244,247,251) 100%)" }}>
                        <div className="h-[49px] border-b border-[#e2e2e2] px-[16px] flex items-center">
                          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#5c7089] text-[11px] tracking-[1px] uppercase">Categories</p>
                        </div>
                        <div className="pt-[8px]">
                          {['buildingType', 'floor'].map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} className={`w-full h-[45px] flex items-center px-[16px] ${activeCategory === cat ? 'bg-white border-l-[3px] border-[#0a1e3f]' : ''}`}>
                              <p className={`font-['Inter:Medium',sans-serif] font-medium text-[14px] ${activeCategory === cat ? 'text-[#0a1e3f]' : 'text-[#5c7089]'}`}>{cat === 'buildingType' ? 'Building Type' : 'Floor'}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white flex-1 flex flex-col border-l border-[#e2e2e2] rounded-r-[12px] overflow-hidden">
                        <div className="h-[60px] border-b border-[#e2e2e2] px-[16px] flex items-center">
                          <div className="bg-[#f4f7fb] h-[36px] rounded-[8px] px-[12px] flex items-center gap-[8px] w-full">
                            <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><circle cx="8.1" cy="8.1" r="5.4" stroke="#5C7089" strokeWidth="1.4" /><path d="M11.7 11.7L14.85 14.85" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" /></svg>
                            <input type="text" value={filterOptionSearch} onChange={e => setFilterOptionSearch(e.target.value)} placeholder="Search..." className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#5c7089] text-[13px]" />
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto px-[12px] py-[8px] flex flex-col gap-[2px]">
                          {activeCategory === 'buildingType' && BUILDING_TYPES.filter(t => t.toLowerCase().includes(filterOptionSearch.toLowerCase())).map(type => (
                            <button key={type} onClick={() => setPendingTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])} className="h-[40px] rounded-[8px] flex items-center gap-[10px] px-[8px] hover:bg-[#f4f7fb] transition-colors">
                              <div className={`w-[18px] h-[18px] rounded-[4px] border shrink-0 flex items-center justify-center ${pendingTypes.includes(type) ? 'bg-[#0a1e3f] border-[#0a1e3f]' : 'bg-white border-[#d0d0d0]'}`}>
                                {pendingTypes.includes(type) && <svg width="11" height="11" viewBox="0 0 18 18" fill="none"><path d="M4 9L7.5 12.5L14 6" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>}
                              </div>
                              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[13px]">{type}</p>
                            </button>
                          ))}
                          {activeCategory === 'floor' && <p className="px-[8px] pt-[12px] font-['Inter:Regular',sans-serif] text-[#5c7089] text-[13px]">No floor filters available.</p>}
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#fafbfc] h-[68px] border-t border-[#e2e2e2] px-[20px] flex items-center justify-between rounded-b-[12px]">
                      <button onClick={() => setPendingTypes([])} className="flex items-center gap-[6px]">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4L12 12" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.5" /></svg>
                        <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[14px]">Clear All</p>
                      </button>
                      <div className="flex items-center gap-[10px]">
                        <button onClick={cancelFilters} className="h-[36px] px-[16px] rounded-[8px] font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[14px] hover:bg-[#f0f0f0] transition-colors">Cancel</button>
                        <button onClick={applyFilters} className="bg-[#0a1e3f] h-[36px] px-[16px] rounded-[8px] font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[14px] hover:bg-[#0d2851] transition-colors">Apply Filters</button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Search */}
            <div className="bg-white h-[44px] rounded-[4px] w-[280px] border border-[#e2e2e2]">
              <div className="flex gap-[10px] items-center px-[16px] h-full">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke="#5C7089" strokeWidth="1.4" /><path d="M13 13L16.5 16.5" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" /></svg>
                <input type="text" placeholder="Search projects" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 font-['Inter:Regular',sans-serif] text-[#5c7089] text-[14px] bg-transparent border-none outline-none" />
                {searchQuery && <button onClick={() => setSearchQuery('')} className="shrink-0 text-[#5c7089]"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 3L3 11M3 3L11 11" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" /></svg></button>}
              </div>
            </div>
          </div>

          <button onClick={() => setShowAddDrawer(true)} className="bg-[#0a1e3f] flex gap-[10px] h-[44px] items-center justify-center px-[20px] rounded-[4px] hover:bg-[#0d2851] transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4V16M4 10H16" stroke="white" strokeLinecap="round" strokeWidth="1.6" /></svg>
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[14px]">Add New Project</p>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="px-[40px] pb-[40px]">
        <div className="bg-white rounded-[4px] border border-[#e2e2e2]">
          <div className="bg-white h-[52px] flex items-center px-[24px]">
            <div className="w-[252px] shrink-0"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">ADDRESS</p></div>
            <div className="w-[210px] shrink-0"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">OWNER</p></div>
            <div className="w-[197px] shrink-0"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">SERIAL NO.</p></div>
            <div className="flex-1 shrink-0"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">PROJECT MANAGER</p></div>
            <div className="w-[72px] shrink-0 flex justify-end"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">ACTION</p></div>
          </div>

          {activeActionId && <div className="fixed inset-0 z-40" onClick={() => setActiveActionId(null)} />}

          {filteredProjects.length === 0 && (
            <><div className="bg-[#e2e2e2] h-px" /><div className="h-[64px] flex items-center px-[24px]"><p className="font-['Inter:Regular',sans-serif] text-[#5c7089] text-[14px]">No projects match your search.</p></div></>
          )}

          {filteredProjects.map((project, index) => (
            <div key={project.id ?? index}>
              <div className="bg-[#e2e2e2] h-px" />
              <div onClick={() => onSelectProject(project)} className="bg-white hover:bg-[#f4f7fb] h-[64px] flex items-center px-[24px] w-full transition-colors cursor-pointer">
                <div className="w-[252px] shrink-0 overflow-hidden"><p className="font-['Inter:Regular',sans-serif] text-[#5c7089] text-[14px] truncate">{project.address}</p></div>
                <div className="w-[210px] shrink-0 overflow-hidden"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#0a1e3f] text-[14px] truncate">{project.name}</p></div>
                <div className="w-[197px] shrink-0 overflow-hidden"><p className="font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[14px] truncate">{project.okas_box_info}</p></div>
                <div className="flex-1 overflow-hidden"><p className="font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[14px] truncate">{project.assigned_member}</p></div>
                <div className="w-[72px] shrink-0 flex justify-end relative">
                  <button onClick={e => { e.stopPropagation(); setActiveActionId(activeActionId === project.id ? null : project.id); }} className="w-[32px] h-[32px] flex items-center justify-center rounded-[4px] hover:bg-[#e2e2e2] z-50">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="5" r="1.5" fill="#5C7089" /><circle cx="10" cy="10" r="1.5" fill="#5C7089" /><circle cx="10" cy="15" r="1.5" fill="#5C7089" /></svg>
                  </button>
                  {activeActionId === project.id && (
                    <div className="absolute right-0 bottom-full mb-2 z-50 bg-white border border-[#e2e2e2] rounded-[8px] shadow-[0px_8px_32px_0px_rgba(10,30,63,0.12)] w-[160px] overflow-hidden">
                      <button onClick={e => { e.stopPropagation(); setActiveActionId(null); setEditingProject(project); }} className="w-full h-[44px] flex items-center gap-[10px] px-[16px] hover:bg-[#f4f7fb] transition-colors">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.167 13.5 2 14l.5-3.167L11.333 2Z" stroke="#5C7089" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <p className="font-['Inter:Medium',sans-serif] font-medium text-[#0a1e3f] text-[14px]">Edit</p>
                      </button>
                      <div className="bg-[#e2e2e2] h-px mx-[12px]" />
                      <button onClick={e => { e.stopPropagation(); setActiveActionId(null); handleDelete(project); }} className="w-full h-[44px] flex items-center gap-[10px] px-[16px] hover:bg-[#fff5f5] transition-colors">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4M6.667 7.333v4M9.333 7.333v4M3.333 4l.667 9.333A1.333 1.333 0 0 0 5.333 14.667h5.334a1.333 1.333 0 0 0 1.333-1.334L12.667 4" stroke="#E53E3E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <p className="font-['Inter:Medium',sans-serif] font-medium text-[#e53e3e] text-[14px]">Delete</p>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {editingProject && (
          <EditProjectDrawer
            key={editingProject.id}
            project={editingProject}
            onClose={() => setEditingProject(null)}
            onSave={updated => { setProjects(prev => prev.map(p => p.id === updated.id ? updated : p)); setEditingProject(null); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddDrawer && (
          <AddProjectDrawer
            onClose={() => setShowAddDrawer(false)}
            onSave={newProject => { setProjects(prev => [...prev, newProject]); setShowAddDrawer(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EditProjectDrawer({ project, onClose, onSave }) {
  const [form, setForm] = useState({
    buildingId: project.building_id,
    buildingType: project.building_type,
    address: project.address,
    landmark: project.landmark,
    assignedMember: project.assigned_member,
    contactName: project.name,
    phoneNumber: project.mobile,
    email: project.email,
    serialNumber: project.okas_box_info,
    description: project.description,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    onSave({
      ...project,
      building_id: form.buildingId,
      building_type: form.buildingType,
      name: form.contactName,
      mobile: form.phoneNumber,
      email: form.email,
      address: form.address,
      landmark: form.landmark,
      assigned_member: form.assignedMember,
      okas_box_info: form.serialNumber,
      description: form.description,
    });
    setSaving(false);
  };

  const inputClass = "bg-[#f4f7fb] h-[48px] rounded-[4px] px-[16px] font-['Inter:Regular',sans-serif] text-[15px] text-[#0a1e3f] placeholder:text-[#5c7089] border-none outline-none w-full";
  const labelClass = "font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]";
  const selectClass = "bg-[#f4f7fb] h-[48px] rounded-[4px] px-[16px] pr-[40px] font-['Inter:Regular',sans-serif] text-[15px] text-[#0a1e3f] border-none outline-none w-full appearance-none cursor-pointer";

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="fixed right-0 top-0 h-full w-[520px] bg-white shadow-[-8px_0px_24px_0px_rgba(10,30,63,0.12)] z-50 flex flex-col overflow-hidden">
        <div className="bg-white flex h-[72px] items-center justify-between pl-[28px] pr-[20px] shrink-0 border-b border-[#e2e2e2]">
          <div><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">PROJECTS — EDIT</p><p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0a1e3f] text-[22px] tracking-[-0.44px]">Edit Project</p></div>
          <motion.button onClick={onClose} whileHover={{ scale: 1.08, rotate: 90 }} whileTap={{ scale: 0.95 }} className="bg-[#f4f7fb] flex items-center justify-center rounded-[4px] size-[40px]">
            <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M14 4L4 14M4 4L14 14" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.26" /></svg>
          </motion.button>
        </div>
        <div className="flex-1 overflow-y-auto px-[28px] py-[32px] flex flex-col gap-[32px]">
          {/* Section 01 */}
          <div className="flex flex-col gap-[12px]">
            <div className="flex gap-[10px] items-center font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]"><p>01</p><p>PROJECT DETAILS</p></div>
            <div className="bg-white rounded-[4px] border border-[#e2e2e2] p-[20px] flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>BUILDING ID</label><input className={`${inputClass} opacity-60 cursor-not-allowed`} value={form.buildingId} readOnly /></div>
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>BUILDING TYPE</label><div className="relative"><select value={form.buildingType} onChange={e => setForm(f => ({ ...f, buildingType: e.target.value }))} className={selectClass}><option>Residential</option><option>Commercial</option><option>Industrial</option><option>Non business</option></select><svg className="absolute right-[16px] top-1/2 -translate-y-1/2 size-[16px] pointer-events-none" fill="none" viewBox="0 0 18 18"><path d="M4.5 7.2L9 10.8L13.5 7.2" stroke="#5C7089" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.26" /></svg></div></div>
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>ADDRESS</label><input className={inputClass} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Enter address" /></div>
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>LANDMARK</label><input className={inputClass} value={form.landmark} onChange={e => setForm(f => ({ ...f, landmark: e.target.value }))} placeholder="Enter landmark" /></div>
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>ASSIGNED MEMBER</label><div className="relative"><select value={form.assignedMember} onChange={e => setForm(f => ({ ...f, assignedMember: e.target.value }))} className={selectClass}><option value="">Select member</option>{MOCK_MEMBERS.map(m => <option key={m.id} value={m.full_name}>{m.full_name}</option>)}</select><svg className="absolute right-[16px] top-1/2 -translate-y-1/2 size-[16px] pointer-events-none" fill="none" viewBox="0 0 18 18"><path d="M4.5 7.2L9 10.8L13.5 7.2" stroke="#5C7089" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.26" /></svg></div></div>
            </div>
          </div>
          {/* Section 02 */}
          <div className="flex flex-col gap-[12px]">
            <div className="flex gap-[10px] items-center font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]"><p>02</p><p>PRIMARY CONTACT DETAILS</p></div>
            <div className="bg-white rounded-[4px] border border-[#e2e2e2] p-[20px] flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>NAME</label><input className={inputClass} value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} placeholder="Enter name" /></div>
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>PHONE NUMBER</label><input className={inputClass} type="tel" value={form.phoneNumber} onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))} placeholder="00000 00000" /></div>
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>EMAIL</label><input className={inputClass} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="abc@xyz.com" /></div>
            </div>
          </div>
          {/* Section 03 */}
          <div className="flex flex-col gap-[12px]">
            <div className="flex gap-[10px] items-center font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]"><p>03</p><p>PROCESSOR DETAILS</p></div>
            <div className="bg-white rounded-[4px] border border-[#e2e2e2] p-[20px] flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>SERIAL NUMBER</label><input className={inputClass} value={form.serialNumber} onChange={e => setForm(f => ({ ...f, serialNumber: e.target.value }))} placeholder="Enter serial number" /></div>
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>DESCRIPTION</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description" className="bg-[#f4f7fb] rounded-[4px] px-[16px] py-[12px] font-['Inter:Regular',sans-serif] text-[14px] text-[#0a1e3f] placeholder:text-[#5c7089] border-none outline-none resize-none h-[88px] w-full" /></div>
            </div>
          </div>
        </div>
        <div className="bg-white border-t border-[#e2e2e2] px-[28px] py-[20px] flex gap-[12px] shrink-0">
          <motion.button onClick={onClose} disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 h-[48px] rounded-[4px] border border-[#e2e2e2] font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#5c7089] hover:bg-[#f4f7fb] transition-colors">Cancel</motion.button>
          <motion.button onClick={handleSave} disabled={saving} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="flex-1 h-[48px] rounded-[4px] bg-[#0a1e3f] font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white hover:bg-[#0a2a5a] transition-colors">{saving ? 'Saving...' : 'Update Project'}</motion.button>
        </div>
      </motion.div>
    </>
  );
}

function AddProjectDrawer({ onClose, onSave }) {
  const [form, setForm] = useState({ buildingId: '', buildingType: 'Residential', address: '', landmark: '', assignedMember: '', contactName: '', phoneNumber: '', email: '', serialNumber: '', description: '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    onSave({ ...form, id: String(nextProjectId++), building_id: form.buildingId, building_type: form.buildingType, name: form.contactName, mobile: form.phoneNumber, assigned_member: form.assignedMember, okas_box_info: form.serialNumber });
    setSaving(false);
  };

  const inputClass = "bg-[#f4f7fb] h-[48px] rounded-[4px] px-[16px] font-['Inter:Regular',sans-serif] text-[15px] text-[#0a1e3f] placeholder:text-[#5c7089] border-none outline-none w-full";
  const labelClass = "font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]";
  const selectClass = "bg-[#f4f7fb] h-[48px] rounded-[4px] px-[16px] pr-[40px] font-['Inter:Regular',sans-serif] text-[15px] text-[#0a1e3f] border-none outline-none w-full appearance-none cursor-pointer";

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="fixed right-0 top-0 h-full w-[520px] bg-white shadow-[-8px_0px_24px_0px_rgba(10,30,63,0.12)] z-50 flex flex-col overflow-hidden">
        <div className="bg-white flex h-[72px] items-center justify-between pl-[28px] pr-[20px] shrink-0 border-b border-[#e2e2e2]">
          <div><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">PROJECTS — NEW</p><p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0a1e3f] text-[22px] tracking-[-0.44px]">Add Project</p></div>
          <motion.button onClick={onClose} whileHover={{ scale: 1.08, rotate: 90 }} whileTap={{ scale: 0.95 }} className="bg-[#f4f7fb] flex items-center justify-center rounded-[4px] size-[40px]">
            <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M14 4L4 14M4 4L14 14" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.26" /></svg>
          </motion.button>
        </div>
        <div className="flex-1 overflow-y-auto px-[28px] py-[32px] flex flex-col gap-[32px]">
          <div className="flex flex-col gap-[12px]">
            <div className="flex gap-[10px] items-center font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]"><p>01</p><p>PROJECT DETAILS</p></div>
            <div className="bg-white rounded-[4px] border border-[#e2e2e2] p-[20px] flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>BUILDING ID</label><input className={inputClass} value={form.buildingId} onChange={e => setForm(f => ({ ...f, buildingId: e.target.value }))} placeholder="e.g. BLD902" /></div>
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>BUILDING TYPE</label><div className="relative"><select value={form.buildingType} onChange={e => setForm(f => ({ ...f, buildingType: e.target.value }))} className={selectClass}><option>Residential</option><option>Commercial</option><option>Industrial</option><option>Non business</option></select><svg className="absolute right-[16px] top-1/2 -translate-y-1/2 size-[16px] pointer-events-none" fill="none" viewBox="0 0 18 18"><path d="M4.5 7.2L9 10.8L13.5 7.2" stroke="#5C7089" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.26" /></svg></div></div>
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>ADDRESS</label><input className={inputClass} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Enter address" /></div>
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>LANDMARK</label><input className={inputClass} value={form.landmark} onChange={e => setForm(f => ({ ...f, landmark: e.target.value }))} placeholder="Enter landmark" /></div>
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>ASSIGNED MEMBER</label><div className="relative"><select value={form.assignedMember} onChange={e => setForm(f => ({ ...f, assignedMember: e.target.value }))} className={selectClass}><option value="">Select member</option>{MOCK_MEMBERS.map(m => <option key={m.id} value={m.full_name}>{m.full_name}</option>)}</select><svg className="absolute right-[16px] top-1/2 -translate-y-1/2 size-[16px] pointer-events-none" fill="none" viewBox="0 0 18 18"><path d="M4.5 7.2L9 10.8L13.5 7.2" stroke="#5C7089" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.26" /></svg></div></div>
            </div>
          </div>
          <div className="flex flex-col gap-[12px]">
            <div className="flex gap-[10px] items-center font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]"><p>02</p><p>PRIMARY CONTACT DETAILS</p></div>
            <div className="bg-white rounded-[4px] border border-[#e2e2e2] p-[20px] flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>NAME</label><input className={inputClass} value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} placeholder="Enter name" /></div>
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>PHONE NUMBER</label><input className={inputClass} type="tel" value={form.phoneNumber} onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))} placeholder="00000 00000" /></div>
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>EMAIL</label><input className={inputClass} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="abc@xyz.com" /></div>
            </div>
          </div>
          <div className="flex flex-col gap-[12px]">
            <div className="flex gap-[10px] items-center font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]"><p>03</p><p>PROCESSOR DETAILS</p></div>
            <div className="bg-white rounded-[4px] border border-[#e2e2e2] p-[20px] flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>SERIAL NUMBER</label><input className={inputClass} value={form.serialNumber} onChange={e => setForm(f => ({ ...f, serialNumber: e.target.value }))} placeholder="Enter serial number" /></div>
              <div className="flex flex-col gap-[8px]"><label className={labelClass}>DESCRIPTION</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description" className="bg-[#f4f7fb] rounded-[4px] px-[16px] py-[12px] font-['Inter:Regular',sans-serif] text-[14px] text-[#0a1e3f] placeholder:text-[#5c7089] border-none outline-none resize-none h-[88px] w-full" /></div>
            </div>
          </div>
        </div>
        <div className="bg-white border-t border-[#e2e2e2] px-[28px] py-[20px] flex gap-[12px] shrink-0">
          <motion.button onClick={onClose} disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 h-[48px] rounded-[4px] border border-[#e2e2e2] font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#5c7089] hover:bg-[#f4f7fb] transition-colors">Cancel</motion.button>
          <motion.button onClick={handleSave} disabled={saving} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="flex-1 h-[48px] rounded-[4px] bg-[#0a1e3f] font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white hover:bg-[#0a2a5a] transition-colors">{saving ? 'Saving...' : 'Save Project'}</motion.button>
        </div>
      </motion.div>
    </>
  );
}
