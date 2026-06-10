import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import svgPaths from '../project-managers/assets/svg-members';
import { TopNav, LeftNav } from '../shared/SharedNav';
import AddMemberDrawer from '../project-managers/AddMemberDrawer';
import EditMemberDrawer from '../project-managers/EditMemberDrawer';
import FilterDropdown from '../project-managers/FilterDropdown';
import { DUMMY_MEMBERS } from '../project-managers/dummyData';

function mapApiMember(m, index) {
  return {
    id: m.id != null ? String(m.id) : m.email ?? String(index),
    name: m.full_name,
    role: m.role,
    email: m.email,
    status: m.status?.toLowerCase() === 'active' ? 'active' : 'inactive',
    mobile: m.mobile ?? '',
    dateOfBirth: m.date_of_birth ?? '',
    bloodGroup: m.blood_group ?? '',
    profilePhoto: m.profile_photo ?? null,
  };
}

function KebabMenu({ memberId, onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
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
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 w-[140px] bg-white rounded-[8px] shadow-[0px_8px_32px_0px_rgba(10,30,63,0.12)] border border-[#e2e2e2] overflow-hidden z-20"
            >
              <motion.button onClick={() => { onEdit(memberId); setIsOpen(false); }} whileHover={{ x: 4, backgroundColor: '#f4f7fb' }} className="w-full px-[16px] py-[12px] text-left text-[14px] text-[#0a1e3f] transition-colors font-['Inter:Medium',sans-serif] font-medium">Edit</motion.button>
              <div className="h-px w-full bg-[#e2e2e2]" />
              <motion.button onClick={() => { onDelete(memberId); setIsOpen(false); }} whileHover={{ x: 4, backgroundColor: '#fef2f2' }} className="w-full px-[16px] py-[12px] text-left text-[14px] text-[#dc2626] transition-colors font-['Inter:Medium',sans-serif] font-medium">Delete</motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function UserMembers() {
  const [members, setMembers] = useState([]);
  const [isLoading] = useState(false);
  const [fetchError] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const filterRef = useRef(null);

  const filterCategories = [
    {
      name: 'Role',
      options: [
        { label: 'Programmer', value: 'Programmer' },
        { label: 'Master Programmer', value: 'Master Programmer' },
        { label: 'Project Manager', value: 'Project Manager' },
        { label: 'Technician', value: 'Technician' },
        { label: 'Supporter', value: 'Supporter' },
      ],
    },
  ];

  const fetchMembers = () => { setMembers(DUMMY_MEMBERS.map(mapApiMember)); };

  useEffect(() => { fetchMembers(); }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) setShowFilterDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = (id) => {
    const member = members.find(m => m.id === id);
    if (member) {
      setEditingMember({
        id: member.id, fullName: member.name, email: member.email,
        phoneNumber: member.mobile, dateOfBirth: member.dateOfBirth,
        bloodGroup: member.bloodGroup, role: member.role, profilePhoto: member.profilePhoto,
      });
    }
  };

  const handleDelete = (id) => {
    const member = members.find(m => m.id === id);
    if (!member || !confirm(`Are you sure you want to delete ${member.name}?`)) return;
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const selectedRoles = appliedFilters['Role'] ?? [];
    return matchesSearch && (selectedRoles.length === 0 || selectedRoles.includes(member.role));
  });

  return (
    <div className="bg-white h-screen flex flex-col">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <div className="bg-[#f4f7fb] flex-1 flex flex-col gap-[28px] items-start overflow-auto pb-[40px] pt-[32px] px-[40px]">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.1] text-[#0a1e3f] text-[40px] tracking-[-0.8px]">Members</p>

          <div className="flex h-[44px] items-center justify-between w-full">
            <div className="flex gap-[12px] items-center">
              <div className="relative" ref={filterRef}>
                <motion.button onClick={() => setShowFilterDropdown(!showFilterDropdown)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white h-[44px] rounded-[4px] px-[16px] border border-[#e2e2e2] hover:bg-[#f4f7fb] transition-colors flex items-center gap-[8px]">
                  <div className="relative shrink-0 size-[18px]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                      <path d={svgPaths.p1fd8fe50} stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.26" />
                    </svg>
                  </div>
                  <p className="font-['Inter:Medium',sans-serif] font-medium text-[#0a1e3f] text-[14px] whitespace-nowrap">Filters</p>
                  {Object.values(appliedFilters).some(arr => arr.length > 0) && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-[#0a1e3f] text-white rounded-full size-[20px] flex items-center justify-center text-[11px] font-semibold">
                      {Object.values(appliedFilters).reduce((acc, arr) => acc + arr.length, 0)}
                    </motion.span>
                  )}
                </motion.button>
                {showFilterDropdown && <FilterDropdown categories={filterCategories} onApply={(f) => setAppliedFilters(f)} onClose={() => setShowFilterDropdown(false)} />}
              </div>

              <div className="bg-white h-[44px] rounded-[4px] w-[280px] border border-[#e2e2e2]">
                <div className="flex gap-[8px] items-center px-[16px] h-full">
                  <div className="relative shrink-0 size-[18px]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                      <path d={svgPaths.p4423d80} stroke="#5C7089" strokeWidth="1.26" />
                      <path d="M11.7 11.7L14.85 14.85" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.26" />
                    </svg>
                  </div>
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search members" className="flex-1 bg-transparent outline-none font-['Inter:Regular',sans-serif] text-[14px] text-[#0a1e3f] placeholder:text-[#5c7089]" />
                </div>
              </div>
            </div>

            <motion.button onClick={() => setIsAddMemberOpen(true)} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} className="bg-[#0a1e3f] flex gap-[8px] h-[44px] items-center justify-center px-[20px] rounded-[4px] w-[180px] hover:opacity-90 transition-opacity shadow-sm hover:shadow-lg">
              <motion.div animate={{ rotate: [0, 90, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="relative shrink-0 size-[18px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                  <path d="M9 3.6V14.4M3.6 9H14.4" stroke="white" strokeLinecap="round" strokeWidth="1.44" />
                </svg>
              </motion.div>
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white tracking-[0.14px] whitespace-nowrap">Add New Member</p>
            </motion.button>
          </div>

          <div className="bg-white rounded-[4px] w-full border border-[#e2e2e2]">
            <div className="flex flex-col">
              <div className="bg-white h-[52px] w-full">
                <div className="flex items-center px-[24px] h-full">
                  <div className="flex h-[52px] items-center w-[249px]"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px] whitespace-nowrap">MEMBER</p></div>
                  <div className="flex h-[52px] items-center w-[211px]"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px] whitespace-nowrap">ROLE</p></div>
                  <div className="flex h-[52px] items-center flex-1"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px] whitespace-nowrap">EMAIL</p></div>
                  <div className="flex h-[52px] items-center w-[172px]"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px] whitespace-nowrap">STATUS</p></div>
                  <div className="flex h-[52px] items-center justify-end w-[104px]"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px] whitespace-nowrap">ACTION</p></div>
                </div>
              </div>

              {isLoading && <div className="flex items-center justify-center w-full py-[40px]"><p className="font-['Inter:Regular',sans-serif] text-[#5c7089] text-[14px]">Loading members...</p></div>}
              {fetchError && !isLoading && <div className="flex items-center justify-center w-full py-[40px]"><p className="font-['Inter:Regular',sans-serif] text-red-500 text-[14px]">{fetchError}</p></div>}

              <AnimatePresence mode="popLayout">
                {!isLoading && !fetchError && filteredMembers.map((member, index) => (
                  <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ delay: index * 0.05 }}>
                    <div className="bg-[#e2e2e2] h-px w-full" />
                    <motion.div whileHover={{ backgroundColor: '#f4f7fb', x: 4 }} className="bg-white h-[64px] w-full transition-colors">
                      <div className="flex items-center px-[24px] h-full">
                        <div className="flex h-[64px] items-center w-[249px]"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#0a1e3f] text-[14px] whitespace-nowrap">{member.name}</p></div>
                        <div className="flex h-[64px] items-center w-[211px]"><p className="font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[14px] whitespace-nowrap">{member.role}</p></div>
                        <div className="flex h-[64px] items-center flex-1"><p className="font-['Inter:Regular',sans-serif] text-[#5c7089] text-[14px] whitespace-nowrap">{member.email}</p></div>
                        <div className="flex h-[64px] items-center w-[172px]">
                          <div className="bg-[#f4f7fb] flex gap-[8px] items-center pl-[10px] pr-[12px] py-[5px] rounded-[4px]">
                            <div className="relative shrink-0 size-[8px]">
                              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                                {member.status === 'active' ? <circle cx="4" cy="4" fill="#0A1E3F" r="4" /> : <circle cx="4" cy="4" fill="#F4F7FB" r="3.4" stroke="#5C7089" strokeWidth="1.2" />}
                              </svg>
                            </div>
                            <p className={`font-['Inter:Medium',sans-serif] font-medium text-[12px] tracking-[0.12px] whitespace-nowrap ${member.status === 'active' ? 'text-[#0a1e3f]' : 'text-[#5c7089]'}`}>
                              {member.status === 'active' ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                        </div>
                        <div className="flex h-[64px] items-center justify-end w-[104px]">
                          <KebabMenu memberId={member.id} onEdit={handleEdit} onDelete={handleDelete} />
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <AddMemberDrawer isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} onSave={fetchMembers} />
      <EditMemberDrawer isOpen={editingMember !== null} member={editingMember} onClose={() => setEditingMember(null)} onSave={fetchMembers} />
    </div>
  );
}
