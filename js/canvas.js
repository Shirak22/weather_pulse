let emitter;
let points;
let prevSelectedTime;
let fields;
let mousePos;
let pointer;
let ctx;
// let heatmap; 
let heatmapRes = 30;
let fieldsResolution = 5;
let heatMapAlpha = .4
// Dom elements 
let particleTail_slider;
let particleSpeed_slider;
let geoPoints_checkbox;
let colorize_checkbox;
let windAnimation_checkbox;
let temp_checkbox; 

let text = new Text("Pointer info", {
    fill: "#fff",
    fontFamily: "arial",
    fontSize: 30
});
//pointer info pos
text.position.set(20, 90);



// setup function called one time in script.js here goes all the initializations  
async function setup({ app, data, textures }) {
    // console.log('%c :::Setup::: ', 'font-weight: bold; color: #ff0055');
    //activate the mouse event on the screen. to get later the mouse position 
    app.stage.eventMode = "static";
    app.stage.hitArea = app.screen;

    prevSelectedTime = selectedTime;

    ctx = new Graphics();
    app.stage.addChild(ctx);


    
    fields = new Fields(fieldsResolution);
    fields.setData(data);
    fields.init(app.screen.width, app.screen.height);
    fields.updateData();
    fields.createFields();

   
        

    // const pixelTexture = await Texture.WHITE;
    // heatmap = new Heatmap(5,pixelTexture,fields);
    // heatmap.init(app.screen.width, app.screen.height); 
    // heatmap.draw(); 

    // app.stage.addChild(heatmap.container);
    
    // console.log(heatmap);



    //wind particle animation 
    emitter = new Emitter(textures.trailTexture, app.screen.width, app.screen.height);
    emitter.setData(data);
    emitter.updateData();
    emitter.init(fields);
    app.stage.addChild(emitter.container);



    pointerMovment(fields);
    controls();
    geoPoints(textures.pointTexture, data, app);

    app.stage.addChild(text);


}



// the update function is the Ticker in PIXIJS, called frequently, here goes all the code that needs to be updated all the time. 
async function update(time, app) {
    // console.log('%c :::Update::: ', 'font-weight: bold; color: #ff0055');
    //check if the the data has been update to update all renders
    if (prevSelectedTime !== selectedTime) {
        ctx.clear();
        console.log("changed");
        prevSelectedTime = selectedTime;
        emitter.freeTheContainer();
        app.stage.removeChild(emitter.container);

        data = await getData(selectedTime);
        fields.setData(data);
        fields.updateData();
        fields.update();
        emitter.setData(data);
        emitter.init(fields);

        drawHeatMap(app.screen.width, app.screen.height, heatmapRes, fields.resolution, fields.cols, fields.gridsArray);

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
    
    if (temp_checkbox.getValue()) {
        drawHeatMap(app.screen.width, app.screen.height, heatmapRes, fields.resolution, fields.cols, fields.gridsArray);
    } else {
        ctx.clear();
    }
   

}



function onMapMove() {
    // console.log('%c :::On map move::: ', 'font-weight: bold; color: #ff0055');


    // drawHeatMap(app.screen.width, app.screen.height, 10, fields.resolution, fields.cols, fields.gridsArray);

}


function onMapMoveEnd() {
    // // console.log('%c :::On map move end ::: ', 'font-weight: bold; color: #ff0055');
    fields.updateData();
    fields.update();
    // ctx.clear();
    // drawHeatMap(app.screen.width, app.screen.height, 40, fields.resolution, fields.cols, fields.gridsArray);
    // heatmap.update(fields);
    // temp checkbox 
   
}



//------------------------------------------------------------------

function pointerMovment(fields) {

    //mouse pointer
    pointer = new Graphics();
    app.stage.addChild(pointer);
    app.stage.addEventListener("pointermove", (e) => {

        mousePos = e.global;
        let fieldsPosx =   Math.floor(mousePos.x / fields.resolution); //convert to fields resolution 
        let fieldsPosy = Math.floor(mousePos.y / fields.resolution); //convert to fields resolution 

            let index = fieldsPosx + fieldsPosy * fields.cols;
            let temp = fields.gridsArray[index]?.blerp.temp_data;
            let ws = fields.gridsArray[index]?.blerp.wind_speed;
            let wd = fields.gridsArray[index]?.blerp.wind_direction;

        pointer.clear();
        pointer.rect(fields.gridsArray[index].pos.x, fields.gridsArray[index].pos.y,fields.resolution,fields.resolution); 
        text.text = `WD: ${wd.toFixed(3)}°   \n WS: ${(ws).toFixed(1)} m/s \n T: ${(temp).toFixed(2)}˚C `;
        pointer.fill();

    });
}

function controls() {
    // Controls( inputElementID , OutputElementID )  
    particleTail_slider = new Controls("particle_tail", "particle_tail-length");
    particleSpeed_slider = new Controls("particle_speed_factor", "particle_tail-speed");
    geoPoints_checkbox = new Controls("geopoints_view", "geopoints_view");
    colorize_checkbox = new Controls("particle_colorize", "particle_colorize");
    windAnimation_checkbox = new Controls("parameters_wind", "parameters_wind");
    temp_checkbox = new Controls("parameters_tempreture", "parameters_tempreture");
}


function geoPoints(textures, data, app) {
    // draw the coordinates 
    points = new GeoPoints(textures, data, app);
    points.fill();
}



// the drawing resolution should not be less then the fields resolution

function drawHeatMap(width, height, res, fieldsRes, fieldsCols, gridsArray) {
    ctx.clear();
    let cols = Math.floor(width / res);
    let rows = Math.floor(height / res);


    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let x = col;
            let y = row;

            let fieldsPosx = (col * res) / fieldsRes; //convert to fields resolution 
            let fieldsPosy = (row * res) / fieldsRes; //convert to fields resolution 

            index = fieldsPosx + fieldsPosy * fieldsCols;
            let temp = gridsArray[index].blerp.temp_data;

            let color = 0xffffff;

            ctx.rect(x * res, y * res, res, res)
            if (temp < 10) {
                color = 0x0044ff;
            }else if (temp > 10 && temp < 12) {
                color = 0xff0000;
            } else if (temp >= 12 && temp < 15) {
                color = 0xff6655;
            } else if (temp >= 15 && temp < 17) {
                color = 0xff7744;
            } else if (temp >= 17 && temp < 19) {
                color = 0xff9933;
            } else if (temp >= 19 && temp < 21) {
                color = 0xffaa22;
            } else if (temp >= 21 && temp < 23) {
                color = 0xffee11;
            } else if (temp >= 23 && temp < 27) {
                color = 0xffff99;
            }else if(temp > 30){
                color = 0xff0099
            }
            // ctx.stroke({ color });
            ctx.fill( color );
            ctx.alpha = heatMapAlpha; 


        }

    }
}