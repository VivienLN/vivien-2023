precision mediump float;

uniform sampler2D tDiffuse;

uniform float uNoise;
uniform float uTime;

varying vec2 vUv;

// https://thebookofshaders.com/10
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Get random in range: c-delta < r < c+delta
float getRandomRange(float value, float delta, vec2 st) {
    float rnd = random(st);
    return value - delta + rnd * delta * 2.0;
}

void main()
{
    vec4 c = texture2D(tDiffuse, vUv);
    vec2 st = vUv * mod(uTime, 10.0);
    c.r = getRandomRange(c.r, uNoise, st);
    c.g = getRandomRange(c.g, uNoise, st);
    c.b = getRandomRange(c.b, uNoise, st);

    gl_FragColor = c;
}