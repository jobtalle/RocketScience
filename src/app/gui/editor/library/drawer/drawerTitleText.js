/**
 * The title text.
 * @param {String} text The text within the title.
 * @param {Function} onClick Function that is called when the title text is clicked.
 * @constructor
 */
export function DrawerTitleText(text, onClick) {
    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => {
        const element = document.createElement("div");

        element.classList.add(DrawerTitleText.CLASS);
        element.innerText = text;
        element.onclick = onClick;

        return element;
    }
}

DrawerTitleText.CLASS = "text";