class GeoPoint extends Sprite {
    constructor(GeoPoints,coords){
        super(GeoPoints.texture); 
        this.GeoPoints = GeoPoints; 
        this.tint = config.geoPoints.color;
        this.coords = coords; 
        this.visible = config.geoPoints.show;
        this.scale.set(config.geoPoints.size); 
        this.pixelPos; 

    }


    update(){
        this.pixelPos = toPixel(this.coords); 
        this.x = this.pixelPos.x ; 
        this.y = this.pixelPos.y;
    }

}



class GeoPoints {
    constructor(texture,data,app){
        this.texture = texture;
        this.data = data; 
        this.app = app;
        this.pointsPool = new Container();
        this.visibility = false; 
        this.screenBounds = {
            x:this.app.screen.width,
            y: this.app.screen.height,

        }


    }


    fill(){
        for(let i=0; i < this.data.coordinates.length; i++){
            this.pointsPool.addChild(new GeoPoint(this,this.data.coordinates[i]));
        }
        this.app.stage.addChild(this.pointsPool); 
    }

    draw(bool) {
        this.visibility = bool; 
            for (let i = 0; i < this.pointsPool.children.length; i++) {
                this.pointsPool.children[i].visible = this.visibility;
                this.pointsPool.children[i].update();
            }
      
    }

}