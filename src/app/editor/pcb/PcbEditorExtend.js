import * as Myr from "../../../lib/myr";
import {Pcb} from "../../pcb/pcb";
import {PcbEditorDelete} from "./PcbEditorDelete";

/**
 * An extend editor, able to extend the current PCB.
 * @param {Sprites} sprites A sprites instance.
 * @param {Pcb} pcb The PCB currently being edited.
 * @param {Myr.Vector} cursor The cursor position in cells.
 * @param {Object} editor An interface provided by the Editor to influence the editor.
 * @constructor
 */
export function PcbEditorExtend(sprites, pcb, cursor, editor) {
    const KEY_TOGGLE_DELETE = "Delete";
    const SPRITE_HOVER_EXTEND = sprites.getSprite("pcbExtend");

    const _cursorDragCells = [];
    const _cursorDrag = new Myr.Vector(0, 0);
    let _dragging = false;
    let _extendable = false;

    const extend = () => {
        editor.undoPush();

        const negatives = [];

        let xMin = 0;
        let yMin = 0;
        let yMax = pcb.getHeight() - 1;

        for (const cell of _cursorDragCells) {
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
     * A key is pressed.
     * @param {String} key A key.
     * @param {Boolean} control Indicates whether the control button is pressed.
     */
    this.onKeyDown = (key, control) => {
        switch (key) {
            case KEY_TOGGLE_DELETE:
                editor.replace(new PcbEditorDelete(sprites, pcb, cursor, editor));
                break;
        }
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

            _cursorDragCells.splice(0, _cursorDragCells.length);

            for (let y = top; y <= bottom; ++y)
                for (let x = left; x <= right; ++x)
                    if (!pcb.getPoint(x, y))
                        _cursorDragCells.push(new Myr.Vector(x, y));
        }
        else
            _extendable =
                !pcb.getPoint(cursor.x, cursor.y) && (
                pcb.getPoint(cursor.x + 1, cursor.y) ||
                pcb.getPoint(cursor.x, cursor.y + 1) ||
                pcb.getPoint(cursor.x - 1, cursor.y) ||
                pcb.getPoint(cursor.x, cursor.y - 1));
    };

    /**
     * Start dragging action.
     * @returns {Boolean} A boolean indicating whether a drag event has started.
     */
    this.startDrag = () => {
        if (_extendable) {
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
    this.stopDrag = () => {
        if (_dragging) {
            extend();

            _extendable = false;
            _dragging = false;
        }
    };

    /**
     * Cancel any actions deviating from this editors base state.
     */
    this.cancelAction = () => {
        _dragging = false;

        this.moveCursor();
    };

    /**
     * Update this editor.
     * @param {Number} timeStep The time passed since the last update in seconds.
     */
    this.update = timeStep => {

    };

    /**
     * Draw this editor.
     */
    this.draw = () => {
        if (_dragging) {
            for (const cell of _cursorDragCells)
                SPRITE_HOVER_EXTEND.draw(cell.x * Pcb.PIXELS_PER_POINT, cell.y * Pcb.PIXELS_PER_POINT);
        }
        else if (_extendable)
                SPRITE_HOVER_EXTEND.draw(cursor.x * Pcb.PIXELS_PER_POINT, cursor.y * Pcb.PIXELS_PER_POINT);
    };
}