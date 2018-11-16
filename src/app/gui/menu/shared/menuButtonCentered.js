/**
 * A big centered menu button.
 * @param {String} title A title for the button.
 * @param {Function} onClick A function to execute when the button is clicked.
 * @constructor
 */
import {MenuButton} from "./menuButton";

export function MenuButtonCentered(title, onClick) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = MenuButtonCentered.CLASS;
        _element.appendChild(new MenuButton(title, onClick).getElement());
    };

    /**
     * Get this buttons HTML element.
     * @returns {HTMLElement} An HTML element.
     */
    this.getElement = () => _element;

    make();
}

MenuButtonCentered.CLASS = "button-centered";