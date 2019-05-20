import {ChecklistObjectiveGoalPanel} from "./checklistObjectiveGoalPanel";
import {getString} from "../../../../text/language";
import {PartPicker} from "./partPicker";
import {getPartFromId, getPartId} from "../../../../part/objects";
import {ValuePicker} from "./valuePicker";
import {PinPicker} from "./pinPicker";

/**
 * A pin state goal editor.
 * @param {GoalPinState} goal The goal to edit.
 * @constructor
 */
export function ChecklistObjectiveGoalPinState(goal) {
    const _element = new ChecklistObjectiveGoalPanel().getElement();

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
        const pinPicker = new PinPicker(goal.getPinIndex(), getPartFromId(getPartId(goal.getPart())), selected => {
            goal.setPinIndex(parseInt(selected));
        });

        element.appendChild(makeRow(
            getString(ChecklistObjectiveGoalPinState.TEXT_PART),
            new PartPicker(getPartId(goal.getPart()), selected => {
                const part = getPartFromId(parseInt(selected));

                goal.setPart(part.object);
                pinPicker.set(0, part);
            }).getElement()));
        element.appendChild(makeRow(
            getString(ChecklistObjectiveGoalPinState.TEXT_PIN),
            pinPicker.getElement()));
        element.appendChild(makeRow(
            getString(ChecklistObjectiveGoalPinState.TEXT_VALUE),
            new ValuePicker(goal.getPinValue(), selected => {
                goal.setPinValue(parseInt(selected));
            }).getElement()));

        return element;
    };

    const make = () => {
        _element.appendChild(document.createTextNode(getString(ChecklistObjectiveGoalPinState.TEXT_DESCRIPTION)));
        _element.appendChild(makeTable());
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} An HTML element.
     */
    this.getElement = () => _element;

    make();
}

ChecklistObjectiveGoalPinState.TEXT_DESCRIPTION = "GOAL_PIN_STATE_DESCRIPTION";
ChecklistObjectiveGoalPinState.TEXT_PART = "GOAL_PIN_STATE_PART";
ChecklistObjectiveGoalPinState.TEXT_PIN = "GOAL_PIN_STATE_PIN";
ChecklistObjectiveGoalPinState.TEXT_VALUE = "GOAL_PIN_STATE_VALUE";