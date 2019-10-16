import {getPartFromName, getPartNames} from "../../../../part/objects";
import {getString} from "../../../../text/language";

/**
 * A drop down part picker.
 * @param {String} name A valid part name which will be initially selected.
 * @param {Function} onSelect A function to call when a part is selected.
 * @constructor
 */
export function PartPicker(name, onSelect) {
    const _element = document.createElement("select");

    const makeOption = (value, title) => {
        const option = document.createElement("option");

        option.value = value;
        option.innerText = title;

        if (value === name)
            option.selected = true;

        return option;
    };

    const make = () => {
        for (const part of getPartNames())
            _element.appendChild(makeOption(
                part,
                getString(getPartFromName(part).label)));

        _element.onchange = () => onSelect(_element.value);
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The element.
     */
    this.getElement = () => _element;

    make();
}