class Heatmap_Pixel extends Sprite {
    constructor(texture,tint){
        super(texture); 
        this.tint = tint;
    }

}


class Heatmap {
    constructor(res,texture,fields){
        this.fields = fields; 
        this.res = res; 
        this.cols; 
        this.rows;
        this.tint;
        this.texture = texture; 
        this.container = new Container();
    }   

    init(width, height){
         this.cols = Math.floor(width / this.res);
         this.rows = Math.floor(height / this.res);
    }

    draw(){
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                let x = col* this.res;
                let y = row * this.res;
    
                let fieldsPosx = (col * this.res) / this.fields.resolution; //convert to fields resolution 
                let fieldsPosy = (row * this.res) / this.fields.resolution; //convert to fields resolution 
    
                index = fieldsPosx + fieldsPosy * this.fields.cols;
                let temp = this.fields.gridsArray[index].blerp.temp_data;
                    let pixel = new Heatmap_Pixel(this.texture,this.tint); 
                        pixel.position.set(x,y); 
                    this.container.addChild(); 


                if (temp > 10 && temp < 12) {
                    this.tint = 0xff0099;
                } else if (temp >= 12 && temp < 15) {
                    this.tint = 0xff6655;
                } else if (temp >= 15 && temp < 17) {
                    this.tint = 0xff7744;
                } else if (temp >= 17 && temp < 19) {
                    this.tint = 0xff9933;
                } else if (temp >= 19 && temp < 21) {
                    this.tint = 0xffaa22;
                } else if (temp >= 21 && temp < 23) {
                    this.tint = 0xffee11;
                } else if (temp >= 23 && temp < 27) {
                    this.tint = 0xffff99;
                }
    
            }
    
        }
    }
    
}


function drawHeatMap(width, height, res, fieldsRes, fieldsCols, gridsArray) {
    let cols = Math.floor(width / res);
    let rows = Math.floor(height / res);


   
}