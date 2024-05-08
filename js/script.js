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

   async  function main(){

       // :: Get Data ::
       let data = await getData();
       // ::::App initialization ::: 
       let appParams = {
           width: mapSize.x,
           height: mapSize.y,
           backgroundAlpha: config.general_settings.app.canvas_background_alpha,
       }
   
       const app = new Application();
       await app.init(appParams);
   
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
       map.on('move' , ()=> {
           onMapMove();
   
       }); 
   
       map.on('moveend' , ()=> {
           onMapMoveEnd();
       }); 
   
       app.ticker.maxFPS = config.general_settings.app.maxFPS;
       app.ticker.minFPS = config.general_settings.app.minFPS;
   // :::: Canvas Loop  ::::
       app.ticker.add((time)=> {
            update(time,app);
       });
   
   
    }

  (async ()=> {
    if(config){
        main(config);
    }
  })();


