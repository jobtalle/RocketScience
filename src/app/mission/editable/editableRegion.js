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
     * Rounds all coordinates to the grid. This method should not change the current coordinates, but should be a safeguard against rounding errors.
     */
    this.roundCoordinatesToGrid = () => {
        origin.x = Math.round(origin.x * Scale.POINTS_PER_METER) * Scale.METERS_PER_POINT;
        origin.y = Math.round(origin.y * Scale.POINTS_PER_METER) * Scale.METERS_PER_POINT;
        size.x = Math.round(size.x * Scale.POINTS_PER_METER) * Scale.METERS_PER_POINT;
        size.y = Math.round(size.y * Scale.POINTS_PER_METER) * Scale.METERS_PER_POINT;
    };

    /**
     * Check whether a point is in the region, with a margin of x points on all sides.
     * @param {Number} x The X coordinate relative to the origin.
     * @param {Number} y The Y coordinate relative to the origin.
     * @param {Number} margin The amount of points outside the region to count as part of the region.
     * @returns {Boolean} A boolean indicating whether the point is inside this region.
     */
    this.containsPoint = (x, y, margin=0) =>
        !(x + Scale.METERS_PER_POINT * margin < origin.x
            || x >= origin.x + size.x + Scale.METERS_PER_POINT * margin
            || y + Scale.METERS_PER_POINT * margin < origin.y
            || y >= origin.y + size.y + Scale.METERS_PER_POINT * margin);

    /**
     * Check whether a different region intersects this region.
     * @param {EditableRegion} region
     * @returns {Boolean} Returns true if the region intersects this region.
     */
    this.intersectsRegion = region =>
        origin.x < region.getOrigin().x + region.getSize().x
        && origin.x + size.x > region.getOrigin().x
        && origin.y < region.getOrigin().y + region.getSize().y
        && origin.y + size.y > region.getOrigin().y;

    this.fits = pcb => {

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
