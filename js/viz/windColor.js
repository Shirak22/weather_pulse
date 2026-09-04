/** Wind-speed → RGB colormap (calm cool → gale warm). */

/** @type {{ t: number, r: number, g: number, b: number }[]} */
const STOPS = [
    { t: 0.0, r: 176, g: 208, b: 232 }, // soft ice blue — calm
    { t: 0.18, r: 120, g: 198, b: 220 }, // sky cyan
    { t: 0.32, r: 72, g: 186, b: 186 }, // teal
    { t: 0.48, r: 110, g: 196, b: 140 }, // soft green
    { t: 0.62, r: 232, g: 214, b: 110 }, // muted gold
    { t: 0.78, r: 236, g: 152, b: 78 }, // apricot
    { t: 0.9, r: 220, g: 88, b: 72 }, // coral red
    { t: 1.0, r: 168, g: 40, b: 72 }, // deep rose — strong gale
];

/**
 * @param {number} speed m/s
 * @param {number} sMin
 * @param {number} sMax
 * @returns {number} 0xRRGGBB for PIXI tint
 */
export function speedToTint(speed, sMin, sMax) {
    const span = sMax - sMin || 1;
    const u = Math.min(1, Math.max(0, (speed - sMin) / span));

    let i = 0;
    while (i < STOPS.length - 2 && u > STOPS[i + 1].t) i++;
    const a = STOPS[i];
    const b = STOPS[i + 1];
    const local = (u - a.t) / (b.t - a.t || 1);

    const r = Math.round(a.r + (b.r - a.r) * local);
    const g = Math.round(a.g + (b.g - a.g) * local);
    const bl = Math.round(a.b + (b.b - a.b) * local);
    return (r << 16) | (g << 8) | bl;
}
