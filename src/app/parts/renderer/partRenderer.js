/**
 * A part renderer.
 * @param {Sprites} sprites A sprites object to create sprites from.
 * @param {PartConfiguration} configuration A part configuration to render.
 * @constructor
 */
export function PartRenderer(sprites, configuration) {
    const instances = [];

    const createSprites = () => {
        for (const sprite of configuration.getPartSprites().getSprites())
            instances.push(sprites.getSprite(sprite.getName()));
    };

    /**
     * Draw the part at the specified location.
     * @param {Number} x The X position to draw at.
     * @param {Number} y The Y position to draw at.
     */
    this.draw = (x, y) => {
        for (let i = 0; i < instances.length; ++i)
            instances[i].draw(
                x + configuration.getPartSprites().getSprites()[i].getOffset().x,
                y + configuration.getPartSprites().getSprites()[i].getOffset().y);
    };

    createSprites();
}