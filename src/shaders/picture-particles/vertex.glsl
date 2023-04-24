uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float uSize;

attribute vec3 position;
attribute vec2 uv;
attribute float aElevation;

varying float vVisible;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    gl_PointSize = uSize;

    // Size attenuation
    // From https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderLib/points.glsl.js
    gl_PointSize *= ( 1.0 / - viewPosition.z );
}