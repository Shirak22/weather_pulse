/**
 * Coarse screen grid for pointer + temperature overlay.
 * Samples WindField (O(1) per cell) — no irregular SMHI search.
 */
export class Fields {
    constructor(resolution, windField) {
        this.resolution = resolution;
        this.windField = windField;
        this.cols = 0;
        this.rows = 0;
        this.gridsArray = [];
    }

    setWindField(windField) {
        this.windField = windField;
    }

    init(width, height) {
        this.cols = Math.floor(width / this.resolution);
        this.rows = Math.floor(height / this.resolution);
    }

    createFields() {
        this.gridsArray.length = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const x = col * this.resolution;
                const y = row * this.resolution;
                const s = this.windField.sample(x, y);
                this.gridsArray.push({
                    pos: { x, y },
                    blerp: {
                        wind_direction: s.wind_direction,
                        wind_speed: s.speed,
                        temp_data: s.temp_data,
                    },
                });
            }
        }
    }

    update() {
        for (let index = 0; index < this.gridsArray.length; index++) {
            const field = this.gridsArray[index];
            const s = this.windField.sample(field.pos.x, field.pos.y);
            field.blerp.wind_direction = s.wind_direction;
            field.blerp.wind_speed = s.speed;
            field.blerp.temp_data = s.temp_data;
        }
    }
}
