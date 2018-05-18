/**
 * A parts library to drag parts from.
 * @param {Object} myr A Myriad instance.
 * @param {Object} sprites An instantiated Sprites object
 * @param {Number} width The width in pixels.
 * @param {Number} height The height in pixels.
 * @constructor
 */
export default function PartsLibrary(myr, sprites, width, height) {
    const BORDER_SIZE = 8;

    const _borderLT = sprites.getSprite("GuiLibraryBorderLT");
    const _borderT = sprites.getSprite("GuiLibraryBorderT");
    const _borderRT = sprites.getSprite("GuiLibraryBorderRT");
    const _borderR = sprites.getSprite("GuiLibraryBorderR");
    const _borderRB = sprites.getSprite("GuiLibraryBorderRB");
    const _borderB = sprites.getSprite("GuiLibraryBorderB");
    const _borderLB = sprites.getSprite("GuiLibraryBorderLB");
    const _borderL = sprites.getSprite("GuiLibraryBorderL");
    const _list = new myr.Surface(width, height);
    const _borderFront = new myr.Surface(width, height);

    const makeBorder = () => {
        let x;
        let y;

        _borderFront.bind();

        _borderLT.draw(0, 0);
        _borderRT.draw(width - BORDER_SIZE, 0);
        _borderRB.draw(width - BORDER_SIZE, height - BORDER_SIZE);
        _borderLB.draw(0, height - BORDER_SIZE);

        for(x = BORDER_SIZE; x < width - BORDER_SIZE; x += BORDER_SIZE) {
            _borderT.draw(x, 0);
            _borderB.draw(x, height - BORDER_SIZE);
        }

        for(y = BORDER_SIZE; y < height - BORDER_SIZE; y += BORDER_SIZE) {
            _borderL.draw(0, y);
            _borderR.draw(x, y);
        }
    };

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
    this.draw = (x, y) => {
        _list.draw(x, y);
        _borderFront.draw(x, y);
    };

    width = Math.floor(width / BORDER_SIZE) * BORDER_SIZE;
    height = Math.floor(height / BORDER_SIZE) * BORDER_SIZE;

    makeBorder();
};