/**
 * A button for toolbars`.
 * @param {Function} onClick A function to execute when the button is active.
 * @param {String} toolTip A tool tip message.
 * @param {String} sprite The sprite class.
 * @param {Object} type A valid type constant.
 * @param {ToolbarButton.ToggleGroup} [toggleGroup] A toggle group to assign this button to.
 * @constructor
 */
export function ToolbarButton(onClick, toolTip, sprite, type, toggleGroup) {
    const _element = document.createElement("div");

    const build = () => {
        _element.classList.add(ToolbarButton.CLASS);
        _element.classList.add("sprite");
        _element.classList.add(sprite);
        _element.title = toolTip;

        switch (type) {
            case ToolbarButton.TYPE_CLICK:
                _element.onclick = onClick;

                break;
            case ToolbarButton.TYPE_TOGGLE:
                _element.onclick = () => {
                    if (_element.classList.contains(ToolbarButton.CLASS_ACTIVE))
                        onClick(false);
                    else
                        onClick(true);

                    _element.classList.toggle(ToolbarButton.CLASS_ACTIVE);
                };

                break;
            case ToolbarButton.TYPE_TOGGLE_GROUP:
                _element.onclick = () => {
                    if (_element.classList.contains(ToolbarButton.CLASS_ACTIVE))
                        return;

                    toggleGroup.press(_element);

                    _element.classList.add(ToolbarButton.CLASS_ACTIVE);

                    onClick();
                };

                break;
        }

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

ToolbarButton.TYPE_CLICK = 0;
ToolbarButton.TYPE_TOGGLE = 1;
ToolbarButton.TYPE_TOGGLE_GROUP = 2;
ToolbarButton.CLASS_ACTIVE = "active";

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