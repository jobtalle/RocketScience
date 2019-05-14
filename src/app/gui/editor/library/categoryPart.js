import {getString} from "../../../text/language";
import {BudgetInventory} from "../../../mission/budget/budgetInventory";
import {Budget} from "../../../mission/budget/budget";
import {CategoryPartCountSetter} from "./categoryPartCountSetter";
import {CategoryPartCount} from "./categoryPartCount";

/**
 * A part button used to instantiate a part.
 * @param {Object} part A part from parts.json.
 * @param {Function} setPart The function to be called when a part is selected.
 * @param {Info} info The information box.
 * @param {Boolean} editable A boolean indicating whether the displayed part budgets are editable.
 * @constructor
 */
export function CategoryPart(part, setPart, info, editable) {
    const _element = document.createElement("div");

    const onClick = () => {
        info.clearText();

        setPart(part);
    };

    const onEnter = () => info.setText(getString(part.label), getString(part.description));

    const onLeave = () => info.clearText();

    const makeSprite = () => {
        const element = document.createElement("div");

        element.classList.add("sprite");
        element.classList.add(part.icon);
        element.onclick = onClick;
        element.onmouseover = onEnter;
        element.onmouseout = onLeave;

        return element;
    };

    const make = () => {
        _element.classList.add(CategoryPart.CLASS);
        _element.appendChild(makeSprite());
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

        _element.appendChild(makeSprite());
        _element.classList.remove(CategoryPart.CLASS_NOT_AVAILABLE);
        _element.classList.remove(CategoryPart.CLASS_NOT_SPECIFIED);

        if (!budget)
            return true;

        switch (budget.getType()) {
            case Budget.TYPE_INVENTORY:
                if (editable) {
                    const counter = new CategoryPartCount(budget.getCount(part.object), part.object, summary);

                    _element.appendChild(new CategoryPartCountSetter(budget, part.object, counter).getElement());
                    _element.appendChild(counter.getElement());
                }
                else {
                    const count = budget.getCount(part.object);

                    if (count !== null) {
                        const available = count - summary.getPartCount(part.object);

                        _element.appendChild(new CategoryPartCount(count, part.object, summary).getElement());

                        if (available === 0)
                            _element.classList.add(CategoryPart.CLASS_NOT_AVAILABLE);
                    } else {
                        _element.classList.add(CategoryPart.CLASS_NOT_SPECIFIED);

                        return false;
                    }
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