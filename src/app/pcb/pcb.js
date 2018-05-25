/**
 * Defines a PCB.
 * @param {Object} myr A Myriad instance.
 * @param {Object} sprites The sprites library.
 * @constructor
 */
export function Pcb(myr, sprites) {
    const Point = function() {
        let _part = null;

        this.put = part => {
            _part = part;
        };

        this.getPart = () => _part;
    };

    const _points = [[new Point(), new Point()],[new Point(), new Point()]];

    let _width = 2;
    let _xOrigin = 0.5;
    let _yOrigin = 0.5;
    let _mass = 1;

    const getPointPosition = block => {
        for(let row = 0; row < _points.length; ++row) {
            const column = _points[row].indexOf(block);

            if(column === -1)
                continue;

            return {
                row: row,
                column: column
            };
        }

        return null;
    };

    const trimRowsTop = () => {
        let empty = true;

        while (empty) {
            for (let column = 0; column < _points[0].length; ++column) {
                if (this.getPoint(column, 0)) {
                    empty = false;

                    break;
                }
            }

            if (empty)
                _points.splice(0, 1);
        }
    };

    const trimRowsBottom = () => {
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
    };

    const trimColumnsLeft = () => {
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

                _width--;
            }
        }
    };

    const trimColumnsRight = () => {
        let width = 0;

        for (let row = 0; row < this.getHeight(); ++row) {
            let column = _points[row].length;

            while (column-- > 0)
                if(this.getPoint(column, row))
                    break;

            if (column >= width)
                width = column + 1;

            if (++column > _points[row].length)
                _points[row].splice(column, _points[row].length - column);
        }

        _width = width;
    };

    /**
     * Get a point on this pcb.
     * @param {Number} x The x position on the board.
     * @param {Number} y The y position on the board
     * @returns {null} A pcb point, or null if no point is placed here.
     */
    this.getPoint = (x, y) => y < _points.length && x < _points[y].length?_points[y][x]:null;

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
     * Get the X origin of this Pcb in points.
     * @returns {number} The X origin.
     */
    this.getXOrigin = () => _xOrigin;

    /**
     * Get the Y origin of this Pcb in points.
     * @returns {number} The Y origin.
     */
    this.getYOrigin = () => _yOrigin;

    /**
     * Get the mass of this pcb.
     * @returns {number} The total mass of this Pcb and its parts.
     */
    this.getMass = () => _mass;

    /**
     * Returns a deep copy of this pcb.
     * @returns {Object} A deep copy of this Pcb.
     */
    this.copy = () => {
        // TODO
    };

    /**
     * Place a part in the Pcb, make sure it fits!
     * @param {Object} point The Pcb to place the part in.
     * @param {Object} part A part to place.
     */
    this.place = (point, part) => {
        // TODO: put the part in all hull blocks is covers.

        point.put(part);
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
            _points[y][x] = new Point();
        else {
            while(_points[y].length < x)
                _points[y].push(null);

            _points[y].push(new Point());
        }

        if(x >= _width)
            _width = x + 1;
    };

    /**
     * Erase a Pcb cell. You'll need to pack afterwards to prevent sparse pcb's.
     * The cell must exist. Never erase all cells!
     * @param {Number} x The X position of the point.
     * @param {Number} y The Y position of the point.
     */
    this.erase = (x, y) => {
        _points[y][x] = null;
    };

    /**
     * Shift the Pcb points with respect to the origin.
     * @param x The X shift in points.
     * @param y The Y shift in points.
     */
    this.shift = (x, y) => {
        for(let row = 0; row < this.getHeight(); ++row)
            for(let i = 0; i < x; ++i)
                _points[row].splice(0, 0, null);

        for(let i = 0; i < y; ++i)
            _points.splice(0, 0, []);

        _width += x;
    };

    /**
     * Remove empty rows and columns from the sides.
     * Use this after erasing points.
     */
    this.pack = () => {
        trimRowsTop();
        trimRowsBottom();
        trimColumnsLeft();
        trimColumnsRight();
    };
}

Pcb.POINT_SIZE = 6;