import {InfoPinouts} from "./infoPinouts";

/**
 * The index of a pinout.
 * @param {Number} index The pin index.
 * @constructor
 */
export function InfoPinoutEntryIndex(index) {
    const _element = document.createElement("div");

    const make = () => {
        _element.className = InfoPinoutEntryIndex.CLASS;
        _element.innerText = InfoPinouts.formatIndex(index);
    };

    /**
     * Get the HTML element of this pin index.
     * @returns {HTMLElement} The HTML element of this element.
     */
    this.getElement = () => _element;

    make();
}

InfoPinoutEntryIndex.CLASS = "pinout-index";