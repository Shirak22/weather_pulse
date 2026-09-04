import { Sprite, Texture, BufferImageSource } from "../pixi.js";
import { config } from "../config.js";
import { tempToRgb } from "./tempColor.js";

/**
 * Temperature heatmap from WindField (already baked from full SMHI multipoint).
 * One GPU texture + Sprite — no per-cell Graphics, no Fields grid.
 */
export class TempLayer {
    /**
     * @param {{ stage: *, screen: { width: number, height: number } }} app
     */
    constructor(app, options = {}) {
        this.app = app;
        this.alpha = options.alpha ?? config.tempLayer.alpha;
        this.tMin = options.minTemp ?? config.tempLayer.minTemp;
        this.tMax = options.maxTemp ?? config.tempLayer.maxTemp;
        this.visible = false;
        this.dirty = true;
        /** @type {import("./WindField.js").WindField | null} */
        this.windField = null;

        this.view = new Sprite();
        this.view.eventMode = "none";
        this.view.visible = false;
        this.view.alpha = this.alpha;
        this._texture = null;

        if (!app.stage.children.includes(this.view)) {
            app.stage.addChildAt(this.view, 0);
        }
    }

    setWindField(windField) {
        this.windField = windField;
        this.dirty = true;
    }

    setVisible(visible) {
        if (this.visible === visible) return;
        this.visible = visible;
        this.view.visible = visible;
        this.dirty = true;
        if (!visible) return;
    }

    markDirty() {
        this.dirty = true;
    }

    drawIfNeeded() {
        if (!this.visible || !this.dirty || !this.windField) return;
        this.#bake();
        this.dirty = false;
    }

    #bake() {
        const field = this.windField;
        const { cols, rows, temp, weight, width, height } = field;
        const buf = new Uint8ClampedArray(cols * rows * 4);
        const tMin = this.tMin;
        const tMax = this.tMax;
        const alpha = Math.round(Math.min(1, Math.max(0, this.alpha)) * 255);

        for (let i = 0; i < cols * rows; i++) {
            const o = i * 4;
            if (weight[i] < 1e-6) {
                buf[o + 3] = 0;
                continue;
            }
            const { r, g, b } = tempToRgb(temp[i], tMin, tMax);
            buf[o] = r;
            buf[o + 1] = g;
            buf[o + 2] = b;
            buf[o + 3] = alpha;
        }

        if (this._texture) this._texture.destroy(true);

        const source = new BufferImageSource({
            resource: buf,
            width: cols,
            height: rows,
        });
        this._texture = new Texture({ source });
        this._texture.source.scaleMode = "linear";
        this._texture.source.addressModeU = "clamp-to-edge";
        this._texture.source.addressModeV = "clamp-to-edge";
        this._texture.source.autoGenerateMipmaps = false;

        this.view.texture = this._texture;
        this.view.width = width;
        this.view.height = height;
        this.view.alpha = 1; // alpha baked into texels; keep sprite opaque
    }
}
