//https://opendata-download-metfcst.smhi.se/api/category/pmp3gExt/version/2/validtime.json

const validTimes_URL = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/validtime.json`; 

const openData_settings = {
    parameter: "wd",
    downSample: "4",
}

const getValidTimes = async ()=> {
    const res = await fetch(validTimes_URL);
    const data = await res.json();
    return data.validTime;
}


const getData = async ()=> {
    let validTimes = await getValidTimes();
    let validTime = validTimes[2].replaceAll("-","").replaceAll(":","");
    const url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/multipoint/validtime/${validTime}/parameter/${openData_settings.parameter}/leveltype/hl/level/10/data.json?downsample=${openData_settings.downSample}`
    const res = await fetch(url);
    const data = await res.json();
    
    let rasterPoints = {
        approvedTime: data.approvedTime,
        coordinates: data.geometry.coordinates,
        wind_direction: data.timeSeries[0].parameters[0].values
    }; 
    return rasterPoints;



    
}
