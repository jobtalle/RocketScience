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
        _callback.ReportFixture = function(fixture, point, normal, fraction) {
            const f = box2d.wrapPointer(fixture, box2d.b2Fixture);

            _callback.m_fixture = fixture;

            if (f)
                console.log(fraction);

            return fraction;
        };
    };

    /**
     * Get the length of the ray.
     * @returns {Number} The portion of the ray that could be cast in the range [0, 1].
     */
    this.getLength = () => {
        let from = body._getBody().GetWorldPoint(new box2d.b2Vec2(x, y));

        world.RayCast(
            _callback,
            new box2d.b2Vec2(from.get_x(), from.get_y()),
            new box2d.b2Vec2(from.get_x() + ray.x, from.get_y() + ray.y));

        return 0.5;
    };

    configureCallback();
}