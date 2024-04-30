class Particle extends MeshRope {
    constructor(Effect, points) {
        super({
            texture: Effect.texture,
            points:Effect.points,
        });
        this.effect = Effect;
        this.posx = 0;
        this.posy = 0;
        this.vx = 10;
        this.vy = 1;
        this.history = []; 
    }
    






}



class Effect {
    constructor(app, texture) {
        this.app = app;
        this.height = this.app.screen.height;
        this.width = this.app.screen.width;
        this.texture = texture;
        this.points = []; 
        this.numOfParticles = 2;
        this.container = new Container();
        this.count = 0; 

    }



    init() {

        //generate particles and its mesh points, then add them to the stage to render render them on the screen. 
        // push points to point array; 
        for(let point = 0; point < 10; point++){
            this.points.push(new Point((256/10) * point,0));
        }

        this.generateParticles();

        this.app.stage .addChild(this.container);



    }


    generateParticles() {
        //push to particles to container  
        for (let i = 0; i < this.numOfParticles; i++) {
            let particle = new Particle(this);
            particle.position.set(Math.random()* this.app.screen.width,Math.random()* this.app.screen.width);
            particle.visible = true;
            particle.alpha = 1; 
            this.container.addChild(particle);
        }

    }





    update() {   
        this.count += .1 ; 
        if(this.count > 6) this.count = 0; 
        this.container.children.forEach(particle => {
            particle.geometry.points.forEach((point,index) => {
                    point.y = Math.sin(this.count * index) *10; 
            });
        });
    }

    reset() {

    }
}



