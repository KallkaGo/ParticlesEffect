attribute vec3 toposition;
attribute float speed;
attribute vec3 color;
attribute vec3 tocolor;

uniform float uSize;
uniform float progress;

varying vec3 vColor;

void main() {

  vec3 dis = toposition - position;
  vec3 disColor = tocolor - color;
  float percent = progress / speed;
  vec3 pos;
  if(percent < 1.) {
    pos = position + dis * percent;
    vColor = color + disColor * percent;
  } else {
    pos = toposition;
    vColor = tocolor;
  }

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPositon = projectionMatrix * viewPosition;
  gl_Position = projectedPositon;
  gl_PointSize = uSize;
  gl_PointSize *= 1. / -viewPosition.z;
}