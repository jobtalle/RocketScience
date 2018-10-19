/**
 * Check if a part exists of which a certain pin's value matches a given value.
 * @param {String} part A valid part name; the goal will check all parts with this name.
 * @param {Number} pinIndex A pin index to check state from.
 * @param {Number} pinValue The value this pin must have for the goal to succeed.
 * @constructor
 */
export function GoalPinState(part, pinIndex, pinValue) {
    this.prime = objects => {
        console.log("Pin state primed");
    };

    this.validate = () => {

    };
}