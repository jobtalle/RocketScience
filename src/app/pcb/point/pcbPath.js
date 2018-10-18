import * as Myr from "../../../lib/myr";
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
        _points[_points.length - 1].etchDirection(PcbPoint.invertDirection(direction));
    };

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
     * Check whether a certain position exists in this path.
     * @param {Number} x The X coordinate.
     * @param {Number} y The Y coordinate.
     * @returns {Boolean} A boolean which is true when the given position exists in this path.
     */
    this.containsPosition = (x, y) => {
        for (const position of _positions) if (position.x === x && position.y === y)
            return true;

        return false;
    };

    /**
     * Execute a function for each point in this path.
     * @param {Function} f A function taking the x and y coordinate of the point and a PcbPoint.
     * @returns {Boolean} false if f returns false at any iteration, true otherwise.
     */
    this.forPoints = f => {
        for (let i = 0; i < _points.length; ++i) if (!f(_positions[i].x, _positions[i].y, _points[i]))
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
     * Count the number of output pins connected to this path.
     * @returns {Number} the number of output pins connected to this path.
     */
    this.countOutputs = () => {
        let count = 0;

        for (const point of _points) if (point.isOutput())
            ++count;

        return count;
    };
}

const makeSearchEntry = () => {
    const visited = [];
    const Entry = function(position) {
        this.position = position;
        this.from = null;
    };

    Entry.prototype = {
        visit: function() {
            visited.push(this.position);
        },
        isVisited: function() {
            for (let i = visited.length; i-- > 0;) if (visited[i].equals(this.position))
                return true;

            return false;
        },
        toPath: function(path) {
            let entry = this;

            while(entry)
                path.push(entry.position.x, entry.position.y, new PcbPoint(), true), entry = entry.from;
        }
    };

    return Entry;
};

/**
 * Create this path from a start and end point if possible.
 * @param {Pcb} pcb A PCB.
 * @param {Myr.Vector} start A start location on the PCB to trace the path from.
 * @param {Myr.Vector} end An end location on the PCB to trace the path to.
 */
PcbPath.prototype.fromRoute = function(pcb, start, end) {
    const Entry = makeSearchEntry();
    const queue = [new Entry(start)];
    let entry;

    while (entry = queue.pop()) {
        if (entry.isVisited())
            continue;

        if (entry.position.equals(end)) {
            entry.toPath(this);

            return;
        }

        entry.visit();

        pcb.getPoint(entry.position.x, entry.position.y).withConnected((x, y) => {
            const newEntry = new Entry(new Myr.Vector(entry.position.x + x, entry.position.y + y));

            if (!newEntry.isVisited()) {
                queue.unshift(newEntry);

                newEntry.from = entry;
            }
        });
    }
};

/**
 * Create this path from an existing etched path.
 * @param {Pcb} pcb A PCB.
 * @param {Myr.Vector} start A start location on the PCB to trace the path from.
 */
PcbPath.prototype.fromPcb = function(pcb, start) {
    const addPoint = (x, y, exclude) => {
        const point = pcb.getPoint(x, y);

        if (!point || this.hasPoint(point))
            return;

        this.push(x, y, point, false);

        point.withConnected((dx, dy, direction) => {
            addPoint(x + dx, y + dy, direction);
        }, exclude);
    };

    addPoint(start.x, start.y);
};

/**
 * Get a vector pointing outwards of the path when possible.
 * @param {Myr.Vector} from A point on this path to point away from.
 * @returns {Myr.Vector} A unit vector pointing away from the path.
 */
PcbPath.prototype.getOutwardVector = function(from) {
    const right = this.containsPosition(from.x + 1, from.y);
    const top = this.containsPosition(from.x, from.y - 1);
    const left = this.containsPosition(from.x - 1, from.y);
    const bottom = this.containsPosition(from.x, from.y + 1);

    if (!top)
        return new Myr.Vector(0, -1);
    else if (!bottom)
        return new Myr.Vector(0, 1);
    else if (!right)
        return new Myr.Vector(1, 0);
    else
        return new Myr.Vector(-1, 0);
};

/**
 * Check whether this path is valid.
 * @returns {Boolean} A boolean indicating whether this path is valid.
 */
PcbPath.prototype.isValid = function() {
    return this.getPoints().length > 1;
};