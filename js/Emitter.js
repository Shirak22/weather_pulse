class Emitter {
    constructor(texture,width,height){
        this.texture = texture; 
        this.width = width; 
        this.height = height; 
        this.container = new Container();
        this.data; 
        this.scaleFactor = 1 ; 
        this.numOfParticles = config.windParticles.numOfParticles ; 
        this.numOfMeshPoints = config.windParticles.numOfMeshPoints; 
        this.tint = 0xff0055;
        this.trailHead = this.numOfMeshPoints - 1; 

    }

    init(data){
        this.data = data;
        for (let i = 0; i < this.numOfParticles; i++) {
            let points = [];
            for (let j = 0; j < this.numOfMeshPoints; j++) {
                points.push(new Point(j*5,0)); 
            }
            let particle = new Particle(this,points); 
            this.container.addChild(particle); 
        }

        this.bounds();

    }

    bounds(){
        // 
         let NE = L.latLng(northEast.lat,northEast.lng); 
         let NEP = map.latLngToContainerPoint(NE);

         let NW = L.latLng(northWest.lat,northWest.lng); 
         let NWP = map.latLngToContainerPoint(NW);

        this.width = NEP.x;

        console.log(this.width);
    }

    updateData(){
        let pixel = this.data.coordinates.map(coord => {
            return toPixel(coord);
        });    
        this.data = {
            ...this.data,
            pixel
        }
    }

    addToStage(app){
        app.stage.addChild(this.container); 
    }


    update(delta){
        this.updateData();
        
        this.container.children.forEach(particle => {
            // particle.edges();
            particle.update(delta);
        })        
    
    }

}