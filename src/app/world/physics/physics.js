import Myr from "../../../lib/myr.js";
import {getb2Vec2, box2d} from "./internal/box2d";
import {Body} from "./body";
import {Buffer} from "./internal/buffer";
import {createPolygonShape} from "./internal/shapes/polygon";
import {createChainShape} from "./internal/shapes/chain";

/**
 * An interface for the used physics engine.
 * @param {Number} gravity The gravity constant.
 * @constructor
 */
export function Physics(gravity) {
    const _world = new box2d.b2World(getb2Vec2(0, gravity), true);
    const _bodies = [];

    let _terrainBody = null;

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

        const points = [];

        for (let i = 0; i < heights.length; ++i)
            points.push(new Myr.Vector(i * spacing, heights[i]));

        const shape = createChainShape(points);

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

        const body = new Body(
            this,
            _world,
            shapes,
            x + xOrigin,
            y + yOrigin,
            xOrigin,
            yOrigin,
            transform);

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
        box2d.destroy(_world);
    };
}

Physics.VELOCITY_ITERATIONS = 8;
Physics.POSITION_ITERATIONS = 3;