import {box2d} from "../box2d";

export function createCircleShape(radius) {
    const shape = new box2d.b2CircleShape();
    shape.set_m_radius(radius);

    return shape;
}