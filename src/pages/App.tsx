import React, { Suspense, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline, CircularProgress } from '@mui/material';
import AppContextProvider from '../components/infrastructure/AppContextProvider.js';
import NavigationProvider from '../components/infrastructure/NavigationProvider.js';
import { navigationElements, getImportableView } from '../navigation/navigationElements.js';
import RouterPage from './RouterPage.js';
import { ThemeKeys, DarkTheme, LightTheme } from './../styles/index.js';

// Styles
import './../styles/app.style.css';

const App: React.FC = () => {

  // States
  const [themeName, setThemeName] = useState(ThemeKeys.DarkTheme);

  const getTheme = () => {

    switch (themeName) {
      case ThemeKeys.DarkTheme: {
        return DarkTheme;
      };
      case ThemeKeys.LightTheme: {
        return LightTheme;
      };
      default:
        return DarkTheme;
    };
  };

  const handleThemeChange = (themeName: string) => {
    setThemeName(themeName);
  };

  const renderFallback = () => {

    //const theme = getTheme();

    return (

      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          userSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          alignContent: 'center',
          justifyItems: 'center',
          justifyContent: 'center'
        }}>
        <CssBaseline
          enableColorScheme={true} />
        <CircularProgress
          color='primary'
          size={128} />
      </Box>
    );
  };

  return (

    <BrowserRouter>
      <ThemeProvider
        theme={getTheme()}>

        <Suspense
          fallback={renderFallback()}>

          <AppContextProvider
            onThemeChange={handleThemeChange}>

            <NavigationProvider
              navigationItems={navigationElements}
              onInject={navigationElement => React.lazy(() => getImportableView(navigationElement.importPath))}>

              <CssBaseline
                enableColorScheme={true} />
              <RouterPage />
            </NavigationProvider>
          </AppContextProvider>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
