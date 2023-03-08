
export const default_FragmentShader = `
varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform sampler2D uSampler;

void main(void) {
  highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

  gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}
`;

export const mandelbrot_FragmentShader = `
precision highp float;

uniform vec2 u_resolution; // the size of the canvas
uniform float u_aspectRatio;
uniform vec2 u_offset; // the center of the view
uniform float u_zoomSize; // the scale of the view
uniform float u_maxIterations; // the maximum number of iterations

uniform vec3 u_baseColor;
uniform vec3 u_color1;
uniform vec3 u_color2;

void main() {

  // Map the pixel coordinates to the complex plane
  vec2 z = u_zoomSize * vec2(u_aspectRatio, 1.0) * gl_FragCoord.xy / u_resolution + u_offset;
  vec2 c = z; // the initial value of c

  // Iterate the function z = z^2 + c
  float n = 0.0; // the number of iterations
  for (int i = 0; i < 1000; i++) {

    if (n >= u_maxIterations) break; // stop if reached the limit

    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c; // square and add c
    if (dot(z, z) > 4.0) break; // stop if escaped the circle
    n++; // increment the number of iterations
  }

  // Calculate the color based on the number of iterations
  vec3 color = u_baseColor;
  if (n < u_maxIterations) {

    // Use a palette based on the normalized iteration count
    float t = n / u_maxIterations; // the normalized iteration count
    color = mix(u_color1, u_color2, t);
  }

  // Output the color
  gl_FragColor = vec4(color, 1.0);
}
`;

export const julia_FragmentShader = `
precision highp float;

uniform vec2 u_resolution; // the size of the canvas
uniform float u_aspectRatio;
uniform vec2 u_offset; // the center of the view
uniform float u_zoomSize; // the scale of the view
uniform float u_maxIterations; // the maximum number of iterations

uniform vec2 u_JuliaC; // The parameter of the Julia set function

uniform vec3 u_baseColor;
uniform vec3 u_color1;
uniform vec3 u_color2;

// Returns the number of iterations for a given point z
int julia(vec2 z) {

  int n = 0;
  for (int i = 0; i < 1000; i++) {

    if (float(n) >= u_maxIterations) break; // stop if reached the limit

    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + u_JuliaC;
    if (length(z) >= 4.0) break; // stop if escaped the circle
    
    n++; // increment the number of iterations
  }

  return n;
}

// Main function that sets the color of each pixel
void main() {

  // Map the pixel coordinates to the complex plane
  vec2 z = u_zoomSize * vec2(u_aspectRatio, 1.0) * gl_FragCoord.xy / u_resolution + u_offset;
  
  // Get the number of iterations for this point
  int n = julia(z);
  
  // Map the number of iterations to a color using a gradient
  //vec3 color = mix(vec3(1.0), vec3(0.0), float(n) / u_maxIterations);

    // Calculate the color based on the number of iterations
  vec3 color = u_baseColor;
  if (float(n) < u_maxIterations) {

    // Use a palette based on the normalized iteration count
    float t = float(n) / u_maxIterations; // the normalized iteration count
    color = mix(u_color1, u_color2, t);
  }

  // Output the color
  gl_FragColor = vec4(color, 1.0);
}
`;

export const mandelbrot_2_FragmentShader = `
// Credits go to https://medium.com/@SereneBiologist/rendering-escape-fractals-in-three-js-68c96b385a49

precision highp float;

uniform vec2 u_resolution;
uniform float u_aspectRatio;
uniform float u_zoomSize;
uniform int u_maxIterations;
uniform vec2 u_offset;

uniform vec3 pset1;
uniform vec3 pset2;

// Complex number multiplication
vec2 cm (vec2 a, vec2 b){
  return vec2(a.x*b.x - a.y*b.y, a.x*b.y + b.x*a.y);
}

// Complex number conjugate
vec2 conj (vec2 a){
  return vec2(a.x, -a.y);
}

// Mandelbrot set iteration
float mandelbrot(vec2 c){

  float alpha = 1.0;
  vec2 z = vec2(0.0 , 0.0);
  vec2 z_0;
  vec2 z_1;
  vec2 z_2;

  for(int i=0; i < 100; i++){  // i < max iterations

    z_2 = z_1;
    z_1 = z_0;
    z_0 = z;

    float x_0_sq = z_0.x*z_0.x;
    float y_0_sq = z_0.y*z_0.y;
    vec2 z_0_sq = vec2(x_0_sq - y_0_sq, 2.0*z_0.x*z_0.y);

    float x_1_sq = z_1.x*z_1.x;
    float y_1_sq = z_1.y*z_1.y;
    vec2 z_1_sq = vec2(x_1_sq - y_1_sq, 2.0*z_1.x*z_1.y);

    // The recurrence equation
    z = pset1.x*z_0_sq + c + pset1.y*z_1_sq
    + pset1.z*cm(z_1_sq, z_2) + pset2.x*cm(z_1_sq, z_0)
    + pset2.y*cm(z_2, z_0) + pset2.z*cm(z_1, z_2);
    
    float z_0_mag = x_0_sq + y_0_sq;
    float z_1_mag = x_1_sq + y_1_sq;
    if(z_0_mag > 12.0){
      float frac = (12.0 - z_1_mag) / (z_0_mag - z_1_mag);
      alpha = (float(i) - 1.0 + frac)/100.0; // should be same as max iterations
      break;
    }
  }

  return alpha;
}

void main(){ // gl_FragCoord in [0,1]

  vec2 uv = u_zoomSize * vec2(u_aspectRatio, 1.0) * gl_FragCoord.xy / u_resolution + u_offset;

  float s = 1.0 - mandelbrot(uv);
  vec3 coord = vec3(s, s, s);

  gl_FragColor = vec4(coord, 1.0);
  //gl_FragColor = vec4(pow(coord, vec3(5.38, 6.15, 3.85)), 1.0);
}
`;
