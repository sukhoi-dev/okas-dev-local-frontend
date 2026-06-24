import P from '../../../rbac/permissions';
import { ROUTE_PATHS } from '../../../config/constants';
import ApartmentIcon     from '@mui/icons-material/Apartment';
import BoltIcon          from '@mui/icons-material/Bolt';
import MovieFilterIcon   from '@mui/icons-material/MovieFilter';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RouterIcon        from '@mui/icons-material/Router';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';

const designStudioNav = [
  { key: 'buildings',    label: 'Buildings',      path: ROUTE_PATHS.DS_BUILDINGS,     icon: ApartmentIcon,          permission: P.BUILDINGS_VIEW  },
  { key: 'automation',   label: 'Automation',     path: ROUTE_PATHS.DS_AUTOMATION,    icon: BoltIcon,               permission: P.AUTOMATION_VIEW },
  { key: 'scenes',       label: 'Scenes',         path: ROUTE_PATHS.DS_SCENES,        icon: MovieFilterIcon,        permission: P.SCENES_VIEW     },
  { key: 'scheduling',   label: 'Scheduling',     path: ROUTE_PATHS.DS_SCHEDULING,    icon: CalendarMonthIcon,      permission: P.SCHEDULING_VIEW },
  { key: 'mqtt',         label: 'MQTT',           path: ROUTE_PATHS.DS_MQTT,          icon: RouterIcon,             permission: P.MQTT_VIEW       },
  { key: 'layout-config',label: 'Layout Config',  path: ROUTE_PATHS.DS_LAYOUT_CONFIG, icon: DashboardCustomizeIcon, permission: P.LAYOUT_VIEW     },
];

export default designStudioNav;
