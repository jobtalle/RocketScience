import {Pcb} from "./pcb";

/**
 * A PCB renderer.
 * @param {Myr} myr A Myriad instance.
 * @param {Sprites} sprites The sprites library.
 * @param {Pcb} pcb A pcb.
 * @constructor
 */
export function PcbRenderer(myr, sprites, pcb) {
    const SPRITE_POINT = sprites.getSprite("pcbPoint");

    let _initialized = false;
    let _layerPcb = null;

    const updateSurfaces = () => {
        _initialized = true;

        _layerPcb = new myr.Surface(
            Pcb.PIXELS_PER_POINT * pcb.getWidth(),
            Pcb.PIXELS_PER_POINT * pcb.getHeight());
        _layerPcb.bind();
        _layerPcb.clear();

        for(let row = 0; row < pcb.getHeight(); ++row)
            for(let column = 0; column < pcb.getWidth(); ++column)
                if(pcb.getPoint(column, row))
                    SPRITE_POINT.draw(
                        column * Pcb.PIXELS_PER_POINT,
                        row * Pcb.PIXELS_PER_POINT);
    };

    /**
     * Draws the associated pcb.
     * @param {Number} x The x coordinate in pixels.
     * @param {Number} y The y coordinate in pixels.
     */
    this.draw = (x, y) => _layerPcb.draw(x, y);

    /**
     * Draws the associated pcb using a transform.
     * @param {Myr.Transform} transform A Transform object.
     */
    this.drawTransformed = transform => _layerPcb.drawTransformed(transform);

    /**
     * Update the pcb representation.
     */
    this.revalidate = () => {
        updateSurfaces();
    };

    /**
     * Free all resources occupied by this pcb renderer.
     */
    this.free = () => {
        if (!_initialized)
            return;

        _initialized = false;

        _layerPcb.free();
        _layerPcb = null;
    };
}