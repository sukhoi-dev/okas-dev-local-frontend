import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import svgPaths from '../../project-managers/assets/svg-add-project';
import { DUMMY_MEMBERS } from '../../project-managers/dummyData';

const emptyForm = {
  buildingId: '',
  buildingType: 'Residential',
  address: '',
  landmark: '',
  assignedMember: '',
  contactName: '',
  phoneCountryCode: '+91',
  phoneNumber: '',
  email: '',
  serialNumber: '',
};

export default function AddProjectDrawer({ isOpen, onClose, onSave, mode = 'create', initialData, projectId }) {
  const [formData, setFormData] = useState(initialData ?? emptyForm);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData ?? emptyForm);
      setError(null);
      setMembers(DUMMY_MEMBERS.map(m => ({ id: m.id, name: m.full_name })));
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    const payload = {
      name: formData.buildingId,
      project_type: formData.buildingType.toLowerCase(),
      address: formData.address,
      notes: formData.landmark,
      project_manager_id: formData.assignedMember,
      serial_number: formData.serialNumber,
      homeowner: {
        full_name: formData.contactName,
        phone: `${formData.phoneCountryCode}${formData.phoneNumber}`,
        email: formData.email,
      },
    };
    console.log('Submitting payload:', payload);
    onSave(payload);
    setFormData(emptyForm);
    // onClose();
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[520px] bg-white shadow-[-8px_0px_24px_0px_rgba(10,30,63,0.12)] z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-white flex h-[60px] md:h-[72px] items-center justify-between px-[20px] md:pl-[28px] md:pr-[20px] shrink-0 border-b border-[#e2e2e2]">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-[4px] leading-[1.2] not-italic"
              >
                <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[10px] md:text-[11px] tracking-[2.2px]">{mode === 'edit' ? 'PROJECTS — EDIT' : 'PROJECTS — NEW'}</p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0a1e3f] text-[18px] md:text-[22px] tracking-[-0.44px]">{mode === 'edit' ? 'Edit Project' : 'Add Project'}</p>
              </motion.div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.08, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#f4f7fb] flex items-center justify-center rounded-[4px] size-[36px] md:size-[40px] hover:bg-[#e8ecf1] transition-colors"
              >
                <svg className="size-[16px] md:size-[18px]" fill="none" viewBox="0 0 18 18">
                  <path d={svgPaths.p1f219680} stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.26" />
                </svg>
              </motion.button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-[20px] md:px-[28px] py-[24px] md:py-[32px]">
              <div className="flex flex-col gap-[32px] w-full">
                {/* Section 01 */}
                <div className="flex flex-col gap-[12px] w-full">
                  <div className="flex font-['Inter:Medium',sans-serif] font-medium gap-[10px] items-center leading-[1.2] text-[#5c7089] text-[11px] tracking-[2.2px]">
                    <p>01</p>
                    <p>PROJECT DETAILS</p>
                  </div>
                  <div className="bg-white rounded-[4px] border border-[#e2e2e2] p-[16px] md:p-[20px] flex flex-col gap-[16px]">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-[8px] w-full">
                      <label className="font-['Inter:Medium',sans-serif] font-medium leading-[1.2] text-[#5c7089] text-[11px] tracking-[2.2px]">BUILDING ID</label>
                      <motion.input type="text" value={formData.buildingId} onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })} placeholder="Enter Building ID" whileFocus={{ scale: 1.01, y: -1 }} className="bg-[#f4f7fb] h-[44px] md:h-[48px] rounded-[4px] px-[16px] font-['Inter:Regular',sans-serif] font-normal text-[14px] md:text-[15px] text-[#0a1e3f] placeholder:text-[#5c7089] border-none outline-none focus:ring-2 focus:ring-[#0a1e3f]/10 transition-all w-full" />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-col gap-[8px] w-full">
                      <label className="font-['Inter:Medium',sans-serif] font-medium leading-[1.2] text-[#5c7089] text-[11px] tracking-[2.2px]">BUILDING TYPE</label>
                      <div className="relative">
                        <motion.select value={formData.buildingType} onChange={(e) => setFormData({ ...formData, buildingType: e.target.value })} whileFocus={{ scale: 1.01, y: -1 }} className="bg-[#f4f7fb] h-[44px] md:h-[48px] rounded-[4px] px-[16px] pr-[40px] font-['Inter:Regular',sans-serif] font-normal text-[14px] md:text-[15px] text-[#0a1e3f] border-none outline-none focus:ring-2 focus:ring-[#0a1e3f]/10 transition-all w-full appearance-none cursor-pointer">
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Industrial">Industrial</option>
                        </motion.select>
                        <svg className="absolute right-[16px] top-1/2 -translate-y-1/2 size-[16px] md:size-[18px] pointer-events-none" fill="none" viewBox="0 0 18 18">
                          <path d="M4.5 7.2L9 10.8L13.5 7.2" stroke="#5C7089" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.26" />
                        </svg>
                      </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col gap-[8px] w-full">
                      <label className="font-['Inter:Medium',sans-serif] font-medium leading-[1.2] text-[#5c7089] text-[11px] tracking-[2.2px]">ADDRESS</label>
                      <motion.input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Enter address" whileFocus={{ scale: 1.01, y: -1 }} className="bg-[#f4f7fb] h-[44px] md:h-[48px] rounded-[4px] px-[16px] font-['Inter:Regular',sans-serif] font-normal text-[14px] md:text-[15px] text-[#0a1e3f] placeholder:text-[#5c7089] border-none outline-none focus:ring-2 focus:ring-[#0a1e3f]/10 transition-all w-full" />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex flex-col gap-[8px] w-full">
                      <label className="font-['Inter:Medium',sans-serif] font-medium leading-[1.2] text-[#5c7089] text-[11px] tracking-[2.2px]">LANDMARK</label>
                      <motion.input type="text" value={formData.landmark} onChange={(e) => setFormData({ ...formData, landmark: e.target.value })} placeholder="Enter landmark" whileFocus={{ scale: 1.01, y: -1 }} className="bg-[#f4f7fb] h-[44px] md:h-[48px] rounded-[4px] px-[16px] font-['Inter:Regular',sans-serif] font-normal text-[14px] md:text-[15px] text-[#0a1e3f] placeholder:text-[#5c7089] border-none outline-none focus:ring-2 focus:ring-[#0a1e3f]/10 transition-all w-full" />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col gap-[8px] w-full">
                      <label className="font-['Inter:Medium',sans-serif] font-medium leading-[1.2] text-[#5c7089] text-[11px] tracking-[2.2px]">ASSIGNED MEMBER</label>
                      <div className="relative">
                        <motion.select value={formData.assignedMember} onChange={(e) => setFormData({ ...formData, assignedMember: e.target.value })} whileFocus={{ scale: 1.01, y: -1 }} className="bg-[#f4f7fb] h-[44px] md:h-[48px] rounded-[4px] px-[16px] pr-[40px] font-['Inter:Regular',sans-serif] font-normal text-[14px] md:text-[15px] text-[#0a1e3f] border-none outline-none focus:ring-2 focus:ring-[#0a1e3f]/10 transition-all w-full appearance-none cursor-pointer">
                          <option value="">Select member</option>
                          {members.map((m) => (<option key={m.id} value={m.name}>{m.name}</option>))}
                        </motion.select>
                        <svg className="absolute right-[16px] top-1/2 -translate-y-1/2 size-[16px] md:size-[18px] pointer-events-none" fill="none" viewBox="0 0 18 18">
                          <path d="M4.5 7.2L9 10.8L13.5 7.2" stroke="#5C7089" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.26" />
                        </svg>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Section 02 */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex flex-col gap-[12px] w-full">
                  <div className="flex font-['Inter:Medium',sans-serif] font-medium gap-[10px] items-center leading-[1.2] text-[#5c7089] text-[11px] tracking-[2.2px]">
                    <p>02</p>
                    <p>PRIMARY CONTACT DETAILS</p>
                  </div>
                  <div className="bg-white rounded-[4px] border border-[#e2e2e2] p-[16px] md:p-[20px] flex flex-col gap-[16px]">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col gap-[8px] w-full">
                      <label className="font-['Inter:Medium',sans-serif] font-medium leading-[1.2] text-[#5c7089] text-[11px] tracking-[2.2px]">NAME</label>
                      <motion.input type="text" value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} placeholder="Enter name" whileFocus={{ scale: 1.01, y: -1 }} className="bg-[#f4f7fb] h-[44px] md:h-[48px] rounded-[4px] px-[16px] font-['Inter:Regular',sans-serif] font-normal text-[14px] md:text-[15px] text-[#0a1e3f] placeholder:text-[#5c7089] border-none outline-none focus:ring-2 focus:ring-[#0a1e3f]/10 transition-all w-full" />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="flex flex-col gap-[8px] w-full">
                      <label className="font-['Inter:Medium',sans-serif] font-medium leading-[1.2] text-[#5c7089] text-[11px] tracking-[2.2px]">PHONE NUMBER</label>
                      <div className="flex gap-[8px] w-full">
                        <div className="relative w-[88px]">
                          <motion.select value={formData.phoneCountryCode} onChange={(e) => setFormData({ ...formData, phoneCountryCode: e.target.value })} whileFocus={{ scale: 1.01, y: -1 }} className="bg-[#f4f7fb] h-[44px] md:h-[48px] rounded-[4px] px-[12px] pr-[32px] font-['Inter:Medium',sans-serif] font-medium text-[14px] md:text-[15px] text-[#0a1e3f] border-none outline-none focus:ring-2 focus:ring-[#0a1e3f]/10 transition-all w-full appearance-none cursor-pointer">
                            <option value="+91">+91</option>
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                            <option value="+86">+86</option>
                          </motion.select>
                          <svg className="absolute right-[12px] top-1/2 -translate-y-1/2 size-[16px] md:size-[18px] pointer-events-none" fill="none" viewBox="0 0 18 18">
                            <path d="M4.5 7.2L9 10.8L13.5 7.2" stroke="#5C7089" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.26" />
                          </svg>
                        </div>
                        <motion.input type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} placeholder="00000 00000" whileFocus={{ scale: 1.01, y: -1 }} className="flex-1 bg-[#f4f7fb] h-[44px] md:h-[48px] rounded-[4px] px-[16px] font-['Inter:Regular',sans-serif] font-normal text-[14px] md:text-[15px] text-[#0a1e3f] placeholder:text-[#5c7089] border-none outline-none focus:ring-2 focus:ring-[#0a1e3f]/10 transition-all" />
                      </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col gap-[8px] w-full">
                      <label className="font-['Inter:Medium',sans-serif] font-medium leading-[1.2] text-[#5c7089] text-[11px] tracking-[2.2px]">EMAIL</label>
                      <motion.input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="abc@xyz.com" whileFocus={{ scale: 1.01, y: -1 }} className="bg-[#f4f7fb] h-[44px] md:h-[48px] rounded-[4px] px-[16px] font-['Inter:Regular',sans-serif] font-normal text-[14px] md:text-[15px] text-[#0a1e3f] placeholder:text-[#5c7089] border-none outline-none focus:ring-2 focus:ring-[#0a1e3f]/10 transition-all w-full" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Section 03 */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="flex flex-col gap-[12px] w-full">
                  <div className="flex font-['Inter:Medium',sans-serif] font-medium gap-[10px] items-center leading-[1.2] text-[#5c7089] text-[11px] tracking-[2.2px]">
                    <p>03</p>
                    <p>PROCESSOR DETAILS</p>
                  </div>
                  <div className="bg-white rounded-[4px] border border-[#e2e2e2] p-[16px] md:p-[20px] flex flex-col gap-[16px]">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col gap-[8px] w-full">
                      <label className="font-['Inter:Medium',sans-serif] font-medium leading-[1.2] text-[#5c7089] text-[11px] tracking-[2.2px]">SERIAL NUMBER</label>
                      <motion.input type="text" value={formData.serialNumber} onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })} placeholder="Enter serial number" whileFocus={{ scale: 1.01, y: -1 }} className="bg-[#f4f7fb] h-[44px] md:h-[48px] rounded-[4px] px-[16px] font-['Inter:Regular',sans-serif] font-normal text-[14px] md:text-[15px] text-[#0a1e3f] placeholder:text-[#5c7089] border-none outline-none focus:ring-2 focus:ring-[#0a1e3f]/10 transition-all w-full" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-[#e2e2e2] px-[20px] md:px-[28px] py-[16px] md:py-[20px] flex flex-col gap-[12px] shrink-0">
              {error && <p className="text-[12px] font-['Inter:Regular',sans-serif] text-red-500 text-center">{error}</p>}
              <div className="flex gap-[12px]">
                <motion.button onClick={handleCancel} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 h-[44px] md:h-[48px] rounded-[4px] border border-[#e2e2e2] font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#5c7089] hover:bg-[#f4f7fb] transition-colors">
                  Cancel
                </motion.button>
                <motion.button onClick={handleSubmit} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="flex-1 h-[44px] md:h-[48px] rounded-[4px] bg-[#0a1e3f] font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white hover:bg-[#0a2a5a] transition-colors shadow-sm hover:shadow-lg">
                  {mode === 'edit' ? 'Update Project' : 'Save Project'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
