// assets
import { IconDashboard, IconBrandStackoverflow } from '@tabler/icons';

// constant
const icons = { IconDashboard, IconBrandStackoverflow };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    // {
    //   id: 'default',
    //   title: 'Dashboard',
    //   type: 'item',
    //   url: '/dashboard/default',
    //   icon: icons.IconDashboard,
    //   breadcrumbs: false,
    //   permission: 0
    // },
    {
      id: 'flow',
      title: 'Product Flow',
      type: 'item',
      url: '/dashboard/flow',
      icon: icons.IconBrandStackoverflow,
      breadcrumbs: false,
      permission: 0
    },
    // {
    //   id: 'login',
    //   title: 'Login',
    //   type: 'item',
    //   url: '/login',
    //   icon: icons.IconDashboard,
    //   breadcrumbs: false
    // },
  ]
};

export default dashboard;
