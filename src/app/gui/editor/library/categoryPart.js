import {getString} from "../../../text/language";

/**
 * A part button used to instantiate a part.
 * @param {Object} part A part from parts.json.
 * @param {Function} setPart The function to be called when a part is selected.
 * @param {Info} info The information box.
 * @constructor
 */
export function CategoryPart(part, setPart, info) {
    const _element = document.createElement("div");

    const onClick = () => {
        info.clearText();

        setPart(part);
    };

    const onEnter = () => info.setText(getString(part.label), getString(part.description));

    const onLeave = () => info.clearText();

    const make = () => {
        _element.classList.add(CategoryPart.CLASS);
        _element.classList.add("sprite");
        _element.classList.add(part.icon);

        _element.onclick = onClick;
        _element.onmouseover = onEnter;
        _element.onmouseout = onLeave;
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

    };

    make();
}

CategoryPart.CLASS = "part";