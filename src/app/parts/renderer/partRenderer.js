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

    this.draw = (x, y) => {
        for (const instance of instances)
            instance.draw(x, y);
    }
}