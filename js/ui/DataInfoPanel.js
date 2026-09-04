import { Controls } from "./Controls.js";

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
           <h2 class="sub_title">Data info</h2>
           <section class="sub_settings">
               <p>date: <span>${dateStr}</span></p>
           </section>
           <section class="sub_settings">
               <p> Total geo points: <span>${pointCount}</span></p>
           </section>
        `);
    }

    setScaleVisible(visible) {
        if (!this.scaleEl) return;
        this.scaleEl.style.display = visible ? "flex" : "none";
    }

    #drawScale() {
        if (!this.scaleEl) return;
        const colors = [
            "#0044ff",
            "#ff0000",
            "#ff6655",
            "#ff7744",
            "#ff9933",
            "#ffaa22",
            "#ffee11",
            "#ffff99",
            "#ff0099",
        ];
        this.scaleEl.innerHTML = `
            <p class="scale_unit"> °C </p>
            <aside style="background: ${colors[7]}">&gt;30</aside>
            <aside style="background: ${colors[6]}">25</aside>
            <aside style="background: ${colors[5]}">22</aside>
            <aside style="background: ${colors[4]}">20</aside>
            <aside style="background: ${colors[3]}">18</aside>
            <aside style="background: ${colors[2]}">16</aside>
            <aside style="background: ${colors[1]}">11</aside>
            <aside style="background: ${colors[0]}">&lt;10</aside>
        `;
    }
}
