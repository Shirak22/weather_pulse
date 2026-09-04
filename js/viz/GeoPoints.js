import { Sprite, Container } from "../pixi.js";
import { config } from "../config.js";

class GeoPoint extends Sprite {
    constructor(geoPoints, coords) {
        super(geoPoints.texture);
        this.geoPoints = geoPoints;
        this.tint = config.geoPoints.color;
        this.coords = coords;
        this.visible = config.geoPoints.show;
        this.scale.set(config.geoPoints.size);
    }

    update() {
        const pixelPos = this.geoPoints.mapView.toPixel(this.coords);
        this.x = pixelPos.x;
        this.y = pixelPos.y;
    }
}

/**
 * Raster diagnostic dots. Positions update only when draw(true) runs / map moves.
 */
export class GeoPoints {
    constructor(texture, data, app, mapView) {
        this.texture = texture;
        this.data = data;
        this.app = app;
        this.mapView = mapView;
        this.pointsPool = new Container();
        this.visibility = false;
    }

    fill() {
        for (let i = 0; i < this.data.coordinates.length; i++) {
            this.pointsPool.addChild(new GeoPoint(this, this.data.coordinates[i]));
        }
        this.app.stage.addChild(this.pointsPool);
    }

    setData(data) {
        this.data = data;
        this.pointsPool.removeChildren().forEach((c) => c.destroy());
        for (let i = 0; i < this.data.coordinates.length; i++) {
            this.pointsPool.addChild(new GeoPoint(this, this.data.coordinates[i]));
        }
    }

    draw(visible) {
        this.visibility = visible;
        const children = this.pointsPool.children;
        for (let i = 0; i < children.length; i++) {
            children[i].visible = this.visibility;
            if (this.visibility) children[i].update();
        }
    }

    /** After pan/zoom — only if visible. */
    refreshPositions() {
        if (!this.visibility) return;
        const children = this.pointsPool.children;
        for (let i = 0; i < children.length; i++) {
            children[i].update();
        }
    }
}
