import {
    Container,
    ParticleContainer,
    Particle,
    Texture,
    Sprite,
    RenderTexture,
} from "../pixi.js";
import { config } from "../config.js";
import { random } from "../utils/math.js";
import { speedToTint } from "./windColor.js";

function resolveParticleCount() {
    const cfg = config.windParticles;
    const mobile = window.matchMedia("(max-width: 899px)").matches;
    return mobile ? (cfg.numOfParticlesMobile ?? 1800) : cfg.numOfParticles;
}

/**
 * Wind particles (reliable path):
 * - O(1) samples from WindField (baked grid — not irregular SMHI search)
 * - PIXI ParticleContainer batch draw
 * - Trail via fading RenderTexture
 *
 * GPU shader advection kept as future work; WindField.texture is still uploaded.
 */
export class GpuWindParticles {
    /**
     * @param {*} renderer
     * @param {number} width
     * @param {number} height
     * @param {import("./WindField.js").WindField} windField
     * @param {import("../map/MapView.js").MapView} mapView
     */
    constructor(renderer, width, height, windField, mapView) {
        this.renderer = renderer;
        this.width = width;
        this.height = height;
        this.windField = windField;
        this.mapView = mapView;

        this.count = resolveParticleCount();
        this.speedFactor = config.windParticles.velocityFactor;
        this.colorizeCheck = config.windParticles.colorize;
        this.particleScale = config.windParticles.scale;
        this.speedMin = config.windParticles.colorizeMinSpeed ?? 0;
        this.speedMax = config.windParticles.colorizeMaxSpeed ?? 20;
        this.trailPersist = 0.92;

        this.x = new Float32Array(this.count);
        this.y = new Float32Array(this.count);
        this.age = new Float32Array(this.count);
        this.maxAge = new Float32Array(this.count);

        this.verticalBounds = { A: 0, B: 0 };
        this.horizontalBounds = { A: 0, B: 0 };

        this.dotTexture = Texture.WHITE;

        this.particleContainer = new ParticleContainer({
            dynamicProperties: {
                position: true,
                color: true,
                vertex: false,
                rotation: false,
                uvs: false,
            },
            texture: this.dotTexture,
        });
        this.particleContainer.boundsArea = {
            minX: 0,
            minY: 0,
            maxX: width,
            maxY: height,
        };

        /** @type {InstanceType<typeof Particle>[]} */
        this.particles = [];
        for (let i = 0; i < this.count; i++) {
            const p = new Particle({
                texture: this.dotTexture,
                x: 0,
                y: 0,
                anchorX: 0.5,
                anchorY: 0.5,
                scaleX: this.particleScale,
                scaleY: this.particleScale,
                alpha: 0.85,
            });
            this.particles.push(p);
            this.particleContainer.addParticle(p);
        }

        this.trailA = RenderTexture.create({ width, height });
        this.trailB = RenderTexture.create({ width, height });
        this.trailSprite = new Sprite(this.trailA);

        this._offscreen = new Container();
        this._offscreen.addChild(this.trailSprite);
        this._offscreen.addChild(this.particleContainer);

        this.view = new Sprite(this.trailB);
        this.view.eventMode = "none";
        this.view.alpha = 0.95;

        this._useA = true;

        this.refreshBounds();
        this.#respawnAll();
    }

    refreshBounds() {
        const b = this.mapView.areaBoundariesPixel();
        this.verticalBounds.A = b.NW.x;
        this.verticalBounds.B = b.NE.x;
        this.horizontalBounds.A = b.NW.y;
        this.horizontalBounds.B = b.SW.y;
    }

    setWindField(windField) {
        this.windField = windField;
    }

    setTailLength(value) {
        const n = Number(value);
        this.trailPersist = 0.84 + (Math.min(100, Math.max(10, n)) / 100) * 0.13;
    }

    setSpeed(value) {
        this.speedFactor = Number(value) / 25;
    }

    setColorize(value) {
        this.colorizeCheck = Boolean(value);
    }

    #respawnAll() {
        for (let i = 0; i < this.count; i++) this.#respawn(i);
    }

    #respawn(i) {
        const { A: vx0, B: vx1 } = this.verticalBounds;
        const { A: vy0, B: vy1 } = this.horizontalBounds;
        const minX = Math.min(vx0, vx1);
        const maxX = Math.max(vx0, vx1);
        const minY = Math.min(vy0, vy1);
        const maxY = Math.max(vy0, vy1);
        this.x[i] = random(maxX, minX);
        this.y[i] = random(maxY, minY);
        this.age[i] = 0;
        this.maxAge[i] = random(180, 50);
    }

    clearTrails() {
        this.trailA.destroy(true);
        this.trailB.destroy(true);
        this.trailA = RenderTexture.create({ width: this.width, height: this.height });
        this.trailB = RenderTexture.create({ width: this.width, height: this.height });
        this.trailSprite.texture = this.trailA;
        this.view.texture = this.trailB;
        this.refreshBounds();
        this.#respawnAll();
    }

    /**
     * @param {number} delta PIXI ticker deltaTime
     */
    update(delta) {
        if (!this.windField) return;

        const { x, y, age, maxAge, count, particles, speedFactor, windField } = this;
        const minX = Math.min(this.verticalBounds.A, this.verticalBounds.B);
        const maxX = Math.max(this.verticalBounds.A, this.verticalBounds.B);
        const minY = Math.min(this.horizontalBounds.A, this.horizontalBounds.B);
        const maxY = Math.max(this.horizontalBounds.A, this.horizontalBounds.B);

        for (let i = 0; i < count; i++) {
            age[i] += 1;
            const s = windField.sample(x[i], y[i]);
            x[i] += s.u * delta * speedFactor;
            y[i] += s.v * delta * speedFactor;

            if (
                x[i] < minX ||
                x[i] > maxX ||
                y[i] < minY ||
                y[i] > maxY ||
                x[i] < 0 ||
                x[i] > this.width ||
                y[i] < 0 ||
                y[i] > this.height ||
                age[i] > maxAge[i]
            ) {
                this.#respawn(i);
            }

            const p = particles[i];
            p.x = x[i];
            p.y = y[i];
            p.tint = this.colorizeCheck
                ? speedToTint(s.speed, this.speedMin, this.speedMax)
                : 0xffffff;

            const lifeT = age[i] / maxAge[i];
            p.alpha = lifeT > 0.7 ? 0.9 * (1 - (lifeT - 0.7) / 0.3) : 0.9;
        }

        this.#renderTrails();
    }

    #renderTrails() {
        const src = this._useA ? this.trailA : this.trailB;
        const dst = this._useA ? this.trailB : this.trailA;

        // 1) Fade previous trails
        this.trailSprite.texture = src;
        this.trailSprite.alpha = this.trailPersist;
        this.particleContainer.visible = false;
        this.renderer.render({
            container: this._offscreen,
            target: dst,
            clear: true,
        });

        // 2) Stamp heads
        this.particleContainer.visible = true;
        this.trailSprite.visible = false;
        this.renderer.render({
            container: this.particleContainer,
            target: dst,
            clear: false,
        });
        this.trailSprite.visible = true;

        this.view.texture = dst;
        this._useA = !this._useA;
    }
}
