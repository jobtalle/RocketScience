/**
 * A button for the toolbar.
 * @param {Function} onClick A function to execute when the button is active.
 * @param {String} sprite The sprite class.
 * @param {ToolbarButton.ToggleGroup} [toggleGroup] A toggle group to assign this button to.
 * @constructor
 */
export function ToolbarButton(onClick, sprite, toggleGroup) {
    const _element = document.createElement("div");

    const build = () => {
        _element.classList.add(ToolbarButton.CLASS);
        _element.classList.add("sprite");
        _element.classList.add(sprite);
        _element.onclick = () => {
            if (toggleGroup !== undefined) {
                if (_element.classList.contains("active"))
                    return;

                toggleGroup.press(_element);

                _element.classList.add("active");
            }

            onClick();
        };

        if (toggleGroup !== undefined)
            toggleGroup.add(_element);
    };

    /**
     * Get the HTML element of this button.
     * @returns {HTMLElement} The button element.
     */
    this.getElement = () => _element;

    build();
}

/**
 * Buttons constructed with a reference to this toggle group will become inactive
 * when another button in this group is pressed.
 * @constructor
 */
ToolbarButton.ToggleGroup = function() {
    const _buttons = [];

    this.add = button => _buttons.push(button);
    this.press = active => {
        for (const button of _buttons) {
            if (button === active)
                continue;

            button.classList.remove("active");
        }
    };
};

ToolbarButton.CLASS = "button";