import { TopNav, LeftNav } from '../shared/SharedNav';
import RolesPage from '../roles-permissions/RolesPage';

export default function SIRolesPage() {
  return (
    <div className="bg-white h-screen flex flex-col">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <main className="bg-[#f4f7fb] flex-1 overflow-auto">
          <RolesPage />
        </main>
      </div>
    </div>
  );
}
