import { TopNav, LeftNav } from '../shared/SharedNav';
import RolesPage from '../roles-permissions/RolesPage';

const DISTRIBUTOR_MODULES = [
  {
    id: 'members',
    label: 'Members',
    type: 'checkbox',
    options: [
      { id: 'view',   label: 'View Members'   },
      { id: 'create', label: 'Add Members'    },
      { id: 'edit',   label: 'Edit Members'   },
      { id: 'delete', label: 'Delete Members' },
    ],
  },
  {
    id: 'system_integrators',
    label: 'System Integrators',
    type: 'checkbox',
    options: [
      { id: 'view',   label: 'View System Integrators'   },
      { id: 'create', label: 'Add System Integrators'    },
      { id: 'edit',   label: 'Edit System Integrators'   },
      { id: 'delete', label: 'Delete System Integrators' },
    ],
  },
];

export default function DistributorRolesPage() {
  return (
    <div className="bg-white h-screen flex flex-col">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <main className="bg-[#f4f7fb] flex-1 overflow-auto">
          <RolesPage modules={DISTRIBUTOR_MODULES} />
        </main>
      </div>
    </div>
  );
}
