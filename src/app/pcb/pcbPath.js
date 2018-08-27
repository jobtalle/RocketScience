import * as Myr from "../../lib/myr";
import {PcbPoint} from "./pcbPoint";

/**
 * A path of connected PBC points on a PCB.
 * @constructor
 */
export function PcbPath() {
    let _points = [];
    let _positions = [];

    const connectLatest = () => {
        if (_points.length < 2)
            return;

        const direction = PcbPoint.deltaToDirection(
            _positions[_positions.length - 1].x - _positions[_positions.length - 2].x,
            _positions[_positions.length - 1].y - _positions[_positions.length - 2].y);

        _points[_points.length - 2].etchDirection(direction);
        _points[_points.length - 1].etchDirection((direction + 4) % 8);
    };

    const positionIndex = position => {
        for (let i = 0; i < _positions.length; ++i)
            if (_positions[i].equals(position))
                return i;

        return -1;
    };

    const hasPosition = position => positionIndex(position) !== -1;

    const getPointAt = position => _points[positionIndex(position)];

    /**
     * Get the PCB points connected to the starting point.
     * @returns {Array} An array of PCB points.
     */
    this.getPoints = () => _points;

    /**
     * Get the start coordinate of this path.
     * @returns {Myr.Vector} The start position.
     */
    this.getStart = () => _positions[0];

    /**
     * Get the end coordinate of this path.
     * @returns {Myr.Vector} The end position.
     */
    this.getEnd = () => _positions[_positions.length - 1];

    /**
     * Check whether a point exists in this path.
     * @param {PcbPoint} point A PCB point.
     * @returns {Boolean} A boolean indicating whether the point exists in this path.
     */
    this.hasPoint = point => _points.includes(point);

    /**
     * Add a PcbPoint and its location to this path.
     * @param {Number} x The X coordinate.
     * @param {Number} y The Y coordinate.
     * @param {PcbPoint} point A PCB point.
     * @param {Boolean} connect True if the added point should be connected to the previously added point.
     */
    this.push = (x, y, point, connect) => {
        _positions.push(new Myr.Vector(x, y));
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
            if (!f(_positions[i].x, _positions[i].y, _points[i]))
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
            _positions[length].x - _positions[length - 1].x,
            _positions[length].y - _positions[length - 1].y));

        _points = _points.slice(0, length);
        _positions = _positions.slice(0, length);
    };

    /**
     * Calculate the shortest route from one point on this part to another.
     * @param {Myr.Vector} start A start point which lies in this path.
     * @param {Myr.Vector} end An end point which may or may not lie on this path.
     * @returns {PcbPath} A new path from start to end, or null if there is no connection.
     */
    this.route = (start, end) => {
        if (!hasPosition(end))
            return null;

        const visited = [];
        const queue = [start];
        let position;

        const isVisited = position => {
            for (const p of visited) if (p.equals(position))
                return true;

            return false;
        };

        while (queue.length > 0) {
            position = queue.pop();

            if (isVisited(position))
                continue;

            if (position.equals(end))
                break;

            visited.push(position);

            getPointAt(position).withConnected((x, y) => {
                const newPosition = new Myr.Vector(position.x + x, position.y + y);

                if (!isVisited(newPosition)) {
                    queue.unshift(newPosition);

                    newPosition.from = position;
                }
            });
        }

        const result = new PcbPath();

        while (position.from) {
            result.push(position.x, position.y, new PcbPoint(), true);

            position = position.from;
        }

        result.push(start.x, start.y, new PcbPoint(), true);

        return result;
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