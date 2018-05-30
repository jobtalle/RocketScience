import {Pcb} from "./pcb";

/**
 * A PCB renderer
 * @param {Object} myr A Myriad instance.
 * @param {Object} sprites The sprites library.
 * @param {Object} pcb A pcb.
 * @constructor
 */
export function PcbRenderer(myr, sprites, pcb) {
    const SPRITE_POINT = sprites.getSprite("pcbPoint");

    let _layerPcb = null;

    const updateSurfaces = () => {
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
    this.draw = (x, y) => {
        _layerPcb.draw(x, y);
    };

    /**
     * Update the pcb representation.
     */
    this.revalidate = () => {
        updateSurfaces();
    };
}