import { Sprite, Texture, BufferImageSource } from "../pixi.js";
import { config } from "../config.js";

/**
 * Raster diagnostic overlay.
 * Keeps the full SMHI multipoint set in data; never builds 1 DisplayObject per cell.
 * Stamps projected pixels into one screen-sized texture (O(points) on show / map move only).
 */
export class GeoPoints {
    /**
     * @param {*} _texture unused (legacy); dots are baked into a buffer
     * @param {{ pixel?: {x:number,y:number}[], coordinates: number[][] }} data
     * @param {{ stage: *, screen: { width: number, height: number } }} app
     * @param {import("../map/MapView.js").MapView} mapView
     */
    constructor(_texture, data, app, mapView) {
        this.data = data;
        this.app = app;
        this.mapView = mapView;
        this.visibility = false;

        this.view = new Sprite();
        this.view.eventMode = "none";
        this.view.visible = false;
        this._texture = null;
    }

    fill() {
        if (!this.app.stage.children.includes(this.view)) {
            this.app.stage.addChild(this.view);
        }
    }

    setData(data) {
        this.data = data;
    }

    draw(visible) {
        this.visibility = visible;
        this.view.visible = visible;
        if (visible) this.#bake();
    }

    /** After pan/zoom — only if visible. */
    refreshPositions() {
        if (!this.visibility) return;
        this.#bake();
    }

    #bake() {
        const data = this.data;
        if (!data) return;

        const width = Math.max(1, this.app.screen.width | 0);
        const height = Math.max(1, this.app.screen.height | 0);
        const buf = new Uint8ClampedArray(width * height * 4);

        const color = config.geoPoints.color >>> 0;
        const r = (color >> 16) & 0xff;
        const g = (color >> 8) & 0xff;
        const b = color & 0xff;
        const a = 220;
        const stamp = Math.max(1, config.geoPoints.size | 0);

        const pixels = data.pixel;
        if (pixels && pixels.length) {
            for (let i = 0; i < pixels.length; i++) {
                const p = pixels[i];
                if (!p) continue;
                this.#stamp(buf, width, height, p.x | 0, p.y | 0, stamp, r, g, b, a);
            }
        } else {
            const coords = data.coordinates;
            for (let i = 0; i < coords.length; i++) {
                const p = this.mapView.toPixel(coords[i]);
                this.#stamp(buf, width, height, p.x | 0, p.y | 0, stamp, r, g, b, a);
            }
        }

        if (this._texture) this._texture.destroy(true);

        const source = new BufferImageSource({
            resource: buf,
            width,
            height,
        });
        this._texture = new Texture({ source });
        this._texture.source.scaleMode = "nearest";
        this._texture.source.autoGenerateMipmaps = false;
        this.view.texture = this._texture;
    }

    #stamp(buf, width, height, x, y, stamp, r, g, b, a) {
        const x1 = Math.min(width, x + stamp);
        const y1 = Math.min(height, y + stamp);
        const x0 = Math.max(0, x);
        const y0 = Math.max(0, y);
        for (let py = y0; py < y1; py++) {
            let o = (py * width + x0) * 4;
            for (let px = x0; px < x1; px++) {
                buf[o] = r;
                buf[o + 1] = g;
                buf[o + 2] = b;
                buf[o + 3] = a;
                o += 4;
            }
        }
    }
}
