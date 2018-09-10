/**
 * A pinout entry.
 * @param {Object} pin A valid pin description.
 * @constructor
 */
export function InfoPinoutEntry(pin) {
    /**
     * Get the HTML element of this pin information.
     * @returns {HTMLElement} The HTML element of this list.
     */
    this.getElement = () => {
        const element = document.createElement("div");

        element.className = InfoPinoutEntry.CLASS;

        return element;
    };
}

InfoPinoutEntry.CLASS = "pinout";