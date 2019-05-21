/**
 * A mission description div.
 * @param {String} description A description for a mission.
 * @param onClick {Function} The onClick function.
 * @constructor
 */
export function MenuMissionDescription(description, onClick) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = MenuMissionDescription.CLASS;
        _element.appendChild(document.createTextNode(description));
        _element.onclick = onClick;
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

MenuMissionDescription.CLASS = "description";