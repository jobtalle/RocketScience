/**
 * A title for a mission view.
 * @param {String} title A title for this mission.
 * @constructor
 */
export function MenuMissionTitle(title) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = MenuMissionTitle.CLASS;
        _element.appendChild(document.createTextNode(title));
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

MenuMissionTitle.CLASS = "title";