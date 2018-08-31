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
    const _externalThreshold = configuration.sprites.internal.length;

    const readSprite = sprite => {
        const transform = new Myr.Transform();

        transform.translate(
            sprite.x * Pcb.PIXELS_PER_POINT,
            sprite.y * Pcb.PIXELS_PER_POINT);

        this.addSprite(sprite.name, transform);
    };

    const createFromConfiguration = configuration => {
        for (const sprite of configuration.sprites.internal)
            readSprite(sprite);

        for (const sprite of configuration.sprites.external)
            readSprite(sprite);
    };

    /**
     * Draw the internal parts.
     * @param {Number} x The X position to draw at.
     * @param {Number} y The Y position to draw at.
     */
    this.drawInternal = (x, y) => {
        for (let i = 0; i < _externalThreshold; ++i)
            _sprites[i].drawTransformedAt(x, y, _transforms[i]);
    };

    /**
     * Draw the external parts.
     * @param {Number} x The X position to draw at.
     * @param {Number} y The Y position to draw at.
     */
    this.drawExternal = (x, y) => {
        if (_externalThreshold === _sprites.length)
            return;

        for (let i = _externalThreshold; i < _sprites.length; ++i)
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

    /**
     * Add a sprite to this renderer.
     * @param {String} sprite A sprite name to instantiate.
     * @param {Myr.Transform} transform A transformation for the new sprite.
     */
    this.addSprite = (sprite, transform) => {
        _sprites.push(sprites.getSprite(sprite));
        _transforms.push(transform);
    };

    createFromConfiguration(configuration);
}