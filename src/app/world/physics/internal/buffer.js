import {box2d} from "./box2d";

export function Buffer(points, xOffset, yOffset) {
    const _buffer = box2d._malloc(points.length << 3);

    for (let i = 0; i < points.length; ++i) {
        box2d.HEAPF32[(_buffer >> 2) + (i << 1)] = points[i].x + xOffset;
        box2d.HEAPF32[(_buffer >> 2) + (i << 1) + 1] = points[i].y + yOffset;
    }

    this.getBuffer = () => box2d.wrapPointer(_buffer, box2d.b2Vec2);
    this.free = () => box2d._free(_buffer);
}