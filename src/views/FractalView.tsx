/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { LogProvider } from '@daniel.neuweiler/ts-lib-module';
import { ViewContainer, LogRenderer } from '@daniel.neuweiler/react-lib-module';
import { Canvas, useFrame, ThreeElements, ThreeEvent } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { Vector2, Color } from "three";

import { ViewKeys } from './navigation';
import { defaultVertexShader } from './../shaders/vertexShader';
import { mandelbrotFragmentShader } from './../shaders/fragmentShader';

interface ILocalProps {
}
type Props = ILocalProps;

function ScreenMesh(props: ThreeElements['mesh']) {

  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const mousePosition = useRef({ x: 0, y: 0 });
  const mouseDown0 = useRef(false);
  const mouseDown1 = useRef(false);
  const zoomSize = useRef(0);

  // const updateMousePosition = useCallback((e: MouseEvent) => {
  //   mousePosition.current = { x: e.pageX, y: e.pageY };
  // }, []);

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {

    mousePosition.current = { x: e.pageX, y: e.pageY };
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {

    if (e.button === 0)
      mouseDown0.current = true;
    if (e.button === 1)
      mouseDown1.current = true;
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {

    if (e.button === 0)
      mouseDown0.current = false;
    if (e.button === 1)
      mouseDown1.current = false;
  };

  const uniforms = useMemo(
    () => ({
      u_resolution: {
        value: new Vector2(1920, 1080),
      },
      u_zoomCenter: {
        value: new Vector2(0, 0),
      },
      u_zoomSize: {
        value: 1.0,
      },
      u_maxIterations: {
        value: 100,
      },
    }), []
  );

  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  // useEffect(() => {
  //   window.addEventListener("mousemove", updateMousePosition, false);

  //   return () => {
  //     window.removeEventListener("mousemove", updateMousePosition, false);
  //   };
  // }, [updateMousePosition]);

  useFrame((state, delta) => {

    if (mouseDown0.current)
      materialRef.current.uniforms.u_zoomSize.value -= .001;
    if (mouseDown1.current)
      materialRef.current.uniforms.u_zoomSize.value += .001;

    // materialRef.current.uniforms.u_zoomCenter.value = new Vector2(
    //   mousePosition.current.x,
    //   mousePosition.current.y)

    // (ref.current.rotation.x += delta)
  });

  return (

    <mesh
      {...props}
      ref={meshRef}
      // scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>

      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        fragmentShader={mandelbrotFragmentShader}/> 
    </mesh>
  );
};

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
          <ScreenMesh />

        </Canvas>
      </div>

    </ViewContainer>
  );
}

const FractalView = React.memo(FractalViewMemoized, (prevProps, nextProps) => {

  return true
});

export default FractalView;
