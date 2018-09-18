import {InfoPinoutEntryIndex} from "./infoPinoutEntryIndex";
import {getString} from "../../../language";
import {InfoPinoutEntryName} from "./infoPinoutEntryName";
import {Pin} from "../../../part/pin";

/**
 * A pinout entry.
 * @param {Number} index This pin's index.
 * @param {Object} pin A valid pin description.
 * @param {Boolean} selected A boolean which is true if this entry is currently selected.
 * @param {HTMLElement} [description] An optional description element to toggle visibility when hovering.
 * @constructor
 */
export function InfoPinoutEntry(index, pin, selected, description) {
    const _row = document.createElement("tr");

    let _label = null;
    let _hover = false;

    const make = () => {
        _row.className = InfoPinoutEntry.CLASS;
        _row.onmouseover = mouseOver;
        _row.onmouseout = mouseOut;
        _row.style.backgroundColor = Pin.getPinColor(pin).toHex();

        _row.appendChild(makeColumn(new InfoPinoutEntryIndex(index).getElement()));
        _row.appendChild(makeColumn(new InfoPinoutEntryName(getString(pin.name), selected).getElement()));
    };

    const mouseOver = () => {
        if (description)
            description.style.display = "block";

        _hover = true;

        if (_label)
            _label.setFocus(true);
    };

    const mouseOut = () => {
        if (description)
            description.style.display = "none";

        _hover = false;

        if (_label)
            _label.setFocus(false);
    };

    const makeColumn = element => {
        const td = document.createElement("td");

        td.appendChild(element);

        return td;
    };

    /**
     * Get the HTML element of this pin information.
     * @returns {HTMLElement} The HTML element of this list.
     */
    this.getElement = () => _row;

    /**
     * Set a label to highlight when hovering.
     * @param {OverlayPinoutsPin} label A pin label.
     */
    this.setLabel = label => {
        _label = label;

        if (_label && _hover)
            _label.setFocus(true);
    };

    make();
}

InfoPinoutEntry.CLASS = "pinout";