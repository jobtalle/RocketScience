/**
 * A parts library to drag parts from. Note that its dimensions must be multiples of 8.
 * @param {Object} myr A Myriad instance.
 * @param {Object} sprites An instantiated Sprites object
 * @param {Number} width The width in pixels.
 * @param {Number} height The height in pixels.
 * @constructor
 */
export default function PartsLibrary(myr, sprites, width, height) {
    const PartButton = function(name) {
        const _sprite = sprites.getSprite(name);

        this.draw = (x, y) => _sprite.draw(x, y);
    };

    const ATOM = 8;

    const _borderLT = sprites.getSprite("GuiLibraryBorderLT");
    const _borderT = sprites.getSprite("GuiLibraryBorderT");
    const _borderRT = sprites.getSprite("GuiLibraryBorderRT");
    const _borderR = sprites.getSprite("GuiLibraryBorderR");
    const _borderRB = sprites.getSprite("GuiLibraryBorderRB");
    const _borderB = sprites.getSprite("GuiLibraryBorderB");
    const _borderLB = sprites.getSprite("GuiLibraryBorderLB");
    const _borderL = sprites.getSprite("GuiLibraryBorderL");
    const _scrollTop = sprites.getSprite("GuiLibraryScrollTop");
    const _scrollSegment = sprites.getSprite("GuiLibraryScrollSegment");
    const _scrollBottom = sprites.getSprite("GuiLibraryScrollBottom");
    const _scrollSlider = sprites.getSprite("GuiLibraryScrollSlider");
    const _categoryEnergy = sprites.getSprite("GuiLibraryCategoryEnergy");
    const _categorySensors = sprites.getSprite("GuiLibraryCategorySensors");

    const _list = new myr.Surface(width - ATOM * 3, height - ATOM * 2);
    const _borders = new myr.Surface(width, height);
    const _partsPower = [
        new PartButton("PartBattery"),
        new PartButton("PartBattery"),
        new PartButton("PartBattery"),
        new PartButton("PartBattery"),
        new PartButton("PartBattery"),
        new PartButton("PartBattery"),
        new PartButton("PartBattery")
    ];

    const makeBorder = () => {
        let x;
        let y;

        _borders.bind();

        _borderLT.draw(ATOM, 0);
        _borderRT.draw(width - ATOM, 0);
        _borderRB.draw(width - ATOM, height - ATOM);
        _borderLB.draw(ATOM, height - ATOM);
        _scrollTop.draw(0, 0);
        _scrollBottom.draw(0, height - ATOM);

        for(x = ATOM * 2; x < width - ATOM; x += ATOM) {
            _borderT.draw(x, 0);
            _borderB.draw(x, height - ATOM);
        }

        for(y = ATOM; y < height - ATOM; y += ATOM) {
            _borderL.draw(ATOM, y);
            _borderR.draw(x, y);
            _scrollSegment.draw(0, y);
        }

        _scrollSlider.draw(0, 8);
    };

    const makeList = () => {
        _list.bind();
        _list.clear();

        let x = 0;
        let y = 0;

        _categoryEnergy.draw(x, y);
        y += 16;

        for(const part of _partsPower) {
            part.draw(x, y);

            if((x += 24) >= _list.getWidth() - 24) {
                y += 24;
                x = 0;
            }
        }

        if(x !== 0)
            y += 24;

        _categorySensors.draw(0, y);
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
        _list.draw(ATOM * 2, ATOM);
        _borders.draw(x, y);
    };

    width = Math.floor(width / ATOM) * ATOM;
    height = Math.floor(height / ATOM) * ATOM;

    makeList();
    makeBorder();
};