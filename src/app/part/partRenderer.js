import {Scale} from "../world/scale";
import Myr from "myr.js"

/**
 * A part renderer.
 * @param {RenderContext} renderContext A render context.
 * @param {Object} configuration A part configuration.
 * @constructor
 */
export function PartRenderer(renderContext, configuration) {
    const _sprites = [];
    const _transforms = [];
    let _externalThreshold = 0;
    let _separateThreshold = 0;

    const readSprite = sprite => {
        const transform = new Myr.Transform();

        transform.translate(
            sprite.x * Scale.PIXELS_PER_POINT,
            sprite.y * Scale.PIXELS_PER_POINT);

        this.addSprite(sprite.name, transform);
    };

    const createFromConfiguration = configuration => {
        if (configuration.sprites.internal) for (const sprite of configuration.sprites.internal) {
            readSprite(sprite);

            ++_externalThreshold;
            ++_separateThreshold;
        }

        if (configuration.sprites.external) for (const sprite of configuration.sprites.external) {
            readSprite(sprite);

            ++_separateThreshold;
        }

        if (configuration.sprites.separate) for (const sprite of configuration.sprites.separate)
            readSprite(sprite);
    };

    /**
     * Draw the internal parts.
     * @param {Number} x The X position to drawBody at.
     * @param {Number} y The Y position to drawBody at.
     */
    this.drawInternal = (x, y) => {
        for (let i = 0; i < _externalThreshold; ++i)
            _sprites[i].drawTransformedAt(x, y, _transforms[i]);
    };

    /**
     * Draw the external parts.
     * @param {Number} x The X position to drawBody at.
     * @param {Number} y The Y position to drawBody at.
     */
    this.drawExternal = (x, y) => {
        for (let i = _externalThreshold; i < _separateThreshold; ++i)
            _sprites[i].drawTransformedAt(x, y, _transforms[i]);
    };

    /**
     * Draw the separate parts.
     */
    this.drawSeparate = () => {
        for (let i = _separateThreshold; i < _sprites.length; ++i)
            _sprites[i].drawTransformed(_transforms[i]);
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
        _sprites.push(renderContext.getSprites().getSprite(sprite));
        _transforms.push(transform);
    };

    createFromConfiguration(configuration);
}