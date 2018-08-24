/**
 * A pcb path renderer, used for rendering etched states of PCB points.
 * @param {Sprites} sprites The sprites library.
 * @param {Boolean} isPlan A boolean indicating whether this path is a planned path or an existing path.
 * @constructor
 */
export function PcbPathRenderer(sprites, isPlan) {
    let SPRITE_NODE;
    let SPRITES_PATHS;

    if (isPlan) {
        SPRITE_NODE = sprites.getSprite("pcbPathPlan");
        SPRITES_PATHS = [
            sprites.getSprite("pcbPathPlanR"),
            sprites.getSprite("pcbPathPlanRT"),
            sprites.getSprite("pcbPathPlanT"),
            sprites.getSprite("pcbPathPlanLT"),
            sprites.getSprite("pcbPathPlanL"),
            sprites.getSprite("pcbPathPlanLB"),
            sprites.getSprite("pcbPathPlanB"),
            sprites.getSprite("pcbPathPlanRB")];
    } else {
        SPRITE_NODE = sprites.getSprite("pcbPath");
        SPRITES_PATHS = [
            sprites.getSprite("pcbPathR"),
            sprites.getSprite("pcbPathRT"),
            sprites.getSprite("pcbPathT"),
            sprites.getSprite("pcbPathLT"),
            sprites.getSprite("pcbPathL"),
            sprites.getSprite("pcbPathLB"),
            sprites.getSprite("pcbPathB"),
            sprites.getSprite("pcbPathRB")];
    }

    /**
     * Render an etched state.
     * @param {Number} state The etched state.
     * @param {Number} x The X position.
     * @param {Number} y The Y position.
     */
    this.render = (state, x, y) => {
        if (state === 0)
            return;

        for (let bit = 0; bit < 8; ++bit) if (((state >> bit) & 1) === 1)
            SPRITES_PATHS[bit].draw(x - 1, y - 1);

        SPRITE_NODE.draw(x, y);
    };
}