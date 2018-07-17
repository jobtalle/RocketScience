import {Box2D} from "../../lib/box2d";
import {Myr} from "./../../lib/myr.js"
import {Terrain} from "./terrain";

/**
 * An interface for the used physics engine.
 * @param {Number} gravity The gravity constant.
 * @constructor
 */
export function Physics(gravity) {
    const Body = function(shape, bodyDefinition) {
        const _transform = new Myr.Transform();
        const _body = _world.CreateBody(bodyDefinition);

        const updateTransform = () => {
            _transform.identity();
            _transform.translate(
                _body.GetPosition().get_x() * Terrain.PIXELS_PER_METER,
                _body.GetPosition().get_y() * Terrain.PIXELS_PER_METER);
            _transform.rotate(_body.GetAngle());
        };

        this.update = () => {
            updateTransform();
        };

        this.free = () => {
            _world.DestroyBody(_body);
        };

        /**
         * Returns the objects current transformation.
         * @returns {Myr.Transform} A Transform object.
         */
        this.getTransform = () => _transform;

        _body.CreateFixture(shape, 5.0);
    };

    const VELOCITY_ITERATIONS = 8;
    const POSITION_ITERATIONS = 3;

    const _physics = new Box2D();
    const _world = new _physics.b2World(new _physics.b2Vec2(0, gravity), true);
    const _bodies = [];

    let _terrainBody = null;

    /**
     * Update the physics state
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        _world.Step(timeStep, VELOCITY_ITERATIONS, POSITION_ITERATIONS);

        for (const body of _bodies)
            body.update();
    };

    /**
     * Set the terrain
     * @param {Object} heights An array containing all terrain height points.
     * @param {Number} spacing The spacing between each height point in meters.
     */
    this.setTerrain = (heights, spacing) => {
        _terrainBody = _world.CreateBody(new _physics.b2BodyDef());

        const buffer = _physics.allocate(heights.length * 8, "float", _physics.ALLOC_STACK);
        const shape = new _physics.b2ChainShape();

        for (let i = 0; i < heights.length; ++i) {
            _physics.setValue(buffer + (i << 3), i * spacing, "float");
            _physics.setValue(buffer + (i << 3) + 4, heights[i], "float");
        }

        shape.CreateChain(_physics.wrapPointer(buffer, _physics.b2Vec2), heights.length);

        _terrainBody.CreateFixture(shape, 0);
    };

    /**
     * Create a new physics body.
     * @param polygonPoints
     * @param {Number} x Horizontal position.
     * @param {Number} y Vertical position.
     * @return {Object} The created physics body.
     */
    this.createBody = (polygonPoints, x, y) => {
        const shape = new _physics.b2PolygonShape();
        shape.SetAsBox(5, 5);

        const bodyDefinition = new _physics.b2BodyDef();
        bodyDefinition.set_type(_physics.b2_dynamicBody);
        bodyDefinition.set_position(new _physics.b2Vec2(x, y));

        const body = new Body(shape, bodyDefinition);

        _bodies.push(body);

        return body;
    };

    /**
     * Destroy a physics body, removing it from the world.
     * @param {Object} body The physics body to destroy.
     */
    this.destroyBody = body => {
        _bodies.splice(_bodies.indexOf(body), 1);

        body.free();
    };
}