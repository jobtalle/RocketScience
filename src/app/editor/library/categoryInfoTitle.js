/**
 * The title of a part information box.
 * @constructor
 */
export function CategoryInfoTitle() {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = CategoryInfoTitle.CLASS;
    };

    /**
     * Set the title.
     * @param {String} title The new title.
     */
    this.setTitle = title => {
        _element.innerText = title;
    };

    /**
     * Get the HTML element of this part list.
     * @returns {HTMLElement} The HTML element of this part list.
     */
    this.getElement = () => _element;

    make();
}

CategoryInfoTitle.CLASS = "title";