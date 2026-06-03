import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Settings, LogOut } from 'lucide-react';
import svgPaths from './assets/svg-members';
import imgWeOkasLogo from '../../../assets/weOkasLogo.png';
import imgAvatar from '../../../assets/avatar.png';

export function TopNav() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/auth/login');
  };

  return (
    <div className="bg-white flex gap-[32px] h-[72px] items-center px-[32px] shrink-0 w-full border-b border-[#f0f0f0]">
      <div className="h-[21px] relative shrink-0 w-[140px]">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgWeOkasLogo} />
      </div>
      <div className="flex-1 h-px min-w-px relative" />

      <div className="bg-[#f4f7fb] flex gap-[12px] h-[44px] items-center px-[16px] rounded-[4px] shrink-0 w-[480px]">
        <div className="relative shrink-0 size-[20px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p204aec00} stroke="#5C7089" strokeWidth="1.4" />
            <path d="M13 13L16.5 16.5" stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" />
          </svg>
        </div>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none text-[#5c7089] text-[15px] whitespace-nowrap">Search</p>
      </div>

      <div className="flex-1 h-px min-w-px relative" />

      <div className="flex gap-[20px] items-center shrink-0">
        {/* Notification bell */}
        <div className="flex items-center justify-center shrink-0 size-[40px]">
          <div className="relative shrink-0 size-[20px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <path d={svgPaths.p100568f2} stroke="#0A1E3F" strokeLinejoin="round" strokeWidth="1.4" />
              <path d={svgPaths.p3c26a500} stroke="#0A1E3F" strokeLinecap="round" strokeWidth="1.4" />
            </svg>
          </div>
        </div>

        {/* Avatar with custom dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="shrink-0 size-[40px] cursor-pointer rounded-full hover:opacity-80 transition-opacity outline-none overflow-hidden border-0 block"
          >
            <img
              alt="User avatar"
              className="block size-full rounded-full object-cover"
              src={imgAvatar}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.style.background = '#0a1e3f';
              }}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-[48px] bg-white rounded-[8px] p-[8px] shadow-[0px_8px_32px_0px_rgba(10,30,63,0.12)] border border-[#e2e2e2] min-w-[200px] z-50">
              <button
                onClick={() => setDropdownOpen(false)}
                className="w-full px-[16px] py-[12px] text-[14px] text-[#0a1e3f] rounded-[4px] hover:bg-[#f4f7fb] font-['Inter:Regular',sans-serif] flex items-center gap-[12px] text-left"
              >
                <Settings size={16} />
                Profile Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-[16px] py-[12px] text-[14px] text-red-600 rounded-[4px] hover:bg-[#f4f7fb] font-['Inter:Regular',sans-serif] flex items-center gap-[12px] text-left"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function LeftNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: svgPaths.p1727a280, iconPath2: 'M8 17V11H12V17' },
    { name: 'Members', path: '/members', icon: svgPaths.p24173080, iconPath2: svgPaths.p3b33b100, iconPath3: svgPaths.p31ebc400, iconPath4: svgPaths.pdb4f300 },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white flex flex-col gap-[4px] h-full items-start px-[16px] py-[24px] shrink-0 w-[240px] border-r border-[#f0f0f0]">
      <div className="flex flex-col gap-[4px] items-start w-full">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`${isActive(item.path) ? 'bg-[#f4f7fb]' : ''} h-[44px] rounded-[4px] shrink-0 w-full hover:bg-[#f4f7fb] transition-colors`}
          >
            <div className="flex flex-row items-center rounded-[inherit] size-full">
              <div className="flex gap-[12px] items-center p-[12px] size-full">
                <div className="relative shrink-0 size-[20px]">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                    <path d={item.icon} stroke={isActive(item.path) ? '#0A1E3F' : '#5C7089'} strokeLinejoin="round" strokeWidth="1.4" />
                    {item.iconPath2 && <path d={item.iconPath2} stroke={isActive(item.path) ? '#0A1E3F' : '#5C7089'} strokeLinejoin="round" strokeWidth="1.4" />}
                    {item.iconPath3 && <path d={item.iconPath3} stroke={isActive(item.path) ? '#0A1E3F' : '#5C7089'} strokeLinecap="round" strokeWidth={item.name === 'Roles & Permissions' ? '1.2' : '1.4'} />}
                    {item.iconPath4 && <path d={item.iconPath4} stroke={isActive(item.path) ? '#0A1E3F' : '#5C7089'} strokeLinecap="round" strokeWidth="1.4" />}
                  </svg>
                </div>
                <p className={`font-['Inter:${isActive(item.path) ? 'Medium' : 'Regular'}',sans-serif] ${isActive(item.path) ? 'font-medium text-[#0a1e3f]' : 'font-normal text-[#5c7089]'} leading-[1.4] text-[14px] whitespace-nowrap`}>
                  {item.name}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-px w-px" />

      <button className="h-[44px] rounded-[4px] shrink-0 w-full hover:bg-[#f4f7fb] transition-colors">
        <div className="flex flex-row items-center rounded-[inherit] size-full">
          <div className="flex gap-[12px] items-center p-[12px] size-full">
            <div className="relative shrink-0 size-[20px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                <path d={svgPaths.p30c3b00} stroke="#5C7089" strokeWidth="1.4" />
                <path d={svgPaths.p9455c00} stroke="#5C7089" strokeLinecap="round" strokeWidth="1.4" />
                <path d={svgPaths.p23f7d5f0} fill="#5C7089" />
              </svg>
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] text-[#5c7089] text-[14px] whitespace-nowrap">Help</p>
          </div>
        </div>
      </button>
    </div>
  );
}
