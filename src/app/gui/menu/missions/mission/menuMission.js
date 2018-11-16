/**
 * A mission that can be started.
 * @param {Menu} menu The menu.
 * @param {Mission} mission A mission.
 * @constructor
 */
import {MenuMissionTitle} from "./menuMissionTitle";
import {MenuMissionDescription} from "./menuMissionDescription";

export function MenuMission(menu, mission) {
    const _element = document.createElement("div");

    const start = () => {
        menu.getGame().startMission(mission);
    };

    const make = () => {
        _element.className = MenuMission.CLASS;
        _element.appendChild(new MenuMissionTitle(mission.getTitle()).getElement());
        _element.appendChild(new MenuMissionDescription(mission.getDescription()).getElement());
        _element.onclick = start;
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

MenuMission.CLASS = "mission";