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
    const _element = document.createElement("div");
    const _partList = new CategoryPartList(category.parts, setPart, info);

    const build = () => {
        _element.appendChild(new CategoryTitle(getString(category.label), _partList).getElement());
        _element.appendChild(_partList.getElement());
    };

    /**
     * Get the HTML element of this category.
     * @returns {HTMLElement} The HTML element of this category.
     */
    this.getElement = () => _element;

    /**
     * Set the part budget the category should respect.
     * @param {Budget} budget A budget, or null if there is no budget.
     * @param {PartSummary} summary A summary of all the currently used parts.
     */
    this.setBudget = (budget, summary) => {
        _partList.setBudget(budget, summary);
    };

    build();
}