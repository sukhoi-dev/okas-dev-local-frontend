import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, UserPlus, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCreateSI, useUpdateSI } from './useSIs';

const INIT_ORG   = { name: '', email: '', phone: '', address: '' };
const INIT_ADMIN = { full_name: '', email: '', password: '' };

const LABEL  = 'font-["Inter:Medium",sans-serif] font-medium text-[11px] tracking-[2px] text-[#5c7089] uppercase mb-[8px] block';
const INPUT  = 'w-full bg-[#f4f7fb] rounded-[6px] px-[14px] py-[12px] text-[14px] text-[#0a1e3f] placeholder:text-[#9bb0c7] outline-none border border-transparent focus:border-[#0094AD] transition-colors';
const ERR    = 'text-red-500 text-[12px] mt-[4px]';

export default function SIFormDrawer({ open, si, onClose, onSuccess }) {
  const isEdit = !!si;

  const [org,          setOrg]          = useState(INIT_ORG);
  const [createAdmin,  setCreateAdmin]  = useState(false);
  const [admin,        setAdmin]        = useState(INIT_ADMIN);
  const [showPw,       setShowPw]       = useState(false);
  const [errors,       setErrors]       = useState({});

  const create = useCreateSI();
  const update = useUpdateSI();
  const isBusy = create.isPending || update.isPending;

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setCreateAdmin(false);
    setAdmin(INIT_ADMIN);
    setShowPw(false);
    setOrg(isEdit && si
      ? { name: si.name || '', email: si.email || '', phone: si.phone || '', address: si.address || '' }
      : INIT_ORG
    );
  }, [open, si, isEdit]);

  const setO = (f) => (e) => setOrg((p)   => ({ ...p, [f]: e.target.value }));
  const setA = (f) => (e) => setAdmin((p)  => ({ ...p, [f]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!org.name.trim()) e.name = 'Organisation name is required';
    if (createAdmin) {
      if (!admin.full_name.trim()) e.admin_name  = 'Admin name is required';
      if (!admin.email.trim())     e.admin_email = 'Admin email is required';
      if (!admin.password)         e.admin_pw    = 'Password is required';
      else if (admin.password.length < 6) e.admin_pw = 'Minimum 6 characters';
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload = {
      name:    org.name.trim(),
      email:   org.email.trim()   || null,
      phone:   org.phone.trim()   || null,
      address: org.address.trim() || null,
      ...(createAdmin ? {
        admin_user: {
          full_name: admin.full_name.trim(),
          email:     admin.email.trim(),
          password:  admin.password,
        },
      } : {}),
    };

    try {
      if (isEdit) {
        await update.mutateAsync({ id: si.id, data: payload });
        toast.success(createAdmin
          ? 'Organisation updated & admin login created'
          : 'Organisation updated');
      } else {
        await create.mutateAsync(payload);
        toast.success(createAdmin
          ? 'Organisation created with admin login'
          : 'Organisation created');
      }
      onSuccess();
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={isBusy ? undefined : onClose}
            className="fixed inset-0 bg-[rgba(10,30,63,0.25)] z-40"
          />

          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-[500px] bg-white shadow-[−8px_0_40px_rgba(10,30,63,0.12)] z-50 flex flex-col"
          >
            {/* Header */}
            <div className="px-[32px] pt-[32px] pb-[20px] border-b border-[#f0f4f8]">
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[11px] tracking-[2.5px] text-[#5c7089] uppercase mb-[6px]">
                SYSTEM INTEGRATOR — {isEdit ? 'EDIT' : 'NEW'}
              </p>
              <div className="flex items-center justify-between">
                <h2 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[26px] tracking-[-0.5px] text-[#0a1e3f]">
                  {isEdit ? 'Edit Organisation' : 'Add Organisation'}
                </h2>
                <button onClick={onClose} className="size-[36px] rounded-[6px] flex items-center justify-center text-[#5c7089] hover:bg-[#f4f7fb] transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-[32px] py-[24px] bg-[#f8fafc] flex flex-col gap-[24px]">

              {/* ── Section 1: Org details ── */}
              <div>
                <p className={`${LABEL} mb-[14px]`}>01  ORGANISATION DETAILS</p>
                <div className="bg-white rounded-[12px] p-[24px] shadow-sm border border-[#eef2f7] flex flex-col gap-[18px]">

                  {/* Icon + name preview */}
                  <div className="flex items-center gap-[14px] pb-[16px] border-b border-[#f0f4f8]">
                    <div className="size-[52px] rounded-[10px] bg-[#eef3ff] flex items-center justify-center shrink-0">
                      <Building2 size={24} className="text-[#0a1e3f]" strokeWidth={1.5} />
                    </div>
                    <p className="text-[14px] font-semibold text-[#0a1e3f]">
                      {org.name || <span className="text-[#9bb0c7] font-normal">Organisation name</span>}
                    </p>
                  </div>

                  <div>
                    <label className={LABEL}>*NAME</label>
                    <input type="text" value={org.name} onChange={setO('name')}
                      placeholder="e.g. OKAS Smart Homes Pvt Ltd"
                      className={`${INPUT} ${errors.name ? 'border-red-400' : ''}`} />
                    {errors.name && <p className={ERR}>{errors.name}</p>}
                  </div>

                  <div>
                    <label className={LABEL}>EMAIL</label>
                    <input type="email" value={org.email} onChange={setO('email')}
                      placeholder="contact@company.com" className={INPUT} />
                  </div>

                  <div>
                    <label className={LABEL}>PHONE</label>
                    <input type="tel" value={org.phone} onChange={setO('phone')}
                      placeholder="+91-9000000000" className={INPUT} />
                  </div>

                  <div>
                    <label className={LABEL}>ADDRESS</label>
                    <textarea value={org.address} onChange={setO('address')}
                      placeholder="Office address" rows={3}
                      className={`${INPUT} resize-none`} />
                  </div>
                </div>
              </div>

              {/* ── Section 2: Admin login ── */}
              <div>
                <p className={`${LABEL} mb-[14px]`}>02  ADMIN LOGIN</p>

                {/* Toggle card */}
                <button
                  type="button"
                  onClick={() => setCreateAdmin((v) => !v)}
                  className={`w-full rounded-[12px] border-2 px-[20px] py-[16px] flex items-center gap-[14px] transition-all text-left
                    ${createAdmin
                      ? 'bg-[#eef3ff] border-[#0a1e3f]'
                      : 'bg-white border-[#e2e2e2] hover:border-[#c0ccda]'}`}
                >
                  <div className={`size-[40px] rounded-[8px] flex items-center justify-center shrink-0 transition-colors
                    ${createAdmin ? 'bg-[#0a1e3f]' : 'bg-[#f4f7fb]'}`}>
                    <UserPlus size={18} className={createAdmin ? 'text-white' : 'text-[#5c7089]'} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-[14px] font-semibold ${createAdmin ? 'text-[#0a1e3f]' : 'text-[#5c7089]'}`}>
                      {isEdit ? 'Add admin login to this SI' : 'Create admin login for this SI'}
                    </p>
                    <p className="text-[12px] text-[#9bb0c7] mt-[2px]">
                      {createAdmin ? 'Fill in the credentials below' : 'Optional — can be done later'}
                    </p>
                  </div>
                  {/* Toggle pill */}
                  <div className={`w-[40px] h-[22px] rounded-full transition-colors flex items-center px-[3px] shrink-0
                    ${createAdmin ? 'bg-[#0a1e3f]' : 'bg-[#d1d9e6]'}`}>
                    <motion.div
                      animate={{ x: createAdmin ? 18 : 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="size-[16px] rounded-full bg-white shadow-sm"
                    />
                  </div>
                </button>

                {/* Admin fields (animated) */}
                <AnimatePresence>
                  {createAdmin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white rounded-[12px] p-[24px] shadow-sm border border-[#eef2f7] flex flex-col gap-[18px] mt-[12px]">

                        <div>
                          <label className={LABEL}>*ADMIN FULL NAME</label>
                          <input type="text" value={admin.full_name} onChange={setA('full_name')}
                            placeholder="e.g. Rajesh Kumar"
                            className={`${INPUT} ${errors.admin_name ? 'border-red-400' : ''}`} />
                          {errors.admin_name && <p className={ERR}>{errors.admin_name}</p>}
                        </div>

                        <div>
                          <label className={LABEL}>*ADMIN EMAIL</label>
                          <input type="email" value={admin.email} onChange={setA('email')}
                            placeholder="admin@company.com"
                            className={`${INPUT} ${errors.admin_email ? 'border-red-400' : ''}`} />
                          {errors.admin_email && <p className={ERR}>{errors.admin_email}</p>}
                        </div>

                        <div>
                          <label className={LABEL}>*PASSWORD</label>
                          <div className="relative">
                            <input
                              type={showPw ? 'text' : 'password'}
                              value={admin.password}
                              onChange={setA('password')}
                              placeholder="Min 6 characters"
                              className={`${INPUT} pr-[44px] ${errors.admin_pw ? 'border-red-400' : ''}`}
                            />
                            <button type="button" onClick={() => setShowPw((v) => !v)}
                              className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#9bb0c7] hover:text-[#5c7089] transition-colors">
                              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          {errors.admin_pw && <p className={ERR}>{errors.admin_pw}</p>}
                          <p className="text-[12px] text-[#9bb0c7] mt-[6px]">
                            Share these credentials with the SI admin to log in.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="px-[32px] py-[20px] bg-white border-t border-[#f0f4f8] flex items-center justify-end gap-[12px]">
              <button type="button" onClick={onClose} disabled={isBusy}
                className="px-[20px] py-[12px] text-[14px] font-medium text-[#5c7089] hover:text-[#0a1e3f] transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button type="button" onClick={handleSubmit} disabled={isBusy}
                className="bg-[#0a1e3f] text-white px-[24px] py-[12px] rounded-[6px] text-[14px] font-semibold hover:bg-[#0a2a5a] transition-colors disabled:opacity-60 flex items-center gap-[8px]">
                {isBusy ? (
                  <>
                    <svg className="animate-spin size-[16px]" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25"/>
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Saving…
                  </>
                ) : isEdit ? 'Update Organisation' : 'Save Organisation'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
