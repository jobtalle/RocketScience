import {Goal} from "../../../mission/goal/goal";
import {ChecklistObjectiveGoalPinState} from "./goals/checklistObjectiveGoalPinState";

/**
 * A list of editable objective goals.
 * @param {Objective} objective An objective.
 * @constructor
 */
export function ChecklistObjectiveGoals(objective) {
    const _element = document.createElement("div");

    const make = () => {
        _element.classList.add(ChecklistObjectiveGoals.CLASS);
        _element.classList.add(ChecklistObjectiveGoals.CLASS_HIDDEN);

        for (const goal of objective.getGoals()) {
            switch (goal.getType()) {
                case Goal.TYPE_PIN_STATE:
                    _element.appendChild(new ChecklistObjectiveGoalPinState(goal).getElement());

                    break;
            }
        }
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The element.
     */
    this.getElement = () => _element;

    /**
     * Toggle visibility.
     */
    this.toggle = () => {
        _element.classList.toggle(ChecklistObjectiveGoals.CLASS_HIDDEN);
    };

    make();
}

ChecklistObjectiveGoals.CLASS = "goals";
ChecklistObjectiveGoals.CLASS_HIDDEN = "hidden";