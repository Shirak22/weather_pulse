import { radians } from "./math.js";

/**
 * Inverse-distance interpolation over nearest 4 grid pixels.
 * Hot path — called per particle per frame; keep allocation-light when possible.
 */
export function bilinearInterpolation(x, y, data) {
    let p1, p2, p3, p4;

    for (let index = 0; index < data.pixel.length; index++) {
        const point = data.pixel[index];
        const dx = point.x - x;
        const dy = point.y - y;
        const distSquared = dx * dx + dy * dy;

        if (!p1 || distSquared < p1.distSquared) {
            p4 = p3;
            p3 = p2;
            p2 = p1;
            p1 = {
                point,
                wind_direction: data.wind_direction[index],
                wind_speed: data.wind_speed[index],
                temp_data: data.temp_data[index],
                distSquared,
            };
        } else if (!p2 || distSquared < p2.distSquared) {
            p4 = p3;
            p3 = p2;
            p2 = {
                point,
                wind_direction: data.wind_direction[index],
                wind_speed: data.wind_speed[index],
                temp_data: data.temp_data[index],
                distSquared,
            };
        } else if (!p3 || distSquared < p3.distSquared) {
            p4 = p3;
            p3 = {
                point,
                wind_direction: data.wind_direction[index],
                wind_speed: data.wind_speed[index],
                temp_data: data.temp_data[index],
                distSquared,
            };
        } else if (!p4 || distSquared < p4.distSquared) {
            p4 = {
                point,
                wind_direction: data.wind_direction[index],
                wind_speed: data.wind_speed[index],
                temp_data: data.temp_data[index],
                distSquared,
            };
        }
    }

    if (!p1 || !p2 || !p3 || !p4) {
        return { wind_direction: 0, wind_speed: 0, temp_data: 0 };
    }

    let w1 = 1 / p1.distSquared;
    let w2 = 1 / p2.distSquared;
    let w3 = 1 / p3.distSquared;
    let w4 = 1 / p4.distSquared;

    const totalWeight = w1 + w2 + w3 + w4;
    w1 /= totalWeight;
    w2 /= totalWeight;
    w3 /= totalWeight;
    w4 /= totalWeight;

    const wind_blerp =
        w1 * p1.wind_speed + w2 * p2.wind_speed + w3 * p3.wind_speed + w4 * p4.wind_speed;

    const temp_lerp =
        w1 * p1.temp_data + w2 * p2.temp_data + w3 * p3.temp_data + w4 * p4.temp_data;

    const xR =
        w1 * Math.cos(radians(p1.wind_direction)) +
        w2 * Math.cos(radians(p2.wind_direction)) +
        w3 * Math.cos(radians(p3.wind_direction)) +
        w4 * Math.cos(radians(p4.wind_direction));
    const yR =
        w1 * Math.sin(radians(p1.wind_direction)) +
        w2 * Math.sin(radians(p2.wind_direction)) +
        w3 * Math.sin(radians(p3.wind_direction)) +
        w4 * Math.sin(radians(p4.wind_direction));

    let interpolatedWindDirection = (Math.atan2(yR, xR) * 180) / Math.PI;
    if (interpolatedWindDirection < 0) {
        interpolatedWindDirection += 360;
    }

    return {
        wind_direction: interpolatedWindDirection,
        wind_speed: wind_blerp,
        temp_data: temp_lerp,
    };
}
