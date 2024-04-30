class Particle extends MeshRope {
    constructor(Effect, points) {
        super({
            texture: Effect.texture,
            points
        });
        this.effect = Effect;
        this.vx = 10;
        this.vy = 1;
        this.history = []; 

    }
    

    pushHistory(x,y){
        if(this.history.length > this.geometry.points.length){
            this.history.shift();
        }
        this.history.push({x ,y}); 
    }



    update(){


        let head = this.geometry.points[0]; 
        let points = this.geometry.points; 
        
        head.x += this.vx ;
        head.y += this.vy; 

        if(head.x > this.effect.width || head.x < 0){
            this.vx *= -1; 

        }

        if(head.y > this.effect.height || head.y < 0){
            this.vy *= -1; 

        }
       
        this.pushHistory(head.x, head.y);

        // bug::: the movement is not correct here.. 
         
        if(this.history){

            for(let p=1; p < points.length; p++){
                points[p].x = this.history[p]?.x ;
                points[p].y = this.history[p]?.y ;

            }
            
        }
    }


}



class Effect {
    constructor(app, texture) {
        this.app = app;
        this.height = this.app.screen.height;
        this.width = this.app.screen.width;
        this.texture = texture;
        this.points = []; 
        this.numOfParticles = 1;
        this.container = new Container();

    }



    init(points) {
        //generate particles and its mesh points, then add them to the stage to render render them on the screen. 
        // push points to point array; 
        for(let point = 0; point < 30; point++){
            this.points.push(new Point((0,0)));
        }

        this.generateParticles();
        this.app.stage .addChild(this.container);



    }


    generateParticles() {
        //push to particles to container  
        for (let i = 0; i < this.numOfParticles; i++) {
            // !warning:::  the points need to be unique for every particle. 

            let particle = new Particle(this,this.points.slice() ); // slice to make copy of the points array 
            this.container.addChild(particle);
        }

    }





    update() {   

        this.container.children.forEach(particle => {
            particle.update();

        });
    }

    reset() {

    }
}



