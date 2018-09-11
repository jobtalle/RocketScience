import {InfoPinoutEntryIndex} from "./infoPinoutEntryIndex";
import {getString} from "../../../language";
import {InfoPinoutEntryName} from "./infoPinoutEntryName";
import {InfoPinoutEntryDescription} from "./infoPinoutEntryDescription";
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
     * @returns {HTMLElement} The HTML element of this list.
     */
    this.getElement = () => {
        const row = document.createElement("tr");

        row.className = InfoPinoutEntry.CLASS;
        row.appendChild(makeColumn(new InfoPinoutEntryIndex(index).getElement()));
        row.appendChild(makeColumn(new InfoPinoutEntryName(getString(pin.name)).getElement()));
        //row.appendChild(new InfoPinoutEntryDescription(getString(pin.description)).getElement());

        switch (pin.type) {
            case Pin.TYPE_IN:
                row.classList.add(InfoPinoutEntry.CLASS_IN);
                break;
            case Pin.TYPE_OUT:
                row.classList.add(InfoPinoutEntry.CLASS_OUT);
                break;
        }

        return row;
    };
}

InfoPinoutEntry.CLASS = "pinout";
InfoPinoutEntry.CLASS_IN = "pinout-in";
InfoPinoutEntry.CLASS_OUT = "pinout-out";