/**
 * Full-screen loading / error UI with progress bar.
 */
export class StatusOverlay {
    constructor(root) {
        this.root = root;
        this.titleEl = root.querySelector(".status-overlay__title");
        this.detailEl = root.querySelector(".status-overlay__detail");
        this.barEl = root.querySelector(".status-overlay__bar-fill");
        this.percentEl = root.querySelector(".status-overlay__percent");
        this.barTrack = root.querySelector(".status-overlay__bar");
    }

    showLoading(message = "Loading forecast…", detail = "") {
        this.root.hidden = false;
        this.root.className = "status-overlay status-overlay--loading";
        document.body.classList.add("app-loading");
        if (this.titleEl) this.titleEl.textContent = message;
        if (this.detailEl) this.detailEl.textContent = detail;
        this.setProgress(0);
    }

    /**
     * @param {number} ratio 0–1
     * @param {string} [detail]
     */
    setProgress(ratio, detail) {
        const pct = Math.round(Math.min(1, Math.max(0, ratio)) * 100);
        if (this.barEl) this.barEl.style.width = `${pct}%`;
        if (this.percentEl) this.percentEl.textContent = `${pct}%`;
        if (this.barTrack) this.barTrack.setAttribute("aria-valuenow", String(pct));
        if (detail !== undefined && this.detailEl) this.detailEl.textContent = detail;
    }

    /**
     * @param {{ step: number, total: number, label: string }} info
     * @param {number} [base=0] start of this phase in 0–1
     * @param {number} [span=1] portion of bar this phase covers
     */
    setStepProgress(info, base = 0, span = 1) {
        const ratio = base + (info.step / info.total) * span;
        this.setProgress(ratio, info.label);
    }

    showError(message) {
        this.root.hidden = false;
        this.root.className = "status-overlay status-overlay--error";
        document.body.classList.add("app-loading");
        if (this.titleEl) this.titleEl.textContent = "Could not load data";
        if (this.detailEl) this.detailEl.textContent = message;
        if (this.barEl) this.barEl.style.width = "0%";
        if (this.percentEl) this.percentEl.textContent = "";
    }

    hide() {
        this.root.hidden = true;
        this.root.className = "status-overlay";
        document.body.classList.remove("app-loading");
        if (this.titleEl) this.titleEl.textContent = "";
        if (this.detailEl) this.detailEl.textContent = "";
        if (this.barEl) this.barEl.style.width = "0%";
        if (this.percentEl) this.percentEl.textContent = "";
    }
}
