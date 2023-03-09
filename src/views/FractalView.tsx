/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react'
import { SystemContext, AutoSizeContainer } from '@daniel.neuweiler/react-lib-module';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { Box } from '@mui/material';

import { ViewKeys } from './navigation';
import { MandelbrotThreeMesh, JuliaThreeMesh, FractalSettingsOverlay, FractalKeys, FractalSettingKeys } from './../fractals';

interface ILocalProps {
}
type Props = ILocalProps;

const FractalViewMemoized: React.FC<Props> = (props) => {

  // Fields
  const contextName: string = ViewKeys.FractalView

  // Contexts
  const systemContext = useContext(SystemContext);

  var fractalKey = systemContext.getSetting(FractalSettingKeys.FractalKey) as string;
  if (fractalKey === undefined || fractalKey === '')
    fractalKey = FractalKeys.MandelbrotSet;
  var reset = systemContext.getSetting(FractalSettingKeys.ResetSettings) as boolean;
  if (reset === undefined)
    reset = false;
  var juliaR = systemContext.getSetting(FractalSettingKeys.JuliaSetR) as number;
  if (juliaR === undefined || juliaR === 0)
    juliaR = -0.8
  var juliaI = systemContext.getSetting(FractalSettingKeys.JuliaSetI) as number;
  if (juliaI === undefined || juliaI === 0)
    juliaI = 0.156

  console.log('--------------->>>>')
  console.log(reset)

  return (

    <React.Fragment>
      <AutoSizeContainer
        isScrollLocked={false}
        onRenderSizedChild={(height, width) =>

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
              <MandelbrotThreeMesh />}
            {fractalKey === FractalKeys.JuliaSet &&
              <JuliaThreeMesh
                reset={reset}
                r={juliaR}
                i={juliaI} />}

          </Canvas>
        } />

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
