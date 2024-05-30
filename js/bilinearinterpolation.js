function bilinearInterpolation(x, y, data) {
    // Find the four nearest points
    let p1, p2, p3, p4;
    // Calculate distances from the target point
    data.pixel.forEach((point,index) => {
        let distSquared = Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2);
        
        if (!p1 || distSquared < p1.distSquared) {
            p4 = p3;
            p3 = p2;
            p2 = p1;
            p1 = { point: point,wind_direction: data.wind_direction[index],wind_speed:data.wind_speed[index],temp_data:data.temp_data[index], distSquared: distSquared };
        } else if (!p2 || distSquared < p2.distSquared) {
            p4 = p3;
            p3 = p2;
            p2 = { point: point,wind_direction: data.wind_direction[index],wind_speed:data.wind_speed[index],temp_data:data.temp_data[index], distSquared: distSquared };
        } else if (!p3 || distSquared < p3.distSquared) {
            p4 = p3;
            p3 = { point: point,wind_direction: data.wind_direction[index],wind_speed:data.wind_speed[index],temp_data:data.temp_data[index], distSquared: distSquared };
        } else if (!p4 || distSquared < p4.distSquared) {
            p4 = { point: point,wind_direction: data.wind_direction[index],wind_speed:data.wind_speed[index],temp_data:data.temp_data[index], distSquared: distSquared };
        }
    
    });


    // Ensure all points are found
    if (!p1 || !p2 || !p3 || !p4) {
        console.log("Some points not found");
        return;
    }


    // Interpolate wind direction 
    let w1 = 1 / p1.distSquared;
    let w2 = 1 / p2.distSquared;
    let w3 = 1 / p3.distSquared;
    let w4 = 1 / p4.distSquared;

    let totalWeight = w1 + w2 + w3 + w4;
    w1 /= totalWeight;
    w2 /= totalWeight;
    w3 /= totalWeight;
    w4 /= totalWeight;


    //wind_speed
    let wind_speed1 = w1*p1.wind_speed; 
    let wind_speed2 = w2*p2.wind_speed; 
    let wind_speed3 = w3*p3.wind_speed; 
    let wind_speed4 = w4*p4.wind_speed; 

    let wind_blerp = wind_speed1 + wind_speed2 + wind_speed3 + wind_speed4 ; 


    let temp1 = w1*p1.temp_data; 
    let temp2 = w2*p2.temp_data; 
    let temp3 = w3*p3.temp_data; 
    let temp4 = w4*p4.temp_data; 

    let temp_lerp = temp1 + temp2 +temp3+temp4; 
    //wind_direction 

    //convert from degrees to radians 
    let windDirectionRad1 = radians(p1.wind_direction);
    let windDirectionRad2 = radians(p2.wind_direction); 
    let windDirectionRad3 = radians(p3.wind_direction); 
    let windDirectionRad4 = radians(p4.wind_direction); 

    //convert from polat to Cartesian coordinates 
    let x1 = w1* Math.cos(windDirectionRad1); 
    let y1 = w1* Math.sin(windDirectionRad1); 
    let x2 = w2* Math.cos(windDirectionRad2); 
    let y2 = w2* Math.sin(windDirectionRad2); 
    let x3 = w3* Math.cos(windDirectionRad3); 
    let y3 = w3* Math.sin(windDirectionRad3); 
    let x4 = w4* Math.cos(windDirectionRad4); 
    let y4 = w4* Math.sin(windDirectionRad4);

    // perform the interpolation in Cartesian coordinates 
    let xR = x1+x2+x3+x4; 
    let yR = y1+y2+y3+y4; 
    
    // convertback to polar coordinates. 
    let interpolatedWindDirection =  Math.atan2(yR,xR) * 180 /Math.PI; 
    if(interpolatedWindDirection < 0 ) {
        interpolatedWindDirection +=360; 
    }  
    
    
        
    //let interpolatedWindDirection = w1 * (p1.point.windDirection) + w2 * (p2.point.windDirection) + w3 * (p3.point.windDirection) + w4 * (p4.point.windDirection);
    return  {wind_direction:interpolatedWindDirection, wind_speed: wind_blerp, temp_data:temp_lerp};
}
