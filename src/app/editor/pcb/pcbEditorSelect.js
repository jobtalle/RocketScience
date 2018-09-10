import {Pcb} from "../../pcb/pcb";
import * as Myr from "../../../lib/myr";
import {PcbEditorPlace} from "./pcbEditorPlace";
import {Selection} from "./selection";

/**
 * An extend editor, able to extend the current PCB.
 * @param {Sprites} sprites A sprites instance.
 * @param {Pcb} pcb The PCB currently being edited.
 * @param {Myr.Vector} cursor The cursor position in cells.
 * @param {Object} editor An interface provided by the Editor to influence the editor.
 * @param {Selection} selection A selection.
 * @constructor
 */
export function PcbEditorSelect(sprites, pcb, cursor, editor, selection) {
    const _cursorDrag = new Myr.Vector(0, 0);
    let _selectable = false;
    let _dragging = false;
    let _moveStart = null;

    const move = start => {
        const moveFixtures = [];

        for (const fixture of selection.getSelected())
            moveFixtures.push(new PcbEditorPlace.Fixture(
                fixture.part.copy(),
                fixture.x - start.x,
                fixture.y - start.y));

        deleteSelectedParts();

        selection.move(cursor.x - start.x, cursor.y - start.y);

        editor.replace(new PcbEditorPlace(sprites, pcb, cursor, editor, moveFixtures, selection));
    };

    const copy = () => {
        const placeFixtures = [];

        for (const fixture of selection.getSelected())
            placeFixtures.push(new PcbEditorPlace.Fixture(
                fixture.part.copy(),
                fixture.x - selection.getLeft(),
                fixture.y - selection.getTop()));

        selection.move(cursor.x - selection.getLeft(), cursor.y - selection.getTop());
        selection.clearSelected();

        editor.replace(new PcbEditorPlace(sprites, pcb, cursor, editor, placeFixtures, selection));
    };

    const isPartSelected = part => {
        for (const fixture of selection.getSelected())
            if (fixture.part === part)
                return true;

        return false;
    };

    const findSelectedParts = () => {
        selection.clearSelected();

        for (let y = selection.getTop(); y <= selection.getBottom(); ++y) {
            for (let x = selection.getLeft(); x <= selection.getRight(); ++x) {
                const pcbPoint = pcb.getPoint(x, y);

                if (pcbPoint !== null && pcbPoint.part !== null && !isPartSelected(pcbPoint.part))
                    selection.addSelected(pcb.getFixture(pcbPoint.part));
            }
        }
    };

    const deleteSelectedParts = () => {
        editor.undoPush();

        for (const fixture of selection.getSelected())
            pcb.remove(fixture.part);

        editor.revalidate();
    };

    const updateSelectedInfo = () => {
        if (selection.getSelected().length === 1)
            editor.select(selection.getSelected()[0].part.getConfiguration());
        else
            editor.select(null);
    };

    const selectAll = () => {
        selection.clearSelected();

        for (const fixture of pcb.getFixtures())
            selection.addSelected(fixture);

        PcbEditorSelect.crop(selection);
        updateSelectedInfo();
    };

    /**
     * Select a fixture.
     * @param {Array} fixtures An array of fixtures to select.
     */
    this.select = fixtures => {
        selection.clearSelected();

        for (const fixture of fixtures)
            selection.addSelected(fixture);

        PcbEditorSelect.crop(selection);
        updateSelectedInfo();
    };

    /**
     * Change the PCB being edited.
     * @param {Pcb} newPcb The new PCB to edit.
     */
    this.updatePcb = newPcb => {
        selection.clearSelected();

        pcb = newPcb;
    };

    /**
     * A key is pressed.
     * @param {String} key A key.
     * @param {Boolean} control Indicates whether the control button is pressed.
     */
    this.onKeyDown = (key, control) => {
        switch (key) {
            case PcbEditorSelect.KEY_DELETE:
                if (selection.getSelected().length > 0) {
                    deleteSelectedParts();

                    selection.clearSelected();
                    updateSelectedInfo();

                    this.moveCursor();
                }

                break;
            case PcbEditorSelect.KEY_COPY:
                if (selection.getSelected().length > 0)
                    copy();

                break;
            case PcbEditorSelect.KEY_SELECT_ALL:
                if (control)
                    selectAll();

                break;
        }
    };

    /**
     * Tell the editor the cursor has moved.
     */
    this.moveCursor = () => {
        if (_dragging)
            selection.setRegion(
                Math.min(cursor.x, _cursorDrag.x),
                Math.max(cursor.x, _cursorDrag.x),
                Math.min(cursor.y, _cursorDrag.y),
                Math.max(cursor.y, _cursorDrag.y));
        else {
            if (_moveStart !== null) {
                move(_moveStart);

                _moveStart = null;
            }
            else {
                _selectable = pcb.getPoint(cursor.x, cursor.y) !== null;

                if (selection.getSelected().length === 0)
                    selection.setRegion(cursor.x, cursor.x, cursor.y, cursor.y);
            }
        }
    };

    /**
     * Start dragging action.
     * @returns {Boolean} A boolean indicating whether a drag event has started.
     */
    this.mouseDown = () => {
        if (selection.getSelected().length > 0 && selection.contains(cursor.x, cursor.y)) {
            _moveStart = cursor.copy();

            return true;
        }
        else if (_selectable) {
            selection.clearSelected();

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
            findSelectedParts();

            _dragging = false;

            if (selection.getSelected().length === 0)
                this.moveCursor();
            else
                PcbEditorSelect.crop(selection);

            updateSelectedInfo();
        }
        else if (_moveStart && _moveStart.equals(cursor)) {
            _moveStart = null;

            selection.setRegion(cursor.x, cursor.x, cursor.y, cursor.y);

            findSelectedParts();

            if (selection.getSelected().length > 0)
                PcbEditorSelect.crop(selection);

            updateSelectedInfo();
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
        selection.clearSelected();

        this.cancelAction();
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
        if (_selectable || selection.getSelected().length > 0)
            selection.draw();
    };
}

PcbEditorSelect.crop = selection => {
    let left = undefined;
    let top = undefined;
    let right = undefined;
    let bottom = undefined;

    for (const fixture of selection.getSelected()) {
        for (const point of fixture.part.getConfiguration().footprint.points) {
            if (left === undefined || point.x + fixture.x < left)
                left = point.x + fixture.x;

            if (right === undefined || point.x + fixture.x > right)
                right = point.x + fixture.x;

            if (top === undefined || point.y + fixture.y < top)
                top = point.y + fixture.y;

            if (bottom === undefined || point.y + fixture.y > bottom)
                bottom = point.y + fixture.y;
        }
    }

    selection.setRegion(left, right, top, bottom);
};

PcbEditorSelect.KEY_DELETE = "Delete";
PcbEditorSelect.KEY_COPY = "c";
PcbEditorSelect.KEY_SELECT_ALL = "a";