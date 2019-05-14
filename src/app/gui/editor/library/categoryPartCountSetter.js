/**
 * An editable part count field, which will update the part budget if modified.
 * @param {Object} budget An instance of BudgetInventory to modify.
 * @param {String} name The part name.
 * @constructor
 */
export function CategoryPartCountSetter(budget, name) {
    const _element = document.createElement("div");

    const make = () => {
        _element.classList.add(CategoryPartCountSetter.CLASS);

    };

    /**
     * Get the HTML element of this part count setter.
     * @returns {HTMLElement} The HTML element of this setter.
     */
    this.getElement = () => _element;

    make();
}

CategoryPartCountSetter.CLASS = "count-setter";