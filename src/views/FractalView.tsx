/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { LogProvider } from '@daniel.neuweiler/ts-lib-module';
import { ViewContainer, AutoSizeContainer } from '@daniel.neuweiler/react-lib-module';
import { Canvas, useFrame, useThree, ThreeElements, ThreeEvent } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { Vector2, Vector3 } from "three";

import { ViewKeys } from './navigation';
import { defaultVertexShader } from './../shaders/vertexShader';
import { mandelbrotFragmentShader } from './../shaders/fragmentShader';

interface ILocalProps {
}
type Props = ILocalProps;

function ScreenMesh(props: ThreeElements['mesh']) {

  const { camera, gl } = useThree();

  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const screenSize = useRef<Vector2>(new Vector2(window.innerWidth, window.innerHeight));
  const mouseDown0 = useRef(false);
  const mouseDown1 = useRef(false);
  const mousePosition = useRef({ x: 0, y: 0 });

  const updateScreenSize = useCallback(() => {

    //screenSize.current = new Vector2(window.innerWidth, window.innerHeight);
    uniforms.res.value = new Vector2(window.innerWidth, window.innerHeight);
    uniforms.aspect.value = window.innerWidth / window.innerHeight;

  }, []);
  const updateMousePosition = useCallback((e: MouseEvent) => {

    mousePosition.current = { x: e.clientX, y: e.clientY };
  }, []);

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

  const uniforms = useMemo(
    () => ({
      res: {
        value: new Vector2(window.innerWidth, window.innerHeight),
      },
      aspect: {
        value: window.innerWidth / window.innerHeight,
      },
      zoom: {
        value: 3,
      },
      offset: {
        value: (window.innerWidth / window.innerHeight) > 1 ? new Vector2(-3, -1.5) : new Vector2(-1.5, -3),
      },
      pset1: {
        value: new Vector3(1, .01, .01),
      },
      pset2: {
        value: new Vector3(.01, .01, .01),
      },
      u_zoomCenter: {
        value: new Vector2(0, 0),
      },
      u_maxIterations: {
        value: 100,
      },
    }), []
  );

  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

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

  useFrame((state, delta) => {

    //materialRef.current.uniforms.res.value = screenSize.current;
    //materialRef.current.uniforms.aspect.value = screenSize.current.x / screenSize.current.y;

    //var aspect = materialRef.current.uniforms.aspect.value;

    var zoom = materialRef.current.uniforms.zoom.value as number;
    if (mouseDown0.current)
      zoom -= .01;
    if (mouseDown1.current)
      zoom += .01;

    if (mouseDown0.current ||
      mouseDown1.current) {

      var zoom1 = zoom - materialRef.current.uniforms.zoom.value;
      //var mouseX = mousePosition.current.x / window.innerWidth;
      var mouseX = (mousePosition.current.x * (2 * zoom)) / window.innerWidth;

      var mouseY = 1 - mousePosition.current.y / window.innerHeight;
      var offset = new Vector2(-mouseX, -(zoom / 2));
      //var offset = new Vector2(-mouseX * zoom * materialRef.current.uniforms.aspect.value, -mouseY * zoom);

      materialRef.current.uniforms.zoom.value = zoom;
      materialRef.current.uniforms.offset.value = offset;
    }


    // if (mouseDown0.current)
    //   materialRef.current.uniforms.offset.value = new Vector2(
    //     mousePosition.current.x,
    //     mousePosition.current.y)

    // (ref.current.rotation.x += delta)
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
        fragmentShader={mandelbrotFragmentShader} />
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
      } />
  );
}

const FractalView = React.memo(FractalViewMemoized, (prevProps, nextProps) => {

  return true
});

export default FractalView;
