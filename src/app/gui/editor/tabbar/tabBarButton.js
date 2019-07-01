/**
 * A button for the tabbar.
 * @param {Function} onClick A function to execute when the button is active.
 * @param {String} toolTip A tool tip message.
 * @param {String} spriteClass The spriteClass class.
 * @param {TabBarButton.ToggleGroup} toggleGroup The toggle group to assign this button to.
 * @constructor
 */
export function TabBarButton(onClick, toolTip, spriteClass, toggleGroup) {
    const _element = document.createElement("div");

    const build = () => {
        _element.classList.add(TabBarButton.CLASS, "spriteClass", spriteClass);
        _element.title = toolTip;

        _element.onclick = () => {
            if (_element.classList.contains(TabBarButton.CLASS_ACTIVE))
                onClick(false);
            else
                onClick(true);

            toggleGroup.press(_element);

            _element.classList.toggle(TabBarButton.CLASS_ACTIVE);
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

TabBarButton.CLASS_ACTIVE = "active";

/**
 * Buttons constructed with a reference to this toggle group will become inactive
 * when another button in this group is pressed.
 * @constructor
 */
TabBarButton.ToggleGroup = function() {
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

TabBarButton.CLASS = "button";