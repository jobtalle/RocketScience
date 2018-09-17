import {InfoPinoutEntryIndex} from "./infoPinoutEntryIndex";
import {getString} from "../../../language";
import {InfoPinoutEntryName} from "./infoPinoutEntryName";
import {Pin} from "../../../part/pin";

/**
 * A pinout entry.
 * @param {Number} index This pin's index.
 * @param {Object} pin A valid pin description.
 * @constructor
 */
export function InfoPinoutEntry(index, pin) {
    const makeColumn = element => {
        const td = document.createElement("td");

        td.appendChild(element);

        return td;
    };

    /**
     * Get the HTML element of this pin information.
     * @param {HTMLElement} [description] An optional description element to toggle visibility when hovering.
     * @returns {HTMLElement} The HTML element of this list.
     */
    this.getElement = description => {
        const row = document.createElement("tr");
        const color = Pin.getPinColor(pin);

        row.className = InfoPinoutEntry.CLASS;
        row.appendChild(makeColumn(new InfoPinoutEntryIndex(index).getElement()));
        row.appendChild(makeColumn(new InfoPinoutEntryName(getString(pin.name)).getElement()));

        if (description) {
            row.onmouseover = () => description.style.display = "block";
            row.onmouseout = () => description.style.display = "none";
        }

        row.style.backgroundColor = color.toHex();

        return row;
    };
}

InfoPinoutEntry.CLASS = "pinout";