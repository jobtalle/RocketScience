import * as Myr from "../../lib/myr";
import {PcbPoint} from "./pcbPoint";

/**
 * A path of connected PBC points on a PCB.
 * @constructor
 */
export function PcbPath() {
    let _points = [];
    let _path = [];

    const connectLatest = () => {
        if (_points.length < 2)
            return;

        const direction = PcbPoint.deltaToDirection(
            _path[_path.length - 1].x - _path[_path.length - 2].x,
            _path[_path.length - 1].y - _path[_path.length - 2].y);

        _points[_points.length - 2].etchDirection(direction);
        _points[_points.length - 1].etchDirection((direction + 4) % 8);
    };

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
     * @param {Boolean} connect True if the added point should be connected to the previously added point.
     */
    this.push = (x, y, point, connect) => {
        _path.push(new Myr.Vector(x, y));
        _points.push(point);

        if (connect)
            connectLatest();
    };

    /**
     * Execute a function for each point in this path.
     * @param {Function} f A function taking the x and y coordinate of the point and a PcbPoint.
     * @returns {Boolean} false if f returns false at any iteration, true otherwise.
     */
    this.forPoints = f => {
        for (let i = 0; i < _points.length; ++i)
            if (!f(_path[i].x, _path[i].y, _points[i]))
                return false;

        return true;
    };

    /**
     * Trim this path.
     * @param {Number} length The path will be trimmed to length. It must be smaller than or equal to the path length.
     */
    this.trim = length => {
        if (length === _points.length)
            return;

        _points[length - 1].clearDirection(PcbPoint.deltaToDirection(
            _path[length].x - _path[length - 1].x,
            _path[length].y - _path[length - 1].y));

        _points = _points.slice(0, length);
        _path = _path.slice(0, length);
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

        this.push(x, y, point, false);

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