/**
 * An undo stack storing the successive states of an Editable.
 * @param {Editable} editable An editable to keep state of.
 * @constructor
 */
export function UndoStack(editable) {
    const _undoStack = [];
    const _redoStack = [];

    const applyState = (state, editor) => {
        editor.moveOffset(state.offset.x - editable.getOffset().x, state.offset.y - editable.getOffset().y);
        editable.setPcb(state.pcb);
    };

    /**
     * Push the state onto the undo stack.
     */
    this.push = () => {
        _undoStack.push(new UndoStack.State(editable));

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
     * @param {PcbEditor} editor The pcb editor.
     * @returns {Boolean} A boolean indicating whether the operation succeeded.
     */
    this.undo = editor => {
        const state = _undoStack.pop();

        if (state) {
            _redoStack.push(new UndoStack.State(editable));

            applyState(state, editor);

            return true;
        }

        return false;
    };

    /**
     * Redo the last undo.
     * @param {PcbEditor} editor The pcb editor.
     * @returns {Boolean} A boolean indicating whether the operation succeeded.
     */
    this.redo = editor => {
        const state = _redoStack.pop();

        if (state) {
            _undoStack.push(new UndoStack.State(editable));

            applyState(state, editor);

            return true;
        }

        return false;
    };
}

UndoStack.CAPACITY = 100;

UndoStack.State = function(editable) {
    this.pcb = editable.getPcb().copy();
    this.offset = editable.getOffset().copy();
};