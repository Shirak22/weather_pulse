let initialZoom = 5;

let southWest = L.latLng(52.500440,2.250475),
    northEast = L.latLng(70.740996,37.848053),
    bounds = L.latLngBounds(northEast,southWest);

const map = L.map("map",{
    maxBounds: bounds,   // Then add it here..
    maxZoom: 19,
    minZoom: 3
}).setView([55.5124, 16.1234], initialZoom);




let tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const mapSize = map.getSize();


