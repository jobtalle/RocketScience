/**
 * Edit button for the title.
 * @param {Function} onClick A function that is called when the button is clicked.
 * @param {String} spriteClass A class string .
 * @constructor
 */
export function DrawerTitleButton(onClick, spriteClass) {
    const _element = document.createElement("div");

    const make = () => {
        _element.classList.add(DrawerTitleButton.CLASS, spriteClass, "sprite");
        _element.onclick = onClick;
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

DrawerTitleButton.CLASS = "edit-button";