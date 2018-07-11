import {Box2D} from "../../lib/box2d";
import {Terrain} from "./terrain";

/**
 * An interface for the used physics engine.
 * @param {Number} gravity The gravity constant.
 * @constructor
 */
export function Physics(gravity) {
    const VELOCITY_ITERATIONS = 8;
    const POSITION_ITERATIONS = 3;

    const _physics = new Box2D();
    const _world = new _physics.b2World(new _physics.b2Vec2(0, gravity), true);

    let _testBody = null;
    let _terrainBody = null;

    /**
     * Update the physics state
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        _world.Step(timeStep, VELOCITY_ITERATIONS, POSITION_ITERATIONS);
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

        // A test object
        {
            const shape = new _physics.b2PolygonShape();
            shape.SetAsBox(5, 5);

            let body = new _physics.b2BodyDef();
            body.set_type(_physics.b2_dynamicBody);
            body.set_position(new _physics.b2Vec2(heights.length / 4 + 8, -50));

            _testBody = _world.CreateBody(body);
            _testBody.CreateFixture(shape, 5.0);
        }
    };

    /**
     * Debug drawing.
     * @param {Object} myr A myr.js instance.
     */
    this.draw = myr => {
        myr.push();
        myr.scale(Terrain.PIXELS_PER_METER, Terrain.PIXELS_PER_METER);
        myr.translate(_testBody.GetPosition().get_x(), _testBody.GetPosition().get_y());
        myr.rotate(-_testBody.GetAngle());

        myr.primitives.drawRectangle(myr.Color.BLUE, -5, -5, 10, 10);

        myr.pop();
    }
}