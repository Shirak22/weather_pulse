export function radians(angle) {
    return (angle * Math.PI) / 180;
}

export function random(y, x) {
    return Math.random() * (y - x) + x;
}
