import Myr from "myr.js"
import {StyleUtils} from "../../utils/styleUtils";

/**
 * A pcb path renderer, used for rendering etched states of PCB points.
 * @param {RenderContext} renderContext A render context.
 * @param {Boolean} isPlan A boolean indicating whether this path is a planned path or an existing path.
 * @param {Myr.Color} [color] If this renderer is a plan, a valid color should be given to denote the kind of plan.
 * @constructor
 */
export function PcbPointRenderer(renderContext, isPlan, color) {
    let SPRITE_JUNCTION;
    let SPRITE_JUNCTION_STRUCTURAL;
    let SPRITE_NODE;
    let SPRITES_PATHS;

    if (isPlan) {
        SPRITE_JUNCTION = renderContext.getSprites().getSprite("pcbPathPlanJunction");
        SPRITE_JUNCTION_STRUCTURAL = SPRITE_JUNCTION;
        SPRITE_NODE = renderContext.getSprites().getSprite("pcbPathPlan");
        SPRITES_PATHS = [
            renderContext.getSprites().getSprite("pcbPathPlanR"),
            renderContext.getSprites().getSprite("pcbPathPlanRT"),
            renderContext.getSprites().getSprite("pcbPathPlanT"),
            renderContext.getSprites().getSprite("pcbPathPlanLT"),
            renderContext.getSprites().getSprite("pcbPathPlanL"),
            renderContext.getSprites().getSprite("pcbPathPlanLB"),
            renderContext.getSprites().getSprite("pcbPathPlanB"),
            renderContext.getSprites().getSprite("pcbPathPlanRB")];
    } else {
        SPRITE_JUNCTION = renderContext.getSprites().getSprite("pcbPathJunction");
        SPRITE_JUNCTION_STRUCTURAL = renderContext.getSprites().getSprite("pcbPathJunctionStructural");
        SPRITE_NODE = renderContext.getSprites().getSprite("pcbPath");
        SPRITES_PATHS = [
            renderContext.getSprites().getSprite("pcbPathR"),
            renderContext.getSprites().getSprite("pcbPathRT"),
            renderContext.getSprites().getSprite("pcbPathT"),
            renderContext.getSprites().getSprite("pcbPathLT"),
            renderContext.getSprites().getSprite("pcbPathL"),
            renderContext.getSprites().getSprite("pcbPathLB"),
            renderContext.getSprites().getSprite("pcbPathB"),
            renderContext.getSprites().getSprite("pcbPathRB")];
    }

    /**
     * Set a new render mode for this renderer.
     * @param {Myr.Color} newColor A new render mode, one of the valid mode constants of this object.
     */
    this.setColor = newColor => color = newColor;

    /**
     * Get the color which should be used for the mode this renderer is in.
     * @returns {Myr.Color} A color, or null if no filter color should be set.
     */
    this.getModeColor = () => color;

    /**
     * Render an etched state.
     * @param {PcbPoint} point A point to render the etch state from.
     * @param {Number} x The X position.
     * @param {Number} y The Y position.
     */
    this.render = (point, x, y) => {
        if (!point.hasPaths() && !point.isConnected())
            return;

        for (let direction = 0; direction < 8; ++direction) if (point.hasDirection(direction))
            SPRITES_PATHS[direction].draw(x - 1, y - 1);

        if (point.isStructural())
            SPRITE_JUNCTION_STRUCTURAL.draw(x, y);
        else if (point.isJunction())
            SPRITE_JUNCTION.draw(x, y);
        else
            SPRITE_NODE.draw(x, y);
    };
}

PcbPointRenderer.COLOR_SELECT = StyleUtils.getColor("--game-color-pcb-point-renderer-selected");
PcbPointRenderer.COLOR_DELETE = StyleUtils.getColor("--game-color-pcb-point-renderer-delete");
PcbPointRenderer.COLOR_INVALID = StyleUtils.getColor("--game-color-pcb-point-renderer-invalid");