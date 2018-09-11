import {InfoPinoutEntry} from "./infoPinoutEntry";
import {Pin} from "../../../part/pin";
import {getString} from "../../../language";
import {InfoPinoutEntryDescription} from "./infoPinoutEntryDescription";

/**
 * A list of pinouts.
 * @param {Object} configuration A valid part configuration to read pins from.
 * @constructor
 */
export function InfoPinouts(configuration) {
    const makeEntries = (info, extension, io) => {
        let index = 0;
        let descriptions = [];

        for (const pin of io) if (pin.type !== Pin.TYPE_STRUCTURAL) {
            const description = new InfoPinoutEntryDescription(getString(pin.description)).getElement();
            descriptions.push(description);

            info.appendChild(new InfoPinoutEntry(++index, pin).getElement(description));
        }

        for (const description of descriptions)
            extension.appendChild(description);
    };

    /**
     * Get the HTML element of this pinout information.
     * @param {HTMLElement} info An element to add extra information to.
     * @returns {HTMLElement} The HTML element of this list.
     */
    this.getElement = info => {
        const element = document.createElement("table");

        element.className = InfoPinouts.CLASS;
        makeEntries(element, info, configuration.io);

        return element;
    };
}

InfoPinouts.formatIndex = index => {
    let result = index.toString();

    while (result.length < InfoPinouts.INDEX_PADDING)
        result = "0" + result;

    return result;
};

InfoPinouts.CLASS = "pinouts";
InfoPinouts.INDEX_PADDING = 2;