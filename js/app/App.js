import { Application, Graphics, Text } from "../pixi.js";
import { config } from "../config.js";
import { getAssets } from "../viz/textures.js";
import { WindField } from "../viz/WindField.js";
import { Fields } from "../viz/Fields.js";
import { GpuWindParticles } from "../viz/GpuWindParticles.js";
import { GeoPoints } from "../viz/GeoPoints.js";
import { TempLayer } from "../viz/TempLayer.js";
import { Controls } from "../ui/Controls.js";
import { Timeline } from "../ui/Timeline.js";
import { StatusOverlay } from "../ui/StatusOverlay.js";
import { DataInfoPanel } from "../ui/DataInfoPanel.js";

/**
 * Facade: owns lifecycle, wires UI ↔ data ↔ viz.
 * Wind path: bake WindField once → GpuWindParticles (O(1) sample + trail FBO).
 */
export class App {
    /**
     * @param {{ mapView: import("../map/MapView.js").MapView, smhi: import("../data/SmhiClient.js").SmhiClient }} deps
     */
    constructor({ mapView, smhi }) {
        this.mapView = mapView;
        this.smhi = smhi;

        this.pixi = null;
        this.textures = null;
        this.data = null;
        this.windField = null;
        this.fields = null;
        this.windParticles = null;
        this.geoPoints = null;
        this.tempLayer = null;
        this.pointerGfx = null;
        this.pointerText = null;

        this.timeline = null;
        this.status = null;
        this.dataInfo = null;
        this.controls = null;

        this._loading = false;
        this._windVisible = false;
        this._geoVisible = false;
    }

    async start() {
        this.status = new StatusOverlay(document.getElementById("status-overlay"));
        this.dataInfo = new DataInfoPanel();
        this.timeline = new Timeline(document.getElementById("timeline"), {
            onChange: (time) => this.loadTime(time),
        });

        this.status.showLoading("Loading Weather Pulse", "Fetching forecast times…");
        try {
            this.status.setProgress(0.05, "Fetching forecast times…");
            const times = await this.smhi.getTimes();
            this.timeline.setValidTimes(times);

            this.status.setProgress(0.12, "Starting map engine…");
            await this.#initPixi();
            this.#bindControls();
            this.#bindMapEvents();
            this._windVisible = Boolean(this.controls.wind.getValue());

            await this.loadTime(this.timeline.selectedTime, { isStartup: true });
            this.#startTicker();
            this.status.hide();
        } catch (err) {
            console.error(err);
            this.status.showError(err.message || "Failed to start Weather Pulse");
        }
    }

    async #initPixi() {
        const size = this.mapView.size;
        this.pixi = new Application();
        await this.pixi.init({
            width: size.x,
            height: size.y,
            backgroundAlpha: config.general_settings.app.canvas_background_alpha,
            preference: "webgl", // custom GLSL advect/draw shaders
        });
        this.pixi.canvas.id = "myCanvas";
        document.getElementById("map").appendChild(this.pixi.canvas);

        this.textures = await getAssets();
        this.pixi.stage.eventMode = "static";
        this.pixi.stage.hitArea = this.pixi.screen;

        this.windField = new WindField(
            this.pixi.screen.width,
            this.pixi.screen.height,
            config.windParticles.fieldCellSize
        );

        this.tempLayer = new TempLayer(this.pixi);
        this.tempLayer.setWindField(this.windField);

        this.fields = new Fields(config.fields.resolution, this.windField);
        this.fields.init(this.pixi.screen.width, this.pixi.screen.height);

        this.windParticles = new GpuWindParticles(
            this.pixi.renderer,
            this.pixi.screen.width,
            this.pixi.screen.height,
            this.windField,
            this.mapView
        );

        this.pointerGfx = new Graphics();
        this.pixi.stage.addChild(this.pointerGfx);

        this.pointerText = new Text({
            text: "Pointer info",
            style: { fill: "#fff", fontFamily: "arial", fontSize: 30 },
        });
        this.pointerText.position.set(20, 90);
        this.pixi.stage.addChild(this.pointerText);

        this.pixi.stage.addEventListener("pointermove", (e) => this.#onPointerMove(e));

        this.pixi.ticker.maxFPS = config.general_settings.app.maxFPS;
        this.pixi.ticker.minFPS = config.general_settings.app.minFPS;
    }

