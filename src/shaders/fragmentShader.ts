
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
uniform vec3 u_color3;
uniform vec3 u_color4;
uniform vec3 u_color5;

vec3 palette(float t, vec3 c1, vec3 c2, vec3 c3, vec3 c4, vec3 c5) {
  float x = 1.0 / 4.0;
  if (t < x) return mix(c1, c2, t/x);
  else if (t < 2.0 * x) return mix(c2, c3, (t - x)/x);
  else if (t < 3.0 * x) return mix(c3, c4, (t - 2.0*x)/x);
  else if (t < 4.0 * x) return mix(c4, c5, (t - 3.0*x)/x);
  return c5;
}

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

    //color = mix(u_color1, u_color2, t);
    color = palette(t, u_color1, u_color2, u_color3, u_color4, u_color5);
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
uniform vec3 u_color3;
uniform vec3 u_color4;
uniform vec3 u_color5;

vec3 palette(float t, vec3 c1, vec3 c2, vec3 c3, vec3 c4, vec3 c5) {
  float x = 1.0 / 4.0;
  if (t < x) return mix(c1, c2, t/x);
  else if (t < 2.0 * x) return mix(c2, c3, (t - x)/x);
  else if (t < 3.0 * x) return mix(c3, c4, (t - 2.0*x)/x);
  else if (t < 4.0 * x) return mix(c4, c5, (t - 3.0*x)/x);
  return c5;
}

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

    //color = mix(u_color1, u_color2, t);
    color = palette(t, u_color1, u_color2, u_color3, u_color4, u_color5);
  }

  // Output the color
  gl_FragColor = vec4(color, 1.0);
}
`;

export const koch_FragmentShader = `
precision highp float;

uniform vec2 resolution;
uniform float time;

// A function that returns the distance from a point p to a line segment defined by two points a and b
float distToSegment(vec2 p, vec2 a, vec2 b) {

  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  
  return length(pa - ba * h);
}

// A function that returns the distance from a point p to the Koch curve defined by four points v0, v1, v2 and v3
float distToKoch(vec2 p, vec2 v0, vec2 v1, vec2 v2, vec2 v3) {

  float d0 = distToSegment(p, v0, v1);
  float d1 = distToSegment(p, v1, v2);
  float d2 = distToSegment(p, v2, v3);
  
  return min(min(d0,d1),d2);
}

void main() {

  // Normalized pixel coordinates (from -1.0 to +1.0)
  vec2 uv = (gl_FragCoord.xy - resolution / 2.0) / resolution.y;

  // The four points that define the Koch curve
  vec2 p0 = vec2(-0.5,-sqrt(3.0)/6.0); vec2 p1 = vec2(0.5,-sqrt(3.0)/6.0);

  // The middle point of the curve
  vec4 m4 = vec4((p4.x+p4.y)/sqrt(6.),-(p4.x-p4.y)/sqrt(6.),-p4.x/ sqrt(6.),-p4.y/ sqrt(6.) );
  m4 = m4mat4(cos(time),sin(time),sin(time),cos(time), -sin(time),cos(time),cos(time),-sin(time), -sin(time),cos(time),-cos(time),sin(time), -cos(time),-sin(time),sin(time),cos(time));
  vec3 m = m4.xyz/m4.w;
  vec3 n = normalize(cross(m.xyz,m.zxy));
  vec3 o = normalize(cross(m,n));
  vec3 q = m+nuv.x+o*uv.y;

  // The other two points of the curve
  vec3 r = q-m;
  float s = sqrt(r.xr.x+r.yr.y+r.z*r.z)sqrt(6.);
  float t = atan(r.z,r.x)sqrt(6.);
  float u = asin(r.y/sqrt(r.xr.x+r.zr.z))sqrt(6.);
  t = t+time/10.;
  u = u+time/10.;
  r = svec3(cos(t)*cos(u),sin(u),sin(t)*cos(u));
  q = m+r;

  // The distance from q to each segment of the curve
  float d = distToKoch(q.xy,p0,p1,p4,p5);

  // The color based on the distance
  vec3 col = vec3(d,d,d);

  // Output to screen
  gl_FragColor=vec4(col ,1.);
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
