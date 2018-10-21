import {Budget} from "./budget";

/**
 * A part budget to limit the number of parts used.
 * @param {Array} entries An array of BudgetInventory.Entry objects.
 * @constructor
 */
export function BudgetInventory(entries) {
    const _entries = {};

    const build = () => {
        for (const entry of entries)
            _entries[entry.name] = entry.count;
    };

    /**
     * Get the budget type.
     * @returns {Object} The type constant.
     */
    this.getType = () => Budget.TYPE_INVENTORY;

    /**
     * Get the budget of a part.
     * @param {String} name The part name.
     * @returns {Number} The maximum number of instantiations for this part, or null if this was not specified.
     */
    this.getCount = name => {
        const budget = _entries[name];

        if (budget === undefined)
            return null;

        return budget;
    };

    build();
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