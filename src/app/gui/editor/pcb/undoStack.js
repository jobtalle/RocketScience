/**
 * An undo stack storing the successive states of an Editable.
 * @param {Editable} editable An editable to keep state of.
 * @constructor
 */
export function UndoStack(editable) {
    const _undoStack = [];
    const _redoStack = [];

    const applyState = state => {
        editable.setPcb(state.pcb);
    };

    /**
     * Push the state onto the undo stack.
     */
    this.push = () => {
        _undoStack.push(new UndoStack.State(editable.getPcb().copy()));

        if (_undoStack.length > UndoStack.CAPACITY)
            _undoStack.shift();

        _redoStack.splice(0, _redoStack.length);
    };

    /**
     * Remove the last pushed state from the stack.
     */
    this.pushCancel = () => {
        _undoStack.pop();
        _redoStack.splice(0, _redoStack.length);
    };

    /**
     * Go back to the last pushed state.
     * @returns {Boolean} A boolean indicating whether the operation succeeded.
     */
    this.undo = () => {
        const state = _undoStack.pop();

        if (state) {
            _redoStack.push(new UndoStack.State(editable.getPcb().copy()));

            applyState(state);

            return true;
        }

        return false;
    };

    /**
     * Redo the last undo.
     * @returns {Boolean} A boolean indicating whether the operation succeeded.
     */
    this.redo = () => {
        const state = _redoStack.pop();

        if (state) {
            _undoStack.push(new UndoStack.State(editable.getPcb().copy()));

            applyState(state);

            return true;
        }

        return false;
    };
}

UndoStack.CAPACITY = 100;

UndoStack.State = function(pcb) {
    this.pcb = pcb;
};