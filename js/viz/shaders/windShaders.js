/** PIXI default filter vertex (required — GlProgram crashes if vertex is omitted). */
export const FILTER_VERTEX = /* glsl */ `
in vec2 aPosition;
out vec2 vTextureCoord;

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

vec4 filterVertexPosition( void )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;

    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0 * uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`;

/**
 * GLSL for GPU wind particles (WebGL2 / GLSL 300 es — PIXI v8 default).
 *
 * State texture (RGBA8): RG = pack16(x), BA = pack16(y) in normalized screen space.
 * Wind texture (RGBA8): RG = encode(u,v) with 0.5 = 0, scale = maxComponent.
 */

export const PACK_GLSL = /* glsl */ `
vec2 packFloat(float v) {
    float s = clamp(v, 0.0, 1.0) * 65535.0;
    float hi = floor(s / 256.0);
    float lo = mod(s, 256.0);
    return vec2(hi, lo) / 255.0;
}

float unpackFloat(vec2 c) {
    return (c.x * 255.0 * 256.0 + c.y * 255.0) / 65535.0;
}

vec2 unpackPos(vec4 s) {
    return vec2(unpackFloat(s.rg), unpackFloat(s.ba));
}

vec4 packPos(vec2 p) {
    return vec4(packFloat(p.x), packFloat(p.y));
}

float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
    return vec2(hash12(p), hash12(p + 17.13));
}
`;

/** Fullscreen filter: advect particle state using wind texture. */
export const ADVECT_FRAGMENT = /* glsl */ `
in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform sampler2D uWind;
uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

uniform float uDelta;
uniform float uSpeedFactor;
uniform float uMaxComponent;
uniform float uTime;
uniform float uDeathRate;
uniform vec2 uResolution;
uniform vec4 uBounds; // minX, minY, maxX, maxY in 0..1

${PACK_GLSL}

void main() {
    vec4 state = texture(uTexture, vTextureCoord);
    vec2 pos = unpackPos(state);

    vec4 windSample = texture(uWind, pos);
    vec2 vel = (windSample.rg - 0.5) * 2.0 * uMaxComponent;

    // Integrate in normalized screen space
    pos += (vel * uDelta * uSpeedFactor) / uResolution;

    float die = step(hash12(vTextureCoord + uTime), uDeathRate);
    bool oob = pos.x < uBounds.x || pos.x > uBounds.z || pos.y < uBounds.y || pos.y > uBounds.w
        || pos.x < 0.0 || pos.x > 1.0 || pos.y < 0.0 || pos.y > 1.0;

    if (oob || die > 0.5) {
        vec2 r = hash22(vTextureCoord * 11.3 + uTime);
        pos = mix(uBounds.xy, uBounds.zw, r);
    }

    finalColor = packPos(pos);
}
`;

export const DRAW_VERTEX = /* glsl */ `
in vec2 aPosition; // texel coordinates (ix, iy)
out float vSpeed;
out float vColorize;

uniform sampler2D uParticleState;
uniform sampler2D uWind;
uniform vec2 uPosTexSize;
uniform vec2 uResolution;
uniform float uPointSize;
uniform float uMaxComponent;
uniform float uColorize;

${PACK_GLSL}

void main() {
    vec2 stateUV = (aPosition + 0.5) / uPosTexSize;

    vec4 state = texture(uParticleState, stateUV);
    vec2 posNorm = unpackPos(state);
    vec2 screen = posNorm * uResolution;

    vec4 windSample = texture(uWind, posNorm);
    vec2 vel = (windSample.rg - 0.5) * 2.0 * uMaxComponent;
    vSpeed = length(vel);
    vColorize = uColorize;

    // Clip space directly (Y flipped — PIXI screen Y grows downward)
    vec2 ndc = (screen / uResolution) * 2.0 - 1.0;
    ndc.y = -ndc.y;
    gl_Position = vec4(ndc, 0.0, 1.0);
    gl_PointSize = max(uPointSize, 1.0);
}
`;

export const DRAW_FRAGMENT = /* glsl */ `
in float vSpeed;
in float vColorize;
out vec4 finalColor;

void main() {
    vec2 c = gl_PointCoord * 2.0 - 1.0;
    float d = dot(c, c);
    if (d > 1.0) discard;
    float alpha = exp(-d * 2.2) * 0.9;

    vec3 color = vec3(1.0);
    if (vColorize > 0.5) {
        if (vSpeed < 2.0) color = vec3(0.6, 1.0, 1.0);
        else if (vSpeed < 5.0) color = vec3(1.0, 0.67, 1.0);
        else if (vSpeed < 10.0) color = vec3(1.0, 0.67, 0.0);
        else color = vec3(1.0, 1.0, 0.0);
    }

    finalColor = vec4(color, alpha);
}
`;
