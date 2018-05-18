/**
 * Provides a grid editor.
 * @param {Object} myr A Myriad instance.
 * @param {Number} width The width.
 * @param {Number} height The height.
 * @constructor
 */
export default function Editor(myr, width, height) {
    const SCALE = 4;

    const _surface = new myr.Surface(
        Math.ceil(width / SCALE),
        Math.ceil(height / SCALE));

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
     */
    this.draw = () => {
        _surface.drawScaled(0, 0, SCALE, SCALE);
    };
}