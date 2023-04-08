attribute vec3 toposition;
attribute float speed;
uniform float uSize;
uniform float progress;



void main(){

  vec3 dis = toposition -position;
  float percent = progress / speed;
  vec3 pos;
  if(percent < 1.){
     pos = position + dis * percent;
  }else{
    pos = toposition;
  }
 
  vec4 modelPosition = modelMatrix * vec4(pos,1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPositon = projectionMatrix * viewPosition;
  gl_Position =projectedPositon;
  gl_PointSize = uSize;
  gl_PointSize *= 100./-viewPosition.z;
}