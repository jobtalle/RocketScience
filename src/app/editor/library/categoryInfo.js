/**
 * An information box about the currently selected part.
 * @constructor
 */
import {CategoryInfoDescription} from "./categoryInfoDescription";
import {CategoryInfoTitle} from "./categoryInfoTitle";

export function CategoryInfo() {
    const _element = document.createElement("div");
    const _title = new CategoryInfoTitle();
    const _description = new CategoryInfoDescription();

    const make = () => {
        _element.id = CategoryInfo.ID;
        _element.appendChild(_title.getElement());
        _element.appendChild(_description.getElement());
    };

    /**
     * Set the information in this box.
     * @param {String} title The title.
     * @param {String} text The text, which may contain HTML.
     */
    this.setInfo = (title, text) => {
        _title.setTitle(title);
        _description.setText(text);
    };

    /**
     * Get the HTML element of this part list.
     * @returns {HTMLElement} The HTML element of this part list.
     */
    this.getElement = () => _element;

    make();
}

CategoryInfo.ID = "info";