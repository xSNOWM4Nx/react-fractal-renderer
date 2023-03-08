import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Vector2, Vector3 } from "three";

import { getDefaultUnifroms, getWindowSize } from './renderingHelpers';
import { mandelbrot_FragmentShader } from './../shaders/fragmentShader';

interface ILocalProps {
}
type Props = ILocalProps;

export const MandelbrotThreeMesh: React.FC<Props> = (props) => {

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

  const uniforms = useMemo(
    () => ({
      ...getDefaultUnifroms(startZoom),
      u_baseColor: {
        value: new Vector3(0.15, 0.15, 0.15),
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