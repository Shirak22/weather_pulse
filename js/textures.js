async function getAssets() {
    return {
        pointTexture : await Assets.load('./assets/drawing.png'),
        trailTexture : await Assets.load('https://pixijs.com/assets/trail.png'),
        
    }
}
