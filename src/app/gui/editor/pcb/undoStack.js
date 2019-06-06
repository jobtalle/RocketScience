/**
 * An undo stack storing the successive states of an Editable.
 * @param {Editable} editable An editable to keep state of.
 * @constructor
 */
export function UndoStack(editable) {
    const _undoStack = [];
    const _redoStack = [];
    let _edited = false;

    const applyState = (state, editor) => {
        editable.setPcb(state.pcb);
        editor.moveOffset(state.offset.x - editable.getOffset().x, state.offset.y - editable.getOffset().y);
        editor.moveRegion(
            state.region.getOrigin().x - editable.getRegion().getOrigin().x,
            state.region.getOrigin().y - editable.getRegion().getOrigin().y);
        editor.resizeRegion(
            state.region.getSize().x - editable.getRegion().getSize().x,
            state.region.getSize().y - editable.getRegion().getSize().y);
    };

    /**
     * Push the state onto the undo stack.
     */
    this.push = () => {
        _edited = true;
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

    /**
     * Check if the UndoStack has been edited in some way.
     * @return {Boolean} A boolean indicating whether the stack has been edited.
     */
    this.isEdited = () => _edited;
}

UndoStack.CAPACITY = 100;

UndoStack.State = function(editable) {
    this.pcb = editable.getPcb().copy();
    this.offset = editable.getOffset().copy();
    this.region = editable.getRegion().copy();
};