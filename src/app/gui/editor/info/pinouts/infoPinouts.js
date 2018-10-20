import {InfoPinoutEntry} from "./infoPinoutEntry";
import {Pin} from "../../../../part/pin";
import {getString} from "../../../../text/language";
import {InfoPinoutEntryDescription} from "./infoPinoutEntryDescription";

/**
 * A list of pinouts.
 * @param {Object} configuration A valid part configuration to read pins from.
 * @param {HTMLElement} info An element to add extra information to.
 * @param {Number} [pinIndex] An optional index of the selected pin. If set, the description will be shown in the table.
 * @constructor
 */
export function InfoPinouts(configuration, info, pinIndex) {
    const _element = document.createElement("table");
    let _selectedElement = null;

    const makeDescriptionRow = description => {
        const row = document.createElement("tr");
        const column = document.createElement("td");

        row.className = InfoPinouts.CLASS_INLINE_DESCRIPTION;
        column.colSpan = 2;

        column.appendChild(description.getElement());
        row.appendChild(column);

        return row;
    };

    const make = () => {
        _element.className = InfoPinouts.CLASS;

        let index = 0;

        for (const pin of configuration.io) if (pin.type !== Pin.TYPE_STRUCTURAL) {
            let description = null;

            if (pinIndex === undefined) {
                description = new InfoPinoutEntryDescription(getString(pin.description)).getElement();
                info.appendChild(description);
            }

            const indexElement = new InfoPinoutEntry(index + 1, pin, pinIndex === index, description).getElement();

            _element.appendChild(indexElement);

            if (pinIndex === index) {
                const descriptionElement = makeDescriptionRow(new InfoPinoutEntryDescription(getString(pin.description)));

                _element.appendChild(descriptionElement);
                _selectedElement = indexElement;
            }

            ++index;
        }
    };

    /**
     * Get the HTML element of this pinout information.
     * @returns {HTMLElement} The HTML element of this list.
     */
    this.getElement = () => _element;

    /**
     * If pinIndex was provided, this function returns the selected index div.
     * @returns {HTMLElement} The HTML element of the selected pin information.
     */
    this.getSelectedElement = () => _selectedElement;

    make();
}

InfoPinouts.formatIndex = index => {
    let result = index.toString();

    while (result.length < InfoPinouts.INDEX_PADDING)
        result = "0" + result;

    return result;
};

InfoPinouts.CLASS = "pinouts";
InfoPinouts.CLASS_INLINE_DESCRIPTION = "inline-description";
InfoPinouts.INDEX_PADDING = 2;