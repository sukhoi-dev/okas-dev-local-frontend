import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import apiClient from '../../../api/client';

export function useFloorsList(buildingId) {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(!!buildingId);

  const refetch = useCallback(() => {
    if (!buildingId) { setFloors([]); setLoading(false); return; }
    setLoading(true);
    apiClient.get(`/we-okas/projects/${buildingId}/floors`)
      .then((r) => setFloors(r.data?.body?.floors ?? []))
      .catch(() => setFloors([]))
      .finally(() => setLoading(false));
  }, [buildingId]);

  useEffect(() => { refetch(); }, [refetch]);

  return { floors, setFloors, loading, refetch };
}

export async function deleteFloor() {
  return Promise.resolve();
}

export default function FloorDrawer({ isOpen, onClose, buildingId, buildingType, onSave }) {
  const [floorName, setFloorName] = useState('');
  const [level, setLevel] = useState(0);
  const [shortForm, setShortForm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setFloorName('');
    setLevel(0);
    setShortForm('');
    setError(null);
    onClose();
  };

  const handleShortFormChange = (e) => setShortForm(e.target.value.slice(0, 4));

  const handleSave = async () => {
    if (!floorName.trim() || !buildingId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await apiClient.post(`/we-okas/projects/${buildingId}/floors`, {
        floor_name: floorName,
        floor_pos: level,
        floor_description: shortForm,
      });
      onSave({ ...res.data.body, floor_type: buildingType ?? 'Residential' });
      handleClose();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create floor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[rgba(10,30,63,0.5)] z-40" onClick={handleClose} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="fixed right-0 top-0 h-full w-[520px] bg-white shadow-[-8px_0px_24px_0px_rgba(10,30,63,0.12)] z-50 flex flex-col">
            <div className="bg-white flex h-[80px] items-center justify-between pl-[28px] pr-[20px]">
              <div className="flex flex-col gap-[4px]">
                <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">AREA — NEW</p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0a1e3f] text-[22px] tracking-[-0.44px]">Add Floor</p>
              </div>
              <motion.button onClick={handleClose} whileHover={{ scale: 1.08, rotate: 90 }} whileTap={{ scale: 0.95 }} className="bg-[#f4f7fb] flex items-center justify-center rounded-[4px] size-[40px] cursor-pointer hover:bg-[#e8ecf2] transition-colors">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.26" /></svg>
              </motion.button>
            </div>

            <div className="bg-[#e2e2e2] h-px w-full" />

            <div className="flex-1 overflow-y-auto p-[28px]">
              <div className="flex flex-col gap-[12px]">
                <div className="flex gap-[10px] items-center font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">
                  <p>01</p><p>FLOOR DETAILS</p>
                </div>
                <div className="bg-white rounded-[4px] border border-[#e2e2e2]">
                  <div className="flex flex-col gap-[20px] px-[24px] py-[28px]">

                    <div className="flex flex-col gap-[8px] w-full">
                      <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">*FLOOR NAME</p>
                      <input type="text" value={floorName} onChange={e => setFloorName(e.target.value)} placeholder="e.g. Ground Floor" className="bg-[#f4f7fb] h-[48px] rounded-[4px] px-[16px] font-['Inter:Regular',sans-serif] font-normal text-[#0a1e3f] text-[15px] border-none outline-none placeholder:text-[#5c7089] w-full" />
                    </div>

                    <div className="flex flex-col gap-[8px] w-full">
                      <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">*LEVEL</p>
                      <div className="bg-[#f4f7fb] flex h-[48px] rounded-[4px]">
                        <button onClick={() => setLevel(l => l - 1)} className="flex items-center justify-center w-[56px] cursor-pointer hover:bg-[#e8ecf2] transition-colors rounded-l-[4px]">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8H12" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.6" /></svg>
                        </button>
                        <div className="bg-[#e2e2e2] w-px" />
                        <div className="flex-1 flex items-center justify-center">
                          <p className="font-['Inter:Medium',sans-serif] font-medium text-[#0a1e3f] text-[18px]">{level}</p>
                        </div>
                        <div className="bg-[#e2e2e2] w-px" />
                        <button onClick={() => setLevel(l => l + 1)} className="flex items-center justify-center w-[56px] cursor-pointer hover:bg-[#e8ecf2] transition-colors rounded-r-[4px]">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 4V12M4 8H12" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.6" /></svg>
                        </button>
                      </div>
                      <p className="font-['Inter:Regular',sans-serif] font-normal text-[#5c7089] text-[11px] tracking-[1.1px]">Use 0 for ground, negative for basement, positive for higher floors.</p>
                    </div>

                    <div className="flex flex-col gap-[8px] w-full">
                      <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">*SHORT FORM</p>
                      <div className="bg-[#f4f7fb] h-[48px] rounded-[4px] px-[16px] flex items-center justify-between">
                        <input type="text" value={shortForm} onChange={handleShortFormChange} placeholder="e.g. GF" maxLength={4} className="bg-transparent flex-1 font-['Inter:Regular',sans-serif] font-normal text-[#0a1e3f] text-[15px] border-none outline-none placeholder:text-[#5c7089]" />
                        <p className="font-['Inter:Regular',sans-serif] font-normal text-[#5c7089] text-[12px]">{shortForm.length}/4</p>
                      </div>
                      <p className="font-['Inter:Regular',sans-serif] font-normal text-[#5c7089] text-[11px] tracking-[1.1px]">Used as a compact identifier. Up to 4 characters.</p>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="bg-[#e2e2e2] h-px w-full" />
              {error && (
                <p className="px-[28px] pt-[12px] font-['Inter:Regular',sans-serif] text-[#ff4444] text-[13px]">{error}</p>
              )}
              <div className="bg-white flex items-center justify-end gap-[8px] px-[28px] py-[16px]">
                <button onClick={handleClose} disabled={saving} className="flex h-[48px] items-center justify-center px-[24px] rounded-[4px] cursor-pointer hover:bg-[#f4f7fb] transition-colors disabled:opacity-50">
                  <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[15px]">Cancel</p>
                </button>
                <button onClick={handleSave} disabled={saving} className="bg-[#0a1e3f] flex h-[48px] items-center justify-center px-[32px] rounded-[4px] cursor-pointer hover:bg-[#0d2851] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[15px] tracking-[0.15px]">{saving ? 'Saving...' : 'Next'}</p>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function EditFloorDrawer({ buildingId, floor, onClose, onSave }) {
  const [floorName, setFloorName] = useState(floor.floor_name ?? '');
  const [level, setLevel] = useState(floor.floor_pos ?? 0);
  const [shortForm, setShortForm] = useState(floor.floor_description ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleShortFormChange = (e) => setShortForm(e.target.value.slice(0, 4));

  const handleSave = async () => {
    if (!floorName.trim() || !buildingId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await apiClient.patch(`/we-okas/projects/${buildingId}/floors/${floor.id}`, {
        floor_name: floorName,
        floor_pos: level,
        floor_description: shortForm,
      });
      onSave(res.data.body);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update floor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[rgba(10,30,63,0.5)] z-40" onClick={onClose} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="fixed right-0 top-0 h-full w-[520px] bg-white shadow-[-8px_0px_24px_0px_rgba(10,30,63,0.12)] z-50 flex flex-col">
        <div className="bg-white flex h-[80px] items-center justify-between pl-[28px] pr-[20px]">
          <div className="flex flex-col gap-[4px]">
            <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">AREA — EDIT</p>
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0a1e3f] text-[22px] tracking-[-0.44px]">Edit Floor</p>
          </div>
          <motion.button onClick={onClose} whileHover={{ scale: 1.08, rotate: 90 }} whileTap={{ scale: 0.95 }} className="bg-[#f4f7fb] flex items-center justify-center rounded-[4px] size-[40px] cursor-pointer hover:bg-[#e8ecf2] transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.26" /></svg>
          </motion.button>
        </div>
        <div className="bg-[#e2e2e2] h-px w-full" />
        <div className="flex-1 overflow-y-auto p-[28px]">
          <div className="flex flex-col gap-[12px]">
            <div className="flex gap-[10px] items-center font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]"><p>01</p><p>FLOOR DETAILS</p></div>
            <div className="bg-white rounded-[4px] border border-[#e2e2e2]">
              <div className="flex flex-col gap-[20px] px-[24px] py-[28px]">
                <div className="flex flex-col gap-[8px] w-full">
                  <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">*FLOOR NAME</p>
                  <input type="text" value={floorName} onChange={e => setFloorName(e.target.value)} placeholder="e.g. Ground Floor" className="bg-[#f4f7fb] h-[48px] rounded-[4px] px-[16px] font-['Inter:Regular',sans-serif] font-normal text-[#0a1e3f] text-[15px] border-none outline-none placeholder:text-[#5c7089] w-full" />
                </div>
                <div className="flex flex-col gap-[8px] w-full">
                  <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">*LEVEL</p>
                  <div className="bg-[#f4f7fb] flex h-[48px] rounded-[4px]">
                    <button onClick={() => setLevel(l => l - 1)} className="flex items-center justify-center w-[56px] cursor-pointer hover:bg-[#e8ecf2] transition-colors rounded-l-[4px]">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8H12" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.6" /></svg>
                    </button>
                    <div className="bg-[#e2e2e2] w-px" />
                    <div className="flex-1 flex items-center justify-center"><p className="font-['Inter:Medium',sans-serif] font-medium text-[#0a1e3f] text-[18px]">{level}</p></div>
                    <div className="bg-[#e2e2e2] w-px" />
                    <button onClick={() => setLevel(l => l + 1)} className="flex items-center justify-center w-[56px] cursor-pointer hover:bg-[#e8ecf2] transition-colors rounded-r-[4px]">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 4V12M4 8H12" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.6" /></svg>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-[8px] w-full">
                  <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">*SHORT FORM</p>
                  <div className="bg-[#f4f7fb] h-[48px] rounded-[4px] px-[16px] flex items-center justify-between">
                    <input type="text" value={shortForm} onChange={handleShortFormChange} placeholder="e.g. GF" maxLength={4} className="bg-transparent flex-1 font-['Inter:Regular',sans-serif] font-normal text-[#0a1e3f] text-[15px] border-none outline-none placeholder:text-[#5c7089]" />
                    <p className="font-['Inter:Regular',sans-serif] font-normal text-[#5c7089] text-[12px]">{shortForm.length}/4</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="bg-[#e2e2e2] h-px w-full" />
          {error && (
            <p className="px-[28px] pt-[12px] font-['Inter:Regular',sans-serif] text-[#ff4444] text-[13px]">{error}</p>
          )}
          <div className="bg-white flex items-center justify-end gap-[8px] px-[28px] py-[16px]">
            <button onClick={onClose} disabled={saving} className="flex h-[48px] items-center justify-center px-[24px] rounded-[4px] cursor-pointer hover:bg-[#f4f7fb] transition-colors disabled:opacity-50">
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[15px]">Cancel</p>
            </button>
            <button onClick={handleSave} disabled={saving} className="bg-[#0a1e3f] flex h-[48px] items-center justify-center px-[32px] rounded-[4px] cursor-pointer hover:bg-[#0d2851] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[15px] tracking-[0.15px]">{saving ? 'Saving...' : 'Update Floor'}</p>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
