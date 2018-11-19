import {Checklist} from "../shared/checklist/checklist";

/**
 * GUI which is active during game-play.
 * @param {RenderContext} renderContext A render context.
 * @param {World} world A world instance to interact with.
 * @param {Game} game A game.
 * @constructor
 */
export function Hud(renderContext, world, game) {
    let _checklist = null;

    /**
     * Free all resources used by this object.
     */
    this.free = () => {

    };

    /**
     * Show the HUD.
     */
    this.show = () => {
        _checklist = new Checklist(world.getMission(), game, world.getMission());

        renderContext.getOverlay().appendChild(_checklist.getElement());
    };

    /**
     * Hide the HUD.
     */
    this.hide = () => {
        renderContext.getOverlay().removeChild(_checklist.getElement());
    };
}