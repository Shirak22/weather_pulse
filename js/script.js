let  app;


async function main(config, data) {
    // ::::App initialization ::: 
    let appParams = {
        width: mapSize.x,
        height: mapSize.y,
        backgroundAlpha: config.general_settings.app.canvas_background_alpha,
    }

    app = new Application();
    await app.init(appParams);
    console.log(selectedTime);
    app.view.setAttribute("id", "myCanvas");
    document.getElementById("map").appendChild(app.canvas);

    // ::: Get all textures :::
    let textures = await getAssets(); //getAssets() in js/textures.js

    let setupProps = {
        textures,
        app,
        data,
    }

    await setup(setupProps);



    // ::: Map movments ::: 
    map.on('move', () => {
        onMapMove();

    });

    map.on('moveend', () => {
        onMapMoveEnd();
    });

    app.ticker.maxFPS = config.general_settings.app.maxFPS;
    app.ticker.minFPS = config.general_settings.app.minFPS;
    // :::: Canvas Loop  ::::
    app.ticker.add((time) => {
        update(time, app);

    });
    
   
}



(async () => {
    if (config) {

        // :: Get Data ::
         validTimes = await getValidTimes();
         timeline_days = timeLine_days(validTimes); // retruns array of the available days and render the UI of the timeline
         selectedTime = timeline_days[0].time;
            timeline_events(selectedTime);
            let data = await getData(selectedTime);
            main(config, data);



    }
})();
