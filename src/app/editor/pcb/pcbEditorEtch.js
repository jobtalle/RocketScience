import {Pcb} from "../../pcb/pcb";
import {PcbPathRenderer} from "../../pcb/pcbPathRenderer";
import {PcbPoint} from "../../pcb/pcbPoint";
import * as Myr from "../../../lib/myr";

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

    const _pathRenderer = new PcbPathRenderer(sprites, true);
    const _path = [];
    const _points = [];

    let _startPoint = null;
    let _dragging = false;
    let _etchable = false;

    const makePoints = () => {
        _points.splice(0, _points.length, new PcbPoint());

        for (let i = 1; i < _path.length; ++i) {
            _points.push(new PcbPoint());

            const direction = PcbPoint.deltaToDirection(_path[i].x - _path[i - 1].x, _path[i].y - _path[i - 1].y);

            _points[i - 1].etchDirection(direction);
            _points[i].etchDirection((direction + 4) % 8);
        }
    };

    const makePath = () => {
        const at = _startPoint.copy();

        _path.push(at.copy());

        while (!at.equals(cursor)) {
            at.x += Math.sign(cursor.x - at.x);
            at.y += Math.sign(cursor.y - at.y);

            if (!pcb.getPoint(at.x, at.y)) {
                clearPath();

                break;
            }

            _path.push(at.copy());
        }

        if (_path.length > 1)
            makePoints();
    };

    const etch = () => {
        if (_path.length < 2) {
            clearPath();

            return;
        }

        editor.undoPush();

        let previous;
        let current = _path.pop();

        while (previous = current, current = _path.pop(), current) {
            const direction = PcbPoint.deltaToDirection(current.x - previous.x, current.y - previous.y);

            pcb.getPoint(current.x, current.y).etchDirection((direction + 4) % 8);
            pcb.getPoint(previous.x, previous.y).etchDirection(direction);
        }

        editor.revalidate();
    };

    const clearPath = () => {
        _path.splice(0, _path.length);
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
            clearPath();

            if (point)
                makePath();
        }
        else
            _etchable = point !== null;
    };

    /**
     * Start dragging action.
     * @returns {Boolean} A boolean indicating whether a drag event has started.
     */
    this.mouseDown = () => {
        if (_etchable) {
            _dragging = true;
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
            for (let i = 0; i < _path.length; ++i)
                _pathRenderer.render(_points[i], _path[i].x * Pcb.PIXELS_PER_POINT, _path[i].y * Pcb.PIXELS_PER_POINT);

            SPRITE_ETCH.draw(_startPoint.x * Pcb.PIXELS_PER_POINT, (_startPoint.y - 1) * Pcb.PIXELS_PER_POINT);
        } else if (_etchable)
            SPRITE_ETCH_HOVER.draw(cursor.x * Pcb.PIXELS_PER_POINT, (cursor.y - 1) * Pcb.PIXELS_PER_POINT );
    };
}