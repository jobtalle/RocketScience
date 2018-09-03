import {Terrain} from "../terrain/terrain";
import {getVec, box2d} from "./box2d";

export function Body(physics, _world, shapes, bodyDefinition, x, y, xOrigin, yOrigin, transform) {
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

        const jointDef = new box2d.b2RevoluteJointDef();
        jointDef.set_bodyA(_body);
        jointDef.set_bodyB(body.getBody());
        jointDef.set_localAnchorA(getVec(at.x, at.y));
        jointDef.set_localAnchorB(getVec(to.x, to.y));

        _world.CreateJoint(jointDef);
        box2d.destroy(jointDef);
    };

    this.getPhysics = () => physics; // TODO: This is so wrong
    this.getBody = () => _body;

    this.getX = () => x;
    this.getY = () => y;

    for (const shape of shapes) {
        _body.CreateFixture(shape, 5.0);

        box2d.destroy(shape);
    }

    box2d.destroy(bodyDefinition);
    _body.SetTransform(getVec(x + xOrigin, y + yOrigin), 0);
}