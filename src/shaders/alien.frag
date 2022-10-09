  uniform float time;
  uniform vec3 color;
  uniform vec4 resolution;
  uniform float uScale;

  uniform sampler2D matcap;

  varying vec2 vUv;
  varying vec3 vPosition;

  float PI = 3.1415926535897932384626433832795;

  mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
  }

   //https://github.com/hughsk/matcap/blob/master/matcap.glsl
  vec2 getMatcap(vec3 eye, vec3 normal) {
    vec3 reflected = reflect(eye, normal);
    float m = 2.8284271247461903 * sqrt( reflected.z+1.0 );
    return reflected.xy / m + 0.5;
  }

  vec3 getColor(float amount) {
    vec3 col = 0.47 + 0.99 * cos(6.28319 * (vec3(0.0,0.2,0.1) + amount * vec3(0.5,0.5,0.5)));
    return col * amount;
  }

  vec3 getColorAmount(vec3 p) {
    float amount = clamp((1.5-length(p))/2.,0.0,1.0);
    vec3 col = 0.2 + 0.25 * cos(6.28319 * (vec3(0.0,0.2,0.1) + amount * vec3(0.1,1.,0.1)));
    return col * amount;
  }

  vec3 rotate(vec3 v, vec3 axis, float angle) {
    mat4 m = rotationMatrix(axis, angle);
    return (m * vec4(v, 1.0)).xyz;
  }

  float sphere(vec3 p) {
    return length(p) - 0.5;
  }

  float sdBox( vec3 p, vec3 b ){
    vec3 q = abs(p) - b;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
  }

float smax(float a, float b, float k)
{
    return log(exp(k*a)+exp(k*b))/k;
}

  float SineCrazy(vec3 p) {
    return 1. - (sin(p.x) + sin(p.y) + sin(p.z))/3.;
  }

  float scene(vec3 p) {
    vec3 p1 = rotate(p, vec3(1.,1.,1.), time);
    float scale = 40.0 + 35.0 * cos(time/2.);
    return max(sphere(p1), (0.85 - SineCrazy(p1*scale))/scale);
  }

  vec3 getNormal(vec3 p) {
    vec2 o = vec2(0.001,0.0);
    return normalize(
      vec3(
        scene(p + o.xyy) - scene(p - o.xyy),
        scene(p + o.yxy) - scene(p - o.yxy),
        scene(p + o.yyx) - scene(p - o.yyx)
      )
    );
  }

  void main() {

    vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);

    vec2 center = newUV - vec2(0.5);

    vec3 camPos = vec3(0.,0.,5.);

    vec3 ray = normalize(vec3(center,-1.));

    vec3 rayPosition = camPos;
        
    float rayLength = 0.0;
    float curDist = 0.0;

    vec3 light = vec3(-1.0,1.0,1.0);
    vec3 color = vec3(0.0);

    for(int i =0; i<=61; i++) {

      curDist = scene(rayPosition);
      rayLength += curDist;

      rayPosition = camPos + ray*rayLength;

      if(abs(curDist) < 0.001) {
        vec3 normal = getNormal(rayPosition);
        float shading = dot(normal, light);
        //color = getColor(1.65*length(rayPosition));
        break;
      }
      color += 0.04*getColorAmount(rayPosition);
    }

    gl_FragColor = vec4(color,1.0);
  }
