/**
 * A part description inside the info box.
 * @constructor
 */
export function InfoDescription(text) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = InfoDescription.CLASS;
        _element.innerHTML = text;
    };

    /**
     * Get the HTML element of this part list.
     * @returns {HTMLElement} The HTML element of this part list.
     */
    this.getElement = () => _element;

    make();
}

InfoDescription.CLASS = "description";