class GeoPoint extends Sprite {
    constructor(GeoPoints,coords){
        super(GeoPoints.texture); 
        this.GeoPoints = GeoPoints; 
        this.tint = this.GeoPoints.tint;
        this.coords = coords; 
        this.visible = false;
        this.scale.set(1); 
        this.pixelPos; 

    }


    draw(){
       this.visible = true;
        this.pixelPos = toPixel(this.coords); 
        this.x = this.pixelPos.x ; 
        this.y = this.pixelPos.y;
       
    }


    update() {
        this.visible = true;
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
        this.tint = 0xff0033; 
        this.pointsPool = new Container();
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


    draw(){
        this.fill();
        for(let i=0; i < this.pointsPool.children.length; i++){
            this.pointsPool.children[i].draw();
        }


    }

    update(){
        for(let i=0; i < this.pointsPool.children.length; i++){
            this.pointsPool.children[i].update(); 
        }

    }
}