import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Vector2, Vector3 } from "three";

import { getDefaultUnifroms, getWindowSize, getAspectRatio, hexToVec3 } from './renderingHelpers';
import { mandelbrot_FragmentShader } from './../shaders/fragmentShader';

interface ILocalProps {
  reset: boolean;
};
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
  const mouseDown2 = useRef(false);
  const isQPressed = useRef(false);
  const isAPressed = useRef(false);
  const isCtrlPressed = useRef(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  const mouseDelta = useRef({ x: 0.0, y: 0.0 });

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
        value: hexToVec3('#90caf9'),
      },
      u_color3: {
        value: hexToVec3('#80deea'),
      },
      u_color4: {
        value: hexToVec3('#2196f3'),
      },
      u_color5: {
        value: hexToVec3('#64b5f6'),
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
    mouseDelta.current = { x: e.movementX, y: e.movementY };
  }, []);
  const updateKeyDown = useCallback((e: KeyboardEvent) => {

    if (e.code === "KeyQ")
      isQPressed.current = true;
    if (e.code === "KeyA")
      isAPressed.current = true;
    if (e.code === "ControlLeft")
      isCtrlPressed.current = true;
  
  }, []);
  const updateKeyUp = useCallback((e: KeyboardEvent) => {

    if (e.code === "KeyQ")
      isQPressed.current = false;
    if (e.code === "KeyA")
      isAPressed.current = false;
    if (e.code === "ControlLeft")
      isCtrlPressed.current = false;
  
  }, []);

  // useEffects
  useEffect(() => {
 
    if (props.reset) {

      materialRef.current.uniforms.u_zoomSize.value = startZoom;
      materialRef.current.uniforms.u_offset.value = new Vector2(-(startZoom / 2) * getAspectRatio(), -(startZoom / 2));
    };

  }, [props.reset]);
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
  useEffect(() => {
    window.addEventListener("keydown", updateKeyDown, false);

    return () => {
      window.removeEventListener("keydown", updateKeyDown, false);
    };
  }, [updateKeyDown]);
  useEffect(() => {
    window.addEventListener("keyup", updateKeyUp, false);

    return () => {
      window.removeEventListener("keyup", updateKeyUp, false);
    };
  }, [updateKeyUp]);

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {

    mousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {

    if (e.button === 0)
      mouseDown0.current = true;
    if (e.button === 1)
      mouseDown1.current = true;
    if (e.button === 2)
      mouseDown1.current = true;
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {

    if (e.button === 0)
      mouseDown0.current = false;
    if (e.button === 1)
      mouseDown1.current = false;
    if (e.button === 2)
      mouseDown1.current = false;
  };

  // useFrame
  useFrame((state, delta) => {

    var zoom = materialRef.current.uniforms.u_zoomSize.value as number;
    var offset = materialRef.current.uniforms.u_offset.value as Vector2;

    if (mouseDown0.current && isQPressed.current)
      zoom *= 1 - zoomSpeed * delta;
    if (mouseDown0.current && isAPressed.current)
      zoom *= 1 + zoomSpeed * delta;

    if ((mouseDown0.current && isQPressed.current) ||
    (mouseDown0.current && isAPressed.current)) {

      var zoomDelta = zoom - materialRef.current.uniforms.u_zoomSize.value;
      var mouseX = mousePosition.current.x / window.innerWidth;
      var mouseY = 1 - mousePosition.current.y / window.innerHeight;

      offset = offset.add(new Vector2(-mouseX * zoomDelta * materialRef.current.uniforms.u_aspectRatio.value, -mouseY * zoomDelta));
      materialRef.current.uniforms.u_zoomSize.value = zoom;
      materialRef.current.uniforms.u_offset.value = offset;
    };

    if (mouseDown1.current) {

      var mouseX = mousePosition.current.x / window.innerWidth;
      var mouseY = 1 - mousePosition.current.y / window.innerHeight;

      offset = offset.add(new Vector2(-mouseDelta.current.x * zoom * 0.001, mouseDelta.current.y * zoom * 0.001));
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
