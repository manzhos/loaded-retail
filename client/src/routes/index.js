import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes(isAuthenticated) {
  // console.log('isAuthenticated:', isAuthenticated);
  return useRoutes(isAuthenticated.isAuthenticated ? [MainRoutes] : [AuthenticationRoutes]);
}
