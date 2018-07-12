/**
 * Representation of physics object in the game.
 */
export class PhysicsObject {
    /**
     * Construct a new physics object.
     * @param {Physics} physics Physics engine.
     * @param {Objects} body Box2d physics body.
     */
    constructor(physics, body) {
        /**
         * Change the position of the object.
         * @param {Number} x Horizontal position.
         * @param {Number} y Vertical position.
         * @param {Number} rotation Rotation of the object.
         */
        this.translate = (x, y, rotation = 0) => {
            body.SetTransform(new physics.b2Vec2(x, y), rotation);
        };

        /**
         * Set active state of the object.
         * @param {boolean} active
         */
        this.setActive = active => {
            body.SetActive(active);
        };

        /**
         * Return the current position.
         * @return {{x: Number, y: Number}}
         */
        this.getTransform = () => {
            const transform = body.GetTransform();
            return {x: transform.x, y: transform.y};
        }
    }
}