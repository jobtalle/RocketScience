import {Box2D} from "../../../lib/box2d";
import Myr from "../../../lib/myr.js"
import {Terrain} from "../terrain/terrain";

const _physics = new Box2D();
const _tempVec = new _physics.b2Vec2(0, 0);

const getVec = (x, y) => {
    _tempVec.set_x(x);
    _tempVec.set_y(y);

    return _tempVec;
};

/**
 * An interface for the used physics engine.
 * @param {Number} gravity The gravity constant.
 * @constructor
 */
export function Physics(gravity) {
    this.Body = function(shapes, bodyDefinition, x, y, xOrigin, yOrigin) {
        const _transform = new Myr.Transform();
        const _body = _world.CreateBody(bodyDefinition);

        const updateTransform = () => {
            _transform.identity();
            _transform.translate(
                _body.GetPosition().get_x() * Terrain.PIXELS_PER_METER,
                _body.GetPosition().get_y() * Terrain.PIXELS_PER_METER);
            _transform.rotate(-_body.GetAngle());
            _transform.translate(
                -xOrigin * Terrain.PIXELS_PER_METER,
                -yOrigin * Terrain.PIXELS_PER_METER);
        };

        /**
         * Update the body state.
         */
        this.update = () => {
            updateTransform();
        };

        /**
         * Free this body
         */
        this.free = () => {
            _world.DestroyBody(_body);
        };

        /**
         * Returns the objects current transformation.
         * @returns {Myr.Transform} A Transform object.
         */
        this.getTransform = () => _transform;

        for (const shape of shapes) {
            _body.CreateFixture(shape, 5.0);

            _physics.destroy(shape);
        }

        _physics.destroy(bodyDefinition);
        _body.SetTransform(getVec(x + xOrigin, y + yOrigin), 0);
    };

    const _world = new _physics.b2World(getVec(0, gravity), true);
    const _bodies = [];

    let _terrainBody = null;

    const Buffer = function(points, xOffset, yOffset) {
        const _buffer = _physics._malloc(points.length << 3);

        for (let i = 0; i < points.length; ++i) {
            _physics.HEAPF32[(_buffer >> 2) + (i << 1)] = points[i].x + xOffset;
            _physics.HEAPF32[(_buffer >> 2) + (i << 1) + 1] = points[i].y + yOffset;
        }

        this.getBuffer = () => _physics.wrapPointer(_buffer, _physics.b2Vec2);
        this.free = () => _physics._free(_buffer);
    };

    const createPolygonShape = (polygon, xOrigin, yOrigin) => {
        const shape = new _physics.b2PolygonShape();
        const buffer = new Buffer(polygon, -xOrigin, -yOrigin);

        shape.Set(buffer.getBuffer(), polygon.length);
        buffer.free();

        return shape;
    };

    /**
     * Update the physics state
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        _world.Step(timeStep, Physics.VELOCITY_ITERATIONS, Physics.POSITION_ITERATIONS);

        for (const body of _bodies)
            body.update();
    };

    /**
     * Set the terrain
     * @param {Object} heights An array containing all terrain height points.
     * @param {Number} spacing The spacing between each height point in meters.
     */
    this.setTerrain = (heights, spacing) => {
        const bodyDef = new _physics.b2BodyDef();

        _terrainBody = _world.CreateBody(bodyDef);
        _physics.destroy(bodyDef);

        const shape = new _physics.b2ChainShape();
        const points = [];

        for (let i = 0; i < heights.length; ++i)
            points.push(new Myr.Vector(i * spacing, heights[i]));

        const buffer = new Buffer(points, 0, 0);

        shape.CreateChain(buffer.getBuffer(), heights.length);
        buffer.free();

        _terrainBody.CreateFixture(shape, 0);
        _physics.destroy(shape);
    };

    /**
     * Create a new physics body.
     * @param {Array} polygons An array of polygon arrays, where each polygon point has an x and y coordinate.
     * @param {Number} x Horizontal position.
     * @param {Number} y Vertical position.
     * @param {Number} xOrigin The X origin.
     * @param {Number} yOrigin The Y origin.
     * @return {Object} The created physics body.
     */
    this.createBody = (polygons, x, y, xOrigin, yOrigin) => {
        const shapes = [];

        for (const polygon of polygons)
            shapes.push(createPolygonShape(polygon, xOrigin, yOrigin));

        const bodyDefinition = new _physics.b2BodyDef();
        bodyDefinition.set_type(_physics.b2_dynamicBody);
        bodyDefinition.set_position(getVec(0, 0));

        const body = new this.Body(
            shapes,
            bodyDefinition,
            x,
            y,
            xOrigin,
            yOrigin);

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

    /**
     * Free the physics object.
     */
    this.free = () => {
        _physics.destroy(_tempVec);
        _physics.destroy(_world);
    };
}

Physics.VELOCITY_ITERATIONS = 8;
Physics.POSITION_ITERATIONS = 3;