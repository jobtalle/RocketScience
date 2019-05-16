import {Category} from "./category";

/**
 * A scrolling list containing all library contents.
 * @param {Array} categories The categories containing all parts from parts.json.
 * @param {Function} setPart A function to call when a part should be set.
 * @param {Info} info The info object.
 * @param {Boolean} editable A boolean indicating whether the part budget is editable.
 * @constructor
 */
export function LibraryContents(categories, setPart, info, editable) {
    const _element = document.createElement("div");
    const _categories = [];

    const make = () => {
        _element.id = LibraryContents.ID;

        for (const category of categories) {
            const newCategory = new Category(category, setPart, info, editable);

            _categories.push(newCategory);

            _element.appendChild(newCategory.getElement());
        }
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement}
     */
    this.getElement = () => _element;

    /**
     * Set the part budget the library should respect.
     * @param {BudgetInventory} budget A budget, or null if there is no budget.
     * @param {PartSummary} summary A summary of all the currently used parts.
     */
    this.setBudget = (budget, summary) => {
        for (const category of _categories)
            category.setBudget(budget, summary);
    };

    make();
}

LibraryContents.ID = "contents";