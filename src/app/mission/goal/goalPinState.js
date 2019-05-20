import {PcbGraph} from "../../pcb/pcbGraph";
import {getPartFromId, getPartId} from "../../part/objects";
import {Goal} from "./goal";

/**
 * Check if a part exists of which a certain pin's value matches a given value.
 * @param {String} part A valid part name; the goal will check all parts of this type.
 * @param {Number} pinIndex A pin index to check state from.
 * @param {Number} pinValue The value this pin must have for the goal to succeed.
 * @constructor
 */
export function GoalPinState(part, pinIndex, pinValue) {
    const PinCheck = function(state, index) {
        this.check = value => state[index] === value;
    };

    let _checks = null;

    this.prime = objects => {
        _checks = [];

        for (const object of objects) {
            let graph = null;

            for (const fixture of object.getPcb().getFixtures()) {
                if (fixture.part.getDefinition().object === part) {
                    if (!graph)
                        graph = new PcbGraph(object.getPcb());

                    _checks.push(new PinCheck(object.getState().getArray(), graph.getPinPointers(fixture)[pinIndex]));
                }
            }
        }
    };

    /**
     * Get the objective type.
     */
    this.getType = () => Goal.TYPE_PIN_STATE;

    /**
     * Evaluate whether this goal condition has been met.
     * @returns {Boolean} True if the goal succeeded.
     */
    this.validate = () => {
        for (const check of _checks) if (check.check(pinValue))
            return true;

        return false;
    };

    /**
     * Serialize this goal.
     * @param {ByteBuffer} buffer A byte buffer.
     */
    this.serialize = buffer => {
        buffer.writeByte(getPartId(part));
        buffer.writeByte(pinIndex);
        buffer.writeByte(pinValue);
    };
}

GoalPinState.deserialize = buffer => {
    let part = getPartFromId(buffer.readByte()).object;
    let pinIndex = buffer.readByte();
    let pinValue = buffer.readByte();

    return new GoalPinState(part, pinIndex, pinValue);
};