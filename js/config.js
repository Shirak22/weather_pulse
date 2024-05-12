var config = {
    general_settings: {
        dev:{
            consoleLog_enable: false,
        },
        app: {
            canvas_background_alpha: 0,
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
            numOfMeshPoints:30,
            scale: .5,
            color: 0x555555,
    },

}