/**
 * A parts library to drag parts from.
 * @param {Number} width The width in pixels.
 * @param {Number} height The height in pixels.
 * @constructor
 */
export default function PartsLibrary(width, height) {
    /**
     * Update the state of the library.
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {

    };

    /**
     * Draw the library at a position
     * @param {Object} myr An instance of the Myriad engine.
     * @param {Number} x The X position to render to.
     * @param {Number} y The Y position to render to.
     */
    this.draw = (myr, x, y) => {
        myr.primitives.drawRectangle(myr.Color.BLACK, x + 1, y + 1, width, height);
    };
};