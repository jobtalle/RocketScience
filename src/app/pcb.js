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

    const SPRITE_POINT = sprites.getSprite("pcbPoint");
    const SPRITE_EXTEND = sprites.getSprite("pcbExtend");
    const POINT_WIDTH = SPRITE_POINT.getWidth();
    const POINT_HEIGHT = SPRITE_POINT.getHeight();

    const _points = [[new Point()]];

    let _layerPcb = null;
    let _layerParts = null;
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

    const updateSurfaces = () => {
        if(
            _layerPcb &&
            _layerPcb.getWidth() === POINT_WIDTH * this.getWidth() &&
            _layerPcb.getHeight() === POINT_HEIGHT * this.getHeight())
            return;

        _layerPcb = new myr.Surface(
            POINT_WIDTH * this.getWidth(),
            POINT_HEIGHT * this.getHeight());
        _layerPcb.bind();
        _layerPcb.clear();

        for(let row = 0; row < _points.length; ++row)
            for(let column = 0; column < _points[row].length; ++column)
                if(_points[row][column])
                    SPRITE_POINT.draw(
                        column * POINT_WIDTH,
                        row * POINT_HEIGHT);
    };

    /**
     * Get the width of this Pcb in points.
     * @returns {Number} The width.
     */
    this.getWidth = () => _width;

    /**
     * Get the height of this Pcb in points.
     * @returns {Number} The height.
     */
    this.getHeight = () => _height;

    /**
     * Get the point width;
     * @returns {Number} The point width in pixels.
     */
    this.getPointWidth = () => POINT_WIDTH;

    /**
     * Get the point height.
     * @returns {Number} The point height in pixels.
     */
    this.getPointHeight = () => POINT_HEIGHT;

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
     * Get the mass of this hull.
     * @returns {number} The total mass of this Pcb and its parts.
     */
    this.getMass = () => _mass;

    /**
     * Returns a deep copy of this hull
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
     * Extend the Pcb
     * @param {Object} point A Pcb point to extend from.
     * @param {Number} x The X direction to extend to.
     * @param {Number} y The Y direction to extend to.
     */
    this.extend = (point, x, y) => {
        // TODO: Mutate _width and _height here.
    };

    /**
     * Draws this pcb.
     * @param {Number} x The x coordinate in pixels.
     * @param {Number} y The y coordinate in pixels.
     */
    this.draw = (x, y) => {
        _layerPcb.draw(x, y);
    };

    updateSurfaces();
}