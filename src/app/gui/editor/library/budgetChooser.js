import {getString} from "../../../text/language";
import {Budget} from "../../../mission/budget/budget";
import {BudgetInventory} from "../../../mission/budget/budgetInventory";

/**
 * A budget chooser GUI for mission edit mode.
 * @param {Function} setBudget A function that can be called to set a new budget.
 * @constructor
 */
export function BudgetChooser(setBudget) {
    const _element = document.createElement("div");
    const _selector = document.createElement("select");

    const makeOption = (value, title) => {
        const option = document.createElement("option");

        option.value = value;
        option.innerText = title;

        return option;
    };

    const make = () => {
        _selector.appendChild(makeOption(
            -1,
            getString(BudgetChooser.TEXT_BUDGET_NONE)));

        _selector.appendChild(makeOption(
            Budget.TYPE_INVENTORY,
            getString(BudgetChooser.TEXT_BUDGET_INVENTORY)));

        _selector.onchange = () => {
            switch (_selector.value) {
                case (-1).toString():
                    setBudget(null);

                    break;
                case Budget.TYPE_INVENTORY.toString():
                    setBudget(new BudgetInventory([]));

                    break;
            }
        };

        _element.id = BudgetChooser.ID;
        _element.appendChild(_selector);
    };

    /**
     * Get the HTML element.
     * @returns {HTMLElement}
     */
    this.getElement = () => _element;

    /**
     * Set the budget currently being used.
     * @param {Object} budget A valid part budget object or null for an infinite budget.
     */
    this.setBudget = budget => {
        if (budget)
            _selector.value = budget.getType();
        else
            _selector.value = (-1).toString();
    };

    make();
}

BudgetChooser.ID = "budget-chooser";
BudgetChooser.TEXT_BUDGET_NONE = "BUDGET_TYPE_NONE";
BudgetChooser.TEXT_BUDGET_INVENTORY = "BUDGET_TYPE_INVENTORY";