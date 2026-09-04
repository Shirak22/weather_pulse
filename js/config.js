/** App configuration — single source of truth for tunables. */
export const config = {
    general_settings: {
        app: {
            canvas_background_alpha: 0.2,
            maxFPS: 60,
            minFPS: 30,
        },
        data: {
            // SMHI: 1 = full grid, 20 = every 20th cell. Lower = sharper flow, larger download.
            downSample: 1,
        },
        map: {
            initialZoom: 5,
            maxZoom: 19,
            minZoom: 4,
            bounds: {
                southWest: [52.500440, 2.250475],
                northEast: [70.740996, 37.848053],
                northWest: [70.655722, -8.541278],
                southEast: [52.547483, 27.348870],
            },
        },
    },
    windParticles: {
        numOfParticles: 8000,
        // Phones / narrow viewports — denser screen, weaker GPUs
        numOfParticlesMobile: 1800,
        numOfMeshPoints: 15,
        scale: 2.5,
        color: 0xffffff,
        velocityFactor: 0.45,
        colorize: true,
        // Colorize ramp: calm (m/s) → strong gale
        colorizeMinSpeed: 0,
        colorizeMaxSpeed: 20,
        fieldCellSize: 2,
    },
    geoPoints: {
        size: 2,
        color: 0x00ffff,
        show: false,
    },
    tempLayer: {
        // Absolute °C range for blue→red ramp (Nordic-friendly).
        minTemp: -15,
        maxTemp: 35,
        alpha: 0.5,
    },
    fields: {
        resolution: 4,
    },
};
