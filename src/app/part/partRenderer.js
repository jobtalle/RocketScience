import * as Myr from "../../lib/myr";
import {Pcb} from "../pcb/pcb";

/**
 * A part renderer.
 * @param {Sprites} sprites A sprites object to create sprites from.
 * @param {Object} configuration A part configuration.
 * @constructor
 */
export function PartRenderer(sprites, configuration) {
    const _sprites = [];
    const _transforms = [];

    const createFromConfiguration = configuration => {
        for (const sprite of configuration.sprites) {
            _sprites.push(sprites.getSprite(sprite.name));

            const transform = new Myr.Transform();

            transform.translate(
                sprite.x * Pcb.PIXELS_PER_POINT,
                sprite.y * Pcb.PIXELS_PER_POINT);

            _transforms.push(transform);
        }
    };

    /**
     * Draw the part at the specified location.
     * @param {Number} x The X position to draw at.
     * @param {Number} y The Y position to draw at.
     */
    this.draw = (x, y) => {
        for (let i = 0; i < _sprites.length; ++i)
            _sprites[i].drawTransformedAt(x, y, _transforms[i]);
    };

    /**
     * Get the sprite instances of this renderer.
     * @returns {Array} An array of Sprite instances.
     */
    this.getSprites = () => _sprites;

    /**
     * Get the transformation instances of this renderer.
     * @returns {Array} An array of Transform instances.
     */
    this.getTransforms = () => _transforms;

    createFromConfiguration(configuration);
}