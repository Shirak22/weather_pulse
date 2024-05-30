//get the width and height / geo cordinates
//fix the interpolation between the geo coordinates not in pixels
// 
class FlowFileds {
    constructor(){
        this.res = 1; 
        this.rows=0;
        this.cols=0; 
        this.data = null;
        this.gridsArray = [];
    }


    init(){
          let NW = L.latLng(northWest.lat,northWest.lng); 
          let NE = L.latLng(northEast.lat,northEast.lng); 
          let SW = L.latLng(southWest.lat,southWest.lng); 

        let width = Math.sqrt(Math.pow(NW.lat - NE.lat, 2) + Math.pow(NW.lng - NE.lng, 2)) ;
        let height = Math.sqrt(Math.pow(NW.lat - SW.lat, 2) + Math.pow(NW.lng - SW.lng, 2));

            // Calculate width and height based on geodesic distance using Leaflet's distanceTo metho
        //get the pnp width and height //coordinates not pixels 
  
        this.cols = width/this.res; 
        this.rows  = height/this.res; 
    }

    setData(data){
        this.data = data; 

    }
    

    generateGrids(){

        for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {

                    let y = NW.lat + row * this.res;
                    let x = NW.lng +  col * this.res;

                    let blerp = Fields_blerp(x,y, this.data);

                    let grid = {
                        
                        pos:{
                            row:y,
                            col:x,
                        } ,
                        windDirection: blerp.wind_direction,
                        windSpeed: blerp.wind_speed,
                        temp:blerp.temp_data
                    }

                    this.gridsArray.push(grid); 
                }            
        
            }

    }

}