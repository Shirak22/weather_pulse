class Fields {
    constructor(resolution){
        this.resolution = resolution ; 
        this.cols = 0; 
        this.rows = 0;
        this.data; 
        this.pixelsCoordinats = []; 
        this.gridsArray = [];
    }

    init(width,height){

        this.cols = Math.floor(width/this.resolution); 
        this.rows = Math.floor(height/this.resolution); 
    }
    setData(data){
        this.data = data;
    }
    
    updateData(){
         this.data.pixel = this.data.coordinates.map(coord => {
            return toPixel(coord);
        });    
        


    }

    // updatePixelCoordinates(){
    //     if(this.pixelsCoordinats.length > 0 ){
    //         for (let index = 0; index < this.data.coordinates.length; index++) {
    //             let coords = toPixel(this.data.coordinates[index]); 
    //             this.pixelsCoordinats[index] = coords;  
    //        }
    //     }

    //     for (let index = 0; index < this.data.coordinates.length; index++) {
    //         let coords = toPixel(this.data.coordinates[index]);
    //         this.pixelsCoordinats.push(coords) ;
    //     }

       
    // }
    createFields(){
      
        for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {

                    let x = col * this.resolution; 
                    let y = row * this.resolution; 
                    
                    let blerp = bilinearInterpolation(x,y,this.data);

                    let field = {
                        pos:{x,y},
                        blerp
                        
                    }
                    this.gridsArray.push(field)
                }            
        
            }
    }


    update(){


        for (let index = 0; index < this.gridsArray.length; index++) {
            const field = this.gridsArray[index];
                let position = field.pos; 
                let blerp = bilinearInterpolation(position.x,position.y,this.data);
                let result = {
                    pos:{x:position.x,y:position.y},
                    blerp
                    
                }

                this.gridsArray[index] = result; 

        }
    }
}