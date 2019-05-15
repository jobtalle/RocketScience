import * as Myr from "myr.js";
import {Scale} from "../../world/scale";

/**
 * A region in which a pcb can be placed and edited.
 * @param {Myr.Vector} origin The origin of the editable area in meters.
 * @param {Myr.Vector} size The width and height of the editable region in meters.
 * @constructor
 */

export function EditableRegion(origin, size) {
    /**
     * Get the origin of the editable region.
     * @returns {Myr.Vector} A position in the world in meters.
     */
    this.getOrigin = () => origin;

    /**
     * Get the size of the editable region.
     * @returns {Myr.Vector} The width and height of the region.
     */
    this.getSize = () => size;

    /**
     * Shift the region position.
     * @param {Number} dx The horizontal movement in meters.
     * @param {Number} dy The vertical movement in meters.
     */
    this.moveOrigin = (dx, dy) => {
        origin.x += dx;
        origin.y += dy;
    };

    /**
     * Resize the region.
     * @param {Number} dx The horizontal change in meters.
     * @param {Number} dy The vertical change in meters.
     */
    this.resize = (dx, dy) => {
        size.x += dx;
        size.y += dy;
    };

    /**
     * Check whether a point is in the region.
     * @param {Number} x The X coordinate.
     * @param {Number} y The Y coordinate.
     * @returns {Boolean} A boolean indicating whether the point is inside this region.
     */
    this.containsPoint = (x, y) => {
        return !(x < 0 || x > size.x - Scale.METERS_PER_POINT || y < 0 || y > size.y - Scale.METERS_PER_POINT);
    };

    /**
     * Make a copy of this region.
     * @return {Object} A deep copy.
     */
    this.copy = () => {
        return new EditableRegion(origin.copy(), size.copy());
    };

    /**
     * Serialize the region to a buffer.
     * @param {ByteBuffer} buffer A byte buffer to serialize this region to.
     */
    this.serialize = buffer => {
        buffer.writeFloat(origin.x);
        buffer.writeFloat(origin.y);
        buffer.writeFloat(size.x);
        buffer.writeFloat(size.y);
    };
}

/**
 * Deserialize a region from a buffer.
 * @param {ByteBuffer} buffer A byte buffer to serialize a region from.
 * @returns {EditableRegion} The deserialized region.
 */
EditableRegion.deserialize = buffer => {
    const origin = new Myr.Vector(buffer.readFloat(), buffer.readFloat());
    const size = new Myr.Vector(buffer.readFloat(), buffer.readFloat());

    return new EditableRegion(origin, size);
};
