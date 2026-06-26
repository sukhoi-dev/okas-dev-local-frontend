import { motion, AnimatePresence } from 'motion/react';

function DetailField({ label, value }) {
  return (
    <div className="flex flex-col gap-[6px] w-full">
      <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">{label}</p>
      <p className="font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px]">{value || '—'}</p>
    </div>
  );
}


export default function ProjectDetailDrawer({ isOpen, onClose, project, onEdit }) {
  if (!project) return null;

  const phone = [project.ownerPhoneCode, project.ownerPhone].filter(Boolean).join('  ') || project.ownerPhoneRaw || '—';

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
            <div className="bg-white flex h-[72px] items-center justify-between pl-[28px] pr-[20px] shrink-0 border-b border-[#e2e2e2]">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-[4px] leading-[1.2]"
              >
                <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">PROJECTS — VIEW</p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0a1e3f] text-[22px] tracking-[-0.44px]">View Project Detail</p>
              </motion.div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.08, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#f4f7fb] flex items-center justify-center rounded-[4px] size-[40px] hover:bg-[#e8ecf1] transition-colors"
              >
                <svg className="size-[18px]" fill="none" viewBox="0 0 18 18">
                  <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.26" />
                </svg>
              </motion.button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-[28px] py-[32px]">
              <div className="flex flex-col gap-[32px] w-full">

                {/* Section 01 — Project Details */}
                <div className="flex flex-col gap-[12px] w-full">
                  <div className="flex font-['Inter:Medium',sans-serif] font-medium gap-[10px] items-center text-[#5c7089] text-[11px] tracking-[2.2px]">
                    <p>01</p>
                    <p>PROJECT DETAILS</p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 }}
                    className="bg-white rounded-[4px] border border-[#e2e2e2] px-[20px] py-[20px] flex flex-col gap-[16px]"
                  >
                    {project.buildingId && (
                      <DetailField label="BUILDING ID" value={project.buildingId} />
                    )}
                    <DetailField label="BUILDING TYPE" value={project.buildingType} />
                    <DetailField label="ADDRESS" value={project.address} />
                    <DetailField label="LANDMARK" value={project.landmark} />
                    <DetailField label="ASSIGNED MEMBER" value={project.assignedMember} />
                  </motion.div>
                </div>

                {/* Section 02 — Owner Details */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="flex flex-col gap-[12px] w-full"
                >
                  <div className="flex font-['Inter:Medium',sans-serif] font-medium gap-[10px] items-center text-[#5c7089] text-[11px] tracking-[2.2px]">
                    <p>02</p>
                    <p>OWNER DETAILS</p>
                  </div>
                  <div className="bg-white rounded-[4px] border border-[#e2e2e2] px-[20px] py-[20px] flex flex-col gap-[16px]">
                    <DetailField label="NAME" value={project.ownerName} />
                    <DetailField label="PHONE NUMBER" value={phone} />
                    <DetailField label="EMAIL" value={project.ownerEmail} />
                  </div>
                </motion.div>

                {/* Section 03 — Processor Details */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 }}
                  className="flex flex-col gap-[12px] w-full"
                >
                  <div className="flex font-['Inter:Medium',sans-serif] font-medium gap-[10px] items-center text-[#5c7089] text-[11px] tracking-[2.2px]">
                    <p>03</p>
                    <p>PROCESSOR DETAILS</p>
                  </div>
                  <div className="bg-white rounded-[4px] border border-[#e2e2e2] px-[20px] py-[20px]">
                    <DetailField label="SERIAL NUMBER" value={project.serialNo} />
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-[#e2e2e2] px-[28px] py-[20px] shrink-0">
              <motion.button
                onClick={() => { onClose(); onEdit?.(); }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-[48px] rounded-[4px] bg-[#0a1e3f] font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-white hover:bg-[#0a2a5a] transition-colors shadow-sm hover:shadow-lg"
              >
                Edit
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
