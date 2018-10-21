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
}