/**
 * Mobile settings bottom-sheet / desktop always-visible panel.
 */
export class PanelController {
    constructor() {
        this.panel = document.getElementById("settings-panel");
        this.backdrop = document.getElementById("panel-backdrop");
        this.openBtn = document.getElementById("panel-toggle");
        this.closeBtn = document.getElementById("panel-close");
        this.mq = window.matchMedia("(min-width: 900px)");

        this.openBtn?.addEventListener("click", () => this.open());
        this.closeBtn?.addEventListener("click", () => this.close());
        this.backdrop?.addEventListener("click", () => this.close());
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") this.close();
        });
        this.mq.addEventListener("change", () => {
            if (this.mq.matches) this.close();
        });
    }

    open() {
        if (this.mq.matches) return;
        document.body.classList.add("panel-open");
        this.backdrop && (this.backdrop.hidden = false);
        this.openBtn?.setAttribute("aria-expanded", "true");
        this.openBtn?.setAttribute("aria-label", "Close settings");
    }

    close() {
        document.body.classList.remove("panel-open");
        this.backdrop && (this.backdrop.hidden = true);
        this.openBtn?.setAttribute("aria-expanded", "false");
        this.openBtn?.setAttribute("aria-label", "Open settings");
    }
}
