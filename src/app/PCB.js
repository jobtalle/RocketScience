/**
 * Defines a convex hull.
 * @constructor
 */
export function PCB() {
    const Point = function() {
        let _part = null;

        this.put = part => {
            _part = part;
        };

        this.getPart = () => _part;
    };

    const _points = [new Point()];

    let _width = 1;
    let _height = 1;
    let _xOrigin = 0.5;
    let _yOrigin = 0.5;
    let _mass = 1;

    const getPoint = (x, y) => _points[y][x];
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

    /**
     * Get the width of this PCB in blocks.
     * @returns {Number} The width.
     */
    this.getWidth = () => _width;

    /**
     * Get the height of this PCB in blocks.
     * @returns {Number} The height.
     */
    this.getHeight = () => _height;

    /**
     * Get the X origin of this PCB in blocks.
     * @returns {number} The X origin.
     */
    this.getXOrigin = () => _xOrigin;

    /**
     * Get the Y origin of this PCB in blocks.
     * @returns {number} The Y origin.
     */
    this.getYOrigin = () => _yOrigin;

    /**
     * Get the mass of this hull.
     * @returns {number} The total mass of this PCB and its parts.
     */
    this.getMass = () => _mass;

    /**
     * Returns a deep copy of this hull
     * @returns {Object} A deep copy of this PCB.
     */
    this.copy = () => {
        // TODO
    };

    /**
     * Place a part in the PCB, make sure it fits!
     * @param {Object} point The PCB to place the part in.
     * @param {Object} part A part to place.
     */
    this.place = (point, part) => {
        // TODO: put the part in all hull blocks is covers.

        point.put(part);
    };

    /**
     * Extend the PCB
     * @param {Object} point A PCB point to extend from.
     * @param {Number} x The X direction to extend to.
     * @param {Number} y The Y direction to extend to.
     */
    this.extend = (point, x, y) => {
        // TODO: Mutate _width and _height here.
    };
};