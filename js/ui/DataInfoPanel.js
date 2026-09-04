import { Controls } from "./Controls.js";
import { config } from "../config.js";
import { tempLegendStops } from "../viz/tempColor.js";

/** Sidebar data-info panel + color scale visibility. */
export class DataInfoPanel {
    constructor() {
        this.panel = new Controls("dataInfo", "dataInfo");
        this.scaleEl = document.getElementById("sidebar__scale");
        this.#drawScale();
        this.setScaleVisible(false);
    }

    update(isoTime, pointCount) {
        const d = new Date(isoTime);
        const dateStr = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        this.panel.setContent(`
           <h2 class="settings-block__title">Data info</h2>
           <div class="setting-row">
               <p>Date <span class="setting-value">${dateStr}</span></p>
           </div>
           <div class="setting-row">
               <p>Geo points <span class="setting-value">${pointCount.toLocaleString()}</span></p>
           </div>
        `);
    }

    setScaleVisible(visible) {
        if (!this.scaleEl) return;
        this.scaleEl.hidden = !visible;
    }

    #drawScale() {
        if (!this.scaleEl) return;
        const { minTemp, maxTemp } = config.tempLayer;
        const stops = tempLegendStops(minTemp, maxTemp);
        const rows = stops
            .map(
                (s, i) =>
                    `<aside style="background: ${s.css}">${
                        i === 0
                            ? `>${Math.round(maxTemp)}`
                            : i === stops.length - 1
                              ? `<${Math.round(minTemp)}`
                              : s.label
                    }</aside>`
            )
            .join("");
        this.scaleEl.innerHTML = `<p class="scale_unit">°C</p>${rows}`;
        this.scaleEl.hidden = true;
    }
}
