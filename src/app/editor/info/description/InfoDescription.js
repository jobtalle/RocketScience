/**
 * A part description inside the info box.
 * @constructor
 */
export function InfoDescription(text) {
    /**
     * Get the HTML element of this part list.
     * @returns {HTMLElement} The HTML element of this part list.
     */
    this.getElement = () => {
        const element = document.createElement("div");

        element.className = InfoDescription.CLASS;
        element.innerHTML = text;

        return element;
    };
}

InfoDescription.CLASS = "description";