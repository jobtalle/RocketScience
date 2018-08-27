import {Pcb} from "../../pcb/pcb";
import {PcbPointRenderer} from "../../pcb/pcbPointRenderer";
import {PcbPoint} from "../../pcb/pcbPoint";
import * as Myr from "../../../lib/myr";
import {PcbPath} from "../../pcb/pcbPath";
import {PcbPathRenderer} from "../../pcb/pcbPathRenderer";

/**
 * The etch editor, meant for etching connections onto the PCB.
 * @param {Sprites} sprites A sprites instance.
 * @param {Pcb} pcb The PCB currently being edited.
 * @param {Myr.Vector} cursor The cursor position in cells.
 * @param {Object} editor An interface provided by the Editor to influence the editor.
 * @constructor
 */
export function PcbEditorEtch(sprites, pcb, cursor, editor) {
    const SPRITE_ETCH = sprites.getSprite("pcbEtch");
    const SPRITE_ETCH_HOVER = sprites.getSprite("pcbEtchHover");

    const _pointRenderer = new PcbPointRenderer(sprites, true, PcbPointRenderer.MODE_SELECT);
    const _pathRenderer = new PcbPathRenderer(_pointRenderer);

    let _selectMode = null;
    let _pathEtch = null;
    let _pathSelected = null;
    let _startPoint = null;
    let _dragging = false;
    let _etchable = false;

    const getSelectionType = path => {
        let overlapped = null;

        if (!path.forPoints((x, y, point) => {
            const overlaps = pcb.getPoint(x, y).overlaps(point);

            if (overlapped !== null && overlapped !== overlaps)
                return false;

            overlapped = overlaps;

            return true;
        }))
            return PcbEditorEtch.SELECT_TYPE_INVALID;

        return overlapped?PcbEditorEtch.SELECT_TYPE_DELETE:PcbEditorEtch.SELECT_TYPE_ETCH;
    };

    const setRenderMode = selectMode => {
        switch (selectMode) {
            case PcbEditorEtch.SELECT_TYPE_DELETE:
                _pointRenderer.setMode(PcbPointRenderer.MODE_DELETE);
                break;
            case PcbEditorEtch.SELECT_TYPE_ETCH:
                _pointRenderer.setMode(PcbPointRenderer.MODE_SELECT);
                break;
        }
    };

    const makePath = () => {
        const at = _startPoint.copy();
        let previousPoint = null;
        let point = new PcbPoint();

        _pathEtch = new PcbPath();
        _pathEtch.push(at.x, at.y, point);

        while (!at.equals(cursor)) {
            const dx = Math.sign(cursor.x - at.x);
            const dy = Math.sign(cursor.y - at.y);

            at.x += dx;
            at.y += dy;

            previousPoint = point;
            point = new PcbPoint();

            const direction = PcbPoint.deltaToDirection(dx, dy);
            previousPoint.etchDirection(direction);
            point.etchDirection((direction + 4) % 8);

            if (!pcb.getPoint(at.x, at.y)) {
                _pathEtch = null;

                break;
            }

            _pathEtch.push(at.x, at.y, point);
        }

        if (_pathEtch && !_pathEtch.isValid())
            _pathEtch = null;

        if (_pathEtch) {
            _selectMode = getSelectionType(_pathEtch);

            if (_selectMode === PcbEditorEtch.SELECT_TYPE_INVALID)
                _pathEtch = null;
            else
                setRenderMode(_selectMode);
        }
    };

    const etch = () => {
        editor.undoPush();

        switch (_selectMode) {
            case PcbEditorEtch.SELECT_TYPE_ETCH:
                _pathEtch.forPoints((x, y, point) => {
                    pcb.getPoint(x, y).flatten(point);

                    return true;
                });

                break;
            case PcbEditorEtch.SELECT_TYPE_DELETE:
                _pathEtch.forPoints((x, y, point) => {
                    pcb.getPoint(x, y).erase(point);

                    return true;
                });

                break;
        }

        _pathEtch = null;

        editor.revalidate();

        this.moveCursor();
    };

    /**
     * Change the PCB being edited.
     * @param {Pcb} newPcb The new PCB to edit.
     */
    this.updatePcb = newPcb => {
        pcb = newPcb;
    };

    /**
     * A key is pressed.
     * @param {String} key A key.
     * @param {Boolean} control Indicates whether the control button is pressed.
     */
    this.onKeyDown = (key, control) => {

    };

    /**
     * Tell the editor the cursor has moved.
     */
    this.moveCursor = () => {
        const point = pcb.getPoint(cursor.x, cursor.y);

        if (_dragging) {
            _pathEtch = null;

            if (point)
                makePath();
        }
        else {
            _etchable = point !== null;

            if (_etchable && point.hasPaths()) {
                _pathSelected = new PcbPath();
                _pathSelected.fromPcb(pcb, cursor.x, cursor.y);

                _pointRenderer.setMode(PcbPointRenderer.MODE_SELECT);
            }
            else
                _pathSelected = null;
        }
    };

    /**
     * Start dragging action.
     * @returns {Boolean} A boolean indicating whether a drag event has started.
     */
    this.mouseDown = () => {
        if (_etchable) {
            _dragging = true;
            _pathSelected = null;
            _startPoint = cursor.copy();

            return true;
        }

        return false;
    };

    /**
     * Finish the current dragging action.
     */
    this.mouseUp = () => {
        if (_dragging) {
            _dragging = false;

            if (_pathEtch)
                etch();
        }
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
        if (_dragging)
            SPRITE_ETCH.animate(timeStep);
    };

    /**
     * Draw this editor.
     * @param {Myr} myr A myriad instance.
     */
    this.draw = myr => {
        if (_dragging) {
            if (_pathEtch)
                _pathRenderer.render(myr, _pathEtch);

            SPRITE_ETCH.draw(_startPoint.x * Pcb.PIXELS_PER_POINT, (_startPoint.y - 1) * Pcb.PIXELS_PER_POINT);
        } else if (_etchable) {
            if (_pathSelected)
                _pathRenderer.render(myr, _pathSelected);

            SPRITE_ETCH_HOVER.draw(cursor.x * Pcb.PIXELS_PER_POINT, (cursor.y - 1) * Pcb.PIXELS_PER_POINT);
        }
    };
}

PcbEditorEtch.SELECT_TYPE_ETCH = 0;
PcbEditorEtch.SELECT_TYPE_DELETE = 1;
PcbEditorEtch.SELECT_TYPE_INVALID = 2;