


   async  function main(){
    let selectedTime;  
           // :: Get Data ::
        let validTimes = await getValidTimes(); 
        selectedTime = validTimes[0];
         let data = await getData(selectedTime);

         timeLine_functionality(validTimes, selectedTime);

         let dataInfo = new Controls("dataInfo","dataInfo");
        
        let dataInfo_content = `
                <h2 class="sub_title">Data info</h2>
                <section class="sub_settings">
                    <p>date & time: <span>${data.validTime}</span></p>
                </section>
                <section class="sub_settings">
                    <p> Total geo points: <span>${data.coordinates.length}</span></p>
                </section>
                
             `; 
   

    dataInfo.setContent(dataInfo_content);
    timelineEvents(data,selectedTime);

  

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


