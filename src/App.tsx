import React, { Suspense, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Box, ThemeProvider, StyledEngineProvider, CssBaseline } from '@mui/material';
import { IService } from '@daniel.neuweiler/ts-lib-module';
import { SystemContextProvider, ViewContainer, Indicator1 } from '@daniel.neuweiler/react-lib-module';

import { ThemeKeys, DarkTheme, LightTheme } from './styles/';
import { AppContextProvider, RouterPage } from './contexts';

import '@daniel.neuweiler/ts-lib-module/build/src/styles/default.style.css';
import '@daniel.neuweiler/react-lib-module/build/styles/default.style.css';
import './styles/app.style.css';

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

  const handleInjectCustomServices = () => {

    var services: Array<IService> = [];

    return services;
  };

  const renderFallback = () => {

    const theme = getTheme();

    return (

      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          userSelect: 'none',
          display: 'flex',
          flexDirection: 'column'
        }}>

        <ViewContainer
          isScrollLocked={true}>

          <Indicator1
            color={theme.palette.primary.main}
            scale={4.0} />
        </ViewContainer>
      </Box>
    );
  };

  return (

    <BrowserRouter>
      <StyledEngineProvider
        injectFirst={true}>
        <ThemeProvider
          theme={getTheme()}>

          <Suspense
            fallback={renderFallback()}>

            <SystemContextProvider
              onInjectCustomServices={handleInjectCustomServices}>

              <AppContextProvider
                onThemeChange={handleThemeChange}>
                <CssBaseline />
                <RouterPage />
              </AppContextProvider>
            </SystemContextProvider>
          </Suspense>
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  );
}

export default App;
