/**
 * A move editor moves a PCB within its editable region.
 * @param {RenderContext} renderContext A render context.
 * @param {Pcb} pcb The PCB currently being edited.
 * @param {Myr.Vector} cursor The cursor position in cells.
 * @param {PcbEditor} editor A PCB editor.
 * @constructor
 */
import {Pcb} from "../../../pcb/pcb";

export function PcbEditorMove(renderContext, pcb, cursor, editor) {
    const SPRITE_MOVE = renderContext.getSprites().getSprite("pcbMove");

    let _movable = false;

    /**
     * Change the PCB being edited.
     */
    this.updatePcb = () => {

    };

    /**
     * A key event has been fired.
     * @param {KeyEvent} event A key event.
     */
    this.onKeyEvent = event => {

    };

    /**
     * Tell the editor the cursor has moved.
     */
    this.moveCursor = () => {
        _movable = pcb.getPoint(cursor.x, cursor.y) !== null;
    };

    /**
     * Tell the editor the mouse has moved.
     * @param {Number} x The mouse position on the screen in pixels.
     * @param {Number} y The mouse position on the screen in pixels.
     */
    this.mouseMove = (x, y) => {

    };

    /**
     * Start dragging action.
     * @returns {Boolean} A boolean indicating whether a drag event has started.
     */
    this.mouseDown = () => {
        return false;
    };

    /**
     * Finish the current dragging action.
     */
    this.mouseUp = () => {

    };

    /**
     * Zoom in.
     * @returns {Boolean} A boolean indicating whether this editor handled the action.
     */
    this.zoomIn = () => {
        return false;
    };

    /**
     * Zoom out.
     * @returns {Boolean} A boolean indicating whether this editor handled the action.
     */
    this.zoomOut = () => {
        return false;
    };

    /**
     * The mouse enters.
     */
    this.onMouseEnter = () => {

    };

    /**
     * The mouse leaves.
     */
    this.onMouseLeave = () => {

    };

    /**
     * Cancel any actions deviating from this editors base state.
     */
    this.cancelAction = () => {

    };

    /**
     * Reset the editor's current state.
     */
    this.reset = () => {

    };

    /**
     * Update this editor.
     * @param {Number} timeStep The time passed since the last update in seconds.
     */
    this.update = timeStep => {

    };

    /**
     * Make this editor active.
     */
    this.makeActive = () => {

    };

    /**
     * Draw this editor.
     */
    this.draw = () => {
        if (_movable)
            SPRITE_MOVE.draw(
                (cursor.x - 1) * Pcb.PIXELS_PER_POINT,
                (cursor.y - 1) * Pcb.PIXELS_PER_POINT);
    };
}