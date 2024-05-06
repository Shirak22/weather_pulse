let initialZoom = config.general_settings.map.initialZoom;

let southWest = L.latLng(...config.general_settings.map.bounds.southWest),
    northEast = L.latLng(...config.general_settings.map.bounds.northEast),
    northWest = L.latLng(...config.general_settings.map.bounds.northWest),
    southEast = L.latLng(...config.general_settings.map.bounds.southEast),
    
    bounds = L.latLngBounds(southWest,northEast);
const map = L.map("map",{
    maxBounds: bounds,   // Then add it here..
    maxZoom: config.general_settings.map.maxZoom,
    minZoom: config.general_settings.map.minZoom
}).setView([55.5124, 16.1234], initialZoom);


let tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const mapSize = map.getSize();

function toPixel(coordinates){
    let latLng = L.latLng(coordinates[1],coordinates[0]);
    return  map.latLngToContainerPoint(latLng);
}



