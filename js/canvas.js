let emitter;
let points;
let mousePos; 
let prevSelectedTime; 
let fields; 

// Dom elements 
let particleTail_slider;
let particleSpeed_slider; 
let geoPoints_checkbox; 
let colorize_checkbox; 
let windAnimation_checkbox; 

let   ctx = new Text({
    text:"wind",
    style:{
        fontFamily:"arial",
        fontSize: 20,
        fill: "#eee",
    }
}); 

// setup function called one time in script.js here goes all the initializations  
async function setup({app,data,textures}){
    console.log('%c :::Setup::: ', 'font-weight: bold; color: #ff0055');
    prevSelectedTime = selectedTime;
   
    let graphic = new Graphics();
    app.stage.addChild(graphic);
    //wind info mouse track 
    //mouse track 
    app.stage.eventMode = "static"; 
    app.stage.hitArea = app.screen; 
    
    app.stage.addEventListener('pointermove', (e)=> {
    mousePos = e.global;

    ctx.x = mousePos.x + 10 ;   
    ctx.y = mousePos.y + 10;
     
    let pixeledData = data.coordinates.map(point => {
            return toPixel(point);
    });

    let fixedData = {
        ...data,
        pixel:pixeledData
    }
    let blerp = bilinearInterpolation(ctx.x,ctx.y, fixedData); 

    ctx.text = `speed: ${Math.ceil(blerp.wind_speed)} m/s \ndirection:${Math.ceil (blerp.wind_direction )}°
    `;

    });
    // app.stage.addChild(ctx);


    emitter = new Emitter(textures.trailTexture,app.screen.width, app.screen.height);

    emitter.setData(data);
    emitter.init();
    app.stage.addChild(emitter.container);



    // draw the coordinates 
    points = new GeoPoints(textures.pointTexture, data,app);    
    points.fill();



    fields = new FlowFileds();


    fields.init(app.screen.width,app.screen.height);
    fields.setData(data);
    let fieldsArray = fields.getGrids();


        for (let i = 0; i < fieldsArray.length; i++) {
            const grid = fieldsArray[i];

            graphic.rect(grid.pos.col , grid.pos.row, fields.cellSize,fields.cellSize);

            // graphic.fill(0xff0077);

            if(grid.windSpeed > 0 && grid.windSpeed <= 2 ){
                // graphic.stroke({color:0x00eeff,width:1});
                graphic.fill(0x00eeff);
            }else if(grid.windSpeed > 2 && grid.windSpeed < 5 ){
                // graphic.stroke({color:0x00aaff,width:1})
                graphic.fill(0x00aaff);
            }else if(grid.windSpeed >= 5 && grid.windSpeed < 7 ){
                // graphic.stroke({color:0xeeff77,width:1})
                graphic.fill(0xeeff77);
                
            }else if(grid.windSpeed >=7 && grid.windSpeed < 10 ){
                graphic.fill(0x00ff00);
                
                // graphic.stroke({color:0x00ff00,width:1})
            }else {
                graphic.fill(0xff0077);
                
                // graphic.stroke({color:0xff0077,width:1})
            }
            
        }
        graphic.alpha = .4;
    // Controls( inputElementID , OutputElementID )  
    particleTail_slider = new Controls("particle_tail", "particle_tail-length"); 
    particleSpeed_slider = new Controls("particle_speed_factor", "particle_tail-speed");
    geoPoints_checkbox = new Controls("geopoints_view", "geopoints_view"); 
    colorize_checkbox = new Controls("particle_colorize","particle_colorize");
    windAnimation_checkbox = new Controls("parameters_wind", "parameters_wind"); 

}



// the update function is the Ticker in PIXIJS, called frequently, here goes all the code that needs to be updated all the time. 
async function update(time,app){
    console.log('%c :::Update::: ', 'font-weight: bold; color: #ff0055');

    if(prevSelectedTime !== selectedTime){
            console.log("changed");
            prevSelectedTime = selectedTime;
            emitter.freeTheContainer(); 
            app.stage.removeChild(emitter.container);
            data = await getData(selectedTime);
            emitter.setData(data); 
            emitter.init(); 

        }




    if(windAnimation_checkbox.getValue()){
        if(!app.stage.children.includes(emitter.container)){
            app.stage.addChild(emitter.container);
            console.log("emitter container added");
        }
        emitter.update(time.deltaTime);
        // controls
        emitter.tailLength(particleTail_slider.getValue());
        emitter.speed(particleSpeed_slider.getValue());
        emitter.colorize(colorize_checkbox.getValue());
    }else {
        app.stage.removeChild(emitter.container);
    }



    points.draw(geoPoints_checkbox.getValue());

}



function onMapMove (){
    console.log('%c :::On map move::: ', 'font-weight: bold; color: #ff0055');


}


function onMapMoveEnd () {
    console.log('%c :::On map move end ::: ', 'font-weight: bold; color: #ff0055');

}

