class Emitter {
    constructor(texture,width,height){
        this.texture = texture; 
        this.width = width; 
        this.height = height; 
        this.scaleFactor = 1 ; 
        this.numOfParticles = 1 ; 
        this.numOfMeshPoints = 20; 
        this.tint = 0xff0055;
        this.pool = []; 
        this.container = new Container();
        this.trailHead = this.numOfMeshPoints - 1; 

    }

    init(){
        for (let i = 0; i < this.numOfParticles; i++) {
            let points = [];
            for (let j = 0; j < this.numOfMeshPoints; j++) {
                points.push(new Point(j*5,0)); 
            }
            let particle = new Particle(this,points); 
            this.pool.push(particle);
            this.container.addChild(particle); 
        }
    }

    

    addToStage(app){
        app.stage.addChild(this.container); 
    }

    update(delta){
        this.pool.forEach(particle => {
            particle.edges();
            particle.update(delta);
        })        
    
    }

}