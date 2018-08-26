import * as Myr from "../../lib/myr";

/**
 * A path of connected PBC points on a PCB.
 * @constructor
 */
export function PcbPath() {
    const _points = [];
    const _path = [];

    /**
     * Get the PCB points connected to the starting point.
     * @returns {Array} An array of PCB points.
     */
    this.getPoints = () => _points;

    /**
     * Check whether a point exists in this path.
     * @param {PcbPoint} point A PCB point.
     * @returns {Boolean} A boolean indicating whether the point exists in this path.
     */
    this.hasPoint = point => _points.indexOf(point) !== -1;

    /**
     * Add a PcbPoint and its location to this path.
     * @param {Number} x The X coordinate.
     * @param {Number} y The Y coordinate.
     * @param {PcbPoint} point A PCB point.
     */
    this.push = (x, y, point) => {
        _path.push(new Myr.Vector(x, y));
        _points.push(point);
    };

    /**
     * Execute a function for each point in this path.
     * @param {Function} f A function taking the x and y coordinate of the point and a PcbPoint.
     */
    this.forPoints = (f) => {
        for (let i = 0; i < _points.length; ++i)
            f (_path[i].x, _path[i].y, _points[i]);
    };
}

/**
 * Create this path from an existing etched path.
 * @param {Pcb} pcb A PCB.
 * @param {Number} x The X location to start tracing a path from.
 * @param {Number} y The Y location to start tracing a path from.
 */
PcbPath.prototype.fromPcb = function(pcb, x, y)  {
    const addPoint = (x, y, exclude) => {
        const point = pcb.getPoint(x, y);

        if (!point || this.hasPoint(point))
            return;

        this.push(x, y, point);

        point.withConnected((dx, dy, direction) => {
            addPoint(x + dx, y + dy, direction);
        }, exclude);
    };

    addPoint(x, y);
};

/**
 * Check whether this path is valid.
 * @returns {Boolean} A boolean indicating whether this path is valid.
 */
PcbPath.prototype.isValid = function() {
    return this.getPoints().length > 1;
};