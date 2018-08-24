import {Pcb} from "../../pcb/pcb";
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

    const _pathRenderer = new PcbPathRenderer(sprites, true);

    let _startPoint = null;
    let _dragging = false;
    let _etchable = false;

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
        _dragging = false;
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
        if (_dragging)
            SPRITE_ETCH.draw(cursor.x * Pcb.PIXELS_PER_POINT, (cursor.y - 1) * Pcb.PIXELS_PER_POINT );
        else if (_etchable)
            SPRITE_ETCH_HOVER.draw(cursor.x * Pcb.PIXELS_PER_POINT, (cursor.y - 1) * Pcb.PIXELS_PER_POINT );
    };
}