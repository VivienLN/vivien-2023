precision mediump float;

uniform sampler2D tDiffuse;

uniform float uNoise;
uniform float uTime;
uniform float uVignetteInner;
uniform float uVignetteOuter;
uniform float uVignetteOpacity;
uniform float uVignettePulse;

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

vec4 noise(vec4 c) {
    vec2 st = vUv * mod(uTime, 10.0);
    c.r = getRandomRange(c.r, uNoise, st);
    c.g = getRandomRange(c.g, uNoise, st);
    c.b = getRandomRange(c.b, uNoise, st);
    return c;
}

vec4 vignette(vec4 c, vec2 uv) {
    float pulseSize = 1.0 + sin(uTime * uVignettePulse) * .02;
    float d = distance(uv, vec2(0.5));
    float i = uVignetteInner * pulseSize;
    float o = uVignetteOuter * pulseSize;
    float opacity = uVignetteOpacity * pulseSize;
    c.rgb *= 1.0 - smoothstep(i, o, d) * opacity;
    return c;
}

void main()
{
    vec4 c = texture2D(tDiffuse, vUv);
    c = noise(c);
    c = vignette(c, vUv);

    gl_FragColor = c;
}