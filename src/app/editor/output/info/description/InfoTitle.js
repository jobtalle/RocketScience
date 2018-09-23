/**
 * The title of a part information box.
 * @param {String} title A title.
 * @constructor
 */
export function InfoTitle(title) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = InfoTitle.CLASS;
        _element.innerText = title;
    };

    /**
     * Get the HTML element of this part list.
     * @returns {HTMLElement} The HTML element of this part list.
     */
    this.getElement = () => _element;

    make();
}

InfoTitle.CLASS = "title";