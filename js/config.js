var config = {
    general_settings: {
        app: {
            canvas_background_alpha: .2,
            maxFPS: 30,
            minFPS: 25,
        },
        data: {
            downSample: 40,
        },
        map: {
            initialZoom: 5,
            maxZoom: 19,
            minZoom:4,
            bounds: {
                southWest: [52.500440,2.250475],
                northEast: [70.740996,37.848053],
                northWest: [70.655722,-8.541278],
                southEast: [52.547483,27.348870]
            }, 
        }
    },
    windParticles: {
            numOfParticles: 2000,
            numOfMeshPoints:15,
            scale: .4,
            color: 0xffffff,
            velocityFactor: .3,
            colorize: true, 

    },
    geoPoints: {
        size: 2,
        color:0x00ffff,
        show: true,
    }

}