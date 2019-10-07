import {Goal} from "../../../mission/goal/goal";
import {ChecklistObjectiveGoalPinState} from "./goals/checklistObjectiveGoalPinState";
import {ChecklistObjectiveGoalNew} from "./checklistObjectiveGoalNew";
import {getPartFromName, getPartNames} from "../../../part/objects";
import {GoalPinState} from "../../../mission/goal/goalPinState";
import {GoalPosition} from "../../../mission/goal/goalPosition";
import {ChecklistObjectiveGoalPosition} from "./goals/checklistObjectiveGoalPosition";

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
            let goal = null;

            switch (type) {
                case Goal.TYPE_PIN_STATE:
                    goal = new GoalPinState(getPartFromName(getPartNames()[0]).object, 0, 0);

                    break;
                case Goal.TYPE_POSITION:
                    goal = new GoalPosition(0, 0, 1);

                    break;
            }

            objective.addGoal(goal);

            if (goal)
                add(goal);
        });

        const add = goal => {
            let element = null;

            const onDelete = () => {
                objective.removeGoal(goal);

                _element.removeChild(element.getElement());
            };

            switch (goal.getType()) {
                case Goal.TYPE_PIN_STATE:
                    element = new ChecklistObjectiveGoalPinState(goal, onDelete);

                    break;
                case Goal.TYPE_POSITION:
                    element = new ChecklistObjectiveGoalPosition(goal, onDelete);

                    break;
            }

            if (element)
                _element.insertBefore(
                    element.getElement(),
                    goalNew.getElement());
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