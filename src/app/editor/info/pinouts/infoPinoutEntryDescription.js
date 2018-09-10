/**
 * The description of a pinout.
 * @param {String} description A description which may contain HTML.
 * @constructor
 */
export function InfoPinoutEntryDescription(description) {
    /**
     * Get the HTML element of this pin description.
     * @returns {HTMLElement} The HTML element of this element.
     */
    this.getElement = () => {
        const element = document.createElement("div");

        element.className = InfoPinoutEntryDescription.CLASS;
        element.innerHTML = description;

        return element;
    }
}

InfoPinoutEntryDescription.CLASS = "pinout-description";