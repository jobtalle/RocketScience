/**
 * The buttonBar for every MissionMenu object.
 * @param menu {Menu} The menu
 * @param missionProgress {MissionProgress} A MissionProgress object.
 * @constructor
 */
import {MenuMissionButton} from "./menuMissionButton";

export function MenuMissionButtonBar(menu, missionProgress) {
    const _element = document.createElement("div");
    const _clearButton = new MenuMissionButton(
        "mission-clear",
        () => menu.getGame().clearMission(missionProgress.getMission()));

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