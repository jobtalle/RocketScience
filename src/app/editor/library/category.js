/**
 * A library category of parts.
 * @param {Object} category A part category from parts.json.
 * @param {Function} setPart The function to be called when a part is selected.
 * @param {Function} setInfo The function to be called when new part info is selected.
 * @constructor
 */
import {CategoryTitle} from "./categoryTitle";
import {getString} from "../../language";
import {CategoryPartList} from "./categoryPartList";

export function Category(category, setPart, setInfo) {
    /**
     * Get the HTML element of this category.
     * @returns {HTMLElement} The HTML element of this category.
     */
    this.getElement = () => {
        const element = document.createElement("div");
        const partList = new CategoryPartList(category.parts, setPart, setInfo);

        element.appendChild(new CategoryTitle(getString(category.label), partList).getElement());
        element.appendChild(partList.getElement());

        return element;
    };
}