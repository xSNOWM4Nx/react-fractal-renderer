/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react'
import { SystemContext, AutoSizeContainer } from '@daniel.neuweiler/react-lib-module';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';

import { ViewKeys, SettingKeys } from './navigation';
import { MandelbrotThreeMesh, JuliaThreeMesh, FractalKeys } from './../fractals';

interface ILocalProps {
}
type Props = ILocalProps;

const FractalViewMemoized: React.FC<Props> = (props) => {

  // Fields
  const contextName: string = ViewKeys.FractalView

  // Contexts
  const systemContext = useContext(SystemContext);

  var fractalKey = systemContext.getSetting(SettingKeys.FractalKey) as string;
  if (fractalKey === undefined || fractalKey === '')
    fractalKey = FractalKeys.MandelbrotSet;

  return (

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
          {fractalKey === FractalKeys.MandelbrotSet && <MandelbrotThreeMesh />}
          {fractalKey === FractalKeys.JuliaSet && <JuliaThreeMesh />}

        </Canvas>
      } />
  );
}

const FractalView = React.memo(FractalViewMemoized, (prevProps, nextProps) => {

  return true
});

export default FractalView;
