import { useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardPage from './buildings/DashboardPage';
import AreaEmptyState from './rooms/AreaEmptyState';
import RoomView from './rooms/RoomView';

const ls = {
  get: (key) => localStorage.getItem(key) ?? '',
  set: (key, val) => localStorage.setItem(key, val),
  remove: (...keys) => keys.forEach(k => localStorage.removeItem(k)),
};

export default function DesignStudioApp() {
  const { buildingId: buildingIdParam } = useParams();
  const [screen, setScreen] = useState(() => (buildingIdParam ? 'dashboard' : ls.get('ds_screen') || 'dashboard'));
  const [buildingId, setBuildingId] = useState(() => buildingIdParam || ls.get('ds_buildingId'));
  const [buildingType, setBuildingType] = useState(() => ls.get('ds_buildingType'));
  const [floorId, setFloorId] = useState(() => ls.get('ds_floorId') || 0);
  const [roomId, setRoomId] = useState(() => ls.get('ds_roomId') || 0);
  const [roomName, setRoomName] = useState(() => ls.get('ds_roomName') || '');

  const handleProjectSelected = (bId, bType) => {
    ls.set('ds_buildingId', bId);
    ls.set('ds_buildingType', bType);
    ls.set('ds_screen', 'area');
    setBuildingId(bId);
    setBuildingType(bType);
    setScreen('area');
  };

  const handleRoomCreated = (fId, rId, rName) => {
    ls.set('ds_floorId', String(fId));
    ls.set('ds_roomId', String(rId));
    ls.set('ds_roomName', rName);
    ls.set('ds_screen', 'room');
    setFloorId(fId);
    setRoomId(rId);
    setRoomName(rName);
    setScreen('room');
  };

  const handleLogout = () => {
    ls.remove('ds_screen', 'ds_buildingId', 'ds_buildingType', 'ds_floorId', 'ds_roomId', 'ds_roomName');
    setScreen('dashboard');
  };

  if (screen === 'area') {
    return (
      <div className="h-screen w-full overflow-hidden">
        <AreaEmptyState
          buildingId={buildingId}
          buildingType={buildingType}
          onRoomCreated={handleRoomCreated}
        />
      </div>
    );
  }

  if (screen === 'room') {
    return (
      <div className="h-screen w-full overflow-hidden">
        <RoomView
          buildingId={buildingId}
          floorId={floorId}
          roomId={roomId}
          initialRoomName={roomName}
          authToken=""
          onLogout={handleLogout}
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden">
      <DashboardPage buildingId={buildingIdParam} onProjectSelected={handleProjectSelected} />
    </div>
  );
}
