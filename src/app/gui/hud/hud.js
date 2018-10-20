import {Checklist} from "../shared/checklist/checklist";

/**
 * GUI which is active during game-play.
 * @param {RenderContext} renderContext A render context.
 * @param {World} world A world instance to interact with.
 * @param {Game} game A game.
 * @constructor
 */
export function Hud(renderContext, world, game) {
    const _checklist = new Checklist(world.getMission(), renderContext.getOverlay());

    /**
     * Free all resources used by this object.
     */
    this.free = () => {

    };

    /**
     * Show the HUD.
     */
    this.show = () => {
        _checklist.show();
    };

    /**
     * Hide the HUD.
     */
    this.hide = () => {
        _checklist.hide();
    };
}