    /** Project SMHI lon/lat → screen pixels (needed before WindField.bake). */
    #projectPixels(data) {
        data.pixel = data.coordinates.map((coord) => this.mapView.toPixel(coord));
    }

    #rebuildField() {
        this.#projectPixels(this.data);
        this.windField.bake(this.data);
        this.fields.setWindField(this.windField);
        if (this.fields.gridsArray.length === 0) {
            this.fields.createFields();
        } else {
            this.fields.update();
        }
        this.windParticles.setWindField(this.windField);
        this.windParticles.refreshBounds();
        this.tempLayer.setWindField(this.windField);
        this.tempLayer.markDirty();
    }

    /**
     * @param {string} isoTime
     * @param {{ isStartup?: boolean }} [opts]
     */
    async loadTime(isoTime, opts = {}) {
        if (!isoTime || this._loading) return;
        this._loading = true;

        const isStartup = Boolean(opts.isStartup);
        this.status.showLoading(
            isStartup ? "Loading Weather Pulse" : "Loading forecast",
            "Contacting SMHI…"
        );

        try {
            // Startup: times+pixi already used ~12%; raster fills the rest.
            const base = isStartup ? 0.15 : 0;
            const span = isStartup ? 0.75 : 0.9;

            this.data = await this.smhi.getRaster(isoTime, (info) => {
                this.status.setStepProgress(info, base, span);
            });

            this.status.setProgress(base + span, "Building flow field…");
            // Yield so the progress bar paints before heavy bake
            await new Promise((r) => requestAnimationFrame(() => r()));

            this.dataInfo.update(isoTime, this.data.coordinates.length);
            this.#rebuildField();
            this.windParticles.clearTrails();

            if (this._windVisible) this.#ensureWindOnStage();

            if (!this.geoPoints) {
                this.geoPoints = new GeoPoints(
                    this.textures.pointTexture,
                    this.data,
                    this.pixi,
                    this.mapView
                );
                this.geoPoints.fill();
            } else {
                this.geoPoints.setData(this.data);
            }
            this.geoPoints.draw(this._geoVisible);

            this.status.setProgress(1, "Ready");
            if (!isStartup) this.status.hide();
        } catch (err) {
            console.error(err);
            this.status.showError(err.message || "Failed to load forecast");
        } finally {
            this._loading = false;
        }
    }

    #bindMapEvents() {
        this.mapView.on("moveend", () => this.#onMapMoveEnd());
    }

    #onMapMoveEnd() {
        if (!this.data) return;
        this.#rebuildField();
        this.windParticles.clearTrails();
        this.geoPoints?.setData(this.data);
        this.geoPoints?.refreshPositions();
    }

    #bindControls() {
        this.controls = {
            particleTail: new Controls("particle_tail", "particle_tail-length"),
            particleSpeed: new Controls("particle_speed_factor", "particle_tail-speed"),
            geoPoints: new Controls("geopoints_view", "geopoints_view"),
            colorize: new Controls("particle_colorize", "particle_colorize"),
            wind: new Controls("parameters_wind", "parameters_wind"),
            temp: new Controls("parameters_temperature", "parameters_temperature"),
        };
    }

    #startTicker() {
        this.pixi.ticker.add((ticker) => this.#tick(ticker));
    }

    #tick(ticker) {
        if (this._loading || !this.windParticles) return;

        const windOn = Boolean(this.controls.wind.getValue());
        this._windVisible = windOn;

        if (windOn) {
            this.#ensureWindOnStage();
            this.windParticles.setTailLength(this.controls.particleTail.getValue());
            this.windParticles.setSpeed(this.controls.particleSpeed.getValue());
            this.windParticles.setColorize(this.controls.colorize.getValue());
            this.windParticles.update(ticker.deltaTime);
        } else if (this.pixi.stage.children.includes(this.windParticles.view)) {
            this.pixi.stage.removeChild(this.windParticles.view);
        }

        const geoOn = Boolean(this.controls.geoPoints.getValue());
        if (geoOn !== this._geoVisible) {
            this._geoVisible = geoOn;
            this.geoPoints?.draw(geoOn);
        }

        const tempOn = Boolean(this.controls.temp.getValue());
        this.tempLayer.setVisible(tempOn);
        this.dataInfo.setScaleVisible(tempOn);
        this.tempLayer.drawIfNeeded();
    }

    /** Temp underlay at bottom; wind particles just above it. */
    #ensureWindOnStage() {
        const stage = this.pixi.stage;
        const wind = this.windParticles.view;
        if (stage.children.includes(wind)) return;

        let idx = 0;
        if (this.tempLayer?.view && stage.children.includes(this.tempLayer.view)) {
            idx = stage.getChildIndex(this.tempLayer.view) + 1;
        }
        stage.addChildAt(wind, Math.min(idx, stage.children.length));
    }

    #onPointerMove(e) {
        if (!this.windField) return;
        const mousePos = e.global;
        const s = this.windField.sample(mousePos.x, mousePos.y);

        const cell = this.resolutionCell(mousePos.x, mousePos.y);
        this.pointerGfx.clear();
        if (cell) {
            this.pointerGfx.rect(cell.x, cell.y, this.fields.resolution, this.fields.resolution);
            this.pointerGfx.fill({ color: 0xffffff, alpha: 0.25 });
        }
        this.pointerText.text = `WD: ${s.wind_direction.toFixed(1)}°\nWS: ${s.speed.toFixed(1)} m/s\nT: ${s.temp_data.toFixed(2)}˚C`;
    }

    resolutionCell(x, y) {
        if (!this.fields) return null;
        const cx = Math.floor(x / this.fields.resolution) * this.fields.resolution;
        const cy = Math.floor(y / this.fields.resolution) * this.fields.resolution;
        return { x: cx, y: cy };
    }
}
