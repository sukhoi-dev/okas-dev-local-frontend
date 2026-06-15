import P from '../../../rbac/permissions';
import { ROUTE_PATHS } from '../../../config/constants';
import DashboardIcon        from '@mui/icons-material/Dashboard';
import FolderIcon           from '@mui/icons-material/Folder';
import LocalShippingIcon    from '@mui/icons-material/LocalShipping';
import EngineeringIcon      from '@mui/icons-material/Engineering';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import PeopleIcon           from '@mui/icons-material/People';
import ApartmentIcon        from '@mui/icons-material/Apartment';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssessmentIcon       from '@mui/icons-material/Assessment';
import NotificationsIcon    from '@mui/icons-material/Notifications';
import SettingsIcon         from '@mui/icons-material/Settings';

const weOkasNav = [
  { key: 'dashboard',     label: 'Dashboard',          path: ROUTE_PATHS.WEOKAS_DASHBOARD,     icon: DashboardIcon,             permission: P.DASHBOARD_VIEW     },
  { key: 'projects',      label: 'Projects',           path: ROUTE_PATHS.WEOKAS_PROJECTS,      icon: FolderIcon,                permission: P.PROJECTS_VIEW      },
  { key: 'distributors',  label: 'Distributors',       path: ROUTE_PATHS.WEOKAS_DISTRIBUTORS,  icon: LocalShippingIcon,         permission: P.DISTRIBUTORS_VIEW  },
  { key: 'sis',           label: 'System Integrators', path: ROUTE_PATHS.WEOKAS_SIS,           icon: EngineeringIcon,           permission: P.SI_VIEW            },
  { key: 'pms',           label: 'Project Managers',   path: ROUTE_PATHS.WEOKAS_PMS,           icon: SupervisedUserCircleIcon,  permission: P.PM_VIEW            },
  { key: 'users',         label: 'Members',            path: ROUTE_PATHS.WEOKAS_USERS,         icon: PeopleIcon,                permission: 'members.view'       },
  { key: 'organizations', label: 'Organizations',      path: ROUTE_PATHS.WEOKAS_ORGANIZATIONS, icon: ApartmentIcon,             permission: P.ORGS_VIEW          },
  { key: 'roles',         label: 'Roles & Permissions',path: ROUTE_PATHS.WEOKAS_ROLES,         icon: AdminPanelSettingsIcon,    permission: 'roles.view'         },
  { key: 'reports',       label: 'Reports',            path: ROUTE_PATHS.WEOKAS_REPORTS,       icon: AssessmentIcon,            permission: P.REPORTS_VIEW       },
  { key: 'notifications', label: 'Notifications',      path: ROUTE_PATHS.WEOKAS_NOTIFICATIONS, icon: NotificationsIcon,         permission: P.NOTIFICATIONS_VIEW },
  { key: 'settings',      label: 'Settings',           path: ROUTE_PATHS.WEOKAS_SETTINGS,      icon: SettingsIcon,              permission: P.SETTINGS_VIEW      },
];

export default weOkasNav;
