
export function TabbarButton(onClick, toolTip, sprite, toggleGroup) {
    const _element = document.createElement("div");

    const build = () => {
        _element.classList.add(TabbarButton.CLASS);
        _element.classList.add("sprite");
        _element.classList.add(sprite);
        _element.title = toolTip;

        _element.onclick = () => {
            if (_element.classList.contains(TabbarButton.CLASS_ACTIVE))
                return;

            toggleGroup.press(_element);

            _element.classList.add(TabbarButton.CLASS_ACTIVE);

            onClick();
        };

        toggleGroup.add(_element);
    };

    /**
     * Get the HTML element of this button.
     * @returns {HTMLElement} The button element.
     */
    this.getElement = () => _element;

    build();
}

TabbarButton.CLASS_ACTIVE = "active";

/**
 * Buttons constructed with a reference to this toggle group will become inactive
 * when another button in this group is pressed.
 * @constructor
 */
TabbarButton.ToggleGroup = function() {
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

TabbarButton.CLASS = "button";