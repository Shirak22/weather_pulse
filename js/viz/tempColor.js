/** Shared air-temperature → RGB colormap (blue → cyan → yellow → orange → red). */

/** @type {{ t: number, r: number, g: number, b: number }[]} */
const STOPS = [
    { t: 0.0, r: 8, g: 48, b: 107 }, // deep blue (cold)
    { t: 0.2, r: 33, g: 113, b: 181 },
    { t: 0.35, r: 107, g: 174, b: 214 },
    { t: 0.45, r: 198, g: 219, b: 239 },
    { t: 0.5, r: 255, g: 255, b: 204 }, // ~mid → pale yellow
    { t: 0.6, r: 254, g: 217, b: 118 },
    { t: 0.72, r: 253, g: 141, b: 60 },
    { t: 0.85, r: 227, g: 74, b: 51 },
    { t: 1.0, r: 165, g: 0, b: 38 }, // deep red (hot)
];

/**
 * @param {number} temp °C
 * @param {number} tMin
 * @param {number} tMax
 * @returns {{ r: number, g: number, b: number }}
 */
export function tempToRgb(temp, tMin, tMax) {
    const span = tMax - tMin || 1;
    const u = Math.min(1, Math.max(0, (temp - tMin) / span));

    let i = 0;
    while (i < STOPS.length - 2 && u > STOPS[i + 1].t) i++;
    const a = STOPS[i];
    const b = STOPS[i + 1];
    const local = (u - a.t) / (b.t - a.t || 1);

    return {
        r: Math.round(a.r + (b.r - a.r) * local),
        g: Math.round(a.g + (b.g - a.g) * local),
        b: Math.round(a.b + (b.b - a.b) * local),
    };
}

/**
 * @param {number} temp °C
 * @param {number} tMin
 * @param {number} tMax
 * @returns {number} 0xRRGGBB
 */
export function tempToHex(temp, tMin, tMax) {
    const { r, g, b } = tempToRgb(temp, tMin, tMax);
    return (r << 16) | (g << 8) | b;
}

/**
 * CSS stops for legend (hot → cold top-to-bottom).
 * @param {number} tMin
 * @param {number} tMax
 */
export function tempLegendStops(tMin, tMax) {
    const temps = [];
    const steps = 8;
    for (let i = 0; i <= steps; i++) {
        temps.push(tMax - ((tMax - tMin) * i) / steps);
    }
    return temps.map((temp) => {
        const { r, g, b } = tempToRgb(temp, tMin, tMax);
        return {
            temp,
            css: `rgb(${r},${g},${b})`,
            label: `${Math.round(temp)}`,
        };
    });
}
