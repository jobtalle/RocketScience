import {Box2D} from "../../lib/box2d";
import Myr from "./../../lib/myr.js"
import {Terrain} from "./terrain";
import {Pcb} from "../pcb/pcb";

const _physics = new Box2D();

/**
 * An interface for the used physics engine.
 * @param {Number} gravity The gravity constant.
 * @constructor
 */
export function Physics(gravity) {
    const Body = function(shapes, bodyDefinition, x, y, xOrigin, yOrigin) {
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

        for (const shape of shapes) {
            _body.CreateFixture(shape, 5.0);

            _physics.destroy(shape);
        }

        _body.SetTransform(getTempVec(x + xOrigin, y + yOrigin), 0);
    };

    const getTempVec = (x, y) => {
        _tempVec.set_x(x);
        _tempVec.set_y(y);

        return _tempVec;
    };

    const VELOCITY_ITERATIONS = 8;
    const POSITION_ITERATIONS = 3;

    const _tempVec = new _physics.b2Vec2(0, 0);
    const _world = new _physics.b2World(getTempVec(0, gravity), true);
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
        const bodyDef = new _physics.b2BodyDef();

        _terrainBody = _world.CreateBody(bodyDef);
        _physics.destroy(bodyDef);

        const shape = new _physics.b2ChainShape();
        const buffer = _physics._malloc(heights.length << 3);

        for (let i = 0; i < heights.length; ++i) {
            _physics.HEAPF32[(buffer >> 2) + (i << 1)] = i * spacing;
            _physics.HEAPF32[(buffer >> 2) + (i << 1) + 1] = heights[i];
        }

        shape.CreateChain(_physics.wrapPointer(buffer, _physics.b2Vec2), heights.length);
        _physics._free(buffer);

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

        for (const polygon of polygons) {
            const shape = new _physics.b2PolygonShape();
            const buffer = _physics._malloc(polygon.getPoints().length << 3);

            for (let i = 0; i < polygon.getPoints().length; ++i) {
                _physics.HEAPF32[(buffer >> 2) + (i << 1)] = polygon.getPoints()[i].x - xOrigin;
                _physics.HEAPF32[(buffer >> 2) + (i << 1) + 1] = polygon.getPoints()[i].y - yOrigin;
            }

            shape.Set(_physics.wrapPointer(buffer, _physics.b2Vec2), polygon.getPoints().length);

            _physics._free(buffer);

            shapes.push(shape);
        }

        const bodyDefinition = new _physics.b2BodyDef();
        bodyDefinition.set_type(_physics.b2_dynamicBody);
        bodyDefinition.set_position(getTempVec(0, 0));

        const body = new Body(
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