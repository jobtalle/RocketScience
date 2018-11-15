import {MenuButton} from "../shared/menuButton";
import {getString} from "../../../text/language";

/**
 * Content for the Menu root, containing buttons that allow access to other menu's.
 * @param {Menu} menu A menu.
 * @constructor
 */
export function MenuRoot(menu) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = MenuRoot.CLASS;

        _element.appendChild(new MenuButton(
            getString(MenuRoot.TEXT_CREATE),
            () => {
                menu.getGame().startCreate();
            }
        ).getElement());

        _element.appendChild(new MenuButton(
            getString(MenuRoot.TEXT_MISSIONS),
            () => {

            }
        ).getElement());
    };

    /**
     * Get the HTML element of this menu.
     * @returns {HTMLElement}
     */
    this.getElement = () => _element;

    make();
}

MenuRoot.TEXT_CREATE = "MENU_ROOT_CREATE";
MenuRoot.TEXT_MISSIONS = "MENU_ROOT_MISSIONS";
MenuRoot.CLASS = "root";