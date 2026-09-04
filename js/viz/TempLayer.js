import { config } from "../config.js";

function tempToColor(temp) {
    if (temp < 10) return 0x0044ff;
    if (temp < 12) return 0xff0000;
    if (temp < 15) return 0xff6655;
    if (temp < 17) return 0xff7744;
    if (temp < 19) return 0xff9933;
    if (temp < 21) return 0xffaa22;
    if (temp < 23) return 0xffee11;
    if (temp < 27) return 0xffff99;
    if (temp > 30) return 0xff0099;
    return 0xffffff;
}

/**
 * Temperature overlay drawn into a shared Graphics.
 * Dirty-flagged: redraw only when data/map/visibility changes — never every ticker frame.
 */
export class TempLayer {
    constructor(graphics, options = {}) {
        this.gfx = graphics;
        this.res = options.resolution ?? config.tempLayer.resolution;
        this.alpha = options.alpha ?? config.tempLayer.alpha;
        this.visible = false;
        this.dirty = true;
    }

    setVisible(visible) {
        if (this.visible === visible) return;
        this.visible = visible;
        this.dirty = true;
        if (!visible) this.gfx.clear();
    }

    markDirty() {
        this.dirty = true;
    }

    drawIfNeeded(width, height, fields) {
        if (!this.visible || !this.dirty) return;

        this.gfx.clear();
        const cols = Math.floor(width / this.res);
        const rows = Math.floor(height / this.res);
        const { resolution: fieldsRes, cols: fieldsCols, gridsArray } = fields;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const fieldsPosx = (col * this.res) / fieldsRes;
                const fieldsPosy = (row * this.res) / fieldsRes;
                const index = fieldsPosx + fieldsPosy * fieldsCols;
                const cell = gridsArray[index];
                if (!cell) continue;

                const color = tempToColor(cell.blerp.temp_data);
                this.gfx.rect(col * this.res, row * this.res, this.res, this.res);
                this.gfx.fill(color);
                this.gfx.alpha = this.alpha;
            }
        }

        this.dirty = false;
    }
}
