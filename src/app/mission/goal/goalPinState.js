import {PcbGraph} from "../../pcb/pcbGraph";
import {getPartFromId, getPartId} from "../../part/objects";
import {Goal} from "./goal";

/**
 * Check if a part exists of which a certain pin's value matches a given value.
 * @param {String} part A valid part name; the goal will check all parts of this type.
 * @param {Number} pinIndex A pin index to check state from.
 * @param {Number} pinValue The value this pin must have for the goal to succeed, must be 0 or 1.
 * @constructor
 */
export function GoalPinState(part, pinIndex, pinValue) {
    let _isEdited = false;

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
     * @returns {Number} The objective type.
     */
    this.getType = () => Goal.TYPE_PIN_STATE;

    /**
     * Get the part.
     * @returns {String} A valid part name.
     */
    this.getPart = () => part;

    /**
     * Set the part.
     * @param {String} newPart A valid part name.
     */
    this.setPart = newPart => {
        part = newPart;
        _isEdited = true;
    };

    /**
     * Get the pin index that is evaluated.
     * @returns {Number} The pin index.
     */
    this.getPinIndex = () => pinIndex;

    /**
     * Set the pin index that is evaluated.
     * @param {Number} newPinIndex A valid pin index within the part.
     */
    this.setPinIndex = newPinIndex => {
        pinIndex = newPinIndex;
        _isEdited = true;
    };

    /**
     * Get the value the pin must have for the goal to succeed.
     * @returns {Number} The pin value, zero or one.
     */
    this.getPinValue = () => pinValue;

    /**
     * Set the pin value.
     * @param {Number} newPinValue A valid pin value that must be either zero or one.
     */
    this.setPinValue = newPinValue => {
        pinValue = newPinValue;
        _isEdited = true;
    };

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
     * Check whether the goal information has been edited (mission editor only).
     * @returns {Boolean} A boolean indicating whether this goal has been edited.
     */
    this.isEdited = () => _isEdited;

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

/**
 * Deserialize a goal.
 * @param {ByteBuffer} buffer A byte buffer.
 * @returns {GoalPinState} The deserialized GoalPinState.
 */
GoalPinState.deserialize = buffer => {
    let part = getPartFromId(buffer.readByte()).object;
    let pinIndex = buffer.readByte();
    let pinValue = buffer.readByte();

    return new GoalPinState(part, pinIndex, pinValue);
};