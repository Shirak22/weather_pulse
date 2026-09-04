import { Texture, BufferImageSource } from "../pixi.js";
import { radians } from "../utils/math.js";

/**
 * Regular screen-space wind/temp field.
 * Bake irregular SMHI points once (load / map move) → O(1) bilinear sample per particle.
 */
export class WindField {
    /**
     * @param {number} width screen px
     * @param {number} height screen px
     * @param {number} [cellSize=4] grid cell size in px (smaller = sharper, more bake cost)
     */
    constructor(width, height, cellSize = 4) {
        this.cellSize = cellSize;
        this.width = width;
        this.height = height;
        this.cols = Math.max(1, Math.ceil(width / cellSize));
        this.rows = Math.max(1, Math.ceil(height / cellSize));
        const n = this.cols * this.rows;

        this.u = new Float32Array(n);
        this.v = new Float32Array(n);
        this.temp = new Float32Array(n);
        this.weight = new Float32Array(n);

        /** Max |component| used when packing a viz texture (optional). */
        this.maxComponent = 40;
        /** @type {Texture | null} */
        this.texture = null;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.cols = Math.max(1, Math.ceil(width / this.cellSize));
        this.rows = Math.max(1, Math.ceil(height / this.cellSize));
        const n = this.cols * this.rows;
        this.u = new Float32Array(n);
        this.v = new Float32Array(n);
        this.temp = new Float32Array(n);
        this.weight = new Float32Array(n);
        this.texture?.destroy(true);
        this.texture = null;
    }

    /**
     * Splat SMHI multipoint into the regular grid (O(points)), then fill gaps.
     * @param {{ pixel: {x:number,y:number}[], wind_direction: number[], wind_speed: number[], temp_data: number[] }} data
     */
    bake(data) {
        this.u.fill(0);
        this.v.fill(0);
        this.temp.fill(0);
        this.weight.fill(0);

        const { cols, rows, cellSize } = this;
        const { pixel, wind_direction, wind_speed, temp_data } = data;

        for (let i = 0; i < pixel.length; i++) {
            const p = pixel[i];
            if (!p) continue;

            const ws = wind_speed[i];
            const wd = wind_direction[i];
            // Match legacy Particle motion: angle + 90°
            const rad = radians(wd + 90);
            const uu = ws * Math.cos(rad);
            const vv = ws * Math.sin(rad);
            const tt = temp_data[i];

            // Bilinear splat into 4 cells
            const gx = p.x / cellSize;
            const gy = p.y / cellSize;
            const x0 = Math.floor(gx);
            const y0 = Math.floor(gy);
            const fx = gx - x0;
            const fy = gy - y0;

            this.#accumulate(x0, y0, uu, vv, tt, (1 - fx) * (1 - fy));
            this.#accumulate(x0 + 1, y0, uu, vv, tt, fx * (1 - fy));
            this.#accumulate(x0, y0 + 1, uu, vv, tt, (1 - fx) * fy);
            this.#accumulate(x0 + 1, y0 + 1, uu, vv, tt, fx * fy);
        }

        // Normalize
        for (let i = 0; i < this.weight.length; i++) {
            const w = this.weight[i];
            if (w > 1e-6) {
                this.u[i] /= w;
                this.v[i] /= w;
                this.temp[i] /= w;
            }
        }

        this.#fillEmptyCells();
        this.#uploadTexture();
    }

