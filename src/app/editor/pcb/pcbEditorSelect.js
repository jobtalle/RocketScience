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
 * @constructor
 */
export function PcbEditorSelect(sprites, pcb, cursor, editor) {
    const _selectedFixtures = [];
    const _cursorDragPoints = [];
    const _cursorDrag = new Myr.Vector(0, 0);
    const _selection = new Selection(sprites);
    let _selectable = false;
    let _selected = false;
    let _dragging = false;

    const move = () => {
        const moveFixtures = [];

        for (const fixture of _selectedFixtures)
            moveFixtures.push(new PcbEditorPlace.Fixture(
                fixture.part.copy(),
                fixture.x - cursor.x,
                fixture.y - cursor.y));

        deleteSelectedParts();

        editor.replace(new PcbEditorPlace(sprites, pcb, cursor, editor, moveFixtures, _selection));
    };

    const copy = () => {
        const placeFixtures = [];

        for (const fixture of _selectedFixtures)
            placeFixtures.push(new PcbEditorPlace.Fixture(
                fixture.part.copy(),
                fixture.x - _selection.getLeft(),
                fixture.y - _selection.getTop()));

        editor.replace(new PcbEditorPlace(sprites, pcb, cursor, editor, placeFixtures, _selection));
    };

    const isPartSelected = part => {
        return _selectedFixtures.indexOf(part) !== -1;
    };

    const findSelectedParts = () => {
        _selectedFixtures.splice(0, _selectedFixtures.length);

        for (const point of _cursorDragPoints) {
            const pcbPoint = pcb.getPoint(point.x, point.y);

            if (pcbPoint !== null && pcbPoint.part !== null && !isPartSelected(pcbPoint.part))
                _selectedFixtures.push(pcb.getFixture(pcbPoint.part));
        }
    };

    const deleteSelectedParts = () => {
        editor.undoPush();

        for (const fixture of _selectedFixtures)
            pcb.remove(fixture.part);

        _selected = false;

        editor.revalidate();
    };

    const crop = () => {
        let left = pcb.getWidth() - 1;
        let top = pcb.getHeight() - 1;
        let right = 0;
        let bottom = 0;

        for (const fixture of _selectedFixtures) {
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
        if (_dragging) {
            _selection.setRegion(
                Math.min(cursor.x, _cursorDrag.x),
                Math.max(cursor.x, _cursorDrag.x),
                Math.min(cursor.y, _cursorDrag.y),
                Math.max(cursor.y, _cursorDrag.y));

            _cursorDragPoints.splice(0, _cursorDragPoints.length);

            for (let y = _selection.getTop(); y <= _selection.getBottom(); ++y)
                for (let x = _selection.getLeft(); x <= _selection.getRight(); ++x)
                    _cursorDragPoints.push(new Myr.Vector(x, y));
        }
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

            if (_selectedFixtures.length === 0) {
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