/**
 * An undo stack storing the successive states of an Editable.
 * @param {Editable} editable An editable to keep state of.
 * @constructor
 */
export function UndoStack(editable) {
    const _undoStack = [];
    const _redoStack = [];
}

UndoStack.State = function(pcb) {
    this.pcb = pcb;
};