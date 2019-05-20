/**
 * A mission that can be started.
 * @param {Menu} menu The menu.
 * @param {MissionProgress} missionProgress A missionProgress object.
 * @constructor
 */
import {MenuMissionTitle} from "./menuMissionTitle";
import {MenuMissionDescription} from "./menuMissionDescription";
import {MissionProgress} from "../../../../mission/missionProgress";

export function MenuMission(menu, missionProgress) {
    const _element = document.createElement("div");

    const start = () => {
        menu.getGame().startMission(missionProgress.getMission());
    };

    const make = () => {
        _element.className = MenuMission.CLASS;

        if (missionProgress.getProgress() === MissionProgress.PROGRESS_COMPLETE)
            _element.classList.add(MenuMission.CLASS_COMPLETED);
        else if (missionProgress.getProgress() === MissionProgress.PROGRESS_INCOMPLETE)
            _element.classList.add(MenuMission.CLASS_INCOMPLETE);

        _element.appendChild(new MenuMissionTitle(missionProgress.getMission().getTitle()).getElement());
        _element.appendChild(new MenuMissionDescription(missionProgress.getMission().getDescription()).getElement());
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
MenuMission.CLASS_COMPLETED = "completed";
MenuMission.CLASS_INCOMPLETE = "incomplete";