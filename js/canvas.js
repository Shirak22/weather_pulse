


async function setup(app,params){
    let {pointTexture} = await params(); 

        let sprite = new Sprite(pointTexture);

        sprite.position.set(150,150);   
        sprite.scale.set(50);   

        app.stage.addChild(sprite);
        
    console.log(sprite);

}



function update(){

}




function onMapMove(){

}
