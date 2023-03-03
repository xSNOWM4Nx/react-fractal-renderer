
export const defaultFragmentShader = `
varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform sampler2D uSampler;

void main(void) {
  highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

  gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}
`;

export const mandelbrotFragmentShader = `
// Credits go to https://medium.com/@SereneBiologist/rendering-escape-fractals-in-three-js-68c96b385a49

precision highp float;
uniform vec2 res;
uniform float aspect;
uniform float zoom;
uniform vec2 offset;

// gui parameters
uniform vec3 pset1;
uniform vec3 pset2;

vec2 cm (vec2 a, vec2 b){
  return vec2(a.x*b.x - a.y*b.y, a.x*b.y + b.x*a.y);
}

vec2 conj (vec2 a){
  return vec2(a.x, -a.y);
}

float mandelbrot(vec2 c){
  float alpha = 1.0;
  vec2 z = vec2(0.0 , 0.0);
  vec2 z_0;
  vec2 z_1;
  vec2 z_2;
  for(int i=0; i < 200; i++){  // i < max iterations

    z_2 = z_1;
    z_1 = z_0;
    z_0 = z;

    float x_0_sq = z_0.x*z_0.x;
    float y_0_sq = z_0.y*z_0.y;
    vec2 z_0_sq = vec2(x_0_sq - y_0_sq, 2.0*z_0.x*z_0.y);

    float x_1_sq = z_1.x*z_1.x;
    float y_1_sq = z_1.y*z_1.y;
    vec2 z_1_sq = vec2(x_1_sq - y_1_sq, 2.0*z_1.x*z_1.y);

    // the recurrence equation
    z = pset1.x*z_0_sq + c + pset1.y*z_1_sq
    + pset1.z*cm(z_1_sq, z_2) + pset2.x*cm(z_1_sq, z_0)
    + pset2.y*cm(z_2, z_0) + pset2.z*cm(z_1, z_2);
    
    float z_0_mag = x_0_sq + y_0_sq;
    float z_1_mag = x_1_sq + y_1_sq;
    if(z_0_mag > 12.0){
      float frac = (12.0 - z_1_mag) / (z_0_mag - z_1_mag);
      alpha = (float(i) - 1.0 + frac)/200.0; // should be same as max iterations
      break;
    }
  }

  return alpha;
}

void main(){ // gl_FragCoord in [0,1]

  vec2 uv = zoom * vec2(aspect, 1.0) * gl_FragCoord.xy / res + offset;

  float s = 1.0 - mandelbrot(uv);
  vec3 coord = vec3(s, s, s);

  gl_FragColor = vec4(pow(coord, vec3(5.38, 6.15, 3.85)), 1.0);
}
`;
