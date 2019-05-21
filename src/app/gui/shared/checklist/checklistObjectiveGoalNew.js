import {GoalPicker} from "./goalPicker";
import {getString} from "../../../text/language";

/**
 * A menu to create a new goal for an objective.
 * @param {Function} onClick A function to execute when a new goal has been selected.
 * @constructor
 */
export function ChecklistObjectiveGoalNew(onClick) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = ChecklistObjectiveGoalNew.CLASS;
        _element.appendChild(document.createTextNode(getString(ChecklistObjectiveGoalNew.TEXT_CREATE)));
        _element.appendChild(new GoalPicker(onClick).getElement());
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}

ChecklistObjectiveGoalNew.CLASS = "picker";
ChecklistObjectiveGoalNew.TEXT_CREATE = "GOAL_CREATE";