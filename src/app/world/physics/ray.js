import {box2d, getb2Vec2, getb2Vec2A, getb2Vec2B} from "./internal/box2d";

/**
 * A ray listener casts a ray into the physics world, the length until the first bounce can be queried.
 * @param {Object} world The physics world.
 * @param {Body} body The body this ray casts from.
 * @param {Number} x The X location on the body in meters.
 * @param {Number} y The Y location on the body in meters.
 * @param {Myr.Vector} ray The ray to cast from the location.
 * @constructor
 */
export function Ray(world, body, x, y, ray) {
    const _callback = new box2d.JSRayCastCallback();

    const configureCallback = () => {
        _callback.fraction = 0;
        _callback.ReportFixture = function(fixture, point, normal, fraction) {
            if (fraction < _callback.fraction)
                    _callback.fraction = fraction;

            return fraction;
        };
    };

    /**
     * Get the length of the ray.
     * @returns {Number} The portion of the ray that could be cast in the range [0, 1].
     */
    this.getLength = () => {
        const source = body._getBody().GetWorldPoint(getb2Vec2A(x, y));
        const from = getb2Vec2B(source.get_x(), source.get_y());
        const to = body._getBody().GetWorldPoint(getb2Vec2A(x + ray.x, y + ray.y));

        _callback.fraction = 1;
        world.RayCast(_callback, from, to);

        return _callback.fraction;
    };

    configureCallback();
}