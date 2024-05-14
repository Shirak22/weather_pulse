class Emitter {
    constructor(texture,width,height){
        this.texture = texture; 
        this.width = width; 
        this.height = height; 
        this.container = new Container();
        this.data; 
        this.numOfParticles = config.windParticles.numOfParticles ; 
        this.numOfMeshPoints = config.windParticles.numOfMeshPoints; 
        this.tint = config.windParticles.color;
        this.trailHead = this.numOfMeshPoints - 1; 
        this.scaleFactor = config.windParticles.scale;
        this.verticalBounds = {
            A: 0, 
            B: 0
        }
        this.horizontalBounds = {
            A:0,
            B:0
        }
        
    }

    init(data){
        this.data = data;
        this.getBoundries();
        for (let i = 0; i < this.numOfParticles; i++) {
            let points = [];
            for (let j = 0; j < this.numOfMeshPoints; j++) {
                points.push(new Point(this.width/2,this.height/2)); 
            }
            let particle = new Particle(this,points); 
            this.container.addChild(particle); 
        }


    }

    getBoundries(){
         // get the Geo points area bounds, pnp 
         let NE = L.latLng(northEast.lat,northEast.lng); 
         let NEP = map.latLngToContainerPoint(NE);

         let NW = L.latLng(northWest.lat,northWest.lng); 
         let NWP = map.latLngToContainerPoint(NW);

         let SE = L.latLng(southEast.lat,southEast.lng); 
         let SEP = map.latLngToContainerPoint(SE);

         let SW = L.latLng(southWest.lat,southWest.lng); 
         let SWP = map.latLngToContainerPoint(SW);

        this.verticalBounds.A = NWP.x ; 
        this.verticalBounds.B = NEP.x ;
        this.horizontalBounds.A = NWP.y ;  
        this.horizontalBounds.B = SWP.y ;
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
        this.getBoundries();

        this.container.children.forEach(particle => {
            particle.update(delta);
            particle.edges();

        })        
    
    }

}