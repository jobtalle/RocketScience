import PartsLibrary from "./partsLibrary";

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
    const _library = new PartsLibrary(
        Math.floor(_surface.getWidth() * 0.5),
        _surface.getHeight() - 1);

    /**
     * Update the state of the editor.
     * @param {Number} timeStep The number of seconds passed after the previous update.
     */
    this.update = timeStep => {
        _library.update(timeStep);
    };

    /**
     * Render the editor.
     */
    this.render = () => {
        _surface.bind();
        _surface.clear();

        _library.draw(myr, 0, 0);
    };

    /**
     * Draw the editor
     */
    this.draw = () => {
        _surface.drawScaled(0, 0, SCALE, SCALE);
    };
}