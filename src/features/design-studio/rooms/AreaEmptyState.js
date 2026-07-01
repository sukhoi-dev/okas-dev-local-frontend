import { useState, useEffect, useRef } from 'react';
import { imgRectangle1, svgPaths } from '../_assets/studioAssets';
import FloorDrawer, { useFloorsList } from '../floors/FloorDrawer';
import RoomDrawer from './RoomDrawer';
import apiClient from '../../../api/client';
import imgAvatar from '../../../assets/avatar.png';

function MaskGroup() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[8.71px] mt-0 place-items-start relative row-1" data-name="Mask group">
      <div
        className="bg-gradient-to-r col-1 from-[#f07e25] h-[30.883px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_2.376px] mask-size-[131.29px_27.038px] ml-0 mt-[-2.38px] relative row-1 to-[#18629f] via-[#57ac6c] via-[53.365%] w-[131.452px]"
        style={{ maskImage: `url('${imgRectangle1}')` }}
      />
    </div>
  );
}

function StudioLogo() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Studio Logo">
      <MaskGroup />
      <div className="col-1 ml-0 mt-[22.17px] relative row-1 size-[4.866px]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.86577 4.86577">
          <path d={svgPaths.p2d3a5480} fill="url(#paint0_linear_3_387)" id="Vector" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_387" x1="2.43289" x2="2.43289" y1="4.86577" y2="0">
              <stop stopColor="#30A7A8" />
              <stop offset="1" stopColor="#52B390" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function TopNav() {
  return (
    <div className="bg-white content-stretch flex gap-[32px] h-[72px] items-center overflow-clip px-[32px] relative shrink-0 w-full" data-name="Top Nav">
      <StudioLogo />
      <div className="flex-[1_0_0] h-px min-w-px relative" />

      <div className="bg-[#f4f7fb] content-stretch flex gap-[12px] h-[44px] items-center overflow-clip px-[16px] relative rounded-[4px] shrink-0 w-[480px]">
        <div className="relative shrink-0 size-[20px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <circle cx="9" cy="9" r="6" stroke="#5C7089" strokeWidth="1.4" />
            <path d="M13 13L16.5 16.5" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search"
          className="font-['Inter:Regular',sans-serif] font-normal text-[#5c7089] text-[15px] bg-transparent border-none outline-none flex-1"
        />
      </div>

      <div className="flex-[1_0_0] h-px min-w-px relative" />

      <button className="bg-[#0a1e3f] content-stretch flex gap-[8px] h-[48px] items-center justify-center overflow-clip px-[24px] relative rounded-[4px] shrink-0 cursor-pointer hover:bg-[#0d2851] transition-colors">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[15px] tracking-[0.15px]">Export Config</p>
      </button>

      <div className="content-stretch flex gap-[16px] items-center overflow-clip relative shrink-0">
        <button className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[40px] cursor-pointer hover:bg-[#f4f7fb] rounded-[4px] transition-colors">
          <div className="relative shrink-0 size-[20px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <path d="M8.5 3.5L9 2H11L11.5 3.5L13.2 4.2L14.7 3.3L16.2 4.8L15.3 6.3L16 8V10L15.3 11.7L16.2 13.2L14.7 14.7L13.2 13.8L11.5 14.5L11 16H9L8.5 14.5L6.8 13.8L5.3 14.7L3.8 13.2L4.7 11.7L4 10V8L4.7 6.3L3.8 4.8L5.3 3.3L6.8 4.2L8.5 3.5Z" stroke="#0A1E3F" strokeLinejoin="round" strokeWidth="1.3" />
              <circle cx="10" cy="9" r="2.5" stroke="#0A1E3F" strokeWidth="1.3" />
            </svg>
          </div>
        </button>
        <button className="relative content-stretch flex items-center justify-center overflow-clip shrink-0 size-[40px] cursor-pointer hover:bg-[#f4f7fb] rounded-[4px] transition-colors">
          <div className="relative shrink-0 size-[20px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <path d="M7.21929 16.25C7.51549 16.8047 8.00293 17.25 8.59571 17.5275C9.18849 17.805 9.85376 17.9 10.5 17.7975C11.1462 17.695 11.7371 17.4 12.1875 16.9533C12.638 16.5067 12.925 15.9302 13 15.3125" stroke="#0A1E3F" strokeLinejoin="round" strokeWidth="1.4" />
              <path d="M10.5 2.5C9.17392 2.5 7.90215 3.02678 6.96447 3.96447C6.02678 4.90215 5.5 6.17392 5.5 7.5V10L3.5 13H17.5L15.5 10V7.5C15.5 6.17392 14.9732 4.90215 14.0355 3.96447C13.0979 3.02678 11.8261 2.5 10.5 2.5Z" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.4" />
            </svg>
          </div>
          <span className="absolute top-[2px] right-[-2px] bg-[#2f6fed] text-white text-[10px] font-semibold rounded-full px-[5px] leading-[15px] min-w-[16px] text-center">
            100+
          </span>
        </button>
        <div className="shrink-0 size-[40px] rounded-full overflow-hidden">
          <img alt="User avatar" className="block size-full object-cover" src={imgAvatar} />
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <button className={`${active ? 'bg-[#f4f7fb]' : ''} flex flex-col items-center justify-center gap-[6px] w-full py-[16px] rounded-[4px] cursor-pointer hover:bg-[#f4f7fb] transition-colors`}>
      {icon}
      <p className={`font-['Inter:${active ? 'Medium' : 'Regular'}',sans-serif] ${active ? 'font-medium text-[#0a1e3f]' : 'font-normal text-[#5c7089]'} text-[13px]`}>
        {label}
      </p>
    </button>
  );
}

function Sidebar() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[2px] h-full items-start overflow-clip px-[8px] py-[24px] relative shrink-0 w-[100px]">
      <div className="content-stretch flex flex-col gap-[2px] items-start overflow-clip relative shrink-0 w-full">
        <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="6" height="6" stroke="#0A1E3F" strokeWidth="1.4" /><rect x="11" y="3" width="6" height="6" stroke="#0A1E3F" strokeWidth="1.4" /><rect x="3" y="11" width="6" height="6" stroke="#0A1E3F" strokeWidth="1.4" /><rect x="11" y="11" width="6" height="6" stroke="#0A1E3F" strokeWidth="1.4" /></svg>} label="Area" active />
        <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="6" height="6" stroke="#5C7089" strokeWidth="1.4" /><rect x="11" y="3" width="6" height="6" stroke="#5C7089" strokeWidth="1.4" /><rect x="3" y="11" width="6" height="6" stroke="#5C7089" strokeWidth="1.4" /><rect x="11" y="11" width="6" height="6" stroke="#5C7089" strokeWidth="1.4" /></svg>} label="Macro" />
      </div>

      <div className="flex-[1_0_0] min-h-px relative w-px" />

      <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="#5C7089" strokeWidth="1.4" /><path d="M7.5 7.9C7.5 6.6 8.6 5.5 10 5.5C11.4 5.5 12.5 6.6 12.5 7.9C12.5 9.2 10 9.9 10 11.6" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" /><circle cx="10" cy="14" r="0.85" fill="#5C7089" /></svg>} label="Help" />
    </div>
  );
}

