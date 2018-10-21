import {Budget} from "./budget";

/**
 * A part budget to limit the number of parts used.
 * @param {Array} entries An array of BudgetInventory.Entry objects.
 * @constructor
 */
export function BudgetInventory(entries) {
    /**
     * Get the budget type.
     * @returns {Object} The type constant.
     */
    this.getType = () => Budget.TYPE_INVENTORY;

    /**
     * Get the entries for this budget.
     * @param {String} name The name of the part to look for an entry for.
     * @returns {BudgetInventory.Entry} An entry matching the name, or null if none was found.
     */
    this.getEntry = name => {
        for (const entry of entries) if (entry.name === name)
            return entry;

        return null;
    };
}

BudgetInventory.COUNT_INFINITE = -1;

/**
 * An inventory entry.
 * @param {String} name The name of the part.
 * @param {Number} count The number of parts of this type.
 * @constructor
 */
BudgetInventory.Entry = function(name, count) {
    this.name = name;
    this.count = count;
};