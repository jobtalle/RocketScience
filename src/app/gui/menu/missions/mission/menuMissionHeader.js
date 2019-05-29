import {MenuMissionTitle} from "./menuMissionTitle";
import {MenuMissionButtonBar} from "./menuMissionButtonBar";

/**
 * Holds the header for a MenuMission
 * @param menuMission {MenuMission} The menuMission
 * @param missionProgress {MissionProgress} A MissionProgress object.
 * @constructor
 */
export function MenuMissionHeader(menuMission, missionProgress) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = MenuMissionHeader.CLASS;

        _element.appendChild(new MenuMissionTitle(missionProgress.getMission().getTitle()).getElement());
        _element.appendChild(new MenuMissionButtonBar(menuMission).getElement());
    };

    /**
     * Get this buttons HTML element.
     * @returns {HTMLElement} An HTML element.
     */
    this.getElement = () => _element;

    make();
}

MenuMissionHeader.CLASS = "header";