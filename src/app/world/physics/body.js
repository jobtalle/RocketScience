import {getb2Vec2, box2d} from "./internal/box2d";
import {createCircleShape} from "./internal/shapes/circle";
import {BodyDefinition} from "./internal/bodyDefinition";
import {WheelJoint} from "./joints/wheelJoint";
import {Channels} from "./channels";
import {Fixture} from "./internal/fixture";
import {createSensorShape} from "./internal/shapes/sensor";
import {Mover} from "./mover";
import {Scale} from "../scale";
import * as Myr from "../../../lib/myr";

// Only instantiate bodies through Physics!
export function Body(physics, world, shapes, x, y, xOrigin, yOrigin, transform) {
    const _bodyDefinition = new BodyDefinition();
    const _body = world.CreateBody(_bodyDefinition.getDefinition());
    const _connected = [];
    const _position = new Myr.Vector(0, 0);

    const updateTransform = () => {
        if (!transform)
            return;

        _position.x = _body.GetPosition().get_x();
        _position.y = _body.GetPosition().get_y();

        transform.identity();
        transform.translate(
            _position.x * Scale.PIXELS_PER_METER,
            _position.y * Scale.PIXELS_PER_METER);
        transform.rotate(-_body.GetAngle());
        transform.translate(
            -xOrigin * Scale.PIXELS_PER_METER,
            -yOrigin * Scale.PIXELS_PER_METER);
    };

    const getOffset = (dx, dy) => {
        return new Myr.Vector(dx - xOrigin, dy - yOrigin);
    };

    /**
     * Update the body state.
     * @param {Number} timeStep The time step.
     */
    this.update = timeStep => {
        for (const connected of _connected)
            connected.update(timeStep);

        updateTransform();
    };

    /**
     * Free this body
     */
    this.free = () => {
        for (const connected of _connected)
            connected.free();

        world.DestroyBody(_body);
    };

    /**
     * Get the position of this body.
     * @returns {Myr.Vector} A vector containing the position in the world in meters.
     */
    this.getPosition = () => _position;

    /**
     * Create a wheel on this body.
     * @param {Number} radius The wheel radius in meters.
     * @param {Number} xOffset The wheel X offset in meters.
     * @param {Number} yOffset The wheel Y offset in meters.
     * @param {Myr.Transform} transform A transformation to capture this object's position.
     * @returns {WheelJoint} A new body representing the wheel.
     */
    this.createWheel = (radius, xOffset, yOffset, transform) => {
        const offset = getOffset(xOffset, yOffset);
        const body = new Body(
            physics,
            world,
            [createCircleShape(radius)],
            x + offset.x,
            y + offset.y,
            radius,
            radius,
            transform);

        _connected.push(body);

        return new WheelJoint(world, this, body, offset, new Myr.Vector(0, 0));
    };

    /**
     * Create a touch sensor on this body.
     * @param {Number} xOffset The wheel X offset in meters.
     * @param {Number} yOffset The wheel Y offset in meters.
     * @param {Number} size The size of the sensor block in meters.
     * @param {Number} direction The direction this sensor is pointing towards in radians.
     * @param {ContactListener} contactListener A contact listener.
     */
    this.createTouchSensor = (xOffset, yOffset, size, direction, contactListener) => {
        const offset = getOffset(xOffset, yOffset);
        const shape = createSensorShape(offset.x, offset.y, size, direction);
        const fixture = new Fixture(shape);

        _body.CreateFixture(fixture.getDefinition()).contactListener = contactListener;

        box2d.destroy(shape);
        fixture.free();
    };

    /**
     * Create a mover on this body.
     * @param {Number} xOffset The anchor X offset in meters.
     * @param {Number} yOffset The anchor Y offset in meters.
     * @returns {Mover} A mover.
     */
    this.createMover = (xOffset, yOffset) => {
        const offset = getOffset(xOffset, yOffset);
        const mover = new Mover(this, offset.x, offset.y);

        _connected.push(mover);

        return mover;
    };

    this._getBody = () => _body;

    for (const shape of shapes) {
        const fixture = new Fixture(shape, Channels.OBJECT, Channels.OBJECT);

        _body.CreateFixture(fixture.getDefinition());
        fixture.free();

        box2d.destroy(shape);
    }

    _bodyDefinition.free();
    _body.SetTransform(getb2Vec2(x, y), 0);
}