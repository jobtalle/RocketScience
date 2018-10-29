import * as Myr from "../../../../lib/myr";
import {Pcb} from "../../../pcb/pcb";
import {PointGroup} from "./pointGroup";
import {OverlayRulerDefinition} from "../overlay/rulers/overlayRulerDefinition";
import {Scale} from "../../../world/scale";

/**
 * A reshape editor used for extending or deleting portions of a PCB.
 * @param {RenderContext} renderContext A render context.
 * @param {Pcb} pcb The PCB currently being edited.
 * @param {Myr.Vector} cursor The cursor position in cells.
 * @param {PcbEditor} editor A PCB editor.
 * @constructor
 */
export function PcbEditorReshape(renderContext, pcb, cursor, editor) {
    const SPRITE_EXTEND = renderContext.getSprites().getSprite("pcbExtend");
    const SPRITE_DELETE = renderContext.getSprites().getSprite("pcbDelete");
    
    const _cursorDragPoints = [];
    const _cursorDrag = new Myr.Vector(0, 0);

    let _dragPointsLeft = null;
    let _dragPointsTop;
    let _dragPointsRight;
    let _dragPointsBottom;
    let _dragging = false;
    let _extendable = false;
    let _deletable = false;

    const dragPointsClear = () => {
        _cursorDragPoints.splice(0, _cursorDragPoints.length);

        _dragPointsLeft = null;
    };

    const dragPointsAdd = point => {
        _cursorDragPoints.push(point);

        if (_dragPointsLeft === null) {
            _dragPointsLeft = _dragPointsRight = point.x;
            _dragPointsTop = _dragPointsBottom = point.y;
        }
        else {
            if (point.x < _dragPointsLeft)
                _dragPointsLeft = point.x;
            else if (point.x > _dragPointsRight)
                _dragPointsRight = point.x;

            if (point.y < _dragPointsTop)
                _dragPointsTop = point.y;
            else if (point.y > _dragPointsBottom)
                _dragPointsBottom = point.y;
        }
    };

    const erase = () => {
        editor.getEditable().undoPush();

        for (const point of _cursorDragPoints)
            pcb.erase(point.x, point.y);

        const packReport = pcb.pack();

        editor.moveOffset(
            packReport.left * Pcb.METERS_PER_POINT,
            packReport.top * Pcb.METERS_PER_POINT);
        editor.revalidate();
    };

    const dragPreventSplit = (left, top, right, bottom) => {
        if (_cursorDragPoints.length === pcb.getPointCount()) {
            dragPointsClear();

            return;
        }

        const groups = [];

        for (let y = 0; y < pcb.getHeight(); ++y) for (let x = 0; x < pcb.getWidth(); ++x) {
            if (x >= left && x <= right && y >= top && y <= bottom)
                continue;

            if (!pcb.getPoint(x, y))
                continue;

            const point = new Myr.Vector(x, y);
            const matches = [];

            for (let group = 0; group < groups.length; ++group) {
                if (groups[group].contains(point))
                    matches.push(group);
            }

            switch (matches.length) {
                case 0:
                    groups.push(new PointGroup(point));
                    break;
                default:
                    matches.sort();

                    for (let i = matches.length; i-- > 1;) {
                        groups[matches[0]].concat(groups[matches[i]]);
                        groups.splice(matches[i], 1);
                    }
                case 1:
                    groups[matches[0]].push(point);
                    break;
            }
        }

        if (groups.length > 1) {
            let largestGroupSize = 0;
            let largestGroup;

            for (let group = 0; group < groups.length; ++group) {
                if (groups[group].points.length > largestGroupSize) {
                    largestGroupSize = groups[group].points.length;
                    largestGroup = group;
                }
            }

            for (let group = 0; group < groups.length; ++group) {
                if (group === largestGroup)
                    continue;

                for (let i = 0; i < groups[group].points.length; ++i)
                    dragPointsAdd(groups[group].points[i]);
            }
        }
    };

    const extend = () => {
        editor.getEditable().undoPush();

        const negatives = [];

        let xMin = 0;
        let yMin = 0;
        let yMax = pcb.getHeight() - 1;

        for (const cell of _cursorDragPoints) {
            if (cell.x < 0 || cell.y < 0) {
                if (cell.x < xMin)
                    xMin = cell.x;

                if (cell.y < yMin)
                    yMin = cell.y;

                negatives.push(cell);
            }
            else {
                if (cell.y > yMax)
                    yMax = cell.y;

                pcb.extend(cell.x, cell.y);
            }
        }

        editor.moveOffset(
            xMin * Pcb.METERS_PER_POINT,
            yMin * Pcb.METERS_PER_POINT);
        pcb.shift(-xMin, -yMin);

        for (const cell of negatives)
            pcb.extend(cell.x - xMin, cell.y - yMin);

        editor.revalidate();
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

    };

    /**
     * Tell the editor the cursor has moved.
     */
    this.moveCursor = () => {
        if (_dragging) {
            const left = Math.min(cursor.x, _cursorDrag.x);
            const right = Math.max(cursor.x, _cursorDrag.x);
            const top = Math.min(cursor.y, _cursorDrag.y);
            const bottom = Math.max(cursor.y, _cursorDrag.y);

            dragPointsClear();

            if (_extendable) {
                for (let y = top; y <= bottom; ++y) for (let x = left; x <= right; ++x)
                    if (pcb.isExtendable(x, y))
                        dragPointsAdd(new Myr.Vector(x, y));
            }
            else {
                for (let y = top; y <= bottom; ++y) for (let x = left; x <= right; ++x)
                    if (pcb.getPoint(x, y))
                        dragPointsAdd(new Myr.Vector(x, y));

                dragPreventSplit(left, top, right, bottom);
            }

            editor.getEditor().getOverlay().makeRulers([
                new OverlayRulerDefinition(
                    _dragPointsLeft,
                    _dragPointsBottom + 1,
                    OverlayRulerDefinition.DIRECTION_RIGHT,
                    _dragPointsRight - _dragPointsLeft + 1),
                new OverlayRulerDefinition(
                    _dragPointsRight + 1,
                    _dragPointsBottom + 1,
                    OverlayRulerDefinition.DIRECTION_UP,
                    _dragPointsBottom - _dragPointsTop + 1)
            ]);
        }
        else {
            _extendable =
                pcb.isExtendable(cursor.x, cursor.y) && (
                pcb.getPoint(cursor.x + 1, cursor.y) ||
                pcb.getPoint(cursor.x, cursor.y + 1) ||
                pcb.getPoint(cursor.x - 1, cursor.y) ||
                pcb.getPoint(cursor.x, cursor.y - 1));

            if (_extendable)
                _deletable = false;
            else
                _deletable = pcb.getPoint(cursor.x, cursor.y) !== null;
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
        if (_extendable || _deletable) {
            _cursorDrag.x = cursor.x;
            _cursorDrag.y = cursor.y;
            _dragging = true;

            this.moveCursor();

            return true;
        }

        return false;
    };

    /**
     * Finish the current dragging action.
     */
    this.mouseUp = () => {
        if (_dragging) {
            if (_extendable)
                extend();
            else
                erase();

            editor.getEditor().getOverlay().clearRulers();

            _extendable = _deletable = false;
            _dragging = false;

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
        _dragging = false;

        editor.getEditor().getOverlay().clearRulers();
    };

    /**
     * Reset the editor's current state.
     */
    this.reset = () => {
        this.cancelAction();
    };

    /**
     * Update this editor.
     * @param {Number} timeStep The time passed since the last update in seconds.
     */
    this.update = timeStep => {
        if (_deletable)
            SPRITE_DELETE.animate(timeStep);
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
            if (_extendable) {
                for (const cell of _cursorDragPoints)
                    SPRITE_EXTEND.draw(cell.x * Scale.PIXELS_PER_POINT, cell.y * Scale.PIXELS_PER_POINT);
            }
            else {
                for (const cell of _cursorDragPoints)
                    SPRITE_DELETE.draw(cell.x * Scale.PIXELS_PER_POINT, cell.y * Scale.PIXELS_PER_POINT);
            }
        }
        else if (_extendable)
            SPRITE_EXTEND.draw(cursor.x * Scale.PIXELS_PER_POINT, cursor.y * Scale.PIXELS_PER_POINT);
        else if (_deletable)
            SPRITE_DELETE.draw(cursor.x * Scale.PIXELS_PER_POINT, cursor.y * Scale.PIXELS_PER_POINT);
    };
}