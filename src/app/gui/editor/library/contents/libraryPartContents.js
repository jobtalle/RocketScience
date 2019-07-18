import {Category} from "../parts/category";
import {BudgetChooser} from "../budgetChooser";

/**
 * A scrolling list containing all library contents.
 * @param {Array} categories The categories containing all parts from parts.json.
 * @param {Function} setPart A function to call when a part should be set.
 * @param {PcbEditor} editor The pcb editor.
 * @param {Info} info The info object.
 * @param {Boolean} isEditable A boolean indicating whether the part budget is editable.
 * @constructor
 */
export function LibraryPartContents(categories, setPart, editor, info, isEditable) {
    const _element = document.createElement("div");
    const _categories = [];

    const _budgetChooser = isEditable ? new BudgetChooser((budget) => editor.setBudget(budget)) : null;

    const make = () => {
        _element.id = LibraryPartContents.ID;

        if (isEditable)
            _element.appendChild(_budgetChooser.getElement());

        for (const category of categories) {
            const newCategory = new Category(category, setPart, info, isEditable);

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

        if (_budgetChooser)
            _budgetChooser.setBudget(budget);
    };

    make();
}

LibraryPartContents.ID = "part-contents";
LibraryPartContents.SCROLL_SPEED = 32;