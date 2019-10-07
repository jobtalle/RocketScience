import {Goal} from "./goal";

/**
 * Check if a robot location exceeds a boundary.
 * @param {Number} x The target X location in meters.
 * @param {Number} y The target Y location in meters.
 * @param {Number} radius The radius the object needs to be within.
 * @constructor
 */
export function GoalPosition(x, y, radius) {
    let _isEdited = false;
    let _objects = null;

    this.prime = objects => {
        _objects = objects;
    };

    /**
     * Get the target X location.
     * @returns {Number} The X location in meters.
     */
    this.getX = () => x;

    /**
     * Get the target Y location.
     * @returns {Number} The Y location in meters.
     */
    this.getY = () => y;

    /**
     * Get the target radius.
     * @returns {Number} The target radius in meters.
     */
    this.getRadius = () => radius;

    /**
     * Set the target X location.
     * @param {Number} newX The X location in meters.
     */
    this.setX = newX => {
        _isEdited = true;
        x = newX;
    };

    /**
     * Set the target Y location.
     * @param {Number} newY The Y location in meters.
     */
    this.setY = newY => {
        _isEdited = true;
        y = newY;
    };

    /**
     * Set the target radius.
     * @param {Number} newRadius The new radius in meters.
     */
    this.setRadius = newRadius => {
        _isEdited = true;
        radius = newRadius;
    };

    /**
     * Get the objective type.
     * @returns {Number} The objective type.
     */
    this.getType = () => Goal.TYPE_POSITION;

    /**
     * Evaluate whether this goal condition has been met.
     * @returns {Boolean} True if the goal succeeded.
     */
    this.validate = () => {
        if (_objects) for (const object of _objects) {
            const dx = object.getBody().getPosition().x - x;
            const dy = object.getBody().getPosition().y - y;

            if (dx * dx + dy * dy < radius * radius)
                return true;
        }

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
        buffer.writeFloat(x);
        buffer.writeFloat(y);
        buffer.writeFloat(radius);
    };
}

/**
 * Deserialize a goal.
 * @param {ByteBuffer} buffer A byte buffer.
 * @returns {GoalPosition} The deserialized GoalPosition.
 */
GoalPosition.deserialize = buffer => {
    const x = buffer.readFloat();
    const y = buffer.readFloat();
    const radius = buffer.readFloat();

    return new GoalPosition(x, y, radius);
};