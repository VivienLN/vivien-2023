precision mediump float;

uniform vec3 uColor;
uniform vec3 uFogColor;
uniform float uFogMin;
uniform float uFogMax;

varying float vDistance;

void main()
{
    if (distance(gl_PointCoord, vec2(.5)) * 2.0 > .5) {
        discard;
    }
    // float alpha = step(.5, 1.0 - distance(gl_PointCoord, vec2(.5)) * 2.0);
    // float alpha = smoothstep(.4, .5, 1.0 - distance(gl_PointCoord, vec2(.5)) * 2.0);
    vec3 color = mix(uColor, uFogColor, vec3((uFogMin - vDistance) * uFogMax));
    gl_FragColor = vec4(color, 1.0);

}