import {Pcb} from "../../pcb/pcb";
import Myr from "../../../lib/myr.js";

/**
 * A definition of an editable PCB (and its part budget).
 * @param {EditableRegion} region The editable region of this editable.
 * @param {Pcb} pcb The default pcb for this editable.
 * @param {Myr.Vector} pcbOffset The PCB's offset within its region.
 * @param {Budget} budget A part budget, or null if there is no budget.
 * @constructor
 */
export function Editable(region, pcb, pcbOffset, budget) {
    const State = function(pcb, offset) {
        this.getPcb = () => pcb;
        this.getOffset = () => offset;
    };

    const _undoStack = [];
    const _redoStack = [];
    const _position = new Myr.Vector(0, 0);

    const calculatePosition = () => {
        _position.x = region.getOrigin().x + pcbOffset.x;
        _position.y = region.getOrigin().y + pcbOffset.y;
    };

    /**
     * Get the region this editable is in.
     * @returns {EditableRegion}
     */
    this.getRegion = () => region;

    /**
     * Get the PCB of this editable.
     * @returns {Pcb} A pcb.
     */
    this.getPcb = () => pcb;

    /**
     * Update the pcb of this editable.
     * @param {Pcb} newPcb A new root pcb.
     */
    this.setPcb = newPcb => pcb = newPcb;

    /**
     * Get the part budget of this editable.
     * @returns {Budget} A part budget.
     */
    this.getBudget = () => budget;

    /**
     * Get the offset of the pcb in the editable region.
     * @returns {Myr.Vector} The offset in meters.
     */
    this.getOffset = () => pcbOffset;

    /**
     * Move the PCB offset in the editable region.
     * @param {Number} dx The horizontal movement in meters.
     * @param {Number} dy The vertical movement in meters.
     */
    this.moveOffset = (dx, dy) => {
        pcbOffset.x += dx;
        pcbOffset.y += dy;

        calculatePosition();
    };

    /**
     * Get the PCB position in the world.
     * @returns {Myr.Vector} The PCB position in the world in meters.
     */
    this.getPosition = () => _position;

    /**
     * Push the current state to the undo stack, so that it can be undone later.
     */
    this.undoPush = () => {
        _undoStack.push(new State(pcb.copy(), pcbOffset.copy()));

        if (_undoStack.length === Editable.UNDO_COUNT)
            _undoStack.shift();

        _redoStack.splice(0, _redoStack.length);
    };

    /**
     * Cancel pushing the last undo state.
     * Use this when an undo state was pushed, but nothing was changed in the new state.
     */
    this.undoPushCancel = () => {
        _undoStack.pop();
        _redoStack.splice(0, _redoStack.length);
    };

    /**
     * Undo an action if the undo stack is not empty.
     * @returns {Boolean} A boolean indicating whether the operation succeeded.
     */
    this.undoPop = () => {
        const state = _undoStack.pop();

        if (state) {
            _redoStack.push(new State(pcb.copy(), pcbOffset.copy()));

            pcb = state.getPcb();
            pcbOffset = state.getOffset();

            return true;
        }

        return false;
    };

    /**
     * Redo an action if the redo stack is not empty.
     * @returns {Boolean} A boolean indicating whether the operation succeeded.
     */
    this.redoPop = () => {
        const state = _redoStack.pop();

        if (state) {
            _undoStack.push(new State(pcb.copy(), pcbOffset.copy()));

            pcb = state.getPcb();
            pcbOffset = state.getOffset();

            return true;
        }

        return false;
    };

    calculatePosition();
}

Editable.UNDO_COUNT = 64;