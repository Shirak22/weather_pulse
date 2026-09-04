/**
 * Owns timeline DOM + selected forecast time.
 * Notifies App via onChange — does not fetch data itself.
 */
export class Timeline {
    static DAY_NAMES = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];

    /**
     * @param {HTMLElement} root
     * @param {{ onChange?: (isoTime: string) => void }} [options]
     */
    constructor(root, { onChange } = {}) {
        this.root = root;
        this.onChange = onChange;
        /** @type {{ day: number, dayOfWeek: string, time: string }[]} */
        this.days = [];
        this.selectedTime = null;
    }

    /** Collapse hourly validTimes into one entry per calendar day (first hour of that day). */
    setValidTimes(validTimes) {
        const dataDate = [];
        for (const time of validTimes) {
            const date = new Date(time);
            const day = date.getDate();
            if (dataDate.some((el) => el.day === day)) continue;
            dataDate.push({
                day,
                dayOfWeek: Timeline.DAY_NAMES[date.getDay()],
                time,
            });
        }
        this.days = dataDate;
        this.selectedTime = dataDate[0]?.time ?? null;
        this.#render();
        return this.days;
    }

    #render() {
        this.root.innerHTML = "";
        this.days.forEach((element, index) => {
            const aside = document.createElement("aside");
            aside.innerHTML = `<span>${element.dayOfWeek} </span> <span>${element.day}</span>`;
            if (element.time === this.selectedTime) {
                aside.classList.add("timeline-selected");
            }
            aside.addEventListener("click", () => this.selectIndex(index));
            this.root.appendChild(aside);
        });
    }

    selectIndex(index) {
        const day = this.days[index];
        if (!day || day.time === this.selectedTime) return;
        this.selectedTime = day.time;
        this.#syncSelectedClass();
        this.onChange?.(this.selectedTime);
    }

    #syncSelectedClass() {
        const children = this.root.querySelectorAll("aside");
        children.forEach((el, i) => {
            el.classList.toggle("timeline-selected", this.days[i]?.time === this.selectedTime);
        });
    }
}
