/**
 * Information defining a ruler.
 * @param {Number} x The x position on the PCB.
 * @param {Number} y The y position on the PCB.
 * @param {Object} direction A valid direction constant.
 * @param {Number} length The length of this ruler in pcb points.
 * @constructor
 */
export function OverlayRulerDefinition(x, y, direction, length) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.length = length;
}

OverlayRulerDefinition.DIRECTION_RIGHT = 0;
OverlayRulerDefinition.DIRECTION_UP = 1;