export default function AreaEmptyState({ buildingId = '', buildingType, onRoomCreated }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [floorAdded, setFloorAdded] = useState(false);
  const [currentFloorId, setCurrentFloorId] = useState(0);

  const { floors, loading: floorsLoading } = useFloorsList(buildingId || undefined);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (floorsLoading || !buildingId || floors.length === 0 || checkedRef.current) return;
    checkedRef.current = true;

    const firstFloor = floors[0];
    const fId = firstFloor.id;
    if (!fId) { setCurrentFloorId(0); setFloorAdded(true); return; }

    apiClient.get(`/we-okas/projects/${buildingId}/floors/${fId}/rooms`)
      .then((r) => {
        const rooms = r.data?.body?.rooms ?? [];
        if (rooms.length > 0) {
          onRoomCreated?.(fId, rooms[0].id ?? 0, rooms[0].room_name);
        } else {
          setCurrentFloorId(fId);
          setFloorAdded(true);
        }
      })
      .catch(() => { setCurrentFloorId(fId); setFloorAdded(true); });
  }, [floorsLoading, floors, buildingId]);

  const handleCreateFloor = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  const handleFloorSave = (floor) => {
    setCurrentFloorId(floor.id ?? 0);
    setFloorAdded(true);
    setIsDrawerOpen(false);
    setTimeout(() => setIsDrawerOpen(true), 300);
  };

  const handleRoomSave = (room) => {
    if (onRoomCreated) {
      onRoomCreated(currentFloorId, room.id ?? 0, room.room_name);
    }
  };

  return (
    <div className="bg-white flex flex-col items-start relative size-full overflow-hidden">
      <TopNav />

      <div className="flex h-full items-start w-full relative">
        <Sidebar />

        <div className="absolute left-0 top-0 size-[20px] pointer-events-none z-10">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d="M20 0C8.95431 0 0 8.95431 0 20V0H20Z" fill="white" />
          </svg>
        </div>

        <div className="bg-[#f4f7fb] flex-1 h-full flex flex-col items-center justify-center p-[40px] relative">
          <div className="absolute left-0 top-0 size-[20px] pointer-events-none">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <path d="M20 0C8.95431 0 0 8.95431 0 20V0H20Z" fill="white" />
            </svg>
          </div>

          {floorsLoading && (
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[#5c7089] text-[15px]">Loading...</p>
          )}

          {!floorsLoading && (
            <div className="flex flex-col gap-[32px] items-center">
              <div className="relative rounded-[4px] size-[96px]">
                <div className="flex items-center justify-center h-full">
                  {!floorAdded ? (
                    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
                      <rect x="1.5" y="1.5" width="93" height="93" rx="2.5" stroke="#E2E2E2" strokeWidth="1.5" strokeDasharray="6 6" />
                      <rect x="24" y="24" width="20" height="20" stroke="#5C7089" strokeWidth="1.4" />
                      <rect x="52" y="24" width="20" height="20" stroke="#5C7089" strokeWidth="1.4" />
                      <rect x="24" y="52" width="20" height="20" stroke="#5C7089" strokeWidth="1.4" />
                      <rect x="52" y="52" width="20" height="20" stroke="#5C7089" strokeWidth="1.4" />
                    </svg>
                  ) : (
                    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
                      <rect x="1.5" y="1.5" width="93" height="93" rx="2.5" stroke="#E2E2E2" strokeWidth="1.5" strokeDasharray="6 6" />
                      <rect x="18" y="18" width="60" height="60" rx="2" stroke="#5C7089" strokeWidth="1.4" />
                      <line x1="48" y1="18" x2="48" y2="78" stroke="#5C7089" strokeWidth="1.4" />
                      <line x1="18" y1="48" x2="78" y2="48" stroke="#5C7089" strokeWidth="1.4" />
                    </svg>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-[16px] items-center text-center w-[560px]">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0a1e3f] text-[40px] tracking-[-0.8px]">
                  {!floorAdded ? 'Begin with a floor.' : 'Now add a room.'}
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[#5c7089] text-[16px] leading-[1.5]">
                  {!floorAdded
                    ? 'Every project starts with at least one floor. Add one to begin organizing rooms, devices, and areas.'
                    : 'Great! Your floor is ready. Now add your first room to start organizing devices and areas.'}
                </p>
              </div>

              <button
                onClick={handleCreateFloor}
                className="bg-[#0a1e3f] flex gap-[8px] h-[48px] items-center justify-center px-[24px] rounded-[4px] cursor-pointer hover:bg-[#0d2851] transition-colors"
              >
                <div className="w-[18px] h-[18px]">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 3.6V14.4M3.6 9H14.4" stroke="white" strokeLinecap="round" strokeWidth="1.44" />
                  </svg>
                </div>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[15px] tracking-[0.15px]">
                  {!floorAdded ? 'Create Floor' : 'Add Room'}
                </p>
              </button>
            </div>
          )}
        </div>
      </div>

      {!floorAdded ? (
        <FloorDrawer
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          buildingId={buildingId}
          buildingType={buildingType}
          onSave={handleFloorSave}
        />
      ) : (
        <RoomDrawer
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          buildingId={buildingId}
          floorId={currentFloorId}
          onSave={handleRoomSave}
        />
      )}
    </div>
  );
}
