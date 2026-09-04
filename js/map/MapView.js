import { config } from "../config.js";

/**
 * Owns the Leaflet map instance and geo↔pixel helpers.
 */
export class MapView {
    constructor(containerId = "map") {
        const cfg = config.general_settings.map;

        this.southWest = L.latLng(...cfg.bounds.southWest);
        this.northEast = L.latLng(...cfg.bounds.northEast);
        this.northWest = L.latLng(...cfg.bounds.northWest);
        this.southEast = L.latLng(...cfg.bounds.southEast);

        const bounds = L.latLngBounds(this.southWest, this.northEast);

        this.map = L.map(containerId, {
            maxBounds: bounds,
            maxZoom: cfg.maxZoom,
            minZoom: cfg.minZoom,
            zoomControl: false,
        }).setView([55.5124, 16.1234], cfg.initialZoom);

        L.tileLayer(
            "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}",
            {
                attribution:
                    "&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href=\"https://www.stadiamaps.com/\" target=\"_blank\">Stadia Maps</a> &copy; <a href=\"https://openmaptiles.org/\" target=\"_blank\">OpenMapTiles</a> &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
                ext: "png",
            }
        ).addTo(this.map);

        // SMHI test WMS (wts-tst) returns 500 — borders overlay removed.
        // Satellite basemap is enough for MVP context.

        this.size = this.map.getSize();
    }

    toPixel(coordinates) {
        const latLng = L.latLng(coordinates[1], coordinates[0]);
        return this.map.latLngToContainerPoint(latLng);
    }

    toGeoPoint(x, y) {
        return this.map.containerPointToLatLng(L.point(x, y));
    }

    /** Forecast area corners in container pixels — used by Emitter bounds. */
    areaBoundariesPixel() {
        return {
            NE: this.map.latLngToContainerPoint(this.northEast),
            NW: this.map.latLngToContainerPoint(this.northWest),
            SE: this.map.latLngToContainerPoint(this.southEast),
            SW: this.map.latLngToContainerPoint(this.southWest),
        };
    }

    on(event, handler) {
        this.map.on(event, handler);
    }
}
