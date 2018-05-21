/**
 * Defines a convex hull.
 * @constructor
 */
export default function PCB() {
    const Point = function() {
        let _part = null;

        this.put = part => {
            _part = part;
        };

        this.getPart = () => _part;
    };

    const _points = [new Point()];

    let _layer_hull = null;
    let _layer_parts = null;
    let _layer_skin = null;
    let _width = 1;
    let _height = 1;
    let _xOrigin = 0.5;
    let _yOrigin = 0.5;
    let _mass = 1;

    const getHullBlock = (x, y) => _points[y][x];
    const getHullBlockPosition = block => {
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
     * Get the width of this hull in blocks.
     * @returns {Number} The width.
     */
    this.getWidth = () => _width;

    /**
     * Get the height of this hull in blocks.
     * @returns {Number} The height.
     */
    this.getHeight = () => _height;

    /**
     * Get the X origin of this hull in blocks.
     * @returns {number} The X origin.
     */
    this.getXOrigin = () => _xOrigin;

    /**
     * Get the Y origin of this hull in blocks.
     * @returns {number} The Y origin.
     */
    this.getYOrigin = () => _yOrigin;

    /**
     * Get the mass of this hull.
     * @returns {number} The total mass of this hull.
     */
    this.getMass = () => _mass;

    /**
     * Returns a deep copy of this hull
     * @returns {Object} A deep copy of this hull.
     */
    this.copy = () => {
        // TODO
    };

    /**
     * Place a part in the hull, make sure it fits!
     * @param {Object} block The hull block to place the part in.
     * @param {Object} part A part to place.
     */
    this.place = (block, part) => {
        // TODO: put the part in all hull blocks is covers.

        block.put(part);
    };

    /**
     * Extend the hull
     * @param {Object} block A hull block to extend from.
     * @param {Number} x The X direction to extend to.
     * @param {Number} y The Y direction to extend to.
     */
    this.extend = (block, x, y) => {
        // TODO: Mutate _width and _height here.
    };
};