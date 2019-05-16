import {Pcb} from "../../../pcb/pcb";
import {Scale} from "../../../world/scale";
import Myr from "myr.js"

/**
 * A move editor moves a PCB within its editable region.
 * @param {RenderContext} renderContext A render context.
 * @param {Pcb} pcb The PCB currently being edited.
 * @param {Myr.Vector} cursor The cursor position in cells.
 * @param {Myr.Vector} rawCursor The precise cursor position, not rounded down to cells.
 * @param {PcbEditor} editor A PCB editor.
 * @param {View} view The editor view.
 * @constructor
 */
export function PcbEditorMove(renderContext, pcb, cursor, rawCursor, editor, view) {
    const SPRITE_MOVE = renderContext.getSprites().getSprite("pcbMove");

    let _mode = PcbEditorMove.NOT_MOVABLE;
    let _dragging = null;
    let _moveStart = new Myr.Vector(0, 0);

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
        if (!_dragging)
            if (pcb.getPoint(cursor.x, cursor.y) !== null)
                _mode = PcbEditorMove.PCB_MOVE;
            else if (editor.getEditable().getRegion().containsPoint(
                rawCursor.x * Scale.METERS_PER_POINT + editor.getEditable().getOffset().x,
                rawCursor.y * Scale.METERS_PER_POINT + editor.getEditable().getOffset().y,
                1))
                _mode = PcbEditorMove.REGION_MOVE;
            else if (editor.getEditable().getRegion().containsPoint(
                rawCursor.x * Scale.METERS_PER_POINT + editor.getEditable().getOffset().x,
                rawCursor.y * Scale.METERS_PER_POINT + editor.getEditable().getOffset().y,
                5))
                _mode = PcbEditorMove.REGION_RESIZE;
            else
                _mode = PcbEditorMove.NOT_MOVABLE;
    };

    /**
     * Tell the editor the mouse has moved.
     * @param {Number} x The mouse position on the screen in pixels.
     * @param {Number} y The mouse position on the screen in pixels.
     */
    this.mouseMove = (x, y) => {
        if (_dragging) {
            const dx = (x - _moveStart.x) * Scale.METERS_PER_PIXEL / view.getZoom();
            const dy = (y - _moveStart.y) * Scale.METERS_PER_PIXEL / view.getZoom();

            switch (_mode) {
                case PcbEditorMove.PCB_MOVE:
                    editor.moveOffset(dx, dy);

                    break;
                case PcbEditorMove.REGION_MOVE:
                    editor.moveRegion(dx, dy);

                    break;
                case PcbEditorMove.REGION_RESIZE:
                    editor.resizeRegion(dx, dy);

                    break;
            }

            _moveStart.x = x;
            _moveStart.y = y;
        }
    };

    /**
     * Start dragging action.
     * @param {Number} x The mouse position on the screen in pixels.
     * @param {Number} y The mouse position on the screen in pixels.
     * @returns {Boolean} A boolean indicating whether a drag event has started.
     */
    this.mouseDown = (x, y) => {
        if (_mode !== PcbEditorMove.NOT_MOVABLE) {
            editor.getUndoStack().push();

            _moveStart.x = x;
            _moveStart.y = y;
            _dragging = cursor.copy();

            return true;
        }

        return false;
    };

    /**
     * Finish the current dragging action.
     */
    this.mouseUp = () => {
        _dragging = null;
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
        if (_dragging && _mode === PcbEditorMove.PCB_MOVE)
            SPRITE_MOVE.draw(
                (_dragging.x - 1) * Scale.PIXELS_PER_POINT,
                (_dragging.y - 1) * Scale.PIXELS_PER_POINT);
        else if (_mode === PcbEditorMove.PCB_MOVE)
            SPRITE_MOVE.draw(
                (cursor.x - 1) * Scale.PIXELS_PER_POINT,
                (cursor.y - 1) * Scale.PIXELS_PER_POINT);
        else if (_mode === PcbEditorMove.REGION_MOVE)
            SPRITE_MOVE.draw(
                (rawCursor.x - 1.5) * Scale.PIXELS_PER_POINT,
                (rawCursor.y - 1.5) * Scale.PIXELS_PER_POINT);
        else if (_mode === PcbEditorMove.REGION_RESIZE)
            SPRITE_MOVE.draw(
                (rawCursor.x - 1.5) * Scale.PIXELS_PER_POINT,
                (rawCursor.y - 1.5) * Scale.PIXELS_PER_POINT);
    };
}

PcbEditorMove.NOT_MOVABLE = 0;
PcbEditorMove.PCB_MOVE = 1;
PcbEditorMove.REGION_MOVE = 2;
PcbEditorMove.REGION_RESIZE = 3;