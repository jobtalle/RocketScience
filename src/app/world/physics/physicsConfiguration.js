/**
 * A physics configuration.
 * @param {Number} gravity The gravity constant multiplier.
 * @constructor
 */

export function PhysicsConfiguration(gravity) {
    /**
     * Get the gravity constant.
     * @returns {Number} The gravity constant.
     */
    this.getGravity = () => gravity * PhysicsConfiguration.GRAVITY_CONSTANT;

    this.serialize = buffer => {
        buffer.writeFloat(gravity);
    };
}

PhysicsConfiguration.deserialize = buffer => {
    let gravity = buffer.readFloat();

    return new PhysicsConfiguration(gravity);
};

PhysicsConfiguration.GRAVITY_CONSTANT = 9.81;