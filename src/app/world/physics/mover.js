import {getb2Vec2} from "./internal/box2d";

// Only instantiate movers from body!
export function Mover(body, xOffset, yOffset) {
    let _force = null;

    /**
     * Set a force to apply to the body.
     * @param {Myr.Vector} vector A force vector, or null if no force should be applied.
     */
    this.setForce = vector => {
        _force = vector;
    };

    /**
     * Update this mover.
     * @param {Number} timeStep The time step.
     */
    this.update = timeStep => {
        if (_force) {
            const forcePosition = body._getBody().GetWorldPoint(getb2Vec2(xOffset, yOffset));
            const force = _force.copy();

            force.rotate(body._getBody().GetAngle());
            force.multiply(timeStep);

            body._getBody().ApplyForce(
                getb2Vec2(force.x, force.y),
                forcePosition,
                true);
        }
    };

    /**
     * Free this mover.
     */
    this.free = () => {};
}