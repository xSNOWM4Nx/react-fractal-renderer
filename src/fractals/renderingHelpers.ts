import { Vector2, Vector3 } from "three";

export class FractalKeys {
  public static MandelbrotSet: string = 'Mandelbrot Set';
  public static JuliaSet: string = 'Julia Set';
};

export const getWindowSize = () => {
  return new Vector2(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
};

export const getAspectRatio = () => {

  const windowSize = getWindowSize();
  return windowSize.x / windowSize.y;
};

export const getDefaultUnifroms = (startZoom: number) => {

  return {

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
    }
  }
};
