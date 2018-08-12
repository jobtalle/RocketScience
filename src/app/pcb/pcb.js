/**
 * Defines a PCB.
 * @param {Myr} myr A Myriad instance.
 * @param {Sprites} sprites The sprites library.
 * @constructor
 */
import {PcbPoint} from "./pcbPoint";
import {Fixture} from "../part/fixture";

export function Pcb(myr, sprites) {
    const _fixtures = [];
    const _points = [];

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
        const newPcb = new Pcb(myr, sprites);

        for (let y = 0; y < this.getHeight(); ++y) for (let x = 0; x < this.getWidth(); ++x)
            if (this.getPoint(x, y))
                newPcb.extend(x, y);

        for (const fixture of _fixtures)
            newPcb.place(fixture.part.copy(), fixture.x, fixture.y);

        return newPcb;
    };

    /**
     * Extend the Pcb. This should always result in a non-split shape!
     * A Pcb cannot be extended into negative coordinates; shift before doing this.
     * @param {Number} x The X position of the new point.
     * @param {Number} y The Y position of the new point.
     */
    this.extend = (x, y) => {
        while(this.getHeight() <= y)
            _points.push([]);

        if(x < _points[y].length)
            _points[y][x] = new PcbPoint();
        else {
            while(_points[y].length < x)
                _points[y].push(null);

            _points[y].push(new PcbPoint());
        }

        if(x >= _width)
            _width = x + 1;

        ++_pointCount;
    };

    /**
     * Erase a Pcb cell. You'll need to pack afterwards to prevent sparse pcb's.
     * The cell must exist. Never erase all points!
     * @param {Number} x The X position of the point.
     * @param {Number} y The Y position of the point.
     */
    this.erase = (x, y) => {
        if (_points[y][x].part !== null)
            this.remove(_points[y][x].part);

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

        for (const fixture of _fixtures)
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
     */
    this.place = (part, x, y) => {
        _fixtures.push(new Fixture(part, x, y));

        const footprint = part.getConfiguration().footprint;

        for (const point of footprint.points)
            this.getPoint(point.x + x, point.y + y).part = part;
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
Pcb.DEFAULT_WIDTH = 8;
Pcb.DEFAULT_HEIGHT = 6;