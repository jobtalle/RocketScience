import {getString, getStringRaw} from "../../../../text/language";

/**
 * A drop down pin picker to pick some pin index from an object.
 * @param {Number} index The initial pin index, which must be a valid pin of object.
 * @param {Object} object A valid part object from parts.json.
 * @param {Function} onSelect A function to call when a value is selected.
 * @constructor
 */
export function PinPicker(index, object, onSelect) {
    const _element = document.createElement("select");

    const make = () => {
        this.set(index, object);

        _element.onchange = () => onSelect(_element.value);
    };

    /**
     * Set an object to select a pin on.
     * @param {Number} index The initial pin index, which must be a valid pin of object.
     * @param {Object} object A valid part object from parts.json.
     */
    this.set = (index, object) => {
        const makeOption = (value, title, tooltip) => {
            const option = document.createElement("option");

            option.value = value;
            option.innerText = title;
            option.title = tooltip;

            if (value === index)
                option.selected = true;

            return option;
        };

        while (_element.firstChild)
            _element.removeChild(_element.firstChild);

        for (let i = 0; i < object.configurations[0].io.length; ++i)
            _element.appendChild(makeOption(
                i,
                getString(object.configurations[0].io[i].name),
                getStringRaw(object.configurations[0].io[i].description)));
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement} The HTML element.
     */
    this.getElement = () => _element;

    make();
}