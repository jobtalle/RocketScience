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
 * @param {Boolean} isMissionEditor A boolean indicating whether the editor is in mission editor mode.
 * @constructor
 */
export function PcbEditorMove(renderContext, pcb, cursor, rawCursor, editor, view, isMissionEditor) {
    const SPRITE_MOVE = renderContext.getSprites().getSprite("pcbMove");
    const SPRITE_RESIZE = renderContext.getSprites().getSprite("pcbAreaExtend");

    let _mode = PcbEditorMove.NOT_MOVABLE;
    let _dragging = null;
    let _rawDragging = null;
    let _moveStart = new Myr.Vector(0, 0);
    let _resizeQuadrant = 0;

    /**
     * Set the flags in _resizeQuadrant. Stores in which quadrant of the editable region the mouse is.
     */
    const setResizeQuadrant = () => {
        _resizeQuadrant = 0;
        if (rawCursor.x * Scale.METERS_PER_POINT + editor.getEditable().getOffset().x < 0)
            _resizeQuadrant |= PcbEditorMove.BIT_MASK_LEFT;
        else if (rawCursor.x * Scale.METERS_PER_POINT + editor.getEditable().getOffset().x > editor.getEditable().getRegion().getSize().x)
            _resizeQuadrant |= PcbEditorMove.BIT_MASK_RIGHT;

        if (rawCursor.y * Scale.METERS_PER_POINT + editor.getEditable().getOffset().y < 0)
            _resizeQuadrant |= PcbEditorMove.BIT_MASK_UP;
        else if (rawCursor.y * Scale.METERS_PER_POINT + editor.getEditable().getOffset().y > editor.getEditable().getRegion().getSize().y)
            _resizeQuadrant |= PcbEditorMove.BIT_MASK_DOWN;
    };

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
        if (!_dragging) {
            if (pcb.getPoint(cursor.x, cursor.y) !== null)
                _mode = PcbEditorMove.PCB_MOVE;
            else if (isMissionEditor && editor.getEditable().getRegion().containsPoint(
                rawCursor.x * Scale.METERS_PER_POINT + editor.getEditable().getOffset().x,
                rawCursor.y * Scale.METERS_PER_POINT + editor.getEditable().getOffset().y,
                1))
                _mode = PcbEditorMove.REGION_MOVE;
            else if (isMissionEditor && editor.getEditable().getRegion().containsPoint(
                rawCursor.x * Scale.METERS_PER_POINT + editor.getEditable().getOffset().x,
                rawCursor.y * Scale.METERS_PER_POINT + editor.getEditable().getOffset().y,
                5)) {
                _mode = PcbEditorMove.REGION_RESIZE;

                setResizeQuadrant();
            } else
                _mode = PcbEditorMove.NOT_MOVABLE;
        }
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
                    const delta = new Myr.Vector(0, 0);

                    if (_resizeQuadrant & PcbEditorMove.BIT_MASK_LEFT)
                        delta.add(editor.resizeRegionUpLeft(dx, 0));
                    else if (_resizeQuadrant & PcbEditorMove.BIT_MASK_RIGHT)
                        delta.add(editor.resizeRegion(dx, 0));

                    if (_resizeQuadrant & PcbEditorMove.BIT_MASK_UP)
                        delta.add(editor.resizeRegionUpLeft(0, dy));
                    else if (_resizeQuadrant & PcbEditorMove.BIT_MASK_DOWN)
                        delta.add(editor.resizeRegion(0, dy));

                    delta.multiply(Scale.POINTS_PER_METER);
                    _rawDragging.add(delta);

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
            _rawDragging = rawCursor.copy();

            return true;
        }

        return false;
    };

    /**
     * Finish the current dragging action.
     */
    this.mouseUp = () => {
        _dragging = null;
        _rawDragging = null;
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

        switch (_mode) {
            case PcbEditorMove.PCB_MOVE:
                if (_dragging)
                    SPRITE_MOVE.draw(
                        (_dragging.x - 1) * Scale.PIXELS_PER_POINT,
                        (_dragging.y - 1) * Scale.PIXELS_PER_POINT);
                else
                    SPRITE_MOVE.draw(
                        (cursor.x - 1) * Scale.PIXELS_PER_POINT,
                        (cursor.y - 1) * Scale.PIXELS_PER_POINT);

                break;
            case PcbEditorMove.REGION_MOVE:
                if (_rawDragging)
                    SPRITE_MOVE.draw(
                        (_rawDragging.x - 1.5) * Scale.PIXELS_PER_POINT,
                        (_rawDragging.y - 1.5) * Scale.PIXELS_PER_POINT);
                else
                    SPRITE_MOVE.draw(
                        (rawCursor.x - 1.5) * Scale.PIXELS_PER_POINT,
                        (rawCursor.y - 1.5) * Scale.PIXELS_PER_POINT);

                break;
            case PcbEditorMove.REGION_RESIZE:
                let posX = rawCursor.x;
                let posY = rawCursor.y;
                const offset = 1.5;

                if (_rawDragging) {
                    posX = _rawDragging.x;
                    posY = _rawDragging.y;
                }

                if (_resizeQuadrant & PcbEditorMove.BIT_MASK_LEFT)
                    if (_resizeQuadrant & PcbEditorMove.BIT_MASK_UP)
                        SPRITE_RESIZE.drawRotated(
                            posX * Scale.PIXELS_PER_POINT,
                            (posY + Math.sqrt(offset * offset + offset * offset)) * Scale.PIXELS_PER_POINT,
                            0.75 * Math.PI);
                    else if (_resizeQuadrant & PcbEditorMove.BIT_MASK_DOWN)
                        SPRITE_RESIZE.drawRotated(
                            (posX + Math.sqrt(offset * offset + offset * offset)) * Scale.PIXELS_PER_POINT,
                            posY * Scale.PIXELS_PER_POINT,
                            1.25 * Math.PI);
                    else
                        SPRITE_RESIZE.drawRotated(
                            (posX + offset) * Scale.PIXELS_PER_POINT,
                            (posY + offset) * Scale.PIXELS_PER_POINT,
                            Math.PI);
                else if (_resizeQuadrant & PcbEditorMove.BIT_MASK_RIGHT)
                    if (_resizeQuadrant & PcbEditorMove.BIT_MASK_UP)
                        SPRITE_RESIZE.drawRotated(
                            (posX - Math.sqrt(offset * offset + offset * offset)) * Scale.PIXELS_PER_POINT,
                            posY * Scale.PIXELS_PER_POINT,
                            0.25 * Math.PI);
                    else if (_resizeQuadrant & PcbEditorMove.BIT_MASK_DOWN)
                        SPRITE_RESIZE.drawRotated(
                            posX * Scale.PIXELS_PER_POINT,
                            (posY - Math.sqrt(offset * offset + offset * offset)) * Scale.PIXELS_PER_POINT,
                            1.75 * Math.PI);
                    else
                        SPRITE_RESIZE.drawRotated(
                            (posX - offset) * Scale.PIXELS_PER_POINT,
                            (posY - offset) * Scale.PIXELS_PER_POINT,
                            0);
                else if (_resizeQuadrant & PcbEditorMove.BIT_MASK_UP)
                    SPRITE_RESIZE.drawRotated(
                        (posX - offset) * Scale.PIXELS_PER_POINT,
                        (posY + offset) * Scale.PIXELS_PER_POINT,
                        0.5 * Math.PI);
                else
                    SPRITE_RESIZE.drawRotated(
                        (posX + offset) * Scale.PIXELS_PER_POINT,
                        (posY - offset) * Scale.PIXELS_PER_POINT,
                        1.5 * Math.PI);

                break;
        }
    };
}

PcbEditorMove.NOT_MOVABLE = 0;
PcbEditorMove.PCB_MOVE = 1;
PcbEditorMove.REGION_MOVE = 2;
PcbEditorMove.REGION_RESIZE = 3;

PcbEditorMove.BIT_MASK_LEFT = 0x01;
PcbEditorMove.BIT_MASK_RIGHT = 0x02;
PcbEditorMove.BIT_MASK_UP = 0x04;
PcbEditorMove.BIT_MASK_DOWN = 0x08;