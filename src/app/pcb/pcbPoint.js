import * as Myr from "../../lib/myr";

/**
 * A point on a pcb which may contain (part of) a component.
 * @constructor
 */
export function PcbPoint() {
    this.part = null;
    this.paths = 0;
}

/**
 * Etch a path in a direction onto this point.
 * @param {Number} direction A direction in the range [0, 7].
 */
PcbPoint.prototype.etchDirection = function(direction) {
    this.paths |= 1 << direction;
};

/**
 * Remove an etched path in a direction from this point.
 * @param {Number} direction A direction in the range [0, 7].
 */
PcbPoint.prototype.clearDirection = function(direction) {
    this.paths &= ~(1 << direction);
};

/**
 * Check whether this point has paths etched into it.
 * @returns {Boolean} A boolean which is True if this point has paths etched into it.
 */
PcbPoint.prototype.hasPaths = function() {
    return this.paths !== 0;
};

/**
 * Execute a function for all connected points.
 * @param {Function} f A function taking an x and y coordinate of a connected point.
 * @param {Number} [exclude] An optional direction to exclude from executing.
 */
PcbPoint.prototype.withConnected = function(f, exclude) {
    for (let direction = 0; direction < 8; ++direction) {
        if (exclude && exclude === direction)
            continue;

        const bit = 1 << direction;

        if ((this.paths & bit) === bit) {
            const delta = PcbPoint.directionToDelta(direction);

            f(delta.x, delta.y, (direction + 4) % 8);
        }
    }
};

const directionDeltas = [
    new Myr.Vector(1, 0),
    new Myr.Vector(1, -1),
    new Myr.Vector(0, -1),
    new Myr.Vector(-1, -1),
    new Myr.Vector(-1, 0),
    new Myr.Vector(-1, 1),
    new Myr.Vector(0, 1),
    new Myr.Vector(1, 1)
];

/**
 * Get the X and Y offset to a neighbor based on direction.
 * @param {Number} direction A direction in the range [0, 7].
 * @returns {Myr.Vector} A vector containing the offset to the neighbor.
 */
PcbPoint.directionToDelta = direction => directionDeltas[direction];

/**
 * Get the direction based on offset.
 * @param {Number} dx The X offset.
 * @param {Number} dy The Y offset.
 * @returns {Number} A direction in the range [0, 7].
 */
PcbPoint.deltaToDirection = (dx, dy) => {
    if (dx === 1)
        return -dy - Math.min(-dy, 0) * 8;

    return 4 + ((1 + dx) + 1) * dy;
};