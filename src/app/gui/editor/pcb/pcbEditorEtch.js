import {Pcb} from "../../../pcb/pcb";
import {PcbPointRenderer} from "../../../pcb/point/pcbPointRenderer";
import {PcbPoint} from "../../../pcb/point/pcbPoint";
import {PcbPath} from "../../../pcb/point/pcbPath";
import {PcbPathRenderer} from "../../../pcb/point/pcbPathRenderer";
import {Pin} from "../../../part/pin";
import {Scale} from "../../../world/scale";
import * as Myr from "../../../../lib/myr";

/**
 * The etch editor, meant for etching connections onto the PCB.
 * @param {RenderContext} renderContext A render context.
 * @param {Pcb} pcb The PCB currently being edited.
 * @param {Myr.Vector} cursor The cursor position in cells.
 * @param {PcbEditor} editor A PCB editor.
 * @constructor
 */
export function PcbEditorEtch(renderContext, pcb, cursor, editor) {
    const SPRITE_ETCH = renderContext.getSprites().getSprite("pcbEtch");

    const _pointRenderer = new PcbPointRenderer(renderContext, true, PcbPointRenderer.COLOR_SELECT);
    const _pathRenderer = new PcbPathRenderer(_pointRenderer);

    let _fixture = null;
    let _selectMode = null;
    let _pathEtch = null;
    let _pathSelected = null;
    let _startPoint = null;
    let _dragging = false;
    let _etchable = false;
    let _deleting = false;
    let _showingLabel = false;

    const setFixture = fixture => {
        if (fixture === _fixture && fixture === null)
            return;

        _fixture = fixture;

        if (fixture) {
            const index = fixture.part.getPinIndexAt(cursor.x - fixture.x, cursor.y - fixture.y);

            if (fixture.part.getConfiguration().io[index].type !== Pin.TYPE_STRUCTURAL) {
                editor.getEditor().getInfo().setPinoutsSelected(fixture.part.getConfiguration(), fixture.x, fixture.y, index);

                _showingLabel = true;
            }
            else {
                editor.getEditor().getInfo().setPinoutsSelected(null);

                _showingLabel = false;
            }
        }
        else {
            editor.getEditor().getInfo().setPinoutsSelected(null);

            _showingLabel = false;
        }
    };

    const setModeDeletePath = (start, end, etchPathValid) => {
        const routePath = new PcbPath();

        routePath.fromRoute(pcb, start, end);

        if (routePath.isValid()) {
            _pathEtch = routePath;

            return PcbEditorEtch.SELECT_TYPE_DELETE;
        }

        if (etchPathValid)
            return setModeExtend();
        else
            return PcbEditorEtch.SELECT_TYPE_ETCH;
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
        if (!_pathEtch)
            return PcbEditorEtch.SELECT_TYPE_ETCH;

        let overlapped = null;
        let length = 0;

        _pathEtch.forPoints((x, y, point) => {
            const overlaps = overlapped?
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
        if (_deleting) {
            if (_pathEtch) {
                if (pcb.getPoint(_pathEtch.getStart().x, _pathEtch.getStart().y).hasPaths() &&
                    pcb.getPoint(_pathEtch.getEnd().x, _pathEtch.getEnd().y).hasPaths())
                    return setModeDeletePath(_pathEtch.getStart(), _pathEtch.getEnd(), true);
            }
            else {
                if (pcb.getPoint(_startPoint.x, _startPoint.y) &&
                    pcb.getPoint(cursor.x, cursor.y))
                    return setModeDeletePath(_startPoint, cursor, false);
            }
        }

        return setModeDrag();
    };

    const setRenderMode = selectMode => {
        switch (selectMode) {
            case PcbEditorEtch.SELECT_TYPE_DELETE:
                _pointRenderer.setColor(PcbPointRenderer.COLOR_DELETE);

                break;
            case PcbEditorEtch.SELECT_TYPE_ETCH:
                _pointRenderer.setColor(PcbPointRenderer.COLOR_SELECT);

                break;
            case PcbEditorEtch.SELECT_TYPE_INVALID:
                _pointRenderer.setColor(PcbPointRenderer.COLOR_INVALID);

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

            if (dx !== 0 && dy !== 0 && !(pcb.getPoint(at.x - dx, at.y) && pcb.getPoint(at.x, at.y - dy)))
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
            pcb.getPoint(x, y).erasePaths(point);

            return true;
        });
    };

    const applyPath = () => {
        editor.getEditable().undoPush();

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

    const setPointRenderColorFromPath = path => {
        const pinLocation = new Myr.Vector(0, 0);

        let color = PcbPointRenderer.COLOR_SELECT;
        let fixture = null;
        let ioIndex = -1;

        path.forPoints((x, y, point) => {
            if (!point.part)
                return true;

            fixture = pcb.getFixture(point.part);
            pinLocation.x = x;
            pinLocation.y = y;
            ioIndex = point.part.getPinIndexAt(x - fixture.x, y - fixture.y);

            if (ioIndex !== -1) {
                const io = point.part.getConfiguration().io[ioIndex];

                if (io.type === Pin.TYPE_OUT) {
                    color = Pin.getPinColor(io);

                    return false;
                }
            }

            return true;
        });

        _pointRenderer.setColor(color);

        if (!_showingLabel) {
            if (color !== PcbPointRenderer.COLOR_SELECT && ioIndex !== -1)
                editor.getEditor().getInfo().setPinoutsSelected(
                    fixture.part.getConfiguration(),
                    fixture.x,
                    fixture.y,
                    ioIndex,
                    path.getOutwardVector(pinLocation));
            else
                editor.getEditor().getInfo().setPinoutsSelected(null);
        }
    };

    /**
     * Change the PCB being edited.
     * @param {Pcb} newPcb The new PCB to edit.
     */
    this.updatePcb = newPcb => {
        pcb = newPcb;
    };

    /**
     * A key event has been fired.
     * @param {KeyEvent} event A key event.
     */
    this.onKeyEvent = event => {
        if (event.down) {
            switch (event.key) {
                case PcbEditorEtch.KEY_DELETE:
                    if (_pathSelected) {
                        editor.getEditable().undoPush();

                        deletePath(_pathSelected);

                        editor.revalidate();

                        _pathSelected = null;
                    }

                    break;
            }
        }
    };

    /**
     * Tell the editor the cursor has moved.
     */
    this.moveCursor = () => {
        const point = pcb.getPoint(cursor.x, cursor.y);

        if (_dragging) {
            setFixture(null);

            if (point) {
                _pathEtch = makePath(_startPoint, cursor);
                _selectMode = determineMode();

                setRenderMode(_selectMode);
            }
            else
                _pathEtch = null;
        }
        else {
            _etchable = point !== null;

            if (point && point.isConnected())
                setFixture(pcb.getFixture(point.part));
            else
                setFixture(null);

            if (_etchable && point.hasPaths()) {
                _pathSelected = new PcbPath();
                _pathSelected.fromPcb(pcb, cursor);

                setPointRenderColorFromPath(_pathSelected);
            }
            else if (_pathSelected) {
                if (!_showingLabel)
                    editor.getEditor().getInfo().setPinoutsSelected(null);

                _pathSelected = null;
            }
        }
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
     * The mouse enters.
     */
    this.onMouseEnter = () => {

    };

    /**
     * The mouse leaves.
     */
    this.onMouseLeave = () => {
        this.cancelAction();
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
        if (_dragging) {
            if (_pathEtch)
                _pathRenderer.render(renderContext.getMyr(), _pathEtch);

            if (_startPoint.equals(cursor))
                SPRITE_ETCH.draw(_startPoint.x * Scale.PIXELS_PER_POINT, _startPoint.y * Scale.PIXELS_PER_POINT);
        } else if (_etchable) {
            if (_pathSelected)
                _pathRenderer.render(renderContext.getMyr(), _pathSelected);

            SPRITE_ETCH.draw(cursor.x * Scale.PIXELS_PER_POINT, cursor.y * Scale.PIXELS_PER_POINT);
        }
    };
}

PcbEditorEtch.KEY_DELETE = "Delete";
PcbEditorEtch.SELECT_TYPE_ETCH = 0;
PcbEditorEtch.SELECT_TYPE_DELETE = 1;
PcbEditorEtch.SELECT_TYPE_INVALID = 2;