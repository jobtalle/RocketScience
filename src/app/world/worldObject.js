/**
 * A physics object to be simulated.
 * @param {Object} hull The grid of the object.
 * @constructor
 */
export default function WorldObject(myr, hull) {
    let _position = new myr.Vector(hull.getXOrigin(), hull.getYOrigin());
    let _velocity = new myr.Vector(0, 0);

    /**
     * Return the current position.
     * @returns {Myr.Vector} Current position.
     */
    this.getPosition = () => _position;

    /**
     * Return the hull of the object.
     * @returns {Object} The hull.
     */
    this.getHull = () => hull;

    /**
     * Set the current velocity of the object.
     * @param {Myr.Vector} velocity The current velocity.
     */
    this.setVelocity = velocity => {
       _velocity = velocity;
    };

    /**
     * Add a force to the WorldObject.
     * @param {Myr.Vector} force Force to apply.
     */
    this.addForce = force => {
        _velocity.add(force);
    };

    /**
     * Return true if the other object collides.
     * @param {WorldObject} other Other world object to check against.
     * @returns {boolean} If the other object overlaps.
     */
    this.isColliding = other => {
        let xDistance = Math.abs(_position.x - other.getPosition().x);
        let yDistance = Math.abs(_position.y - other.getPosition().y);
        let otherHull = other.getHull();
        let width  = hull.getWidth() / 2 + otherHull.getWidth() / 2;
        let height = hull.getHeight() / 2 + otherHull.getHeight() / 2;

        return xDistance > width || yDistance > height;
    };

    /**
     * Update the state of this object.
     * @param {Number} timeStep The number of milliseconds passed after the previous update.
     */
    this.update = timeStep => {
        _position.x = _velocity.x * timeStep;
        _position.y = _velocity.y * timeStep;
    };
};