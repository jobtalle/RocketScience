/**
 * The index of a pinout.
 * @param {Number} index The pin index.
 * @constructor
 */
export function InfoPinoutEntryIndex(index) {
    /**
     * Get the HTML element of this pin index.
     * @returns {HTMLElement} The HTML element of this element.
     */
    this.getElement = () => {
        const element = document.createElement("div");

        element.className = InfoPinoutEntryIndex.CLASS;
        element.innerText = index.toString();

        return element;
    }
}

InfoPinoutEntryIndex.CLASS = "pinout-index";