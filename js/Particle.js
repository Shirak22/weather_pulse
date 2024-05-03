class Particle extends MeshRope {
    constructor(Emitter,points){
        super({
            texture: Emitter.texture,
            points,
        }); 
        this.emitter = Emitter; 
        this.points = points;
        this.tint = this.emitter.tint; 
        this.velocity = {
            x:1 * Math.random()*10,
            y:1 * Math.random()*10
        };
         
        this.trailHead = this.emitter.trailHead; 
        this.history = []; 
    }


    positionHistory() {
        this.history.push(new Point(this.points[this.trailHead].x, this.points[this.trailHead].y));
        if (this.history.length > this.points.length) {
            this.history.shift();
        }
    }

    edges(){
        if(this.points[this.trailHead].x > this.emitter.width || this.points[this.trailHead].x < 0){
            this.velocity.x = -this.velocity.x;  
        }
        if(this.points[this.trailHead].y >  this.emitter.height || this.points[this.trailHead].y <  0){
            this.velocity.y = -this.velocity.y;  
        }
    
    }

    movePoints(){
        for (let i = 0; i < this.points.length; i++) {
            if(this.history[i]){
                this.points[i].x = this.history[i].x ; 
                this.points[i].y = this.history[i].y ; 
            }         
        }
    }



    update(delta){
            
        this.points[this.trailHead].x += this.velocity.x * delta;
        this.points[this.trailHead].y += this.velocity.y * delta;
        this.positionHistory();
        this.movePoints();

    }


}