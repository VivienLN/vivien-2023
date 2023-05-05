precision mediump float;

uniform sampler2D tDiffuse;

uniform float uNoise;
uniform float uTime;
uniform float uVignetteInner;
uniform float uVignetteOuter;
uniform float uVignetteOpacity;
uniform float uVignettePulse;

varying vec2 vUv;

vec2 uv;

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
    vec2 st = uv * mod(uTime, 10.0);
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
    // Horizontal noise
    uv = vUv;
    uv.x += random(vec2(uTime * 0.00001, uv.y)) * .0008;

    // Scan lines
    // float scanLine = sin(uv.y * 12.0 + uTime) * .004;
    // uv.x +=scanLine;
    float scanLine = 0.0;
    scanLine += step(.5, sin(uv.y * 1.0 + uTime * .4)) * .0008;
    scanLine += step(.4, sin(5.0 + uv.y * 2.0 + uTime * -.15)) * .001;

    // float w1 = pow(sin(uv.y * 40.0 * (sin(uTime) * .2 + .22) + uTime * 1.8), 8.0) * .04;
    // Thanks to https://graphtoy.com/
    float w1 = pow(sin(uTime + uv.y * 20.0 ), 8.0) * .005;
    float w2 = sin(uTime * 1.2 - uv.y * 10.0) * .5 + .4;
    float w3 = smoothstep(-.2, .8, sin(uTime * .9 + uv.y * 3.0));
    float w4 = pow(sin(-uTime * 2.7 + uv.y * 26.0 + 1.0), 4.0) * .005;

    // uv.x += w4 * w3;
    uv.x += w1 * w2 * w3;
    // uv.x = clamp(0.0, 1.0, uv.x + offsetLine);
    // uv.x += offsetLine;
    uv.x += scanLine;

    // Fetch data
    vec4 c = texture2D(tDiffuse, uv);

    // Apply color effects
    c = noise(c);
    c = vignette(c, uv);

    // Final output
    // c.r = uv.x * .2;
    // c.g = 0.0;
    // c.b = uv.y * .2;
    gl_FragColor = c;
}