import {getString} from "../../../../text/language";

/**
 * A drop down pin value picker.
 * @param {Number} value The initial value, which may be 0 or 1.
 * @param {Function} onSelect A function to call when a value is selected.
 * @constructor
 */
export function ValuePicker(value, onSelect) {
    const _element = document.createElement("select");

    const make = () => {
        const optionLow = document.createElement("option");
        const optionHigh = document.createElement("option");

        optionLow.value = "0";
        optionLow.innerText = getString(ValuePicker.TEXT_LOW);
        optionHigh.value = "1";
        optionHigh.innerText = getString(ValuePicker.TEXT_HIGH);

        if (value === 0)
            optionLow.selected = true;
        else
            optionHigh.selected = true;

        _element.appendChild(optionLow);
        _element.appendChild(optionHigh);

        _element.onchange = () => onSelect(_element.value);
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The element.
     */
    this.getElement = () => _element;

    make();
}

ValuePicker.TEXT_LOW = "VALUE_PICKER_LOW";
ValuePicker.TEXT_HIGH = "VALUE_PICKER_HIGH";