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
        if(
            _layerPcb &&
            _layerPcb.getWidth() === Pcb.POINT_SIZE * pcb.getWidth() &&
            _layerPcb.getHeight() === Pcb.POINT_SIZE * pcb.getHeight())
            return;

        _layerPcb = new myr.Surface(
            Pcb.POINT_SIZE * pcb.getWidth(),
            Pcb.POINT_SIZE * pcb.getHeight());
        _layerPcb.bind();
        _layerPcb.clear();

        for(let row = 0; row < pcb.getHeight(); ++row)
            for(let column = 0; column < pcb.getWidth(); ++column)
                if(pcb.getPoint(column, row))
                    SPRITE_POINT.draw(
                        column * Pcb.POINT_SIZE,
                        row * Pcb.POINT_SIZE);
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