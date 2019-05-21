/**
 * Button for in the MenuMission
 * @param sprite {String} The name of the sprite.
 * @param onClick {Function} The function that has to be called when the button is clicked.
 * @constructor
 */
export function MenuMissionButton(sprite, onClick) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = MenuMissionButton.CLASS;
        _element.onclick = onClick;
        _element.classList.add("sprite", sprite);
    };

    /**
     * Get this buttons HTML element.
     * @returns {HTMLElement} An HTML element.
     */
    this.getElement = () => _element;

    make();
}

MenuMissionButton.CLASS = "button";