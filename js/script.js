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
        backgroundAlpha:.5,

    }

    const app = new Application();
    await app.init(appParams);

    app.view.setAttribute("id", "myCanvas");
    document.getElementById("map").appendChild(app.canvas);
    
    // ::: Get all textures :::
    let {pointTexture, trailTexture} = await getAssets(); //getAssets() in js/textures.js

    
    let points = [] ; 
    let numOfPoints = 20; 
    let ropeLength = 256/numOfPoints;
        for(let x = 0; x < numOfPoints; x++){
            points.push(new Point(0 , 0 )); 
        }


    let rope  = new MeshRope({texture:trailTexture, points});

    app.stage.addChild(rope);
    






// ::: Map move ::: 
    map.on('moveend' , ()=> {


    }); 


    let history = []; 
    let vx = 11; 
    let vy = 11 ;
    let ropePart = numOfPoints - 1; 
    let count = 0; 
    let visible = true; 

// :::: Canvas Loop  ::::
    app.ticker.add((time)=> {
        count += .1 ; 
        if(count > 2* Math.PI){
            count = 0 ;
            visible = !visible;  
        }
     

        points[ropePart].x += vx + Math.cos(count * time.deltaTime ) * 10; 
        points[ropePart].y += vy + Math.sin(count * time.deltaTime) *  10; 

        history.push(new Point(points[ropePart].x,points[ropePart].y));
            if(history.length > points.length) {
                history.shift();
            }


        for (let i = 0; i < points.length; i++) {
            if(history[i]){
                points[i].x = history[i].x ;
                points[i].y = history[i].y ; 
            }
            
        }   
        
        if(points[ropePart].x > app.screen.width || points[ropePart].x < 0) {
            vx = -vx ; 
        }


        if(points[ropePart].y > app.screen.height || points[ropePart].y < 0) {
            vy = -vy ; 
        }

        console.log(visible);

        if(!visible){
            rope.tint = 0xff0055; 
            
        }else {
            rope.tint = 0xffffff;
        }

    });

})();


