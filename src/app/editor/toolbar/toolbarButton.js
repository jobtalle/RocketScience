/**
 * A button for the toolbar.
 * @param onClick
 * @param sprite
 * @constructor
 */
export function ToolbarButton(onClick, sprite) {
    const _element = document.createElement("div");

    const build = () => {
        _element.classList.add(ToolbarButton.CLASS);
        _element.classList.add("sprite");
        _element.classList.add(sprite);
        _element.onclick = () => onClick();
    };

    /**
     * Get the HTML element of this button.
     * @returns {HTMLElement} The button element.
     */
    this.getElement = () => _element;

    build();
}

ToolbarButton.CLASS = "button";