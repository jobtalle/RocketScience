/**
 * The buttonBar for every MissionMenu object.
 * @param menuMission {MenuMission} The menuMission
 * @constructor
 */
import {MenuMissionButton} from "./menuMissionButton";

export function MenuMissionButtonBar(menuMission) {
    const _element = document.createElement("div");
    const _clearButton = new MenuMissionButton(
        "mission-clear",
        () => menuMission.clearMission());

    const make = () => {
        _element.className = MenuMissionButtonBar.CLASS;

        _element.appendChild(_clearButton.getElement());
    };

    /**
     * Get this buttons HTML element.
     * @returns {HTMLElement} An HTML element.
     */
    this.getElement = () => _element;

    make();
}

MenuMissionButtonBar.CLASS = "button-bar";