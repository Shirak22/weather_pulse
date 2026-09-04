/**
 * Thin DOM adapter for range/checkbox inputs.
 * Owns one input → optional output label binding.
 */
export class Controls {
    constructor(inputElementId, outputElementId) {
        this.inputElement = document.getElementById(inputElementId);
        this.outputElement = document.getElementById(outputElementId);
        this.variable = undefined;

        if (!this.inputElement) {
            throw new Error(`Controls: missing #${inputElementId}`);
        }

        if (this.inputElement.type === "checkbox") {
            this.#bind(this.inputElement.checked);
            this.inputElement.addEventListener("input", () => {
                this.#bind(this.inputElement.checked);
            });
            return;
        }

        // Panel host (e.g. dataInfo) — content set via setContent only
        if (
            this.outputElement &&
            this.inputElement === this.outputElement &&
            this.inputElement.tagName !== "INPUT"
        ) {
            return;
        }

        this.#bind(this.inputElement.value);
        this.inputElement.addEventListener("input", () => {
            this.#bind(this.inputElement.value);
        });
    }

    #bind(value) {
        this.variable = value;
        if (this.outputElement && this.outputElement !== this.inputElement) {
            this.outputElement.textContent = value;
        }
    }

    getValue() {
        return this.variable;
    }

    setContent(content) {
        if (!this.outputElement || this.outputElement.innerHTML === content) return;
        this.outputElement.innerHTML = content;
    }
}
