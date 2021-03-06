import {getString} from "../../../text/language";
import {BudgetInventory} from "../../../mission/budget/budgetInventory";
import {Budget} from "../../../mission/budget/budget";

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

    const makeCount = count => {
        const countElement = document.createElement("div");

        if (count <= BudgetInventory.COUNT_INFINITE)
            count = CategoryPart.TEXT_INFINITE;

        countElement.className = CategoryPart.CLASS_COUNT;
        countElement.innerHTML = count;

        return countElement;
    };

    /**
     * Get the HTML element of this category.
     * @returns {HTMLElement} The HTML element of this category.
     */
    this.getElement = () => _element;

    /**
     * Set the part budget the category should respect.
     * @param {BudgetInventory} budget A budget, or null if there is no budget.
     * @param {PartSummary} summary A summary of all the currently used parts.
     * @returns {Boolean} A boolean which is False if the part is not visible.
     */
    this.setBudget = (budget, summary) => {
        while (_element.firstChild)
            _element.removeChild(_element.firstChild);

        _element.classList.remove(CategoryPart.CLASS_NOT_AVAILABLE);
        _element.classList.remove(CategoryPart.CLASS_NOT_SPECIFIED);

        if (!budget)
            return true;

        switch (budget.getType()) {
            case Budget.TYPE_INVENTORY:
                const count = budget.getCount(part.object);
                let available = 0;

                if (count !== null) {
                    available = count - summary.getPartCount(part.object);

                    _element.appendChild(makeCount(available));

                    if (available === 0)
                        _element.classList.add(CategoryPart.CLASS_NOT_AVAILABLE);
                }
                else {
                    _element.classList.add(CategoryPart.CLASS_NOT_SPECIFIED);

                    return false;
                }

                break;
        }

        return true;
    };

    make();
}

CategoryPart.CLASS = "part";
CategoryPart.CLASS_NOT_AVAILABLE = "not-available";
CategoryPart.CLASS_NOT_SPECIFIED = "not-specified";
CategoryPart.CLASS_COUNT = "count";
CategoryPart.TEXT_INFINITE = "&#8734";