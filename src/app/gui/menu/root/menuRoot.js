import {getString} from "../../../text/language";
import {MenuButtonCentered} from "../shared/menuButtonCentered";
import {MenuMissions} from "../missions/menuMissions";

/**
 * Content for the Menu root, containing buttons that allow access to other menu's.
 * @param {Menu} menu A menu.
 * @constructor
 */
export function MenuRoot(menu) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = MenuRoot.CLASS;

        _element.appendChild(new MenuButtonCentered(
            getString(MenuRoot.TEXT_CREATE),
            () => {
                menu.getGame().startCreate();
            }
        ).getElement());

        _element.appendChild(new MenuButtonCentered(
            getString(MenuRoot.TEXT_MISSIONS),
            () => {
                menu.setContent(new MenuMissions(menu).getElement());
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