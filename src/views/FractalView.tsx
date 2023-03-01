/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import React, { useRef, useState } from 'react'
import { LogProvider } from '@daniel.neuweiler/ts-lib-module';
import { ViewContainer, LogRenderer } from '@daniel.neuweiler/react-lib-module';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';

import { ViewKeys } from './navigation';
import { defaultFragmentShader } from './../shaders/fragmentShader';

interface ILocalProps {
}
type Props = ILocalProps;

function Box(props: ThreeElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  useFrame((state, delta) => {

    // (ref.current.rotation.x += delta)
  })
  return (
    <mesh
      {...props}
      ref={ref}
      // scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      {/* <boxGeometry args={[1, 1, 1]} /> */}
      <planeGeometry args={[2, 2]}/>
      {/* <shaderMaterial
        fragmentShader={defaultFragmentShader} /> */}
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const FractalViewMemoized: React.FC<Props> = (props) => {

  // Fields
  const contextName: string = ViewKeys.FractalView

  return (

    <ViewContainer
      isScrollLocked={false}>

      <div
        id="canvas-container"
        css={(theme) => ({
          height: '100%'
        })}>

        <Canvas>
          <OrthographicCamera
            makeDefault
            left={-1}
            right={1}
            top={1}
            bottom={-1}
            near={-1}
            far={1} />

          <ambientLight />
          {/* <pointLight position={[10, 10, 10]} /> */}
          <Box />

        </Canvas>
      </div>

    </ViewContainer>
  );
}

const FractalView = React.memo(FractalViewMemoized, (prevProps, nextProps) => {

  return true
});

export default FractalView;
