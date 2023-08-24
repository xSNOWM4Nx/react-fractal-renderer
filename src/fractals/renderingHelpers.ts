import { Vector2, Vector3 } from "three";

export class FractalKeys {
  public static MandelbrotSet: string = 'Mandelbrot Set';
  public static JuliaSet: string = 'Julia Set';
};

export class FractalSettingKeys {
  public static FractalKey = 'FractalKey';
  public static ResetSettings = 'ResetSettings';
  public static JuliaSetR = 'JuliaSetR';
  public static JuliaSetI = 'JuliaSetI';
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

export const componentToHex = (c: number) => {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

export const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export const hexToRgb = (hex: string) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const hexToVec3 = (hex: string) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? new Vector3(
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ) : null;
};
