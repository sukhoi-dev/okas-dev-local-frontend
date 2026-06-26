import { useState, useRef, useEffect } from 'react';
import { imgRectangle1, svgPaths } from '../_assets/studioAssets';
import FloorDrawer, { useFloorsList } from '../floors/FloorDrawer';
import RoomDrawer from './RoomDrawer';
import { MOCK_ROOMS, MOCK_LIGHTS } from '../_assets/mockData';

let nextLightId = 300;

function MaskGroup() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[8.71px] mt-0 place-items-start relative row-1">
      <div
        className="bg-gradient-to-r col-1 from-[#f07e25] h-[30.883px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_2.376px] mask-size-[131.29px_27.038px] ml-0 mt-[-2.38px] relative row-1 to-[#18629f] via-[#57ac6c] via-[53.365%] w-[131.452px]"
        style={{ maskImage: `url('${imgRectangle1}')` }}
      />
    </div>
  );
}

function StudioLogo() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <MaskGroup />
      <div className="col-1 ml-0 mt-[22.17px] relative row-1 size-[4.866px]">
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

function TopNav({ onLogout, onExportConfig, exporting }) {
  return (
    <div className="bg-white flex gap-[32px] h-[72px] items-center px-[32px] w-full">
      <StudioLogo />
      <div className="flex-1 h-px min-w-px" />

      <div className="bg-[#f4f7fb] flex gap-[12px] h-[44px] items-center px-[16px] rounded-[4px] w-[480px]">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="6" stroke="#5C7089" strokeWidth="1.4" />
          <path d="M13 13L16.5 16.5" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" />
        </svg>
        <input type="text" placeholder="Search" className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#5c7089] text-[15px]" />
      </div>

      <div className="flex-1 h-px min-w-px" />

      <button
        onClick={onExportConfig}
        disabled={exporting}
        className="bg-[#0a1e3f] flex gap-[6px] h-[36px] items-center justify-center px-[16px] rounded-[4px] cursor-pointer hover:bg-[#0d2851] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
          <path d="M9 11.5V3.5M9 3.5L6 6.5M9 3.5L12 6.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M3 12V13C3 13.5304 3.21071 14.0391 3.58579 14.4142C3.96086 14.7893 4.46957 15 5 15H13C13.5304 15 14.0391 14.7893 14.4142 14.4142C14.7893 14.0391 15 13.5304 15 13V12" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[13px] tracking-[0.13px]">
          {exporting ? 'Exporting…' : 'Export Config'}
        </p>
      </button>

      <div className="flex gap-[16px] items-center">
        <button className="flex items-center justify-center size-[40px] cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.21929 16.25C7.51549 16.8047 8.00293 17.25 8.59571 17.5275C9.18849 17.805 9.85376 17.9 10.5 17.7975C11.1462 17.695 11.7371 17.4 12.1875 16.9533C12.638 16.5067 12.925 15.9302 13 15.3125" stroke="#0A1E3F" strokeLinejoin="round" strokeWidth="1.4" />
            <path d="M10.5 2.5C9.17392 2.5 7.90215 3.02678 6.96447 3.96447C6.02678 4.90215 5.5 6.17392 5.5 7.5V10L3.5 13H17.5L15.5 10V7.5C15.5 6.17392 14.9732 4.90215 14.0355 3.96447C13.0979 3.02678 11.8261 2.5 10.5 2.5Z" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.4" />
          </svg>
        </button>
        <button onClick={onLogout} title="Logout" className="size-[40px] rounded-full bg-[#F4F7FB] hover:bg-[#e2e2e2] transition-colors cursor-pointer" />
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onMouseEnter }) {
  return (
    <button
      className={`${active ? 'bg-[#f4f7fb]' : ''} h-[40px] rounded-[4px] w-full cursor-pointer hover:bg-[#f4f7fb] transition-colors`}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex gap-[12px] items-center px-[12px] py-[8px]">
        {icon}
        <p className={`font-['Inter:${active ? 'Medium' : 'Regular'}',sans-serif] ${active ? 'font-medium text-[#0a1e3f]' : 'font-normal text-[#5c7089]'} text-[14px]`}>
          {label}
        </p>
      </div>
    </button>
  );
}

const floorRooms = {
  'First Floor':  ['Living Room', 'Dining Room', 'Kitchen', 'Guest Room', 'Hallway'],
  'Second Floor': ['Master Bedroom', 'Bedroom 2', 'Study', 'Bathroom'],
  'Third Floor':  ['Game Room', 'Library', 'Terrace'],
  'Fourth Floor': ['Penthouse', 'Roof Garden'],
  'Fifth Floor':  ['Utility Room', 'Storage'],
};

const navFlyout = {
  'Home': { items: ['Overview', 'Recent Activity', 'Alerts', 'Favourites'], subItems: { 'Overview': ['Dashboard', 'Status', 'Summary'], 'Recent Activity': ['Today', 'Yesterday', 'This Week'], 'Alerts': ['Critical', 'Warnings', 'Info'], 'Favourites': ['Shortcuts', 'Quick Actions'] } },
  'Area': { items: [], subItems: {}, addLabel: 'Add Floor' },
  'Macros': { items: ['Scenes', 'Schedules', 'Triggers', 'Actions'], subItems: { 'Scenes': ['Morning', 'Evening', 'Night', 'Away', 'Party'], 'Schedules': ['Daily', 'Weekly', 'Custom'], 'Triggers': ['Motion', 'Time', 'Sensor', 'Remote'], 'Actions': ['Lights', 'Climate', 'Security', 'Media'] } },
  'Lights': { items: Object.keys(floorRooms), subItems: floorRooms, addLabel: 'Add Group' },
  'Covers': { items: Object.keys(floorRooms), subItems: floorRooms },
  'Thermostat': { items: Object.keys(floorRooms), subItems: floorRooms },
  'Media': { items: Object.keys(floorRooms), subItems: floorRooms },
  'Security': { items: ['Zone 1', 'Zone 2', 'Perimeter', 'Interior'], subItems: { 'Zone 1': ['Main Entrance', 'Back Door', 'Garage'], 'Zone 2': ['Living Room', 'Dining Room'], 'Perimeter': ['All Windows', 'All Doors', 'Fence'], 'Interior': ['Motion Sensor 1', 'Motion Sensor 2'] } },
  'Communication': { items: ['Intercom', 'Phone', 'Network', 'Audio'], subItems: { 'Intercom': ['Front Door', 'Back Door', 'Gate'], 'Phone': ['Line 1', 'Line 2'], 'Network': ['Router', 'Switch', 'Access Points'], 'Audio': ['Speakers', 'Amplifiers'] } },
  'Controller': { items: Object.keys(floorRooms), subItems: floorRooms },
  'User Interface': { items: ['Touchpanels', 'Keypads', 'Remotes', 'Displays'], subItems: { 'Touchpanels': ['Entry Panel', 'Kitchen Panel', 'Master Panel'], 'Keypads': ['Keypad 1', 'Keypad 2', 'Keypad 3'], 'Remotes': ['Living Room', 'Bedroom', 'Study'], 'Displays': ['Main Display', 'Secondary Display'] } },
  'Others': { items: ['Sensors', 'Actuators', 'Gateways', 'Misc'], subItems: { 'Sensors': ['Temperature', 'Humidity', 'Motion', 'Smoke'], 'Actuators': ['Relay 1', 'Relay 2', 'Relay 3'], 'Gateways': ['KNX Gateway', 'Zigbee Gateway'], 'Misc': ['Device A', 'Device B'] } },
  'Box Settings': { items: ['Network', 'Devices', 'Users', 'Backup'], subItems: { 'Network': ['IP Config', 'DNS', 'Firewall', 'VPN'], 'Devices': ['Add Device', 'Device List', 'Remove Device'], 'Users': ['Admin', 'Operator', 'Viewer'], 'Backup': ['Manual Backup', 'Auto Backup', 'Restore'] } },
  'Help': { items: ['Getting Started', 'Configuration', 'Troubleshooting', 'Contact'], subItems: { 'Getting Started': ['Installation', 'First Setup', 'Quick Tour'], 'Configuration': ['Network Setup', 'Device Config', 'User Roles'], 'Troubleshooting': ['FAQ', 'Error Codes', 'Support'], 'Contact': ['Email', 'Phone', 'Chat'] } },
};

