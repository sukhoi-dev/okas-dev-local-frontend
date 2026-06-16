import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const emptyForm = {
  contact_name:   '',
  name:           '',
  address:        '',
  email:          '',
  phone:          '',
  gst_vat_number: '',
  status:         'Active',
};

const emptyErrors = {
  contact_name: false, name: false, address: false,
  email: false, emailFormat: false,
  phoneFormat: false, gstFormat: false,
};

export default function AddSIDrawer({ isOpen, onClose, onSave, mode = 'add', initialData = null }) {
  const [formData, setFormData]   = useState(emptyForm);
  const [errors, setErrors]       = useState(emptyErrors);
  const [bottomMsg, setBottomMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = mode === 'edit';

  useEffect(() => {
    if (isEdit && initialData) {
      const rawContact = (initialData.phone ?? '').replace(/^\+91\s*/, '').trim();
      setFormData({
        contact_name:   initialData.contact_name   ?? '',
        name:           initialData.name           ?? '',
        address:        initialData.address        ?? '',
        email:          initialData.email          ?? '',
        phone:          rawContact,
        gst_vat_number: initialData.gst_vat_number ?? '',
        status:         initialData.status         ?? 'Active',
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors(emptyErrors);
    setBottomMsg('');
  }, [isOpen, isEdit, initialData]);

  const set = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // clear error for this field as user types
    setErrors(prev => ({ ...prev, [field]: false, [`${field}Format`]: false }));
    setBottomMsg('');
  };

  const reset = () => { setFormData(emptyForm); setErrors(emptyErrors); setBottomMsg(''); };

  const handleSubmit = async () => {
    const newErrors = { ...emptyErrors };
    let hasRequired = false;
    let formatMsg   = '';

    // Required fields
    if (!formData.contact_name.trim()) { newErrors.contact_name = true; hasRequired = true; }
    if (!formData.name.trim())         { newErrors.name         = true; hasRequired = true; }
    if (!formData.email.trim())        { newErrors.email        = true; hasRequired = true; }
    if (!formData.address.trim())      { newErrors.address      = true; hasRequired = true; }

    // Email format (only if not empty)
    if (formData.email.trim()) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
      if (!emailOk) { newErrors.emailFormat = true; formatMsg = 'Enter a valid email address (eg. name@company.com).'; }
    }

    // Phone format (10 digits if entered)
    if (formData.phone.trim() && !formatMsg) {
      const digits = formData.phone.replace(/\s/g, '');
      if (!/^\d{10}$/.test(digits)) { newErrors.phoneFormat = true; formatMsg = 'Contact must be 10 digits (eg. 98000 00001).'; }
    }

    // GST format (if entered)
    if (formData.gst_vat_number.trim() && !formatMsg) {
      const gstOk = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst_vat_number.trim());
      if (!gstOk) { newErrors.gstFormat = true; formatMsg = 'Enter a valid GST number (eg. 29AABCS1429B1ZB).'; }
    }

    setErrors(newErrors);

    if (hasRequired) { setBottomMsg('Please fill all the mandatory fields.'); return; }
    if (formatMsg)   { setBottomMsg(formatMsg); return; }

    setBottomMsg('');
    setIsLoading(true);
    try {
      await onSave(formData);
      reset();
      onClose();
    } catch (err) {
      setBottomMsg(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  // Input class helper
  const inputClass = (hasError) =>
    `h-[48px] w-full rounded-[4px] px-[16px] text-[15px] text-[#0a1e3f] placeholder:text-[#9aafc4] outline-none transition-all ${
      hasError
        ? 'bg-white border-2 border-red-400 focus:border-red-400'
        : 'bg-[#f4f7fb] border-0 focus:ring-2 focus:ring-[#0a1e3f]/10'
    }`;

  const textareaClass = (hasError) =>
    `w-full rounded-[4px] px-[16px] py-[12px] text-[15px] text-[#0a1e3f] placeholder:text-[#9aafc4] outline-none resize-none transition-all ${
      hasError
        ? 'bg-white border-2 border-red-400 focus:border-red-400'
        : 'bg-[#f4f7fb] border-0 focus:ring-2 focus:ring-[#0a1e3f]/10'
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0a1e3f]/20 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[520px] bg-white z-50 shadow-[-8px_0px_24px_0px_rgba(10,30,63,0.12)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between px-[32px] pt-[32px] pb-[20px] shrink-0">
              <div className="flex flex-col gap-[4px]">
                <p className="font-medium text-[#5c7089] text-[11px] tracking-[2.2px]"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  SYSTEM INTEGRATOR — {isEdit ? 'EDIT' : 'NEW'}
                </p>
                <p className="font-semibold text-[#0a1e3f] text-[24px] tracking-[-0.5px]"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isEdit ? 'Edit System Integrator' : 'Add System Integrator'}
                </p>
              </div>
              <button onClick={() => { reset(); onClose(); }}
                className="flex items-center justify-center rounded-[6px] size-[36px] hover:bg-[#f4f7fb] transition-colors mt-[2px]">
                <svg className="size-[18px]" fill="none" viewBox="0 0 18 18">
                  <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" />
                </svg>
              </button>
            </div>

            <div className="bg-[#e8ecf0] h-px shrink-0 w-full" />

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-[32px] py-[24px]">
              <p className="font-medium text-[#5c7089] text-[11px] tracking-[2.2px] mb-[16px]"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                ADD INFORMATION
              </p>

              <div className="flex flex-col gap-[20px]">

                {/* Full Name */}
                <div className="flex flex-col gap-[6px]">
                  <p className={`font-medium text-[11px] tracking-[2px] ${errors.contact_name ? 'text-red-500' : 'text-[#5c7089]'}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    *FULL NAME
                  </p>
                  <input
                    type="text" value={formData.contact_name}
                    onChange={(e) => set('contact_name', e.target.value)}
                    placeholder="Enter your full name"
                    className={inputClass(errors.contact_name)}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                {/* Company Name */}
                <div className="flex flex-col gap-[6px]">
                  <p className={`font-medium text-[11px] tracking-[2px] ${errors.name ? 'text-red-500' : 'text-[#5c7089]'}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    *COMPANY NAME
                  </p>
                  <input
                    type="text" value={formData.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="Enter your company name"
                    className={inputClass(errors.name)}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-[6px]">
                  <p className={`font-medium text-[11px] tracking-[2px] ${errors.email || errors.emailFormat ? 'text-red-500' : 'text-[#5c7089]'}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    *EMAIL ADDRESS
                  </p>
                  <input
                    type="email" value={formData.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="Please enter a valid email address."
                    className={inputClass(errors.email || errors.emailFormat)}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                {/* Address */}
                <div className="flex flex-col gap-[6px]">
                  <p className={`font-medium text-[11px] tracking-[2px] ${errors.address ? 'text-red-500' : 'text-[#5c7089]'}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    *ADDRESS
                  </p>
                  <textarea
                    value={formData.address}
                    onChange={(e) => set('address', e.target.value)}
                    placeholder="Enter your address details"
                    rows={3}
                    className={textareaClass(errors.address)}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                {/* Contact */}
                <div className="flex flex-col gap-[6px]">
                  <p className={`font-medium text-[11px] tracking-[2px] ${errors.phoneFormat ? 'text-red-500' : 'text-[#5c7089]'}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    PHONE NUMBER
                  </p>
                  <div className="flex gap-[8px]">
                    <div className="bg-[#f4f7fb] flex h-[48px] items-center justify-between px-[12px] rounded-[4px] shrink-0 w-[90px]">
                      <p className="text-[#0a1e3f] text-[15px]"
                        style={{ fontFamily: 'Inter, sans-serif' }}>+91</p>
                      <svg className="size-[16px]" fill="none" viewBox="0 0 18 18">
                        <path d="M4.5 7.2L9 10.8L13.5 7.2" stroke="#5C7089" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.26" />
                      </svg>
                    </div>
                    <input
                      type="tel" value={formData.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      placeholder="00000 00000"
                      className={`flex-1 ${inputClass(errors.phoneFormat)}`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                </div>

                {/* GST/VAT */}
                <div className="flex flex-col gap-[6px]">
                  <p className={`font-medium text-[11px] tracking-[2px] ${errors.gstFormat ? 'text-red-500' : 'text-[#5c7089]'}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    GST/VAT Number
                  </p>
                  <input
                    type="text" value={formData.gst_vat_number}
                    onChange={(e) => set('gst_vat_number', e.target.value.toUpperCase())}
                    placeholder="Enter your GST/VAT number"
                    className={inputClass(errors.gstFormat)}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-[6px]">
                  <p className="font-medium text-[#5c7089] text-[11px] tracking-[2px]"
                    style={{ fontFamily: 'Inter, sans-serif' }}>STATUS</p>
                  <div className="relative">
                    <select
                      value={formData.status}
                      onChange={(e) => set('status', e.target.value)}
                      className="bg-[#f4f7fb] h-[48px] w-full rounded-[4px] px-[16px] pr-[48px] text-[15px] text-[#0a1e3f] outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#0a1e3f]/10"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <div className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="size-[18px]" fill="none" viewBox="0 0 18 18">
                        <path d="M4.5 7.2L9 10.8L13.5 7.2" stroke="#5C7089" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.26" />
                      </svg>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-[#e8ecf0]">
              {bottomMsg && (
                <div className="flex items-center justify-end gap-[6px] px-[32px] pt-[12px]">
                  <svg className="size-[14px] shrink-0" fill="none" viewBox="0 0 14 14">
                    <path d="M7 1L13 12H1L7 1Z" stroke="#ef4444" strokeLinejoin="round" strokeWidth="1.2" />
                    <path d="M7 5.5V7.5" stroke="#ef4444" strokeLinecap="round" strokeWidth="1.2" />
                    <circle cx="7" cy="9.5" r="0.6" fill="#ef4444" />
                  </svg>
                  <p className="text-[12px] text-red-500"
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    {bottomMsg}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-end px-[32px] py-[16px] gap-[8px]">
                <button
                  onClick={() => { reset(); onClose(); }}
                  disabled={isLoading}
                  className="flex h-[48px] items-center justify-center px-[24px] rounded-[4px] hover:bg-[#f4f7fb] transition-colors disabled:opacity-50"
                >
                  <p className="font-medium text-[#5c7089] text-[15px]"
                    style={{ fontFamily: 'Inter, sans-serif' }}>Cancel</p>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-[#0a1e3f] flex h-[48px] items-center justify-center px-[32px] rounded-[4px] min-w-[120px] hover:bg-[#0a2a5a] transition-colors disabled:opacity-60"
                >
                  <p className="font-semibold text-[15px] text-white"
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    {isLoading ? 'Saving…' : isEdit ? 'Save Changes' : 'Save SI'}
                  </p>
                </button>
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
