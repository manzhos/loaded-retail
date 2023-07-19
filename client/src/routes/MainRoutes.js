import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// store / shop routing
const Shop = Loadable(lazy(() => import('views/pages/shop/Shop')));
const User = Loadable(lazy(() => import('views/pages/user/User')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: '/stores',
      element: <Shop />
    },
    {
      path: '/users',
      element: <User />
    },
    
  ]
};

export default MainRoutes;
