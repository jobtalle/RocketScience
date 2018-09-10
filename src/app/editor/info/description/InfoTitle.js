/**
 * The title of a part information box.
 * @param {String} title A title.
 * @constructor
 */
export function InfoTitle(title) {
    /**
     * Get the HTML element of this part list.
     * @returns {HTMLElement} The HTML element of this part list.
     */
    this.getElement = () => {
        const element = document.createElement("div");

        element.className = InfoTitle.CLASS;
        element.innerText = title;

        return element;
    };
}

InfoTitle.CLASS = "title";