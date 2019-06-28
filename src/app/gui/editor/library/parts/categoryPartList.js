import {CategoryPart} from "./categoryPart";

/**
 * A list of parts.
 * @param {Object} parts The parts to place in this part list from parts.json.
 * @param {Function} setPart The function to be called when a part is selected.
 * @param {Info} info The information box.
 * @param {Boolean} isEditable A boolean indicating whether the displayed part budgets are editable.
 * @constructor
 */
export function CategoryPartList(parts, setPart, info, isEditable) {
    const _element = document.createElement("div");
    const _parts = [];

    const make = () => {
        _element.className = CategoryPartList.CLASS;

        for (const part of parts) {
            const newPart = new CategoryPart(part, setPart, info, isEditable);

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
     * @returns {Boolean} Returns true if any parts exist in this category after filtering by budget.
     */
    this.setBudget = (budget, summary) => {
        let hasParts = false;

        for (const part of _parts) if (part.setBudget(budget, summary))
            hasParts = true;

        return hasParts;
    };

    make();
}

CategoryPartList.CLASS = "part-list";
CategoryPartList.CLASS_CLOSED = "closed";