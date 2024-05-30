let emitter;
let points;
let prevSelectedTime;
let fields;
let mousePos;
let arr;
let ctx;
let pointer;


// Dom elements 
let particleTail_slider;
let particleSpeed_slider;
let geoPoints_checkbox;
let colorize_checkbox;
let windAnimation_checkbox;

let text = new Text("Pointer info",{
    fill:"#fff" ,
    fontFamily:"arial",
    fontSize: 30
}); 
//pointer info pos
text.position.set(20,90);



// setup function called one time in script.js here goes all the initializations  
async function setup({ app, data, textures }) {
    console.log('%c :::Setup::: ', 'font-weight: bold; color: #ff0055');
    prevSelectedTime = selectedTime;

    app.stage.eventMode = "static";
    app.stage.hitArea = app.screen; 
  
    


 
        
   


    //wind particle animation 
    emitter = new Emitter(textures.trailTexture, app.screen.width, app.screen.height);
    emitter.setData(data);
    emitter.updateData(); 
    emitter.init(fields);
    app.stage.addChild(emitter.container);

  

    pointerMovment();
    controls();
    geoPoints(textures.pointTexture, data, app);

    app.stage.addChild(text);
   

}



// the update function is the Ticker in PIXIJS, called frequently, here goes all the code that needs to be updated all the time. 
async function update(time, app) {
    console.log('%c :::Update::: ', 'font-weight: bold; color: #ff0055');

    if (prevSelectedTime !== selectedTime) {

        console.log("changed");
        prevSelectedTime = selectedTime;
        emitter.freeTheContainer();
        app.stage.removeChild(emitter.container);

        data = await getData(selectedTime);
        emitter.setData(data);
        emitter.init(fields);
    }



    // Wind particles control 
    if (windAnimation_checkbox.getValue()) {
        if (!app.stage.children.includes(emitter.container)) {
            app.stage.addChild(emitter.container);
            console.log("emitter container added");
        }

        emitter.update(time.deltaTime);
        // controls
        emitter.tailLength(particleTail_slider.getValue());
        emitter.speed(particleSpeed_slider.getValue());
        emitter.colorize(colorize_checkbox.getValue());
    } else {
        app.stage.removeChild(emitter.container);
    }


    // Geo points control 
    points.draw(geoPoints_checkbox.getValue());

}



function onMapMove() {
    console.log('%c :::On map move::: ', 'font-weight: bold; color: #ff0055');



}


function onMapMoveEnd() {
    console.log('%c :::On map move end ::: ', 'font-weight: bold; color: #ff0055');
 
}



//------------------------------------------------------------------

function pointerMovment(){
    
        //mouse pointer
        pointer = new Graphics();
        app.stage.addChild(pointer); 
        app.stage.addEventListener("pointermove",(e)=> {
            
            mousePos = e.global;
            
            // get the index of flowfields array
            let coords= toGeoPoint(Math.floor(mousePos.x  / fields.res),Math.floor(mousePos.y  / fields.res));
            console.log(coords); 
            let index =  Math.floor(coords.lng) + Math.floor(coords.lat) * fields.res; 
            // let index =  coords.lng + coords.lat * fields.res; 
            // pointer.clear();
            // pointer.rect(arr[index].pos.col,arr[index].pos.row,fields.cellSize,fields.cellSize); 
            // text.text = `WD: ${(arr[index].windDirection).toFixed(3)}°   \n WS: ${(arr[index].windSpeed).toFixed(1)} m/s \n T: ${(arr[index].temp).toFixed(2)}˚C `;
            // pointer.fill();

        });
}

function controls(){
     // Controls( inputElementID , OutputElementID )  
     particleTail_slider = new Controls("particle_tail", "particle_tail-length");
     particleSpeed_slider = new Controls("particle_speed_factor", "particle_tail-speed");
     geoPoints_checkbox = new Controls("geopoints_view", "geopoints_view");
     colorize_checkbox = new Controls("particle_colorize", "particle_colorize");
     windAnimation_checkbox = new Controls("parameters_wind", "parameters_wind");
}


function geoPoints(textures, data, app){
    // draw the coordinates 
    points = new GeoPoints(textures,data,app);
    points.fill();
}