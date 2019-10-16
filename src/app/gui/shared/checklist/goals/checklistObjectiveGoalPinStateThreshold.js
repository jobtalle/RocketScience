import {ChecklistObjectiveGoalPanel} from "./checklistObjectiveGoalPanel";
import {getString} from "../../../../text/language";
import {PartPicker} from "./partPicker";
import {getPartFromName} from "../../../../part/objects";
import {PinPicker} from "./pinPicker";
import {NumberField} from "./numberField";
import {ThresholdTypePicker} from "./thresholdTypePicker";

/**
 * A pin state goal editor.
 * @param {GoalPinStateThreshold} goal The goal to edit.
 * @param {Function} onDelete A function to call when the objective should be deleted.
 * @constructor
 */
export function ChecklistObjectiveGoalPinStateThreshold(goal, onDelete) {
    const _panel = new ChecklistObjectiveGoalPanel(
        ChecklistObjectiveGoalPinStateThreshold.TEXT_TITLE,
        ChecklistObjectiveGoalPinStateThreshold.TEXT_DESCRIPTION,
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
        const pinPicker = new PinPicker(goal.getPinIndex(), getPartFromName(goal.getPart()), selected => {
            goal.setPinIndex(parseInt(selected));
        });
        const valuePicker = new NumberField(0, value => {
            goal.setPinValue(parseInt(value));
        }, 0, 1);

        element.appendChild(makeRow(
            getString(ChecklistObjectiveGoalPinStateThreshold.TEXT_PART),
            new PartPicker(goal.getPart(), selected => {
                const part = getPartFromName(selected);

                goal.setPart(part.object);
                pinPicker.set(0, part);
            }).getElement()));

        element.appendChild(makeRow(
            getString(ChecklistObjectiveGoalPinStateThreshold.TEXT_PIN),
            pinPicker.getElement()));

        element.appendChild(makeRow(
            getString(ChecklistObjectiveGoalPinStateThreshold.TEXT_THRESHOLD),
            new ThresholdTypePicker(0, selected => goal.setThresholdType(parseInt(selected)))
                .getElement()
        ));

        element.appendChild(makeRow(
            getString(ChecklistObjectiveGoalPinStateThreshold.TEXT_VALUE),
            valuePicker.getElement()));

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

ChecklistObjectiveGoalPinStateThreshold.TEXT_TITLE = "GOAL_PIN_STATE_THRESHOLD_TITLE";
ChecklistObjectiveGoalPinStateThreshold.TEXT_DESCRIPTION = "GOAL_PIN_STATE_THRESHOLD_DESCRIPTION";
ChecklistObjectiveGoalPinStateThreshold.TEXT_PART = "GOAL_PIN_STATE_THRESHOLD_PART";
ChecklistObjectiveGoalPinStateThreshold.TEXT_PIN = "GOAL_PIN_STATE_THRESHOLD_PIN";
ChecklistObjectiveGoalPinStateThreshold.TEXT_THRESHOLD = "GOAL_PIN_STATE_THRESHOLD_TYPE";
ChecklistObjectiveGoalPinStateThreshold.TEXT_VALUE = "GOAL_PIN_STATE_THRESHOLD_VALUE";