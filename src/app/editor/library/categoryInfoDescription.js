/**
 * A part description inside the info box.
 * @constructor
 */
export function CategoryInfoDescription() {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = CategoryInfoDescription.CLASS;
    };

    /**
     * Set a new text.
     * @param {String} text The new text, which may contain HTML.
     */
    this.setText = text => {
        _element.innerHTML = text;
    };

    /**
     * Get the HTML element of this part list.
     * @returns {HTMLElement} The HTML element of this part list.
     */
    this.getElement = () => _element;

    make();
}

CategoryInfoDescription.CLASS = "description";