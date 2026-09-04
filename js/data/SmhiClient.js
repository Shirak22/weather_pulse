/**
 * Owns all SMHI SNOW1gv1 network I/O.
 * Caches static multipoint coordinates (they only depend on downsample).
 */
export class SmhiClient {
    static BASE = "https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1";

    constructor(downSample = 5) {
        this.downSample = downSample;
        /** @type {number[][] | null} */
        this._coordinatesCache = null;
    }

    async getTimes() {
        const res = await fetch(`${SmhiClient.BASE}/times.json`);
        if (!res.ok) throw new Error(`SMHI times failed: ${res.status}`);
        const data = await res.json();
        return data.time;
    }

    async getCoordinates() {
        if (this._coordinatesCache) return this._coordinatesCache;

        const url = `${SmhiClient.BASE}/geotype/multipoint.json?downsample=${this.downSample}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`SMHI coordinates failed: ${res.status}`);
        const data = await res.json();
        this._coordinatesCache = data.coordinates ?? data.geometry?.coordinates;
        return this._coordinatesCache;
    }

    async getParameter(validTimeCompact, parameter) {
        const url =
            `${SmhiClient.BASE}/geotype/multipoint/time/${validTimeCompact}` +
            `/parameter/${parameter}/data.json?downsample=${this.downSample}&with-geo=false`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`SMHI ${parameter} failed: ${res.status}`);
        const data = await res.json();
        return data.timeSeries[0].data[parameter];
    }

    /**
     * Sequential fetches so UI can show real progress (coords → wd → ws → temp).
     * @param {string} isoTime
     * @param {(info: { step: number, total: number, label: string }) => void} [onProgress]
     */
    async getRaster(isoTime, onProgress) {
        const validTime = isoTime.replaceAll("-", "").replaceAll(":", "");
        const total = 4;
        const report = (step, label) => onProgress?.({ step, total, label });

        report(0, "Grid coordinates…");
        const coordinates = await this.getCoordinates();

        report(1, "Wind direction…");
        const wind_direction = await this.getParameter(validTime, "wind_from_direction");

        report(2, "Wind speed…");
        const wind_speed = await this.getParameter(validTime, "wind_speed");

        report(3, "Temperature…");
        const temp_data = await this.getParameter(validTime, "air_temperature");

        report(4, "Building flow field…");

        return {
            validTime,
            coordinates,
            wind_direction,
            wind_speed,
            temp_data,
        };
    }
}
