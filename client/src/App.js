import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

import { AuthContext }  from './context/AuthContext'
import { useAuth }      from './hooks/auth.hook'
// import { useMyRoutes }  from './routes'
// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);

  const {token, login, logout, userId, ready} = useAuth();
  const isAuthenticated = !!token;

  // const routes = useMyRoutes(isAuthenticated);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <AuthContext.Provider value={{
          token, login, logout, userId, isAuthenticated
        }}>
          <CssBaseline />
          <NavigationScroll>
            <Routes isAuthenticated = {isAuthenticated} />
            {/* {routes} */}
          </NavigationScroll>
        </AuthContext.Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
