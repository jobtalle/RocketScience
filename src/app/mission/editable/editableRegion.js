import * as Myr from "myr.js";

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
