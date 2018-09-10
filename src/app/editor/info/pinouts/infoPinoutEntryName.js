/**
 * The name of a pinout.
 * @param {String} name The name.
 * @constructor
 */
export function InfoPinoutEntryName(name) {
    /**
     * Get the HTML element of this pin name.
     * @returns {HTMLElement} The HTML element of this element.
     */
    this.getElement = () => {
        const element = document.createElement("div");

        element.className = InfoPinoutEntryName.CLASS;
        element.innerText = name;

        return element;
    };
}

InfoPinoutEntryName.CLASS = "pinout-name";