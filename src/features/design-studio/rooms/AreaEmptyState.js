import { useState, useEffect, useRef } from 'react';
import { imgRectangle1, svgPaths } from '../_assets/studioAssets';
import FloorDrawer, { useFloorsList } from '../floors/FloorDrawer';
import RoomDrawer from './RoomDrawer';
import { MOCK_ROOMS } from '../_assets/mockData';

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
              <path d="M7.21929 16.25C7.51549 16.8047 8.00293 17.25 8.59571 17.5275C9.18849 17.805 9.85376 17.9 10.5 17.7975C11.1462 17.695 11.7371 17.4 12.1875 16.9533C12.638 16.5067 12.925 15.9302 13 15.3125" stroke="#0A1E3F" strokeLinejoin="round" strokeWidth="1.4" />
              <path d="M10.5 2.5C9.17392 2.5 7.90215 3.02678 6.96447 3.96447C6.02678 4.90215 5.5 6.17392 5.5 7.5V10L3.5 13H17.5L15.5 10V7.5C15.5 6.17392 14.9732 4.90215 14.0355 3.96447C13.0979 3.02678 11.8261 2.5 10.5 2.5Z" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.4" />
            </svg>
          </div>
        </button>
        <div className="relative shrink-0 size-[40px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
            <circle cx="20" cy="20" fill="#F4F7FB" id="Ellipse" r="20" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <button className={`${active ? 'bg-[#f4f7fb]' : ''} h-[40px] relative rounded-[4px] shrink-0 w-full cursor-pointer hover:bg-[#f4f7fb] transition-colors`}>
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
          {icon}
          <p className={`font-['Inter:${active ? 'Medium' : 'Regular'}',sans-serif] ${active ? 'font-medium text-[#0a1e3f]' : 'font-normal text-[#5c7089]'} text-[14px]`}>
            {label}
          </p>
        </div>
      </div>
    </button>
  );
}

function Sidebar() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[2px] h-full items-start overflow-clip px-[16px] py-[24px] relative shrink-0 w-[240px]">
      <div className="content-stretch flex flex-col gap-[2px] items-start overflow-clip relative shrink-0 w-full">
        <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 8.5L10 2.5L17 8.5V17C17 17.2652 16.8946 17.5196 16.7071 17.7071C16.5196 17.8946 16.2652 18 16 18H4C3.73478 18 3.48043 17.8946 3.29289 17.7071C3.10536 17.5196 3 17.2652 3 17V8.5Z" stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" /><path d="M8 17V11H12V17" stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" /></svg>} label="Home" />
        <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="6" height="6" stroke="#0A1E3F" strokeWidth="1.4" /><rect x="11" y="3" width="6" height="6" stroke="#0A1E3F" strokeWidth="1.4" /><rect x="3" y="11" width="6" height="6" stroke="#0A1E3F" strokeWidth="1.4" /><rect x="11" y="11" width="6" height="6" stroke="#0A1E3F" strokeWidth="1.4" /></svg>} label="Area" active />
        <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="6" r="3.5" stroke="#5C7089" strokeWidth="1.4" /><circle cx="6" cy="14" r="3.5" stroke="#5C7089" strokeWidth="1.4" /><circle cx="14" cy="14" r="3.5" stroke="#5C7089" strokeWidth="1.4" /></svg>} label="Macros" />
        <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2.5C10 2.5 8 5.5 8 9.5C8 11.0913 8.63214 12.6174 9.75736 13.7426C10.8826 14.8679 12.4087 15.5 14 15.5C15.5913 15.5 17.1174 14.8679 18.2426 13.7426C19.3679 12.6174 20 11.0913 20 9.5C20 5.5 18 2.5 18 2.5" stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" /><path d="M8 17.5H12" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" /></svg>} label="Lights" />
        <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="7" width="14" height="10" rx="1" stroke="#5C7089" strokeWidth="1.4" /><path d="M3 7H17M3 11H17M3 15H17" stroke="#5C7089" strokeWidth="1.2" /></svg>} label="Covers" />
        <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="8" r="5.5" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" /><path d="M10 2.5V3.5M10 12.5V13.5M15.5 8H14.5M5.5 8H4.5" stroke="#5C7089" strokeWidth="1.4" /><path d="M13 6H15M13 9H15" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.2" /></svg>} label="Thermostat" />
        <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="11" rx="1" stroke="#5C7089" strokeWidth="1.4" /><path d="M6 14L10 10L14 14" stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" /><path d="M7 16.5H13" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" /></svg>} label="Media" />
        <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2.5L3 6.5V11.5C3 14.5 6 17 10 17.5C14 17 17 14.5 17 11.5V6.5L10 2.5Z" stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" /><path d="M7.5 10L9 11.5L12.5 8" stroke="#5C7089" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" /></svg>} label="Security" />
        <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17.5 13.5V15.5C17.5 16.0304 17.2893 16.5391 16.9142 16.9142C16.5391 17.2893 16.0304 17.5 15.5 17.5H4.5C3.96957 17.5 3.46086 17.2893 3.08579 16.9142C2.71071 16.5391 2.5 16.0304 2.5 15.5V4.5C2.5 3.96957 2.71071 3.46086 3.08579 3.08579C3.46086 2.71071 3.96957 2.5 4.5 2.5H6.5" stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" /><circle cx="13" cy="6.5" r="4" fill="#5C7089" /></svg>} label="Communication" />
        <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="#5C7089" strokeWidth="1.4" /><circle cx="7" cy="7" r="1.5" stroke="#5C7089" strokeWidth="1.2" /><circle cx="13" cy="7" r="1.5" stroke="#5C7089" strokeWidth="1.2" /><path d="M9.5 8.5V11.5M8 10H11" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.2" /></svg>} label="Controller" />
        <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" stroke="#5C7089" strokeWidth="1.4" /><path d="M3 7H17" stroke="#5C7089" strokeWidth="1.4" /><path d="M7 7V17" stroke="#5C7089" strokeWidth="1.4" /></svg>} label="User Interface" />
        <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="1" stroke="#5C7089" strokeWidth="1.4" /><path d="M2.5 7.5H17.5" stroke="#5C7089" strokeWidth="1.4" /><circle cx="6" cy="5.5" r="0.75" fill="#5C7089" /><circle cx="8.5" cy="5.5" r="0.75" fill="#5C7089" /></svg>} label="Others" />
        <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" /><path d="M10 7V13M7 10H13" stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" /></svg>} label="Box Settings" />
      </div>

      <div className="flex-[1_0_0] min-h-px relative w-px" />

      <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="#5C7089" strokeWidth="1.4" /><path d="M10 6.5V10.5" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" /><circle cx="10" cy="13" r="0.75" fill="#5C7089" /></svg>} label="Help" />
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

    const rooms = MOCK_ROOMS.filter(r => String(r.floor_id) === String(fId));
    if (rooms.length > 0) {
      onRoomCreated?.(fId, rooms[0].id ?? 0, rooms[0].room_name);
    } else {
      setCurrentFloorId(fId);
      setFloorAdded(true);
    }
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
          floorId={currentFloorId}
          onSave={handleRoomSave}
        />
      )}
    </div>
  );
}
