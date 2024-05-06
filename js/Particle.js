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
            x:5,
            y:5 
        };
        this.maxLife = Math.floor(Math.random()*200 + 100); 
        this.pos = {
            x:Math.random()* this.emitter.width, 
            y:Math.random()* this.emitter.height
        }
        this.trailHead = this.emitter.trailHead; 
        this.history = []; 
        this.points[this.trailHead].x = this.pos.x;
        this.points[this.trailHead].y = this.pos.y;
    }


    positionHistory() {
        this.history.push(new Point(this.points[this.trailHead].x, this.points[this.trailHead].y));
        if (this.history.length > this.points.length) {
            this.history.shift();
        }
    }

    edges(){
        if(this.points[this.trailHead].x > this.emitter.width || this.points[this.trailHead].x < 0){
            this.maxLife = 0;
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
        this.maxLife -= 10; 

        let angle = bilinearInterpolation(this.points[this.trailHead].x,this.points[this.trailHead].y,this.emitter.data); 
            // console.log(angle);
        this.points[this.trailHead].x += this.velocity.x * delta * Math.cos(radians(angle));
        this.points[this.trailHead].y += this.velocity.y * delta * Math.sin(radians(angle));

        // this.points[this.trailHead].x += this.velocity.x * delta ;
        // this.points[this.trailHead].y += this.velocity.y * delta ;
        this.positionHistory();
        this.movePoints();
        if(this.maxLife < 0 ){
            this.visible = false;
            this.points[this.trailHead].x = Math.random()* this.emitter.width;
            this.points[this.trailHead].y = Math.random()* this.emitter.height;
            this.maxLife = 255; 
        }
      

        this.visible = true;
    }


}