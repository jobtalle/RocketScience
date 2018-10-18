import {PcbPoint} from "./point/pcbPoint";
import {Fixture} from "../part/fixture";
import * as Myr from "../../lib/myr";
import {Pin} from "../part/pin";
import {PcbPath} from "./point/pcbPath";

/**
 * Defines a PCB.
 * @constructor
 */
export function Pcb() {
    const _fixtures = [];
    const _points = [];
    const _air = [];

    let _width = 0;
    let _pointCount = 0;

    const moveFixtures = (x, y) => {
        for (const fixture of _fixtures) {
            fixture.x += x;
            fixture.y += y;
        }
    };

    const trimRowsTop = () => {
        const height = this.getHeight();
        let empty = true;

        while (empty) {
            for (let column = 0; column < _points[0].length; ++column) {
                if (this.getPoint(column, 0)) {
                    empty = false;

                    break;
                }
            }

            if (empty) {
                _points.splice(0, 1);

                moveFixtures(0, -1);
            }
        }

        return height - this.getHeight();
    };

    const trimRowsBottom = () => {
        const height = this.getHeight();
        let empty = true;

        while (empty) {
            for (let column = 0; column < _points[this.getHeight() - 1].length; ++column) {
                if (this.getPoint(column, this.getHeight() - 1)) {
                    empty = false;

                    break;
                }
            }

            if (empty)
                _points.pop();
        }

        return height - this.getHeight();
    };

    const trimColumnsLeft = () => {
        const width = this.getWidth();
        let empty = true;

        while(empty) {
            for (let row = 0; row < this.getHeight(); ++row) {
                if (this.getPoint(0, row)) {
                    empty = false;

                    break;
                }
            }

            if (empty) {
                for (let row = 0; row < this.getHeight(); ++row)
                    _points[row].splice(0, 1);

                moveFixtures(-1, 0);

                --_width;
            }
        }

        return width - this.getWidth();
    };

    const trimColumnsRight = () => {
        const width = this.getWidth();
        let detectedWidth = 0;

        for (let row = 0; row < this.getHeight(); ++row) {
            let column = _points[row].length;

            while (column-- > 0)
                if(this.getPoint(column, row))
                    break;

            if (column >= detectedWidth)
                detectedWidth = column + 1;

            if (++column > _points[row].length)
                _points[row].splice(column, _points[row].length - column);
        }

        _width = detectedWidth;

        return width - this.getWidth();
    };

    const erasePartAt = (x, y) => {
        if (_points[y][x].part !== null) {
            this.remove(_points[y][x].part);

            return;
        }

        for (const fixture of _fixtures) if (fixture.part.getConfiguration().footprint.space) {
            for (const point of fixture.part.getConfiguration().footprint.space) {
                if (fixture.x + point.x === x && fixture.y + point.y === y) {
                    this.remove(fixture.part);

                    return;
                }
            }
        }
    };

    const eraseConnectionsTo = (x, y) => {
        for (let direction = 0; direction < 8; ++direction) {
            const delta = PcbPoint.directionToDelta(direction);
            const point = this.getPoint(x + delta.x, y + delta.y);

            if (!point)
                continue;

            point.clearDirection(PcbPoint.invertDirection(direction));
        }
    };

    const eraseConnectionsIntersecting = (x, y) => {
        for (let direction = 0; direction < 8; ++direction) {
            const delta = PcbPoint.directionToDelta(direction);

            if (delta.x !== 0 && delta.y !== 0)
                continue;

            const point = this.getPoint(x + delta.x, y + delta.y);

            if (!point)
                continue;

            const erase = new PcbPoint();

            erase.etchDirection(PcbPoint.incrementDirection(PcbPoint.invertDirection(direction)));
            erase.etchDirection(PcbPoint.decrementDirection(PcbPoint.invertDirection(direction)));

            point.erasePaths(erase);
        }
    };

    const fitsFootprint = (x, y, footprint) => {
        for (const point of footprint.points) {
            const pcbPoint = this.getPoint(point.x + x, point.y + y);

            if (!pcbPoint || pcbPoint.part !== null)
                return false;
        }

        if (footprint.space) for (const point of footprint.space) {
            const pcbPoint = this.getPoint(point.x + x, point.y + y);

            if (!pcbPoint)
                return false;
        }

        if (footprint.air) for (const point of footprint.air) {
            if (this.getPoint(point.x + x, point.y + y))
                return false;

            if (!this.isAir(point.x + x, point.y + y))
                return false;
        }

        return true;
    };

    const fitsPins = (x, y, pins) => {
        const paths = [];

        for (const pin of pins) if (pin.type === Pin.TYPE_OUT) {
            const point = this.getPoint(pin.x + x, pin.y + y);

            if (point.hasPaths()) {
                for (const path of paths) if (path.containsPosition(pin.x + x, pin.y + y))
                    return false;

                const path = new PcbPath();

                path.fromPcb(this, new Myr.Vector(pin.x + x, pin.y + y));

                if (path.countOutputs() !== 0)
                    return false;

                paths.push(path);
            }
        }

        return true;
    };

    /**
     * Check whether a configuration can be instantiated at a position on this pcb.
     * @param {Number} x The x position on the board.
     * @param {Number} y The y position on the board.
     * @param {Object} configuration A valid part configuration.
     */
    this.fits = (x, y, configuration) => {
        return fitsFootprint(x, y, configuration.footprint) && fitsPins(x, y, configuration.io);
    };

    /**
     * Check whether a point is unoccupied air. The point must lie outside the PCB.
     * @param {Number} x The x position on the board.
     * @param {Number} y The y position on the board.
     * @returns {Boolean} A boolean which is true if the air is unoccupied.
     */
    this.isAir = (x, y) => {
        for (const air of _air) if (air.x === x && air.y === y)
            return false;

        return true;
    };

    /**
     * Get a point on this pcb.
     * @param {Number} x The x position on the board.
     * @param {Number} y The y position on the board
     * @returns {PcbPoint} A pcb point, or null if no point is placed here.
     */
    this.getPoint = (x, y) => x < 0 || y < 0?null:y < _points.length && x < _points[y].length?_points[y][x]:null;

    /**
     * Get the fixture of a part on this PCB.
     * @param {Part} part A part which exists on this PCB.
     * @returns {Fixture} A fixture containing the part.
     */
    this.getFixture = part => {
        for (const fixture of _fixtures)
            if (fixture.part === part)
                return fixture;
    };

    /**
     * Get the number of points in this PCB.
     * @returns {Number} The number of points.
     */
    this.getPointCount = () => _pointCount;

    /**
     * Get the width of this Pcb in points.
     * @returns {Number} The width.
     */
    this.getWidth = () => _width;

    /**
     * Get the height of this Pcb in points.
     * @returns {Number} The height.
     */
    this.getHeight = () => _points.length;

    /**
     * Returns a deep copy of this pcb.
     * @returns {Pcb} A deep copy of this Pcb.
     */
    this.copy = () => {
        const newPcb = new Pcb();

        for (let y = 0; y < this.getHeight(); ++y) for (let x = 0; x < this.getWidth(); ++x) {
            const point = this.getPoint(x, y);

            if (point)
                newPcb.extend(x, y).paths = point.paths;
        }

        for (const fixture of _fixtures)
            newPcb.place(fixture.part.copy(), fixture.x, fixture.y);

        return newPcb;
    };

    /**
     * Extend the Pcb. This should always result in a non-split shape!
     * A Pcb cannot be extended into negative coordinates; shift before doing this.
     * @param {Number} x The X position of the new point.
     * @param {Number} y The Y position of the new point.
     * @returns {PcbPoint} The newly added PCB point.
     */
    this.extend = (x, y) => {
        const newPoint = new PcbPoint();

        while(this.getHeight() <= y)
            _points.push([]);

        if(x < _points[y].length)
            _points[y][x] = newPoint;
        else {
            while(_points[y].length < x)
                _points[y].push(null);

            _points[y].push(newPoint);
        }

        if(x >= _width)
            _width = x + 1;

        ++_pointCount;

        return newPoint;
    };

    /**
     * Erase a Pcb cell. You'll need to pack afterwards to prevent sparse pcb's.
     * The cell must exist. Never erasePaths all points!
     * @param {Number} x The X position of the point.
     * @param {Number} y The Y position of the point.
     */
    this.erase = (x, y) => {
        erasePartAt(x, y);
        eraseConnectionsTo(x, y);
        eraseConnectionsIntersecting(x, y);

        _points[y][x] = null;
        --_pointCount;
    };

    /**
     * Shift the Pcb points with respect to the origin.
     * @param {Number} x The X shift in points.
     * @param {Number} y The Y shift in points.
     */
    this.shift = (x, y) => {
        for(let row = 0; row < this.getHeight(); ++row)
            for(let i = 0; i < x; ++i)
                _points[row].splice(0, 0, null);

        for(let i = 0; i < y; ++i)
            _points.splice(0, 0, []);

        _width += x;

        moveFixtures(x, y);
    };

    /**
     * Remove empty rows and columns from the sides.
     * Use this after erasing points.
     * @returns {Object} Information about how much has been trimmed from which sides.
     */
    this.pack = () => {
        return {
            top: trimRowsTop(),
            bottom: trimRowsBottom(),
            left: trimColumnsLeft(),
            right: trimColumnsRight()
        };
    };

    /**
     * Returns all the fixtures, which are all parts on this PCB at their respective positions.
     * @returns {Array} An array containing all fixtures.
     */
    this.getFixtures = () => _fixtures;

    /**
     * Check whether the PCB is extendable at a certain point.
     * This means there is no point here yet and no part occupies the space.
     * @param {Number} x The X coordinate.
     * @param {Number} y The Y coordinate.
     * @returns {Boolean} A boolean indicating whether the PCB can be extended here.
     */
    this.isExtendable = (x, y) => {
        if (this.getPoint(x, y))
            return false;

        for (const fixture of _fixtures) if (fixture.part.getConfiguration().footprint.air)
            for (const point of fixture.part.getConfiguration().footprint.air)
                if (fixture.x + point.x === x && fixture.y + point.y === y)
                    return false;

        return true;
    };

    /**
     * Places a part on the PCB. It is assumed the part actually fits;
     * checking this is the responsibility of the caller.
     * The given position denotes the origin of the part, it may cover more than one cell.
     * @param {Part} part A part to place on this PCB.
     * @param {Number} x The X cell to place the part on.
     * @param {Number} y The Y cell to place the part on.
     * @returns {Fixture} The fixture of the added part.
     */
    this.place = (part, x, y) => {
        const fixture = new Fixture(part, x, y);

        _fixtures.push(fixture);

        for (const point of part.getConfiguration().footprint.points)
            this.getPoint(point.x + x, point.y + y).part = part;

        if (part.getConfiguration().footprint.air) for (const point of part.getConfiguration().footprint.air)
            _air.push(new Myr.Vector(point.x + x, point.y + y));

        for (const pin of part.getConfiguration().io) {
            switch (pin.type) {
                case Pin.TYPE_IN:
                    this.getPoint(pin.x + x, pin.y + y).connectInput();
                    break;
                case Pin.TYPE_OUT:
                    this.getPoint(pin.x + x, pin.y + y).connectOutput();
                    break;
                case Pin.TYPE_STRUCTURAL:
                    this.getPoint(pin.x + x, pin.y + y).connectStructural();
                    break;
            }
        }

        return fixture;
    };

    /**
     * Removes a part from the PCB.
     * @param {Part} part A part.
     */
    this.remove = part => {
        let fixture = null;

        for (const f of _fixtures) {
            if (f.part === part) {
                fixture = f;

                break;
            }
        }

        if (fixture === null)
            return;

        for (const point of part.getConfiguration().footprint.points)
            this.getPoint(fixture.x + point.x, fixture.y + point.y).part = null;

        if (part.getConfiguration().footprint.air) for (let i = _air.length; i-- > 0;) {
            for (const point of part.getConfiguration().footprint.air) {
                if (_air[i].x === point.x + fixture.x && _air[i].y === point.y + fixture.y) {
                    _air.splice(i, 1);

                    break;
                }
            }
        }

        for (const pin of part.getConfiguration().io)
            this.getPoint(fixture.x + pin.x, fixture.y + pin.y).disconnect();

        _fixtures.splice(_fixtures.indexOf(fixture), 1);
    };

    /**
     * Initialize this PCB with its default size.
     * This should always happen when creating a new PCB.
     */
    this.initialize = () => {
        for (let y = 0; y < Pcb.DEFAULT_HEIGHT; ++y) for (let x = 0; x < Pcb.DEFAULT_WIDTH; ++x)
            this.extend(x, y);
    };
}

Pcb.PIXELS_PER_POINT = 6;
Pcb.DEFAULT_WIDTH = 10;
Pcb.DEFAULT_HEIGHT = 10;