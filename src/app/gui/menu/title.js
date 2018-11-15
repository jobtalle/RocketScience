import {getString} from "../../text/language";

/**
 * A title for the menu.
 * @constructor
 */
export function MenuTitle() {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = MenuTitle.CLASS;
        _element.appendChild(document.createTextNode(getString(MenuTitle.TEXT_TITLE)));
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

MenuTitle.CLASS = "title-text";
MenuTitle.TEXT_TITLE = "TITLE";