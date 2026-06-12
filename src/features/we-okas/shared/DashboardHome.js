import { TopNav, LeftNav } from './SharedNav';
import useAuthStore from '../../auth/authStore';

const ROLE_CONFIG = {
  distributor: {
    label:    'Distributor Portal',
    greeting: 'Distributor Dashboard',
    subtitle: 'Manage your system integrators, projects, and team from one place.',
    stats: [
      { title: 'System Integrators', value: '—' },
      { title: 'Active Projects',    value: '—' },
      { title: 'Members',            value: '—' },
      { title: 'Pending Tasks',      value: '—' },
    ],
  },
  si: {
    label:    'System Integrator Portal',
    greeting: 'SI Dashboard',
    subtitle: 'Track your projects, manage team members and permissions.',
    stats: [
      { title: 'Active Projects', value: '—' },
      { title: 'Members',         value: '—' },
      { title: 'Roles Assigned',  value: '—' },
      { title: 'Open Tickets',    value: '—' },
    ],
  },
  pm: {
    label:    'Project Manager Portal',
    greeting: 'PM Dashboard',
    subtitle: 'Overview of your projects and team activity.',
    stats: [
      { title: 'Projects',      value: '—' },
      { title: 'Members',       value: '—' },
      { title: 'In Progress',   value: '—' },
      { title: 'Completed',     value: '—' },
    ],
  },
  user: {
    label:    'User Portal',
    greeting: 'My Dashboard',
    subtitle: 'View your assigned projects and activity.',
    stats: [
      { title: 'My Projects',  value: '—' },
      { title: 'In Progress',  value: '—' },
      { title: 'Completed',    value: '—' },
      { title: 'Pending',      value: '—' },
    ],
  },
};

const FALLBACK = ROLE_CONFIG.pm;

export default function DashboardHome() {
  const user = useAuthStore((s) => s.user);
  const config = ROLE_CONFIG[user?.role] ?? FALLBACK;

  return (
    <div className="bg-white flex flex-col h-screen w-full overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <div className="bg-[#f4f7fb] flex-1 overflow-y-auto px-[40px] py-[32px]">

          {/* Header */}
          <div className="flex flex-col gap-[6px] mb-[36px]">
            <p className="text-[12px] font-medium text-[#5c7089] tracking-[2.4px] uppercase"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              {config.label}
            </p>
            <p className="text-[40px] font-semibold text-[#0a1e3f] tracking-[-0.8px] leading-[1.1]"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              {config.greeting}
            </p>
            <p className="text-[15px] text-[#5c7089] mt-[4px]"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              {config.subtitle}
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[20px] mb-[40px]">
            {config.stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-white rounded-[8px] border border-[#e2e2e2] px-[24px] py-[20px] flex flex-col gap-[8px]"
              >
                <p className="text-[11px] font-medium text-[#5c7089] tracking-[1.6px] uppercase"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {stat.title}
                </p>
                <p className="text-[32px] font-semibold text-[#0a1e3f] tracking-[-0.8px] leading-none"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Coming soon notice */}
          <div className="bg-white rounded-[8px] border border-[#e2e2e2] px-[24px] py-[20px] flex items-center gap-[12px]">
            <div className="size-[8px] rounded-full bg-[#5c7089] shrink-0" />
            <p className="text-[14px] text-[#5c7089]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Full dashboard analytics and activity feed coming soon.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
