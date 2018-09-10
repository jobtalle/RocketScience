/**
 * A pinout entry.
 * @param {Number} index This pin's index.
 * @param {Object} pin A valid pin description.
 * @constructor
 */
import {InfoPinoutEntryIndex} from "./infoPinoutEntryIndex";

export function InfoPinoutEntry(index, pin) {
    /**
     * Get the HTML element of this pin information.
     * @returns {HTMLElement} The HTML element of this list.
     */
    this.getElement = () => {
        const element = document.createElement("div");

        element.className = InfoPinoutEntry.CLASS;
        element.appendChild(new InfoPinoutEntryIndex(index).getElement());

        return element;
    };
}

InfoPinoutEntry.CLASS = "pinout";