/**
 * A button on the library tab bar.
 * @param {Function} onClick The function that should be called on a click.
 * @param {String} tooltip Text that should be shown when hovering.
 * @param {String} spriteClass The class of the sprite of the button.
 * @constructor
 */
export function LibraryTabButton(onClick, tooltip, spriteClass) {
    const _element = document.createElement("div");

    const make = () => {
        _element.classList.add(LibraryTabButton.CLASS, "sprite", spriteClass);

        _element.onclick = () => onClick();

        _element.title = tooltip;
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement}
     */
    this.getElement = () => _element;

    make();
}

LibraryTabButton.CLASS = "button";