    #accumulate(ix, iy, uu, vv, tt, w) {
        if (w <= 0) return;
        if (ix < 0 || iy < 0 || ix >= this.cols || iy >= this.rows) return;
        const i = iy * this.cols + ix;
        this.u[i] += uu * w;
        this.v[i] += vv * w;
        this.temp[i] += tt * w;
        this.weight[i] += w;
    }

    /** Propagate values into empty cells (few passes — cheap vs per-frame IDW). */
    #fillEmptyCells() {
        const { cols, rows, u, v, temp, weight } = this;
        for (let pass = 0; pass < 4; pass++) {
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const i = y * cols + x;
                    if (weight[i] > 1e-6) continue;
                    let su = 0;
                    let sv = 0;
                    let st = 0;
                    let sw = 0;
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const nx = x + dx;
                            const ny = y + dy;
                            if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
                            const j = ny * cols + nx;
                            if (weight[j] <= 1e-6) continue;
                            su += u[j];
                            sv += v[j];
                            st += temp[j];
                            sw += 1;
                        }
                    }
                    if (sw > 0) {
                        u[i] = su / sw;
                        v[i] = sv / sw;
                        temp[i] = st / sw;
                        weight[i] = 1e-3; // mark as filled for next pass neighbors
                    }
                }
            }
        }
    }

    /**
     * O(1) bilinear sample at screen pixel.
     * @returns {{ u: number, v: number, speed: number, wind_direction: number, temp_data: number }}
     */
    sample(x, y) {
        const gx = x / this.cellSize;
        const gy = y / this.cellSize;
        const x0 = Math.floor(gx);
        const y0 = Math.floor(gy);
        const fx = gx - x0;
        const fy = gy - y0;

        const u00 = this.#get(this.u, x0, y0);
        const u10 = this.#get(this.u, x0 + 1, y0);
        const u01 = this.#get(this.u, x0, y0 + 1);
        const u11 = this.#get(this.u, x0 + 1, y0 + 1);

        const v00 = this.#get(this.v, x0, y0);
        const v10 = this.#get(this.v, x0 + 1, y0);
        const v01 = this.#get(this.v, x0, y0 + 1);
        const v11 = this.#get(this.v, x0 + 1, y0 + 1);

        const t00 = this.#get(this.temp, x0, y0);
        const t10 = this.#get(this.temp, x0 + 1, y0);
        const t01 = this.#get(this.temp, x0, y0 + 1);
        const t11 = this.#get(this.temp, x0 + 1, y0 + 1);

        const u =
            u00 * (1 - fx) * (1 - fy) +
            u10 * fx * (1 - fy) +
            u01 * (1 - fx) * fy +
            u11 * fx * fy;
        const v =
            v00 * (1 - fx) * (1 - fy) +
            v10 * fx * (1 - fy) +
            v01 * (1 - fx) * fy +
            v11 * fx * fy;
        const temp_data =
            t00 * (1 - fx) * (1 - fy) +
            t10 * fx * (1 - fy) +
            t01 * (1 - fx) * fy +
            t11 * fx * fy;

        const speed = Math.hypot(u, v);
        let wind_direction = (Math.atan2(v, u) * 180) / Math.PI - 90;
        if (wind_direction < 0) wind_direction += 360;

        return { u, v, speed, wind_direction, temp_data };
    }

    #get(arr, ix, iy) {
        if (ix < 0) ix = 0;
        if (iy < 0) iy = 0;
        if (ix >= this.cols) ix = this.cols - 1;
        if (iy >= this.rows) iy = this.rows - 1;
        return arr[iy * this.cols + ix];
    }

    /** Pack u/v into RG texture for GPU shaders (0.5 = zero). */
    #uploadTexture() {
        const { cols, rows, maxComponent } = this;
        const rgba = new Uint8ClampedArray(cols * rows * 4);
        for (let i = 0; i < cols * rows; i++) {
            const r = Math.min(255, Math.max(0, Math.round((this.u[i] / maxComponent) * 127.5 + 127.5)));
            const g = Math.min(255, Math.max(0, Math.round((this.v[i] / maxComponent) * 127.5 + 127.5)));
            const o = i * 4;
            rgba[o] = r;
            rgba[o + 1] = g;
            rgba[o + 2] = 128;
            rgba[o + 3] = 255;
        }

        if (this.texture) {
            this.texture.destroy(true);
        }

        const source = new BufferImageSource({
            resource: rgba,
            width: cols,
            height: rows,
        });
        this.texture = new Texture({ source });
        this.texture.source.scaleMode = "linear";
        this.texture.source.addressModeU = "clamp-to-edge";
        this.texture.source.addressModeV = "clamp-to-edge";
        this.texture.source.autoGenerateMipmaps = false;
    }
}
