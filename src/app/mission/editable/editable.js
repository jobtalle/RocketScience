import {Pcb} from "../../pcb/pcb";
import Myr from "../../../lib/myr.js";

/**
 * A definition of an editable PCB (and its part budget).
 * @param {EditableRegion} region The editable region of this editable.
 * @param {Pcb} pcb The default pcb for this editable.
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
     * Push the current state to the undo stack, so that it can be undone later.
     */
    this.undoPush = () => {
        _undoStack.push(new State(pcb.copy(), pcbOffset.copy()));

        if (_undoStack.length === Editable.UNDO_COUNT)
            _undoStack.shift();

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
}

Editable.UNDO_COUNT = 64;