let validTimes; 
let selectedTime; 
let timeline_days;

const SMHI_BASE = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1`;
const times_URL = `${SMHI_BASE}/times.json`;

const openData_settings = {
    downSample: config.general_settings.data.downSample,
}

const getValidTimes = async ()=> {
    const res = await fetch(times_URL);
    if (!res.ok) throw new Error(`SMHI times failed: ${res.status}`);
    const data = await res.json();
    return data.time;
}

const getData = async (time)=> {
    let validTime = time.replaceAll("-","").replaceAll(":","");
    const ds = openData_settings.downSample;

    const coordinates_url = `${SMHI_BASE}/geotype/multipoint.json?downsample=${ds}`;
    const windDirection_url = `${SMHI_BASE}/geotype/multipoint/time/${validTime}/parameter/wind_from_direction/data.json?downsample=${ds}&with-geo=false`;
    const windspeed_url = `${SMHI_BASE}/geotype/multipoint/time/${validTime}/parameter/wind_speed/data.json?downsample=${ds}&with-geo=false`;
    const temp_url = `${SMHI_BASE}/geotype/multipoint/time/${validTime}/parameter/air_temperature/data.json?downsample=${ds}&with-geo=false`;

    const [coordinates_response, windDirection_response, windSpeed_response, temp_response] = await Promise.all([
        fetch(coordinates_url),
        fetch(windDirection_url),
        fetch(windspeed_url),
        fetch(temp_url),
    ]);

    for (const [name, res] of [
        ["coordinates", coordinates_response],
        ["wind_from_direction", windDirection_response],
        ["wind_speed", windSpeed_response],
        ["air_temperature", temp_response],
    ]) {
        if (!res.ok) throw new Error(`SMHI ${name} failed: ${res.status}`);
    }

    const coordinates_data = await coordinates_response.json();
    const windDirection_data = await windDirection_response.json();
    const windSpeed_data = await windSpeed_response.json();
    const temp_data = await temp_response.json();

    const coordinates =
        coordinates_data.coordinates ??
        coordinates_data.geometry?.coordinates;

    let rasterPoints = {
        validTime,
        coordinates,
        wind_direction: windDirection_data.timeSeries[0].data.wind_from_direction,
        wind_speed: windSpeed_data.timeSeries[0].data.wind_speed,
        temp_data: temp_data.timeSeries[0].data.air_temperature,
    }; 


    let dataInfo = new Controls("dataInfo", "dataInfo");

    let dataInfo_content = `
           <h2 class="sub_title">Data info</h2>
           <section class="sub_settings">
               <p>date: <span>${new Date(time).getFullYear()}-${new Date(time).getMonth() + 1}-${new Date(time).getDate()}</span></p>
           </section>
           <section class="sub_settings">
               <p> Total geo points: <span>${rasterPoints.coordinates.length}</span></p>
           </section>
           
        `;


       dataInfo.setContent(dataInfo_content);

      
    return rasterPoints;
    
}
