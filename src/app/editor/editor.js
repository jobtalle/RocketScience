import PartsLibrary from "./partsLibrary";

/**
 * Provides a grid editor.
 * @param {Object} myr A Myriad instance.
 * @param {Object} sprites An instantiated Sprites object
 * @param {Number} width The width.
 * @param {Number} height The height.
 * @constructor
 */
export default function Editor(myr, sprites, width, height) {
    const SCALE = 3;

    const _surface = new myr.Surface(
        Math.ceil(width / SCALE),
        Math.ceil(height / SCALE));
    const _library = new PartsLibrary(
        myr,
        sprites,
        Math.floor(_surface.getWidth() * 0.3),
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

        _library.draw(0, 0);
    };

    /**
     * Draw the editor
     */
    this.draw = () => {
        _surface.drawScaled(0, 0, SCALE, SCALE);
    };
}