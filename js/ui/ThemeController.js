const STORAGE_KEY = "weather-pulse-theme";

/**
 * Light / dark theme with system fallback + localStorage persistence.
 */
export class ThemeController {
    /**
     * @param {HTMLButtonElement | null} toggleBtn
     */
    constructor(toggleBtn) {
        this.btn = toggleBtn;
        this.root = document.documentElement;
        this.#apply(this.#resolveInitial());
        this.btn?.addEventListener("click", () => this.toggle());
        window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
            if (localStorage.getItem(STORAGE_KEY)) return;
            this.#apply(e.matches ? "light" : "dark");
        });
    }

    toggle() {
        const next = this.root.getAttribute("data-theme") === "light" ? "dark" : "light";
        localStorage.setItem(STORAGE_KEY, next);
        this.#apply(next);
    }

    #resolveInitial() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "light" || saved === "dark") return saved;
        return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }

    /** @param {"light" | "dark"} theme */
    #apply(theme) {
        this.root.setAttribute("data-theme", theme);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", theme === "light" ? "#d8e4f0" : "#0b1220");
        if (this.btn) {
            this.btn.setAttribute(
                "aria-label",
                theme === "light" ? "Switch to dark theme" : "Switch to light theme"
            );
            this.btn.title = theme === "light" ? "Dark theme" : "Light theme";
        }
    }
}
