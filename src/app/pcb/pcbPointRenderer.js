import * as Myr from "../../lib/myr";

/**
 * A pcb path renderer, used for rendering etched states of PCB points.
 * @param {Sprites} sprites The sprites library.
 * @param {Boolean} isPlan A boolean indicating whether this path is a planned path or an existing path.
 * @param {Object} mode A render mode, one of the valid mode constants of this object.
 * @constructor
 */
export function PcbPointRenderer(sprites, isPlan, mode) {
    let SPRITE_JUNCTION;
    let SPRITE_NODE;
    let SPRITES_PATHS;

    if (isPlan) {
        SPRITE_JUNCTION = sprites.getSprite("pcbPathPlanJunction");
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
        SPRITE_JUNCTION = sprites.getSprite("pcbPathJunction");
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

    const isJunction = paths => {
        let count = 0;

        for (let bit = 0; bit < 8; ++bit) {
            count += (paths >> bit) & 1;

            if (count > 2)
                return true;
        }

        return count < 2;
    };

    /**
     * Render an etched state.
     * @param {Myr} myr A Myriad instance.
     * @param {PcbPoint} point A point to render the etch state from.
     * @param {Number} x The X position.
     * @param {Number} y The Y position.
     */
    this.render = (myr, point, x, y) => {
        if (point.paths === 0)
            return;

        if (mode)
            myr.setColor(mode);

        for (let bit = 0; bit < 8; ++bit) if (((point.paths >> bit) & 1) === 1)
            SPRITES_PATHS[bit].draw(x - 1, y - 1);

        if (isJunction(point.paths))
            SPRITE_JUNCTION.draw(x, y);
        else
            SPRITE_NODE.draw(x, y);

        if (mode)
            myr.setColor(Myr.Color.WHITE);
    };
}

PcbPointRenderer.MODE_SELECT = null;
PcbPointRenderer.MODE_DELETE = Myr.Color.RED;