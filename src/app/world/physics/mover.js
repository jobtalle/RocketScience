import {box2d, getb2Vec2} from "./internal/box2d";

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

            // TODO: Rotate force!
            body._getBody().ApplyForce(
                getb2Vec2(_force.x * timeStep, _force.y * timeStep),
                forcePosition);
        }
    };

    /**
     * Free this mover.
     */
    this.free = () => {};
}