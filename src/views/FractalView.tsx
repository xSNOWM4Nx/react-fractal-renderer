/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react'
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { Box } from '@mui/material';
import { AppContext, SettingKeys } from '../components/infrastructure/AppContextProvider.js';
import { ViewKeys } from './viewKeys.js';
import { ThemeKeys } from './../styles/index.js';
import { FractalSettingsOverlay } from './../components/FractalSettingsOverlay.js';
import { MandelbrotThreeMesh } from './../components/MandelbrotThreeMesh.js';
import { JuliaThreeMesh } from './../components/JuliaThreeMesh.js';
import { FractalKeys, FractalSettingKeys } from './../helpers/renderingHelpers.js';

interface ILocalProps {
}
type Props = ILocalProps;

const FractalViewMemoized: React.FC<Props> = (props) => {

  // Fields
  const contextName: string = ViewKeys.FractalView

  // Contexts
  const appContext = useContext(AppContext);

  var fractalKey = appContext.pullSetting(FractalSettingKeys.FractalKey) as string;
  if (fractalKey === undefined || fractalKey === '')
    fractalKey = FractalKeys.MandelbrotSet;
  var reset = appContext.pullSetting(FractalSettingKeys.ResetSettings) as boolean;
  if (reset === undefined)
    reset = false;
  var juliaR = appContext.pullSetting(FractalSettingKeys.JuliaSetR) as number;
  if (juliaR === undefined || juliaR === 0)
    juliaR = -0.8
  var juliaI = appContext.pullSetting(FractalSettingKeys.JuliaSetI) as number;
  if (juliaI === undefined || juliaI === 0)
    juliaI = 0.156

  return (

    <React.Fragment>
      <Canvas
        camera={{
          fov: 10
        }}>

        {/* <OrthographicCamera
              makeDefault
              left={-1}
              right={1}
              top={1}
              bottom={-1}
              near={-1}
              far={1} /> */}
        <ambientLight />
        {fractalKey === FractalKeys.MandelbrotSet &&
          <MandelbrotThreeMesh
            reset={reset} />}
        {fractalKey === FractalKeys.JuliaSet &&
          <JuliaThreeMesh
            reset={reset}
            r={juliaR}
            i={juliaI} />}

      </Canvas>

      <Box
        component='div'
        sx={{
          position: 'absolute',
          bottom: 48,
          left: 0,
          padding: '10px'
        }}>

        <FractalSettingsOverlay />
      </Box>

    </React.Fragment>
  );
}

const FractalView = React.memo(FractalViewMemoized, (prevProps, nextProps) => {

  return true
});

export default FractalView;
