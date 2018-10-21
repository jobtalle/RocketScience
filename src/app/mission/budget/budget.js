/**
 * A part budget to limit the number of parts used.
 * @param {Object} type A valid budget type constant.
 * @constructor
 */
export function Budget(type) {
    /**
     * Get the budget type.
     * @returns {Object} The type constant.
     */
    this.getType = () => type;
}

Budget.TYPE_COST = 0;
Budget.TYPE_INVENTORY = 1;