import {InfoPinoutEntry} from "./infoPinoutEntry";
import {Pin} from "../../../part/pin";
import {getString} from "../../../language";
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

            _element.appendChild(new InfoPinoutEntry(index + 1, pin, pinIndex === index, description).getElement());

            if (pinIndex === index)
                _element.appendChild(makeDescriptionRow(new InfoPinoutEntryDescription(getString(pin.description))));

            ++index;
        }
    };

    /**
     * Get the HTML element of this pinout information.
     * @returns {HTMLElement} The HTML element of this list.
     */
    this.getElement = () => _element;

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