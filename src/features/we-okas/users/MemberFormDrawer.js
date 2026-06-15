import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Plus, Eye, EyeOff } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import weOkasClient from '../../../api/weOkasClient';
import { useCreateMember, useUpdateMember } from './useMembers';

const INIT = { full_name: '', email: '', phone: '', role_id: '', status: '', password: '' };

const LABEL_CLASS = 'font-["Inter:Medium",sans-serif] font-medium text-[11px] tracking-[2px] text-[#5c7089] uppercase mb-[8px] block';
const INPUT_CLASS = 'w-full bg-[#f4f7fb] rounded-[6px] px-[14px] py-[12px] text-[14px] text-[#0a1e3f] placeholder:text-[#9bb0c7] outline-none border border-transparent focus:border-[#0094AD] transition-colors';
const SELECT_CLASS = `${INPUT_CLASS} appearance-none cursor-pointer`;

export default function MemberFormDrawer({ open, member, organizationId, onClose, onSuccess }) {
  const isEdit = !!member;
  const [form, setForm]       = useState(INIT);
  const [errors, setErrors]   = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showPw, setShowPw]   = useState(false);
  const fileInputRef = useRef(null);

  const create = useCreateMember();
  const update = useUpdateMember();
  const isBusy = create.isPending || update.isPending;

  const { data: roles = [] } = useQuery({
    queryKey: ['roles-dropdown'],
    queryFn: () => weOkasClient.get('/we-okas/roles').then((r) => r.data.body ?? []),
    enabled: open,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setPhotoPreview(null);
    setShowPw(false);
    if (isEdit && member) {
      setForm({
        full_name: member.full_name || '',
        email:     member.email     || '',
        phone:     member.phone     || '',
        role_id:   String(member.role?.id || ''),
        status:    member.status    || '',
        password:  '',
      });
    } else {
      setForm(INIT);
    }
  }, [open, member, isEdit]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = 'Required';
    if (!form.email.trim())     e.email     = 'Required';
    if (!form.role_id)          e.role_id   = 'Required';
    if (!isEdit && form.password && form.password.length < 6)
      e.password = 'Minimum 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload = {
      full_name:       form.full_name.trim(),
      email:           form.email.trim(),
      phone:           form.phone.trim() || null,
      role_id:         Number(form.role_id),
      organization_id: organizationId || 1,
      status:          form.status || 'active',
      ...((!isEdit && form.password) ? { password: form.password } : {}),
    };
    try {
      if (isEdit) {
        await update.mutateAsync({ id: member.id, data: payload });
        toast.success('Member updated successfully');
      } else {
        await create.mutateAsync(payload);
        toast.success('Member created successfully');
      }
      onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={isBusy ? undefined : onClose}
            className="fixed inset-0 bg-[rgba(10,30,63,0.25)] z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-[500px] bg-white shadow-[−8px_0_40px_rgba(10,30,63,0.12)] z-50 flex flex-col"
          >
            {/* ── Header ── */}
            <div className="px-[32px] pt-[32px] pb-[20px] border-b border-[#f0f4f8]">
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[11px] tracking-[2.5px] text-[#5c7089] uppercase mb-[6px]">
                TEAM — {isEdit ? 'EDIT' : 'NEW'}
              </p>
              <div className="flex items-center justify-between">
                <h2 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[26px] tracking-[-0.5px] text-[#0a1e3f]">
                  {isEdit ? 'Edit Member' : 'Add Member'}
                </h2>
                <button
                  onClick={onClose}
                  className="size-[36px] rounded-[6px] flex items-center justify-center text-[#5c7089] hover:bg-[#f4f7fb] hover:text-[#0a1e3f] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* ── Body (scrollable) ── */}
            <div className="flex-1 overflow-y-auto px-[32px] py-[24px] bg-[#f8fafc] flex flex-col gap-[24px]">

              {/* ── Section 1: Personal Information ── */}
              <div>
                <p className="font-['Inter:Medium',sans-serif] font-medium text-[11px] tracking-[2px] text-[#5c7089] uppercase mb-[16px]">
                  01  PERSONAL INFORMATION
                </p>

                <div className="bg-white rounded-[12px] p-[24px] shadow-sm border border-[#eef2f7]">

                  {/* Profile photo */}
                  <div className="mb-[24px]">
                    <p className={LABEL_CLASS}>PROFILE PHOTO</p>
                    <div className="flex flex-col items-center gap-[10px]">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="size-[88px] rounded-full border-2 border-dashed border-[#c0ccda] hover:border-[#0094AD] transition-colors flex items-center justify-center overflow-hidden group"
                        >
                          {photoPreview ? (
                            <img src={photoPreview} alt="" className="size-full object-cover" />
                          ) : (
                            <Camera size={28} className="text-[#9bb0c7] group-hover:text-[#0094AD] transition-colors" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 size-[26px] rounded-full bg-[#0094AD] flex items-center justify-center text-white shadow-sm hover:bg-[#007a8f] transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[#9bb0c7]">
                        JPG or PNG · Max 2MB
                      </p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handlePhoto} />
                  </div>

                  {/* Full Name */}
                  <div className="mb-[18px]">
                    <label className={LABEL_CLASS}>*FULL NAME</label>
                    <input
                      type="text"
                      value={form.full_name}
                      onChange={set('full_name')}
                      placeholder="Enter Full Name"
                      className={`${INPUT_CLASS} ${errors.full_name ? 'border-red-400' : ''}`}
                    />
                    {errors.full_name && <p className="text-red-500 text-[12px] mt-[4px]">{errors.full_name}</p>}
                  </div>

                  {/* Email */}
                  <div className="mb-[18px]">
                    <label className={LABEL_CLASS}>*EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      placeholder="eg. abc@xyz.com"
                      className={`${INPUT_CLASS} ${errors.email ? 'border-red-400' : ''}`}
                    />
                    {errors.email && <p className="text-red-500 text-[12px] mt-[4px]">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div className="mb-[18px]">
                    <label className={LABEL_CLASS}>PHONE</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set('phone')}
                      placeholder="+91-9000000000"
                      className={INPUT_CLASS}
                    />
                  </div>

                  {/* Role */}
                  <div className="mb-[18px]">
                    <label className={LABEL_CLASS}>*ROLE</label>
                    <div className="relative">
                      <select
                        value={form.role_id}
                        onChange={set('role_id')}
                        className={`${SELECT_CLASS} ${errors.role_id ? 'border-red-400' : ''} pr-[40px]`}
                      >
                        <option value="">Select Role</option>
                        {roles.map((r) => (
                          <option key={r.id} value={String(r.id)}>{r.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 6L8 10L12 6" stroke="#5C7089" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                    {errors.role_id && <p className="text-red-500 text-[12px] mt-[4px]">{errors.role_id}</p>}
                  </div>

                  {/* Status */}
                  <div>
                    <label className={LABEL_CLASS}>STATUS</label>
                    <div className="relative">
                      <select
                        value={form.status}
                        onChange={set('status')}
                        className={`${SELECT_CLASS} pr-[40px]`}
                      >
                        <option value="">Select</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <div className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 6L8 10L12 6" stroke="#5C7089" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 2: Login Credentials (create only) ── */}
              {!isEdit && (
                <div>
                  <p className="font-['Inter:Medium',sans-serif] font-medium text-[11px] tracking-[2px] text-[#5c7089] uppercase mb-[16px]">
                    02  LOGIN CREDENTIALS
                  </p>
                  <div className="bg-white rounded-[12px] p-[24px] shadow-sm border border-[#eef2f7]">
                    <div>
                      <label className={LABEL_CLASS}>PASSWORD</label>
                      <div className="relative">
                        <input
                          type={showPw ? 'text' : 'password'}
                          value={form.password}
                          onChange={set('password')}
                          placeholder="Min 6 characters (optional)"
                          className={`${INPUT_CLASS} pr-[44px] ${errors.password ? 'border-red-400' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((v) => !v)}
                          className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#9bb0c7] hover:text-[#5c7089] transition-colors"
                        >
                          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.password
                        ? <p className="text-red-500 text-[12px] mt-[4px]">{errors.password}</p>
                        : <p className="text-[12px] text-[#9bb0c7] mt-[6px]">Leave blank to create the member without login access.</p>
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="px-[32px] py-[20px] bg-white border-t border-[#f0f4f8] flex items-center justify-end gap-[12px]">
              <button
                type="button"
                onClick={onClose}
                disabled={isBusy}
                className="px-[20px] py-[12px] text-[14px] font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] hover:text-[#0a1e3f] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isBusy}
                className="bg-[#0a1e3f] text-white px-[24px] py-[12px] rounded-[6px] text-[14px] font-['Inter:Semi_Bold',sans-serif] font-semibold hover:bg-[#0a2a5a] transition-colors disabled:opacity-60 flex items-center gap-[8px]"
              >
                {isBusy ? (
                  <>
                    <svg className="animate-spin size-[16px]" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Saving…
                  </>
                ) : (
                  isEdit ? 'Update Member' : 'Save Member'
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
