/**
 * A physics configuration.
 * @param {Number} gravity The gravity constant multiplier.
 * @constructor
 */

export function PhysicsConfiguration(gravity) {
    let _factor = gravity;
    /**
     * Get the gravity constant.
     * @returns {Number} The gravity constant.
     */
    this.getGravity = () => _factor * PhysicsConfiguration.GRAVITY_CONSTANT;

    /**
     * Get the gravity factor.
      * @returns {Number} The gravity factor.
     */
    this.getGravityFactor = () => _factor;

    /**
     * Set the gravity factor.
     * @param {Number} The gravity factor.
     */
    this.setGravityFactor = factor => _factor = factor;

    /**
     * Serializes this PhysicsConfiguration.
     * @param {ByteBuffer} buffer A byte buffer to serialize to.
     */
    this.serialize = buffer => {
        buffer.writeFloat(_factor);
    };
}

/**
 * Deserializes this PhysicsConfiguration.
 * @param {ByteBuffer} buffer A byte buffer to serialize from.
 */
PhysicsConfiguration.deserialize = buffer => {
    let gravity = buffer.readFloat();

    return new PhysicsConfiguration(gravity);
};

PhysicsConfiguration.GRAVITY_CONSTANT = 9.81;