let emitter;
let points; 
    // --Get SMHI data 
    // --get the geo boundries 
    // --get the pixel boundries 
    // --make the particles be generated in the boundries
    // --make the particles move in the screen not outside screen boundries 
    // --make the particles movment based on the wind direction interpolation 




// setup function called one time in script.js here goes all the initializations  
async function setup({app,data,textures}){
    console.log('%c :::Setup::: ', 'font-weight: bold; color: #ff0055');



    emitter = new Emitter(textures.trailTexture,app.screen.width, app.screen.height);
    emitter.init(data);
    emitter.addToStage(app);
    
    // draw the coordinates 
    points = new GeoPoints(textures.pointTexture, data,app);
    points.draw(); 

}



// the update function is the Ticker in PIXIJS, called frequently, here goes all the code that needs to be updated all the time. 
function update(time,app){
    console.log('%c :::Update::: ', 'font-weight: bold; color: #ff0055');
    
    emitter.update(time.deltaTime);
}



function onMapMove (){
    console.log('%c :::On map move::: ', 'font-weight: bold; color: #ff0055');
    points.update();
}


function onMapMoveEnd () {
    console.log('%c :::On map move end ::: ', 'font-weight: bold; color: #ff0055');

}

