import {getb2Vec2, box2d, getb2Vec2A, getb2Vec2B} from "./internal/box2d";
import {createCircleShape} from "./internal/shapes/circle";
import {BodyDefinition} from "./internal/bodyDefinition";
import {WheelJoint} from "./joints/wheelJoint";
import {Channels} from "./channels";
import {Fixture} from "./internal/fixture";
import {createSensorShape} from "./internal/shapes/sensor";
import {Mover} from "./mover";
import {Scale} from "../scale";
import {Ray} from "./ray";
import Myr from "myr.js"

// Only instantiate bodies through Physics!
export function Body(physics, world, shapes, points, density, x, y, xOrigin, yOrigin, transform) {
    const _bodyDefinition = new BodyDefinition();
    const _body = world.CreateBody(_bodyDefinition.getDefinition());
    const _connected = [];
    const _position = new Myr.Vector(0, 0);
    const _buoyancyPosition = new Myr.Vector(0, 0);
    const _submerged = new Array(points.length).fill(false);
    let _radius = 0;
    let _angle = 0;

    const updateTransform = () => {
        if (!transform)
            return;

        _position.x = _body.GetPosition().get_x();
        _position.y = _body.GetPosition().get_y();
        _angle = -_body.GetAngle();

        transform.identity();
        transform.translate(
            _position.x * Scale.PIXELS_PER_METER,
            _position.y * Scale.PIXELS_PER_METER);
        transform.rotate(_angle);
        transform.translate(
            -xOrigin * Scale.PIXELS_PER_METER,
            -yOrigin * Scale.PIXELS_PER_METER);
    };

    const getOffset = (dx, dy) => {
        return new Myr.Vector(dx - xOrigin, dy - yOrigin);
    };

    const applyBuoyancy = (timeStep, water) => {
        const cos = Math.cos(-_angle);
        const sin = Math.sin(-_angle);
        const bodyX = _body.GetPosition().get_x();
        const bodyY = _body.GetPosition().get_y();
        let matches = 0;
        let level = -Body.BUOYANCY_DEADZONE * 0.5;

        if (_body.GetLinearVelocity().get_y() > 0)
            level = Body.BUOYANCY_DEADZONE * 0.5;

        _buoyancyPosition.x = _buoyancyPosition.y = 0;

        for (let i = 0; i < points.length; ++i) {
            const point = points[i];
            const y = bodyY + point.x * sin + point.y * cos - level;

            if (y > level) {
                const x = bodyX + point.x * cos - point.y * sin;

                _buoyancyPosition.x += x;
                _buoyancyPosition.y += y;

                ++matches;

                if (!_submerged[i]) {
                    _submerged[i] = true;

                    for (let j = 0; j < 5; ++j) {
                        const dir = (Math.random() * 0.3) * Math.PI + Math.PI;
                        const s = Math.random() * 130;

                        water.addParticle(
                            x * Scale.PIXELS_PER_METER,
                            y * Scale.PIXELS_PER_METER + 7,
                            Math.cos(dir) * s,
                            Math.sin(dir) * s,
                            9);
                    }
                }
            }
            else
                _submerged[i] = false;
        }

        if (matches !== 0) {
            const submerged = matches / points.length;

            _buoyancyPosition.divide(matches);

            _body.ApplyForce(
                getb2Vec2A(
                    0,
                    -_body.GetMass() * physics.getConfiguration().getGravity() * Body.BUOYANCY_FACTOR * submerged / density),
                getb2Vec2B(
                    _buoyancyPosition.x,
                    _buoyancyPosition.y),
                true);
            _body.SetLinearDamping(Body.WATER_DAMPING * submerged);
            _body.SetAngularDamping(Body.WATER_DAMPING * submerged);
        }
    };

    /**
     * Update the body state.
     * @param {Number} timeStep The time step.
     * @param {Water} water A water plane.
     */
    this.update = (timeStep, water) => {
        for (const connected of _connected)
            connected.update(timeStep, water);

        updateTransform();

        if (_body.GetPosition().get_y() + _radius > 0)
            applyBuoyancy(timeStep, water);
        else {
            _body.SetLinearDamping(0);
            _body.SetAngularDamping(0);
        }
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
     * Get the angle of this body.
     * @returns {Number} The rotation in radians.
     */
    this.getAngle = () => _angle;

    /**
     * Create a wheel on this body.
     * @param {Number} radius The wheel radius in meters.
     * @param {Number} xOffset The wheel X offset in meters.
     * @param {Number} yOffset The wheel Y offset in meters.
     * @param {Myr.Transform} transform A transformation to capture this object's position.
     * @returns {WheelJoint} A joint connected to the new wheel.
     */
    this.createWheel = (radius, xOffset, yOffset, transform) => {
        const offset = getOffset(xOffset, yOffset);
        const body = new Body(
            physics,
            world,
            [createCircleShape(radius)],
            [],
            1,
            x + offset.x,
            y + offset.y,
            radius,
            radius,
            transform);

        _connected.push(body);

        return new WheelJoint(world, this, body, offset, new Myr.Vector(0, 0));
    };

    /**
     * Create a ray cast on this body.
     * @param {Number} xOffset The X offset in meters.
     * @param {Number} yOffset The Y offset in meters.
     * @param {Myr.Vector} ray The ray to cast.
     */
    this.createRay = (xOffset, yOffset, ray) => {
        const offset = getOffset(xOffset, yOffset);

        return new Ray(world, this, offset.x, offset.y, ray);
    };

    /**
     * Create a touch sensor on this body.
     * @param {Number} xOffset The X offset in meters.
     * @param {Number} yOffset The Y offset in meters.
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

    /**
     * Get the Box2D body.
     * @returns {Object} The Box2D body.
     * @private
     */
    this._getBody = () => _body;

    for (const shape of shapes) {
        const fixture = new Fixture(shape, 1, Channels.OBJECT, Channels.OBJECT);

        _body.CreateFixture(fixture.getDefinition());

        fixture.free();

        box2d.destroy(shape);
    }

    for (const point of points) {
        const offset = getOffset(point.x, point.y);
        const radius = offset.length();

        point.x = offset.x;
        point.y = offset.y;

        if (_radius < radius)
            _radius = radius;
    }

    _bodyDefinition.free();
    _body.SetTransform(getb2Vec2(x, y), 0);
}

Body.BUOYANCY_FACTOR = 2;
Body.WATER_DAMPING = 4;
Body.BUOYANCY_DEADZONE = Scale.METERS_PER_POINT * 0.25;