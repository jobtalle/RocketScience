import {box2d} from "../box2d";
import {Buffer} from "../buffer";

export function createChainShape(polygon) {
    const shape = new box2d.b2ChainShape();
    const buffer = new Buffer(polygon, 0, 0);

    shape.CreateChain(buffer.getBuffer(), polygon.length);
    buffer.free();

    return shape;
}