let emitter;
let points; 
let ctx; 
    // --Get SMHI data 
    // --get the geo boundries 
    // --get the pixel boundries 
    // --make the particles be generated in the boundries
    // --make the particles move in the screen not outside screen boundries 
    // --make the particles movment based on the wind direction interpolation 




// setup function called one time in script.js here goes all the initializations  
async function setup({app,data,textures}){
    console.log('%c :::Setup::: ', 'font-weight: bold; color: #ff0055');

    ctx = new Graphics();

    boundPoint(ctx,southEast);
    boundPoint(ctx,southWest);
    boundPoint(ctx,northEast);
    boundPoint(ctx,northWest);
    ctx.fill();

    app.stage.addChild(ctx); 
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
    emitter.bounds();
    ctx.clear();
    boundPoint(ctx,southEast);
    boundPoint(ctx,southWest);
    boundPoint(ctx,northEast);
    boundPoint(ctx,northWest);
    ctx.fill(0xff0055);
}


function onMapMoveEnd () {
    console.log('%c :::On map move end ::: ', 'font-weight: bold; color: #ff0055');

}

function boundPoint(ctx,boundPoint){
    let latlng = L.latLng(boundPoint.lat,boundPoint.lng); 
    let bounds = map.latLngToContainerPoint(latlng);
    ctx.circle(bounds.x,bounds.y,10);
}