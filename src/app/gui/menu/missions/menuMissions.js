/**
 * A selection of missions that can be started.
 * @param {Menu} menu A menu.
 * @constructor
 */
export function MenuMissions(menu) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = MenuMissions.CLASS;
    };

    /**
     * Get the HTML element of this menu.
     * @returns {HTMLElement}
     */
    this.getElement = () => _element;

    make();
}

MenuMissions.CLASS = "missions";