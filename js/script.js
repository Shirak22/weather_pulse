// Get OpenData 
// Bilinear Interpolation 
// particle system to simulate the wind 
// - render the particles flow on the map 
// - move the particles based on the interpolated poistion
// - render trails to particles 
// - make the particles velocity change with the wind speed changes 
// get more parameters. 
// create Time slider
// create beautiful UI


(async () => {
    // :: Get Data ::
    let data = await getData();
    let windDirectionArray = data.wind_direction; 
    let coordinates = data.coordinates; 
    
    
    // ::::App initialization ::: 
    let appParams = {
        width: mapSize.x,
        height: mapSize.y,
        backgroundAlpha:0,

    }

    const app = new Application();
    await app.init(appParams);

    app.view.setAttribute("id", "myCanvas");
    document.getElementById("map").appendChild(app.canvas);

// :::: Canvas Drawing  ::::

    setup(app,getAssets);

   
// ::: Map move ::: 
    map.on('move' , onMapMove); 


// :::: Canvas Loop  ::::
    app.ticker.add(update);

})();


