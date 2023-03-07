/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { LogProvider } from '@daniel.neuweiler/ts-lib-module';
import { AutoSizeContainer } from '@daniel.neuweiler/react-lib-module';
import { Canvas, useFrame, ThreeElements, ThreeEvent } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { Vector2, Vector3 } from "three";

import { ViewKeys } from './navigation';
import { default_VertexShader } from './../shaders/vertexShader';
import { mandelbrot_FragmentShader, mandelbrot_2_FragmentShader } from './../shaders/fragmentShader';

interface ILocalProps {
}
type Props = ILocalProps;

function ScreenMesh(props: ThreeElements['mesh']) {

  const startZoom = 2;
  const zoomSpeed = 1;

  // useState
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  // useRef
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const mouseDown0 = useRef(false);
  const mouseDown1 = useRef(false);
  const mousePosition = useRef({ x: 0, y: 0 });

  const getWindowSize = () => {
    return new Vector2(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
  };

  const getAspectRatio = () => {

    const windowSize = getWindowSize();
    return windowSize.x / windowSize.y;
  };

  const uniforms = useMemo(
    () => ({
      u_resolution: {
        value: getWindowSize(),
      },
      u_aspectRatio: {
        value: getAspectRatio()
      },
      u_zoomSize: {
        value: startZoom,
      },
      u_offset: {
        value: new Vector2(-(startZoom / 2) * getAspectRatio(), -(startZoom / 2)),
      },
      u_maxIterations: {
        value: 200,
      },
      u_baseColor: {
        value: new Vector3(0.1, 0.1, 0.1),
      },
      u_color1: {
        value: new Vector3(0.2, 0.2, 0.2),
      },
      u_color2: {
        value: new Vector3(0.129, 0.588, 0.953),
      },
      pset1: {
        value: new Vector3(1, .01, .01),
      },
      pset2: {
        value: new Vector3(.01, .01, .01),
      },
    }), []
  );

  // useCallback
  const updateScreenSize = useCallback(() => {

    const windowSize = getWindowSize();
    uniforms.u_resolution.value = windowSize;
    uniforms.u_aspectRatio.value = windowSize.x / windowSize.y;
  }, []);
  const updateMousePosition = useCallback((e: MouseEvent) => {

    mousePosition.current = { x: e.clientX, y: e.clientY };
  }, []);

  // useEffects
  useEffect(() => {
    window.addEventListener("resize", updateScreenSize, false);

    return () => {
      window.removeEventListener("resize", updateScreenSize, false);
    };
  }, [updateScreenSize]);
  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition, false);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition, false);
    };
  }, [updateMousePosition]);

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {

    mousePosition.current = { x: e.clientX, y: e.clientY };
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

  // useFrame
  useFrame((state, delta) => {

    var zoom = materialRef.current.uniforms.u_zoomSize.value as number;
    var offset = materialRef.current.uniforms.u_offset.value as Vector2;

    if (mouseDown0.current)
      zoom *= 1 - zoomSpeed * delta;
    if (mouseDown1.current)
      zoom *= 1 + zoomSpeed * delta;

    if (mouseDown0.current ||
      mouseDown1.current) {

      var zoomDelta = zoom - materialRef.current.uniforms.u_zoomSize.value;
      var mouseX = mousePosition.current.x / window.innerWidth;
      var mouseY = 1 - mousePosition.current.y / window.innerHeight;

      offset = offset.add(new Vector2(-mouseX * zoomDelta * materialRef.current.uniforms.u_aspectRatio.value, -mouseY * zoomDelta));
      materialRef.current.uniforms.u_zoomSize.value = zoom;
      materialRef.current.uniforms.u_offset.value = offset;
    };

  });

  return (

    <mesh
      {...props}
      ref={meshRef}
      // scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      // onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>

      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        fragmentShader={mandelbrot_FragmentShader} />
    </mesh>

  );
};

const FractalViewMemoized: React.FC<Props> = (props) => {

  // Fields
  const contextName: string = ViewKeys.FractalView

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
          <ScreenMesh />

        </Canvas>
      } />
  );
}

const FractalView = React.memo(FractalViewMemoized, (prevProps, nextProps) => {

  return true
});

export default FractalView;
