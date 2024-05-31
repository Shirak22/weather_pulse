function radians (angle){
    return angle * Math.PI/180;
}

function random(y,x){
    return Math.random() * (y - x ) + x ; 
}




function drawBounds (draw,geo_coordinates) {
    let pixel_coordinates = map.latLngToContainerPoint(geo_coordinates); 
    draw.circle(pixel_coordinates.x,pixel_coordinates.y, 12)
    draw.fill(0xff0055);

}

function drawLine(draw,pos1,pos2){
    let pixel_coordinates_pos1 = map.latLngToContainerPoint(pos1); 
    let pixel_coordinates_pos2 = map.latLngToContainerPoint(pos2);
    draw.moveTo(pixel_coordinates_pos1.x,pixel_coordinates_pos1.y); 
    draw.lineTo(pixel_coordinates_pos2.x, pixel_coordinates_pos2.y); 
    draw.stroke({width: 2, color: 0xff0055 }) 

}

function point(draw,pos){
    let pixel_coordinates_pos = map.latLngToContainerPoint(pos); 
    draw.circle(pixel_coordinates_pos.x,pixel_coordinates_pos.y, 2); 
    draw.fill(0x222222);

}

