class FlowFileds {
    constructor(){
        this.cellSize = 10; 
        this.rows=0;
        this.cols=0; 
        this.data = null;
        this.gridsArray = [];  
    }


    init(width,height){
        this.cols = Math.floor(width/this.cellSize); 
        this.rows  = Math.floor(height/this.cellSize); 
    }

    setData(data){
        this.data = data; 
        let pixel = this.data.coordinates.map(coord => {
            return toPixel(coord);
        });    

        this.data = {
            ...this.data,
            pixel
        }

    }

    
    getGrids(){
        for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {

                    let y = row * this.cellSize;
                    let x = col * this.cellSize; 

                    let blerp = bilinearInterpolation(x,y, this.data);
                    let grid = {
                        pos:{
                            row:y,
                            col:x,
                        } ,
                        windDirection: blerp.wind_direction,
                        windSpeed: blerp.wind_speed,
                    }

                    this.gridsArray.push(grid); 

                }            
        }

        return this.gridsArray;
    }




}