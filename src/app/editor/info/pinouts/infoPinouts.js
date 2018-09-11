import {InfoPinoutEntry} from "./infoPinoutEntry";
import {Pin} from "../../../part/pin";

/**
 * A list of pinouts.
 * @param {Object} configuration A valid part configuration to read pins from.
 * @constructor
 */
export function InfoPinouts(configuration) {
    const makeEntries = (element, io) => {
        let index = 0;

        for (const pin of io) if (pin.type !== Pin.TYPE_STRUCTURAL)
            element.appendChild(new InfoPinoutEntry(++index, pin).getElement());
    };

    /**
     * Get the HTML element of this pinout information.
     * @returns {HTMLElement} The HTML element of this list.
     */
    this.getElement = () => {
        const element = document.createElement("table");

        element.className = InfoPinouts.CLASS;
        makeEntries(element, configuration.io);

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