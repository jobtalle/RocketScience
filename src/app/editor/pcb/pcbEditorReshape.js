import * as Myr from "../../../lib/myr";
import {Pcb} from "../../pcb/pcb";
import {PointGroup} from "./pointGroup";

/**
 * A reshape editor used for extending or deleting portions of a PCB.
 * @param {Sprites} sprites A sprites instance.
 * @param {Pcb} pcb The PCB currently being edited.
 * @param {Myr.Vector} cursor The cursor position in cells.
 * @param {Object} editor An interface provided by the Editor to influence the editor.
 * @constructor
 */
export function PcbEditorReshape(sprites, pcb, cursor, editor) {
    const SPRITE_EXTEND = sprites.getSprite("pcbExtend");
    const SPRITE_DELETE = sprites.getSprite("pcbDelete");

    const _cursorDragPoints = [];
    const _cursorDrag = new Myr.Vector(0, 0);
    let _dragging = false;
    let _extendable = false;
    let _deletable = false;

    const erase = () => {
        if (_cursorDragPoints.length === pcb.getPointCount())
            return;

        editor.undoPush();

        for (const point of _cursorDragPoints)
            pcb.erase(point.x, point.y);

        const packReport = pcb.pack();

        editor.shift(packReport.left * Pcb.PIXELS_PER_POINT, packReport.top * Pcb.PIXELS_PER_POINT);
        editor.revalidate();
    };

    const dragPreventSplit = (left, top, right, bottom) => {
        if (_cursorDragPoints.length === pcb.getPointCount()) {
            _cursorDragPoints.splice(0, _cursorDragPoints.length);

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
                    _cursorDragPoints.push(groups[group].points[i]);
            }
        }
    };

    const extend = () => {
        editor.undoPush();

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

        editor.shift(xMin * Pcb.PIXELS_PER_POINT, yMin * Pcb.PIXELS_PER_POINT);
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
        if (_dragging) {
            const left = Math.min(cursor.x, _cursorDrag.x);
            const right = Math.max(cursor.x, _cursorDrag.x);
            const top = Math.min(cursor.y, _cursorDrag.y);
            const bottom = Math.max(cursor.y, _cursorDrag.y);

            _cursorDragPoints.splice(0, _cursorDragPoints.length);

            if (_extendable) {
                for (let y = top; y <= bottom; ++y) for (let x = left; x <= right; ++x)
                    if (pcb.isExtendable(x, y))
                        _cursorDragPoints.push(new Myr.Vector(x, y));
            }
            else {
                for (let y = top; y <= bottom; ++y) for (let x = left; x <= right; ++x)
                    if (pcb.getPoint(x, y))
                        _cursorDragPoints.push(new Myr.Vector(x, y));

                dragPreventSplit(left, top, right, bottom);
            }
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

            _extendable = _deletable = false;
            _dragging = false;
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
        _dragging = false;

        this.moveCursor();
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
     * Draw this editor.
     */
    this.draw = () => {
        if (_dragging) {
            if (_extendable) {
                for (const cell of _cursorDragPoints)
                    SPRITE_EXTEND.draw(cell.x * Pcb.PIXELS_PER_POINT, cell.y * Pcb.PIXELS_PER_POINT);
            }
            else {
                for (const cell of _cursorDragPoints)
                    SPRITE_DELETE.draw(cell.x * Pcb.PIXELS_PER_POINT, cell.y * Pcb.PIXELS_PER_POINT);
            }
        }
        else if (_extendable)
            SPRITE_EXTEND.draw(cursor.x * Pcb.PIXELS_PER_POINT, cursor.y * Pcb.PIXELS_PER_POINT);
        else if (_deletable)
            SPRITE_DELETE.draw(cursor.x * Pcb.PIXELS_PER_POINT, cursor.y * Pcb.PIXELS_PER_POINT);
    };
}