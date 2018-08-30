import {Pcb} from "../../pcb/pcb";
import {PcbPointRenderer} from "../../pcb/point/pcbPointRenderer";
import {PcbPoint} from "../../pcb/point/pcbPoint";
import * as Myr from "../../../lib/myr";
import {PcbPath} from "../../pcb/point/pcbPath";
import {PcbPathRenderer} from "../../pcb/point/pcbPathRenderer";

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
    let _deleting = false;

    const setModeDeletePath = () => {
        const routePath = new PcbPath();

        routePath.fromRoute(pcb, _pathEtch.getStart(), _pathEtch.getEnd());

        if (routePath.isValid()) {
            _pathEtch = routePath;

            return PcbEditorEtch.SELECT_TYPE_DELETE;
        }

        return setModeExtend();
    };

    const setModeExtend = () => {
        let resultingConnectedOutputs = 0;
        const connectedPaths = [];

        _pathEtch.forPoints((x, y, point) => {
            if (!point.hasPaths()) {
                if (point.isOutput()) if (++resultingConnectedOutputs > 1)
                    return false;

                return true;
            }

            let unique = true;

            for (const path of connectedPaths) if (path.containsPosition(x, y)) {
                unique = false;

                break;
            }

            if (unique) {
                const path = new PcbPath();

                path.fromPcb(pcb, new Myr.Vector(x, y));

                resultingConnectedOutputs += path.countOutputs();
                if (resultingConnectedOutputs > 1)
                    return false;

                connectedPaths.push(path);
            }

            return true;
        });

        if (resultingConnectedOutputs > 1)
            return PcbEditorEtch.SELECT_TYPE_INVALID;

        return PcbEditorEtch.SELECT_TYPE_ETCH;
    };

    const setModeDrag = () => {
        let overlapped = null;
        let length = 0;

        _pathEtch.forPoints((x, y, point) => {
            const overlaps = overlapped===true?
                pcb.getPoint(x, y).pathEquals(point):
                pcb.getPoint(x, y).pathOverlaps(point);

            ++length;

            if (overlapped !== null && overlapped !== overlaps)
                return false;

            overlapped = overlaps;

            return true;
        });

        _pathEtch.trim(length);

        if (overlapped) {
            _deleting = true;

            return PcbEditorEtch.SELECT_TYPE_DELETE;
        }

        return setModeExtend();
    };

    const determineMode = () => {
        if (_deleting &&
            pcb.getPoint(_pathEtch.getStart().x, _pathEtch.getStart().y).hasPaths() &&
            pcb.getPoint(_pathEtch.getEnd().x, _pathEtch.getEnd().y).hasPaths())
            return setModeDeletePath();

        return setModeDrag();
    };

    const setRenderMode = selectMode => {
        switch (selectMode) {
            case PcbEditorEtch.SELECT_TYPE_DELETE:
                _pointRenderer.setMode(PcbPointRenderer.MODE_DELETE);
                break;
            case PcbEditorEtch.SELECT_TYPE_ETCH:
                _pointRenderer.setMode(PcbPointRenderer.MODE_SELECT);
                break;
            case PcbEditorEtch.SELECT_TYPE_INVALID:
                _pointRenderer.setMode(PcbPointRenderer.MODE_INVALID);
                break;
        }
    };

    const makePath = (start, end) => {
        const path = new PcbPath();
        const at = start.copy();

        path.push(at.x, at.y, new PcbPoint(), false);

        while (!at.equals(end)) {
            const dx = Math.sign(end.x - at.x);
            const dy = Math.sign(end.y - at.y);

            at.x += dx;
            at.y += dy;

            if (!pcb.getPoint(at.x, at.y))
                return null;

            path.push(at.x, at.y, new PcbPoint(), true);
        }

        if (!path.isValid())
            return null;

        return path;
    };

    const etchPath = path => {
        path.forPoints((x, y, point) => {
            pcb.getPoint(x, y).flatten(point);

            return true;
        });
    };

    const deletePath = path => {
        path.forPoints((x, y, point) => {
            pcb.getPoint(x, y).erase(point);

            return true;
        });
    };

    const applyPath = () => {
        editor.undoPush();

        switch (_selectMode) {
            case PcbEditorEtch.SELECT_TYPE_ETCH:
                etchPath(_pathEtch);

                break;
            case PcbEditorEtch.SELECT_TYPE_DELETE:
                deletePath(_pathEtch);

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
        switch (key) {
            case PcbEditorEtch.KEY_DELETE:
                if (_pathSelected) {
                    editor.undoPush();

                    deletePath(_pathSelected);

                    editor.revalidate();

                    _pathSelected = null;
                }

                break;
        }
    };

    /**
     * Tell the editor the cursor has moved.
     */
    this.moveCursor = () => {
        const point = pcb.getPoint(cursor.x, cursor.y);

        if (_dragging) {
            if (point) {
                _pathEtch = makePath(_startPoint, cursor);

                if (_pathEtch) {
                    _selectMode = determineMode();

                    setRenderMode(_selectMode);
                }
            }
            else
                _pathEtch = null;
        }
        else {
            _etchable = point !== null;

            if (_etchable && point.hasPaths()) {
                _pathSelected = new PcbPath();
                _pathSelected.fromPcb(pcb, cursor);

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
            _deleting = false;

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
                applyPath();

            this.moveCursor();
        }
    };

    /**
     * Zoom in.
     * @returns {Boolean} A boolean indicating whether this editor handled the action.
     */
    this.zoomIn = () => false;

    /**
     * Zoom out.
     * @returns {Boolean} A boolean indicating whether this editor handled the action.
     */
    this.zoomOut = () => false;

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

PcbEditorEtch.KEY_DELETE = "Delete";
PcbEditorEtch.SELECT_TYPE_ETCH = 0;
PcbEditorEtch.SELECT_TYPE_DELETE = 1;
PcbEditorEtch.SELECT_TYPE_INVALID = 2;