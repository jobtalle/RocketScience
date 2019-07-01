import {Pcb} from "../../../pcb/pcb";
import {Scale} from "../../../world/scale";
import Myr from "myr.js"
import {getValidOrigin} from "../../../mission/editable/editableEscaper";
import {getValidRegion} from "../../../mission/editable/editableRegionShrinker";

/**
 * A move editor moves a PCB within its editable region.
 * @param {RenderContext} renderContext A render context.
 * @param {Pcb} pcb The PCB currently being edited.
 * @param {Myr.Vector} cursor The cursor position in cells.
 * @param {PcbEditor} editor A PCB editor.
 * @param {View} view The editor view.
 * @param {Boolean} hover Whether or not the cursor is hovering over the movable area.
 * @param {Boolean} isMissionEditor A boolean indicating whether the editor is in mission editor mode.
 * @constructor
 */
export function PcbEditorMove(renderContext, pcb, cursor, editor, view, hover, isMissionEditor) {
    const SPRITE_MOVE = renderContext.getSprites().getSprite("pcbMove");
    const SPRITE_RESIZE = renderContext.getSprites().getSprite("pcbAreaExtend");

    let _cursorInFrame = hover;
    let _mode = PcbEditorMove.NOT_MOVABLE;
    let _dragging = null;
    let _moveStart = new Myr.Vector(0, 0);
    let _resizeQuadrant = 0;

    /**
     * Set the flags in _resizeQuadrant. Stores in which quadrant of the editable region the mouse is.
     */
    const setResizeQuadrant = () => {
        _resizeQuadrant = 0;

        if (cursor.x * Scale.METERS_PER_POINT + editor.getEditable().getOffset().x < 0)
            _resizeQuadrant |= PcbEditorMove.BIT_MASK_LEFT;
        else if (cursor.x * Scale.METERS_PER_POINT + editor.getEditable().getOffset().x >= editor.getEditable().getRegion().getSize().x)
            _resizeQuadrant |= PcbEditorMove.BIT_MASK_RIGHT;

        if (cursor.y * Scale.METERS_PER_POINT + editor.getEditable().getOffset().y < 0)
            _resizeQuadrant |= PcbEditorMove.BIT_MASK_UP;
        else if (cursor.y * Scale.METERS_PER_POINT + editor.getEditable().getOffset().y >= editor.getEditable().getRegion().getSize().y)
            _resizeQuadrant |= PcbEditorMove.BIT_MASK_DOWN;
    };

    /**
     * Returns an iterator over editables that intersect the current editable.
     * @returns {IterableIterator<*>}
     */
    const intersectingEditables = function* () {
        for (const editable of editor.getEditor().getEditables()) {
            if (editable !== editor.getEditable() && editable.getRegion().intersectsRegion(editor.getEditable().getRegion()))
                yield editable;
        }
    };

    /**
     * Shrinks the editable region after a resize, if necessary. If an edge is selected, only resizes that edge.
     * If a corner is selected, any edge may be resized.
     */
    const shrinkEditableRegion = () => {
        if (_resizeQuadrant === PcbEditorMove.BIT_MASK_LEFT) {
            for (const editable of intersectingEditables()) {
                const dx = editable.getRegion().getOrigin().x + editable.getRegion().getSize().x - editor.getEditable().getRegion().getOrigin().x;
                editor.resizeRegionUpLeft(dx, 0);
            }
        } else if (_resizeQuadrant === PcbEditorMove.BIT_MASK_RIGHT) {
            for (const editable of intersectingEditables()) {
                const dx = editable.getRegion().getOrigin().x - (editor.getEditable().getRegion().getOrigin().x + editor.getEditable().getRegion().getSize().x);
                editor.resizeRegion(dx, 0);
            }
        } else if (_resizeQuadrant === PcbEditorMove.BIT_MASK_UP) {
            for (const editable of intersectingEditables()) {
                const dy = editable.getRegion().getOrigin().y + editable.getRegion().getSize().y - editor.getEditable().getRegion().getOrigin().y;
                editor.resizeRegionUpLeft(0, dy);
            }
        } else if (_resizeQuadrant === PcbEditorMove.BIT_MASK_DOWN) {
            for (const editable of intersectingEditables()) {
                const dy = editable.getRegion().getOrigin().y - (editor.getEditable().getRegion().getOrigin().y + editor.getEditable().getRegion().getSize().y);
                editor.resizeRegion(0, dy);
            }
        } else {
            const newRegion = getValidRegion(editor.getEditable(), editor.getEditor().getEditables());

            editor.resizeRegionUpLeft(newRegion.getOrigin().x - editor.getEditable().getRegion().getOrigin().x, 0);
            editor.resizeRegionUpLeft(0, newRegion.getOrigin().y - editor.getEditable().getRegion().getOrigin().y);
            editor.resizeRegion(newRegion.getSize().x - editor.getEditable().getRegion().getSize().x, 0);
            editor.resizeRegion(0, newRegion.getSize().y - editor.getEditable().getRegion().getSize().y);
        }
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
        if (!_dragging && _cursorInFrame) {
            if (pcb.getPoint(cursor.x, cursor.y) !== null)
                _mode = PcbEditorMove.PCB_MOVE;
            else if (isMissionEditor && editor.getEditable().getRegion().containsPoint(
                cursor.x * Scale.METERS_PER_POINT + editor.getEditable().getOffset().x + editor.getEditable().getRegion().getOrigin().x,
                cursor.y * Scale.METERS_PER_POINT + editor.getEditable().getOffset().y + editor.getEditable().getRegion().getOrigin().y,
                1))
                _mode = PcbEditorMove.REGION_MOVE;
            else if (isMissionEditor && editor.getEditable().getRegion().containsPoint(
                cursor.x * Scale.METERS_PER_POINT + editor.getEditable().getOffset().x + editor.getEditable().getRegion().getOrigin().x,
                cursor.y * Scale.METERS_PER_POINT + editor.getEditable().getOffset().y + editor.getEditable().getRegion().getOrigin().y,
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
            const dx = Math.round((x - _moveStart.x) * Scale.POINTS_PER_PIXEL / view.getZoom()) * Scale.METERS_PER_POINT;
            const dy = Math.round((y - _moveStart.y) * Scale.POINTS_PER_PIXEL / view.getZoom()) * Scale.METERS_PER_POINT;

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
                    _dragging.add(delta);

                    break;
            }

            if (dx !== 0)
                _moveStart.x = Math.round(x * Scale.POINTS_PER_PIXEL / view.getZoom()) * Scale.PIXELS_PER_POINT * view.getZoom();
            if (dy !== 0)
                _moveStart.y = Math.round(y * Scale.POINTS_PER_PIXEL / view.getZoom()) * Scale.PIXELS_PER_POINT * view.getZoom();
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

            _moveStart.x = Math.round(x * Scale.POINTS_PER_PIXEL / view.getZoom()) * Scale.PIXELS_PER_POINT * view.getZoom();
            _moveStart.y = Math.round(y * Scale.POINTS_PER_PIXEL / view.getZoom()) * Scale.PIXELS_PER_POINT * view.getZoom();
            _dragging = cursor.copy();

            return true;
        }

        return false;
    };

    /**
     * Finish the current dragging action.
     */
    this.mouseUp = () => {
        if (_mode === PcbEditorMove.REGION_MOVE) {
            const newOrigin = getValidOrigin(editor.getEditable(), editor.getEditor().getEditables());
            editor.moveRegion(newOrigin.x - editor.getEditable().getRegion().getOrigin().x, newOrigin.y - editor.getEditable().getRegion().getOrigin().y);
        } else if (_mode === PcbEditorMove.REGION_RESIZE) {
            shrinkEditableRegion();
        }
        _dragging = null;

        editor.getEditable().roundCoordinatesToGrid();
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
        _cursorInFrame = true;
    };

    /**
     * The mouse leaves.
     */
    this.onMouseLeave = () => {
        this.mouseUp();
        _mode = PcbEditorMove.NOT_MOVABLE;
        _cursorInFrame = false;
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
            case PcbEditorMove.REGION_MOVE:
                if (_dragging)
                    SPRITE_MOVE.draw(
                        (_dragging.x - 1) * Scale.PIXELS_PER_POINT,
                        (_dragging.y - 1) * Scale.PIXELS_PER_POINT);
                else
                    SPRITE_MOVE.draw(
                        (cursor.x - 1) * Scale.PIXELS_PER_POINT,
                        (cursor.y - 1) * Scale.PIXELS_PER_POINT);

                break;
            case PcbEditorMove.REGION_RESIZE:
                let posX = cursor.x;
                let posY = cursor.y;

                if (_dragging) {
                    posX = _dragging.x;
                    posY = _dragging.y;
                }

                if (_resizeQuadrant & PcbEditorMove.BIT_MASK_LEFT) {
                    if (_resizeQuadrant & PcbEditorMove.BIT_MASK_UP)
                        SPRITE_RESIZE.setFrame(3);
                    else if (_resizeQuadrant & PcbEditorMove.BIT_MASK_DOWN)
                        SPRITE_RESIZE.setFrame(5);
                    else
                        SPRITE_RESIZE.setFrame(4);
                } else if (_resizeQuadrant & PcbEditorMove.BIT_MASK_RIGHT) {
                    if (_resizeQuadrant & PcbEditorMove.BIT_MASK_UP)
                        SPRITE_RESIZE.setFrame(1);
                    else if (_resizeQuadrant & PcbEditorMove.BIT_MASK_DOWN)
                        SPRITE_RESIZE.setFrame(7);
                    else
                        SPRITE_RESIZE.setFrame(0);
                } else if (_resizeQuadrant & PcbEditorMove.BIT_MASK_UP)
                        SPRITE_RESIZE.setFrame(2);
                else
                    SPRITE_RESIZE.setFrame(6);

                SPRITE_RESIZE.draw((posX - 1) * Scale.PIXELS_PER_POINT, (posY - 1) * Scale.PIXELS_PER_POINT);

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
