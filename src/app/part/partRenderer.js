import * as Myr from "../../lib/myr";
import {Pcb} from "../pcb/pcb";

/**
 * A part renderer.
 * @param {Sprites} sprites A sprites object to create sprites from.
 * @param {Object} source A part configuration.
 * @constructor
 */
export function PartRenderer(sprites, source) {
    const spriteInstances = [];
    const transformInstances = [];

    const createFromConfiguration = configuration => {
        for (const sprite of configuration.sprites) {
            spriteInstances.push(sprites.getSprite(sprite.name));

            const transform = new Myr.Transform();

            transform.translate(
                sprite.x * Pcb.PIXELS_PER_POINT,
                sprite.y * Pcb.PIXELS_PER_POINT);

            transformInstances.push(transform);
        }
    };

    /**
     * Draw the part at the specified location.
     * @param {Number} x The X position to draw at.
     * @param {Number} y The Y position to draw at.
     */
    this.draw = (x, y) => {
        for (let i = 0; i < spriteInstances.length; ++i)
            spriteInstances[i].drawTransformedAt(x, y, transformInstances[i]);
    };

    createFromConfiguration(source);
}