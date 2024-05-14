//https://opendata-download-metfcst.smhi.se/api/category/pmp3gExt/version/2/validtime.json

const validTimes_URL = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/validtime.json`; 

const openData_settings = {
    downSample: config.general_settings.data.downSample,
}

const getValidTimes = async ()=> {
    const res = await fetch(validTimes_URL);
    const data = await res.json();
    return data.validTime;
}


const getData = async ()=> {
    let validTimes = await getValidTimes();
    let validTime = validTimes[3].replaceAll("-","").replaceAll(":","");


    //wind direction 
    const windDirection_url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/multipoint/validtime/${validTime}/parameter/wd/leveltype/hl/level/10/data.json?downsample=${openData_settings.downSample}`
    const windDirection_response = await fetch(windDirection_url);
    const windDirection_data = await windDirection_response.json();
    
    const windspeed_url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/multipoint/validtime/${validTime}/parameter/ws/leveltype/hl/level/10/data.json?downsample=${openData_settings.downSample}`
    const windSpeed_response = await fetch(windspeed_url);
    const windSpeed_data = await windSpeed_response.json();
    let rasterPoints = {
        validTime,
        coordinates: windDirection_data.geometry.coordinates,
        wind_direction: windDirection_data.timeSeries[0].parameters[0].values,
        wind_speed:windSpeed_data.timeSeries[0].parameters[0].values,
        
    }; 


    console.log(rasterPoints);
    return rasterPoints;
    
}




