import {CategoryTitle} from "./categoryTitle";
import {getString} from "../../../text/language";
import {CategoryPartList} from "./categoryPartList";

/**
 * A library category of parts.
 * @param {Object} category A part category from parts.json.
 * @param {Function} setPart The function to be called when a part is selected.
 * @param {Info} info The information box.
 * @constructor
 */
export function Category(category, setPart, info) {
    /**
     * Get the HTML element of this category.
     * @returns {HTMLElement} The HTML element of this category.
     */
    this.getElement = () => {
        const element = document.createElement("div");
        const partList = new CategoryPartList(category.parts, setPart, info);

        element.appendChild(new CategoryTitle(getString(category.label), partList).getElement());
        element.appendChild(partList.getElement());

        return element;
    };
}