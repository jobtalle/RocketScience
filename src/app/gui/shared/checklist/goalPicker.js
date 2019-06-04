import {getStringRaw} from "../../../text/language";
import {ChecklistObjectiveGoalPinState} from "./goals/checklistObjectiveGoalPinState";
import {Goal} from "../../../mission/goal/goal";

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