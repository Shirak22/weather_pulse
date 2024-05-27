let initialZoom = config.general_settings.map.initialZoom;

let southWest = L.latLng(...config.general_settings.map.bounds.southWest),
    northEast = L.latLng(...config.general_settings.map.bounds.northEast),
    northWest = L.latLng(...config.general_settings.map.bounds.northWest),
    southEast = L.latLng(...config.general_settings.map.bounds.southEast),
    
    bounds = L.latLngBounds(southWest,northEast);
const map = L.map("map",{
    maxBounds: bounds,   // Then add it here..
    maxZoom: config.general_settings.map.maxZoom,
    minZoom: config.general_settings.map.minZoom,
    zoomControl:false,
}).setView([55.5124, 16.1234], initialZoom);


// let tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

let tile2 = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
	attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png',
}).addTo(map);


var borders = L.tileLayer.wms("https://wts-tst.smhi.se/mom.map/service?", {
    layers: 'edm:countryborders_world_4326_bw',
    format: 'image/png',
    transparent: true,
    attribution: "",
}).addTo(map);

const mapSize = map.getSize();

function toPixel(coordinates){
    let latLng = L.latLng(coordinates[1],coordinates[0]);
    return  map.latLngToContainerPoint(latLng);
}



// https://wts.smhi.se/mom.map?LAYERS=edm%3Acountryborders_world_4326_bw&FORMAT=image%2Fpng&TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&SRS=EPSG%3A900913&BBOX=10018754.17,0,20037508.34,10018754.17&WIDTH=256&HEIGHT=256

//https://wpt-wts-tst.smhi.se/mom.map/service?

