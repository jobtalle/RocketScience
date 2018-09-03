import {box2d} from "../box2d";
import {Buffer} from "../buffer";

export function createPolygonShape(polygon, xOrigin, yOrigin) {
    const shape = new box2d.b2PolygonShape();
    const buffer = new Buffer(polygon, -xOrigin, -yOrigin);

    shape.Set(buffer.getBuffer(), polygon.length);
    buffer.free();

    return shape;
}