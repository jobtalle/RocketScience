import {GoalPinState} from "./goal/goalPinState";
import {Goal} from "./goal/goal";

/**
 * An objective made up of a number of goals.
 * @param {Array} goals An array of valid goals to complete.
 * @param {String} title A title describing this objective.
 * @constructor
 */
export function Objective(goals, title) {
    /**
     * Get the text describing this objective.
     * @returns {String} A string describing this objective.
     */
    this.getTitle = () => title;

    /**
     * Set the title.
     * @param {String} newTitle The new title.
     */
    this.setTitle = newTitle => title = newTitle;

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

        for (const goal of goals) {
            buffer.writeByte(goal.getType());
            goal.serialize(buffer);
        }

        buffer.writeString(title);
    };
}

Objective.deserialize = buffer => {
    const goals = [];
    const goalCount = buffer.readByte();

    for (let idx = 0; idx < goalCount; ++idx) {
        switch (buffer.readByte()) {
            case Goal.TYPE_PIN_STATE:
                goals.push(GoalPinState.deserialize(buffer));

                break;
        }
    }

    const title = buffer.readString();

    return new Objective(goals, title);
};