let emitter; 
let trailTexture; 


    // --Get SMHI data 
    // --get the geo boundries 
    // --get the pixel boundries 
    // --make the particles be generated in the boundries
    // --make the particles move in the screen not outside screen boundries 
    // --make the particles movment based on the wind direction interpolation 




// setup function called one time in script.js here goes all the initializations  
async function setup(app,texture){
    console.log(":::setup:::");     

    trailTexture = texture;
    emitter = new Emitter(trailTexture,app.screen.width, app.screen.height);


    emitter.init();
    emitter.addToStage(app);

}



// the update function is the Ticker in PIXIJS, called frequently, here goes all the code that needs to be updated all the time. 
function update(time,app){
    console.log(":::update:::");
    

    emitter.update(time.deltaTime);
}



function onMapMove (){
    console.log(":::on map move");

}


function onMapMoveEnd () {
    console.log(":::on map move end ");
}