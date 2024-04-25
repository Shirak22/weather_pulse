class Particle extends Sprite{
    constructor(Effect){
        super(Effect.texture);
        this.effect = Effect;
        this.texture = this.effect.texture; 
        this.x; 
        this.y;
        this.vx = this.effect.particlesSpeedX;
        this.vy = this.effect.particlesSpeedY; 
        this.anchor.set(.5); 
        this.tint = this.effect.particlesColor; 
        this.scale.set(this.effect.particlesScale);
        this.rotation = 0;
        this.history = [{x:this.x ,y:this.y}]; 
        this.line = new Graphics();
        this.effect.app.stage.addChild(this.line);
        this.count = 0; 
    }

    update(){
        this.x += this.vx ; 
        this.y += this.vy ;
        this.count++; 

        if(this.x > this.effect.width || this.x < 0 ) this.vx *= -1 ; 
        if(this.y > this.effect.height || this.y < 0 ) this.vy *= -1 ; 
        if(this.count > 2){
            this.history.push({x:this.x , y:this.y });
            this.count = 0; 
        }

        if(this.history.length > 10) {
            this.history.shift();
        }
        
        this.updateTrail();
    }

    drawTrail(){
        this.line.clear();
        this.line.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 0; i < this.history.length; i++) {
            this.line.lineTo(this.history[i].x , this.history[i].y);
            
            this.line.stroke({width:10, color: 0xff0000,alpha:i/this.history.length})            
        }
    }

    updateTrail(){
        this.drawTrail();
    }
   

}



class Effect {
    constructor(app,texture){
        this.app = app; 
        this.height = this.app.screen.height; 
        this.width = this.app.screen.width; 
        this.texture = texture;
        this.particlesColor = "#ff0055"; 
        this.particlesScale = 2 ; 
        this.particlesSpeedX = 2; 
        this.particlesSpeedY = 2; 
        this.particles = new Container();
        this.numberOfParticles = 10; 
    }   


    init(){
        for (let i = 0; i < this.numberOfParticles; i++) {
                let particle = new Particle(this); 
                particle.x = Math.random() * this.width;
                particle.y  = Math.random() * this.height; 
                this.particles.addChild(particle);            
            }


    }

    update(){
        for (let i = 0; i < this.numberOfParticles; i++) {
         let particle = this.particles.children[i]; 
         particle.update();
         particle.updateTrail();

    }

    }

    reset(){
       this.particles.removeChildren();
       this.init();
    }

    stage(){
        this.app.stage.addChild(this.particles); 
    }
    
}