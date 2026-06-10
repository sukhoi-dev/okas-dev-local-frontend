import { useState, useRef, useEffect } from 'react';
import svgPaths from './assets/svg-drawer-member';
import imgOuterRingDashed from '../../../assets/outerRingDashed.png';

function toISODate(ddmmyyyy) {
  const [dd, mm, yyyy] = ddmmyyyy.split('/');
  if (!dd || !mm || !yyyy) return ddmmyyyy;
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

function fromISODate(iso) {
  if (!iso) return '';
  const [yyyy, mm, dd] = iso.split('-');
  if (!yyyy || !mm || !dd) return iso;
  return `${dd}/${mm}/${yyyy}`;
}

export default function EditMemberDrawer({ isOpen, member, onClose, onSave }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [role, setRole] = useState('Programmer');
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (member) {
      setFullName(member.fullName);
      setEmail(member.email);
      setPhoneNumber(member.phoneNumber ?? '');
      setDateOfBirth(member.dateOfBirth ? fromISODate(member.dateOfBirth) : '');
      setBloodGroup(member.bloodGroup ?? '');
      setRole(member.role);
      setProfilePhotoPreview(member.profilePhoto ?? null);
      setProfilePhotoFile(null);
      setError(null);
    }
  }, [member]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Only JPG or PNG files are allowed.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be under 2MB.');
      return;
    }
    setError(null);
    setProfilePhotoFile(file);
    setProfilePhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!member) return;
    onSave();
    onClose();
  };

  if (!isOpen || !member) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[520px] bg-white z-50 shadow-[-8px_0px_24px_0px_rgba(10,30,63,0.12)] flex flex-col">
        {/* Header */}
        <div className="bg-white flex h-[80px] items-center justify-between pl-[28px] pr-[20px] shrink-0">
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">TEAM — EDIT</p>
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0a1e3f] text-[22px] tracking-[-0.44px]">Edit Member</p>
          </div>
          <button onClick={onClose} className="bg-[#f4f7fb] flex items-center justify-center rounded-[4px] size-[40px] hover:bg-[#e2e2e2] transition-colors">
            <div className="relative size-[18px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                <path d={svgPaths.p1f219680} stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.26" />
              </svg>
            </div>
          </button>
        </div>

        <div className="bg-[#e2e2e2] h-px shrink-0 w-full" />

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-[12px] items-start p-[28px]">
            <div className="flex font-['Inter:Medium',sans-serif] font-medium gap-[10px] items-center text-[#5c7089] text-[11px] tracking-[2.2px]">
              <p>01</p>
              <p>PERSONAL INFORMATION</p>
            </div>

            <div className="bg-white rounded-[4px] w-full border border-[#e2e2e2]">
              <div className="flex flex-col gap-[20px] items-start px-[24px] py-[28px]">
                {/* Avatar */}
                <div className="flex flex-col gap-[12px] items-center justify-center w-full">
                  <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">PROFILE PHOTO</p>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleFileChange} />
                  <div className="relative size-[124px]">
                    <div className="absolute left-[2px] size-[120px] top-[2px]">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" height="120" src={imgOuterRingDashed} width="120" />
                    </div>
                    <div className="absolute left-[14px] size-[96px] top-[14px] overflow-hidden rounded-full">
                      {profilePhotoPreview ? (
                        <img src={profilePhotoPreview} alt="Profile" className="absolute block inset-0 size-full object-cover" />
                      ) : (
                        <>
                          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 96 96">
                            <circle cx="48" cy="48" fill="#F4F7FB" r="48" />
                          </svg>
                          <div className="absolute left-[32px] size-[32px] top-[32px]">
                            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                              <path d={svgPaths.p814b200} stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" />
                              <path d={svgPaths.p2b10ab80} stroke="#5C7089" strokeWidth="1.4" />
                            </svg>
                          </div>
                        </>
                      )}
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bg-[#0a1e3f] left-[90px] rounded-[14px] size-[28px] top-[90px] border-2 border-white hover:opacity-90 transition-opacity">
                      <div className="flex items-center justify-center size-full">
                        <svg className="size-[14px]" fill="none" viewBox="0 0 14 14">
                          <path d="M7 2.5V11.5M2.5 7H11.5" stroke="white" strokeLinecap="round" strokeWidth="1.6" />
                        </svg>
                      </div>
                    </button>
                  </div>
                  <p className="font-['Inter:Regular',sans-serif] text-[#5c7089] text-[11px] tracking-[1.1px]">JPG or PNG · Max 2MB</p>
                </div>

                <div className="flex flex-col gap-[8px] w-full">
                  <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">*FULL NAME</p>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter Full Name" className="bg-[#f4f7fb] h-[48px] w-full rounded-[4px] px-[16px] font-['Inter:Regular',sans-serif] text-[15px] text-[#0a1e3f] placeholder:text-[#5c7089] outline-none focus:ring-2 focus:ring-[#0a1e3f]/10" />
                </div>

                <div className="flex flex-col gap-[8px] w-full">
                  <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">*EMAIL ADDRESS</p>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="eg. abc@xyz.com" className="bg-[#f4f7fb] h-[48px] w-full rounded-[4px] px-[16px] font-['Inter:Regular',sans-serif] text-[15px] text-[#0a1e3f] placeholder:text-[#5c7089] outline-none focus:ring-2 focus:ring-[#0a1e3f]/10" />
                </div>

                <div className="flex flex-col gap-[8px] w-full">
                  <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">PHONE NUMBER</p>
                  <div className="flex gap-[8px] h-[48px]">
                    <div className="bg-[#f4f7fb] flex h-[48px] items-center justify-between px-[12px] rounded-[4px] shrink-0 w-[88px]">
                      <p className="font-['Inter:Medium',sans-serif] text-[#0a1e3f] text-[15px]">+91</p>
                      <svg className="size-[18px]" fill="none" viewBox="0 0 18 18">
                        <path d="M4.5 7.2L9 10.8L13.5 7.2" stroke="#5C7089" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.26" />
                      </svg>
                    </div>
                    <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="00000 00000" className="bg-[#f4f7fb] flex-1 h-[48px] rounded-[4px] px-[16px] font-['Inter:Regular',sans-serif] text-[15px] text-[#0a1e3f] placeholder:text-[#5c7089] outline-none focus:ring-2 focus:ring-[#0a1e3f]/10" />
                  </div>
                </div>

                <div className="flex flex-col gap-[8px] w-full">
                  <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">DATE OF BIRTH</p>
                  <div className="relative w-full">
                    <input type="text" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} placeholder="dd/mm/yyyy" className="bg-[#f4f7fb] h-[48px] w-full rounded-[4px] px-[16px] pr-[48px] font-['Inter:Regular',sans-serif] text-[15px] text-[#0a1e3f] placeholder:text-[#5c7089] outline-none focus:ring-2 focus:ring-[#0a1e3f]/10" />
                    <div className="absolute right-[16px] top-1/2 -translate-y-1/2 size-[18px] pointer-events-none">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                        <path d={svgPaths.p18a45f00} stroke="#5C7089" strokeWidth="1.26" />
                        <path d="M2.7 7.65H15.3" stroke="#5C7089" strokeWidth="1.26" />
                        <path d="M6.3 2.7V5.4M11.7 2.7V5.4" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.26" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-[8px] w-full">
                  <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">BLOOD GROUP</p>
                  <div className="relative w-full">
                    <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="bg-[#f4f7fb] h-[48px] w-full rounded-[4px] px-[16px] pr-[48px] font-['Inter:Regular',sans-serif] text-[15px] text-[#0a1e3f] outline-none focus:ring-2 focus:ring-[#0a1e3f]/10 appearance-none cursor-pointer">
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                    <div className="absolute right-[16px] top-1/2 -translate-y-1/2 size-[18px] pointer-events-none">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                        <path d="M4.5 7.2L9 10.8L13.5 7.2" stroke="#5C7089" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.26" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-[8px] w-full">
                  <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">ROLE</p>
                  <div className="relative w-full">
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="bg-[#f4f7fb] h-[48px] w-full rounded-[4px] px-[16px] pr-[48px] font-['Inter:Regular',sans-serif] text-[15px] text-[#0a1e3f] outline-none focus:ring-2 focus:ring-[#0a1e3f]/10 appearance-none cursor-pointer">
                      <option value="Programmer">Programmer</option>
                      <option value="Master Programmer">Master Programmer</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Technician">Technician</option>
                      <option value="Supporter">Supporter</option>
                    </select>
                    <div className="absolute right-[16px] top-1/2 -translate-y-1/2 size-[18px] pointer-events-none">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                        <path d="M4.5 7.2L9 10.8L13.5 7.2" stroke="#5C7089" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.26" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0">
          <div className="bg-[#e2e2e2] h-px w-full" />
          <div className="bg-white w-full">
            {error && <p className="text-[12px] font-['Inter:Regular',sans-serif] text-red-500 text-center pt-[12px] px-[28px]">{error}</p>}
            <div className="flex items-center justify-end px-[28px] py-[16px] gap-[8px]">
              <button onClick={onClose} className="flex h-[48px] items-center justify-center px-[24px] rounded-[4px] hover:bg-[#f4f7fb] transition-colors">
                <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[15px]">Cancel</p>
              </button>
              <button onClick={handleSubmit} className="bg-[#0a1e3f] flex h-[48px] items-center justify-center px-[32px] rounded-[4px] w-[160px] hover:opacity-90 transition-opacity">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] text-white tracking-[0.15px]">Update Member</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
