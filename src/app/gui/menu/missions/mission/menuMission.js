import {MenuMissionDescription} from "./menuMissionDescription";
import {MissionProgress} from "../../../../mission/missionProgress";
import {MenuMissionHeader} from "./menuMissionHeader";

/**
 * A mission that can be started.
 * @param {Menu} menu The menu.
 * @param {MissionProgress} missionProgress A missionProgress object.
 * @param {Function} onUpdate Function that is called when the object is updated.
 * @constructor
 */
export function MenuMission(menu, missionProgress, onUpdate) {
    const _element = document.createElement("div");

    const start = () => {
        menu.getGame().startMission(missionProgress);
    };

    const make = () => {
        _element.className = MenuMission.CLASS;

        // Add class based on progress
        if (missionProgress.isCompleted())
            _element.classList.add(MenuMission.CLASS_COMPLETED);
        if (missionProgress.hasSavedState())
            _element.classList.add(MenuMission.CLASS_INCOMPLETE);

        _element.appendChild(new MenuMissionHeader(this, missionProgress).getElement());
        _element.appendChild(new MenuMissionDescription(missionProgress.getMission().getDescription(),
            start).getElement());
    };

    /**
     * Clear this mission, and update the element.
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