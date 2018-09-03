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
    const Body = function(shapes, bodyDefinition, x, y, xOrigin, yOrigin, transform) {
        const _body = _world.CreateBody(bodyDefinition);
        const _connected = [];

        const updateTransform = () => {
            transform.identity();
            transform.translate(
                _body.GetPosition().get_x() * Terrain.PIXELS_PER_METER,
                _body.GetPosition().get_y() * Terrain.PIXELS_PER_METER);
            transform.rotate(-_body.GetAngle());
            transform.translate(
                -xOrigin * Terrain.PIXELS_PER_METER,
                -yOrigin * Terrain.PIXELS_PER_METER);
        };

        /**
         * Update the body state.
         */
        this.update = () => updateTransform();

        /**
         * Get the physics object this body exists in.
         * @returns {Physics} A physics object.
         */
        this.getPhysics = () => _self;

        /**
         * Free this body
         */
        this.free = () => {
            for (const connected of _connected)
                connected.free();

            _world.DestroyBody(_body);
        };

        /**
         * Connect another body to this one.
         * @param {Object} body A valid physics object.
         */
        this.connect = (body, at, to) => {
            _connected.push(body);

            const jointDef = new _physics.b2RevoluteJointDef();
            jointDef.set_bodyA(_body);
            jointDef.set_bodyB(body.getBody());
            jointDef.set_localAnchorA(getVec(at.x, at.y));
            jointDef.set_localAnchorB(getVec(to.x, to.y));

            _world.CreateJoint(jointDef);
            _physics.destroy(jointDef);
        };

        this.getBody = () => _body;

        this.getX = () => x;
        this.getY = () => y;

        for (const shape of shapes) {
            _body.CreateFixture(shape, 5.0);

            _physics.destroy(shape);
        }

        _physics.destroy(bodyDefinition);
        _body.SetTransform(getVec(x + xOrigin, y + yOrigin), 0);
    };

    const _world = new _physics.b2World(getVec(0, gravity), true);
    const _bodies = [];
    const _self = this;

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

    const createCircleShape = radius => {
        const shape = new _physics.b2CircleShape();
        shape.set_m_radius(radius);

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
     * @param {Myr.Transform} transform A transformation to write the physics location to.
     * @return {Object} The created physics body.
     */
    this.createBody = (polygons, x, y, xOrigin, yOrigin, transform) => {
        const shapes = [];

        for (const polygon of polygons)
            shapes.push(createPolygonShape(polygon, xOrigin, yOrigin));

        const bodyDefinition = new _physics.b2BodyDef();
        bodyDefinition.set_type(_physics.b2_dynamicBody);
        bodyDefinition.set_position(getVec(0, 0));

        const body = new Body(
            shapes,
            bodyDefinition,
            x,
            y,
            xOrigin,
            yOrigin,
            transform);

        _bodies.push(body);

        return body;
    };

    this.createWheel = (radius, x, y, transform, parent) => {
        const shape = createCircleShape(radius);

        const bodyDefinition = new _physics.b2BodyDef();
        bodyDefinition.set_type(_physics.b2_dynamicBody);
        bodyDefinition.set_position(getVec(0, 0));

        const body = new Body(
            [shape],
            bodyDefinition,
            x,
            y,
            radius,
            radius,
            transform);

        parent.connect(
            body,
            new Myr.Vector(0, 0),
            new Myr.Vector(0, 0));

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