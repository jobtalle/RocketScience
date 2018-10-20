import "../../../../styles/checklist.css"
import {ChecklistObjective} from "./checklistObjective";
import {ChecklistTitle} from "./checklistTitle";

/**
 * A checklist displaying all mission objectives.
 * @param {Mission} mission A mission to create a checklist for.
 * @param {HTMLElement} overlay The element to place the checklist on.
 * @constructor
 */
export function Checklist(mission, overlay) {
    const _container = document.createElement("div");
    const _objectives = [];

    const build = () => {
        _container.id = Checklist.ID;

        _container.appendChild(new ChecklistTitle(mission.getTitle()).getElement());

        for (const objective of mission.getObjectives()) {
            const checklistObjective = new ChecklistObjective(objective.getName());

            _objectives.push(checklistObjective);
            _container.appendChild(checklistObjective.getElement());
        }
    };

    /**
     * Show this checklist.
     */
    this.show = () => {
        overlay.appendChild(_container);
    };

    /**
     * Hide this checklist.
     */
    this.hide = () => {
        overlay.removeChild(_container);
    };

    build();
}

Checklist.ID = "checklist";