/**
 * A part with a location.
 * @param {Part} part A part.
 * @param {Number} x The X position.
 * @param {Number} y The Y position.
 * @constructor
 */
export function Fixture(part, x, y) {
    this.part = part;
    this.x = x;
    this.y = y;
}