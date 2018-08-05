import * as Myr from "../../../lib/myr";

/**
 * A part renderer.
 * @param {Sprites} sprites A sprites object to create sprites from.
 * @param {Object} source Either a PartConfiguration or a valid part.
 * @constructor
 */
export function PartRenderer(sprites, source) {
    const spriteInstances = [];
    const transformInstances = [];

    const createFromConfiguration = configuration => {
        for (const sprite of configuration.getPartSprites().getSprites()) {
            spriteInstances.push(sprites.getSprite(sprite.getName()));

            const transform = new Myr.Transform();

            transform.translate(sprite.getOffset().x, sprite.getOffset().y);

            transformInstances.push(transform);
        }
    };

    const createFromPart = part => {
        // TODO: Create from instantiated part
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

    if (source.getPartSprites === undefined)
        createFromPart(source);
    else
        createFromConfiguration(source);
}