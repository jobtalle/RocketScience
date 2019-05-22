import {MenuMissionDescription} from "./menuMissionDescription";
import {MissionProgress} from "../../../../mission/missionProgress";
import {MenuMissionHeader} from "./menuMissionHeader";

/**
 * A mission that can be started.
 * @param {Menu} menu The menu.
 * @param {MissionProgress} missionProgress A missionProgress object.
 * @constructor
 */
export function MenuMission(menu, missionProgress, onUpdate) {
    const _element = document.createElement("div");

    const start = () => {
        menu.getGame().startMission(missionProgress.getMission());
    };

    const make = () => {
        _element.className = MenuMission.CLASS;

        // Add class based on progress
        if (missionProgress.getProgress() === MissionProgress.PROGRESS_COMPLETE)
            _element.classList.add(MenuMission.CLASS_COMPLETED);
        else if (missionProgress.getProgress() === MissionProgress.PROGRESS_INCOMPLETE)
            _element.classList.add(MenuMission.CLASS_INCOMPLETE);

        _element.appendChild(new MenuMissionHeader(this, missionProgress).getElement());
        _element.appendChild(new MenuMissionDescription(missionProgress.getMission().getDescription(),
            start).getElement());
    };

    /**
     *
     * @return {*}
     */
    this.clearMission = () => onUpdate();

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