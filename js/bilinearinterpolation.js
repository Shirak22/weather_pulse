function bilinearInterpolation(x, y, sortedCoords) {
    // Find the four nearest points
    let p1, p2, p3, p4;

    // Calculate distances from the target point
    sortedCoords.forEach(point => {
        let distSquared = Math.pow(point.pixel[0] - x, 2) + Math.pow(point.pixel[1] - y, 2);

        if (!p1 || distSquared < p1.distSquared) {
            p4 = p3;
            p3 = p2;
            p2 = p1;
            p1 = { point: point, distSquared: distSquared };
        } else if (!p2 || distSquared < p2.distSquared) {
            p4 = p3;
            p3 = p2;
            p2 = { point: point, distSquared: distSquared };
        } else if (!p3 || distSquared < p3.distSquared) {
            p4 = p3;
            p3 = { point: point, distSquared: distSquared };
        } else if (!p4 || distSquared < p4.distSquared) {
            p4 = { point: point, distSquared: distSquared };
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

    //convert from degrees to radians 
    let windDirectionRad1 = radians(p1.point.windDirection); 
    let windDirectionRad2 = radians(p2.point.windDirection); 
    let windDirectionRad3 = radians(p3.point.windDirection); 
    let windDirectionRad4 = radians(p4.point.windDirection); 

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
    let xR = x1 +x2+x3+x4; 
    let yR = y1+y2+y3+y4; 
    
    // convertback to polar coordinates. 
    let interpolatedWindDirection = Math.atan2(yR,xR) * 180 /Math.PI;
    if(interpolatedWindDirection < 0 ) {
        interpolatedWindDirection +=360; 
    }  
  

    //let interpolatedWindDirection = w1 * (p1.point.windDirection) + w2 * (p2.point.windDirection) + w3 * (p3.point.windDirection) + w4 * (p4.point.windDirection);

    return  interpolatedWindDirection ;
}
