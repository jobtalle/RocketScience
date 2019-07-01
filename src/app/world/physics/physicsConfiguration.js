/**
 * A physics configuration.
 * @param {Number} gravityFactor The gravity constant multiplier.
 * @param {Number} atmosphereHeight The height at which the atmosphere density starts to drop in meters.
 * @constructor
 */

export function PhysicsConfiguration(gravityFactor, atmosphereHeight) {
    let _isEdited = false;

    /**
     * Get the gravity constant.
     * @returns {Number} The gravity constant.
     */
    this.getGravity = () => gravityFactor * PhysicsConfiguration.GRAVITY_CONSTANT;

    /**
     * Get the gravity factor.
      * @returns {Number} The gravity factor.
     */
    this.getGravityFactor = () => gravityFactor;

    /**
     * Get the atmosphere height.
     * @returns {Number} The atmosphere height in meters.
     */
    this.getAtmosphereHeight = () => atmosphereHeight;

    /**
     * Set the gravity factor.
     * @param {Number} factor The gravity factor.
     */
    this.setGravityFactor = factor => {
        gravityFactor = factor;

        _isEdited = true;
    };

    /**
     * Set the atmosphere height.
     * @param {Number} height The new atmosphere height in meters.
     * @returns {*}
     */
    this.setAtmosphereHeight = height => atmosphereHeight = height;

    /**
     * Check whether the physics configuration has been edited (mission editor only).
     * @returns {Boolean} A boolean indicating whether this physics configuration has been edited.
     */
    this.isEdited = () => _isEdited;

    /**
     * Serializes this PhysicsConfiguration.
     * @param {ByteBuffer} buffer A byte buffer to serialize to.
     */
    this.serialize = buffer => {
        buffer.writeFloat(gravityFactor);
        buffer.writeFloat(atmosphereHeight);
    };
}

/**
 * Deserializes this PhysicsConfiguration.
 * @param {ByteBuffer} buffer A byte buffer to serialize from.
 */
PhysicsConfiguration.deserialize = buffer => {
    return new PhysicsConfiguration(
        buffer.readFloat(),
        buffer.readFloat());
};

PhysicsConfiguration.GRAVITY_CONSTANT = 9.81;