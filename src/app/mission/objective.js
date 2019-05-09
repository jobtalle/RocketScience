import {GoalPinState} from "./goal/goalPinState";

/**
 * An objective made up of a number of goals.
 * @param {Array} goals An array of valid goals to complete.
 * @param {String} name A name describing this objective.
 * @constructor
 */

export function Objective(goals, name) {
    /**
     * Get the text describing this objective.
     * @returns {String} A string describing this objective.
     */
    this.getName = () => name;

    /**
     * Prime this objective for operation.
     * @param {Array} objects An array containing all editable PCB's as game objects in order.
     */
    this.prime = objects => {
        for (const goal of goals)
            goal.prime(objects);
    };

    /**
     * Check if all goals check out.
     * @returns {Boolean} A boolean which is true if this objective is met.
     */
    this.validate = () => {
        for (const goal of goals) if (!goal.validate())
            return false;

        return true;
    };

    this.serialize = buffer => {
        buffer.writeByte(goals.length);
        for (const goal of goals)
            goal.serialize(buffer);

        buffer.writeString(name);
    };
}

Objective.deserialize = buffer => {
    let goals = [];

    let goalLength = buffer.readByte();
    for (let idx = 0; idx < goalLength; ++idx)
        goals.push(GoalPinState.deserialize(buffer));

    let name = buffer.readString();

    return new Objective(goals, name);
};