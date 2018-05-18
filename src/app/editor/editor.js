/**
 * Provides a grid editor.
 * @param {Object} myr A Myriad instance.
 * @param {Number} width The width.
 * @param {Number} height The height.
 * @constructor
 */
export default function Editor(myr, width, height) {
    const COLOR_CLEAR = myr.Color.BLUE;

    const _surface = new myr.Surface(width, height);

    /**
     * Update the state of the editor.
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {

    };

    /**
     * Render the editor.
     */
    this.render = () => {
        _surface.bind();
        _surface.clear();
    };

    /**
     * Draw the editor
     * @param {Number} x X position to draw to.
     * @param {Number} y Y position to draw to.
     */
    this.draw = (x, y) => {
        _surface.draw(x, y);
    };

    _surface.setClearColor(COLOR_CLEAR);
}