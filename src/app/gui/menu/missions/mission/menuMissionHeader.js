import {MenuMissionTitle} from "./menuMissionTitle";
import {MenuMissionButtonBar} from "./menuMissionButtonBar";

/**
 * Holds the header for a MenuMission
 * @param menu {Menu} The menu
 * @param missionProgress {MissionProgress} A MissionProgress object.
 * @constructor
 */
export function MenuMissionHeader(menu, missionProgress) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = MenuMissionHeader.CLASS;

        _element.appendChild(new MenuMissionTitle(missionProgress.getMission().getTitle()).getElement());
        _element.appendChild(new MenuMissionButtonBar(menu, missionProgress).getElement());
    };

    /**
     * Get this buttons HTML element.
     * @returns {HTMLElement} An HTML element.
     */
    this.getElement = () => _element;

    make();
}

MenuMissionHeader.CLASS = "header";