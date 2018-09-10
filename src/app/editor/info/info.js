import "../../../styles/info.css"
import {InfoTitle} from "./InfoTitle";
import {InfoDescription} from "./InfoDescription";

/**
 * An information box about the currently selected part.
 * @constructor
 */
export function Info() {
    const _element = document.createElement("div");
    const _title = new InfoTitle();
    const _description = new InfoDescription();

    const make = () => {
        _element.id = Info.ID;
    };

    /**
     * Clear any information displayed by this element.
     */
    this.clear = () => {
        let element;

        while(element = _element.firstChild)
        _element.removeChild(element);
    };

    /**
     * Set the information in this box.
     * @param {String} title The title.
     * @param {String} text The text, which may contain HTML.
     */
    this.setText = (title, text) => {
        this.clear();

        _title.setTitle(title);
        _description.setText(text);

        _element.appendChild(_title.getElement());
        _element.appendChild(_description.getElement());
    };

    /**
     * Get the HTML element of this part list.
     * @returns {HTMLElement} The HTML element of this part list.
     */
    this.getElement = () => _element;

    make();
}

Info.ID = "info";