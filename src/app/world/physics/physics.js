import Myr from "../../../lib/myr.js";
import {getVec, box2d} from "./box2d";
import {Body} from "./body";

/**
 * An interface for the used physics engine.
 * @param {Number} gravity The gravity constant.
 * @constructor
 */
export function Physics(gravity) {
    const _world = new box2d.b2World(getVec(0, gravity), true);
    const _bodies = [];
    const _self = this;

    let _terrainBody = null;

    const Buffer = function(points, xOffset, yOffset) {
        const _buffer = box2d._malloc(points.length << 3);

        for (let i = 0; i < points.length; ++i) {
            box2d.HEAPF32[(_buffer >> 2) + (i << 1)] = points[i].x + xOffset;
            box2d.HEAPF32[(_buffer >> 2) + (i << 1) + 1] = points[i].y + yOffset;
        }

        this.getBuffer = () => box2d.wrapPointer(_buffer, box2d.b2Vec2);
        this.free = () => box2d._free(_buffer);
    };

    const createPolygonShape = (polygon, xOrigin, yOrigin) => {
        const shape = new box2d.b2PolygonShape();
        const buffer = new Buffer(polygon, -xOrigin, -yOrigin);

        shape.Set(buffer.getBuffer(), polygon.length);
        buffer.free();

        return shape;
    };

    const createCircleShape = radius => {
        const shape = new box2d.b2CircleShape();
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
        const bodyDef = new box2d.b2BodyDef();

        _terrainBody = _world.CreateBody(bodyDef);
        box2d.destroy(bodyDef);

        const shape = new box2d.b2ChainShape();
        const points = [];

        for (let i = 0; i < heights.length; ++i)
            points.push(new Myr.Vector(i * spacing, heights[i]));

        const buffer = new Buffer(points, 0, 0);

        shape.CreateChain(buffer.getBuffer(), heights.length);
        buffer.free();

        _terrainBody.CreateFixture(shape, 0);
        box2d.destroy(shape);
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

        const bodyDefinition = new box2d.b2BodyDef();
        bodyDefinition.set_type(box2d.b2_dynamicBody);
        bodyDefinition.set_position(getVec(0, 0));

        const body = new Body(
            this,
            _world,
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

        const bodyDefinition = new box2d.b2BodyDef();
        bodyDefinition.set_type(box2d.b2_dynamicBody);
        bodyDefinition.set_position(getVec(0, 0));

        const body = new Body(
            this,
            _world,
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
        box2d.destroy(_tempVec);
        box2d.destroy(_world);
    };
}

Physics.VELOCITY_ITERATIONS = 8;
Physics.POSITION_ITERATIONS = 3;