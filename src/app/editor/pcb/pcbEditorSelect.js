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
 * @param {Selection} selection An initial selection, or null if no initial selection is required.
 * @constructor
 */
export function PcbEditorSelect(sprites, pcb, cursor, editor, selection) {
    const _cursorDrag = new Myr.Vector(0, 0);
    const _selection = selection || new Selection(sprites);
    let _selectable = false;
    let _selected = selection !== null;
    let _dragging = false;

    const move = () => {
        const moveFixtures = [];

        for (const fixture of _selection.getSelected())
            moveFixtures.push(new PcbEditorPlace.Fixture(
                fixture.part.copy(),
                fixture.x - cursor.x,
                fixture.y - cursor.y));

        deleteSelectedParts();

        _selection.clearSelected();

        editor.replace(new PcbEditorPlace(sprites, pcb, cursor, editor, moveFixtures, _selection));
    };

    const copy = () => {
        const placeFixtures = [];

        for (const fixture of _selection.getSelected())
            placeFixtures.push(new PcbEditorPlace.Fixture(
                fixture.part.copy(),
                fixture.x - _selection.getLeft(),
                fixture.y - _selection.getTop()));

        if (placeFixtures.length === 1)
            editor.replace(new PcbEditorPlace(sprites, pcb, cursor, editor, placeFixtures, null));
        else {
            _selection.move(cursor.x - _selection.getLeft(), cursor.y - _selection.getTop());
            _selection.clearSelected();

            editor.replace(new PcbEditorPlace(sprites, pcb, cursor, editor, placeFixtures, _selection));
        }
    };

    const findSelectedParts = () => {
        _selection.clearSelected();

        for (let y = _selection.getTop(); y <= _selection.getBottom(); ++y) {
            for (let x = _selection.getLeft(); x <= _selection.getRight(); ++x) {
                const pcbPoint = pcb.getPoint(x, y);

                if (pcbPoint !== null && pcbPoint.part !== null && !_selection.isSelected(pcbPoint.part))
                    _selection.addSelected(pcb.getFixture(pcbPoint.part));
            }
        }
    };

    const deleteSelectedParts = () => {
        editor.undoPush();

        for (const fixture of _selection.getSelected())
            pcb.remove(fixture.part);

        _selected = false;

        editor.revalidate();
    };

    const crop = () => {
        let left = pcb.getWidth() - 1;
        let top = pcb.getHeight() - 1;
        let right = 0;
        let bottom = 0;

        for (const fixture of _selection.getSelected()) {
            for (const point of fixture.part.getConfiguration().footprint.points) {
                if (point.x + fixture.x < left)
                    left = point.x + fixture.x;

                if (point.x + fixture.x > right)
                    right = point.x + fixture.x;

                if (point.y + fixture.y < top)
                    top = point.y + fixture.y;

                if (point.y + fixture.y > bottom)
                    bottom = point.y + fixture.y;
            }
        }

        _selection.setRegion(left, right, top, bottom);
    };

    /**
     * A key is pressed.
     * @param {String} key A key.
     * @param {Boolean} control Indicates whether the control button is pressed.
     */
    this.onKeyDown = (key, control) => {
        switch (key) {
            case PcbEditorSelect.KEY_DELETE:
                if (_selected)
                    deleteSelectedParts();

                break;
            case PcbEditorSelect.KEY_COPY:
                if (_selected)
                    copy();

                break;
        }
    };

    /**
     * Tell the editor the cursor has moved.
     */
    this.moveCursor = () => {
        if (_dragging)
            _selection.setRegion(
                Math.min(cursor.x, _cursorDrag.x),
                Math.max(cursor.x, _cursorDrag.x),
                Math.min(cursor.y, _cursorDrag.y),
                Math.max(cursor.y, _cursorDrag.y));
        else {
            _selectable = pcb.getPoint(cursor.x, cursor.y) !== null;

            if (!_selected)
                _selection.setRegion(cursor.x, cursor.x, cursor.y, cursor.y);
        }
    };

    /**
     * Start dragging action.
     * @returns {Boolean} A boolean indicating whether a drag event has started.
     */
    this.mouseDown = () => {
        if (_selected && _selection.contains(cursor.x, cursor.y)) {
            move();

            return true;
        }
        else if (_selectable) {
            _selected = false;
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

            if (_selection.getSelected().length === 0) {
                _selected = false;

                this.moveCursor();
            }
            else {
                _selected = true;

                crop();
            }
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
     * @param {Myr} myr A myriad instance.
     */
    this.draw = myr => {
        if (_selectable || _selected)
            _selection.draw();
    };
}

PcbEditorSelect.KEY_DELETE = "Delete";
PcbEditorSelect.KEY_COPY = "c";