import {Goal} from "../../../mission/goal/goal";
import {ChecklistObjectiveGoalPinState} from "./goals/checklistObjectiveGoalPinState";
import {ChecklistObjectiveGoalNew} from "./checklistObjectiveGoalNew";
import {getPartFromId} from "../../../part/objects";
import {GoalPinState} from "../../../mission/goal/goalPinState";

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

        const goalNew = new ChecklistObjectiveGoalNew(type => {
            switch (type) {
                case Goal.TYPE_PIN_STATE:
                    add(new GoalPinState(getPartFromId(0).object, 0, 0));

                    break;
            }
        });

        const add = goal => {
            switch (goal.getType()) {
                case Goal.TYPE_PIN_STATE:
                    _element.insertBefore(
                        new ChecklistObjectiveGoalPinState(goal).getElement(),
                        goalNew.getElement());

                    break;
            }
        };

        _element.appendChild(goalNew.getElement());

        for (const goal of objective.getGoals())
            add(goal);
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