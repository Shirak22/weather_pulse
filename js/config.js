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
            downSample: 5,
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
        numOfMeshPoints: 15,
        scale: 2.5,
        color: 0xffffff,
        velocityFactor: 0.45,
        colorize: true,
        fieldCellSize: 2,
    },
    geoPoints: {
        size: 2,
        color: 0x00ffff,
        show: false,
    },
    tempLayer: {
        resolution: 20,
        alpha: 0.4,
    },
    fields: {
        resolution: 4,
    },
};
