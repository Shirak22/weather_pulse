import { Assets } from "../pixi.js";

export async function getAssets() {
    return {
        pointTexture: await Assets.load("./assets/drawing.png"),
        trailTexture: await Assets.load("./assets/trail1.png"),
    };
}
