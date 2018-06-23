import {Pcb} from "../pcb/pcb";

/**
 * An environment to place bots in.
 * @param {Object} myr A Myriad instance.
 * @param {Object} physics A Box2D physics engine instance.
 * @param {Number} width The width in meters.
 * @constructor
 */
export function Terrain(myr, physics, width) {
    const AIR_HEIGHT = 100;
    const WATER_DEPTH = 200;
    const COLOR_WATER_TOP = new myr.Color(0.3, 0.3, 1);
    const COLOR_WATER_BOTTOM = new myr.Color(1, 1, 1, 0);

    const _heights = new Array(width * Terrain.SEGMENTS_PER_METER + 1);

    let _body = null;
    let _rigidBody = null;

    /**
     * Make a physics body for this terrain.
     * @param {Object} world A physics world.
     */
    this.makeBody = world => {
        _body = world.CreateBody(new physics.b2BodyDef());

        const buffer = physics.allocate(_heights.length * 8, 'float', physics.ALLOC_STACK);

        for (let i = 0; i < _heights.length; ++i) {
            physics.setValue(buffer + (i * 8), i / Terrain.SEGMENTS_PER_METER, 'float');
            physics.setValue(buffer + (i * 8) + 4, _heights[i], 'float');
        }

        const shape = new physics.b2ChainShape();

        shape.CreateChain(physics.wrapPointer(buffer, physics.b2Vec2), _heights.length);
        _body.CreateFixture(shape, 0);

        {
            const shape = new physics.b2PolygonShape();
            shape.SetAsBox(5, 5);

            let body = new physics.b2BodyDef();
            body.set_type(physics.b2_dynamicBody);
            body.set_position(new physics.b2Vec2(_heights.length / 4 + 8, -50));

            _rigidBody = world.CreateBody(body);
            _rigidBody.CreateFixture(shape, 5.0);
        }
    };

    /**
     * Returns the width in pixels.
     * @returns {Number} The width in pixels.
     */
    this.getWidth = () => width * Terrain.PIXELS_PER_METER;

    /**
     * Returns the height in pixels.
     * @returns {Number} The height in pixels.
     */
    this.getHeight = () => AIR_HEIGHT;

    /**
     * Draws the terrain.
     */
    this.draw = () => {
        for (let i = 0; i < _heights.length - 1; ++i)
            myr.primitives.drawLine(myr.Color.BLACK,
                (i * Terrain.PIXELS_PER_SEGMENT), _heights[i] * Terrain.PIXELS_PER_METER,
                (i + 1) * Terrain.PIXELS_PER_SEGMENT, _heights[i + 1] * Terrain.PIXELS_PER_METER);

        myr.primitives.fillRectangleGradient(
            COLOR_WATER_TOP,
            COLOR_WATER_TOP,
            COLOR_WATER_BOTTOM,
            COLOR_WATER_BOTTOM,
            0, 0,
            this.getWidth(), WATER_DEPTH);

        myr.push();
        myr.scale(Terrain.PIXELS_PER_METER, Terrain.PIXELS_PER_METER);
        myr.translate(_rigidBody.GetPosition().get_x(), _rigidBody.GetPosition().get_y());
        myr.rotate(-_rigidBody.GetAngle());

        myr.primitives.drawRectangle(myr.Color.BLUE, -5, -5, 10, 10);

        myr.pop();
    };

    for (let i = 0; i < _heights.length; ++i)
        _heights[i] = Math.cos(i / 16) * 10;
}

Terrain.SEGMENTS_PER_METER = 2;
Terrain.POINTS_PER_METER = 8;
Terrain.PIXELS_PER_METER = Pcb.PIXELS_PER_POINT * Terrain.POINTS_PER_METER;
Terrain.PIXELS_PER_SEGMENT = Terrain.PIXELS_PER_METER / Terrain.SEGMENTS_PER_METER;