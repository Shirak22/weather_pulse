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
        this.insideTheScreen = true; 

        this.velocity = {
            x:1,
            y:1 
        };

        this.trailHead = this.emitter.trailHead; 
        this.history = []; 
        this.points[this.trailHead].x = random(this.emitter.verticalBounds.B, this.emitter.verticalBounds.A);
        this.points[this.trailHead].y = random(this.emitter.horizontalBounds.B, this.emitter.horizontalBounds.A);
    
        this.counter = 0; 
        this.maxLife = random(100,50);
        this.fade = 10; 
        this.scale.set(this.emitter.scaleFactor);
        this.visible = true;
    }


    positionHistory() {
        this.history.push(new Point(this.points[this.trailHead].x, this.points[this.trailHead].y));
        if (this.history.length > this.points.length) {
            this.history.shift();
        }
    }

    edges(){
        let head = this.points[this.trailHead]; 

        if(head.x *  this.emitter.scaleFactor  > this.emitter.verticalBounds.A && 
           head.x * this.emitter.scaleFactor  < this.emitter.verticalBounds.B  &&
           head.y * this.emitter.scaleFactor  > this.emitter.horizontalBounds.A && 
           head.y  * this.emitter.scaleFactor  < this.emitter.horizontalBounds.B ){
            this.insideBounds = true;
        }else {

            this.insideBounds = false ; 
        }
    
    
        if(head.x * this.emitter.scaleFactor > 0 && head.x * this.emitter.scaleFactor  < this.emitter.width &&
            head.y * this.emitter.scaleFactor > 0 && head.y * this.emitter.scaleFactor < this.emitter.height){
                this.insideTheScreen = true; 
        }else{
            this.insideTheScreen = false; 
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


    resetHistory(){
        // reset the the trail to follow the head 
        for (let i = 0; i < this.history.length; i++) {
            this.history[i].x =  this.points[this.trailHead].x; 
            this.history[i].y =  this.points[this.trailHead].y ; 
        }
    }



    update(delta){
        this.counter++; 

        let angle = bilinearInterpolation(this.points[this.trailHead].x *  this.emitter.scaleFactor  ,this.points[this.trailHead].y* this.emitter.scaleFactor ,this.emitter.data); 
        this.points[this.trailHead].x += this.velocity.x * delta * Math.cos(radians(angle));
        this.points[this.trailHead].y += this.velocity.y * delta * Math.sin(radians(angle));
        
        
        
        if (!this.insideBounds) {
            this.points[this.trailHead].x = random(this.emitter.verticalBounds.B, this.emitter.verticalBounds.A) / this.emitter.scaleFactor ;
            this.points[this.trailHead].y = random(this.emitter.horizontalBounds.B, this.emitter.horizontalBounds.A) /  this.emitter.scaleFactor   ;
            this.resetHistory();  

        }

        if(!this.insideTheScreen){
            this.points[this.trailHead].x = random(this.emitter.width  , 0) / this.emitter.scaleFactor ;
            this.points[this.trailHead].y = random(this.emitter.height , 0) / this.emitter.scaleFactor ;
            this.resetHistory(); 
        }


        this.alpha = this.fade/10; 
        

        

        // apply the limit of particle life 
        if(this.counter > this.maxLife && this.counter < this.maxLife + 50){
            this.fade--; 
        }else if(this.counter > this.maxLife + 50){
            this.visible = true; 
            this.counter = 0;
            this.fade = 7;  
            this.points[this.trailHead].x = random(this.emitter.verticalBounds.B, this.emitter.verticalBounds.A) /  this.emitter.scaleFactor ;
            this.points[this.trailHead].y = random(this.emitter.horizontalBounds.B, this.emitter.horizontalBounds.A) / this.emitter.scaleFactor ;
            
            this.resetHistory(); 
        }
        
        this.positionHistory();
        this.movePoints();
    }

    
}