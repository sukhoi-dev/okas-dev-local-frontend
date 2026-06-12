import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import imgOuterRingDashed from '../_assets/dashedRing.png';
import { MOCK_ROOMS } from '../_assets/mockData';

let nextRoomId = 200;

export function useRoomsList(floorId) {
  const initial = floorId !== undefined
    ? MOCK_ROOMS.filter(r => String(r.floor_id) === String(floorId))
    : [...MOCK_ROOMS];
  const [rooms, setRooms] = useState(initial);
  return { rooms, setRooms, loading: false };
}

export async function deleteRoom() {
  return Promise.resolve();
}

export default function RoomDrawer({ isOpen, onClose, floorId, onSave }) {
  const [roomName, setRoomName] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleClose = () => {
    setRoomName('');
    setPhotoPreview(null);
    setError(null);
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('File size must be less than 5MB.'); return; }
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!roomName.trim()) { setError('Room name is required.'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    const newRoom = {
      id: nextRoomId++,
      room_name: roomName.trim(),
      room_type: 'room',
      floor_id: Number(floorId),
      room_image: photoPreview ?? null,
      subroom_id: null,
      zoneactive: 'true',
    };
    onSave(newRoom);
    setSaving(false);
    handleClose();
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
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0a1e3f] text-[22px] tracking-[-0.44px]">Add Room</p>
              </div>
              <motion.button onClick={handleClose} whileHover={{ scale: 1.08, rotate: 90 }} whileTap={{ scale: 0.95 }} className="bg-[#f4f7fb] flex items-center justify-center rounded-[4px] size-[40px] cursor-pointer hover:bg-[#e8ecf2] transition-colors">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.26" /></svg>
              </motion.button>
            </div>

            <div className="bg-[#e2e2e2] h-px w-full" />

            <div className="flex-1 overflow-y-auto p-[28px]">
              <div className="flex flex-col gap-[12px]">
                <div className="flex gap-[10px] items-center font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">
                  <p>01</p><p>ROOM DETAILS</p>
                </div>
                <div className="bg-white rounded-[4px] border border-[#e2e2e2] h-[339px]">
                  <div className="flex flex-col items-start justify-between px-[24px] py-[28px] h-full">

                    <div className="flex flex-col gap-[12px] items-center justify-center w-full">
                      <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">ROOM PHOTO</p>
                      <button onClick={() => fileInputRef.current?.click()} className="relative size-[124px] cursor-pointer group">
                        <div className="absolute left-[2px] size-[120px] top-[2px]">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgOuterRingDashed} />
                        </div>
                        <div className="absolute left-[14px] size-[96px] top-[14px] rounded-full overflow-hidden">
                          {photoPreview ? (
                            <img src={photoPreview} alt="Room preview" className="w-full h-full object-cover" />
                          ) : (
                            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 96 96">
                              <circle cx="48" cy="48" fill="#F4F7FB" r="48" />
                            </svg>
                          )}
                        </div>
                        {!photoPreview && (
                          <div className="absolute left-[46px] size-[32px] top-[46px] pointer-events-none">
                            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                              <rect x="4" y="8" width="24" height="18" rx="2" stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" />
                              <circle cx="16" cy="17" r="5" stroke="#5C7089" strokeWidth="1.4" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute bg-[#0a1e3f] left-[90px] rounded-[14px] size-[28px] top-[90px] group-hover:bg-[#0d2851] transition-colors">
                          <div className="flex items-center justify-center h-full">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2.5V11.5M2.5 7H11.5" stroke="white" strokeLinecap="round" strokeWidth="1.6" /></svg>
                          </div>
                          <div className="absolute border-2 border-solid border-white inset-[-2px] pointer-events-none rounded-[16px]" />
                        </div>
                      </button>
                      <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" onChange={handleFileChange} className="hidden" />
                      <p className="font-['Inter:Regular',sans-serif] font-normal text-[#5c7089] text-[11px] tracking-[1.1px]">JPG, PNG, WEBP or GIF · Max 5MB</p>
                    </div>

                    <div className="flex flex-col gap-[8px] w-full">
                      <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">*ROOM NAME</p>
                      <input type="text" value={roomName} onChange={e => setRoomName(e.target.value)} placeholder="e.g. Living Room" className="bg-[#f4f7fb] h-[48px] rounded-[4px] px-[16px] font-['Inter:Regular',sans-serif] font-normal text-[#0a1e3f] text-[15px] border-none outline-none placeholder:text-[#5c7089] w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="bg-[#e2e2e2] h-px w-full" />
              <div className="bg-white flex flex-col gap-[12px] px-[28px] py-[16px]">
                {error && <p className="text-[12px] font-['Inter:Regular',sans-serif] text-red-500 text-center">{error}</p>}
                <div className="flex items-center justify-end gap-[8px]">
                  <button onClick={handleClose} disabled={saving} className="flex h-[48px] items-center justify-center px-[24px] rounded-[4px] cursor-pointer hover:bg-[#f4f7fb] transition-colors disabled:opacity-50">
                    <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[15px]">Cancel</p>
                  </button>
                  <button onClick={handleSave} disabled={saving} className="bg-[#0a1e3f] flex h-[48px] items-center justify-center px-[32px] rounded-[4px] cursor-pointer hover:bg-[#0d2851] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[15px] tracking-[0.15px]">{saving ? 'Saving...' : 'Save Room'}</p>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
