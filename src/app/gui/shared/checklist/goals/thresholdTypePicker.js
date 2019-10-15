import {getString} from "../../../../text/language";
import {GoalPinStateThreshold} from "../../../../mission/goal/goalPinStateThreshold";

/**
 * A drop down threshold type picker.
 * @param {Number} value The initial value, which may be 0 or 1.
 * @param {Function} onSelect A function to call when a value is selected.
 * @constructor
 */
export function ThresholdTypePicker(value, onSelect) {
    const _element = document.createElement("select");

    const make = () => {
        const optionGreater = document.createElement("option");
        const optionSmaller = document.createElement("option");

        optionGreater.value = GoalPinStateThreshold.GREATER_THAN;
        optionGreater.innerText = getString(ThresholdTypePicker.TEXT_GREATER_THAN);
        optionSmaller.value = GoalPinStateThreshold.SMALLER_THAN;
        optionSmaller.innerText = getString(ThresholdTypePicker.TEXT_SMALLER_THAN);

        if (value === 0)
            optionGreater.selected = true;
        else
            optionSmaller.selected = true;

        _element.appendChild(optionGreater);
        _element.appendChild(optionSmaller);

        _element.onchange = () => onSelect(_element.value);
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The element.
     */
    this.getElement = () => _element;

    make();
}

ThresholdTypePicker.TEXT_GREATER_THAN = "THRESHOLD_TYPE_PICKER_GREATER_THAN";
ThresholdTypePicker.TEXT_SMALLER_THAN = "THRESHOLD_TYPE_PICKER_SMALLER_THAN";