function Sidebar({ floors, roomsByFloor, selectedRoomName, onRoomSelect, onAddRoom, onAddFloor }) {
  const [hoveredNav, setHoveredNav] = useState(null);
  const [hoveredL1, setHoveredL1] = useState(null);
  const [activeL1, setActiveL1] = useState(null);
  const hideTimer = useRef(null);

  const startHide = () => {
    hideTimer.current = setTimeout(() => {
      setHoveredNav(null);
      setHoveredL1(null);
      setActiveL1(null);
    }, 150);
  };

  const cancelHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  const handleNavHover = (label) => {
    cancelHide();
    setHoveredNav(label);
    setHoveredL1(null);
    setActiveL1(null);
  };

  const handleL1Hover = (item) => {
    cancelHide();
    setHoveredL1(item);
    setActiveL1(item);
  };

  const l1Data = hoveredNav === 'Area'
    ? { items: floors.map(f => f.floor_name), subItems: roomsByFloor, addLabel: 'Add Floor' }
    : hoveredNav ? navFlyout[hoveredNav] : null;

  const l2Items = hoveredNav === 'Area' && hoveredL1
    ? (roomsByFloor[hoveredL1] ?? []).map(r => r.name)
    : (hoveredNav && hoveredL1) ? (navFlyout[hoveredNav]?.subItems[hoveredL1] ?? []) : [];

  return (
    <div className="relative h-full shrink-0">
      <div
        className="bg-white flex flex-col gap-[2px] h-full px-[16px] py-[24px] w-[240px] relative z-30"
        onMouseLeave={startHide}
        onMouseEnter={cancelHide}
      >
        <div className="flex flex-col gap-[2px] w-full">
          <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 8.5L10 2.5L17 8.5V17C17 17.2652 16.8946 17.5196 16.7071 17.7071C16.5196 17.8946 16.2652 18 16 18H4C3.73478 18 3.48043 17.8946 3.29289 17.7071C3.10536 17.5196 3 17.2652 3 17V8.5Z" stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" /><path d="M8 17V11H12V17" stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" /></svg>} label="Home" onMouseEnter={() => handleNavHover('Home')} />
          <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="6" height="6" stroke="#0A1E3F" strokeWidth="1.4" /><rect x="11" y="3" width="6" height="6" stroke="#0A1E3F" strokeWidth="1.4" /><rect x="3" y="11" width="6" height="6" stroke="#0A1E3F" strokeWidth="1.4" /><rect x="11" y="11" width="6" height="6" stroke="#0A1E3F" strokeWidth="1.4" /></svg>} label="Area" active onMouseEnter={() => handleNavHover('Area')} />
          <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="6" r="3.5" stroke="#5C7089" strokeWidth="1.4" /><circle cx="6" cy="14" r="3.5" stroke="#5C7089" strokeWidth="1.4" /><circle cx="14" cy="14" r="3.5" stroke="#5C7089" strokeWidth="1.4" /></svg>} label="Macros" onMouseEnter={() => handleNavHover('Macros')} />
          <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2.5C10 2.5 8 5.5 8 9.5C8 11.0913 8.63214 12.6174 9.75736 13.7426C10.8826 14.8679 12.4087 15.5 14 15.5C15.5913 15.5 17.1174 14.8679 18.2426 13.7426C19.3679 12.6174 20 11.0913 20 9.5C20 5.5 18 2.5 18 2.5" stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" /><path d="M8 17.5H12" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" /></svg>} label="Lights" onMouseEnter={() => handleNavHover('Lights')} />
          <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="7" width="14" height="10" rx="1" stroke="#5C7089" strokeWidth="1.4" /><path d="M3 7H17M3 11H17M3 15H17" stroke="#5C7089" strokeWidth="1.2" /></svg>} label="Covers" onMouseEnter={() => handleNavHover('Covers')} />
          <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="8" r="5.5" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" /><path d="M10 2.5V3.5M10 12.5V13.5M15.5 8H14.5M5.5 8H4.5" stroke="#5C7089" strokeWidth="1.4" /><path d="M13 6H15M13 9H15" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.2" /></svg>} label="Thermostat" onMouseEnter={() => handleNavHover('Thermostat')} />
          <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="11" rx="1" stroke="#5C7089" strokeWidth="1.4" /><path d="M6 14L10 10L14 14" stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" /><path d="M7 16.5H13" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" /></svg>} label="Media" onMouseEnter={() => handleNavHover('Media')} />
          <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2.5L3 6.5V11.5C3 14.5 6 17 10 17.5C14 17 17 14.5 17 11.5V6.5L10 2.5Z" stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" /><path d="M7.5 10L9 11.5L12.5 8" stroke="#5C7089" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" /></svg>} label="Security" onMouseEnter={() => handleNavHover('Security')} />
          <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17.5 13.5V15.5C17.5 16.0304 17.2893 16.5391 16.9142 16.9142C16.5391 17.2893 16.0304 17.5 15.5 17.5H4.5C3.96957 17.5 3.46086 17.2893 3.08579 16.9142C2.71071 16.5391 2.5 16.0304 2.5 15.5V4.5C2.5 3.96957 2.71071 3.46086 3.08579 3.08579C3.46086 2.71071 3.96957 2.5 4.5 2.5H6.5" stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" /><circle cx="13" cy="6.5" r="4" fill="#5C7089" /></svg>} label="Communication" onMouseEnter={() => handleNavHover('Communication')} />
          <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="#5C7089" strokeWidth="1.4" /><circle cx="7" cy="7" r="1.5" stroke="#5C7089" strokeWidth="1.2" /><circle cx="13" cy="7" r="1.5" stroke="#5C7089" strokeWidth="1.2" /><path d="M9.5 8.5V11.5M8 10H11" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.2" /></svg>} label="Controller" onMouseEnter={() => handleNavHover('Controller')} />
          <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" stroke="#5C7089" strokeWidth="1.4" /><path d="M3 7H17" stroke="#5C7089" strokeWidth="1.4" /><path d="M7 7V17" stroke="#5C7089" strokeWidth="1.4" /></svg>} label="User Interface" onMouseEnter={() => handleNavHover('User Interface')} />
          <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="1" stroke="#5C7089" strokeWidth="1.4" /><path d="M2.5 7.5H17.5" stroke="#5C7089" strokeWidth="1.4" /><circle cx="6" cy="5.5" r="0.75" fill="#5C7089" /><circle cx="8.5" cy="5.5" r="0.75" fill="#5C7089" /></svg>} label="Others" onMouseEnter={() => handleNavHover('Others')} />
          <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" /><path d="M10 7V13M7 10H13" stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" /></svg>} label="Box Settings" onMouseEnter={() => handleNavHover('Box Settings')} />
        </div>
        <div className="flex-1 min-h-px w-px" />
        <NavItem icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="#5C7089" strokeWidth="1.4" /><path d="M10 6.5V10.5" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" /><circle cx="10" cy="13" r="0.75" fill="#5C7089" /></svg>} label="Help" onMouseEnter={() => handleNavHover('Help')} />
      </div>

      {hoveredNav && l1Data && (
        <div
          className="absolute left-[240px] top-0 h-full w-[160px] bg-white border-l border-[#e2e2e2] shadow-[4px_0px_16px_rgba(10,30,63,0.08)] z-20 flex flex-col"
          onMouseEnter={cancelHide}
          onMouseLeave={startHide}
        >
          <div className="flex-1 overflow-y-auto py-[8px]">
            {l1Data.items.map((item) => (
              <button
                key={item}
                onMouseEnter={() => handleL1Hover(item)}
                className={`w-full h-[48px] flex items-center transition-colors ${activeL1 === item ? 'bg-white border-l-[3px] border-[#0a1e3f] pl-[17px] shadow-[0px_1px_2px_rgba(0,0,0,0.06)]' : 'border-l-[3px] border-transparent pl-[17px] hover:bg-[#f4f7fb]'}`}
              >
                <p className={`font-['Inter:Medium',sans-serif] font-medium text-[14px] ${activeL1 === item ? 'text-[#0a1e3f]' : 'text-[#5c7089]'}`}>{item}</p>
              </button>
            ))}
          </div>
          {l1Data.addLabel && (
            <div className="border-t border-[#e2e2e2] px-[16px] py-[14px]">
              <button
                onClick={() => { if (hoveredNav === 'Area') { onAddFloor(); startHide(); } }}
                className="flex gap-[8px] items-center cursor-pointer hover:opacity-70 transition-opacity"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V13M3 8H13" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.4" />
                </svg>
                <p className="font-['Inter:Medium',sans-serif] font-medium text-[#0a1e3f] text-[13px]">{l1Data.addLabel}</p>
              </button>
            </div>
          )}
        </div>
      )}

      {hoveredL1 && (l2Items.length > 0 || hoveredNav === 'Area') && (
        <div
          className="absolute left-[400px] top-0 h-full w-[160px] bg-white border-l border-[#e2e2e2] shadow-[4px_0px_16px_rgba(10,30,63,0.08)] z-20 flex flex-col"
          onMouseEnter={cancelHide}
          onMouseLeave={startHide}
        >
          <div className="px-[12px] py-[10px] border-b border-[#e2e2e2]">
            <div className="flex items-center gap-[6px]">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6" stroke="#5C7089" strokeWidth="1.6" />
                <path d="M13 13L16.5 16.5" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.6" />
              </svg>
              <input type="text" placeholder="Search" className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#5c7089] text-[13px] placeholder:text-[#a0adb8]" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {l2Items.length === 0 && hoveredNav === 'Area' && (
              <p className="px-[16px] pt-[12px] font-['Inter:Regular',sans-serif] text-[#5c7089] text-[12px]">No rooms yet.</p>
            )}
            {l2Items.map((item, i) => {
              const isActiveRoom = hoveredNav === 'Area' && item === selectedRoomName;
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (hoveredNav === 'Area') {
                      const entry = (roomsByFloor[hoveredL1] ?? []).find(r => r.name === item);
                      onRoomSelect(item, entry?.id ?? 0);
                      startHide();
                    }
                  }}
                  className={`w-full h-[44px] flex items-center justify-end px-[16px] hover:bg-[#f4f7fb] transition-colors border-b border-[#f0f2f5] last:border-0 cursor-pointer ${isActiveRoom ? 'bg-[#f4f7fb]' : ''}`}
                >
                  <p className={`font-['Inter:${isActiveRoom ? 'Medium' : 'Regular'}',sans-serif] ${isActiveRoom ? 'text-[#0a1e3f]' : 'text-[#5c7089]'} text-[13px]`}>{item}</p>
                </button>
              );
            })}
          </div>
          {hoveredNav === 'Area' && (
            <div className="border-t border-[#e2e2e2] px-[16px] py-[14px]">
              <button
                onClick={() => {
                  const floor = floors.find(f => f.floor_name === hoveredL1);
                  if (floor?.id != null) { onAddRoom(floor.id); startHide(); }
                }}
                className="flex gap-[8px] items-center cursor-pointer hover:opacity-70 transition-opacity"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V13M3 8H13" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.4" />
                </svg>
                <p className="font-['Inter:Medium',sans-serif] font-medium text-[#0a1e3f] text-[13px]">Add Room</p>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FilterDropdown({ isOpen, onClose, floors }) {
  const [selectedFloors, setSelectedFloors] = useState([]);

  const toggleFloor = (floor) => {
    setSelectedFloors(prev => prev.includes(floor) ? prev.filter(f => f !== floor) : [...prev, floor]);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full mt-[4px] left-[0px] z-50 bg-white rounded-[12px] shadow-[0px_8px_32px_0px_rgba(10,30,63,0.12)] border border-[#e2e2e2] w-[478px]">
      <div className="flex">
        <div className="w-[140px] bg-gradient-to-b from-[#f8f9fb] to-[#f4f7fb]">
          <div className="pt-[16px] px-[16px] pb-[1px] border-b border-[#e2e2e2] h-[49.5px]">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#5c7089] text-[11px] tracking-[1px] uppercase">Categories</p>
          </div>
          <div className="pt-[8px]">
            <button className="w-full h-[45px] flex items-center px-[19px] py-[12px] bg-white shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)] border-l-[3px] border-[#0a1e3f]">
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#0a1e3f] text-[14px]">Floor</p>
            </button>
            <button className="w-full h-[45px] flex items-center px-[19px] py-[12px]">
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[14px]">Rooms</p>
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white">
          <div className="pt-[16px] px-[20px] pb-[1px] border-b border-[#e2e2e2]">
            <div className="bg-[#f4f7fb] h-[41px] rounded-[8px] flex items-center gap-[10px] px-[14px] py-[10px] mb-[16px]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5.4" stroke="#5C7089" strokeWidth="1.26" />
                <path d="M11.7 11.7L14.85 14.85" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.26" />
              </svg>
              <input type="text" placeholder="Search..." className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#5c7089] text-[14px]" />
            </div>
          </div>

          <div className="px-[20px] pt-[12px] pb-[20px] h-[266px] overflow-y-auto">
            <div className="flex flex-col gap-[4px]">
              {floors.length === 0 ? (
                <p className="font-['Inter:Regular',sans-serif] text-[#5c7089] text-[13px] px-[4px] pt-[8px]">No floors yet.</p>
              ) : floors.map((floor) => (
                <button
                  key={floor.id ?? floor.floor_name}
                  onClick={() => toggleFloor(floor.floor_name)}
                  className="h-[41px] rounded-[8px] relative flex items-center hover:bg-[#f4f7fb] transition-colors"
                >
                  <div className={`ml-[12px] size-[18px] rounded-[4px] border ${selectedFloors.includes(floor.floor_name) ? 'bg-[#0a1e3f] border-[#0a1e3f]' : 'bg-white border-[#d0d0d0]'}`}>
                    {selectedFloors.includes(floor.floor_name) && (
                      <svg className="size-full" viewBox="0 0 18 18" fill="none">
                        <path d="M4 9L7.5 12.5L14 6" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    )}
                  </div>
                  <p className="ml-[12px] font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[14px]">{floor.floor_name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#fafbfc] border-t border-[#e2e2e2] px-[20px] py-[16.5px] flex items-center justify-between rounded-b-[12px]">
        <button onClick={() => setSelectedFloors([])} className="flex items-center gap-[8px] cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
          <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[14px]">Clear All</p>
        </button>
        <div className="flex gap-[12px]">
          <button onClick={onClose} className="px-[16px] py-[10px] rounded-[8px] cursor-pointer hover:bg-[#f4f7fb] transition-colors">
            <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[14px]">Cancel</p>
          </button>
          <button onClick={onClose} className="bg-[#0a1e3f] px-[20px] py-[10px] rounded-[8px] cursor-pointer hover:bg-[#0d2851] transition-colors shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[14px]">Apply Filters</p>
          </button>
        </div>
      </div>
    </div>
  );
}


export default function RoomView({ buildingId, floorId, roomId, initialRoomName, onLogout }) {
  const [activeTab, setActiveTab] = useState('Lights');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoomName, setSelectedRoomName] = useState(initialRoomName);
  const [selectedRoomId, setSelectedRoomId] = useState(roomId);
  const [deviceId, setDeviceId] = useState(0);
  const [deviceType, setDeviceType] = useState('knx');
  const [roomsByFloor, setRoomsByFloor] = useState({});
  const { floors, setFloors } = useFloorsList(buildingId);

  useEffect(() => {
    if (!floors.length) return;
    const map = {};
    floors.forEach(floor => {
      const list = MOCK_ROOMS.filter(r => String(r.floor_id) === String(floor.id));
      map[floor.floor_name] = list.map(r => ({ id: r.id, name: r.room_name }));
    });
    setRoomsByFloor(map);
  }, [floors]);

  const [showFloorDrawer, setShowFloorDrawer] = useState(false);
  const [showRoomDrawer, setShowRoomDrawer] = useState(false);
  const [roomDrawerFloorId, setRoomDrawerFloorId] = useState(floorId);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showLightDrawer, setShowLightDrawer] = useState(false);
  const [hasGroups, setHasGroups] = useState(false);
  const [deviceSaving, setDeviceSaving] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupIp, setGroupIp] = useState('');
  const [groupPort, setGroupPort] = useState('');
  const [lightFloorName, setLightFloorName] = useState('');
  const [lightRoomId, setLightRoomId] = useState(0);
  const [lightName, setLightName] = useState('');
  const [lightType, setLightType] = useState('switch');
  const [lightGroupAddr, setLightGroupAddr] = useState('');
  const [lightStateAddr, setLightStateAddr] = useState('');
  const [lightBrightnessAddr, setLightBrightnessAddr] = useState('');
  const [lightBrightnessStateAddr, setLightBrightnessStateAddr] = useState('');
  const [lightSaving, setLightSaving] = useState(false);
  const [lightDeleting, setLightDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [editingLight, setEditingLight] = useState(null);
  const [lights, setLights] = useState([]);
  const [selectedLight, setSelectedLight] = useState(null);
  const [detailSubTab, setDetailSubTab] = useState('Device Info');

  useEffect(() => {
    setHasGroups(false);
    setLights([]);
    setSelectedLight(null);
    setGroupName('');
    setDeviceId(0);
    setDeviceType('knx');

    if (!selectedRoomId || selectedRoomId === 0) return;

    const roomLights = MOCK_LIGHTS.filter(l => String(l.room_id) === String(selectedRoomId));
    if (roomLights.length > 0) {
      setDeviceId(1);
      setDeviceType('knx');
      setGroupName('KNX');
      setHasGroups(true);
      setLights(roomLights);
      setSelectedLight(roomLights[0]);
    }
  }, [selectedRoomId]);

  const tabs = ['Lights', 'Room Details', 'Diagnostics', 'Interfaces', 'Security'];
  const detailSubTabs = ['Device Info', 'Macro', 'Diagnostics', 'Upload Documents'];

  const handleAddRoom = (fId) => {
    setRoomDrawerFloorId(fId);
    setShowRoomDrawer(true);
  };

  const handleFloorSaved = (floor) => {
    setFloors(prev => [...prev, floor]);
    setRoomsByFloor(prev => ({ ...prev, [floor.floor_name]: [] }));
    setShowFloorDrawer(false);
  };

  const handleRoomSaved = (room) => {
    const floor = floors.find(f => String(f.id) === String(room.floor_id));
    if (floor) {
      setRoomsByFloor(prev => ({
        ...prev,
        [floor.floor_name]: [...(prev[floor.floor_name] ?? []), { id: room.id ?? 0, name: room.room_name }],
      }));
    }
    setSelectedRoomName(room.room_name);
    setShowRoomDrawer(false);
  };

  const handleSaveGroup = async () => {
    if (!groupName || !groupIp || !groupPort) return;
    setDeviceSaving(true);
    await new Promise(r => setTimeout(r, 400));
    setDeviceId(1);
    setDeviceType(groupName.toLowerCase());
    setHasGroups(true);
    setShowDrawer(false);
    setGroupIp('');
    setGroupPort('');
    setDeviceSaving(false);
  };

  const closeLightDrawer = () => {
    setShowLightDrawer(false);
    setEditingLight(null);
    setLightFloorName('');
    setLightRoomId(0);
    setLightName('');
    setLightType('switch');
    setLightGroupAddr('');
    setLightStateAddr('');
    setLightBrightnessAddr('');
    setLightBrightnessStateAddr('');
  };

  const openAddDrawer = () => {
    const currentFloor = Object.entries(roomsByFloor).find(([, rooms]) =>
      rooms.some(r => String(r.id) === String(selectedRoomId))
    );
    setLightFloorName(currentFloor?.[0] ?? floors[0]?.floor_name ?? '');
    setLightRoomId(selectedRoomId);
    setShowLightDrawer(true);
  };

  const openEditDrawer = (light) => {
    const floorEntry = Object.entries(roomsByFloor).find(([, rooms]) =>
      rooms.some(r => String(r.id) === String(light.room_id))
    );
    setLightFloorName(floorEntry?.[0] ?? floors[0]?.floor_name ?? '');
    setLightRoomId(light.room_id);
    setEditingLight(light);
    setLightName(light.name);
    setLightType(light.light_type ?? 'switch');
    setLightGroupAddr(light.address);
    setLightStateAddr(light.state_address ?? '');
    setLightBrightnessAddr(light.brightness_address ?? '');
    setLightBrightnessStateAddr(light.brightness_state_address ?? '');
    setShowLightDrawer(true);
  };

  const handleSaveLight = async () => {
    if (!lightName || !lightGroupAddr) return;
    setLightSaving(true);
    await new Promise(r => setTimeout(r, 400));
    if (editingLight) {
      const updated = { ...editingLight, name: lightName, address: lightGroupAddr, state_address: lightStateAddr, light_type: lightType, brightness_address: lightBrightnessAddr, brightness_state_address: lightBrightnessStateAddr };
      setLights(prev => prev.map(l => l.id === editingLight.id ? updated : l));
      setSelectedLight(updated);
    } else {
      const created = { id: nextLightId++, device_id: deviceId, room_id: lightRoomId, domain: 'light', name: lightName, address: lightGroupAddr, state_address: lightStateAddr, light_type: lightType, platform: deviceType, brightness_address: lightBrightnessAddr, brightness_state_address: lightBrightnessStateAddr };
      setLights(prev => [...prev, created]);
      setSelectedLight(created);
    }
    setLightSaving(false);
    closeLightDrawer();
  };

  const handleDeleteLight = async (light) => {
    setLightDeleting(true);
    await new Promise(r => setTimeout(r, 300));
    const remaining = lights.filter(l => l.id !== light.id);
    setLights(remaining);
    setSelectedLight(remaining.length > 0 ? remaining[0] : null);
    setLightDeleting(false);
  };

  const handleExportConfig = async () => {
    setExporting(true);
    setExportSuccess(false);
    await new Promise(r => setTimeout(r, 800));
    setExporting(false);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="bg-white flex flex-col size-full overflow-hidden">
      <TopNav onLogout={onLogout} onExportConfig={handleExportConfig} exporting={exporting} />

      <div className="flex flex-1 overflow-visible relative">
        <Sidebar
          floors={floors}
          roomsByFloor={roomsByFloor}
          selectedRoomName={selectedRoomName}
          onRoomSelect={(name, id) => { setSelectedRoomName(name); setSelectedRoomId(id); }}
          onAddRoom={handleAddRoom}
          onAddFloor={() => setShowFloorDrawer(true)}
        />

        <div className="bg-[#f4f7fb] flex-1 flex flex-col gap-[10px] pb-[24px] pt-[14px] px-[40px] relative overflow-y-auto">
          <div className="absolute left-0 top-0 size-[20px] pointer-events-none">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <path d="M20 0C8.95431 0 0 8.95431 0 20V0H20Z" fill="white" />
            </svg>
          </div>

          <div className="flex gap-[12px] items-center relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white h-[36px] rounded-[4px] w-[110px] border border-[#e2e2e2] flex gap-[8px] items-center px-[12px] cursor-pointer hover:bg-[#f4f7fb] transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 5H17M5.5 10H14.5M8 15H12" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.4" />
              </svg>
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#0a1e3f] text-[14px]">Filters</p>
            </button>

            <div className="bg-white h-[36px] rounded-[4px] w-[260px] border border-[#e2e2e2] flex gap-[8px] items-center px-[12px]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6" stroke="#5C7089" strokeWidth="1.4" />
                <path d="M13 13L16.5 16.5" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" />
              </svg>
              <input type="text" placeholder="Search" className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#5c7089] text-[14px]" />
            </div>

            <FilterDropdown isOpen={showFilters} onClose={() => setShowFilters(false)} floors={floors} />
          </div>

          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0a1e3f] text-[22px] tracking-[-0.44px]">
            {selectedRoomName || 'Select a room'}
          </p>

          <div className="flex items-end h-[32px] w-full relative mb-[-1px] z-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex ${tab === 'Lights' ? 'gap-[6px]' : ''} items-center justify-center h-full pr-[20px] cursor-pointer border-b-2 ${activeTab === tab ? 'border-[#0a1e3f]' : 'border-transparent'}`}
              >
                <p className={`font-['Inter:${activeTab === tab ? 'Semi_Bold' : 'Regular'}',sans-serif] ${activeTab === tab ? 'font-semibold text-[#0a1e3f]' : 'font-normal text-[#5c7089]'} text-[14px] whitespace-nowrap`}>
                  {tab}
                </p>
                {tab === 'Lights' && (
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M5 8L10 12L15 8" stroke="#0A1E3F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          <div className="bg-[#e2e2e2] h-px w-full" />

          {!hasGroups ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col gap-[32px] items-center">
                <div className="relative rounded-[4px] size-[96px]">
                  <div className="flex items-center justify-center h-full border-[1.5px] border-dashed border-[#e2e2e2] rounded-[4px]">
                    <p className="font-['Inter:Regular',sans-serif] font-normal text-[#5c7089] text-[11px] tracking-[2.2px]">icon</p>
                  </div>
                </div>
                <div className="flex flex-col gap-[16px] items-center text-center w-[560px]">
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0a1e3f] text-[40px] tracking-[-0.8px]">Start with a group.</p>
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[#5c7089] text-[16px] leading-[1.5]">Groups organize devices by protocol. Add one to begin connecting lights.</p>
                </div>
                <button
                  onClick={() => setShowDrawer(true)}
                  className="bg-[#0a1e3f] flex gap-[10px] h-[48px] items-center justify-center px-[24px] rounded-[4px] cursor-pointer hover:bg-[#0d2851] transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4V16M4 10H16" stroke="white" strokeLinecap="round" strokeWidth="1.6" />
                  </svg>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[15px] tracking-[0.15px]">Add Group</p>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 gap-[24px] items-stretch w-full min-h-0">
              <div className="bg-white rounded-[4px] w-[320px] border border-[#e2e2e2] flex flex-col">
                <div className="bg-[#f4f7fb] h-[56px] flex items-center justify-between px-[20px] py-[16px]">
                  <div className="flex gap-[8px] items-center">
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0a1e3f] text-[18px] tracking-[-0.18px]">{groupName}</p>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 8L10 12L15 8" stroke="#0A1E3F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
                    </svg>
                  </div>
                  <div className="size-[32px] flex items-center justify-center cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="5" cy="10" r="1.5" stroke="#5C7089" strokeWidth="0.5" />
                      <circle cx="10" cy="10" r="1.5" stroke="#5C7089" strokeWidth="0.5" />
                      <circle cx="15" cy="10" r="1.5" stroke="#5C7089" strokeWidth="0.5" />
                    </svg>
                  </div>
                </div>

                <div className="bg-white h-[48px] flex items-center justify-between px-[20px] py-[14px]">
                  <p className="font-['Inter:Medium',sans-serif] font-medium text-[#0a1e3f] text-[13px]">All Lights</p>
                  <div className="flex gap-[6px] items-center">
                    <p className="font-['Inter:Regular',sans-serif] text-[#5c7089] text-[13px]">Unassigned</p>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 8L10 12L15 8" stroke="#5C7089" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
                    </svg>
                  </div>
                </div>

                <div className="bg-[#e2e2e2] h-px w-full" />

                <div className="flex-1 overflow-y-auto">
                  {lights.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center px-[24px] py-[40px] h-full">
                      <p className="font-['Inter:Medium',sans-serif] font-medium text-[#0a1e3f] text-[16px] mb-[12px]">No lights yet.</p>
                      <p className="font-['Inter:Regular',sans-serif] text-[#5c7089] text-[13px] leading-[1.4]">Add your first light to get started.</p>
                    </div>
                  ) : (
                    lights.map((light) => (
                      <button
                        key={light.id}
                        onClick={() => setSelectedLight(light)}
                        className={`h-[60px] w-full flex items-center justify-between px-[20px] py-[12px] cursor-pointer hover:bg-[#f4f7fb] transition-colors ${selectedLight?.id === light.id ? 'bg-[#f4f7fb]' : 'bg-white'}`}
                      >
                        <div className="flex gap-[12px] items-center">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="7" r="3" stroke="#5C7089" strokeWidth="1.4" />
                            <path d="M10 10V13" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" />
                            <path d="M9 13V16.5M11 13V16.5" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" />
                          </svg>
                          <div className="flex flex-col gap-[2px] items-start">
                            <p className={`font-['Inter:${selectedLight?.id === light.id ? 'Medium' : 'Regular'}',sans-serif] ${selectedLight?.id === light.id ? 'font-medium' : 'font-normal'} text-[#0a1e3f] text-[14px]`}>{light.name}</p>
                            <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[10px] tracking-[2px]">{(light.light_type || 'switch').toUpperCase()}</p>
                          </div>
                        </div>
                        <p className="font-['Inter:Regular',sans-serif] text-[#5c7089] text-[13px]">
                          {Object.values(roomsByFloor).flat().find(r => String(r.id) === String(light.room_id))?.name ?? '—'}
                        </p>
                      </button>
                    ))
                  )}
                </div>

                <div className="bg-white px-[20px] pt-[16px] pb-[20px] flex justify-end">
                  <button
                    onClick={openAddDrawer}
                    className="bg-[#0a1e3f] h-[48px] rounded-[4px] flex gap-[10px] items-center justify-center px-[24px] cursor-pointer hover:bg-[#0d2851] transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 4V16M4 10H16" stroke="white" strokeLinecap="round" strokeWidth="1.6" />
                    </svg>
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[15px] tracking-[0.15px]">Add New Light</p>
                  </button>
                </div>
              </div>

              <div className="bg-white flex-1 rounded-[4px] border border-[#e2e2e2] flex flex-col overflow-hidden">
                {selectedLight ? (
                  <>
                    <div className="h-[100px] flex items-center justify-between px-[32px] py-[28px]">
                      <div className="flex gap-[20px] items-center">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                          <circle cx="20" cy="14" r="6" stroke="#5C7089" strokeWidth="2" />
                          <path d="M20 20V26" stroke="#5C7089" strokeLinecap="round" strokeWidth="2" />
                          <path d="M18 26V33M22 26V33" stroke="#5C7089" strokeLinecap="round" strokeWidth="2" />
                        </svg>
                        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0a1e3f] text-[32px] tracking-[-0.64px]">{selectedLight.name}</p>
                      </div>
                      <div className="flex gap-[8px] items-center">
                        <button onClick={() => openEditDrawer(selectedLight)} className="size-[40px] flex items-center justify-center rounded-[4px] cursor-pointer hover:bg-[#f4f7fb] transition-colors" title="Edit light">
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                            <path d="M14.5 2.5L17.5 5.5L7 16H4V13L14.5 2.5Z" stroke="#5C7089" strokeLinejoin="round" strokeWidth="1.4" />
                          </svg>
                        </button>
                        <button onClick={() => handleDeleteLight(selectedLight)} disabled={lightDeleting} className="size-[40px] flex items-center justify-center rounded-[4px] cursor-pointer hover:bg-[#fff0f0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Delete light">
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                            <path d="M4 6H16M8 6V4H12V6M7 6V16H13V6H7Z" stroke="#e05252" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="h-[48px] px-[32px] flex items-start">
                      {detailSubTabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setDetailSubTab(tab)}
                          className="flex flex-col gap-[8px] h-[48px] items-center justify-end pt-[12px] px-[20px] cursor-pointer"
                        >
                          <p className={`font-['Inter:${detailSubTab === tab ? 'Semi_Bold' : 'Regular'}',sans-serif] ${detailSubTab === tab ? 'font-semibold text-[#0a1e3f]' : 'font-normal text-[#5c7089]'} text-[14px]`}>{tab}</p>
                          {detailSubTab === tab && <div className="bg-[#0a1e3f] h-[2px] w-full" />}
                        </button>
                      ))}
                    </div>

                    <div className="bg-[#e2e2e2] h-px w-full" />

                    {detailSubTab === 'Device Info' && (
                      <div className="flex-1 overflow-y-auto px-[32px] py-[28px]">
                        <div className="flex flex-col gap-[24px]">
                          {(() => {
                            const floorEntry = Object.entries(roomsByFloor).find(([, rooms]) =>
                              rooms.some(r => String(r.id) === String(selectedLight.room_id))
                            );
                            const floorName = floorEntry?.[0] ?? '';
                            const floorRoomsList = roomsByFloor[floorName] ?? [];
                            return (
                              <div className="flex gap-[24px] w-full">
                                <div className="flex-1 flex flex-col gap-[8px]">
                                  <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">FLOOR</p>
                                  <div className="bg-[#f4f7fb] h-[44px] rounded-[4px] flex items-center px-[16px]">
                                    <select value={floorName} disabled className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px] cursor-default">
                                      {floors.map(f => <option key={f.id ?? f.floor_name} value={f.floor_name}>{f.floor_name}</option>)}
                                    </select>
                                  </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-[8px]">
                                  <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">ROOM</p>
                                  <div className="bg-[#f4f7fb] h-[44px] rounded-[4px] flex items-center px-[16px]">
                                    <select value={String(selectedLight.room_id)} disabled className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px] cursor-default">
                                      {floorRoomsList.map(r => <option key={r.id} value={String(r.id)}>{r.name}</option>)}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          <div className="flex gap-[24px] w-full">
                            <div className="flex-1 flex flex-col gap-[8px]">
                              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">NAME</p>
                              <p className="font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px]">{selectedLight.name}</p>
                            </div>
                            <div className="flex-1 flex flex-col gap-[8px]">
                              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">LIGHT TYPE</p>
                              <p className="font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px] capitalize">{selectedLight.light_type}</p>
                            </div>
                          </div>

                          <div className="flex gap-[24px] w-full">
                            <div className="flex-1 flex flex-col gap-[8px]">
                              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">ADDRESS</p>
                              <p className="font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px]">{selectedLight.address}</p>
                            </div>
                            <div className="flex-1 flex flex-col gap-[8px]">
                              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">STATE ADDRESS</p>
                              <p className="font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px]">{selectedLight.state_address || '—'}</p>
                            </div>
                          </div>

                          {selectedLight.light_type === 'dimmer' && (
                            <div className="flex gap-[24px] w-full">
                              <div className="flex-1 flex flex-col gap-[8px]">
                                <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">BRIGHTNESS ADDRESS</p>
                                <p className="font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px]">{selectedLight.brightness_address || '—'}</p>
                              </div>
                              <div className="flex-1 flex flex-col gap-[8px]">
                                <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">BRIGHTNESS STATE ADDRESS</p>
                                <p className="font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px]">{selectedLight.brightness_state_address || '—'}</p>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-[24px] w-full">
                            <div className="flex-1 flex flex-col gap-[8px]">
                              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">PLATFORM</p>
                              <p className="font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px]">{selectedLight.platform}</p>
                            </div>
                            <div className="flex-1" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="px-[32px] py-[28px] flex justify-end">
                      <button className="bg-[#5c7089] h-[48px] rounded-[4px] px-[32px] flex items-center justify-center cursor-pointer hover:bg-[#4a5a6e] transition-colors">
                        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[15px] tracking-[0.15px]">Save</p>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col gap-[12px] items-center text-center">
                      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0a1e3f] text-[18px] tracking-[-0.18px]">No light selected</p>
                      <p className="font-['Inter:Regular',sans-serif] text-[#5c7089] text-[14px] leading-[1.4]">Add a light from the left panel to view its details here.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {exportSuccess && (
        <div className="fixed bottom-[28px] right-[28px] z-[100] flex items-center gap-[12px] bg-[#0a1e3f] text-white px-[20px] py-[14px] rounded-[8px] shadow-[0px_8px_24px_rgba(10,30,63,0.24)]">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8.5" stroke="#4ade80" strokeWidth="1.4" />
            <path d="M6.5 10L9 12.5L13.5 7.5" stroke="#4ade80" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
          </svg>
          <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px]">Config exported successfully</p>
        </div>
      )}

      <FloorDrawer
        isOpen={showFloorDrawer}
        onClose={() => setShowFloorDrawer(false)}
        buildingId={buildingId}
        onSave={handleFloorSaved}
      />

      <RoomDrawer
        isOpen={showRoomDrawer}
        onClose={() => setShowRoomDrawer(false)}
        floorId={roomDrawerFloorId}
        onSave={handleRoomSaved}
      />

      {(showDrawer || showLightDrawer) && (
        <div
          onClick={() => { setShowDrawer(false); closeLightDrawer(); }}
          className="absolute inset-0 bg-[rgba(10,30,63,0.6)] z-40"
        />
      )}

      {showDrawer && (
        <div className="absolute right-0 top-0 h-full w-[520px] bg-white shadow-[-8px_0px_24px_0px_rgba(10,30,63,0.12)] z-50 flex flex-col">
          <div className="bg-white flex h-[80px] items-center justify-between pl-[28px] pr-[20px]">
            <div className="flex flex-col gap-[4px]">
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">GROUPS — NEW</p>
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0a1e3f] text-[22px] tracking-[-0.44px]">Add Group</p>
            </div>
            <button onClick={() => setShowDrawer(false)} className="bg-[#f4f7fb] flex items-center justify-center rounded-[4px] size-[40px] cursor-pointer hover:bg-[#e2e2e2] transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5L15 15M15 5L5 15" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.4" />
              </svg>
            </button>
          </div>

          <div className="bg-[#e2e2e2] h-px w-full" />

          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-[14px] p-[28px]">
              <div className="flex gap-[10px] items-center">
                <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">01</p>
                <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">GROUP DETAILS</p>
              </div>
              <div className="bg-white rounded-[4px] border border-[#e2e2e2]">
                <div className="flex flex-col gap-[20px] px-[24px] py-[28px]">
                  <div className="flex flex-col gap-[8px] w-full">
                    <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">*GROUP NAME</p>
                    <div className="bg-[#f4f7fb] h-[48px] rounded-[4px] flex items-center px-[16px]">
                      <input type="text" placeholder="e.g. KNX" value={groupName} onChange={(e) => setGroupName(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#5c7089] text-[15px]" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-[8px] w-full">
                    <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">*IP ADDRESS</p>
                    <div className="bg-[#f4f7fb] h-[48px] rounded-[4px] flex items-center px-[16px]">
                      <input type="text" placeholder="e.g. 192.168.1.100" value={groupIp} onChange={(e) => setGroupIp(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px] placeholder:text-[#5c7089]" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-[8px] w-full">
                    <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">*PORT</p>
                    <div className="bg-[#f4f7fb] h-[48px] rounded-[4px] flex items-center justify-between px-[16px]">
                      <input type="text" inputMode="numeric" placeholder="e.g. 5004" value={groupPort} maxLength={5} onChange={(e) => setGroupPort(e.target.value.replace(/\D/g, ''))} className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px] placeholder:text-[#5c7089]" />
                      <p className="font-['Inter:Regular',sans-serif] text-[#5c7089] text-[12px] shrink-0">{groupPort.length}/5</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[8px] w-full">
                    <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">DESCRIPTION</p>
                    <div className="bg-[#f4f7fb] h-[96px] rounded-[4px] flex items-start px-[16px] py-[14px]">
                      <textarea placeholder="Optional notes about this group" className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#5c7089] text-[15px] resize-none" rows={3} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col h-[80px]">
            <div className="bg-[#e2e2e2] h-px w-full" />
            <div className="bg-white flex-1 flex items-center justify-end gap-[8px] px-[28px] py-[16px]">
              <button onClick={() => setShowDrawer(false)} className="flex h-[48px] items-center justify-center px-[24px] rounded-[4px] cursor-pointer hover:bg-[#f4f7fb] transition-colors">
                <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[15px]">Cancel</p>
              </button>
              <button onClick={handleSaveGroup} disabled={deviceSaving} className="bg-[#0a1e3f] flex h-[48px] items-center justify-center px-[32px] rounded-[4px] cursor-pointer hover:bg-[#0d2851] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[15px] tracking-[0.15px]">{deviceSaving ? 'Saving…' : 'Save'}</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {showLightDrawer && (
        <div className="absolute right-0 top-0 h-full w-[520px] bg-white shadow-[-8px_0px_24px_0px_rgba(10,30,63,0.12)] z-50 flex flex-col">
          <div className="bg-white flex h-[80px] items-center justify-between pl-[28px] pr-[20px]">
            <div className="flex flex-col gap-[4px]">
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">{editingLight ? 'LIGHTS — EDIT' : 'LIGHTS — NEW'}</p>
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#0a1e3f] text-[22px] tracking-[-0.44px]">{editingLight ? 'Edit Light' : 'Add Light'}</p>
            </div>
            <button onClick={closeLightDrawer} className="bg-[#f4f7fb] flex items-center justify-center rounded-[4px] size-[40px] cursor-pointer hover:bg-[#e2e2e2] transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5L15 15M15 5L5 15" stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.4" />
              </svg>
            </button>
          </div>

          <div className="bg-[#e2e2e2] h-px w-full" />

          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-[14px] p-[28px]">
              <div className="flex gap-[10px] items-center">
                <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">01</p>
                <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">LIGHT DETAILS</p>
              </div>
              <div className="bg-white rounded-[4px] border border-[#e2e2e2]">
                <div className="flex flex-col gap-[20px] px-[24px] py-[28px]">

                  <div className="flex flex-col gap-[8px] w-full">
                    <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">*FLOOR</p>
                    <div className="bg-[#f4f7fb] h-[48px] rounded-[4px] flex items-center px-[16px]">
                      <select value={lightFloorName} onChange={(e) => { setLightFloorName(e.target.value); const rooms = roomsByFloor[e.target.value] ?? []; setLightRoomId(rooms[0]?.id ?? 0); }} className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px] cursor-pointer">
                        <option value="">Select floor</option>
                        {floors.map(f => <option key={f.id ?? f.floor_name} value={f.floor_name}>{f.floor_name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[8px] w-full">
                    <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">*ROOM</p>
                    <div className="bg-[#f4f7fb] h-[48px] rounded-[4px] flex items-center px-[16px]">
                      <select value={lightRoomId} onChange={(e) => setLightRoomId(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px] cursor-pointer">
                        <option value="">Select room</option>
                        {(roomsByFloor[lightFloorName] ?? []).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[8px] w-full">
                    <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">*NAME</p>
                    <div className="bg-[#f4f7fb] h-[48px] rounded-[4px] flex items-center px-[16px]">
                      <input type="text" placeholder="e.g. Floor lamp" value={lightName} onChange={(e) => setLightName(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px] placeholder:text-[#5c7089]" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-[8px] w-full">
                    <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">*LIGHT TYPE</p>
                    <div className="bg-[#f4f7fb] h-[48px] rounded-[4px] flex items-center px-[16px]">
                      <select value={lightType} onChange={(e) => setLightType(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px] cursor-pointer">
                        <option value="switch">Switch</option>
                        <option value="dimmer">Dimmer</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[8px] w-full">
                    <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">*ADDRESS</p>
                    <div className="bg-[#f4f7fb] h-[48px] rounded-[4px] flex items-center px-[16px]">
                      <input type="text" placeholder="e.g. 1/1/1" value={lightGroupAddr} onChange={(e) => setLightGroupAddr(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px] placeholder:text-[#5c7089]" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-[8px] w-full">
                    <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">STATE ADDRESS</p>
                    <div className="bg-[#f4f7fb] h-[48px] rounded-[4px] flex items-center px-[16px]">
                      <input type="text" placeholder="e.g. 2/1/2" value={lightStateAddr} onChange={(e) => setLightStateAddr(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px] placeholder:text-[#5c7089]" />
                    </div>
                  </div>

                  {lightType === 'dimmer' && (
                    <>
                      <div className="flex flex-col gap-[8px] w-full">
                        <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">BRIGHTNESS ADDRESS</p>
                        <div className="bg-[#f4f7fb] h-[48px] rounded-[4px] flex items-center px-[16px]">
                          <input type="text" placeholder="e.g. 3/1/2" value={lightBrightnessAddr} onChange={(e) => setLightBrightnessAddr(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px] placeholder:text-[#5c7089]" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-[8px] w-full">
                        <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[11px] tracking-[2.2px]">BRIGHTNESS STATE ADDRESS</p>
                        <div className="bg-[#f4f7fb] h-[48px] rounded-[4px] flex items-center px-[16px]">
                          <input type="text" placeholder="e.g. 4/3/2" value={lightBrightnessStateAddr} onChange={(e) => setLightBrightnessStateAddr(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] text-[#0a1e3f] text-[15px] placeholder:text-[#5c7089]" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col h-[80px]">
            <div className="bg-[#e2e2e2] h-px w-full" />
            <div className="bg-white flex-1 flex items-center justify-end gap-[8px] px-[28px] py-[16px]">
              <button onClick={closeLightDrawer} className="flex h-[48px] items-center justify-center px-[24px] rounded-[4px] cursor-pointer hover:bg-[#f4f7fb] transition-colors">
                <p className="font-['Inter:Medium',sans-serif] font-medium text-[#5c7089] text-[15px]">Cancel</p>
              </button>
              <button onClick={handleSaveLight} disabled={lightSaving} className="bg-[#0a1e3f] flex h-[48px] items-center justify-center px-[32px] rounded-[4px] cursor-pointer hover:bg-[#0d2851] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[15px] tracking-[0.15px]">{lightSaving ? 'Saving…' : editingLight ? 'Update Light' : 'Save Light'}</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
