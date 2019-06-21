import {getb2Vec2, box2d} from "./internal/box2d";
import {Body} from "./body";
import {createPolygonShape} from "./internal/shapes/polygon";
import {createChainShape} from "./internal/shapes/chain";
import Myr from "myr.js"

/**
 * An interface for the used physics engine.
 * @param {PhysicsConfiguration} configuration The physics configuration.
 * @constructor
 */
export function Physics(configuration) {
    console.log(configuration.getGravity());
    const _world = new box2d.b2World(getb2Vec2(0, configuration.getGravity()), true);
    const _bodies = [];

    let _terrainBody = null;

    const createContactListener = () => {
        const listener = new box2d.JSContactListener();

        _world.SetContactListener(listener);

        listener.BeginContact = contact => {
            contact = box2d.wrapPointer(contact, box2d.b2Contact);

            if (!(contact.GetFixtureA().IsSensor() ^ contact.GetFixtureB().IsSensor()))
                return;

            if (contact.GetFixtureA().IsSensor())
                contact.GetFixtureA().contactListener.beginContact();
            else
                contact.GetFixtureB().contactListener.beginContact();
        };

        listener.EndContact = contact => {
            contact = box2d.wrapPointer(contact, box2d.b2Contact);

            if (!(contact.GetFixtureA().IsSensor() ^ contact.GetFixtureB().IsSensor()))
                return;

            if (contact.IsTouching())
                return;

            if (contact.GetFixtureA().IsSensor())
                contact.GetFixtureA().contactListener.endContact();
            else
                contact.GetFixtureB().contactListener.endContact();
        };

        listener.PreSolve = (contact, oldManifold) => {

        };

        listener.PostSolve = (contact, impulse) => {

        };
    };

    /**
     * Update the physics state
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        _world.Step(timeStep, Physics.VELOCITY_ITERATIONS, Physics.POSITION_ITERATIONS);

        for (const body of _bodies)
            body.update(timeStep);
    };

    /**
     * Set the terrain
     * @param {Object} heights An array containing all terrain height points.
     * @param {Number} spacing The spacing between each height point in meters.
     */
    this.setTerrain = (heights, spacing) => {
        const bodyDef = new box2d.b2BodyDef();
        const points = [];

        _terrainBody = _world.CreateBody(bodyDef);
        box2d.destroy(bodyDef);

        for (let i = 0; i < heights.length; ++i)
            points.push(new Myr.Vector(i * spacing, heights[i]));

        const shape = createChainShape(points);

        _terrainBody.CreateFixture(shape, 0);
        box2d.destroy(shape);
    };

    /**
     * Set the gravitational value.
     */
    this.setGravity = () => {
        _world.SetGravity(getb2Vec2(0, configuration.getGravity()));
    };

    /**
     * Create a new physics body.
     * @param {Array} polygons An array of polygon arrays, where each polygon point has an x and y coordinate.
     * @param {Array} points An array of points to sample for buoyancy.
     * @param {Number} x Horizontal position.
     * @param {Number} y Vertical position.
     * @param {Number} xOrigin The X origin.
     * @param {Number} yOrigin The Y origin.
     * @param {Myr.Transform} transform A transformation to write the physics location to.
     * @return {Object} The created physics body.
     */
    this.createBody = (polygons, points, x, y, xOrigin, yOrigin, transform) => {
        const shapes = [];

        for (const polygon of polygons)
            shapes.push(createPolygonShape(polygon, xOrigin, yOrigin));

        const body = new Body(
            this,
            _world,
            shapes,
            points,
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

    createContactListener();
}

Physics.VELOCITY_ITERATIONS = 8;
Physics.POSITION_ITERATIONS = 3;