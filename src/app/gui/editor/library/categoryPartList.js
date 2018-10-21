import {CategoryPart} from "./categoryPart";

/**
 * A list of parts.
 * @param {Object} parts The parts to place in this part list from parts.json.
 * @param {Function} setPart The function to be called when a part is selected.
 * @param {Info} info The information box.
 * @constructor
 */
export function CategoryPartList(parts, setPart, info) {
    const _element = document.createElement("div");
    const _parts = [];

    const make = () => {
        _element.className = CategoryPartList.CLASS;

        for (const part of parts) {
            const newPart = new CategoryPart(part, setPart, info);

            _element.appendChild(newPart.getElement());
            _parts.push(newPart);
        }
    };

    /**
     * Toggle expand or collapse state.
     */
    this.toggle = () => _element.classList.toggle(CategoryPartList.CLASS_CLOSED);

    /**
     * Get the HTML element of this part list.
     * @returns {HTMLElement} The HTML element of this part list.
     */
    this.getElement = () => _element;

    /**
     * Set the part budget the category should respect.
     * @param {BudgetInventory} budget A budget, or null if there is no budget.
     * @param {PartSummary} summary A summary of all the currently used parts.
     */
    this.setBudget = (budget, summary) => {
        for (const part of _parts)
            part.setBudget(budget, summary);
    };

    make();
}

CategoryPartList.CLASS = "part-list";
CategoryPartList.CLASS_CLOSED = "closed";