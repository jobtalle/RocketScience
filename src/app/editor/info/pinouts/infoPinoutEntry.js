import {InfoPinoutEntryIndex} from "./infoPinoutEntryIndex";
import {getString} from "../../../language";
import {InfoPinoutEntryName} from "./infoPinoutEntryName";
import {InfoPinoutEntryDescription} from "./infoPinoutEntryDescription";

/**
 * A pinout entry.
 * @param {Number} index This pin's index.
 * @param {Object} pin A valid pin description.
 * @constructor
 */
export function InfoPinoutEntry(index, pin) {
    /**
     * Get the HTML element of this pin information.
     * @returns {HTMLElement} The HTML element of this list.
     */
    this.getElement = () => {
        const element = document.createElement("div");

        element.className = InfoPinoutEntry.CLASS;
        element.appendChild(new InfoPinoutEntryIndex(index).getElement());
        element.appendChild(new InfoPinoutEntryName(getString(pin.name)).getElement());
        element.appendChild(new InfoPinoutEntryDescription(getString(pin.description)).getElement());

        return element;
    };
}

InfoPinoutEntry.CLASS = "pinout";