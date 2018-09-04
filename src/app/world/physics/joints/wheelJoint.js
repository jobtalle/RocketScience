import {box2d, getb2Vec2} from "../internal/box2d";

// Only to be constructed by Body!
export function WheelJoint(world, bodyA, bodyB, locationA, locationB) {
    let joint = null;

    const join = () => {
        const jointDef = new box2d.b2RevoluteJointDef();
        jointDef.set_bodyA(bodyA._getBody());
        jointDef.set_bodyB(bodyB._getBody());
        jointDef.set_localAnchorA(getb2Vec2(locationA.x, locationA.y));
        jointDef.set_localAnchorB(getb2Vec2(locationB.x, locationB.y));
        jointDef.set_motorSpeed(0);
        jointDef.set_enableMotor(true);
        jointDef.set_maxMotorTorque(0);

        joint = box2d.castObject(world.CreateJoint(jointDef), box2d.b2RevoluteJoint);

        box2d.destroy(jointDef);
    };

    this.release = () => {
        joint.SetMaxMotorTorque(WheelJoint.TORQUE_NEUTRAL);
        joint.SetMotorSpeed(0);
    };

    this.brakes = () => {
        joint.SetMaxMotorTorque(WheelJoint.TORQUE_BRAKES);
        joint.SetMotorSpeed(0);
    };

    this.powerRight = () => {
        joint.SetMaxMotorTorque(WheelJoint.TORQUE_MOTOR);
        joint.SetMotorSpeed(WheelJoint.MOTOR_SPEED);
    };

    this.powerLeft = () => {
        joint.SetMaxMotorTorque(WheelJoint.TORQUE_MOTOR);
        joint.SetMotorSpeed(-WheelJoint.MOTOR_SPEED);
    };

    join();

    this.release();
}

WheelJoint.TORQUE_NEUTRAL = 0.2;
WheelJoint.TORQUE_MOTOR = 2;
WheelJoint.TORQUE_BRAKES = 2;
WheelJoint.MOTOR_SPEED = 12;