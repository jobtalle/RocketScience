import {getStringRaw} from "../../../text/language";
import {ChecklistObjectiveGoalPinState} from "./goals/checklistObjectiveGoalPinState";
import {ChecklistObjectiveGoalPosition} from "./goals/checklistObjectiveGoalPosition";
import {Goal} from "../../../mission/goal/goal";
import {ChecklistObjectiveGoalPinStateThreshold} from "./goals/checklistObjectiveGoalPinStateThreshold";

/**
 * A drop down goal picker.
 * @param {Function} onSelect A function that will be called when an objective has been selected.
 * @constructor
 */
export function GoalPicker(onSelect) {
    const _element = document.createElement("select");

    const makeOption = (value, title, tooltip) => {
        const option = document.createElement("option");

        option.value = value;
        option.innerText = title;
        option.title = tooltip;

        return option;
    };

    const make = () => {
        _element.appendChild(makeOption(
            "",
            "",
            ""));
        _element.appendChild(makeOption(
            Goal.TYPE_PIN_STATE,
            getStringRaw(ChecklistObjectiveGoalPinState.TEXT_TITLE),
            getStringRaw(ChecklistObjectiveGoalPinState.TEXT_DESCRIPTION)));
        _element.appendChild(makeOption(
            Goal.TYPE_POSITION,
            getStringRaw(ChecklistObjectiveGoalPosition.TEXT_TITLE),
            getStringRaw(ChecklistObjectiveGoalPosition.TEXT_DESCRIPTION)));
        _element.appendChild(makeOption(
            Goal.TYPE_PIN_STATE_THRESHOLD,
            getStringRaw(ChecklistObjectiveGoalPinStateThreshold.TEXT_TITLE),
            getStringRaw(ChecklistObjectiveGoalPinStateThreshold.TEXT_DESCRIPTION)));

        _element.onchange = () => {
            if (_element.value === "") {

            }
            else {
                onSelect(parseInt(_element.value));

                _element.value = "";
            }
        };
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}