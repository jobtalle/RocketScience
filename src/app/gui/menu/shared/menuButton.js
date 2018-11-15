/**
 * A menu button.
 * @param {String} title A title for the button.
 * @param {Function} onClick A function to execute when the button is clicked.
 * @constructor
 */
export function MenuButton(title, onClick) {
    const _element = document.createElement("button");

    const make = () => {
        _element.className = MenuButton.CLASS;
        _element.onclick = onClick;
        _element.appendChild(document.createTextNode(title));
    };

    /**
     * Get this buttons HTML element.
     * @returns {HTMLElement} An HTML element.
     */
    this.getElement = () => _element;

    make();
}

MenuButton.CLASS = "button";