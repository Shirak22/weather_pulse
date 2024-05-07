class Particle extends MeshRope {
    constructor(Emitter,points){
        super({
            texture: Emitter.texture,
            points,
        }); 
        this.emitter = Emitter; 
        this.points = points;
        this.tint = this.emitter.tint; 
        this.insideBounds = false; 
        this.velocity = {
            x:1,
            y:1 
        };


      

        this.trailHead = this.emitter.trailHead; 
        this.history = []; 

        this.points[this.trailHead].x = random(this.emitter.verticalBounds.B, this.emitter.verticalBounds.A);
        this.points[this.trailHead].y = random(this.emitter.horizontalBounds.B, this.emitter.horizontalBounds.A);
    }


    positionHistory() {
        this.history.push(new Point(this.points[this.trailHead].x, this.points[this.trailHead].y));
        if (this.history.length > this.points.length) {
            this.history.shift();
        }
    }

    edges(){
        let head = this.points[this.trailHead]; 

        if(head.x > this.emitter.verticalBounds.A && 
           head.x < this.emitter.verticalBounds.B &&
           head.y > this.emitter.horizontalBounds.A && 
           head.y < this.emitter.horizontalBounds.B ){
            this.insideBounds = true;
        }else {

            this.insideBounds = false ; 
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

        let angle = bilinearInterpolation(this.points[this.trailHead].x,this.points[this.trailHead].y,this.emitter.data); 
            // console.log(angle);
        this.points[this.trailHead].x += this.velocity.x * delta * Math.cos(radians(angle));
        this.points[this.trailHead].y += this.velocity.y * delta * Math.sin(radians(angle));

        // this.points[this.trailHead].x += this.velocity.x * delta ;
        // this.points[this.trailHead].y += this.velocity.y * delta ;
        if (!this.insideBounds) {
            this.points[this.trailHead].x = random(this.emitter.verticalBounds.B, this.emitter.verticalBounds.A);
            this.points[this.trailHead].y = random(this.emitter.horizontalBounds.B, this.emitter.horizontalBounds.A);
        }

        this.positionHistory();
        this.movePoints();


   
    }


}