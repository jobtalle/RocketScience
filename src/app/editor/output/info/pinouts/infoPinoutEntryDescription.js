/**
 * The description of a pinout.
 * @param {String} description A description which may contain HTML.
 * @constructor
 */
export function InfoPinoutEntryDescription(description) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = InfoPinoutEntryDescription.CLASS;
        _element.innerHTML = description;
    };

    /**
     * Get the HTML element of this pin description.
     * @returns {HTMLElement} The HTML element of this element.
     */
    this.getElement = () => _element;

    make();
}

InfoPinoutEntryDescription.CLASS = "pinout-description";