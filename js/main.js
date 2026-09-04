import { config } from "./config.js";
import { SmhiClient } from "./data/SmhiClient.js";
import { MapView } from "./map/MapView.js";
import { App } from "./app/App.js";

/**
 * Entry point — creates owners and starts the app.
 * Learn from here: dependency injection into App (map + data client).
 */
async function main() {
    document.body.classList.add("app-loading");
    const mapView = new MapView("map");
    const smhi = new SmhiClient(config.general_settings.data.downSample);
    const app = new App({ mapView, smhi });
    await app.start();
}

main().catch((err) => {
    console.error(err);
    const el = document.getElementById("status-overlay");
    if (!el) return;
    el.hidden = false;
    el.className = "status-overlay status-overlay--error";
    const title = el.querySelector(".status-overlay__title");
    const detail = el.querySelector(".status-overlay__detail");
    if (title) title.textContent = "Could not load data";
    if (detail) detail.textContent = err.message || "Startup failed";
    document.body.classList.add("app-loading");
});
