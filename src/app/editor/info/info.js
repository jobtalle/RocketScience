import "../../../styles/info.css"
import {InfoTitle} from "./description/InfoTitle";
import {InfoDescription} from "./description/InfoDescription";
import {InfoPinouts} from "./pinouts/infoPinouts";

/**
 * An information box about the currently selected part.
 * @constructor
 */
export function Info() {
    const _element = document.createElement("div");
    const _extension = document.createElement("div");
    let _pinouts = null;

    const make = () => {
        _element.id = Info.ID;
        _extension.id = Info.ID_EXTENSION;
    };

    const clear = () => {
        let element;

        while (element = _element.firstChild)
            _element.removeChild(element);

        while (element = _extension.firstChild)
            _extension.removeChild(element);
    };

    /**
     * Display a part description in this box.
     * @param {String} title The title.
     * @param {String} text The text, which may contain HTML.
     */
    this.setText = (title, text) => {
        clear();

        _element.appendChild(new InfoTitle(title).getElement());
        _element.appendChild(new InfoDescription(text).getElement());
    };

    /**
     * Clear the current text.
     */
    this.clearText = () => {
        clear();

        if (_pinouts)
            _element.appendChild(_pinouts.getElement(_extension));
    };

    /**
     * Display pinout information.
     * @param {Object} configuration A valid part configuration to read pins from.
     */
    this.setPinouts = configuration => {
        clear();

        if (configuration) {
            _pinouts = new InfoPinouts(configuration);

            _element.appendChild(_pinouts.getElement(_extension));
        } else
            _pinouts = null;
    };

    /**
     * Set the contents of the info box extension.
     * @param {HTMLElement} element An element to add to the extension box. May be null.
     */
    this.setExtension = element => {
        let e;

        while (e = _extension.firstChild)
            _extension.removeChild(e);

        if (element)
            _extension.appendChild(element);
    };

    /**
     * Get the HTML element of this info box.
     * @returns {HTMLElement} The HTML element of this part list.
     */
    this.getElement = () => _element;

    /**
     * Get the extension element of this info box.
     * @returns {HTMLElement} The HTML element of this info extension.
     */
    this.getExtension = () => _extension;

    make();
}

Info.ID = "info";
Info.ID_EXTENSION = "info-extension";