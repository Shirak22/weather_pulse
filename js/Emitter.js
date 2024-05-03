class Emitter {
    constructor(texture,width,height){
        this.texture = texture; 
        this.width = width; 
        this.height = height; 
        this.container = new Container();
        this.data; 
        this.scaleFactor = 1 ; 
        this.numOfParticles = 2 ; 
        this.numOfMeshPoints = 10; 
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
    }

    updateData(){
        console.log(this.data)
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
        this.container.children.forEach(particle => {
            particle.edges();
            particle.update(delta);
        })        
    
    }

}