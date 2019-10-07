import {ChecklistObjectiveGoalPanel} from "./checklistObjectiveGoalPanel";
import {getString} from "../../../../text/language";
import {NumberField} from "./numberField";

/**
 * A pin state goal editor.
 * @param {GoalPosition} goal The goal to edit.
 * @param {Function} onDelete A function to call when the objective should be deleted.
 * @constructor
 */
export function ChecklistObjectiveGoalPosition(goal, onDelete) {
    const _panel = new ChecklistObjectiveGoalPanel(
        ChecklistObjectiveGoalPosition.TEXT_TITLE,
        ChecklistObjectiveGoalPosition.TEXT_DESCRIPTION,
        onDelete);

    const makeRow = (label, field) => {
        const element = document.createElement("tr");
        const left = document.createElement("td");
        const right = document.createElement("td");

        left.appendChild(document.createTextNode(label));
        right.appendChild(field);

        element.appendChild(left);
        element.appendChild(right);

        return element;
    };

    const makeTable = () => {
        const element = document.createElement("table");

        element.appendChild(makeRow(
            getString(ChecklistObjectiveGoalPosition.TEXT_X),
            new NumberField(goal.getX(), value => {
                goal.setX(parseInt(value));
            }).getElement()));
        element.appendChild(makeRow(
            getString(ChecklistObjectiveGoalPosition.TEXT_Y),
            new NumberField(goal.getY(), value => {
                goal.setY(parseInt(value));
            }).getElement()));
        element.appendChild(makeRow(
            getString(ChecklistObjectiveGoalPosition.TEXT_RADIUS),
            new NumberField(goal.getRadius(), value => {
                goal.setRadius(parseInt(value));
            }).getElement()));


        return element;
    };

    const make = () => {
        _panel.add(makeTable());
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} An HTML element.
     */
    this.getElement = () => _panel.getElement();

    make();
}

ChecklistObjectiveGoalPosition.TEXT_TITLE = "GOAL_POSITION_TITLE";
ChecklistObjectiveGoalPosition.TEXT_DESCRIPTION = "GOAL_POSITION_DESCRIPTION";
ChecklistObjectiveGoalPosition.TEXT_X = "GOAL_POSITION_X";
ChecklistObjectiveGoalPosition.TEXT_Y = "GOAL_POSITION_Y";
ChecklistObjectiveGoalPosition.TEXT_RADIUS = "GOAL_POSITION_RADIUS";